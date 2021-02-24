const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  socket.on("play", (playMsg) => {
    io.in(roomId).emit("play", playMsg);
  });

  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const PORT = 4000;

server.listen(PORT, function () {
  console.log(`Express app running on port ${PORT}`);
});
