const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const GalleryImage = require('../models/GalleryImage');
const GalleryAlbum = require('../models/GalleryAlbum');
const { protect } = require('../middleware/auth');

// ── Multer — store in memory as buffer ───────────────────────────────────────
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// ALBUM ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET all albums (public)
router.get('/albums', async (req, res) => {
  try {
    const albums = await GalleryAlbum.find().sort({ order: 1, createdAt: -1 });
    // Add image count to each album
    const albumsWithCount = await Promise.all(albums.map(async (album) => {
      const count = await GalleryImage.countDocuments({ album: album._id });
      return { ...album.toObject(), imageCount: count };
    }));
    res.json({ success: true, data: albumsWithCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create album (protected)
router.post('/albums', protect, async (req, res) => {
  try {
    const album = await GalleryAlbum.create(req.body);
    res.status(201).json({ success: true, data: album });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update album (protected)
router.put('/albums/:id', protect, async (req, res) => {
  try {
    const album = await GalleryAlbum.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: album });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE album + its images (protected)
router.delete('/albums/:id', protect, async (req, res) => {
  try {
    await GalleryImage.deleteMany({ album: req.params.id });
    await GalleryAlbum.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Album and images deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET all images (public) — optional ?album=id filter
router.get('/', async (req, res) => {
  try {
    const filter = req.query.album ? { album: req.query.album } : {};
    const images = await GalleryImage.find(filter)
      .populate('album', 'name')
      .sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add image with optional file upload (protected)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, imageUrl, caption, album, order } = req.body;

    let imageData = '';
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      imageData = `data:${req.file.mimetype};base64,${base64}`;
    }

    const image = await GalleryImage.create({
      title,
      imageUrl: imageUrl || '',
      imageData,
      caption:  caption || '',
      album:    album   || null,
      order:    order   || 0,
    });

    res.status(201).json({ success: true, data: image });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update image (protected)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      updates.imageData = `data:${req.file.mimetype};base64,${base64}`;
    }
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, data: image });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE image (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;