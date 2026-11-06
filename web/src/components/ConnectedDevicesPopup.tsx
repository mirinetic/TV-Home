import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DEVICES } from '../constants';

interface ConnectedDevicesPopupProps {
  visible: boolean;
  selectedIdx: number;
  onHover: (i: number) => void;
  interactionMode: number;
  isWireframeMode?: boolean;
}

export const ConnectedDevicesPopup = ({ visible, selectedIdx, onHover, interactionMode, isWireframeMode = false }: ConnectedDevicesPopupProps) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute top-[125px] w-[330px] z-[1000] p-6 rounded-[3rem] origin-top border ${
          isWireframeMode 
            ? 'bg-[#0b1528] border-cyan-400 border-2 shadow-[0_0_35px_rgba(6,182,212,0.3)] font-mono' 
            : 'bg-zinc-900/45 backdrop-blur-[100px] border-white/5 shadow-[0_80px_180px_rgba(0,0,0,0.9)]'
        }`}
        style={{ left: 'var(--popup-left, -140px)' }}
      >
        <div className="grid grid-cols-2 gap-3 mb-6">
          {DEVICES.map((device, i) => (
            <div 
              key={device.id} 
              onMouseEnter={() => interactionMode === 1 && onHover(i)}
              className={`relative aspect-square flex flex-col justify-between p-4 rounded-[2.2rem] transition-all duration-300 cursor-pointer border ${
                selectedIdx === i 
                  ? (isWireframeMode 
                      ? 'bg-cyan-500 border-cyan-500 scale-[1.03] shadow-[0_0_15px_rgba(6,182,212,0.4)] text-black' 
                      : 'bg-white border-white scale-[1.03] shadow-[0_25px_50px_rgba(255,255,255,0.15)] text-black')
                  : (isWireframeMode 
                      ? 'bg-[#111c30] border-cyan-500/20 text-cyan-400' 
                      : 'bg-white/5 border-white/5 text-white/90')
              }`}
            >
              {/* Icon Container at Top-Left */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedIdx === i 
                  ? 'bg-black/5' 
                  : (isWireframeMode ? 'bg-cyan-950/80 border border-cyan-500/20' : device.color + ' shadow-lg shadow-black/20')
              }`}>
                {isWireframeMode ? (
                  <div className={`w-5 h-5 rounded-sm border ${selectedIdx === i ? 'border-black bg-black/40' : 'border-cyan-400/80 bg-cyan-950/20'}`} />
                ) : (
                  <device.icon 
                    size={20} 
                    strokeWidth={2}
                    className={`transition-colors duration-300 ${selectedIdx === i ? 'text-black' : 'text-white'}`}
                  />
                )}
              </div>

              {/* Text at Bottom-Left */}
              <div className="flex flex-col gap-0">
                <span className={`text-[14px] font-medium tracking-tight leading-tight ${
                  selectedIdx === i ? 'text-black' : (isWireframeMode ? 'text-cyan-400' : 'text-white')
                }`}>
                  {device.name}
                </span>
                {device.sub && (
                  <span className={`text-[11px] font-normal ${
                    selectedIdx === i ? 'text-black/60' : (isWireframeMode ? 'text-cyan-600' : 'text-white/40')
                  }`}>
                    {device.sub}
                  </span>
                )}
              </div>

              {/* Blue Checkmark Indicator */}
              {selectedIdx === i && (
                <div className={`absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                  isWireframeMode ? 'bg-cyan-400 border-black' : 'bg-sky-500 border-white'
                }`}>
                  <div className={`w-2 h-1 border-l-2 border-b-2 -rotate-45 mb-0.5 ${
                    isWireframeMode ? 'border-black' : 'border-white'
                  }`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
