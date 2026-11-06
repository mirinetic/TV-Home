import React from 'react';
import { motion } from 'motion/react';

interface SettingsItemProps {
  focused: boolean;
  label: string;
  icon: any;
  onMouseEnter?: () => void;
  onClick?: () => void;
  isWireframeMode?: boolean;
}

export const SettingsItem = ({ 
  focused, 
  label, 
  icon: Icon,
  onMouseEnter,
  onClick,
  isWireframeMode = false
}: SettingsItemProps) => (
  <motion.div 
    onMouseEnter={onMouseEnter}
    onClick={onClick}
    animate={{
      scale: focused ? 1.05 : 1,
      backgroundColor: focused 
        ? (isWireframeMode ? '#06b6d4' : 'rgba(255, 255, 255, 1)') 
        : (isWireframeMode ? '#111c30' : 'rgba(255, 255, 255, 0.05)')
    }}
    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 border cursor-pointer ${
      isWireframeMode 
        ? `border-cyan-500/30 ${focused ? 'shadow-[0_0_20px_rgba(6,182,212,0.4)]' : ''}` 
        : `border-white/5 ${focused ? 'shadow-[0_20px_50px_rgba(255,255,255,0.2)]' : ''}`
    }`}
  >
    <Icon 
      size={28} 
      className={`transition-colors duration-200 ${
        focused 
          ? 'text-black' 
          : (isWireframeMode ? 'text-cyan-400' : 'text-white/60')
      }`} 
    />
    <motion.span 
      animate={{
        scale: focused ? 1.1 : 1,
        color: focused 
          ? '#000000' 
          : (isWireframeMode ? '#22d3ee' : '#ffffffcc')
      }}
      className={`text-xl font-bold tracking-tight origin-left ${isWireframeMode ? 'font-mono' : ''}`}
    >
      {label}
    </motion.span>
  </motion.div>
);
