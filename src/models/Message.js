const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
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
    senderRole: {
        type: String,
        enum: ['investor', 'startup'],
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'read', 'replied'],
        default: 'sent'
    },
    readAt: {
        type: Date
    }
}, { timestamps: true });

// Index for efficient querying
MessageSchema.index({ investorId: 1, startupId: 1 });
MessageSchema.index({ startupId: 1, status: 1 });

module.exports = mongoose.model('Message', MessageSchema);
