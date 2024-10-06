import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, EntityManager, Not, IsNull } from 'typeorm';
import axios from 'axios';
import { promises as fs } from 'fs';
import * as path from 'path';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { performance } from 'perf_hooks';
import { createHash } from "crypto";

import { Mark } from './entities/mark.entity';
import { Model } from './entities/model.entity';
import { MarkLogo } from './entities/marklogo.entity';
import { Generation } from './entities/generation.entity';
import { Configuration } from './entities/configuration.entity';
import { ConfigurationsPhoto } from './entities/configurations_photo.entity';

import { Modification } from './entities/modification.entity';

import { Options } from './entities/options.entity';
import { Specifications } from './entities/specifications.entity';
import { OptionsCombined } from './entities/options_combined.entity';
import { ComplectationsOptionsAttrMap } from './entities/complectations_options_attrmap.entity';


@Injectable()
export class CarCatalogUpdateService {
    private readonly logger: Logger;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        private entityManager: EntityManager,

        @InjectRepository(Mark)
        private markRepository: Repository<Mark>,

        @InjectRepository(MarkLogo)
        private markLogoRepository: Repository<MarkLogo>,

        @InjectRepository(Model)
        private modelRepository: Repository<Model>,

        @InjectRepository(Generation)
        private generationRepository: Repository<Generation>,

        @InjectRepository(Configuration)
        private configurationRepository: Repository<Configuration>,

        @InjectRepository(ConfigurationsPhoto)
        private configurationsPhotoRepository: Repository<ConfigurationsPhoto>,

        @InjectRepository(Modification)
        private modificationRepository: Repository<Modification>,

        @InjectRepository(Options)
        private optionsRepository: Repository<Options>,

        @InjectRepository(Specifications)
        private specificationsRepository: Repository<Specifications>,

        @InjectRepository(OptionsCombined)
        private optionsCombinedRepository: Repository<OptionsCombined>,

        @InjectRepository(ComplectationsOptionsAttrMap)
        private complectationsOptionsAttrMapRepository: Repository<ComplectationsOptionsAttrMap>

    ) {
        this.logger = winstonLogger.child({ service: CarCatalogUpdateService.name });
    }

    async down() {
        var startTime = performance.now()
        try {
            await this.entityManager.query('TRUNCATE TABLE complectations_options_attrmap CASCADE');
            await this.entityManager.query('TRUNCATE TABLE options_combined CASCADE');
            await this.entityManager.query('TRUNCATE TABLE specifications CASCADE');
            await this.entityManager.query('TRUNCATE TABLE options CASCADE');
            await this.entityManager.query('TRUNCATE TABLE modification CASCADE');
            await this.entityManager.query('TRUNCATE TABLE configuration CASCADE');
            await this.entityManager.query('TRUNCATE TABLE configurations_photo CASCADE');
            await this.entityManager.query('TRUNCATE TABLE generation CASCADE');
            await this.entityManager.query('TRUNCATE TABLE model CASCADE');
            await this.entityManager.query('TRUNCATE TABLE marklogo CASCADE');
            await this.entityManager.query('TRUNCATE TABLE mark CASCADE');

            var endTime = performance.now()
            this.logger.info(`down: All tables have been cleared in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
        } catch (error) {
            this.logger.error(`Error clearing tables: ${error.message}`);
            throw error;
        }
    }

    async up() {
        this.logger.info('up:Run cars-base update')
        var startTime = performance.now()

        const cb_updated_at = await this.checkStatus()
        if (true) {
            this.logger.info(`up: New updates from ${cb_updated_at} available`)
        } else {
            this.logger.info('up: There is no updates')
            return;
        }
        await this.entityManager.query('TRUNCATE TABLE complectations_options_attrmap CASCADE');
        await this.entityManager.query('TRUNCATE TABLE specifications CASCADE');
        await this.entityManager.query('TRUNCATE TABLE options CASCADE');
        await this.entityManager.query('TRUNCATE TABLE modification CASCADE');
        await this.entityManager.query('TRUNCATE TABLE configuration CASCADE');
        await this.entityManager.query('TRUNCATE TABLE configurations_photo CASCADE'); //TODO: DEL THIS
        await this.entityManager.query('TRUNCATE TABLE generation CASCADE');
        await this.entityManager.query('TRUNCATE TABLE model CASCADE');
        await this.entityManager.query('TRUNCATE TABLE marklogo CASCADE');
        await this.entityManager.query('TRUNCATE TABLE mark CASCADE');

        const data = await this.loadJSON()
        this.logger.info('up: JSON loaded and parsed')

        const modelsData: any[] = [];
        const generationsData: any[] = [];
        const configurationsData: any[] = [];
        const modificationsData: any[] = [];
        const specificationsData: any[] = [];
        const optionsData: any[] = [];
        const uniqueOptionsCombinedKeys = new Set<string>();
        for (const markData of data) {
            modelsData.push({
                markId: markData.id,
                models: markData.models
            })
            let mark_mod: any[] = [];
            let mark_specs: any[] = [];
            let mark_opts: any[] = [];
            for (const model of markData.models) {
                generationsData.push({
                    modelId: model.id,
                    generations: model.generations
                })

                for (const generation of model.generations) {
                    configurationsData.push({
                        generationId: generation.id,
                        configurations: generation.configurations
                    })
                    for (const configuration of generation.configurations) {
                        mark_mod.push({
                            configurationId: configuration.id,
                            generationId: generation.id,
                            modelId: model.id,
                            markId: markData.id,
                            modifications: configuration.modifications
                        })
                        for (const modification of configuration.modifications) {
                            mark_specs.push({
                                modificationId: modification['complectation-id'],
                                configurationId: configuration.id,
                                generationId: generation.id,
                                modelId: model.id,
                                markId: markData.id,
                                specifications: modification.specifications
                            })
                            mark_opts.push({
                                modificationId: modification['complectation-id'],
                                configurationId: configuration.id,
                                generationId: generation.id,
                                modelId: model.id,
                                markId: markData.id,
                                options: modification.options
                            })

                            modification.options && Object.keys(modification.options).forEach(key => {
                                uniqueOptionsCombinedKeys.add(key);
                            });

                            // убираем из combined_options перечеслимые спецификации
                            // for (const [key, value] of Object.entries(modification.specifications)) {
                            //     typeof value === 'object' && value !== null && uniqueOptionsCombinedKeys.add(key);
                            // }
                        }
                    }
                }
            }
            modificationsData.push(mark_mod)
            specificationsData.push(mark_specs)
            optionsData.push(mark_opts)
        }
        let uniqueOptionsCombinedKeysArray = Array.from(uniqueOptionsCombinedKeys);
        await this.processMarks(data);
        await this.processModels(modelsData);
        await this.processGenerations(generationsData);
        await this.processConfigurations(configurationsData);
        await this.processConfigurationsPhotos(configurationsData);
        await this.processModifications(modificationsData);
        await this.processSpecifications(specificationsData);
        await this.processOptions(optionsData);
        await this.processCombinedOptions(uniqueOptionsCombinedKeysArray);
        await this.processComplectationOptionsAttrMap(modificationsData)

        var endTime = performance.now()
        this.logger.info(`up: finish in ${((endTime - startTime) / 1000).toFixed(2)} seconds`)
    }

    // Функция для обработки пачек промисов
    private processBatch = async (promisesBatch, type) => {
        try {
            var startTime = performance.now()
            const results = await Promise.all(promisesBatch);
            var endTime = performance.now()
            this.logger.info(`Processed ${results.length} ${type} in batch in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
        } catch (error) {
            this.logger.error(`Error processing ${type} batch: ${error.message}`);
        }
    };
    // Функция для последовательной обработки пачек промисов
    private processInBatches = async (promises, batchSize, type) => {
        for (let i = 0; i < promises.length; i += batchSize) {
            // Выделение пачки промисов размером batchSize
            const batch = promises.slice(i, i + batchSize);
            await this.processBatch(batch, type); // Обработка пачки промисов
        }
    };

    async processMarks(data) {
        try {
            const markPromises = data.map(markData =>
                this.saveMark(markData)
            );
            var startTime = performance.now()
            const marks = await Promise.all(markPromises);
            var endTime = performance.now()
            this.logger.info(`Processed ${marks.length} marks in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

            const markLogoPromises = data.map(markData =>
                this.saveMarkLogo(markData)
            );
            const markLogos = await Promise.all(markLogoPromises);
            this.logger.info(`Processed ${markLogos.length} mark logos`);

        } catch (error) {
            this.logger.error(`Error processing marks: ${error.message}`);
        }
    }

    async processModels(modelsData) {
        const modelPromises = modelsData.map(mark =>
            Array.isArray(mark.models) ? mark.models.map(modelData => this.saveModel(modelData, mark.markId)) : []
        ).flat();

        try {
            var startTime = performance.now()
            const models = await Promise.all(modelPromises);
            var endTime = performance.now()
            this.logger.info(`Processed ${models.length} models  in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
        } catch (error) {
            this.logger.error(`Error processing models: ${error.message}`);
        }
    }

    async processGenerations(generationsData) {
        const generationPromises = generationsData.map(model =>
            Array.isArray(model.generations) ? model.generations.map(generationData => this.saveGeneration(generationData, model.modelId)) : []
        ).flat()

        try {
            var startTime = performance.now()
            const generations = await Promise.all(generationPromises);
            var endTime = performance.now()
            this.logger.info(`Processed ${generations.length} generations  in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
        } catch (error) {
            this.logger.error(`Error processing generations : ${error.message}`);
        }
    }

    async processConfigurations(configurationsData) {
        const configurationPromises = configurationsData.flatMap(generation =>
            Array.isArray(generation.configurations) ? generation.configurations.map(confData => this.saveConfiguration(confData, generation.generationId)) : []
        );
        await this.processInBatches(configurationPromises, 3000, 'configurations');
    }

    async processConfigurationsPhotos(configurationsData) {
        var startTime = performance.now()
        for (const generation of configurationsData) {
            if (Array.isArray(generation.configurations)) {
                for (const confData of generation.configurations) {
                    try {
                        // Обработка каждой фотографии конфигурации по очереди
                        await this.saveConfigurationsPhoto(confData.id);
                        this.logger.debug(`Processed photo for configuration ${confData.id}`);
                    } catch (error) {
                        // Логирование ошибок, не связанных с отсутствием файла
                        if (error.code !== 'ENOENT') {
                            this.logger.error(`Error processing photo for configuration ${confData.id}: ${error.message}`);
                        }
                    }
                }
            }
        }
        var endTime = performance.now()
        this.logger.info(`Processed ConfigurationsPhotos in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
    }

    async processModifications(modificationsData) {
        for (const mark_mod of modificationsData) {
            const modificationPromises = mark_mod.flatMap(conf =>
                Array.isArray(conf.modifications)
                    ? conf.modifications.map(modifData => this.saveModification(modifData, conf.configurationId, conf.generationId, conf.modelId, conf.markId))
                    : []
            );
            await this.processInBatches(modificationPromises, 1000, 'modifications');
        }
    }

    async processOptions(optionsData) {
        for (const mark_opts of optionsData) {
            const optsPromises = mark_opts.flatMap(modif => { if (modif.options) return this.saveOptions(modif.options, modif.modificationId) }
            );
            await this.processInBatches(optsPromises, 3000, 'options');
        }
    }

    async processSpecifications(specificationsData) {
        for (const mark_specs of specificationsData) {
            const specsPromises = mark_specs.flatMap(modif => { if (modif.specifications) return this.saveSpecifications(modif.specifications, modif.modificationId) }
            );
            await this.processInBatches(specsPromises, 3000, 'specifications');
        }
    }

    async processCombinedOptions(optsSpecsArray) {
        console.log(`optsSpecsArray length ${optsSpecsArray.length}`)
        var startTime = performance.now()
        for (const optSpecKey of optsSpecsArray) {
            await this.getOrSaveCombinedOption(optSpecKey);
        }
        var endTime = performance.now()
        this.logger.info(`Processed options_combined in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
    }

    async processComplectationOptionsAttrMap(modificationsData: any[]) {
        for (const mark_mod of modificationsData) {
            const complOptsPromises = mark_mod.flatMap(configuration =>
                Array.isArray(configuration.modifications) ? configuration.modifications.map(modifData =>
                    this.saveComplectationsOptionsAttrmap(
                        modifData['complectation-id'],
                        modifData.options,
                        modifData.specifications,
                        configuration.configurationId, configuration.generationId, configuration.modelId, configuration.markId
                    )
                ) : []
            );
            await this.processInBatches(complOptsPromises, 3000, 'compl_opts_attrmap');
        }
    }

    async loadJSON() {
        try {
            const data = await fs.readFile(path.join('/app/carbase/base.json'), 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            this.logger.error(`loadJSON: error loading JSON - ${error.message}`);
            throw error;
        }
    }

    async checkStatus() {
        return axios.get('https://cars-base.ru/api/status')
            .then(response => {
                this.logger.info(`checkStatus: Last update at ${response.data.updated_at}`)
                return response.data.updated_at
            })
            .catch(error => {
                console.error(error)
            })
    }

    async saveMark(markData) {
        let mark = this.markRepository.create({
            id: markData.id,
            name: markData.name,
            cyrillicName: markData['cyrillic-name'],
            popular: markData.popular,
            country: markData.country,
        });
        await this.markRepository.save(mark);
        this.logger.debug(`saveMark: new Mark ${markData.name} saved`)
        return mark;
    }

    async saveMarkLogo(markData) {
        const imagePath = path.join(`/app/carbase/logos/${markData.id}.png`);

        try {
            // Асинхронная проверка существования файла
            await fs.access(imagePath);

            // Асинхронное чтение файла
            const image = await fs.readFile(imagePath);

            let markLogo = this.markLogoRepository.create({
                mark: { id: markData.id },
                image: image
            });

            await this.markLogoRepository.save(markLogo);
            this.logger.debug(`saveMarkLogo: new Mark logo of ${markData.name} saved`);
        } catch (error) {
            this.logger.error(`saveMarkLogo: error saving Mark logo of ${markData.name} - ${error.message}`);
        }
    }

    async saveModel(modelData, markId) {
        let model = this.modelRepository.create({
            id: modelData.id,
            name: modelData.name,
            cyrillicName: modelData['cyrillic-name'],
            class: modelData.class,
            yearFrom: modelData['year-from'],
            yearTo: modelData['year-to'],
            mark: { id: markId },
        });
        await this.modelRepository.save(model);
        this.logger.debug(`saveModel: new Model ${modelData.name} of ${markId} saved`)
        return model;
    }

    async saveGeneration(generationData, modelId) {
        let generation = this.generationRepository.create({
            id: generationData.id,
            name: generationData.name,
            yearStart: generationData['year-start'],
            yearStop: generationData['year-stop'],
            isRestyle: generationData['is-restyle'],
            model: { id: modelId }
        });
        await this.generationRepository.save(generation);
        this.logger.debug(`saveGeneration: new Generation ${generationData.name} of ${modelId} saved`)
        return generation;
    }

    async saveConfiguration(configurationData, generationId) {
        // let hash = createHash("md5")
        //     .update(JSON.stringify(configurationData))
        //     .digest("hex");
        let configuration = this.configurationRepository.create({
            id: configurationData.id,
            doorsCount: configurationData['doors-count'],
            bodyType: configurationData['body-type'],
            notice: configurationData.notice,
            // hash: hash,
            hash: '',
            generation: { id: generationId }
        })
        await this.configurationRepository.save(configuration);
        this.logger.debug(`saveConfiguration: new Configuration ${configurationData.id} of ${generationId} generation saved`)
        return configuration;
    }

    async saveConfigurationsPhoto(configurationId) {
        const imagePath = path.join(`/app/carbase/photos/${configurationId}.jpg`);
        try {
            // Проверка существования файла асинхронно
            await fs.access(imagePath);
            // Чтение файла асинхронно
            const image = await fs.readFile(imagePath);
            let modifPhoto = this.configurationsPhotoRepository.create({
                configuration: { id: configurationId },
                image: image
            });
            await this.configurationsPhotoRepository.save(modifPhoto);
            this.logger.debug(`saveConfigurationsPhoto: new photo of ${configurationId} configuration saved`);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                this.logger.error(`saveConfigurationsPhoto: error saving photo of ${configurationId} configuration - ${error.message}`);
            }
        }
    }

    async saveModification(modificationData, configurationId, generationId, modelId, markId) {
        const specs = modificationData.specifications;
        const enginekey = `${markId}_${modelId}_${generationId}_${configurationId}_${specs['volume-litres']}_${specs['engine-type']}_${specs['horse-power']}_${specs['transmission']}_${specs['drive']}`;
        let hash = createHash("md5")
            .update(enginekey)
            .digest("hex");
        let modification = this.modificationRepository.create({
            complectationId: modificationData['complectation-id'],
            offersPriceFrom: modificationData['offers-price-from'],
            offersPriceTo: modificationData['offers-price-to'],
            groupName: modificationData['group-name'],
            engine_hash: hash,
            configuration: { id: configurationId }
        })
        await this.modificationRepository.save(modification);
        this.logger.debug(`saveModification: new Modification ${modificationData['complectation-id']} of ${configurationId} configuration saved`)
        return modification;
    }

    async saveOptions(modificationDataOptions, complectationId) {
        let options = this.optionsRepository.create({ complectationId: complectationId });
        const optionsRepositoryMeta = this.optionsRepository.metadata;
        for (const [key, value] of Object.entries(modificationDataOptions)) {
            let column = optionsRepositoryMeta.columns.find(column => column.databaseName === key);
            if (column) {
                const propertyName = column.propertyName;
                options[propertyName] = value;
            }
        }
        await this.optionsRepository.save(options);
        this.logger.debug(`saveOptions: Option of ${complectationId} complectation saved`)
    }

    async saveSpecifications(modificationDataSpecifications, complectationId) {
        let specifications = this.specificationsRepository.create({ complectationId: complectationId });
        const specificationsRepositoryMeta = this.specificationsRepository.metadata;

        for (const [key, value] of Object.entries(modificationDataSpecifications)) {
            // Check if value is an array or object, then JSON.stringify
            let column = specificationsRepositoryMeta.columns.find(column => column.databaseName === key);
            if (column) {
                const propertyName = column.propertyName;
                if (typeof value === 'object' && value !== null) {
                    specifications[propertyName] = JSON.stringify(value);
                } else {
                    specifications[propertyName] = value;
                }
            } else {
                this.logger.error(`saveSpecifications: Column for key '${key}' not found in entity metadata.`)
            }
        }
        await this.specificationsRepository.save(specifications);
        this.logger.debug(`saveSpecifications: Specifications of ${complectationId} complectation saved`)
    }


    async saveComplectationsOptionsAttrmap(extComplectationId: string, modificationDataOptions, modificationDataSpecifications, configurationId, generationId, modelId, markId) {
        const attrMapEntities: ComplectationsOptionsAttrMap[] = [];

        const specs = modificationDataSpecifications;
        const enginekey = `${markId}_${modelId}_${generationId}_${configurationId}_${specs['volume-litres']}_${specs['engine-type']}_${specs['horse-power']}_${specs['transmission']}_${specs['drive']}`;
        
        let hash = createHash("md5")
            .update(enginekey)
            .digest("hex");

        if (modificationDataOptions && extComplectationId) {
            for (const [key, value] of Object.entries(modificationDataOptions)) {
                const combinedOption = await this.getOrSaveCombinedOption(key);
                const attrMapEntity = new ComplectationsOptionsAttrMap();
                attrMapEntity.complectation_id = extComplectationId;
                attrMapEntity.option_id = combinedOption.id;
                attrMapEntity.value = String(value);
                attrMapEntity.value_type = 'boolean';
                attrMapEntity.engine_hash = hash;
                attrMapEntity.createdBy = String(process.env.DATABASE_USER);
                attrMapEntities.push(attrMapEntity);
            }
        }

        // убираем из combined_options перечеслимые спецификации
        // if (modificationDataSpecifications && extComplectationId) {
        //     for (const [key, value] of Object.entries(modificationDataSpecifications)) {
        //         if (typeof value === 'object' && value !== null) {
        //             const combinedOption = await this.getOrSaveCombinedOption(key);
        //             const attrMapEntity = new ComplectationsOptionsAttrMap();
        //             attrMapEntity.complectation_id = extComplectationId;
        //             attrMapEntity.option_id = combinedOption.id;
        //             attrMapEntity.value = String(value);
        //             attrMapEntity.value_type = 'string';
        //             attrMapEntity.engine_hash = hash;
        //             attrMapEntity.createdBy = String(process.env.DATABASE_USER);
        //             attrMapEntities.push(attrMapEntity);
        //         }
        //     }
        // }



        if (attrMapEntities.length > 0) {
            await this.complectationsOptionsAttrMapRepository.save(attrMapEntities);
            this.logger.debug(`saveComplectationsOptionsAttrmap: saved ${attrMapEntities.length} attribute map entries`);
        }
    }

    async getOrSaveCombinedOption(optionKey) {
        let optionCombined = await this.optionsCombinedRepository.findOne({
            where: { name: optionKey },
            cache: true
        })
        if (!optionCombined) {
            optionCombined = this.optionsCombinedRepository.create({
                name: optionKey,
                createdBy: process.env.DATABASE_USER
            })
            await this.optionsCombinedRepository.save(optionCombined);
            this.logger.debug(`getOrSaveCombinedOption: Option of ${optionKey} saved`)
        }
        return optionCombined;
    }
}