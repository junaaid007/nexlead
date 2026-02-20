/**
 * Analytics Routes
 * Created by Junaid Mansoor
 */

const express = require('express');
const router = express.Router();
const LeadsController = require('../controllers/leadsController');

// Analytics routes
router.get('/mrr', LeadsController.getMRRMetrics);
router.get('/funnel', LeadsController.getFunnelData);
router.get('/sources', LeadsController.getLeadSourceROI);

module.exports = router;
