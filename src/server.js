// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const http = require('http');
const httpServer=http.createServer(app);
const io = require('socket.io')(http,{cors: {
  origin: '*',
  methods: ['GET', 'POST'],
}});
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
// socket routes
//list of messages
app.get('/rooms', (req, res) => {
  res.render('index', { rooms: rooms });
});

// app.post('/room', (req, res) => {
//   if (rooms[req.body.room] != null) {
//     return res.redirect('/');
//   }
//   rooms[req.body.room] = { users: {} };
//   res.redirect(req.body.room);
//   // Send message that new room was created
//   io.emit('room-created', req.body.room);
// });

app.get('/room/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/room');
  }
  res.render('room', { roomName: req.params.room });
});

//socket connection
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
    // getUserRooms(socket).forEach(room => {
    //   socket.to(room).emit('user-disconnected', rooms[room].users[socket.id]);
    //   delete rooms[room].users[socket.id];
    // });
  });
});

// Prepare the express app
app.set('views', './views');
app.set('view engine', 'ejs');
io.listen(httpServer);
const app = express();
const multerParse = multer();

// App Level MW
app.use(multerParse.none());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use(authRoutes);
app.use(requestRoutes);
app.use(submitRout);
app.use(profileRout);
app.use(acceptRout);
app.use(allRequestRout);
app.use(homeRout);


app.use(explore);
app.use(search)
// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: httpServer,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
