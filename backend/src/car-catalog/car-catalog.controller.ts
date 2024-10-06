import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CarCatalogService } from './car-catalog.service';
import { BrandModelGenConfDto, ComplectationWithOptionsDto, ConfigurationDto, DetailedModificationDto, GenerationDto, MarkDto, MarkWithModelsDto, ModelDto, ModificationDto, OptionsAttrMapCategoryDictionaryDto, OptionsAttrMapDto, OptionsCategoryDictionaryDto } from './dto';
import { OptionsDictCategory } from './entities/options_dict.entity';

@Controller('car-catalog')
export class CarCatalogController {

    constructor(private carCatalogService: CarCatalogService) { }

    @Get('/')
    @ApiOkResponse({ type: [MarkDto] })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'random', required: false })
    @ApiQuery({ name: 'popular', required: false })
    getAllBrands(
        @Query('limit') limit?: number, // Define limit parameter
        @Query('random') random?: boolean, // Define random parameter
        @Query('popular') popular?: boolean, // Define random parameter
    ): Promise<MarkDto[]> {
        return this.carCatalogService.getAllBrands(limit, random, popular);
    }

    @Get('/model-info/:modelId')
    @ApiOkResponse({ type: ModelDto })
    @ApiParam({
        name: 'modelId',
        required: true,
        description: 'ID модели автомобиля',
        example: 'ALFA_ROMEO_MITO'
    })
    getModelinfo(
        @Param('modelId') modelId: string,
    ): Promise<ModelDto> {
        return this.carCatalogService.getModelInfo(modelId);
    }

    @Get('/configuration-info/:generationId_configurationId')
    @ApiOkResponse({ type: GenerationDto })
    @ApiParam({
        name: 'generationId_configurationId',
        required: true,
        description: 'ID поколения и типа кузова',

    })
    getConfigurationInfo(
        @Param('generationId_configurationId') generationId_configurationId: string,
    ): Promise<GenerationDto> {
        return this.carCatalogService.getConfigurationInfo(generationId_configurationId);
    }

    @Get('/catalog-info/options_dict')
    @ApiOkResponse()
    getOptionsDictionary(
    ) {
        return this.carCatalogService.getOptionsDictionary();
    }

    @Get('/catalog-info/:engine_hash')
    @ApiOkResponse({ type:BrandModelGenConfDto})
    @ApiParam({
        name: 'engine_hash',
        required: true,
        description: 'хэш двигателя',
    })
    getBrandModelGenConfInfoByEngineHash(
        @Param('engine_hash') engine_hash: string,
    ): Promise<BrandModelGenConfDto> {
        return this.carCatalogService.getBrandModelGenConfInfoByEngineHash(engine_hash);
    }

   

    @Get('/complectation-info/:engine_hash')
    @ApiOkResponse({ type: ModificationDto })
    @ApiParam({
        name: 'engine_hash',
        required: true,
        description: 'хэш двигателя',

    })
    getComplectationInfoByEngineHash(
        @Param('engine_hash') engine_hash: string,
    ): Promise<ModificationDto> {
        return this.carCatalogService.getComplectationInfo(engine_hash);
    }

    @Get('/specification-info/:engine_hash')
    @ApiOkResponse({ type: DetailedModificationDto })
    @ApiParam({
        name: 'engine_hash',
        required: true,
        description: 'хэш двигателя',

    })
    getComplectationSpecificationInfoByEngineHash(
        @Param('engine_hash') engine_hash: string,
    ): Promise<DetailedModificationDto> {
        return this.carCatalogService.getComplectationSpecificationInfo(engine_hash);
    }

    @Get('/options-map/modificationId=:modificationId')
    @ApiOkResponse({ type: OptionsAttrMapCategoryDictionaryDto })
    @ApiParam({
        name: 'modificationId',
        required: true,
        description: 'ID модификации автомобиля',
        example: '20176770_20235840_20235599'
    })
    async getOptionsByConfiguration(@Param('modificationId') modificationId: string): Promise<OptionsAttrMapCategoryDictionaryDto> {
        return this.carCatalogService.getOptionsCategoryDictionaryByConfiguration(modificationId);
    }

    @Get('/options-map/engine=:engineHash')
    @ApiOkResponse({ type: OptionsAttrMapCategoryDictionaryDto })
    @ApiParam({
        name: 'engineHash',
        required: true,
        description: '{Хэш двигатель-объём-тип_топлива-привод-лс-коробка}',
        example: '9a7449364022cf89d0741ac177bc3253'
    })
    @ApiQuery({
        name: 'complectationId',
        required: false,
        description: 'ID комплектации(модификации) автомобиля',
        example: '20176770_20235840_20235599'
    })
    @ApiQuery({
        name: 'part',
        required: false,
        // enum: ['default', 'paid'],
        example: 'default',
        description: 'не заполнено - все опции, default - только общие бесплатные для всех комплектаций, paid - только те, где хотя бы в 1 комплектации опция платная',
    })
    async getOptionsByEngineHash(
        @Param('engineHash') engineHash: string,
        @Query('complectationId') complectationId: string,
        @Query('part') part?: "default"| "paid",
    ): Promise<OptionsAttrMapCategoryDictionaryDto> {
        return this.carCatalogService.getOptionsCategoryDictionaryByEngineHash(engineHash, complectationId, part);
    }

    @Get('/complectations/engine=:engineHash')
    @ApiOkResponse({ type: [ComplectationWithOptionsDto] })
    @ApiParam({
        name: 'engineHash',
        required: true,
        description: '{Хэш двигатель-объём-тип_топлива-привод-лс-коробка}',
        example: '9a7449364022cf89d0741ac177bc3253'
    })
    async getComplectationNamesWithOptionsByEngineHash(
        @Param('engineHash') engineHash: string,

    ): Promise<ComplectationWithOptionsDto[]> {
        return this.carCatalogService.getComplectationNamesWithOptionsByEngineHash(engineHash);
    }

    @Get('/:markId')
    @ApiOkResponse({ type: MarkWithModelsDto })
    @ApiParam({
        name: 'markId',
        required: true,
        description: 'ID марки автомобиля',
        example: 'ALFA_ROMEO'
    })
    @ApiQuery({
        name: 'onlyBrandData',
        required: false,
        type: Boolean,
        description: 'Показать только данные бренда'
    })
    async getMarkWithModels(
        @Param('markId') markId: string,
        @Query('onlyBrandData') onlyBrandData?: boolean
    ): Promise<MarkWithModelsDto | MarkDto> {
        const mark = await this.carCatalogService.getBrand(markId);
        if (onlyBrandData) {
            return mark;
        }
        const models = await this.carCatalogService.getModelsByMark(markId);

        return { ...mark, items: models };
    }



    @Get('/:markId/:modelId')
    @ApiOkResponse({ type: [GenerationDto] })
    @ApiParam({
        name: 'markId',
        required: true,
        description: 'ID марки автомобиля',
        example: 'ALFA_ROMEO'
    })
    @ApiParam({
        name: 'modelId',
        required: true,
        description: 'ID модели автомобиля',
        example: 'MITO'
    })
    getGenerationsByModel(
        @Param('markId') markId: string,
        @Param('modelId') modelId: string
    ): Promise<GenerationDto[]> {
        return this.carCatalogService.getGenerationsByMarkModel(markId, modelId);
    }

    @Get('/:markId/:modelId/:generationId')
    @ApiOkResponse({ type: [ConfigurationDto] })
    @ApiParam({
        name: 'markId',
        required: true,
        description: 'ID марки автомобиля',
        example: 'ALFA_ROMEO'
    })
    @ApiParam({
        name: 'modelId',
        required: true,
        description: 'ID модели автомобиля',
        example: 'MITO'
    })
    @ApiParam({
        name: 'generationId',
        required: true,
        description: 'ID поколения автомобиля',
        example: '20176738'
    })
    getConfigurationsByGeneration(
        @Param('markId') markId: string,
        @Param('modelId') modelId: string,
        @Param('generationId') generationId: string,
    ): Promise<ConfigurationDto[]> {
        return this.carCatalogService.getConfigurationsByMarkModelGeneration(markId, modelId, generationId);
    }

    @Get('/:markId/:modelId/:generationId/:configurationId')
    @ApiOkResponse({ type: [ModificationDto] })
    @ApiParam({
        name: 'markId',
        required: true,
        description: 'ID марки автомобиля',
        example: 'ALFA_ROMEO'
    })
    @ApiParam({
        name: 'modelId',
        required: true,
        description: 'ID модели автомобиля',
        example: 'MITO'
    })
    @ApiParam({
        name: 'generationId',
        required: true,
        description: 'ID поколения автомобиля',
        example: '20176738'
    })
    @ApiParam({
        name: 'configurationId',
        required: true,
        description: 'ID конфигурации автомобиля',
        example: '20176770'
    })
    @ApiQuery({
        name: 'groupByEngine',
        required: false,
        type: Boolean,
        description: 'Группировать по hash engine'
    })
    getModificationByConfiguration(
        @Param('markId') markId: string,
        @Param('modelId') modelId: string,
        @Param('generationId') generationId: string,
        @Param('configurationId') configurationId: string,
        @Query('groupByEngine') groupByEngine?: boolean
    ): Promise<ModificationDto[]> {
        return this.carCatalogService.getModificationsByByMarkModelGenerationConfiguration(markId, modelId, generationId, configurationId, groupByEngine);
    }

    @Get('/:markId/:modelId/:generationId/:configurationId/:modificationId')
    @ApiOkResponse({ type: DetailedModificationDto })
    @ApiParam({
        name: 'markId',
        required: true,
        description: 'ID марки автомобиля',
        example: 'ALFA_ROMEO'
    })
    @ApiParam({
        name: 'modelId',
        required: true,
        description: 'ID модели автомобиля',
        example: 'MITO'
    })
    @ApiParam({
        name: 'generationId',
        required: true,
        description: 'ID поколения автомобиля',
        example: '20176738'
    })
    @ApiParam({
        name: 'configurationId',
        required: true,
        description: 'ID конфигурации автомобиля',
        example: '20176770'
    })
    @ApiParam({
        name: 'modificationId',
        required: true,
        description: 'ID модификации автомобиля',
        example: '20176770_20235840_20235599'
    })
    getDetailedModification(
        @Param('markId') markId: string,
        @Param('modelId') modelId: string,
        @Param('generationId') generationId: string,
        @Param('configurationId') configurationId: string,
        @Param('modificationId') modificationId: string
    ): Promise<DetailedModificationDto> {
        return this.carCatalogService.getDetailedModification(markId, modelId, generationId, configurationId, modificationId);
    }


}