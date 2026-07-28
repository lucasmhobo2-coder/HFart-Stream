import React from 'react';
import { Eye, UserPlus, Check, Play, Radio } from 'lucide-react';
import { Stream } from '../types';

interface StreamCardProps {
  stream: Stream;
  onSelectStream: (stream: Stream) => void;
  onToggleFollow: (creatorId: string) => void;
  onSelectCreator: (creatorId: string) => void;
}

export const StreamCard: React.FC<StreamCardProps> = ({
  stream,
  onSelectStream,
  onToggleFollow,
  onSelectCreator,
}) => {
  const { creator } = stream;

  return (
    <div
      id={`stream-card-${stream.id}`}
      className="group bg-slate-900 rounded-2xl border border-slate-800/90 overflow-hidden shadow-md hover:shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between relative"
    >
      {/* Thumbnail Area */}
      <div
        className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
        onClick={() => onSelectStream(stream)}
      >
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges: LIVE Badge (red) & Category */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {stream.isLive ? (
            <div id={`stream-live-badge-${stream.id}`} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 text-white font-bold text-[11px] shadow-md uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              LIVE
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px] font-medium">
              VOD
            </div>
          )}

          <span id={`stream-category-${stream.id}`} className="px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-medium border border-slate-700/60">
            {stream.category}
          </span>
        </div>

        {/* Bottom Thumbnail Overlay: Viewer Count */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[11px] font-medium">
          <Eye className="w-3.5 h-3.5 text-red-400" />
          <span id={`stream-viewers-${stream.id}`}>{stream.viewerCount.toLocaleString()} viewers</span>
        </div>

        {/* Hover Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-opacity">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-950/80 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Stream Info Content */}
      <div className="p-3.5 flex flex-col gap-3">
        
        {/* Creator Info & Title */}
        <div className="flex gap-3 items-start">
          
          {/* Creator Profile Picture */}
          <button
            id={`stream-avatar-btn-${stream.id}`}
            onClick={() => onSelectCreator(creator.id)}
            className="relative shrink-0 group/avatar"
            title={`View ${creator.name}'s Profile`}
          >
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/80 group-hover/avatar:ring-red-400 transition-all"
            />
            {creator.isLive && (
              <span className="w-3 h-3 bg-red-500 rounded-full ring-2 ring-slate-900 absolute bottom-0 right-0"></span>
            )}
          </button>

          {/* Title & Creator Name */}
          <div className="flex-1 min-w-0">
            <h3
              id={`stream-title-${stream.id}`}
              onClick={() => onSelectStream(stream)}
              className="text-xs font-semibold text-white leading-snug line-clamp-2 cursor-pointer hover:text-red-400 transition-colors"
              title={stream.title}
            >
              {stream.title}
            </h3>
            
            <button
              onClick={() => onSelectCreator(creator.id)}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 mt-1 truncate"
            >
              <span>{creator.name}</span>
              {creator.verified && (
                <span className="text-amber-400 text-[10px]" title="Verified Creator">✓</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer Card Row with Follow Button & Tags */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 mt-0.5">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {stream.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>

          {/* Follow Button */}
          <button
            id={`stream-follow-btn-${stream.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollow(creator.id);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              creator.isFollowing
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-red-600/90 hover:bg-red-500 text-white shadow-sm'
            }`}
          >
            {creator.isFollowing ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3" />
                <span>Follow</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
