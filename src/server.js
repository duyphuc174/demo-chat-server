import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

import http from "http";
import cors from "cors";
import route from "./routes/index.js";
import SocketService from "./services/SocketService.js";

connectDB();

app.use(cors());
route(app);

const server = http.createServer(app);
// Socket connection
SocketService.init(server)

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
