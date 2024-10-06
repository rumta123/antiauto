import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cities } from "../entities/cities.entity";
import { Repository } from "typeorm";

@Injectable()
export class CitiesProvider {
    constructor(
        @InjectRepository(Cities)
        private citiesRepository: Repository<Cities>,
    ) { }

    async getById(cityId: string) {
        const city = await this.citiesRepository.findOne({
            where: {
                id: cityId
            }
        })
        return city
    }
}