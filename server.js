const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

require("dotenv").config();

app.use(logger("dev"));
app.use(express.json());

app.use(favicon(path.join(__dirname, "build", "favicon.ico")));
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
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
const port = process.env.PORT || 4000;

server.listen(port, function () {
  console.log(`Express app running on port ${port}`);
});
