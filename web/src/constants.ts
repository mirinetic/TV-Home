import React from 'react';
import { 
  Tv, 
  Cable, 
  Gamepad2, 
  Smartphone, 
  LayoutGrid, 
  Monitor, 
  Settings, 
  Volume2, 
  Sun, 
  Languages, 
  Speaker, 
  Image,
  Bell,
  Pencil,
  Wifi,
  Bluetooth,
  Heart,
  Play,
  Shield,
  Search,
  Sparkles,
  ShieldCheck,
  User
} from 'lucide-react';
import * as CustomIcons from './components/Icons';

export const RECOMMENDATIONS = [
  { id: 1, title: "Fallout", sub: "PRIME VIDEO · SF 시리즈", img: "/assets/contents/fallout.webp" },
  { id: 2, title: "One Shot: Overtime Elite", sub: "PRIME VIDEO · 스포츠 다큐", img: "/assets/contents/2by3_1_wide.webp" },
  { id: 3, title: "Lost in Space", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_01.webp" },
  { id: 4, title: "Lucifer", sub: "NETFLIX · 판타지 범죄 시리즈", img: "/assets/contents/cb_thumb_07_02.webp" },
  { id: 5, title: "Narcos: Mexico", sub: "NETFLIX · 범죄 시리즈", img: "/assets/contents/cb_thumb_09_02.webp" },
  { id: 6, title: "Band of Brothers", sub: "HBO · 전쟁 드라마", img: "/assets/contents/cb_thumb_09_01.webp" },
  { id: 7, title: "Triple Frontier", sub: "NETFLIX · 액션 영화", img: "/assets/contents/cb_thumb_03_01.webp" },
  { id: 8, title: "Carmen Sandiego", sub: "NETFLIX · 애니메이션 시리즈", img: "/assets/contents/cb_thumb_07_03.webp" },
  { id: 9, title: "Altered Carbon", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_05.webp" },
  { id: 10, title: "The Ride", sub: "PRIME VIDEO · 다큐 시리즈", img: "/assets/contents/2by3_2_wide.webp" },
  { id: 11, title: "The Defenders", sub: "NETFLIX · 액션 시리즈", img: "/assets/contents/cb_thumb_03_02.webp" },
  { id: 12, title: "Rim of the World", sub: "NETFLIX · SF 모험 영화", img: "/assets/contents/cb_thumb_09_03.webp" },
];

export const APPS = [
  { name: 'TV Plus', icon: '/assets/apps/tv-plus.webp', bgColor: 'bg-black' },
  { name: 'Netflix', icon: '/assets/apps/2020_eden_launcher_netflix.webp', bgColor: 'bg-white' },
  { name: 'Prime Video', icon: '/assets/apps/2020_eden_launcher_amazon.webp', bgColor: 'bg-[#00A8E1]' },
  { name: 'Disney+', icon: '/assets/apps/app_icon_disney.webp', bgColor: 'bg-[#002244]' },
  { name: 'Hulu', icon: '/assets/apps/2020_eden_launcher_hulu.webp', bgColor: 'bg-black' },
  { name: 'Apple TV', icon: '/assets/apps/eden_launcher_appletv.webp', bgColor: 'bg-black' },
  { name: 'Internet', icon: '/assets/apps/Internet.webp', bgColor: 'bg-[#2831B1]' },
  { name: 'YouTube', icon: '/assets/apps/2020_eden_launcher_youtube.webp', bgColor: 'bg-white' },
  { name: 'HBO Max', icon: '/assets/apps/2020_eden_launcher_hbonow.webp', bgColor: 'bg-[#51137A]' },
  { name: 'SmartThings', icon: '/assets/apps/SmartThings.webp', bgColor: 'bg-[#2831B1]' },
  { name: 'Bixby', icon: '/assets/apps/Bixby.webp', bgColor: 'bg-[#2831B1]' },
  { name: '편집', icon: 'edit-system', bgColor: 'bg-white/10' },
];

export const COMEDY_MOVIES = [
  { id: 101, title: "The Incredible Jessica James", sub: "NETFLIX · 코미디 영화", img: "/assets/contents/cb_thumb_09_04.webp" },
  { id: 102, title: "Trinkets", sub: "NETFLIX · 청춘 드라마 시리즈", img: "/assets/contents/cb_thumb_09_05.webp" },
  { id: 103, title: "Carmen Sandiego", sub: "NETFLIX · 애니메이션 시리즈", img: "/assets/contents/cb_thumb_07_03.webp" },
  { id: 104, title: "Rim of the World", sub: "NETFLIX · SF 모험 영화", img: "/assets/contents/cb_thumb_09_03.webp" },
  { id: 105, title: "Marlon Wayans: Good Grief · 클립", sub: "PRIME VIDEO · 코미디 스페셜", img: "/assets/contents/short_4.jpg" },
];

export const ROMANCE_MOVIES = [
  { id: 201, title: "The Idea of You · 출연진 소개", sub: "PRIME VIDEO · 클립", img: "/assets/contents/short_2.jpg" },
  { id: 202, title: "The Idea of You · 배우 인터뷰", sub: "ODE ENTERTAINMENT · 클립", img: "/assets/contents/short_1.jpg" },
  { id: 203, title: "Federer: Twelve Final Days · 예고편", sub: "PRIME VIDEO · 다큐 예고편", img: "/assets/contents/short_3.jpg" },
  { id: 204, title: "Marlon Wayans: Good Grief · 클립", sub: "PRIME VIDEO · 코미디 스페셜", img: "/assets/contents/short_4.jpg" },
];

export const DOC_MOVIES = [
  { id: 301, title: "Federer: Twelve Final Days · 예고편", sub: "PRIME VIDEO · 다큐 예고편", img: "/assets/contents/short_3.jpg" },
  { id: 302, title: "One Shot: Overtime Elite", sub: "PRIME VIDEO · 스포츠 다큐", img: "/assets/contents/2by3_1_wide.webp" },
  { id: 303, title: "The Ride", sub: "PRIME VIDEO · 다큐 시리즈", img: "/assets/contents/2by3_2_wide.webp" },
];

export const ACTION_MOVIES = [
  { id: 401, title: "Triple Frontier", sub: "NETFLIX · 액션 영화", img: "/assets/contents/cb_thumb_03_01.webp" },
  { id: 402, title: "Maria", sub: "NETFLIX · 액션 영화", img: "/assets/contents/cb_thumb_03_04.webp" },
  { id: 403, title: "Close", sub: "NETFLIX · 액션 스릴러 영화", img: "/assets/contents/cb_thumb_03_05.webp" },
  { id: 404, title: "The Defenders", sub: "NETFLIX · 액션 시리즈", img: "/assets/contents/cb_thumb_03_02.webp" },
  { id: 405, title: "Fallout", sub: "PRIME VIDEO · SF 시리즈", img: "/assets/contents/fallout.webp" },
];

export const THRILLER_MOVIES = [
  { id: 501, title: "Narcos: Mexico", sub: "NETFLIX · 범죄 시리즈", img: "/assets/contents/cb_thumb_09_02.webp" },
  { id: 502, title: "Bad Blood", sub: "NETFLIX · 범죄 시리즈", img: "/assets/contents/cb_thumb_07_04.webp" },
  { id: 503, title: "Close", sub: "NETFLIX · 액션 스릴러 영화", img: "/assets/contents/cb_thumb_03_05.webp" },
  { id: 504, title: "Lucifer", sub: "NETFLIX · 판타지 범죄 시리즈", img: "/assets/contents/cb_thumb_07_02.webp" },
];

export const DRAMA_MOVIES = [
  { id: 601, title: "Band of Brothers", sub: "HBO · 전쟁 드라마", img: "/assets/contents/cb_thumb_09_01.webp" },
  { id: 602, title: "Lost in Space", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_01.webp" },
  { id: 603, title: "Altered Carbon", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_05.webp" },
  { id: 604, title: "Van Helsing", sub: "NETFLIX · 판타지 호러 시리즈", img: "/assets/contents/cb_thumb_03_03.webp" },
  { id: 605, title: "Trinkets", sub: "NETFLIX · 청춘 드라마 시리즈", img: "/assets/contents/cb_thumb_09_05.webp" },
  { id: 606, title: "Bad Blood", sub: "NETFLIX · 범죄 시리즈", img: "/assets/contents/cb_thumb_07_04.webp" },
];

export const SETTINGS_OPTIONS = [
  { id: 1, label: "선호 서비스", icon: Heart },
  { id: 2, label: "이어서 플레이", icon: Play },
  { id: 3, label: "자녀보호잠금", icon: Shield },
  { id: 4, label: "자동재생소리", icon: Volume2 },
];

export const PROFILES = [
  { id: 1, name: "홍길동", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop" },
  { id: 2, name: "허균", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop" },
];

export const DEVICES = [
  { id: 0, name: '라이브 TV', icon: Tv, color: 'bg-blue-500' },
  { id: 1, name: 'HDMI', icon: Cable, color: 'bg-zinc-600' },
  { id: 2, name: 'PlayStation', icon: Gamepad2, color: 'bg-black' },
  { id: 3, name: "홍길동의 폰", icon: Smartphone, color: 'bg-sky-400' },
  { id: 4, name: 'SmartThings', icon: LayoutGrid, color: 'bg-blue-600' },
  { id: 5, name: 'Smart View', icon: Monitor, color: 'bg-indigo-500', sub: 'TV 연결' },
];

export const QUICK_SETTINGS = [
  { id: 'noti', name: '알림', icon: Bell, type: 'small' },
  { id: 'edit', name: '편집', icon: Pencil, type: 'small' },
  { id: 'wifi', name: 'Wi-Fi', subName: 'VDUX_5G', icon: Wifi, type: 'pill' },
  { id: 'bluetooth', name: '블루투스', icon: Bluetooth, type: 'pill' },
  { id: 'all', name: '전체 설정', icon: Settings, type: 'round' },
  { id: 'sound', name: '음향 모드', icon: Volume2, type: 'round' },
  { id: 'bright', name: '밝기', icon: Sun, type: 'round' },
  { id: 'translate', name: '실시간 통역', icon: Languages, type: 'round' },
  { id: 'output', name: '소리 출력', icon: Speaker, type: 'round' },
  { id: 'picture', name: '화면 모드', icon: Image, type: 'round' },
];

export const HERO_BANNERS = [
  { 
    id: 1, 
    title: "VOID RUNNER", 
    desc: "올해 가장 기대되는 SF 스릴러. 우주의 신비를 경험하세요.", 
    bg: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2074&auto=format&fit=crop",
    accent: "rgba(59, 130, 246, 0.4)",
    meta: "2024 · 2h 15m · SF/Action · 15+",
    cast: "David Kim, Sarah Jenkins, Mark Ross",
    rating: "9.8"
  },
  { 
    id: 2, 
    title: "CYBER CITY", 
    desc: "잠들지 않는 도시, 네온 사인 아래 숨겨진 진실을 파헤치세요.", 
    bg: "https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?q=80&w=2070&auto=format&fit=crop",
    accent: "rgba(139, 92, 246, 0.4)",
    meta: "2023 · 1h 48m · Cyberpunk · 18+",
    cast: "Lena Park, Thomas Miller",
    rating: "8.5"
  },
  { 
    id: 3, 
    title: "NEON RIDERS", 
    desc: "최고의 속도감, 리얼리티 액션. 신개념 레이싱의 시작.", 
    bg: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=2023&auto=format&fit=crop",
    accent: "rgba(239, 68, 68, 0.4)",
    meta: "2024 · 2h 05m · Racing · ALL",
    cast: "Chris Evans, Ana de Armas",
    rating: "9.2"
  },
];

export const GNB_MAP: any = {
  ACCOUNT: { 
    label: '계정', 
    icon: ({ size, className }: any) => {
      // Note: In a real app, this would use the active profile. For now using PROFILES[0]
      return React.createElement('img', {
        src: PROFILES[0].img,
        style: { width: size, height: size },
        className: `rounded-full object-cover border border-white/20 ${className || ''}`,
        referrerPolicy: 'no-referrer'
      });
    },
    popupIndex: 0 
  },
  SEARCH: { 
    label: '검색', 
    icon: ({ size, className }: any) => React.createElement('img', {
      src: '/assets/gnb/search.svg',
      style: { width: size, height: size },
      className: className
    })
  },
  DEVICES: { 
    label: '연결된 기기', 
    icon: ({ size, className }: any) => React.createElement('img', {
      src: '/assets/gnb/device.svg',
      style: { width: size, height: size },
      className: className
    }),
    popupIndex: 2 
  },
  SETTINGS: { 
    label: '설정', 
    icon: ({ size, className }: any) => React.createElement('img', {
      src: '/assets/gnb/setting.svg',
      style: { width: size, height: size },
      className: className
    }),
    popupIndex: 3 
  },
  VISION: { label: 'Vision AI', icon: CustomIcons.VisionAIIcon },
  PRIVACY: { label: '개인정보보안', icon: CustomIcons.PrivacyIcon },
  HOME: { label: '홈', icon: CustomIcons.HomeIcon },
  LIVE: { label: '라이브', icon: CustomIcons.LiveIcon },
  GAME: { label: '게임', icon: CustomIcons.GameIcon },
  ART: { label: '아트', icon: CustomIcons.ArtIcon },
  APPS: { label: '앱', icon: CustomIcons.AppsIcon },
};

export const GNB_LABELS = [
  '계정', '검색', '연결된 기기', '설정',
  'Vision AI',
  '추천', '라이브', '게임', '아트', '앱스',
  '개인정보보안'
];

export const SECTIONS = ['gnb', 'hero', 'row', 'apps', 'comedy', 'romance', 'doc', 'action', 'thriller', 'drama', 'settings', 'scrollTop'] as const;



