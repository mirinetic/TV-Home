import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUICK_SETTINGS } from '../constants';

interface SettingsPopupProps {
  visible: boolean;
  selectedIdx: number;
  onHover: (i: number) => void;
  interactionMode: number;
  isWireframeMode?: boolean;
}

export const SettingsPopup = ({ visible, selectedIdx, onHover, interactionMode, isWireframeMode = false }: SettingsPopupProps) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute top-[125px] w-[390px] z-[1000] p-6 rounded-[3rem] origin-top border ${
          isWireframeMode 
            ? 'bg-[#0b1528] border-cyan-400 border-2 shadow-[0_0_35px_rgba(6,182,212,0.3)] font-mono' 
            : 'bg-zinc-900/45 backdrop-blur-[100px] border-white/5 shadow-[0_80px_180px_rgba(0,0,0,0.9)]'
        }`}
        style={{ left: 'var(--popup-left, -220px)' }}
      >
        {/* Top Right Small Icons */}
        <div className="flex justify-end gap-2.5 mb-4 pr-1">
          {QUICK_SETTINGS.slice(0, 2).map((item, i) => {
            const Icon = item.icon as any;
            return (
              <div 
                key={item.id} 
                onMouseEnter={() => interactionMode === 1 && onHover(i)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  selectedIdx === i 
                    ? (isWireframeMode ? 'bg-cyan-500 scale-110 shadow-lg' : 'bg-white scale-110 shadow-lg') 
                    : (isWireframeMode ? 'bg-[#111c30] border border-cyan-500/20 text-cyan-400' : 'bg-white/5 hover:bg-white/10')
                }`}
              >
                {isWireframeMode ? (
                  <div className={`w-2.5 h-2.5 rounded-sm border ${selectedIdx === i ? 'border-black bg-black' : 'border-cyan-400/80 bg-cyan-950/20'}`} />
                ) : (
                  <Icon 
                    size={12} 
                    strokeWidth={2.2}
                    className={`transition-all duration-300 ${selectedIdx === i ? 'text-black' : 'text-white/60'}`} 
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Middle Pills */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {QUICK_SETTINGS.slice(2, 4).map((item, i) => {
            const index = i + 2;
            const Icon = item.icon as any;
            return (
              <div 
                key={item.id} 
                onMouseEnter={() => interactionMode === 1 && onHover(index)}
                className={`flex items-center gap-2.5 h-[62px] px-3.5 rounded-[24px] transition-all duration-300 border ${
                  selectedIdx === index 
                    ? (isWireframeMode ? 'bg-cyan-500 border-cyan-400 scale-[1.03] shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white border-white scale-[1.03] shadow-[0_20px_40px_rgba(255,255,255,0.15)]') 
                    : (isWireframeMode ? 'bg-[#111c30] border-cyan-500/20' : 'bg-white/5 border-white/5')
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  selectedIdx === index 
                    ? 'bg-black/5' 
                    : (isWireframeMode ? 'bg-cyan-950/80 border border-cyan-500/20' : 'bg-white/10')
                }`}>
                  {isWireframeMode ? (
                    <div className={`w-4 h-4 rounded-sm border ${selectedIdx === index ? 'border-black bg-black/40' : 'border-cyan-400/80 bg-cyan-950/20'}`} />
                  ) : (
                    <Icon 
                      size={18} 
                      strokeWidth={1.8}
                      className={`transition-all duration-300 ${selectedIdx === index ? 'text-black' : 'text-white'}`} 
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center gap-0">
                  <span className={`text-[14px] font-medium leading-tight ${selectedIdx === index ? 'text-black' : (isWireframeMode ? 'text-cyan-400' : 'text-white')}`}>{item.name}</span>
                  {item.subName && (
                    <span className={`text-[12px] font-normal ${selectedIdx === index ? 'text-black/50' : (isWireframeMode ? 'text-cyan-600' : 'text-white/30')}`}>{item.subName}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Grid: 2 rows of 3 columns */}
        <div className="grid grid-cols-3 gap-y-5 gap-x-1 mb-2">
          {QUICK_SETTINGS.slice(4).map((item, i) => {
            const index = i + 4;
            const Icon = item.icon as any;
            return (
              <div key={item.id} className="flex flex-col items-center gap-2.5">
                <div 
                  onMouseEnter={() => interactionMode === 1 && onHover(index)}
                  className={`w-[62px] h-[62px] rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    selectedIdx === index 
                      ? (isWireframeMode ? 'bg-cyan-500 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white scale-110 shadow-[0_25px_50px_rgba(255,255,255,0.25)]') 
                      : (isWireframeMode ? 'bg-[#111c30] border border-cyan-500/20 text-cyan-400' : 'bg-white/5 hover:bg-white/10')
                  }`}
                >
                  {isWireframeMode ? (
                    <div className={`w-6 h-6 rounded-sm border flex items-center justify-center ${selectedIdx === index ? 'border-black bg-black/30' : 'border-cyan-400/80 bg-cyan-950/20'}`}>
                      <div className={`w-2 h-2 rounded-full ${selectedIdx === index ? 'bg-black' : 'bg-cyan-400'}`} />
                    </div>
                  ) : (
                    <Icon 
                      size={26} 
                      strokeWidth={1.5}
                      className={`transition-all duration-300 ${selectedIdx === index ? 'text-black' : 'text-white'}`} 
                    />
                  )}
                </div>
                <span className={`text-[12px] font-normal tracking-tight text-center px-1 leading-tight transition-colors ${
                  selectedIdx === index ? (isWireframeMode ? 'text-cyan-300' : 'text-white') : (isWireframeMode ? 'text-cyan-500/50' : 'text-white/30')
                }`}>
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Arrow Indicator */}
        <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rotate-45 border-r border-b z-[-1] ${
          isWireframeMode ? 'bg-[#0b1528] border-cyan-400' : 'bg-zinc-900/45 border-white/5'
        }`} />
      </motion.div>
    )}
  </AnimatePresence>
);
