const Watchlist = require('../models/Watchlist');
const Startup = require('../models/Startup');

// Add startup to watchlist
exports.addToWatchlist = async (req, res) => {
    try {
        const { investorId, startupId, notes } = req.body;

        // Check if startup exists
        const startup = await Startup.findById(startupId);
        if (!startup) {
            return res.status(404).json({ error: 'Startup not found' });
        }

        const watchlistItem = await Watchlist.create({
            investorId,
            startupId,
            notes: notes || ''
        });

        res.status(201).json(watchlistItem);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Startup already in watchlist' });
        }
        res.status(400).json({ error: err.message });
    }
};

// Get investor's watchlist
exports.getWatchlist = async (req, res) => {
    try {
        const { investorId } = req.params;

        const watchlist = await Watchlist.find({ investorId })
            .populate('startupId')
            .sort('-addedAt');

        res.json(watchlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove from watchlist
exports.removeFromWatchlist = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Watchlist.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Watchlist item not found' });
        }

        res.json({ message: 'Removed from watchlist' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get investors who watchlisted a startup
exports.getStartupWatchers = async (req, res) => {
    try {
        const { startupId } = req.params;

        const watchers = await Watchlist.find({ startupId })
            .populate('investorId')
            .sort('-addedAt');

        res.json(watchers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Check if startup is in watchlist
exports.checkWatchlistStatus = async (req, res) => {
    try {
        const { investorId, startupId } = req.query;

        const item = await Watchlist.findOne({ investorId, startupId });

        res.json({
            isWatchlisted: !!item,
            watchlistId: item?._id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
