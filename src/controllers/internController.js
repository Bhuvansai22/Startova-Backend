const Intern = require('../models/Intern');

exports.createIntern = async (req, res) => {
  try {
    const intern = await Intern.create(req.body);
    res.status(201).json(intern);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getInterns = async (req, res) => {
  try {
    const interns = await Intern.find().populate('appliedStartups');
    res.json(interns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInternById = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).populate('appliedStartups');
    if (!intern) return res.status(404).json({ error: 'Intern not found' });
    res.json(intern);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateIntern = async (req, res) => {
  try {
    const updated = await Intern.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Intern not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteIntern = async (req, res) => {
  try {
    const deleted = await Intern.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Intern not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
