import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { LotsService } from './lots.service';
import { LotCreateDto, LotDto, LotIdDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';
import { OptionsCategoryDictionaryDto } from 'src/car-catalog/dto';

@Controller('lots')
@UseGuards(AuthGuard)
export class LotsController {

    constructor(private lotsService: LotsService,) { }

    @Post()
    @ApiCreatedResponse({ type: LotIdDto })
    async create(
        @Body() body: LotCreateDto,
        @Res({ passthrough: true }) res: Response,
        @SessionInfo() session: GetSessionInfoDto,
    ) {
        return this.lotsService.create(session.id, body)
    }

    @Get()
    @ApiOkResponse({ type: [LotDto] })
    @ApiQuery({
        name: 'involved',
        required: false,
        description: 'Поиск только тех лотов, где есть предложения, владельцем которых является пользователь(дилер)'
    })

    @ApiQuery({
        name: 'mark_id',
        required: false,
    })
    @ApiQuery({
        name: 'model_id',
        required: false,
    })
    @ApiQuery({
        name: 'gen_id',
        required: false,
    })
    @ApiQuery({
        name: 'conf_id',
        required: false,
    })
    @ApiQuery({ name: 'city_id', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'minPrice', required: false })
    @ApiQuery({ name: 'dealer_car_id', required: false })
    async getAllLots(
        @SessionInfo() session: GetSessionInfoDto,
        @Query('involved') involved?: boolean,
        @Query('mark_id') mark_id?: string,
        @Query('model_id') model_id?: string,
        @Query('gen_id') gen_id?: string,
        @Query('conf_id') conf_id?: string,
        @Query('city_id') city_id?: string,
        @Query('status') status?: string,
        @Query('minPrice') minPrice?: number,
        @Query('dealer_car_id') dealer_car_id?: number,
    ): Promise<LotDto[]> {
        const filter = { mark_id, model_id, gen_id, conf_id, city_id, status, minPrice, dealer_car_id }
        return this.lotsService.getAllLots(session, involved, filter)
    }

    @Get('/by_car_id/:car_id')
    @ApiOkResponse({ type: [LotDto] })
    @ApiParam({
        name: 'car_id',
        required: true,
        description: 'ID автомобиля в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    @ApiQuery({
        name: 'part',
        // enum: ['all', 'involved', 'fittable'],
        required: false,
    })
    async getLotsByCarId(
        @SessionInfo() session: GetSessionInfoDto,
        @Param('car_id') carId: string,
        @Query('part') part?: 'all' | 'involved' | 'fittable',
    ): Promise<LotDto[]> {
        return this.lotsService.getLotByCarId(session, carId, part);
    }

    @Get('/:lot_id')
    @ApiOkResponse({ type: LotDto })
    @ApiParam({
        name: 'lot_id',
        required: true,
        description: 'ID аукциона в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    async getLotById(
        @Param('lot_id') lotId: string,
        @SessionInfo() session: GetSessionInfoDto,
    ): Promise<LotDto> {
        return this.lotsService.getLotById(session, lotId)
    }

    @Get('/:lot_id/options')
    @ApiOkResponse({ type: [OptionsCategoryDictionaryDto] })
    @ApiParam({
        name: 'lot_id',
        required: true,
        description: 'ID аукциона в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    @ApiQuery({
        name: 'strict',
        description: 'обязательные/желательные опции',
        type: Boolean,
    })
    async getLotOptionsByLotId(
        @Param('lot_id') lotId: string,
        @Query('strict') strict: boolean,
        @SessionInfo() session: GetSessionInfoDto,
    ): Promise<OptionsCategoryDictionaryDto[]> {
        return this.lotsService.getLotOptionsDictByLotId(session, lotId, strict)
    }
}
