import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import authRouter from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import messageRouter from "./routes/messages.routes.js";
import Message from "./models/Message.model.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/messages", messageRouter);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
});

// Keep track of active rooms
const activeRooms = new Set();

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // User joins a room based on userId combination
  socket.on("joinRoom", (roomId) => {
    if (!roomId) {
      console.error("❌ Attempted to join invalid room:", roomId);
      return;
    }
    
    socket.join(roomId);
    activeRooms.add(roomId);
    console.log(`📦 Socket ${socket.id} joined room: ${roomId}`);
  });

  // When a message is sent
  socket.on("sendMessage", async (messageData) => {
    try {
      const { senderId, receiverId, text } = messageData;
      
      if (!senderId || !receiverId || !text) {
        console.error("❌ Invalid message data:", messageData);
        return;
      }

      // Save the message to DB
      const newMessage = new Message({ 
        sender: senderId, // Adjust field names if your model uses different names
        receiver: receiverId, 
        text 
      });
      
      await newMessage.save();

      // Create a consistent roomId using lexicographical order
      const roomId = senderId < receiverId
          ? `${senderId}_${receiverId}`
          : `${receiverId}_${senderId}`;

      // Format message for client consumption
      const messageForClient = {
        senderId,
        receiverId,
        text,
        timeStamp: newMessage.createdAt,
      };

      // Emit message to all clients in the room
      io.to(roomId).emit("receiveMessage", messageForClient);

      console.log(`📤 Message sent to room ${roomId}:`, text);
    } catch (err) {
      console.error("❌ Message saving failed:", err);
    }
  });

  socket.on("leaveRoom", (roomId) => {
    if (roomId) {
      socket.leave(roomId);
      console.log(`🚪 Socket ${socket.id} left room: ${roomId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello World");
});