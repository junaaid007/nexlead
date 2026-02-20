/**
 * Lead Model
 * Created by Junaid Mansoor
 */

const db = require('../config/database');

const STAGES = ['New', 'Contacted', 'Trial Started', 'Trial Expiring', 'Interested', 'Converted', 'Lost'];
const PRIORITIES = ['Low', 'Medium', 'High'];

class LeadModel {
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.stage) {
      query += ` AND stage = $${paramIndex}`;
      params.push(filters.stage);
      paramIndex++;
    }

    if (filters.priority) {
      query += ` AND priority = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR company ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.lead_source) {
      query += ` AND lead_source = $${paramIndex}`;
      params.push(filters.lead_source);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM leads WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(leadData) {
    const {
      name, email, phone, company, role, lead_source,
      deal_value, stage, priority, trial_start_date, trial_end_date,
      next_action, next_action_date, notes
    } = leadData;

    const query = `
      INSERT INTO leads (name, email, phone, company, role, lead_source, deal_value, stage, priority, 
                         trial_start_date, trial_end_date, next_action, next_action_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      name, email, phone, company, role, lead_source,
      deal_value || 0, stage || 'New', priority || 'Medium',
      trial_start_date, trial_end_date, next_action, next_action_date, notes
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async update(id, leadData) {
    const {
      name, email, phone, company, role, lead_source,
      deal_value, mrr, stage, priority, trial_start_date, trial_end_date,
      next_action, next_action_date, notes, interaction_history
    } = leadData;

    const query = `
      UPDATE leads SET
        name = $1, email = $2, phone = $3, company = $4, role = $5, lead_source = $6,
        deal_value = $7, mrr = $8, stage = $9, priority = $10, 
        trial_start_date = $11, trial_end_date = $12, next_action = $13, 
        next_action_date = $14, notes = $15, interaction_history = $16
      WHERE id = $17
      RETURNING *
    `;

    const values = [
      name, email, phone, company, role, lead_source,
      deal_value, mrr, stage, priority,
      trial_start_date, trial_end_date, next_action, next_action_date,
      notes, JSON.stringify(interaction_history || []), id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async updateStage(id, stage) {
    const result = await db.query(
      'UPDATE leads SET stage = $1 WHERE id = $2 RETURNING *',
      [stage, id]
    );
    return result.rows[0];
  }

  static async getOverdueFollowups() {
    const query = `
      SELECT * FROM leads 
      WHERE next_action_date < CURRENT_DATE 
        AND stage NOT IN ('Converted', 'Lost')
      ORDER BY next_action_date ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getMRRMetrics() {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN stage = 'Converted' THEN mrr ELSE 0 END), 0) as total_mrr,
        COALESCE(SUM(CASE WHEN stage IN ('Trial Started', 'Trial Expiring', 'Interested') THEN deal_value ELSE 0 END), 0) as potential_mrr,
        COUNT(CASE WHEN stage = 'Converted' THEN 1 END) as converted_count,
        COUNT(*) as total_leads
      FROM leads
    `;
    const result = await db.query(query);
    return result.rows[0];
  }

  static async getFunnelData() {
    const query = `
      SELECT 
        stage,
        COUNT(*) as count,
        COALESCE(SUM(deal_value), 0) as total_value
      FROM leads
      GROUP BY stage
      ORDER BY ARRAY_POSITION(ARRAY['New', 'Contacted', 'Trial Started', 'Trial Expiring', 'Interested', 'Converted', 'Lost'], stage)
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getLeadSourceROI() {
    const query = `
      SELECT 
        lead_source,
        COUNT(*) as lead_count,
        COALESCE(SUM(CASE WHEN stage = 'Converted' THEN mrr ELSE 0 END), 0) as total_mrr,
        COALESCE(SUM(deal_value), 0) as pipeline_value,
        ROUND(COUNT(CASE WHEN stage = 'Converted' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as conversion_rate
      FROM leads
      WHERE lead_source IS NOT NULL
      GROUP BY lead_source
      ORDER BY total_mrr DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getTopMRRLeads(limit = 10) {
    const query = `
      SELECT * FROM leads 
      WHERE stage = 'Converted' AND mrr > 0
      ORDER BY mrr DESC
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }

  static async getLeadSources() {
    const query = 'SELECT DISTINCT lead_source FROM leads WHERE lead_source IS NOT NULL ORDER BY lead_source';
    const result = await db.query(query);
    return result.rows.map(row => row.lead_source);
  }
}

module.exports = LeadModel;
