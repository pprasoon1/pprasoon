import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import http from "http";

import authRouter from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import messageRoutes from "./routes/message.routes.js";
import Message from "./models/Message.model.js";
import initSocket from './socket.js';  // Add this import

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/messages", messageRoutes);

// Initialize socket using the separate socket.js file
const io = initSocket(server);

// Remove the existing socket implementation since we're using the one from socket.js

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