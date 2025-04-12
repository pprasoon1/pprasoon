import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import socket from "../socket"; // Import the shared socket instance

const Chat = ({ currentUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const messagesEndRef = useRef(null);
  const [roomId, setRoomId] = useState(null);

  // Debug current user on mount and when it changes
  useEffect(() => {
    console.log("👤 Current User:", currentUser);
  }, [currentUser]);

  // Debug selected user on mount and when it changes
  useEffect(() => {
    console.log("👥 Selected User:", selectedUser);
  }, [selectedUser]);

  // Track socket connection state
  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Set initial state
    setIsConnected(socket.connected);

    // Cleanup
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  // Extract user ID safely - handle different user object structures
  const getCurrentUserId = () => {
    if (!currentUser) return null;
    // Try different possible structures for the user object
    return currentUser._id || currentUser.id || currentUser.userId || null;
  };

  // Join room and fetch messages when users change
  useEffect(() => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !selectedUser?._id) return;

    // Calculate room ID consistently with backend
    const newRoomId = currentUserId < selectedUser._id
      ? `${currentUserId}_${selectedUser._id}`
      : `${selectedUser._id}_${currentUserId}`;
    
    setRoomId(newRoomId);
    
    // Join the room
    socket.emit("joinRoom", newRoomId);
    console.log("🛏️ Joined room:", newRoomId);

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        // Remove the /api prefix if your axios instance already has it configured
        const res = await axios.get(
          `/messages/${currentUserId}/${selectedUser._id}`
        );
        console.log("📥 Fetched messages:", res.data);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
        console.error("Request config:", err.config);
      }
    };

    fetchMessages();

    // Cleanup when component unmounts or users change
    return () => {
      if (newRoomId) {
        socket.emit("leaveRoom", newRoomId);
        console.log("🚪 Left room:", newRoomId);
      }
    };
  }, [currentUser, selectedUser]);

  // Listen for new messages
  useEffect(() => {
    const receiveMessage = (msg) => {
      console.log("📩 Received message:", msg);
      setMessages(prev => [...prev, msg]);
    };

    socket.on("receiveMessage", receiveMessage);

    return () => {
      socket.off("receiveMessage", receiveMessage);
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    
    const currentUserId = getCurrentUserId();
    
    // Enhanced Validation with better error messages
    if (!newMessage.trim()) {
      console.log("⚠️ Cannot send empty message");
      return;
    }
    
    if (!currentUserId) {
      console.log("⚠️ Current user ID is missing", { currentUser });
      return;
    }
    
    if (!selectedUser?._id) {
      console.log("⚠️ Selected user ID is missing", { selectedUser });
      return;
    }
    
    // Create message object - match the backend expectations
    const messageData = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text: newMessage,
    };
    
    console.log("📤 Sending message:", messageData);
    
    // Send via socket
    socket.emit("sendMessage", messageData);
    
    // Optimistically update UI
    setMessages(prev => [...prev, {
      ...messageData,
      timeStamp: new Date().toISOString()
    }]);
    
    // Clear input
    setNewMessage("");
    
    // Optional: Also save through API
    try {
      // Remove the /api prefix if your axios instance already has it configured
      await axios.post('/messages', messageData);
    } catch (err) {
      console.error("❌ Error saving message via API:", err);
      // The message was still sent via socket, so we don't need to handle this error for the user
    }
  };
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get current user ID for UI rendering
  const currentUserId = getCurrentUserId();
  const canSendMessage = Boolean(currentUserId) && Boolean(selectedUser?._id) && isConnected;

  return (
    <div className="w-3/4 h-full flex flex-col p-4">
      <h2 className="text-xl font-semibold mb-4">
        {selectedUser ? `Chat with ${selectedUser.username}` : "Select a user to chat"}
        {!isConnected && <span className="text-red-500 text-sm ml-2">(Disconnected)</span>}
        {!currentUserId && <span className="text-red-500 text-sm ml-2">(User ID missing)</span>}
      </h2>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2 p-2 border rounded">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded max-w-xs ${
                (msg.senderId === currentUserId || msg.sender === currentUserId)
                  ? "bg-blue-200 self-end ml-auto"
                  : "bg-gray-300 self-start mr-auto"
              }`}
            >
              <div>{msg.text}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timeStamp || msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            {selectedUser ? "No messages yet. Start the conversation!" : "Select a user to start chatting"}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder={selectedUser ? "Type your message..." : "Select a user to chat"}
          disabled={!canSendMessage}
        />
        <button
          type="submit"
          disabled={!canSendMessage || !newMessage.trim()}
          className={`px-4 py-2 rounded text-white ${
            canSendMessage && newMessage.trim()
              ? "bg-blue-500 hover:bg-blue-600" 
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;