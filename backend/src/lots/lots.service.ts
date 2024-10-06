import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { LotCreateDto, LotDto, LotIdDto, LotOptionDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsOrderValue, FindOptionsWhereProperty, In, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Lots } from './entities/lots.entity';
import { LotsOptionsAttrMap } from './entities/lots_options_attrmap.entity';

import { CarCatalogService } from 'src/car-catalog/car-catalog.service';
import { GetSessionInfoDto } from 'src/auth/dto';
import { UsersService } from 'src/users/users.service';

import { OffersProvider } from 'src/offers/providers/offers.provider';
import { OffersOptionsProvider } from 'src/offers/providers/offers_options.provider';
import { LotsProvider } from './providers/lots.provider';
import { CarCatalogOptionsProvider } from 'src/car-catalog/providers/options.provider';
import { OptionsDictCategory } from 'src/car-catalog/entities/options_dict.entity';
import { DealersCarsProvider } from 'src/dealers_cars/providers/dealers_cars.provider';
import { LotsStatusesProvider } from './providers/lots_statuses.provider';

@Injectable()
export class LotsService {

    private readonly logger: Logger;

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        private usersService: UsersService,

        @InjectRepository(Lots)
        private lotsRepository: Repository<Lots>,

        @InjectRepository(LotsOptionsAttrMap)
        private lotsOptionsRepository: Repository<LotsOptionsAttrMap>,

        private lotsProvider: LotsProvider,
        private lotsStatusesProvider: LotsStatusesProvider,

        private carCatalogService: CarCatalogService,

        private сarCatalogOptionsProvider: CarCatalogOptionsProvider,

        private offersProvider: OffersProvider,
        private offersOptionsProvider: OffersOptionsProvider,

        private dealersCarsProvider: DealersCarsProvider,

    ) {
        this.logger = winstonLogger.child({ service: LotsService.name });
    }

    async create(userId, body) {
        const newLot = this.lotsRepository.create({
            city: { id: body.city_id },
            max_distance: body.max_distance,
            mark: { id: body.mark_id },
            model: { id: body.model_id },
            generation: { id: body.generation_id },
            configuration: { id: body.configuration_id },
            engine_hash: body.engine_hash,
            owner: { id: userId },
            createdBy: userId,
        });
        const savedLot = await this.lotsRepository.save(newLot);
        const newLotStatus = await this.lotsStatusesProvider.create(userId, savedLot.id, 'published');
        if (body.options) {
            const optionsPromises = body.options.map(async (option) => {
                const newOption = this.lotsOptionsRepository.create({
                    lot: savedLot,
                    complectation: { engine_hash: body.engine_hash },
                    option: {
                        id: option.optionId
                    },
                    option_name: option.optionName,
                    value: option.value,
                    value_type: option.value_type,
                    strict: option.strict,
                    createdBy: userId
                });
                return await this.lotsOptionsRepository.save(newOption);
            });
            await Promise.all(optionsPromises);
        }
        return new LotIdDto({ ...savedLot, status: newLotStatus });
    }

    async getAllLots(userSession: GetSessionInfoDto, involved?: boolean, filter?: any) {
        const account_type = userSession.type;
        let lots: any[] = [];
        switch (account_type) {
            case "root":
            case "support":
                //TODO: all lots
                if (filter.dealer_car_id) {
                    let car = await this.dealersCarsProvider.getCarById(userSession.id, filter.dealer_car_id);
                    if (!car) {
                        throw new Error("Автомобиль не найден")
                    }
                    filter.dealer_car = car
                }
                lots = await this.lotsProvider.getAllFilteredLots({ filter })
                lots.map(async lot => {
                    const offers = await this.offersProvider.getAllFilteredOffers(filter)
                    lot.offers.map(async offer => {
                        offer.options = await this.offersOptionsProvider.getOptionsByOfferIdSortByAccordance(offer.id)
                        return offer
                    })
                    return {
                        ...lot,
                        offers: offers,
                    }
                })
                break;
            case "seller":
                if (!involved) {
                    if (filter.dealer_car_id) {
                        let car = await this.dealersCarsProvider.getCarById(userSession.id, filter.dealer_car_id);
                        if (!car) {
                            throw new Error("Автомобиль не найден")
                        }
                        filter.dealer_car = car
                    }
                    lots = await this.lotsProvider.getAllFilteredLots({ statuses: [], filter })
                } else {
                    lots = await this.lotsProvider.getLotsByUserOffers(userSession.id)
                }
                lots = await Promise.all(lots.map(async lot => {
                    const offers = await Promise.all(lot.offers.map(async offer => {
                        const options = await this.offersOptionsProvider.getOptionsByOfferIdSortByAccordance(offer.id);
                        const dealers_car = await this.dealersCarsProvider.getCarById(userSession.id, offer.dealers_car_id);
                        return { ...offer, options, dealers_car };
                    }));
                    const own_offers = offers.filter(offer => offer.dealers_car.user_id === userSession.id)
                    return { ...lot, offers, own_offers };
                }));
                break;
            case "customer":
            default:
                lots = await this.lotsProvider.getLotsWhereUserIsOwner(userSession.id)
                lots.map(async lot => {
                    const offers = await this.offersProvider.getOffersForCustomer(userSession.id, filter)
                    lot.offers.map(async offer => {
                        offer.options = await this.offersOptionsProvider.getOptionsByOfferIdSortByAccordance(offer.id)
                        return offer
                    })
                    return {
                        ...lot,
                        offers: offers,
                    }
                })
                break;
        }
        lots = lots.map(async lot => {
            const complectation = await this.carCatalogService.getComplectationText(lot.engine_hash)
            const status = await this.lotsStatusesProvider.getActualStatus(lot.id)
            return { ...lot, status, complectation: complectation }
        })
        lots = await Promise.all(lots)
        return lots.map(lot => { return new LotDto(lot, lot.complectation) })
    }


    async getLotById(userSession: GetSessionInfoDto, lotId: string) {
        const lot = await this.lotsProvider.getLotInfoById(userSession, lotId)
        if (!lot) {
            throw new Error('Аукцион не найден')
        }
        const complectation = await this.carCatalogService.getComplectationText(lot.engine_hash)
        const status = await this.lotsStatusesProvider.getActualStatus(lotId)

        const lotData = {
            ...lot,
            status,
            is_own: lot.user_id === userSession.id
        }
        return new LotDto(lotData, complectation)
    }

    async getLotByCarId(userSession: GetSessionInfoDto, carId: string, part?: 'all' | 'involved' | 'fittable') {

        let lots;
        if (part === 'involved') {
            lots = await this.lotsProvider.getInvolvedLotsByCarId(carId)
        } else if (part === 'fittable') {
            let car = await this.dealersCarsProvider.getCarById(userSession.id, carId);
            if (!car) {
                throw new Error("Автомобиль не найден")
            }
            lots = await this.lotsProvider.getFittableLotsByCarId(car)
        } else {
            let car = await this.dealersCarsProvider.getCarById(userSession.id, carId);
            if (!car) {
                throw new Error("Автомобиль не найден")
            }
            lots = [
                ...await this.lotsProvider.getInvolvedLotsByCarId(carId),
                ...await this.lotsProvider.getFittableLotsByCarId(car)
            ]
        }
        const lotsWithCompls = await Promise.all(lots.map(async lot => {
            const complectation = await this.carCatalogService.getComplectationText(lot.engine_hash);
            const offers = await this.offersProvider.getAllFilteredOffers({ filter: { lotId: lot.id } })
            const status = await this.lotsStatusesProvider.getActualStatus(lot.id)
            return { ...lot, complectation: complectation, offers, status }
        }))

        return lotsWithCompls.map(lot => { return new LotDto(lot, lot.complectation) })
    }

    async getLotOptionsByLotId(userSession: GetSessionInfoDto, lotId?: string) {
        const options = await this.lotsOptionsRepository.find({
            where: {
                lot: { id: lotId },
            }
        })
        return options.map(option => new LotOptionDto(option))
    }

    async getLotOptionsDictByLotId(userSession: GetSessionInfoDto, lotId?: string, strict?: boolean) {
        const options = await this.lotsOptionsRepository.find({
            where: {
                lot: { id: lotId },
                strict: strict
            }
        })
        const optionsDictCategories = await this.сarCatalogOptionsProvider.getOptionsDict()

        const mappedOptions = this.mapOptionsByCategory(optionsDictCategories, options);
        return mappedOptions
    }

    private mapOptionsByCategory(optionsDictCategories: OptionsDictCategory[], optionsValues: LotsOptionsAttrMap[]): any {
        const detailedOptions = {};
        for (const category of optionsDictCategories) {
            const optionsForCategory = {};
            for (const option of category.options) {
                const optionValueItem = optionsValues.find(ov => option.value === ov.option_name)
                if (optionValueItem) {
                    optionsForCategory[option.value] = true
                }
            }
            if (Object.keys(optionsForCategory).length > 0) {
                detailedOptions[category.name] = optionsForCategory;
            }
        }
        return detailedOptions;
    }

}
