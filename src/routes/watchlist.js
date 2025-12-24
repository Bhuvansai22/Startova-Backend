const express = require('express');
const router = express.Router();
const controller = require('../controllers/watchlistController');

router.post('/', controller.addToWatchlist);
router.get('/investor/:investorId', controller.getWatchlist);
router.get('/startup/:startupId/watchers', controller.getStartupWatchers);
router.get('/check', controller.checkWatchlistStatus);
router.delete('/:id', controller.removeFromWatchlist);

module.exports = router;
