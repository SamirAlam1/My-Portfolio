const Education = require('../models/Education');

const getEducations = async (req, res, next) => {
  try {
    const educations = await Education.find().sort({ order: 1, startYear: -1 });
    res.status(200).json({ success: true, count: educations.length, data: educations });
  } catch (error) { next(error); }
};

const getEducation = async (req, res, next) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) return res.status(404).json({ success: false, message: 'Education not found' });
    res.status(200).json({ success: true, data: education });
  } catch (error) { next(error); }
};

const createEducation = async (req, res, next) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json({ success: true, data: education });
  } catch (error) { next(error); }
};

const updateEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!education) return res.status(404).json({ success: false, message: 'Education not found' });
    res.status(200).json({ success: true, data: education });
  } catch (error) { next(error); }
};

const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) return res.status(404).json({ success: false, message: 'Education not found' });
    res.status(200).json({ success: true, message: 'Education deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { getEducations, getEducation, createEducation, updateEducation, deleteEducation };