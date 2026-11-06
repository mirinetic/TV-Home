import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio, Play, Clock, Bell, BellRing, Rocket, Car, Swords, Puzzle, Trophy, Ghost, Music, Crown, Mountain, Zap,
  Target, Gamepad2, Dice5, Brain, Fish, Bike, LayoutGrid, CalendarDays, Newspaper, Film, Baby, Sparkles, Plus,
  ListChecks, Images, Heart, Gem, PlayCircle, Cloud, Joystick, Orbit, Flame, Layers
} from 'lucide-react';
import { APPS, RECOMMENDATIONS } from '../constants';
import { launchApp } from '../native';

// The four centre tabs of the top bar: 라이브, 게임, 아트, 앱스, laid out after the TV's own pages.
// Each page takes the remote while its content is focused (`active`): arrows move, OK acts, Up from
// the first row hands focus back to the top bar (onUp). Back is left to the app (back to the top bar).

type PageProps = { active: boolean; onUp: () => void; isWireframeMode?: boolean };

const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];

/** Rows of items; remembers the column in each row. `block` pauses it (an overlay has the keys). */
function useRows(active: boolean, lens: number[], onUp: () => void, onOk: (r: number, c: number) => void, block = false) {
  const [r, setR] = useState(0);
  const [cols, setCols] = useState<number[]>(() => lens.map(() => 0));
  const ref = useRef({ r, cols, lens, onUp, onOk, block });
  ref.current = { r, cols, lens, onUp, onOk, block };
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const s = ref.current;
      if (s.block || !KEYS.includes(e.key)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const c = Math.min(s.cols[s.r] || 0, Math.max(0, s.lens[s.r] - 1));
      if (e.key === 'ArrowUp') { if (s.r === 0) s.onUp(); else setR(s.r - 1); }
      else if (e.key === 'ArrowDown') { if (s.r < s.lens.length - 1) setR(s.r + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const n = Math.max(0, Math.min(s.lens[s.r] - 1, c + (e.key === 'ArrowLeft' ? -1 : 1)));
        setCols(prev => { const next = [...prev]; next[s.r] = n; return next; });
      } else if (e.key === 'Enter') s.onOk(s.r, c);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active]);
  const col = (row: number) => Math.min(cols[row] || 0, Math.max(0, lens[row] - 1));
  return { r, col, setR };
}

/** Keys for an overlay (guide, viewer): everything goes to it; Back closes. */
function useOverlayKeys(open: boolean, onKey: (k: string) => void, onClose: () => void) {
  const ref = useRef({ onKey, onClose });
  ref.current = { onKey, onClose };
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (![...KEYS, 'Escape', 'Backspace'].includes(e.key)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.key === 'Escape' || e.key === 'Backspace') ref.current.onClose(); else ref.current.onKey(e.key);
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [open]);
}

function seeded(n: number) { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); }
const pad = (n: number) => String(n).padStart(2, '0');
const hm = (t: Date | number) => { const d = new Date(t); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };

function Toast({ text }: { text: string }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed left-1/2 -translate-x-1/2 bottom-16 z-[800] px-10 py-5 rounded-full bg-zinc-900/95 border border-white/15 text-white text-[26px] font-medium shadow-2xl whitespace-nowrap">
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function useToast(): [string, (t: string) => void] {
  const [t, setT] = useState('');
  const timer = useRef<number | undefined>(undefined);
  return [t, (text: string) => { setT(text); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setT(''), 2600); }];
}

/** Focus look shared by all cards: white frame, slight lift. */
const ring = (on: boolean, wire?: boolean) => on
  ? (wire ? 'ring-4 ring-cyan-400' : 'ring-[5px] ring-white shadow-[0_30px_60px_rgba(0,0,0,0.7)] scale-[1.04]')
  : (wire ? 'ring-1 ring-cyan-500/30' : 'ring-1 ring-white/5');

function RowTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-[24px] font-medium tracking-tight text-white/85 mb-4 px-1 ${className}`}>{children}</h3>;
}
function Wire({ label, className = '' }: { label: string; className?: string }) {
  return <div className={`bg-[#111c30] flex items-center justify-center font-mono text-cyan-400 text-base text-center p-2 ${className}`}>[ {label} ]</div>;
}

/** The scrolling frame under the top bar. */
function Scroller({ y, children }: { y: number; children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full pt-[150px]">
      <div className="h-[930px] overflow-hidden pt-4">
        <motion.div animate={{ y }} transition={{ type: 'tween', duration: 0.22 }} className="px-20">{children}</motion.div>
      </div>
    </div>
  );
}
const rowX = (c: number, n: number, step: number, visible: number) => -Math.max(0, Math.min(c - 1, n - visible)) * step;

/* ================================================================ 라이브 ================================================================ */

type Channel = { no: number; name: string; cat: string; color: [string, string]; shows: string[] };
const CHANNELS: Channel[] = [
  { no: 101, name: '코브 뉴스24', cat: 'news', color: ['#1d4ed8', '#0b1a3a'], shows: ['뉴스 브리핑', '경제 투데이', '세계는 지금', '오후 뉴스 와이드', '날씨와 생활'] },
  { no: 102, name: '무비 플러스', cat: 'movie', color: ['#9f1239', '#2a0710'], shows: ['토요 명화극장', '시네마 클래식', '심야 스릴러', '가족 영화관', '단편 영화제'] },
  { no: 103, name: '스포츠 원', cat: 'sports', color: ['#15803d', '#05210f'], shows: ['프로야구 하이라이트', '축구 라이브', '골프 매거진', '스포츠 뉴스', 'e스포츠 리그'] },
  { no: 104, name: '키즈 랜드', cat: 'kids', color: ['#f59e0b', '#3a2203'], shows: ['꼬마 탐험대', '노래하는 동물원', '블록 친구들', '그림책 극장', '과학 놀이터'] },
  { no: 105, name: '다큐 월드', cat: 'life', color: ['#0e7490', '#04232b'], shows: ['지구의 바다', '도시의 밤', '오래된 길', '사막의 생명', '하늘에서 본 세계'] },
  { no: 106, name: '뮤직 라이브', cat: 'life', color: ['#7c3aed', '#1c0a3d'], shows: ['라이브 온 스테이지', '차트 톱 20', '어쿠스틱 세션', '재즈 나잇', '플레이리스트'] },
  { no: 107, name: '쿠킹 채널', cat: 'life', color: ['#ea580c', '#3a1503'], shows: ['오늘의 집밥', '세계의 길거리 음식', '베이킹 클래스', '셰프의 비밀', '15분 요리'] },
  { no: 108, name: '시사 토론', cat: 'news', color: ['#475569', '#0f172a'], shows: ['100분 토론', '시사 포커스', '이슈 인사이드', '국회 브리핑', '심층 리포트'] },
  { no: 109, name: '코믹 TV', cat: 'movie', color: ['#db2777', '#2a0516'], shows: ['시트콤 정주행', '코미디 스테이지', '웃음 극장', '개그 클래식', '스탠드업 나잇'] },
  { no: 110, name: '트래블 TV', cat: 'life', color: ['#0891b2', '#04222a'], shows: ['걸어서 유럽', '섬 여행 일기', '기차로 떠나요', '캠핑 가이드', '숨은 맛집 여행'] },
];
const CATS = [
  { k: 'guide', label: '편성표', icon: CalendarDays, c: ['#0f766e', '#14b8a6'] },
  { k: 'news', label: '뉴스 · 시사', icon: Newspaper, c: ['#0e7490', '#22d3ee'] },
  { k: 'movie', label: '영화 · 코미디', icon: Film, c: ['#6d28d9', '#a78bfa'] },
  { k: 'sports', label: '스포츠', icon: Trophy, c: ['#15803d', '#4ade80'] },
  { k: 'kids', label: '키즈', icon: Baby, c: ['#b45309', '#fbbf24'] },
  { k: 'life', label: '라이프 · 음악', icon: Sparkles, c: ['#be185d', '#f472b6'] },
];
const SLOT = 30 * 60 * 1000;

function ChannelArt({ ch, show, big, wire }: { ch: Channel; show?: string; big?: boolean; wire?: boolean }) {
  if (wire) return <Wire label={`CH ${ch.no}`} className="w-full h-full" />;
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${ch.color[0]}, ${ch.color[1]})` }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute rounded-full border border-white/15"
          style={{ width: 300 + i * 220, height: 300 + i * 220, right: -120 - i * 110, bottom: -160 - i * 110 }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 4 + i, repeat: Infinity }} />
      ))}
      <div className={`absolute font-black tracking-tight text-white/90 ${big ? 'right-16 bottom-14 text-[80px]' : 'left-7 bottom-6 text-[34px]'}`}>{big ? ch.name : (show || ch.name)}</div>
      {!big && <div className="absolute left-7 top-5 text-white/70 text-lg font-medium">CH {ch.no} · {ch.name}</div>}
    </div>
  );
}

function useGuide() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  const base = Math.floor(now / SLOT) * SLOT;
  const guide = useMemo(() => CHANNELS.map((ch, ci) => {
    const list: { title: string; start: number; end: number }[] = [];
    let t = base - SLOT * Math.floor(seeded(ci + base / SLOT) * 2);
    let k = Math.floor(base / SLOT) + ci * 3;
    while (t < base + 5 * SLOT) {
      const len = SLOT * (1 + Math.floor(seeded(k * 7 + ci) * 3));
      list.push({ title: ch.shows[k % ch.shows.length], start: t, end: t + len });
      t += len; k++;
    }
    return list.filter(p => p.end > now && p.start < base + 4 * SLOT);
  }), [base, now]);
  return { now, base, guide };
}

/** 편성표: the two-hour grid, opened from the 편성표 button. */
function GuideOverlay({ open, onClose, wire }: { open: boolean; onClose: () => void; wire?: boolean }) {
  const { now, base, guide } = useGuide();
  const [toast, show] = useToast();
  const [reserved, setReserved] = useState<Record<string, boolean>>({});
  const [r, setR] = useState(0);
  const [c, setC] = useState(0);
  const cc = Math.min(c, guide[r].length - 1);
  useOverlayKeys(open, k => {
    if (k === 'ArrowUp') setR(v => Math.max(0, v - 1));
    else if (k === 'ArrowDown') setR(v => Math.min(CHANNELS.length - 1, v + 1));
    else if (k === 'ArrowLeft') setC(Math.max(0, cc - 1));
    else if (k === 'ArrowRight') setC(Math.min(guide[r].length - 1, cc + 1));
    else if (k === 'Enter') {
      const p = guide[r][cc], ch = CHANNELS[r], key = `${ch.no}-${p.start}`;
      if (p.start <= now) { if (!launchApp('Live TV')) show(`CH ${ch.no} ${ch.name} · 라이브 TV 앱이 없어 미리보기만 보여 줘요`); }
      else { setReserved(v => ({ ...v, [key]: !v[key] })); show(reserved[key] ? `'${p.title}' 예약을 취소했어요` : `'${p.title}' ${hm(p.start)} 시청 예약했어요`); }
    }
  }, onClose);
  const W = 1240, span = 4 * SLOT, x = (t: number) => Math.max(0, Math.min(W, ((t - base) / span) * W));
  const top = Math.max(0, Math.min(r - 3, CHANNELS.length - 8));
  const p = guide[r][cc], ch = CHANNELS[r];
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] bg-[#07090f] px-20 pt-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-white/50 text-2xl">편성표 · CH {ch.no} {ch.name}</div>
              <div className="text-white text-[52px] font-bold tracking-tight mt-1">{p.title}</div>
              <div className="flex items-center gap-3 text-white/60 text-2xl mt-2"><Clock size={24} />{hm(p.start)} – {hm(p.end)}{p.start > now ? ' · 방송 예정' : ' · 방송 중'}</div>
            </div>
            <div className="text-white/40 text-xl">OK {p.start <= now ? '시청' : '예약'} · 뒤로 닫기</div>
          </div>
          <div className="flex text-white/45 text-xl mb-3" style={{ paddingLeft: 280 }}>
            {[0, 1, 2, 3].map(i => <div key={i} style={{ width: W / 4 }}>{hm(base + i * SLOT)}</div>)}
          </div>
          <div className="relative">
            <div className="absolute -top-2 bottom-0 w-[3px] bg-red-500/80 z-10" style={{ left: 280 + x(now) }} />
            <div className="flex flex-col gap-3">
              {CHANNELS.slice(top, top + 8).map((chn, k) => {
                const ci = top + k;
                return (
                  <div key={chn.no} className="flex items-center h-[76px]">
                    <div className={`w-[264px] mr-4 h-full rounded-2xl flex items-center gap-4 px-5 ${ci === r ? 'bg-white/15' : 'bg-white/5'}`}>
                      <span className="font-mono text-white/50 text-xl">{chn.no}</span>
                      <span className="text-white text-[22px] font-semibold truncate">{chn.name}</span>
                    </div>
                    <div className="relative h-full" style={{ width: W }}>
                      {guide[ci].map((pr, i) => {
                        const on = ci === r && i === cc, left = x(pr.start), w = x(pr.end) - left, key = `${chn.no}-${pr.start}`;
                        if (w <= 4) return null;
                        return (
                          <div key={pr.start} style={{ left, width: w - 8 }}
                            className={`absolute top-0 h-full rounded-2xl px-5 flex items-center gap-3 overflow-hidden ${wire ? (on ? 'border-2 border-cyan-400 text-cyan-300' : 'border border-cyan-500/30 text-cyan-500/70') : on ? 'bg-white text-black' : pr.start <= now ? 'bg-white/[0.12] text-white' : 'bg-white/[0.06] text-white/80'}`}>
                            {pr.start <= now && <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-red-500" />}
                            <span className="text-[21px] font-medium truncate">{pr.title}</span>
                            {reserved[key] && <BellRing size={20} className="shrink-0" />}
                            {!reserved[key] && on && pr.start > now && <Bell size={20} className="shrink-0 opacity-50" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Toast text={toast} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LivePage({ active, onUp, isWireframeMode: wire }: PageProps) {
  const { now, guide } = useGuide();
  const [toast, show] = useToast();
  const [cat, setCat] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const onNow = CHANNELS.map((ch, i) => ({ ch, p: guide[i][0] })).filter(x => !cat || x.ch.cat === cat);
  const [heroCh, setHeroCh] = useState(0);
  const watch = (ch: Channel) => { if (!launchApp('Live TV')) show(`CH ${ch.no} ${ch.name} · 라이브 TV 앱이 없어 미리보기만 보여 줘요`); };
  const { r, col } = useRows(active, [1, Math.max(1, onNow.length), CATS.length], onUp, (row, c) => {
    if (row === 0) watch(CHANNELS[heroCh]);
    else if (row === 1 && onNow[c]) watch(onNow[c].ch);
    else if (row === 2) {
      const k = CATS[c].k;
      if (k === 'guide') setGuideOpen(true);
      else { setCat(cat === k ? '' : k); show(cat === k ? '모든 채널을 보여 줘요' : `'${CATS[c].label}' 채널만 보여 줘요`); }
    }
  }, guideOpen);
  // the hero follows the focused 'on now' card
  useEffect(() => { if (r === 1 && onNow[col(1)]) setHeroCh(CHANNELS.indexOf(onNow[col(1)].ch)); }, [r, col(1), cat]);
  const ch = CHANNELS[heroCh], p = guide[heroCh][0];
  const CW = 440, GAP = 32;
  return (
    <div className="w-full h-full">
      {/* hero: channel and show on the left, the live picture on the right */}
      <div className="relative h-[520px]">
        <div className="absolute right-0 top-0 w-[1180px] h-full overflow-hidden">
          <ChannelArt ch={ch} big wire={wire} />
          {!wire && <div className="absolute inset-y-0 left-0 w-[520px] bg-gradient-to-r from-black to-transparent" />}
          {!wire && <div className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-black to-transparent" />}
        </div>
        <div className="absolute left-20 top-[190px] w-[760px] flex flex-col gap-5">
          <div className="flex items-center gap-3 text-white/60 text-[22px]">
            <img src="/assets/apps/tv-plus.webp" alt="" className="w-9 h-9 rounded-lg" />
            <span>TV Plus</span><span className="w-px h-5 bg-white/30" /><span>{ch.no}</span><span className="w-px h-5 bg-white/30" /><span>{ch.name}</span>
          </div>
          <div className="text-white text-[46px] font-semibold tracking-tight leading-tight truncate">{p.title}</div>
          <div className="w-[300px] h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-sky-400" style={{ width: `${Math.min(100, Math.max(0, ((now - p.start) / (p.end - p.start)) * 100))}%` }} />
          </div>
          <span className={`mt-6 w-fit px-14 py-4 rounded-full text-[24px] font-medium transition-all ${active && r === 0 ? (wire ? 'bg-cyan-500 text-black' : 'bg-white text-black scale-105') : 'bg-white/10 text-white'}`}>Watch Now</span>
        </div>
      </div>

      <div className="px-20 -mt-10 relative">
        <RowTitle>지금 방송 중{cat ? ` · ${CATS.find(x => x.k === cat)?.label}` : ''}</RowTitle>
        <motion.div animate={{ x: rowX(col(1), onNow.length, CW + GAP, 3) }} transition={{ type: 'tween', duration: 0.15 }} className="flex" style={{ gap: GAP }}>
          {onNow.map((x, i) => (
            <div key={x.ch.no} className={`shrink-0 aspect-[16/9] rounded-3xl overflow-hidden transition-all ${ring(active && r === 1 && i === col(1), wire)}`} style={{ width: CW }}>
              <ChannelArt ch={x.ch} show={x.p.title} wire={wire} />
            </div>
          ))}
        </motion.div>
        <div className="flex mt-12" style={{ gap: 24 }}>
          {CATS.map((c, i) => {
            const Icon = c.icon, on = active && r === 2 && i === col(2), sel = cat === c.k;
            return (
              <div key={c.k} className={`relative shrink-0 w-[272px] h-[96px] rounded-[1.6rem] overflow-hidden flex items-center justify-center gap-4 transition-all ${ring(on, wire)}`}
                style={wire ? undefined : { background: `linear-gradient(120deg, ${c.c[0]}, ${c.c[1]})` }}>
                {!wire && <Icon size={120} className="absolute -right-4 -bottom-6 text-white/15" />}
                <Icon size={30} className="text-white relative" />
                <span className={`relative text-[24px] font-semibold ${wire ? 'text-cyan-400' : 'text-white'}`}>{c.label}</span>
                {sel && <span className="absolute top-3 right-4 w-3 h-3 rounded-full bg-white" />}
              </div>
            );
          })}
        </div>
      </div>
      <GuideOverlay open={guideOpen} onClose={() => setGuideOpen(false)} wire={wire} />
      <Toast text={toast} />
    </div>
  );
}

/* ================================================================ 게임 ================================================================ */

type Game = { title: string; genre: string; icon: any; c: [string, string] };
const g = (title: string, genre: string, icon: any, c: [string, string]): Game => ({ title, genre, icon, c });
const SERVICES = [
  { name: '코브 클라우드', short: 'COVE', icon: Cloud, c: '#2563eb' },
  { name: '아케이드 원', short: 'ARCADE', icon: Joystick, c: '#16a34a' },
  { name: '플레이스트림', short: 'STREAM', icon: Orbit, c: '#7c3aed' },
  { name: '네오 게임즈', short: 'NEO', icon: Flame, c: '#0f172a' },
  { name: '부스트 플레이', short: 'BOOST', icon: Rocket, c: '#3b82f6' },
  { name: '팝 아케이드', short: 'POP', icon: Gamepad2, c: '#db2777' },
  { name: '레트로 박스', short: 'RETRO', icon: Layers, c: '#9333ea' },
];
const EXPLORE: Game[] = [g('스타 드리프트', '우주 레이싱', Rocket, ['#4338ca', '#0f0a2e']), g('던전 오브 에코', 'RPG', Swords, ['#b45309', '#2a1503']), g('킹덤 라인', '전략', Crown, ['#a16207', '#2a1c03']), g('서밋 클라이머', '어드벤처', Mountain, ['#0369a1', '#03182a'])];
const GAME_ROWS: { title: string; service?: number; items: Game[] }[] = [
  { title: '이번 주 클라우드 신작', items: [g('네온 하이웨이', '레이싱', Car, ['#db2777', '#2a0516']), g('볼트 러시', '액션', Zap, ['#ca8a04', '#291d02']), g('리듬 웨이브', '리듬', Music, ['#7c3aed', '#1a0838']), g('고스트 하우스', '공포', Ghost, ['#475569', '#0b0f17']), g('큐브 퍼즐 랩', '퍼즐', Puzzle, ['#0d9488', '#032623']), g('타깃 포인트', '슈팅', Target, ['#dc2626', '#2a0606'])] },
  { title: '인기 게임으로 실력 발휘', items: [g('챔피언 리그 2026', '스포츠', Trophy, ['#16a34a', '#04200d']), g('브레인 퀴즈쇼', '퀴즈', Brain, ['#9333ea', '#1d0630']), g('바다 낚시왕', '캐주얼', Fish, ['#0284c7', '#03172a']), g('미니 바이크', '캐주얼', Bike, ['#65a30d', '#132003']), g('주사위 파티', '보드게임', Dice5, ['#e11d48', '#2a0410'])] },
  { title: '팝 아케이드', service: 5, items: [g('아케이드 클래식', '아케이드', Gamepad2, ['#f97316', '#2a1003']), g('스페이스 디펜스', '슈팅', Rocket, ['#1d4ed8', '#050b24']), g('블록 브레이커', '아케이드', Layers, ['#be123c', '#2a0310']), g('미로 탈출', '퍼즐', Puzzle, ['#059669', '#022116'])] },
];

function GameArt({ x, wire, big }: { x: Game; wire?: boolean; big?: boolean }) {
  if (wire) return <Wire label={`GAME: ${x.title}`} className="w-full h-full" />;
  const Icon = x.icon;
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: `radial-gradient(120% 120% at 75% 15%, ${x.c[0]}, ${x.c[1]})` }}>
      <Icon className="absolute text-white/25" style={{ right: big ? 30 : 16, top: big ? 24 : 16 }} size={big ? 190 : 150} strokeWidth={1.4} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className={`absolute left-6 bottom-5 font-black tracking-tight text-white leading-tight ${big ? 'text-[38px]' : 'text-[30px] right-6'}`}>{x.title}</div>
    </div>
  );
}

export function GamePage({ active, onUp, isWireframeMode: wire }: PageProps) {
  const [toast, show] = useToast();
  const lens = [1 + EXPLORE.length, SERVICES.length + 2, ...GAME_ROWS.map(row => row.items.length + (row.service !== undefined ? 1 : 0))];
  const { r, col } = useRows(active, lens, onUp, (row, c) => {
    if (row === 0) show(c === 0 ? '게임 허브를 내 취향에 맞게 꾸미는 화면이에요 (시뮬레이션)' : `'${EXPLORE[c - 1].title}' · 게임 실행은 시뮬레이션이에요`);
    else if (row === 1) show(c === 0 ? '블루투스 컨트롤러 연결 (시뮬레이션)' : c === SERVICES.length + 1 ? '서비스 순서 편집 (시뮬레이션)' : `'${SERVICES[c - 1].name}' 서비스 (시뮬레이션)`);
    else { const gr = GAME_ROWS[row - 2], off = gr.service !== undefined ? 1 : 0; show(c < off ? `'${SERVICES[gr.service!].name}' 전체 게임 (시뮬레이션)` : `'${gr.items[c - off].title}' · 게임 실행은 시뮬레이션이에요`); }
  });
  const tops = [300, 650, 860, 1230, 1600];
  const y = r <= 1 ? 0 : -(tops[r] - 40);
  const SQ = 300, GAP = 28;
  return (
    <div className="w-full h-full relative">
      {!wire && <div className="absolute inset-x-0 top-0 h-[700px] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(80%_100%_at_70%_0%,#3b1d78_0%,#120a2a_55%,#000_100%)]" />
        <Gamepad2 size={520} className="absolute right-[120px] top-[60px] text-violet-400/20 rotate-[-18deg]" strokeWidth={1} />
        <Joystick size={300} className="absolute right-[640px] top-[120px] text-violet-300/10 rotate-12" strokeWidth={1} />
        <div className="absolute inset-x-0 bottom-0 h-[240px] bg-gradient-to-t from-black to-transparent" />
      </div>}
      <Scroller y={y}>
        <div className="h-[300px] pt-16 relative">
          <div className="text-white text-[46px] font-semibold tracking-tight">게이밍 허브에 오신 걸 환영해요</div>
          <div className="text-white/70 text-[24px] mt-2">좋아하는 게임을 콘솔 없이 바로 즐겨 보세요.</div>
          <div className="absolute right-0 bottom-10 flex items-center gap-3 text-white/80 text-[22px]"><Gamepad2 size={28} className="text-violet-300" />TV Home Gaming Hub</div>
        </div>
        {/* row 0: 나만의 허브 + 게임 둘러보기 */}
        <div className="h-[350px]">
          <div className="flex text-[24px] font-medium text-white/85 mb-4"><span style={{ width: 400 + GAP }}>나만의 허브</span><span>게임 둘러보기</span></div>
          <div className="flex" style={{ gap: GAP }}>
            <div className={`relative w-[400px] h-[230px] rounded-3xl overflow-hidden shrink-0 transition-all ${ring(active && r === 0 && col(0) === 0, wire)}`}
              style={wire ? undefined : { background: 'linear-gradient(135deg,#1e40af,#312e81)' }}>
              {!wire && <Dice5 size={200} className="absolute -right-6 -top-6 text-white/15" />}
              <span className="absolute left-8 bottom-8 text-white text-[34px] font-semibold">시작하기</span>
            </div>
            {EXPLORE.map((x, i) => (
              <div key={x.title} className={`w-[420px] h-[230px] rounded-3xl overflow-hidden shrink-0 transition-all ${ring(active && r === 0 && col(0) === i + 1, wire)}`}><GameArt x={x} big wire={wire} /></div>
            ))}
          </div>
        </div>
        {/* row 1: services */}
        <div className="h-[210px] flex items-center gap-6">
          <div className={`w-[120px] h-[120px] rounded-[2rem] bg-white/10 flex items-center justify-center relative transition-all ${ring(active && r === 1 && col(1) === 0, wire)}`}>
            <Gamepad2 size={48} className="text-white/80" /><Plus size={22} className="absolute top-4 right-4 text-white" />
          </div>
          <div className="w-px h-20 bg-white/20 mx-2" />
          {SERVICES.map((s, i) => {
            const Icon = s.icon, on = active && r === 1 && col(1) === i + 1;
            return (
              <div key={s.name} className="flex flex-col items-center gap-2">
                <div className={`w-[120px] h-[120px] rounded-[2rem] flex flex-col items-center justify-center gap-1 transition-all ${ring(on, wire)}`} style={wire ? undefined : { background: s.c }}>
                  <Icon size={44} className="text-white" /><span className="text-white text-[13px] font-black tracking-wider">{s.short}</span>
                </div>
                <span className={`text-[16px] h-5 ${on ? 'text-white' : 'text-transparent'}`}>{s.name}</span>
              </div>
            );
          })}
          <div className={`w-[84px] h-[84px] rounded-full bg-white/10 flex items-center justify-center transition-all ${ring(active && r === 1 && col(1) === SERVICES.length + 1, wire)}`}><ListChecks size={34} className="text-white/80" /></div>
        </div>
        {/* game rows */}
        {GAME_ROWS.map((gr, ri) => {
          const R = ri + 2, off = gr.service !== undefined ? 1 : 0, n = gr.items.length + off, c = col(R);
          const s = gr.service !== undefined ? SERVICES[gr.service] : null;
          return (
            <section key={gr.title} className="h-[370px]">
              <RowTitle>{gr.title}</RowTitle>
              <motion.div animate={{ x: rowX(c, n, SQ + GAP, 5) }} transition={{ type: 'tween', duration: 0.15 }} className="flex" style={{ gap: GAP }}>
                {s && (
                  <div className="shrink-0 flex flex-col gap-3" style={{ width: SQ }}>
                    <div className={`h-[250px] rounded-3xl flex items-center justify-center transition-all ${ring(active && r === R && c === 0, wire)}`} style={wire ? undefined : { background: s.c }}>
                      <s.icon size={130} className="text-white" />
                    </div>
                    <span className="text-white/70 text-[20px]">{s.name}</span>
                  </div>
                )}
                {gr.items.map((x, i) => {
                  const on = active && r === R && c === i + off;
                  return (
                    <div key={x.title} className="shrink-0 flex flex-col gap-3" style={{ width: SQ }}>
                      <div className={`h-[250px] rounded-3xl overflow-hidden transition-all ${ring(on, wire)}`}><GameArt x={x} wire={wire} /></div>
                      <span className={`text-[20px] truncate ${on ? 'text-white' : 'text-transparent'}`}>{x.title} · {x.genre}</span>
                    </div>
                  );
                })}
              </motion.div>
            </section>
          );
        })}
      </Scroller>
      <Toast text={toast} />
    </div>
  );
}

/* ================================================================ 아트 ================================================================ */

type Art = { k: string; title: string; artist: string; year: string; place: string; w: number; h: number };
const A = (k: string, title: string, artist: string, year: string, place: string, w: number, h: number): Art => ({ k, title, artist, year, place, w, h });
const ART: Record<string, Art> = Object.fromEntries([
  A('starry', '별이 빛나는 밤', '빈센트 반 고흐', '1889', '뉴욕 현대미술관', 1280, 1014),
  A('impression', '인상, 해돋이', '클로드 모네', '1872', '마르모탕 모네 미술관', 1280, 993),
  A('lilies', '수련', '클로드 모네', '1906', '시카고 미술관', 1280, 1230),
  A('wave', '가나가와 해변의 높은 파도 아래', '가쓰시카 호쿠사이', '1831년경', '목판화', 1280, 860),
  A('pearl', '진주 귀걸이를 한 소녀', '요하네스 페르메이르', '1665년경', '마우리츠하위스 미술관', 1280, 1516),
  A('kiss', '키스', '구스타프 클림트', '1908', '벨베데레 미술관', 1280, 1281),
  A('jatte', '그랑드 자트 섬의 일요일 오후', '조르주 쇠라', '1884–1886', '시카고 미술관', 1280, 852),
  A('sunflowers', '해바라기', '빈센트 반 고흐', '1888', '런던 내셔널 갤러리', 1280, 1615),
  A('moulin', '물랭 드 라 갈레트의 무도회', '피에르오귀스트 르누아르', '1876', '오르세 미술관', 1280, 954),
  A('wanderer', '안개 바다 위의 방랑자', '카스파르 다비트 프리드리히', '1818년경', '함부르크 미술관', 1280, 1639),
  A('temeraire', '전함 테메레르', '윌리엄 터너', '1839', '런던 내셔널 갤러리', 1280, 951),
  A('kandinsky', '구성 8', '바실리 칸딘스키', '1923', '구겐하임 미술관', 1280, 887),
  A('parasol', '양산을 든 여인', '클로드 모네', '1875', '워싱턴 내셔널 갤러리', 1280, 1590),
  A('cafe', '밤의 카페 테라스', '빈센트 반 고흐', '1888', '크뢸러뮐러 미술관', 1280, 1605),
  A('hiroshige', '오하시 다리의 소나기', '우타가와 히로시게', '1857', '목판화', 1280, 1999),
  A('inwang', '인왕제색도', '정선', '1751', '국립중앙박물관', 1280, 743),
].map(a => [a.k, a]));
const COLLECTIONS: { title: string; keys: string[] }[] = [
  { title: '동양의 풍경', keys: ['wave', 'inwang', 'hiroshige'] },
  { title: '반 고흐의 밤과 낮', keys: ['starry', 'cafe', 'sunflowers'] },
  { title: '빛을 그린 인상주의', keys: ['impression', 'lilies', 'parasol', 'moulin', 'jatte'] },
  { title: '고전과 낭만', keys: ['pearl', 'wanderer', 'temeraire', 'kiss', 'kandinsky'] },
];
const POPULAR = [
  { t: '우리 지역 인기 작품', n: 20, shape: 'blob', c: ['#22d3ee', '#2563eb'] },
  { t: '글로벌 TOP 20', n: 20, shape: 'bars', c: ['#22d3ee', '#6366f1'] },
  { t: '이번 주 사랑받은 테마', n: 20, shape: 'rings', c: ['#3b82f6', '#60a5fa'] },
  { t: '이번 주 많이 본 미술관', n: 20, shape: 'heart', c: ['#f472b6', '#a78bfa'] },
  { t: '이번 주 풍경화 TOP 20', n: 20, shape: 'dot', c: ['#38bdf8', '#0ea5e9'] },
];
const CURATIONS = [
  { t: '봄을 담은 명작', n: 5, k: 'parasol' }, { t: '반 고흐 컬렉션', n: 3, k: 'starry' }, { t: '물과 빛', n: 4, k: 'lilies' },
  { t: '바다와 파도', n: 3, k: 'wave' }, { t: '사람이 있는 풍경', n: 4, k: 'moulin' }, { t: '추상의 시작', n: 2, k: 'kandinsky' },
];
const artSrc = (k: string) => `/assets/art/${k}.webp`;
function ArtImg({ k, wire, className = '', pos }: { k: string; wire?: boolean; className?: string; pos?: string }) {
  if (wire) return <Wire label={`ART: ${ART[k].title}`} className={className} />;
  return <img src={artSrc(k)} alt={ART[k].title} className={`object-cover ${className}`} style={pos ? { objectPosition: pos } : undefined} />;
}

/** Full-screen viewer: ◀ ▶ through the list, OK shows/hides the caption, Back closes. */
function ArtViewer({ list, start, onClose }: { list: string[] | null; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const [caption, setCaption] = useState(true);
  useEffect(() => { setI(start); setCaption(true); }, [list, start]);
  useEffect(() => { if (!list) return; setCaption(true); const t = setTimeout(() => setCaption(false), 4000); return () => clearTimeout(t); }, [list, i]);
  useOverlayKeys(!!list, k => {
    if (!list) return;
    if (k === 'ArrowLeft' || k === 'ArrowRight') setI(v => (v + (k === 'ArrowLeft' ? -1 : 1) + list.length) % list.length);
    else if (k === 'Enter') setCaption(v => !v);
  }, onClose);
  const a = list ? ART[list[i % list.length]] : null;
  return (
    <AnimatePresence>
      {a && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] bg-black">
          <AnimatePresence mode="wait">
            <motion.img key={a.k} src={artSrc(a.k)} alt={a.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full object-contain" />
          </AnimatePresence>
          <motion.div animate={{ opacity: caption ? 1 : 0 }} transition={{ duration: 0.5 }}
            className="absolute inset-x-0 bottom-0 px-20 pb-14 pt-32 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between">
            <div>
              <div className="text-white text-[48px] font-bold tracking-tight">{a.title}</div>
              <div className="text-white/70 text-2xl mt-2">{a.artist} · {a.year} · {a.place}</div>
            </div>
            <div className="text-white/50 text-xl">{list && list.length > 1 ? '◀ ▶ 다음 작품 · ' : ''}OK 정보 · 뒤로 닫기</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PopularShape({ shape, c }: { shape: string; c: string[] }) {
  if (shape === 'bars') return <div className="absolute right-6 bottom-6 w-[110px] h-[70px]"><div className="absolute right-0 top-0 w-[86px] h-[30px] border-[6px]" style={{ borderColor: c[0] }} /><div className="absolute left-0 bottom-0 w-[80px] h-[44px]" style={{ background: c[1] }} /></div>;
  if (shape === 'rings') return <div className="absolute right-6 bottom-6 w-[90px] h-[90px] rounded-full" style={{ background: c[0], boxShadow: `22px -18px 0 -6px transparent, 22px -18px 0 0 ${c[1]}` }} />;
  if (shape === 'heart') return <Heart size={86} className="absolute right-6 bottom-6" style={{ color: c[0], fill: c[1] }} />;
  if (shape === 'dot') return <div className="absolute right-6 bottom-8 w-[70px] h-[70px] rounded-full" style={{ background: `linear-gradient(135deg, ${c[0]}, ${c[1]})` }} />;
  return <div className="absolute right-6 bottom-6 w-[90px] h-[90px] rounded-[40%] rotate-45" style={{ background: `linear-gradient(135deg, ${c[0]}, ${c[1]})` }} />;
}

export function ArtPage({ active, onUp, isWireframeMode: wire }: PageProps) {
  const [toast, show] = useToast();
  const [viewer, setViewer] = useState<{ list: string[]; i: number } | null>(null);
  // row 0: the curated mosaic (6 tiles), row 1: 최근 + 내 아트 스토어, rows 2..: collections (with 모두 보기), then 인기, 큐레이션
  const lens = [6, 4, ...COLLECTIONS.map(c => c.keys.length + 1), POPULAR.length, CURATIONS.length];
  const nC = COLLECTIONS.length;
  const { r, col } = useRows(active, lens, onUp, (row, c) => {
    if (row === 0) {
      const lists = [['lilies', 'parasol', 'impression', 'moulin', 'jatte'], ['wave', 'hiroshige', 'inwang'], ['inwang'], null, ['sunflowers'], ['kiss']];
      if (c === 3) show('오르세 미술관 컬렉션 (시뮬레이션)'); else setViewer({ list: lists[c]!, i: 0 });
    } else if (row === 1) {
      if (c === 0) setViewer({ list: ['moulin'], i: 0 });
      else show(['', '내 사진 (시뮬레이션)', '즐겨찾기 (시뮬레이션)', '아트 멤버십 (시뮬레이션)'][c]);
    } else if (row < 2 + nC) {
      const keys = COLLECTIONS[row - 2].keys;
      setViewer({ list: keys, i: c === 0 ? 0 : c - 1 });
    } else if (row === 2 + nC) show(`'${POPULAR[c].t}' (시뮬레이션)`);
    else { const cu = CURATIONS[c]; setViewer({ list: Object.keys(ART).filter((_, i) => i % 3 === c % 3).slice(0, cu.n), i: 0 }); }
  }, !!viewer);
  const tops = [0, 470, ...COLLECTIONS.map((_, i) => 830 + i * 420), 830 + nC * 420, 830 + nC * 420 + 300];
  const y = r <= 1 ? 0 : -(tops[r] - 40);
  const on = (row: number, c: number) => active && r === row && col(row) === c;
  const card = (row: number, c: number) => `relative rounded-3xl overflow-hidden transition-all ${ring(on(row, c), wire)}`;
  const label = (t: string, sub?: string) => !wire && (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      <div className="absolute left-6 top-5 text-white text-[30px] font-semibold drop-shadow">{t}</div>
      {sub && <div className="absolute left-6 top-[58px] text-white/80 text-[18px]">{sub}</div>}
    </>
  );
  return (
    <div className="w-full h-full">
      <Scroller y={y}>
        {/* curated mosaic */}
        <div className="relative h-[440px]">
          <div className={card(0, 0)} style={{ position: 'absolute', left: 0, top: 0, width: 780, height: 410 }}><ArtImg k="lilies" wire={wire} className="w-full h-full" />{label('봄을 담은 명작', '5점 · 인상주의')}</div>
          <div className={card(0, 1)} style={{ position: 'absolute', left: 808, top: 0, width: 360, height: 410 }}><ArtImg k="wave" wire={wire} className="w-full h-full" pos="30% 50%" />{label('동양의 파도')}</div>
          <div className={card(0, 2)} style={{ position: 'absolute', left: 1196, top: 0, width: 330, height: 191 }}>
            <ArtImg k="inwang" wire={wire} className="w-full h-full" />{label('국립중앙박물관')}
            {!wire && <PlayCircle size={56} className="absolute right-5 bottom-4 text-white/90" />}
          </div>
          <div className={card(0, 3)} style={{ position: 'absolute', left: 1554, top: 0, width: 206, height: 191, background: wire ? undefined : '#d4d4d8' }}>
            {!wire && <div className="absolute inset-0 p-5 flex flex-col justify-between"><span className="text-zinc-900 text-[22px] font-bold leading-tight">오르세 미술관</span><span className="text-zinc-600 text-[16px]">컬렉션 보기</span></div>}
          </div>
          <div className={card(0, 4)} style={{ position: 'absolute', left: 1196, top: 219, width: 210, height: 191 }}><ArtImg k="sunflowers" wire={wire} className="w-full h-full" /></div>
          <div className={card(0, 5)} style={{ position: 'absolute', left: 1434, top: 219, width: 326, height: 191 }}><ArtImg k="kiss" wire={wire} className="w-full h-full" pos="50% 35%" /></div>
        </div>
        {/* 최근 + 내 아트 스토어 */}
        <div className="h-[360px] flex gap-7">
          <div className="w-[400px] shrink-0">
            <RowTitle>최근 본 작품</RowTitle>
            <div className={card(1, 0)} style={{ width: 400, height: 230 }}><ArtImg k="moulin" wire={wire} className="w-full h-full" /></div>
          </div>
          <div className="w-px bg-white/10 my-14" />
          <div>
            <RowTitle>내 아트 스토어</RowTitle>
            <div className="flex gap-7">
              {[['내 사진', '#db2777', '#f472b6', Images], ['즐겨찾기', '#be123c', '#fb7185', Heart], ['멤버십', '#0e7490', '#38bdf8', Gem]].map(([t, c1, c2, Icon]: any, i) => (
                <div key={t} className={card(1, i + 1)} style={{ width: 400, height: 230, background: wire ? undefined : `linear-gradient(135deg, ${c1}, ${c2})` }}>
                  {!wire && <Icon size={200} className="absolute -right-8 -bottom-10 text-white/15" />}
                  <span className={`absolute inset-0 flex items-center justify-center text-[30px] font-semibold ${wire ? 'text-cyan-400' : 'text-white'}`}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* collections, each with 모두 보기 on the left; the focused work's title shows under the row */}
        {COLLECTIONS.map((co, ci) => {
          const R = 2 + ci, c = col(R), focusedArt = c > 0 ? ART[co.keys[c - 1]] : null;
          return (
            <section key={co.title} className="h-[420px] flex">
              <div className="w-[200px] shrink-0 flex flex-col items-center justify-center gap-4 pt-10">
                <div className={`w-[96px] h-[96px] rounded-full flex items-center justify-center transition-all ${wire ? '' : 'bg-white/90'} ${ring(on(R, 0), wire)}`}><Play size={36} className={wire ? 'text-cyan-400' : 'text-zinc-900'} /></div>
                <span className="text-white/80 text-[20px]">모두 보기</span>
              </div>
              <div className="flex-1 min-w-0">
                <RowTitle>{co.title}</RowTitle>
                <motion.div animate={{ x: rowX(c - 1, co.keys.length, 412, 3) }} transition={{ type: 'tween', duration: 0.15 }} className="flex gap-7">
                  {co.keys.map((k, i) => (
                    <div key={k} className={`${card(R, i + 1)} shrink-0`} style={{ width: 384, height: 216 }}><ArtImg k={k} wire={wire} className="w-full h-full" /></div>
                  ))}
                </motion.div>
                <div className="h-[100px] mt-5">
                  {active && r === R && focusedArt && <>
                    <div className="text-white text-[38px] font-semibold tracking-tight">{focusedArt.title} ({focusedArt.year})</div>
                    <div className="text-white/60 text-[20px] mt-1">{focusedArt.artist} · {focusedArt.place}</div>
                  </>}
                </div>
              </div>
            </section>
          );
        })}
        {/* 인기 */}
        <section className="h-[300px]">
          <RowTitle>인기</RowTitle>
          <div className="flex gap-7">
            {POPULAR.map((p, i) => {
              const f = on(2 + nC, i);
              return (
                <div key={p.t} className={`relative w-[320px] h-[180px] rounded-3xl overflow-hidden shrink-0 p-6 transition-all ${f ? 'bg-white' : 'bg-white/[0.06]'} ${ring(f, wire)}`}>
                  <div className={`text-[22px] font-semibold leading-snug w-[220px] ${f ? 'text-zinc-900' : 'text-white'}`}>{p.t}</div>
                  <div className={`absolute left-6 bottom-5 text-[16px] ${f ? 'text-zinc-500' : 'text-white/50'}`}>{p.n}점</div>
                  {!wire && <PopularShape shape={p.shape} c={p.c} />}
                </div>
              );
            })}
          </div>
        </section>
        {/* 큐레이션 */}
        <section className="h-[460px]">
          <RowTitle>큐레이션</RowTitle>
          <motion.div animate={{ x: rowX(col(3 + nC), CURATIONS.length, 328, 5) }} transition={{ type: 'tween', duration: 0.15 }} className="flex gap-7">
            {CURATIONS.map((cu, i) => (
              <div key={cu.t} className={`relative w-[300px] h-[340px] rounded-3xl overflow-hidden shrink-0 bg-white/[0.06] transition-all ${ring(on(3 + nC, i), wire)}`}>
                <div className="p-6 text-white text-[32px] font-semibold leading-tight">{cu.t}</div>
                <div className="absolute left-6 top-[190px] text-white/50 text-[16px]">{cu.n}점</div>
                <ArtImg k={cu.k} wire={wire} className="absolute inset-x-0 bottom-0 h-[110px] w-full" />
              </div>
            ))}
          </motion.div>
        </section>
      </Scroller>
      <ArtViewer list={viewer?.list ?? null} start={viewer?.i ?? 0} onClose={() => setViewer(null)} />
      <Toast text={toast} />
    </div>
  );
}

/* ================================================================ 앱스 ================================================================ */

type AppItem = { pkg?: string; label: string; img?: string };
type NativeApps = { installedApps?: () => string; launchPackage?: (pkg: string) => boolean };
const nativeApps = (window as unknown as { TVHomeNative?: NativeApps }).TVHomeNative;
const sampleIcon = (name: string) => APPS.find(a => a.name === name)?.icon;
const EDITORS = [
  { name: 'Netflix', note: '새 시즌과 인기 시리즈', shot: RECOMMENDATIONS[2].img },
  { name: 'Prime Video', note: '오리지널 시리즈 모아 보기', shot: RECOMMENDATIONS[0].img },
  { name: 'YouTube', note: '예고편과 클립', shot: '/assets/contents/short_3.jpg' },
  { name: 'HBO Max', note: '명작 미니시리즈', shot: RECOMMENDATIONS[5].img },
  { name: 'Disney+', note: '가족과 함께 보는 애니메이션', shot: RECOMMENDATIONS[7].img },
];

export function AppsPage({ active, onUp, isWireframeMode: wire }: PageProps) {
  const [toast, show] = useToast();
  const apps: AppItem[] = useMemo(() => {
    try {
      if (nativeApps?.installedApps) return (JSON.parse(nativeApps.installedApps()) as { pkg: string; label: string }[]).map(a => ({ ...a, img: `/appimage/${encodeURIComponent(a.pkg)}` }));
    } catch { /* sample tiles below */ }
    return APPS.filter(a => a.icon !== 'edit-system').map(a => ({ label: a.name, img: a.icon }));
  }, []);
  const recommended = ['Apple TV', 'Netflix', 'Prime Video', 'YouTube', 'Disney+', 'Hulu'];
  const PER = 6, gridRows = Math.max(1, Math.ceil(apps.length / PER));
  const lens = [recommended.length, EDITORS.length, ...Array.from({ length: gridRows }, (_, i) => Math.min(PER, apps.length - i * PER))];
  const openByName = (name: string) => { if (!launchApp(name)) show(`'${name}' · 이 TV에 설치되어 있지 않거나 브라우저 미리보기예요`); };
  const { r, col } = useRows(active, lens, onUp, (row, c) => {
    if (row === 0) openByName(recommended[c]);
    else if (row === 1) openByName(EDITORS[c].name);
    else {
      const a = apps[(row - 2) * PER + c];
      if (!a) return;
      const ok = a.pkg && nativeApps?.launchPackage ? nativeApps.launchPackage(a.pkg) : launchApp(a.label);
      if (!ok) show(`'${a.label}' · 브라우저 미리보기에서는 앱을 열 수 없어요`);
    }
  });
  const y = r <= 1 ? 0 : -(870 + (r - 2) * 236 - 260);
  const installedNames = new Set(apps.map(a => a.label.toLowerCase()));
  return (
    <div className="w-full h-full relative">
      {!wire && <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(70%_90%_at_50%_0%,#1e3a5f_0%,#0b1220_55%,#000_100%)] pointer-events-none" />}
      <Scroller y={y}>
        <div className="h-[200px] flex items-center justify-center">
          <span className="text-white/90 text-[46px] font-medium tracking-tight">앱의 세계에 오신 걸 환영해요</span>
        </div>
        <div className="h-[230px]">
          <RowTitle>추천</RowTitle>
          <div className="flex gap-7">
            {recommended.map((n, i) => (
              <div key={n} className="flex flex-col items-center gap-2">
                <div className={`w-[118px] h-[118px] rounded-full overflow-hidden bg-white/10 transition-all ${ring(active && r === 0 && col(0) === i, wire)}`}>
                  {wire ? <Wire label="APP" className="w-full h-full" /> : <img src={sampleIcon(n)} alt={n} className="w-full h-full object-cover" />}
                </div>
                <span className={`text-[17px] ${active && r === 0 && col(0) === i ? 'text-white' : 'text-transparent'}`}>{n}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[440px]">
          <RowTitle>에디터 추천</RowTitle>
          <motion.div animate={{ x: rowX(col(1), EDITORS.length, 552, 3) }} transition={{ type: 'tween', duration: 0.15 }} className="flex gap-8">
            {EDITORS.map((e, i) => (
              <div key={e.name} className={`w-[520px] h-[330px] rounded-3xl overflow-hidden shrink-0 bg-zinc-900 flex flex-col transition-all ${ring(active && r === 1 && col(1) === i, wire)}`}>
                <div className="relative flex-1 min-h-0">{wire ? <Wire label={`SCREEN: ${e.name}`} className="w-full h-full" /> : <img src={e.shot} alt="" className="w-full h-full object-cover" />}</div>
                <div className="h-[96px] px-5 flex items-center gap-4 bg-zinc-800/90">
                  {!wire && <img src={sampleIcon(e.name)} alt="" className="w-14 h-14 rounded-full object-cover" />}
                  <div className="min-w-0">
                    <div className="text-white text-[24px] font-semibold truncate">{e.name}</div>
                    <div className="text-white/50 text-[17px] truncate">{installedNames.has(e.name.toLowerCase()) || !nativeApps?.installedApps ? e.note : '설치되지 않음'}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div>
          <div className="flex items-baseline gap-5 mb-5">
            <h3 className="text-white/85 text-[24px] font-medium">내 앱</h3>
            <span className="text-white/40 text-[19px]">{nativeApps?.installedApps ? `이 TV에 설치된 앱 ${apps.length}개` : `샘플 앱 ${apps.length}개 · TV 앱에서는 설치된 앱이 보여요`}</span>
          </div>
          <div className="grid grid-cols-6 gap-x-8 gap-y-6">
            {apps.map((a, i) => {
              const on = active && r === 2 + Math.floor(i / PER) && i % PER === col(r);
              return (
                <div key={(a.pkg || a.label) + i} className="flex flex-col gap-3">
                  <div className={`aspect-[16/9] rounded-2xl overflow-hidden flex items-center justify-center transition-all ${wire ? 'bg-[#111c30]' : 'bg-white/[0.08]'} ${ring(on, wire)}`}>
                    {wire ? <span className="font-mono text-cyan-400 text-base">[ APP ]</span>
                      : a.img ? <img src={a.img} alt="" className="w-full h-full object-contain" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      : <LayoutGrid className="text-white/40" size={48} />}
                  </div>
                  <span className={`text-[20px] truncate ${on ? 'text-white font-semibold' : 'text-white/55'}`}>{a.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Scroller>
      <Toast text={toast} />
    </div>
  );
}
