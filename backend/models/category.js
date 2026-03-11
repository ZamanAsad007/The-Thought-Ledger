const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, default: '#000000' },
  approvedByAdmin: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('category', categorySchema)