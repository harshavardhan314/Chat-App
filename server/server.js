import express from "express";
import http from "http";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Track online users
export const onlineUsers = {}; // { userId: socketId }

// Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected with ID:", userId);

  if (userId) onlineUsers[userId] = socket.id;

  // Emit updated online users list
  io.emit("online-users", Object.keys(onlineUsers));

  socket.on("disconnect", () => {
    console.log("User disconnected with ID:", userId);
    if (userId) delete onlineUsers[userId];
    io.emit("online-users", Object.keys(onlineUsers));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Test route
app.get("/api/status", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

try {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (err) {
  console.error("Failed to connect to DB:", err);
}
