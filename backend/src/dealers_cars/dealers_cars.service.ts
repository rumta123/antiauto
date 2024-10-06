import { ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DealersCars } from './entities/dealers_cars.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealersCarOptionsAttrMap } from './entities/dealers_cars_options_attr_map.entity';
import { PatchDealersCarDto, DealersCarDto, DealersCarPublicDto, DealersCarOptionDto, DealersCarIdDto } from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';
import { LotsProvider } from 'src/lots/providers/lots.provider';
import { DealersCarsProvider } from './providers/dealers_cars.provider';
import { CarCatalogHelperProvider } from 'src/car-catalog/providers/helper.provider';
import { CarCatalogOptionsProvider } from 'src/car-catalog/providers/options.provider';
import { DealersCarsOptionsProvider } from './providers/dealers_cars_options.provider';
import { OffersProvider } from 'src/offers/providers/offers.provider';

@Injectable()
export class DealersCarsService {

    private readonly logger: Logger;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        private lotsProvider: LotsProvider,
        private offersProvider:  OffersProvider,

        private dealersCarsProvider: DealersCarsProvider,
        private dealersCarsOptionsProvider: DealersCarsOptionsProvider,
        private carCatalogHelperProvider: CarCatalogHelperProvider,
        private carCatalogOptionsProvider: CarCatalogOptionsProvider,

        @InjectRepository(DealersCars)
        private dealersCarsRepository: Repository<DealersCars>,

        @InjectRepository(DealersCarOptionsAttrMap)
        private dealersCarsOptionsRepository: Repository<DealersCarOptionsAttrMap>
    ) {
        this.logger = winstonLogger.child({ service: DealersCarsService.name });
    }

    private toPatchDto(car: DealersCars): PatchDealersCarDto {

        return {
            id: car.id,
            year: car.year,
            mileage: car.mileage,
            isMileageAbroad: car.isMileageAbroad,
            vin: car.vin,
            city_id: car.city?.id,
            city_name: car.city?.name,
            brand_id: car.brand?.id,
            model_id: car.model?.id,
            generation_id: car.generation?.id,
            configuration_id: car.configuration?.id,
            complectation_id: car.complectation?.complectationId,
            engine_hash: car.engine_hash || car.complectation?.engine_hash,
            options: car.options,
            photos: car.photos
        };
    }

    async create(userSession: GetSessionInfoDto, body: PatchDealersCarDto, engine_hash?: string, complectation_id?: string) {
        //TODO: add check is account type dealer
        const maxSequence = await this.dealersCarsProvider.getMaxSequence(userSession.id);
        // if (engine_hash && complectation_id) {
        //     const { brand, model, generation, configuration } = await this.carCatalogHelperProvider.getBrandModelGenConfInfoByEngineHash(engine_hash);
        //     const savedCar = await this.dealersCarsProvider.create(userSession.id, {
        //         brand_id: brand.id,
        //         model_id: model.id,
        //         generation_id: generation.id,
        //         configuration_id: configuration.id,
        //         engine_hash: engine_hash,
        //         complectation_id: complectation_id,
        //         sequence: maxSequence + 1
        //     })
        //     return this.toPatchDto({ ...savedCar, engine_hash: engine_hash })
        // } else {
        //     const savedCar = await this.dealersCarsProvider.create(userSession.id, {
        //         sequence: maxSequence + 1
        //     })
        //     return this.toPatchDto(savedCar)
        // }
        let car:any ={}
        // Object.assign(car, body)

        car.isFilled = (
            !!body.brand_id
            && !!body.city_id
            && !!body.complectation_id
            && !!body.configuration_id
            && !!body.generation_id
            && body.mileage !== undefined
            && !!body.model_id
            && !!body.vin
            && !!body.year
        )
        car.isVerified = false;
        // car.isVerified = true;
        // car.isVerified = Boolean(Math.round(Math.random())); //TODO: должно быть false
        car.sequence = maxSequence;

        const createdCar = await this.dealersCarsProvider.create(userSession.id, {
            ...body,...car
        });

        if (body.options && body.options.length) {
            const optionsPromises = body.options.map(async (option) => {
                const newOption = this.dealersCarsOptionsRepository.create({
                    dealers_car: createdCar,
                    complectation: { complectationId: body.complectation_id },
                    option: {
                        id: option.combined_option_id
                    },
                    option_name: option.option_name,
                    value: option.value,
                    value_type: option.value_type,
                    is_complectation_option: option.is_complectation_option,
                    createdBy: userSession.id
                });
                return await this.dealersCarsOptionsRepository.save(newOption);
            });
            await Promise.all(optionsPromises);
        }
        return this.toPatchDto(createdCar);

    }

    async patchDealersCar(userSession: GetSessionInfoDto, body: PatchDealersCarDto) {
        //TODO: add check is account type dealer

        const car = await this.dealersCarsProvider.getOwnById(userSession.id, body.id);

        if (!car) {
            this.logger.warn(`patchDealersCar: Car with id: ${body.id} not found`)
            throw new Error('Автомобиль не найден');
        }

        car.updatedBy = userSession.id;

        Object.assign(car, body)

        car.isFilled = (
            !!car.brand_id
            && !!car.city_id
            && !!car.complectation_id
            && !!car.configuration_id
            && !!car.generation_id
            && car.mileage !== undefined
            && !!car.model_id
            && !!car.vin
            && !!car.year
        )
        // car.isVerified = false;
        car.isVerified = Boolean(Math.round(Math.random()+0.3)); //TODO: должно быть false
        const updatedCar = await this.dealersCarsProvider.save(car);

        if (body.options && body.options.length) {
            const optionsPromises = body.options.map(async (option) => {
                const newOption = this.dealersCarsOptionsRepository.create({
                    dealers_car: updatedCar,
                    complectation: { complectationId: body.complectation_id },
                    option: {
                        id: option.combined_option_id
                    },
                    option_name: option.option_name,
                    value: option.value,
                    value_type: option.value_type,
                    is_complectation_option: option.is_complectation_option,
                    createdBy: userSession.id
                });
                return await this.dealersCarsOptionsRepository.save(newOption);
            });
            await Promise.all(optionsPromises);
        }
        return this.toPatchDto(updatedCar);
    }

    async delete(userSession: GetSessionInfoDto, carId: string) {
        const isCarOwnedByUser = await this.dealersCarsProvider.isCarOwnedByUser(userSession.id, carId)
        if (!isCarOwnedByUser) {
            throw new ForbiddenException()
        }
        const involvedLots = await this.lotsProvider.getInvolvedLotsByCarId(carId)
        if (involvedLots.length > 0) {
            throw new ConflictException({
                message: 'Автомобиль участвует в аукционах',
                context: involvedLots
            })
        }
        await this.dealersCarsOptionsProvider.delete(userSession.id, carId)
        const deletedCar = await this.dealersCarsProvider.delete(userSession.id, carId)
        return new DealersCarIdDto(deletedCar)
    }

    async getAllCars(userSession: GetSessionInfoDto, lot_id?: string, filter?: any): Promise<DealersCarDto[]> {
        const qb = this.dealersCarsRepository.createQueryBuilder('dealersCar');
        qb.leftJoinAndSelect('dealersCar.options', 'option')
            .leftJoinAndSelect('dealersCar.city', 'city')
            .leftJoinAndSelect('dealersCar.brand', 'brand')
            .leftJoinAndSelect('brand.logo', 'brandLogo')
            .leftJoinAndSelect('dealersCar.model', 'model')
            .leftJoinAndSelect('dealersCar.generation', 'generation')
            .leftJoinAndSelect('generation.model', 'generationModel')
            .leftJoinAndSelect('dealersCar.configuration', 'configuration')
            .leftJoinAndSelect('configuration.photo', 'configurationPhoto')
            .leftJoinAndSelect('dealersCar.complectation', 'complectation')
            .leftJoinAndSelect('complectation.specifications', 'specifications')
            .leftJoinAndSelect('dealersCar.dealer', 'dealer');

        qb.where('dealer.id = :dealerId', { dealerId: userSession.id })
            .andWhere('dealersCar.deleted = :deleted', { deleted: false });
        if (filter?.only_filled) {
            qb.andWhere('dealersCar.is_filled = true')
        }

        if (lot_id?.length) {
            const lot = await this.lotsProvider.getLotInfoById(userSession, lot_id)
            if (!lot) {
                throw new Error('Аукцион не найден')
            }
            qb.andWhere('complectation.engine_hash = :engineHash', { engineHash: lot.engine_hash });

            if (lot.options && lot.options.length > 0 && lot.options.filter(lotOption => lotOption.strict === true).length > 0) {
                lot.options
                    .filter(lotOption => lotOption.strict === true)
                    .map((lotOption) => {
                        return qb.andWhere((subQb) => {
                            const subQuery = subQb.subQuery()
                                .select('carOption.dealer_car_id')
                                .from('dealers_cars_options_attr_map', 'carOption')
                                .where('carOption.dealer_car_id = dealersCar.id')
                                .andWhere(`carOption.combined_option_id = '${lotOption.combined_option_id}'`)
                                .getQuery();
                            return 'dealersCar.id IN ' + subQuery;
                        });
                    });
            }
        }
        qb.orderBy('dealersCar.createdAt', 'DESC');

        const cars = await qb.getMany();
        const carsWithLots = await Promise.all(cars.map(async car => {
            const lots = await this.lotsProvider.getInvolvedLotsByCarId(car.id)
            return {
                ...car,
                lots: lots
            }
        }))
        return carsWithLots.map(car => new DealersCarDto(car))
    }

    async getCarById(userSession: GetSessionInfoDto, carId: string) {
        const car = await this.dealersCarsProvider.getCarById(userSession.id, carId)
        if (car?.dealer.id === userSession.id) { // TODO: добавить проверку на аккаунты поддержки
            const lots = await this.lotsProvider.getInvolvedLotsByCarId(car.id)
            const carWithLots = {
                ...car,
                lots
            }
            return new DealersCarDto(carWithLots, userSession.id)
        } else {
            return new DealersCarPublicDto(car)
        }
    }
    async getDealersCarMappedOptionsByCarId(userSession: GetSessionInfoDto, carId: string) {
        // get options
        const carOptions = await this.dealersCarsOptionsProvider.getByCarId(carId)
        const CarOptionsDto = carOptions.map(option => new DealersCarOptionDto(option))
        const dict = await this.carCatalogOptionsProvider.getOptionsDict();
        const mappedOptions = this.dealersCarsOptionsProvider.mapOptionsAttrMapByCategory(dict, CarOptionsDto)
        return mappedOptions
    }

    async getPatchInfoByCarId(userSession: GetSessionInfoDto, carId: string) {
        const car = await this.dealersCarsProvider.getCarById(userSession.id, carId)
        if (!car) {
            throw new Error("Автомобиль не найден")
        }
        return this.toPatchDto(car)
    }

    async isCarVerified(userId: string, carId: string) {
        const car = await this.dealersCarsRepository.findOne({
            where: {
                id: carId,
                dealer: { id: userId },
                deleted: false,
                isVerified: true
            }
        })
        return car ? true : false
    }
}
