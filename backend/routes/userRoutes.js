const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Blog = require('../models/blog')

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
module.exports = router