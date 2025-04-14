import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const { user, logout } = useAuth();  // Add logout to destructuring

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/blogs');
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <div className="flex items-center gap-4">
          {user?.isAdmin && (
            <Link
              to="/editor"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Blog
            </Link>
          )}
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2">By: {blog.author?.username || 'Unknown'}</p>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Category: {blog.category || 'Uncategorized'}
                </span>
                <Link
                  to={`/blogs/${blog._id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
