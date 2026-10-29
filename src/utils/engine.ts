import { AdType, Scene, StoryboardData, ParsedScript } from '../types';

export const G_DEFAULT = '#25d366';
export const DG_DEFAULT = '#075e54';
export const GD = '#ffc428';
export const OR = '#ff7a18';
export const WH = '#fff';
export const SK = '#40aaff';
export const RD = '#ff5252';

export const cp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const pr = (t: number, s: number, d: number) => cp((t - s) / d);
export const eo = (v: number) => 1 - (1 - v) ** 3;
export const eb = (v: number) => {
  const k = 1.70158;
  return 1 + (k + 1) * (v - 1) ** 3 + k * (v - 1) ** 2;
};
export const eio = (v: number) => v * v * (3 - 2 * v);
export const lp = (a: number, b: number, t: number) => a + (b - a) * t;

export const FF = 'system-ui, "DejaVu Sans", sans-serif';

export interface DrawContext {
  c: CanvasRenderingContext2D;
  LIGHT: boolean;
  BQ: any[] | null;
  d: StoryboardData;
  G: string;
  DG: string;
}

export function R(ctx: DrawContext, a: number, b: number, w: number, h: number, f: string, r = 0, al = 1) {
  let fill = f;
  let alpha = al;
  if (ctx.LIGHT && fill === '#000') {
    fill = '#fff';
    alpha = Math.min(1, alpha * 2.2);
  }
  ctx.c.globalAlpha = cp(alpha);
  ctx.c.fillStyle = fill;
  ctx.c.beginPath();
  ctx.c.roundRect(a, b, Math.max(w, 0), Math.max(h, 0), Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.c.fill();
  ctx.c.globalAlpha = 1;
}

export function Ci(ctx: DrawContext, a: number, b: number, r: number, f?: string | null, al = 1, st?: string | null, lw?: number) {
  if (r <= 0) return;
  ctx.c.globalAlpha = cp(al);
  ctx.c.beginPath();
  ctx.c.arc(a, b, r, 0, 7);
  if (f) {
    ctx.c.fillStyle = f;
    ctx.c.fill();
  }
  if (st) {
    ctx.c.strokeStyle = st;
    ctx.c.lineWidth = lw || 1;
    ctx.c.stroke();
  }
  ctx.c.globalAlpha = 1;
}

export function P(ctx: DrawContext, p: number[][], f: string, al = 1) {
  ctx.c.globalAlpha = cp(al);
  ctx.c.fillStyle = f;
  ctx.c.beginPath();
  p.forEach((q, i) => (i ? ctx.c.lineTo(q[0], q[1]) : ctx.c.moveTo(q[0], q[1])));
  ctx.c.fill();
  ctx.c.globalAlpha = 1;
}

export function Ln(ctx: DrawContext, p: number[][], s: string, w: number, al = 1) {
  ctx.c.globalAlpha = cp(al);
  ctx.c.strokeStyle = s;
  ctx.c.lineWidth = w;
  ctx.c.lineCap = 'round';
  ctx.c.lineJoin = 'round';
  ctx.c.beginPath();
  p.forEach((q, i) => (i ? ctx.c.lineTo(q[0], q[1]) : ctx.c.moveTo(q[0], q[1])));
  ctx.c.stroke();
  ctx.c.globalAlpha = 1;
}

export function T(
  ctx: DrawContext,
  s: string,
  a: number,
  b: number,
  sz: number,
  f = WH,
  al = 1,
  o: { b?: boolean; w?: number; a?: CanvasTextAlign; sh?: number } = {}
) {
  if (al <= 0.01 || !s) return;
  if (ctx.BQ) {
    ctx.BQ.push([s, a, b, sz, f, al, o]);
    return;
  }
  let fill = f;
  if (ctx.LIGHT) {
    if (fill === WH) fill = '#202124';
    else if (fill === GD) fill = '#d56e00';
  }
  const bd = o.b === false ? '' : 'bold ';
  let z = sz;
  ctx.c.font = bd + z + 'px ' + FF;
  if (o.w) {
    while (ctx.c.measureText(s).width > o.w && z > 10) {
      z--;
      ctx.c.font = bd + z + 'px ' + FF;
    }
  }
  ctx.c.textAlign = o.a || 'center';
  ctx.c.textBaseline = 'middle';
  ctx.c.globalAlpha = cp(al);
  if (o.sh) {
    ctx.c.fillStyle = 'rgba(0,0,0,.4)';
    ctx.c.fillText(s, a + 2, b + 4);
  }
  ctx.c.fillStyle = fill;
  ctx.c.fillText(s, a, b);
  ctx.c.globalAlpha = 1;
}

export function wl(ctx: DrawContext, s: string, sz: number, w: number, bd = true): string[] {
  ctx.c.font = (bd ? 'bold ' : '') + sz + 'px ' + FF;
  const ls: string[] = [];
  let t = '';
  String(s)
    .split(/\s+/)
    .forEach((q) => {
      const u = (t + ' ' + q).trim();
      if (ctx.c.measureText(u).width <= w || !t) t = u;
      else {
        ls.push(t);
        t = q;
      }
    });
  ls.push(t);
  return ls;
}

export function Pa(
  ctx: DrawContext,
  s: string,
  a: number,
  b: number,
  sz: number,
  w: number,
  f = WH,
  al = 1,
  o: { b?: boolean; sh?: number } = {}
): number {
  const ls = wl(ctx, s, sz, w, o.b !== false);
  ls.forEach((l, i) => T(ctx, l, a, b + i * sz * 1.3 + sz / 2, sz, f, al, Object.assign({ w }, o)));
  return ls.length * sz * 1.3;
}

export const SKN = ['#8d5524', '#e0ac69', '#5c381e', '#c68642', '#a86b3c', '#f1c27d'];

export function cast(i: number, sh?: string) {
  const f = i % 2;
  return {
    skin: SKN[i % 6],
    shirt: sh || [SK, OR, '#aa6eff', '#ff5f7d', GD, '#34a853'][i % 6],
    hair: ['#140f0c', '#3c1e14', '#0f0a0a'][i % 3],
    fem: f,
    hs: f ? [2, 3, 4, 1][i % 4] : [0, 1, 0, 0][i % 4],
    gl: i % 3 === 1,
    tie: i % 4 === 2 && !f,
    bag: i % 5 === 3,
    pn: i % 3 === 2,
    wrap: ['#ff5f7d', '#ffc428', '#aa6eff'][i % 3],
  };
}

export function person(ctx: DrawContext, a: number, b: number, s: number, o: any) {
  const ph = o.ph || 0;
  const bo = o.bob || 0;
  const yb = b - Math.abs(Math.sin(ph)) * 4 * s * bo;
  for (const sd of [-1, 1]) {
    const lx = a + sd * 9 * s + Math.sin(ph) * sd * 8 * s * bo;
    R(ctx, lx - 6 * s, yb - 38 * s, 12 * s, 35 * s, '#1c2646', 5 * s);
    R(ctx, lx - 8 * s, yb - 5 * s, 18 * s, 7 * s, '#0f0f14', 3 * s);
  }
  if (o.fem) {
    Ci(ctx, a, yb - 104 * s, 23 * s, o.hair);
    R(ctx, a - 23 * s, yb - 104 * s, 46 * s, 32 * s, o.hair, 8 * s);
  }
  if (o.hs === 1) Ci(ctx, a, yb - 114 * s, 27 * s, o.hair);
  for (const sd of [-1, 1]) {
    const sh = [a + sd * 20 * s, yb - 80 * s];
    const h =
      o.wv != null && sd === 1
        ? [a + 38 * s, yb - 118 * s + Math.sin(o.wv) * 8 * s]
        : [a + sd * 29 * s - Math.sin(ph) * sd * 9 * s * bo, yb - 46 * s];
    Ln(ctx, [sh, h], o.shirt, 9 * s);
    Ci(ctx, h[0], h[1], 5.5 * s, o.skin);
  }
  R(ctx, a - 21 * s, yb - 88 * s, 42 * s, 52 * s, o.shirt, 12 * s);
  if (o.apron) R(ctx, a - 15 * s, yb - 68 * s, 30 * s, 32 * s, WH, 6 * s);
  Ci(ctx, a, yb - 108 * s, 19 * s, o.skin);
  ctx.c.fillStyle = o.hair;
  ctx.c.beginPath();
  ctx.c.arc(a, yb - 109 * s, 20 * s, Math.PI, 0);
  ctx.c.fill();
  if (o.hs === 3) Ci(ctx, a, yb - 133 * s, 9 * s, o.hair);
  if (o.hs === 4) {
    const w = o.wrap || RD;
    Ci(ctx, a - 7 * s, yb - 128 * s, 16 * s, w);
    Ci(ctx, a + 10 * s, yb - 126 * s, 14 * s, w);
    R(ctx, a - 21 * s, yb - 124 * s, 42 * s, 14 * s, w, 6 * s);
  }
  if (o.gl) {
    ctx.c.strokeStyle = '#222';
    ctx.c.lineWidth = 2 * s;
    [-7, 7].forEach((q) => {
      ctx.c.beginPath();
      ctx.c.arc(a + q * s, yb - 107 * s, 6 * s, 0, 7);
      ctx.c.stroke();
    });
    Ln(ctx, [[a - s, yb - 107 * s], [a + s, yb - 107 * s]], '#222', 2 * s);
  }
  if (o.tie) P(ctx, [[a - 4 * s, yb - 88 * s], [a + 4 * s, yb - 88 * s], [a + 3 * s, yb - 60 * s], [a, yb - 54 * s], [a - 3 * s, yb - 60 * s]], RD);
  if (o.bag) R(ctx, a - 34 * s, yb - 60 * s, 16 * s, 22 * s, '#8a5a2b', 4 * s);
  if (o.pn) R(ctx, a + 28 * s, yb - 58 * s, 9 * s, 16 * s, '#111', 2 * s);
  Ci(ctx, a - 7 * s, yb - 107 * s, 2.2 * s, '#191414');
  Ci(ctx, a + 7 * s, yb - 107 * s, 2.2 * s, '#191414');
  ctx.c.strokeStyle = '#3c1914';
  ctx.c.lineWidth = 2.2 * s;
  ctx.c.beginPath();
  if (o.happy !== false) ctx.c.arc(a, yb - 104 * s, 8 * s, 0.35, 2.8);
  else ctx.c.arc(a, yb - 96 * s, 8 * s, 3.5, 5.9);
  ctx.c.stroke();
}

export function shop(ctx: DrawContext, cx: number, g: number, w: number, h: number, nm: string) {
  const x0 = cx - w / 2;
  const tp = g - h;
  R(ctx, x0, tp + 60, w, h - 60, '#faebcd', 6);
  R(ctx, x0 + 24, tp + 135, w * 0.42 - 24, 110, '#96d2f0', 10);
  R(ctx, cx + w * 0.12, tp + 120, w * 0.38 - 24, h - 120, '#7d4b2a', 8);
  Ci(ctx, x0 + w - 42, g - 90, 5, GD);
  const n = 8;
  const sw = (w + 30) / n;
  for (let i = 0; i < n; i++) {
    const f = i % 2 ? WH : ctx.G;
    R(ctx, x0 - 15 + i * sw, tp + 22, sw, 58, f);
    Ci(ctx, x0 - 15 + i * sw + sw / 2, tp + 80, sw / 2, f);
  }
  R(ctx, x0 - 15, tp + 14, w + 30, 14, ctx.DG, 6);
  R(ctx, cx - w * 0.3, tp - 22, w * 0.6, 36, ctx.DG, 10);
  T(ctx, nm, cx, tp - 4, 24, WH, 1, { w: w * 0.52 });
}

export function phone(ctx: DrawContext, cx: number, cy: number, w: number, h: number, al = 1): [number, number, number, number] {
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const rr = Math.min(w, h) * 0.11;
  const hh = h * 0.12;
  R(ctx, x0 - 7, y0 - 7, w + 14, h + 14, '#12161e', rr + 6, al);
  R(ctx, x0, y0, w, h, '#e8e0d6', rr, al);
  R(ctx, x0, y0, w, hh + rr, ctx.DG, rr, al);
  R(ctx, x0, y0 + hh, w, rr + 1, '#e8e0d6', 0, al);
  Ci(ctx, x0 + hh * 0.7, y0 + hh / 2 + 2, hh * 0.32, ctx.G, al);
  T(ctx, ctx.d.brand || 'Your Brand', x0 + hh * 1.15, y0 + hh / 2 + 2, hh * 0.32, WH, al, { a: 'left', w: w - hh * 1.4 });
  return [x0, y0 + hh, x0 + w, y0 + h];
}

export function logo(ctx: DrawContext, a: number, b: number, r: number, al = 1) {
  Ci(ctx, a, b, r, ctx.G, al);
  Ci(ctx, a, b - r * 0.05, r * 0.58, null, al, WH, r * 0.13);
  P(ctx, [[a - r * 0.45, b + r * 0.38], [a - r * 0.62, b + r * 0.72], [a - r * 0.12, b + r * 0.52]], WH, al);
  [-1, 0, 1].forEach((k) => Ci(ctx, a + k * r * 0.22, b - r * 0.05, r * 0.07, WH, al));
}

export function bub(ctx: DrawContext, x0: number, y0: number, x1: number, y1: number, out: number, al: number, ls?: string[]) {
  const f = out ? '#dcf8c6' : WH;
  R(ctx, x0, y0, x1 - x0, y1 - y0, f, 14, al);
  P(
    ctx,
    out
      ? [[x1 - 14, y0], [x1 + 8, y0], [x1 - 2, y0 + 14]]
      : [[x0 + 14, y0], [x0 - 8, y0], [x0 + 2, y0 + 14]],
    f,
    al
  );
  (ls || []).forEach((l, i) => T(ctx, l, x0 + 14, y0 + 22 + i * 27, 21, '#1e2a2d', al, { a: 'left', b: false }));
  if (out) T(ctx, '✓✓', x1 - 12, y1 - 12, 15, SK, al, { a: 'right' });
}

export function sparkle(ctx: DrawContext, a: number, b: number, r: number, al: number, f = WH) {
  const k = 0.25;
  P(
    ctx,
    [
      [a, b - r],
      [a + r * k, b - r * k],
      [a + r, b],
      [a + r * k, b + r * k],
      [a, b + r],
      [a - r * k, b + r * k],
      [a - r, b],
      [a - r * k, b - r * k],
    ],
    f,
    al
  );
}

export function flame(ctx: DrawContext, a: number, b: number, z: number, t: number) {
  const f = 1 + 0.12 * Math.sin(t * 18) + 0.06 * Math.sin(t * 31);
  const tr = (k: number) => {
    const p: number[][] = [];
    for (let i = 0; i < 36; i++) {
      const q = (i / 36) * 6.2832;
      p.push([a + Math.sin(q) * Math.sin(q / 2) * 0.9 * k * z, b - Math.cos(q) * 1.2 * f * k * z]);
    }
    return p;
  };
  P(ctx, tr(1), OR);
  P(
    ctx,
    tr(0.58).map((q) => [q[0], q[1] + 0.28 * z]),
    GD
  );
}

export function bokeh(ctx: DrawContext, t: number) {
  for (let i = 0; i < 16; i++) {
    const sp = 14 + ((i * 7) % 18);
    const y = 1380 - ((i * 173 + t * sp) % 1480);
    const r = 14 + ((i * 13) % 34);
    Ci(ctx, ((i * 211) % 720) + Math.sin(t * 0.6 + i) * 14, y, r, WH, 0.045);
  }
}

export function rocket(ctx: DrawContext, a: number, b: number, ang: number, t: number) {
  ctx.c.save();
  ctx.c.translate(a, b);
  ctx.c.rotate(ang);
  const fl = 14 * Math.sin(t * 40) + 8 * Math.sin(t * 23);
  P(ctx, [[-13, 40], [13, 40], [0, 108 + fl]], OR);
  P(ctx, [[-7, 40], [7, 40], [0, 78 + fl * 0.6]], GD);
  P(ctx, [[-22, 5], [-48, 56], [-22, 44]], RD);
  P(ctx, [[22, 5], [48, 56], [22, 44]], RD);
  R(ctx, -22, -40, 44, 82, '#f0f5fa', 6);
  ctx.c.fillStyle = RD;
  ctx.c.beginPath();
  ctx.c.moveTo(-22, -40);
  ctx.c.quadraticCurveTo(-18, -85, 0, -102);
  ctx.c.quadraticCurveTo(18, -85, 22, -40);
  ctx.c.closePath();
  ctx.c.fill();
  Ci(ctx, 0, -8, 15, WH);
  Ci(ctx, 0, -8, 10.5, SK);
  ctx.c.restore();
}

export const IC = [
  (ctx: DrawContext, a: number, b: number, t: number) => {
    for (let i = 0; i < 10; i++) {
      ctx.c.strokeStyle = ctx.G;
      ctx.c.lineWidth = 5;
      ctx.c.beginPath();
      ctx.c.arc(a, b, 27, (i * 36 + t * 70) * 0.01745, (i * 36 + t * 70 + 24) * 0.01745);
      ctx.c.stroke();
    }
    Ci(ctx, a, b, 19, '#ebf0f5');
    Ci(ctx, a, b - 5, 7, '#96a0af');
    ctx.c.fillStyle = '#96a0af';
    ctx.c.beginPath();
    ctx.c.arc(a, b + 17, 11, Math.PI, 0);
    ctx.c.fill();
  },
  (ctx: DrawContext, a: number, b: number) => {
    ([
      [-20, 4, 8, '#82beff'],
      [20, 4, 8, '#ffaa78'],
      [0, -3, 10, WH],
    ] as [number, number, number, string][]).forEach(([dx, dy, r, f]) => {
      Ci(ctx, a + dx, b + dy - 8, r, f);
      ctx.c.fillStyle = f;
      ctx.c.beginPath();
      ctx.c.arc(a + dx, b + dy + r + 8, r * 1.5, Math.PI, 0);
      ctx.c.fill();
    });
  },
  (ctx: DrawContext, a: number, b: number, t: number) => {
    const ps = [[-24, -18], [24, -18], [-24, 20], [24, 20]];
    ps.forEach((p) => Ln(ctx, [[a, b], [a + p[0], b + p[1]]], 'rgba(255,255,255,.6)', 3));
    Ci(ctx, a, b, 12 * (1 + 0.2 * Math.sin(t * 6)), ctx.G);
    ps.forEach((p, i) => Ci(ctx, a + p[0], b + p[1], 8, i % 2 ? GD : WH));
  },
  (ctx: DrawContext, a: number, b: number) => {
    Ci(ctx, a, b, 28, GD);
    Ci(ctx, a, b, 22, null, 1, '#c88c0a', 3);
    const offerScene = ctx.d.scenes.find((s) => s.k === 'offer');
    const priceStr = offerScene?.p || '';
    T(ctx, priceStr ? priceStr[0] : '★', a, b + 1, 32, '#6e4600');
  },
  (ctx: DrawContext, a: number, b: number, t: number) => {
    ctx.c.fillStyle = WH;
    ctx.c.beginPath();
    ctx.c.arc(a, b, 19, Math.PI, 0);
    ctx.c.fill();
    P(ctx, [[a - 19, b], [a + 19, b], [a + 26, b + 16], [a - 26, b + 16]], WH);
    Ci(ctx, a, b + 22, 5, GD);
    Ci(ctx, a + 19, b - 14, 8 + 1.5 * Math.sin(t * 8), RD);
  },
];

export const HERO: Record<string, (ctx: DrawContext, t: number) => void> = {
  growth(ctx, t) {
    const base = 1010;
    const xs = [110, 230, 350, 470, 590];
    const hs = [90, 150, 220, 300, 400];
    R(ctx, 40, base, 640, 8, WH, 4, 0.25);
    xs.forEach((a, i) => {
      const p = eo(pr(t, 0.6 + i * 0.25, 0.7));
      R(ctx, a - 34, base - hs[i] * p, 68, hs[i] * p, i % 2 ? ctx.G : GD, 10, 0.92);
    });
    const A = [90, 930];
    const B = [585, 560];
    const ang = Math.atan2(B[0] - A[0], -(B[1] - A[1]));
    const pos = (tt: number) => {
      const u = eio(pr(tt, 1.2, 1.7));
      return [lp(A[0], B[0], u), lp(A[1], B[1], u)];
    };
    if (t > 1.2) {
      for (let k = 0; k < 12; k++) {
        const tk = t - k * 0.055;
        if (tk < 1.2) continue;
        const q = pos(tk);
        Ci(ctx, q[0] - Math.sin(ang) * 55, q[1] + Math.cos(ang) * 55, 8 + k * 1.6, WH, Math.max(0, 0.38 - k * 0.025));
      }
      const q = pos(t);
      if (t > 2.9) q[1] += Math.sin((t - 2.9) * 3) * 7;
      rocket(ctx, q[0], q[1], ang, t);
    }
  },
  retail(ctx, t) {
    shop(ctx, 360, 930, 400, 330, (ctx.d.brand || 'SHOP').toUpperCase());
    [[140, 1010, 0], [590, 1000, 1], [480, 1040, 0]].forEach((q, i) =>
      person(ctx, q[0], q[1], 1.15, { ...cast(i + 1, [SK, OR, '#aa6eff'][i]), wv: t * 7 + i })
    );
    person(ctx, 360, 934, 1.15, { skin: '#8d5524', shirt: ctx.DG, hair: '#140f0c', apron: 1, wv: t * 8 });
  },
  food(ctx, t) {
    const y = 690 + Math.sin(t * 3) * 6;
    ctx.c.fillStyle = '#f4f4f4';
    ctx.c.beginPath();
    ctx.c.ellipse(360, 930, 230, 45, 0, 0, 7);
    ctx.c.fill();
    for (let i = 0; i < 3; i++) {
      const x0 = 300 + i * 60;
      const w = 14 * Math.sin(t * 3 + i);
      Ln(ctx, [[x0, y - 130], [x0 + w, y - 170], [x0 - w, y - 210], [x0, y - 250]], 'rgba(255,255,255,.5)', 8);
    }
    R(ctx, 190, y + 170, 340, 55, '#d9902f', 26);
    R(ctx, 175, y + 120, 370, 55, '#5b2a14', 26);
    P(ctx, [[185, y + 112], [535, y + 112], [510, y + 150], [460, y + 120], [360, y + 160], [250, y + 120], [210, y + 150]], GD);
    R(ctx, 170, y + 85, 380, 42, '#58c24b', 20);
    R(ctx, 190, y + 70, 340, 28, '#e03b30', 14);
    ctx.c.fillStyle = '#e8a13a';
    ctx.c.beginPath();
    ctx.c.moveTo(180, y + 70);
    ctx.c.quadraticCurveTo(360, y - 130, 540, y + 70);
    ctx.c.closePath();
    ctx.c.fill();
    [[300, y - 10], [360, y - 40], [420, y - 10], [330, y + 25], [400, y + 25]].forEach((q) =>
      Ci(ctx, q[0], q[1], 5, '#fff6d8')
    );
  },
  fashion(ctx, t) {
    ctx.c.save();
    ctx.c.translate(360, 520);
    ctx.c.rotate(Math.sin(t * 2) * 0.05);
    ctx.c.strokeStyle = '#ccc';
    ctx.c.lineWidth = 6;
    ctx.c.beginPath();
    ctx.c.arc(0, -30, 18, 0.7, 5.6);
    ctx.c.stroke();
    Ln(ctx, [[-110, 60], [0, 10], [110, 60]], '#ddd', 8);
    P(ctx, [[-45, 70], [45, 70], [60, 150], [150, 420], [-150, 420], [-60, 150]], ctx.G);
    P(ctx, [[-45, 70], [45, 70], [0, 100]], WH, 0.35);
    R(ctx, -60, 145, 120, 14, GD, 5);
    ctx.c.restore();
    [[130, 640], [600, 700], [200, 900], [560, 520]].forEach((s, i) =>
      sparkle(ctx, s[0], s[1], 10 + 5 * Math.sin(t * 3 + i), 0.5 + 0.4 * Math.sin(t * 3 + i) ** 2)
    );
  },
  tech(ctx, t) {
    const [x0, y0, x1] = phone(ctx, 360, 740, 260, 470);
    for (let i = 0; i < 4; i++) {
      const w = x1 - x0 - 40 - ((i * 37) % 60);
      R(ctx, x0 + 20, y0 + 20 + i * 70, w * pr(t, 0.4 + i * 0.3, 0.6), 44, i % 2 ? ctx.G : '#cfd8e3', 12);
    }
    for (let i = 0; i < 5; i++) {
      const a = t * 0.8 + i * 1.2566;
      const x = 360 + Math.cos(a) * 230;
      const y = 740 + Math.sin(a) * 150;
      Ci(ctx, x, y, 22, i % 2 ? GD : SK, 0.9);
      Ci(ctx, x, y, 8, WH);
    }
  },
  auto(ctx, t) {
    const y = 780 + Math.sin(t * 14) * 2;
    for (let i = 0; i < 8; i++)
      R(ctx, ((((i * 110 - t * 400) % 880) + 880) % 880) - 80, 985, 60, 8, WH, 3, 0.5);
    R(ctx, 130, y, 460, 110, ctx.G, 40);
    P(ctx, [[220, y], [270, y - 90], [450, y - 90], [520, y]], ctx.G);
    P(ctx, [[245, y - 5], [280, y - 75], [355, y - 75], [355, y - 5]], '#bfe6ff');
    P(ctx, [[370, y - 5], [370, y - 75], [440, y - 75], [490, y - 5]], '#bfe6ff');
    [240, 470].forEach((wx) => {
      Ci(ctx, wx, y + 115, 48, '#111');
      Ci(ctx, wx, y + 115, 28, '#9aa5b1');
      for (let k = 0; k < 4; k++) {
        const a = t * 10 + k * 1.5708;
        Ln(ctx, [[wx, y + 115], [wx + Math.cos(a) * 26, y + 115 + Math.sin(a) * 26]], '#333', 4);
      }
    });
    Ci(ctx, 585, y + 45, 10, GD);
    for (let i = 0; i < 3; i++) {
      const o = (t * 300) % 40;
      Ln(ctx, [[110 - i * 30 - o, y + 30 + i * 25], [60 - i * 30 - o, y + 30 + i * 25]], WH, 5, 0.4);
    }
  },
  property(ctx, t) {
    const g = 980;
    for (let i = 0; i < 12; i++) {
      const a = t * 0.4 + i * 0.5236;
      Ln(ctx, [[570 + Math.cos(a) * 70, 520 + Math.sin(a) * 70], [570 + Math.cos(a) * 100, 520 + Math.sin(a) * 100]], GD, 6, 0.8);
    }
    Ci(ctx, 570, 520, 52, GD);
    R(ctx, 150, g - 300, 420, 300, '#f5ead6', 8);
    P(ctx, [[120, g - 300], [360, g - 520], [600, g - 300]], '#c0462e');
    R(ctx, 320, g - 190, 100, 190, '#7d4b2a', 8);
    Ci(ctx, 402, g - 95, 6, GD);
    [[190, g - 250], [440, g - 250]].forEach((q) => {
      R(ctx, q[0], q[1], 100, 90, '#96d2f0', 8);
      Ln(ctx, [[q[0] + 50, q[1]], [q[0] + 50, q[1] + 90]], WH, 4);
    });
    R(ctx, 60, g, 600, 8, WH, 4, 0.25);
    R(ctx, 90, g - 180, 24, 180, '#6b4423');
    Ci(ctx, 102, g - 230, 60 + 3 * Math.sin(t * 2), '#3fae5a');
  },
  beauty(ctx, t) {
    for (let i = 0; i < 8; i++) {
      const a = t * 0.3 + i * 0.7854;
      Ci(ctx, 360 + Math.cos(a) * 110, 740 + Math.sin(a) * 110, 70, ctx.G, 0.8);
    }
    Ci(ctx, 360, 740, 60, GD);
    Ci(ctx, 360, 740, 30, WH, 0.6);
    for (let i = 0; i < 8; i++)
      sparkle(ctx, 120 + ((i * 97) % 480), 500 + ((i * 131) % 480), 8 + 5 * Math.sin(t * 3 + i), 0.4 + 0.4 * Math.sin(t * 3 + i * 2) ** 2);
  },
  edu(ctx, t) {
    const y = 520 + Math.sin(t * 3) * 8;
    P(ctx, [[360, 860], [130, 820], [130, 640], [360, 680]], WH);
    P(ctx, [[360, 860], [590, 820], [590, 640], [360, 680]], '#e6eef7');
    Ln(ctx, [[360, 680], [360, 860]], '#aab', 4);
    for (let i = 0; i < 4; i++) {
      Ln(ctx, [[160, 700 + i * 28], [330, 725 + i * 28]], '#9ab', 5);
      Ln(ctx, [[390, 725 + i * 28], [560, 700 + i * 28]], '#9ab', 5);
    }
    P(ctx, [[360, y - 60], [500, y], [360, y + 60], [220, y]], '#1b1f3a');
    R(ctx, 300, y + 25, 120, 50, '#1b1f3a', 10);
    Ln(ctx, [[500, y], [500, y + 70]], GD, 5);
    Ci(ctx, 500, y + 78, 9, GD);
  },
  office(ctx, t) {
    const y = 780;
    R(ctx, 80, y + 120, 560, 24, '#8a5a2b', 8);
    R(ctx, 110, y + 144, 22, 150, '#6b4423');
    R(ctx, 588, y + 144, 22, 150, '#6b4423');
    person(ctx, 170, y + 120, 1.4, { ...cast(2), wv: t * 5 });
    person(ctx, 550, y + 120, 1.4, { ...cast(3), tie: 1 });
    R(ctx, 250, y - 60, 220, 150, '#222', 12);
    R(ctx, 260, y - 50, 200, 130, WH, 6);
    [40, 70, 100, 60].forEach((h, i) => {
      const q = h * pr(t, 0.4 + i * 0.3, 0.7);
      R(ctx, 285 + i * 42, y + 70 - q, 28, q, i % 2 ? ctx.G : GD, 4);
    });
    R(ctx, 220, y + 90, 280, 30, '#444', 8);
  },
  gym(ctx, t) {
    const y = 760 + Math.sin(t * 4) * 14;
    Ln(ctx, [[150, y], [570, y]], '#444', 14);
    [[150, 50], [200, 36], [570, 50], [520, 36]].forEach((q) => R(ctx, q[0] - q[1] / 2, y - q[1], q[1], q[1] * 2, ctx.G, 8));
    person(ctx, 360, 990, 1.7, { ...cast(0), wv: t * 6 });
    for (let i = 0; i < 6; i++)
      sparkle(ctx, 100 + ((i * 113) % 520), 520 + ((i * 71) % 300), 9, 0.5 + 0.4 * Math.sin(t * 4 + i), GD);
  },
  farm(ctx, t) {
    const g = 900;
    Ci(ctx, 580, 520, 55 + 3 * Math.sin(t * 2), GD);
    R(ctx, 110, g - 250, 260, 250, '#c0462e', 8);
    P(ctx, [[90, g - 250], [240, g - 370], [390, g - 250]], '#7d2e1e');
    R(ctx, 200, g - 150, 80, 150, '#f5ead6', 6);
    Ln(ctx, [[200, g - 150], [280, g]], '#7d2e1e', 5);
    Ln(ctx, [[280, g - 150], [200, g]], '#7d2e1e', 5);
    for (let r = 0; r < 3; r++)
      for (let i = 0; i < 9; i++) {
        const x = 60 + i * 72 + r * 20;
        const y = g + 40 + r * 55;
        const h = (20 + 10 * pr(t, 0.3 + i * 0.1, 0.8)) * 2 + Math.sin(t * 2 + i) * 3;
        Ln(ctx, [[x, y], [x, y - h]], '#3fae5a', 6);
        Ci(ctx, x, y - h, 10, i % 2 ? GD : '#e03b30');
      }
    person(ctx, 540, g + 10, 1.3, { ...cast(1), wv: t * 6 });
  },
  health(ctx, t) {
    const z = 1 + 0.05 * Math.sin(t * 5);
    Ci(ctx, 360, 650, 200, WH, 0.95);
    R(ctx, 360 - 30 * z, 650 - 100 * z, 60 * z, 200 * z, RD, 12);
    R(ctx, 360 - 100 * z, 650 - 30 * z, 200 * z, 60 * z, RD, 12);
    const pts: number[][] = [];
    for (let i = 0; i <= 40; i++) {
      const x = 40 + i * 16;
      const ph = (i + t * 14) % 20;
      const y = 950 - (ph === 8 ? 60 : ph === 9 ? -50 : ph === 10 ? 30 : 0);
      pts.push([x, y]);
    }
    Ln(ctx, pts, ctx.G, 6);
    person(ctx, 570, 1080, 1.3, { ...cast(1), apron: 1, gl: 1, wv: t * 6 });
  },
};

export function crowd(ctx: DrawContext, t: number) {
  const g = 900;
  const px = 560;
  const py = 600;
  const [x0, y0, x1] = phone(ctx, px, py, 150, 280);
  [0, 1, 2].forEach((i) => R(ctx, x0 + 10 + (i % 2) * 14, y0 + 14 + i * 46, x1 - x0 - 34, 32, i % 2 ? '#dcf8c6' : WH, 9));
  for (let k = 0; k < 4; k++) {
    const u = (t * 0.5 + k / 4) % 1;
    R(
      ctx,
      lp(px - 70, 200, u) - 15,
      lp(py, g - 80, u) - Math.sin(u * 3.14) * 80 - 10,
      30,
      20,
      ctx.G,
      6,
      Math.min(1, u * 5) * (1 - u ** 3)
    );
  }
  const cs = ['#8d5524', '#e0ac69', '#5c381e', '#c68642', '#8d5524'];
  const sh = [SK, OR, '#aa6eff', '#ff5f7d', GD];
  let n = 0;
  cs.forEach((s, i) => {
    const ta = 0.8 + i * 0.6;
    const u = pr(t, ta, 1.6);
    if (t < ta) return;
    if (u >= 1) n++;
    person(ctx, lp(i % 2 ? 770 : -50, 90 + i * 130, eo(u)), g + 70 + (i % 3) * 45, 1.15, {
      ...cast(i, sh[i]),
      ph: u < 1 ? t * 12 : 0,
      bob: u < 1 ? 1 : 0,
      wv: u >= 1 ? t * 7 + i : null,
    });
  });
  R(ctx, 190, 1170, 340, 84, '#000', 22, 0.4);
  T(ctx, 'HAPPY CUSTOMERS', 360, 1194, 18, '#d2e1eb');
  T(ctx, String(n), 360, 1232, 40, ctx.G);
}

export function sHook(ctx: DrawContext, S: Scene, t: number) {
  let sz = 76;
  let ls = wl(ctx, S.t, sz, 640);
  while (ls.length > 4 && sz > 40) {
    sz -= 6;
    ls = wl(ctx, S.t, sz, 640);
  }
  const cols = [WH, ctx.G, WH, GD];
  ls.forEach((l, i) => {
    const p = pr(t, 0.2 + i * 0.3, 0.6);
    T(ctx, l, 360, 120 + i * sz * 1.15 + (1 - eb(p)) * 50, sz, cols[i % 4], eo(cp(p * 1.6)), { w: 650, sh: 1 });
  });
  (HERO[ctx.d.type] || HERO.growth)(ctx, t);
  [[70, 520], [640, 460], [90, 800], [660, 700]].forEach((s, i) =>
    sparkle(ctx, s[0], s[1], 9 + 5 * Math.sin(t * 3 + i), 0.4 + 0.4 * Math.sin(t * 3 + i * 2) ** 2)
  );
  const a = eo(pr(t, 3.2, 0.6));
  if (a > 0 && S.s) {
    R(ctx, 50, 1050, 620, 170, '#000', 24, 0.35 * a);
    const z = S.s.length > 70 ? 30 : 36;
    const h = wl(ctx, S.s, z, 580).length * z * 1.3;
    Pa(ctx, S.s, 360, 1135 - h / 2, z, 580, GD, a);
  }
}

export function sStory(ctx: DrawContext, S: Scene, t: number) {
  const a = eo(pr(t, 0.3, 0.5));
  const z = S.t.length > 90 ? 30 : 38;
  const h1 = wl(ctx, S.t, z, 600).length * z * 1.3;
  const h2 = S.s ? wl(ctx, S.s, 26, 600, false).length * 26 * 1.3 + 10 : 0;
  R(ctx, 36, 44, 648, h1 + h2 + 50, '#000', 26, 0.38 * a);
  Pa(ctx, S.t, 360, 70, z, 600, WH, a, { sh: 1 });
  if (S.s) Pa(ctx, S.s, 360, 80 + h1, 26, 600, WH, a, { b: false });
  crowd(ctx, t);
}

export function sList(ctx: DrawContext, S: Scene, t: number) {
  const p = eo(pr(t, 0.1, 0.6));
  const fs = S.items || [];
  const n = Math.max(1, fs.length);
  const sp = Math.min(185, 900 / n);
  const h = sp - 25;
  T(ctx, S.t || 'WHAT YOU GET', 360, 95, S.t.length > 16 ? 40 : 56, WH, p, { sh: 1, w: 650 });
  R(ctx, 250, 140, 220 * p, 8, ctx.G, 4);

  fs.forEach((f, i) => {
    const s0 = 0.9 + i * 2;
    const pp = pr(t, s0, 0.65);
    if (pp <= 0) return;
    const off = (1 - eb(pp)) * 720;
    const y = 190 + i * sp;
    const al = eo(cp(pp * 2));
    const m = y + h / 2;
    R(ctx, 40 + off, y, 640, h, WH, 28, 0.11 * al);
    ctx.c.strokeStyle = ctx.G;
    ctx.c.lineWidth = 2;
    ctx.c.globalAlpha = al;
    ctx.c.beginPath();
    ctx.c.roundRect(40 + off, y, 640, h, 28);
    ctx.c.stroke();
    ctx.c.globalAlpha = 1;

    Ci(ctx, 116 + off, m, 50, '#083c42', al);
    Ci(ctx, 116 + off, m, 50, null, al, ctx.G, 3);
    IC[i % 5](ctx, 116 + off, m, t);
    let sz = 30;
    let ls = wl(ctx, f, sz, 400);
    if (ls.length > 2) {
      sz = 24;
      ls = wl(ctx, f, sz, 400);
    }
    ls.forEach((l, j) => T(ctx, l, 190 + off, m + (j - (ls.length - 1) / 2) * sz * 1.3, sz, WH, al, { a: 'left', w: 400 }));
    const cq = eb(pr(t, s0 + 0.5, 0.45));
    if (cq > 0) {
      Ci(ctx, 630 + off, m, 24 * cq, ctx.G);
      const s = 26 * cq;
      Ln(ctx, [[630 + off - 0.42 * s, m], [630 + off - 0.1 * s, m + 0.34 * s], [630 + off + 0.46 * s, m - 0.32 * s]], WH, Math.max(3, 0.26 * s));
    }
  });
  T(ctx, ctx.d.brand, 360, 1190, 24, WH, 0.6 * p, { b: false, w: 640 });
}

export function star(ctx: DrawContext, a: number, b: number, ro: number, ri: number, n: number, rot: number, f: string, al = 1) {
  const p: number[][] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro;
    const an = (rot + (i * 180) / n) * 0.01745;
    p.push([a + r * Math.cos(an), b + r * Math.sin(an)]);
  }
  P(ctx, p, f, al);
}

export function sOffer(ctx: DrawContext, S: Scene, t: number) {
  const a0 = eo(pr(t, 0, 0.5));
  if (S.t) Pa(ctx, S.t.toUpperCase(), 360, 110, 44, 650, WH, a0, { sh: 1 });
  for (let i = 0; i < 16; i++) {
    const x = ((i * 83 + 30) % 700) + 10;
    const y = ((t * (160 + (i % 5) * 30) + i * 140) % 1340) - 60;
    const w = Math.abs(Math.cos(t * 5 + i)) * 16 + 3;
    ctx.c.globalAlpha = 0.9;
    ctx.c.fillStyle = GD;
    ctx.c.beginPath();
    ctx.c.ellipse(x, y, w, 16, 0, 0, 7);
    ctx.c.fill();
    ctx.c.globalAlpha = 1;
  }
  const pp = eb(pr(t, 0.4, 0.9));
  const pul = 1 + 0.035 * Math.sin(t * 6);
  const R0 = 270 * pp * pul;
  if (pp > 0.02) {
    star(ctx, 360, 640, R0, R0 * 0.85, 22, t * 18, GD);
    star(ctx, 360, 640, R0 * 0.9, R0 * 0.78, 22, -t * 12, OR, 0.9);
    Ci(ctx, 360, 640, R0 * 0.74, '#e84a14');
    Ci(ctx, 360, 640, R0 * 0.74, null, 1, GD, 6);
    T(ctx, S.p || 'OFFER', 360, 644, 126 * pp * pul, WH, 1, { w: R0 * 1.3, sh: 1 });
    const fp = eb(pr(t, 0.9, 0.6));
    flame(ctx, 70, 760, 70 * fp, t);
    flame(ctx, 650, 760, 70 * fp, t + 1.3);
  }
  const a2 = eo(pr(t, 2.2, 0.6));
  if (S.s) {
    R(ctx, 50, 1010, 620, 170, '#000', 26, 0.38 * a2);
    Pa(ctx, S.s, 360, 1038, 33, 580, WH, a2);
  }
}

export function sCta(ctx: DrawContext, S: Scene, t: number) {
  const a0 = eo(pr(t, 0.1, 0.6));
  if (S.t) {
    let sz = 46;
    let ls = wl(ctx, S.t, sz, 650);
    while (ls.length > 4) ls = wl(ctx, S.t, (sz -= 4), 650);
    Pa(ctx, S.t, 360, 40, sz, 650, WH, a0, { sh: 1 });
  }
  const pp = eb(pr(t, 0.3, 0.7));
  phone(ctx, 360, 640 + (1 - pp) * 300, 340, 560, cp(pp * 2));
  if (pp > 0.95) {
    const p1 = eo(pr(t, 1, 0.4));
    bub(ctx, 255, 455 + (1 - p1) * 16, 515, 525 + (1 - p1) * 16, 1, p1, ['Hi! I’d like to know', 'more.']);
    if (t >= 2.2 && t < 3.4) {
      R(ctx, 205, 548, 100, 46, WH, 16);
      for (let k = 0; k < 3; k++) Ci(ctx, 235 + k * 22, 571 - 5 * Math.max(0, Math.sin(t * 9 - k * 0.9)), 5.5, '#96a0af');
    }
    const p2 = eo(pr(t, 3.4, 0.4));
    bub(ctx, 205, 545 + (1 - p2) * 16, 465, 615 + (1 - p2) * 16, 0, p2, ['Great! Let’s get you', 'started right away.']);
    const p3 = eo(pr(t, 4.4, 0.4));
    bub(ctx, 305, 640 + (1 - p3) * 16, 515, 690 + (1 - p3) * 16, 1, p3, ['Let’s do it!']);
    R(ctx, 200, 862, 320, 44, WH, 22);
    T(ctx, 'Type a message', 222, 884, 17, '#96a0af', 1, { a: 'left', b: false });
    Ci(ctx, 497, 884, 17, ctx.G);
    P(ctx, [[490, 876], [506, 884], [490, 892]], WH);
  }
  const ep = eb(pr(t, 0.9, 0.6));
  if (ep > 0) {
    const ex = 590;
    const ey = 400 + Math.sin(t * 4) * 8;
    const s = (1 + 0.06 * Math.sin(t * 6)) * ep;
    R(ctx, ex - 40 * s, ey - 28 * s, 80 * s, 56 * s, WH, 7);
    Ln(ctx, [[ex - 38 * s, ey - 24 * s], [ex, ey + 4 * s], [ex + 38 * s, ey - 24 * s]], ctx.G, 5);
    Ci(ctx, ex + 36 * ep, ey - 28 * ep, 11 * ep, RD);
  }
  const lp2 = eb(pr(t, 4.8, 0.7));
  const la = eo(pr(t, 4.8, 0.6));
  if (la > 0) {
    R(ctx, 40, 960, 640, 290, '#000', 30, 0.3 * la);
    logo(ctx, 360, 1030 + (1 - lp2) * 30, 50 * cp(lp2, 0, 1.1), la);
    T(ctx, ctx.d.brand, 360, 1118, 54, WH, la, { w: 620, sh: 1 });
    T(ctx, ctx.d.tagline, 360, 1172, 34, GD, la, { w: 620 });
    [[120, 1050], [610, 1060], [160, 1190], [570, 1200]].forEach((s, i) =>
      sparkle(ctx, s[0], s[1], 10 + 4 * Math.sin(t * 4 + i), la * (0.4 + 0.4 * Math.sin(t * 3 + i) ** 2), GD)
    );
  }
}

export function sDemo(ctx: DrawContext, S: Scene, t: number) {
  const a = eo(pr(t, 0.15, 0.55));
  T(ctx, S.t || 'SEE IT IN ACTION', 360, 100, 48, WH, a, { sh: 1, w: 650 });
  (HERO[ctx.d.type] || HERO.growth)(ctx, t);
  const p = eo(pr(t, 1, 0.7));
  R(ctx, 55, 1000, 610, 170, '#000', 24, 0.45 * p);
  Pa(ctx, S.s || 'Designed to make your life easier', 360, 1030, 30, 550, WH, p, { sh: 1 });
  if (S.items && S.items.length) {
    const q = eb(pr(t, 1.4, 0.6));
    Ci(ctx, 360, 1180, 27 * q, ctx.G);
    T(ctx, '✓', 360, 1180, 30, WH, q);
  }
}

export function sSteps(ctx: DrawContext, S: Scene, t: number) {
  const a = eo(pr(t, 0.1, 0.5));
  T(ctx, S.t || 'HOW IT WORKS', 360, 105, 48, WH, a, { sh: 1, w: 650 });
  const items = (S.items && S.items.length ? S.items : ['Discover', 'Choose your plan', 'Get started']).slice(0, 4);
  const gap = items.length > 3 ? 225 : 270;
  items.forEach((v, i) => {
    const p = eo(pr(t, 0.35 + i * 0.55, 0.5));
    R(ctx, 48, 260 + i * gap, 624, 180, '#000', 24, 0.35 * p);
    Ci(ctx, 125, 260 + i * gap + 90, 43, ctx.G, p);
    T(ctx, String(i + 1), 125, 260 + i * gap + 90, 38, WH, p);
    const lines = wl(ctx, v, 30, 420);
    lines.slice(0, 2).forEach((l, j) => T(ctx, l, 190, 260 + i * gap + 90 + (j - (lines.length - 1) / 2) * 38, 30, WH, p, { a: 'left', w: 430 }));
    if (i < items.length - 1) {
      const q = eo(pr(t, 0.65 + i * 0.55, 0.45));
      Ln(ctx, [[360, 260 + i * gap + 180], [360, 260 + i * gap + gap - 8]], ctx.G, 5, q);
      P(ctx, [[350, 260 + i * gap + gap - 20], [360, 260 + i * gap + gap - 5], [370, 260 + i * gap + gap - 20]], ctx.G, q);
    }
  });
}

export function sTestimonial(ctx: DrawContext, S: Scene, t: number) {
  const a = eo(pr(t, 0.2, 0.6));
  (HERO[ctx.d.type] || HERO.growth)(ctx, t);
  R(ctx, 38, 170, 644, 400, '#071421', 28, 0.78 * a);
  Ci(ctx, 360, 250, 56, '#f1c27d', a);
  Ci(ctx, 360, 234, 23, '#8d5524', a);
  R(ctx, 324, 258, 72, 55, '#4285f4', 18, a);
  for (let i = 0; i < 5; i++) T(ctx, '★', 280 + i * 40, 330, 31, GD, a);
  Pa(ctx, S.t || '“Excellent service!”', 360, 375, 34, 570, WH, a, { sh: 1 });
  Pa(ctx, S.s || 'I would recommend this to anyone.', 360, 470, 24, 560, '#d7e6f0', a, { b: false });
  T(ctx, '— A HAPPY CUSTOMER', 360, 535, 18, GD, a);
}

export function sStats(ctx: DrawContext, S: Scene, t: number) {
  const a = eo(pr(t, 0.2, 0.5));
  T(ctx, S.t || 'RESULTS THAT SPEAK', 360, 105, 45, WH, a, { sh: 1, w: 660 });
  const labels = (S.items && S.items.length ? S.items : ['More reach', 'More engagement', 'More growth']).slice(0, 4);
  const base = 900;
  const barW = Math.min(115, 520 / labels.length);
  labels.forEach((v, i) => {
    const p = eo(pr(t, 0.4 + i * 0.35, 0.75));
    const h = (140 + (i % 3) * 75) * p;
    const x = 360 + (i - (labels.length - 1) / 2) * 145;
    R(ctx, x - barW / 2, base - h, barW, h, i % 2 ? GD : ctx.G, 12);
    T(ctx, String(Math.round((35 + i * 27) * p)) + '%', x, base - h - 32, 27, WH, p, { sh: 1 });
    Pa(ctx, v, x, base + 35, 17, 135, WH, a, { b: false });
  });
  Ln(ctx, [[90, base], [630, base]], WH, 3, 0.5);
  sparkle(ctx, 120, 590, 22, a, GD);
  sparkle(ctx, 600, 540, 27, a, GD);
  if (S.s) Pa(ctx, S.s, 360, 1080, 29, 590, WH, a, { sh: 1 });
}

export function sCompare(ctx: DrawContext, S: Scene, t: number) {
  const a = eo(pr(t, 0.15, 0.5));
  const p = eo(pr(t, 0.7, 0.7));
  T(ctx, S.t || 'BEFORE & AFTER', 360, 105, 48, WH, a, { sh: 1 });
  R(ctx, 36, 220, 310, 650, '#532e36', 26, a * 0.9);
  R(ctx, 374, 220, 310, 650, '#075e54', 26, a * 0.9);
  T(ctx, 'BEFORE', 191, 270, 27, WH, a);
  T(ctx, 'AFTER', 529, 270, 27, WH, a);
  for (let i = 0; i < 4; i++) {
    const h = 65 + i * 28;
    R(ctx, 72, 340 + i * 112, 220, h, '#b9757c', 12, a * 0.7);
    R(ctx, 410, 340 + i * 112, 220, h, ctx.G, 12, a * p);
  }
  Ci(ctx, 360, 540, 44, GD, a);
  T(ctx, '➜', 360, 540, 45, '#17202a', a);
  Pa(ctx, S.s || 'A smarter way to get better results', 360, 1000, 31, 600, WH, a, { sh: 1 });
  (HERO[ctx.d.type] || HERO.growth)(ctx, t * 0.45);
}

export function sPresenter(ctx: DrawContext, S: Scene, t: number) {
  const a = eo(pr(t, 0.1, 0.6));
  const p = eo(pr(t, 0.5, 0.6));
  R(ctx, 35, 170, 650, 700, '#071421', 28, 0.28 * a);
  person(ctx, 190, 1010, 2.05, { ...cast(1, ctx.G), ph: t * 5, bob: 0.7, wv: t * 5 });
  T(ctx, S.t || 'LET ME SHOW YOU', 430, 300, 34, GD, a, { a: 'center', sh: 1, w: 360 });
  R(ctx, 330, 350, 330, 240, '#fff', 24, 0.96 * a);
  Pa(ctx, S.s || 'A simple solution for your everyday needs.', 495, 410, 28, 275, '#172536', a, { sh: 1 });
  const q = eo(pr(t, 1.5, 0.6));
  Ci(ctx, 470, 520, 30, ctx.G, q);
  T(ctx, '✓', 470, 520, 32, WH, q);
  if (S.items && S.items.length) {
    const item = S.items[Math.floor(t / 1.4) % S.items.length];
    R(ctx, 320, 700, 345, 100, ctx.G, 20, 0.9 * p);
    Pa(ctx, item, 492, 735, 25, 300, WH, p, { sh: 1 });
  }
  sparkle(ctx, 105, 330, 18, a, GD);
  sparkle(ctx, 630, 620, 20, a, ctx.G);
}

export function sConversation(ctx: DrawContext, S: Scene, t: number) {
  person(ctx, 165, 990, 1.8, { ...cast(0, '#ff7b55'), ph: t * 4, bob: 0.8, wv: t * 6 });
  person(ctx, 555, 990, 1.8, { ...cast(1, '#36b6a5'), ph: t * 4 + 1, bob: 0.8, wv: t * 6 + 2 });
  const p1 = eo(pr(t, 0.5, 0.5));
  const p2 = eo(pr(t, 2.2, 0.6));
  bub(ctx, 35, 270, 315, 390, 0, p1, wl(ctx, S.t || 'What if there was an easier way?', 25, 250).slice(0, 3));
  bub(ctx, 380, 440, 680, 560, 1, p2, wl(ctx, S.s || 'Yes! Here is how it works.', 25, 250).slice(0, 3));
  const q = eo(pr(t, 3.2, 0.5));
  R(ctx, 115, 680, 490, 95, '#071421', 22, 0.55 * q);
  Pa(ctx, S.items && S.items.length ? S.items[Math.floor(t / 1.5) % S.items.length] : 'Let’s get started together', 360, 715, 25, 430, WH, q, { sh: 1 });
}

export function sTeam(ctx: DrawContext, S: Scene, t: number) {
  const a = eo(pr(t, 0.1, 0.5));
  const people = [{ x: 150, shirt: '#f47a57' }, { x: 360, shirt: '#4f9fe8' }, { x: 570, shirt: '#35b89b' }];
  people.forEach((v, i) => {
    const p = eo(pr(t, 0.25 + i * 0.35, 0.5));
    person(ctx, v.x, 980, 1.65, { ...cast(i, v.shirt), ph: t * 4 + i, bob: 0.7, wv: t * 5 + i });
    const q = eo(pr(t, 1 + i * 0.6, 0.5));
    Ci(ctx, v.x, 650, 43, WH, q);
    T(ctx, ['✓', '★', '↗'][i], v.x, 650, 34, ctx.G, q);
  });
  T(ctx, S.t || 'A TEAM THAT HELPS YOU GROW', 360, 190, 39, WH, a, { sh: 1, w: 650 });
  const line = S.s || 'People, ideas and solutions working together';
  Pa(ctx, line, 360, 1080, 27, 600, GD, a, { sh: 1 });
}

export const SCN: Record<string, (ctx: DrawContext, S: Scene, t: number) => void> = {
  hook: sHook,
  story: sStory,
  list: sList,
  offer: sOffer,
  cta: sCta,
  demo: sDemo,
  steps: sSteps,
  testimonial: sTestimonial,
  stats: sStats,
  compare: sCompare,
  presenter: sPresenter,
  conversation: sConversation,
  team: sTeam,
};

export const DUR: Record<string, (S: Scene) => number> = {
  hook: () => 6,
  story: () => 6.5,
  list: (S) => 2.4 + Math.max(1, (S.items || []).length) * 2,
  offer: () => 5.5,
  cta: () => 7.5,
  demo: () => 6.5,
  steps: (S) => 3 + Math.max(3, (S.items || []).length) * 1.4,
  testimonial: () => 6.5,
  stats: () => 6,
  compare: () => 6.5,
  presenter: () => 7,
  conversation: () => 7,
  team: () => 6.5,
};

export function plan(d: StoryboardData) {
  const du = d.scenes.map((S) => (DUR[S.k] ? DUR[S.k](S) : 6));
  let s = 0;
  const st = du.map((v) => {
    const r = s;
    s += v;
    return r;
  });
  return { du, st, tot: Math.max(s, 1) };
}

export function hand(ctx: DrawContext, x: number, y: number) {
  ctx.c.save();
  ctx.c.translate(x, y);
  ctx.c.rotate(0.5);
  R(ctx, -7, -95, 14, 85, '#222', 5);
  P(ctx, [[-7, -10], [7, -10], [0, 8]], '#222');
  R(ctx, -16, -120, 32, 50, '#e0ac69', 14);
  ctx.c.restore();
}

export interface OffscreenBuffers {
  oc: HTMLCanvasElement;
  oct: CanvasRenderingContext2D;
  sc_: HTMLCanvasElement;
  scx: CanvasRenderingContext2D;
  ec: HTMLCanvasElement;
  ecx: CanvasRenderingContext2D;
}

export function createOffscreenBuffers(): OffscreenBuffers {
  const oc = document.createElement('canvas');
  oc.width = 720;
  oc.height = 1280;
  const oct = oc.getContext('2d')!;

  const sc_ = document.createElement('canvas');
  sc_.width = 360;
  sc_.height = 640;
  const scx = sc_.getContext('2d', { willReadFrequently: true })!;

  const ec = document.createElement('canvas');
  ec.width = 360;
  ec.height = 640;
  const ecx = ec.getContext('2d')!;

  return { oc, oct, sc_, scx, ec, ecx };
}

export function sketch(buffers: OffscreenBuffers) {
  const { oc, scx, ecx, sc_ } = buffers;
  scx.drawImage(oc, 0, 0, 360, 640);
  const s = scx.getImageData(0, 0, 360, 640).data;
  const out = ecx.createImageData(360, 640);
  const o = out.data;
  const g = new Uint8Array(230400);

  for (let k = 0; k < 230400; k++) {
    g[k] = (s[k * 4] + s[k * 4 + 1] + s[k * 4 + 2]) / 3;
  }

  for (let y = 0; y < 640; y++) {
    for (let x = 0; x < 360; x++) {
      const k = y * 360 + x;
      let m = 0;
      if (y > 0 && y < 639 && x > 0 && x < 359) {
        const gx =
          g[k + 1] * 2 + g[k - 359] + g[k + 361] - g[k - 1] * 2 - g[k - 361] - g[k + 359];
        const gy =
          g[k + 360] * 2 + g[k + 361] + g[k + 359] - g[k - 360] * 2 - g[k - 359] - g[k - 361];
        m = Math.min(1, (Math.abs(gx) + Math.abs(gy)) / 260);
      }
      const j = k * 4;
      const r = s[j];
      const gg = s[j + 1];
      const b = s[j + 2];
      const f = Math.max(r, gg, b) - Math.min(r, gg, b) > 40 ? 0.55 : 0;
      o[j] = (251 + (r - 251) * f) * (1 - m) + 30 * m;
      o[j + 1] = (250 + (gg - 250) * f) * (1 - m) + 30 * m;
      o[j + 2] = (244 + (b - 244) * f) * (1 - m) + 40 * m;
      o[j + 3] = 255;
    }
  }
  ecx.putImageData(out, 0, 0);
}

export function renderAdFrame(
  mc: CanvasRenderingContext2D,
  d: StoryboardData,
  t: number,
  buffers?: OffscreenBuffers
) {
  const pl = plan(d);
  const LIGHT = d.style === 'human';
  let i = -1;
  for (let idx = pl.st.length - 1; idx >= 0; idx--) {
    if (t >= pl.st[idx]) {
      i = idx;
      break;
    }
  }
  if (i < 0) i = 0;
  const lt = t - pl.st[i];
  const curScene = d.scenes[i] || d.scenes[0];

  let G = d.palette.accent || G_DEFAULT;
  let DG = d.palette.bottom || DG_DEFAULT;
  if (d.style === 'human') {
    G = '#4285f4';
    DG = '#1a73e8';
  }

  if (d.style === 'board' && buffers) {
    const bqArr: any[] = [];
    const octCtx: DrawContext = {
      c: buffers.oct,
      LIGHT: false,
      BQ: bqArr,
      d,
      G,
      DG,
    };
    buffers.oct.fillStyle = '#000';
    buffers.oct.fillRect(0, 0, 720, 1280);
    if (SCN[curScene.k]) {
      SCN[curScene.k](octCtx, curScene, lt);
    }
    sketch(buffers);
    const ry = 1280 * eio(pr(lt, 0, 2.2));
    mc.fillStyle = '#fbfaf4';
    mc.fillRect(0, 0, 720, 1280);
    mc.save();
    mc.beginPath();
    mc.rect(0, 0, 720, ry);
    mc.clip();
    mc.imageSmoothingEnabled = true;
    mc.drawImage(buffers.ec, 0, 0, 720, 1280);

    const mainCtx: DrawContext = {
      c: mc,
      LIGHT: false,
      BQ: null,
      d,
      G,
      DG,
    };
    bqArr.forEach((a) => {
      a[4] = '#1b1b24';
      a[6] = Object.assign({}, a[6], { sh: 0 });
      T(mainCtx, a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
    });
    mc.restore();
    if (ry < 1270) hand(mainCtx, 360 + Math.sin(t * 9) * 300, ry);
  } else {
    mc.clearRect(0, 0, 720, 1280);
    const gr = mc.createLinearGradient(0, 0, 0, 1280);
    gr.addColorStop(0, LIGHT ? '#ffffff' : d.palette.top || '#0a192f');
    gr.addColorStop(1, LIGHT ? '#dce8fd' : d.palette.bottom || '#07524a');
    mc.fillStyle = gr;
    mc.fillRect(0, 0, 720, 1280);

    const mainCtx: DrawContext = {
      c: mc,
      LIGHT,
      BQ: null,
      d,
      G,
      DG,
    };
    if (!LIGHT) bokeh(mainCtx, t);
    if (SCN[curScene.k]) {
      SCN[curScene.k](mainCtx, curScene, lt);
    }
  }

  // Additional visual treatments applied after the existing scene renderer.
  // These are genuine canvas effects, not just selector labels.
  if (d.style === 'cinematic') {
    mc.save();
    mc.fillStyle = 'rgba(0,0,0,0.42)';
    mc.fillRect(0, 0, 720, 105);
    mc.fillRect(0, 1175, 720, 105);
    const shade = mc.createRadialGradient(360, 570, 220, 360, 570, 760);
    shade.addColorStop(0, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.46)');
    mc.fillStyle = shade;
    mc.fillRect(0, 0, 720, 1280);
    mc.restore();
  } else if (d.style === 'neon') {
    mc.save();
    mc.globalAlpha = 0.18;
    mc.strokeStyle = d.palette.accent || '#42f5f5';
    mc.lineWidth = 2;
    for (let x = 24; x < 720; x += 48) { mc.beginPath(); mc.moveTo(x, 0); mc.lineTo(x, 1280); mc.stroke(); }
    for (let y = 24; y < 1280; y += 48) { mc.beginPath(); mc.moveTo(0, y); mc.lineTo(720, y); mc.stroke(); }
    mc.globalAlpha = 0.9;
    mc.shadowColor = d.palette.accent || '#42f5f5';
    mc.shadowBlur = 22;
    mc.strokeStyle = d.palette.accent || '#42f5f5';
    mc.lineWidth = 5;
    mc.strokeRect(18, 18, 684, 1244);
    mc.restore();
  } else if (d.style === 'comic') {
    mc.save();
    mc.globalAlpha = 0.17;
    mc.fillStyle = d.palette.accent || '#ffcf33';
    for (let y = 24; y < 1280; y += 18) {
      for (let x = 24 + (Math.floor(y / 18) % 2) * 9; x < 720; x += 18) {
        mc.beginPath(); mc.arc(x, y, 2.2, 0, Math.PI * 2); mc.fill();
      }
    }
    mc.globalAlpha = 1;
    mc.strokeStyle = '#151515';
    mc.lineWidth = 10;
    mc.strokeRect(10, 10, 700, 1260);
    mc.restore();
  } else if (d.style === 'minimal') {
    mc.save();
    mc.globalAlpha = 0.85;
    mc.fillStyle = d.palette.accent || '#4285f4';
    mc.fillRect(44, 215, 120, 7);
    mc.fillRect(44, 1050, 70, 7);
    mc.globalAlpha = 0.12;
    mc.beginPath(); mc.arc(650, 250, 140, 0, Math.PI * 2); mc.fill();
    mc.restore();
  } else if (d.style === 'retro') {
    mc.save();
    mc.globalAlpha = 0.18;
    mc.fillStyle = '#f3c969';
    for (let y = 0; y < 1280; y += 12) mc.fillRect(0, y, 720, 2);
    mc.globalAlpha = 0.32;
    mc.strokeStyle = '#f3c969';
    mc.lineWidth = 4;
    mc.beginPath(); mc.arc(360, 330, 185, 0, Math.PI * 2); mc.stroke();
    mc.restore();
  } else if (d.style === 'paper') {
    mc.save();
    mc.fillStyle = 'rgba(255,250,230,0.16)';
    mc.fillRect(0, 0, 720, 1280);
    mc.globalAlpha = 0.2;
    mc.strokeStyle = '#6d5d46';
    mc.lineWidth = 2;
    for (let y = 28; y < 1280; y += 46) { mc.beginPath(); mc.moveTo(0, y); mc.lineTo(720, y); mc.stroke(); }
    mc.restore();
  } else if (d.style === 'gradient') {
    mc.save();
    const pulse = 0.14 + (Math.sin(t * 1.5) + 1) * 0.07;
    const glow = mc.createRadialGradient(360 + Math.sin(t) * 170, 470 + Math.cos(t * 0.8) * 180, 20, 360, 560, 600);
    glow.addColorStop(0, d.palette.accent || '#42aaff');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    mc.globalAlpha = pulse;
    mc.fillStyle = glow;
    mc.fillRect(0, 0, 720, 1280);
    mc.restore();
  }

  } else if (d.style === 'african-business') {
    mc.save();
    mc.globalAlpha = 0.92;
    mc.fillStyle = '#E67E22';
    mc.beginPath(); mc.moveTo(0, 0); mc.lineTo(210, 0); mc.lineTo(0, 210); mc.fill();
    mc.fillStyle = '#17864b';
    mc.beginPath(); mc.moveTo(720, 1080); mc.lineTo(720, 1280); mc.lineTo(520, 1280); mc.fill();
    mc.fillStyle = '#fff7e8'; mc.fillRect(36, 1030, 648, 130);
    mc.fillStyle = '#1b2430'; mc.font = 'bold 26px system-ui'; mc.textAlign = 'center';
    mc.fillText('YOUR BUSINESS • MORE VISIBILITY', 360, 1085, 610);
    mc.fillStyle = '#E67E22'; mc.fillRect(215, 1110, 290, 7);
    mc.restore();
  } else if (d.style === 'kinetic-type') {
    mc.save();
    const word = (curScene.t || curScene.s || 'YOUR IDEA').toUpperCase();
    const pulse = 1 + Math.sin(t * 5) * 0.045;
    mc.translate(360, 650); mc.rotate(Math.sin(t * 1.7) * 0.035); mc.scale(pulse, pulse);
    mc.fillStyle = 'rgba(0,0,0,.62)'; mc.fillRect(-315, -105, 630, 210);
    mc.strokeStyle = d.palette.accent || '#ffe45e'; mc.lineWidth = 5; mc.strokeRect(-315, -105, 630, 210);
    mc.fillStyle = '#fff'; mc.font = '900 58px system-ui'; mc.textAlign = 'center'; mc.textBaseline = 'middle';
    const words = word.split(/\s+/).slice(0, 5);
    mc.fillText(words.join(' '), 0, 0, 590);
    mc.restore();
  } else if (d.style === 'luxury-commercial') {
    mc.save();
    const gold = '#e7c777';
    const shade = mc.createLinearGradient(0, 0, 720, 1280);
    shade.addColorStop(0, 'rgba(0,0,0,.28)'); shade.addColorStop(.5, 'rgba(20,14,10,.02)'); shade.addColorStop(1, 'rgba(0,0,0,.48)');
    mc.fillStyle = shade; mc.fillRect(0, 0, 720, 1280);
    mc.strokeStyle = gold; mc.lineWidth = 2; mc.strokeRect(34, 34, 652, 1212);
    mc.strokeRect(48, 48, 624, 1184);
    mc.globalAlpha = .65; mc.beginPath(); mc.arc(360, 640, 245 + Math.sin(t) * 7, 0, Math.PI * 2); mc.stroke();
    mc.globalAlpha = 1; mc.fillStyle = gold; mc.fillRect(285, 1080, 150, 3);
    mc.restore();
  } else if (d.style === 'glassmorphism') {
    mc.save();
    const glass = (x:number,y:number,w:number,h:number) => {
      mc.fillStyle = 'rgba(255,255,255,.16)'; mc.fillRect(x,y,w,h);
      mc.strokeStyle = 'rgba(255,255,255,.55)'; mc.lineWidth = 2; mc.strokeRect(x,y,w,h);
      mc.fillStyle = 'rgba(255,255,255,.06)'; mc.fillRect(x+8,y+8,w-16,8);
    };
    glass(34, 170, 652, 145); glass(54, 940, 612, 170);
    mc.globalAlpha = .4; mc.fillStyle = '#fff'; mc.beginPath(); mc.arc(590, 390, 100 + Math.sin(t)*8, 0, Math.PI*2); mc.fill();
    mc.restore();
  } else if (d.style === 'doodle-animation') {
    mc.save();
    mc.strokeStyle = '#fff'; mc.lineWidth = 5; mc.lineCap = 'round'; mc.setLineDash([12, 8]);
    const drift = Math.sin(t * 2) * 12;
    mc.beginPath(); mc.arc(105 + drift, 290, 58, 0, Math.PI * 2); mc.stroke();
    mc.beginPath(); mc.moveTo(525, 280); mc.quadraticCurveTo(610, 210 + drift, 640, 310); mc.lineTo(620, 292); mc.moveTo(640,310); mc.lineTo(646,285); mc.stroke();
    mc.setLineDash([]);
    mc.beginPath(); mc.moveTo(80, 900); mc.bezierCurveTo(220, 820, 220, 1040, 370, 940); mc.bezierCurveTo(480, 865, 540, 1010, 640, 910); mc.stroke();
    mc.restore();
  } else if (d.style === 'modern-2d') {
    mc.save();
    const bob = Math.sin(t * 3) * 12;
    mc.fillStyle = d.palette.accent || '#ff8a3d';
    mc.beginPath(); mc.ellipse(570, 330 + bob, 76, 86, 0, 0, Math.PI*2); mc.fill();
    mc.fillStyle = '#fff'; mc.beginPath(); mc.arc(548, 320 + bob, 11, 0, Math.PI*2); mc.arc(590, 320 + bob, 11, 0, Math.PI*2); mc.fill();
    mc.strokeStyle = '#17243b'; mc.lineWidth = 5; mc.beginPath(); mc.arc(570, 345 + bob, 25, .15, Math.PI-.15); mc.stroke();
    mc.fillStyle = 'rgba(255,255,255,.2)'; mc.fillRect(40, 1035, 640, 6);
    mc.restore();
  } else if (d.style === 'corporate-presentation') {
    mc.save();
    mc.fillStyle = 'rgba(255,255,255,.94)'; mc.fillRect(38, 940, 644, 250);
    mc.fillStyle = '#243b53'; mc.font = 'bold 24px system-ui'; mc.textAlign = 'left'; mc.fillText('KEY POINTS', 68, 980);
    const heights = [75, 125, 98, 164];
    heights.forEach((h,j) => { mc.fillStyle = [d.palette.accent || '#4285f4','#72b7c9','#9cc8d2','#d9e8ec'][j]; mc.fillRect(86+j*130, 1150-h, 66, h); });
    mc.strokeStyle = '#c9d5df'; mc.beginPath(); mc.moveTo(70,1155); mc.lineTo(650,1155); mc.stroke();
    mc.restore();
  } else if (d.style === 'chat-story') {
    mc.save();
    const bubble = (x:number,y:number,w:number,h:number,color:string,align:'left'|'right') => {
      mc.fillStyle = color; mc.beginPath(); mc.roundRect(x,y,w,h,24); mc.fill();
      mc.beginPath(); mc.moveTo(align==='left'?x+28:x+w-28,y+h-3); mc.lineTo(align==='left'?x+12:x+w-12,y+h+18); mc.lineTo(align==='left'?x+55:x+w-55,y+h-3); mc.fill();
    };
    bubble(55, 360, 440, 105, '#fff', 'left'); bubble(215, 500, 450, 120, d.palette.accent || '#25d366', 'right');
    bubble(55, 655, 500, 95, '#fff', 'left');
    mc.fillStyle = '#1d2733'; mc.font = 'bold 22px system-ui'; mc.textAlign = 'left';
    mc.fillText('Can you help me with this?', 82, 420, 385);
    mc.fillStyle = '#fff'; mc.fillText('Absolutely — here is how!', 242, 570, 390);
    mc.fillStyle = '#1d2733'; mc.fillText((curScene.s || 'Let me explain.').slice(0, 34), 82, 710, 440);
    mc.restore();
  } else if (d.style === 'cartoon-3d') {
    mc.save();
    mc.shadowColor = 'rgba(0,0,0,.4)'; mc.shadowBlur = 28; mc.shadowOffsetY = 16;
    mc.fillStyle = d.palette.accent || '#ffb347'; mc.beginPath(); mc.ellipse(360, 700, 185, 205, 0, 0, Math.PI*2); mc.fill();
    mc.shadowColor = 'transparent'; mc.shadowBlur = 0; mc.shadowOffsetY = 0;
    mc.fillStyle = 'rgba(255,255,255,.4)'; mc.beginPath(); mc.ellipse(300, 625, 62, 90, -.3, 0, Math.PI*2); mc.fill();
    mc.fillStyle = '#fff'; mc.beginPath(); mc.arc(320, 690, 27, 0, Math.PI*2); mc.arc(400,690,27,0,Math.PI*2); mc.fill();
    mc.fillStyle = '#243044'; mc.beginPath(); mc.arc(326,690,10,0,Math.PI*2); mc.arc(394,690,10,0,Math.PI*2); mc.fill();
    mc.restore();
  } else if (d.style === 'anime-inspired') {
    mc.save();
    mc.fillStyle = 'rgba(255,255,255,.12)';
    for(let j=0;j<9;j++){ mc.beginPath(); mc.moveTo(0,j*150+t*25%150); mc.lineTo(720,j*150-170+t*25%150); mc.lineTo(720,j*150-120+t*25%150); mc.lineTo(0,j*150+50+t*25%150); mc.fill(); }
    mc.fillStyle = '#fff'; mc.beginPath(); mc.moveTo(510,270); mc.lineTo(550,205); mc.lineTo(560,260); mc.lineTo(625,230); mc.lineTo(590,290); mc.fill();
    mc.strokeStyle = d.palette.accent || '#ff5fa2'; mc.lineWidth = 8; mc.beginPath(); mc.moveTo(65,870); mc.lineTo(230,820); mc.lineTo(180,910); mc.lineTo(340,860); mc.stroke();
    mc.restore();
  } else if (d.style === 'watercolor-storybook') {
    mc.save();
    mc.globalAlpha = .16;
    const colors = ['#f3b7a6','#a7c8b8','#a8bce0','#f0d58b'];
    for(let j=0;j<18;j++){ mc.fillStyle=colors[j%4]; mc.beginPath(); mc.ellipse((j*113+Math.sin(t+j)*16)%720,(j*173)%1280,45+(j%3)*17,32+(j%4)*12,(j%5)*.3,0,Math.PI*2); mc.fill(); }
    mc.globalAlpha = .45; mc.strokeStyle = '#66594e'; mc.lineWidth = 2; mc.strokeRect(28,28,664,1224);
    mc.restore();
  } else if (d.style === 'claymation') {
    mc.save();
    const wobble = Math.sin(t*4)*5;
    mc.fillStyle = 'rgba(0,0,0,.22)'; mc.beginPath(); mc.ellipse(360, 905, 180, 30, 0, 0, Math.PI*2); mc.fill();
    mc.fillStyle = d.palette.accent || '#e8a15b'; mc.beginPath(); mc.ellipse(360, 730+wobble, 140, 160, 0, 0, Math.PI*2); mc.fill();
    mc.fillStyle = 'rgba(255,255,255,.24)'; mc.beginPath(); mc.ellipse(315,680+wobble,45,60,-.4,0,Math.PI*2); mc.fill();
    mc.fillStyle = '#fff'; mc.beginPath(); mc.arc(325,710+wobble,21,0,Math.PI*2); mc.arc(395,710+wobble,21,0,Math.PI*2); mc.fill();
    mc.fillStyle = '#253042'; mc.beginPath(); mc.arc(330,710+wobble,8,0,Math.PI*2); mc.arc(390,710+wobble,8,0,Math.PI*2); mc.fill();
    mc.strokeStyle = 'rgba(91,58,34,.22)'; mc.lineWidth = 2;
    for(let j=0;j<8;j++){ mc.beginPath(); mc.arc(360,730+wobble,100+j*5,j*.5,j*.5+1.1); mc.stroke(); }
    mc.restore();
  } else if (d.style === 'tech-launch') {
    mc.save();
    mc.strokeStyle = d.palette.accent || '#40aaff'; mc.lineWidth = 2;
    for(let j=0;j<6;j++){ mc.strokeRect(65+j*12, 250+j*12, 590-j*24, 550-j*24); }
    mc.fillStyle = 'rgba(5,12,30,.78)'; mc.fillRect(70, 940, 580, 190);
    mc.fillStyle = '#fff'; mc.font = 'bold 24px system-ui'; mc.textAlign='center'; mc.fillText('INTRODUCING THE NEXT STEP',360,990,540);
    mc.fillStyle = d.palette.accent || '#40aaff'; mc.fillRect(210,1030,300,5);
    mc.restore();
  } else if (d.style === 'high-energy-commercial') {
    mc.save();
    mc.globalAlpha = .45; mc.fillStyle = d.palette.accent || '#ff4d4d';
    for(let j=0;j<12;j++){ const x=((j*93-t*180)%900+900)%900-90; mc.beginPath(); mc.moveTo(x,0); mc.lineTo(x+45,0); mc.lineTo(x-130,1280); mc.lineTo(x-175,1280); mc.fill(); }
    mc.globalAlpha=1; mc.strokeStyle='#fff'; mc.lineWidth=8; mc.strokeRect(20,20,680,1240);
    mc.restore();
  } else if (d.style === 'flat-vector-motion') {
    mc.save();
    const shift = (t*55)%100;
    for(let j=0;j<7;j++){ mc.fillStyle=[d.palette.accent||'#35c6a5','#fff','#ffd166','#4285f4'][j%4]; mc.beginPath(); mc.arc((j*123+shift)%760,300+(j%3)*120,26+(j%3)*10,0,Math.PI*2); mc.fill(); }
    mc.fillStyle='rgba(255,255,255,.12)'; mc.fillRect(40,1010,640,120);
    mc.restore();
  } else if (d.style === 'music-visualizer') {
    mc.save();
    const base = 1120;
    for(let j=0;j<36;j++){ const h=35+Math.abs(Math.sin(t*4+j*.72))*150+(j%4)*12; mc.fillStyle=j%3===0?'#fff':(d.palette.accent||'#43e4d1'); mc.globalAlpha=.55+(j%4)*.1; mc.fillRect(40+j*18,base-h,11,h); }
    mc.globalAlpha=.9; mc.strokeStyle=d.palette.accent||'#43e4d1'; mc.lineWidth=3; mc.beginPath();
    for(let x=0;x<=720;x+=8){ const y=760+Math.sin(x*.035+t*4)*22+Math.sin(x*.012-t*2)*16; if(x===0)mc.moveTo(x,y);else mc.lineTo(x,y); } mc.stroke();
    mc.restore();
  } else if (d.style === 'documentary') {
    mc.save();
    mc.fillStyle='rgba(0,0,0,.32)'; mc.fillRect(0,0,720,1280);
    mc.fillStyle='#fff'; mc.fillRect(42,1000,636,2);
    mc.font='bold 18px system-ui'; mc.textAlign='left'; mc.fillStyle='#fff'; mc.fillText('FIELD NOTES  /  '+String(i+1).padStart(2,'0'),48,965);
    mc.font='bold 38px Georgia, serif'; mc.fillText((curScene.t||'THE STORY').toUpperCase(),48,1050,610);
    mc.font='20px system-ui'; mc.fillStyle='#e4e8ec'; mc.fillText((curScene.s||'A closer look at the story.').slice(0,76),48,1100,610);
    mc.restore();
  } else if (d.style === 'motivational') {
    mc.save();
    mc.fillStyle='rgba(8,15,32,.36)'; mc.fillRect(0,0,720,1280);
    const pulse=1+Math.sin(t*1.8)*.025; mc.translate(360,700); mc.scale(pulse,pulse);
    mc.fillStyle='rgba(255,255,255,.12)'; mc.beginPath(); mc.arc(0,0,210,0,Math.PI*2); mc.fill();
    mc.strokeStyle=d.palette.accent||'#ffd166'; mc.lineWidth=5; mc.beginPath(); mc.arc(0,0,230,0,Math.PI*2); mc.stroke();
    mc.fillStyle='#fff'; mc.font='900 42px system-ui'; mc.textAlign='center'; mc.textBaseline='middle'; mc.fillText((curScene.t||'KEEP MOVING').toUpperCase(),0,0,540);
    mc.restore();
  } else if (d.style === 'before-after') {
    mc.save();
    mc.fillStyle='rgba(18,24,39,.76)'; mc.fillRect(0,160,360,960);
    mc.fillStyle='rgba(255,255,255,.12)'; mc.fillRect(360,160,360,960);
    mc.strokeStyle='#fff'; mc.lineWidth=4; mc.beginPath(); mc.moveTo(360,160); mc.lineTo(360,1120); mc.stroke();
    mc.fillStyle='#fff'; mc.font='bold 28px system-ui'; mc.textAlign='center'; mc.fillText('BEFORE',180,210); mc.fillText('AFTER',540,210);
    mc.fillStyle=d.palette.accent||'#25d366'; mc.beginPath(); mc.arc(540,400+Math.sin(t*2)*10,62,0,Math.PI*2); mc.fill();
    mc.fillStyle='#fff'; mc.font='bold 52px system-ui'; mc.fillText('→',360,700);
    mc.restore();
  } else if (d.style === 'isometric-world') {
    mc.save();
    mc.strokeStyle='rgba(255,255,255,.22)'; mc.lineWidth=2;
    for(let x=-720;x<1440;x+=60){ mc.beginPath(); mc.moveTo(360+(x-360)*.5,400+(x-360)*.25); mc.lineTo(360+(x-360)*.5,400+(x-360)*.25+500); mc.stroke(); }
    for(let y=0;y<12;y++){ mc.beginPath(); mc.moveTo(0,500+y*38); mc.lineTo(720,500+y*38); mc.stroke(); }
    mc.fillStyle=d.palette.accent||'#4ed3a5';
    mc.beginPath(); mc.moveTo(360,480); mc.lineTo(500,560); mc.lineTo(360,640); mc.lineTo(220,560); mc.closePath(); mc.fill();
    mc.fillStyle='rgba(255,255,255,.24)'; mc.beginPath(); mc.moveTo(220,560); mc.lineTo(360,640); mc.lineTo(360,770); mc.lineTo(220,690); mc.closePath(); mc.fill();
    mc.fillStyle='rgba(0,0,0,.2)'; mc.beginPath(); mc.moveTo(360,640); mc.lineTo(500,560); mc.lineTo(500,690); mc.lineTo(360,770); mc.closePath(); mc.fill();
    mc.restore();
  } else if (d.style === 'pixel-art') {
    mc.save();
    const size=24; mc.globalAlpha=.28;
    for(let y=0;y<1280;y+=size){ for(let x=0;x<720;x+=size){ if(((x/size*7+y/size*13)%11)<2){ mc.fillStyle=(Math.floor(x/size+y/size)%2)?'#fff':(d.palette.accent||'#ffcf33'); mc.fillRect(x,y,size-3,size-3); } } }
    mc.globalAlpha=1; mc.fillStyle='#fff'; mc.font='bold 30px monospace'; mc.textAlign='center'; mc.fillText('■  ■  ■',360,1120);
    mc.restore();
  } else if (d.style === 'blueprint-technical') {
    mc.save();
    mc.fillStyle='#0b2d5c'; mc.fillRect(0,0,720,1280);
    mc.strokeStyle='rgba(130,205,255,.3)'; mc.lineWidth=1;
    for(let x=0;x<720;x+=32){ mc.beginPath(); mc.moveTo(x,0); mc.lineTo(x,1280); mc.stroke(); }
    for(let y=0;y<1280;y+=32){ mc.beginPath(); mc.moveTo(0,y); mc.lineTo(720,y); mc.stroke(); }
    mc.strokeStyle='#9edcff'; mc.lineWidth=4; mc.strokeRect(95,330,530,450);
    mc.beginPath(); mc.moveTo(95,555); mc.lineTo(625,555); mc.moveTo(360,330); mc.lineTo(360,780); mc.stroke();
    mc.setLineDash([8,8]); mc.strokeRect(130,365,460,380); mc.setLineDash([]);
    mc.fillStyle='#d9f3ff'; mc.font='bold 20px monospace'; mc.textAlign='left'; mc.fillText('FIG. '+(i+1)+' / CONCEPT',100,820);
    mc.restore();
  } else if (d.style === 'memphis-pop') {
    mc.save();
    const shapes=[['#ff6b6b',95,280],['#ffd93d',610,420],['#6bcBef',120,880],['#c77dff',590,990]];
    shapes.forEach(([color,x,y],j)=>{ mc.fillStyle=String(color); mc.beginPath(); mc.arc(Number(x),Number(y)+Math.sin(t*2+j)*10,42+j%2*15,0,Math.PI*2); mc.fill(); });
    mc.strokeStyle='#fff'; mc.lineWidth=7;
    for(let j=0;j<5;j++){ mc.beginPath(); mc.moveTo(510+j*18,220); mc.lineTo(550+j*18,270); mc.lineTo(510+j*18,320); mc.stroke(); }
    mc.fillStyle='#fff'; mc.fillRect(45,1040,630,5);
    mc.restore();

  }

  const drawCtx: DrawContext = { c: mc, LIGHT, BQ: null, d, G, DG };
  for (let k = 1; k < pl.st.length; k++) {
    const q = t - pl.st[k];
    if (q >= -0.25 && q < 0) {
      const p = eio((q + 0.25) / 0.25);
      const xl = 720 * (1 - p);
      R(drawCtx, xl - 40, 0, 800, 1280, DG);
      R(drawCtx, xl, 0, 800, 1280, G);
    } else if (q >= 0 && q < 0.25) {
      const p = eio(q / 0.25);
      const xr = 720 * (1 - p);
      R(drawCtx, 0, 0, xr + 40, 1280, DG);
      R(drawCtx, 0, 0, xr, 1280, G);
    }
  }
}

/* ---- Parsing & Offline Rules ---- */
const cl = (s: string) => s.replace(/^[^\p{L}\p{N}₦$€£]+/u, '').trim();

export function parse(t: string): ParsedScript {
  const L = t.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const o: ParsedScript = {
    brand: '',
    headline: '',
    question: '',
    problem: '',
    intro: '',
    extra: '',
    price: '',
    offer: '',
    cta: '',
    tagline: '',
    features: [],
  };
  const rest: string[] = [];

  L.forEach((l, i) => {
    const q = cl(l);
    if (/^[✅✔☑•*-]/u.test(l)) o.features.push(q);
    else if (!i) o.headline = q;
    else if (/🔥|[₦$€£]\s?\d/u.test(l)) {
      o.offer = q;
      const m = q.match(/[₦$€£]\s?\d[\d,.]*\d|[₦$€£]\s?\d/u);
      o.price = m ? m[0] : '';
    } else if (/📩|📲|📞|send us|message us|contact us|dm us|call us|whatsapp us/i.test(l)) {
      o.cta = q;
    } else rest.push(q);
  });

  const bi = rest.findIndex((r) => /^.{2,45}?\s[—–-]\s.{3,60}$/.test(r));
  if (bi >= 0) {
    const m = rest.splice(bi, 1)[0].match(/^(.+?)\s[—–-]\s(.+)$/);
    if (m) {
      o.brand = m[1];
      o.tagline = m[2];
    }
  }

  const tk = (f: (r: string) => boolean) => {
    const i = rest.findIndex(f);
    return i >= 0 ? rest.splice(i, 1)[0] : '';
  };

  o.question = tk((r) => /\?$/.test(r));
  o.problem = tk((r) => /^(stop|don.t|tired|struggl|no more)/i.test(r));
  o.intro = tk((r) => / helps | by /i.test(r));
  o.extra = rest.join(' ');

  const sp = o.problem.match(/^(.+?[.!?])\s+(.+)$/);
  if (sp) {
    o.problem = sp[1];
    o.extra = (sp[2] + ' ' + o.extra).trim();
  }

  if (!o.brand) {
    const m =
      (o.intro + ' ' + o.headline).match(/([A-Z][\w&]*(?: [A-Z][\w&]*)*)(?= by | helps)/) ||
      o.headline.match(/with (.+?)!?$/i);
    o.brand = m ? m[1] : 'Your Brand';
  }
  return o;
}

export const TY: Record<string, string[]> = {
  food: ['restaurant', 'food', 'menu', 'burger', 'pizza', 'chop', 'cook', 'meal', 'delivery', 'cafe', 'bakery', 'eat', 'kitchen', 'jollof'],
  fashion: ['fashion', 'cloth', 'dress', 'wear', 'outfit', 'shoe', 'boutique', 'ankara', 'style'],
  tech: ['app ', 'software', 'tech', 'website', 'saas', 'code', 'startup'],
  auto: ['car ', 'cars', 'auto', 'vehicle', 'drive', 'ride', 'mechanic', 'dealer', 'logistics'],
  property: ['house', 'property', 'real estate', 'apartment', 'rent', 'land', 'estate'],
  beauty: ['beauty', 'salon', 'makeup', 'hair', 'skin', 'spa', 'nails', 'cosmetic'],
  edu: ['school', 'course', 'class', 'learn', 'training', 'tutor', 'academy', 'student', 'exam'],
  retail: ['shop', 'store', 'market', 'sell', 'product', 'whatsapp', 'customers'],
  growth: [],
  office: ['office', 'consult', 'agency', 'account', 'finance', 'loan', 'insur', 'law firm'],
  gym: ['gym', 'fitness', 'workout', 'sport', 'muscle', 'yoga'],
  farm: ['farm', 'agric', 'crop', 'harvest', 'poultry', 'fish', 'livestock', 'produce'],
  health: ['health', 'clinic', 'hospital', 'pharmacy', 'doctor', 'medical', 'dental'],
};

export const PAL: Record<string, [string, string, string]> = {
  food: ['#ff8a1f', '#2a0f05', '#7a2e0b'],
  fashion: ['#ff5fa2', '#240a24', '#6a1b5a'],
  tech: ['#40aaff', '#0a192f', '#0b4a7a'],
  auto: ['#ffc428', '#10131a', '#303846'],
  property: ['#3ddc97', '#0c2a2a', '#1f6b5c'],
  beauty: ['#ff7eb6', '#2a0c24', '#7a2a66'],
  edu: ['#ffd24d', '#101a3a', '#2a3f9a'],
  retail: ['#25d366', '#0a192f', '#07524a'],
  growth: ['#25d366', '#0a192f', '#07524a'],
  office: ['#4285f4', '#0a1930', '#1d3f7a'],
  gym: ['#ff4d4d', '#150a0a', '#4a1212'],
  farm: ['#7bd34a', '#0e2a10', '#2f6a1f'],
  health: ['#26c6da', '#082a30', '#0f6b75'],
};

export function kind(t: string): AdType {
  const low = t.toLowerCase();
  let b: AdType = 'growth';
  let bn = 0;
  for (const k in TY) {
    const n = TY[k].filter((w) => low.includes(w)).length;
    if (n > bn) {
      bn = n;
      b = k as AdType;
    }
  }
  return b;
}

export function offline(tx: string): StoryboardData {
  const o = parse(tx);
  const sc: Scene[] = [{ k: 'hook', t: o.headline, s: o.question }];
  if (o.problem || o.intro) sc.push({ k: 'story', t: o.problem || o.intro, s: o.problem ? o.intro : '' });
  if (o.intro || o.extra)
    sc.push({ k: 'presenter', t: 'LET ME SHOW YOU', s: o.intro || o.extra, items: ['Discover the solution', 'See how it helps'] });
  if (o.features.length) sc.push({ k: 'list', t: 'WHAT YOU GET', items: o.features });
  if (o.features.length >= 3)
    sc.push({
      k: 'steps',
      t: 'SIMPLE STEPS TO GET STARTED',
      items: ['Choose what you need', 'Let us help you get started', 'Enjoy the results'],
    });
  if (o.offer || o.price)
    sc.push({
      k: 'offer',
      t: (o.offer || '').replace(o.price || '§', '').replace(/[!.\s]+$/, ''),
      p: o.price || 'SPECIAL OFFER',
      s: o.extra,
    });
  sc.push({ k: 'cta', t: o.cta || 'Contact us today' });
  const type = kind(tx);
  const pal = PAL[type] || PAL.growth;
  return {
    type,
    style: 'flat',
    brand: o.brand,
    tagline: o.tagline,
    palette: { accent: pal[0], top: pal[1], bottom: pal[2] },
    scenes: sc,
  };
}

const HX = /^#[0-9a-f]{6}$/i;

export function norm(sb: any): StoryboardData {
  const ty: AdType = HERO[sb.type] ? sb.type : 'growth';
  const pl = PAL[ty] || PAL.growth;
  const pa = sb.palette || {};
  let sc: Scene[] = (sb.scenes || [])
    .filter((s: any) => s && SCN[s.k])
    .slice(0, 12)
    .map((s: any) => ({
      k: s.k,
      t: String(s.t || ''),
      s: String(s.s || ''),
      p: s.p ? String(s.p) : '',
      items: Array.isArray(s.items) ? s.items.slice(0, 8).map(String) : [],
    }))
    .filter((s: Scene) => s.k !== 'list' || (s.items && s.items.length));

  if (!sc.length) sc = [{ k: 'hook', t: 'Your Ad', s: '', p: '', items: [] }];
  if (sc[sc.length - 1].k !== 'cta') sc.push({ k: 'cta', t: 'Contact us today', s: '', p: '', items: [] });

  return {
    type: ty,
    style: ['flat', 'board', 'human', 'cinematic', 'neon', 'comic', 'minimal', 'retro', 'paper', 'gradient', 'african-business', 'kinetic-type', 'luxury-commercial', 'glassmorphism', 'doodle-animation', 'modern-2d', 'corporate-presentation', 'chat-story', 'cartoon-3d', 'anime-inspired', 'watercolor-storybook', 'claymation', 'tech-launch', 'high-energy-commercial', 'flat-vector-motion', 'music-visualizer', 'documentary', 'motivational', 'before-after', 'isometric-world', 'pixel-art', 'blueprint-technical', 'memphis-pop'].includes(sb.style) ? sb.style : '',
    brand: String(sb.brand || 'Your Brand'),
    tagline: String(sb.tagline || ''),
    palette: {
      accent: HX.test(pa.accent) ? pa.accent : pl[0],
      top: HX.test(pa.top) ? pa.top : pl[1],
      bottom: HX.test(pa.bottom) ? pa.bottom : pl[2],
    },
    scenes: sc,
  };
}

export const TEMPLATES: Record<string, { type: AdType; style: string; pal: [string, string, string] }> = {
  bold: { type: 'growth', style: 'flat', pal: ['#31e981', '#071c2b', '#063e4b'] },
  luxury: { type: 'fashion', style: 'human', pal: ['#e8c56a', '#17151b', '#4b3445'] },
  sale: { type: 'retail', style: 'flat', pal: ['#ffcf33', '#321016', '#a51f32'] },
  neon: { type: 'tech', style: 'flat', pal: ['#42f5f5', '#100b2d', '#3d1b80'] },
  food: { type: 'food', style: 'flat', pal: ['#ff9b38', '#321309', '#a63d13'] },
  beauty: { type: 'beauty', style: 'human', pal: ['#ff8fc7', '#271027', '#793d78'] },
  gospel: { type: 'office', style: 'flat', pal: ['#ffd66b', '#17113b', '#522b86'] },
  corporate: { type: 'office', style: 'human', pal: ['#6bb7ff', '#091a36', '#174d80'] },
  property: { type: 'property', style: 'human', pal: ['#56e0b5', '#082d2d', '#17665a'] },
  whiteboard: { type: 'edu', style: 'board', pal: ['#ffd24d', '#101a3a', '#2a3f9a'] },
  human: { type: 'office', style: 'human', pal: ['#63b8ff', '#091a36', '#17528a'] },
  businessPromo: { type: 'growth', style: 'human', pal: ['#E67E22', '#1b1720', '#59301d'] },
  productAd: { type: 'retail', style: 'flat', pal: ['#ffd166', '#171923', '#533d18'] },
  eventPromo: { type: 'office', style: 'human', pal: ['#ff6b8a', '#211033', '#54245e'] },
  socialReel: { type: 'growth', style: 'flat', pal: ['#45e0b5', '#10152c', '#373078'] },
  explainer: { type: 'edu', style: 'board', pal: ['#3c78d8', '#fffdf7', '#eaf2ff'] },
  shortStory: { type: 'office', style: 'human', pal: ['#e8c56a', '#101521', '#3d3449'] },
};

export const WHITEBOARD_PALETTES: Record<string, { accent: string; top: string; bottom: string }> = {
  problem: { accent: '#f4c542', top: '#fffdf5', bottom: '#f5f0df' },
  howto: { accent: '#3c78d8', top: '#ffffff', bottom: '#eef4ff' },
  product: { accent: '#16a085', top: '#fffef9', bottom: '#eaf7f1' },
  customer: { accent: '#e67e22', top: '#fffdf9', bottom: '#fff0df' },
  journey: { accent: '#8e63ce', top: '#ffffff', bottom: '#f4efff' },
  lesson: { accent: '#2374ab', top: '#fffefb', bottom: '#eaf5fc' },
  business: { accent: '#1b9a70', top: '#fffefb', bottom: '#edf8f1' },
  community: { accent: '#d35d78', top: '#fffdfc', bottom: '#fff0f3' },
};

export function music(ctx: AudioContext, dest: MediaStreamAudioDestinationNode, d: StoryboardData, tot: number) {
  const m = ctx.createGain();
  m.gain.value = 0.5;
  m.connect(dest);
  const t0 = ctx.currentTime + 0.15;
  const mf = (n: number) => 440 * 2 ** ((n - 69) / 12);

  const nt = (f: number, s: number, du: number, a: number, ty: OscillatorType = 'sine') => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = ty;
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t0 + s);
    g.gain.linearRampToValueAtTime(a, t0 + s + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + s + du);
    o.connect(g);
    g.connect(m);
    o.start(t0 + s);
    o.stop(t0 + s + du + 0.05);
  };

  const bt = 60 / 112;
  const ch = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
  const rt = [36, 33, 29, 31];

  for (let b = 0; b * 4 * bt < tot; b++) {
    const s = b * 4 * bt;
    const h = ch[b % 4];
    for (let j = 0; j < 8; j++) {
      nt(mf(h[[0, 1, 2, 1, 0, 1, 2, 1][j]] + (j === 2 || j === 6 ? 12 : 0)), s + (j * bt) / 2, 0.5, 0.1);
    }
    nt(mf(rt[b % 4]), s, bt * 1.8, 0.24);
    nt(mf(rt[b % 4]), s + 2 * bt, bt * 1.8, 0.18);
  }

  const nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const nd = nb.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  const pl = plan(d);
  const wh = (s: number) => {
    const b = ctx.createBufferSource();
    b.buffer = nb;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0 + s - 0.25);
    g.gain.linearRampToValueAtTime(0.35, t0 + s);
    g.gain.linearRampToValueAtTime(0, t0 + s + 0.25);
    b.connect(f);
    f.connect(g);
    g.connect(m);
    b.start(t0 + s - 0.25, 0, 0.5);
  };

  pl.st.slice(1).forEach(wh);
  d.scenes.forEach((S, i) => {
    if (S.k === 'list' && S.items) {
      S.items.forEach((_, j) => nt(900, pl.st[i] + 0.9 + j * 2 + 0.15, 0.15, 0.25, 'triangle'));
    }
    if (S.k === 'offer') {
      [84, 88, 91, 96].forEach((n, k) => nt(mf(n), pl.st[i] + 0.4 + k * 0.09, 0.7, 0.2));
    }
  });

  const e = t0 + tot;
  m.gain.setValueAtTime(0.5, e - 1.5);
  m.gain.linearRampToValueAtTime(0, e - 0.05);
}

/* ---- Cinematic Human Studio Engine ---- */
export interface CinematicSceneParams {
  scene: string;
  people: string;
  location: string;
  effect: string;
  headline: string;
}

export function renderCinematicScene(
  ctx: CanvasRenderingContext2D,
  params: CinematicSceneParams,
  now: number,
  start: number
) {
  const t = (now - start) / 1000;
  const { scene: sc, people: pp, location: loc, effect: ef, headline } = params;

  const skin = ['#8d5524', '#bd8057', '#e0ad86'];
  const shirt = ['#167c80', '#d46b4f', '#8d4ae8'];

  const box = (x: number, y: number, w: number, h: number, col: string, r = 12, a = 1) => {
    ctx.globalAlpha = a;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  const circle = (x: number, y: number, r: number, col: string, a = 1) => {
    ctx.globalAlpha = a;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  const line = (points: number[][], col: string, w = 5, a = 1) => {
    ctx.globalAlpha = a;
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const text = (s: string, x: number, y: number, size: number, col = '#fff', align: CanvasTextAlign = 'center') => {
    ctx.fillStyle = col;
    ctx.font = 'bold ' + size + 'px system-ui';
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(s, x, y, 600);
  };
  const person = (x: number, y: number, s: number, index: number, tt: number, gesture: number) => {
    const bob = Math.sin(tt * 3 + index) * 5 * s;
    const sk = skin[(index + (pp === 'female' ? 1 : 0)) % 3];
    const clr = shirt[(index + (pp === 'creative' ? 2 : 0)) % 3];
    circle(x, y - 106 * s + bob, 21 * s, sk);
    circle(x, y - 119 * s + bob, 21 * s, '#21140f');
    box(x - 23 * s, y - 88 * s + bob, 46 * s, 56 * s, clr, 12 * s);
    line([[x - 18 * s, y - 78 * s + bob], [x - 37 * s, y - 39 * s + bob]], clr, 9 * s);
    line([[x + 18 * s, y - 78 * s + bob], [x + gesture * s, y - 119 * s + bob]], clr, 9 * s);
    circle(x + gesture * s, y - 119 * s + bob, 6 * s, sk);
    line([[x - 10 * s, y - 31 * s + bob], [x - 15 * s, y + 4 * s + bob]], '#1c2740', 10 * s);
    line([[x + 10 * s, y - 31 * s + bob], [x + 15 * s, y + 4 * s + bob]], '#1c2740', 10 * s);
    circle(x - 7 * s, y - 108 * s + bob, 2 * s, '#20130e');
    circle(x + 7 * s, y - 108 * s + bob, 2 * s, '#20130e');
    line([[x - 6 * s, y - 97 * s + bob], [x + 6 * s, y - 97 * s + bob]], '#5c2e24', 2 * s);
  };

  const top =
    ef === 'neon'
      ? '#11102d'
      : ef === 'warm'
      ? '#8d5c48'
      : ef === 'clean'
      ? '#d8e7f0'
      : ef === 'dramatic'
      ? '#070b17'
      : '#142342';
  const bottom =
    ef === 'neon'
      ? '#39216c'
      : ef === 'warm'
      ? '#f0c99c'
      : ef === 'clean'
      ? '#6b8fa7'
      : ef === 'dramatic'
      ? '#27344e'
      : '#355b7d';
  const g = ctx.createLinearGradient(0, 0, 0, 1280);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 720, 1280);

  if (loc === 'office') {
    for (let i = 0; i < 4; i++) {
      box(45 + i * 165, 230, 125, 410, '#9ad4e9', 8, 0.25);
      line([[110 + i * 165, 230], [110 + i * 165, 640]], '#e8f5fb', 4, 0.4);
    }
    box(0, 790, 720, 490, '#101d33', 0, 0.45);
  }
  if (loc === 'shop') {
    box(50, 250, 620, 460, '#f2d7ad', 10);
    box(50, 250, 620, 75, '#b96544', 10);
    text('YOUR BUSINESS', 360, 286, 30);
    for (let i = 0; i < 4; i++)
      box(80 + i * 145, 380, 105, 190, ['#d6e7ed', '#e4c4ad', '#d9d1f4', '#c3dfc9'][i], 8);
    box(50, 720, 620, 30, '#6c4939');
  }
  if (loc === 'home') {
    box(65, 260, 590, 460, '#f2d4b3', 18);
    box(100, 310, 170, 230, '#83bddd', 8);
    box(350, 570, 240, 120, '#8d5e4b', 16);
    box(370, 530, 200, 65, '#e9c8a1', 16);
  }
  if (loc === 'city') {
    for (let i = 0; i < 6; i++) {
      box(i * 125, 490 - (i % 3) * 80, 110, 420 + (i % 3) * 80, '#293f5d', 5, 0.9);
      for (let j = 0; j < 3; j++) box(i * 125 + 20 + (j % 2) * 40, 540 + j * 65 - (i % 3) * 80, 18, 26, '#ffd88d', 2, 0.65);
    }
    box(0, 850, 720, 430, '#172136');
  }
  if (loc === 'stage') {
    circle(360, 430, 240, '#ffe4a0', 0.07);
    box(70, 760, 580, 25, '#e9c879', 8, 0.8);
    box(0, 800, 720, 480, '#080d1a', 0, 0.45);
  }
  if (loc === 'studio') {
    circle(100, 250, 110, '#fff', 0.06);
    circle(630, 300, 140, '#fff', 0.05);
    box(55, 760, 610, 310, '#fff', 18, 0.05);
  }

  if (sc === 'presenter' || sc === 'hero' || sc === 'interview') {
    if (sc === 'interview') {
      box(45, 860, 630, 170, '#091425', 15, 0.8);
      box(70, 890, 160, 110, '#e5b56e', 8, 0.8);
    }
    person(360, 1050, sc === 'hero' ? 2 : 1.8, 0, t, sc === 'interview' ? 28 : 45);
    if (sc === 'presenter') {
      box(475, 680, 180, 185, '#fff', 12, 0.13);
      text('THE SOLUTION', 565, 720, 22);
    }
    if (sc === 'hero') {
      circle(360, 790, 190, '#fff', 0.08);
      text('INTRODUCING', 360, 570, 30);
    }
  } else if (sc === 'conversation') {
    person(215, 1040, 1.45, 0, t, 35);
    person(505, 1040, 1.45, 1, t, -35);
    box(55, 610, 285, 125, '#fff', 20, 0.95);
    text('How can this help?', 195, 665, 24, '#17243b');
    box(385, 545, 280, 125, '#ffd98c', 20, 0.96);
    text('Let me show you.', 525, 600, 24, '#17243b');
  } else if (sc === 'demo') {
    person(200, 1050, 1.45, 0, t, 30);
    box(365, 660, 270, 350, '#eef5f9', 20);
    box(390, 695, 220, 62, '#315b7c', 12);
    text('PRODUCT DEMO', 500, 726, 20);
    circle(500, 835, 55, '#8bd8eb');
    circle(500, 835, 25, '#315b7c');
    line([[310, 815], [365, 815]], '#ffd98c', 7);
    text('SEE HOW IT WORKS', 500, 940, 18, '#17243b');
  } else if (sc === 'team') {
    person(170, 1050, 1.2, 0, t, 25);
    person(360, 1050, 1.2, 1, t, -25);
    person(550, 1050, 1.2, 2, t, 30);
    box(150, 630, 420, 105, '#fff', 16, 0.15);
    text('ONE TEAM. ONE CLEAR GOAL.', 360, 680, 26);
  } else if (sc === 'success') {
    person(235, 1040, 1.45, 0, t, 35);
    person(485, 1040, 1.45, 1, t, -35);
    circle(360, 710, 100, '#ffd98c', 0.95);
    text('✓', 360, 710, 100, '#17304c');
    box(110, 555, 500, 75, '#fff', 14, 0.95);
    text('PROBLEM SOLVED', 360, 593, 30, '#17304c');
  } else if (sc === 'street') {
    box(100, 480, 520, 390, '#f2d7ad', 12);
    box(100, 480, 520, 80, '#b96544', 10);
    text('WELCOME!', 360, 520, 30);
    person(200, 1080, 1.1, 0, t, 25);
    person(510, 1080, 1.1, 1, t, -25);
  }

  if (ef === 'particles' || ef === 'cinema' || ef === 'neon') {
    for (let i = 0; i < 26; i++) {
      circle(
        ((i * 127 + Math.sin(t + i) * 25) % 720),
        ((i * 181 - t * 18 + 1280) % 1100),
        2 + (i % 3),
        ef === 'neon' ? '#58edff' : '#ffe0a0',
        0.65
      );
    }
  }

  if (ef === 'dramatic' || ef === 'cinema') {
    ctx.fillStyle = 'rgba(255,207,115,.09)';
    ctx.beginPath();
    ctx.moveTo(360, 0);
    ctx.lineTo(90, 1050);
    ctx.lineTo(650, 1050);
    ctx.fill();
  }

  box(25, 55, 670, 135, '#050a15', 18, 0.65);
  text((headline || 'YOUR STORY. YOUR BUSINESS.').toUpperCase(), 360, 120, 32);
  box(30, 1150, 660, 72, '#050a15', 15, 0.6);
  text('ADREEL STUDIO  •  CINEMATIC HUMAN SCENE', 360, 1187, 20, '#fff');
}
