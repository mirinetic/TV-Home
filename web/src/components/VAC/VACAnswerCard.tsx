import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CornerDownRight } from 'lucide-react';
import { ScenarioData } from './vacData';

interface VACAnswerCardProps {
  scenario: ScenarioData;
  focusSection: string;
  focusRow: number; // 힌트 포커스 줄 위치
  isWireframeMode?: boolean;
  onHintClick?: (idx: number) => void;
}

export const VACAnswerCard = ({
  scenario,
  focusSection,
  focusRow,
  isWireframeMode = false,
  onHintClick
}: VACAnswerCardProps) => {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);

  // Reset typing when scenario changes
  useEffect(() => {
    setDisplayedText([]);
    setTypingIndex(0);
  }, [scenario.id]);

  // Typing Effect
  useEffect(() => {
    if (typingIndex < scenario.answers.length) {
      const fullText = scenario.answers[typingIndex];
      let currentLength = 0;
      
      const interval = setInterval(() => {
        currentLength += 3; // Type 3 characters at a time for speed
        if (currentLength >= fullText.length) {
          setDisplayedText(prev => [...prev, fullText]);
          setTypingIndex(prev => prev + 1);
          clearInterval(interval);
        } else {
          setDisplayedText(prev => {
            const next = [...prev];
            next[typingIndex] = fullText.slice(0, currentLength);
            return next;
          });
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [typingIndex, scenario.answers]);

  const isMoreFocused = focusSection === 'more_button';

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`absolute left-[80px] top-[230px] bottom-[160px] w-[580px] p-8 rounded-[40px] flex flex-col justify-between border-2 z-30 overflow-hidden ${
        isWireframeMode 
          ? 'bg-[#0b1528] border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)] font-mono' 
          : 'bg-white/8 backdrop-blur-3xl border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] text-white'
      }`}
    >
      <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar flex-1 pr-1">
        {/* Header Icon + Label */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isWireframeMode ? 'bg-cyan-950/40 border border-cyan-500/30' : 'bg-white/10'}`}>
            <Sparkles size={22} className={isWireframeMode ? 'text-cyan-400' : 'text-cyan-300'} />
          </div>
          <span className={`text-[13px] uppercase tracking-widest font-black ${isWireframeMode ? 'text-cyan-500/70' : 'text-white/40'}`}>
            Vision AI Agent Response
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-[28px] font-black tracking-tight leading-tight uppercase ${isWireframeMode ? 'text-cyan-400' : 'text-white'}`}>
          {isWireframeMode ? `[ TARGET: ${scenario.title} ]` : scenario.title}
        </h3>

        {/* Answers with gradual typing reveal */}
        <div className="flex flex-col gap-3.5 mt-2">
          {displayedText.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[16px] leading-relaxed ${isWireframeMode ? 'text-cyan-500/80' : 'text-white/80 font-medium'}`}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>

      {/* Hints & Action Section */}
      <div className="flex flex-col gap-5 pt-6 border-t border-white/5 mt-4">
        {/* Related Question Hints */}
        <div className="flex flex-col gap-2">
          {scenario.hints.map((hint, idx) => {
            const isFocused = focusSection === 'answer_hint' && focusRow === idx;
            return (
              <motion.div
                key={idx}
                onClick={() => onHintClick && onHintClick(idx)}
                animate={{
                  scale: isFocused ? 1.02 : 1,
                  backgroundColor: isFocused 
                    ? (isWireframeMode ? '#06b6d4' : '#ffffff') 
                    : (isWireframeMode ? '#111c30' : 'rgba(255, 255, 255, 0.05)'),
                  color: isFocused 
                    ? '#000000' 
                    : (isWireframeMode ? '#22d3ee' : '#ffffffd9')
                }}
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl cursor-pointer border text-left transition-all ${
                  isFocused 
                    ? (isWireframeMode 
                        ? 'border-cyan-400 text-black shadow-lg shadow-cyan-500/20' 
                        : 'border-white text-black shadow-lg')
                    : (isWireframeMode ? 'border-cyan-500/10' : 'border-white/5')
                }`}
              >
                <CornerDownRight size={16} className="shrink-0" />
                <span className="text-[14px] font-bold tracking-tight">{hint}</span>
              </motion.div>
            );
          })}
        </div>

        {/* More Button */}
        <motion.div
          animate={{
            scale: isMoreFocused ? 1.05 : 1,
            backgroundColor: isMoreFocused 
              ? (isWireframeMode ? '#06b6d4' : '#ffffff') 
              : (isWireframeMode ? '#111c30' : 'rgba(255,255,255,0.05)'),
            color: isMoreFocused 
              ? '#000000' 
              : (isWireframeMode ? '#22d3ee' : '#ffffff80'),
            borderColor: isMoreFocused 
              ? (isWireframeMode ? '#06b6d4' : '#ffffff') 
              : (isWireframeMode ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.1)')
          }}
          className={`h-14 rounded-2xl flex items-center justify-center font-black text-[15px] uppercase tracking-wider cursor-pointer border-2 transition-all ${
            isMoreFocused 
              ? (isWireframeMode ? 'shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'shadow-lg') 
              : ''
          }`}
        >
          {isWireframeMode ? '[ MORE INFO ]' : '더보기'}
        </motion.div>
      </div>
    </motion.div>
  );
};
