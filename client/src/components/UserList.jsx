import { useEffect, useState } from "react";
import axios from "../api/axios";

const UserList = ({ onSelectUser, currentUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/auth/users");
        if (currentUser?.isAdmin) {
          // Admin can see all users except themselves
          setUsers(response.data.filter(user => user._id !== currentUser.id));
        } else {
          // Regular users can only see admin
          setUsers(response.data.filter(user => user.isAdmin));
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">
        {currentUser?.isAdmin ? "Chat with Users" : "Chat with Admin"}
      </h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="font-medium">{user.username}</div>
            {user.isAdmin && (
              <div className="text-sm text-blue-600">Admin</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
