const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  slug: {
    type: String, required: true, unique: true, lowercase: true, trim: true, index: true,
  },
  name: { type: String, required: true, trim: true },
  tagline: { type: String },           // e.g. "Pearl of the Orient"
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  coverImage: { type: String, required: true },  // /images/destinations/goa/goa-4.avif
  images: [{ type: String }],          // gallery images
  highlights: [{ type: String }],      // short bullet points shown in hero
  sections: [{                         // rich content sections
    heading: String,
    body: String,
  }],
  duration: { type: String },          // "5 Days / 4 Nights"
  bestTime: { type: String },          // "October – March"
  weather: { type: String },           // "20°C – 32°C"
  location: { type: String },          // "North Goa, India"
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
