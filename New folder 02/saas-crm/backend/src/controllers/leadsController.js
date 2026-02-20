/**
 * Leads Controller
 * Created by Junaid Mansoor
 */

const LeadModel = require('../models/leadModel');

const STAGES = ['New', 'Contacted', 'Trial Started', 'Trial Expiring', 'Interested', 'Converted', 'Lost'];
const PRIORITIES = ['Low', 'Medium', 'High'];

class LeadsController {
  static async getAllLeads(req, res) {
    try {
      const filters = {
        stage: req.query.stage,
        priority: req.query.priority,
        search: req.query.search,
        lead_source: req.query.lead_source
      };

      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) delete filters[key];
      });

      const leads = await LeadModel.getAll(filters);
      res.json({ success: true, data: leads });
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch leads' });
    }
  }

  static async getLeadById(req, res) {
    try {
      const { id } = req.params;
      const lead = await LeadModel.getById(id);
      
      if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }
      
      res.json({ success: true, data: lead });
    } catch (error) {
      console.error('Error fetching lead:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch lead' });
    }
  }

  static async createLead(req, res) {
    try {
      const leadData = req.body;
      
      // Validate required fields
      if (!leadData.name || !leadData.email) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name and email are required' 
        });
      }

      // Validate stage if provided
      if (leadData.stage && !STAGES.includes(leadData.stage)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid stage. Must be one of: ${STAGES.join(', ')}` 
        });
      }

      // Validate priority if provided
      if (leadData.priority && !PRIORITIES.includes(leadData.priority)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid priority. Must be one of: ${PRIORITIES.join(', ')}` 
        });
      }

      const lead = await LeadModel.create(leadData);
      res.status(201).json({ success: true, data: lead });
    } catch (error) {
      console.error('Error creating lead:', error);
      if (error.code === '23505') {
        return res.status(409).json({ success: false, error: 'Email already exists' });
      }
      res.status(500).json({ success: false, error: 'Failed to create lead' });
    }
  }

  static async updateLead(req, res) {
    try {
      const { id } = req.params;
      const leadData = req.body;

      // Check if lead exists
      const existingLead = await LeadModel.getById(id);
      if (!existingLead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }

      // Validate stage if provided
      if (leadData.stage && !STAGES.includes(leadData.stage)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid stage. Must be one of: ${STAGES.join(', ')}` 
        });
      }

      // Validate priority if provided
      if (leadData.priority && !PRIORITIES.includes(leadData.priority)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid priority. Must be one of: ${PRIORITIES.join(', ')}` 
        });
      }

      const lead = await LeadModel.update(id, leadData);
      res.json({ success: true, data: lead });
    } catch (error) {
      console.error('Error updating lead:', error);
      if (error.code === '23505') {
        return res.status(409).json({ success: false, error: 'Email already exists' });
      }
      res.status(500).json({ success: false, error: 'Failed to update lead' });
    }
  }

  static async deleteLead(req, res) {
    try {
      const { id } = req.params;
      
      const lead = await LeadModel.delete(id);
      if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }
      
      res.json({ success: true, message: 'Lead deleted successfully' });
    } catch (error) {
      console.error('Error deleting lead:', error);
      res.status(500).json({ success: false, error: 'Failed to delete lead' });
    }
  }

  static async updateLeadStage(req, res) {
    try {
      const { id } = req.params;
      const { stage } = req.body;

      if (!stage || !STAGES.includes(stage)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid stage. Must be one of: ${STAGES.join(', ')}` 
        });
      }

      const lead = await LeadModel.updateStage(id, stage);
      if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }

      res.json({ success: true, data: lead });
    } catch (error) {
      console.error('Error updating lead stage:', error);
      res.status(500).json({ success: false, error: 'Failed to update lead stage' });
    }
  }

  static async getOverdueFollowups(req, res) {
    try {
      const leads = await LeadModel.getOverdueFollowups();
      res.json({ success: true, data: leads });
    } catch (error) {
      console.error('Error fetching overdue followups:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch overdue followups' });
    }
  }

  static async getMRRMetrics(req, res) {
    try {
      const metrics = await LeadModel.getMRRMetrics();
      const arr = parseFloat(metrics.total_mrr) * 12;
      
      res.json({
        success: true,
        data: {
          ...metrics,
          arr: arr,
          total_mrr: parseFloat(metrics.total_mrr),
          potential_mrr: parseFloat(metrics.potential_mrr)
        }
      });
    } catch (error) {
      console.error('Error fetching MRR metrics:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch MRR metrics' });
    }
  }

  static async getFunnelData(req, res) {
    try {
      const funnelData = await LeadModel.getFunnelData();
      
      // Calculate conversion rates
      const totalLeads = funnelData.reduce((sum, stage) => sum + parseInt(stage.count), 0);
      const convertedCount = funnelData.find(s => s.stage === 'Converted')?.count || 0;
      
      const funnelWithRates = funnelData.map(stage => ({
        ...stage,
        count: parseInt(stage.count),
        total_value: parseFloat(stage.total_value),
        conversion_rate: totalLeads > 0 ? ((parseInt(stage.count) / totalLeads) * 100).toFixed(2) : 0,
        overall_conversion: totalLeads > 0 ? ((parseInt(convertedCount) / totalLeads) * 100).toFixed(2) : 0
      }));

      res.json({ success: true, data: funnelWithRates });
    } catch (error) {
      console.error('Error fetching funnel data:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch funnel data' });
    }
  }

  static async getLeadSourceROI(req, res) {
    try {
      const roiData = await LeadModel.getLeadSourceROI();
      
      const formattedData = roiData.map(source => ({
        ...source,
        lead_count: parseInt(source.lead_count),
        total_mrr: parseFloat(source.total_mrr),
        pipeline_value: parseFloat(source.pipeline_value),
        conversion_rate: parseFloat(source.conversion_rate)
      }));

      res.json({ success: true, data: formattedData });
    } catch (error) {
      console.error('Error fetching lead source ROI:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch lead source ROI' });
    }
  }

  static async getTopMRRLeads(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const leads = await LeadModel.getTopMRRLeads(limit);
      res.json({ success: true, data: leads });
    } catch (error) {
      console.error('Error fetching top MRR leads:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch top MRR leads' });
    }
  }

  static async getLeadSources(req, res) {
    try {
      const sources = await LeadModel.getLeadSources();
      res.json({ success: true, data: sources });
    } catch (error) {
      console.error('Error fetching lead sources:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch lead sources' });
    }
  }

  static async addInteraction(req, res) {
    try {
      const { id } = req.params;
      const { type, notes, date } = req.body;

      const lead = await LeadModel.getById(id);
      if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }

      const interactionHistory = lead.interaction_history || [];
      interactionHistory.push({
        type,
        notes,
        date: date || new Date().toISOString(),
        id: Date.now()
      });

      const updatedLead = await LeadModel.update(id, { interaction_history: interactionHistory });
      res.json({ success: true, data: updatedLead });
    } catch (error) {
      console.error('Error adding interaction:', error);
      res.status(500).json({ success: false, error: 'Failed to add interaction' });
    }
  }
}

module.exports = LeadsController;
