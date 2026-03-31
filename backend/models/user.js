const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, enum: ["author", "admin"], default: "author" },
  bio: { type: String },
  profilePic: { type: String },
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    other: [String]
  },
  name: { type: String }
},{ timestamps: true });

module.exports = mongoose.model('user', userSchema)