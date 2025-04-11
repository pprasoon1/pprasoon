import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/blogs/${id}`);
      navigate('/');
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/">⬅ Back</Link>
      <h1>{blog.title}</h1>
      <ReactMarkdown>{blog.content}</ReactMarkdown>
      <p>By: {blog.author.username}</p>
      <p><strong>Category:</strong> {blog.category}</p>
<p><strong>Tags:</strong> {blog.tags?.join(', ')}</p>

      {user && user.id === blog.author._id && (
        <>
          <Link to="/editor" state={{ blog }}>✏️ Edit</Link>
          <button onClick={handleDelete}>🗑️ Delete</button>
        </>
      )}
    </div>
  );
}
