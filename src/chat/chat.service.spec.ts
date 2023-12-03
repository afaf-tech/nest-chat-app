import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, Room } from './chat.model';
import { Model } from 'mongoose';

const mockRoom = {
    name: 'holand',
    creatorId: "c23",
    hostId: "c23",
    participants: [],
};
const mockMessage = {
    content: 'Hello world!',
    createdAt: new Date(),
    sender: "igdfsa3",
    roomId: "rsdaf3"
};

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let service: ChatService;
  let module: TestingModule;
  let roomModel: Model<Room>;
  let messageModel: Model<Message>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ChatService,
        {
            provide: 'RoomModel',
            useValue: {
                new: jest.fn().mockResolvedValue(mockRoom),
                constructor: jest.fn().mockResolvedValue(mockRoom),
                find: jest.fn(),
                create: jest.fn(),
                save: jest.fn(),
                exec: jest.fn(),
            },
        },
        {
            provide: 'MessageModel',
            useValue: {
                new: jest.fn().mockResolvedValue(mockMessage),
                constructor: jest.fn().mockResolvedValue(mockMessage),
                find: jest.fn(),
                create: jest.fn(),
                save: jest.fn(),
                exec: jest.fn(),
            },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    roomModel = module.get<Model<Room>>('RoomModel');
    messageModel = module.get<Model<Message>>('MessageModel');
  });

  it('should createRoom', async () => {
    jest.spyOn(roomModel, 'create').mockImplementationOnce(() =>
        Promise.resolve({
            name: 'holand',
            creatorId: "c23",
            hostId: "c23",
            participants: [],
        } as any),
    );

    const newRoom = await service.createRoom("holand", "c23")
    expect(newRoom).toEqual(mockRoom)
  });

    it('should get empty Rooms', async () => {
        jest.spyOn(roomModel, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce([]),
        } as any);
        const rooms = await service.getRooms();
        expect(rooms).toEqual([]);
    });

    it('should get empty Messages', async () => {
        jest.spyOn(messageModel, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce([]),
        } as any);
        const cats = await service.getRoomMessages("holand");
        expect(cats).toEqual([]);
    });

});
