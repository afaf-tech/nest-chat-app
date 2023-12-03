// src/chat/chat.controller.ts

import { Controller, Request, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam, ApiBody, ApiProperty, ApiBearerAuth } from '@nestjs/swagger'; // Add Swagger decorators
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';

export class CreateRoomDto {
  @ApiProperty()
  name: string;
}

export class CreateMessageDto { 
  @ApiProperty()
  content: string;

  @ApiProperty()
  sender: string;
}

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Chat') // Add Swagger tag
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  @ApiResponse({ status: 200, description: 'Retrieve a list of chat rooms' })
  async getRooms() {
    return this.chatService.getRooms();
  }

  @Post('rooms')
  @ApiResponse({ status: 201, description: 'Create a new chat room' })
  @ApiBody({ type: CreateRoomDto, description: 'Name of the chat room' })
  async createChatRoom(@Request() req, @Body() body: CreateRoomDto) {
    const { name } = body;
    return this.chatService.createRoom(name, req.user.sub);
  }

  @Post('rooms/:roomId/messages')
  @ApiResponse({ status: 201, description: 'Add a message to a specific chat room' })
  @ApiParam({ name: 'roomId', description: 'ID of the chat room' })
  @ApiBody({ type: CreateMessageDto, description: 'Content of the message' })
  async addMessageToRoom(
    @Param('roomId') roomId: string,
    @Body() body: CreateMessageDto,
  ) {
    const { content, sender } = body;
    return this.chatService.addMessageToRoom(roomId, content, sender);
  }

  @Get('rooms/:roomId/messages')
  @ApiResponse({ status: 200, description: 'Get list of chat room' })
  @ApiParam({ name: 'roomId', description: 'ID of the chat room' })
  async getRoomMessages(
    @Param('roomId') roomId: string,
  ) {
    return this.chatService.getRoomMessages(roomId);
  }
}
