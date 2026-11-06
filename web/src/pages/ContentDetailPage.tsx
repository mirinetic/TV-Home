import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface ContentDetailPageProps {
  onBack: () => void;
  isWireframeMode?: boolean;
}

const ContentDetailPage = ({ onBack, isWireframeMode = false }: ContentDetailPageProps) => {
  const [localIdx, setLocalIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, localIdx]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-[100] flex items-center justify-center font-sans ${
        isWireframeMode ? 'bg-[#0b1528] wireframe-mode-grid' : 'bg-[#050505]'
      }`}
    >
      <div className="text-center space-y-12 max-w-2xl px-10">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border mb-4 ${isWireframeMode ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-white/5 border-white/10'}`}>
          <Play size={48} className={isWireframeMode ? 'text-cyan-400 ml-2' : 'text-white ml-2'} fill="currentColor" />
        </div>
        <div className="space-y-4">
          <h2 className={`text-6xl font-black italic tracking-tighter uppercase ${isWireframeMode ? 'text-cyan-400' : 'text-white'}`}>콘텐츠 재생 준비 완료</h2>

          <p className={`text-xl leading-relaxed font-medium ${isWireframeMode ? 'text-cyan-500/80' : 'text-white/40'}`}>
            선택하신 콘텐츠의 정보를 불러왔습니다. 지금 바로 고화질 스트리밍으로 감상을 시작하거나 나중에 시청하기 위해 보관할 수 있습니다.
          </p>
        </div>

        <div className="flex gap-6 justify-center pt-8">
          <div 
            className={`flex items-center gap-4 px-12 py-6 rounded-[2rem] font-black text-xl uppercase tracking-tighter transition-all duration-200 ${
              isWireframeMode
                ? (localIdx === 0 
                    ? 'bg-cyan-500 text-black scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                    : 'bg-[#111c30] border border-cyan-500/30 text-cyan-400')
                : (localIdx === 0 
                    ? 'bg-white text-black scale-110 shadow-[0_20px_40px_rgba(255,255,255,0.2)]' 
                    : 'bg-white/5 border border-white/10 text-white')
            }`}
          >
            <Play size={24} fill={localIdx === 0 ? "currentColor" : "none"} />
            지금 재생하기
          </div>
          <div 
            onClick={onBack}
            className={`flex items-center gap-4 px-12 py-6 rounded-[2rem] font-black text-xl uppercase tracking-tighter transition-all duration-200 cursor-pointer ${
              isWireframeMode
                ? (localIdx === 1 
                    ? 'bg-cyan-500 text-black scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                    : 'bg-[#111c30] border border-cyan-500/30 text-cyan-400')
                : (localIdx === 1 
                    ? 'bg-white text-black scale-110 shadow-[0_20px_40px_rgba(255,255,255,0.2)]' 
                    : 'bg-white/5 border border-white/10 text-white')
            }`}
          >
            돌아가기
          </div>
        </div>
        
        <div className="pt-12 flex items-center justify-center gap-3 text-white/20">
          <div className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest border uppercase ${
            isWireframeMode ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-500/50' : 'bg-white/5 border-white/10'
          }`}>ESC TO EXIT</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentDetailPage;
