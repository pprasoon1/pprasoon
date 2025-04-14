import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function BlogEditor() {
  const location = useLocation();
  const blogToEdit = location.state?.blog || null;
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState(blogToEdit?.title || "");
  const [content, setContent] = useState(blogToEdit?.content || "");
  const [tags, setTags] = useState(blogToEdit?.tags?.join(", ") || "");
  const [category, setCategory] = useState(blogToEdit?.category || "");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const blogData = {
        title,
        content,
        category,
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      };

      if (blogToEdit) {
        await axios.put(`/blogs/${blogToEdit._id}`, blogData);
      } else {
        await axios.post("/blogs", blogData);
      }
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save blog");
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {blogToEdit ? "Edit Blog" : "Create New Blog"}
      </h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Blog Content"
            className="w-full p-2 border rounded h-64"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {blogToEdit ? "Update Blog" : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
