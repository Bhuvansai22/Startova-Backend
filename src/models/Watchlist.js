const mongoose = require('mongoose');
const { Schema } = mongoose;

const WatchlistSchema = new Schema({
    investorId: {
        type: Schema.Types.ObjectId,
        ref: 'Investor',
        required: true
    },
    startupId: {
        type: Schema.Types.ObjectId,
        ref: 'Startup',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Compound index to ensure an investor can't add the same startup twice
WatchlistSchema.index({ investorId: 1, startupId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);
