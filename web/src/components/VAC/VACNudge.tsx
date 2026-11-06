import React from 'react';
import { Mic } from 'lucide-react';

interface VACNudgeProps {
  isWireframeMode?: boolean;
}

export const VACNudge = ({ isWireframeMode = false }: VACNudgeProps) => {
  return (
    <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-20 pointer-events-none select-none">
      {/* Mic Capsule */}
      <div className={`h-[68px] px-8 rounded-full border-2 flex items-center gap-4 transition-all duration-300 ${
        isWireframeMode 
          ? 'bg-[#0b1528] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] font-mono' 
          : 'bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.3)]'
      }`}>
        {isWireframeMode ? (
          <div className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
            <Mic size={20} className="animate-pulse" />
          </div>
        )}
        <span className={`text-[16px] font-black tracking-tight ${isWireframeMode ? 'text-cyan-400' : 'text-white'}`}>
          {isWireframeMode ? '[ VOICE INPUT ACTIVE: PRESS MIC KEY OR TALK ]' : '말씀해 보세요. "오늘 날씨 어때?"'}
        </span>
      </div>
    </div>
  );
};
