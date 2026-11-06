import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio, Play, Clock, Bell, BellRing, Rocket, Car, Swords, Puzzle, Trophy, Ghost, Music, Crown, Mountain, Zap,
  Target, Gamepad2, Dice5, Brain, Fish, Bike, LayoutGrid, Maximize2
} from 'lucide-react';
import { APPS } from '../constants';
import { launchApp } from '../native';

// The four centre tabs of the top bar: 라이브, 게임, 아트, 앱스.
// Each page takes the remote while the tab's content is focused (`active`): arrows move, OK acts,
// Up from the first row hands focus back to the top bar (onUp). Back is left to the app (top bar).

type PageProps = { active: boolean; onUp: () => void; isWireframeMode?: boolean };

const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];

/** Rows of items: remembers the column in each row. */
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
        setCols(prev => prev.map((v, i) => (i === s.r ? n : v)));
      } else if (e.key === 'Enter') s.onOk(s.r, c);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active]);
  const col = (row: number) => Math.min(cols[row] || 0, Math.max(0, lens[row] - 1));
  return { r, col, setR, setCols };
}

function seeded(n: number) { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); }
const pad = (n: number) => String(n).padStart(2, '0');
const hm = (t: Date) => `${pad(t.getHours())}:${pad(t.getMinutes())}`;

function Toast({ text }: { text: string }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed left-1/2 -translate-x-1/2 bottom-16 z-[600] px-10 py-5 rounded-full bg-zinc-900/95 border border-white/15 text-white text-[26px] font-medium shadow-2xl">
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

const ring = (on: boolean, wire?: boolean) => on
  ? (wire ? 'ring-4 ring-cyan-400' : 'ring-[6px] ring-white shadow-[0_30px_60px_rgba(0,0,0,0.7)] scale-[1.04]')
  : (wire ? 'ring-1 ring-cyan-500/30' : 'ring-1 ring-white/10');

function RowTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[26px] font-semibold tracking-tight text-white mb-5 px-1">{children}</h3>;
}

/* ------------------------------------------------------------------ 라이브 ------------------------------------------------------------------ */

const CHANNELS = [
  { no: 101, name: '코브 뉴스24', color: ['#1d4ed8', '#0b1a3a'], shows: ['뉴스 브리핑', '경제 투데이', '세계는 지금', '오후 뉴스 와이드', '날씨와 생활'] },
  { no: 102, name: '무비 플러스', color: ['#9f1239', '#2a0710'], shows: ['토요 명화극장', '시네마 클래식', '심야 스릴러', '가족 영화관', '단편 영화제'] },
  { no: 103, name: '스포츠 원', color: ['#15803d', '#05210f'], shows: ['프로야구 하이라이트', '축구 라이브', '골프 매거진', '스포츠 뉴스', 'e스포츠 리그'] },
  { no: 104, name: '키즈 랜드', color: ['#f59e0b', '#3a2203'], shows: ['꼬마 탐험대', '노래하는 동물원', '블록 친구들', '그림책 극장', '과학 놀이터'] },
  { no: 105, name: '다큐 월드', color: ['#0e7490', '#04232b'], shows: ['지구의 바다', '도시의 밤', '오래된 길', '사막의 생명', '하늘에서 본 세계'] },
  { no: 106, name: '뮤직 라이브', color: ['#7c3aed', '#1c0a3d'], shows: ['라이브 온 스테이지', '차트 톱 20', '어쿠스틱 세션', '재즈 나잇', '플레이리스트'] },
  { no: 107, name: '쿠킹 채널', color: ['#ea580c', '#3a1503'], shows: ['오늘의 집밥', '세계의 길거리 음식', '베이킹 클래스', '셰프의 비밀', '15분 요리'] },
  { no: 108, name: '트래블 TV', color: ['#0891b2', '#04222a'], shows: ['걸어서 유럽', '섬 여행 일기', '기차로 떠나요', '캠핑 가이드', '숨은 맛집 여행'] },
];
const SLOT = 30 * 60 * 1000;

function ChannelArt({ ch, big, wire }: { ch: typeof CHANNELS[number]; big?: boolean; wire?: boolean }) {
  if (wire) return <div className="w-full h-full bg-[#111c30] flex items-center justify-center font-mono text-cyan-400 text-xl">[ CH {ch.no} ]</div>;
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${ch.color[0]}, ${ch.color[1]})` }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute rounded-full border border-white/15"
          style={{ width: 300 + i * 220, height: 300 + i * 220, right: -120 - i * 110, bottom: -160 - i * 110 }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 4 + i, repeat: Infinity }} />
      ))}
      <div className={`absolute left-8 bottom-6 font-black tracking-tight text-white/90 ${big ? 'text-[64px]' : 'text-[30px]'}`}>{ch.name}</div>
      <div className={`absolute left-8 top-6 font-mono text-white/60 ${big ? 'text-2xl' : 'text-base'}`}>CH {ch.no}</div>
    </div>
  );
}

export function LivePage({ active, onUp, isWireframeMode: wire }: PageProps) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  const [toast, show] = useToast();
  const [reserved, setReserved] = useState<Record<string, boolean>>({});
  const base = Math.floor(now / SLOT) * SLOT;
  // each channel: programmes of 30/60/90 minutes from the slot before now to 2.5 hours later
  const guide = useMemo(() => CHANNELS.map((ch, ci) => {
    const list: { title: string; start: number; end: number }[] = [];
    let t = base - SLOT * Math.floor(seeded(ci + base / SLOT) * 2);
    let k = Math.floor(base / SLOT) + ci * 3;
    while (t < base + 5 * SLOT) {
      const len = SLOT * (1 + Math.floor(seeded(k * 7 + ci) * 3));
      list.push({ title: ch.shows[k % ch.shows.length], start: t, end: t + len });
      t += len; k++;
    }
    return list.filter(p => p.end > now && p.start < base + 4 * SLOT);   // what the 2-hour guide shows
  }), [base, now]);
  const lens = guide.map(g => Math.min(g.length, 4));
  const { r, col } = useRows(active, lens, onUp, (row, c) => {
    const p = guide[row][c], ch = CHANNELS[row];
    if (p.start <= now) { if (!launchApp('Live TV')) show(`CH ${ch.no} ${ch.name} · 라이브 TV 앱이 없어 미리보기만 보여 줘요`); }
    else {
      const key = `${ch.no}-${p.start}`;
      setReserved(v => ({ ...v, [key]: !v[key] }));
      show(reserved[key] ? `'${p.title}' 시청 예약을 취소했어요` : `'${p.title}' ${hm(new Date(p.start))} 시청 예약했어요`);
    }
  });
  const cur = CHANNELS[r], prog = guide[r][col(r)], live = guide[r][0];
  const W = 1240, span = 4 * SLOT, x = (t: number) => Math.max(0, Math.min(W, ((t - base) / span) * W));
  const listTop = Math.max(0, r - 3);

  return (
    <div className="w-full h-full pt-[180px] px-20 flex flex-col gap-8">
      <div className="flex gap-12 h-[380px]">
        <div className={`w-[676px] h-[380px] rounded-3xl overflow-hidden relative shrink-0 ${wire ? 'border border-cyan-500/40' : 'ring-1 ring-white/10'}`}>
          <ChannelArt ch={cur} big wire={wire} />
          <span className="absolute top-6 right-6 px-3 py-1 rounded-md bg-red-600 text-white text-lg font-bold flex items-center gap-2"><Radio size={18} />LIVE</span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-5">
          <div className="text-white/50 text-2xl font-medium">CH {cur.no} · {cur.name}</div>
          <div className="text-white text-[56px] font-bold tracking-tight leading-tight truncate">{prog.title}</div>
          <div className="flex items-center gap-4 text-white/60 text-2xl"><Clock size={24} />{hm(new Date(prog.start))} – {hm(new Date(prog.end))}{prog.start > now ? ' · 방송 예정' : ''}</div>
          <div className="w-[560px] h-2 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: `${Math.min(100, Math.max(0, ((now - live.start) / (live.end - live.start)) * 100))}%` }} />
          </div>
          <div className="text-white/45 text-xl">{prog.start <= now ? 'OK 지금 시청하기' : reserved[`${cur.no}-${prog.start}`] ? 'OK 예약 취소' : 'OK 시청 예약'} · ▲▼ 채널 · ◀▶ 편성표</div>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <div className="flex text-white/45 text-xl mb-3" style={{ paddingLeft: 280 }}>
          {[0, 1, 2, 3].map(i => <div key={i} style={{ width: W / 4 }}>{hm(new Date(base + i * SLOT))}</div>)}
        </div>
        <div className="absolute top-9 bottom-0 w-[3px] bg-red-500/80 z-10" style={{ left: 280 + x(now) }} />
        <div className="flex flex-col gap-3">
          {CHANNELS.slice(listTop, listTop + 4).map((ch, k) => {
            const ci = listTop + k, row = guide[ci].slice(0, 4);
            return (
              <div key={ch.no} className="flex items-center h-[76px]">
                <div className={`w-[264px] mr-4 h-full rounded-2xl flex items-center gap-4 px-5 ${ci === r && active ? 'bg-white/15' : 'bg-white/5'}`}>
                  <span className="font-mono text-white/50 text-xl">{ch.no}</span>
                  <span className="text-white text-[22px] font-semibold truncate">{ch.name}</span>
                </div>
                <div className="relative h-full" style={{ width: W }}>
                  {row.map((p, i) => {
                    const on = active && ci === r && i === col(ci), left = x(p.start), w = x(p.end) - left;
                    if (w <= 4) return null;
                    return (
                      <div key={p.start} style={{ left, width: w - 8 }}
                        className={`absolute top-0 h-full rounded-2xl px-5 flex items-center gap-3 overflow-hidden transition-all ${on ? 'bg-white text-black' : p.start <= now ? 'bg-white/12 text-white' : 'bg-white/6 text-white/80'}`}>
                        {p.start <= now && <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${on ? 'bg-red-600' : 'bg-red-500'}`} />}
                        <span className="text-[21px] font-medium truncate">{p.title}</span>
                        {reserved[`${ch.no}-${p.start}`] && <BellRing size={20} className="shrink-0" />}
                        {!reserved[`${ch.no}-${p.start}`] && on && p.start > now && <Bell size={20} className="shrink-0 opacity-50" />}
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
    </div>
  );
}

/* ------------------------------------------------------------------ 게임 ------------------------------------------------------------------ */

type Game = { title: string; genre: string; play: string; icon: any; c: [string, string]; progress?: number; desc?: string };
const G = (title: string, genre: string, play: string, icon: any, c: [string, string], progress?: number): Game => ({ title, genre, play, icon, c, progress });
const FEATURED: Game & { desc: string } = { ...G('스타 드리프트', '우주 레이싱', '클라우드 · 컨트롤러', Rocket, ['#4338ca', '#0f0a2e']), desc: '소행성 사이를 누비는 우주 레이싱. 친구와 화면을 나눠 최대 4명이 함께 달려요.' };
const GAME_ROWS: { title: string; items: Game[] }[] = [
  { title: '이어서 하기', items: [G('네온 하이웨이', '레이싱', '클라우드', Car, ['#db2777', '#2a0516'], 62), G('던전 오브 에코', 'RPG', '클라우드 · 컨트롤러', Swords, ['#b45309', '#2a1503'], 35), G('큐브 퍼즐 랩', '퍼즐', '리모컨', Puzzle, ['#0d9488', '#032623'], 80), G('리듬 웨이브', '리듬', '리모컨', Music, ['#7c3aed', '#1a0838'], 15)] },
  { title: '클라우드 게임 인기', items: [G('킹덤 라인', '전략', '클라우드 · 마우스', Crown, ['#a16207', '#2a1c03']), G('서밋 클라이머', '어드벤처', '클라우드 · 컨트롤러', Mountain, ['#0369a1', '#03182a']), G('볼트 러시', '액션', '클라우드 · 컨트롤러', Zap, ['#ca8a04', '#291d02']), G('고스트 하우스', '공포', '클라우드 · 컨트롤러', Ghost, ['#475569', '#0b0f17']), G('챔피언 리그 2026', '스포츠', '클라우드 · 컨트롤러', Trophy, ['#16a34a', '#04200d']), G('타깃 포인트', '슈팅', '클라우드 · 컨트롤러', Target, ['#dc2626', '#2a0606'])] },
  { title: '리모컨으로 가볍게', items: [G('주사위 파티', '보드게임', '리모컨', Dice5, ['#e11d48', '#2a0410']), G('브레인 퀴즈쇼', '퀴즈', '리모컨', Brain, ['#9333ea', '#1d0630']), G('바다 낚시왕', '캐주얼', '리모컨', Fish, ['#0284c7', '#03172a']), G('미니 바이크', '캐주얼', '리모컨', Bike, ['#65a30d', '#132003']), G('아케이드 클래식', '아케이드', '리모컨', Gamepad2, ['#f97316', '#2a1003'])] },
];

function GameArt({ g, big, wire }: { g: Game; big?: boolean; wire?: boolean }) {
  const Icon = g.icon;
  if (wire) return <div className="w-full h-full bg-[#111c30] flex items-center justify-center font-mono text-cyan-400 text-lg">[ GAME: {g.title} ]</div>;
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: `radial-gradient(120% 120% at 80% 20%, ${g.c[0]}, ${g.c[1]})` }}>
      <Icon className="absolute text-white/20" style={{ right: big ? 80 : 18, top: big ? 40 : 14 }} size={big ? 320 : 140} strokeWidth={1.4} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className={`absolute left-6 bottom-5 font-black tracking-tight text-white ${big ? 'text-[72px] left-14 bottom-24' : 'text-[30px]'}`}>{g.title}</div>
    </div>
  );
}

export function GamePage({ active, onUp, isWireframeMode: wire }: PageProps) {
  const [toast, show] = useToast();
  const lens = [1, ...GAME_ROWS.map(row => row.items.length)];
  const { r, col } = useRows(active, lens, onUp, (row) => {
    const g = row === 0 ? FEATURED : GAME_ROWS[row - 1].items[col(row)];
    show(`'${g.title}' · 게임 실행은 이 프로토타입에서 시뮬레이션만 해요`);
  });
  const CW = 400, GAP = 32, step = CW + GAP;
  const y = r <= 1 ? 0 : -(440 + (r - 2) * 330);
  return (
    <div className="w-full h-full pt-[150px]">
      <div className="h-[930px] overflow-hidden pt-5">
      <motion.div animate={{ y }} transition={{ type: 'tween', duration: 0.2 }} className="px-20 flex flex-col">
        <div className={`relative h-[400px] rounded-[2.5rem] overflow-hidden mb-10 transition-all ${ring(active && r === 0, wire)}`}>
          <GameArt g={FEATURED} big wire={wire} />
          {!wire && <div className="absolute left-14 bottom-10 flex items-center gap-6">
            <span className={`flex items-center gap-3 px-10 py-4 rounded-full text-[24px] font-semibold ${active && r === 0 ? 'bg-white text-black' : 'bg-white/15 text-white'}`}><Play size={24} fill="currentColor" />플레이</span>
            <span className="text-white/70 text-2xl">{FEATURED.genre} · {FEATURED.play}</span>
          </div>}
          {!wire && <p className="absolute right-14 bottom-12 w-[520px] text-right text-white/75 text-[22px] leading-relaxed">{FEATURED.desc}</p>}
        </div>
        {GAME_ROWS.map((row, ri) => {
          const R = ri + 1, c = col(R), x = -Math.max(0, Math.min(c - 1, row.items.length - 4)) * step;
          return (
            <section key={row.title} className="h-[330px]">
              <RowTitle>{row.title}</RowTitle>
              <motion.div animate={{ x: Math.min(0, x) }} transition={{ type: 'tween', duration: 0.15 }} className="flex" style={{ gap: GAP }}>
                {row.items.map((g, i) => {
                  const on = active && r === R && i === c;
                  return (
                    <div key={g.title} className="shrink-0" style={{ width: CW }}>
                      <div className={`relative aspect-[16/9] rounded-3xl overflow-hidden transition-all ${ring(on, wire)}`}>
                        <GameArt g={g} wire={wire} />
                        {g.progress !== undefined && <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20"><div className="h-full bg-white" style={{ width: `${g.progress}%` }} /></div>}
                      </div>
                      <div className="h-10 mt-3 flex items-center gap-3 text-[20px]">
                        {on && <><span className="text-white font-semibold truncate">{g.title}</span><span className="w-px h-5 bg-white/30" /><span className="text-white/55 whitespace-nowrap">{g.genre} · {g.play}{g.progress !== undefined ? ` · ${g.progress}%` : ''}</span></>}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </section>
          );
        })}
      </motion.div>
      </div>
      <Toast text={toast} />
    </div>
  );
}

/* ------------------------------------------------------------------ 아트 ------------------------------------------------------------------ */

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
const ART_ROWS: { title: string; keys: string[] }[] = [
  { title: '인상주의', keys: ['impression', 'lilies', 'parasol', 'moulin', 'jatte'] },
  { title: '빈센트 반 고흐', keys: ['starry', 'sunflowers', 'cafe'] },
  { title: '동양의 풍경', keys: ['inwang', 'wave', 'hiroshige'] },
  { title: '고전과 낭만', keys: ['pearl', 'wanderer', 'temeraire'] },
  { title: '모던 아트', keys: ['kiss', 'kandinsky'] },
];
const artSrc = (k: string) => `/assets/art/${k}.webp`;

function ArtImg({ a, wire, className }: { a: Art; wire?: boolean; className?: string }) {
  if (wire) return <div className={`bg-[#111c30] flex items-center justify-center font-mono text-cyan-400 text-base text-center p-2 ${className}`}>[ ART: {a.title} ]</div>;
  return <img src={artSrc(a.k)} alt={a.title} className={`object-cover ${className}`} />;
}

export function ArtPage({ active, onUp, isWireframeMode: wire }: PageProps) {
  const [view, setView] = useState<{ row: number; i: number } | null>(null);
  const [caption, setCaption] = useState(true);
  const featured = ART.starry;
  const lens = [1, ...ART_ROWS.map(r => r.keys.length)];
  const { r, col } = useRows(active, lens, onUp, (row, c) => {
    setView(row === 0 ? { row: 2, i: 0 } : { row, i: c });
    setCaption(true);
  }, !!view);
  // full-screen viewer: ◀ ▶ move through the collection, OK shows/hides the caption, Back closes
  useEffect(() => {
    if (!view) return;
    const t = setTimeout(() => setCaption(false), 4000);
    const onKey = (e: KeyboardEvent) => {
      if (![...KEYS, 'Escape', 'Backspace'].includes(e.key)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const keys = ART_ROWS[view.row - 1].keys;
      if (e.key === 'Escape' || e.key === 'Backspace') setView(null);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { setView({ row: view.row, i: (view.i + (e.key === 'ArrowLeft' ? -1 : 1) + keys.length) % keys.length }); setCaption(true); }
      else if (e.key === 'Enter') setCaption(v => !v);
    };
    window.addEventListener('keydown', onKey, true);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey, true); };
  }, [view]);

  const H = 270, GAP = 28;
  const y = r <= 1 ? 0 : -(470 + (r - 2) * 360);
  const shown = view ? ART[ART_ROWS[view.row - 1].keys[view.i]] : null;
  return (
    <div className="w-full h-full pt-[150px]">
      <div className="h-[930px] overflow-hidden pt-5">
      <motion.div animate={{ y }} transition={{ type: 'tween', duration: 0.2 }} className="px-20 flex flex-col">
        <div className={`relative h-[430px] rounded-[2.5rem] overflow-hidden mb-10 transition-all ${ring(active && r === 0, wire)}`}>
          <ArtImg a={featured} wire={wire} className="absolute inset-0 w-full h-full !object-[center_30%]" />
          {!wire && <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent" />}
          {!wire && <div className="absolute left-14 bottom-12 flex flex-col gap-3">
            <span className="text-white/60 text-xl font-medium tracking-wide">오늘의 작품</span>
            <span className="text-white text-[64px] font-bold tracking-tight leading-none">{featured.title}</span>
            <span className="text-white/70 text-2xl">{featured.artist} · {featured.year} · {featured.place}</span>
            <span className={`mt-4 w-fit flex items-center gap-3 px-9 py-4 rounded-full text-[22px] font-semibold ${active && r === 0 ? 'bg-white text-black' : 'bg-white/15 text-white'}`}><Maximize2 size={22} />크게 보기</span>
          </div>}
        </div>
        {ART_ROWS.map((row, ri) => {
          const R = ri + 1, c = col(R);
          const widths = row.keys.map(k => Math.round(Math.max(200, Math.min(500, H * ART[k].w / ART[k].h))));
          const lefts = widths.map((_, i) => widths.slice(0, i).reduce((a, b) => a + b + GAP, 0));
          const x = -Math.max(0, lefts[c] - 600);
          return (
            <section key={row.title} className="h-[360px]">
              <RowTitle>{row.title}</RowTitle>
              <motion.div animate={{ x }} transition={{ type: 'tween', duration: 0.15 }} className="flex items-start" style={{ gap: GAP }}>
                {row.keys.map((k, i) => {
                  const a = ART[k], on = active && r === R && i === c;
                  return (
                    <div key={k} className="shrink-0" style={{ width: widths[i] }}>
                      <div className={`rounded-2xl overflow-hidden transition-all ${ring(on, wire)}`} style={{ height: H }}>
                        <ArtImg a={a} wire={wire} className="w-full h-full" />
                      </div>
                      <div className="h-10 mt-3 flex items-center gap-3 text-[19px] whitespace-nowrap">
                        {on && <><span className="text-white font-semibold">{a.title}</span><span className="text-white/55">{a.artist} · {a.year}</span></>}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </section>
          );
        })}
      </motion.div>
      </div>

      <AnimatePresence>
        {shown && (
          <motion.div key="viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] bg-black">
            <AnimatePresence mode="wait">
              <motion.img key={shown.k} src={artSrc(shown.k)} alt={shown.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
                className="absolute inset-0 w-full h-full object-contain" />
            </AnimatePresence>
            <motion.div animate={{ opacity: caption ? 1 : 0 }} transition={{ duration: 0.5 }}
              className="absolute inset-x-0 bottom-0 px-20 pb-14 pt-32 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between">
              <div>
                <div className="text-white text-[48px] font-bold tracking-tight">{shown.title}</div>
                <div className="text-white/70 text-2xl mt-2">{shown.artist} · {shown.year} · {shown.place}</div>
              </div>
              <div className="text-white/50 text-xl">◀ ▶ 다음 작품 · OK 정보 · 뒤로 닫기</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ 앱스 ------------------------------------------------------------------ */

type AppItem = { pkg?: string; label: string; img?: string };
type NativeApps = { installedApps?: () => string; launchPackage?: (pkg: string) => boolean };
const nativeApps = (window as unknown as { TVHomeNative?: NativeApps }).TVHomeNative;

export function AppsPage({ active, onUp, isWireframeMode: wire }: PageProps) {
  const [toast, show] = useToast();
  const apps: AppItem[] = useMemo(() => {
    try {
      if (nativeApps?.installedApps) return (JSON.parse(nativeApps.installedApps()) as { pkg: string; label: string }[]).map(a => ({ ...a, img: `/appimage/${encodeURIComponent(a.pkg)}` }));
    } catch { /* fall back to the sample tiles */ }
    return APPS.filter(a => a.icon !== 'edit-system').map(a => ({ label: a.name, img: a.icon }));
  }, []);
  const PER = 6, rows = Math.max(1, Math.ceil(apps.length / PER));
  const lens = Array.from({ length: rows }, (_, i) => Math.min(PER, apps.length - i * PER));
  const { r, col } = useRows(active, lens, onUp, (row, c) => {
    const a = apps[row * PER + c];
    if (!a) return;
    const ok = a.pkg && nativeApps?.launchPackage ? nativeApps.launchPackage(a.pkg) : launchApp(a.label);
    if (!ok) show(`'${a.label}' · 브라우저 미리보기에서는 앱을 열 수 없어요`);
  });
  const y = -Math.max(0, r - 2) * 236;
  return (
    <div className="w-full h-full pt-[170px] px-20">
      <div className="flex items-baseline gap-5 mb-8">
        <h2 className="text-white text-[40px] font-bold tracking-tight">내 앱</h2>
        <span className="text-white/45 text-2xl">{nativeApps?.installedApps ? `이 TV에 설치된 앱 ${apps.length}개` : `샘플 앱 ${apps.length}개 · TV 앱에서는 설치된 앱이 보여요`}</span>
      </div>
      <div className="h-[780px] overflow-hidden px-3 -mx-3 pt-3">
      <motion.div animate={{ y }} transition={{ type: 'tween', duration: 0.2 }} className="grid grid-cols-6 gap-x-8 gap-y-6">
        {apps.map((a, i) => {
          const on = active && Math.floor(i / PER) === r && i % PER === col(r);
          return (
            <div key={(a.pkg || a.label) + i} className="flex flex-col gap-3">
              <div className={`aspect-[16/9] rounded-2xl overflow-hidden flex items-center justify-center transition-all ${wire ? 'bg-[#111c30]' : 'bg-white/8'} ${ring(on, wire)}`}>
                {wire ? <span className="font-mono text-cyan-400 text-base">[ APP ]</span>
                  : a.img ? <img src={a.img} alt="" className="w-full h-full object-contain" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  : <LayoutGrid className="text-white/40" size={48} />}
              </div>
              <span className={`text-[20px] truncate ${on ? 'text-white font-semibold' : 'text-white/55'}`}>{a.label}</span>
            </div>
          );
        })}
      </motion.div>
      </div>
      <Toast text={toast} />
    </div>
  );
}

