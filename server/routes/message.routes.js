import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Message from "../models/Message.model.js";

const router = express.Router();

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.userId }
      ]
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const message = new Message({
      senderId: req.userId,
      receiverId: req.body.receiverId,
      text: req.body.text
    });
    
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to save message" });
  }
});

export default router;