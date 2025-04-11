import express from "express";
import { verifyToken } from "../middleware/auth.js";
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
router.post('/', verifyToken, async(req, res)=> {
    try {
        const blog = new Blog({...req.body, author: req.userId});
        await blog.save()
        res.status(200).json({message: "Blog created successfully"})

    } catch (error) {
        res.status(500).json({ message: 'Create failed', error: error.message });
    }
})



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
router.put('/:id', verifyToken, async (req, res) => {
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
router.delete('/:id', verifyToken, async (req, res) => {
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