import React from 'react';
import { Home, Search, Plus, Tv, User, MessageSquare } from 'lucide-react';
import { ViewMode, UserProfile } from '../types';

interface BottomNavProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenCreateModal: () => void;
  currentUser?: UserProfile | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  viewMode,
  setViewMode,
  onOpenCreateModal,
  currentUser,
}) => {
  const navItems = [
    { id: 'home' as ViewMode, label: 'Home', icon: Home },
    { id: 'discover' as ViewMode, label: 'Search', icon: Search },
    { id: 'plus', label: 'Live', icon: Plus, isAction: true },
    { id: 'messages' as ViewMode, label: 'Messages', icon: MessageSquare },
    { id: 'profile' as ViewMode, label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="bottom-navigation"
      className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40 px-3 py-2"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key="action-plus"
                id="bottom-nav-plus-btn"
                onClick={onOpenCreateModal}
                className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-red-950/60 ring-4 ring-slate-900 transition-transform active:scale-95 hover:scale-105"
                title="Go Live / Create"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            );
          }

          const isActive = viewMode === item.id;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setViewMode(item.id as ViewMode)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-red-500 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-normal'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
