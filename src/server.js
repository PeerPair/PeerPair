// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const http = require("http");
const { ExpressPeerServer } = require('peer');


// Esoteric Resources
const errorHandler = require('./middleware/500.js');
const notFound = require('./middleware/404.js');
const authRoutes = require('./auth/routes.js');
const requestRoutes = require('./routes/request.js');
const explore = require('./routes/explore');
const search = require('./routes/search')
const submitRout = require('./routes/submit')
const profileRout = require('./routes/profile')
const acceptRout = require('./routes/accept');
const allRequestRout = require('./routes/all-request');
const homeRout = require('./routes/home-rout');
const notification = require('./routes/notification');
const messegeRout = require('./routes/messege.js');


// Prepare the express app
const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
const multerParse = multer();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{allowEIO3:true});
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
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true,limit: '50mb' }));


//socket Rout
const rooms ={};
app.get('/chat', (req, res) => {
  res.render('index', { rooms: rooms });
});


app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/chat');
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(`/chat/${req.body.room}`);
  // Send message that new room was created
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


// io.on('video', (socket) => {
//   socket.on('join-room', (roomId, userId) => {
//     socket.to(roomId).broadcast.emit('user-connectedd', userId);

//     socket.on('message', (message) => {
//       io.to(roomId).emit('createMessage', message);
//     });
//   });
// });
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connectedd', userId);

    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message);
    });
  });

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
// Routes
app.use(authRoutes);
app.use(requestRoutes);
app.use(submitRout);
app.use(notification);
app.use(profileRout);
app.use(acceptRout);
app.use(allRequestRout);
app.use(homeRout);
app.use(messegeRout);





app.use(explore);
app.use(search)
// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
