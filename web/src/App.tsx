import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { ContentCard } from './components/ContentCard';
import { SettingsItem } from './components/SettingsItem';
import { AccountPopup } from './components/AccountPopup';
import { SettingsPopup } from './components/SettingsPopup';
import { ConnectedDevicesPopup } from './components/ConnectedDevicesPopup';
import AppEditPopup from './components/AppEditPopup';
import SimulatorHandle from './components/SimulatorHandle';
import VirtualRemote from './components/VirtualRemote';
import ViewportScaler from './components/ViewportScaler';
import SearchPage from './pages/SearchPage';
import VisionPage from './pages/VisionPage';
import PrivacyPage from './pages/PrivacyPage';
import HeroDetailPage from './pages/HeroDetailPage';
import ContentDetailPage from './pages/ContentDetailPage';
import AppDetailPage from './pages/AppDetailPage';
import { launchApp } from './native';
import {
  RECOMMENDATIONS,
  APPS,
  COMEDY_MOVIES,
  ROMANCE_MOVIES,
  DOC_MOVIES,
  ACTION_MOVIES,
  THRILLER_MOVIES,
  DRAMA_MOVIES,
  SETTINGS_OPTIONS,
  PROFILES,
  DEVICES,
  QUICK_SETTINGS,
  GNB_MAP,
  GNB_LABELS,
  HERO_BANNERS,
  SECTIONS
} from './constants';
import {
  VisionAIIcon,
  HomeIcon,
  LiveIcon,
  GameIcon,
  ArtIcon,
  AppsIcon,
  PrivacyIcon
} from './components/Icons';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Search,
  Monitor,
  Settings,
  Sparkles,
  Home,
  Tv,
  Gamepad2,
  Palette,
  LayoutGrid,
  ShieldCheck,
  Heart,
  Star,
  Play,
  Plus,
  Shield,
  Volume2,
  ChevronUp,
  ChevronDown,
  Cable,
  Bluetooth,
  Smartphone,
  Power,
  Bell,
  Pencil,
  Wifi,
  Sun,
  Languages,
  Speaker,
  Image,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

// --- Wireframe Component Primitives ---




const NavIcon = ({
  icon: Icon,
  focused,
  label,
  isPillItem = false
}: {
  icon: any,
  focused: boolean,
  label?: string,
  isPillItem?: boolean,
  key?: string | number
}) => {
  return (
    <div className={`flex flex-col items-center justify-center relative w-[80px] h-[76px] self-center ${focused ? 'z-[120]' : 'z-10'}`}>
      <div
        className={`w-[60px] h-[60px] rounded-full transition-all duration-300 flex items-center justify-center ${focused
            ? 'bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.6)]'
            : isPillItem ? 'text-white/80' : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
      >
        <Icon
          size={44}
          className={`transition-all duration-300 ${focused ? 'brightness-0' : ''}`}
        />
      </div>
      <div className="absolute top-[64px] h-10 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {focused && label && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-lg font-bold tracking-tight text-white whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
// --- Main Application ---

type Section = 'gnb' | 'hero' | 'row' | 'apps' | 'comedy' | 'romance' | 'doc' | 'action' | 'thriller' | 'drama' | 'settings' | 'scrollTop' | 'tabContent';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'search' | 'vision' | 'privacy' | 'heroDetail' | 'contentDetail' | 'appDetail'>('home');
  const [activeTab, setActiveTab] = useState(5); // Default to '추천' (Home)
  const [section, setSection] = useState<Section>('row');
  const [idx, setIdx] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);
  const [popupIdx, setPopupIdx] = useState(-1);
  const [rowIdx, setRowIdx] = useState(0);
  const [rowScrollIdx, setRowScrollIdx] = useState(0);
  const [comedyIdx, setComedyIdx] = useState(0);
  const [comedyScrollIdx, setComedyScrollIdx] = useState(0);
  const [romanceIdx, setRomanceIdx] = useState(0);
  const [romanceScrollIdx, setRomanceScrollIdx] = useState(0);
  const [docIdx, setDocIdx] = useState(0);
  const [docScrollIdx, setDocScrollIdx] = useState(0);
  const [actionIdx, setActionIdx] = useState(0);
  const [actionScrollIdx, setActionScrollIdx] = useState(0);
  const [thrillerIdx, setThrillerIdx] = useState(0);
  const [thrillerScrollIdx, setThrillerScrollIdx] = useState(0);
  const [dramaIdx, setDramaIdx] = useState(0);
  const [dramaScrollIdx, setDramaScrollIdx] = useState(0);
  const [settingsIdx, setSettingsIdx] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isPowerOff, setIsPowerOff] = useState(false);
  const [initialFocusTarget, setInitialFocusTarget] = useState(1); // Default: Now Playing (1)
  const [interactionMode, setInteractionMode] = useState(1); // 0: D-pad, 1: Hybrid
  const [gnbOrder, setGnbOrder] = useState(['ACCOUNT', 'SEARCH', 'DEVICES', 'SETTINGS', 'VISION', 'PRIVACY']);
  const [isDimmingEnabled, setIsDimmingEnabled] = useState(false);
  const [cardFocusStyle, setCardFocusStyle] = useState(0); // 0: Standard, 1: Minimal
  const [focusSource, setFocusSource] = useState<'key' | 'mouse'>('key');
  const [isAppEditPopupVisible, setIsAppEditPopupVisible] = useState(false);
  const [appEditIdx, setAppEditIdx] = useState(0);
  const [isCursorVisible, setIsCursorVisible] = useState(false); // Smart Pointer state
  const [showVirtualDPad, setShowVirtualDPad] = useState(() => {
    return localStorage.getItem('tvhome-virtual-dpad') === 'true';
  });
  const [isWireframeMode, setIsWireframeMode] = useState(() => {
    return localStorage.getItem('tvhome-wireframe-mode') === 'true';
  });
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Dynamic popup offset calculation to prevent off-screen positioning (Both sides)
  const getPopupLeft = (index: number, id: string) => {
    const widths: Record<string, number> = { 'ACCOUNT': 340, 'SETTINGS': 390, 'DEVICES': 330 };
    const w = widths[id] || 340;

    // Estimate absolute X position based on GNB section
    let iconX = 0;
    if (index < 4) iconX = 64 + index * 60;
    else if (index === 4) iconX = 960; // Center Vision AI
    else if (index < 10) iconX = 960 + 100 + (index - 5) * 62; // Center Group
    else iconX = 1920 - 120; // Far right Search

    const preferredLeft = 28 - (w / 2);

    // Dual Clamp: stay within [10, 1910] in absolute screen space
    let clamped = Math.max(preferredLeft, 10 - iconX); // Left bound
    clamped = Math.min(clamped, (1910 - iconX) - w); // Right bound

    return clamped + 'px';
  };

  // Apply Initial Focus Logic
  const applyInitialFocus = useCallback((target: number) => {
    setFocusSource('key'); // Initial focus is always treated as key for centering
    // Reset to Home and close all popups first
    setCurrentPage('home');
    setPopupIdx(-1);

    // Reset all content indices to default (0)
    setHeroIdx(0);
    setRowIdx(0);
    setRowScrollIdx(0);
    setComedyIdx(0);
    setComedyScrollIdx(0);
    setRomanceIdx(0);
    setRomanceScrollIdx(0);
    setDocIdx(0);
    setDocScrollIdx(0);
    setActionIdx(0);
    setActionScrollIdx(0);
    setThrillerIdx(0);
    setThrillerScrollIdx(0);
    setDramaIdx(0);
    setDramaScrollIdx(0);
    setSettingsIdx(0);

    switch (target) {
      case 0: // GNB 홈
        setSection('gnb');
        setIdx(5);
        setActiveTab(5);
        break;
      case 1: // 지금 재생중
        setSection('row');
        setIdx(0);
        setRowIdx(0);
        break;
      case 2: // 히어로
        setSection('hero');
        setIdx(0);
        break;
      case 3: // 넷플릭스 (앱 로우)
        setSection('apps');
        setIdx(0);
        break;
    }
  }, []);

  // Reboot Simulation
  const restartSimulator = useCallback(() => {
    setShowDashboard(false);
    setIsPowerOff(true);

    setTimeout(() => {
      setIsPowerOff(false);
      applyInitialFocus(initialFocusTarget);
    }, 1200);
  }, [initialFocusTarget, applyInitialFocus]);

  // TV Power Toggle Logic
  const togglePower = useCallback(() => {
    if (isPowerOff) {
      setShowDashboard(false); // Hide dashboard when turning on
      setIsPowerOff(false);
      applyInitialFocus(initialFocusTarget);
    } else {
      setIsPowerOff(true);
    }
  }, [isPowerOff, initialFocusTarget, applyInitialFocus]);

  // Auto-scroll logic triggered on section change or returning to home
  useLayoutEffect(() => {
    if (!scrollRef.current || focusSource === 'mouse' || currentPage !== 'home') return;

    const scrollableSections: Section[] = ['apps', 'comedy', 'romance', 'doc', 'action', 'thriller', 'drama', 'settings', 'scrollTop'];

    if (scrollableSections.includes(section)) {
      // Small delay to ensure the overflow-y-auto is applied before scrolling
      const timer = setTimeout(() => {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100); // Increased delay for safety during re-mount
      return () => clearTimeout(timer);
    } else {
      // For GNB, HERO, ROW, we lock the scroll at the very top smoothly
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [section, focusSource, currentPage]);

  // Block native scroll in D-Pad mode
  useEffect(() => {
    const preventDefault = (e: Event) => {
      if (interactionMode !== 1) {
        // Check if the event target is inside the dashboard
        const target = e.target as HTMLElement;
        if (target?.closest('.dashboard-container')) return;

        if (e.cancelable) e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
    };
  }, [interactionMode]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setFocusSource('key');
    setIsCursorVisible(false); // Hide cursor on keyboard interaction

    const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'];
    if (handledKeys.includes(e.key)) {
      e.preventDefault();
    }
    if (isAppEditPopupVisible) {
      if (e.key === 'ArrowUp') {
        if (appEditIdx > 0) setAppEditIdx(prev => prev - 1);
      } else if (e.key === 'ArrowDown') {
        if (appEditIdx < 2) setAppEditIdx(prev => prev + 1);
      } else if (e.key === 'Enter') {
        setIsAppEditPopupVisible(false);
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        setIsAppEditPopupVisible(false);
      }
      return; // Block all other keys when popup is visible
    }

    // Global Dashboard Toggle
    if (e.key.toLowerCase() === 'o') {
      setShowDashboard(prev => !prev);
      return;
    }

    if (isPowerOff) return;

    if (currentPage !== 'home') return;

    switch (e.key) {
      case 'ArrowUp':
        if (section === 'gnb') {
          const currentId = idx <= 3 ? gnbOrder[idx] : (idx === 4 ? gnbOrder[4] : (idx === 10 ? gnbOrder[5] : 'TAB'));
          if (currentId === 'ACCOUNT' && popupIdx !== -1) {
            if (popupIdx > 0) setPopupIdx(prev => prev - 1);
            else if (popupIdx === 0) setPopupIdx(-1);
          } else if (currentId === 'DEVICES' && popupIdx !== -1) {
            if (popupIdx === 0 || popupIdx === 1) setPopupIdx(-1);
            else if (popupIdx >= 2) setPopupIdx(prev => prev - 2);
          } else if (currentId === 'SETTINGS' && popupIdx !== -1) {
            if (popupIdx === 0 || popupIdx === 1) setPopupIdx(-1);
            else if (popupIdx === 2) setPopupIdx(0);
            else if (popupIdx === 3) setPopupIdx(1);
            else if (popupIdx >= 4 && popupIdx <= 6) setPopupIdx(prev => (prev === 4 ? 2 : (prev === 5 ? 2 : 3)));
            else if (popupIdx >= 7) setPopupIdx(prev => prev - 3);
          }
          return;
        }
        if (section === 'tabContent') {
          setSection('gnb');
          return;
        }
        if (section === 'row') setSection('hero');
        else if (section === 'apps') setSection('row');
        else if (section === 'comedy') setSection('apps');
        else if (section === 'romance') setSection('comedy');
        else if (section === 'doc') setSection('romance');
        else if (section === 'action') setSection('doc');
        else if (section === 'thriller') setSection('action');
        else if (section === 'drama') setSection('thriller');
        else if (section === 'settings') setSection('drama');
        else if (section === 'scrollTop') setSection('settings');
        else if (section === 'hero') {
          setSection('gnb');
          setIdx(5); // 무조건 '추천' 메뉴로 이동
          setActiveTab(5);
          return;
        }
        setIdx(0);
        break;
      case 'ArrowDown':
        if (section === 'gnb') {
          // Get ID of current GNB slot
          const currentId = idx <= 3 ? gnbOrder[idx] : (idx === 4 ? gnbOrder[4] : (idx === 10 ? gnbOrder[5] : 'TAB'));

          // 1. POPUP NAVIGATION (Highest Priority)
          // If a popup is already active, navigate inside it
          if (popupIdx !== -1) {
            if (currentId === 'ACCOUNT') {
              if (popupIdx < PROFILES.length) setPopupIdx(prev => prev + 1);
            } else if (currentId === 'DEVICES') {
              if (popupIdx < 4) setPopupIdx(prev => prev + 2);
            } else if (currentId === 'SETTINGS') {
              if (popupIdx === 0) setPopupIdx(2);
              else if (popupIdx === 1) setPopupIdx(3);
              else if (popupIdx === 2) setPopupIdx(4);
              else if (popupIdx === 3) setPopupIdx(6);
              else if (popupIdx >= 4 && popupIdx <= 6) setPopupIdx(prev => prev + 3);
            }
            return;
          }

          // If not active yet, but it's a popup-type icon, ENTER popup
          if (['ACCOUNT', 'DEVICES', 'SETTINGS'].includes(currentId)) {
            setPopupIdx(0);
            return;
          }

          // 2. PAGE-MOVE ICONS (SEARCH, VISION, PRIVACY) - Location Based
          if (['SEARCH', 'VISION', 'PRIVACY'].includes(currentId)) {
            // Pos 1-5 (idx 0-4) move to Hero
            if (idx <= 4) {
              setSection('hero');
              setIdx(0);
              return;
            }
            // Pos 6 (idx 10) blocks downward movement
            if (idx === 10) {
              return;
            }
          }

          // 3. CENTER TABS (Fixed Tabs 6-9) move to tabContent
          if (idx >= 6 && idx <= 9) {
            setSection('tabContent');
            return;
          }

          // Recommended (idx 5) moves to hero
          if (idx === 5) {
            setSection('hero');
            setIdx(0);
            return;
          }

          // Default fallback
          setSection('hero');
          setIdx(0);
          return;
        }
        else if (section === 'hero') setSection('row');
        else if (section === 'row') setSection('apps');
        else if (section === 'apps') setSection('comedy');
        else if (section === 'comedy') setSection('romance');
        else if (section === 'romance') setSection('doc');
        else if (section === 'doc') setSection('action');
        else if (section === 'action') setSection('thriller');
        else if (section === 'thriller') setSection('drama');
        else if (section === 'drama') setSection('settings');
        else if (section === 'settings') setSection('scrollTop');
        else return; // Lock at scrollTop section
        setIdx(0);
        break;
      case 'Enter':
        if (section === 'hero' && idx === 0) {
          setCurrentPage('heroDetail');
          return;
        }
        if (section === 'gnb') {
          const currentId = idx <= 3 ? gnbOrder[idx] : (idx === 4 ? gnbOrder[4] : (idx === 10 ? gnbOrder[5] : 'TAB'));
          if (currentId === 'SEARCH') {
            setCurrentPage('search');
            return;
          }
          if (currentId === 'VISION') {
            setCurrentPage('vision');
            return;
          }
          if (currentId === 'PRIVACY') {
            setCurrentPage('privacy');
            return;
          }
        }
        if (['row', 'comedy', 'romance', 'doc', 'action', 'thriller', 'drama'].includes(section)) {
          setCurrentPage('contentDetail');
          return;
        }
        if (section === 'apps') {
          if (idx === APPS.length - 1) {
            setIsAppEditPopupVisible(true);
            setAppEditIdx(0);
          } else if (!launchApp(APPS[idx].name)) {
            setCurrentPage('appDetail');   // no such TV app (or running in a browser): show the prototype page
          }
          return;
        }
        if (section === 'scrollTop') {
          setSection('gnb');
          setIdx(5); // Index of '추천' in GNB_LABELS
          setActiveTab(5);
        }
        break;
      case 'Escape':
      case 'Backspace':
        if (isAppEditPopupVisible) {
          setIsAppEditPopupVisible(false);
          return;
        }
        if (popupIdx !== -1) {
          setPopupIdx(-1);
          return;
        }
        if (section === 'tabContent') {
          setSection('gnb');
          return;
        }
        break;
      case 'ArrowLeft':
        if (section === 'hero' && idx === 0) {
          setHeroIdx(prev => (prev > 0 ? prev - 1 : HERO_BANNERS.length - 1));
          return;
        }

        if (section === 'tabContent') return;

        // 팝업 내부 포커스 잠금 (ArrowLeft)
        if (section === 'gnb' && popupIdx !== -1) {
          const currentId = idx <= 3 ? gnbOrder[idx] : (idx === 4 ? gnbOrder[4] : (idx === 10 ? gnbOrder[5] : 'TAB'));
          if (currentId === 'DEVICES') {
            if (popupIdx === 1 || popupIdx === 3 || popupIdx === 5) setPopupIdx(prev => prev - 1);
          } else if (currentId === 'SETTINGS') {
            if (popupIdx === 1) setPopupIdx(0);
            else if (popupIdx === 3) setPopupIdx(2);
            else if (popupIdx === 5 || popupIdx === 6 || popupIdx === 8 || popupIdx === 9) setPopupIdx(prev => prev - 1);
          }
          return; // 팝업 안에서는 GNB 아이콘 이동 차단
        }

        if (section === 'row') {
          if (rowIdx > 0) {
            const nextIdx = rowIdx - 1;
            setRowIdx(nextIdx);
            setRowScrollIdx(nextIdx);
          }
        } else if (section === 'comedy') {
          if (comedyIdx > 0) {
            const nextIdx = comedyIdx - 1;
            setComedyIdx(nextIdx);
            setComedyScrollIdx(nextIdx);
          }
        } else if (section === 'romance') {
          if (romanceIdx > 0) {
            const nextIdx = romanceIdx - 1;
            setRomanceIdx(nextIdx);
            setRomanceScrollIdx(nextIdx);
          }
        } else if (section === 'doc') {
          if (docIdx > 0) {
            const nextIdx = docIdx - 1;
            setDocIdx(nextIdx);
            setDocScrollIdx(nextIdx);
          }
        } else if (section === 'action') {
          if (actionIdx > 0) {
            const nextIdx = actionIdx - 1;
            setActionIdx(nextIdx);
            setActionScrollIdx(nextIdx);
          }
        } else if (section === 'thriller') {
          if (thrillerIdx > 0) {
            const nextIdx = thrillerIdx - 1;
            setThrillerIdx(nextIdx);
            setThrillerScrollIdx(nextIdx);
          }
        } else if (section === 'drama') {
          if (dramaIdx > 0) {
            const nextIdx = dramaIdx - 1;
            setDramaIdx(nextIdx);
            setDramaScrollIdx(nextIdx);
          }
        } else if (section === 'settings') {
          if (settingsIdx > 0) setSettingsIdx(prev => prev - 1);
        } else if (section === 'apps') {
          if (idx > 0) setIdx(idx - 1);
        } else {
          if (idx > 0) {
            const nextIdx = idx - 1;
            setIdx(nextIdx);
            setPopupIdx(-1);
            if (section === 'gnb' && nextIdx >= 5 && nextIdx <= 9) {
              setActiveTab(nextIdx);
            }
          }
        }
        break;
      case 'ArrowRight':
        if (section === 'hero' && idx === 0) {
          setHeroIdx(prev => (prev < HERO_BANNERS.length - 1 ? prev + 1 : 0));
          return;
        }

        if (section === 'tabContent') return;

        // 팝업 내부 포커스 잠금 (ArrowRight)
        if (section === 'gnb' && popupIdx !== -1) {
          const currentId = idx <= 3 ? gnbOrder[idx] : (idx === 4 ? gnbOrder[4] : (idx === 10 ? gnbOrder[5] : 'TAB'));
          if (currentId === 'DEVICES') {
            if (popupIdx === 0 || popupIdx === 2 || popupIdx === 4) setPopupIdx(prev => prev + 1);
          } else if (currentId === 'SETTINGS') {
            if (popupIdx === 0) setPopupIdx(1);
            else if (popupIdx === 2) setPopupIdx(3);
            else if (popupIdx === 4 || popupIdx === 5 || popupIdx === 7 || popupIdx === 8) setPopupIdx(prev => prev + 1);
          }
          return; // 팝업 안에서는 GNB 아이콘 이동 차단
        }

        if (section === 'gnb') {
          const nextIdx = idx + 1;
          if (nextIdx <= 10) {
            setIdx(nextIdx);
            setPopupIdx(-1);
            if (nextIdx >= 5 && nextIdx <= 9) {
              setActiveTab(nextIdx);
            }
          }
          return;
        }
        if (section === 'apps') {
          if (idx < APPS.length - 1) setIdx(idx + 1);
          return;
        }
        if (section === 'row') {
          if (rowIdx < RECOMMENDATIONS.length - 1) {
            const nextIdx = rowIdx + 1;
            setRowIdx(nextIdx);
            setRowScrollIdx(nextIdx);
          }
        } else if (section === 'comedy') {
          if (comedyIdx < COMEDY_MOVIES.length - 1) {
            const nextIdx = comedyIdx + 1;
            setComedyIdx(nextIdx);
            setComedyScrollIdx(nextIdx);
          }
        } else if (section === 'romance') {
          if (romanceIdx < ROMANCE_MOVIES.length - 1) {
            const nextIdx = romanceIdx + 1;
            setRomanceIdx(nextIdx);
            setRomanceScrollIdx(nextIdx);
          }
        } else if (section === 'doc') {
          if (docIdx < DOC_MOVIES.length - 1) {
            const nextIdx = docIdx + 1;
            setDocIdx(nextIdx);
            setDocScrollIdx(nextIdx);
          }
        } else if (section === 'action') {
          if (actionIdx < ACTION_MOVIES.length - 1) {
            const nextIdx = actionIdx + 1;
            setActionIdx(nextIdx);
            setActionScrollIdx(nextIdx);
          }
        } else if (section === 'thriller') {
          if (thrillerIdx < THRILLER_MOVIES.length - 1) {
            const nextIdx = thrillerIdx + 1;
            setThrillerIdx(nextIdx);
            setThrillerScrollIdx(nextIdx);
          }
        } else if (section === 'drama') {
          if (dramaIdx < DRAMA_MOVIES.length - 1) {
            const nextIdx = dramaIdx + 1;
            setDramaIdx(nextIdx);
            setDramaScrollIdx(nextIdx);
          }
        } else if (section === 'settings') {
          if (settingsIdx < SETTINGS_OPTIONS.length - 1) setSettingsIdx(prev => prev + 1);
        } else {
          const limits: Record<Section, number> = {
            gnb: 10,
            hero: 0,
            row: RECOMMENDATIONS.length - 1,
            apps: APPS.length - 1,
            comedy: COMEDY_MOVIES.length - 1,
            romance: ROMANCE_MOVIES.length - 1,
            doc: DOC_MOVIES.length - 1,
            action: ACTION_MOVIES.length - 1,
            thriller: THRILLER_MOVIES.length - 1,
            drama: DRAMA_MOVIES.length - 1,
            settings: SETTINGS_OPTIONS.length - 1,
            scrollTop: 0,
            tabContent: 0
          };
          if (idx < (limits[section] || 0)) setIdx(prev => prev + 1);
        }
        break;
    }
  }, [section, idx, popupIdx, rowIdx, comedyIdx, romanceIdx, docIdx, actionIdx, thrillerIdx, dramaIdx, settingsIdx, currentPage, heroIdx, gnbOrder, isAppEditPopupVisible, appEditIdx, isPowerOff]);

  const lastWheelTime = useRef<number>(0);


  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (interactionMode !== 1) return;

    const now = Date.now();
    if (now - lastWheelTime.current < 200) return; // Throttle wheel events
    lastWheelTime.current = now;

    // 1. Horizontal Row Scrolling (if hovering over a scrollable row)
    const isOverRow = ['row', 'comedy', 'romance', 'doc', 'action', 'thriller', 'drama'].includes(section);
    if (isOverRow && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      const delta = e.deltaX > 0 ? 1 : -1;
      if (section === 'row') {
        const nextIdx = Math.max(0, Math.min(RECOMMENDATIONS.length - 1, rowIdx + delta));
        setRowIdx(nextIdx);
        setRowScrollIdx(nextIdx);
      } else if (section === 'comedy') {
        const nextIdx = Math.max(0, Math.min(COMEDY_MOVIES.length - 1, comedyIdx + delta));
        setComedyIdx(nextIdx);
        setComedyScrollIdx(nextIdx);
      } else if (section === 'romance') {
        const nextIdx = Math.max(0, Math.min(ROMANCE_MOVIES.length - 1, romanceIdx + delta));
        setRomanceIdx(nextIdx);
        setRomanceScrollIdx(nextIdx);
      } else if (section === 'doc') {
        const nextIdx = Math.max(0, Math.min(DOC_MOVIES.length - 1, docIdx + delta));
        setDocIdx(nextIdx);
        setDocScrollIdx(nextIdx);
      } else if (section === 'action') {
        const nextIdx = Math.max(0, Math.min(ACTION_MOVIES.length - 1, actionIdx + delta));
        setActionIdx(nextIdx);
        setActionScrollIdx(nextIdx);
      } else if (section === 'thriller') {
        const nextIdx = Math.max(0, Math.min(THRILLER_MOVIES.length - 1, thrillerIdx + delta));
        setThrillerIdx(nextIdx);
        setThrillerScrollIdx(nextIdx);
      } else if (section === 'drama') {
        const nextIdx = Math.max(0, Math.min(DRAMA_MOVIES.length - 1, dramaIdx + delta));
        setDramaIdx(nextIdx);
        setDramaScrollIdx(nextIdx);
      }
      return;
    }

    // 2. Vertical Section Navigation
    if (Math.abs(e.deltaY) > 10) {
      const currentSectionIdx = SECTIONS.indexOf(section as any);
      if (e.deltaY > 0 && currentSectionIdx < SECTIONS.length - 1) {
        // Scroll Down
        const nextSection = SECTIONS[currentSectionIdx + 1] as Section;
        setSection(nextSection);
        setIdx(0);
        setPopupIdx(-1);
        setIsAppEditPopupVisible(false);
        if (['row', 'apps', 'comedy', 'romance', 'doc', 'action', 'thriller', 'drama'].includes(nextSection)) {
          setIdx(0);
        }
      } else if (e.deltaY < 0 && currentSectionIdx > 0) {
        // Scroll Up
        const prevSection = SECTIONS[currentSectionIdx - 1] as Section;
        setSection(prevSection);
        setIdx(0);
        setPopupIdx(-1);
        setIsAppEditPopupVisible(false);
      }
    }
  }, [interactionMode, section, rowIdx, comedyIdx, romanceIdx, docIdx, actionIdx, thrillerIdx, dramaIdx]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);



  const handleBack = useCallback((targetIdx?: number) => {
    setCurrentPage('home');
    setSection('gnb');
    if (targetIdx !== undefined) setIdx(targetIdx);
    // Maintain the icon focus
    setPopupIdx(-1);
  }, []);

  const getGnbIndexById = (id: string) => {
    const internalIdx = gnbOrder.indexOf(id);
    if (internalIdx === -1) return 0;
    if (internalIdx <= 4) return internalIdx;
    if (internalIdx === 5) return 10;
    return 0;
  };

  return (
    <motion.div
      className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center"
      onMouseMove={() => {
        if (!isCursorVisible) setIsCursorVisible(true);
      }}
      onWheel={interactionMode === 1 ? handleWheel : undefined}
      onPanEnd={(_, info) => {
        if (interactionMode !== 1) return;
        const now = Date.now();
        if (now - lastWheelTime.current < 600) return;


        const currentSectionIdx = SECTIONS.indexOf(section as any);

        if (info.offset.y < -50 && currentSectionIdx < SECTIONS.length - 1) {
          // Swipe Up -> Move Down
          setSection(SECTIONS[currentSectionIdx + 1] as Section);
          setPopupIdx(-1);
          setIsAppEditPopupVisible(false);
          lastWheelTime.current = now;
        } else if (info.offset.y > 50 && currentSectionIdx > 0) {
          // Swipe Down -> Move Up
          setSection(SECTIONS[currentSectionIdx - 1] as Section);
          setPopupIdx(-1);
          setIsAppEditPopupVisible(false);
          lastWheelTime.current = now;
        }
      }}
      style={{ cursor: isCursorVisible ? 'default' : 'none' }}
    >

      <ViewportScaler>
        {currentPage === 'search' && <SearchPage onBack={() => handleBack(getGnbIndexById('SEARCH'))} isWireframeMode={isWireframeMode} />}
        {currentPage === 'vision' && <VisionPage onBack={() => handleBack(getGnbIndexById('VISION'))} isWireframeMode={isWireframeMode} />}
        {currentPage === 'privacy' && <PrivacyPage onBack={() => handleBack(getGnbIndexById('PRIVACY'))} isWireframeMode={isWireframeMode} />}
        {currentPage === 'heroDetail' && (
          <HeroDetailPage
            banner={HERO_BANNERS[heroIdx]}
            isWireframeMode={isWireframeMode}
            onBack={() => {
              setCurrentPage('home');
              setSection('hero');
              setIdx(0);
            }}
          />
        )}
        {currentPage === 'contentDetail' && (
          <ContentDetailPage
            isWireframeMode={isWireframeMode}
            onBack={() => {
              if ([4, 6, 7, 8, 9].includes(activeTab)) {
                handleBack(activeTab);
              } else {
                setCurrentPage('home');
              }
            }}
          />
        )}
        {currentPage === 'appDetail' && (
          <AppDetailPage
            app={APPS[idx]}
            isWireframeMode={isWireframeMode}
            onBack={() => {
              if ([4, 6, 7, 8, 9].includes(activeTab)) {
                handleBack(activeTab);
              } else {
                setCurrentPage('home');
              }
            }}
          />
        )}

        {currentPage === 'home' && (
          <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden font-sans relative">

            {/* SVG Gradient Definitions for Navigation Icons */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="vision-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4deea5" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="recommended-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>
                <linearGradient id="live-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
                <linearGradient id="game-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ddd6fe" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#5b21b6" />
                </linearGradient>
                <linearGradient id="art-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#a16207" />
                </linearGradient>
                <linearGradient id="apps-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c7d2fe" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3730a3" />
                </linearGradient>
              </defs>
            </svg>

            {/* 16:9 FIXED RATIO CONTAINER */}
            <div className={`relative w-full h-full text-white flex flex-col overflow-hidden transition-colors duration-300 ${
              isWireframeMode ? 'bg-[#0b1528] wireframe-mode-grid' : 'bg-[#080808]'
            }`}>

              {/* 2. MAIN SCROLLABLE AREA */}
              <div
                ref={scrollRef}
                className={`flex-1 ${['apps', 'comedy', 'romance', 'doc', 'action', 'thriller', 'drama', 'settings', 'scrollTop'].includes(section) ? 'overflow-y-auto pb-10' : 'overflow-hidden'} overflow-x-hidden no-scrollbar relative`}
              >
                <AnimatePresence>
                  {isDimmingEnabled && section === 'gnb' && (
                    (idx <= 3 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[idx])) ||
                    (idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4])) ||
                    (idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]))
                  ) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[80] pointer-events-none backdrop-blur-[2px]"
                      />
                    )}
                </AnimatePresence>

                {/* 1. TOP GNB: Moved inside scroll area to scroll with content */}
                <header className={`absolute top-0 left-0 right-0 flex items-center px-14 h-[160px] transition-all duration-300 ${isDimmingEnabled && section === 'gnb' && (
                    (idx <= 3 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[idx])) ||
                    (idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4])) ||
                    (idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]))
                  ) ? 'z-[1000]' : 'z-[100]'
                  }`}>
                  {/* Left Section (4) */}
                  <div className={`flex-1 flex justify-start items-center gap-1 h-full pl-2 relative z-[500] transition-opacity duration-300 ${isDimmingEnabled && section === 'gnb' && (
                      (idx <= 3 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[idx])) ||
                      (idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4])) ||
                      (idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]))
                    ) && idx > 3 ? 'opacity-30' : 'opacity-100'
                    }`}>
                    {gnbOrder.slice(0, 4).map((id, i) => {
                      const item = GNB_MAP[id];
                      const Icon = item.icon;

                      const isItemFocused = section === 'gnb' && idx === i;
                      const isDimmed = isDimmingEnabled && section === 'gnb' && !isItemFocused && (
                        (idx <= 3 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[idx])) ||
                        (idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4])) ||
                        (idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]))
                      );
                      const needsElevation = isItemFocused && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(id);

                      return (
                        <div
                          key={id}
                          onContextMenu={(e) => e.preventDefault()}
                          className={`relative transition-all duration-300 ${isDimmed ? 'opacity-30' : 'opacity-100'} ${needsElevation ? 'z-[950]' : ''}`}
                          style={{ 
                            '--popup-left': getPopupLeft(i, id),
                            '--icon-center': '34px'
                          } as any}
                          onMouseEnter={() => {
                            if (interactionMode === 1 && isCursorVisible) {
                              setFocusSource('mouse');
                              setSection('gnb');
                              setIdx(i);
                              setPopupIdx(-1);
                            }
                          }}
                          onClick={() => {
                            if (interactionMode === 1 && isCursorVisible) {
                              if (['SEARCH', 'VISION', 'PRIVACY'].includes(id)) {
                                setCurrentPage(id === 'SEARCH' ? 'search' : (id === 'VISION' ? 'vision' : 'privacy'));
                              } else {
                                setPopupIdx(0);
                              }
                            }
                          }}
                        >
                          <div className={`w-[56px] h-[56px] rounded-full transition-all duration-300 flex items-center justify-center relative z-10 ${section === 'gnb' && idx === i
                              ? (id === 'ACCOUNT' 
                                  ? `ring-[3px] ${isWireframeMode ? 'ring-cyan-400' : 'ring-white'} ${popupIdx === -1 ? 'shadow-lg scale-110' : 'opacity-80'}` 
                                  : `${isWireframeMode ? 'bg-[#111c30] border border-cyan-400 ring-2 ring-cyan-500/50' : 'bg-white'} scale-110 shadow-[0_0_20px_rgba(255,255,255,0.6)]`)
                              : 'bg-transparent hover:bg-white/10'
                            }`}>
                             {isWireframeMode ? (
                               <div 
                                 className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center ${section === 'gnb' && idx === i ? 'border-cyan-400 bg-cyan-400/20 scale-105 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-cyan-500/30 bg-cyan-950/10'}`} 
                                 style={{ width: id === 'ACCOUNT' ? '44px' : '36px', height: id === 'ACCOUNT' ? '44px' : '36px' }}
                               >
                                 <div className={`rounded-full transition-all duration-300 ${section === 'gnb' && idx === i ? 'w-2.5 h-2.5 bg-cyan-400' : 'w-1.5 h-1.5 bg-cyan-500/40'}`} />
                               </div>
                             ) : (
                               <Icon
                                 size={id === 'ACCOUNT' ? 56 : 48}
                                 className={`transition-all duration-300 ${section === 'gnb' && idx === i ? (id === 'ACCOUNT' ? '' : 'brightness-0') : 'text-white'}`}
                               />
                             )}
                          </div>

                          <div className="absolute top-[64px] left-0 right-0 h-10 flex items-center justify-center pointer-events-none z-10">
                            <AnimatePresence>
                              {section === 'gnb' && idx === i && popupIdx === -1 && (
                                <motion.span
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="text-[14px] font-bold text-white whitespace-nowrap drop-shadow-md"
                                >
                                  {item.label}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>

                          {id === 'ACCOUNT' && <AccountPopup visible={section === 'gnb' && idx === i} selectedIdx={popupIdx} onHover={(p) => setPopupIdx(p)} interactionMode={interactionMode} isWireframeMode={isWireframeMode} />}
                          {id === 'DEVICES' && <ConnectedDevicesPopup visible={section === 'gnb' && idx === i} selectedIdx={popupIdx} onHover={(p) => setPopupIdx(p)} interactionMode={interactionMode} isWireframeMode={isWireframeMode} />}
                          {id === 'SETTINGS' && <SettingsPopup visible={section === 'gnb' && idx === i} selectedIdx={popupIdx} onHover={(p) => setPopupIdx(p)} interactionMode={interactionMode} isWireframeMode={isWireframeMode} />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Center Section (Standalone Vision AI + Group of 5) */}
                  <div className={`flex items-center gap-6 h-full justify-center transition-opacity duration-300 ${isDimmingEnabled && section === 'gnb' && (
                      (idx <= 3 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[idx])) ||
                      (idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4])) ||
                      (idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]))
                    ) && idx !== 4 && (idx < 5 || idx > 9) ? 'opacity-30' : 'opacity-100'
                    }`}>
                    {/* Vision AI spot (index 4) */}
                    <div
                      className={`flex flex-col items-center justify-center relative w-[90px] h-[86px] self-center transition-all duration-300 ${isDimmingEnabled && section === 'gnb' && (
                          (idx <= 3 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[idx])) ||
                          (idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4])) ||
                          (idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]))
                        ) && idx !== 4 ? 'opacity-30' : 'opacity-100'
                        } ${section === 'gnb' && idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4]) ? 'z-[950]' : ''}`}
                      style={{ 
                        '--popup-left': getPopupLeft(4, gnbOrder[4]),
                        '--icon-center': '45px'
                      } as any}
                    >
                      <div
                        onContextMenu={(e) => e.preventDefault()}
                        className={`w-[72px] h-[72px] rounded-full transition-all duration-300 flex items-center justify-center border relative z-10 ${section === 'gnb' && idx === 4
                            ? (gnbOrder[4] === 'ACCOUNT' 
                                ? `ring-[3px] ${isWireframeMode ? 'ring-cyan-400' : 'ring-white'} ${popupIdx === -1 ? 'shadow-lg scale-110 border-transparent' : 'opacity-80 border-transparent'}` 
                                : `${isWireframeMode ? 'bg-[#111c30] border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]' : 'bg-white'} scale-110 shadow-[0_15px_50px_rgba(255,255,255,0.5)]`)
                            : `${isWireframeMode ? 'bg-[#111c30] border-cyan-500/30' : 'bg-white/8 border-white/20 backdrop-blur-[12px] text-white'}`
                          }`}
                        onMouseEnter={() => {
                          if (interactionMode === 1 && isCursorVisible) {
                            setFocusSource('mouse');
                            setSection('gnb');
                            setIdx(4);
                            setPopupIdx(-1);
                          }
                        }}
                        onClick={() => {
                          if (interactionMode === 1 && isCursorVisible) {
                            const id = gnbOrder[4];
                            if (['SEARCH', 'VISION', 'PRIVACY'].includes(id)) {
                              setCurrentPage(id === 'SEARCH' ? 'search' : (id === 'VISION' ? 'vision' : 'privacy'));
                            } else {
                              setPopupIdx(0);
                            }
                          }
                        }}
                      >
                        {isWireframeMode ? (
                          <div 
                            className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center ${section === 'gnb' && idx === 4 ? 'border-cyan-400 bg-cyan-400/20 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-cyan-500/30 bg-cyan-950/10'}`} 
                            style={{ width: '48px', height: '48px' }}
                          >
                            <div className={`rounded-full transition-all duration-300 ${section === 'gnb' && idx === 4 ? 'w-3.5 h-3.5 bg-cyan-400' : 'w-2 h-2 bg-cyan-500/40'}`} />
                          </div>
                        ) : (
                          React.createElement(GNB_MAP[gnbOrder[4]].icon, {
                            size: gnbOrder[4] === 'ACCOUNT' ? 72 : 58,
                            color: section === 'gnb' && idx === 4 
                              ? (gnbOrder[4] === 'ACCOUNT' 
                                  ? "" 
                                  : "url(#vision-gradient)") 
                              : "white",
                            className: `transition-all duration-300 ${section === 'gnb' && idx === 4 && popupIdx === -1 && !['ACCOUNT', 'VISION'].includes(gnbOrder[4]) ? 'brightness-0' : ''}`,
                          })
                        )}
                      </div>

                      <div className="absolute top-[76px] h-12 flex items-center z-10">
                        <AnimatePresence mode="wait">
                          {section === 'gnb' && idx === 4 && popupIdx === -1 && (
                            <motion.span
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-[16px] font-black tracking-tighter text-white whitespace-nowrap"
                            >
                              {GNB_MAP[gnbOrder[4]].label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {gnbOrder[4] === 'ACCOUNT' && <AccountPopup visible={section === 'gnb' && idx === 4} selectedIdx={popupIdx} onHover={(p) => setPopupIdx(p)} interactionMode={interactionMode} isWireframeMode={isWireframeMode} />}
                      {gnbOrder[4] === 'DEVICES' && <ConnectedDevicesPopup visible={section === 'gnb' && idx === 4} selectedIdx={popupIdx} onHover={(p) => setPopupIdx(p)} interactionMode={interactionMode} isWireframeMode={isWireframeMode} />}
                      {gnbOrder[4] === 'SETTINGS' && <SettingsPopup visible={section === 'gnb' && idx === 4} selectedIdx={popupIdx} onHover={(p) => setPopupIdx(p)} interactionMode={interactionMode} isWireframeMode={isWireframeMode} />}
                    </div>

                    {/* Grouped Icons (5) - Fixed Tabs */}
                    <div className={`flex items-center h-full transition-opacity duration-300 ${isDimmingEnabled && section === 'gnb' && (
                        (idx <= 3 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[idx])) ||
                        (idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4])) ||
                        (idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]))
                      ) ? 'opacity-30' : 'opacity-100'
                      }`}>
                      <div className="flex items-center bg-white/5 rounded-full border border-white/5 h-[64px] relative backdrop-blur-3xl self-center px-1">
                        {[HomeIcon, LiveIcon, GameIcon, ArtIcon, AppsIcon].map((Icon, i) => {
                          const isFocused = section === 'gnb' && idx === (i + 5);
                          const isActive = activeTab === (i + 5);
                          const solidColors = ['#00e5ff', '#ff3b30', '#bf5af2', '#ffd60a', '#5e5ce6'];
                          return (
                            <div
                              key={i}
                              onMouseEnter={() => {
                                if (interactionMode === 1 && isCursorVisible) {
                                  setFocusSource('mouse');
                                  setSection('gnb');
                                  setIdx(i + 5);
                                  setActiveTab(i + 5);
                                }
                              }}
                              className="w-[72px] h-[64px] flex flex-col items-center justify-center relative shrink-0 cursor-pointer"
                            >
                              <div className={`absolute w-[72px] h-[52px] rounded-[26px] transition-all duration-300 pointer-events-none z-0 ${
                                isFocused 
                                  ? `opacity-100 ${isWireframeMode ? 'bg-[#111c30] border border-cyan-400 ring-2 ring-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white'} scale-110 shadow-[0_12px_40px_rgba(255,255,255,0.4)]` 
                                  : 'opacity-0'
                              }`} />
                              <div className={`relative h-full flex items-center justify-center transition-all duration-300 z-10 ${isFocused ? 'scale-110' : (isActive ? 'scale-105 opacity-100' : 'opacity-80 hover:opacity-100')}`}>
                                {isWireframeMode ? (
                                  <div 
                                    className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center ${isFocused || isActive ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_12px_rgba(6,182,212,0.4)]' : 'border-cyan-500/30 bg-cyan-950/10'}`} 
                                    style={{ width: '36px', height: '36px' }}
                                  >
                                    <div className={`rounded-full transition-all duration-300 ${isFocused || isActive ? 'w-2.5 h-2.5 bg-cyan-400' : 'w-1.5 h-1.5 bg-cyan-500/30'}`} />
                                  </div>
                                ) : (
                                  <Icon size={52} focused={isFocused} active={isActive} color={isFocused || isActive ? solidColors[i] : 'rgba(255,255,255,0.9)'} />
                                )}
                              </div>
                              <div className="absolute top-[64px] left-0 right-0 h-10 flex items-center justify-center pointer-events-none z-10">
                                <AnimatePresence mode="wait">
                                  {isFocused && (
                                    <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[14px] font-bold text-white whitespace-nowrap drop-shadow-md">
                                      {GNB_LABELS[i + 5]}
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Section (Search spot - index 10) */}
                  <div className={`flex-1 flex justify-end items-center h-full pr-6 transition-all duration-300 ${isDimmingEnabled && section === 'gnb' && (
                      (idx <= 3 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[idx])) ||
                      (idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4])) ||
                      (idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]))
                    ) && idx !== 10 ? 'opacity-30' : 'opacity-100'
                    }`}>
                    <div
                      className={`relative cursor-pointer transition-all duration-300 ${isDimmingEnabled && section === 'gnb' && (
                          (idx <= 3 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[idx])) ||
                          (idx === 4 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[4])) ||
                          (idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]))
                        ) && idx !== 10 ? 'opacity-30' : 'opacity-100'
                        } ${section === 'gnb' && idx === 10 && ['ACCOUNT', 'SETTINGS', 'DEVICES'].includes(gnbOrder[5]) ? 'z-[950]' : ''}`}
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ 
                  '--popup-left': getPopupLeft(10, gnbOrder[5]),
                  '--icon-center': '28px'
                } as any}
                      onMouseEnter={() => {
                        if (interactionMode === 1 && isCursorVisible) {
                          setFocusSource('mouse');
                          setSection('gnb');
                          setIdx(10);
                          setPopupIdx(-1);
                        }
                      }}
                      onClick={() => {
                        if (interactionMode === 1 && isCursorVisible) {
                          const id = gnbOrder[5];
                          if (['SEARCH', 'VISION', 'PRIVACY'].includes(id)) {
                            setCurrentPage(id === 'SEARCH' ? 'search' : (id === 'VISION' ? 'vision' : 'privacy'));
                          } else {
                            setPopupIdx(0);
                          }
                        }
                      }}
                    >
                      <div className={`w-[56px] h-[56px] rounded-full transition-all duration-300 flex items-center justify-center relative z-10 ${section === 'gnb' && idx === 10
                          ? (gnbOrder[5] === 'ACCOUNT' 
                              ? `ring-[3px] ${isWireframeMode ? 'ring-cyan-400' : 'ring-white'} ${popupIdx === -1 ? 'shadow-lg scale-110' : 'opacity-80'}` 
                              : `${isWireframeMode ? 'bg-[#111c30] border border-cyan-400 ring-2 ring-cyan-500/50' : 'bg-white'} scale-110 shadow-[0_0_20px_rgba(255,255,255,0.6)]`)
                          : 'bg-transparent hover:bg-white/10'
                        }`}>
                        {isWireframeMode ? (
                          <div 
                            className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center ${section === 'gnb' && idx === 10 ? 'border-cyan-400 bg-cyan-400/20 scale-105 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-cyan-500/30 bg-cyan-950/10'}`} 
                            style={{ width: gnbOrder[5] === 'ACCOUNT' ? '44px' : '36px', height: gnbOrder[5] === 'ACCOUNT' ? '44px' : '36px' }}
                          >
                            <div className={`rounded-full transition-all duration-300 ${section === 'gnb' && idx === 10 ? 'w-2.5 h-2.5 bg-cyan-400' : 'w-1.5 h-1.5 bg-cyan-500/40'}`} />
                          </div>
                        ) : (
                          React.createElement(GNB_MAP[gnbOrder[5]].icon, {
                            size: gnbOrder[5] === 'ACCOUNT' ? 56 : 48,
                            className: `transition-all duration-300 ${section === 'gnb' && idx === 10 && popupIdx === -1 ? (gnbOrder[5] === 'ACCOUNT' ? '' : 'brightness-0') : 'opacity-100 text-white'}`
                          })
                        )}
                      </div>

                      <div className="absolute top-[64px] left-0 right-0 h-10 flex items-center justify-center pointer-events-none z-10">
                        <AnimatePresence>
                          {section === 'gnb' && idx === 10 && popupIdx === -1 && (
                            <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[14px] font-bold text-white whitespace-nowrap drop-shadow-md">
                              {GNB_MAP[gnbOrder[5]].label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {gnbOrder[5] === 'ACCOUNT' && <AccountPopup visible={section === 'gnb' && idx === 10} selectedIdx={popupIdx} onHover={(p) => setPopupIdx(p)} interactionMode={interactionMode} isWireframeMode={isWireframeMode} />}
                      {gnbOrder[5] === 'DEVICES' && <ConnectedDevicesPopup visible={section === 'gnb' && idx === 10} selectedIdx={popupIdx} onHover={(p) => setPopupIdx(p)} interactionMode={interactionMode} isWireframeMode={isWireframeMode} />}
                      {gnbOrder[5] === 'SETTINGS' && <SettingsPopup visible={section === 'gnb' && idx === 10} selectedIdx={popupIdx} onHover={(p) => setPopupIdx(p)} interactionMode={interactionMode} isWireframeMode={isWireframeMode} />}
                    </div>
                  </div>
                </header>

                {activeTab === 5 ? (
                  <>
                    {/* HERO SECTION: Dark Cinematic Ad */}
                    <section className="relative w-full h-[580px] flex items-end px-20 pb-20">
                      <div className="absolute inset-0 z-0 bg-black">
                        {isWireframeMode ? (
                          <div className="w-full h-full border border-cyan-500/20 relative flex flex-col items-center justify-center text-cyan-500/30 font-mono">
                            <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" strokeWidth="1.5">
                              <line x1="0" y1="0" x2="100%" y2="100%" />
                              <line x1="100%" y1="0" x2="0" y2="100%" />
                            </svg>
                            <span className="text-2xl font-bold tracking-widest uppercase border border-cyan-500/20 px-6 py-3 rounded bg-[#0a1120]/85 text-cyan-400 animate-pulse">
                              [ HERO BANNER AD: {HERO_BANNERS[heroIdx].title} ]
                            </span>
                          </div>
                        ) : (
                          <>
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={heroIdx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                src={HERO_BANNERS[heroIdx].bg}
                                alt="Hero Banner"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover opacity-100"
                              />
                            </AnimatePresence>
                            <div className="absolute inset-x-0 bottom-0 h-[350px] bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                            <div className="absolute inset-x-0 bottom-0 h-10 bg-black z-10" />
                            <div className="absolute inset-y-0 left-0 w-[800px] bg-gradient-to-r from-black/95 via-black/40 to-transparent z-10" />
                            <motion.div
                              animate={{ backgroundColor: HERO_BANNERS[heroIdx].accent }}
                              transition={{ duration: 1 }}
                              className="absolute top-0 right-0 w-full h-full pointer-events-none blur-[120px] opacity-20"
                            />
                          </>
                        )}
                      </div>

                      <div className="relative z-10 w-full flex flex-col items-start gap-6">
                        <div className="flex flex-col items-center w-fit gap-6">
                          <motion.div
                            key={heroIdx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-2"
                          >
                            {isWireframeMode ? (
                              <h1 className="text-3xl font-bold tracking-widest uppercase text-cyan-400 font-mono py-2">
                                [ AD_TITLE: {HERO_BANNERS[heroIdx].title} ]
                              </h1>
                            ) : (
                              <h1 className="text-[72px] font-black italic uppercase tracking-tighter leading-[0.85] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                {HERO_BANNERS[heroIdx].title}
                              </h1>
                            )}
                            {isWireframeMode ? (
                              <p className="text-lg font-mono text-cyan-500/70 max-w-xl text-center leading-relaxed tracking-tight">
                                [ AD_DESC: {HERO_BANNERS[heroIdx].desc} ]
                              </p>
                            ) : (
                              <p className="text-xl font-medium max-w-xl leading-snug tracking-tight text-center text-white/70">
                                {HERO_BANNERS[heroIdx].desc}
                              </p>
                            )}
                          </motion.div>
                          <div className="flex flex-col items-center gap-6">
                            <motion.div
                              onMouseEnter={() => {
                                if (interactionMode === 1 && isCursorVisible) {
                                  setFocusSource('mouse');
                                  setSection('hero');
                                  setIdx(0);
                                }
                              }}
                              onClick={() => {
                                if (interactionMode === 1 && isCursorVisible) {
                                  setCurrentPage('heroDetail');
                                }
                              }}
                              animate={{
                                scale: section === 'hero' ? 1.05 : 1
                              }}
                              className={`px-20 py-5 rounded-[2.5rem] font-bold uppercase text-lg tracking-tight border-2 transition-all duration-300 cursor-pointer ${
                                isWireframeMode
                                  ? (section === 'hero'
                                      ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                                      : 'bg-[#111c30] text-cyan-400 border-cyan-500/30')
                                  : (section === 'hero'
                                      ? 'bg-white text-black border-white shadow-[0_15px_45px_rgba(255,255,255,0.35)]'
                                      : 'bg-white/5 text-white border-white/10 backdrop-blur-3xl hover:bg-white/10')
                              }`}
                            >
                              지금 시청하기
                            </motion.div>

                            <div className="flex justify-center gap-2.5 px-3 items-center">
                              {HERO_BANNERS.map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1.5 rounded-full transition-all duration-500 ${heroIdx === i
                                      ? 'w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                                      : 'w-2 bg-white/20'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className="px-14 space-y-0 pb-40 -mt-12 relative z-20 bg-black">
                      {/* CONTENT ROW: Slidable Row with Sticky Title Logic */}
                      <section id="section-row" className="overflow-visible relative h-[400px]">

                        {/* STICKY/SLIDING TITLES */}
                        <div className="h-10 relative overflow-hidden mb-2">
                          <motion.span
                            animate={{ x: -rowScrollIdx * (440 + 32) }}
                            transition={{ type: 'tween', duration: 0.1, ease: 'easeOut' }}
                            className="absolute left-2 text-[22px] font-semibold tracking-tight whitespace-nowrap text-white"
                          >
                            지금 재생중
                          </motion.span>

                          <motion.span
                            animate={{
                              x: Math.max(0, (440 + 32) - (rowScrollIdx * (440 + 32)))
                            }}
                            transition={{ type: 'tween', duration: 0.1, ease: 'easeOut' }}
                            className="absolute left-2 text-[22px] font-semibold tracking-tight whitespace-nowrap text-white"
                          >
                            추천 콘텐츠
                          </motion.span>
                        </div>

                        <div className="relative">
                          <motion.div
                            animate={{
                              x: -rowScrollIdx * (440 + 32)
                            }}
                            transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
                            onPanEnd={(_, info) => {
                              if (interactionMode !== 1) return;
                              if (info.offset.x < -50 && rowIdx < RECOMMENDATIONS.length - 1) {
                                setRowIdx(rowIdx + 1);
                                setRowScrollIdx(rowIdx + 1);
                              } else if (info.offset.x > 50 && rowIdx > 0) {
                                setRowIdx(rowIdx - 1);
                                setRowScrollIdx(rowIdx - 1);
                              }
                            }}
                            className="flex gap-8 px-2"
                          >
                            {RECOMMENDATIONS.map((movie, i) => (
                             <ContentCard
                                key={movie.id}
                                focused={section === 'row' && rowIdx === i}
                                title={movie.title}
                                sublabel={movie.sub}
                                img={movie.img}
                                style={cardFocusStyle}
                                isWireframeMode={isWireframeMode}
                                onMouseEnter={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setFocusSource('mouse');
                                    setSection('row');
                                    setRowIdx(i);
                                  }
                                }}
                                onClick={() => {
                                  if (interactionMode === 1) {
                                    setCurrentPage('contentDetail');
                                  }
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                      </section>

                      {/* APPS ROW: Horizontal Circular Icons with Dynamic Y Shift */}
                      <motion.section
                        id="section-apps"
                        animate={{
                          y: section === 'row' ? 0 : -5
                        }}
                        style={{ zIndex: isAppEditPopupVisible ? 1000 : 40 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 30 }}
                        className="relative overflow-visible px-2 pb-12"
                      >
                        <div className="relative">
                          <div className="flex gap-5 py-2 px-1 flex-wrap justify-start">
                            {APPS.map((app, i) => (
                              <div
                                key={i}
                                className="flex flex-col items-center shrink-0 w-[120px] cursor-pointer relative"
                                onMouseEnter={() => {
                                  if (isAppEditPopupVisible) return;
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setFocusSource('mouse');
                                    setSection('apps');
                                    setIdx(i);
                                  }
                                }}
                                onClick={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    if (app.icon === 'edit-system') {
                                      setIsAppEditPopupVisible(true);
                                      setAppEditIdx(0);
                                    } else if (!launchApp(app.name)) {
                                      setCurrentPage('appDetail');
                                    }
                                  }
                                }}
                              >
                                <motion.div
                                  animate={{
                                    scale: section === 'apps' && idx === i ? 1.12 : 1
                                  }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  className={`w-[115px] h-[115px] rounded-[2.6rem] transition-all duration-300 flex items-center justify-center overflow-hidden relative ${section === 'apps' && idx === i
                                      ? (isWireframeMode 
                                          ? `z-20 ring-[5px] ring-cyan-400 ring-offset-1 ring-offset-black shadow-[0_0_30px_rgba(6,182,212,0.4)]`
                                          : `z-20 ring-[5px] ring-white ring-offset-1 ring-offset-black shadow-[0_0_40px_rgba(255,255,255,0.45)]`)
                                      : (isWireframeMode ? 'opacity-90 border border-cyan-500/20' : `opacity-95`)
                                    }`}
                                >
                                  {isWireframeMode ? (
                                    <div className="w-full h-full bg-[#111c30] flex flex-col items-center justify-center relative font-mono text-cyan-500/40 p-2">
                                      <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" strokeWidth="1">
                                        <line x1="0" y1="0" x2="100%" y2="100%" />
                                        <line x1="100%" y1="0" x2="0" y2="100%" />
                                      </svg>
                                      <span className="z-10 text-[12px] font-black text-cyan-400 max-w-[90%] text-center break-words leading-tight uppercase">
                                        {app.name}
                                      </span>
                                    </div>
                                  ) : app.icon === 'edit-system' ? (
                                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                      <Pencil size={42} className="text-white/80" />
                                    </div>
                                  ) : (
                                    <img
                                      src={app.icon}
                                      alt={app.name}
                                      className="w-[104%] h-[104%] object-cover"
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const parent = e.currentTarget.parentElement;
                                        if (parent) {
                                          parent.innerHTML = `<div class="text-white text-xs font-bold text-center p-2">${app.name}</div>`;
                                        }
                                      }}
                                    />
                                  )}
                                </motion.div>
                                {app.icon === 'edit-system' && (
                                  <AppEditPopup
                                    visible={isAppEditPopupVisible}
                                    selectedIdx={appEditIdx}
                                    isWireframeMode={isWireframeMode}
                                    onClose={() => setIsAppEditPopupVisible(false)}
                                    onSelectIdx={(idx) => setAppEditIdx(idx)}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.section>

                      {/* COMEDY CONTENT ROW */}
                      <section id="section-comedy" className="overflow-visible relative h-[480px]">
                        <div className="h-14 mb-2">
                          <span className="text-[22px] font-semibold tracking-tight text-white px-2">
                            코미디
                          </span>
                        </div>

                        <div className="relative">
                          <motion.div
                            animate={{
                              x: -comedyScrollIdx * (440 + 32)
                            }}
                            transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
                            onPanEnd={(_, info) => {
                              if (interactionMode !== 1) return;
                              if (info.offset.x < -50 && comedyIdx < COMEDY_MOVIES.length - 1) {
                                setComedyIdx(comedyIdx + 1);
                                setComedyScrollIdx(comedyIdx + 1);
                              } else if (info.offset.x > 50 && comedyIdx > 0) {
                                setComedyIdx(comedyIdx - 1);
                                setComedyScrollIdx(comedyIdx - 1);
                              }
                            }}
                            className="flex gap-8 px-2"
                          >
                            {COMEDY_MOVIES.map((movie, i) => (
                              <ContentCard
                                key={movie.id}
                                focused={section === 'comedy' && comedyIdx === i}
                                title={movie.title}
                                sublabel={movie.sub}
                                img={movie.img}
                                style={cardFocusStyle}
                                isWireframeMode={isWireframeMode}
                                onMouseEnter={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setFocusSource('mouse');
                                    setSection('comedy');
                                    setComedyIdx(i);
                                  }
                                }}
                                onClick={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setCurrentPage('contentDetail');
                                  }
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                      </section>

                      {/* ROMANCE CONTENT ROW */}
                      <section id="section-romance" className="overflow-visible relative h-[480px] -mt-10">
                        <div className="h-14 mb-2">
                          <span className="text-[22px] font-semibold tracking-tight text-white px-2">
                            로맨스
                          </span>
                        </div>

                        <div className="relative">
                          <motion.div
                            animate={{
                              x: -romanceScrollIdx * (440 + 32)
                            }}
                            transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
                            onPanEnd={(_, info) => {
                              if (interactionMode !== 1) return;
                              if (info.offset.x < -50 && romanceIdx < ROMANCE_MOVIES.length - 1) {
                                setRomanceIdx(romanceIdx + 1);
                                setRomanceScrollIdx(romanceIdx + 1);
                              } else if (info.offset.x > 50 && romanceIdx > 0) {
                                setRomanceIdx(romanceIdx - 1);
                                setRomanceScrollIdx(romanceIdx - 1);
                              }
                            }}
                            className="flex gap-8 px-2"
                          >
                            {ROMANCE_MOVIES.map((movie, i) => (
                              <ContentCard
                                key={movie.id}
                                focused={section === 'romance' && romanceIdx === i}
                                title={movie.title}
                                sublabel={movie.sub}
                                img={movie.img}
                                style={cardFocusStyle}
                                isWireframeMode={isWireframeMode}
                                onMouseEnter={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setFocusSource('mouse');
                                    setSection('romance');
                                    setRomanceIdx(i);
                                  }
                                }}
                                onClick={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setCurrentPage('contentDetail');
                                  }
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                      </section>

                      {/* DOCUMENTARY CONTENT ROW */}
                      <section id="section-doc" className="overflow-visible relative h-[480px] -mt-10">
                        <div className="h-14 mb-2">
                          <span className="text-[22px] font-semibold tracking-tight text-white px-2">
                            다큐멘터리
                          </span>
                        </div>

                        <div className="relative">
                          <motion.div
                            animate={{
                              x: -docScrollIdx * (440 + 32)
                            }}
                            transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
                            onPanEnd={(_, info) => {
                              if (interactionMode !== 1) return;
                              if (info.offset.x < -50 && docIdx < DOC_MOVIES.length - 1) {
                                setDocIdx(docIdx + 1);
                                setDocScrollIdx(docIdx + 1);
                              } else if (info.offset.x > 50 && docIdx > 0) {
                                setDocIdx(docIdx - 1);
                                setDocScrollIdx(docIdx - 1);
                              }
                            }}
                            className="flex gap-8 px-2"
                          >
                            {DOC_MOVIES.map((movie, i) => (
                              <ContentCard
                                key={movie.id}
                                focused={section === 'doc' && docIdx === i}
                                title={movie.title}
                                sublabel={movie.sub}
                                img={movie.img}
                                style={cardFocusStyle}
                                isWireframeMode={isWireframeMode}
                                onMouseEnter={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setFocusSource('mouse');
                                    setSection('doc');
                                    setDocIdx(i);
                                  }
                                }}
                                onClick={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setCurrentPage('contentDetail');
                                  }
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                      </section>

                      {/* ACTION CONTENT ROW */}
                      <section id="section-action" className="overflow-visible relative h-[480px] -mt-10">
                        <div className="h-14 mb-2">
                          <span className="text-[22px] font-semibold tracking-tight text-white px-2">
                            액션
                          </span>
                        </div>

                        <div className="relative">
                          <motion.div
                            animate={{
                              x: -actionScrollIdx * (440 + 32)
                            }}
                            transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
                            onPanEnd={(_, info) => {
                              if (interactionMode !== 1) return;
                              if (info.offset.x < -50 && actionIdx < ACTION_MOVIES.length - 1) {
                                setActionIdx(actionIdx + 1);
                                setActionScrollIdx(actionIdx + 1);
                              } else if (info.offset.x > 50 && actionIdx > 0) {
                                setActionIdx(actionIdx - 1);
                                setActionScrollIdx(actionIdx - 1);
                              }
                            }}
                            className="flex gap-8 px-2"
                          >
                            {ACTION_MOVIES.map((movie, i) => (
                              <ContentCard
                                key={movie.id}
                                focused={section === 'action' && actionIdx === i}
                                title={movie.title}
                                sublabel={movie.sub}
                                img={movie.img}
                                style={cardFocusStyle}
                                isWireframeMode={isWireframeMode}
                                onMouseEnter={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setFocusSource('mouse');
                                    setSection('action');
                                    setActionIdx(i);
                                  }
                                }}
                                onClick={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setCurrentPage('contentDetail');
                                  }
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                      </section>

                      {/* THRILLER CONTENT ROW */}
                      <section id="section-thriller" className="overflow-visible relative h-[480px] -mt-10">
                        <div className="h-14 mb-2">
                          <span className="text-[22px] font-semibold tracking-tight text-white px-2">
                            스릴러
                          </span>
                        </div>

                        <div className="relative">
                          <motion.div
                            animate={{
                              x: -thrillerScrollIdx * (440 + 32)
                            }}
                            transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
                            onPanEnd={(_, info) => {
                              if (interactionMode !== 1) return;
                              if (info.offset.x < -50 && thrillerIdx < THRILLER_MOVIES.length - 1) {
                                setThrillerIdx(thrillerIdx + 1);
                                setThrillerScrollIdx(thrillerIdx + 1);
                              } else if (info.offset.x > 50 && thrillerIdx > 0) {
                                setThrillerIdx(thrillerIdx - 1);
                                setThrillerScrollIdx(thrillerIdx - 1);
                              }
                            }}
                            className="flex gap-8 px-2"
                          >
                            {THRILLER_MOVIES.map((movie, i) => (
                              <ContentCard
                                key={movie.id}
                                focused={section === 'thriller' && thrillerIdx === i}
                                title={movie.title}
                                sublabel={movie.sub}
                                img={movie.img}
                                style={cardFocusStyle}
                                isWireframeMode={isWireframeMode}
                                onMouseEnter={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setFocusSource('mouse');
                                    setSection('thriller');
                                    setThrillerIdx(i);
                                  }
                                }}
                                onClick={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setCurrentPage('contentDetail');
                                  }
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                      </section>

                      {/* DRAMA CONTENT ROW */}
                      <section id="section-drama" className="overflow-visible relative h-[480px] -mt-10">
                        <div className="h-14 mb-2">
                          <span className="text-[22px] font-semibold tracking-tight text-white px-2">
                            드라마
                          </span>
                        </div>

                        <div className="relative">
                          <motion.div
                            animate={{
                              x: -dramaScrollIdx * (440 + 32)
                            }}
                            transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
                            onPanEnd={(_, info) => {
                              if (interactionMode !== 1) return;
                              if (info.offset.x < -50 && dramaIdx < DRAMA_MOVIES.length - 1) {
                                setDramaIdx(dramaIdx + 1);
                                setDramaScrollIdx(dramaIdx + 1);
                              } else if (info.offset.x > 50 && dramaIdx > 0) {
                                setDramaIdx(dramaIdx - 1);
                                setDramaScrollIdx(dramaIdx - 1);
                              }
                            }}
                            className="flex gap-8 px-2"
                          >
                            {DRAMA_MOVIES.map((movie, i) => (
                              <ContentCard
                                key={movie.id}
                                focused={section === 'drama' && dramaIdx === i}
                                title={movie.title}
                                sublabel={movie.sub}
                                img={movie.img}
                                style={cardFocusStyle}
                                isWireframeMode={isWireframeMode}
                                onMouseEnter={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setFocusSource('mouse');
                                    setSection('drama');
                                    setDramaIdx(i);
                                  }
                                }}
                                onClick={() => {
                                  if (interactionMode === 1 && isCursorVisible) {
                                    setCurrentPage('contentDetail');
                                  }
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                      </section>

                      {/* SETTINGS OPTIONS ROW */}
                      <section id="section-settings" className="overflow-visible relative pb-10">
                        <div className="flex gap-4 px-2 items-center justify-start">
                          {SETTINGS_OPTIONS.map((opt, i) => (
                            <SettingsItem
                              key={opt.id}
                              focused={section === 'settings' && settingsIdx === i}
                              label={opt.label}
                              icon={opt.icon}
                              isWireframeMode={isWireframeMode}
                              onMouseEnter={() => {
                                if (interactionMode === 1 && isCursorVisible) {
                                  setFocusSource('mouse');
                                  setSection('settings');
                                  setSettingsIdx(i);
                                }
                              }}
                            />
                          ))}
                        </div>
                      </section>

                      {/* SCROLL TO TOP BUTTON ROW */}
                      <section id="section-scrollTop" className="flex justify-center pt-20 pb-20">
                        <motion.div
                          onMouseEnter={() => {
                            if (interactionMode === 1 && isCursorVisible) {
                              setFocusSource('mouse');
                              setSection('scrollTop');
                              setIdx(0);
                            }
                          }}
                          onClick={() => {
                            if (interactionMode === 1 && isCursorVisible) {
                              setFocusSource('key'); // Trigger auto-scroll
                              setSection('gnb');
                              setIdx(5);
                            }
                          }}
                          animate={{
                            scale: section === 'scrollTop' ? 1.2 : 1,
                            backgroundColor: section === 'scrollTop' ? '#ffffff' : 'transparent',
                            borderColor: section === 'scrollTop' ? '#ffffff' : 'rgba(255,255,255,0.3)'
                          }}
                          className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${section === 'scrollTop' ? 'shadow-[0_0_50px_rgba(255,255,255,0.4)]' : ''
                            }`}
                        >
                          <ChevronUp
                            size={40}
                            className={`transition-colors duration-300 ${section === 'scrollTop' ? 'text-black' : 'text-white'
                              }`}
                          />
                        </motion.div>
                      </section>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full min-h-[calc(100vh-160px)] flex flex-col pt-[160px]">
                    <section className="relative w-full flex-1 flex items-center justify-center px-20 pb-32">
                      <div className="absolute inset-x-20 inset-y-10 z-0 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[4rem] border border-white/10 blur-[2px]" />
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={activeTab}
                        className="relative z-10 flex flex-col items-center gap-8"
                      >
                        <div
                          onMouseEnter={() => {
                            if (interactionMode === 1 && isCursorVisible) {
                              setFocusSource('mouse');
                              setSection('tabContent');
                            }
                          }}
                          onClick={() => {
                            if (interactionMode === 1 && isCursorVisible) {
                              setSection('tabContent');
                            }
                          }}
                          className={`p-8 rounded-[3.5rem] transition-all duration-500 cursor-pointer ${
                            isWireframeMode
                              ? (section === 'tabContent' ? 'scale-110 bg-[#111c30] border-2 border-cyan-400 text-cyan-400 ring-[8px] ring-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.3)]' : 'bg-transparent border border-cyan-500/30 text-cyan-500/70')
                              : (section === 'tabContent' ? 'scale-110 bg-white/10 ring-[8px] ring-white shadow-[0_0_100px_rgba(255,255,255,0.2)]' : 'bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl')
                          }`}
                        >
                          {activeTab === 4 && <VisionAIIcon size={120} className="transition-all duration-300" />}
                          {activeTab === 6 && <LiveIcon size={120} active={true} className="transition-all duration-300" />}
                          {activeTab === 7 && <GameIcon size={120} active={true} className="transition-all duration-300" />}
                          {activeTab === 8 && <ArtIcon size={120} active={true} className="transition-all duration-300" />}
                          {activeTab === 9 && <AppsIcon size={120} active={true} className="transition-all duration-300" />}
                        </div>
                        <motion.h1
                          animate={{ scale: section === 'tabContent' ? 1.05 : 1, opacity: section === 'tabContent' ? 1 : 0.6 }}
                          className={`text-[140px] font-black italic uppercase tracking-tighter leading-none text-center ${
                            isWireframeMode ? 'text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                          }`}
                        >
                          {GNB_LABELS[activeTab]}
                        </motion.h1>
                        <div className="flex flex-col items-center gap-2">
                          <p className={`text-3xl font-medium tracking-tight ${isWireframeMode ? 'text-cyan-500/80' : 'text-white/40'}`}>
                            {activeTab === 6 && "실시간 방송을 시청해 보세요"}
                            {activeTab === 7 && "최신 게임을 즐겨 보세요"}
                            {activeTab === 8 && "예술 작품을 감상해 보세요"}
                            {activeTab === 9 && "다양한 앱을 탐색해 보세요"}
                            {activeTab === 4 && "스마트한 AI 기능을 경험해 보세요"}
                          </p>
                          <div className="w-24 h-1 bg-white/20 rounded-full mt-4" />
                        </div>
                      </motion.div>
                    </section>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </ViewportScaler>
      {/* VIRTUAL D-PAD REMOTE & SIMULATOR HANDLE */}
      {showVirtualDPad && <VirtualRemote onClose={() => setShowVirtualDPad(false)} />}
      <SimulatorHandle onClick={() => setShowDashboard(true)} />


      {/* SIMULATOR DASHBOARD OVERLAY */}
      <AnimatePresence>
        {showDashboard && (
          <>
            {/* Backdrop Dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDashboard(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="dashboard-container absolute top-6 right-6 bottom-6 w-[480px] bg-zinc-950/85 backdrop-blur-3xl border border-white/10 z-[1100] shadow-[-20px_0_80px_rgba(0,0,0,0.6)] rounded-[3rem] p-10 flex flex-col overflow-hidden font-sans"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                  <h2 className="text-white text-3xl font-bold tracking-tight leading-none">시뮬레이터 설정</h2>
                  <p className="text-blue-400/60 text-[11px] font-medium uppercase tracking-[0.2em]">PRO UX LABORATORY</p>
                </div>
                <button
                  onClick={() => setShowDashboard(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              {/* Scrollable Options Area */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-10 pr-2">

                {/* Option 1: 최초 포커스 위치 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1 h-3.5 bg-blue-500 rounded-full" />
                    <label className="text-[13px] font-semibold text-white/60 tracking-tight">01. 최초 포커스 위치 설정</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['GNB 홈 아이콘', '지금 재생중 카드', '히어로 메인 버튼', '앱 로우 (Netflix)'].map((label, i) => (
                      <button
                        key={i}
                        onClick={() => setInitialFocusTarget(i)}
                        className={`px-4 py-4 rounded-2xl transition-all duration-300 border font-medium text-[13px] tracking-tight ${initialFocusTarget === i
                            ? 'bg-white text-black border-white shadow-[0_10px_25px_rgba(255,255,255,0.1)]'
                            : 'bg-white/5 text-white/40 border-transparent hover:border-white/10 hover:text-white/70'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option 2: 인터랙션 모드 설정 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1 h-3.5 bg-blue-500 rounded-full" />
                    <label className="text-[13px] font-semibold text-white/60 tracking-tight">02. 인터랙션 모드 설정</label>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {['D-PAD (기본)', '하이브리드 (마우스)'].map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setInteractionMode(i)}
                        className={`flex-1 py-3 text-[12px] font-medium tracking-tight rounded-xl transition-all ${interactionMode === i ? 'bg-white text-black shadow-lg' : 'text-white/20 hover:text-white/40'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* OPTION 03: GNB Order */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    <label className="text-[14px] font-bold text-white uppercase tracking-widest">03. GNB 메뉴 순서 재배치</label>
                  </div>
                  <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-3xl border border-white/5">
                    {gnbOrder.map((id, index) => (
                      <div key={id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[12px] font-black text-white/40">
                            {index + 1}
                          </div>
                          <span className="text-[15px] font-bold text-white/80">{GNB_MAP[id].label}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (index > 0) {
                                const newOrder = [...gnbOrder];
                                [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                                setGnbOrder(newOrder);
                              }
                            }}
                            disabled={index === 0}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-0"
                          >
                            <ChevronUp size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (index < gnbOrder.length - 1) {
                                const newOrder = [...gnbOrder];
                                [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                                setGnbOrder(newOrder);
                              }
                            }}
                            disabled={index === gnbOrder.length - 1}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-0"
                          >
                            <ChevronDown size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-[11px] font-medium text-white/20 italic pl-4">* 중앙 탭 5개는 고정 영역입니다.</p>
                    <button
                      onClick={() => setGnbOrder(['ACCOUNT', 'SEARCH', 'DEVICES', 'SETTINGS', 'VISION', 'PRIVACY'])}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl border border-white/5 text-[13px] font-bold transition-all"
                    >
                      기본 순서로 초기화
                    </button>
                  </div>
                </div>

                {/* OPTION 04: Background Dimming */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    <label className="text-[14px] font-bold text-white uppercase tracking-widest">04. 배경 딤(Dim) 처리 설정</label>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {[
                      { label: '미사용 (디폴트)', val: false },
                      { label: '사용 (배경 어둡게)', val: true }
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setIsDimmingEnabled(item.val)}
                        className={`flex-1 py-3 text-[12px] font-medium tracking-tight rounded-xl transition-all ${isDimmingEnabled === item.val ? 'bg-white text-black shadow-lg' : 'text-white/20 hover:text-white/40'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-white/20 italic pl-4">* 팝업 메뉴 활성화 시 주변을 어둡게 처리합니다.</p>
                </div>

                {/* OPTION 05: Card Focus Style */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    <label className="text-[14px] font-bold text-white uppercase tracking-widest">05. 카드 콘텐츠 포커스 스타일</label>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {[
                      { label: '다이내믹 (기본)', val: 0 },
                      { label: '미니멀 (내부 정보)', val: 1 }
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setCardFocusStyle(item.val)}
                        className={`flex-1 py-3 text-[12px] font-medium tracking-tight rounded-xl transition-all ${cardFocusStyle === item.val ? 'bg-white text-black shadow-lg' : 'text-white/20 hover:text-white/40'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-white/20 italic pl-4">* 카드 포커스 시의 크기 변화량 및 정보 노출 위치를 조절합니다.</p>
                </div>

                {/* OPTION 06: Virtual D-Pad */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    <label className="text-[14px] font-bold text-white uppercase tracking-widest">06. 가상 방향키(D-Pad) 생성</label>
                  </div>
                  <button
                    onClick={() => {
                      const newVal = !showVirtualDPad;
                      setShowVirtualDPad(newVal);
                      localStorage.setItem('tvhome-virtual-dpad', String(newVal));
                    }}
                    className={`w-full py-4 rounded-2xl border transition-all duration-300 flex items-center justify-between px-6 ${showVirtualDPad
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_10px_30px_rgba(37,99,235,0.1)]'
                        : 'bg-white/5 border-transparent text-white/40 hover:border-white/10 hover:text-white/60'
                      }`}
                  >
                    <span className="text-[13px] font-bold tracking-tight">화면에 가상 리모컨 표시</span>
                    <div className={`w-10 h-6 rounded-full transition-all relative ${showVirtualDPad ? 'bg-blue-500' : 'bg-white/10'}`}>
                      <motion.div
                        animate={{ x: showVirtualDPad ? 18 : 2 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </div>
                  </button>
                  <p className="text-[11px] font-medium text-white/20 italic pl-4">* 마우스나 터치로 조작 가능한 리모컨 UI가 화면에 나타납니다.</p>
                </div>

                {/* OPTION 07: Wireframe View Setting */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    <label className="text-[14px] font-bold text-white uppercase tracking-widest">07. 와이어프레임 뷰 설정</label>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {[
                      { label: '원본 화면 (디폴트)', val: false },
                      { label: '와이어프레임 (블루프린트)', val: true }
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setIsWireframeMode(item.val);
                          localStorage.setItem('tvhome-wireframe-mode', String(item.val));
                        }}
                        className={`flex-1 py-3 text-[12px] font-medium tracking-tight rounded-xl transition-all ${isWireframeMode === item.val ? 'bg-white text-black shadow-lg' : 'text-white/20 hover:text-white/40'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-white/20 italic pl-4">* 화면을 와이어프레임(블루프린트) 형식으로 볼 수 있는 모드입니다.</p>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                <div className="flex gap-3">
                  <button
                    onClick={togglePower}
                    className={`p-6 rounded-3xl flex items-center justify-center transition-all duration-300 border-2 ${isPowerOff
                        ? 'bg-red-600 text-white border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.4)]'
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white hover:text-black hover:border-white'
                      }`}
                    title={isPowerOff ? "Power On" : "Power Off"}
                  >
                    <Power size={24} strokeWidth={3} />
                  </button>
                  <button
                    onClick={restartSimulator}
                    className="flex-1 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3"
                  >
                    Apply & Restart
                  </button>
                </div>
                <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Ready to simulate</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* POWER OFF OVERLAY */}
      <AnimatePresence>
        {isPowerOff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={togglePower}
            className="absolute inset-0 bg-black z-[2000] cursor-pointer group"
          >
            {/* Bottom-Right Power Button */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute bottom-12 right-12 flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.2)] group-hover:bg-red-600/30 group-hover:border-red-500/50 transition-all duration-500">
                <Power size={36} className="text-red-500/80 group-hover:text-white transition-colors" strokeWidth={2.5} />
              </div>
              <span className="text-red-500/40 font-bold tracking-[0.2em] uppercase text-[10px] group-hover:text-red-400/60 transition-colors">
                CLICK TO POWER ON
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
