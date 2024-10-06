import { BadRequestException, ForbiddenException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { OfferCreateDto, OfferDto, OfferIdDto, OfferOptionDto, OffersStatusDto } from './dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Offers } from './entities/offers.entity';
import { Repository } from 'typeorm';
import { DealersCarsService } from 'src/dealers_cars/dealers_cars.service';
import { GetSessionInfoDto } from 'src/auth/dto';
import { OffersProvider } from './providers/offers.provider';
import { OffersOptionsProvider } from './providers/offers_options.provider';
import { DealersCarsProvider } from 'src/dealers_cars/providers/dealers_cars.provider';
import { OffersStatusesProvider } from './providers/offers_statuses.provider';
import { LotsProvider } from 'src/lots/providers/lots.provider';
import { LotsStatusesProvider } from 'src/lots/providers/lots_statuses.provider';
import { OffersStatusesMap } from './entities/offers_statuses_map.entity';
import { getDistance } from 'geolib';
import { CitiesProvider } from 'src/cities/providers/cities.provider';
import { ProcessesProvider } from 'src/processes/providers/processes.provider';
import { ProcessesTypesProvider } from 'src/processes/providers/processes_types.provider';

@Injectable()
export class OffersService {


    private readonly logger: Logger;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        private dealersCarsService: DealersCarsService,
        private dealersCarsProvider: DealersCarsProvider,

        private offersProvider: OffersProvider,
        private offersOptionsProvider: OffersOptionsProvider,
        private offersStatusesProvider: OffersStatusesProvider,

        private lotsProvider: LotsProvider,
        private lotsStatusesProvider: LotsStatusesProvider,

        private citiesProvider: CitiesProvider,

        private processesProvider: ProcessesProvider,
        private processesTypesProvider: ProcessesTypesProvider,

        @InjectRepository(Offers)
        private offersRepository: Repository<Offers>,

    ) {
        this.logger = winstonLogger.child({ service: OffersService.name });
    }

    async create(userSession: GetSessionInfoDto, body: OfferCreateDto) {
        const ownCar = await this.dealersCarsProvider.getOwnById(userSession.id, body.dealers_car_id)
        if (!ownCar) {
            throw new ForbiddenException()
        }
        const existingOffers = await this.offersRepository.find({
            where: {
                lot_id: body.lot_id,
                dealers_car_id: body.dealers_car_id,
                deleted: false
            }
        });
        if (existingOffers.length) {
            throw new BadRequestException({ severity: 'error', message: 'Автомобиль уже участвует в данном аукционе' });
        }

        const lot = await this.lotsProvider.getLotInfoById(userSession, body.lot_id);
        if (!lot) {
            throw new BadRequestException("Лот не найден")
        }
        const carCity = await this.citiesProvider.getById(ownCar.city_id);
        const lotCity = await this.citiesProvider.getById(lot.city_id);

        if (!carCity || !lotCity) {
            throw new BadRequestException("Город не найден")
        }

        const distance = getDistance(
            {latitude:lotCity?.coords_lat, longitude: lotCity?.coords_lon},
            {latitude:carCity?.coords_lat, longitude: carCity?.coords_lon}
        )

        const savedOffer = await this.offersProvider.create(userSession.id, { ...body,distance })
        if (body.options) {
            const optionsPromises = body.options.map(async (option) => {
                this.offersOptionsProvider.create(userSession.id, savedOffer, option)
            });
            await Promise.all(optionsPromises);
        }

        const isCarVerified = await this.dealersCarsService.isCarVerified(userSession.id, body.dealers_car_id)
        if (!isCarVerified) {
            // create moderation chat
            const processTypeOfferModeration = await this.processesTypesProvider.get("offer_moderation");
            await this.processesProvider.create(userSession, {
                processType: processTypeOfferModeration,
                lotId: savedOffer.lot_id,
                offerId: savedOffer.id,
                dealersCarId: savedOffer.dealers_car_id
            })
            const moderationStatus = await this.offersStatusesProvider.create(userSession.id, savedOffer.id, 'moderation')
            console.log('moderationStatus', moderationStatus)
            return {
                ...new OfferDto({
                    ...savedOffer,
                    status: moderationStatus
                }),
                message: 'Автомобиль должен пройти модерацию перед публикацией предложения. Вам будет направлено уведомление о статусе прохождения модерации' // Сообщение
            };
        }

        const publishedStatus = await this.offersStatusesProvider.create(userSession.id, savedOffer.id, 'published')
        return new OfferDto({
            ...savedOffer,
            status:publishedStatus
        })
    }

    async getOffers(userSession: GetSessionInfoDto, filter: { lotId: string | undefined; }): Promise<OfferDto[]> {
        const account_type = userSession.type;

        let offers: any[] = [];
        switch (account_type) {
            case "root":
            case "support":
                offers = await this.offersProvider.getAllFilteredOffers({ filter })
                break;
            case "seller":
                offers = await this.offersProvider.getOffersForSeller(userSession.id, filter)
                break;
            case "customer":
            default:
                offers = await this.offersProvider.getOffersForCustomer(userSession.id, filter)
                break;
        }

        const offersWithCarInfoAndOptions = await Promise.all(offers.map(async offer => {
            return {
                ...offer,
                dealers_car: await this.dealersCarsService.getCarById(userSession, offer.dealers_car_id),
                status: await this.offersStatusesProvider.getActualStatus(offer.id),
                options: await this.offersOptionsProvider.getOptionsByOfferIdSortByAccordance(offer.id)
            }
        }))
        return offersWithCarInfoAndOptions.map(offer => new OfferDto(offer))
    }
    async getOfferById(session: GetSessionInfoDto, offerId: string): Promise<OfferDto> {
        const offer = await this.offersProvider.getOfferById(session.id, offerId);
        if (!offer) {
            throw new BadRequestException("Предложение не найдено")
        }
        if (offer.dealers_car.dealer.id !== session.id) {
            if (session.type !== 'root' && session.type !== 'service_desk') {throw new ForbiddenException();}
        }
        return new OfferDto(offer)
    }

    async deleteOfferById(session: GetSessionInfoDto, offerId: string) {
        const ownOffer = await this.offersProvider.getOwnOfferById(session.id, offerId);
        if (!ownOffer) {
            throw new BadRequestException('Предложение не найдено');
        }

        const isDeletable = await this.offersStatusesProvider.isDeletable(session.id, offerId);
        if (!isDeletable) {
            throw new BadRequestException("Удаление невозможно")
        }

        // delete opts
        const deletedOptions = await this.offersOptionsProvider.delete(session.id, offerId);
        console.log('deletedOptions', deletedOptions)
        // delete statuses

        const deletedOffer = await this.offersProvider.delete(session.id, offerId);
        console.log('deletedOffer', deletedOffer)

        await this.lotsStatusesProvider.create(session.id, ownOffer.lot_id, "published")


        return new OfferIdDto(deletedOffer);
    }

    async deleteOffersByCarId(session: GetSessionInfoDto, carId: string) {
        const offersByCar = await this.offersProvider.getOffersByCarId(session.id, carId);
        if (!offersByCar) {
            throw new Error("Предложения не найдены")
        }
        const deleted = offersByCar.map(async offer => {
            const isDeletable = await this.offersStatusesProvider.isDeletable(session.id, offer.id);
            if (!isDeletable) {
                throw new Error("Удаление невозможно")
            }

            const deletedOptions = await this.offersOptionsProvider.delete(session.id, offer.id);
            console.log('deletedOptions', deletedOptions)
            // delete statuses

            const deletedOffer = await this.offersProvider.delete(session.id, offer.id);
            console.log('deletedOffer', deletedOffer)
            return deletedOffer
        })
        return deleted;
    }

    private statusSequence = ["draft", "moderation", "published", "selected_by_buyer", "selected_by_seller", "contacts_sended", "finished"];
    private getNextStatus(currentStatus, direction, userType) {
        const currentIndex = this.statusSequence.indexOf(currentStatus);

        if (userType === 'root' || userType === 'service_desk') {
            // Для root и service_desk возвращаем следующий/предыдущий статус без ограничений
            return direction === 'next' ? this.statusSequence[currentIndex + 1] : this.statusSequence[currentIndex - 1];
        }

        if (userType === 'seller') {
            // Для seller разрешаем движение только вперед до 'selected_by_seller' и назад до 'draft'
            if (direction === 'next') {
                const allowedStatusesForSeller = ["draft", "selected_by_buyer", "selected_by_seller"];
                return allowedStatusesForSeller.includes(currentStatus) ? this.statusSequence[currentIndex + 1] : null;
            } else {
                // Движение назад
                const allowedStatusesForSeller = ["published", "selected_by_seller", "moderation"];
                return allowedStatusesForSeller.includes(currentStatus)  ? this.statusSequence[currentIndex - 1] : null;
            }
        }

        if (userType === 'customer') {
            // Для buyer разрешаем движение только вперед до 'selected_by_buyer' и назад до 'published'
            if (direction === 'next' && currentStatus === 'published') {
                return 'selected_by_buyer';
            } else if (direction === 'prev' && currentStatus === 'selected_by_buyer') {
                return 'published';
            }
        }

        // Во всех остальных случаях возвращаем null
        return null;
    }

    async setOfferStatus(userSession: GetSessionInfoDto, offerId: string, direction: 'prev' | 'next') {
        const offer = await this.offersProvider.getOfferById(userSession.id, offerId)
        if (!offer) {
            throw new Error("Предложение не найдено")
        }

        const lot = await this.lotsProvider.getLotInfoById(userSession, offer.lot_id)
        if (!lot) {
            throw new Error("Лот не найден")
        }
        const actualStatus = await this.offersStatusesProvider.getActualStatus(offerId)

        const nextStatus = this.getNextStatus(actualStatus?.status.name, direction, userSession.type);

        if (!nextStatus
            || (userSession.type === 'buyer' && lot.user_id !== userSession.id)
            || (userSession.type === 'seller' && offer.dealers_car.user_id !== userSession.id)
        ) {
            throw new ForbiddenException();
        }

        const status = await this.offersStatusesProvider.create(userSession.id, offerId, nextStatus)
        
        await this.lotsStatusesProvider.create(userSession.id, lot.id, nextStatus)

        return new OfferDto({
            ...offer,
            status: status
        })
    }

    async getMostImportantStatusByCarId(session: GetSessionInfoDto, carId: string) {
        const offers = await this.offersProvider.getOffersByCarId(session.id, carId)
        if (!offers.length) {
            return null
        }
        const statuses = await Promise.all(offers.map(async offer => {
            const status = await this.offersStatusesProvider.getActualStatus(offer.id);
            return status
        }));
        const finished = statuses.find(status => status?.status.name === 'finished');
        if (!!finished) {
            return new OffersStatusDto(finished);
        }
        let mostImportantStatus: OffersStatusesMap | null | undefined = null;
        for (let priorityStatus of this.statusSequence) {
            mostImportantStatus = statuses.find(status => status?.status.name === priorityStatus);
            if (mostImportantStatus) break;
        }
    
        return new OffersStatusDto(mostImportantStatus);
    }
}
