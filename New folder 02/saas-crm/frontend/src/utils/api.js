import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Leads API
export const leadsApi = {
  getAll: (filters = {}) => api.get('/leads', { params: filters }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  updateStage: (id, stage) => api.patch(`/leads/${id}/stage`, { stage }),
  getSources: () => api.get('/leads/sources'),
  getOverdueFollowups: () => api.get('/leads/overdue-followups'),
  getTopMRR: (limit = 10) => api.get('/leads/top-mrr', { params: { limit } }),
  addInteraction: (id, data) => api.post(`/leads/${id}/interactions`, data),
};

// Analytics API
export const analyticsApi = {
  getMRRMetrics: () => api.get('/analytics/mrr'),
  getFunnelData: () => api.get('/analytics/funnel'),
  getLeadSourceROI: () => api.get('/analytics/sources'),
};

export default api;
