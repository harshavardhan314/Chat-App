import express from "express";
import http from "http";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

/* ===================== CORS ===================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* ===================== MIDDLEWARE ===================== */
app.use(express.json({ limit: "4mb" }));

/* ===================== SOCKET.IO ===================== */
export const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

export const onlineUsers = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) onlineUsers[userId] = socket.id;

  // emit all online users to everyone
  io.emit("online-users", Object.keys(onlineUsers));

  socket.on("disconnect", () => {
    if (userId) delete onlineUsers[userId];
    io.emit("online-users", Object.keys(onlineUsers));
  });
});

/* ===================== ROUTES ===================== */
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

/* ===================== STATUS CHECK ===================== */
app.get("/api/status", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

/* ===================== START SERVER ===================== */
const PORT = process.env.PORT || 5000;
await connectDB();
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
