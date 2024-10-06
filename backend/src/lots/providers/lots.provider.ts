import { Injectable } from "@nestjs/common";
import { Lots } from "../entities/lots.entity";
import { FindManyOptions, FindOptionsOrderValue, FindOptionsWhereProperty, In, MoreThan, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GetSessionInfoDto } from "src/auth/dto";
import { DealersCars } from "src/dealers_cars/entities/dealers_cars.entity";
import { LotsOptionsAttrMap } from "../entities/lots_options_attrmap.entity";

@Injectable()
export class LotsProvider {
    constructor(
        @InjectRepository(Lots)
        private lotsRepository: Repository<Lots>,

        @InjectRepository(LotsOptionsAttrMap)
        private lotsOptionsRepository: Repository<LotsOptionsAttrMap>,
    ) {
    }

    async getAllFilteredLots({ statuses, filter }: { statuses?: any[], filter: any }) {
        const qb = this.lotsRepository.createQueryBuilder('lot')
            .leftJoinAndSelect('lot.options', 'option')
            .leftJoinAndSelect('lot.city', 'city')
            .leftJoinAndSelect('lot.mark', 'mark')
            .leftJoinAndSelect('mark.logo', 'logo')
            .leftJoinAndSelect('lot.model', 'model')
            .leftJoinAndSelect('lot.generation', 'generation')
            .leftJoinAndSelect('generation.model', 'generationModel')
            .leftJoinAndSelect('lot.configuration', 'configuration')
            .leftJoinAndSelect('configuration.photo', 'photo')
            .leftJoinAndSelect('lot.owner', 'owner')
            .leftJoinAndSelect('lot.offers', 'offers')
            .leftJoinAndSelect('lot.statuses', 'statuses')
            .leftJoinAndSelect('statuses.status', 'status')
            .where('lot.deleted = false');
    
        if (filter.mark_id) {
            qb.andWhere('mark.id = :markId', { markId: filter.mark_id });
        }
        if (filter.model_id) {
            qb.andWhere('model.id = :modelId', { modelId: filter.model_id });
        }
        if (filter.gen_id) {
            qb.andWhere('generation.id = :genId', { genId: filter.gen_id });
        }
        if (filter.conf_id) {
            qb.andWhere('configuration.id = :confId', { confId: filter.conf_id });
        }
        if (filter.city_id) {
            qb.andWhere('city.id = :cityId', { cityId: filter.city_id });
        }
        if (filter.minPrice) {
            qb.andWhere(`(SELECT MIN(subOffer.price) FROM offers subOffer WHERE subOffer.lot_id = lot.id) >= :minPrice`, { minPrice: filter.minPrice });
        }
        if (filter.status && filter.status === "finished") {
            qb.andWhere('status.isLast = true');
        }
        if (filter.dealer_car_id) {
            const fittableIds = await this._getIdsOfFittableLotsByCarId(filter.dealer_car)
            if (fittableIds.length > 0) {
                qb.andWhere('lot.id IN (:...ids)', { ids: fittableIds.map(res => res.id) });
            } else {
                qb.andWhere('1=0');
            }
        }
        if (statuses && statuses.length > 0) {
            qb.andWhere('status.id IN (:...statuses)', { statuses });
        }
    
        qb.orderBy('lot.createdAt', 'DESC');
    
        const lots = await qb.getMany();
        return lots;
    }

    async getInvolvedLotsByCarId(carId: string) {
        const lots = await this.lotsRepository.find({
            where: {
                deleted: false,
                offers: {
                    dealers_car: {
                        id: carId
                    }
                }
            },
            relations: {
                options: { option: true },
                city: true,
                mark: { logo: true },
                model: true,
                generation: { model: true },
                configuration: { photo: true },
                owner: true,
                offers: {
                    dealers_car: true
                }
            },
            order: {
                createdAt: 'DESC'
            }
        })
        return lots;
    }

    private async _getIdsOfFittableLotsByCarId(car: DealersCars) { 
        const mainQuery = this.lotsRepository.createQueryBuilder('lots')
            .select('lots.id')
            .from(subQuery => {
                return subQuery
                    .select('sublots.id', 'lots_id')
                    .addSelect(subQuery => {
                        return subQuery
                            .select('COUNT(*)')
                            .from(this.lotsOptionsRepository.metadata.name, 'loa')
                            .where('loa.lot_id = sublots.id')
                            .andWhere('loa.strict = true');
                    }, 'plan_cor')
                    .addSelect(subQuery => {
                        return subQuery
                            .select('COUNT(*)')
                            .from('dealers_cars_options_attr_map', 'dcoa')
                            .innerJoin(this.lotsOptionsRepository.metadata.name, 'loa', 'loa.combined_option_id = dcoa.combined_option_id')
                            .where('dcoa.dealer_car_id = :dealerCarId', { dealerCarId: car.id })
                            .andWhere('loa.strict = true')
                            .andWhere('sublots.id = loa.lot_id');
                    }, 'fact_cor')
                    .from(this.lotsRepository.metadata.name, 'sublots')
                    .where('sublots.engine_hash = :engineHash', { engineHash: car.engine_hash })
                    .andWhere(subQuery => {
                        const subQueryStr = subQuery.subQuery()
                            .select('offers.lot_id')
                            .from('offers', 'offers')
                            .where('offers.dealers_car_id = :dealerCarId', { dealerCarId: car.id })
                            .getQuery();
                        return 'sublots.id NOT IN ' + subQueryStr;
                    })
            }, 'main')
            .where('main.plan_cor = main.fact_cor')
            .andWhere('lots.id = main.lots_id');
        const result = await mainQuery.getRawMany();
        return result
    }
    async getFittableLotsByCarId(car: DealersCars) {

        const fittableIds = await this._getIdsOfFittableLotsByCarId(car)
        const lots = await this.lotsRepository.find({
            where: {
                id: In(fittableIds.map(res => res.id))
            },
            relations: {
                options: { option: true },
                city: true,
                mark: { logo: true },
                model: true,
                generation: { model: true },
                configuration: { photo: true },
                owner: true,
                offers: {
                    dealers_car: true
                }
            },
            order: {
                createdAt: 'DESC'
            }
        })
        return lots;
    }

    async getLotsByUserOffers(userId: string) {
        const lots = await this.lotsRepository.find({
            where: {
                deleted: false,
                offers: {
                    dealers_car: {
                        dealer: {
                            id: userId
                        }
                    }
                }
            },
            relations: {
                options: { option: true },
                city: true,
                mark: { logo: true },
                model: true,
                generation: { model: true },
                configuration: { photo: true },
                owner: true,
                offers: {
                    dealers_car: {
                        dealer: true
                    }
                }
            },
            order: {
                createdAt: 'DESC'
            }
        })
        //TODO: реализовать выборку offers где пользователь владелец записи, по ним выбрать lots
        return lots
    }

    async getLotsWhereUserIsOwner(userId: string) {
        const lots = await this.lotsRepository.find({
            where: {
                owner: { id: userId },
                deleted: false,
                // options: { deleted: false }
            },
            relations: {
                options: { option: true },
                city: true,
                mark: { logo: true },
                model: true,
                generation: { model: true },
                configuration: { photo: true },
                owner: true,
                offers: true
            },
            order: {
                createdAt: 'DESC'
            }
        })
        return lots
    }

    async getLotInfoById(userSession: GetSessionInfoDto, lotId: string) {
        const lotQueryBuilder = this.lotsRepository.createQueryBuilder('lot')
            .leftJoinAndSelect('lot.options', 'option', 'option.deleted = :optionDeleted', { optionDeleted: false })
            .leftJoinAndSelect('lot.city', 'city')
            .leftJoinAndSelect('lot.mark', 'mark')
            .leftJoinAndSelect('mark.logo', 'logo')
            .leftJoinAndSelect('lot.model', 'model')
            .leftJoinAndSelect('lot.generation', 'generation')
            .leftJoinAndSelect('generation.model', 'generationModel')
            .leftJoinAndSelect('lot.configuration', 'configuration')
            .leftJoinAndSelect('configuration.photo', 'photo')
            .leftJoinAndSelect('lot.owner', 'owner')
            // .leftJoinAndSelect('lot.offers', 'offers')
            .where('lot.id = :lotId', { lotId })
            .andWhere('lot.deleted = :deleted', { deleted: false })
            .orderBy('lot.createdAt', 'DESC');

        if (userSession.type === 'customer') {
            lotQueryBuilder.andWhere('owner.id = :userId', { userId: userSession.id });
        } else if (userSession.type === 'seller') {

            //TODO: добавить where по статусу не завершён
        }

        const lot = await lotQueryBuilder.getOne();
        return lot
    }

    
}