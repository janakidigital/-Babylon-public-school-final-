const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  file: {
    type: String,
    required: false,
    default: '',
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Download', downloadSchema);
