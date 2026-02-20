import { useNavigate } from 'react-router-dom';
import { Mail, Phone, DollarSign, Calendar, Clock } from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeDate, isOverdue, getPriorityColor, getStageColor } from '../utils/calculations';

const LeadCard = ({ lead, onStageChange }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/leads/${lead.id}`);
  };

  const handleStageClick = (e) => {
    e.stopPropagation();
    if (onStageChange) {
      onStageChange(lead);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {lead.name}
          </h4>
          <p className="text-sm text-gray-500 truncate">{lead.company || 'No company'}</p>
        </div>
        <span className={`badge ${getPriorityColor(lead.priority)} ml-2 flex-shrink-0`}>
          {lead.priority}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      {/* Deal Value */}
      <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 mb-3">
        <div className="flex items-center text-sm">
          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
          <span className="font-medium text-gray-900">{formatCurrency(lead.deal_value)}</span>
        </div>
        {lead.mrr > 0 && (
          <span className="text-xs text-emerald-600 font-medium">
            {formatCurrency(lead.mrr)}/mo
          </span>
        )}
      </div>

      {/* Stage & Next Action */}
      <div className="space-y-2">
        <div 
          onClick={handleStageClick}
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStageColor(lead.stage)}`}
        >
          {lead.stage}
        </div>

        {lead.next_action && (
          <div className={`flex items-center text-xs ${isOverdue(lead.next_action_date) ? 'text-rose-600' : 'text-gray-500'}`}>
            <Clock className="w-3 h-3 mr-1" />
            <span className="truncate">{lead.next_action}</span>
            {lead.next_action_date && (
              <span className="ml-1 font-medium">
                ({formatRelativeDate(lead.next_action_date)})
              </span>
            )}
          </div>
        )}

        {lead.trial_end_date && lead.stage.includes('Trial') && (
          <div className="flex items-center text-xs text-amber-600">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Trial ends {formatRelativeDate(lead.trial_end_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
