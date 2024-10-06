import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetSessionInfoDto } from 'src/auth/dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { ProcessDto, CreateMessageDto, MessageDto } from './dto';
import { ProcessesService } from './processes.service';

@Controller('processes')
@UseGuards(AuthGuard)
export class ProcessesController {

    constructor(
        private processesService: ProcessesService
    ) { }

    @Get()
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    @ApiQuery({ name: 'process_type', required: false, type: String })
    @ApiOkResponse({ type: [ProcessDto] })
    async getConversations(
        @SessionInfo() session: GetSessionInfoDto,
        @Query('skip') _skip: number,
        @Query('take') _take: number,
        @Query('process_type') _processType: string
    ): Promise<ProcessDto[]> {

        return this.processesService.getProcesses(session, _skip, _take, _processType)
    }

    @Get(':process_id')
    @ApiOkResponse({ type: ProcessDto })
    @ApiParam({
        name: 'process_id',
        required: true,
        description: 'ID беседы в виде uuid',
        example: '19fe4254-0f58-4c9c-9ffc-ac96998b72c8'
    })
    async getProcess(
        @Param('process_id') processId: string,
        @SessionInfo() session: GetSessionInfoDto,
    ) {
        return this.processesService.getProcessById(session, processId)
    }

    @Post()
    @ApiBody({ type: CreateMessageDto })
    @ApiOkResponse({ type: MessageDto })
    async createMessage(
        @SessionInfo() session: GetSessionInfoDto,
        @Body() body: CreateMessageDto
    ): Promise<MessageDto> {
        return await this.processesService.createMessage(session, body.process_type, body.message, body.process_id, body.lot_id, body.offer_id, body.dealers_car_id, body.decision_id)
    }

    
}

