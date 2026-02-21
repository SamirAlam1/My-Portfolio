const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
      maxlength: [150, 'Institution name cannot exceed 150 characters'],
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
      maxlength: [100, 'Degree cannot exceed 100 characters'],
    },
    fieldOfStudy: {
      type: String,
      required: [true, 'Field of study is required'],
      trim: true,
      maxlength: [100, 'Field of study cannot exceed 100 characters'],
    },
    board: {
      type: String,
      default: '',
      trim: true,
      maxlength: [150, 'Board name cannot exceed 150 characters'],
    },
    startYear: {
      type: Number,
      required: [true, 'Start year is required'],
    },
    endYear: {
      type: Number,
      default: null,
    },
    grade: {
      type: String,
      default: '',
      maxlength: [50, 'Grade cannot exceed 50 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
