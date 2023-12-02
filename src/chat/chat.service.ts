// src/chat/chat.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Room, Message } from './chat.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Room.name) private readonly RoomModel: Model<Room>,
    @InjectModel(Message.name) private readonly MessageModel: Model<Message>,
  ) {}

  async createRoom(name: string): Promise<Room> {
    //TODO: add the creator to be the participants
    const room = new this.RoomModel({ name, participants: [] });
    return await room.save();
  }

  async getRooms(): Promise<Room[]> {
    return await this.RoomModel.find().exec();
  }

  async addMessageToRoom(roomId: string, content: string, sender: string): Promise<Message> {
    // Check if the room exists
    const room = await this.RoomModel.findById(roomId);
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found.`);
    }

    // Room exists, add the message
    const message = new this.MessageModel({ content, sender, roomId });
    await message.save();

    return message;
  }

  async getRoomMessages(roomId: string): Promise<Message[]> {
    // Retrieve historical messages for a specific chat room.
    return this.MessageModel.find({ roomId }).exec();
  }
}
