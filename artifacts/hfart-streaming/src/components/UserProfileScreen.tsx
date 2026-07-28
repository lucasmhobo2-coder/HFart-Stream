import React, { useState } from 'react';
import { 
  Radio, Check, UserPlus, Share2, Eye, Heart, Film, Video, MessageSquare, Play, Sparkles, ShieldCheck, Smartphone, Lock, Key, AlertCircle, LogOut, CheckCircle2, DollarSign
} from 'lucide-react';
import { Creator, Recording, Clip, CommunityPost, Stream } from '../types';

interface UserProfileScreenProps {
  creator: Creator;
  streams: Stream[];
  recordings: Recording[];
  clips: Clip[];
  posts: CommunityPost[];
  currentUser?: import('../types').UserProfile | null;
  onToggleFollow: (creatorId: string) => void;
  onToggleSubscribe: (creatorId: string) => void;
  onSelectStream: (stream: Stream) => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  creator,
  streams,
  recordings,
  clips,
  posts,
  currentUser,
  onToggleFollow,
  onToggleSubscribe,
  onSelectStream,
  onOpenAuthModal,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    'live_videos' | 'recordings' | 'clips' | 'community' | 'security'
  >('live_videos');
  const [showShareToast, setShowShareToast] = useState(false);

  // Categorized Platform Notification Preferences
  const [notifPreferences, setNotifPreferences] = useState({
    live: true,
    messages: true,
    followers: true,
    business: true,
    payments: true,
    security: true,
    system: true,
  });

  // Multi-Device Sync State
  const [activePlaybackDevice, setActivePlaybackDevice] = useState<'Phone' | 'Smart TV' | 'Desktop Browser'>('Phone');
  const [handoffProgress, setHandoffProgress] = useState('14:20 / 45:00');

  // Security state controls
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState<boolean>(true);
  const [devices, setDevices] = useState([
    { id: 'd-1', name: 'MacBook Pro (Chrome)', location: 'Johannesburg, ZA', ip: '102.165.18.42', lastActive: 'Active Now', current: true },
    { id: 'd-2', name: 'iPhone 15 Pro (HFArt Mobile App)', location: 'Cape Town, ZA', ip: '102.165.22.10', lastActive: '2 hours ago', current: false },
    { id: 'd-3', name: 'Windows Desktop (Firefox)', location: 'Frankfurt, DE', ip: '185.220.101.5', lastActive: '3 days ago', current: false },
  ]);

  // Filter streams belonging to this creator
  const creatorLiveStreams = streams.filter((s) => s.creator.id === creator.id && s.isLive);

  return (
    <div id="creator-profile-container" className="pb-24 max-w-6xl mx-auto">
      
      {/* Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden">
        <img src={creator.banner} alt={creator.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
      </div>

      {/* Profile Header Details */}
      <div className="px-4 sm:px-6 -mt-16 sm:-mt-20 relative z-10 space-y-6">
        
        {/* Profile Avatar & Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          
          {/* Photo & Name */}
          <div className="flex items-end gap-4">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-slate-950 bg-slate-900 shadow-2xl"
              />
              {creator.isLive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  LIVE
                </div>
              )}
            </div>

            <div className="mb-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-extrabold text-white">{creator.name}</h1>
                {creator.verified && <span className="text-amber-400 text-sm">✓</span>}
              </div>
              <p className="text-xs text-slate-400">@{creator.username}</p>
            </div>
          </div>

          {/* Subscribe, Follow, Share */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onToggleSubscribe(creator.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                creator.isSubscribed
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 border-amber-400 hover:from-amber-400 hover:to-rose-400 shadow-md'
              }`}
            >
              {creator.isSubscribed ? 'Subscribed ★' : 'Subscribe $4.99'}
            </button>

            <button
              onClick={() => onToggleFollow(creator.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                creator.isFollowing
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-md'
              }`}
            >
              {creator.isFollowing ? 'Following' : '+ Follow'}
            </button>

            <button
              onClick={() => {
                setShowShareToast(true);
                setTimeout(() => setShowShareToast(false), 2500);
              }}
              className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Share Toast */}
        {showShareToast && (
          <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs text-center animate-in fade-in max-w-sm">
            Creator profile link copied to clipboard!
          </div>
        )}

        {/* Stats Row: Followers, Following, Total Likes, Total Views */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Followers</span>
            <span className="text-sm sm:text-base font-extrabold text-white">{creator.followersCount.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Following</span>
            <span className="text-sm sm:text-base font-extrabold text-white">{creator.followingCount.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Total Likes</span>
            <span className="text-sm sm:text-base font-extrabold text-rose-400">{creator.totalLikes.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Total Views</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400">{creator.totalViews.toLocaleString()}</span>
          </div>
        </div>

        {/* About Bio */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">About</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{creator.bio}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'live_videos', label: 'Live Videos', icon: Radio },
            { id: 'recordings', label: 'Recordings', icon: Video },
            { id: 'clips', label: 'Clips', icon: Film },
            { id: 'community', label: 'Community Posts', icon: MessageSquare },
            { id: 'security', label: 'Security & Devices', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'live_videos' && (
          <div className="space-y-4">
            {creatorLiveStreams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {creatorLiveStreams.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectStream(s)}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer group hover:border-slate-700"
                  >
                    <div className="relative aspect-video">
                      <img src={s.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                        LIVE NOW
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{s.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">{s.viewerCount.toLocaleString()} watching</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400 space-y-2">
                <Radio className="w-6 h-6 text-slate-500 mx-auto" />
                <p>Creator is not currently live.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recordings' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recordings.map((rec) => (
              <div key={rec.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-3 flex gap-3">
                <img src={rec.thumbnail} className="w-24 aspect-video rounded-xl object-cover shrink-0" />
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-white line-clamp-1">{rec.title}</h4>
                  <p className="text-slate-400">{rec.duration} • {rec.views.toLocaleString()} views</p>
                  <p className="text-slate-500 text-[10px]">{rec.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'clips' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {clips.map((clip) => (
              <div key={clip.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs space-y-2">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <img src={clip.thumbnail} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white">{clip.duration}</span>
                </div>
                <h4 className="font-bold text-white line-clamp-1">{clip.title}</h4>
                <p className="text-slate-400 text-[11px]">{clip.views.toLocaleString()} views</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'community' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-xs text-slate-400 space-y-2 text-center">
            <MessageSquare className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="font-bold text-white text-sm">Community Feed & Announcements</h4>
            <p className="max-w-md mx-auto">Creator community posts, polls, and image announcements are active for verified channels.</p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-500" />
                Security Center & Active Device Management
              </h3>
              <p className="text-slate-400">Manage two-factor authentication, active login sessions and login security alerts</p>
            </div>

            {/* Security Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 2FA Card */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block text-sm">Two-Factor Authentication (2FA)</span>
                  <span className="text-[11px] text-slate-400">Authenticator app or SMS backup codes</span>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Login Alerts Card */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block text-sm">New Device Login Alerts</span>
                  <span className="text-[11px] text-slate-400">Email & push alerts on unrecognized logins</span>
                </div>
                <button
                  onClick={() => setLoginAlertsEnabled(!loginAlertsEnabled)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    loginAlertsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {loginAlertsEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            {/* Active Sessions & Device List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  Active Authorized Devices ({devices.length})
                </h4>
                {devices.length > 1 && (
                  <button
                    onClick={() => {
                      setDevices(devices.filter((d) => d.current));
                      alert('Logged out from all other devices.');
                    }}
                    className="text-rose-400 hover:text-rose-300 text-[11px] font-bold"
                  >
                    Sign Out All Other Devices
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {devices.map((dev) => (
                  <div key={dev.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{dev.name}</span>
                        {dev.current && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-extrabold uppercase">
                            This Device
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        {dev.location} • IP: <span className="font-mono">{dev.ip}</span> • {dev.lastActive}
                      </p>
                    </div>

                    {!dev.current && (
                      <button
                        onClick={() => setDevices(devices.filter((d) => d.id !== dev.id))}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-all"
                        title="Sign Out Device"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
