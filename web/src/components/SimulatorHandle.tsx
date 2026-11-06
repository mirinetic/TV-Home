import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface SimulatorHandleProps {
  onClick: () => void;
}

const SimulatorHandle = ({ onClick }: SimulatorHandleProps) => {
  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      onClick={onClick}
      className="fixed right-0 top-[35%] z-[1000] cursor-pointer group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="bg-zinc-950/80 backdrop-blur-2xl border-l border-t border-b border-white/10 p-2.5 rounded-l-2xl shadow-2xl flex flex-col items-center gap-2.5 transition-all group-hover:bg-blue-600/20 group-hover:pl-4 group-hover:border-blue-500/50">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div className="flex flex-col gap-1 items-center opacity-40">
            <div className="w-0.5 h-3 bg-white/20 rounded-full" />
            <div className="w-0.5 h-0.5 bg-white/20 rounded-full" />
          </div>
          <span className="[writing-mode:vertical-lr] text-[8px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/60 transition-colors">
            Dash
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SimulatorHandle;
