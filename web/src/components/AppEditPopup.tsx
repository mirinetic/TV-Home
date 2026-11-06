import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AppEditPopupProps {
  visible: boolean;
  selectedIdx: number;
  onClose: () => void;
  onSelectIdx: (idx: number) => void;
  isWireframeMode?: boolean;
}

const AppEditPopup = ({ visible, selectedIdx, onClose, onSelectIdx, isWireframeMode = false }: AppEditPopupProps) => {
  const menus = ['순서 변경', '앱 삭제', '나가기'];

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop for closing on outside click */}
          <div 
            className="fixed inset-0 z-[400] cursor-default bg-transparent" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()} 
            className={`absolute top-[110px] left-[100px] z-[1500] flex flex-col gap-1 p-2 border rounded-3xl w-[160px] ${
              isWireframeMode 
                ? 'bg-[#0b1528] border-cyan-400 border-2 shadow-[0_0_25px_rgba(6,182,212,0.3)] font-mono' 
                : 'bg-zinc-950/95 backdrop-blur-3xl border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
            }`}
          >
            {menus.map((menu, i) => (
              <div
                key={menu}
                onMouseEnter={() => onSelectIdx(i)}
                onClick={() => onClose()}
                className={`px-5 py-3.5 rounded-2xl text-[15px] font-extrabold transition-all duration-200 text-left cursor-pointer ${
                  selectedIdx === i 
                    ? (isWireframeMode ? 'bg-cyan-500 text-black scale-105 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'bg-white text-black scale-105 shadow-xl') 
                    : (isWireframeMode ? 'text-cyan-500/50 hover:text-cyan-400' : 'text-white/40 hover:text-white/60')
                }`}
              >
                {menu}
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppEditPopup;
