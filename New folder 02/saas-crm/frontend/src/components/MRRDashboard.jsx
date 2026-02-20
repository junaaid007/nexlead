import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Crown
} from 'lucide-react';
import { useMRRMetrics, useTopMRRLeads } from '../hooks/useLeads';
import { formatCurrency, calculateARR } from '../utils/calculations';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendUp }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trendUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
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

const MRRDashboard = () => {
  const navigate = useNavigate();
  const { metrics, loading: metricsLoading } = useMRRMetrics();
  const { topLeads, loading: topLeadsLoading } = useTopMRRLeads(10);

  const totalMRR = metrics?.total_mrr || 0;
  const potentialMRR = metrics?.potential_mrr || 0;
  const arr = calculateARR(totalMRR);
  const convertedCount = metrics?.converted_count || 0;
  const totalLeads = metrics?.total_leads || 0;

  // Calculate average MRR per customer
  const avgMRR = convertedCount > 0 ? totalMRR / convertedCount : 0;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>
        <p className="text-gray-500 mt-1">Track MRR, ARR, and revenue metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total MRR"
          value={metricsLoading ? '...' : formatCurrency(totalMRR)}
          subtitle="Monthly Recurring Revenue"
          icon={DollarSign}
          trend="+15% from last month"
          trendUp={true}
        />
        <StatCard
          title="ARR"
          value={metricsLoading ? '...' : formatCurrency(arr)}
          subtitle="Annual Run Rate"
          icon={Calendar}
        />
        <StatCard
          title="Potential MRR"
          value={metricsLoading ? '...' : formatCurrency(potentialMRR)}
          subtitle="In active pipeline"
          icon={TrendingUp}
          trend="Active deals worth"
          trendUp={true}
        />
        <StatCard
          title="Avg MRR/Customer"
          value={metricsLoading ? '...' : formatCurrency(avgMRR)}
          subtitle={`${convertedCount} paying customers`}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top MRR Customers */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Crown className="w-6 h-6 text-amber-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Top 10 MRR Customers</h3>
              </div>
              <span className="text-sm text-gray-500">
                {topLeadsLoading ? '...' : `${topLeads.length} customers`}
              </span>
            </div>

            {topLeadsLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg" />
                ))}
              </div>
            ) : topLeads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No converted customers yet</p>
                <button 
                  onClick={() => navigate('/pipeline')}
                  className="btn-primary"
                >
                  View Pipeline
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {topLeads.map((lead, index) => (
                  <div 
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${index === 0 ? 'bg-amber-100 text-amber-700' : 
                          index === 1 ? 'bg-gray-200 text-gray-700' : 
                          index === 2 ? 'bg-orange-100 text-orange-700' : 
                          'bg-primary-100 text-primary-700'}
                      `}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">{formatCurrency(lead.mrr)}/mo</p>
                      <p className="text-xs text-gray-500">{formatCurrency(lead.mrr * 12)}/yr</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="space-y-6">
          {/* MRR Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MRR Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Current MRR</span>
                  <span className="font-medium text-gray-900">{formatCurrency(totalMRR)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Potential MRR</span>
                  <span className="font-medium text-gray-900">{formatCurrency(potentialMRR)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${Math.min((potentialMRR / (totalMRR || 1)) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Pipeline Value</span>
                <span className="font-semibold text-gray-900">{formatCurrency(totalMRR + potentialMRR)}</span>
              </div>
            </div>
          </div>

          {/* Conversion Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Leads</span>
                <span className="font-medium text-gray-900">{totalLeads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Converted</span>
                <span className="font-medium text-emerald-600">{convertedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-medium text-gray-900">
                  {totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-600">Avg Deal Size</span>
                <span className="font-medium text-gray-900">
                  {convertedCount > 0 ? formatCurrency(totalMRR / convertedCount) : '$0'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/pipeline')}
                className="w-full btn-secondary text-sm"
              >
                View Pipeline
              </button>
              <button 
                onClick={() => navigate('/analytics')}
                className="w-full btn-secondary text-sm"
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MRRDashboard;
