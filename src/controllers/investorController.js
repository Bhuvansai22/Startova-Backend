const Investor = require('../models/Investor');

exports.createInvestor = async (req, res) => {
  try {
    const investor = await Investor.create(req.body);
    res.status(201).json(investor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getInvestors = async (req, res) => {
  try {
    const filter = {};
    if (req.query.domain) filter.preferredDomains = req.query.domain.toLowerCase();
    const investors = await Investor.find(filter);
    res.json(investors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvestorById = async (req, res) => {
  try {
    const investor = await Investor.findById(req.params.id);
    if (!investor) return res.status(404).json({ error: 'Investor not found' });
    res.json(investor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInvestor = async (req, res) => {
  try {
    const updated = await Investor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Investor not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteInvestor = async (req, res) => {
  try {
    const deleted = await Investor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Investor not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
