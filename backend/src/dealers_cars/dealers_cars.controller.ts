import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DealersCarsService } from './dealers_cars.service';
import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';
import { PatchDealersCarDto, DealersCarDto, DealersCarIdDto, DealersCarPublicDto } from './dto';
import { OptionsCategoryDictionaryDto } from 'src/car-catalog/dto';

@Controller('dealers-cars')
@UseGuards(AuthGuard)
export class DealersCarsController {
    constructor(private dealersCarsService: DealersCarsService,) { }

    @Post()
    @ApiCreatedResponse({ type: PatchDealersCarDto })
    @ApiQuery({
        name: 'engine_hash',
        required: false,
    })
    @ApiQuery({
        name: 'complectation_id',
        required: false,
    })
        
    async create(
        @Res({ passthrough: true }) res: Response,
        @Body() body: PatchDealersCarDto,
        @SessionInfo() session: GetSessionInfoDto,
        @Query('engine_hash') engine_hash?: string,
        @Query('complectation_id') complectation_id?: string,
    ) {
        // return this.dealersCarsService.create(session, engine_hash, complectation_id)
        return this.dealersCarsService.create(session, body)
    }

    @Get()
    @ApiOkResponse({ type: [DealersCarDto] })
    @ApiQuery({
        name: 'lot_id',
        required: false,
        description: 'Поиск автомобилей подходящих под параметры лота'
    })
    @ApiQuery({ name: 'only_filled', required: false })
    async getAllDealersCars(
        @SessionInfo() session: GetSessionInfoDto,
        @Query('lot_id') lot_id?: string,
        @Query('only_filled') only_filled?: boolean,
    ): Promise<DealersCarDto[]> {
        const filter = { only_filled }
        return this.dealersCarsService.getAllCars(session, lot_id, filter)
    }

    @Get('/:car_id')
    @ApiOkResponse({ type: DealersCarDto })
    @ApiParam({
        name: 'car_id',
        required: true,
        description: 'ID автомобиля в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    async getDealersCarById(
        @Param('car_id') carId: string,
        @SessionInfo() session: GetSessionInfoDto,
    ): Promise<DealersCarDto | DealersCarPublicDto> {
        return this.dealersCarsService.getCarById(session, carId)
    }

    @Get('/:car_id/options')
    @ApiOkResponse({ type: OptionsCategoryDictionaryDto })
    @ApiParam({
        name: 'car_id',
        required: true,
        description: 'ID автомобиля в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    async getDealersCarMappedOptionsByCarId(
        @Param('car_id') carId: string,
        @SessionInfo() session: GetSessionInfoDto,
    ): Promise<OptionsCategoryDictionaryDto> {
        return this.dealersCarsService.getDealersCarMappedOptionsByCarId(session, carId)
    }

    @Get('/patch_info/:car_id')
    @ApiOkResponse({ type: PatchDealersCarDto })
    @ApiParam({
        name: 'car_id',
        required: true,
        description: 'ID автомобиля в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    async getDealersCarPatchInfoById(
        @Param('car_id') carId: string,
        @SessionInfo() session: GetSessionInfoDto,
    ): Promise<PatchDealersCarDto> {
        return this.dealersCarsService.getPatchInfoByCarId(session, carId)
    }

    @Patch()
    @ApiOkResponse({
        type: PatchDealersCarDto
    })
    patchDealersCars(
        @Body() body: PatchDealersCarDto,
        @SessionInfo() session: GetSessionInfoDto
    ): Promise<PatchDealersCarDto> {
        return this.dealersCarsService.patchDealersCar(session, body)
    }

    @Delete('/:car_id')
    @ApiOkResponse({
        type: DealersCarIdDto
    })
    deleteDealersCar(
        @Param('car_id') carId: string,
        @SessionInfo() session: GetSessionInfoDto
    ): Promise<DealersCarIdDto> {
        return this.dealersCarsService.delete(session, carId)
    }
}
