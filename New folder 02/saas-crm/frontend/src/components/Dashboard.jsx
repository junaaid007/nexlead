import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  AlertCircle,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { useMRRMetrics, useOverdueFollowups, useTopMRRLeads } from '../hooks/useLeads';
import { formatCurrency, formatDate, formatRelativeDate, getPriorityColor, getStageColor } from '../utils/calculations';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendUp, onClick }) => (
  <div 
    onClick={onClick}
    className={`card ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trendUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-primary-50 rounded-lg">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
    </div>
  </div>
);

const OverdueAlert = ({ overdue, loading }) => {
  const navigate = useNavigate();
  
  if (loading) return null;
  
  if (overdue.length === 0) {
    return (
      <div className="card bg-emerald-50 border-emerald-200">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-emerald-900">All caught up!</p>
            <p className="text-sm text-emerald-700">No overdue follow-ups</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-rose-50 border-rose-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-rose-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-rose-900">Overdue Follow-ups</p>
            <p className="text-sm text-rose-700">{overdue.length} lead{overdue.length > 1 ? 's' : ''} need attention</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/leads')}
          className="text-sm text-rose-600 hover:text-rose-800 font-medium"
        >
          View All
        </button>
      </div>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {overdue.slice(0, 3).map((lead) => (
          <div 
            key={lead.id} 
            onClick={() => navigate(`/leads/${lead.id}`)}
            className="flex items-center justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-rose-100 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{lead.name}</p>
              <p className="text-xs text-gray-500">{lead.company}</p>
            </div>
            <span className="text-xs font-medium text-rose-600">
              {formatRelativeDate(lead.next_action_date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopMRRLeads = ({ leads, loading }) => {
  const navigate = useNavigate();
  
  if (loading) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top MRR Customers</h3>
        <button 
          onClick={() => navigate('/revenue')}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
        >
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="space-y-3">
        {leads.slice(0, 5).map((lead, index) => (
          <div 
            key={lead.id}
            onClick={() => navigate(`/leads/${lead.id}`)}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                <p className="text-xs text-gray-500">{lead.company}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              {formatCurrency(lead.mrr)}/mo
            </span>
          </div>
        ))}
        {leads.length === 0 && (
          <p className="text-center text-gray-500 py-4">No converted leads yet</p>
        )}
      </div>
    </div>
  );
};

const RecentLeads = ({ leads, loading }) => {
  const navigate = useNavigate();
  
  if (loading) return <div className="card h-64 animate-pulse" />;

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
        <button 
          onClick={() => navigate('/leads')}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
        >
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="space-y-3">
        {recentLeads.map((lead) => (
          <div 
            key={lead.id}
            onClick={() => navigate(`/leads/${lead.id}`)}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(lead.priority)}`} />
              <div>
                <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                <p className="text-xs text-gray-500">{lead.company} • {lead.lead_source}</p>
              </div>
            </div>
            <span className={`badge ${getStageColor(lead.stage)}`}>
              {lead.stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { metrics, loading: metricsLoading } = useMRRMetrics();
  const { overdue, loading: overdueLoading } = useOverdueFollowups();
  const { topLeads, loading: topLeadsLoading } = useTopMRRLeads(5);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your sales pipeline and revenue</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total MRR"
          value={metricsLoading ? '...' : formatCurrency(metrics?.total_mrr)}
          subtitle="Monthly Recurring Revenue"
          icon={DollarSign}
          trend="+12% from last month"
          trendUp={true}
          onClick={() => navigate('/revenue')}
        />
        <StatCard
          title="Potential MRR"
          value={metricsLoading ? '...' : formatCurrency(metrics?.potential_mrr)}
          subtitle="In active pipeline"
          icon={TrendingUp}
          trend="Active deals"
          trendUp={true}
          onClick={() => navigate('/pipeline')}
        />
        <StatCard
          title="ARR Forecast"
          value={metricsLoading ? '...' : formatCurrency((metrics?.total_mrr || 0) * 12)}
          subtitle="Annual Run Rate"
          icon={DollarSign}
        />
        <StatCard
          title="Total Leads"
          value={metricsLoading ? '...' : metrics?.total_leads}
          subtitle={`${metrics?.converted_count || 0} converted`}
          icon={Users}
          trend={`${metricsLoading ? 0 : ((metrics?.converted_count / metrics?.total_leads) * 100).toFixed(1)}% conversion`}
          trendUp={true}
          onClick={() => navigate('/leads')}
        />
      </div>

      {/* Alerts & Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <OverdueAlert overdue={overdue} loading={overdueLoading} />
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/leads/new')}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Add Lead</span>
          </button>
          <button 
            onClick={() => navigate('/pipeline')}
            className="flex-1 btn-secondary flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Pipeline</span>
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopMRRLeads leads={topLeads} loading={topLeadsLoading} />
        <RecentLeads leads={[]} loading={false} />
      </div>
    </div>
  );
};

export default Dashboard;
