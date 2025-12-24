const Message = require('../models/Message');

// Send message (investor to startup)
exports.sendMessage = async (req, res) => {
    try {
        const { investorId, startupId, senderRole, subject, message } = req.body;

        const newMessage = await Message.create({
            investorId,
            startupId,
            senderRole,
            subject,
            message
        });

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get messages for a conversation
exports.getConversation = async (req, res) => {
    try {
        const { investorId, startupId } = req.query;

        const messages = await Message.find({
            investorId,
            startupId
        })
            .sort('createdAt')
            .populate('investorId', 'name email')
            .populate('startupId', 'startupName founderName');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all messages for a startup (inbox)
exports.getStartupMessages = async (req, res) => {
    try {
        const { startupId } = req.params;

        const messages = await Message.find({ startupId })
            .sort('-createdAt')
            .populate('investorId', 'name email');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all messages sent by an investor
exports.getInvestorMessages = async (req, res) => {
    try {
        const { investorId } = req.params;

        const messages = await Message.find({ investorId })
            .sort('-createdAt')
            .populate('startupId', 'startupName founderName');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findByIdAndUpdate(
            id,
            { status: 'read', readAt: new Date() },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Message.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
