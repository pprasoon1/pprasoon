import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const { user, logout } = useAuth();

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
    <div>
      <header>
        <h1>📝 My Blog</h1>
        {user ? (
          <>
            <span>Hi, {user.username}</span>
            <button onClick={logout}>Logout</button>
            <Link to="/editor">Create Blog</Link>
          </>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </header>

      <div>
      {blogs.map(blog => (
  <div key={blog._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
    <h2>{blog.title}</h2>
    <p>By: {blog.author?.username || 'Unknown'}</p> {/* 🛡 Safe access */}
    <p>{blog.content.slice(0, 100)}...</p>
    <p>Category: {blog.category || 'Uncategorized'}</p>
<p>Tags: {blog.tags?.join(', ')}</p>
    <Link to={`/blogs/${blog._id}`}>Read more</Link>
  </div>
))}
      </div>
    </div>
  );
}
