import { Module } from '@nestjs/common';
import { CarCatalogUpdateController } from './car-catalog.controller';
import { CarCatalogUpdateService } from './car-catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mark } from './entities/mark.entity';
import { MarkLogo } from './entities/marklogo.entity';
import { Model } from './entities/model.entity';
import { Generation } from './entities/generation.entity';
import { Configuration } from './entities/configuration.entity';
import { ConfigurationsPhoto } from './entities/configurations_photo.entity';
import { Modification } from './entities/modification.entity';
import { Options } from './entities/options.entity';
import { Specifications } from './entities/specifications.entity';
import { OptionsCombined } from './entities/options_combined.entity';
import { ComplectationsOptionsAttrMap } from './entities/complectations_options_attrmap.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Mark, MarkLogo, Model, Generation, Configuration, ConfigurationsPhoto, Modification, Options, Specifications, OptionsCombined, ComplectationsOptionsAttrMap])],
  controllers: [CarCatalogUpdateController],
  providers: [CarCatalogUpdateService]
})
export class CarCatalogUpdateModule { }