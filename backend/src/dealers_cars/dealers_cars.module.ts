import { Module, forwardRef } from '@nestjs/common';
import { DealersCarsController } from './dealers_cars.controller';
import { DealersCarsService } from './dealers_cars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealersCars } from './entities/dealers_cars.entity';
import { DealersCarOptionsAttrMap } from './entities/dealers_cars_options_attr_map.entity';
import { LotsModule } from 'src/lots/lots.module';
import { DealersCarsProvider } from './providers/dealers_cars.provider';
import { CarCatalogModule } from 'src/car-catalog/car-catalog.module';
import { DealersCarsOptionsProvider } from './providers/dealers_cars_options.provider';
import { OffersModule } from 'src/offers/offers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DealersCars, DealersCarOptionsAttrMap]),
    forwardRef(() => LotsModule),
    forwardRef(() => CarCatalogModule),
    forwardRef(() => OffersModule),
  ],
  controllers: [DealersCarsController],
  providers: [DealersCarsService, DealersCarsProvider, DealersCarsOptionsProvider],
  exports: [DealersCarsService, DealersCarsProvider, DealersCarsOptionsProvider]
})
export class DealersCarsModule { }
