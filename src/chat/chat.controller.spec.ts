import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose'; // Assuming you use mongoose
import { Message, Room } from './chat.model';
import { Model } from 'mongoose';

describe('ChatController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        ChatService,
        {
          provide: getModelToken('Room'), 
          useValue: {},
        },
        {
          provide: getModelToken('Message'), 
          useValue: {},
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/GET chat/rooms', async () => {
    const spy = jest.spyOn(app.get(ChatService), 'getRooms').mockResolvedValueOnce([]); // Mock the getRooms method
    const response = await request(app.getHttpServer()).get('/chat/rooms');
    expect(response.status).toBe(200);
    expect(spy).toHaveBeenCalled();
  });

  it('/POST chat/rooms', async () => {
    const roomData: Partial<Room> = { name: 'TestRoom', participants: [] };
    const mockRoom = {
      ...roomData,
      $save: jest.fn().mockResolvedValue(roomData as Room), // Mock the $save method
    };
  
    const spy = jest.spyOn(app.get(ChatService), 'createRoom').mockResolvedValueOnce(mockRoom as Room); // Mock the createRoom method
    const response = await request(app.getHttpServer()).post('/chat/rooms').send(roomData);
    expect(response.status).toBe(201);
    expect(spy).toHaveBeenCalledWith(roomData.name);
  });
  

  it('/POST chat/rooms/:roomId/messages', async () => {
    const roomId = 'someRoomId';
    const messageData = { content: 'TestMessage', sender: 'TestUser' };
  
    // Create a mock Message object
    const mockMessage: Partial<Message> = {
      content: messageData.content,
      sender: messageData.sender,
      save: jest.fn().mockResolvedValue({} as Message), // Mock the $save method
    };
  
    const spy = jest.spyOn(app.get(ChatService), 'addMessageToRoom').mockResolvedValueOnce(mockMessage as Message); // Mock the addMessageToRoom method
    const response = await request(app.getHttpServer())
      .post(`/chat/rooms/${roomId}/messages`)
      .send(messageData);
  
    expect(response.status).toBe(201);
    expect(spy).toHaveBeenCalledWith(roomId, messageData.content, messageData.sender);
  });
  

  it('/GET chat/rooms/:roomId/messages', async () => {
    const roomId = 'someRoomId';
    const spy = jest.spyOn(app.get(ChatService), 'getRoomMessages').mockResolvedValueOnce([]); // Mock the getRoomMessages method
    const response = await request(app.getHttpServer()).get(`/chat/rooms/${roomId}/messages`);
    expect(response.status).toBe(200);
    expect(spy).toHaveBeenCalledWith(roomId);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    if (app) {
      await app.close();
    }
  });
});
