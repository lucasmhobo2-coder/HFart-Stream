import React, { useEffect, useState } from 'react';
import { Sparkles, Radio, Play, ShieldCheck, Globe } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onFinish }) => {
  const [progress, setProgress] = useState(0);

  const handleDone = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
    if (typeof onFinish === 'function') {
      onFinish();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            handleDone();
          }, 400);
          return 100;
        }
        return prev + 12;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete, onFinish]);

  return (
    <div id="splash-screen-overlay" className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-8 text-center select-none overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-red-600/30 via-rose-500/20 to-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-rose-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Badge */}
      <div className="relative z-10 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold backdrop-blur-md shadow-lg">
          <Globe className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Global Creator Network • South Africa & Beyond</span>
        </div>
      </div>

      {/* Main Branding */}
      <div className="relative z-10 flex flex-col items-center space-y-6 my-auto max-w-md">
        
        {/* Logo Icon */}
        <div className="relative group cursor-pointer" onClick={handleDone}>
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 p-1 shadow-2xl shadow-red-950/80 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 to-amber-500/10 opacity-70"></div>
              <div className="relative z-10 flex items-center justify-center">
                <Radio className="w-12 h-12 text-rose-500 animate-pulse" />
                <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1" />
              </div>
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
            Live
          </span>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            HF<span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 bg-clip-text text-transparent">Art</span>
          </h1>
          <p className="text-sm font-bold tracking-widest text-slate-300 uppercase">
            Streaming
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto my-2"></div>
          <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed">
            Connecting Creators With The World
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full max-w-xs space-y-2 pt-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Loading...</span>
            <span className="text-rose-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-400 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Footer info */}
      <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>HV100 Creator Engine Powered • Version 4.0</span>
      </div>

    </div>
  );
};
