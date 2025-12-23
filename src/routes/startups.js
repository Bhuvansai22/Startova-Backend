const express = require('express');
const router = express.Router();
const controller = require('../controllers/startupController');

router.post('/', controller.createStartup);
router.get('/', controller.getStartups);
router.get('/:id', controller.getStartupById);
router.put('/:id', controller.updateStartup);
router.delete('/:id', controller.deleteStartup);

module.exports = router;
