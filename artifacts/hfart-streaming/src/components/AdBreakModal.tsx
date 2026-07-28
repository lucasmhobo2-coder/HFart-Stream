import React, { useState } from 'react';
import { Play, Clock, DollarSign, X, ShieldAlert, Sparkles } from 'lucide-react';
import { AdBreakState } from '../types';

interface AdBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBreak: (startsInSeconds: number, durationSeconds: number) => void;
}

export const AdBreakModal: React.FC<AdBreakModalProps> = ({
  isOpen,
  onClose,
  onStartBreak,
}) => {
  const [startsIn, setStartsIn] = useState<number>(5); // Default 5s for snappy testing!
  const [breakDuration, setBreakDuration] = useState<number>(15); // Default 15s ad break

  if (!isOpen) return null;

  return (
    <div id="ad-break-modal-overlay" className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div id="ad-break-modal-card" className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-5 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-950/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Break / Ads (HV100)</h3>
              <p className="text-xs text-amber-400 font-medium">Earn CPM revenue with automated ad break</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 pt-1">
          
          {/* Schedule Break - Starts In */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Starts in (Countdown)
              </span>
              <span className="text-xs font-mono text-amber-400">
                00:0{startsIn}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Instant (5s)', sec: 5 },
                { label: '30 Seconds', sec: 30 },
                { label: '5 Minutes', sec: 300 },
              ].map((opt) => (
                <button
                  key={opt.sec}
                  onClick={() => setStartsIn(opt.sec)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    startsIn === opt.sec
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Break Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Break Duration</span>
              <span className="text-xs font-mono text-amber-400">{breakDuration}s Ad Slot</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '15 Secs', sec: 15 },
                { label: '30 Secs', sec: 30 },
                { label: '3 Minutes', sec: 180 },
              ].map((opt) => (
                <button
                  key={opt.sec}
                  onClick={() => setBreakDuration(opt.sec)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    breakDuration === opt.sec
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ad Preview Box */}
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-amber-400 uppercase tracking-wider">HV100 Ad Partner Preview</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <DollarSign className="w-3 h-3" />
                CPM: $28.50
              </span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80"
                className="w-12 h-12 rounded-lg object-cover"
                alt="Ad Preview"
              />
              <div className="text-xs">
                <h4 className="font-bold text-white">HV100 Spatial Audio Headphones</h4>
                <p className="text-[10px] text-slate-400">Sponsored Ad • Auto-returns when finished</p>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onStartBreak(startsIn, breakDuration);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Start Break
          </button>
        </div>

      </div>
    </div>
  );
};
