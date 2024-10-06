import { Controller, Get, Param, Query } from '@nestjs/common';

import { CarCatalogUpdateService } from './car-catalog.service';


@Controller('car-catalog')
export class CarCatalogUpdateController {

    constructor(private carCatalogUpdateService: CarCatalogUpdateService) {}

    @Get('/update')
    runUpdate(
    ) {
        return this.carCatalogUpdateService.up()
    }

    @Get('/drop')
    runDrop(
    ) {
        return this.carCatalogUpdateService.down()
    }
    
}