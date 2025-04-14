import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import Blog from "../models/Blog.model.js"



const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username email');
    res.status(200).json(blogs);
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
});

//Create Blog
router.post('/', verifyToken, isAdmin, async(req, res) => {
    try {
        const { title, content, category, tags } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const blog = new Blog({
            title,
            content,
            category,
            tags,
            author: req.userId
        });

        const savedBlog = await blog.save();
        const populatedBlog = await Blog.findById(savedBlog._id).populate('author', 'username');
        
        res.status(201).json(populatedBlog);
    } catch (error) {
        console.error('Blog creation error:', error);
        res.status(500).json({ 
            message: 'Failed to create blog', 
            error: error.message 
        });
    }
});



// Get Single Blog
router.get('/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id).populate('author', 'username');
      if (!blog) return res.status(404).json({ message: 'Not found' });
      res.json(blog);
    } catch (err) {
      res.status(500).json({ message: 'Fetch failed', error: err.message });
    }
  });

// Update Blog
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog || blog.author.toString() !== req.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Update failed', error: err.message });
    }
  });

  // Delete Blog
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog || blog.author.toString() !== req.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Delete failed', error: err.message });
    }
  });

export default router