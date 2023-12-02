// import { Test, TestingModule } from '@nestjs/testing';
// import { ChatGateway } from './chat.gateway';
// import { ChatService } from './chat.service';
// import { Message } from './chat.model';
// import { getModelToken } from '@nestjs/mongoose';

// describe('ChatGateway', () => {
//   let gateway: ChatGateway;
//   let service: ChatService;
//   let moduleFixture: TestingModule;

//   beforeEach(async () => {
//     moduleFixture = await Test.createTestingModule({
//       providers: [
//         ChatGateway,
//         ChatService,
//         {
//             provide: getModelToken('Room'), 
//             useValue: {},
//           },
//           {
//             provide: getModelToken('Message'), 
//             useValue: {},
//           },
//       ],
//     }).compile();

//     gateway = moduleFixture.get<ChatGateway>(ChatGateway);
//     service = moduleFixture.get<ChatService>(ChatService);
//   });

//   afterEach(async () => {
//     await moduleFixture.close();
//   });

//   it('should handle joinRoom event', async () => {
//     const mockClient = { join: jest.fn() } as any;
//     const emitSpy = jest.spyOn(gateway.server, 'to').mockReturnThis();

//     await gateway.handleJoinRoom('mockRoom', 'mockUsername', mockClient);

//     expect(mockClient.join).toHaveBeenCalledWith('mockRoom');
//     expect(emitSpy).toHaveBeenCalledWith('mockRoom');
//     expect(emitSpy).toHaveBeenCalledWith('joinedRoom', 'mockUsername joined mockRoom');
//   });

//   it('should handle sendMessage event', async () => {
//     const saveMessageSpy = jest.spyOn(service, 'addMessageToRoom').mockResolvedValueOnce({ _id: 'mockMessageId', content: 'Hello!', sender: 'Mock Sender', roomId: 'mockRoomId' } as Message);
//     const emitSpy = jest.spyOn(gateway.server, 'to').mockReturnThis();

//     await gateway.handleSendMessage('Hello!', 'mockRoomId', 'Mock Sender');

//     expect(saveMessageSpy).toHaveBeenCalledWith('mockRoomId', 'Hello!', 'Mock Sender');
//     expect(emitSpy).toHaveBeenCalledWith('mockRoomId');
//     expect(emitSpy).toHaveBeenCalledWith('message', { _id: 'mockMessageId', content: 'Hello!', sender: 'Mock Sender', roomId: 'mockRoomId' });
//   });

//   // Add more tests for other methods or events...

//   // Example test for another method or event
// //   it('should handle another event correctly', async () => {
// //     // Mock WebSocket connection.
// //     const mockClient = {
// //       join: jest.fn(),
// //     };

// //     // Call another method or event.
// //     await gateway.handleAnotherEvent(/* provide necessary parameters */);

// //     // Expect the desired behavior.
// //     // Add appropriate expectations based on the behavior of handleAnotherEvent.
// //   });
// });
