import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import { MOCK_ACTORS_DATA, MOCK_HISTORY_DATA } from './vacData';

interface VACOverlaysProps {
  action: string | null; // 'settings' | 'history' | 'genWall' | 'castPanel'
  focusIndex: number; // settings / genWall 인덱스 포커스
  focusCol: number; // history 콜 포커스 (0~2)
  focusRow: number; // history 로우 포커스 (0~1)
  isWireframeMode?: boolean;
  onClose: () => void;
}

export const VACOverlays = ({
  action,
  focusIndex,
  focusCol,
  focusRow,
  isWireframeMode = false,
  onClose
}: VACOverlaysProps) => {
  if (!action) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        {/* Backdrop Dim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"
        />

        {/* Panel Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="z-10 relative"
        >
          {/* 1. Cast Panel (출연진 정보 팝업) */}
          {action === 'castPanel' && (
            <div className={`w-[832px] p-6 rounded-[32px] border-2 flex flex-col gap-6 ${
              isWireframeMode 
                ? 'bg-[#0b1528] border-cyan-400 font-mono text-cyan-400' 
                : 'bg-zinc-900/90 backdrop-blur-3xl border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] text-white'
            }`}>
              <h3 className="text-2xl font-black tracking-tight">Cast & Crew</h3>
              <div className="flex flex-row gap-6 justify-center">
                {MOCK_ACTORS_DATA.map((actor, idx) => {
                  const isFocused = idx === focusIndex;
                  return (
                    <div 
                      key={actor.name} 
                      className={`flex flex-col items-center p-4 rounded-2xl w-[160px] border-2 transition-all ${
                        isFocused 
                          ? (isWireframeMode ? 'border-cyan-400 bg-cyan-500/20' : 'border-white bg-white/5')
                          : 'border-transparent'
                      }`}
                    >
                      <div className={`w-24 h-24 rounded-full overflow-hidden border-2 mb-3 relative flex items-center justify-center ${
                        isFocused 
                          ? (isWireframeMode ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'border-white') 
                          : (isWireframeMode ? 'border-cyan-500/30' : 'border-white/10')
                      }`}>
                        {isWireframeMode ? (
                          <div className={`w-full h-full flex items-center justify-center font-bold text-lg ${isFocused ? 'bg-cyan-400 text-black' : 'bg-cyan-950 text-cyan-500'}`}>
                            {actor.name[0]}
                          </div>
                        ) : (
                          <img src={actor.image} className="w-full h-full object-cover" alt={actor.name} referrerPolicy="no-referrer" />
                        )}
                      </div>
                      <span className="text-[15px] font-black tracking-tight w-full truncate text-center">{actor.name}</span>
                      <span className={`text-[12px] w-full truncate text-center ${isWireframeMode ? 'text-cyan-500/60' : 'text-white/40'}`}>{actor.character}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. History Archive Panel (검색 기록 팝업) */}
          {action === 'history' && (
            <div className={`w-[1150px] p-8 rounded-[48px] border-2 flex flex-col gap-6 ${
              isWireframeMode 
                ? 'bg-[#0b1528] border-cyan-400 font-mono text-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.3)]' 
                : 'bg-zinc-900/90 backdrop-blur-3xl border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.8)] text-white'
            }`}>
              <div className="flex flex-col gap-1">
                <span className={`text-xs uppercase tracking-widest ${isWireframeMode ? 'text-cyan-500/50' : 'text-white/30'}`}>Vision AI History</span>
                <h3 className="text-3xl font-black tracking-tight mb-2">최근 질문 목록</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {MOCK_HISTORY_DATA.map((item, idx) => {
                  const c = idx % 3;
                  const r = Math.floor(idx / 3);
                  const isFocused = c === focusCol && r === focusRow;
                  
                  return (
                    <div
                      key={item.id}
                      className={`h-[140px] p-6 rounded-[2rem] border-2 flex flex-col justify-between transition-all ${
                        isFocused
                          ? (isWireframeMode 
                              ? 'bg-cyan-500 text-black border-cyan-400 scale-[1.03] shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                              : 'bg-white text-black border-white scale-[1.03] shadow-lg')
                          : (isWireframeMode ? 'bg-[#111c30] border-cyan-500/20' : 'bg-white/5 border-white/5')
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isWireframeMode ? (
                          <div className={`w-4 h-4 rounded-sm border ${isFocused ? 'border-black bg-black' : 'border-cyan-400/80 bg-cyan-950/20'}`} />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFocused ? 'bg-black/5' : 'bg-white/10'}`}>
                            <Play size={12} fill="currentColor" />
                          </div>
                        )}
                        <span className={`text-[12px] ${isFocused ? 'text-black/60' : (isWireframeMode ? 'text-cyan-500/60' : 'text-white/40')}`}>
                          [Voice Input]
                        </span>
                      </div>
                      <span className="text-[17px] font-black tracking-tight leading-tight line-clamp-2">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Generative Wall Panel (생성형 벽지 팝업) */}
          {action === 'genWall' && (
            <div className={`w-[860px] p-8 rounded-[40px] border-2 flex flex-col gap-6 items-center text-center ${
              isWireframeMode 
                ? 'bg-[#0b1528] border-cyan-400 font-mono text-cyan-400' 
                : 'bg-zinc-900/90 backdrop-blur-3xl border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] text-white'
            }`}>
              <h3 className="text-2xl font-black tracking-tight">Generative Wall</h3>
              <p className={`text-md max-w-xl leading-relaxed ${isWireframeMode ? 'text-cyan-500/70' : 'text-white/60'}`}>
                기분이 좋아지는 테마와 키워드를 선택하여 가상 이미지를 생성해보세요. 우리 집에 딱 맞는 아름다운 작품들이 TV 배경화면으로 입혀집니다.
              </p>
              
              <div className={`w-[780px] h-[220px] rounded-2xl overflow-hidden relative border flex items-center justify-center bg-black/30 ${
                isWireframeMode ? 'border-cyan-500/30' : 'border-white/10'
              }`}>
                {isWireframeMode ? (
                  <div className="w-full h-full flex flex-col items-center justify-center font-bold text-cyan-500/30">
                    <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" strokeWidth="1">
                      <line x1="0" y1="0" x2="100%" y2="100%" />
                      <line x1="100%" y1="0" x2="0" y2="100%" />
                    </svg>
                    [ MOCK IMAGE PLACEHOLDER ]
                  </div>
                ) : (
                  <img src="/assets/ai_home/home/genwall_popup_img.webp" className="w-full h-full object-cover" alt="GenWall Preview" referrerPolicy="no-referrer" />
                )}
              </div>
              
              <div className="flex gap-4 mt-2">
                {['생성하기', '닫기'].map((label, idx) => {
                  const isFocused = idx === focusIndex;
                  return (
                    <div 
                      key={label}
                      className={`w-[180px] h-12 rounded-full flex items-center justify-center font-black transition-all cursor-pointer border ${
                        isFocused 
                          ? (isWireframeMode ? 'bg-cyan-500 text-black border-cyan-400 scale-105 shadow-md shadow-cyan-500/20' : 'bg-white text-black border-white scale-105 shadow-lg') 
                          : (isWireframeMode ? 'bg-[#111c30] border-cyan-500/20' : 'bg-white/5 border-white/10')
                      }`}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Settings Panel (설정 팝업) */}
          {action === 'settings' && (
            <div className={`w-[450px] p-6 rounded-[32px] border-2 flex flex-col gap-6 ${
              isWireframeMode 
                ? 'bg-[#0b1528] border-cyan-400 font-mono text-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.3)]' 
                : 'bg-zinc-900/90 backdrop-blur-3xl border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] text-white'
            }`}>
              <div className="flex flex-col gap-1">
                <span className={`text-xs uppercase tracking-widest ${isWireframeMode ? 'text-cyan-500/50' : 'text-white/30'}`}>Settings renewal</span>
                <h3 className="text-2xl font-black tracking-tight mb-2">설정 및 안내</h3>
              </div>
              
              <div className="flex flex-col gap-3">
                {['음성 피드백 사용', '사용자 가이드', '약관 및 안내 사항'].map((menu, idx) => {
                  const isFocused = idx === focusIndex;
                  return (
                    <div 
                      key={menu}
                      className={`h-[60px] px-5 rounded-2xl flex items-center justify-between border-2 transition-all ${
                        isFocused 
                          ? (isWireframeMode ? 'bg-cyan-500 border-cyan-400 text-black scale-[1.03] shadow-md shadow-cyan-500/20' : 'bg-white border-white text-black scale-[1.03] shadow-lg') 
                          : (isWireframeMode ? 'bg-[#111c30] border-cyan-500/20' : 'bg-white/5 border-white/5')
                      }`}
                    >
                      <span className="font-bold text-[16px]">{menu}</span>
                      {idx === 0 && (
                        <div className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ${
                          isWireframeMode ? 'bg-cyan-950 border border-cyan-500/30' : 'bg-sky-500'
                        }`}>
                          <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                            isWireframeMode ? 'bg-cyan-400 translate-x-5' : 'bg-white translate-x-6'
                          }`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center mt-2">
                <span className={`text-[12px] ${isWireframeMode ? 'text-cyan-500/30' : 'text-white/30'}`}>
                  VAC Version 2.0.10
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
