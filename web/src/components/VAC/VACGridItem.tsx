import React from 'react';
import { motion } from 'motion/react';
import { VACCard, CARD_DIMENSIONS } from './vacData';

interface VACGridItemProps {
  item: VACCard;
  isFocused: boolean;
  isWireframeMode?: boolean;
  onMouseEnter?: () => void;
  onClick?: () => void;
}

export const VACGridItem = ({
  item,
  isFocused,
  isWireframeMode = false,
  onMouseEnter,
  onClick
}: VACGridItemProps) => {
  const dim = CARD_DIMENSIONS[item.type];
  
  // Set dimensions based on type
  const style = {
    width: `${dim.width}px`,
    height: `${dim.height}px`,
  };

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      animate={{
        scale: isFocused ? 1.04 : 1,
        zIndex: isFocused ? 30 : 10
      }}
      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
      style={style}
      className={`relative rounded-[32px] overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 border-2 ${
        isFocused 
          ? (isWireframeMode 
              ? 'border-transparent shadow-[0_0_25px_rgba(6,182,212,0.4)]' 
              : 'border-transparent shadow-[0_30px_60px_rgba(0,0,0,0.5)]')
          : (isWireframeMode ? 'border-cyan-500/20' : 'border-white/5')
      }`}
    >
      {isWireframeMode ? (
        <div className="w-full h-full bg-[#111c30] flex flex-col items-center justify-center relative p-6 font-mono text-cyan-500/40 text-center select-none">
          {/* Wireframe Technical Cross Lines */}
          <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" strokeWidth="1">
            <line x1="0" y1="0" x2="100%" y2="100%" />
            <line x1="100%" y1="0" x2="0" y2="100%" />
          </svg>
          
          <div className="z-10 flex flex-col gap-1.5 items-center">
            <span className="text-[11px] uppercase tracking-widest text-cyan-500/50">
              [{item.type} CARD: {item.action.toUpperCase()}]
            </span>
            <span className="text-[16px] font-black text-cyan-400 px-3 py-1 bg-[#0b1528] rounded border border-cyan-500/30 max-w-[90%] truncate">
              {item.name}
            </span>
          </div>

          {/* Wireframe Focused Outline */}
          {isFocused && (
            <div className="absolute -inset-[2px] rounded-[32px] border-[4px] border-cyan-400 pointer-events-none z-30" />
          )}
        </div>
      ) : (
        <>
          {/* Default Image */}
          <img 
            src={item.bgUrl} 
            alt={item.name} 
            className="w-full h-full object-cover transition-opacity duration-300"
            referrerPolicy="no-referrer"
          />
          
          {/* Focused Highlight Outstroke Overlay */}
          {isFocused && (
            <div className="absolute -inset-[2px] pointer-events-none z-30 flex items-center justify-center">
              <img 
                src={item.focusedUrl} 
                className={`absolute inset-0 w-full h-full object-fill mix-blend-screen opacity-100 animate-pulse ${
                  item.type === 'L' ? 'scale-x-[1.12] scale-y-[1.09]' : 'scale-x-[1.12] scale-y-[1.19]'
                }`}
                style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.65))' }}
                alt="focus outstroke" 
              />
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
