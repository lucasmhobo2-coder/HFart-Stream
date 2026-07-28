import React from 'react';
import { Search, Radio, Video, User, Bell, Sparkles, LogIn, MessageSquare } from 'lucide-react';
import { ViewMode, UserProfile } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onOpenNotificationsModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  searchQuery = '',
  setSearchQuery,
  currentUser,
  onOpenAuthModal,
  onOpenNotificationsModal,
}) => {
  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 h-14 flex items-center px-4 gap-3"
    >
      {/* Brand */}
      <div
        id="brand-area"
        className="flex items-center gap-2 cursor-pointer shrink-0"
        onClick={() => setViewMode('home')}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-950/60">
          <Radio className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-black text-white tracking-tight hidden sm:block">
          HF<span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 bg-clip-text text-transparent">Art</span>
        </span>
      </div>

      {/* Search bar (desktop) */}
      <div className="flex-1 hidden md:block max-w-sm">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search creators, streams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Go Live */}
        <button
          id="header-go-live-btn"
          onClick={() => setViewMode('go_live_setup')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-950/50 transition-all"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Go Live</span>
        </button>

        {/* Creator Studio */}
        <button
          id="header-studio-btn"
          onClick={() => setViewMode('creator_studio')}
          className={`p-2 rounded-full border transition-all ${
            viewMode === 'creator_studio'
              ? 'bg-rose-950/60 text-rose-300 border-rose-800'
              : 'bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-800 hover:text-white'
          }`}
          title="Creator Studio"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Messages */}
        <button
          id="header-messages-btn"
          onClick={() => setViewMode('messages')}
          className={`p-2 rounded-full border transition-all ${
            viewMode === 'messages'
              ? 'bg-blue-950/60 text-blue-300 border-blue-800'
              : 'bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-800 hover:text-white'
          }`}
          title="Messages"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          id="header-notif-btn"
          onClick={onOpenNotificationsModal}
          className="p-2 rounded-full bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-slate-800 hover:text-white relative transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 ring-2 ring-slate-900 animate-ping"></span>
        </button>

        {/* Profile / Auth */}
        {currentUser ? (
          <button
            id="header-profile-btn"
            onClick={() => setViewMode('profile')}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
            title={currentUser.fullName}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-red-500/80"
            />
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
          >
            <LogIn className="w-3.5 h-3.5 text-rose-400" />
            <span>Log In</span>
          </button>
        )}
      </div>
    </header>
  );
};
