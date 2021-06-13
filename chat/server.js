'use strict'; 
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const httpServer=http.createServer(app);
const io = require('socket.io')(http,{cors: {
  origin: '*',
  methods: ['GET', 'POST'],
}});

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

io.listen(httpServer);
const cors = require('cors');
app.use(cors());
app.use(express.static('./public'));
const rooms ={};
app.get('/', (req, res) => {
  res.render('index', { rooms: rooms });
});


app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/');
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(req.body.room);
  // Send message that new room was created
  io.emit('room-created', req.body.room);
});

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/');
  }
  res.render('room', { roomName: req.params.room });
});

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    socket.join(room);
    rooms[room].users[socket.id] = name;
    socket.to(room).emit('user-connected', name);
  });
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).emit('chat-message', { message: message, name: rooms[room].users[socket.id] });
  });
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}

httpServer.listen(process.env.PORT||3030,()=> console.log(`LISTENING On PORT ${process.env.PORT}`));
