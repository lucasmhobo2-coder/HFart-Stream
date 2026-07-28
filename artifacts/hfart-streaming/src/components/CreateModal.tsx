import React from 'react';
import { Video, Upload, Mic, Calendar, X, Sparkles, AlertCircle } from 'lucide-react';
import { ViewMode } from '../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  setViewMode: (mode: ViewMode) => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  setViewMode,
}) => {
  if (!isOpen) return null;

  return (
    <div id="create-modal-overlay" className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div id="create-modal-card" className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 text-white shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="create-modal-title" className="text-base font-bold text-white">Create & Broadcast</h3>
              <p className="text-xs text-slate-400">Share live streams or scheduled events</p>
            </div>
          </div>
          <button
            id="close-create-modal"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Grid */}
        <div id="create-options-grid" className="grid grid-cols-2 gap-3 pt-1">
          
          {/* Go Live Option */}
          <button
            id="create-go-live-option"
            onClick={() => {
              onClose();
              setViewMode('go_live_setup');
            }}
            className="group p-4 bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 rounded-2xl flex flex-col items-start justify-between gap-3 text-left transition-all hover:scale-[1.02] shadow-lg shadow-red-950/40"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-100 block">Instant</span>
              <span className="text-sm font-bold text-white block">Go Live</span>
              <p className="text-[11px] text-red-100/80 mt-0.5">Start broadcasting live stream now</p>
            </div>
          </button>

          {/* Upload Video Option (Future) */}
          <button
            id="create-upload-option"
            onClick={() => alert('Upload Video feature is coming in the next roadmap update!')}
            className="group p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-2xl flex flex-col items-start justify-between gap-3 text-left transition-all hover:border-slate-600 relative overflow-hidden"
          >
            <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
              Future
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">VOD</span>
              <span className="text-sm font-bold text-white block">Upload Video</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Pre-recorded video upload</p>
            </div>
          </button>

          {/* Create Podcast Option */}
          <button
            id="create-podcast-option"
            onClick={() => {
              onClose();
              setViewMode('go_live_setup');
            }}
            className="group p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-2xl flex flex-col items-start justify-between gap-3 text-left transition-all hover:border-slate-600"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 text-purple-400 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-purple-400 block">Audio / Talk</span>
              <span className="text-sm font-bold text-white block">Create Podcast</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Audio-first live talk show</p>
            </div>
          </button>

          {/* Create Event Option */}
          <button
            id="create-event-option"
            onClick={() => {
              onClose();
              setViewMode('creator_studio');
            }}
            className="group p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-2xl flex flex-col items-start justify-between gap-3 text-left transition-all hover:border-slate-600"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-400 block">Schedule</span>
              <span className="text-sm font-bold text-white block">Create Event</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Schedule upcoming stream</p>
            </div>
          </button>

        </div>

        {/* Info Note */}
        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>Streams are recorded automatically and monetized via HV100 Ad Breaks.</span>
        </div>

      </div>
    </div>
  );
};
