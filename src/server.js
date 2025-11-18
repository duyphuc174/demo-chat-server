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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
