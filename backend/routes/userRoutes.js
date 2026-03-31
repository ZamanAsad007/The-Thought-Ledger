const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const Category = require('../models/category')

router.get('/authors', async(req, res)=>{
    try{
        const authors= await User.find({role:'author'}).select('-password')
        const authorsWithCount = await Promise.all(
            authors.map(async (author)=>{
              const blogCount= await Blog.countDocuments({ author: author._id, published: true })
                return{...author.toObject(), blogCount}
            })
        )
        authorsWithCount.sort((a,b)=>b.blogCount- a.blogCount)
        res.json(authorsWithCount)
    }catch(err){
        res.status(500).json({message:'Server error'})
    }
})

router.get('/authors/:id', async (req, res) => {
  try {
    const author = await User.findById(req.params.id).select('-password')
    if (!author) return res.status(404).json({ message: 'Author not found' })
    res.json(author)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/authors/:id/stats', async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.id, published: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('category', 'name color')

    const categoryCount = {}
    blogs.forEach((blog) => {
      if (!blog.category) return
      const name = blog.category.name
      const color = blog.category.color
      if (categoryCount[name]) {
        categoryCount[name].count++
      } else {
        categoryCount[name] = { count: 1, color }
      }
    })

    const chartData = Object.keys(categoryCount).map((name) => ({
      name,
      value: categoryCount[name].count,
      color: categoryCount[name].color,
    }))

    res.json(chartData)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/categories', async(req, res)=>{
  try{
    const categories = await Category.find()
    res.json(categories)
  }catch(err){
    res.status(500).json({message:'Server error'})
  }
})

const { protect } = require('../middleware/authMiddleware')
router.put('/profile', protect, async(req, res)=>{
  try{
    const {name, bio, profilePic, socialLinks}= req.body
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {name, bio, profilePic, socialLinks}
      ,{new:true}
    ).select('-password')
    res.json(updatedUser)
  }catch(err){
    res.status(500).json({message:err.message})
  }
})

router.get('/my/stats',protect, async(req, res)=>{
  try{
    const blogs= await Blog.find({author:req.user._id})
    .sort({createdAt:-1})
    .limit(20)
    .populate('category', 'name color')
    const categoryCount={}
    blogs.forEach(blog=>{
      if(blog.category){
        const name= blog.category.name
        const color= blog.category.color
        if(categoryCount[name]){
          categoryCount[name].count++
        }else{
          categoryCount[name]={count:1, color}
        }
      }
    })
    const chartData = Object.keys(categoryCount).map(name=>({
      name,
      value: categoryCount[name].count,
      color: categoryCount[name].color
    }))
    res.json(chartData)
    
  }catch(err){
    res.status(500).json({message:err.message})
  }
})

module.exports = router