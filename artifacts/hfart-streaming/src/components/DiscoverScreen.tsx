import React, { useState } from 'react';
import { Search, Flame, Play, Eye, Users, Sparkles, TrendingUp, Compass, Hash, Radio, Video, Layers } from 'lucide-react';
import { Stream, Clip, Creator } from '../types';

interface DiscoverScreenProps {
  streams: Stream[];
  clips: Clip[];
  creators: Creator[];
  onSelectStream: (stream: Stream) => void;
  onSelectCreator: (creatorId: string) => void;
  onToggleFollow: (creatorId: string) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  streams,
  clips,
  creators,
  onSelectStream,
  onToggleFollow,
  onSelectCreator,
}) => {
  const [activeTab, setActiveTab] = useState<'creators' | 'live' | 'videos' | 'categories' | 'hashtags'>('creators');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  const hashtags = [
    { tag: '#SouthAfricaLive', count: '14.2k streams', category: 'Local Trending' },
    { tag: '#CyberBeats', count: '8.9k streams', category: 'Music' },
    { tag: '#EsportsZA', count: '24.1k streams', category: 'Gaming' },
    { tag: '#AITech2026', count: '6.4k streams', category: 'Podcasts' },
    { tag: '#JohannesburgVibes', count: '12.1k streams', category: 'Lifestyle' },
    { tag: '#HFArtSpotlight', count: '45.0k streams', category: 'Featured' },
  ];

  const categories = [
    { title: 'Music & Live Synth Sets', count: '1.2k Streams', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80' },
    { title: 'Competitive Esports & Gaming', count: '4.8k Streams', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80' },
    { title: 'Tech, AI & Podcasts', count: '940 Streams', img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80' },
    { title: 'Global News & Headlines', count: '620 Streams', img: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=400&q=80' },
    { title: 'Sports Matches & Breakdown', count: '890 Streams', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80' },
    { title: 'Comedy & Entertainment', count: '510 Streams', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80' },
  ];

  const filteredCreators = creators.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStreams = streams.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="discover-screen-container" className="px-4 sm:px-6 py-4 pb-20 space-y-6">
      
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 id="discover-title" className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-red-500" />
            Search & Discover HFArt
          </h1>
          <p className="text-xs text-slate-400">Search creators, live streams, categories, and viral hashtags</p>
        </div>

        {/* Input Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Creators, Live Streams, Categories, Hashtags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 shadow-md"
          />
        </div>
      </div>

      {/* Discovery Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'creators', label: 'Creators', icon: Users },
          { id: 'live', label: 'Live Streams', icon: Radio },
          { id: 'videos', label: 'Videos & Clips', icon: Video },
          { id: 'categories', label: 'Categories', icon: Layers },
          { id: 'hashtags', label: 'Hashtags', icon: Hash },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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

      {/* Tab: Creators */}
      {activeTab === 'creators' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCreators.map((creator) => (
            <div key={creator.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-red-500/80 cursor-pointer"
                  onClick={() => onSelectCreator(creator.id)}
                />
                <div>
                  <h3
                    onClick={() => onSelectCreator(creator.id)}
                    className="text-xs font-bold text-white hover:text-red-400 cursor-pointer"
                  >
                    {creator.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">@{creator.username}</p>
                  <p className="text-[10px] text-red-400 font-semibold mt-0.5">
                    {creator.followersCount.toLocaleString()} followers
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{creator.bio}</p>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <button
                  onClick={() => onSelectCreator(creator.id)}
                  className="text-xs text-slate-300 hover:text-white font-medium"
                >
                  View Profile
                </button>

                <button
                  onClick={() => onToggleFollow(creator.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    creator.isFollowing
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-red-600 text-white shadow-sm'
                  }`}
                >
                  {creator.isFollowing ? 'Following' : '+ Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Live Streams */}
      {activeTab === 'live' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStreams.map((stream) => (
            <div
              key={stream.id}
              onClick={() => onSelectStream(stream)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer group hover:border-rose-500/50 transition-all"
            >
              <div className="relative aspect-video">
                <img src={stream.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase">
                  LIVE
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                  {stream.viewerCount.toLocaleString()} watching
                </span>
              </div>
              <div className="p-3 space-y-1">
                <h4 className="text-xs font-bold text-white line-clamp-2">{stream.title}</h4>
                <p className="text-[11px] text-slate-400">{stream.creator.name} • {stream.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Videos & Clips */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clips.map((clip) => (
            <div
              key={clip.id}
              onClick={() => setSelectedClip(clip)}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden cursor-pointer group hover:border-slate-700 transition-all"
            >
              <div className="relative aspect-video bg-slate-950">
                <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                  {clip.duration}
                </span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3 space-y-1.5">
                <h3 className="text-xs font-bold text-white line-clamp-2">{clip.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <img src={clip.creatorAvatar} className="w-4 h-4 rounded-full" />
                    {clip.creatorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-500" />
                    {clip.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Categories */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden aspect-[21/9] group cursor-pointer border border-slate-800">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent p-5 flex flex-col justify-center">
                <h3 className="text-base font-extrabold text-white">{cat.title}</h3>
                <p className="text-xs text-red-400 font-medium">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Hashtags */}
      {activeTab === 'hashtags' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {hashtags.map((h, i) => (
            <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-500/50 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                  <Hash className="w-4 h-4 text-rose-500" />
                  {h.tag.replace('#', '')}
                </span>
                <p className="text-xs text-slate-400">{h.category} • {h.count}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] text-slate-300 font-semibold">
                Trending
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Selected Clip Player Drawer Modal */}
      {selectedClip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 space-y-4 text-white relative">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">{selectedClip.title}</h3>
              <button onClick={() => setSelectedClip(null)} className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800">
                Close
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
              <img src={selectedClip.thumbnail} className="w-full h-full object-cover opacity-60" />
              <div className="absolute flex flex-col items-center gap-2">
                <Play className="w-12 h-12 text-red-500 animate-pulse" />
                <span className="text-xs font-semibold">Playing Clip ({selectedClip.duration})</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Clip by {selectedClip.creatorName}</span>
              <span>{selectedClip.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
