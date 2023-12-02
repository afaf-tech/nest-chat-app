import { Test, TestingModule } from "@nestjs/testing";
import { ChatGateway } from "./chat.gateway";
import { INestApplication, Logger } from "@nestjs/common";
import { Socket, io } from "socket.io-client";

async function createNestApp(...gateways: any[]): Promise<INestApplication> {
  const testingModule: TestingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();

  return testingModule.createNestApplication();
}

describe("ChatGateway", () => {
  let gateway: ChatGateway;
  let app: INestApplication;
  let ioClient: Socket;
  let ioClient2: Socket;

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp(ChatGateway);
    // Get the gateway instance from the app instance
    gateway = app.get<ChatGateway>(ChatGateway);
    // Create a new client that will interact with the gateway
    ioClient = io("http://localhost:3000", {
      autoConnect: false,
      transports: ["websocket"],
    });
    ioClient2 = io("http://localhost:3000", {
      autoConnect: false,
      transports: ["websocket"],
    });

    await app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

//   it('should emit "pong" on "ping"', (done) => {
//     ioClient.connect();
  
//     ioClient.on("connect", () => {
//       console.debug("connected");
  
//       ioClient.emit("ping", "Hello world!");
  
//       ioClient.on("sendMessage", (data) => {
//         expect(data).toBe("Hello world!");
//         ioClient.disconnect();
//       });
//       done(); // Call done() here once the asynchronous code completes
//     });
//   }, 60000);
    it('should do message flow', (done) => {
        // Connect to the server
        ioClient.connect();

        ioClient.on('connect', () => {
            console.log('connected');

            // Get the socket ID after connecting
            const socketId = ioClient.id;

            // Emit the 'joinRoom' event with the correct room and socket ID
            ioClient.emit('joinRoom', { room: 'holand', socketId: socketId});

            // Listen for the 'joinedRoom' event
            ioClient.on('joinedRoom', (data) => {
                console.log(data);
                let message1 = 'Hello from here';

                // Emit the 'sendMessage' event
                ioClient.emit('sendMessage', {message: message1, room: 'holand', username: 'John'});

                // Listen for the 'message' event
                ioClient.on('message', (message) => {
                    console.log('Received message:', message);
                    expect(message).toBe(message1);
                    ioClient.disconnect()
                    done(); // Call done() when the test is complete

                });
            });
        });
    }, 10000);

    it('should do message flow1', (done) => {
        // Connect to the server
        ioClient2.connect();

        ioClient2.on('connect', () => {
            console.log('connected');

            // Get the socket ID after connecting
            const socketId = ioClient2.id;

            // Emit the 'joinRoom' event with the correct room and socket ID
            ioClient2.emit('joinRoom', { room: 'holand', socketId: socketId});

            // Listen for the 'joinedRoom' event
            ioClient2.on('joinedRoom', (data) => {
                console.log(data);
                let message1 = 'Hello from here';

                // Emit the 'sendMessage' event
                ioClient2.emit('sendMessage', {message: message1, room: 'holand', username: 'John'});

                // Listen for the 'message' event
                ioClient2.on('message', (message) => {
                    console.log('Received message:', message);
                    expect(message).toBe(message1);
                    done()
                });
            });
        });
    }, 10000);
  

});