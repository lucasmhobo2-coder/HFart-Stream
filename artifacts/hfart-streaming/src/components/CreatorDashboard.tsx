import React, { useState } from 'react';
import { 
  Video, Calendar, BarChart3, DollarSign, Users, Settings, Sparkles, TrendingUp, Clock, Eye, ShieldCheck, ArrowUpRight,
  Copy, Key, Camera, Mic, Radio, Share2, Heart, MessageSquare, Check, Facebook, Youtube, Instagram, Twitter,
  Wallet, Gift, Award, CheckCircle2, ChevronRight, Layers, Globe, Bot, Wand2, Languages, Image, Film, Flag, Lock, Bell, AlertCircle, RefreshCw
} from 'lucide-react';
import { Creator, CreatorAnalytics, ViewMode } from '../types';

interface CreatorDashboardProps {
  creator: Creator;
  analytics: CreatorAnalytics;
  setViewMode: (mode: ViewMode) => void;
  currentUser?: import('../types').UserProfile | null;
  onOpenAuthModal?: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  creator,
  analytics,
  setViewMode,
  currentUser,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'growth_engine' | 'creator_teams' | 'ai_studio' | 'event_center' | 'monetization' | 'wallet' | 'analytics' | 'community' | 'recordings' | 'trust_safety' | 'scheduled' | 'settings'
  >('overview');

  // Creator Teams State
  const [teamMembers, setTeamMembers] = useState([
    { id: 'tm-1', name: 'Zola Mthembu', email: 'zola@hfart.com', role: 'Manager', permissions: 'Full Management & Scheduling Access', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { id: 'tm-2', name: 'Sipho Dlamini', email: 'sipho@hfart.com', role: 'Moderator', permissions: 'Live Chat & Content Moderation', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: 'tm-3', name: 'Thando Nkosi', email: 'thando@hfart.com', role: 'Editor', permissions: 'VOD Replays & Clip Highlights', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { id: 'tm-4', name: 'Lindiwe Khumalo', email: 'lindiwe@hfart.com', role: 'Analyst', permissions: 'Read-only Analytics & Revenue Reports', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
  ]);
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamRole, setNewTeamRole] = useState<'Manager' | 'Moderator' | 'Editor' | 'Analyst'>('Moderator');

  // AI Studio State
  const [aiPromptCategory, setAiPromptCategory] = useState('Music');
  const [aiTopicKey, setAiTopicKey] = useState('Soweto Acoustic Live Concert');
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([
    '🔥 Soweto Acoustic Live Session — Unplugged Hits & VIP Requests',
    '🎸 Live From Johannesburg: Acoustic Vibez & Exclusive Fan QA',
    '✨ Soweto Sunset Acoustic Jam: Live Performance & Special Guests',
  ]);
  const [generatedDescription, setGeneratedDescription] = useState('Join us live for an exclusive unplugged acoustic session! We will be taking live chat song requests, giving subscriber shoutouts, and debuting unreleased tracks. #HFArtLive #SowetoAcoustic #LiveMusic');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('IsiZulu');
  const [translatedCaption, setTranslatedCaption] = useState('Sawubona bangane! Siyakwamukela ekushoniseni kwethu umculo bukhoma ngo-HFArt.');

  // Event Center State
  const [events, setEvents] = useState([
    { id: 'ev-1', title: '🎷 Soweto Jazz Festival Live Broadcast', type: 'Concert', date: 'Tomorrow at 8:00 PM', category: 'Music', remindersCount: 1240, setReminder: false },
    { id: 'ev-2', title: '🎮 Cyberpunk Esports Grand Final', type: 'Gaming Tournament', date: 'Jul 31, 2026 at 9:00 PM', category: 'Gaming', remindersCount: 3890, setReminder: true },
    { id: 'ev-3', title: '🎙️ African Tech Founders Podcast #12', type: 'Podcast', date: 'Aug 02, 2026 at 6:00 PM', category: 'Podcasts', remindersCount: 890, setReminder: false },
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Concert' | 'Gaming Tournament' | 'Podcast' | 'Question & Answer' | 'Workshop'>('Concert');

  // Community Tab State
  const [communityPostText, setCommunityPostText] = useState('');
  const [communityPostType, setCommunityPostType] = useState<'text' | 'photo' | 'poll' | 'announcement' | 'event'>('text');
  const [communityPosts, setCommunityPosts] = useState([
    { id: '1', type: 'announcement', text: '🎉 Big announcement! Next stream we will be hosting an interactive giveaway for all active subscribers!', time: '2 hours ago', likes: 142 },
    { id: '2', type: 'poll', text: 'Which genre should we stream this Friday evening?', options: ['Acoustic Rock (45%)', 'Synthwave & Electronic (55%)'], time: 'Yesterday', likes: 289 },
  ]);

  // Recordings / VOD Replays State
  const [recordings, setRecordings] = useState([
    { id: 'vod-101', title: '🔴 Weekend Special Live Concert Replay', duration: '1h 45m', views: 3420, date: '2 days ago', status: 'Published' },
    { id: 'vod-102', title: '🎙️ Live QA & Tech Showcase #44', duration: '58m', views: 1890, date: '5 days ago', status: 'Unpublished' },
  ]);

  const handleAddCommunityPost = () => {
    if (!communityPostText.trim()) return;
    setCommunityPosts([
      { id: Date.now().toString(), type: communityPostType, text: communityPostText, time: 'Just now', likes: 0 },
      ...communityPosts,
    ]);
    setCommunityPostText('');
  };

  const [monetizationSubTab, setMonetizationSubTab] = useState<
    'overview' | 'revenue' | 'subscribers' | 'ads' | 'donations' | 'payouts'
  >('overview');

  // Wallet & Payout State
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Creator Settings Form State
  const [streamQuality, setStreamQuality] = useState('1080p60');
  const [autoRecord, setAutoRecord] = useState(true);
  const [subscribersOnlyStream, setSubscribersOnlyStream] = useState(false);
  const [defaultSlowMode, setDefaultSlowMode] = useState(false);
  const [defaultFollowersOnly, setDefaultFollowersOnly] = useState(false);
  const [cameraDevice, setCameraDevice] = useState('Integrated HD Camera (Built-in)');
  const [micDevice, setMicDevice] = useState('Studio Condenser Mic (USB Audio)');
  const [streamKey, setStreamKey] = useState('live_sk_8912739481230912');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Connected Social Accounts state
  const [fbConnected, setFbConnected] = useState(true);
  const [ytConnected, setYtConnected] = useState(true);
  const [igConnected, setIgConnected] = useState(false);
  const [xConnected, setXConnected] = useState(false);

  const scheduledLives = [
    { id: '1', title: '🎙️ Special Guest Tech Podcast #45', date: 'Tomorrow at 8:00 PM', category: 'Podcasts', subsOnly: false },
    { id: '2', title: '🎧 Live Electronic Synth Album Launch Party', date: 'Jul 30, 2026 at 9:30 PM', category: 'Music', subsOnly: true },
  ];

  const handleCopyStreamKey = () => {
    navigator.clipboard.writeText(`rtmp://live.hfart.com/app/${streamKey}`);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => setPayoutRequested(false), 4000);
  };

  return (
    <div id="creator-studio-container" className="px-4 sm:px-6 py-6 pb-24 max-w-6xl mx-auto space-y-6">
      
      {/* Creator Home Greeting Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-red-500/80 shadow-md"
            />
            <div>
              <span className="text-xs text-rose-400 font-bold uppercase tracking-wider block">Good Morning, Creator!</span>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">{creator.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-400 font-semibold border border-red-800">
                  Creator Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">@{creator.username} • {creator.followersCount.toLocaleString()} Followers</p>
            </div>
          </div>

          {/* Quick Creator Home Shortcut Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode('go_live_setup')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Video className="w-4 h-4" />
              <span>Go Live</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('monetization')}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Revenue</span>
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>Community</span>
            </button>
            <button
              onClick={() => setActiveTab('event_center')}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>Events</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800">
        {[
          { id: 'overview', label: 'Studio Overview', icon: Sparkles },
          { id: 'growth_engine', label: 'Creator Growth Engine', icon: TrendingUp },
          { id: 'creator_teams', label: 'Creator Teams & Roles', icon: Users },
          { id: 'ai_studio', label: 'AI Studio Tools', icon: Bot },
          { id: 'event_center', label: 'Event Center', icon: Calendar },
          { id: 'community', label: 'Community Feed', icon: MessageSquare },
          { id: 'recordings', label: 'Stream Replays', icon: Video },
          { id: 'monetization', label: 'Monetization & Subs', icon: DollarSign },
          { id: 'wallet', label: 'Creator Wallet', icon: Wallet },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'trust_safety', label: 'Trust & Safety', icon: ShieldCheck },
          { id: 'scheduled', label: 'Scheduled Lives', icon: Calendar },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Studio Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Live Viewers
              </div>
              <span className="text-xl font-bold text-white">12,450</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Eye className="w-3.5 h-3.5 text-amber-400" /> Peak Viewers
              </div>
              <span className="text-xl font-bold text-white">{analytics.peakConcurrentViewers.toLocaleString()}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> Avg Watch Time
              </div>
              <span className="text-xl font-bold text-white">18.5 mins</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> New Followers
              </div>
              <span className="text-xl font-bold text-emerald-400">+{analytics.followerGrowth.toLocaleString()}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Total Revenue
              </div>
              <span className="text-xl font-bold text-emerald-400">${(analytics.adRevenueHV100 + analytics.subscriberRevenueUsd).toLocaleString()}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Share2 className="w-3.5 h-3.5 text-purple-400" /> Stream Shares
              </div>
              <span className="text-xl font-bold text-white">3,420</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Total Likes
              </div>
              <span className="text-xl font-bold text-white">34.1K</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Chat Messages
              </div>
              <span className="text-xl font-bold text-white">12,400</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Broadcast Software Stream Key</h3>
              <p className="text-xs text-slate-400">Use this RTMP URL & Stream Key for OBS Studio, vMix, or Streamlabs.</p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 flex justify-between items-center">
                  <span className="truncate">RTMP: rtmp://live.hfart.com/app</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 flex justify-between items-center">
                  <span>Key: {showStreamKey ? streamKey : '••••••••••••••••'}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowStreamKey(!showStreamKey)}
                      className="text-slate-400 hover:text-white"
                    >
                      {showStreamKey ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={handleCopyStreamKey}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">HV100 Ad Network Monetization</h3>
              <div className="p-4 bg-gradient-to-br from-amber-950/40 to-slate-950 rounded-xl border border-amber-800/50 space-y-2 text-xs">
                <span className="text-amber-400 font-bold">HV100 Ad Engine Status: 100% Monetized</span>
                <p className="text-slate-300">
                  Your streams automatically trigger HV100 creator-managed ad breaks with $28.50 average CPM payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Creator Growth Engine Dashboard */}
      {activeTab === 'growth_engine' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Creator Growth Engine & Trends</h3>
              </div>
              <p className="text-slate-400">Track key performance indicators, viewer retention trends, and personalized growth recommendations.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 font-extrabold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Growth Optimizer
            </span>
          </div>

          {/* Growth Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Followers Today</span>
              <span className="text-lg font-bold text-white">+142</span>
              <span className="text-emerald-400 text-[10px] font-bold block">↑ +18.4% vs avg</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Watch Hours</span>
              <span className="text-lg font-bold text-amber-400">1,840 hrs</span>
              <span className="text-emerald-400 text-[10px] font-bold block">↑ +24% this week</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Returning Viewers</span>
              <span className="text-lg font-bold text-rose-400">78.4%</span>
              <span className="text-slate-400 text-[10px] block">High loyalty score</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">New Subscribers</span>
              <span className="text-lg font-bold text-purple-400">+38 today</span>
              <span className="text-emerald-400 text-[10px] font-bold block">$189.62 earned</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Revenue</span>
              <span className="text-lg font-bold text-emerald-400">$2,845.00</span>
              <span className="text-slate-400 text-[10px] block">HV100 + Subs + Gifts</span>
            </div>
          </div>

          {/* Growth Tips & AI Optimization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Actionable AI Growth Tips
              </h4>
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-400">Optimal Stream Schedule</span>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[9px] font-extrabold uppercase">High Impact</span>
                  </div>
                  <p className="text-slate-300">Stream during peak 8 PM GMT+2 slot for 22% higher engagement based on your South Africa & Kenya audience base.</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-400">Collaboration Opportunities</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[9px] font-extrabold uppercase">Growth Partner</span>
                  </div>
                  <p className="text-slate-300">Collaborate with gaming and podcast creators on Friday night to tap into cross-over live stream viewers.</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-400">HV100 Ad Break Optimization</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-extrabold uppercase">Revenue Boost</span>
                  </div>
                  <p className="text-slate-300">Trigger 15-second mid-roll ad breaks during natural stream pauses to maximize CPM revenue with zero viewer retention penalty.</p>
                </div>
              </div>
            </div>

            {/* Live Stream Discovery Pipeline Diagram */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500" />
                Live Stream Discovery Pipeline
              </h4>
              <p className="text-slate-400 text-[11px]">How HFArt distributes your broadcast in real-time when you click Go Live:</p>

              <div className="space-y-2 pt-2">
                {[
                  { step: '1. Go Live Trigger', detail: 'Ingest active, RTMP broadcast verified', icon: '🔴' },
                  { step: '2. Followers Notified', detail: 'Instant push & in-app alerts dispatched', icon: '🔔' },
                  { step: '3. Category Updated', detail: 'Index updated in Music / Gaming feed', icon: '🏷️' },
                  { step: '4. Home Feed Placement', detail: 'Featured in Live Now & Personalized feeds', icon: '🏠' },
                  { step: '5. Trending Elevation', detail: 'Promoted to Trending if viewer velocity surges', icon: '🔥' },
                  { step: '6. Search Indexing', detail: 'Instant discovery via hashtags & creator search', icon: '🔍' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
                    <span className="text-sm">{item.icon}</span>
                    <div>
                      <h5 className="font-bold text-white text-xs">{item.step}</h5>
                      <p className="text-slate-400 text-[10px]">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab: Creator Teams & Permissions */}
      {activeTab === 'creator_teams' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Creator Teams & Role Management
              </h3>
              <p className="text-slate-400">Invite trusted managers, chat moderators, video editors, and financial analysts to assist your channel.</p>
            </div>
            <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 font-extrabold rounded-full">
              4 Team Members Active
            </span>
          </div>

          {/* Invite Member Form */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm">Invite New Team Member</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="email"
                placeholder="Team member email address"
                value={newTeamEmail}
                onChange={(e) => setNewTeamEmail(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 sm:col-span-1"
              />
              <select
                value={newTeamRole}
                onChange={(e) => setNewTeamRole(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Manager">Manager (Full Management)</option>
                <option value="Moderator">Moderator (Chat & Content)</option>
                <option value="Editor">Editor (Replays & Highlights)</option>
                <option value="Analyst">Analyst (Read-Only Revenue)</option>
              </select>
              <button
                onClick={() => {
                  if (!newTeamEmail.trim()) return;
                  setTeamMembers([
                    ...teamMembers,
                    {
                      id: `tm-${Date.now()}`,
                      name: newTeamEmail.split('@')[0],
                      email: newTeamEmail,
                      role: newTeamRole,
                      permissions: `${newTeamRole} Role Permissions Assigned`,
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                    },
                  ]);
                  setNewTeamEmail('');
                  alert('Invitation sent successfully!');
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center gap-1.5"
              >
                <span>Send Role Invite</span>
              </button>
            </div>
          </div>

          {/* Existing Team Members List */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Active Channel Team ({teamMembers.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500/80" />
                    <div>
                      <h5 className="font-bold text-white text-sm">{member.name}</h5>
                      <p className="text-slate-400 text-[10px]">{member.email}</p>
                      <span className="text-slate-500 text-[10px] block mt-0.5">{member.permissions}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase border ${
                    member.role === 'Manager' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                    member.role === 'Moderator' ? 'bg-purple-950 text-purple-400 border-purple-800' :
                    member.role === 'Editor' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
      {activeTab === 'ai_studio' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-white">HFArt AI Creator Productivity Studio</h3>
              </div>
              <p className="text-slate-400">AI tools to assist your workflow: titles, descriptions, thumbnails, captions & multi-language translation.</p>
            </div>
            <span className="px-3 py-1 bg-rose-950 text-rose-300 border border-rose-800 font-extrabold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Productivity Assistant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tool 1: Stream Title & Description Generator */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" />
                1. AI Stream Title & Description Generator
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Stream Category & Focus Topic</label>
                  <input
                    type="text"
                    value={aiTopicKey}
                    onChange={(e) => setAiTopicKey(e.target.value)}
                    placeholder="e.g. Soweto Acoustic Guitar Jam Session"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  onClick={() => {
                    setIsGeneratingAi(true);
                    setTimeout(() => {
                      setGeneratedTitles([
                        `������ ${aiTopicKey} — Live Unplugged & Fan Requests`,
                        `🎸 ${aiTopicKey}: Exclusive Sunset Jam & Live QA`,
                        `✨ Special Live Session: ${aiTopicKey} [1080p HD]`,
                      ]);
                      setGeneratedDescription(`Join ${creator.name} live for an unforgettable ${aiTopicKey}! Tune in for interactive chat requests, subscriber perks, and exclusive behind-the-scenes moments. #HFArtLive #${aiTopicKey.replace(/\s+/g, '')}`);
                      setIsGeneratingAi(false);
                    }, 1200);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAi ? 'Generating Suggestions...' : 'Generate Stream Titles & Bio'}</span>
                </button>

                <div className="space-y-2 pt-2">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Suggested AI Titles:</span>
                  {generatedTitles.map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-slate-200">
                      <span className="font-medium text-xs">{t}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(t);
                          alert(`Copied "${t}" to clipboard!`);
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold text-[10px]"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tool 2: AI Thumbnail Designer & Preview */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-400" />
                2. AI Stream Thumbnail Designer
              </h4>

              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video group">
                  <img
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
                    alt="AI Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[9px] w-fit uppercase">
                      AI Generated Thumbnail
                    </span>
                    <h5 className="font-extrabold text-white text-sm mt-1">{generatedTitles[0]}</h5>
                  </div>
                </div>

                <button
                  onClick={() => alert('New AI thumbnail layout generated and saved to your stream assets!')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Regenerate AI High-Contrast Banner</span>
                </button>
              </div>
            </div>

            {/* Tool 3: Captioning & Multi-Language Translation */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 md:col-span-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Languages className="w-4 h-4 text-purple-400" />
                3. Live Captions & Multi-Language Translation
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Target Translation Language</label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => {
                      const lang = e.target.value;
                      setTargetLanguage(lang);
                      if (lang === 'IsiZulu') setTranslatedCaption('Sawubona bangane! Siyakwamukela ekushoniseni kwethu umculo bukhoma ngo-HFArt.');
                      else if (lang === 'Swahili') setTranslatedCaption('Habari marafiki! Karibuni kwenye kipindi chetu cha moja kwa moja kwenye HFArt.');
                      else if (lang === 'French') setTranslatedCaption('Bonjour les amis! Bienvenue sur notre flux en direct sur HFArt.');
                      else if (lang === 'Spanish') setTranslatedCaption('¡Hola amigos! Bienvenidos a nuestra transmisión en vivo en HFArt.');
                      else setTranslatedCaption('Hello friends! Welcome to our live stream broadcast on HFArt.');
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="IsiZulu">IsiZulu (Zulu)</option>
                    <option value="Swahili">Swahili</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Mandarin">Mandarin</option>
                  </select>
                </div>

                <div className="sm:col-span-2 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Live Real-Time Subtitle Translation Preview ({targetLanguage}):</span>
                  <p className="text-slate-200 font-medium italic text-xs">"{translatedCaption}"</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab: Event Center */}
      {activeTab === 'event_center' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-500" />
                HFArt Event Center
              </h3>
              <p className="text-slate-400">Schedule concerts, gaming tournaments, podcasts, Q&A sessions, and workshops with automatic follower reminders.</p>
            </div>
            <button
              onClick={() => {
                if (!newEventTitle.trim()) return;
                const newEv = {
                  id: `ev-${Date.now()}`,
                  title: newEventTitle,
                  type: newEventCategory,
                  date: 'Scheduled Soon',
                  category: newEventCategory,
                  remindersCount: 1,
                  setReminder: true,
                };
                setEvents([newEv, ...events]);
                setNewEventTitle('');
              }}
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold flex items-center gap-2"
            >
              <span>+ Schedule Event</span>
            </button>
          </div>

          {/* Schedule Event Form */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm">Schedule Special Creator Event</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Event Name (e.g. Annual Acoustic Concert)"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500 sm:col-span-2"
              />
              <select
                value={newEventCategory}
                onChange={(e) => setNewEventCategory(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Concert">Concert</option>
                <option value="Gaming Tournament">Gaming Tournament</option>
                <option value="Podcast">Podcast</option>
                <option value="Question & Answer">Question & Answer</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Upcoming Scheduled Events ({events.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.map((ev) => (
                <div key={ev.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-extrabold text-[10px] uppercase">
                      {ev.type}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold">{ev.date}</span>
                  </div>

                  <h5 className="font-bold text-white text-sm leading-tight">{ev.title}</h5>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">{ev.remindersCount} Followers Set Reminders</span>
                    <button
                      onClick={() => {
                        setEvents(events.map(e => e.id === ev.id ? { ...e, setReminder: !e.setReminder, remindersCount: e.setReminder ? e.remindersCount - 1 : e.remindersCount + 1 } : e));
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                        ev.setReminder ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{ev.setReminder ? 'Reminder Set' : 'Remind Me'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Trust & Safety */}
      {activeTab === 'trust_safety' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-500" />
              Trust & Safety, Guidelines & Copyright Center
            </h3>
            <p className="text-slate-400">Community guidelines compliance, copyright reporting, privacy settings, and moderation decision appeals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-400" /> Community Guidelines Compliance
              </h4>
              <p className="text-slate-300 leading-relaxed">
                HFArt maintains a zero-tolerance policy against hate speech, harassment, graphic violence, and copyright infringement.
              </p>
              <div className="space-y-2 pt-2">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-slate-200">
                  <span>Account Status:</span>
                  <span className="text-emerald-400 font-bold">Good Standing (0 Violations)</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-slate-200">
                  <span>Copyright Shield:</span>
                  <span className="text-emerald-400 font-bold">Active Audio Clearance</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" /> Privacy & Content Age Ratings
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Configure default privacy controls, chat filters, and age-appropriate content warnings for your audience.
              </p>
              <button
                onClick={() => alert('Copyright claim or appeal submission portal opened.')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Submit Moderation Decision Appeal / Copyright Claim
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab: Analytics Breakdown */}
      {activeTab === 'analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white">Full Stream Analytics Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Total Stream Views</span>
              <span className="text-xl font-bold text-white block">{analytics.totalViews.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Peak Concurrent Viewers</span>
              <span className="text-xl font-bold text-amber-400 block">{analytics.peakConcurrentViewers.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Total Watch Time</span>
              <span className="text-xl font-bold text-white block">{analytics.totalWatchTimeHours} Hours</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Followers Growth</span>
              <span className="text-xl font-bold text-emerald-400 block">+{analytics.followerGrowth.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Community Feed */}
      {activeTab === 'community' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Community Tab Posts & Polls</h3>
              <p className="text-slate-400">Share announcements, polls, photos, text updates, and event notifications with your followers</p>
            </div>
            <div className="flex items-center gap-2">
              {(['text', 'photo', 'poll', 'announcement', 'event'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCommunityPostType(t)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-colors ${
                    communityPostType === t ? 'bg-red-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <textarea
              value={communityPostText}
              onChange={(e) => setCommunityPostText(e.target.value)}
              placeholder={`Write a ${communityPostType} update for your community followers...`}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 h-24 text-xs resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddCommunityPost}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-md"
              >
                Publish Update to Followers
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-400">Published Community Posts</h4>
            {communityPosts.map((post) => (
              <div key={post.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] uppercase font-extrabold">
                    {post.type}
                  </span>
                  <span className="text-[10px] text-slate-500">{post.time}</span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">{post.text}</p>
                {post.options && (
                  <div className="space-y-1.5 pt-2">
                    {post.options.map((opt, i) => (
                      <div key={i} className="p-2 bg-slate-900 rounded-lg text-slate-300 text-[11px] font-medium border border-slate-800 flex justify-between">
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-rose-400">
                    <Heart className="w-3.5 h-3.5" /> {post.likes} Likes
                  </span>
                  <span className="flex items-center gap-1 hover:text-white cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5" /> Comments
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Stream Replays & VOD Recordings */}
      {activeTab === 'recordings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-white">Stream Replays & VOD Management</h3>
            <p className="text-slate-400">Publish stream replays, download MP4 recordings, clip stream highlights, or remove VOD archives</p>
          </div>

          <div className="space-y-3">
            {recordings.map((vod) => (
              <div key={vod.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{vod.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      vod.status === 'Published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {vod.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{vod.date} • Duration: {vod.duration} • {vod.views.toLocaleString()} Views</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setRecordings(recordings.map(r => r.id === vod.id ? { ...r, status: r.status === 'Published' ? 'Unpublished' : 'Published' } : r));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs"
                  >
                    {vod.status === 'Published' ? 'Unpublish' : 'Publish Replay'}
                  </button>
                  <button
                    onClick={() => alert(`Downloading MP4 recording for ${vod.title}...`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => alert(`Highlight clipping editor launched for ${vod.title}`)}
                    className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-bold text-xs border border-purple-700/50"
                  >
                    Clip Highlight
                  </button>
                  <button
                    onClick={() => setRecordings(recordings.filter(r => r.id !== vod.id))}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-rose-400 hover:text-rose-300 font-bold text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Scheduled Lives */}
      {activeTab === 'scheduled' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Scheduled Live Broadcasts</h3>
            <button
              onClick={() => setViewMode('go_live_setup')}
              className="px-3.5 py-2 rounded-xl bg-red-600 text-white font-semibold text-xs"
            >
              + Schedule New Stream
            </button>
          </div>
          <div className="space-y-3">
            {scheduledLives.map((item) => (
              <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-slate-400">{item.date} • Category: {item.category}</p>
                </div>
                <button
                  onClick={() => setViewMode('go_live_setup')}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl"
                >
                  Go Live
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Monetization Suite v4.0 */}
      {activeTab === 'monetization' && (
        <div className="space-y-6">
          {/* Sub-tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'revenue', label: 'Revenue Dashboard' },
              { id: 'subscribers', label: 'Subscribers' },
              { id: 'ads', label: 'Ads (HV100)' },
              { id: 'donations', label: 'Donations & Gifts' },
              { id: 'payouts', label: 'Payout Settings' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setMonetizationSubTab(st.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  monetizationSubTab === st.id ? 'bg-amber-500 text-black font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 block">Today's Revenue</span>
              <span className="text-lg font-bold text-emerald-400">$245.80</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 block">This Week</span>
              <span className="text-lg font-bold text-emerald-400">$1,420.00</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 block">This Month</span>
              <span className="text-lg font-bold text-emerald-400">${(analytics.adRevenueHV100 + analytics.subscriberRevenueUsd).toLocaleString()}</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 block">Est. Next Payout</span>
              <span className="text-lg font-bold text-amber-400">$3,840.00</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 block">Lifetime Earnings</span>
              <span className="text-lg font-bold text-white">$24,950.00</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" /> Subscriber Perks & Benefits
              </h3>
              <p className="text-slate-400">Subscribers pay $4.99/mo to unlock your custom badges, ad-free watching, and subs-only live chat.</p>
              <div className="space-y-2 pt-2">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Subs-Only Chat Mode</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Custom Emote Pack</span>
                  <span className="text-emerald-400 font-bold">12 Uploaded</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-rose-400" /> Virtual Gifts & Direct Donations
              </h3>
              <p className="text-slate-400">Viewers can purchase Sparkles to send virtual gifts live on stream or send direct monetary support.</p>
              <div className="space-y-2 pt-2">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Direct Tip Goal ("New Mic Fund")</span>
                  <span className="text-amber-400 font-bold">$420 / $500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Creator Wallet */}
      {activeTab === 'wallet' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-white">HFArt Creator Wallet</h3>
              <p className="text-slate-400">Licensed payment integrations process direct deposits into your linked bank or PayPal account</p>
            </div>
            {payoutRequested && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold animate-pulse">
                Payout request submitted to Payment Provider!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-emerald-950/60 to-slate-950 rounded-2xl border border-emerald-800/60 space-y-2">
              <span className="text-slate-400">Available Balance</span>
              <h2 className="text-2xl font-extrabold text-emerald-400">$3,840.50</h2>
              <button
                onClick={handleRequestPayout}
                className="w-full mt-2 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors"
              >
                Request Immediate Payout
              </button>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-slate-400">Pending Earnings (Hold)</span>
              <h2 className="text-2xl font-extrabold text-amber-400">$612.00</h2>
              <p className="text-[10px] text-slate-500">Clears in 3 business days</p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-slate-400">Total Withdrawn</span>
              <h2 className="text-2xl font-extrabold text-white">$21,109.50</h2>
              <p className="text-[10px] text-slate-500">14 successful transactions</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Creator Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-white">Creator Milestones & Achievements</h3>
            <p className="text-slate-400">Unlock new platform capabilities as your live audience grows naturally</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'First Live Stream', req: 'Complete 1 Live Stream', unlocked: true, reward: 'Custom Stream Key' },
              { title: '100 Followers', req: 'Reach 100 Followers', unlocked: true, reward: 'HV100 Ad Monetization' },
              { title: '1,000 Followers', req: 'Reach 1,000 Followers', unlocked: true, reward: 'Subscriber Perks & Badges' },
              { title: '10,000 Followers', req: 'Reach 10,000 Followers', unlocked: false, reward: 'Verified Creator Badge' },
              { title: '100,000 Followers', req: 'Reach 100,000 Followers', unlocked: false, reward: 'Dedicated CDN Priority Node' },
            ].map((m, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${
                  m.unlocked ? 'bg-slate-950 border-emerald-500/50' : 'bg-slate-950/40 border-slate-800 opacity-60'
                } space-y-2`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{m.title}</span>
                  {m.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Locked</span>
                  )}
                </div>
                <p className="text-slate-400">{m.req}</p>
                <div className="pt-2 border-t border-slate-800/80 text-amber-400 font-semibold">
                  Unlocks: {m.reward}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Platform Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-white">HFArt Streaming Platform Roadmap</h3>
            <p className="text-slate-400">Overview of platform architecture milestones from initial release to global scaling</p>
          </div>

          <div className="space-y-4">
            {[
              { ver: 'HFArt v1', desc: '✓ User accounts, Profiles, Live streaming core', status: 'Completed' },
              { ver: 'HFArt v2', desc: '✓ Real-time Chat, Notification service, Creator Studio', status: 'Completed' },
              { ver: 'HFArt v3', desc: '✓ Analytics, Moderation tools, Stream recording replays', status: 'Completed' },
              { ver: 'HFArt v4', desc: '✓ Creator monetization, Donations, Subscriber perks', status: 'Active Release' },
              { ver: 'HFArt HV100', desc: '✓ Creator-managed ad breaks, Creator Wallet, Revenue reports', status: 'Active Release' },
              { ver: 'HFArt Future', desc: '🚀 Business advertising portal, AI creator tools, Multi-region servers', status: 'Upcoming' },
            ].map((rm, i) => (
              <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="font-bold text-white text-sm">{rm.ver}</span>
                  <p className="text-slate-400 mt-1">{rm.desc}</p>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                  rm.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  rm.status === 'Active Release' ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {rm.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Creator Settings */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            Creator Stream & Hardware Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stream Quality & Recording */}
            <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-rose-400 flex items-center gap-2">
                <Radio className="w-4 h-4" /> Stream Resolution & Quality
              </h4>

              <div className="space-y-2">
                <label className="text-slate-300 font-medium block">Default Stream Quality</label>
                <select
                  value={streamQuality}
                  onChange={(e) => setStreamQuality(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="1080p60">1080p 60fps (Full HD High Quality)</option>
                  <option value="720p60">720p 60fps (Standard HD)</option>
                  <option value="Auto">Auto Adaptive Bitrate</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRecord}
                    onChange={(e) => setAutoRecord(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-slate-300 font-medium">Auto-Record Streams (Save to VOD archive)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribersOnlyStream}
                    onChange={(e) => setSubscribersOnlyStream(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-slate-300 font-medium">Subscriber-Only Streams (VIP Exclusive)</span>
                </label>
              </div>
            </div>

            {/* Hardware Devices */}
            <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-rose-400 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Camera & Microphone Hardware
              </h4>

              <div className="space-y-2">
                <label className="text-slate-300 font-medium block">Camera Source</label>
                <select
                  value={cameraDevice}
                  onChange={(e) => setCameraDevice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Integrated HD Camera (Built-in)">Integrated HD Camera (Built-in)</option>
                  <option value="Logitech Brio 4K Webcam">Logitech Brio 4K Webcam</option>
                  <option value="Sony Alpha Cam Link 4K">Sony Alpha Cam Link 4K</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-medium block">Microphone Input</label>
                <select
                  value={micDevice}
                  onChange={(e) => setMicDevice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Studio Condenser Mic (USB Audio)">Studio Condenser Mic (USB Audio)</option>
                  <option value="Shure SM7B Audio Interface">Shure SM7B Audio Interface</option>
                  <option value="Built-in Microphone Array">Built-in Microphone Array</option>
                </select>
              </div>
            </div>

            {/* Connected Social Accounts */}
            <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 md:col-span-2">
              <h4 className="font-bold text-rose-400 flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Connected Social Accounts (Meta Crossposting)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-white">
                    <Facebook className="w-4 h-4 text-blue-500" /> Facebook Live
                  </span>
                  <button
                    onClick={() => setFbConnected(!fbConnected)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      fbConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {fbConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-white">
                    <Youtube className="w-4 h-4 text-red-500" /> YouTube
                  </span>
                  <button
                    onClick={() => setYtConnected(!ytConnected)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      ytConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ytConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-white">
                    <Instagram className="w-4 h-4 text-pink-500" /> Instagram
                  </span>
                  <button
                    onClick={() => setIgConnected(!igConnected)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      igConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {igConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-white">
                    <Twitter className="w-4 h-4 text-blue-400" /> X (Twitter)
                  </span>
                  <button
                    onClick={() => setXConnected(!xConnected)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      xConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {xConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
