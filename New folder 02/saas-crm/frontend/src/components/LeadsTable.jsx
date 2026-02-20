import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye,
  Loader2,
  X
} from 'lucide-react';
import { useLeads, useLeadSources } from '../hooks/useLeads';
import { leadsApi } from '../utils/api';
import { 
  formatCurrency, 
  formatDate, 
  formatRelativeDate,
  isOverdue,
  getPriorityColor, 
  getStageColor,
  STAGES,
  PRIORITIES
} from '../utils/calculations';

const LeadsTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    stage: '',
    priority: '',
    lead_source: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const { leads, loading, error, refetch } = useLeads({
    search: searchTerm,
    ...filters
  });
  const { sources } = useLeadSources();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    setDeletingId(id);
    try {
      await leadsApi.delete(id);
      refetch();
    } catch (err) {
      alert('Failed to delete lead');
    } finally {
      setDeletingId(null);
      setActionMenuOpen(null);
    }
  };

  const handleStageChange = async (id, newStage) => {
    try {
      await leadsApi.updateStage(id, newStage);
      refetch();
    } catch (err) {
      alert('Failed to update stage');
    }
  };

  const clearFilters = () => {
    setFilters({ stage: '', priority: '', lead_source: '' });
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || filters.stage || filters.priority || filters.lead_source;

  if (error) {
    return (
      <div className="p-6">
        <div className="card bg-rose-50 border-rose-200">
          <p className="text-rose-700">Error loading leads: {error}</p>
          <button onClick={refetch} className="btn-primary mt-4">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">Manage your sales leads and prospects</p>
        </div>
        <button
          onClick={() => navigate('/leads/new')}
          className="btn-primary flex items-center space-x-2 mt-4 lg:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-gray-100' : ''}`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary-600 rounded-full" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
              <select
                value={filters.stage}
                onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                className="select"
              >
                <option value="">All Stages</option>
                {STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="select"
              >
                <option value="">All Priorities</option>
                {PRIORITIES.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
              <select
                value={filters.lead_source}
                onChange={(e) => setFilters(prev => ({ ...prev, lead_source: e.target.value }))}
                className="select"
              >
                <option value="">All Sources</option>
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500 mr-4">
              {leads.length} result{leads.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No leads found</p>
            <button
              onClick={() => navigate('/leads/new')}
              className="btn-primary"
            >
              Add your first lead
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lead</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stage</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Value</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Next Action</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{lead.company || '-'}</p>
                        <p className="text-xs text-gray-500">{lead.lead_source}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.stage}
                        onChange={(e) => handleStageChange(lead.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${getStageColor(lead.stage)}`}
                      >
                        {STAGES.map(stage => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(lead.deal_value)}
                        </p>
                        {lead.mrr > 0 && (
                          <p className="text-xs text-emerald-600">
                            {formatCurrency(lead.mrr)}/mo
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{lead.next_action || '-'}</p>
                        {lead.next_action_date && (
                          <p className={`text-xs ${isOverdue(lead.next_action_date) ? 'text-rose-600 font-medium' : 'text-gray-500'}`}>
                            {formatRelativeDate(lead.next_action_date)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setActionMenuOpen(actionMenuOpen === lead.id ? null : lead.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {deletingId === lead.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        
                        {actionMenuOpen === lead.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10"
                              onClick={() => setActionMenuOpen(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                              <button
                                onClick={() => {
                                  navigate(`/leads/${lead.id}`);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/leads/${lead.id}/edit`);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(lead.id)}
                                className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 last:rounded-b-lg"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;
