// src/chat/chat.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, ref: 'User' })
  sender: string;

  @Prop({ required: true, ref: 'Room' })
  roomId: string; // Added roomId to associate the message with a room
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema()
export class Room extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [{ type: 'ObjectId', ref: 'User' }] })
  participants: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
