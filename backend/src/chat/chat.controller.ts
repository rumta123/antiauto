import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessageDto } from './dto';

@Controller('chat')
export class ChatController { 
    constructor(private chatService: ChatService) {}

    @UseGuards(AuthGuard)
    @Post() 
    async createMessage(@Body() message: string, @Req() req: any) {
        const userId = req.user['sub'];
        return this.chatService.createMessage(message, userId)
    }


    // @UseGuards(AuthGuard)
    // @Get() 
    // async getAllMessages() {
    //     return this.chatService.getAllMessages()
    // }
}
