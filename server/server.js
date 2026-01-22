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


const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://chat-app-frontend-pwh5.onrender.com" // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, mobile apps
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(express.json({ limit: "4mb" }));


export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
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


app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);


app.get("/api/status", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

const PORT = process.env.PORT || 5000;
await connectDB();
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
