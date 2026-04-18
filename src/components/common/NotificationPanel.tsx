import React, { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  X, Bell, Briefcase, Clock, AlertTriangle, 
  ArrowUpCircle, CheckCircle, CalendarCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
  onClose: () => void;
}

const fetchNotifications = () => axiosInstance.get('/notifications').then((r) => r.data.data);

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000,
  });

  const markAsRead = useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markAllAsRead = useMutation({
    mutationFn: () => axiosInstance.post('/notifications/mark-all-read'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = (notif: any) => {
    if (!notif.isRead) markAsRead.mutate(notif.id);
    if (notif.link) {
      navigate(notif.link);
      onClose();
    }
  };

  const getIconData = (type: string) => {
    switch(type) {
      case 'case_assigned': return { bg: 'bg-blue-100', icon: <Briefcase className="w-4 h-4 text-blue-600" /> };
      case 'sla_warning': return { bg: 'bg-amber-100', icon: <Clock className="w-4 h-4 text-amber-600" /> };
      case 'sla_breach': return { bg: 'bg-red-100', icon: <AlertTriangle className="w-4 h-4 text-red-600" /> };
      case 'case_escalated': return { bg: 'bg-red-100', icon: <ArrowUpCircle className="w-4 h-4 text-red-600" /> };
      case 'case_closed': return { bg: 'bg-green-100', icon: <CheckCircle className="w-4 h-4 text-green-600" /> };
      case 'review_due': return { bg: 'bg-purple-100', icon: <CalendarCheck className="w-4 h-4 text-purple-600" /> };
      default: return { bg: 'bg-slate-100', icon: <Bell className="w-4 h-4 text-slate-600" /> };
    }
  };

  return (
    <div 
      ref={panelRef}
      className="fixed top-16 right-4 w-96 max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={() => markAllAsRead.mutate()}
              className="text-[#1B4FD8] text-sm hover:underline"
            >
              Mark all as read
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-96 flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No notifications</p>
            <p className="text-slate-400 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif: any) => {
              const iconData = getIconData(notif.type);
              return (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`px-5 py-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition flex items-start gap-3 relative ${!notif.isRead ? 'border-l-2 border-l-[#1B4FD8] bg-blue-50/20' : ''}`}
                >
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${iconData.bg}`}>
                    {iconData.icon}
                  </div>
                  <div className="flex-1 pr-2">
                    <p className={`text-sm text-slate-800 ${!notif.isRead ? 'font-bold' : 'font-medium'}`}>{notif.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-slate-100 text-center shrink-0">
        <button className="text-[#1B4FD8] text-sm hover:underline font-medium">View all notifications</button>
      </div>
    </div>
  );
};
