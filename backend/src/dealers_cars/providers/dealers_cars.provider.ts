import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DealersCars } from "../entities/dealers_cars.entity";
import { Repository } from "typeorm";

@Injectable()
export class DealersCarsProvider {
    constructor(
        @InjectRepository(DealersCars)
        private dealersCarsRepository: Repository<DealersCars>,
    ) { }

    async getMaxSequence(userId: string) {
        const maxSequence = await this.dealersCarsRepository.maximum("sequence", { dealer: { id: userId } }) || 0
        return maxSequence;
    }

    // async create(userId: string, props: { sequence: number, brand_id?: string, model_id?: string, generation_id?: string, configuration_id?: string, engine_hash?: string, complectation_id?: string }) {
    async create(userId: string, props: any) {
        props.createdBy = userId


        const newCar = this.dealersCarsRepository.create({
            brand: { id: props.brand_id },
            model: { id: props.model_id },
            generation: { id: props.generation_id },
            configuration: { id: props.configuration_id },
            engine_hash: props.engine_hash,
            complectation: { complectationId: props.complectation_id },
            dealer: { id: userId },
            createdBy: userId,
            isVerified: false,
            isFilled: props.isFilled,
            sequence: props.sequence + 1,
            year: props.year,
            mileage: props.mileage,
            isMileageAbroad: props.isMileageAbroad,
            vin: props.vin,
            city: { id: props.city_id }
        });
        const savedCar = await this.dealersCarsRepository.save(newCar);
        return savedCar;
    }

    async getOwnById(userId: string, car_id: string) {
        const car = this.dealersCarsRepository.findOne({
            where: {
                dealer: { id: userId },
                id: car_id
            }
        })
        return car;
    }

    async getCarById(userId: string, car_id: string) {
        const car = await this.dealersCarsRepository.findOne({
            where: {
                id: car_id,
                deleted: false,
            },
            relations: {
                options: { option: true },
                city: true,
                brand: { logo: true },
                model: true,
                generation: { model: true },
                configuration: { photo: true },
                complectation: { specifications: true },
                dealer: true,
                photos: true
                // offers: true
            }
        })
        return car;
    }

    async save(car: DealersCars) {
        // const carData = {
        //     dealer: { id: car.user_id },
        //     isVerified: false,
        //     isFilled: car.isFilled,
        //     year: car.year,
        //     mileage: car.mileage,
        //     isMileageAbroad: car.isMileageAbroad,
        //     vin: car.vin,
        //     brand: { id: car.brand_id },
        //     model: { id: car.model_id },
        //     generation: { id: car.generation_id },
        //     configuration: { id: car.configuration_id },
        //     complectation: { complectationId: car.complectation_id },
        //     engine_hash: car.engine_hash,
        //     city: { id: car.city_id }
        // }
        const savedCar = await this.dealersCarsRepository.save(car);
        return savedCar;
    }

    async isCarOwnedByUser(userId: string, carId: string) {
        const car = await this.dealersCarsRepository.findOne({
            where: {
                id: carId,
                dealer: { id: userId },
                deleted: false,
            }
        })
        return car ? true : false
    }

    async delete(userId: string, carId: string) {
        return await this.dealersCarsRepository.update({
            id: carId
        }, {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: userId
        })
    }
}