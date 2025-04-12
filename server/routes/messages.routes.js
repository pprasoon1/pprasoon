import express from "express";
import Message from "../models/Message.model.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get messages between two users
router.get("/:senderId/:receiverId", verifyToken, async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    
    // Find messages where either user is sender and the other is receiver
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    // Map messages to a consistent format for frontend
    const formattedMessages = messages.map(msg => ({
      senderId: msg.sender.toString(),
      receiverId: msg.receiver.toString(),
      text: msg.text,
      timeStamp: msg.createdAt
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
});

// Save a new message
router.post("/", verifyToken, async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    
    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text
    });

    await newMessage.save();
    
    res.status(201).json({
      message: "Message sent successfully",
      data: {
        senderId,
        receiverId,
        text,
        timeStamp: newMessage.createdAt
      }
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
});

export default router;