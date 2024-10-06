import { Inject, Injectable } from '@nestjs/common';
import { OfferCreateDto, OfferOptionDto } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DealersCarsService } from 'src/dealers_cars/dealers_cars.service';
import { Logger } from 'winston';
import { LotsService } from 'src/lots/lots.service';
import { OffersProvider } from './providers/offers.provider';

@Injectable()
export class OffersTemplatesService {
    private readonly logger: Logger;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        private offersProvider: OffersProvider,
        private lotsService: LotsService,

        private dealersCarsService: DealersCarsService,
    ) {
        this.logger = winstonLogger.child({ service: OffersTemplatesService.name });
    }

    private convertOfferOptions(lotOptions: any[], carOptions: any[]) {
        let offerOptions: any[] = [];
        // Обработка опций из lotOptions
        lotOptions.forEach(lotOption => {
            const carOptionIndex = carOptions.findIndex(carOption => carOption.combined_option_id === lotOption.combined_option_id);
            if (carOptionIndex !== -1) {
                // Опция найдена в carOptions
                if (!lotOption.strict) {
                    // Если strict: false, добавляем в offerOptions с accordance_type: 'satisfied'
                    offerOptions.push({ ...lotOption, accordance_type: 'satisfied' });
                }
                // Удаляем опцию из carOptions, если она там была найдена
                carOptions.splice(carOptionIndex, 1);
            } else if (!lotOption.strict) {
                // Опция не найдена в carOptions и strict: false
                offerOptions.push({ ...lotOption, accordance_type: 'unsatisfied' });
            }
        });
        // Добавление оставшихся опций из carOptions в offerOptions с accordance_type: 'additional'
        offerOptions = offerOptions.concat(carOptions.map(carOption => ({
            ...carOption,
            accordance_type: 'additional'
        })));
        offerOptions.sort((a, b) => {
            const order = { 'unsatisfied': 1, 'satisfied': 2, 'additional': 3 };
            return order[a.accordance_type] - order[b.accordance_type];
        })
        return offerOptions.map(option => new OfferOptionDto(option))
    }

    private toCreateDto(offer: any): OfferCreateDto {

        return {
            lot_id: offer.lot_id,
            dealers_car: offer.dealers_car,
            dealers_car_id: offer.dealers_car_id,
            options: offer.options,
            price: offer.price,
            priceValidTill: offer.priceValidTill,
            waiting: offer.waiting,
            isCreditAvailable: offer.isCreditAvailable,
            isInsuranceAvailable: offer.isInsuranceAvailable,
            isTradeinAvailable: offer.isTradeinAvailable,
            city_id: offer.city_id,
        };
    }

    async getOffersTemplates(session: GetSessionInfoDto, filter: { lotId?: string; }): Promise<OfferCreateDto[]> {
        const fittableCars = await this.dealersCarsService.getAllCars(session, filter.lotId);
        const offersExisting = await this.offersProvider.getOwnOffersForSeller(session.id, { lotId: filter.lotId})
        const filteredFittableCars = fittableCars.filter(car =>
            !offersExisting.some(offer => offer.dealers_car_id === car.id)
        );
        const lotOptions = await this.lotsService.getLotOptionsByLotId(session, filter.lotId);
        const offersTemplates = filteredFittableCars.map(car => this.toCreateDto({
            lot_id: filter.lotId,
            dealers_car_id: car.id,
            dealers_car: car,
            options: this.convertOfferOptions(lotOptions, car.options),
            price: 0,
            waiting: 0,
            isCreditAvailable: false,
            isInsuranceAvailable: false,
            isTradeinAvailable: false
        }))
        return offersTemplates
    }
}
