import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users,
  Target,
  ArrowRight
} from 'lucide-react';
import { useFunnelData, useLeadSourceROI } from '../hooks/useLeads';
import { formatCurrency, STAGES } from '../utils/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#f97316', '#06b6d4', '#10b981', '#6b7280'];

const Analytics = () => {
  const navigate = useNavigate();
  const { funnelData, loading: funnelLoading } = useFunnelData();
  const { roiData, loading: roiLoading } = useLeadSourceROI();

  // Prepare funnel chart data
  const funnelChartData = funnelData.map(item => ({
    name: item.stage,
    leads: parseInt(item.count),
    value: parseFloat(item.total_value)
  }));

  // Prepare source ROI data
  const sourceChartData = roiData.map(item => ({
    name: item.lead_source,
    leads: item.lead_count,
    mrr: item.total_mrr,
    conversion: item.conversion_rate
  }));

  // Calculate total stats
  const totalLeads = funnelData.reduce((sum, item) => sum + parseInt(item.count), 0);
  const totalValue = funnelData.reduce((sum, item) => sum + parseFloat(item.total_value), 0);
  const convertedLeads = funnelData.find(item => item.stage === 'Converted')?.count || 0;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Sales funnel and conversion insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalLeads}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{conversionRate}%</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pipeline Value</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalValue)}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Deal Size</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {totalLeads > 0 ? formatCurrency(totalValue / totalLeads) : '$0'}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Funnel Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Funnel</h3>
            <span className="text-sm text-gray-500">Lead distribution by stage</span>
          </div>
          {funnelLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 h-full w-full rounded-lg" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value} leads`, 'Count']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="leads" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Lead Source Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Lead Sources</h3>
            <span className="text-sm text-gray-500">Distribution by source</span>
          </div>
          {roiLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 h-full w-full rounded-lg" />
            </div>
          ) : sourceChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="leads"
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} leads`, name]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Lead Source ROI Table */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Lead Source ROI</h3>
          <span className="text-sm text-gray-500">Performance by source</span>
        </div>
        {roiLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : roiData.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Source</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Leads</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total MRR</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Pipeline Value</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {roiData.map((source) => (
                  <tr key={source.lead_source} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{source.lead_source}</td>
                    <td className="py-3 px-4 text-center">{source.lead_count}</td>
                    <td className="py-3 px-4 text-right font-medium text-emerald-600">
                      {formatCurrency(source.total_mrr)}
                    </td>
                    <td className="py-3 px-4 text-right">{formatCurrency(source.pipeline_value)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge ${source.conversion_rate >= 20 ? 'bg-emerald-100 text-emerald-800' : source.conversion_rate >= 10 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                        {source.conversion_rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Funnel Details */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Funnel Conversion Details</h3>
          <button 
            onClick={() => navigate('/pipeline')}
            className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
          >
            View Pipeline <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        {funnelLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stage</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Leads</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Value</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">% of Total</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Conversion from Previous</th>
                </tr>
              </thead>
              <tbody>
                {funnelData.map((stage, index) => {
                  const prevCount = index > 0 ? parseInt(funnelData[index - 1].count) : parseInt(stage.count);
                  const stageConversion = index > 0 && prevCount > 0 
                    ? ((parseInt(stage.count) / prevCount) * 100).toFixed(1) 
                    : 100;
                  
                  return (
                    <tr key={stage.stage} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                      </td>
                      <td className="py-3 px-4 text-center">{stage.count}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(stage.total_value)}</td>
                      <td className="py-3 px-4 text-center">
                        {totalLeads > 0 ? ((parseInt(stage.count) / totalLeads) * 100).toFixed(1) : 0}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        {index === 0 ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <span className={stageConversion >= 50 ? 'text-emerald-600' : stageConversion >= 25 ? 'text-amber-600' : 'text-rose-600'}>
                            {stageConversion}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
