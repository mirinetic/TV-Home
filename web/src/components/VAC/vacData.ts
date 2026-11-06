// Vision AI Companion Grid & Scenario Data

export type CardType = 'L' | 'S';

export interface VACCard {
  id: string;
  type: CardType;
  name: string;
  bgUrl: string;
  focusedUrl: string;
  action: string;
  subName?: string;
}

export const CARD_DIMENSIONS = {
  L: { width: 368, height: 576 },
  S: { width: 368, height: 264 }
};

// 8 Columns Default Grid Data
export const DEFAULT_GRID_DATA: VACCard[][] = [
  [
    {
      id: 'cts',
      name: 'Content To Search',
      type: 'L',
      bgUrl: '/assets/ai_home/home/home_cts.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_xl.webp',
      action: 'cts'
    }
  ],
  [
    {
      id: 'topic',
      name: 'Topic Discovery',
      type: 'L',
      bgUrl: '/assets/ai_home/home/home_topic1.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_xl.webp',
      action: 'topic'
    }
  ],
  [
    {
      id: 'copilot',
      name: 'Microsoft Copilot',
      type: 'S',
      bgUrl: '/assets/ai_home/home/home_copilot.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_m.webp',
      action: 'copilot'
    },
    {
      id: 'perplexity',
      name: 'Perplexity AI',
      type: 'S',
      bgUrl: '/assets/ai_home/home/home_perplexity.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_m.webp',
      action: 'perplexity'
    }
  ],
  [
    {
      id: 'genwall',
      name: 'Generative Wall',
      type: 'L',
      bgUrl: '/assets/ai_home/home/home_genwall.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_xl.webp',
      action: 'genWall'
    }
  ],
  [
    {
      id: 'translate',
      name: 'Live Translate',
      type: 'S',
      bgUrl: '/assets/ai_home/home/home_livetranslate.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_m.webp',
      action: 'translate'
    },
    {
      id: 'aimode',
      name: 'Vision AI Mode',
      type: 'S',
      bgUrl: '/assets/ai_home/home/home_aimode.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_m.webp',
      action: 'ai_mode'
    }
  ],
  [
    {
      id: 'voicehint',
      name: 'Voice Hint',
      type: 'L',
      bgUrl: '/assets/ai_home/home/home_voicehint.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_xl.webp',
      action: 'voice_hint'
    }
  ],
  [
    {
      id: 'history',
      name: 'Search History',
      type: 'L',
      bgUrl: '/assets/ai_home/home/home_history.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_xl.webp',
      action: 'history'
    }
  ],
  [
    {
      id: 'setting',
      name: 'Settings',
      type: 'L',
      bgUrl: '/assets/ai_home/home/home_setting.webp',
      focusedUrl: '/assets/ai_home/focused/VisionAI_img_outstroke_f_xl.webp',
      action: 'settings'
    }
  ]
];

// Scenario Answer Card Data
export interface ScenarioData {
  id: string;
  title: string;
  sublabel: string;
  answers: string[];
  hints: string[];
  relatedCards: {
    title: string;
    sub: string;
    img: string;
    type: 'L' | 'S';
  }[];
}

export const VAC_SCENARIOS: Record<string, ScenarioData> = {
  cts: {
    id: 'cts',
    title: 'Content To Search',
    sublabel: '선택한 콘텐츠의 상세 탐색 정보입니다.',
    answers: [
      '이 영화는 2024년 최고의 우주 SF 서스펜스로 손꼽히는 신작입니다.',
      '초광속 비행 중 사라진 탐사선을 구하기 위해 심우주로 파견된 대원들이 겪는 미스터리한 실종 현상을 긴박감 넘치게 다루고 있습니다.',
      '현재 다수의 주요 비디오 스트리밍 서비스에서 즉시 감상하실 수 있습니다.'
    ],
    hints: [
      '"출연 배우 정보 보여줘"',
      '"비슷한 SF 스릴러 영화 추천해줘"',
      '"유튜브에서 관련 비하인드 영상 검색해줘"'
    ],
    relatedCards: [
      { title: '우주 SF 명작 컬렉션', sub: '추천 테마', img: '/assets/contents/2by3_1.webp', type: 'L' },
      { title: '사라진 탐사선 비하인드', sub: 'YouTube', img: '/assets/contents/cb_thumb_07_01.webp', type: 'L' },
      { title: '비슷한 영화 보기', sub: 'SF 컬렉션', img: '/assets/contents/cb_thumb_07_02.webp', type: 'L' }
    ]
  },
  topic: {
    id: 'topic',
    title: 'Daily Discovery Topic',
    sublabel: '오늘의 주요 추천 토픽 소식입니다.',
    answers: [
      '오늘의 AI 테마 토픽: 심해 탐사의 역사와 숨겨진 외계 생명체 미스터리입니다.',
      '지구상에서 가장 접근하기 어려운 심해 마리아나 해구 아래에서 최근 촬영된 미지의 유기체 거동과 자원 가치에 대한 전문가 분석 보고서가 발행되었습니다.',
      '관련 다큐멘터리 및 시사 콘텐츠가 준비되어 있습니다.'
    ],
    hints: [
      '"심해 탐사 다큐멘터리 찾아줘"',
      '"외계 생명체 다큐 실시간 채널 틀어줘"',
      '"바다 다큐멘터리 다른 에피소드 보여줘"'
    ],
    relatedCards: [
      { title: '미지의 해양 세계', sub: '다큐멘터리', img: '/assets/contents/cb_thumb_03_04.webp', type: 'L' },
      { title: '해저 도시 가상체험', sub: 'TV PLUS', img: '/assets/contents/cb_thumb_03_03.webp', type: 'L' }
    ]
  },
  copilot: {
    id: 'copilot',
    title: 'Microsoft Copilot',
    sublabel: 'Copilot AI 서비스가 연동되었습니다.',
    answers: [
      'Microsoft Copilot에 오신 것을 환영합니다! 무엇이든 물어보세요.',
      'TV 시청 패턴에 따라 생산성 향상 팁, 일정 요약, 날씨 소식 등을 빠르게 답변해 드릴 수 있습니다.'
    ],
    hints: [
      '"오늘 내 일정 브리핑해줘"',
      '"TV에서 코파일럿 모드 실행해줘"'
    ],
    relatedCards: [
      { title: '생산성 향상 가이드', sub: 'MS Copilot', img: '/assets/contents/cb_thumb_09_02.webp', type: 'L' }
    ]
  },
  perplexity: {
    id: 'perplexity',
    title: 'Perplexity AI Search',
    sublabel: '웹 실시간 검색 답변입니다.',
    answers: [
      '현재 전 세계에서 가장 뜨거운 IT 테크 이슈는 새로운 초전도 가상소재의 응용 기술 발표입니다.',
      '이번에 발견된 소재는 상온 작동 효율을 15% 이상 증대시킬 수 있어 양자컴퓨터 및 배터리 산업 전반의 급격한 패러다임 변화를 예고하고 있습니다.'
    ],
    hints: [
      '"초전도 신소재 세부 보고서 읽어줘"',
      '"양자컴퓨터 관련 뉴스 재생해줘"'
    ],
    relatedCards: [
      { title: '양자컴퓨터 입문 강좌', sub: 'TECH TV', img: '/assets/contents/cb_thumb_09_05.webp', type: 'L' }
    ]
  }
};

export const MOCK_HISTORY_DATA = [
  { id: 'h1', title: '"Show me today\'s fortune"' },
  { id: 'h2', title: '"Tell me cast info of this movie"' },
  { id: 'h3', title: '"Find SF movies from 2024"' },
  { id: 'h4', title: '"Play next comedy video"' },
  { id: 'h5', title: '"Change picture settings to movie mode"' },
  { id: 'h6', title: '"Recommend background art theme"' }
];

export const MOCK_ACTORS_DATA = [
  { name: 'Sandra Bullock', character: 'Dr. Ryan Stone', image: '/assets/contents/2by3_1.webp' },
  { name: 'George Clooney', character: 'Matt Kowalski', image: '/assets/contents/2by3_2.webp' },
  { name: 'Ed Harris', character: 'Mission Control (Voice)', image: '/assets/contents/cb_thumb_07_01.webp' },
  { name: 'Orto Ignatiussen', character: 'Aningaaq (Voice)', image: '/assets/contents/cb_thumb_07_02.webp' }
];
