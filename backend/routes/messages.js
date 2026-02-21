const express = require('express');
const router = express.Router();
const { createMessage, getMessages, toggleRead, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.route('/').post(createMessage).get(protect, getMessages);
router.put('/:id/read', protect, toggleRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;