const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

let users = [];

io.on("connection", (socket) => {
  if (!users.indexOf(socket.id) === -1 && users.length <= 2) {
    users.push(socket.id);
  }
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);
  socket.on("disconnect", () => {
    const newArray = users.filter((user) => user !== socket.id);
    users = newArray;
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log("server is running on port 5000")
);
