import React, { useState } from 'react';
import { Search, Flame, Radio, Music, Gamepad2, Mic2, Theater, Newspaper, Trophy, Sparkles, MapPin, UserPlus, Heart } from 'lucide-react';
import { Stream, CategoryType } from '../types';
import { StreamCard } from './StreamCard';

interface HomeScreenProps {
  streams: Stream[];
  onSelectStream: (stream: Stream) => void;
  onToggleFollow: (creatorId: string) => void;
  onSelectCreator: (creatorId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  streams,
  onSelectStream,
  onToggleFollow,
  onSelectCreator,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Feeds');

  const categoriesList = [
    { label: 'All Feeds', icon: Flame },
    { label: 'Live Now', icon: Radio },
    { label: 'Recommended For You', icon: Sparkles },
    { label: 'Trending in South Africa', icon: MapPin },
    { label: 'Music', icon: Music },
    { label: 'Gaming', icon: Gamepad2 },
    { label: 'Podcasts', icon: Mic2 },
    { label: 'Sports', icon: Trophy },
    { label: 'News', icon: Newspaper },
    { label: 'Entertainment', icon: Theater },
    { label: 'New Creators', icon: UserPlus },
  ];

  // Filter streams by search query and category
  const filteredStreams = streams.filter((stream) => {
    const matchesSearch = searchQuery.trim() === '' || 
      stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'All Feeds') return true;
    if (selectedCategory === 'Live Now') return stream.isLive;
    if (selectedCategory === 'Recommended For You') return stream.viewerCount > 5000;
    if (selectedCategory === 'Trending in South Africa') return true; // Featured ZA
    if (selectedCategory === 'New Creators') return !stream.creator.verified;
    
    return stream.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const featuredStream = streams.find((s) => s.isLive) || streams[0];

  const liveNowStreams = streams.filter(s => s.isLive);
  const musicStreams = streams.filter(s => s.category === 'Music');
  const gamingStreams = streams.filter(s => s.category === 'Gaming');
  const trendingZAStreams = streams.slice(0, 3);

  return (
    <div id="home-screen-container" className="flex flex-col gap-6 pb-20">
      
      {/* Mobile Search Input */}
      <div className="md:hidden px-4 pt-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search creators, live streams, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Featured Stream Hero Banner */}
      {featuredStream && !searchQuery && selectedCategory === 'All Feeds' && (
        <section id="home-hero-banner" className="px-4 sm:px-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-6 items-center">
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Banner Image Preview */}
            <div 
              onClick={() => onSelectStream(featuredStream)}
              className="w-full lg:w-3/5 aspect-video rounded-2xl overflow-hidden relative cursor-pointer group shadow-lg"
            >
              <img
                src={featuredStream.thumbnail}
                alt={featuredStream.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs shadow-md uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  FEATURED LIVE
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                  {featuredStream.viewerCount.toLocaleString()} watching
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/80 text-xs font-bold">
                  🇿🇦 South Africa Stream
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-950/80 group-hover:scale-110 transition-transform">
                  <span className="font-bold text-sm tracking-wide pl-1">WATCH</span>
                </div>
              </div>
            </div>

            {/* Banner Text Info */}
            <div className="w-full lg:w-2/5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src={featuredStream.creator.avatar}
                    alt={featuredStream.creator.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{featuredStream.creator.name}</h4>
                    <p className="text-[10px] text-slate-400">@{featuredStream.creator.username}</p>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug line-clamp-2">
                  {featuredStream.title}
                </h2>
                
                <p className="text-xs text-slate-400 line-clamp-2">
                  {featuredStream.description}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectStream(featuredStream)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 transition-all text-center"
                >
                  Watch Stream Now
                </button>
                <button
                  onClick={() => onToggleFollow(featuredStream.creator.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                    featuredStream.creator.isFollowing
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {featuredStream.creator.isFollowing ? 'Following' : '+ Follow'}
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Horizontal Category Navigation Bar */}
      <section id="category-filter-bar" className="px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {categoriesList.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.label;

            return (
              <button
                key={idx}
                id={`category-btn-${idx}`}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/40 scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* If "All Feeds" is selected, render Personalized Sections */}
      {selectedCategory === 'All Feeds' && !searchQuery ? (
        <div className="space-y-8 px-4 sm:px-6">
          
          {/* Section 1: Live Now */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                Live Now
              </h2>
              <span className="text-xs text-rose-400 font-medium">Real-time Broadcasting</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveNowStreams.slice(0, 3).map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  onSelectStream={onSelectStream}
                  onToggleFollow={onToggleFollow}
                  onSelectCreator={onSelectCreator}
                />
              ))}
            </div>
          </div>

          {/* Section 2: Trending in South Africa 🇿🇦 */}
          <div className="space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Trending in South Africa 🇿🇦
              </h2>
              <span className="text-xs text-amber-400 font-semibold">Local Creators</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trendingZAStreams.map((stream) => (
                <StreamCard
                  key={`za-${stream.id}`}
                  stream={stream}
                  onSelectStream={onSelectStream}
                  onToggleFollow={onToggleFollow}
                  onSelectCreator={onSelectCreator}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Recommended For You */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Recommended For You
              </h2>
              <span className="text-xs text-slate-400">Based on your activity</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {streams.slice(2, 5).map((stream) => (
                <StreamCard
                  key={`rec-${stream.id}`}
                  stream={stream}
                  onSelectStream={onSelectStream}
                  onToggleFollow={onToggleFollow}
                  onSelectCreator={onSelectCreator}
                />
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Regular category filtered view */
        <section id="stream-cards-section" className="px-4 sm:px-6 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {searchQuery ? `HFArt Smart Search: "${searchQuery}"` : selectedCategory}
                </h2>
                <span className="text-xs font-medium text-slate-400">
                  ({filteredStreams.length} results)
                </span>
              </div>
              <span className="text-xs text-slate-400">HV100 Monetized Streams</span>
            </div>

            {searchQuery && (
              <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400">Smart Search Match Facets:</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">👤 Creator Name</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">🎬 Stream Title</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">🏷️ Category</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200"># Hashtag</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">📅 Event</span>
              </div>
            )}
          </div>

          {filteredStreams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStreams.map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  onSelectStream={onSelectStream}
                  onToggleFollow={onToggleFollow}
                  onSelectCreator={onSelectCreator}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-300">No streams found in this category</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try selecting another category or clear your search term.
              </p>
              <button
                onClick={() => setSelectedCategory('All Feeds')}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-white hover:bg-slate-700"
              >
                Show All Streams
              </button>
            </div>
          )}
        </section>
      )}

    </div>
  );
};
