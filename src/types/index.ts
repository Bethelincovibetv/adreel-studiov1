export type SceneKey =
  | 'hook'
  | 'story'
  | 'list'
  | 'offer'
  | 'cta'
  | 'demo'
  | 'steps'
  | 'testimonial'
  | 'stats'
  | 'compare'
  | 'presenter'
  | 'conversation'
  | 'team';

export interface Scene {
  k: SceneKey;
  t: string;
  s?: string;
  p?: string;
  items?: string[];
}

export type AdType =
  | 'growth'
  | 'retail'
  | 'food'
  | 'fashion'
  | 'tech'
  | 'auto'
  | 'property'
  | 'beauty'
  | 'edu'
  | 'office'
  | 'gym'
  | 'farm'
  | 'health';

export type AdStyle = 'auto' | 'flat' | 'board' | 'human' | 'cinematic' | 'neon' | 'comic' | 'minimal' | 'retro' | 'paper' | 'gradient';

export interface StoryboardData {
  type: AdType;
  style: string;
  brand: string;
  tagline: string;
  palette: {
    accent: string;
    top: string;
    bottom: string;
  };
  scenes: Scene[];
}

export interface ParsedScript {
  brand: string;
  headline: string;
  question: string;
  problem: string;
  intro: string;
  extra: string;
  price: string;
  offer: string;
  cta: string;
  tagline: string;
  features: string[];
}
