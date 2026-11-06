import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { launchApp, hasApp, isAndroidApp } from '../native';

interface AppDetailPageProps {
  app: any;
  onBack: () => void;
  isWireframeMode?: boolean;
}

const AppDetailPage = ({ app, onBack, isWireframeMode = false }: AppDetailPageProps) => {
  const [localIdx, setLocalIdx] = useState(0); // 0: Open, 1: Back

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
        setLocalIdx(prev => (prev < 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setLocalIdx(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        if (localIdx === 1) onBack();
        else if (localIdx === 0) launchApp(app.name);
      }
    };
    window.addEventListener('keydown', handlePopState);
    return () => window.removeEventListener('keydown', handlePopState);
  }, [onBack, localIdx, app]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center font-sans px-10 text-center ${
        isWireframeMode ? 'bg-[#0b1528] wireframe-mode-grid' : 'bg-zinc-950'
      }`}
    >
      <div className={`w-40 h-40 rounded-[3.6rem] bg-transparent flex items-center justify-center mb-10 overflow-hidden ${
        isWireframeMode 
          ? 'border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]' 
          : 'shadow-[0_40px_100px_rgba(0,0,0,0.8)]'
      }`}>
          {isWireframeMode ? (
            <div className="w-full h-full bg-[#111c30] flex flex-col items-center justify-center relative font-mono text-cyan-500/40 p-2">
              <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" strokeWidth="1">
                <line x1="0" y1="0" x2="100%" y2="100%" />
                <line x1="100%" y1="0" x2="0" y2="100%" />
              </svg>
              <span className="z-10 text-sm font-black text-cyan-400 max-w-[90%] text-center break-words uppercase">
                {app.name}
              </span>
            </div>
          ) : (
            <img src={app.icon} className="w-[104%] h-[104%] object-cover" alt={app.name} referrerPolicy="no-referrer" />
          )}
      </div>

      <div className="space-y-4 mb-20 max-w-2xl">
        <h2 className={`text-6xl font-black tracking-tighter uppercase ${isWireframeMode ? 'text-cyan-400' : 'text-white'}`}>{app.name} 서비스 중</h2>
        <p className={`text-xl font-medium leading-relaxed ${isWireframeMode ? 'text-cyan-500/80' : 'text-white/40'}`}>
          {app.name} 앱을 실행하여 최신 영화와 인기 드라마를 시청하세요. 
          최적화된 스트리밍 환경과 맞춤 콘텐츠 추천 기능이 제공됩니다.
        </p>
      </div>

      <div className="flex gap-8">
        <div className={`px-20 py-7 rounded-[3rem] font-black text-2xl uppercase tracking-tighter transition-all duration-300 ${
          isWireframeMode
            ? (localIdx === 0 
                ? 'bg-cyan-500 text-black scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                : 'bg-[#111c30] border border-cyan-500/30 text-cyan-400')
            : (localIdx === 0 
                ? 'bg-white text-black scale-110 shadow-[0_20px_50px_rgba(255,255,255,0.2)]' 
                : 'bg-white/5 text-white/60 border border-white/10')
        }`}>
          앱 실행하기
        </div>
        <div 
          onClick={onBack}
          className={`px-16 py-7 rounded-[3rem] font-black text-2xl uppercase tracking-tighter transition-all duration-300 cursor-pointer ${
            isWireframeMode
              ? (localIdx === 1 
                  ? 'bg-cyan-500 text-black scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                  : 'bg-[#111c30] border border-cyan-500/30 text-cyan-400')
              : (localIdx === 1 
                  ? 'bg-white text-black scale-110 shadow-[0_20px_50px_rgba(255,255,255,0.2)]' 
                  : 'bg-white/5 text-white/60 border border-white/10')
          }`}
        >
          돌아가기
        </div>
      </div>
      
      {isAndroidApp && !hasApp(app.name) && (
        <p className={`mt-10 text-lg font-medium ${isWireframeMode ? 'text-cyan-500/70' : 'text-white/50'}`}>
          이 TV에는 {app.name} 앱이 설치되어 있지 않아요
        </p>
      )}

      <div className="absolute bottom-16 opacity-20">
        <div className={`flex items-center gap-4 font-black tracking-[0.2em] text-xs uppercase ${isWireframeMode ? 'text-cyan-500/30' : 'text-white'}`}>
          Powered by Vision AI System
        </div>
      </div>
    </motion.div>
  );
};

export default AppDetailPage;
