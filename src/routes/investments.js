const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

// Investment routes
router.post('/invest', investmentController.makeInvestment);
router.get('/investor/:investorId', investmentController.getInvestorProfile);
router.get('/investor/:investorId/portfolio', investmentController.getInvestorPortfolio);
router.get('/startup/:startupId/funding', investmentController.getStartupFunding);
router.put('/investor/:investorId', investmentController.updateInvestorProfile);

module.exports = router;
