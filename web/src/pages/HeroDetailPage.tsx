import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Plus } from 'lucide-react';
import { launchApp } from '../native';

interface HeroDetailPageProps {
  banner: any;
  onBack: () => void;
  isWireframeMode?: boolean;
}

const HeroDetailPage = ({ banner, onBack, isWireframeMode = false }: HeroDetailPageProps) => {
  const [localIdx, setLocalIdx] = useState(0); // 0: Play, 1: Add, 2: Back

  useEffect(() => {
    const handlePopState = (e: KeyboardEvent) => {
      const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'];
      if (handledKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === 'Escape' || e.key === 'Backspace') {
        onBack();
      } else if (e.key === 'ArrowRight') {
        setLocalIdx(prev => (prev < 2 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setLocalIdx(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        if (localIdx === 2) onBack();
        else if (localIdx === 0 && banner.provider) launchApp(banner.provider);   // opens the service's TV app
      }
    };
    window.addEventListener('keydown', handlePopState);
    return () => window.removeEventListener('keydown', handlePopState);
  }, [onBack, localIdx, banner]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-[100] font-sans ${isWireframeMode ? 'bg-[#0b1528]' : 'bg-black'}`}
    >
      {/* Background with heavy blur or Blueprint Grid */}
      <div className="absolute inset-0">
        {isWireframeMode ? (
          <div className="absolute inset-0 wireframe-mode-grid" />
        ) : (
          <>
            <img 
              src={banner.bg} 
              className="w-full h-full object-cover opacity-30 blur-2xl scale-110"
              referrerPolicy="no-referrer"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </>
        )}
      </div>

      <div className="absolute top-12 left-20 z-20">
        <div 
          className={`flex items-center gap-2 mb-12 ${isWireframeMode ? 'text-cyan-500/50' : 'text-white/40'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isWireframeMode ? 'bg-cyan-950/80 border border-cyan-500/30' : 'bg-white/5 border border-white/10'}`}>
            <span className="text-sm font-bold">ESC</span>
          </div>
          <span className="text-sm uppercase tracking-widest font-medium">뒤로가기</span>
        </div>
      </div>

      <main className="relative h-full flex items-center px-20 z-10">
        <div className="flex items-center gap-20 w-full max-w-[1680px] mx-auto">
          {/* Poster area */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`aspect-[16/9] w-[720px] shrink-0 rounded-3xl overflow-hidden border group relative ${
              isWireframeMode 
                ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]' 
                : 'shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-white/10'
            }`}
          >
            {isWireframeMode ? (
              <div className="w-full h-full bg-[#111c30] border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden font-mono text-cyan-500/40 p-10">
                <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" strokeWidth="1.5">
                  <line x1="0" y1="0" x2="100%" y2="100%" />
                  <line x1="100%" y1="0" x2="0" y2="100%" />
                </svg>
                <span className="z-10 text-xl font-bold bg-[#0b1528] px-4 py-2 rounded border border-cyan-500/20 text-cyan-400 max-w-[90%] text-center">
                  POSTER: {banner.title}
                </span>
              </div>
            ) : (
              <img 
                src={banner.bg} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                alt="Poster"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* Content area */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center gap-10 min-w-0 flex-1"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-black rounded-md tracking-tighter ${isWireframeMode ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-[#22c55e] text-black'}`}>{banner.provider}</span>
                <span className={`font-bold tracking-tight ${isWireframeMode ? 'text-cyan-400' : 'text-white/60'}`}>{banner.rating}</span>
              </div>
              <h1 className={`text-[88px] font-black tracking-tighter leading-none ${isWireframeMode ? 'text-cyan-400' : 'text-white'}`}>
                {banner.title}
              </h1>
              <p className={`font-mono tracking-widest text-lg uppercase ${isWireframeMode ? 'text-cyan-500/80' : 'text-white/40'}`}>
                {banner.meta}
              </p>
            </div>

            <p className={`text-2xl leading-relaxed max-w-xl font-medium tracking-tight ${isWireframeMode ? 'text-cyan-500/85' : 'text-white/70'}`}>
              {banner.desc}
              <br />
              <span className={`text-lg mt-4 block ${isWireframeMode ? 'text-cyan-600' : 'text-white/40'}`}>{banner.credit} · 출연: {banner.cast}</span>
            </p>

            <div className="flex gap-4 pt-4">
              <div 
                className={`flex items-center gap-4 px-12 py-6 rounded-[2rem] font-black text-xl uppercase tracking-tighter transition-all duration-200 ${
                  isWireframeMode
                    ? (localIdx === 0 
                        ? 'bg-cyan-500 text-black scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                        : 'bg-[#111c30] border border-cyan-500/30 text-cyan-400')
                    : (localIdx === 0 
                        ? 'bg-white text-black scale-110 shadow-[0_20px_40px_rgba(255,255,255,0.3)]' 
                        : 'bg-white/5 border border-white/10 text-white')
                }`}
              >
                <Play size={24} fill={localIdx === 0 ? "currentColor" : "none"} />
                바로 재생
              </div>
              <div 
                className={`flex items-center gap-4 px-8 py-6 rounded-[2rem] font-bold text-xl uppercase tracking-tighter transition-all duration-200 ${
                  isWireframeMode
                    ? (localIdx === 1 
                        ? 'bg-cyan-500 text-black scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                        : 'bg-[#111c30] border border-cyan-500/30 text-cyan-400')
                    : (localIdx === 1 
                        ? 'bg-white text-black scale-110 shadow-[0_20px_40px_rgba(255,255,255,0.3)]' 
                        : 'bg-white/5 border border-white/10 text-white')
                }`}
              >
                <Plus size={24} />
                내 목록에 추가
              </div>
              <div 
                onClick={onBack}
                className={`flex items-center gap-4 px-8 py-6 rounded-[2rem] font-bold text-xl uppercase tracking-tighter transition-all duration-200 cursor-pointer ${
                  isWireframeMode
                    ? (localIdx === 2 
                        ? 'bg-cyan-500 text-black scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                        : 'bg-[#111c30] border border-cyan-500/30 text-cyan-400')
                    : (localIdx === 2
                        ? 'bg-white text-black scale-110 shadow-[0_20px_40px_rgba(255,255,255,0.3)]' 
                        : 'bg-white/5 border border-white/10 text-white')
                }`}
              >
                돌아가기
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default HeroDetailPage;
