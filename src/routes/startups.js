const express = require('express');
const router = express.Router();
const controller = require('../controllers/startupController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', controller.createStartup);
router.get('/', controller.getStartups);
router.get('/:id', controller.getStartupById);
router.put('/:id', protect, controller.updateStartup);
router.delete('/:id', protect, controller.deleteStartup);

// Document Routes
router.post('/:id/documents', controller.addFinancialDocument);
router.delete('/:id/documents/:docId', controller.deleteFinancialDocument);


module.exports = router;
