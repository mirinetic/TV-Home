import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { 
  DEFAULT_GRID_DATA, 
  VAC_SCENARIOS, 
  ScenarioData,
  VACCard 
} from '../components/VAC/vacData';
import { VACGrid } from '../components/VAC/VACGrid';
import { VACAnswerCard } from '../components/VAC/VACAnswerCard';
import { VACOverlays } from '../components/VAC/VACOverlays';
import { VACNudge } from '../components/VAC/VACNudge';

interface VisionPageProps {
  onBack: () => void;
  isWireframeMode?: boolean;
}

const SCROLL = {
  DEFAULT: 608,
  OFFSET_EXPANDED: 80,
  ITEM_WIDTH: 368,
  GAP: 48,
  MARGIN_LEFT: 80,
  SCREEN_WIDTH: 1920,
  MARGIN_RIGHT: 160
};

const VisionPage = ({ onBack, isWireframeMode = false }: VisionPageProps) => {
  // ========== STATE ==========
  const [state, setState] = useState<'default' | 'expanded'>('default');
  const [focusSection, setFocusSection] = useState<string>('pig_home'); // 'pig_home' | 'pig_desc' | 'back_button' | 'extra' | 'expanded_cards' | 'more_button' | 'answer_hint'
  const [focusCol, setFocusCol] = useState(0);
  const [focusRow, setFocusRow] = useState(0);
  const [scrollX, setScrollX] = useState(SCROLL.DEFAULT);
  
  const [activeScenario, setActiveScenario] = useState<ScenarioData | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  
  // Overlay Focus State
  const [overlayFocusIndex, setOverlayFocusIndex] = useState(0);
  const [overlayFocusCol, setOverlayFocusCol] = useState(0);
  const [overlayFocusRow, setOverlayFocusRow] = useState(0);

  // Dynamic grid data that can swap cards (e.g. topic card rotating)
  const [gridExtra, setGridExtra] = useState<VACCard[][]>(DEFAULT_GRID_DATA);
  const [greetingText, setGreetingText] = useState('Good Morning');
  const [todayDate, setTodayDate] = useState('');
  const [todayTime, setTodayTime] = useState('');

  // Set greeting text based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingText('Good Morning');
    else if (hour < 18) setGreetingText('Good Afternoon');
    else setGreetingText('Good Evening');
  }, []);

  // Update time and date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Date: "May 28"
      const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      // Format Time: "04:16 PM"
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
      
      setTodayDate(dateStr);
      setTodayTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter grid items in expanded mode
  const currentGridExtra = React.useMemo(() => {
    if (state === 'expanded' && activeScenario) {
      // Expanded mode: remove the card that triggered the scenario
      if (activeScenario.id === 'cts') {
        return gridExtra.filter((_, idx) => idx !== 0);
      } else if (activeScenario.id === 'topic') {
        return gridExtra.filter((_, idx) => idx !== 1);
      } else if (activeScenario.id === 'copilot') {
        return gridExtra.filter((_, idx) => idx !== 2); // Microsoft Copilot column
      } else if (activeScenario.id === 'perplexity') {
        return gridExtra.filter((_, idx) => idx !== 2);
      }
    }
    return gridExtra;
  }, [state, activeScenario, gridExtra]);

  // Expanded cards based on active scenario
  const gridExpanded = React.useMemo(() => {
    if (!activeScenario) return [];
    // Convert related cards format to grid format (column array)
    const columns: VACCard[][] = [];
    activeScenario.relatedCards.forEach((card, idx) => {
      columns.push([
        {
          id: `expanded-${idx}`,
          type: card.type,
          name: card.title,
          bgUrl: card.img,
          focusedUrl: card.type === 'L' 
            ? '/assets/ai_home/focused/VisionAI_img_outstroke_f_xl.webp' 
            : '/assets/ai_home/focused/VisionAI_img_outstroke_f_m.webp',
          action: 'expanded_item',
          subName: card.sub
        }
      ]);
    });
    return columns;
  }, [activeScenario]);

  // Ensure focused element is visible on screen by auto-scrolling
  const ensureVisible = useCallback((sect: string, col: number, row: number, curState: 'default' | 'expanded') => {
    if (sect === 'more_button' || sect === 'answer_hint' || sect === 'pig_home' || sect === 'pig_desc' || sect === 'back_button') {
      setScrollX(curState === 'expanded' ? SCROLL.OFFSET_EXPANDED : SCROLL.DEFAULT);
      return;
    }

    const isExpandedExtra = curState === 'expanded' && sect === 'extra';
    const currentGrid = curState === 'expanded' ? gridExpanded : currentGridExtra;
    const gridLength = isExpandedExtra ? currentGridExtra.length : currentGrid.length;
    if (col < 0 || col >= gridLength) return;

    // Estimate horizontal offset of current column
    let colLeft = SCROLL.MARGIN_LEFT;
    
    if (curState === 'expanded') {
      // Expanded mode has AnswerCard taking up space
      colLeft += 580 + SCROLL.GAP; // AnswerCard width (580px) + Gap
    }
    
    const actualColIndex = isExpandedExtra ? gridExpanded.length + col : col;
    colLeft += actualColIndex * (SCROLL.ITEM_WIDTH + SCROLL.GAP);

    const colRight = colLeft + SCROLL.ITEM_WIDTH;
    const viewWidth = SCROLL.SCREEN_WIDTH;
    
    let currentOffset = curState === 'expanded' ? SCROLL.OFFSET_EXPANDED : SCROLL.DEFAULT;
    
    // Calculate new scroll position
    let newScrollX = scrollX;
    const absoluteLeft = colLeft + scrollX;
    const absoluteRight = colRight + scrollX;

    if (absoluteRight > viewWidth - SCROLL.MARGIN_RIGHT) {
      newScrollX -= (absoluteRight - (viewWidth - SCROLL.MARGIN_RIGHT));
    }
    if (absoluteLeft < SCROLL.MARGIN_LEFT) {
      newScrollX -= (absoluteLeft - SCROLL.MARGIN_LEFT);
    }

    const maxOffset = curState === 'expanded' ? SCROLL.OFFSET_EXPANDED : SCROLL.DEFAULT;
    if (newScrollX > maxOffset) {
      newScrollX = maxOffset;
    }

    setScrollX(newScrollX);
  }, [scrollX, gridExpanded, currentGridExtra]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'];
    if (handledKeys.includes(e.key)) {
      e.stopPropagation();
      e.preventDefault();
    }

    // 1. OVERLAY NAVIGATION (Highest Priority)
    if (activeOverlay) {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        setActiveOverlay(null);
        return;
      }
      
      if (activeOverlay === 'history') {
        switch (e.key) {
          case 'ArrowLeft': setOverlayFocusCol(prev => Math.max(0, prev - 1)); break;
          case 'ArrowRight': setOverlayFocusCol(prev => Math.min(2, prev + 1)); break;
          case 'ArrowUp': setOverlayFocusRow(prev => Math.max(0, prev - 1)); break;
          case 'ArrowDown': setOverlayFocusRow(prev => Math.min(1, prev + 1)); break;
          case 'Enter':
            // Select item from history
            const histIdx = overlayFocusRow * 3 + overlayFocusCol;
            if (histIdx === 0) {
              // Fortune scenario
              setActiveScenario(VAC_SCENARIOS.cts);
              setState('expanded');
              setFocusSection('expanded_cards');
              setFocusCol(0);
              setFocusRow(0);
              setScrollX(SCROLL.OFFSET_EXPANDED);
            } else if (histIdx === 1) {
              // Cast scenario
              setActiveOverlay('castPanel');
              setOverlayFocusIndex(0);
            } else {
              setActiveOverlay(null);
            }
            break;
        }
      } else if (activeOverlay === 'castPanel') {
        switch (e.key) {
          case 'ArrowLeft': setOverlayFocusIndex(prev => Math.max(0, prev - 1)); break;
          case 'ArrowRight': setOverlayFocusIndex(prev => Math.min(3, prev + 1)); break;
          case 'Enter':
          case 'Escape':
          case 'Backspace':
            setActiveOverlay(null);
            break;
        }
      } else if (activeOverlay === 'genWall') {
        switch (e.key) {
          case 'ArrowLeft': setOverlayFocusIndex(0); break;
          case 'ArrowRight': setOverlayFocusIndex(1); break;
          case 'Enter':
            setActiveOverlay(null);
            break;
        }
      } else if (activeOverlay === 'settings') {
        switch (e.key) {
          case 'ArrowUp': setOverlayFocusIndex(prev => Math.max(0, prev - 1)); break;
          case 'ArrowDown': setOverlayFocusIndex(prev => Math.min(2, prev + 1)); break;
          case 'Enter':
            setActiveOverlay(null);
            break;
        }
      }
      return;
    }

    // 2. MAIN NAVIGATIONS
    if (state === 'default') {
      // --- Default Mode ---
      const grid = currentGridExtra;
      const colLen = grid.length;
      
      if (focusSection === 'pig_home') {
        switch (e.key) {
          case 'ArrowRight':
            setFocusSection('extra');
            setFocusCol(0);
            setFocusRow(0);
            ensureVisible('extra', 0, 0, 'default');
            break;
          case 'ArrowDown':
            setFocusSection('pig_desc');
            ensureVisible('pig_desc', 0, 0, 'default');
            break;
          case 'ArrowUp':
            setFocusSection('back_button');
            ensureVisible('back_button', 0, 0, 'default');
            break;
          case 'ArrowLeft':
            // Boundary: do nothing, only onBack() via explicit exit
            break;
          case 'Escape':
          case 'Backspace':
            onBack();
            break;
        }
      } else if (focusSection === 'pig_desc') {
        switch (e.key) {
          case 'ArrowRight':
            setFocusSection('extra');
            setFocusCol(0);
            setFocusRow(0);
            ensureVisible('extra', 0, 0, 'default');
            break;
          case 'ArrowUp':
            setFocusSection('pig_home');
            ensureVisible('pig_home', 0, 0, 'default');
            break;
          case 'ArrowLeft':
            // Boundary: do nothing, only onBack() via explicit exit
            break;
          case 'Escape':
          case 'Backspace':
            onBack();
            break;
        }
      } else if (focusSection === 'back_button') {
        switch (e.key) {
          case 'ArrowDown':
            setFocusSection('pig_home');
            ensureVisible('pig_home', 0, 0, 'default');
            break;
          case 'ArrowRight':
            setFocusSection('extra');
            setFocusCol(0);
            setFocusRow(0);
            ensureVisible('extra', 0, 0, 'default');
            break;
          case 'Enter':
          case 'Escape':
          case 'Backspace':
            onBack();
            break;
        }
      } else {
        // focusSection === 'extra' (Grid cards)
        switch (e.key) {
          case 'ArrowLeft':
            if (focusCol > 0) {
              const nextCol = focusCol - 1;
              const nextRow = Math.min(focusRow, grid[nextCol].length - 1);
              setFocusCol(nextCol);
              setFocusRow(nextRow);
              ensureVisible('extra', nextCol, nextRow, 'default');
            } else {
              // Instead of exiting GNB, move focus left to the PIG Home Card!
              setFocusSection('pig_home');
              setFocusCol(0);
              setFocusRow(0);
              ensureVisible('pig_home', 0, 0, 'default');
            }
            break;
          case 'ArrowRight':
            if (focusCol < colLen - 1) {
              const nextCol = focusCol + 1;
              const nextRow = Math.min(focusRow, grid[nextCol].length - 1);
              setFocusCol(nextCol);
              setFocusRow(nextRow);
              ensureVisible('extra', nextCol, nextRow, 'default');
            }
            break;
          case 'ArrowUp':
            if (focusRow > 0) {
              const nextRow = focusRow - 1;
              setFocusRow(nextRow);
              ensureVisible('extra', focusCol, nextRow, 'default');
            } else {
              // Row is 0: move up to the back button
              setFocusSection('back_button');
              ensureVisible('back_button', 0, 0, 'default');
            }
            break;
          case 'ArrowDown':
            if (focusRow < grid[focusCol].length - 1) {
              const nextRow = focusRow + 1;
              setFocusRow(nextRow);
              ensureVisible('extra', focusCol, nextRow, 'default');
            }
            break;
          case 'Enter':
            const selectedCard = grid[focusCol][focusRow];
            if (selectedCard) {
              if (selectedCard.action === 'genWall') {
                setActiveOverlay('genWall');
                setOverlayFocusIndex(0);
              } else if (selectedCard.action === 'history') {
                setActiveOverlay('history');
                setOverlayFocusCol(0);
                setOverlayFocusRow(0);
              } else if (selectedCard.action === 'settings') {
                setActiveOverlay('settings');
                setOverlayFocusIndex(0);
              } else if (VAC_SCENARIOS[selectedCard.action]) {
                // Trigger AI Scenario & Expand
                setActiveScenario(VAC_SCENARIOS[selectedCard.action]);
                setState('expanded');
                setFocusSection('expanded_cards');
                setFocusCol(0);
                setFocusRow(0);
                setScrollX(SCROLL.OFFSET_EXPANDED);
              }
            }
            break;
          case 'Escape':
          case 'Backspace':
            onBack();
            break;
        }
      }
    } else {
      // --- Expanded Mode ---
      switch (e.key) {
        case 'ArrowLeft':
          if (focusSection === 'expanded_cards') {
            if (focusCol === 0) {
              setFocusSection('more_button');
            } else {
              const nextCol = focusCol - 1;
              setFocusCol(nextCol);
              ensureVisible('expanded_cards', nextCol, 0, 'expanded');
            }
          } else if (focusSection === 'extra') {
            if (focusCol === 0) {
              setFocusSection('expanded_cards');
              setFocusCol(gridExpanded.length - 1);
              ensureVisible('expanded_cards', gridExpanded.length - 1, 0, 'expanded');
            } else {
              const nextCol = focusCol - 1;
              setFocusCol(nextCol);
              ensureVisible('extra', nextCol, 0, 'expanded');
            }
          }
          break;
        case 'ArrowRight':
          if (focusSection === 'more_button' || focusSection === 'answer_hint') {
            setFocusSection('expanded_cards');
            setFocusCol(0);
            ensureVisible('expanded_cards', 0, 0, 'expanded');
          } else if (focusSection === 'expanded_cards') {
            if (focusCol < gridExpanded.length - 1) {
              const nextCol = focusCol + 1;
              setFocusCol(nextCol);
              ensureVisible('expanded_cards', nextCol, 0, 'expanded');
            } else {
              setFocusSection('extra');
              setFocusCol(0);
              ensureVisible('extra', 0, 0, 'expanded');
            }
          } else if (focusSection === 'extra') {
            if (focusCol < currentGridExtra.length - 1) {
              const nextCol = focusCol + 1;
              setFocusCol(nextCol);
              ensureVisible('extra', nextCol, 0, 'expanded');
            }
          }
          break;

        case 'ArrowUp':
          if (focusSection === 'answer_hint') {
            if (focusRow === 0) {
              setFocusSection('more_button');
            } else {
              setFocusRow(prev => prev - 1);
            }
          } else if (focusSection === 'extra') {
            if (focusRow > 0) {
              const nextRow = focusRow - 1;
              setFocusRow(nextRow);
              ensureVisible('extra', focusCol, nextRow, 'expanded');
            }
          }
          break;
        case 'ArrowDown':
          if (focusSection === 'more_button') {
            if (activeScenario && activeScenario.hints.length > 0) {
              setFocusSection('answer_hint');
              setFocusRow(0);
            }
          } else if (focusSection === 'answer_hint') {
            if (activeScenario && focusRow < activeScenario.hints.length - 1) {
              setFocusRow(prev => prev + 1);
            }
          } else if (focusSection === 'extra') {
            const grid = currentGridExtra;
            if (focusCol < grid.length && focusRow < grid[focusCol].length - 1) {
              const nextRow = focusRow + 1;
              setFocusRow(nextRow);
              ensureVisible('extra', focusCol, nextRow, 'expanded');
            }
          }
          break;

        case 'Enter':
          if (focusSection === 'expanded_cards') {
            // Click CTS card first item → Cast Panel
            if (activeScenario?.id === 'cts' && focusCol === 0) {
              setActiveOverlay('castPanel');
              setOverlayFocusIndex(0);
            }
          } else if (focusSection === 'more_button') {
            // Exit back to default
            setState('default');
            setActiveScenario(null);
            setFocusSection('extra');
            setFocusCol(0);
            setFocusRow(0);
            setScrollX(SCROLL.DEFAULT);
          } else if (focusSection === 'answer_hint') {
            // Trigger recommendation scenario
            if (focusRow === 0) {
              // Actor info
              setActiveOverlay('castPanel');
              setOverlayFocusIndex(0);
            } else {
              setActiveScenario(VAC_SCENARIOS.topic);
              setFocusSection('expanded_cards');
              setFocusCol(0);
              setFocusRow(0);
            }
          }
          break;
        case 'Escape':
        case 'Backspace':
          setState('default');
          setActiveScenario(null);
          setFocusSection('extra');
          setFocusCol(0);
          setFocusRow(0);
          setScrollX(SCROLL.DEFAULT);
          break;
      }
    }
  }, [state, focusSection, focusCol, focusRow, activeScenario, activeOverlay, overlayFocusIndex, overlayFocusCol, overlayFocusRow, gridExpanded, currentGridExtra, onBack, ensureVisible]);

  // Bind keydown events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={`h-full w-full relative overflow-hidden flex items-center justify-center selection:bg-transparent ${
      isWireframeMode ? 'bg-[#0b1528] wireframe-mode-grid' : 'bg-black'
    }`}>
      {/* 16:9 Screen ratio boundaries */}
      <div className={`relative w-[1920px] h-[1080px] flex flex-col justify-start overflow-hidden ${
        isWireframeMode ? 'border-x border-cyan-500/20' : 'bg-[#080808]'
      }`}>
        
        {/* Dynamic radial gradient light on original mode */}
        {!isWireframeMode && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(94,92,230,0.06)_0%,transparent_55%)] pointer-events-none" />
        )}

        {/* Back Button (GNB Return Indicator) */}
        <div 
          onClick={onBack}
          className="absolute top-10 left-14 z-40 flex items-center gap-3 cursor-pointer select-none"
        >
          <motion.div
            animate={{
              scale: focusSection === 'back_button' ? 1.15 : 1,
              borderColor: focusSection === 'back_button' 
                ? (isWireframeMode ? '#22d3ee' : '#ffffff') 
                : (isWireframeMode ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.1)')
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
              focusSection === 'back_button'
                ? (isWireframeMode ? 'bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/15')
                : (isWireframeMode ? 'bg-cyan-950/20 text-cyan-400' : 'bg-white/5 text-white')
            }`}
          >
            <ArrowLeft size={20} className={focusSection === 'back_button' ? 'text-white' : ''} />
          </motion.div>
          <span className={`text-[13px] font-black tracking-widest transition-colors ${
            focusSection === 'back_button'
              ? (isWireframeMode ? 'text-cyan-400' : 'text-white')
              : (isWireframeMode ? 'text-cyan-500/50' : 'text-white/40')
          }`}>
            {isWireframeMode ? '[ EXIT TO MAIN ]' : '돌아가기'}
          </span>
        </div>

        {/* Centered Greeting & TimeDisplay */}
        <AnimatePresence>
          {state === 'default' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute top-[56px] left-0 right-0 z-10 flex flex-col items-center justify-center text-center select-none"
            >
              {/* Time Display */}
              <div className={`text-[20px] font-medium tracking-widest mb-1.5 uppercase ${
                isWireframeMode ? 'text-cyan-500/50 font-mono' : 'text-white/60 font-sans'
              }`}>
                {todayDate} <span className="mx-3 opacity-30">|</span> {todayTime}
              </div>

              {/* Greeting Message */}
              <h2 className={`font-black tracking-tight leading-[1.1] uppercase ${
                isWireframeMode 
                  ? 'text-2xl text-cyan-400 font-mono' 
                  : 'text-[52px] bg-gradient-to-r from-[#acd8ff] via-[#ffffff] to-[#cf9eff] bg-clip-text text-transparent font-sans'
              }`}>
                {isWireframeMode 
                  ? `[ GREETING: ${greetingText.toUpperCase()} ]` 
                  : `${greetingText},`}
              </h2>
              <p className={`font-bold mt-1 tracking-tight ${
                isWireframeMode 
                  ? 'text-cyan-500/80 font-mono text-lg' 
                  : 'text-[36px] text-white/90 font-sans'
              }`}>
                {isWireframeMode ? '[ HOW CAN I ASSIST YOU TODAY? ]' : '오늘 어떤 것을 도와드릴까요?'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left PIG Placeholder Cards (Only visible in default state) */}
        <AnimatePresence>
          {state === 'default' && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: scrollX - SCROLL.DEFAULT }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              className="absolute left-[80px] top-[270px] z-10 flex flex-col gap-12"
            >
              {/* Card 1: PIG Home Card */}
              <div
                onClick={() => {
                  setFocusSection('pig_home');
                }}
                className={`relative w-[576px] h-[384px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                  focusSection === 'pig_home'
                    ? (isWireframeMode
                        ? 'border-transparent shadow-[0_0_25px_rgba(6,182,212,0.5)] bg-cyan-950/20'
                        : 'border-transparent shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_25px_rgba(255,255,255,0.15)]')
                    : (isWireframeMode ? 'border-cyan-500/20 bg-[#111c30]' : 'border-white/5')
                } ${!isWireframeMode && 'bg-gradient-to-br from-[#1c1a3a]/80 via-[#121026]/90 to-[#080715]/95 backdrop-blur-2xl'}`}
              >
                {isWireframeMode ? (
                  <div className="w-full h-full bg-[#111c30] flex flex-col items-center justify-center p-6 font-mono text-cyan-500/40 text-center select-none relative">
                    <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" strokeWidth="1">
                      <line x1="0" y1="0" x2="100%" y2="100%" />
                      <line x1="100%" y1="0" x2="0" y2="100%" />
                    </svg>
                    <div className="z-10 flex flex-col items-center justify-center">
                      <span className="text-[26px] font-light text-cyan-400 px-6 py-2 bg-[#0b1528] rounded-xl border border-cyan-500/30 tracking-[0.05em] font-mono">
                        [ Home ]
                      </span>
                    </div>
                    {focusSection === 'pig_home' && (
                      <div className="absolute -inset-[2px] rounded-[32px] border-[4px] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] pointer-events-none z-30" />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-6 select-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[52px] font-extralight text-white/95 tracking-[0.03em] font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">Home</span>
                    </div>

                    {/* Focus Border Overlay */}
                    {focusSection === 'pig_home' && (
                      <div className="absolute -inset-[2px] pointer-events-none z-30 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-[32px] border-[6px] border-white shadow-[0_0_30px_rgba(255,255,255,0.65)]" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card 2: PIG Description Card */}
              <div
                onClick={() => {
                  setFocusSection('pig_desc');
                }}
                className={`relative w-[576px] h-[144px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                  focusSection === 'pig_desc'
                    ? (isWireframeMode
                        ? 'border-transparent shadow-[0_0_25px_rgba(6,182,212,0.5)] bg-cyan-950/20'
                        : 'border-transparent shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_25px_rgba(255,255,255,0.15)]')
                    : (isWireframeMode ? 'border-cyan-500/20 bg-[#111c30]' : 'border-white/5')
                } ${!isWireframeMode && 'bg-gradient-to-br from-[#1c1a3a]/80 via-[#121026]/90 to-[#080715]/95 backdrop-blur-2xl'}`}
              >
                {isWireframeMode ? (
                  <div className="w-full h-full bg-[#111c30] flex flex-col items-center justify-center p-5 font-mono text-cyan-500/40 text-center select-none relative">
                    <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" strokeWidth="1">
                      <line x1="0" y1="0" x2="100%" y2="100%" />
                      <line x1="100%" y1="0" x2="0" y2="100%" />
                    </svg>
                    <div className="z-10 px-4">
                      <p className="text-[13px] text-cyan-400/70 leading-relaxed font-semibold">
                        [ 시청 중인 영상이나 외부 입력의 화면 관련 분석 정보가 이곳에 표시됩니다 ]
                      </p>
                    </div>
                    {focusSection === 'pig_desc' && (
                      <div className="absolute -inset-[2px] rounded-[32px] border-[4px] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] pointer-events-none z-30" />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-6 select-none text-center">
                    <p className="text-[14.5px] leading-relaxed text-white/70 font-medium tracking-tight px-3">
                      시청 중인 영상이나 외부 입력의 화면 관련 분석 정보가 이곳에 표시됩니다.
                    </p>

                    {/* Focus Border Overlay */}
                    {focusSection === 'pig_desc' && (
                      <div className="absolute -inset-[2px] pointer-events-none z-30 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-[32px] border-[6px] border-white shadow-[0_0_30px_rgba(255,255,255,0.65)]" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Extended mode AI Answer Card */}
        <AnimatePresence>
          {state === 'expanded' && activeScenario && (
            <VACAnswerCard
              scenario={activeScenario}
              focusSection={focusSection}
              focusRow={focusRow}
              isWireframeMode={isWireframeMode}
              onHintClick={(idx) => {
                // Trigger scenario from hint
                if (idx === 0) {
                  setActiveOverlay('castPanel');
                  setOverlayFocusIndex(0);
                } else {
                  setActiveScenario(VAC_SCENARIOS.topic);
                  setFocusSection('expanded_cards');
                  setFocusCol(0);
                  setFocusRow(0);
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* 2. Slidable Grid Card Area */}
        <VACGrid
          gridData={state === 'expanded' ? [...gridExpanded, ...currentGridExtra] : currentGridExtra}
          focusSection={focusSection === 'expanded_cards' || focusSection === 'extra' ? 'extra' : focusSection}
          focusCol={state === 'expanded' && focusSection === 'extra' ? gridExpanded.length + focusCol : focusCol}
          focusRow={focusRow}
          scrollX={scrollX}
          isWireframeMode={isWireframeMode}
          onCardHover={(col, row) => {
            // Hover logic (mouse input)
            if (state === 'expanded') {
              if (col < gridExpanded.length) {
                setFocusSection('expanded_cards');
                setFocusCol(col);
              } else {
                setFocusSection('extra');
                setFocusCol(col - gridExpanded.length);
              }
            } else {
              setFocusSection('extra');
              setFocusCol(col);
            }
            setFocusRow(row);
          }}
          onCardClick={(col, row) => {
            const grid = state === 'expanded' ? [...gridExpanded, ...currentGridExtra] : currentGridExtra;
            const item = grid[col]?.[row];
            if (item) {
              if (item.action === 'genWall') {
                setActiveOverlay('genWall');
                setOverlayFocusIndex(0);
              } else if (item.action === 'history') {
                setActiveOverlay('history');
                setOverlayFocusCol(0);
                setOverlayFocusRow(0);
              } else if (item.action === 'settings') {
                setActiveOverlay('settings');
                setOverlayFocusIndex(0);
              } else if (item.action === 'expanded_item') {
                if (activeScenario?.id === 'cts' && col === 0) {
                  setActiveOverlay('castPanel');
                  setOverlayFocusIndex(0);
                }
              } else if (VAC_SCENARIOS[item.action]) {
                setActiveScenario(VAC_SCENARIOS[item.action]);
                setState('expanded');
                setFocusSection('expanded_cards');
                setFocusCol(0);
                setFocusRow(0);
                setScrollX(SCROLL.OFFSET_EXPANDED);
              }
            }
          }}
        />

        {/* 3. Bottom Voice Assistant Nudge */}
        <VACNudge isWireframeMode={isWireframeMode} />

        {/* 4. Overlay Modals */}
        <VACOverlays
          action={activeOverlay}
          focusIndex={overlayFocusIndex}
          focusCol={overlayFocusCol}
          focusRow={overlayFocusRow}
          isWireframeMode={isWireframeMode}
          onClose={() => setActiveOverlay(null)}
        />

      </div>
    </div>
  );
};

export default VisionPage;
