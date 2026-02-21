const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'],
    },
    level: {
      type: Number,
      required: [true, 'Skill level is required'],
      min: [1, 'Level must be at least 1'],
      max: [100, 'Level cannot exceed 100'],
    },
    icon: {
      type: String,
      default: '', // emoji or icon name
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);