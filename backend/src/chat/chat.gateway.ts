import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service'

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private chatService: ChatService) { }

    async handleConnection(socket: Socket) {
        // Handle connection event

        await this.chatService.getUserFromSocket(socket)

        // const user = await this.chatService.getUserFromSocket(socket)
        // console.log('user',user)
        // if (!user) {
        //     // this.server.close()
        //     // socket.send()
        // }
    }

    handleDisconnect(client: any) {
        // Handle disconnection event
    }


    @SubscribeMessage('message')
    async handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
        // Handle received message
        console.log('data', data)
        const user = await this.chatService.getUserFromSocket(client)
        if (!user) {
            return;
        }

        // const existingMessage = await this.chatService.findMessageByContent(data, user.id);
        // if (existingMessage && Date.now() - new Date(existingMessage.createdAt).getTime() < 1000) {
        //     return; // Prevent duplicate message
        // }

        const newmessage = await this.chatService.createMessage(data, user.id)
        this.server.emit('message', data); // Broadcast the message to all connected clients
    }

    @SubscribeMessage('get_all_messages')
    async getAllMessages(@MessageBody() auctionId: number, @ConnectedSocket() socket: Socket) {
console.log('auctionId',auctionId)
        await this.chatService.getUserFromSocket(socket)
        //TODO check if auctionId creqted by User
        const messages = await this.chatService.getAllMessages(auctionId)

        this.server.sockets.emit('receive_message', messages);

        return messages
    }
}