import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { providerIcon } from '../constants';

interface ContentCardProps {
  focused: boolean;
  title: string;
  sublabel?: string;
  img: string;
  width?: string;
  onMouseEnter?: () => void;
  onClick?: () => void;
  style?: number;
  isWireframeMode?: boolean;
  /** Service name ("Netflix", "Prime Video" ...): its app icon shows in the focus text. */
  provider?: string;
  /** Rank number drawn left of the card (TOP 10 rows). */
  rank?: number;
}

export const ContentCard = ({ 
  focused, 
  title, 
  sublabel, 
  img, 
  width = "w-[440px]",
  onMouseEnter,
  onClick,
  style = 0,
  isWireframeMode = false,
  provider,
  rank
}: ContentCardProps) => {
  const icon = provider ? providerIcon(provider) : undefined;
  return (
  <div 
    className="flex shrink-0 relative items-start"
    onMouseEnter={onMouseEnter}
    onClick={onClick}
  >
    {rank !== undefined && (
      <span className={`w-[140px] shrink-0 text-right pr-4 text-[190px] leading-[248px] font-light tracking-tighter tabular-nums ${isWireframeMode ? 'text-cyan-500/40 font-mono' : 'text-white/85'}`}>
        {rank}
      </span>
    )}
    <div className="flex flex-col gap-6">
    <motion.div 
      animate={{ 
        scale: focused ? (style === 0 ? 1.1 : 1.05) : 1,
        zIndex: focused ? 20 : 0
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className={`relative ${width} aspect-[16/9] rounded-3xl overflow-hidden transition-all duration-100 ${
        focused 
          ? (isWireframeMode
              ? 'ring-4 ring-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
              : (style === 0 
                  ? 'shadow-[0_45px_90px_rgba(0,0,0,0.9)]' 
                  : 'shadow-[0_30px_60px_rgba(0,0,0,0.7)]'))
          : (isWireframeMode ? 'border border-cyan-500/20' : 'ring-1 ring-white/10')
      }`}
    >
      {isWireframeMode ? (
        <div className="w-full h-full bg-[#111c30] border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden font-mono text-cyan-500/40 p-4">
          <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" strokeWidth="1">
            <line x1="0" y1="0" x2="100%" y2="100%" />
            <line x1="100%" y1="0" x2="0" y2="100%" />
          </svg>
          <span className="z-10 text-[16px] font-bold bg-[#0b1528] px-3 py-1.5 rounded border border-cyan-500/20 text-cyan-400 max-w-[90%] truncate">
            {title}
          </span>
        </div>
      ) : (
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
      
      {/* Focused Border Overlay for perfect alignment without gaps */}
      {focused && (
        <div 
          className={`absolute inset-0 rounded-3xl pointer-events-none z-10 ${
            isWireframeMode
              ? 'border-[6px] border-cyan-400'
              : (style === 0 ? 'border-[8px] border-white' : 'border-[3px] border-white')
          }`}
        />
      )}
      
      {/* STYLE 1: Metadata INSIDE the card */}
      {style === 1 && (
        <AnimatePresence>
          {focused && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-x-0 bottom-0 p-6 pt-12 flex flex-col gap-0.5 items-start z-20 ${
                isWireframeMode 
                  ? 'bg-[#0b1528]/95 border-t border-cyan-500/20' 
                  : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
              }`}
            >
              <h4 className={`text-[28px] font-bold tracking-tight leading-tight ${isWireframeMode ? 'text-cyan-400 font-mono text-[18px]' : 'text-white'}`}>
                {isWireframeMode ? `[ TITLE: ${title} ]` : title}
              </h4>
              {isWireframeMode ? (
                <div className="h-3.5 bg-cyan-950/40 border border-cyan-500/20 rounded w-[110px] mt-1.5 animate-pulse" />
              ) : (
                <p className="text-lg font-medium tracking-tight text-white/70">{sublabel}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
    
    {/* STYLE 0: under the focused card, like the TV: the title, then service icon | kind | year */}
    {style === 0 && (
      <div className="h-28 flex flex-col justify-start">
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col gap-2 ${width} pr-2`}
            >
              {isWireframeMode ? (
                <h4 className="text-[20px] font-mono text-cyan-400 animate-pulse truncate">[ TITLE: {title} ]</h4>
              ) : (
                <>
                  <h4 className="text-[34px] font-semibold tracking-tight leading-tight text-white truncate">{title}</h4>
                  <div className="flex items-center gap-3 text-[20px] text-white/70 whitespace-nowrap">
                    {icon && <img src={icon} alt={provider} className="w-8 h-8 rounded-md object-cover shrink-0" />}
                    {sublabel && sublabel.split(' · ').map((part, i) => (
                      <React.Fragment key={i}>
                        {(i > 0 || icon) && <span className="w-px h-4 bg-white/30" />}
                        <span>{part}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )}
    </div>
  </div>
  );
};
