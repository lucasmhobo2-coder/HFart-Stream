import React, { useState, useEffect } from 'react';
import { 
  X, Bell, Radio, UserPlus, MessageSquare, Clock, Star, Megaphone, Check, Trash2 
} from 'lucide-react';
import { UserNotification } from '../types';
import { subscribeToNotifications } from '../lib/firestoreService';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStream?: (streamId: string) => void;
}

const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    type: 'live',
    title: 'Aria Soundwave is Live Now!',
    message: '🎧 Midnight Cyberpunk Beats & Live Modular Synth Set (Req Open)',
    timeAgo: '5m ago',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    linkAction: 'str-1',
  },
  {
    id: 'notif-2',
    type: 'follower',
    title: 'New Follower Alert!',
    message: '@cyber_knight started following your profile on HFArt.',
    timeAgo: '1h ago',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'notif-3',
    type: 'reply',
    title: 'Creator Replied to Your Comment',
    message: 'Nexus Gaming Pro: "Appreciate the support in chat! Next clutch is dedicated to you!"',
    timeAgo: '3h ago',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'notif-4',
    type: 'reminder',
    title: 'Upcoming Stream Reminder',
    message: 'TechTalk Podcast "AI Breakthroughs in 2026" starts in 15 minutes!',
    timeAgo: '4h ago',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
    linkAction: 'str-3',
  },
  {
    id: 'notif-5',
    type: 'subscription',
    title: 'Subscription Renewed',
    message: 'Your Tier 1 VIP Subscription to Aria Soundwave was renewed for Month 6.',
    timeAgo: '1 day ago',
    read: true,
  },
  {
    id: 'notif-6',
    type: 'announcement',
    title: 'Platform Announcement',
    message: 'HFArt HV100 Creator Ad Breaks & South Africa Streaming Cluster Version 4.0 are now active!',
    timeAgo: '2 days ago',
    read: true,
  },
];

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onSelectStream,
}) => {
  const [notifications, setNotifications] = useState<UserNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const unsub = subscribeToNotifications((fireNotifs) => {
      if (fireNotifs && fireNotifs.length > 0) {
        setNotifications((prev) => {
          // Merge newly received live notifications at top
          const existingIds = new Set(fireNotifs.map(n => n.id));
          const oldUnique = prev.filter(p => !existingIds.has(p.id));
          return [...fireNotifs, ...oldUnique];
        });
      }
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: UserNotification['type']) => {
    switch (type) {
      case 'live':
        return <Radio className="w-4 h-4 text-rose-500 animate-pulse" />;
      case 'follower':
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'subscription':
        return <Star className="w-4 h-4 text-purple-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-rose-400" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => (filter === 'unread' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div id="notifications-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">Stay up to date with creators & streams</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                filter === 'all' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                filter === 'unread' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                Read all
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
              <p>No notifications right now.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.linkAction && onSelectStream) {
                    onSelectStream(notif.linkAction);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                  notif.read
                    ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900'
                    : 'bg-slate-900 border-rose-900/50 hover:bg-slate-850 shadow-md shadow-rose-950/20'
                }`}
              >
                {/* Avatar / Icon */}
                <div className="relative flex-shrink-0">
                  {notif.avatar ? (
                    <img src={notif.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      {getNotificationIcon(notif.type)}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 p-1 bg-slate-950 rounded-full border border-slate-800">
                    {getNotificationIcon(notif.type)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className={`font-bold ${notif.read ? 'text-slate-200' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                      {notif.timeAgo}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
