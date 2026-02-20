import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Save, Loader2 } from 'lucide-react';
import { leadsApi } from '../utils/api';
import { useLead } from '../hooks/useLeads';
import { STAGES, PRIORITIES, LEAD_SOURCES, NEXT_ACTIONS } from '../utils/calculations';

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { lead: existingLead, loading: leadLoading } = useLead(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    lead_source: '',
    deal_value: '',
    mrr: '',
    stage: 'New',
    priority: 'Medium',
    trial_start_date: '',
    trial_end_date: '',
    next_action: '',
    next_action_date: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingLead) {
      setFormData({
        name: existingLead.name || '',
        email: existingLead.email || '',
        phone: existingLead.phone || '',
        company: existingLead.company || '',
        role: existingLead.role || '',
        lead_source: existingLead.lead_source || '',
        deal_value: existingLead.deal_value || '',
        mrr: existingLead.mrr || '',
        stage: existingLead.stage || 'New',
        priority: existingLead.priority || 'Medium',
        trial_start_date: existingLead.trial_start_date ? existingLead.trial_start_date.split('T')[0] : '',
        trial_end_date: existingLead.trial_end_date ? existingLead.trial_end_date.split('T')[0] : '',
        next_action: existingLead.next_action || '',
        next_action_date: existingLead.next_action_date ? existingLead.next_action_date.split('T')[0] : '',
        notes: existingLead.notes || ''
      });
    }
  }, [existingLead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        deal_value: parseFloat(formData.deal_value) || 0,
        mrr: parseFloat(formData.mrr) || 0
      };

      if (isEditing) {
        await leadsApi.update(id, dataToSubmit);
      } else {
        await leadsApi.create(dataToSubmit);
      }

      navigate('/leads');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  if (leadLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Lead' : 'Add New Lead'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing ? 'Update lead information' : 'Create a new lead in your pipeline'}
          </p>
        </div>
        <button
          onClick={() => navigate('/leads')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="text-rose-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
              placeholder="john@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="input"
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role/Title
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input"
              placeholder="CTO"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Source
            </label>
            <select
              name="lead_source"
              value={formData.lead_source}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select source</option>
              {LEAD_SOURCES.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {/* Pipeline Information */}
          <div className="md:col-span-2 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stage
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="select"
            >
              {STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="select"
            >
              {PRIORITIES.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Value ($)
            </label>
            <input
              type="number"
              name="deal_value"
              value={formData.deal_value}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="input"
              placeholder="5000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MRR ($) {formData.stage === 'Converted' && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="number"
              name="mrr"
              value={formData.mrr}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="input"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Monthly Recurring Revenue for converted customers</p>
          </div>

          {/* Trial Dates */}
          <div className="md:col-span-2 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trial Period</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trial Start Date
            </label>
            <input
              type="date"
              name="trial_start_date"
              value={formData.trial_start_date}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trial End Date
            </label>
            <input
              type="date"
              name="trial_end_date"
              value={formData.trial_end_date}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Next Action */}
          <div className="md:col-span-2 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Action</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <select
              name="next_action"
              value={formData.next_action}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select action</option>
              {NEXT_ACTIONS.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="next_action_date"
              value={formData.next_action_date}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="input resize-none"
              placeholder="Add any additional notes about this lead..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Update Lead' : 'Create Lead'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
