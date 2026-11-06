import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROFILES } from '../constants';

interface AccountPopupProps {
  visible: boolean;
  selectedIdx: number;
  onHover: (i: number) => void;
  interactionMode: number;
  isWireframeMode?: boolean;
}

export const AccountPopup = ({ visible, selectedIdx, onHover, interactionMode, isWireframeMode = false }: AccountPopupProps) => (
  <>

    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute top-[-350px] w-[1000px] h-[1000px] z-0 rounded-full origin-top-left pointer-events-none"
          onContextMenu={(e) => e.preventDefault()}
          style={{
            left: 'calc(var(--icon-center, 28px) - 500px)',
            background: isWireframeMode ? 'transparent' : 'radial-gradient(ellipse 450px 750px at 500px 425px, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.85) 40%, transparent 90%)',
          }}
        >
          <div 
            className={`flex flex-col gap-3 p-8 mt-[480px] pointer-events-auto w-[340px] relative z-[1000] ${
              isWireframeMode ? 'bg-[#0b1528] border-2 border-cyan-400 rounded-3xl font-mono shadow-[0_0_40px_rgba(6,182,212,0.3)]' : ''
            }`}
            style={{ marginLeft: 'calc(var(--icon-center, 28px) - 62px + 438px)' }}
          >
            <div className="flex flex-col gap-1">
              {PROFILES.map((profile, i) => (
                <div 
                  key={profile.id} 
                  onMouseEnter={() => interactionMode === 1 && onHover(i)}
                  className={`flex items-center gap-4 p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                    selectedIdx === i 
                      ? (isWireframeMode 
                          ? 'bg-cyan-500 text-black scale-[1.03] shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                          : 'bg-white scale-[1.03] shadow-[0_10px_40px_rgba(255,255,255,0.25)]')
                      : (isWireframeMode ? 'hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20' : 'hover:bg-white/10')
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 transition-all ${
                    selectedIdx === i 
                      ? (isWireframeMode ? 'ring-cyan-500/50 scale-105' : 'ring-black/20 scale-105') 
                      : (isWireframeMode ? 'ring-cyan-500/20' : 'ring-white/10')
                  }`}>
                    {isWireframeMode ? (
                      <div className={`w-full h-full flex items-center justify-center font-bold text-sm ${
                        selectedIdx === i ? 'bg-cyan-900/40 text-black' : 'bg-cyan-950 text-cyan-400'
                      }`}>
                        {profile.name[0]}
                      </div>
                    ) : (
                      <img src={profile.img} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}
                  </div>
                  <span className={`text-xl font-bold tracking-tight transition-colors ${
                    selectedIdx === i 
                      ? 'text-black' 
                      : (isWireframeMode ? 'text-cyan-400' : 'text-white/90')
                  }`}>
                    {profile.name}
                  </span>
                </div>
              ))}
            </div>
            <div 
              onMouseEnter={() => interactionMode === 1 && onHover(PROFILES.length)}
              className={`flex items-center gap-4 p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                selectedIdx === PROFILES.length 
                  ? (isWireframeMode 
                      ? 'bg-cyan-500 text-black scale-[1.03] shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                      : 'bg-white scale-[1.03] shadow-[0_10px_40px_rgba(255,255,255,0.25)]')
                  : (isWireframeMode ? 'hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 opacity-90' : 'hover:bg-white/10 opacity-90 hover:opacity-100')
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed transition-all ${
                selectedIdx === PROFILES.length 
                  ? (isWireframeMode ? 'bg-cyan-900/40 border-cyan-400 scale-105' : 'bg-black/5 border-black/40 scale-105') 
                  : (isWireframeMode ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-white/5 border-white/20')
              }`}>
                <span className={`text-lg transition-colors ${
                  selectedIdx === PROFILES.length ? 'text-black' : (isWireframeMode ? 'text-cyan-400' : 'text-white/60')
                } mb-0.5`}>+</span>
              </div>
              <span className={`text-xl font-bold transition-colors ${
                selectedIdx === PROFILES.length ? 'text-black' : (isWireframeMode ? 'text-cyan-400' : 'text-white/80')
              }`}>계정 추가</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
