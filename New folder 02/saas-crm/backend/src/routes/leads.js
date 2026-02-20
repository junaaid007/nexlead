/**
 * Leads Routes
 * Created by Junaid Mansoor
 */

const express = require('express');
const router = express.Router();
const LeadsController = require('../controllers/leadsController');

// Lead CRUD routes
router.get('/', LeadsController.getAllLeads);
router.get('/sources', LeadsController.getLeadSources);
router.get('/overdue-followups', LeadsController.getOverdueFollowups);
router.get('/top-mrr', LeadsController.getTopMRRLeads);
router.get('/:id', LeadsController.getLeadById);
router.post('/', LeadsController.createLead);
router.put('/:id', LeadsController.updateLead);
router.delete('/:id', LeadsController.deleteLead);

// Stage update
router.patch('/:id/stage', LeadsController.updateLeadStage);

// Interaction history
router.post('/:id/interactions', LeadsController.addInteraction);

module.exports = router;
