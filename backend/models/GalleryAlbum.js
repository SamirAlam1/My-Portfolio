const mongoose = require('mongoose');

const galleryAlbumSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    coverImage:  { type: String, default: '' },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryAlbum', galleryAlbumSchema);