export interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  description: string;
  year: number;
}

export interface AppIcon {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type ViewType = 'search' | 'home' | 'apps' | 'games' | 'settings';
