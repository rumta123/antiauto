import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { MessageDto } from './dto';
// import { DbService } from 'src/db/db.service';
// import { ChatMessageStatus } from '@prisma/client';

@Injectable()
export class ChatService {

    constructor(private authService: AuthService) { }

    async getUserFromSocket(socket: Socket) {
        // let auth_token = socket.handshake.headers.authorization || "";
        let auth_token = socket.handshake.headers.cookie || "";
        // get the token itself without "Bearer"
        // auth_token = auth_token.split(' ')[1];
        auth_token = auth_token.split('=')[1];

        const user = this.authService.getUserFromAuthToken(
            auth_token
        );

        if (!user) {
            throw new WsException('Invalid credentials.');
        }
        return user;
    }

    async findMessageByContent(message: string, userId: number) {
    //     // const existingMessage = this.db.chatMessage.findFirst({ where: { message, senderId: userId } })
    //     // return existingMessage;
    }

    async createMessage(message: string, userId: string) {
        // console.log("messageDto",messageDto)
        // const { message } = messageDto;
        // const newMessage = this.db.chatMessage.create({
        //     data: {
        //         message: message,
        //         senderId: userId,
        //         recipientId: 1,
        //         auctionId: 1,
        //         status: ChatMessageStatus.Open
        //     }
        // })

        // return newMessage
    }

    async getAllMessages(auctionId: number) {
        console.log(auctionId)
        // const allMessages = await this.db.chatMessage.findMany({
        //     where: {
        //         auctionId: auctionId,
        //       },
        //     orderBy: {
        //       createdAt: 'asc'
        //     }
        //   });
        // return allMessages;
    }
}


