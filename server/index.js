import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import messageRoutes from "./routes/message.routes.js";
import Message from "./models/Message.model.js";
import initSocket from './socket.js';  // Add this import

dotenv.config();
const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'your_production_domain' 
    : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// API routes
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/messages", messageRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientPath = path.join(__dirname, '../client/dist');
  
  app.use(express.static(clientPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

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