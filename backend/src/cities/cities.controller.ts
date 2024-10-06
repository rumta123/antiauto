import { Body, Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { CityDto } from './dto';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {

    constructor(private citiesService: CitiesService) { }

    @Get('/')
    @ApiOkResponse({ type: [CityDto] })
    @ApiQuery({ name: 'name', required: false })
    getCities(
        // @Body() body: CityDto,
        @Query('name') name?: string,
    ): Promise<CityDto[]> {
        return this.citiesService.getCities(name)
    }
}
