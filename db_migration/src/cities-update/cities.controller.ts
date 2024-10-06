import { Controller, Get } from '@nestjs/common';

import { CitiesUpdateService } from './cities.service';


@Controller('cities')
export class CitiesUpdateController {

    constructor(private citiesUpdateService: CitiesUpdateService) {}

    @Get('/update')
    runUpdate(
    ) {
        return this.citiesUpdateService.up()
    }

    @Get('/drop')
    runDrop(
    ) {
        return this.citiesUpdateService.down()
    }
    
}