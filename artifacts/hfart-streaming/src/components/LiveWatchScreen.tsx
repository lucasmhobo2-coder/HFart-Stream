import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart, Send, Eye, UserPlus, Check, Gift, Share2,
  ChevronDown, X, MessageSquare, Sparkles, DollarSign,
  Volume2, VolumeX,
} from 'lucide-react';
import { Stream, ChatMessage, VirtualGift } from '../types';
import { subscribeToStreamChat, sendFirestoreChatMessage, likeFirestoreStream } from '../lib/firestoreService';
import { UserProfile } from '../types';

interface LiveWatchScreenProps {
  stream: Stream;
  streams: Stream[];
  currentUser: UserProfile | null;
  onToggleFollow: (creatorId: string) => void;
  onToggleSubscribe: (creatorId: string) => void;
  onSelectCreator: (creatorId: string) => void;
  onBack: () => void;
}

const AVAILABLE_GIFTS: VirtualGift[] = [
  { id: 'g1', name: 'Super Sparkle', icon: '💎', costSparkles: 100, color: 'from-blue-500 to-cyan-400' },
  { id: 'g2', name: 'Gold Lion', icon: '🦁', costSparkles: 500, color: 'from-amber-500 to-yellow-400' },
  { id: 'g3', name: 'Platinum Crown', icon: '👑', costSparkles: 1000, color: 'from-purple-500 to-rose-400' },
  { id: 'g4', name: 'Fire Storm', icon: '🔥', costSparkles: 250, color: 'from-red-500 to-amber-400' },
  { id: 'g5', name: 'Diamond Ring', icon: '💍', costSparkles: 2000, color: 'from-cyan-500 to-blue-400' },
  { id: 'g6', name: 'Rose Bouquet', icon: '🌹', costSparkles: 150, color: 'from-rose-500 to-pink-400' },
];

const REACTIONS = ['❤️', '🔥', '👏', '🎉', '💎', '👑', '🚀'];

interface StreamSlideProps {
  stream: Stream;
  isActive: boolean;
  currentUser: UserProfile | null;
  onToggleFollow: (creatorId: string) => void;
  onToggleSubscribe: (creatorId: string) => void;
  onSelectCreator: (creatorId: string) => void;
}

const StreamSlide: React.FC<StreamSlideProps> = ({
  stream,
  isActive,
  currentUser,
  onToggleFollow,
  onToggleSubscribe,
  onSelectCreator,
}) => {
  const [likes, setLikes] = useState(stream.likesCount);
  const [liked, setLiked] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showGifts, setShowGifts] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState(10);
  const [donateMessage, setDonateMessage] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [shared, setShared] = useState(false);
  const userSparkles = currentUser?.sparklesBalance ?? 0;

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !stream?.id) return;
    const unsub = subscribeToStreamChat(stream.id, (msgs) => {
      setChatMessages(msgs.slice(-60));
    });
    return () => unsub();
  }, [stream?.id, isActive]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const spawnReaction = (emoji: string) => {
    const r = { id: Date.now() + Math.random(), emoji, x: Math.random() * 60 + 20 };
    setFloatingReactions((prev) => [...prev, r]);
    setTimeout(() => setFloatingReactions((prev) => prev.filter((v) => v.id !== r.id)), 2000);
  };

  const handleLike = () => {
    if (!liked) {
      setLikes((p) => p + 1);
      setLiked(true);
      likeFirestoreStream(stream.id);
      spawnReaction('❤️');
    }
  };

  const handleReaction = (emoji: string) => {
    spawnReaction(emoji);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentUser) return;
    sendFirestoreChatMessage(stream.id, {
      senderName: currentUser.username || currentUser.fullName,
      senderAvatar: currentUser.avatar || '',
      message: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setInputMessage('');
  };

  const handleSendGift = (gift: VirtualGift) => {
    if (userSparkles < gift.costSparkles) {
      alert('Not enough HFArt Sparkles!');
      return;
    }
    if (!currentUser) return;
    sendFirestoreChatMessage(stream.id, {
      senderName: currentUser.username || currentUser.fullName,
      senderAvatar: currentUser.avatar || '',
      message: `Sent ${gift.name} ${gift.icon}! (${gift.costSparkles} Sparkles)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGift: true,
      giftType: gift.name,
    });
    setShowGifts(false);
    spawnReaction(gift.icon);
  };

  const handleDonate = () => {
    if (!currentUser) return;
    sendFirestoreChatMessage(stream.id, {
      senderName: currentUser.username || currentUser.fullName,
      senderAvatar: currentUser.avatar || '',
      message: `💰 Donated R${donateAmount}: "${donateMessage || 'Keep going!'}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGift: true,
    });
    setShowDonate(false);
    setDonateMessage('');
    spawnReaction('💰');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}?stream=${stream.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: stream.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // user cancelled or clipboard failed silently
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Full-screen background */}
      <img
        src={stream.thumbnail}
        alt={stream.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.55)' }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/50 pointer-events-none" />

      {/* Floating reactions */}
      {floatingReactions.map((r) => (
        <div
          key={r.id}
          className="absolute bottom-32 text-3xl pointer-events-none z-10 animate-bounce"
          style={{ left: `${r.x}%`, animation: 'floatUp 2s ease-out forwards' }}
        >
          {r.emoji}
        </div>
      ))}

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 pb-2 z-20">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wide shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-semibold border border-white/10">
            <Eye className="w-3 h-3 text-red-400" />
            {stream.viewerCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white border border-white/10"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`w-8 h-8 rounded-full backdrop-blur flex items-center justify-center border transition-colors ${
              showChat
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-black/50 border-white/10 text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── RIGHT ACTION BAR (TikTok style) ── */}
      <div className="absolute right-3 bottom-40 flex flex-col items-center gap-5 z-20">
        {/* Creator Avatar */}
        <button
          onClick={() => onSelectCreator(stream.creator.id)}
          className="relative"
        >
          <img
            src={stream.creator.avatar}
            alt={stream.creator.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/80 shadow-xl"
          />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shadow-lg">
            <UserPlus className="w-2.5 h-2.5 text-white" />
          </span>
        </button>

        {/* Follow */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onToggleFollow(stream.creator.id)}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
              stream.creator.isFollowing
                ? 'bg-slate-700 border border-slate-600'
                : 'bg-rose-600'
            }`}
          >
            {stream.creator.isFollowing
              ? <Check className="w-5 h-5 text-white" />
              : <UserPlus className="w-5 h-5 text-white" />}
          </button>
          <span className="text-white text-[10px] font-bold drop-shadow">
            {stream.creator.isFollowing ? 'Following' : 'Follow'}
          </span>
        </div>

        {/* Like */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleLike}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
              liked ? 'bg-rose-600' : 'bg-black/60 border border-white/20'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-white text-white' : 'text-white'}`} />
          </button>
          <span className="text-white text-[10px] font-bold drop-shadow">
            {likes >= 1000 ? `${(likes / 1000).toFixed(1)}K` : likes}
          </span>
        </div>

        {/* Gift */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setShowGifts(true)}
            className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center shadow-lg transition-all active:scale-90"
          >
            <Gift className="w-5 h-5 text-white" />
          </button>
          <span className="text-white text-[10px] font-bold drop-shadow">Gift</span>
        </div>

        {/* Donate */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setShowDonate(true)}
            className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg transition-all active:scale-90"
          >
            <DollarSign className="w-5 h-5 text-white" />
          </button>
          <span className="text-white text-[10px] font-bold drop-shadow">Donate</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleShare}
            className="w-11 h-11 rounded-full bg-black/60 border border-white/20 flex items-center justify-center shadow-lg transition-all active:scale-90"
          >
            {shared
              ? <Check className="w-5 h-5 text-emerald-400" />
              : <Share2 className="w-5 h-5 text-white" />}
          </button>
          <span className="text-white text-[10px] font-bold drop-shadow">Share</span>
        </div>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div className="absolute bottom-0 left-0 right-16 z-20 px-4 pb-4 space-y-2">
        {/* Creator info + title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onSelectCreator(stream.creator.id)}
              className="font-black text-white text-sm drop-shadow hover:text-rose-300 transition-colors"
            >
              @{stream.creator.name}
            </button>
            {stream.creator.verified && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40">
                VERIFIED
              </span>
            )}
          </div>
          <p className="text-white/80 text-xs font-medium drop-shadow line-clamp-2">{stream.title}</p>
          <div className="flex items-center gap-2 mt-1">
            {stream.tags?.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] text-rose-300 font-semibold">#{t}</span>
            ))}
          </div>
        </div>

        {/* Chat messages overlay */}
        {showChat && chatMessages.length > 0 && (
          <div
            ref={chatRef}
            className="max-h-32 overflow-y-auto space-y-1 no-scrollbar"
          >
            {chatMessages.slice(-8).map((msg, i) => (
              <div key={`${msg.id}-${i}`} className="flex items-start gap-1.5 text-xs">
                <img
                  src={msg.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&q=80'}
                  className="w-4 h-4 rounded-full shrink-0 mt-0.5 object-cover"
                  alt=""
                />
                <span className="text-white/90 drop-shadow font-medium">
                  <span className={msg.isGift ? 'text-amber-300 font-bold' : 'text-rose-300 font-semibold'}>
                    {msg.senderName}
                  </span>
                  {' '}
                  <span className={msg.isGift ? 'text-amber-200' : 'text-white/80'}>{msg.message}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Reaction bar + chat input */}
        <div className="flex items-center gap-2">
          {/* Quick reactions */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {REACTIONS.slice(0, 4).map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-lg transition-transform active:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder="Say something..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-black/50 backdrop-blur border border-white/20 rounded-full px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-rose-500 min-w-0"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </form>
        </div>
      </div>

      {/* ── GIFT MODAL ── */}
      {showGifts && (
        <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-end">
          <div className="w-full bg-slate-900 rounded-t-3xl p-5 space-y-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Send a Gift</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800">
                  💎 {userSparkles.toLocaleString()} Sparkles
                </span>
                <button onClick={() => setShowGifts(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_GIFTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleSendGift(g)}
                  disabled={userSparkles < g.costSparkles}
                  className="p-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 rounded-2xl flex flex-col items-center gap-1.5 transition-all disabled:opacity-40"
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="text-[11px] font-bold text-white">{g.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono">💎 {g.costSparkles}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DONATE MODAL ── */}
      {showDonate && (
        <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-end">
          <div className="w-full bg-slate-900 rounded-t-3xl p-5 space-y-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Donate to {stream.creator.name}</h3>
              <button onClick={() => setShowDonate(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDonateAmount(amt)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    donateAmount === amt
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  R{amt}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={donateAmount}
              onChange={(e) => setDonateAmount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
              placeholder="Custom amount (R)"
            />
            <textarea
              value={donateMessage}
              onChange={(e) => setDonateMessage(e.target.value)}
              placeholder="Leave a message..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs resize-none focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
            <button
              onClick={handleDonate}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm shadow-lg"
            >
              Donate R{donateAmount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const LiveWatchScreen: React.FC<LiveWatchScreenProps> = ({
  stream: initialStream,
  streams,
  currentUser,
  onToggleFollow,
  onToggleSubscribe,
  onSelectCreator,
  onBack,
}) => {
  const liveStreams = streams.filter((s) => s.isLive);
  if (!liveStreams.length) liveStreams.push(initialStream);

  const initialIndex = Math.max(
    0,
    liveStreams.findIndex((s) => s.id === initialStream.id),
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, liveStreams.length - 1));
  }, [liveStreams.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 50) goNext();
    else if (delta < -50) goPrev();
    isDragging.current = false;
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 30) goNext();
    else if (e.deltaY < -30) goPrev();
  }, [goNext, goPrev]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-white/15 flex items-center justify-center text-white shadow-lg"
      >
        <ChevronDown className="w-5 h-5" />
      </button>

      {/* Stream slide — only render current */}
      <StreamSlide
        key={liveStreams[currentIndex]?.id}
        stream={liveStreams[currentIndex] || initialStream}
        isActive={true}
        currentUser={currentUser}
        onToggleFollow={onToggleFollow}
        onToggleSubscribe={onToggleSubscribe}
        onSelectCreator={onSelectCreator}
      />

      {/* Swipe indicator dots */}
      {liveStreams.length > 1 && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-50">
          {liveStreams.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all ${
                i === currentIndex
                  ? 'w-1.5 h-5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Swipe hint on first load */}
      {liveStreams.length > 1 && currentIndex === 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none opacity-60">
          <span className="text-white text-[10px] font-bold uppercase tracking-wider">
            Swipe up for next stream
          </span>
        </div>
      )}
    </div>
  );
};
