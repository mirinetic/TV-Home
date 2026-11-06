import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { Content, providerIcon } from '../constants';
import { launchApp, hasApp, isAndroidApp } from '../native';

interface ContentDetailPageProps {
  content?: Content;
  onBack: () => void;
  isWireframeMode?: boolean;
}

// The page for one content card: its art, service, kind, year and synopsis.
// "Watch on <service>" opens that TV app when it is installed (Android app only).
const ContentDetailPage = ({ content, onBack, isWireframeMode = false }: ContentDetailPageProps) => {
  const [localIdx, setLocalIdx] = useState(0); // 0: watch, 1: back
  const [note, setNote] = useState('');
  const provider = content?.provider || '';
  const icon = provider ? providerIcon(provider) : undefined;
  const installed = !isAndroidApp || !provider || hasApp(provider);

  const watch = () => {
    if (!provider) return;
    if (!launchApp(provider)) setNote(isAndroidApp ? `이 TV에는 ${provider} 앱이 설치되어 있지 않아요` : `TV 앱에서는 ${provider} 앱이 열려요 (브라우저 미리보기)`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'];
      if (handledKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === 'Escape' || e.key === 'Backspace') onBack();
      else if (e.key === 'ArrowRight') setLocalIdx(prev => (prev < 1 ? prev + 1 : prev));
      else if (e.key === 'ArrowLeft') setLocalIdx(prev => (prev > 0 ? prev - 1 : prev));
      else if (e.key === 'Enter') { if (localIdx === 1) onBack(); else watch(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, localIdx, provider]);

  const btn = (i: number) => isWireframeMode
    ? (localIdx === i ? 'bg-cyan-500 text-black scale-105' : 'bg-[#111c30] border border-cyan-500/30 text-cyan-400')
    : (localIdx === i ? 'bg-white text-black scale-105 shadow-[0_20px_40px_rgba(255,255,255,0.15)]' : 'bg-white/10 text-white');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-[100] overflow-hidden font-sans ${isWireframeMode ? 'bg-[#0b1528] wireframe-mode-grid' : 'bg-[#050505]'}`}
    >
      {!isWireframeMode && content && (
        <>
          <img src={content.img} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
        </>
      )}

      <div className="relative h-full flex items-center gap-20 px-[120px]">
        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex items-center gap-4">
            {isWireframeMode
              ? <div className="w-14 h-14 rounded-xl border border-cyan-500/40 bg-cyan-950/40" />
              : icon && <img src={icon} alt={provider} className="w-14 h-14 rounded-xl object-cover" />}
            <span className={`text-2xl font-semibold ${isWireframeMode ? 'text-cyan-400 font-mono' : 'text-white/80'}`}>{provider}</span>
          </div>
          <h2 className={`text-[72px] leading-[1.05] font-bold tracking-tight ${isWireframeMode ? 'text-cyan-400 font-mono text-[48px]' : 'text-white'}`}>
            {isWireframeMode ? `[ TITLE: ${content?.title ?? ''} ]` : content?.title ?? '콘텐츠'}
          </h2>
          {content && (
            <div className={`flex items-center gap-4 text-2xl font-medium ${isWireframeMode ? 'text-cyan-500/70 font-mono' : 'text-white/60'}`}>
              <span>{content.kind}</span><span className="w-px h-6 bg-white/30" /><span>{content.year}</span>
            </div>
          )}
          <p className={`text-[26px] leading-relaxed max-w-[900px] ${isWireframeMode ? 'text-cyan-500/70' : 'text-white/75'}`}>
            {content?.desc}
          </p>
          <div className="flex gap-6 pt-6">
            <div onClick={() => { setLocalIdx(0); watch(); }} className={`flex items-center gap-4 px-12 py-6 rounded-[2rem] font-bold text-[26px] transition-all duration-200 cursor-pointer ${btn(0)}`}>
              <Play size={28} fill={localIdx === 0 ? 'currentColor' : 'none'} />
              {provider ? `${provider}에서 보기` : '지금 재생하기'}
            </div>
            <div onClick={onBack} className={`flex items-center px-12 py-6 rounded-[2rem] font-bold text-[26px] transition-all duration-200 cursor-pointer ${btn(1)}`}>
              돌아가기
            </div>
          </div>
          <p className={`text-xl h-8 ${isWireframeMode ? 'text-cyan-500/60' : 'text-white/45'}`}>
            {note || (!installed ? `이 TV에는 ${provider} 앱이 설치되어 있지 않아요` : '')}
          </p>
        </div>

        {content && (
          <div className={`w-[760px] shrink-0 aspect-[16/9] rounded-3xl overflow-hidden ${isWireframeMode ? 'border border-cyan-500/40 bg-[#111c30]' : 'shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10'}`}>
            {!isWireframeMode && <img src={content.img} alt={content.title} className="w-full h-full object-cover" />}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContentDetailPage;
