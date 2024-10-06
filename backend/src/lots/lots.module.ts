import { Module, forwardRef } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lots } from './entities/lots.entity';
import { LotsOptionsAttrMap } from './entities/lots_options_attrmap.entity';
import { LotsStatuses } from './entities/lots_statuses.entity';
import { LotsStatusesMap } from './entities/lots_statuses_map.entity';
import { CarCatalogModule } from 'src/car-catalog/car-catalog.module';
import { UsersModule } from 'src/users/users.module';
import { OffersModule } from 'src/offers/offers.module';
import { DealersCarsModule } from 'src/dealers_cars/dealers_cars.module';
import { LotsProvider } from './providers/lots.provider';
import { LotsStatusesProvider } from './providers/lots_statuses.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lots, LotsOptionsAttrMap, LotsStatuses, LotsStatusesMap]),
    forwardRef(() => CarCatalogModule),
    forwardRef(() => UsersModule),
    forwardRef(() => OffersModule),
    forwardRef(() => DealersCarsModule),
  ],
  providers: [LotsService,LotsProvider,LotsStatusesProvider],
  controllers: [LotsController],
  exports: [LotsService,LotsProvider,LotsStatusesProvider]
})
export class LotsModule { }
