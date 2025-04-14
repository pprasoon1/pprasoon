import { io } from "socket.io-client";

const getToken = () => localStorage.getItem('token');

const socket = io("http://localhost:5000", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
  auth: {
    token: getToken()
  }
});

let isConnected = false;

socket.on("connect", () => {
  console.log("✅ Socket connected");
  isConnected = true;
  const token = getToken();
  if (token) {
    try {
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      socket.emit('login', userId);
      console.log('Logged in with socket:', userId);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
  isConnected = false;
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
  isConnected = true;
  const token = getToken();
  if (token) {
    try {
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      socket.emit('login', userId);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
  isConnected = false;
});

// Add helper methods
const emitMessage = (messageData) => {
  if (isConnected) {
    socket.emit('sendMessage', messageData);
    console.log('📤 Emitting message:', messageData);
  } else {
    console.error('❌ Socket not connected, cannot send message');
  }
};

const joinRoom = (roomId) => {
  if (isConnected) {
    socket.emit('joinRoom', roomId);
    console.log('📦 Joining room:', roomId);
  } else {
    console.error('❌ Socket not connected, cannot join room');
  }
};

const leaveRoom = (roomId) => {
  if (isConnected) {
    socket.emit('leaveRoom', roomId);
    console.log('🚪 Leaving room:', roomId);
  }
};

export { socket as default, emitMessage, joinRoom, leaveRoom };