import React, { useEffect, useState, useCallback } from 'react';

// In-app update (TV app only), from simulator settings 08: the Android side checks the "tvhome-latest" release and installs
// the new APK; it answers with 'tvhome-update' window events.
type Native = { checkUpdate?: () => void; installUpdate?: () => void; versionName?: () => string };
const native = (window as unknown as { TVHomeNative?: Native }).TVHomeNative;

export type UpdateInfo = { ok: boolean; available?: boolean; currentName?: string; latestName?: string; notes?: string; error?: string };
export type UpdatePhase = '' | 'checking' | 'permission' | 'download' | 'confirm' | 'cancelled' | 'error';

export const canUpdate = !!native?.checkUpdate;


export function useUpdater() {
  const [info, setInfo] = useState<UpdateInfo | null>(null);
  const [phase, setPhase] = useState<UpdatePhase>('');

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

  const version = native?.versionName ? native.versionName() : '';
  return { info, phase, check, install, version };
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
      <p className="text-[11px] font-medium text-white/20 italic pl-4">* 업데이트 확인을 누르면 새 버전이 있는지 보고, 있으면 바로 설치할 수 있어요.</p>
    </div>
  );
}
