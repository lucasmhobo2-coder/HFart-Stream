import React, { useState } from 'react';
import {
  ArrowLeft, Bell, Shield, Eye, Globe, Smartphone, Trash2,
  Moon, Volume2, Lock, LogOut, ChevronRight, Radio, Sparkles,
  MessageSquare, UserX, AlertTriangle, HelpCircle, FileText,
  ToggleLeft, ToggleRight, Check, Info,
} from 'lucide-react';
import { UserProfile } from '../types';
import { logoutUser } from '../lib/authService';

interface SettingsScreenProps {
  currentUser: UserProfile | null;
  onLogout: () => void;
  onBack: () => void;
}

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
  accent?: string;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, description, value, onChange, icon, accent = 'bg-rose-600' }) => (
  <div className="flex items-center justify-between py-3.5 px-4">
    <div className="flex items-center gap-3 flex-1">
      {icon && <span className="shrink-0">{icon}</span>}
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? accent : 'bg-slate-700'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  </div>
);

interface NavRowProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
  destructive?: boolean;
}

const NavRow: React.FC<NavRowProps> = ({ label, description, icon, badge, onClick, destructive }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between py-3.5 px-4 w-full text-left hover:bg-slate-800/40 transition-colors ${destructive ? 'text-red-400' : 'text-white'}`}
  >
    <div className="flex items-center gap-3 flex-1">
      {icon && <span className="shrink-0">{icon}</span>}
      <div>
        <p className={`text-sm font-medium ${destructive ? 'text-red-400' : 'text-white'}`}>{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
    {badge && (
      <span className="px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 text-[10px] font-bold mr-2">
        {badge}
      </span>
    )}
    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
  </button>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentUser,
  onLogout,
  onBack,
}) => {
  // Notification preferences
  const [notifs, setNotifs] = useState({
    liveAlerts: true,
    newFollowers: true,
    messages: true,
    subscriptions: true,
    giftAlerts: true,
    announcements: false,
  });

  // Privacy preferences
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showOnline: true,
    allowDMs: true,
    showSubscriptions: false,
  });

  // Playback preferences
  const [playback, setPlayback] = useState({
    autoplay: true,
    darkMode: true,
    reducedMotion: false,
    muteOnStart: false,
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    onLogout();
  };

  const SectionHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur z-10">
      <button onClick={onBack} className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <h2 className="text-base font-bold text-white">{title}</h2>
    </div>
  );

  // Sub-sections
  if (activeSection === 'notifications') {
    return (
      <div className="min-h-screen bg-slate-950 pb-20">
        <SectionHeader title="Notifications" onBack={() => setActiveSection(null)} />
        <div className="divide-y divide-slate-800/60">
          <ToggleRow label="Live Stream Alerts" description="Get notified when followed creators go live" value={notifs.liveAlerts} onChange={(v) => setNotifs(p => ({ ...p, liveAlerts: v }))} icon={<Radio className="w-4 h-4 text-rose-400" />} />
          <ToggleRow label="New Followers" description="Alert when someone follows you" value={notifs.newFollowers} onChange={(v) => setNotifs(p => ({ ...p, newFollowers: v }))} icon={<Sparkles className="w-4 h-4 text-blue-400" />} accent="bg-blue-600" />
          <ToggleRow label="Direct Messages" description="Notifications for new messages" value={notifs.messages} onChange={(v) => setNotifs(p => ({ ...p, messages: v }))} icon={<MessageSquare className="w-4 h-4 text-emerald-400" />} accent="bg-emerald-600" />
          <ToggleRow label="Subscriptions & Gifts" description="Payment and gift notifications" value={notifs.subscriptions} onChange={(v) => setNotifs(p => ({ ...p, subscriptions: v }))} icon={<Sparkles className="w-4 h-4 text-amber-400" />} accent="bg-amber-600" />
          <ToggleRow label="Platform Announcements" description="HFArt product updates" value={notifs.announcements} onChange={(v) => setNotifs(p => ({ ...p, announcements: v }))} icon={<Bell className="w-4 h-4 text-slate-400" />} accent="bg-slate-600" />
        </div>
      </div>
    );
  }

  if (activeSection === 'privacy') {
    return (
      <div className="min-h-screen bg-slate-950 pb-20">
        <SectionHeader title="Privacy & Safety" onBack={() => setActiveSection(null)} />
        <div className="divide-y divide-slate-800/60">
          <ToggleRow label="Public Profile" description="Anyone can discover your profile" value={privacy.publicProfile} onChange={(v) => setPrivacy(p => ({ ...p, publicProfile: v }))} icon={<Globe className="w-4 h-4 text-blue-400" />} accent="bg-blue-600" />
          <ToggleRow label="Show Online Status" description="Let others see when you're online" value={privacy.showOnline} onChange={(v) => setPrivacy(p => ({ ...p, showOnline: v }))} icon={<Eye className="w-4 h-4 text-emerald-400" />} accent="bg-emerald-600" />
          <ToggleRow label="Allow Direct Messages" description="Receive DMs from other users" value={privacy.allowDMs} onChange={(v) => setPrivacy(p => ({ ...p, allowDMs: v }))} icon={<MessageSquare className="w-4 h-4 text-purple-400" />} accent="bg-purple-600" />
          <ToggleRow label="Show Subscriptions" description="Display your subscriptions publicly" value={privacy.showSubscriptions} onChange={(v) => setPrivacy(p => ({ ...p, showSubscriptions: v }))} icon={<Lock className="w-4 h-4 text-rose-400" />} />
        </div>
        <div className="mt-6 mx-4 space-y-2">
          <NavRow label="Blocked Users" description="Manage who can't contact you" icon={<UserX className="w-4 h-4 text-slate-400" />} onClick={() => {}} />
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <NavRow label="Blocked Users" icon={<UserX className="w-4 h-4 text-slate-400" />} badge="0" onClick={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'playback') {
    return (
      <div className="min-h-screen bg-slate-950 pb-20">
        <SectionHeader title="Playback & Display" onBack={() => setActiveSection(null)} />
        <div className="divide-y divide-slate-800/60">
          <ToggleRow label="Autoplay Next Stream" description="Automatically start next stream" value={playback.autoplay} onChange={(v) => setPlayback(p => ({ ...p, autoplay: v }))} icon={<Radio className="w-4 h-4 text-rose-400" />} />
          <ToggleRow label="Dark Mode" description="Always use dark theme" value={playback.darkMode} onChange={(v) => setPlayback(p => ({ ...p, darkMode: v }))} icon={<Moon className="w-4 h-4 text-blue-400" />} accent="bg-blue-600" />
          <ToggleRow label="Mute on Stream Start" description="Start streams muted by default" value={playback.muteOnStart} onChange={(v) => setPlayback(p => ({ ...p, muteOnStart: v }))} icon={<Volume2 className="w-4 h-4 text-slate-400" />} accent="bg-slate-600" />
          <ToggleRow label="Reduce Motion" description="Limit animations and transitions" value={playback.reducedMotion} onChange={(v) => setPlayback(p => ({ ...p, reducedMotion: v }))} icon={<Smartphone className="w-4 h-4 text-emerald-400" />} accent="bg-emerald-600" />
        </div>
      </div>
    );
  }

  // Main settings screen
  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur z-10">
        <button onClick={onBack} className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold text-white">Settings</h1>
      </div>

      {/* User info card */}
      {currentUser && (
        <div className="mx-4 mt-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500/60"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">{currentUser.fullName}</p>
            <p className="text-xs text-slate-400">@{currentUser.username}</p>
            {!currentUser.isGuest && (
              <p className="text-[10px] text-emerald-400 mt-0.5">✓ Verified account</p>
            )}
          </div>
          {currentUser.isGuest && (
            <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded-lg font-semibold">
              Guest
            </span>
          )}
        </div>
      )}

      {/* Settings sections */}
      <div className="mt-5 space-y-4 px-4">

        {/* Notifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Notifications</p>
          </div>
          <NavRow
            label="Notification Preferences"
            description="Live alerts, followers, messages"
            icon={<Bell className="w-4 h-4 text-rose-400" />}
            onClick={() => setActiveSection('notifications')}
          />
        </div>

        {/* Privacy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Privacy & Safety</p>
          </div>
          <NavRow
            label="Privacy Settings"
            description="Control who can see your profile and DM you"
            icon={<Shield className="w-4 h-4 text-blue-400" />}
            onClick={() => setActiveSection('privacy')}
          />
        </div>

        {/* Playback */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Playback & Display</p>
          </div>
          <NavRow
            label="Playback & Display"
            description="Autoplay, dark mode, motion settings"
            icon={<Smartphone className="w-4 h-4 text-emerald-400" />}
            onClick={() => setActiveSection('playback')}
          />
        </div>

        {/* Support */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Support</p>
          </div>
          <NavRow label="Help Center" icon={<HelpCircle className="w-4 h-4 text-slate-400" />} onClick={() => {}} />
          <NavRow label="Terms of Service" icon={<FileText className="w-4 h-4 text-slate-400" />} onClick={() => {}} />
          <NavRow label="Community Guidelines" icon={<Info className="w-4 h-4 text-slate-400" />} onClick={() => {}} />
        </div>

        {/* Danger zone */}
        <div className="bg-slate-900 border border-rose-900/40 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-800">
            <p className="text-[11px] font-bold text-rose-400/80 uppercase tracking-wider">Account</p>
          </div>
          <NavRow
            label="Sign Out"
            icon={<LogOut className="w-4 h-4 text-red-400" />}
            onClick={() => setShowLogoutConfirm(true)}
            destructive
          />
          <NavRow
            label="Delete Account"
            description="Permanently remove your account"
            icon={<Trash2 className="w-4 h-4 text-red-400" />}
            onClick={() => alert('Please contact HFArt support to delete your account.')}
            destructive
          />
        </div>

        {/* App version */}
        <p className="text-center text-[10px] text-slate-600 pb-4">
          HFArt Streaming v4.0 • HV100 Creator Engine • South Africa & Beyond
        </p>
      </div>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sign Out?</h3>
              <p className="text-xs text-slate-400 mt-1">You'll need to log in again to access your account.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-950/40"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
