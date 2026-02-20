// Format currency
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format relative date
export const formatRelativeDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `${diffDays} days`;
};

// Check if date is overdue
export const isOverdue = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
};

// Get priority color class
export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'badge-high';
    case 'medium':
      return 'badge-medium';
    case 'low':
      return 'badge-low';
    default:
      return 'badge-medium';
  }
};

// Get stage color class
export const getStageColor = (stage) => {
  switch (stage) {
    case 'New':
      return 'stage-new';
    case 'Contacted':
      return 'stage-contacted';
    case 'Trial Started':
      return 'stage-trial';
    case 'Trial Expiring':
      return 'stage-expiring';
    case 'Interested':
      return 'stage-interested';
    case 'Converted':
      return 'stage-converted';
    case 'Lost':
      return 'stage-lost';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Calculate ARR from MRR
export const calculateARR = (mrr) => {
  return (parseFloat(mrr) || 0) * 12;
};

// Calculate conversion rate
export const calculateConversionRate = (converted, total) => {
  if (!total || total === 0) return 0;
  return ((converted / total) * 100).toFixed(1);
};

// Stages array in order
export const STAGES = ['New', 'Contacted', 'Trial Started', 'Trial Expiring', 'Interested', 'Converted', 'Lost'];

// Priority options
export const PRIORITIES = ['Low', 'Medium', 'High'];

// Lead source options
export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Google Ads',
  'Cold Email',
  'Conference',
  'Social Media',
  'Other'
];

// Next action options
export const NEXT_ACTIONS = [
  'Call',
  'Email',
  'Demo',
  'Proposal',
  'Follow-up',
  'Contract Discussion',
  'Technical Review',
  'Integration Call',
  'Quarterly Review',
  'Onboarding Check'
];
