const express = require('express');
const router = express.Router();
const { getEducations, getEducation, createEducation, updateEducation, deleteEducation } = require('../controllers/educationController');
const { protect } = require('../middleware/auth');

router.route('/').get(getEducations).post(protect, createEducation);
router.route('/:id').get(getEducation).put(protect, updateEducation).delete(protect, deleteEducation);

module.exports = router;