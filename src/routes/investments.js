const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

const { protect } = require('../middleware/authMiddleware');

// Investment routes
router.post('/invest', protect, investmentController.makeInvestment);
router.get('/investor/:investorId', protect, investmentController.getInvestorProfile);
router.get('/investor/:investorId/portfolio', protect, investmentController.getInvestorPortfolio);
router.get('/startup/:startupId/funding', protect, investmentController.getStartupFunding);
router.put('/investor/:investorId', protect, investmentController.updateInvestorProfile);

module.exports = router;
