import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  FolderPlus, CheckCircle, Edit3, UserCheck, 
  Upload, MessageSquare, CheckSquare, ShieldCheck, 
  LogIn, Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  actionType: string;
  detail: Record<string, any>;
  createdAt: string;
  userFullName: string;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities = [], isLoading = false }) => {
  const getActionConfig = (actionType: string) => {
    switch (actionType) {
      case 'case_created':
        return { bg: 'bg-blue-100', icon: <FolderPlus className="w-4 h-4 text-blue-600" /> };
      case 'case_closed':
        return { bg: 'bg-green-100', icon: <CheckCircle className="w-4 h-4 text-green-600" /> };
      case 'case_updated':
        return { bg: 'bg-slate-100', icon: <Edit3 className="w-4 h-4 text-slate-600" /> };
      case 'case_assigned':
        return { bg: 'bg-purple-100', icon: <UserCheck className="w-4 h-4 text-purple-600" /> };
      case 'evidence_uploaded':
        return { bg: 'bg-teal-100', icon: <Upload className="w-4 h-4 text-teal-600" /> };
      case 'note_created':
        return { bg: 'bg-amber-100', icon: <MessageSquare className="w-4 h-4 text-amber-600" /> };
      case 'task_completed':
        return { bg: 'bg-green-100', icon: <CheckSquare className="w-4 h-4 text-green-600" /> };
      case 'risk_assessed':
        return { bg: 'bg-blue-100', icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> };
      case 'login':
        return { bg: 'bg-slate-100', icon: <LogIn className="w-4 h-4 text-slate-500" /> };
      default:
        return { bg: 'bg-slate-100', icon: <Activity className="w-4 h-4 text-slate-500" /> };
    }
  };

  const getActionText = (item: ActivityItem) => {
    const { actionType, detail, userFullName } = item;
    const caseRef = detail?.caseRef ? `<span class="font-medium">${detail.caseRef}</span>` : '';
    const assigneeName = detail?.assigneeName ? `<span class="font-medium">${detail.assigneeName}</span>` : '';

    switch (actionType) {
      case 'case_created': return `${userFullName} opened case ${caseRef}`;
      case 'case_closed': return `${userFullName} closed case ${caseRef}`;
      case 'evidence_uploaded': return `${userFullName} uploaded evidence to ${caseRef}`;
      case 'note_created': return `${userFullName} added a note to ${caseRef}`;
      case 'risk_assessed': return `${userFullName} completed risk assessment`;
      case 'task_completed': return `${userFullName} completed a task on ${caseRef}`;
      case 'case_assigned': return `Case ${caseRef} assigned to ${assigneeName}`;
      case 'login': return `${userFullName} logged in`;
      default: return `${userFullName} performed ${actionType}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-slate-800">Recent Activity</h3>
        <Link to="/admin/audit" className="text-[#1B4FD8] text-sm hover:underline">View all →</Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer shrink-0" />
                <div className="flex-1 pt-1 space-y-2">
                  <div className="h-3 w-3/4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded" />
                  <div className="h-2 w-1/4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Activity className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-slate-600 font-medium">No activity yet</p>
            <p className="text-slate-400 text-sm">Actions taken on cases will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {activities.slice(0, 10).map((act) => {
              const config = getActionConfig(act.actionType);
              return (
                <div key={act.id} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0 relative">
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-sm text-slate-700" 
                      dangerouslySetInnerHTML={{ __html: getActionText(act) }} 
                    />
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
