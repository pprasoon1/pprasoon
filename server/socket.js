import { Server } from "socket.io";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
  });

  const users = new Map();

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("login", (userId) => {
      users.set(userId, socket.id);
      console.log(`👤 User ${userId} logged in with socket ${socket.id}`);
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`📦 Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on("sendMessage", async (messageData) => {
      const { senderId, receiverId, text } = messageData;
      
      // Create room ID consistently
      const roomId = [senderId, receiverId].sort().join('_');
      
      // Broadcast to room
      io.to(roomId).emit("receiveMessage", messageData);
      console.log(`📤 Message sent to room ${roomId}:`, text);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`🚪 Socket ${socket.id} left room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      // Remove user from users map
      for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

export default initSocket;