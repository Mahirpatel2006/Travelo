const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number'],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
  },
  isApproved: {
    type: Boolean,
    default: false, // Reviews need admin approval before being published
    index: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);