import { useState, useEffect, useRef } from "react";
import socket, { emitMessage, joinRoom, leaveRoom } from "../socket";
import axios from "../api/axios";

const Chat = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedUser?._id || !currentUser?.id) return;

    const roomId = [currentUser.id, selectedUser._id].sort().join('_');
    
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/messages/${selectedUser._id}`);
        setMessages(response.data);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    joinRoom(roomId);

    const handleReceiveMessage = (message) => {
      console.log('📩 Received message:', message);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      leaveRoom(roomId);
    };
  }, [selectedUser?._id, currentUser?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        senderId: currentUser.id,
        receiverId: selectedUser._id,
        text: newMessage.trim()
      };

      emitMessage(messageData);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${
              message.senderId === currentUser.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                message.senderId === currentUser.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timeStamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;