import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// In-app update (TV app only): the Android side checks the "tvhome-latest" release and installs
// the new APK; it answers with 'tvhome-update' window events.
type Native = { checkUpdate?: () => void; installUpdate?: () => void; versionName?: () => string };
const native = (window as unknown as { TVHomeNative?: Native }).TVHomeNative;

export type UpdateInfo = { ok: boolean; available?: boolean; currentName?: string; latestName?: string; notes?: string; error?: string };
export type UpdatePhase = '' | 'checking' | 'permission' | 'download' | 'confirm' | 'cancelled' | 'error';

const AUTO_KEY = 'tvhome-auto-update';
export const canUpdate = !!native?.checkUpdate;

function readAuto(): boolean {
  try { return localStorage.getItem(AUTO_KEY) !== 'false'; } catch { return true; }
}

export function useUpdater() {
  const [info, setInfo] = useState<UpdateInfo | null>(null);
  const [phase, setPhase] = useState<UpdatePhase>('');
  const [auto, setAutoState] = useState(readAuto);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      if (d.type === 'result') { setInfo(d); setPhase(d.ok ? '' : 'error'); }
      else if (d.type === 'progress') setPhase(d.phase);
    };
    window.addEventListener('tvhome-update', on);
    return () => window.removeEventListener('tvhome-update', on);
  }, []);

  const check = useCallback(() => { if (!native?.checkUpdate) return; setPhase('checking'); native.checkUpdate(); }, []);
  const install = useCallback(() => { if (!native?.installUpdate) return; setPhase('download'); native.installUpdate(); }, []);
  const setAuto = useCallback((v: boolean) => { setAutoState(v); try { localStorage.setItem(AUTO_KEY, String(v)); } catch { /* ignore */ } }, []);

  // checks a few seconds after start when automatic checking is on
  useEffect(() => {
    if (!canUpdate || !readAuto()) return;
    const t = setTimeout(check, 4000);
    return () => clearTimeout(t);
  }, [check]);

  const version = native?.versionName ? native.versionName() : '';
  return { info, phase, auto, setAuto, check, install, dismissed, dismiss: () => setDismissed(true), version };
}

export function phaseText(phase: UpdatePhase, info: UpdateInfo | null): string {
  switch (phase) {
    case 'checking': return '새 버전을 확인하는 중…';
    case 'download': return '내려받는 중…';
    case 'confirm': return 'TV의 설치 확인 창에서 "설치"를 눌러 주세요';
    case 'permission': return '이 앱의 "출처를 알 수 없는 앱 설치"를 허용한 뒤 다시 눌러 주세요';
    case 'cancelled': return '설치를 취소했어요';
    case 'error': return '업데이트를 확인하거나 받지 못했어요. 인터넷 연결을 확인해 주세요';
  }
  if (!info) return '';
  return info.available ? `새 버전 ${info.latestName}이 있어요` : `최신 버전이에요 (${info.currentName})`;
}

/** The prompt that appears when the automatic check finds a newer build. OK / arrows / Back. */
export function UpdatePrompt({ u }: { u: ReturnType<typeof useUpdater> }) {
  const show = !!(u.auto && u.info?.available && !u.dismissed);
  const [sel, setSel] = useState(0);
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Backspace'].includes(e.key)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.key === 'ArrowLeft') setSel(0);
      else if (e.key === 'ArrowRight') setSel(1);
      else if (e.key === 'Escape' || e.key === 'Backspace') u.dismiss();
      else if (e.key === 'Enter') { if (sel === 0 && u.phase !== 'download') u.install(); else if (sel === 1) u.dismiss(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [show, sel, u]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1500] bg-black/60 flex items-center justify-center font-sans">
          <div className="w-[760px] rounded-[2.5rem] bg-zinc-900/95 border border-white/10 p-12 shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
            <p className="text-blue-400 text-lg font-semibold tracking-wide">TV Home 업데이트</p>
            <h3 className="text-white text-[44px] font-bold tracking-tight mt-2">새 버전 {u.info?.latestName}</h3>
            <p className="text-white/50 text-xl mt-3">지금 버전 {u.info?.currentName}{u.info?.notes ? ` · ${u.info.notes}` : ''}</p>
            <p className="text-white/70 text-xl mt-6 h-8">{u.phase ? phaseText(u.phase, u.info) : ''}</p>
            <div className="flex gap-5 mt-8">
              {['지금 업데이트', '나중에'].map((t, i) => (
                <div key={t} onClick={() => (i === 0 ? u.install() : u.dismiss())}
                  className={`px-12 py-5 rounded-[1.6rem] text-2xl font-bold cursor-pointer transition-all ${sel === i ? 'bg-white text-black scale-105' : 'bg-white/10 text-white'}`}>{t}</div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** The update block inside the simulator settings panel. */
export function UpdateSettings({ u }: { u: ReturnType<typeof useUpdater> }) {
  if (!canUpdate) {
    return <p className="text-[12px] text-white/30 pl-4">TV 앱(APK)에서만 쓸 수 있어요. 브라우저 미리보기에서는 동작하지 않아요.</p>;
  }
  const text = phaseText(u.phase, u.info);
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-white/60 pl-1">지금 버전 {u.version}{text ? ` · ${text}` : ''}</p>
      <div className="grid grid-cols-2 gap-2.5">
        <button onClick={u.check} className="px-4 py-4 rounded-2xl border border-white/10 bg-white/5 text-white text-[13px] font-medium">업데이트 확인</button>
        <button onClick={u.install} disabled={!u.info?.available}
          className={`px-4 py-4 rounded-2xl border text-[13px] font-medium ${u.info?.available ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-white/25'}`}>
          {u.info?.available ? `${u.info.latestName} 설치` : '설치할 새 버전 없음'}
        </button>
      </div>
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
        {[{ label: '자동 확인 켜기 (디폴트)', val: true }, { label: '자동 확인 끄기', val: false }].map(item => (
          <button key={String(item.val)} onClick={() => u.setAuto(item.val)}
            className={`flex-1 py-3 text-[12px] font-medium tracking-tight rounded-xl transition-all ${u.auto === item.val ? 'bg-white text-black shadow-lg' : 'text-white/20 hover:text-white/40'}`}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] font-medium text-white/20 italic pl-4">* 자동 확인을 켜 두면 앱을 열 때 새 버전이 있는지 확인하고 알려 줘요.</p>
    </div>
  );
}
