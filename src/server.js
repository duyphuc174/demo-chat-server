import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import route from "./routes/index.js";

connectDB();

app.use(cors());
route(app);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Socket connection
io.on("connection", (socket) => {
  let room = null;

  socket.on("joinRoom", (newRoom) => {
    if (!newRoom) return;

    // Rời room cũ nếu có
    if (room) {
      socket.leave(room);
    }

    // Join room mới
    socket.join(newRoom);
    room = newRoom;

    console.log(`Socket ${socket.id} joined room: ${newRoom}`);
  });

  socket.on("sendMessage", (data) => {
    socket.in(room).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
