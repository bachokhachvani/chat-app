const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const { addUser, removeUser, getUser, getUsersRoom } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT;
port = PORT || 3000;

const chatAppPath = path.join(__dirname, "../public");
app.use(express.static(chatAppPath));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit("message", generateMessage("welcome", "admin"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(`${user.username} has joined!`, "admin")
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      list: getUsersRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (msg, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback("Profanity is not allowed!");
    }

    io.to(user.room).emit("message", generateMessage(msg, user.username));
    callback();
  });

  socket.on("sendLocation", ({ lat, lon }, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${lat},${lon}`,
        user.username
      )
    );
    callback("location shared!");
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left!`, "admin")
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        list: getUsersRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log("server is running on " + port);
});
