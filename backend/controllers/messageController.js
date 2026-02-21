const Message = require('../models/Message');

// @desc    Submit contact message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: message });
  } catch (error) { next(error); }
};

// @desc    Get all messages (admin)
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) { next(error); }
};

// @desc    Mark message as read/unread
// @route   PUT /api/messages/:id/read
// @access  Private
const toggleRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    message.read = !message.read;
    await message.save();
    res.status(200).json({ success: true, data: message });
  } catch (error) { next(error); }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { createMessage, getMessages, toggleRead, deleteMessage };