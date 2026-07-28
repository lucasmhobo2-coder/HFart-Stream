import React, { useState, useEffect, useRef } from 'react';
import {
  Radio, Clock, Eye, Heart, MessageSquare, Sparkles, Power, Send,
  Wifi, Activity, Camera, Mic, MicOff, CameraOff, Check, Video, Film,
  ShieldCheck,
} from 'lucide-react';
import { Stream, ChatMessage, AdBreakState } from '../types';
import { AdBreakModal } from './AdBreakModal';
import { subscribeToStreamChat, sendFirestoreChatMessage } from '../lib/firestoreService';
import { UserProfile } from '../types';

interface CreatorWhileLiveScreenProps {
  stream: Stream;
  currentUser?: UserProfile | null;
  onEndStream: () => void;
}

export const CreatorWhileLiveScreen: React.FC<CreatorWhileLiveScreenProps> = ({
  stream,
  currentUser,
  onEndStream,
}) => {
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [viewers, setViewers] = useState(stream.viewerCount || 1);
  const [peakViewers, setPeakViewers] = useState(stream.viewerCount || 1);
  const [likes, setLikes] = useState(stream.likesCount || 0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAdBreakModalOpen, setIsAdBreakModalOpen] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [slowMode, setSlowMode] = useState(false);
  const [followersOnly, setFollowersOnly] = useState(false);
  const [subscribersOnly, setSubscribersOnly] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'live' | 'unstable'>('connecting');
  const [bitrateKbps, setBitrateKbps] = useState<number | null>(null);

  // Real camera feed
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const [adBreak, setAdBreak] = useState<AdBreakState>({
    isScheduled: false,
    startsInSeconds: 0,
    breakDurationSeconds: 15,
    isBreakActive: false,
    currentAdIndex: 0,
  });

  // Start real camera/mic on mount
  useEffect(() => {
    const startMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
        setConnectionState('live');

        // Real bitrate estimation via getStats
        const pc = new RTCPeerConnection();
        mediaStream.getTracks().forEach((t) => pc.addTrack(t, mediaStream));
        const statsInterval = setInterval(async () => {
          const stats = await pc.getStats();
          let bytes = 0;
          stats.forEach((report) => {
            if (report.type === 'outbound-rtp' && report.bytesSent) {
              bytes += report.bytesSent;
            }
          });
          if (bytes > 0) setBitrateKbps(Math.round((bytes * 8) / 1000));
        }, 3000);

        return () => {
          clearInterval(statsInterval);
          pc.close();
        };
      } catch {
        setConnectionState('unstable');
      }
    };

    startMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Toggle camera
  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  // Toggle mic
  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  // Stream duration counter (real elapsed time)
  useEffect(() => {
    const timer = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Subscribe to real-time Firestore chat
  useEffect(() => {
    if (!stream?.id) return;
    const unsub = subscribeToStreamChat(stream.id, (msgs) => {
      setChatMessages(msgs.slice(-100));
    });
    return () => unsub();
  }, [stream?.id]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Ad break countdown
  useEffect(() => {
    let interval: any = null;
    if (adBreak.isScheduled && adBreak.startsInSeconds > 0) {
      interval = setInterval(() => {
        setAdBreak((prev) => {
          if (prev.startsInSeconds <= 1) return { ...prev, startsInSeconds: 0, isBreakActive: true };
          return { ...prev, startsInSeconds: prev.startsInSeconds - 1 };
        });
      }, 1000);
    } else if (adBreak.isBreakActive && adBreak.breakDurationSeconds > 0) {
      interval = setInterval(() => {
        setAdBreak((prev) => {
          if (prev.breakDurationSeconds <= 1)
            return { isScheduled: false, startsInSeconds: 0, breakDurationSeconds: 15, isBreakActive: false, currentAdIndex: 0 };
          return { ...prev, breakDurationSeconds: prev.breakDurationSeconds - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [adBreak.isScheduled, adBreak.startsInSeconds, adBreak.isBreakActive, adBreak.breakDurationSeconds]);

  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return hrs > 0 ? `${hrs}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendFirestoreChatMessage(stream.id, {
      senderName: `${currentUser?.username || stream.creator.name} (Broadcaster)`,
      senderAvatar: currentUser?.avatar || stream.creator.avatar,
      message: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBadge: 'STREAMER',
    });
    setInputMessage('');
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col overflow-hidden">

      {/* ── TOP STATUS BAR ── */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white font-extrabold text-xs shadow-md">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            LIVE
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-white border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            {formatDuration(durationSeconds)}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-white border border-slate-700">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            {viewers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-white border border-slate-700">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            {likes.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono border border-slate-700">
            <Wifi className={`w-3.5 h-3.5 ${connectionState === 'live' ? 'text-emerald-400' : connectionState === 'connecting' ? 'text-amber-400' : 'text-red-400'}`} />
            <span className={connectionState === 'live' ? 'text-emerald-400' : 'text-amber-400'}>
              {connectionState === 'live' ? (bitrateKbps ? `${bitrateKbps.toLocaleString()} kbps` : 'Live') : connectionState === 'connecting' ? 'Connecting...' : 'Unstable'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdBreakModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ad Break
          </button>
          <button
            onClick={() => setShowSummaryModal(true)}
            className="px-3.5 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Power className="w-3.5 h-3.5" />
            End Stream
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden min-h-0">

        {/* Camera Feed */}
        <div className="lg:flex-1 relative bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-0 flex-shrink-0 h-48 sm:h-64 lg:h-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isCameraOn ? '' : 'opacity-0'}`}
            style={{ transform: 'scaleX(-1)' }}
          />
          {!isCameraOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-600 bg-slate-950">
              <CameraOff className="w-10 h-10" />
              <span className="text-xs font-semibold">Camera paused — audio only</span>
            </div>
          )}

          {/* Live badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs flex items-center gap-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              YOUR BROADCAST IS LIVE
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md rounded-2xl px-3 py-2 flex items-center justify-between text-xs">
            <span className="text-white font-semibold truncate">{stream.title}</span>
            {stream.recordStream && (
              <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                <Film className="w-3 h-3" /> REC
              </span>
            )}
          </div>

          {/* Camera/Mic controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={toggleMic}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border transition-colors ${
                isMicOn ? 'bg-slate-700/80 text-emerald-400 border-slate-600' : 'bg-red-600 text-white border-red-500'
              }`}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleCamera}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border transition-colors ${
                isCameraOn ? 'bg-slate-700/80 text-emerald-400 border-slate-600' : 'bg-red-600 text-white border-red-500'
              }`}
            >
              {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="lg:w-72 xl:w-80 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-xl min-h-0">
          {/* Chat header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-white">Live Chat</span>
              <span className="text-[10px] text-slate-500 font-mono">{chatMessages.length} msgs</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <button
                onClick={() => setSlowMode(!slowMode)}
                className={`px-2 py-0.5 rounded font-semibold border transition-colors ${slowMode ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
              >
                Slow
              </button>
              <button
                onClick={() => setFollowersOnly(!followersOnly)}
                className={`px-2 py-0.5 rounded font-semibold border transition-colors ${followersOnly ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
              >
                Fans
              </button>
              <button
                onClick={() => setSubscribersOnly(!subscribersOnly)}
                className={`px-2 py-0.5 rounded font-semibold border transition-colors ${subscribersOnly ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
              >
                Subs
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 no-scrollbar min-h-0">
            {chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
                <MessageSquare className="w-8 h-8" />
                <span className="text-xs">Waiting for messages...</span>
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={`${msg.id}-${idx}`} className="flex items-start gap-2 text-xs">
                <img
                  src={msg.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&q=80'}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                  alt=""
                />
                <div>
                  <span className={`font-bold ${msg.isBadge === 'STREAMER' ? 'text-amber-400' : msg.isGift ? 'text-amber-300' : 'text-rose-300'}`}>
                    {msg.senderName}:&nbsp;
                  </span>
                  <span className={msg.isGift ? 'text-amber-200' : 'text-slate-200'}>{msg.message}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Reply to chat..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <button type="submit" className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs text-white font-bold transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Ad Break banners */}
      {adBreak.isScheduled && (
        <div className="mx-4 mb-2 bg-amber-950/90 border border-amber-500/60 rounded-2xl p-3 flex items-center justify-between text-white shrink-0">
          <span className="text-xs font-bold text-amber-200">
            Ad Break in {adBreak.startsInSeconds}s
          </span>
          <button
            onClick={() => setAdBreak({ isScheduled: false, startsInSeconds: 0, breakDurationSeconds: 15, isBreakActive: false, currentAdIndex: 0 })}
            className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold text-xs"
          >
            Cancel
          </button>
        </div>
      )}
      {adBreak.isBreakActive && (
        <div className="mx-4 mb-2 bg-emerald-950/90 border border-emerald-500/60 rounded-2xl p-3 flex items-center justify-between text-white shrink-0">
          <span className="text-xs font-bold text-emerald-200">
            Ad break active — {adBreak.breakDurationSeconds}s remaining
          </span>
          <button
            onClick={() => setAdBreak({ isScheduled: false, startsInSeconds: 0, breakDurationSeconds: 15, isBreakActive: false, currentAdIndex: 0 })}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
          >
            Resume Live
          </button>
        </div>
      )}

      {/* End Stream Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-950 border border-red-800 flex items-center justify-center mx-auto mb-3">
                <Radio className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-lg font-extrabold text-white">End Stream?</h2>
              <p className="text-xs text-slate-400 mt-1">Your analytics and replay will be saved.</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              {[
                ['Duration', formatDuration(durationSeconds), 'text-white'],
                ['Peak Viewers', peakViewers.toLocaleString(), 'text-emerald-400'],
                ['Total Likes', likes.toLocaleString(), 'text-rose-400'],
                ['Recording', stream.recordStream ? 'Saved' : 'Off', 'text-blue-400'],
              ].map(([k, v, color]) => (
                <div key={k as string} className="flex justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-400">{k}</span>
                  <span className={`font-bold ${color}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Keep Live
              </button>
              <button
                onClick={() => { setShowSummaryModal(false); onEndStream(); }}
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                End Now
              </button>
            </div>
          </div>
        </div>
      )}

      <AdBreakModal
        isOpen={isAdBreakModalOpen}
        onClose={() => setIsAdBreakModalOpen(false)}
        onStartBreak={(startsIn, duration) => setAdBreak({
          isScheduled: true,
          startsInSeconds: startsIn,
          breakDurationSeconds: duration,
          isBreakActive: false,
          currentAdIndex: 0,
        })}
      />
    </div>
  );
};
