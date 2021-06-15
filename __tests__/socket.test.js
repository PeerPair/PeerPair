'use strict';
const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const faker = require('faker');
let id;
const {expect} = require('@jest/globals');
describe('Socket', () => {
  let io, serverSocket, clientSocket;
  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });
  afterAll(() => {
    io.close();
    clientSocket.close();
  });

    it('should `join-room` event work', (done) => {
        clientSocket.on('join-room', (room) => {
        console.log("ROOM", room);
        console.log("ROOM-NAME", room.roomName);
        expect(room.userId).toBe(userId);
        expect(room.roomId).toBe(1234);
        done();
    });
        let userId = 111;
        let roomId = 1234;
        serverSocket.emit('join-room', ({userId: userId, roomId: roomId }));
    });

    it('should `join-room` event work', (done) => {
        clientSocket.on('user-connected', (name) => {
        expect(name.name).toBe(firstName);
        done();
                });
    let firstName = faker.name.firstName();
    serverSocket.emit('user-connected', ({name:firstName}));
                          });     

    it('should `send a chat-message`', (done) => {
        clientSocket.on('chat-message', (data) => {
        expect(data.name).toBe(firstName);
        expect(data.message).toBe(sendedMsg);
            done();
    });
        let firstName = faker.name.firstName();
        let sendedMsg = 'hello'
        serverSocket.emit('chat-message', ({name:firstName,message:sendedMsg }));
    });     
    it('should `user-disconnected`', (done) => {
        clientSocket.on('user-disconnected', (data) => {
        expect(data.name).toBe(firstName);        
            done();
    });
    let firstName = faker.name.firstName();
    serverSocket.emit('user-disconnected', ({name:firstName}));
});                                  
});

