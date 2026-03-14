const express = require("express");
const router = express.Router();

const{
    createBlog,
    getAllBlogs,
    getBlogById,
    getMyBlogs,
    getBlogsByAuthor,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

const{protect} = require("../middleware/authMiddleware");

// public routes
router.get('/', getAllBlogs)
router.get('/author/:authorId', getBlogsByAuthor)

// protected routes
router.get('/my/blogs', protect, getMyBlogs)

// parameterized routes (keep last to avoid shadowing)
router.get('/:id', getBlogById)

router.post('/', protect, createBlog)
router.put('/:id', protect, updateBlog)
router.delete('/:id', protect, deleteBlog)

module.exports = router;