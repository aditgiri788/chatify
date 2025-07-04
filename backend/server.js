import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import User from "./models/user.js";

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
  },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", async () => {
      console.log("User disconnected:", userId);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      try {
        await User.findByIdAndUpdate(userId, {lastSeen: new Date()});
      } catch (error) {
        console.log(error);
      }
    });
  }
});

// Middlewares
app.use(express.json({ limit: "4mb" }));
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true                                           
}));
app.use(cookieParser());

app.get('/', (req, res)=>{
  res.status(200).json({
    message: "Welcome to Chatify API",
  })
});
app.use("/api/status", (req, res) => res.send("Server is running"));
app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

// Connect to MongoDB and start server
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is on the Port: " + PORT));
