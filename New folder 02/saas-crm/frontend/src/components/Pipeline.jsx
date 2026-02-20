import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { leadsApi } from '../utils/api';
import LeadCard from './LeadCard';
import { STAGES, formatCurrency } from '../utils/calculations';

const Pipeline = () => {
  const navigate = useNavigate();
  const { leads, loading, error, refetch } = useLeads();
  const [updatingLead, setUpdatingLead] = useState(null);
  const [stageFilter, setStageFilter] = useState('');

  const handleStageChange = async (lead, newStage) => {
    setUpdatingLead(lead.id);
    try {
      await leadsApi.updateStage(lead.id, newStage);
      refetch();
    } catch (err) {
      alert('Failed to update stage');
    } finally {
      setUpdatingLead(null);
    }
  };

  const getLeadsByStage = (stage) => {
    return leads.filter(lead => lead.stage === stage);
  };

  const getStageStats = (stage) => {
    const stageLeads = getLeadsByStage(stage);
    const totalValue = stageLeads.reduce((sum, lead) => sum + parseFloat(lead.deal_value || 0), 0);
    return { count: stageLeads.length, value: totalValue };
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="card bg-rose-50 border-rose-200">
          <p className="text-rose-700">Error loading pipeline: {error}</p>
          <button onClick={refetch} className="btn-primary mt-4">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-500 mt-1">Manage leads through your sales stages</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="select w-auto"
          >
            <option value="">All Stages</option>
            {STAGES.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
          <button
            onClick={() => navigate('/leads/new')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Pipeline Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 overflow-x-auto">
          {STAGES.filter(stage => !stageFilter || stage === stageFilter).map((stage) => {
            const stageLeads = getLeadsByStage(stage);
            const stats = getStageStats(stage);
            
            return (
              <div key={stage} className="flex flex-col min-w-[280px]">
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{stage}</h3>
                    <p className="text-xs text-gray-500">
                      {stats.count} leads • {formatCurrency(stats.value)}
                    </p>
                  </div>
                </div>

                {/* Stage Column */}
                <div className="bg-gray-50 rounded-xl p-3 flex-1 min-h-[400px]">
                  <div className="space-y-3">
                    {stageLeads.map((lead) => (
                      <div key={lead.id} className="relative">
                        {updatingLead === lead.id && (
                          <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center z-10">
                            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                          </div>
                        )}
                        <LeadCard 
                          lead={lead} 
                          onStageChange={(lead) => {
                            const currentIndex = STAGES.indexOf(lead.stage);
                            const nextStage = STAGES[currentIndex + 1];
                            if (nextStage) {
                              handleStageChange(lead, nextStage);
                            }
                          }}
                        />
                      </div>
                    ))}
                    
                    {stageLeads.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-400">No leads in this stage</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stage Legend */}
      <div className="mt-8 card">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Stage Update</h3>
        <p className="text-sm text-gray-500 mb-4">
          Click on the stage badge on any lead card to advance it to the next stage.
        </p>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((stage, index) => (
            <div key={stage} className="flex items-center">
              <span className="text-sm text-gray-600">{stage}</span>
              {index < STAGES.length - 1 && (
                <span className="mx-2 text-gray-400">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
