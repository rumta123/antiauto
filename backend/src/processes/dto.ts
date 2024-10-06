import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class MessageDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    process_id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    author_name: string;

    @ApiProperty()
    author_id: string;

    constructor(message: any) {
        this.id = message.id;
        this.message = message.message;
        this.process_id = message.process_id;
        this.createdAt = message.createdAt;
        this.author_name = message.author.account?.name ?? message.author.email;
        this.author_id = message.author_id;
    }
}

export class ProcessesDecisionsDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    constructor(decision: any) {
        this.id = decision.id;
        this.name = decision.name === 'accept' ? 'Подтвердить' : decision.name === 'reject' ? 'Отклонить' : decision.name;
    }
}

export class ProcessDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    process_type: string;

    @ApiProperty()
    lastMessage: MessageDto;

    @ApiProperty()
    lastMessageDate: Date;

    @ApiProperty({ type: [MessageDto] })
    messages: MessageDto[]

    @ApiProperty()
    is_decision_required: boolean;

    @ApiProperty()
    is_process_closed: boolean;

    @ApiProperty()
    offer_id: string;
    @ApiProperty()
    lot_id: string;
    @ApiProperty()
    dealers_car_id: string;

    @ApiProperty({ type: [ProcessesDecisionsDto] })
    decisions: ProcessesDecisionsDto[]
    constructor(process: any, messages?: any, decisions?: any) {
        this.id = process.id;
        this.process_type = process.process_type?.name
        this.lastMessage = process.lastMessage && new MessageDto(process.lastMessage)
        this.messages = messages ? messages.map((message: any) => new MessageDto(message)) : undefined;
        this.is_decision_required = process.is_decision_required;
        this.decisions = process.is_decision_required && decisions && decisions.length > 0 ? decisions.map((decision: any) => new ProcessesDecisionsDto(decision)) : undefined;
        this.is_process_closed = process.is_process_closed;
        this.offer_id = process.offer_id;
        this.lot_id = process.lot_id;
        this.dealers_car_id = process.dealers_car_id;
    }
}



export class CreateMessageDto {
    @ApiProperty()
    process_type: string;
    @ApiProperty()
    message: string;
    @ApiProperty()
    process_id?: string;

    @ApiProperty()
    lot_id?: string;
    @ApiProperty()
    offer_id?: string;
    @ApiProperty()
    dealers_car_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    decision_id?: string;

}

