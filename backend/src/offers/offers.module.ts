import { Module, forwardRef } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offers } from './entities/offers.entity';
import { OffersStatuses } from './entities/offers_statuses.entity';
import { OffersStatusesMap } from './entities/offers_statuses_map.entity';
import { OffersStatusesReasons } from './entities/offers_statuses_reasons.entity';
import { DealersCarsModule } from 'src/dealers_cars/dealers_cars.module';
import { LotsModule } from 'src/lots/lots.module';
import { OfferOptionsAttrMap } from './entities/offers_options_attr_map.entity';
import { OffersTemplatesService } from './offers_templates.service';
import { OffersProvider } from './providers/offers.provider';
import { OffersOptionsProvider } from './providers/offers_options.provider';
import { OffersStatusesProvider } from './providers/offers_statuses.provider';
import { CitiesModule } from 'src/cities/cities.module';
import { ProcessesModule } from 'src/processes/processes.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Offers, OfferOptionsAttrMap, OffersStatuses, OffersStatusesMap, OffersStatusesReasons]),
    forwardRef(() => DealersCarsModule),
    forwardRef(() => LotsModule),
    forwardRef(() => CitiesModule),
    forwardRef(() => ProcessesModule)
  ],
  controllers: [OffersController],
  providers: [OffersService, OffersTemplatesService, OffersProvider, OffersOptionsProvider, OffersStatusesProvider],
  exports: [OffersProvider, OffersOptionsProvider, OffersStatusesProvider]
})
export class OffersModule {}
