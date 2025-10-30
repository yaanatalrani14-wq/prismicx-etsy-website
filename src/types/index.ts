export interface Listing {
  id: string;
  title: string;
  tags: string[];
  shop: string;
  performance: number;
  favorites: number;
  views: number;
  x: number;
  y: number;
  imageUrl: string;
}

export interface Cluster {
  id: string;
  name: string;
  keywords: string[];
  center: { x: number; y: number };
  size: number;
}

export interface Niche {
  id: string;
  name: string;
  parent?: string;
  path: string[];
}

export type ViewMode = 'explore' | 'compare' | 'query';

export type ColorMode = 'performance' | 'cluster' | 'shop';
