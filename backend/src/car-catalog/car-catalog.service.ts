import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrderValue, In, Repository } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { Model } from './entities/model.entity';
import { GenerationDto, MarkDto, ModelDto, ConfigurationDto, ModificationDto, DetailedModificationDto, OptionsAttrMapDto, OptionsCategoryDictionaryDto, OptionsAttrMapCategoryDictionaryDto, ComplectationWithOptionsDto, BrandModelGenConfDto } from './dto';
import { Generation } from './entities/generation.entity';
import { Configuration } from './entities/configuration.entity';
import { Modification } from './entities/modification.entity';
import { OptionsDictCategory } from './entities/options_dict.entity';
import { Options } from './entities/options.entity';
import { SpecificationsDictCategory } from './entities/specifications_dict.entity';
import { Specifications } from './entities/specifications.entity';
import { ComplectationsOptionsAttrMap } from './entities/complectations_options_attrmap.entity';
import { CarCatalogHelperProvider } from './providers/helper.provider';
import { CarCatalogOptionsProvider } from './providers/options.provider';


@Injectable()
export class CarCatalogService {
    

    constructor(
        private carCatalogHelperProvider: CarCatalogHelperProvider,
        private carCatalogOptionsProvider:CarCatalogOptionsProvider,

        @InjectRepository(Mark)
        private markRepository: Repository<Mark>,
        @InjectRepository(Model)
        private modelRepository: Repository<Model>,
        @InjectRepository(Generation)
        private generationRepository: Repository<Generation>,
        @InjectRepository(Configuration)
        private configurationRepository: Repository<Configuration>,
        @InjectRepository(Modification)
        private modificationRepository: Repository<Modification>,
        @InjectRepository(OptionsDictCategory)
        private optionsDictCategoryRepository: Repository<OptionsDictCategory>,
        @InjectRepository(SpecificationsDictCategory)
        private specificationsDictCategoryRepository: Repository<SpecificationsDictCategory>,
        @InjectRepository(ComplectationsOptionsAttrMap)
        private complectationsOptionsAttrMap: Repository<ComplectationsOptionsAttrMap>
    ) { }

    async getAllBrands(limit?: number, random?: boolean, popular?: boolean): Promise<MarkDto[]> {
        let marks;

        if (random && limit) {
            // Получение всех ID брендов и выбор случайных из них
            const ids = (await this.markRepository.find({ select: ['id'] })).map(mark => mark.id);
            const randomIds = ids.sort(() => 0.5 - Math.random()).slice(0, limit);
            marks = await this.markRepository.find({
                where: {
                    id: In(randomIds),
                    popular: popular
                },
                order: {
                    name: "ASC",
                },
                relations: ['logo']
            })
        } else {
            marks = await this.markRepository.find({
                where: {
                    popular: popular
                },
                order: {
                    name: "ASC",
                },
                take: limit,
                relations: ['logo']
            });
        }
        return marks.map(mark => new MarkDto(mark));
    }

    async getBrand(markId: string): Promise<MarkDto> {

        const mark = await this.markRepository.findOne({
            where: {
                id: markId
            },
            relations: ['logo']
        });

        return new MarkDto(mark);
    }

    async getModelsByMark(markId: string): Promise<ModelDto[]> {
        const models = await this.modelRepository.find({
            where: { mark: { id: markId } },
            relations: ['mark'],
            order: {
                name: "ASC",
            },
        });
        return models.map(model => new ModelDto(model));
    }

    async getModelInfo(modelId: string): Promise<ModelDto> {
        const model = await this.modelRepository.findOne({
            where: {
                id: modelId
            }
        });

        return new ModelDto(model);
    }

    async getGenerationsByMarkModel(markId: string, modelId: string): Promise<GenerationDto[]> {
        const generations = await this.generationRepository.find({
            where: {
                model: {
                    id: modelId,
                    mark: { id: markId }
                }
            },
            relations: {
                configurations: {
                    photo: true
                }
            },
            order: {
                yearStart: "DESC",
            },
        })
        return generations.map(generation => new GenerationDto(generation))
    }

    async getConfigurationsByMarkModelGeneration(markId: string, modelId: string, generationId: string): Promise<ConfigurationDto[]> {
        const configurations = await this.configurationRepository.find({
            where: {
                generation: {
                    id: generationId,
                    model: {
                        id: modelId,
                        mark: { id: markId }
                    }
                }
            },
            relations: ['photo'],

        })
        return configurations.map(configuration => new ConfigurationDto(configuration))
    }

    async getConfigurationInfo(generationId_configurationId: string): Promise<GenerationDto> {
        //throw new Error('Method not implemented.');
        const [generationId, configurationId] = generationId_configurationId.split("_")
        const conf = await this.generationRepository.findOne({
            where: {
                id: generationId,
                configurations: { id: configurationId }
            },
            relations: {
                configurations: true
            }
        });

        return new GenerationDto(conf);
    }



    async getModificationsByByMarkModelGenerationConfiguration(markId: string, modelId: string, generationId: string, configurationId: string, groupByEngine?: boolean): Promise<ModificationDto[]> {

        let findOpts = {
            where: {
                configuration: {
                    id: configurationId,
                    generation: {
                        id: generationId,
                        model: {
                            id: modelId,
                            mark: { id: markId }
                        }
                    }
                }
            },
            relations: {
                specifications: true
            },
            order: {}
        }
        if (groupByEngine) {
            findOpts.order = {

                specifications: {
                    volumeLitres: "ASC" as FindOptionsOrderValue,
                    horsePower: "ASC" as FindOptionsOrderValue,
                },
            }
        } else {
            findOpts.order = {
                groupName: "ASC" as FindOptionsOrderValue,
                specifications: {
                    volumeLitres: "ASC" as FindOptionsOrderValue,
                    horsePower: "ASC" as FindOptionsOrderValue,
                }
            }
        }
        const modifications = await this.modificationRepository.find(findOpts)
        if (groupByEngine) {
            const uniqueEngineHashModifications = new Map();
            modifications.forEach(modification => {
                const engineHash = modification.engine_hash;
                uniqueEngineHashModifications.set(engineHash, modification);
            });
            const uniqueModifications = Array.from(uniqueEngineHashModifications.values());
            return uniqueModifications.map(modification => new ModificationDto(modification))
        }
        return modifications.map(modification => new ModificationDto(modification))
    }

    async getComplectationNamesWithOptionsByEngineHash(engineHash: string) {
        const modifications = await this.modificationRepository.find({
            where: { engine_hash: engineHash },
            relations: {
                options_attrmap: { option: true },
                specifications: true
            },
            order: {
                specifications: {
                    volumeLitres: "ASC",
                    horsePower: "ASC",
                },
            },
        })
        const optionsDictCategories = await this.optionsDictCategoryRepository.find({
            relations: { options: true }
        });
        const mappedModifications = new Map()
        modifications.forEach(modification => {
            const optsFormatted = modification.options_attrmap.map(option => new OptionsAttrMapDto(option))
            const mappedOptions: OptionsAttrMapCategoryDictionaryDto = this.carCatalogOptionsProvider.mapOptionsAttrMapByCategory(optionsDictCategories, optsFormatted);
            mappedModifications.set(modification.complectationId, { modification, mappedOptions })
        });
        const arrModifications = Array.from(mappedModifications.values())
        return arrModifications.map(arrModification => new ComplectationWithOptionsDto(arrModification.modification, arrModification.mappedOptions));
    }

    async getDetailedModification(
        markId: string,
        modelId: string,
        generationId: string,
        configurationId: string,
        modificationId: string
    ): Promise<DetailedModificationDto> {
        const modification = await this.modificationRepository.findOne({
            where: {
                complectationId: modificationId,
                configuration: {
                    id: configurationId,
                    generation: {
                        id: generationId,
                        model: {
                            id: modelId,
                            mark: { id: markId }
                        }
                    }
                }
            },
            relations: {
                options: true,
                specifications: true
            }
        })
        const optionsDictCategories = await this.optionsDictCategoryRepository.find({
            relations: { options: true }
        });
        const optionsValues = modification?.options ? this.mapOptionsToRecord(modification.options) : {};
        const mappedOptions = this.mapOptionsByCategory(optionsDictCategories, optionsValues);

        const specificationsDictCategoties = await this.specificationsDictCategoryRepository.find({
            relations: { specifications: true }
        });
        const specificationsValues = modification?.specifications ? this.mapSpecificationsToRecord(modification.specifications) : {};

        const mappedSpecifications = this.mapSpecificationsByCategory(specificationsDictCategoties, specificationsValues);

        return new DetailedModificationDto(modification, mappedOptions, mappedSpecifications);
    }

    async getComplectationInfo(engine_hash: string): Promise<ModificationDto> {
        const modification = await this.modificationRepository.findOne({
            where: {
                engine_hash: engine_hash,
            },
            relations: {
                specifications: true
            }
        })
        return new ModificationDto(modification)
    }

    async getComplectationSpecificationInfo(engine_hash: string): Promise<DetailedModificationDto> {
        const modification = await this.modificationRepository.findOne({
            where: {
                engine_hash: engine_hash,
            },
            relations: {
                specifications: true
            }
        })
        const specificationsDictCategoties = await this.specificationsDictCategoryRepository.find({
            relations: { specifications: true }
        });
        
        const specificationsValues = modification?.specifications ? this.mapSpecificationsToRecord(modification.specifications) : {};
        const mappedSpecifications = this.mapSpecificationsByCategory(specificationsDictCategoties, specificationsValues);
        return new DetailedModificationDto(modification,{},mappedSpecifications)
    }

    async getComplectationText(engine_hash: string) {
        const complectation = await this.getComplectationInfo(engine_hash);
        return `${[
            [
                complectation.volumeLitres.toFixed(1),
                (complectation.horsePower ? `${complectation.horsePower} л.с.` : ''),
                complectation.engineType
            ].join(' '),
            complectation.transmission,
            complectation.drive,
            `расход ${complectation.consumptionCity} / ${complectation.consumptionHiway} л.`,
            `разгон до 100 - ${complectation.timeTo100} с`
        ].join(', ')}`;
    }

    private mapOptionsToRecord(options: Options): Record<string, string> {
        const record: Record<string, string> = {};
        Object.entries(options).forEach(([key, value]) => {
            if (value !== null) {
                record[key] = value;
            }
        });
        return record;
    }

    private mapOptionsByCategory(optionsDictCategories: OptionsDictCategory[], optionsValues: Record<string, string>): any {
        const detailedOptions = {};
        for (const category of optionsDictCategories) {
            const optionsForCategory = {};
            for (const option of category.options) {
                if (optionsValues[option.key]) {
                    optionsForCategory[option.value] = true;
                }
            }
            if (Object.keys(optionsForCategory).length > 0) {
                detailedOptions[category.name] = optionsForCategory;
            }
        }
        return detailedOptions;
    }

    private mapSpecificationsToRecord(specifications: Specifications): Record<string, string> {
        const record: Record<string, string> = {};
        Object.entries(specifications).forEach(([key, value]) => {
            if (value !== null) {
                record[key] = value;
            }
        });
        return record;
    }

    private mapSpecificationsByCategory(specificationsDictCategoties: SpecificationsDictCategory[], specificationsValues: Record<string, string>): any {
        const detailedSpecifications = {};
        for (const category of specificationsDictCategoties) {
            const specificationsForCategory = {};
            for (const option of category.specifications) {
                if (specificationsValues[option.key]) {
                    specificationsForCategory[option.value] = specificationsValues[option.key];
                }
            }
            if (Object.keys(specificationsForCategory).length > 0) {
                detailedSpecifications[category.name] = specificationsForCategory;
            }
        }
        return detailedSpecifications;
    }

    async getOptionsCategoryDictionaryByConfiguration(modificationId: string): Promise<OptionsAttrMapCategoryDictionaryDto> {
        const options = await this.complectationsOptionsAttrMap.find({
            where: {
                complectation_id: modificationId
            },
            relations: {
                option: true
            },

        });
        const optsFormatted = options.map(option => new OptionsAttrMapDto(option))
        const optionsDictCategories = await this.optionsDictCategoryRepository.find({
            relations: { options: true }
        });
        const mappedOptions: OptionsAttrMapCategoryDictionaryDto = this.carCatalogOptionsProvider.mapOptionsAttrMapByCategory(optionsDictCategories, optsFormatted);
        return mappedOptions;
    }
    async getOptionsCategoryDictionaryByEngineHash(engineHash: string, complectationId?: string, part?: "default" | "paid" | undefined): Promise<OptionsAttrMapCategoryDictionaryDto> {
        let options = await this.complectationsOptionsAttrMap.find({
            where: { engine_hash: engineHash },
            relations: { option: true },
        });

        const uniqueComplectationIds = new Set(options.map(option => option.complectation_id));
        const complectationIdCount = uniqueComplectationIds.size;

        if (complectationId) {
            if (part === 'default') {
                // Фильтрация опций, где все значения option.name равны '1' и complectationId
                options = options.filter(opt => (opt.complectation_id === complectationId &&  opt.value === '1'))
                
            } else if (part === 'paid') {
                // Фильтрация опций, где хотя бы одно значение с одинаковым option.name не равно '1' у выбранной complectationId и опции из остальных complectationId
                // options = options.filter(opt => ((opt.complectation_id === complectationId && opt.value !== '1') || opt.complectation_id !== complectationId))

                const excludedOptionNames = new Set(options.filter(opt => opt.complectation_id === complectationId && opt.value === '1').map(opt => opt.option.name));

                options = options.filter(opt => {
                    const optionsWithSameName = options.filter(o => o.option.name === opt.option.name);
                    return optionsWithSameName.some(o => o.value !== '1') || !excludedOptionNames.has(opt.option.name);
                });
            }
        } else {
            if (part === 'default') {
                // Фильтрация опций, где все значения с одинаковым option.name равны '1'
                options = options.filter(opt => {
                    const optionsWithSameName = options.filter(o => o.option.name === opt.option.name);
                    return optionsWithSameName.length === complectationIdCount &&
                        optionsWithSameName.every(o => o.value === '1');
                });
            } else if (part === 'paid') {
                // Фильтрация опций, где хотя бы одно значение с одинаковым option.name не равно '1'
                options = options.filter(opt => {
                    const optionsWithSameName = options.filter(o => o.option.name === opt.option.name);
                    return optionsWithSameName.some(o => o.value !== '1') || (optionsWithSameName.length !== complectationIdCount);
                });
            }
        }
        const uniqueOptionsMap = new Map();
        options.forEach(option => {
            if (!uniqueOptionsMap.has(option.option.name)) {
                uniqueOptionsMap.set(option.option.name, option);
            }
        });
        const uniqueOptions = Array.from(uniqueOptionsMap.values());
        const optsFormatted = uniqueOptions.map(option => new OptionsAttrMapDto(option));
        const optionsDictCategories = await this.optionsDictCategoryRepository.find({
            relations: { options: true }
        });
        const mappedOptions: OptionsAttrMapCategoryDictionaryDto = this.carCatalogOptionsProvider.mapOptionsAttrMapByCategory(optionsDictCategories, optsFormatted);
        return mappedOptions;
    }

    async getBrandModelGenConfInfoByEngineHash(engine_hash: string): Promise<BrandModelGenConfDto> {
        const data = await this.carCatalogHelperProvider.getBrandModelGenConfInfoByEngineHash(engine_hash)
        return new BrandModelGenConfDto(data)
    }

    async getOptionsDictionary(): Promise<OptionsDictCategory[]> {
        const dict = await this.carCatalogOptionsProvider.getOptionsDict();
        return dict;
    }
}
