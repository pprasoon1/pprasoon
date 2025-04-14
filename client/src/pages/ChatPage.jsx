import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserList from "../components/UserList";
import Chat from "../components/Chat";

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100 pt-16">
      <UserList onSelectUser={setSelectedUser} currentUser={user} />
      <div className="flex-1 p-4">
        {selectedUser ? (
          <Chat selectedUser={selectedUser} currentUser={user} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {user.isAdmin 
              ? "Select a user to start chatting"
              : "Select admin to start chatting"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
