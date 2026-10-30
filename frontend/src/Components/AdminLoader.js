import React, { useState, useEffect } from "react";
import { BusFront, ShieldCheck, Sparkles } from "lucide-react";

export default function AdminLoader({ duration = 1500 }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing admin console...");

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 30) {
        setStatusText("Authenticating admin session & permissions...");
      } else if (pct < 65) {
        setStatusText("Loading fleet, schedules & live route data...");
      } else if (pct < 95) {
        setStatusText("Configuring dashboard modules & analytics...");
      } else {
        setStatusText("Console ready! Launching workspace...");
      }

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-xl shadow-slate-200/60 flex flex-col items-center overflow-hidden">
        {/* Pulsing Gradient Accent Glows */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Bus Icon with Glowing Ring */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-orange-500 p-0.5 shadow-lg shadow-violet-500/25 animate-pulse">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <BusFront size={36} className="text-violet-600 animate-bounce" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span>DriveBus Admin</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
            Console
          </span>
        </h3>

        {/* Dynamic status message */}
        <p className="text-xs text-slate-500 font-medium mt-2 h-6 flex items-center justify-center gap-1.5 transition-all">
          <Sparkles size={13} className="text-orange-500 shrink-0" />
          <span>{statusText}</span>
        </p>

        {/* 3-Second Progress Bar Container */}
        <div className="w-full mt-6 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-orange-500 rounded-full transition-all duration-75 ease-out shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress % and Timer badge */}
        <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 mt-3 px-1">
          <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
            <ShieldCheck size={14} className="text-emerald-500" /> 1.5s Fast Loader
          </span>
          <span className="font-mono text-violet-600 font-extrabold text-sm">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
