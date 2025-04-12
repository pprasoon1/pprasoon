import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserList from "../components/UserList";
import Chat from "../components/Chat";

const ChatPage = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen">
      <UserList onSelectUser={setSelectedUser} currentUser={user} />
      <div className="flex-1 p-4">
        {selectedUser ? (
          <Chat selectedUser={selectedUser} currentUser={user} />
        ) : (
          <div className="text-gray-500">Select a user to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
