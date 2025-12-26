const Startup = require('../models/Startup');

exports.createStartup = async (req, res) => {
  try {
    const startup = await Startup.create(req.body);
    res.status(201).json(startup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStartups = async (req, res) => {
  try {
    const filter = {};
    if (req.query.domain) filter.domain = req.query.domain.toLowerCase();
    const startups = await Startup.find(filter);
    res.json(startups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    res.json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStartup = async (req, res) => {
  try {
    const updated = await Startup.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Startup not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteStartup = async (req, res) => {
  try {
    const deleted = await Startup.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Startup not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Financial Document
exports.addFinancialDocument = async (req, res) => {
  try {
    const { name, type, url } = req.body;
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    startup.financialDocuments.push({ name, type, url });
    await startup.save();

    res.status(201).json(startup.financialDocuments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Financial Document
exports.deleteFinancialDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    startup.financialDocuments = startup.financialDocuments.filter(
      doc => doc._id.toString() !== docId
    );

    await startup.save();
    res.json(startup.financialDocuments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
