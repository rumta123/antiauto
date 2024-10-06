import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository, EntityManager, Not, IsNull } from 'typeorm';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { performance } from 'perf_hooks';
import { createHash } from "crypto";

import { Cities } from './entities/cities.entity';



@Injectable()
export class CitiesUpdateService {
    private readonly logger: Logger;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        private entityManager: EntityManager,

        @InjectRepository(Cities)
        private citiesRepository: Repository<Cities>,


    ) {
        this.logger = winstonLogger.child({ service: CitiesUpdateService.name });
    }

    async down() {
        var startTime = performance.now()
        try {

            await this.entityManager.query('TRUNCATE TABLE cities CASCADE');


            var endTime = performance.now()
            this.logger.info(`down: All tables have been cleared in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
        } catch (error) {
            this.logger.error(`Error clearing tables: ${error.message}`);
            throw error; // Переброс ошибки дальше, если нужно обработать ее на более высоком уровне
        }
    }

    async up() {
        this.logger.info('up:Run cities update')
        var startTime = performance.now()

        const data = await this.loadJSON()
        this.logger.info('up: JSON loaded and parsed')

        await this.processCities(data);


        var endTime = performance.now()
        this.logger.info(`up: finish in ${((endTime - startTime) / 1000).toFixed(2)} seconds`)
    }

    async processCities(data) {
        try {
            const cityPromises = data.map(cityData => {
                this.citiesRepository.findOne({ where: { name: cityData.name } }).then(city => {
                    if (!city) {
                        return this.saveCity(cityData);
                    }
                    return city;
                })
            });
            var startTime = performance.now()
            const cities = await Promise.all(cityPromises);
            var endTime = performance.now()
            this.logger.info(`Processed ${cities.length} cities in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

        } catch (error) {
            this.logger.error(`Error processing cities: ${error.message}`);
        }
    }


    async loadJSON() {
        const data = JSON.parse(fs.readFileSync(path.join('/app/cities-data/russian-cities.json'), 'utf-8'));

        return data;
    }

    async saveCity(cityData) {
        let city = this.citiesRepository.create({
            name: cityData.name,
            subject: cityData.subject,
            district: cityData.district,
            population: cityData.population,
            coords_lat: cityData.coords.lat,
            coords_lon: cityData.coords.lon,
            createdBy: process.env.DATABASE_USER
        });

        await this.citiesRepository.save(city);
        this.logger.debug(`saveCity: new City ${cityData.name} saved`)
        return city;
    }

 
}
