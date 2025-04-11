import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function BlogEditor() {
  const location = useLocation();
  const blogToEdit = location.state?.blog || null;

  const [title, setTitle] = useState(blogToEdit?.title || "");
  const [content, setContent] = useState(blogToEdit?.content || "");
  const [tags, setTags] = useState(blogToEdit?.tags?.join(", ") || "");
  const [category, setCategory] = useState(blogToEdit?.category || "");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (blogToEdit) {
        await axios.put(`/blogs/${blogToEdit._id}`, {
          title,
          content,
          category,
          tags: tags.split(",").map((tag) => tag.trim()),
        });
      } else {
        await axios.post("/blogs", {
          title,
          content,
          category,
          tags: tags.split(",").map((tag) => tag.trim()),
        });
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to save blog.");
    }
  };

  return (
    <div>
      <h1>{blogToEdit ? "Edit Blog" : "Create Blog"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
        <textarea
          placeholder="Write your blog here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ width: "100%" }}
          required
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ display: "block", marginBottom: "1rem" }}
        />
        <input
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ display: "block", marginBottom: "1rem" }}
        />
        <button type="submit">
          {blogToEdit ? "Update Blog" : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}
