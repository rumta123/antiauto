import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from 'src/auth/auth.module';
import { ChatController } from './chat.controller';
// import { DbModule } from 'src/db/db.module';

@Module({
    imports: [AuthModule,/* DbModule */],
    providers: [ChatGateway, ChatService],
    exports: [ChatService],
    controllers: [ChatController]
})
export class ChatModule {}
