import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  MessageSquare,
  Plus,
  Loader2
} from 'lucide-react';
import { useLead } from '../hooks/useLeads';
import { leadsApi } from '../utils/api';
import { 
  formatCurrency, 
  formatDate, 
  formatRelativeDate,
  isOverdue,
  getPriorityColor, 
  getStageColor,
  STAGES
} from '../utils/calculations';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lead, loading, error, setLead } = useLead(id);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [interactionData, setInteractionData] = useState({ type: '', notes: '' });
  const [addingInteraction, setAddingInteraction] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await leadsApi.delete(id);
      navigate('/leads');
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  const handleStageChange = async (newStage) => {
    try {
      const response = await leadsApi.updateStage(id, newStage);
      setLead(response.data.data);
    } catch (err) {
      alert('Failed to update stage');
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    setAddingInteraction(true);
    
    try {
      const response = await leadsApi.addInteraction(id, interactionData);
      setLead(response.data.data);
      setInteractionData({ type: '', notes: '' });
      setShowInteractionForm(false);
    } catch (err) {
      alert('Failed to add interaction');
    } finally {
      setAddingInteraction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-6">
        <div className="card bg-rose-50 border-rose-200">
          <p className="text-rose-700">Lead not found</p>
          <button 
            onClick={() => navigate('/leads')}
            className="btn-primary mt-4"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  const interactions = lead.interaction_history || [];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/leads')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-500">{lead.email}</p>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => navigate(`/leads/${id}/edit`)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="btn-danger flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-gray-900 hover:text-primary-600">
                    {lead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{lead.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-gray-900">{lead.company || '-'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-900">{lead.role || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Tag className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lead Source</p>
                  <p className="text-gray-900">{lead.lead_source || '-'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deal Value</p>
                  <p className="text-gray-900">{formatCurrency(lead.deal_value)}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Stage</label>
              <select
                value={lead.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                className={`select ${getStageColor(lead.stage)}`}
              >
                {STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {lead.stage === 'Converted' && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-700 font-medium">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold text-emerald-700">{formatCurrency(lead.mrr)}/mo</p>
              </div>
            )}
          </div>

          {/* Trial Period */}
          {(lead.trial_start_date || lead.trial_end_date) && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trial Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trial Start</p>
                    <p className="text-gray-900">{formatDate(lead.trial_start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trial End</p>
                    <p className="text-gray-900">{formatDate(lead.trial_end_date)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interaction History */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Interaction History</h3>
              <button
                onClick={() => setShowInteractionForm(!showInteractionForm)}
                className="btn-secondary flex items-center space-x-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Interaction</span>
              </button>
            </div>

            {showInteractionForm && (
              <form onSubmit={handleAddInteraction} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={interactionData.type}
                      onChange={(e) => setInteractionData(prev => ({ ...prev, type: e.target.value }))}
                      className="select"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Call">Call</option>
                      <option value="Email">Email</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Demo">Demo</option>
                      <option value="Note">Note</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={interactionData.notes}
                    onChange={(e) => setInteractionData(prev => ({ ...prev, notes: e.target.value }))}
                    className="input resize-none"
                    rows={3}
                    placeholder="Add notes about this interaction..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowInteractionForm(false)}
                    className="btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingInteraction}
                    className="btn-primary text-sm flex items-center space-x-2"
                  >
                    {addingInteraction && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Add Interaction</span>
                  </button>
                </div>
              </form>
            )}

            {interactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No interactions recorded yet</p>
            ) : (
              <div className="space-y-4">
                {[...interactions].reverse().map((interaction, index) => (
                  <div key={index} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-primary-100 rounded-lg h-fit">
                      <MessageSquare className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{interaction.type}</span>
                        <span className="text-xs text-gray-500">{formatDate(interaction.date)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{interaction.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Priority & Status */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Priority</h3>
            <span className={`badge ${getPriorityColor(lead.priority)} text-sm`}>
              {lead.priority}
            </span>

            <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Status</h3>
            <span className={`badge ${getStageColor(lead.stage)} text-sm`}>
              {lead.stage}
            </span>
          </div>

          {/* Next Action */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Next Action</h3>
            {lead.next_action ? (
              <div>
                <p className="text-gray-900 font-medium">{lead.next_action}</p>
                {lead.next_action_date && (
                  <div className={`flex items-center mt-2 text-sm ${isOverdue(lead.next_action_date) ? 'text-rose-600' : 'text-gray-500'}`}>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatRelativeDate(lead.next_action_date)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No next action set</p>
            )}
          </div>

          {/* Notes */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Notes</h3>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">
              {lead.notes || 'No notes added'}
            </p>
          </div>

          {/* Created/Updated */}
          <div className="card">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900">{formatDate(lead.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Updated</span>
                <span className="text-gray-900">{formatDate(lead.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
