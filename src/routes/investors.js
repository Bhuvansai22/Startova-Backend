const express = require('express');
const router = express.Router();
const controller = require('../controllers/investorController');

// Investor Routes
router.post('/', controller.createInvestor);
router.get('/', controller.getInvestors);
router.get('/:id', controller.getInvestorById);
router.put('/:id', controller.updateInvestor);
router.delete('/:id', controller.deleteInvestor);

module.exports = router;
