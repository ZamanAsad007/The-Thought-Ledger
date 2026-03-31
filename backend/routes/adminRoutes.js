const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const Category = require('../models/category')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.use(protect, adminOnly)
router.get('/stats', async(req, res)=>{
    try{
        const [totalAuthors, totalBlogs, totalCategories] = await Promise.all([
            User.countDocuments({role:'author'}),
            Blog.countDocuments(),
            Category.countDocuments()
        ])
        res.json({totalAuthors, totalBlogs, totalCategories})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.get('/authors',async(req, res)=>{
    try{
        const authors= await User.find({role:'author'}).select('-password')
        res.json(authors)
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

router.delete('/authors/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    // delete their blogs too
    await Blog.deleteMany({ author: req.params.id })
    res.json({ message: 'Author and their blogs deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name username')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.json({ message: 'Blog deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/categories', async (req, res) => {
  try {
    const { name, color } = req.body
    const category = await Category.create({ name, color, approvedByAdmin: true })
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/categories/:id', async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Category deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
