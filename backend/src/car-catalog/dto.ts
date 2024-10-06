import { ApiParam, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";
import { Options } from "./entities/options.entity";
import { Specifications } from "./entities/specifications.entity";
import { OptionsCombined } from "./entities/options_combined.entity";


export class MarkDto {
    @ApiProperty({
        example: "ALFA_ROMEO"
    })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    cyrillicName: string;

    @ApiProperty()
    popular: boolean;

    @ApiProperty()
    country: string;

    @ApiProperty()
    logo: string;

    @ApiProperty()
    groupSymbol: string

    constructor(mark: any) {
        this.id = mark.id;
        this.name = mark.name;
        this.cyrillicName = mark.cyrillicName;
        this.popular = mark.popular;
        this.country = mark.country;
        this.logo = mark.logo?.image ? Buffer.from(mark.logo.image).toString('base64') : '';
        this.groupSymbol = (mark.country === "Россия" || mark.country === "Украина") ? mark.cyrillicName.slice(0, 1) : mark.name.slice(0, 1)
    }

}



export class ModelDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    cyrillicName: string;

    @ApiProperty()
    class: string;

    @ApiProperty()
    yearFrom: number;

    @ApiProperty()
    yearTo: number;

    constructor(model: any) {
        this.id = model.id;
        this.name = model.name;
        this.cyrillicName = model.cyrillicName;
        this.class = model.class;
        this.yearFrom = model.yearFrom;
        this.yearTo = model.yearTo;
    }
}

export class MarkWithModelsDto extends MarkDto {
    @ApiProperty({ type: [ModelDto] })
    items: ModelDto[];
}

export class ConfigurationDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    doorsCount: number;

    @ApiProperty()
    bodyType: string;

    @ApiProperty()
    photo: string;

    @ApiProperty()
    notice: string;

    constructor(configuration: any) {
        this.id = configuration.id;
        this.doorsCount = configuration.doorsCount;
        this.bodyType = configuration.bodyType;
        this.notice = configuration.notice;
        this.photo = configuration.photo?.image ? Buffer.from(configuration.photo.image).toString('base64') : '';
    }
}

export class GenerationDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    yearStart: number;

    @ApiProperty()
    yearStop: number;

    @ApiProperty()
    isRestyle: boolean;

    @ApiProperty({ type: [ConfigurationDto] })
    configurations: ConfigurationDto[];

    constructor(generation: any) {
        this.id = generation.id;
        this.name = generation.name;
        this.yearStart = generation.yearStart;
        this.yearStop = generation.yearStop;
        this.isRestyle = generation.isRestyle;
        this.configurations = generation.configurations.map(configuration => {
            configuration.photo = configuration.photo?.image ? Buffer.from(configuration.photo.image).toString('base64') : '';
            return configuration
        });

    }
}

export class ModificationDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    engineHash: string;

    @ApiProperty()
    groupName: string;

    @ApiProperty()
    horsePower: number;

    @ApiProperty()
    engineType: string;

    @ApiProperty()
    transmission: string;

    @ApiProperty()
    volumeLitres: number;

    @ApiProperty()
    drive: string;

    @ApiProperty()
    consumptionMixed: number;

    @ApiProperty()
    consumptionCity: number;

    @ApiProperty()
    consumptionHiway: number;

    @ApiProperty()
    timeTo100: number;

    constructor(modification: any) {
        this.id = modification.complectationId;
        this.engineHash = modification.engine_hash;
        this.groupName = modification.groupName;
        this.horsePower = modification.specifications.horsePower;
        this.engineType = modification.specifications.engineType;
        this.transmission = modification.specifications.transmission;
        this.volumeLitres = modification.specifications.volumeLitres;
        this.drive = modification.specifications.drive;
        this.consumptionMixed = modification.specifications.consumptionMixed;
        this.consumptionCity = modification.specifications.consumptionCity;
        this.consumptionHiway = modification.specifications.consumptionHiway;
        this.timeTo100 = modification.specifications.timeTo100;
    }
}

export class OptionsCategoryDictionaryDto {
    [category: string]: { [description: string]: string | null };
}

export class SpecificationCategoryDictionaryDto {
    [category: string]: { [description: string]: string | null };
}


export class DetailedModificationDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    groupName: string;

    @ApiProperty({ type: OptionsCategoryDictionaryDto })
    options: OptionsCategoryDictionaryDto;

    @ApiProperty({ type: SpecificationCategoryDictionaryDto })
    specifications: SpecificationCategoryDictionaryDto;

    @ApiProperty()
    horsePower: number;

    @ApiProperty()
    engineType: string;

    @ApiProperty()
    transmission: string;

    @ApiProperty()
    volumeLitres: number;

    @ApiProperty()
    drive: string;

    @ApiProperty()
    consumptionMixed: number;

    @ApiProperty()
    timeTo100: number;

    constructor(modification: any, optionsGroupedByCategory: OptionsCategoryDictionaryDto, specificationsGroupedByCategory: SpecificationCategoryDictionaryDto) {
        this.id = modification.complectationId;
        this.groupName = modification.groupName;
        this.options = optionsGroupedByCategory;
        this.specifications = specificationsGroupedByCategory;

        this.horsePower = modification.specifications.horsePower;
        this.engineType = modification.specifications.engineType;
        this.transmission = modification.specifications.transmission;
        this.volumeLitres = modification.specifications.volumeLitres;
        this.drive = modification.specifications.drive;
        this.consumptionMixed = modification.specifications.consumptionMixed;
        this.timeTo100 = modification.specifications.timeTo100;
    }
}

export class OptionsAttrMapDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    option_id: string;

    @ApiProperty()
    option: OptionsCombined;

    @ApiProperty()
    option_name: string;

    @ApiProperty()
    value: string;

    // @ApiProperty({
    //     type: "enum",
    //     enum: ["string", "boolean"],
    //     default: "boolean"
    // })
    // value_type: string;

    constructor(option: any) {
        this.id = option.id;
        this.option_id = option.option_id;
        this.value = option.value;
        // this.value_type = option.value_type;
        this.option_name = option.option.name;
    }
}
export class OptionsAttrMapCategoryDictionaryDto {
    [categoryName: string]: {
        [optionName: string]: OptionsAttrMapDto;
    }
}
export class ComplectationWithOptionsDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    groupName: string;

    @ApiProperty({ type: OptionsAttrMapCategoryDictionaryDto })
    options: OptionsAttrMapCategoryDictionaryDto;

    constructor(complectation: any, optionsGroupedByCategory: OptionsAttrMapCategoryDictionaryDto) {
        this.id = complectation.complectationId;
        this.groupName = complectation.groupName;
        this.options = optionsGroupedByCategory;
    }
}

export class BrandModelGenConfDto {
    @ApiProperty() brand: MarkDto;
    @ApiProperty() model: ModelDto;
    @ApiProperty() generation: GenerationDto;
    @ApiProperty() configuration: ConfigurationDto;
    constructor(data: any) {
        this.brand = data.brand;
        this.model = data.model;
        this.generation = data.generation;
        this.configuration = data.configuration;
    }
}