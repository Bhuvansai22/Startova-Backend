const express = require('express');
const router = express.Router();
const controller = require('../controllers/messageController');

router.post('/', controller.sendMessage);
router.get('/conversation', controller.getConversation);
router.get('/startup/:startupId', controller.getStartupMessages);
router.get('/investor/:investorId', controller.getInvestorMessages);
router.patch('/:id/read', controller.markAsRead);
router.delete('/:id', controller.deleteMessage);

module.exports = router;
