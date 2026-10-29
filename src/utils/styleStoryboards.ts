import { Scene, StoryboardData } from '../types';

/**
 * Turn a general storyboard into a style-directed sequence. The renderer already
 * supports these scene primitives; this planner changes the actual story beats
 * and their order rather than only adding a visual overlay.
 */
const STYLE_BEATS: Record<string, string[]> = {
  'african-business': ['hook', 'story', 'team', 'demo', 'list', 'offer', 'cta'],
  'kinetic-type': ['hook', 'story', 'list', 'demo', 'offer', 'cta'],
  'luxury-commercial': ['hook', 'demo', 'story', 'list', 'offer', 'cta'],
  glassmorphism: ['hook', 'presenter', 'demo', 'steps', 'list', 'cta'],
  'doodle-animation': ['hook', 'story', 'steps', 'demo', 'list', 'cta'],
  'modern-2d': ['hook', 'presenter', 'story', 'demo', 'list', 'cta'],
  'corporate-presentation': ['hook', 'story', 'stats', 'steps', 'list', 'cta'],
  'chat-story': ['hook', 'conversation', 'story', 'demo', 'list', 'cta'],
  'cartoon-3d': ['hook', 'story', 'presenter', 'demo', 'compare', 'cta'],
  'anime-inspired': ['hook', 'story', 'compare', 'presenter', 'demo', 'cta'],
  'watercolor-storybook': ['hook', 'story', 'presenter', 'compare', 'cta'],
  claymation: ['hook', 'presenter', 'demo', 'story', 'list', 'cta'],
  'tech-launch': ['hook', 'story', 'demo', 'steps', 'stats', 'cta'],
  'high-energy-commercial': ['hook', 'offer', 'demo', 'list', 'cta'],
  'flat-vector-motion': ['hook', 'steps', 'demo', 'list', 'cta'],
  'music-visualizer': ['hook', 'story', 'list', 'offer', 'cta'],
  documentary: ['hook', 'story', 'presenter', 'demo', 'list', 'cta'],
  motivational: ['hook', 'story', 'compare', 'presenter', 'cta'],
  'before-after': ['hook', 'compare', 'story', 'demo', 'cta'],
  'isometric-world': ['hook', 'steps', 'demo', 'list', 'cta'],
  'pixel-art': ['hook', 'story', 'steps', 'cta'],
  'blueprint-technical': ['hook', 'story', 'steps', 'demo', 'cta'],
  'memphis-pop': ['hook', 'list', 'story', 'demo', 'offer', 'cta'],
  cinematic: ['hook', 'story', 'presenter', 'demo', 'compare', 'cta'],
  neon: ['hook', 'demo', 'steps', 'list', 'cta'],
  comic: ['hook', 'story', 'compare', 'list', 'cta'],
  minimal: ['hook', 'story', 'list', 'cta'],
  retro: ['hook', 'story', 'demo', 'list', 'cta'],
  paper: ['hook', 'story', 'steps', 'presenter', 'cta'],
  gradient: ['hook', 'presenter', 'list', 'demo', 'cta'],
  flat: ['hook', 'story', 'presenter', 'list', 'demo', 'cta'],
  human: ['hook', 'presenter', 'story', 'demo', 'team', 'cta'],
  board: ['hook', 'story', 'steps', 'demo', 'list', 'cta'],
};

const LABELS: Record<string, string> = {
  hook: 'THE BIG IDEA',
  story: 'THE CHALLENGE',
  presenter: 'MEET THE SOLUTION',
  demo: 'SEE HOW IT WORKS',
  steps: 'HOW TO GET STARTED',
  list: 'KEY BENEFITS',
  offer: 'A SPECIAL OFFER',
  cta: 'TAKE THE NEXT STEP',
  compare: 'FROM CHALLENGE TO SOLUTION',
  conversation: 'A CUSTOMER QUESTION',
  team: 'BUILT AROUND YOUR NEEDS',
  stats: 'AT A GLANCE',
};

export function composeStyleStoryboard(
  input: StoryboardData,
  style: string,
  sourceScript = ''
): StoryboardData {
  const original = input.scenes || [];
  const byKey = new Map<string, Scene>();
  original.forEach((scene) => {
    if (!byKey.has(scene.k)) byKey.set(scene.k, scene);
  });

  const hook = byKey.get('hook') || { k: 'hook' as const, t: input.brand || 'Discover a better way', s: input.tagline };
  const story = byKey.get('story') || {
    k: 'story' as const,
    t: input.tagline || 'A solution designed around your needs',
    s: sourceScript.split(/\n+/).map((line) => line.trim()).filter(Boolean)[1] || '',
  };
  const listSource = byKey.get('list')?.items?.length
    ? byKey.get('list')!.items!
    : original.flatMap((scene) => scene.items || []).filter(Boolean).slice(0, 6);
  const benefits = listSource.slice(0, 6);
  const presenter = byKey.get('presenter') || {
    k: 'presenter' as const,
    t: 'HERE IS THE SOLUTION',
    s: story.s || story.t,
    items: benefits.slice(0, 3),
  };
  const demo = byKey.get('demo') || {
    k: 'demo' as const,
    t: 'SEE THE OFFER IN ACTION',
    s: presenter.s || story.s || story.t,
    items: benefits.slice(0, 3),
  };
  const steps = byKey.get('steps') || {
    k: 'steps' as const,
    t: 'SIMPLE NEXT STEPS',
    items: benefits.length >= 3 ? benefits.slice(0, 3) : [story.t, presenter.t].filter(Boolean),
  };
  const cta = byKey.get('cta') || { k: 'cta' as const, t: 'Contact us to get started' };
  const compare = byKey.get('compare') || {
    k: 'compare' as const,
    t: 'A CLEARER WAY FORWARD',
    s: [story.t, presenter.s || demo.s].filter(Boolean).join(' → '),
  };
  const conversation = byKey.get('conversation') || {
    k: 'conversation' as const,
    t: 'HOW CAN THIS HELP ME?',
    s: presenter.s || story.s || story.t,
    items: benefits.slice(0, 2),
  };
  const team = byKey.get('team') || {
    k: 'team' as const,
    t: 'WORKING WITH YOU',
    s: presenter.s || story.s || story.t,
  };
  const stats = byKey.get('stats') || {
    k: 'stats' as const,
    t: LABELS.stats,
    items: benefits.slice(0, 4),
  };
  const available: Record<string, Scene> = {
    hook, story, presenter, demo, steps, list: byKey.get('list') || {
      k: 'list', t: LABELS.list, items: benefits.length ? benefits : [presenter.s || story.t].filter(Boolean),
    },
    cta, compare, conversation, team, stats,
  };
  const offer = byKey.get('offer');
  if (offer) available.offer = offer;

  const beatKeys = STYLE_BEATS[style] || STYLE_BEATS.flat;
  const scenes: Scene[] = [];
  for (const key of beatKeys) {
    if (key === 'offer' && !offer) continue;
    const scene = available[key];
    if (!scene) continue;
    if (scenes.some((existing) => existing.k === scene.k)) continue;
    scenes.push({
      ...scene,
      t: scene.t || LABELS[key] || 'Your message',
      items: scene.items?.slice(0, 6),
    });
  }
  if (scenes[0]?.k !== 'hook') scenes.unshift(hook);
  if (scenes[scenes.length - 1]?.k !== 'cta') scenes.push(cta);

  return { ...input, style, scenes: scenes.slice(0, 12) };
}
