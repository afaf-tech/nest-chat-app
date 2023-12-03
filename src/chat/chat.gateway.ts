// src/chat/chat.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { WSAuthGuard } from 'src/auth/auth.ws.guard';

@UseGuards(WSAuthGuard)
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: false,  
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // @UseGuards(AuthGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody('room') room: string, @MessageBody('socketId') socketId: string): Promise<void> {
    console.log(room, socketId);
    await this.server.in(socketId).socketsJoin(room)
    this.server.to(room).emit('joinedRoom', `${socketId} joined ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody('message') message: string,
    @MessageBody('room') room: string,
    @MessageBody('username') username: string,
  ): Promise<void> {
    // TODO: use user id token payload.sub instead of hardcoding the username
    const storedMsg = await this.chatService.addMessageToRoom(room, message, username);
    this.server.to(room).emit('message', storedMsg);
  }

}
