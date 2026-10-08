// Core helpers shared by every scene: math, easing, text, paths, cameras, post FX.
(function (G) {
  'use strict';

  const W = 1920, H = 1080, TAU = Math.PI * 2;

  const COL = {
    bg: '#090807',
    orange: '#ff6a1f',
    orangeRGB: '255,106,31',
    hot: '#ffb27a',
    white: '#f3eee6',
    whiteRGB: '243,238,230',
    dim: 'rgba(243,238,230,0.42)',
    faint: 'rgba(243,238,230,0.16)',
    ghost: 'rgba(243,238,230,0.10)',
    grid: 'rgba(243,238,230,0.045)',
    gridStrong: 'rgba(243,238,230,0.09)',
  };

  const FONT = {
    sans: '"Inter", "Helvetica Neue", Arial, sans-serif',
    wide: '"Archivo", "Inter", Arial, sans-serif',
    mono: '"JetBrains Mono", Consolas, monospace',
    serif: '"Cormorant Garamond", Georgia, serif',
  };

  // ---------- math ----------
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const E = {
    linear: x => x,
    inQuad: x => x * x,
    outQuad: x => 1 - (1 - x) * (1 - x),
    inOutQuad: x => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
    inCubic: x => x * x * x,
    outCubic: x => 1 - Math.pow(1 - x, 3),
    inOutCubic: x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    outQuart: x => 1 - Math.pow(1 - x, 4),
    inOutQuart: x => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2),
    outExpo: x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    inExpo: x => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
    inOutExpo: x => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
    outBack: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
  };

  // Keyframes: [[time, value, ease?], ...]. Values can be numbers or arrays.
  function kf(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const k = keys[i];
      if (t <= k[0]) {
        const p = keys[i - 1];
        const e = (k[2] || E.inOutCubic)((t - p[0]) / (k[0] - p[0] || 1));
        if (Array.isArray(p[1])) return p[1].map((v, j) => lerp(v, k[1][j], e));
        return lerp(p[1], k[1], e);
      }
    }
    return keys[keys.length - 1][1];
  }

  function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function noise1(x) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return lerp(hash(i), hash(i + 1), u) * 2 - 1;
  }
  function noise2(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const h = (a, b) => hash(a * 57 + b * 131);
    return lerp(lerp(h(ix, iy), h(ix + 1, iy), ux), lerp(h(ix, iy + 1), h(ix + 1, iy + 1), ux), uy) * 2 - 1;
  }

  // ---------- canvas helpers ----------
  function font(ctx, weight, size, family, stretch) {
    ctx.font = `${weight} ${size}px ${family}`;
    if ('fontStretch' in ctx) ctx.fontStretch = stretch || 'normal';
  }

  function glow(ctx, color, blur, fn) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    fn();
    ctx.restore();
  }

  function halo(ctx, x, y, r, rgb, a) {
    if (a <= 0 || r <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.22, `rgba(${rgb},${a * 0.38})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // Glowing pen tip (the "spark" that draws everything).
  function pen(ctx, x, y, s = 1, a = 1) {
    if (a <= 0) return;
    halo(ctx, x, y, 70 * s, '255,100,25', 0.45 * a);
    halo(ctx, x, y, 18 * s, '255,215,170', 0.9 * a);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = '#fff8ef';
    ctx.beginPath(); ctx.arc(x, y, 3.2 * s, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // Grid over a rectangle, lines aligned to (ox, oy).
  function drawGrid(ctx, x0, y0, x1, y1, cell, ox, oy, color, lw = 1) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.beginPath();
    const sx = ox + Math.ceil((x0 - ox) / cell) * cell;
    for (let x = sx; x <= x1; x += cell) { ctx.moveTo(x, y0); ctx.lineTo(x, y1); }
    const sy = oy + Math.ceil((y0 - oy) / cell) * cell;
    for (let y = sy; y <= y1; y += cell) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); }
    ctx.stroke();
    ctx.restore();
  }

  // Mono typing with an orange block cursor. Returns number of chars shown.
  function typeText(ctx, str, x, y, t, t0, cps, opts = {}) {
    if (t < t0) return 0;
    const n = Math.floor(clamp((t - t0) * cps, 0, str.length));
    ctx.fillText(str.slice(0, n), x, y);
    const showCursor = opts.cursor && (n < str.length || (opts.hold && t < opts.hold) || (opts.blink && Math.floor(t * 3) % 2 === 0));
    if (showCursor) {
      const size = opts.size || 20;
      const w = ctx.measureText(str.slice(0, n)).width;
      ctx.save();
      ctx.fillStyle = COL.orange;
      const base = ctx.textBaseline;
      const top = base === 'top' ? y : base === 'middle' ? y - size * 0.5 : y - size * 0.8;
      ctx.fillRect(x + w + 3, top, size * 0.55, size * 0.95);
      ctx.restore();
    }
    return n;
  }

  // ---------- Path: polyline with arc-length queries ----------
  class Path {
    constructor(pts) {
      this.pts = pts;
      const L = new Float64Array(pts.length);
      for (let i = 1; i < pts.length; i++) {
        L[i] = L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      }
      this.L = L;
      this.total = pts.length ? L[pts.length - 1] : 0;
    }
    at(s) {
      const p = this.pts, L = this.L, n = p.length;
      if (n < 2) return [p[0][0], p[0][1], 0];
      if (s <= 0) return [p[0][0], p[0][1], Math.atan2(p[1][1] - p[0][1], p[1][0] - p[0][0])];
      if (s >= this.total) return [p[n - 1][0], p[n - 1][1], Math.atan2(p[n - 1][1] - p[n - 2][1], p[n - 1][0] - p[n - 2][0])];
      let lo = 0, hi = n - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] < s) lo = m; else hi = m; }
      const f = (s - L[lo]) / (L[hi] - L[lo] || 1);
      return [lerp(p[lo][0], p[hi][0], f), lerp(p[lo][1], p[hi][1], f), Math.atan2(p[hi][1] - p[lo][1], p[hi][0] - p[lo][0])];
    }
    // Adds the sub-path [s0, s1] to the current canvas path; returns the end point.
    trace(ctx, s0 = 0, s1 = this.total) {
      if (s1 <= s0 || this.pts.length < 2) return null;
      const a = this.at(s0);
      ctx.moveTo(a[0], a[1]);
      const L = this.L, p = this.pts;
      for (let i = 0; i < p.length; i++) if (L[i] > s0 && L[i] < s1) ctx.lineTo(p[i][0], p[i][1]);
      const b = this.at(s1);
      ctx.lineTo(b[0], b[1]);
      return b;
    }
    map(fn) { return new Path(this.pts.map(fn)); }
    static ellipse(cx, cy, rx, ry, rot = 0, a0 = 0, a1 = TAU, n = 120) {
      const pts = [], c = Math.cos(rot), s = Math.sin(rot);
      for (let i = 0; i <= n; i++) {
        const a = lerp(a0, a1, i / n), x = Math.cos(a) * rx, y = Math.sin(a) * ry;
        pts.push([cx + x * c - y * s, cy + x * s + y * c]);
      }
      return new Path(pts);
    }
    static bezier(p0, p1, p2, p3, n = 48) {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n, u = 1 - t;
        pts.push([
          u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
          u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
        ]);
      }
      return new Path(pts);
    }
  }

  // ---------- Lyric: word-timed karaoke text ----------
  // words: [[text, startTime, lineIndex], ...]
  // Latest started word = orange, earlier words = white, not-yet words = ghost.
  class Lyric {
    constructor(words, opts = {}) {
      this.words = words.map(([text, time, line = 0]) => ({ text, time, line }));
      this.opts = opts;
      const cps = opts.cps || 22;
      this.words.forEach((w, i) => {
        const next = this.words[i + 1];
        const natural = w.text.length / cps + 0.03;
        w.dur = next ? Math.max(0.03, Math.min(natural, next.time - w.time)) : natural;
      });
      const nLines = Math.max(...this.words.map(w => w.line)) + 1;
      this.lines = [];
      for (let l = 0; l < nLines; l++) {
        const ws = this.words.filter(w => w.line === l);
        let str = '';
        ws.forEach((w, j) => { if (j) str += ' '; w.charStart = str.length; str += w.text; });
        this.lines.push({ str, words: ws });
      }
      this.start = this.words[0].time;
    }
    active(t) {
      let k = -1;
      for (let i = 0; i < this.words.length; i++) if (t >= this.words[i].time) k = i;
      return k;
    }
    // st: {size, weight, family, stretch, lh, ghost:'fill'|'stroke'|'none', ghostFrom, current, done, glow, alpha, align}
    draw(ctx, t, x, y, st = {}) {
      const ghostFrom = st.ghostFrom !== undefined ? st.ghostFrom : this.start - 0.12;
      if (t < ghostFrom) return;
      ctx.save();
      font(ctx, st.weight || 700, st.size || 64, st.family || FONT.sans, st.stretch);
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      ctx.globalAlpha = st.alpha === undefined ? 1 : st.alpha;
      const act = this.active(t);
      const lh = st.lh || (st.size || 64) * 1.12;
      this.lines.forEach((line, li) => {
        if (st.only !== undefined && li !== st.only) return;
        const ly = y + (st.only !== undefined ? 0 : li * lh);
        const lineW = ctx.measureText(line.str).width;
        const lx = st.align === 'right' ? x - lineW : st.align === 'center' ? x - lineW / 2 : x;
        if (st.ghost !== 'none') {
          ctx.save();
          if (st.ghost === 'stroke') {
            ctx.strokeStyle = st.ghostColor || 'rgba(243,238,230,0.28)';
            ctx.lineWidth = st.ghostWidth || 1.2;
            ctx.strokeText(line.str, lx, ly);
          } else {
            ctx.fillStyle = st.ghostColor || COL.ghost;
            ctx.fillText(line.str, lx, ly);
          }
          ctx.restore();
        }
        for (const w of line.words) {
          if (t < w.time) continue;
          const idx = this.words.indexOf(w);
          const typed = clamp((t - w.time) / w.dur) * w.text.length;
          const full = Math.floor(typed);
          const wx = lx + ctx.measureText(line.str.slice(0, w.charStart)).width;
          let color = idx === act ? (st.current || COL.orange) : (st.done || COL.white);
          if (st.colorFn) color = st.colorFn(idx, t, color);
          ctx.save();
          ctx.fillStyle = color;
          if (st.glow) { ctx.shadowColor = color === COL.orange || idx === act ? 'rgba(255,106,31,0.85)' : 'rgba(255,240,225,0.35)'; ctx.shadowBlur = idx === act ? st.glow : st.glow * 0.5; }
          if (full > 0) ctx.fillText(w.text.slice(0, full), wx, ly);
          if (full < w.text.length) {
            const frac = typed - full;
            if (frac > 0) {
              ctx.globalAlpha *= frac;
              ctx.fillText(w.text[full], wx + ctx.measureText(w.text.slice(0, full)).width, ly);
            }
          }
          ctx.restore();
        }
      });
      ctx.restore();
    }
  }

  // ---------- 2D camera (page space -> screen) ----------
  // keys: [time, [cx, cy, zoom, rot], ease]; zoom interpolates in log space.
  function camKeys(list) { return list.map(([t, v, e]) => [t, [v[0], v[1], Math.log(v[2]), v[3] || 0], e]); }
  function cam2(t, keys) { const v = kf(t, keys); return { cx: v[0], cy: v[1], z: Math.exp(v[2]), rot: v[3] }; }
  function applyCam(ctx, c) {
    ctx.translate(W / 2, H / 2);
    ctx.rotate(c.rot);
    ctx.scale(c.z, c.z);
    ctx.translate(-c.cx, -c.cy);
  }
  function camPoint(c, x, y) {
    const dx = (x - c.cx) * c.z, dy = (y - c.cy) * c.z, cs = Math.cos(c.rot), sn = Math.sin(c.rot);
    return [W / 2 + dx * cs - dy * sn, H / 2 + dx * sn + dy * cs];
  }

  // ---------- 3D orbit camera ----------
  function orbit(target, dist, yaw, pitch, fovDeg = 50) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const fwd = [sy * cp, cy * cp, -sp], right = [cy, -sy, 0], up = [sy * sp, cy * sp, cp];
    const tz = target[2] || 0;
    const pos = [target[0] - fwd[0] * dist, target[1] - fwd[1] * dist, tz - fwd[2] * dist];
    const f = (H / 2) / Math.tan(fovDeg * Math.PI / 360);
    return {
      pos, fwd, right, up, f, dist, yaw, pitch,
      project(x, y, z) {
        const dx = x - pos[0], dy = y - pos[1], dz = z - pos[2];
        const Z = dx * fwd[0] + dy * fwd[1] + dz * fwd[2];
        if (Z < 0.05) return null;
        const X = dx * right[0] + dy * right[1];
        const Y = dx * up[0] + dy * up[1] + dz * up[2];
        return [W / 2 + f * X / Z, H / 2 - f * Y / Z, Z];
      },
      unproject(sx, sy, zp) {
        const X = (sx - W / 2) / f, Y = -(sy - H / 2) / f;
        const d = [fwd[0] + right[0] * X + up[0] * Y, fwd[1] + right[1] * X + up[1] * Y, fwd[2] + up[2] * Y];
        const k = (zp - pos[2]) / d[2];
        return [pos[0] + d[0] * k, pos[1] + d[1] * k, zp];
      },
    };
  }

  // Text lying on a 3D surface. Each glyph gets its own affine from the local projection.
  // anchor: [x,y] baseline-left in world; dir: unit [dx,dy] reading direction; hW: world size of 100px font.
  // zf(x,y): surface height; drawChar(ctx, ch, i, scalePx) does fill/stroke at (0,0).
  function groundText(ctx, cam, str, anchor, dir, hW, zf, drawChar, offsets) {
    const k = hW / 100, n = [-dir[1], dir[0]], eps = 0.05;
    const xs = offsets || [];
    if (!offsets) for (let i = 0; i <= str.length; i++) xs.push(ctx.measureText(str.slice(0, i)).width);
    let last = null;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === ' ') continue;
      const wx = anchor[0] + dir[0] * xs[i] * k, wy = anchor[1] + dir[1] * xs[i] * k;
      const p = cam.project(wx, wy, zf(wx, wy));
      const pa = cam.project(wx + dir[0] * eps, wy + dir[1] * eps, zf(wx + dir[0] * eps, wy + dir[1] * eps));
      const pb = cam.project(wx + n[0] * eps, wy + n[1] * eps, zf(wx + n[0] * eps, wy + n[1] * eps));
      if (!p || !pa || !pb) continue;
      const ax = (pa[0] - p[0]) / eps * k, ay = (pa[1] - p[1]) / eps * k;
      const bx = (pb[0] - p[0]) / eps * k, by = (pb[1] - p[1]) / eps * k;
      const sc = Math.hypot(ax, ay);
      const sb = Math.hypot(bx, by);
      if (sc < 0.002 || sc > 8 || sb < sc * 0.22 || sb > sc * 4) continue;
      ctx.setTransform(ax, ay, -bx, -by, p[0], p[1]);
      drawChar(ctx, ch, i, sc);
      last = p;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return last;
  }

  // Deterministic spark particles (scrub-safe: depends only on t).
  function sparks(ctx, x, y, t, o) {
    const { t0, t1, count = 120, angle = -0.7, spread = 0.9, speed = [160, 520], life = [0.18, 0.55], seed = 1, scale = 1 } = o;
    if (t < t0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const NB = 5, buckets = Array.from({ length: NB }, () => new Path2D());
    if (K.LOW) o = Object.assign({}, o, { count: Math.round(count / 2) });
    for (let i = 0; i < (o.count || count); i++) {
      const born = lerp(t0, t1, i / count) + hash(i * 3.1 + seed) * 0.02;
      const L = lerp(life[0], life[1], hash(i * 7.7 + seed));
      const age = t - born;
      if (age < 0 || age > L) continue;
      const a = angle + (hash(i * 1.3 + seed) - 0.5) * spread * 2;
      const v = lerp(speed[0], speed[1], hash(i * 5.9 + seed)) * scale;
      const px = x + Math.cos(a) * v * age, py = y + Math.sin(a) * v * age + 260 * scale * age * age;
      const k = 1 - age / L;
      const tail = 0.035;
      const qx = x + Math.cos(a) * v * Math.max(0, age - tail), qy = y + Math.sin(a) * v * Math.max(0, age - tail) + 260 * scale * Math.pow(Math.max(0, age - tail), 2);
      const b = Math.min(NB - 1, Math.floor(k * NB));
      buckets[b].moveTo(qx, qy); buckets[b].lineTo(px, py);
    }
    for (let b = 0; b < NB; b++) {
      const k = (b + 0.5) / NB;
      ctx.strokeStyle = `rgba(255,${Math.round(150 + 90 * k)},${Math.round(60 + 120 * k)},${k})`;
      ctx.lineWidth = (1 + 1.6 * k) * scale;
      ctx.stroke(buckets[b]);
    }
    ctx.restore();
  }

  // ---------- post FX ----------
  const PFX = {
    init() {
      const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.g = c.getContext('2d'); return c; };
      this.full = mk(W, H);
      this.b1 = mk(480, 270);
      this.b2 = mk(240, 135);
      this.vig = mk(W, H);
      const v = this.vig.g, g = v.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,1)');
      v.fillStyle = g; v.fillRect(0, 0, W, H);
      this.noise = mk(512, 512);
      const id = this.noise.g.createImageData(512, 512);
      let s = 1234567;
      for (let i = 0; i < id.data.length; i += 4) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        const n = (s >> 16) & 255;
        id.data[i] = id.data[i + 1] = id.data[i + 2] = n; id.data[i + 3] = 255;
      }
      this.noise.g.putImageData(id, 0, 0);
    },
    motionBlur(ctx, dx, dy, samples = 10) {
      const c = this.full;
      c.g.clearRect(0, 0, W, H);
      c.g.drawImage(ctx.canvas, 0, 0);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < samples; i++) {
        const f = i / (samples - 1) - 0.5;
        ctx.globalAlpha = 1 / (i + 1);
        ctx.drawImage(c, f * dx, f * dy);
      }
      ctx.restore();
    },
    bloom(ctx, amt) {
      if (amt <= 0) return;
      if (K.LOW) amt *= 0.8;
      const b1 = this.b1, b2 = this.b2;
      b1.g.filter = 'blur(3px)'; b1.g.clearRect(0, 0, 480, 270); b1.g.drawImage(ctx.canvas, 0, 0, 480, 270);
      if (!K.LOW) { b2.g.filter = 'blur(4px)'; b2.g.clearRect(0, 0, 240, 135); b2.g.drawImage(b1, 0, 0, 240, 135); }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = amt * (K.LOW ? 1 : 0.55); ctx.drawImage(b1, 0, 0, W, H);
      if (!K.LOW) { ctx.globalAlpha = amt * 0.7; ctx.drawImage(b2, 0, 0, W, H); }
      ctx.restore();
    },
    vignette(ctx, amt) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = amt; ctx.drawImage(this.vig, 0, 0); ctx.restore();
    },
    grain(ctx, amt, frame) {
      if (K.LOW || amt <= 0) return;
      const ox = Math.floor(hash(frame) * 512), oy = Math.floor(hash(frame + 99) * 512);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = amt;
      ctx.globalCompositeOperation = 'overlay';
      const pat = this.pat || (this.pat = ctx.createPattern(this.noise, 'repeat'));
      ctx.translate(-ox, -oy);
      ctx.fillStyle = pat; ctx.fillRect(ox, oy, W, H);
      ctx.restore();
    },
    corners(ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.strokeStyle = 'rgba(243,238,230,0.38)';
      ctx.lineWidth = 2;
      const m = 22, a = 22;
      ctx.beginPath();
      ctx.moveTo(m, m + a); ctx.lineTo(m, m); ctx.lineTo(m + a, m);
      ctx.moveTo(W - m - a, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + a);
      ctx.moveTo(m, H - m - a); ctx.lineTo(m, H - m); ctx.lineTo(m + a, H - m);
      ctx.moveTo(W - m - a, H - m); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m, H - m - a);
      ctx.stroke();
      ctx.restore();
    },
    // Radial zoom blur around (cx, cy).
    zoomBlur(ctx, cx, cy, amt, n = 5) {
      if (amt <= 0.002) return;
      const c = this.full;
      c.g.clearRect(0, 0, W, H);
      c.g.drawImage(ctx.canvas, 0, 0);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (let i = 1; i <= n; i++) {
        const s = 1 + amt * i / n;
        ctx.globalAlpha = 0.32 * (1 - i / (n + 1));
        ctx.setTransform(s, 0, 0, s, cx * (1 - s), cy * (1 - s));
        ctx.drawImage(c, 0, 0);
      }
      ctx.restore();
    },
  };

  // ---------- free 3D camera (z up) ----------
  function lookAt(pos, target, roll = 0, fovDeg = 58) {
    let fx = target[0] - pos[0], fy = target[1] - pos[1], fz = target[2] - pos[2];
    const fl = Math.hypot(fx, fy, fz) || 1; fx /= fl; fy /= fl; fz /= fl;
    let rx = fy, ry = -fx, rz = 0;
    const rl = Math.hypot(rx, ry) || 1; rx /= rl; ry /= rl;
    let ux = ry * fz - rz * fy, uy = rz * fx - rx * fz, uz = rx * fy - ry * fx;
    if (roll) {
      const c = Math.cos(roll), s = Math.sin(roll);
      const a = [rx * c + ux * s, ry * c + uy * s, rz * c + uz * s];
      const b = [ux * c - rx * s, uy * c - ry * s, uz * c - rz * s];
      [rx, ry, rz] = a; [ux, uy, uz] = b;
    }
    const f = (H / 2) / Math.tan(fovDeg * Math.PI / 360);
    const px = pos[0], py = pos[1], pz = pos[2];
    return {
      pos, f,
      view(x, y, z) {
        const dx = x - px, dy = y - py, dz = z - pz;
        return [dx * rx + dy * ry + dz * rz, dx * ux + dy * uy + dz * uz, dx * fx + dy * fy + dz * fz];
      },
      project(x, y, z) {
        const dx = x - px, dy = y - py, dz = z - pz;
        const Z = dx * fx + dy * fy + dz * fz;
        if (Z < 0.05) return null;
        return [W / 2 + f * (dx * rx + dy * ry + dz * rz) / Z, H / 2 - f * (dx * ux + dy * uy + dz * uz) / Z, Z];
      },
    };
  }

  // ---------- wireframe: static 3D segments, depth-faded, near-clipped ----------
  class Wire {
    constructor() { this.s = []; }
    line(a, b, w = 1, maxLen = 0) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      const n = maxLen ? Math.max(1, Math.ceil(L / maxLen)) : 1;
      for (let i = 0; i < n; i++) {
        const u = i / n, v = (i + 1) / n;
        this.s.push(lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[0], b[0], v), lerp(a[1], b[1], v), lerp(a[2], b[2], v), w);
      }
      return this;
    }
    poly(pts, close, w = 1, maxLen = 0) {
      for (let i = 0; i < pts.length - (close ? 0 : 1); i++) this.line(pts[i], pts[(i + 1) % pts.length], w, maxLen);
      return this;
    }
    box(x0, y0, z0, x1, y1, z1, w = 1) {
      const c = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
      [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([i, j]) => this.line(c[i], c[j], w));
      return this;
    }
    done() { this.a = Float32Array.from(this.s); this.s = null; return this; }
    // o: {rgb, alpha, far, width, warp(p)->p}
    draw(ctx, cam, o = {}) {
      const a = this.a, near = 0.08, NB = 6, far = o.far || 12, warp = o.warp;
      const paths = Array.from({ length: NB * 2 }, () => new Path2D());
      const f = cam.f, hw = W / 2, hh = H / 2;
      const p = [0, 0, 0], q = [0, 0, 0];
      for (let i = 0; i < a.length; i += 7) {
        p[0] = a[i]; p[1] = a[i + 1]; p[2] = a[i + 2]; q[0] = a[i + 3]; q[1] = a[i + 4]; q[2] = a[i + 5];
        let P = p, Q = q;
        if (warp) { P = warp(p); Q = warp(q); }
        let v1 = cam.view(P[0], P[1], P[2]), v2 = cam.view(Q[0], Q[1], Q[2]);
        if (v1[2] < near && v2[2] < near) continue;
        if (v1[2] < near) { const k = (near - v1[2]) / (v2[2] - v1[2]); v1 = [lerp(v1[0], v2[0], k), lerp(v1[1], v2[1], k), near]; }
        else if (v2[2] < near) { const k = (near - v2[2]) / (v1[2] - v2[2]); v2 = [lerp(v2[0], v1[0], k), lerp(v2[1], v1[1], k), near]; }
        const x1 = hw + f * v1[0] / v1[2], y1 = hh - f * v1[1] / v1[2];
        const x2 = hw + f * v2[0] / v2[2], y2 = hh - f * v2[1] / v2[2];
        if ((x1 < 0 && x2 < 0) || (x1 > W && x2 > W) || (y1 < 0 && y2 < 0) || (y1 > H && y2 > H)) continue;
        const b = Math.min(NB - 1, Math.floor(((v1[2] + v2[2]) / 2) / far * NB)) + (a[i + 6] > 1 ? NB : 0);
        paths[b].moveTo(x1, y1); paths[b].lineTo(x2, y2);
      }
      const rgb = o.rgb || '232,228,220', al = o.alpha === undefined ? 1 : o.alpha, lw = o.width || 1;
      ctx.save();
      for (let b = 0; b < NB * 2; b++) {
        const k = (b % NB) / (NB - 1), strong = b >= NB;
        ctx.strokeStyle = `rgba(${rgb},${al * lerp(strong ? 1 : 0.85, 0.16, Math.pow(k, 0.8))})`;
        ctx.lineWidth = lw * lerp(strong ? 2.2 : 1.5, 0.7, k);
        ctx.stroke(paths[b]);
      }
      ctx.restore();
    }
  }

  // Text on an arbitrary 3D plane: origin = baseline-left, ux = reading dir, uy = text "down" (unit vectors).
  function planeText(ctx, cam, str, origin, ux, uy, hW, drawChar, offsets) {
    const k = hW / 100, eps = 0.02;
    const xs = offsets || [];
    if (!offsets) for (let i = 0; i <= str.length; i++) xs.push(ctx.measureText(str.slice(0, i)).width);
    for (let i = 0; i < str.length; i++) {
      if (str[i] === ' ') continue;
      const s = xs[i] * k;
      const px = origin[0] + ux[0] * s, py = origin[1] + ux[1] * s, pz = origin[2] + ux[2] * s;
      const p = cam.project(px, py, pz);
      const pa = cam.project(px + ux[0] * eps, py + ux[1] * eps, pz + ux[2] * eps);
      const pb = cam.project(px + uy[0] * eps, py + uy[1] * eps, pz + uy[2] * eps);
      if (!p || !pa || !pb) continue;
      const ax = (pa[0] - p[0]) / eps * k, ay = (pa[1] - p[1]) / eps * k;
      const bx = (pb[0] - p[0]) / eps * k, by = (pb[1] - p[1]) / eps * k;
      const sc = Math.hypot(ax, ay);
      if (sc < 0.003 || sc > 30) continue;
      ctx.setTransform(ax, ay, bx, by, p[0], p[1]);
      drawChar(ctx, str[i], i, sc);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // Outline points of a text string (centred on 0,0), for particle effects.
  function textPoints(str, fontStr, w, h, max = 1400, stretch) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.font = fontStr;
    if (stretch && 'fontStretch' in g) g.fontStretch = stretch; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff';
    g.fillText(str, w / 2, h / 2);
    const d = g.getImageData(0, 0, w, h).data, pts = [];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4 + 3;
      if (d[i] > 128 && (d[i - 4] <= 128 || d[i + 4] <= 128 || d[i - w * 4] <= 128 || d[i + w * 4] <= 128)) pts.push([x - w / 2, y - h / 2]);
    }
    const out = [], step = Math.max(1, pts.length / max);
    for (let i = 0; i < pts.length; i += step) out.push(pts[Math.floor(i)]);
    return out;
  }

  G.K = {
    LOW: false,
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1, noise2,
    font, glow, halo, pen, drawGrid, typeText, Path, Lyric,
    camKeys, cam2, applyCam, camPoint, orbit, groundText, sparks, PFX,
    lookAt, Wire, planeText, textPoints,
  };
})(window);
