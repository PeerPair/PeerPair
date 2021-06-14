// 3rd Party Resources
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// Esoteric Resources
const errorHandler = require("./middleware/500.js");
const notFound = require("./middleware/404.js");
const authRoutes = require("./auth/routes.js");
const requestRoutes = require("./routes/request.js");
const explore = require("./routes/explore");
const search = require("./routes/search");
const submitRout = require("./routes/submit");
const profileRout = require("./routes/profile");
const acceptRout = require("./routes/accept");
const allRequestRout = require("./routes/all-request");
const homeRout = require("./routes/home-rout");
const messageRout = require("./routes/message.js");

// Prepare the express app

const multerParse = multer();

// App Level MW

app.use(multerParse.none());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.set("views", "./views");
app.set("view engine", "ejs");

// socket routes
//list of messages
app.get("/rooms", (req, res) => {
  res.render("index");
});

app.get("/room/:id", (req, res) => {
  res.render("room", { roomName: req.params.room });
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

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("join", (room,name) => {
    socket.join(room);
    console.log(name+"user joined" + room);
  });
  // socket.on("send-chat-message", (room, message) => {
  //   socket
  //     .to(req.params.room)
  //     .emit("chat-message", {
  //       message: message,
  //       name: rooms[room].users[socket.id],
  //     });
  // });
});

//socket connection

// Routes
app.use(authRoutes);
app.use(requestRoutes);
app.use(submitRout);
app.use(profileRout);
app.use(acceptRout);
app.use(allRequestRout);
app.use(homeRout);
app.use(messageRout);

app.use(explore);
app.use(search);
// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: server,
  start: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
