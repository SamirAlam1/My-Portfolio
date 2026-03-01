const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },      // URL (optional)
    imageData:{ type: String, default: '' },      // base64 uploaded image
    caption:  { type: String, default: '', trim: true },
    album:    { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryAlbum', default: null },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);