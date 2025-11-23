import jwt from "jsonwebtoken";
import { Server } from "socket.io";

const SocketService = {
  io: null,
  onlineUsers: new Map(),

  init(server) {
    // kết nối socket server
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth?.token;

      if (!token) return next(new Error("NO_TOKEN"));

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        socket.user = decoded;
        next();
      } catch (e) {
        next(new Error("INVALID_TOKEN"));
      }
    });

    this.io.on("connection", (socket) => {
      const userId = socket.user.id;

      // Lưu socket
      this.onlineUsers.set(userId, socket.id);
      console.log("User connected", userId, socket.id);

      socket.on("conversation:join", (conversationId) => {
        socket.join(conversationId);
      });

      socket.on("disconnect", () => {
        this.onlineUsers.delete(userId);
        console.log("User disconnected", userId);
      });
    });
  },

  emitCoversation(conversation) {
    if (!this.io) {
      return;
    }

    const { members } = conversation;
    const userIds = members.map((member) => member.toString());

    userIds.forEach((userId) => {
      const socketId = this.onlineUsers.get(userId);
      if (socketId) {
        this.io.to(socketId).emit("conversation:new", conversation);
      }
    });
  },

  emitMessage(message, conversationId) {
    if (!this.io) {
      return;
    }

    this.io.in(conversationId).emit("message:new", message);
  },
};

export default SocketService;
