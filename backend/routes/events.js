const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/track', eventController.trackEvent);
router.get('/sessions', eventController.getSessions);
router.get('/sessions/:sessionId', eventController.getSessionDetails);
router.get('/heatmap', eventController.getHeatmapData);

module.exports = router;