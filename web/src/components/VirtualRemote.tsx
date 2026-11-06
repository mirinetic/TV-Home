import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Play, 
  Heart, 
  Plus 
} from 'lucide-react';

interface VirtualRemoteProps {
  onClose: () => void;
}

const VirtualRemote = ({ onClose }: VirtualRemoteProps) => {
  const sendKey = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.5, x: 100, y: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      className="absolute bottom-12 right-12 z-[2000] p-6 bg-zinc-900/40 backdrop-blur-3xl border border-white/20 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col items-center gap-8 touch-none select-none active:cursor-grabbing"
    >
      {/* Handle for dragging */}
      <div className="w-12 h-1.5 bg-white/10 rounded-full mb-2 cursor-grab active:cursor-grabbing" />

      {/* Circle D-Pad */}
      <div className="relative w-48 h-48 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
        {/* Up Arrow */}
        <button 
          onClick={() => sendKey('ArrowUp')}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-t-full transition-all"
        >
          <ChevronUp size={32} />
        </button>
        {/* Down Arrow */}
        <button 
          onClick={() => sendKey('ArrowDown')}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-b-full transition-all"
        >
          <ChevronDown size={32} />
        </button>
        {/* Left Arrow */}
        <button 
          onClick={() => sendKey('ArrowLeft')}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-16 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-l-full transition-all"
        >
          <ChevronLeft size={32} />
        </button>
        {/* Right Arrow */}
        <button 
          onClick={() => sendKey('ArrowRight')}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-16 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-r-full transition-all"
        >
          <ChevronRight size={32} />
        </button>
        
        {/* CENTER OK BUTTON */}
        <button 
          onClick={() => sendKey('Enter')}
          className="w-24 h-24 bg-white/10 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all shadow-xl group"
        >
          <div className="text-xl font-black group-hover:scale-110 transition-transform">OK</div>
        </button>
      </div>

      {/* Control Buttons Grid */}
      <div className="grid grid-cols-3 gap-6">
        <button 
          onClick={() => sendKey('Escape')}
          className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/5"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={() => sendKey('Home')}
          className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/5"
        >
          <Play size={24} className="fill-current" />
        </button>
        <button 
          onClick={() => sendKey('m')} // 'm' for Menu or Mute in some context, but here let's say heart/info
          className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/5"
        >
          <Heart size={24} />
        </button>
      </div>

      {/* CLOSE BUTTON */}
      <button 
        onClick={onClose}
        className="mt-4 p-4 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-full transition-all"
      >
        <Plus size={24} className="rotate-45" />
      </button>
    </motion.div>
  );
};

export default VirtualRemote;
