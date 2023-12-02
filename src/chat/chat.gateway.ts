// src/chat/chat.gateway.ts

import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { Client } from 'socket.io/dist/client';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody('room') room: string, @MessageBody('socketId') socketId: string): Promise<void> {
    await this.server.in(socketId).socketsJoin(room)
   this.server.to(room).emit('joinedRoom', `${socketId} joined ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody('message') message: string,
    @MessageBody('room') room: string,
    @MessageBody('username') username: string,
  ): Promise<void> {
    // const savedMessage = await this.chatService.addMessageToRoom(room, message, username);
    this.server.to(room).emit('message', message);
  }
}
