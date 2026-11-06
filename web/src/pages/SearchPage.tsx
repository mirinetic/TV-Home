import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';

interface SearchPageProps {
  onBack: () => void;
  isWireframeMode?: boolean;
}

const SearchPage = ({ onBack, isWireframeMode = false }: SearchPageProps) => {
  const [focusedIdx, setFocusedIdx] = useState(0); // 0: Title, 1: Back

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
      e.stopPropagation();
    }
    switch (e.key) {
      case 'ArrowDown':
        setFocusedIdx(1);
        break;
      case 'ArrowUp':
        setFocusedIdx(0);
        break;
      case 'Enter':
        if (focusedIdx === 1) onBack();
        break;
      case 'Escape':
      case 'Backspace':
        onBack();
        break;
    }
  }, [focusedIdx, onBack]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={`h-full w-full flex items-center justify-center selection:bg-transparent ${isWireframeMode ? 'bg-[#0b1528] wireframe-mode-grid' : 'bg-[#080808]'}`}>
      <div className={`relative aspect-video h-full w-auto flex flex-col items-center justify-center gap-16 overflow-hidden px-20 ${
        isWireframeMode ? 'bg-[#0b1528] border-x border-cyan-500/20' : 'bg-[#080808] shadow-2xl'
      }`}>
        <motion.div
          animate={{ 
            scale: focusedIdx === 0 ? 1.1 : 1,
            opacity: focusedIdx === 0 ? 1 : 0.4
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="flex flex-col items-center gap-4"
        >
          <div className={`p-4 rounded-3xl backdrop-blur-2xl border mb-4 ${isWireframeMode ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-white/5 border-white/10'}`}>
            <Search size={64} className={isWireframeMode ? 'text-cyan-400' : 'text-white opacity-80'} />
          </div>
          <h1 className={`text-[100px] font-black italic uppercase tracking-tighter leading-none ${isWireframeMode ? 'text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]'}`}>
            SEARCH
          </h1>
          <p className={`text-2xl font-medium tracking-tight whitespace-nowrap ${isWireframeMode ? 'text-cyan-500/80' : 'text-white/40'}`}>원하는 영화나 드라마를 검색하세요</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: isWireframeMode ? '#06b6d4' : '#ffffff', color: '#000000' }}
          onClick={onBack}
          animate={{ 
            scale: focusedIdx === 1 ? 1.1 : 1,
            backgroundColor: focusedIdx === 1 ? (isWireframeMode ? '#06b6d4' : '#ffffff') : 'rgba(255,255,255,0.05)',
            color: focusedIdx === 1 ? '#000000' : (isWireframeMode ? '#06b6d4' : '#ffffff80'),
            borderColor: focusedIdx === 1 ? (isWireframeMode ? '#06b6d4' : '#ffffff') : (isWireframeMode ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.1)')
          }}
          className={`px-16 py-6 rounded-[3rem] text-3xl font-black uppercase tracking-tight transition-all duration-200 border-2 cursor-pointer ${
            focusedIdx === 1 ? (isWireframeMode ? 'shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'shadow-[0_25px_60px_rgba(255,255,255,0.3)]') : ''
          }`}
        >
          돌아가기
        </motion.button>
      </div>
    </div>
  );
};

export default SearchPage;
