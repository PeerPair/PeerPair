// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const http = require('http');
const { ExpressPeerServer } = require('peer');

// Esoteric Resources
const messege = require('./models/chat/messege.js');
const errorHandler = require('./middleware/500.js');
const notFound = require('./middleware/404.js');
const authRoutes = require('./auth/routes.js');
const requestRoutes = require('./routes/request.js');
const explore = require('./routes/explore');
const search = require('./routes/search');
const submitRout = require('./routes/submit');
const profileRout = require('./routes/profile');
const acceptRout = require('./routes/accept');
const allRequestRout = require('./routes/all-request');
const chatList = require('./routes/roomList');
const homeRout = require('./routes/home-rout');
const notification = require('./routes/notification');
const messegeRout = require('./routes/messege.js');
var debug = require('debug')('screen-share:server');

// Prepare the express app
const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
const multerParse = multer();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Peer
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
// App Level MW
app.use('/peerjs', peerServer);
app.use(express.static('./public'));
app.use(multerParse.none());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//socket Rout
const rooms = {};
const users = {};
const socketToRoom = {};
app.get('/chat', (req, res) => {
  res.render('index', { rooms: rooms });
});

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/chat');
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(`/chat/${req.body.room}`);

  io.emit('room-created', req.body.room);
});

app.get('/chat/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/chat');
  }
  res.render('room', { roomName: req.params.room });
});

app.get('/video/:room', (req, res) => {
  res.render('video', { roomId: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join room', (roomID) => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 0) {
        socket.to(roomID).emit('chat-message', {
          senderName: 'PeerPair Bot',
          message:
            'the Video call has been started, you can join by pressing on "Join Button"',
        });
        io.to(roomID).emit('reciveCall',true);

      }
      if (length === 4) {
        socket.emit('room full');
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
      socket.to(roomID).emit('chat-message', {
        senderName: 'PeerPair Bot',
        message:
        'the Video call has been started, you can join by pressing on "Join Button"',
      });
      io.to(roomID).emit('reciveCall',true);
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit('all users', usersInThisRoom);
  });

  socket.on('sending signal', (payload) => {
    io.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });
  
  socket.on('returning signal', (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
  });
  
  socket.on('disconnect', () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
      if (users[roomID].length === 0)
        {socket.to(roomID).emit('chat-message', {
          senderName: 'PeerPair Bot',
          message: 'the Video call has been Ended',
        });
        io.to(roomID).emit('reciveCall',false);
      }
    }
  });
  
  socket.on('join-room', async (roomID) => {
    const oldMessages = await messege.find({ room_id: roomID });
    socket.join(roomID);
    socket.on('message', async (message) => {
      io.to(roomID).emit('createMessage', message);
    });
    if(users[roomID] && users[roomID].length > 0) io.to(roomID).emit('reciveCall',true);
  });

  socket.on('new-user', (room, name) => {
    socket.join(room);
    socket.to(room).emit('user-connected', name);
  });
  socket.on('send-chat-message', async (room, newmessage) => {
    socket.to(room).emit('chat-message', newmessage);
    io.emit('hi');
    console.log(newmessage);
    await messege.create({
      messege: newmessage.message,
      sender_id: newmessage.senderID,
      sender_name: newmessage.senderName,
      room_id: room,
      messege_time: new Date(),
    });
  });
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach((room) => {
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
// Routes
app.use(authRoutes);
app.use(requestRoutes);
app.use(submitRout);
app.use(notification);
app.use(profileRout);
app.use(acceptRout);
app.use(chatList);
app.use(allRequestRout);
app.use(homeRout);
app.use(messegeRout);

app.use(explore);
app.use(search);
// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    server.listen(port, (err) => {
      if (err) return console.log(err);
      console.log(`Server Up on ${port}`);
    });
  },
};
