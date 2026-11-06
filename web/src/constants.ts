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

export type Content = { id: number; title: string; sub: string; img: string; provider: string; kind: string; year: number; desc: string };

/** The app icon shown for a content's service (from the app row). */
export const providerIcon = (name: string) => APPS.find(a => a.name === name)?.icon;

export const RECOMMENDATIONS: Content[] = [
  { id: 1, title: "Fallout", sub: "PRIME VIDEO · SF 시리즈", img: "/assets/contents/fallout.webp", provider: "Prime Video", kind: "SF 시리즈", year: 2024, desc: "핵전쟁 200년 뒤, 지하 볼트에서 자란 루시가 처음으로 황무지에 나서며 벌어지는 이야기." },
  { id: 2, title: "One Shot: Overtime Elite", sub: "PRIME VIDEO · 스포츠 다큐", img: "/assets/contents/2by3_1_wide.webp", provider: "Prime Video", kind: "스포츠 다큐", year: 2023, desc: "프로 농구를 꿈꾸는 10대 유망주들이 모인 리그 '오버타임 엘리트'의 한 시즌을 따라간 다큐멘터리." },
  { id: 3, title: "Lost in Space", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_01.webp", provider: "Netflix", kind: "SF 시리즈", year: 2018, desc: "새 행성으로 이주하던 로빈슨 가족이 낯선 행성에 불시착해 살아남기 위해 분투하는 SF 시리즈." },
  { id: 4, title: "Lucifer", sub: "NETFLIX · 판타지 범죄 시리즈", img: "/assets/contents/cb_thumb_07_02.webp", provider: "Netflix", kind: "판타지 범죄 시리즈", year: 2016, desc: "지옥을 떠나 LA로 온 루시퍼가 형사 클로이와 함께 사건을 해결하는 판타지 범죄 드라마." },
  { id: 5, title: "Narcos: Mexico", sub: "NETFLIX · 범죄 시리즈", img: "/assets/contents/cb_thumb_09_02.webp", provider: "Netflix", kind: "범죄 시리즈", year: 2018, desc: "1980년대 멕시코 마약 카르텔의 탄생과 이를 쫓는 미국 마약단속국 요원의 이야기." },
  { id: 6, title: "Band of Brothers", sub: "HBO MAX · 전쟁 드라마", img: "/assets/contents/cb_thumb_09_01.webp", provider: "HBO Max", kind: "전쟁 드라마", year: 2001, desc: "2차 세계대전 미 공수부대 이지 중대가 노르망디에서 종전까지 겪는 여정을 그린 미니시리즈." },
  { id: 7, title: "Triple Frontier", sub: "NETFLIX · 액션 영화", img: "/assets/contents/cb_thumb_03_01.webp", provider: "Netflix", kind: "액션 영화", year: 2019, desc: "전직 특수부대원 다섯 명이 남미 마약왕의 돈을 노리고 위험한 작전에 나서는 액션 영화." },
  { id: 8, title: "Carmen Sandiego", sub: "NETFLIX · 애니메이션 시리즈", img: "/assets/contents/cb_thumb_07_03.webp", provider: "Netflix", kind: "애니메이션 시리즈", year: 2019, desc: "세계를 누비는 의적 카르멘 샌디에고가 범죄 조직 VILE에 맞서는 모험 애니메이션." },
  { id: 9, title: "Altered Carbon", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_05.webp", provider: "Netflix", kind: "SF 시리즈", year: 2018, desc: "의식을 다른 몸으로 옮길 수 있는 미래, 250년 만에 깨어난 전사가 부호의 살인 사건을 수사하는 SF 시리즈." },
  { id: 10, title: "The Ride", sub: "PRIME VIDEO · 다큐 시리즈", img: "/assets/contents/2by3_2_wide.webp", provider: "Prime Video", kind: "다큐 시리즈", year: 2018, desc: "미국 프로 불라이딩 선수들의 경쟁과 부상, 가족의 이야기를 담은 다큐 시리즈." },
  { id: 11, title: "The Defenders", sub: "NETFLIX · 액션 시리즈", img: "/assets/contents/cb_thumb_03_02.webp", provider: "Netflix", kind: "액션 시리즈", year: 2017, desc: "데어데블, 제시카 존스, 루크 케이지, 아이언 피스트가 뉴욕을 위협하는 조직 '핸드'에 맞서 뭉치는 시리즈." },
  { id: 12, title: "Rim of the World", sub: "NETFLIX · SF 모험 영화", img: "/assets/contents/cb_thumb_09_03.webp", provider: "Netflix", kind: "SF 모험 영화", year: 2019, desc: "여름 캠프에 모인 10대 넷이 외계인 침공 속에서 세상을 구할 열쇠를 지키는 SF 모험 영화." },
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

export const COMEDY_MOVIES: Content[] = [
  { id: 101, title: "The Incredible Jessica James", sub: "NETFLIX · 코미디 영화", img: "/assets/contents/cb_thumb_09_04.webp", provider: "Netflix", kind: "코미디 영화", year: 2017, desc: "이별의 아픔 속에서도 뉴욕에서 극작가의 꿈을 좇는 제시카 제임스의 코미디." },
  { id: 102, title: "Trinkets", sub: "NETFLIX · 청춘 드라마 시리즈", img: "/assets/contents/cb_thumb_09_05.webp", provider: "Netflix", kind: "청춘 드라마 시리즈", year: 2019, desc: "도벽 상담 모임에서 만난 세 여고생이 뜻밖의 친구가 되어 가는 청춘 드라마." },
  { id: 103, title: "Carmen Sandiego", sub: "NETFLIX · 애니메이션 시리즈", img: "/assets/contents/cb_thumb_07_03.webp", provider: "Netflix", kind: "애니메이션 시리즈", year: 2019, desc: "세계를 누비는 의적 카르멘 샌디에고가 범죄 조직 VILE에 맞서는 모험 애니메이션." },
  { id: 104, title: "Rim of the World", sub: "NETFLIX · SF 모험 영화", img: "/assets/contents/cb_thumb_09_03.webp", provider: "Netflix", kind: "SF 모험 영화", year: 2019, desc: "여름 캠프에 모인 10대 넷이 외계인 침공 속에서 세상을 구할 열쇠를 지키는 SF 모험 영화." },
  { id: 105, title: "Marlon Wayans: Good Grief · 클립", sub: "PRIME VIDEO · 코미디 스페셜", img: "/assets/contents/short_4.jpg", provider: "Prime Video", kind: "코미디 스페셜", year: 2024, desc: "말론 웨이언스가 부모를 떠나보낸 슬픔을 웃음으로 풀어낸 스탠드업 코미디 스페셜의 한 장면." },
];

export const ROMANCE_MOVIES: Content[] = [
  { id: 201, title: "The Idea of You · 출연진 소개", sub: "PRIME VIDEO · 클립", img: "/assets/contents/short_2.jpg", provider: "Prime Video", kind: "클립", year: 2024, desc: "40세 싱글맘과 보이밴드 멤버의 로맨스를 그린 영화 'The Idea of You'의 출연진 소개 영상." },
  { id: 202, title: "The Idea of You · 배우 인터뷰", sub: "YOUTUBE · 클립", img: "/assets/contents/short_1.jpg", provider: "YouTube", kind: "클립", year: 2024, desc: "영화 'The Idea of You' 출연 배우들의 인터뷰 클립." },
  { id: 203, title: "Federer: Twelve Final Days · 예고편", sub: "PRIME VIDEO · 다큐 예고편", img: "/assets/contents/short_3.jpg", provider: "Prime Video", kind: "다큐 예고편", year: 2025, desc: "로저 페더러의 은퇴 전 마지막 12일을 담은 다큐멘터리의 예고편." },
  { id: 204, title: "Marlon Wayans: Good Grief · 클립", sub: "PRIME VIDEO · 코미디 스페셜", img: "/assets/contents/short_4.jpg", provider: "Prime Video", kind: "코미디 스페셜", year: 2024, desc: "말론 웨이언스가 부모를 떠나보낸 슬픔을 웃음으로 풀어낸 스탠드업 코미디 스페셜의 한 장면." },
];

export const DOC_MOVIES: Content[] = [
  { id: 301, title: "Fallout", sub: "PRIME VIDEO · SF 시리즈", img: "/assets/contents/fallout.webp", provider: "Prime Video", kind: "SF 시리즈", year: 2024, desc: "핵전쟁 200년 뒤, 지하 볼트에서 자란 루시가 처음으로 황무지에 나서며 벌어지는 이야기." },
  { id: 302, title: "Lost in Space", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_01.webp", provider: "Netflix", kind: "SF 시리즈", year: 2018, desc: "새 행성으로 이주하던 로빈슨 가족이 낯선 행성에 불시착해 살아남기 위해 분투하는 SF 시리즈." },
  { id: 303, title: "Narcos: Mexico", sub: "NETFLIX · 범죄 시리즈", img: "/assets/contents/cb_thumb_09_02.webp", provider: "Netflix", kind: "범죄 시리즈", year: 2018, desc: "1980년대 멕시코 마약 카르텔의 탄생과 이를 쫓는 미국 마약단속국 요원의 이야기." },
  { id: 304, title: "Lucifer", sub: "NETFLIX · 판타지 범죄 시리즈", img: "/assets/contents/cb_thumb_07_02.webp", provider: "Netflix", kind: "판타지 범죄 시리즈", year: 2016, desc: "지옥을 떠나 LA로 온 루시퍼가 형사 클로이와 함께 사건을 해결하는 판타지 범죄 드라마." },
  { id: 305, title: "Triple Frontier", sub: "NETFLIX · 액션 영화", img: "/assets/contents/cb_thumb_03_01.webp", provider: "Netflix", kind: "액션 영화", year: 2019, desc: "전직 특수부대원 다섯 명이 남미 마약왕의 돈을 노리고 위험한 작전에 나서는 액션 영화." },
  { id: 306, title: "Band of Brothers", sub: "HBO MAX · 전쟁 드라마", img: "/assets/contents/cb_thumb_09_01.webp", provider: "HBO Max", kind: "전쟁 드라마", year: 2001, desc: "2차 세계대전 미 공수부대 이지 중대가 노르망디에서 종전까지 겪는 여정을 그린 미니시리즈." },
  { id: 307, title: "Altered Carbon", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_05.webp", provider: "Netflix", kind: "SF 시리즈", year: 2018, desc: "의식을 다른 몸으로 옮길 수 있는 미래, 250년 만에 깨어난 전사가 부호의 살인 사건을 수사하는 SF 시리즈." },
  { id: 308, title: "The Defenders", sub: "NETFLIX · 액션 시리즈", img: "/assets/contents/cb_thumb_03_02.webp", provider: "Netflix", kind: "액션 시리즈", year: 2017, desc: "데어데블, 제시카 존스, 루크 케이지, 아이언 피스트가 뉴욕을 위협하는 조직 '핸드'에 맞서 뭉치는 시리즈." },
  { id: 309, title: "Carmen Sandiego", sub: "NETFLIX · 애니메이션 시리즈", img: "/assets/contents/cb_thumb_07_03.webp", provider: "Netflix", kind: "애니메이션 시리즈", year: 2019, desc: "세계를 누비는 의적 카르멘 샌디에고가 범죄 조직 VILE에 맞서는 모험 애니메이션." },
  { id: 310, title: "Rim of the World", sub: "NETFLIX · SF 모험 영화", img: "/assets/contents/cb_thumb_09_03.webp", provider: "Netflix", kind: "SF 모험 영화", year: 2019, desc: "여름 캠프에 모인 10대 넷이 외계인 침공 속에서 세상을 구할 열쇠를 지키는 SF 모험 영화." },
];

export const ACTION_MOVIES: Content[] = [
  { id: 401, title: "Triple Frontier", sub: "NETFLIX · 액션 영화", img: "/assets/contents/cb_thumb_03_01.webp", provider: "Netflix", kind: "액션 영화", year: 2019, desc: "전직 특수부대원 다섯 명이 남미 마약왕의 돈을 노리고 위험한 작전에 나서는 액션 영화." },
  { id: 402, title: "Maria", sub: "NETFLIX · 액션 영화", img: "/assets/contents/cb_thumb_03_04.webp", provider: "Netflix", kind: "액션 영화", year: 2019, desc: "조직을 떠나 평범하게 살던 전직 암살자가 가족을 잃고 복수에 나서는 필리핀 액션 영화." },
  { id: 403, title: "Close", sub: "NETFLIX · 액션 스릴러 영화", img: "/assets/contents/cb_thumb_03_05.webp", provider: "Netflix", kind: "액션 스릴러 영화", year: 2019, desc: "경호원 샘이 납치 위협을 받는 젊은 상속녀를 지키며 쫓고 쫓기는 액션 스릴러." },
  { id: 404, title: "The Defenders", sub: "NETFLIX · 액션 시리즈", img: "/assets/contents/cb_thumb_03_02.webp", provider: "Netflix", kind: "액션 시리즈", year: 2017, desc: "데어데블, 제시카 존스, 루크 케이지, 아이언 피스트가 뉴욕을 위협하는 조직 '핸드'에 맞서 뭉치는 시리즈." },
  { id: 405, title: "Fallout", sub: "PRIME VIDEO · SF 시리즈", img: "/assets/contents/fallout.webp", provider: "Prime Video", kind: "SF 시리즈", year: 2024, desc: "핵전쟁 200년 뒤, 지하 볼트에서 자란 루시가 처음으로 황무지에 나서며 벌어지는 이야기." },
];

export const THRILLER_MOVIES: Content[] = [
  { id: 501, title: "Narcos: Mexico", sub: "NETFLIX · 범죄 시리즈", img: "/assets/contents/cb_thumb_09_02.webp", provider: "Netflix", kind: "범죄 시리즈", year: 2018, desc: "1980년대 멕시코 마약 카르텔의 탄생과 이를 쫓는 미국 마약단속국 요원의 이야기." },
  { id: 502, title: "Bad Blood", sub: "NETFLIX · 범죄 시리즈", img: "/assets/contents/cb_thumb_07_04.webp", provider: "Netflix", kind: "범죄 시리즈", year: 2017, desc: "몬트리올 범죄 조직 안에서 벌어지는 권력 다툼과 배신을 그린 범죄 드라마." },
  { id: 503, title: "Close", sub: "NETFLIX · 액션 스릴러 영화", img: "/assets/contents/cb_thumb_03_05.webp", provider: "Netflix", kind: "액션 스릴러 영화", year: 2019, desc: "경호원 샘이 납치 위협을 받는 젊은 상속녀를 지키며 쫓고 쫓기는 액션 스릴러." },
  { id: 504, title: "Lucifer", sub: "NETFLIX · 판타지 범죄 시리즈", img: "/assets/contents/cb_thumb_07_02.webp", provider: "Netflix", kind: "판타지 범죄 시리즈", year: 2016, desc: "지옥을 떠나 LA로 온 루시퍼가 형사 클로이와 함께 사건을 해결하는 판타지 범죄 드라마." },
];

export const DRAMA_MOVIES: Content[] = [
  { id: 601, title: "Band of Brothers", sub: "HBO MAX · 전쟁 드라마", img: "/assets/contents/cb_thumb_09_01.webp", provider: "HBO Max", kind: "전쟁 드라마", year: 2001, desc: "2차 세계대전 미 공수부대 이지 중대가 노르망디에서 종전까지 겪는 여정을 그린 미니시리즈." },
  { id: 602, title: "Lost in Space", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_01.webp", provider: "Netflix", kind: "SF 시리즈", year: 2018, desc: "새 행성으로 이주하던 로빈슨 가족이 낯선 행성에 불시착해 살아남기 위해 분투하는 SF 시리즈." },
  { id: 603, title: "Altered Carbon", sub: "NETFLIX · SF 시리즈", img: "/assets/contents/cb_thumb_07_05.webp", provider: "Netflix", kind: "SF 시리즈", year: 2018, desc: "의식을 다른 몸으로 옮길 수 있는 미래, 250년 만에 깨어난 전사가 부호의 살인 사건을 수사하는 SF 시리즈." },
  { id: 604, title: "Van Helsing", sub: "NETFLIX · 판타지 호러 시리즈", img: "/assets/contents/cb_thumb_03_03.webp", provider: "Netflix", kind: "판타지 호러 시리즈", year: 2016, desc: "뱀파이어가 세상을 장악한 뒤 깨어난 바네사 헬싱이 살아남은 사람들을 지키려 싸우는 이야기." },
  { id: 605, title: "Trinkets", sub: "NETFLIX · 청춘 드라마 시리즈", img: "/assets/contents/cb_thumb_09_05.webp", provider: "Netflix", kind: "청춘 드라마 시리즈", year: 2019, desc: "도벽 상담 모임에서 만난 세 여고생이 뜻밖의 친구가 되어 가는 청춘 드라마." },
  { id: 606, title: "Bad Blood", sub: "NETFLIX · 범죄 시리즈", img: "/assets/contents/cb_thumb_07_04.webp", provider: "Netflix", kind: "범죄 시리즈", year: 2017, desc: "몬트리올 범죄 조직 안에서 벌어지는 권력 다툼과 배신을 그린 범죄 드라마." },
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

// Hero banners: key art from the content library (provider wordmark + Watch button on the left, like the TV).
export const HERO_BANNERS = [
  {
    id: 1,
    title: "Fallout",
    provider: "Prime Video",
    desc: "핵전쟁 200년 뒤, 지하 볼트에서 자란 루시가 처음으로 황무지에 나서며 벌어지는 이야기.",
    bg: "/assets/contents/fallout.webp",
    accent: "rgba(234, 179, 8, 0.35)",
    meta: "2024 · SF 시리즈 · Prime Video",
    credit: "제작: Jonathan Nolan, Lisa Joy",
    cast: "Ella Purnell, Aaron Moten, Walton Goggins",
    rating: "PRIME ORIGINAL"
  },
  {
    id: 2,
    title: "The Idea of You",
    provider: "Prime Video",
    desc: "40세 싱글맘 솔렌과 보이밴드 멤버 헤이스의 예상 밖 로맨스.",
    bg: "/assets/contents/short_2.jpg",
    accent: "rgba(244, 114, 182, 0.35)",
    meta: "2024 · 로맨스 영화 · Prime Video",
    credit: "감독: Michael Showalter",
    cast: "Anne Hathaway, Nicholas Galitzine",
    rating: "PRIME ORIGINAL"
  },
  {
    id: 3,
    title: "Federer: Twelve Final Days",
    provider: "Prime Video",
    desc: "로저 페더러가 은퇴를 발표하고 마지막 경기를 치르기까지의 12일을 담은 다큐멘터리.",
    bg: "/assets/contents/short_3.jpg",
    accent: "rgba(56, 189, 248, 0.35)",
    meta: "2025 · 다큐멘터리 · Prime Video",
    credit: "감독: Asif Kapadia, Joe Sabia",
    cast: "Roger Federer",
    rating: "PRIME ORIGINAL"
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



