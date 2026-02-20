-- SaaS CRM Database Schema

-- Create database (run manually: CREATE DATABASE saas_crm;)

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  role VARCHAR(100),
  lead_source VARCHAR(100),
  deal_value DECIMAL(12,2) DEFAULT 0,
  mrr DECIMAL(12,2) DEFAULT 0,
  stage VARCHAR(50) DEFAULT 'New',
  priority VARCHAR(20) DEFAULT 'Medium',
  trial_start_date DATE,
  trial_end_date DATE,
  next_action VARCHAR(50),
  next_action_date DATE,
  notes TEXT,
  interaction_history JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_next_action ON leads(next_action_date);
CREATE INDEX IF NOT EXISTS idx_leads_lead_source ON leads(lead_source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO leads (name, email, phone, company, role, lead_source, deal_value, mrr, stage, priority, trial_start_date, trial_end_date, next_action, next_action_date, notes) VALUES
('John Smith', 'john.smith@techcorp.com', '+1-555-0101', 'TechCorp Inc.', 'CTO', 'Website', 5000, 0, 'Trial Started', 'High', '2024-01-15', '2024-02-15', 'Demo Call', '2024-02-10', 'Interested in enterprise plan'),
('Sarah Johnson', 'sarah.j@startup.io', '+1-555-0102', 'StartupIO', 'CEO', 'Referral', 12000, 1000, 'Converted', 'High', '2024-01-01', '2024-02-01', 'Follow-up Email', '2024-02-20', 'Converted to paid plan'),
('Michael Chen', 'm.chen@globalsoft.com', '+1-555-0103', 'GlobalSoft', 'VP Engineering', 'LinkedIn', 8000, 0, 'Interested', 'High', NULL, NULL, 'Send Proposal', '2024-02-12', 'Very interested after demo'),
('Emily Davis', 'emily.davis@retailplus.com', '+1-555-0104', 'RetailPlus', 'Marketing Director', 'Google Ads', 2500, 0, 'Contacted', 'Medium', NULL, NULL, 'Schedule Demo', '2024-02-15', 'Requested pricing info'),
('David Wilson', 'd.wilson@financehub.com', '+1-555-0105', 'FinanceHub', 'Product Manager', 'Cold Email', 15000, 0, 'New', 'High', NULL, NULL, 'Initial Call', '2024-02-08', 'High-value prospect'),
('Lisa Anderson', 'lisa.a@healthtech.com', '+1-555-0106', 'HealthTech Solutions', 'COO', 'Conference', 6000, 500, 'Converted', 'Medium', '2023-12-01', '2024-01-01', 'Quarterly Review', '2024-03-01', 'Happy customer'),
('Robert Taylor', 'robert.t@edulearn.com', '+1-555-0107', 'EduLearn', 'IT Director', 'Website', 1800, 0, 'Trial Expiring', 'Medium', '2024-01-20', '2024-02-20', 'Renewal Call', '2024-02-18', 'Trial expires soon'),
('Jennifer Brown', 'jen.brown@mediagroup.com', '+1-555-0108', 'MediaGroup', 'Creative Director', 'Referral', 3500, 0, 'Contacted', 'Low', NULL, NULL, 'Send Case Studies', '2024-02-25', 'Evaluating options'),
('James Martinez', 'j.martinez@autotech.com', '+1-555-0109', 'AutoTech Systems', 'Engineering Lead', 'LinkedIn', 9500, 0, 'Trial Started', 'High', '2024-01-25', '2024-02-25', 'Technical Review', '2024-02-14', 'Needs technical validation'),
('Amanda White', 'amanda.w@consultpro.com', '+1-555-0110', 'ConsultPro', 'Managing Partner', 'Google Ads', 4500, 0, 'Interested', 'Medium', NULL, NULL, 'Contract Discussion', '2024-02-16', 'Ready to negotiate'),
('Thomas Lee', 't.lee@cloudnine.com', '+1-555-0111', 'CloudNine', 'DevOps Lead', 'Website', 7200, 600, 'Converted', 'High', '2023-11-15', '2023-12-15', 'Onboarding Check', '2024-02-22', 'Recently converted'),
('Michelle Garcia', 'm.garcia@retailmax.com', '+1-555-0112', 'RetailMax', 'Operations Manager', 'Cold Email', 1200, 0, 'Lost', 'Low', NULL, NULL, NULL, NULL, 'Went with competitor'),
('Kevin Rodriguez', 'kevin.r@dataflow.com', '+1-555-0113', 'DataFlow Analytics', 'Data Scientist', 'Referral', 11000, 0, 'New', 'High', NULL, NULL, 'Discovery Call', '2024-02-11', 'Referred by existing customer'),
('Stephanie Kim', 'steph.kim@designstudio.com', '+1-555-0114', 'DesignStudio', 'Founder', 'LinkedIn', 2800, 0, 'Contacted', 'Medium', NULL, NULL, 'Product Walkthrough', '2024-02-19', 'Small team, high potential'),
('Brian Thompson', 'brian.t@logisticspro.com', '+1-555-0115', 'LogisticsPro', 'Operations Director', 'Conference', 8500, 0, 'Trial Started', 'High', '2024-01-28', '2024-02-28', 'Integration Call', '2024-02-13', 'Complex integration needs');
