import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, Sparkles } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'expanded'>('mobile');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-3 sm:py-6 px-2 sm:px-4 flex flex-col items-center justify-center font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Bar with Simulator Toggle */}
      <header className="w-full max-w-[465px] sm:max-w-4xl flex items-center justify-between px-3 py-2 mb-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-200 tracking-wide text-[11px] sm:text-xs">
            GramUdyam Mobile App
          </span>
          <span className="hidden sm:inline-block bg-slate-800/80 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700/60">
            Native PWA
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode(viewMode === 'mobile' ? 'expanded' : 'mobile')}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-xl border border-slate-700/80 transition-all text-[11px] font-semibold shadow-xs"
          >
            {viewMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span>बड़ा दृश्य (Expanded)</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>मोबाइल दृश्य (Mobile App)</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Frame Container */}
      <main
        className={`transition-all duration-300 w-full ${
          viewMode === 'mobile'
            ? 'max-w-[465px] min-h-[890px] h-[94vh] max-h-[980px] bg-slate-950 rounded-[44px] p-2.5 sm:p-3 shadow-2xl border-4 border-slate-800/90 ring-1 ring-slate-700/80 flex flex-col'
            : 'max-w-4xl min-h-[92vh] bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-2 sm:p-3 flex flex-col'
        }`}
      >
        {/* Phone Notch & Status Bar (Only in simulator mode) */}
        {viewMode === 'mobile' && (
          <div className="w-full bg-slate-950 text-white px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-semibold select-none">
            <span className="font-bold tracking-tight">9:41</span>
            <div className="w-24 h-4 bg-slate-800/90 rounded-full mx-auto -mt-1 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        )}

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 rounded-b-[36px] sm:rounded-b-[38px] flex flex-col relative">
          {children}
        </div>
      </main>
    </div>
  );
};

