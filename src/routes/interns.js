const express = require('express');
const router = express.Router();
const controller = require('../controllers/internController');

router.post('/', controller.createIntern);
router.get('/', controller.getInterns);
router.get('/:id', controller.getInternById);
router.put('/:id', controller.updateIntern);
router.delete('/:id', controller.deleteIntern);

module.exports = router;
