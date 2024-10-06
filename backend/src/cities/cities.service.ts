import { Injectable } from '@nestjs/common';
import { CityDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cities } from './entities/cities.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CitiesService {

    constructor(
        @InjectRepository(Cities)
        private citiesRepository: Repository<Cities>,
    ) { }

    async getCities(name: string | undefined): Promise<CityDto[]> {
        const queryBuilder = this.citiesRepository.createQueryBuilder('city');
        if (name) {
            queryBuilder.where("LOWER(city.name) LIKE LOWER(:name)", { name: `%${name}%` });

            queryBuilder.addOrderBy(`(CASE 
                                         WHEN LOWER(city.name) LIKE LOWER(:nameStart) THEN 1
                                         ELSE 2
                                     END)`, 'ASC', 'NULLS LAST')
                .setParameter("nameStart", `${name}%`);
        }
        queryBuilder.andWhere("city.deleted = :deleted", { deleted: false })
            .addOrderBy('city.name', 'ASC')
            .take(10);
        const cities = await queryBuilder.getMany();

        return cities.map(city => new CityDto(city))
    }
}
