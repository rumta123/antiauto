import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OfferCreateDto, OfferDto, OfferIdDto, OffersStatusDto } from './dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { OffersTemplatesService } from './offers_templates.service';

@Controller('offers')
@UseGuards(AuthGuard)
export class OffersController {

    constructor(
        private offersService: OffersService,
        private offersTemplatesService: OffersTemplatesService,
    ) { }

    @Post()
    @ApiCreatedResponse({ type: OfferDto })
    async create(
        @Body() body: OfferCreateDto,
        @Res({ passthrough: true }) res: Response,
        @SessionInfo() session: GetSessionInfoDto,
    ) {
        return this.offersService.create(session, body)
    }

    @Get('/create')
    @ApiOkResponse({ type: [OfferCreateDto] })
    @ApiQuery({
        name: 'lot_id',
        required: false,
    })
    async getOffersTemplates(
        @SessionInfo() session: GetSessionInfoDto,
        @Query('lot_id') lotId?: string
    ): Promise<OfferCreateDto[]> {
        const filter = { lotId }
        return this.offersTemplatesService.getOffersTemplates(session, filter)
    }

    @Get()
    @ApiOkResponse({ type: [OfferDto] })
    @ApiQuery({
        name: 'lot_id',
        required: true,
    })
    async getOffers(
        @SessionInfo() session: GetSessionInfoDto,
        @Query('lot_id') lotId?: string
    ): Promise<OfferDto[]> {
        const filter = { lotId }
        return this.offersService.getOffers(session, filter)
    }

    @Get('/:offer_id')
    @ApiOkResponse({ type: OfferDto })
    @ApiParam({
        name: 'offer_id',
        required: true,
        description: 'ID предложения в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    async getOfferById(
        @Param('offer_id') offerId: string,
        @SessionInfo() session: GetSessionInfoDto,
    ): Promise<OfferDto> {
        return this.offersService.getOfferById(session, offerId)
    }

    @Post('/:offer_id/:statusDirection')
    @ApiOkResponse({ type: OfferDto })
    @ApiParam({
        name: 'offer_id',
        required: true,
        description: 'ID предложения в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    @ApiParam({
        name: 'statusDirection',
        required: true,
        description: 'новый статус предложения',
        enum: ["prev", "next"]
    })
    async setOfferStatus(
        @Param('offer_id') offerId: string,
        @Param('statusDirection') statusDirection: "prev" | "next",
        @SessionInfo() session: GetSessionInfoDto,
    ): Promise<OfferDto> {
        return this.offersService.setOfferStatus(session, offerId, statusDirection);
    }

    @Delete('/:offer_id')
    @ApiOkResponse({ type: OfferIdDto })
    @ApiParam({
        name: 'offer_id',
        required: true,
        description: 'ID предложения в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    async deleteOfferById(
        @Param('offer_id') offerId: string,
        @SessionInfo() session: GetSessionInfoDto,
    ) {
        return this.offersService.deleteOfferById(session, offerId)
    }

    @Delete('/by_car_id/:car_id')
    @ApiOkResponse()
    @ApiParam({
        name: 'car_id',
        required: true,
        description: 'ID автомобиля в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    async deleteOffersByCarId(
        @Param('car_id') carId: string,
        @SessionInfo() session: GetSessionInfoDto,
    ) {
        return this.offersService.deleteOffersByCarId(session, carId)
    }

    @Get('/status_by_car/:car_id')
    @ApiOkResponse({ type: OffersStatusDto })
    @ApiParam({
        name: 'car_id',
        required: true,
        description: 'ID автомобиля в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    async getMostImportantStatusByCarId(
        @Param('car_id') carId: string,
        @SessionInfo() session: GetSessionInfoDto,
    ) {
        return this.offersService.getMostImportantStatusByCarId(session, carId)
    }

}
