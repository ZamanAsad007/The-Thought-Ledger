const mongoose = require("mongoose");
const blog = require("../models/blog");

const createBlog = async (req, res) => {
  const { title, content, category, coverImage, location } = req.body;

  try {
    const newBlog = await blog.create({
      title,
      content,
      category,
      coverImage,
      location,
      author: req.user._id,
    });
    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create blog", error: err.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blog
      .find({ published: true })
      .populate("author", "name username profilePic")
      .populate("category", "name color")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch blogs", error: err.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const Blog = await blog
      .findById(req.params.id)
      .populate("author", "name username profilePic")
      .populate("category", "name color");
    if (!Blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.json(Blog);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch blog", error: err.message });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const blogs = await blog
      .find({ author: req.user._id })
      .populate("category", "name color")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch blogs", error: err.message });
  }
};

const getBlogsByAuthor = async (req, res) => {
  try {
    const blogs = await blog
      .find({ author: req.params.authorId, published: true })
      .populate("category", "name color")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch blogs", error: err.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const allowedUpdates = ((body) => {
      const { title, content, category, coverImage, published, location } = body;
      const updates = {};
      if (title !== undefined) updates.title = title;
      if (content !== undefined) updates.content = content;
      if (category !== undefined) updates.category = category;
      if (coverImage !== undefined) updates.coverImage = coverImage;
      if (location !== undefined) updates.location = location;
      if (published !== undefined) updates.published = published;
      return updates;
    })(req.body);

    const updatedBlog = await blog.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      allowedUpdates,
      { new: true, runValidators: true },
    );

    if (!updatedBlog) {
      const exists = await blog.exists({ _id: req.params.id });
      return res
        .status(exists ? 403 : 404)
        .json({ message: exists ? "Unauthorized" : "Blog not found" });
    }

    return res.json(updatedBlog);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update blog", error: err.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const Blog = await blog.findById(req.params.id);

    if (!Blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (Blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await blog.findByIdAndDelete(req.params.id);
    return res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete blog", error: err.message });
  }
};

module.exports={createBlog, getAllBlogs, getBlogById, getMyBlogs, getBlogsByAuthor, updateBlog, deleteBlog}