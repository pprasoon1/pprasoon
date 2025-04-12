import { useEffect, useState } from "react";
import axios from "../api/axios"; // ✅ FIXED
// Make sure this points to the same axios file you used in login/signup

const UserList = ({ onSelectUser, currentUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/auth/users");
        if (currentUser?._id) {
          const filtered = res.data.filter(u => u._id !== currentUser._id);
          setUsers(filtered);
        } else {
          setUsers(res.data); // Fallback — just in case
        }
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
  
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);
  

  return (
    <div className="w-1/4 border-r h-full p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-3">Users</h3>
      {users.map(user => (
        <div
          key={user._id}
          className="p-2 cursor-pointer hover:bg-gray-200 rounded"
          onClick={() => onSelectUser(user)}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default UserList;
