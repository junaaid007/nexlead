import { useState, useEffect, useCallback } from 'react';
import { leadsApi, analyticsApi } from '../utils/api';

export const useLeads = (filters = {}) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getAll(filters);
      setLeads(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads };
};

export const useLead = (id) => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await leadsApi.getById(id);
        setLead(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  return { lead, loading, error, setLead };
};

export const useMRRMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await analyticsApi.getMRRMetrics();
      setMetrics(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
};

export const useFunnelData = () => {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFunnel = async () => {
      try {
        setLoading(true);
        const response = await analyticsApi.getFunnelData();
        setFunnelData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFunnel();
  }, []);

  return { funnelData, loading, error };
};

export const useLeadSources = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await leadsApi.getSources();
        setSources(response.data.data);
      } catch (err) {
        console.error('Error fetching sources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  return { sources, loading };
};

export const useOverdueFollowups = () => {
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOverdue = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getOverdueFollowups();
      setOverdue(response.data.data);
    } catch (err) {
      console.error('Error fetching overdue:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverdue();
  }, [fetchOverdue]);

  return { overdue, loading, refetch: fetchOverdue };
};

export const useTopMRRLeads = (limit = 10) => {
  const [topLeads, setTopLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopLeads = async () => {
      try {
        setLoading(true);
        const response = await leadsApi.getTopMRR(limit);
        setTopLeads(response.data.data);
      } catch (err) {
        console.error('Error fetching top MRR leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopLeads();
  }, [limit]);

  return { topLeads, loading };
};

export const useLeadSourceROI = () => {
  const [roiData, setRoiData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchROI = async () => {
      try {
        setLoading(true);
        const response = await analyticsApi.getLeadSourceROI();
        setRoiData(response.data.data);
      } catch (err) {
        console.error('Error fetching ROI:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchROI();
  }, []);

  return { roiData, loading };
};
