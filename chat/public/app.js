'use strict';

let socket = io();

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const roomContainer = document.getElementById('room-container');

if (messageForm != null) {
  const name = prompt('What is your name?');
  appendMessage('You joined');
  socket.emit('new-user', roomName, name);
  // socket.on('oldChat', data=>{
  //   if(data.messageStoreArray){
  //     console.log('DATA',data);
  //     data.messageStoreArray.forEach(element=>{
  //       appendMessage(` ${element.username} : ${element.message}`);
  //     });
  //   }});

  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', roomName, message);
    messageInput.value = '';
  });
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div');
  roomElement.innerText = room;
  const roomLink = document.createElement('a');
  roomLink.href = `/${room}`;
  roomLink.innerText = 'join';
  roomContainer.append(roomElement);
  roomContainer.append(roomLink);
});

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`);
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}