import React, { useState, useRef, useEffect } from 'react';
import {
  Video, Camera, Image, Eye, MessageSquare, Sliders, Radio, Check,
  AlertCircle, ChevronLeft, CameraOff, MicOff, Mic, RotateCcw,
} from 'lucide-react';
import { CategoryType, Stream, Creator } from '../types';

interface GoLiveSetupScreenProps {
  currentCreator: Creator;
  onStartLiveStream: (streamData: Partial<Stream>) => void;
  onBack?: () => void;
}

export const GoLiveSetupScreen: React.FC<GoLiveSetupScreenProps> = ({
  currentCreator,
  onStartLiveStream,
  onBack,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('Entertainment');
  const [visibility, setVisibility] = useState<'Public' | 'Followers' | 'Subscribers'>('Public');
  const [allowClips, setAllowClips] = useState(true);
  const [enableChat, setEnableChat] = useState(true);
  const [recordStream, setRecordStream] = useState(true);
  const [facebookShare, setFacebookShare] = useState(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraError, setCameraError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedThumbnail, setCapturedThumbnail] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async (facing: 'user' | 'environment' = facingMode) => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      setCameraError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: micOn,
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true; // prevent echo
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Could not access camera: ' + (err.message || 'Unknown error'));
      }
      setCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !micOn;
      });
    }
    setMicOn(!micOn);
  };

  const flipCamera = async () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    if (cameraOn) await startCamera(next);
  };

  const captureThumbnail = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    setCapturedThumbnail(canvas.toDataURL('image/jpeg', 0.8));
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Pass the live media stream to the broadcast screen
    onStartLiveStream({
      title: title.trim(),
      description: description.trim(),
      category,
      thumbnail:
        capturedThumbnail ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      visibility,
      allowClips,
      enableChat,
      recordStream,
      isLive: true,
      viewerCount: 1,
      likesCount: 0,
      tags: ['Live', category, 'HFArtStream'],
      creator: { ...currentCreator, isLive: true },
    });
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 overflow-y-auto">
      {/* Hidden canvas for thumbnail capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top bar */}
      <div className="sticky top-0 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3 z-10">
        {onBack && (
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center">
            <Radio className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white">Go Live</h1>
            <p className="text-[10px] text-slate-400">Configure your broadcast</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 pb-32 max-w-lg mx-auto space-y-5">

        {/* Camera Preview */}
        <div className="relative aspect-[9/16] sm:aspect-video bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl max-h-72 sm:max-h-none">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraOn ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />

          {!cameraOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-500">
              <CameraOff className="w-12 h-12" />
              <p className="text-xs font-semibold text-center px-4">
                {cameraError || 'Tap below to start your camera'}
              </p>
            </div>
          )}

          {cameraError && (
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Camera controls overlay */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3">
            {!cameraOn ? (
              <button
                type="button"
                onClick={() => startCamera()}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4" />
                Start Camera
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    micOn ? 'bg-slate-700 text-emerald-400' : 'bg-red-600 text-white'
                  }`}
                >
                  {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={flipCamera}
                  className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shadow-lg text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={captureThumbnail}
                  className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shadow-lg text-white"
                  title="Capture thumbnail"
                >
                  <Image className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-10 h-10 rounded-full bg-red-950 border border-red-700 flex items-center justify-center shadow-lg text-red-400"
                >
                  <Video className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Status chips */}
          {cameraOn && (
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white font-bold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                CAM ON
              </span>
              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${micOn ? 'bg-emerald-600/90 text-white' : 'bg-red-600/90 text-white'}`}>
                {micOn ? 'MIC ON' : 'MIC OFF'}
              </span>
            </div>
          )}

          {capturedThumbnail && (
            <div className="absolute top-3 right-3 text-[10px] text-emerald-400 font-bold bg-black/60 px-2 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> Thumbnail captured
            </div>
          )}
        </div>

        {/* Stream Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Stream Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your stream a catchy title..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers what this stream is about..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3 py-3 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {['Music', 'Gaming', 'Podcasts', 'Entertainment', 'News', 'Sports', 'Art', 'Education', 'Cooking', 'Fitness'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'Public' | 'Followers' | 'Subscribers')}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3 py-3 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Public">Public</option>
                <option value="Followers">Followers only</option>
                <option value="Subscribers">Subscribers only</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 border-t border-slate-800 pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Stream Options
            </h3>
            {[
              { label: 'Enable Live Chat', sub: 'Allow viewers to send messages', checked: enableChat, set: setEnableChat },
              { label: 'Allow Clips', sub: 'Viewers can clip 60-second highlights', checked: allowClips, set: setAllowClips },
              { label: 'Record Stream', sub: 'Save to your profile as a VOD', checked: recordStream, set: setRecordStream },
              { label: 'Share to Facebook', sub: 'Cross-post this live stream', checked: facebookShare, set: setFacebookShare },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">{item.label}</span>
                  <span className="text-[10px] text-slate-500">{item.sub}</span>
                </div>
                <div
                  onClick={() => item.set(!item.checked)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    item.checked ? 'bg-rose-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    item.checked ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </div>
              </label>
            ))}
          </div>

          {/* Go Live */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base shadow-2xl shadow-red-950/60 transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Radio className="w-5 h-5 animate-pulse" />
            Go Live Now
          </button>
        </form>
      </div>
    </div>
  );
};
