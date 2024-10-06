import { Module } from '@nestjs/common';
import { CarCatalogController } from './car-catalog.controller';
import { CarCatalogService } from './car-catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mark } from './entities/mark.entity';
import { Model } from './entities/model.entity';
import { Generation } from './entities/generation.entity';
import { Configuration } from './entities/configuration.entity';
import { Modification } from './entities/modification.entity';
import { Options } from './entities/options.entity';
import { Specifications } from './entities/specifications.entity';
import { OptionsDictCategory } from './entities/options_dict.entity';
import { SpecificationsDictCategory } from './entities/specifications_dict.entity';
import { ComplectationsOptionsAttrMap } from './entities/complectations_options_attrmap.entity';
import { OptionsCombined } from './entities/options_combined.entity';
import { CarCatalogOptionsProvider } from './providers/options.provider';
import { CarCatalogHelperProvider } from './providers/helper.provider';


@Module({
  imports: [TypeOrmModule.forFeature([
    Mark,
    Model,
    Generation,
    Configuration,
    Modification,
    Options,
    OptionsDictCategory,
    Specifications,
    SpecificationsDictCategory,
    ComplectationsOptionsAttrMap,
    OptionsCombined
  ])],
  controllers: [CarCatalogController],
  providers: [CarCatalogService,CarCatalogOptionsProvider,CarCatalogHelperProvider],
  exports: [CarCatalogService,CarCatalogOptionsProvider,CarCatalogHelperProvider]
})
export class CarCatalogModule { }