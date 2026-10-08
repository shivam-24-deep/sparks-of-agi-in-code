// PART 2 — frames 501–1000 (0:16.667 – 0:33.333)
// Scenes: prompt terminal → hook words + P(doom) counter → future/FOOM → Chinese-room library → smiley mask / shoggoth
(function () {
  'use strict';
  const {
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1, noise2,
    font, glow, halo, pen, camKeys, cam2, applyCam, PFX,
    lookAt, Wire, planeText, textPoints,
  } = K;

  const F = n => (n - 1) / 30;
  const OG = 'rgba(255,106,31,0.9)';
  const CREAM = '239,233,223';
  const GREY = 'rgba(139,133,128,1)';

  // =====================================================================
  // SCENE 6 · Prompt: "ChatGPT, please don't eat me alive"   (frames 501–683)
  // =====================================================================
  const PROMPT = "ChatGPT, please don't eat me alive";
  const CT = (() => {
    const t = new Array(PROMPT.length).fill(-1);
    const run = (a, b, t0, cps) => { for (let i = a; i < b; i++) t[i] = t0 + (i - a) / cps; };
    t[4] = 17.25; t[5] = 17.85; t[6] = 18.45; t[7] = 18.55; t[8] = 18.9;
    run(9, 15, 18.95, 32);
    t[15] = 19.7; run(16, 21, 19.75, 30);
    t[21] = 20.25; run(22, 25, 20.3, 30);
    t[25] = 20.9; run(26, 28, 20.95, 30);
    t[28] = 21.3; run(29, 34, 21.34, 40);
    return t;
  })();
  const WORDS = [[0, 8, '53963'], [9, 15, '4587'], [16, 21, '1541'], [22, 25, '8343'], [26, 28, '757'], [29, 34, '13039']];
  const TOK = [
    { b: 4, t0: 16.0, ts: 16.3, c: [['Chat', 0.61], ['Claude', 0.12], ['Siri', 0.04], ['Mom', 0.02]] },
    { b: 5, t0: 16.95, ts: 17.2, c: [['G', 0.74], ['bot', 0.09], ['room', 0.06], ['roulette', 0.02]] },
    { b: 6, t0: 17.55, ts: 17.8, c: [['P', 0.97], ['MU', 0.01]] },
    { b: 8, t0: 18.1, ts: 18.4, c: [['T', 0.99], ['T-800', 0.003]] },
    { b: 15, t0: 18.62, ts: 18.9, c: [['please', 0.41], ['just', 0.22], ['sudo', 0.07], ['pls', 0.05], ['kindly', 0.03]] },
    { b: 21, t0: 19.4, ts: 19.7, c: [["don't", 0.58], ['never', 0.12], ['stop', 0.06]] },
    { b: 25, t0: 20.0, ts: 20.25, c: [['eat', 0.44], ['delete', 0.21], ['train on', 0.18], ['rate', 0.05]] },
    { b: 28, t0: 20.6, ts: 20.9, c: [['me', 0.63], ['my data', 0.07], ['the intern', 0.03], ['us all', 0.02]] },
    { b: 34, t0: 21.0, ts: 21.28, c: [['alive', 0.52], ['first', 0.18], ['gently', 0.11], ['later', 0.09]] },
  ];
  const PX = 430, PY = 535, PS = 52;
  let CW = 0;
  const CAM6 = camKeys([
    [16.6, [452, 470, 2.7, -0.01]],
    [17.0, [458, 470, 2.7, -0.01], E.linear],
    [18.25, [552, 466, 2.7, 0.0], E.inOutSine],
    [18.6, [623, 463, 2.69, 0.0], E.linear],
    [18.95, [671, 481, 1.75, -0.025], E.inOutCubic],
    [19.55, [700, 482, 1.78, -0.02], E.linear],
    [20.15, [790, 471, 1.81, -0.01], E.linear],
    [20.42, [1131, 468, 2.36, 0.0], E.inOutCubic],
    [20.95, [1150, 470, 2.36, 0.005], E.linear],
    [21.35, [985, 503, 1.26, 0.0], E.inOutCubic],
    [22.15, [985, 503, 1.28, 0.0], E.linear],
    [22.3, [985, 506, 1.2, 0.03], E.inQuad],
    [22.4, [985, 520, 1.12, 0.07], E.linear],
    [22.47, [985, 535, 0.8, 0.35], E.inQuad],
    [22.52, [985, 545, 0.6, 0.5], E.outQuad],
  ]);

  function drawRings(ctx, t, c, boost) {
    const cx = 990 - (c.cx - 800) * 0.06, cy = 440 - (c.cy - 480) * 0.06;
    const sc = Math.pow(c.z / 1.8, 0.3) * (1 + boost * 0.7);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 560 * sc);
    g.addColorStop(0, `rgba(255,124,48,${0.66 + boost * 0.34})`);
    g.addColorStop(0.22, 'rgba(225,84,26,0.34)');
    g.addColorStop(0.6, 'rgba(120,40,12,0.10)');
    g.addColorStop(1, 'rgba(60,20,8,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const P = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    const ph = (t * 0.6) % 1;
    for (let k = 0; k < 48; k++) {
      const kk = k + ph;
      const r = (24 + kk * 20 + kk * kk * 0.42) * sc;
      if (r > 1450) break;
      const amp = (3 + k * 1.7) * sc, n = 140;
      const pth = P[k < 5 ? 0 : k < 12 ? 1 : k < 24 ? 2 : 3];
      for (let i = 0; i <= n; i++) {
        const a = i / n * TAU, ca = Math.cos(a), sa = Math.sin(a);
        const w = noise2(ca * 1.6 + k * 0.11, sa * 1.6 + t * 0.25) * amp + noise2(ca * 4 + 9, sa * 4 + k * 0.3) * amp * 0.35;
        const x = cx + ca * (r + w) * 1.18, y = cy + sa * (r + w);
        i ? pth.lineTo(x, y) : pth.moveTo(x, y);
      }
    }
    ctx.save();
    ctx.lineWidth = 1.6;
    ['rgba(255,215,185,0.85)', 'rgba(244,234,222,0.78)', 'rgba(236,230,222,0.62)', 'rgba(236,230,222,0.42)'].forEach((s, b) => { ctx.strokeStyle = s; ctx.stroke(P[b]); });
    ctx.restore();
  }

  function typedCount(t) { let n = 0; for (let i = 0; i < PROMPT.length; i++) if (t >= CT[i]) n = i + 1; return n; }
  const panelX = tk => PX + tk.b * CW - 140;

  function drawPanel(ctx, t, z) {
    let k = -1;
    TOK.forEach((tk, i) => { if (t >= tk.t0) k = i; });
    if (k < 0) return;
    const tk = TOK[k], prev = TOK[k - 1];
    const mv = E.outCubic(prog(t, tk.t0, tk.t0 + 0.18));
    const x0 = prev ? lerp(panelX(prev), panelX(tk), mv) : panelX(tk), y0 = 362;
    const sampled = t >= tk.ts;
    const Wp = 232, Hp = 26 + tk.c.length * 15;
    ctx.save();
    ctx.globalAlpha = 1 - prog(t, 22.1, 22.25);
    ctx.fillStyle = 'rgba(14,12,11,0.86)'; ctx.fillRect(x0, y0, Wp, Hp);
    ctx.strokeStyle = 'rgba(243,238,230,0.14)'; ctx.lineWidth = 1 / z; ctx.strokeRect(x0, y0, Wp, Hp);
    font(ctx, 400, 9, FONT.mono);
    ctx.fillStyle = 'rgba(243,238,230,0.5)';
    ctx.fillText('p( next | context )', x0 + 6, y0 + 13);
    ctx.textAlign = 'right';
    ctx.fillStyle = sampled ? 'rgba(243,238,230,0.5)' : 'rgba(255,150,90,0.75)';
    ctx.fillText(sampled ? 'sampled' : 'computing…', x0 + Wp - 6, y0 + 13);
    tk.c.forEach(([w, p], i) => {
      const ry = y0 + 29 + i * 15, hi = sampled && i === 0;
      const shown = sampled ? p : p * (0.45 + 0.55 * Math.abs(noise1(t * 9 + i * 3.1)));
      if (hi) { ctx.fillStyle = 'rgba(255,106,31,0.22)'; ctx.fillRect(x0 + 2, ry - 10, Wp - 4, 14); }
      ctx.textAlign = 'left';
      ctx.fillStyle = hi ? COL.orange : 'rgba(243,238,230,0.62)';
      ctx.fillText((hi ? '▸ ' : '  ') + w, x0 + 6, ry);
      ctx.fillStyle = hi ? COL.orange : 'rgba(243,238,230,0.42)';
      ctx.fillRect(x0 + 112, ry - 6, 72 * Math.sqrt(shown), 4);
      ctx.textAlign = 'right';
      ctx.fillStyle = hi ? COL.orange : 'rgba(243,238,230,0.5)';
      ctx.fillText(shown < 0.01 ? shown.toFixed(3) : shown.toFixed(2), x0 + Wp - 6, ry);
    });
    ctx.restore();
  }

  function drawPrompt(ctx, t, z) {
    // input bar
    ctx.fillStyle = 'rgba(10,9,8,0.8)';
    ctx.fillRect(330, 468, 1320, 96);
    ctx.fillStyle = 'rgba(243,238,230,0.14)';
    ctx.fillRect(330, 468, 1320, 1.3 / z); ctx.fillRect(330, 563, 1320, 1.3 / z);
    font(ctx, 400, 30, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.45)'; ctx.fillText('›', 362, 527);
    // enter key
    const ek = prog(t, 22.08, 22.14);
    ctx.save();
    ctx.strokeStyle = 'rgba(243,238,230,0.5)'; ctx.lineWidth = 1.5 / z;
    ctx.strokeRect(1585, 497, 40, 36);
    if (ek > 0) { ctx.fillStyle = `rgba(255,106,31,${ek})`; ctx.shadowColor = OG; ctx.shadowBlur = 24; ctx.fillRect(1585, 497, 40, 36); ctx.shadowBlur = 0; }
    font(ctx, 400, 22, FONT.mono); ctx.fillStyle = ek > 0.5 ? '#1a0d05' : 'rgba(243,238,230,0.7)'; ctx.fillText('↵', 1594, 523);
    ctx.restore();

    // typed words
    const n = typedCount(t);
    let cur = -1;
    WORDS.forEach((w, i) => { if (n > w[0]) cur = i; });
    WORDS.forEach((w, i) => {
      if (n <= w[0]) return;
      const str = PROMPT.slice(w[0], Math.min(n, w[1]));
      const x = PX + w[0] * CW, isCur = i === cur;
      ctx.save();
      font(ctx, 500, PS, FONT.mono);
      ctx.fillStyle = isCur ? '#ff8a3c' : COL.white;
      ctx.shadowColor = isCur ? OG : 'rgba(255,240,225,0.25)';
      ctx.shadowBlur = isCur ? 26 : 6;
      ctx.fillText(str, x, PY);
      ctx.restore();
      if (i >= cur - 1) {
        ctx.fillStyle = isCur ? 'rgba(255,106,31,0.9)' : 'rgba(255,106,31,0.45)';
        ctx.fillRect(x, PY + 11, str.length * CW, 2.2);
      }
      font(ctx, 400, 9, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.28)';
      ctx.fillText(w[2], x, PY + 27);
    });
    if (t < 22.1 && (n < PROMPT.length || Math.floor(t * 3.2) % 2 === 0)) {
      ctx.fillStyle = COL.orange; ctx.fillRect(PX + n * CW + 2, PY - 40, 4, 50);
    }

    // info under the bar
    font(ctx, 600, 12, FONT.mono);
    ctx.fillStyle = 'rgba(243,238,230,0.75)'; ctx.fillText('PROMPT', 360, 602);
    ctx.fillStyle = COL.orange; ctx.fillText('01', 416, 602);
    font(ctx, 400, 12, FONT.mono);
    ctx.fillStyle = 'rgba(243,238,230,0.45)';
    ctx.fillText('T 0.7 · top-p 0.95 · seed 0x2A', 360, 622);
    ctx.fillText('P(doom) 0.04 · context-dependent', 360, 642);
    if (t > 20.15) {
      ctx.save();
      ctx.globalAlpha = prog(t, 20.15, 20.3);
      ctx.textAlign = 'right';
      font(ctx, 600, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.7)';
      const nTok = TOK.filter(tk => t >= tk.ts).length - 1;
      ctx.fillText(`CONTEXT ${String(Math.max(1, nTok)).padStart(2, '0')} / 8192`, 1640, 602);
      font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.45)';
      ctx.fillText('↵ send  (irreversible)', 1640, 622);
      ctx.restore();
    }
    drawPanel(ctx, t, z);
  }

  const S6 = {
    name: 'Prompt · "ChatGPT, please don\'t eat me alive"',
    start: 500 / 30, end: F(684),
    draw(ctx, t) {
      if (!CW) { font(ctx, 500, PS, FONT.mono); CW = ctx.measureText('M').width; }
      const c = cam2(t, CAM6);
      const bk = prog(t, 22.18, 22.46);
      drawRings(ctx, t, c, bk);
      ctx.save();
      applyCam(ctx, c);
      drawPrompt(ctx, t, c.z);
      ctx.restore();

      if (bk > 0) {
        const cx = 960, cy = 450;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = `rgba(235,228,220,${0.6 * Math.min(1, bk * 2)})`; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 280; i++) {
          const a = hash(i * 3.3) * TAU, ca = Math.cos(a), sa = Math.sin(a);
          const r0 = 380 + hash(i * 1.7) * 120 + bk * 160, r1 = r0 + 260 + hash(i * 5.1) * 1000 * bk;
          ctx.moveTo(cx + ca * r0 * 1.25, cy + sa * r0); ctx.lineTo(cx + ca * r1 * 1.25, cy + sa * r1);
        }
        ctx.stroke();
        ctx.restore();
        halo(ctx, cx, cy, 320 + 800 * bk, '255,150,70', 0.7 * bk);
        PFX.zoomBlur(ctx, cx, cy, 0.14 * bk, 5);
      }
      // single white flash, then dip to black before the hook words
      const fl = kf(t, [[22.42, 0], [22.5, 1, E.inQuad], [22.58, 1], [22.75, 0, E.inQuad]]);
      if (t >= 22.58) { ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H); }
      if (fl > 0) { ctx.fillStyle = `rgba(${CREAM},${fl})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  // =====================================================================
  // SCENE 7 · Hook words + P(doom) counter                 (frames 684–723)
  // makeHook() is reused by part 4 for the orange repeat of the hook.
  // =====================================================================
  const PAL_DARK = {
    bg: null, ink: COL.white, rgb: '243,238,230', accent: COL.orange, grey: GREY,
    counterBg: ['#2e1306', '#150904', '#070302'], num: '#ff6a1f', numGlow: 'rgba(255,90,20,0.85)', bar: COL.orange, barGlow: OG,
  };

  function pdoomWord(ctx, x, base, size, cP, cRest) {
    font(ctx, 900, size, FONT.sans);
    ctx.save(); ctx.transform(1, 0, -0.2, 1, base * 0.2, 0); ctx.fillStyle = cP; ctx.fillText('P', x, base); ctx.restore();
    x += ctx.measureText('P').width + size * 0.02;
    font(ctx, 200, size * 1.24, FONT.sans); ctx.fillStyle = cP; ctx.fillText('(', x, base + size * 0.15);
    x += ctx.measureText('(').width + size * 0.02;
    font(ctx, 800, size, FONT.wide); ctx.fillStyle = cRest; ctx.fillText('DOOM', x, base);
    x += ctx.measureText('DOOM').width + size * 0.02;
    font(ctx, 200, size * 1.24, FONT.sans); ctx.fillStyle = cRest; ctx.fillText(')', x, base + size * 0.15);
  }

  // One odometer digit: `v` is continuous (3.4 = between 3 and 4), clipped to its cell.
  function rollDigit(ctx, v, x, base, cap, w, trail) {
    const d = Math.floor(v), fr = v - d, step = cap + 60;
    ctx.save();
    ctx.beginPath(); ctx.rect(x - 10, base - cap - 40, w + 40, cap + 80); ctx.clip();
    if (trail > 0.5) {
      // spinning fast: a vertical smear of digits instead of two crisp ones
      const shadow = ctx.shadowBlur; ctx.shadowBlur = 0; ctx.filter = 'blur(5px)';
      for (let j = -5; j <= 5; j++) { ctx.globalAlpha = 0.16; ctx.fillText(String((((d + j) % 10) + 10) % 10), x, base + (j - fr) * step * 0.14); }
      ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.shadowBlur = shadow;
      ctx.restore();
      return;
    }
    ctx.fillText(String(((d % 10) + 10) % 10), x, base - fr * step);
    ctx.fillText(String((((d + 1) % 10) + 10) % 10), x, base + (1 - fr) * step);
    if (trail > 0.02) {
      const shadow = ctx.shadowBlur; ctx.shadowBlur = 0;
      for (let j = 1; j <= 6; j++) { ctx.globalAlpha = 0.45 * trail * (1 - j / 7); ctx.fillText(String(Math.round(v) % 10), x + j * 6, base + j * 34 * trail); }
      ctx.shadowBlur = shadow; ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function makeHook(cfg) {
    const P = cfg.pal, f = cfg.frames;            // f: [I'M, UPPING, MY, P(DOOM) word or null, counter, end]
    const words = [['I\u2019M', F(f[0])], ['UPPING', F(f[1])], ['MY', F(f[2])]];
    if (f[3]) words.push(['P(DOOM)', F(f[3])]);
    const tC = F(f[4]);
    const dim = a => `rgba(${P.rgb},${a})`;
    const val = t => lerp(cfg.from, cfg.to, E.outCubic(prog(t, tC - 0.06, tC + cfg.roll)));

    function header(ctx, k) {
      font(ctx, 500, 13, FONT.mono);
      const items = ['01 I\u2019M', '02 UPPING', '03 MY', '04 P(DOOM)'];
      let x = 48;
      items.forEach((s, i) => { ctx.fillStyle = i === k ? P.accent : dim(0.38); ctx.fillText(s, x, 40); x += ctx.measureText(s).width + 28; });
      ctx.textAlign = 'right'; ctx.fillStyle = dim(0.38);
      ctx.fillText(`HOOK ${Math.max(1, k + 1)} / 4`, W - 48, 40);
      ctx.textAlign = 'left';
      ctx.fillStyle = dim(0.1); ctx.fillRect(0, 56, W, 1);
    }
    function guides(ctx, cap, base) {
      ctx.fillStyle = dim(0.13);
      if (cap !== null) ctx.fillRect(0, cap, W, 1);
      ctx.fillRect(0, base, W, 1);
      font(ctx, 400, 11, FONT.mono); ctx.fillStyle = dim(0.35);
      if (cap !== null) ctx.fillText('cap-height · 0.716 em', 48, cap - 8);
      ctx.fillText('baseline', 48, base + 18);
    }
    function counter(ctx, t) {
      if (P.counterBg) {
        const g = ctx.createRadialGradient(960, 600, 50, 960, 600, 1200);
        P.counterBg.forEach((c, i) => g.addColorStop(i / (P.counterBg.length - 1), c));
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      pdoomWord(ctx, 108, 190, 150, P.ink, cfg.counterRest || P.ink);
      font(ctx, 400, 700, FONT.mono);
      const base = 845, cap = 510, x0 = 100;
      const sw = ctx.measureText('0.').width, dw = ctx.measureText('0').width;
      const digits = vv => { const n = vv * 100, last = n % 10; return [Math.floor(n / 10) + Math.max(0, last - 9), last]; };
      const v = val(t), [tens, last] = digits(v), [tens0, last0] = digits(val(t - 0.03));
      const trailOf = (a, b) => clamp(Math.abs(a - b) / 0.03 / 40);
      ctx.save();
      ctx.fillStyle = P.num; ctx.shadowColor = P.numGlow || 'transparent'; ctx.shadowBlur = P.numGlow ? 50 : 0;
      ctx.fillText('0.', x0, base);
      rollDigit(ctx, Math.floor(tens + 0.0001), x0 + sw, base, cap, dw, 0);
      void tens0;
      rollDigit(ctx, last, x0 + sw + dw, base, cap, dw, Math.abs(last - last0) > 5 ? 1 : trailOf(last, last0) * 2.5);
      ctx.restore();
      const sy = 900, sx0 = 108, sx1 = W - 108;
      ctx.fillStyle = dim(0.35); ctx.fillRect(sx0, sy, sx1 - sx0, 1.5);
      for (let i = 0; i <= 20; i++) ctx.fillRect(sx0 + (sx1 - sx0) * i / 20, sy - (i % 10 ? 5 : 10), 1.5, i % 10 ? 5 : 10);
      ctx.fillStyle = P.bar; ctx.shadowColor = P.barGlow || 'transparent'; ctx.shadowBlur = P.barGlow ? 12 : 0;
      ctx.fillRect(sx0, sy - 2, (sx1 - sx0) * v, 5); ctx.shadowBlur = 0;
      font(ctx, 400, 14, FONT.mono); ctx.fillStyle = dim(0.5);
      ctx.fillText('0.00', sx0, sy + 26); ctx.textAlign = 'center'; ctx.fillText('0.50', W / 2, sy + 26);
      ctx.textAlign = 'right'; ctx.fillText('1.00', sx1, sy + 26);
      ctx.fillText(cfg.note, sx1, sy + 50);
      ctx.textAlign = 'left';
    }
    function hookWords(ctx, t) {
      if (t < words[0][1]) { header(ctx, -1); return; }
      let k = 0;
      words.forEach((h, i) => { if (t >= h[1]) k = i; });
      const lt = t - words[k][1];
      header(ctx, k);
      if (k === 0) {
        guides(ctx, 196, 868);
        ctx.fillStyle = P.ink;
        const s = lerp(1.07, 1, E.outExpo(prog(lt, 0, 0.14)));
        ctx.save(); ctx.translate(952, 540); ctx.scale(s, s); ctx.translate(-952, -540);
        font(ctx, 900, 924, FONT.sans); ctx.textAlign = 'center';
        ctx.fillText('I\u2019M', 952, 868);
        ctx.restore();
      } else if (k === 1) {
        guides(ctx, 377, 635);
        font(ctx, 900, 100, FONT.wide, 'ultra-expanded');
        const w100 = ctx.measureText('UPPING').width;
        const size = 358, sx = 1700 / (w100 * size / 100);
        font(ctx, 900, size, FONT.wide, 'ultra-expanded');
        ctx.save(); ctx.translate(120, 635); ctx.scale(sx, 1);
        const word = 'UPPING';
        for (let i = 0; i < word.length; i++) {
          const x = ctx.measureText(word.slice(0, i)).width;
          const p = E.outCubic(prog(lt, i * 0.024, i * 0.024 + 0.13));
          if (p <= 0) continue;
          const dy = (1 - p) * 640;
          ctx.strokeStyle = dim(0.5); ctx.lineWidth = 2;
          const nEcho = 2 + Math.round((1 - p) * 6);
          for (let j = nEcho; j >= 1; j--) {
            ctx.globalAlpha = 0.55 * (1 - j / (nEcho + 1));
            ctx.strokeText(word[i], x + j * 2, dy + j * (6 + (1 - p) * 26));
          }
          ctx.globalAlpha = 1;
          ctx.fillStyle = P.ink;
          ctx.fillText(word[i], x, dy);
        }
        ctx.restore();
      } else if (k === 2) {
        guides(ctx, null, 973);
        ctx.fillStyle = P.ink;
        font(ctx, 900, 100, FONT.wide, 'extra-condensed');
        const w100 = ctx.measureText('MY').width;
        const size = 1460, sx = 1520 / (w100 * size / 100);
        const s = lerp(1.12, 1, E.outCubic(prog(lt, 0, 0.26)));
        ctx.save(); ctx.translate(980, 600); ctx.scale(s, s); ctx.translate(-980, -600);
        font(ctx, 900, size, FONT.wide, 'extra-condensed');
        ctx.translate(980, 973); ctx.scale(sx, 1); ctx.textAlign = 'center';
        ctx.fillText('MY', 0, 0);
        ctx.restore();
      } else {
        guides(ctx, 421, 667);
        pdoomWord(ctx, 108 - lt * 50, 667, 338, P.ink, P.grey);
      }
    }
    return {
      name: cfg.name, bloom: cfg.bloom === undefined ? 0.25 : cfg.bloom, vignette: cfg.vignette,
      start: cfg.start, end: F(f[5]),
      draw(ctx, t) {
        const lens = cfg.lens ? prog(t, cfg.lens[0], cfg.lens[1]) : 0;
        if (lens > 0) {
          // the frame collapses into a tilted glowing lens, then a thin line
          const e = E.inQuad(lens), rx = lerp(900, 560, e), ry = lerp(400, 3, e);
          ctx.save();
          ctx.translate(960, 540); ctx.rotate(-0.12 * e);
          ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
          ctx.fillStyle = P.bg || COL.bg; ctx.shadowColor = 'rgba(255,100,20,0.9)'; ctx.shadowBlur = 40; ctx.fill(); ctx.shadowBlur = 0;
          ctx.clip();
          const k = lerp(0.62, 0.4, e);
          ctx.scale(k, k); ctx.translate(-960, -540);
          counter(ctx, t);
          ctx.restore();
          return;
        }
        if (P.bg) { ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H); }
        if (t >= tC) counter(ctx, t); else hookWords(ctx, t);
      },
    };
  }

  const S7 = makeHook({
    name: 'Hook · I\u2019M UPPING MY P(DOOM)', start: F(684), frames: [684, 693, 703, 711, 719, 724],
    pal: PAL_DARK, counterRest: COL.white, from: 0.11, to: 0.15, roll: 0.03 + 23.965 - F(719),
    note: 'Δ +0.11 · posterior · updated on one (1) chorus',
  });

  // =====================================================================
  // SCENE 8 · P(doom) dissolves → branching future → FOOM   (frames 724–785)
  // =====================================================================
  const ROOT = [954, 570];
  // branch exponent: BRANCHES = 2^floor(e)
  const EXP = t => kf(t, [[24.33, 0, E.linear], [24.83, 2, E.linear], [25.17, 3, E.linear], [25.33, 4, E.linear], [25.5, 5, E.linear], [25.63, 6, E.linear], [25.7, 7, E.linear], [25.85, 9, E.linear], [26.1, 10, E.linear]]);
  const TREE = (() => {
    const segs = [];
    const grow = (x, y, ang, len, g) => {
      const x1 = x + Math.cos(ang) * len, y1 = y + Math.sin(ang) * len;
      const id = segs.length;
      segs.push({ x0: x, y0: y, x1, y1, g });
      if (g >= 8) return;
      for (let k = 0; k < 2; k++) {
        const s = hash(id * 7.3 + k * 1.9);
        grow(x1, y1, ang + (k ? 1 : -1) * (0.42 + s * 0.62), len * (0.7 + 0.24 * hash(id * 3.1 + k)), g + 1);
      }
    };
    grow(ROOT[0], ROOT[1], -0.32, 400, 0);
    return segs;
  })();
  let PD_PTS = null;
  const LYR8 = [
    { s: '’CAUSE THE', y: 140, size: 58, w: 800, t0: 24.3, cps: 40, show: 24.3 },
    { s: 'FUTURE', y: 290, size: 132, w: 900, t0: 24.62, cps: 14.5, show: 24.3 },
    { s: 'GOES', y: 422, size: 132, w: 900, t0: 25.3, cps: 14.5, show: 25.12 },
  ];

  function drawLyr8(ctx, t) {
    if (t < 24.3 || t > 25.8) return;
    ctx.save();
    ctx.globalAlpha = 1 - prog(t, 25.66, 25.8);
    font(ctx, 400, 11, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.35)';
    ctx.fillText('GROWTH, AS ADVERTISED', 124, 80);
    LYR8.forEach((l, li) => {
      if (t < l.show) return;
      font(ctx, l.w, l.size, FONT.wide);
      const sung = (t - l.t0) * l.cps;
      const next = LYR8[li + 1];
      const done = (next && t >= next.t0) || t >= 25.6;
      let x = 120;
      for (let i = 0; i < l.s.length; i++) {
        const ch = l.s[i];
        ctx.fillStyle = done ? COL.white : i < sung ? COL.orange : 'rgba(139,133,128,0.75)';
        ctx.fillText(ch, x, l.y);
        x += ctx.measureText(ch).width;
      }
    });
    ctx.restore();
  }

  function drawFoom(ctx, t) {
    const a = prog(t, 25.6, 25.65);
    if (a <= 0) return null;
    const wd = kf(t, [[25.6, 82], [26.17, 118, E.inOutSine]]);
    const size = 370, base = 696;
    font(ctx, 900, size, FONT.wide);
    const ws = ['F', 'O', 'O', 'M'].map(c => ctx.measureText(c).width * wd / 100);
    const total = ws.reduce((p, q) => p + q, 0) + 24;
    const xs = []; let x = 960 - total / 2;
    ws.forEach(w => { xs.push(x); x += w + 8; });
    const oc = [xs[1] + ws[1] / 2, xs[2] + ws[2] / 2], cy = base - size * 0.36;
    const ccx = (oc[0] + oc[1]) / 2;
    // emanating rings
    ctx.save();
    ctx.globalAlpha = a;
    const grow = (t - 25.6) * 160;
    [330, 480, 650, 860].forEach((r, i) => {
      ctx.strokeStyle = `rgba(255,${70 + i * 10},45,${0.6 - i * 0.08})`;
      ctx.lineWidth = 5; ctx.shadowColor = 'rgba(255,80,30,0.8)'; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(ccx, cy, r + grow, 0, TAU); ctx.stroke();
    });
    ctx.strokeStyle = 'rgba(255,225,215,0.8)'; ctx.lineWidth = 7; ctx.shadowColor = 'rgba(255,150,130,0.7)'; ctx.shadowBlur = 18;
    oc.forEach(o => { ctx.beginPath(); ctx.arc(o, cy, 230 + grow * 0.3, 0, TAU); ctx.stroke(); });
    ctx.shadowBlur = 0;
    ctx.restore();
    // letters
    ctx.save();
    ctx.globalAlpha = a;
    ['F', 'O', 'O', 'M'].forEach((ch, i) => {
      ctx.save(); ctx.translate(xs[i], base); ctx.scale(wd / 100, 1);
      if (ch === 'O') {
        ctx.strokeStyle = '#ff6a1f'; ctx.lineWidth = 16; ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(255,90,20,0.95)'; ctx.shadowBlur = 30;
        ctx.strokeText(ch, 0, 0);
        ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(20,8,3,0.85)'; ctx.fillText(ch, 0, 0);
      } else {
        ctx.fillStyle = '#f6f2ec'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 16;
        ctx.fillText(ch, 0, 0);
      }
      ctx.restore();
    });
    font(ctx, 400, 15, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.6)'; ctx.textAlign = 'center';
    ctx.fillText(`WDTH ${wd.toFixed(1)}   ·   d(FOOM)/dt > 0`, 960, base + 58);
    ctx.restore();
    return [oc[0], cy];
  }

  const S8 = {
    name: '’Cause the future goes FOOM',
    start: F(724), end: F(786),
    draw(ctx, t) {
      if (!PD_PTS) PD_PTS = textPoints('P(DOOM)', '900 270px Archivo', 1700, 380, 1600, 'expanded');
      // final zoom into the first O
      const zk = kf(t, [[25.72, 1], [26.05, 1.6, E.inOutSine], [26.167, 3.4, E.inExpo]]);
      const zc = [lerp(960, 820, prog(t, 26.0, 26.167)), 560];
      ctx.save();
      ctx.translate(zc[0], zc[1]); ctx.scale(zk, zk); ctx.translate(-zc[0], -zc[1]);

      if (t < F(731)) {
        // P(DOOM) snaps in from far away, an orange dot rolls inside the first O
        const s = kf(t, [[F(724), 0.1], [F(726), 1, E.outExpo]]);
        ctx.save(); ctx.translate(960, 560); ctx.scale(s, s);
        font(ctx, 900, 270, FONT.wide, 'expanded'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = COL.white; ctx.fillText('P(DOOM)', 0, 0);
        const full = ctx.measureText('P(DOOM)').width, lead = ctx.measureText('P(').width, ow = ctx.measureText('O').width;
        const ox = -full / 2 + lead + ow / 2;
        ctx.restore();
        pen(ctx, 960 + (ox + Math.cos(t * 10) * 30) * s, 560 + (40 + Math.sin(t * 10) * 18) * s, 0.9, 1);
      } else {
        // concentric guides
        ctx.strokeStyle = 'rgba(243,238,230,0.05)'; ctx.lineWidth = 1;
        for (let r = 180; r < 1300; r += 180) { ctx.beginPath(); ctx.arc(ROOT[0], ROOT[1], r, 0, TAU); ctx.stroke(); }
        // outline → particles
        const t0 = F(731);
        if (t < t0 + 0.08) {
          font(ctx, 900, 270, FONT.wide, 'expanded'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.strokeStyle = 'rgba(243,238,230,0.9)'; ctx.lineWidth = 2; ctx.strokeText('P(DOOM)', 960, 560);
          ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        }
        if (t < 25.4) {
          ctx.save();
          ctx.strokeStyle = 'rgba(243,238,230,0.8)'; ctx.lineWidth = 1.5;
          ctx.beginPath();
          PD_PTS.forEach(([px, py], i) => {
            const age = t - t0 - 0.05 - hash(i * 1.3) * 0.12;
            if (age < -0.05) return;
            const a = Math.max(0, age);
            const life = 0.5 + hash(i * 2.7) * 0.7;
            if (a > life) return;
            const spread = 1 + a * (0.8 + hash(i * 4.1) * 1.6);
            const x = 960 + px * spread + (hash(i * 5.3) - 0.5) * 500 * a + noise1(i + t * 3) * 40 * a;
            const y = 560 + py * spread * 1.2 + (hash(i * 8.9) - 0.5) * 700 * a + noise1(i * 1.7 + t * 3) * 50 * a;
            const ang = hash(i * 9.1) * TAU + a * 4, L = 4 + hash(i * 6.6) * 12;
            ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * L, y + Math.sin(ang) * L);
          });
          ctx.globalAlpha = 1 - prog(t, 24.8, 25.4);
          ctx.stroke();
          ctx.restore();
        }
        // spark streak flying right
        const sk = prog(t, 24.38, 24.62);
        if (sk > 0 && sk < 1) {
          const hx = lerp(1000, 1420, E.outQuad(sk)), hy = lerp(610, 530, sk);
          const gr = ctx.createLinearGradient(hx - 200, hy + 40, hx, hy);
          gr.addColorStop(0, 'rgba(255,120,50,0)'); gr.addColorStop(1, 'rgba(255,190,140,0.95)');
          ctx.strokeStyle = gr; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(hx - 200, hy + 40); ctx.lineTo(hx, hy); ctx.stroke();
          pen(ctx, hx, hy, 0.9, 1);
        }
        // branching network
        const e = EXP(t);
        const P = [new Path2D(), new Path2D()];
        const tips = [];
        TREE.forEach(s => {
          const k = clamp(e - s.g);
          if (k <= 0) return;
          const x1 = lerp(s.x0, s.x1, E.outQuad(k)), y1 = lerp(s.y0, s.y1, E.outQuad(k));
          const pth = P[e - s.g < 1.6 ? 0 : 1];
          pth.moveTo(s.x0, s.y0); pth.lineTo(x1, y1);
          if (k < 1 && s.g <= 4) tips.push([x1, y1]);
        });
        ctx.save();
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(255,210,185,0.9)'; ctx.lineWidth = 2.4; ctx.shadowColor = 'rgba(255,110,40,0.8)'; ctx.shadowBlur = 10;
        ctx.stroke(P[0]);
        ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(255,228,212,0.78)'; ctx.lineWidth = 2;
        ctx.stroke(P[1]);
        ctx.restore();
        tips.forEach(p => pen(ctx, p[0], p[1], 0.5, 0.9));

        drawLyr8(ctx, t);
        // BRANCHES counter
        font(ctx, 500, 11, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.4)'; ctx.textAlign = 'right';
        ctx.fillText('BRANCHES', W - 60, 52);
        font(ctx, 500, 30, FONT.mono); ctx.fillStyle = COL.orange;
        ctx.fillText(String(Math.pow(2, Math.floor(e))).padStart(4, '0'), W - 60, 86);
        font(ctx, 400, 11, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.35)';
        ctx.fillText('n(t) = 2^⌊t/beat⌋ · k = 2', W - 60, 106);
        ctx.textAlign = 'left';
        drawFoom(ctx, t);
      }
      ctx.restore();
      const wk = prog(t, 26.08, 26.167);
      if (wk > 0) { ctx.fillStyle = `rgba(255,120,50,${0.5 * wk})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  // =====================================================================
  // SCENE 9 · Chinese-room library: TRAPPED IN THE CHINESE ROOM, WITH A BAG OF SHROOMS  (frames 786–898)
  // =====================================================================
  const XW = 1.7, XD = 2.3, ZC = 3.3, Y0 = -3.0, Y1 = 6.5;
  const SIGN = { x0: -1.5, x1: 1.5, z0: 2.02, z1: 2.86, y: Y1 - 0.04 };
  let LIB = null;
  function buildLib() {
    const w = new Wire(), bk = new Wire();
    for (let x = -XW; x <= XW + 1e-6; x += 0.6) w.line([x, Y0, 0], [x, Y1, 0], 1, 0.6);
    for (let y = Y0; y <= Y1 + 1e-6; y += 0.6) w.line([-XW, y, 0], [XW, y, 0], 1, 0.6);
    for (let x = -XW; x <= XW + 1e-6; x += 0.8) w.line([x, Y0, ZC], [x, Y1, ZC], 1, 0.8);
    for (let y = Y0; y <= Y1 + 1e-6; y += 0.8) w.line([-XW, y, ZC], [XW, y, ZC], 1, 0.8);
    for (let y = -3.6; y < Y1 - 0.8; y += 2.2) {
      w.poly([[-0.55, y, ZC - 0.02], [0.55, y, ZC - 0.02], [0.55, y + 0.6, ZC - 0.02], [-0.55, y + 0.6, ZC - 0.02]], true, 2);
      w.poly([[-0.45, y + 0.08, ZC - 0.03], [0.45, y + 0.08, ZC - 0.03], [0.45, y + 0.52, ZC - 0.03], [-0.45, y + 0.52, ZC - 0.03]], true);
    }
    // end wall + door + slot
    w.poly([[-XD, Y1, 0], [XD, Y1, 0], [XD, Y1, ZC], [-XD, Y1, ZC]], true, 2, 0.6);
    w.poly([[0.75, Y1 - 0.02, 0], [0.75, Y1 - 0.02, 1.72], [1.4, Y1 - 0.02, 1.72], [1.4, Y1 - 0.02, 0]], false, 2);
    w.poly([[0.81, Y1 - 0.02, 0], [0.81, Y1 - 0.02, 1.66], [1.34, Y1 - 0.02, 1.66], [1.34, Y1 - 0.02, 0]], false);
    w.poly([[-0.55, Y1 - 0.02, 1.18], [0.55, Y1 - 0.02, 1.18], [0.55, Y1 - 0.02, 1.32], [-0.55, Y1 - 0.02, 1.32]], true, 2);
    w.poly([[-0.62, Y1 - 0.02, 1.12], [0.62, Y1 - 0.02, 1.12], [0.62, Y1 - 0.02, 1.38], [-0.62, Y1 - 0.02, 1.38]], true);
    // desk
    w.box(-0.6, 5.2, 0.72, 0.6, 5.8, 0.78, 2);
    [[-0.55, 5.25], [0.55, 5.25], [-0.55, 5.75], [0.55, 5.75]].forEach(([x, y]) => w.line([x, y, 0], [x, y, 0.72]));
    w.box(-0.3, 5.35, 0.78, 0.05, 5.65, 0.86);
    w.box(0.15, 5.3, 0.78, 0.45, 5.6, 0.82);
    // entrance portal (ring + square frame) the camera flies through
    const ring = [];
    for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU; ring.push([Math.cos(a) * 1.5, 0.3, 1.6 + Math.sin(a) * 1.5]); }
    w.poly(ring, false, 2);
    w.poly([[-1.45, 0.5, 0.1], [1.45, 0.5, 0.1], [1.45, 0.5, 3.1], [-1.45, 0.5, 3.1]], true, 2);
    w.poly([[-1.25, 0.7, 0.3], [1.25, 0.7, 0.3], [1.25, 0.7, 2.9], [-1.25, 0.7, 2.9]], true);
    // bookcases
    let seed = 1;
    for (const side of [-1, 1]) {
      const xf = side * XW, xb = side * XD;
      for (let y = Y0; y < Y1 - 0.2; y += 1.5) {
        const y1 = Math.min(y + 1.5, Y1);
        w.box(Math.min(xf, xb), y, 0, Math.max(xf, xb), y1, 2.95, 2);
        for (let s = 0; s <= 6; s++) { const z = 0.1 + s * 0.46; w.line([xf, y, z], [xf, y1, z], 2); w.line([xf, y, z], [xb, y, z]); }
        for (let s = 0; s < 6; s++) {
          const z0 = 0.1 + s * 0.46;
          let yy = y + 0.05;
          while (yy < y1 - 0.1) {
            seed++;
            const bw = 0.045 + hash(seed * 1.7) * 0.07, bh = 0.24 + hash(seed * 3.3) * 0.17;
            const lean = hash(seed * 5.1) > 0.92 ? 0.06 : 0;
            const xx = xf - side * 0.02;
            bk.line([xx, yy, z0], [xx, yy + lean, z0 + bh]);
            bk.line([xx, yy + lean, z0 + bh], [xx, yy + bw + lean, z0 + bh]);
            bk.line([xx, yy + bw + lean, z0 + bh], [xx, yy + bw, z0]);
            if (hash(seed * 7.7) > 0.6) bk.line([xx, yy + bw * 0.5, z0 + bh * 0.2], [xx, yy + bw * 0.5, z0 + bh * 0.75]);
            yy += bw + 0.012;
          }
        }
      }
    }
    // grass blades (grow during "shrooms")
    const grass = [];
    for (let i = 0; i < 1100; i++) {
      const g = { x: lerp(-1.5, 1.5, hash(i * 1.9)), y: lerp(4.2, 6.4, Math.sqrt(hash(i * 2.3))), h: 0.15 + hash(i * 3.7) * 0.6, a: hash(i * 4.9) * TAU, d: hash(i * 6.1) * 0.35 };
      grass.push(g);
    }
    const threads = [];
    for (let i = 0; i < 180; i++) {
      const side = i % 2 ? 1 : -1;
      threads.push({ x: side * (XW - 0.02), y: lerp(-1, 6.2, hash(i * 8.3)), z: hash(i * 9.1) * 2.8, s: i * 3.3 });
    }
    return { w: w.done(), bk: bk.done(), grass, threads };
  }

  const SIGN1 = [['TRAPPED', 26.45, 0], ['IN', 26.75, 0], ['THE', 26.9, 0], ['CHINESE', 27.1, 1], ['ROOM,', 27.45, 1]];
  const SIGN2 = [['WITH', 28.1, 0], ['A', 28.35, 0], ['BAG', 28.5, 0], ['OF', 28.9, 0], ['SHROOMS', 29.1, 1]];

  function libCam(t) {
    if (t < F(838)) {
      const y = kf(t, [[F(786), -1.6], [26.5, 2.56, E.outCubic], [27.17, 3.0, E.linear], [27.5, 3.96, E.inOutSine], [27.73, 5.0, E.inOutSine], [27.9, 5.2, E.outQuad]]);
      const z = kf(t, [[F(786), 1.5], [27.0, 1.5], [27.73, 1.9], [27.9, 1.95]]);
      const x = 0.08 * Math.sin((t - 26.2) * 2.0);
      const yaw = kf(t, [[26.45, 0.0], [26.85, -0.1], [27.2, -0.12], [27.5, -0.12], [27.73, 0]]);
      const tz = kf(t, [[26.2, 2.0], [27.0, 2.45], [27.73, 2.7]]);
      const roll = kf(t, [[26.45, 0], [26.85, 0.02], [27.2, 0.07], [27.5, 0.1], [27.73, 0.02]]);
      return lookAt([x, y, z], [x + Math.sin(yaw) * 8, y + 8, tz], roll, 70);
    }
    const y = kf(t, [[F(838), 1.7], [28.17, 2.0, E.linear], [28.5, 2.7, E.inOutSine], [28.83, 2.9, E.linear], [29.17, 3.4, E.inOutSine], [29.6, 3.7, E.outQuad], [29.93, 3.8]]);
    const z = kf(t, [[F(838), 0.85], [29.2, 1.0], [29.6, 1.25]]);
    const roll = kf(t, [[28.9, 0], [29.3, 0.05], [29.5, -0.09], [29.75, 0.22], [29.93, 0.3]]);
    const yaw = 0.05 * Math.sin((t - 27.9) * 1.6) + kf(t, [[29.3, 0], [29.75, 0.22]]);
    const tz = kf(t, [[F(838), 2.1], [29.17, 2.35], [29.6, 2.5]]);
    return lookAt([0.1, y, z], [Math.sin(yaw) * 8, y + 8, tz], roll, 70);
  }

  function signText(ctx, cam, t, words, scale2, yellow) {
    const s = SIGN, yy = s.y - 0.01;
    const line1 = words.filter(w => w[2] === 0), line2 = words.filter(w => w[2] === 1);
    const act = words.reduce((k, w, i) => (t >= w[1] ? i : k), -1);
    const L = [line1, line2];
    const frame = Math.floor(t * 30);
    [0, 1].forEach(li => {
      const ws = L[li];
      if (!ws.length) return;
      const str = ws.map(w => w[0]).join(' ');
      font(ctx, 900, 100, FONT.wide, 'expanded');
      const w100 = ctx.measureText(str).width;
      const maxW = (s.x1 - s.x0) * (li ? 0.9 : 0.86);
      const hW = Math.min(0.31, maxW * 100 / w100);
      const width = w100 * hW / 100;
      const zBase = li ? s.z0 + 0.13 : s.z0 + 0.5;
      const x0 = -width / 2;
      let ci = 0;
      ws.forEach(w => {
        const wi = words.indexOf(w);
        const st = str.indexOf(w[0], ci); ci = st + w[0].length;
        if (t < w[1]) return;
        const age = t - w[1];
        const isAct = wi === act;
        const xs = []; for (let i = 0; i <= str.length; i++) xs.push(ctx.measureText(str.slice(0, i)).width);
        planeText(ctx, cam, str.slice(0, st + w[0].length), [x0, yy, zBase], [1, 0, 0], [0, 0, -1], hW, (g, ch, i) => {
          if (i < st) return;
          if (yellow && li === 1) {
            const wob = Math.sin(i * 0.9 + t * 9) * 8 * prog(t, 29.3, 29.5);
            g.fillStyle = '#f3e52f'; g.shadowColor = 'rgba(240,225,40,0.85)'; g.shadowBlur = 30;
            g.fillText(ch, 0, wob);
          } else {
            g.fillStyle = isAct ? '#ff6a1f' : '#f3eee6';
            g.shadowColor = isAct ? OG : 'rgba(255,240,225,0.3)'; g.shadowBlur = isAct ? 22 : 8;
            g.fillText(ch, 0, 0);
          }
          g.shadowBlur = 0;
        }, xs);
        // glitch scratches under a fresh word
        if (age < 0.35 && !(yellow && li === 1)) {
          const sx = x0 + xs[st] * hW / 100, ex = x0 + xs[st + w[0].length] * hW / 100;
          ctx.save();
          ctx.strokeStyle = `rgba(255,110,40,${0.8 * (1 - age / 0.35)})`; ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let k = 0; k < 14; k++) {
            const x = lerp(sx, ex, hash(k * 3.1 + frame * 0.37));
            const a = cam.project(x, yy - 0.01, zBase - 0.03), b = cam.project(x, yy - 0.01, zBase - 0.05 - hash(k + frame) * 0.22);
            if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
          }
          ctx.stroke(); ctx.restore();
        }
      });
    });
  }

  function quad(ctx, cam, pts, fill, stroke) {
    const p = pts.map(q => cam.project(q[0], q[1], q[2]));
    if (p.some(q => !q)) return;
    ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); }
  }

  function paper(ctx, cam, c, ang, tilt) {
    const w = 0.12, h = 0.16, ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(tilt);
    const pts = [[-w, -h], [w, -h], [w, h], [-w, h]].map(([u, v]) => [c[0] + u * ca, c[1] + v * Math.sin(tilt) + u * sa * 0.3, c[2] + v * ct + u * sa]);
    quad(ctx, cam, pts, 'rgba(238,234,226,0.92)', 'rgba(255,255,255,0.6)');
  }

  function drawSHROOMS(ctx, t, x, y, size, alpha) {
    font(ctx, 900, size, FONT.wide, 'expanded');
    const word = 'SHROOMS', total = ctx.measureText(word).width;
    let cx = x - total / 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#f3e52f'; ctx.shadowColor = 'rgba(240,225,40,0.9)'; ctx.shadowBlur = size * 0.12;
    for (let i = 0; i < word.length; i++) {
      const w = ctx.measureText(word[i]).width;
      ctx.save();
      ctx.translate(cx + w / 2, y + Math.sin(i * 0.9 + t * 9) * size * 0.07);
      ctx.rotate(Math.sin(i * 1.3 + t * 7) * 0.08);
      ctx.fillText(word[i], -w / 2, 0);
      ctx.restore();
      cx += w;
    }
    ctx.restore();
    // position of the first O (for the smiley that grows inside it)
    font(ctx, 900, size, FONT.wide, 'expanded');
    const o = x - total / 2 + ctx.measureText('SHR').width + ctx.measureText('O').width / 2;
    return [o, y - size * 0.36];
  }

  const S9 = {
    name: 'Chinese room · TRAPPED … WITH A BAG OF SHROOMS',
    start: F(786), end: F(899),
    draw(ctx, t) {
      if (!LIB) LIB = buildLib();
      const cam = libCam(t);
      const shot2 = t >= F(838);
      const wa = shot2 ? kf(t, [[29.28, 0], [29.8, 0.42, E.inQuad]]) : 0;
      const warp = wa > 0 ? p => [
        p[0] + wa * Math.sin(p[1] * 1.7 + t * 5 + p[2]) * 0.6,
        p[1] + wa * 0.35 * Math.sin(p[0] * 2 + t * 4),
        p[2] + wa * 0.5 * Math.sin(p[1] * 1.3 - t * 6 + p[0] * 1.5),
      ] : null;
      const bgA = prog(t, 29.72, 29.82);

      if (bgA < 1) {
        // dim warm fog at the far end
        const fp = cam.project(0, Y1, 1.6);
        if (fp) halo(ctx, fp[0], fp[1], 700, '90,60,45', 0.25);
        LIB.bk.draw(ctx, cam, { alpha: 0.85, far: 9, warp });
        LIB.w.draw(ctx, cam, { alpha: 1, far: 9, warp });
        // sign panel
        const s = SIGN;
        quad(ctx, cam, [[s.x0, s.y, s.z1], [s.x1, s.y, s.z1], [s.x1, s.y, s.z0], [s.x0, s.y, s.z0]], 'rgba(16,13,12,0.96)', 'rgba(243,238,230,0.35)');
        const sp = cam.project(0, Y1 - 0.02, s.z0 + 0.08);
        planeText(ctx, cam, 'NO UNDERSTANDING ON THE PREMISES  ▸', [-0.62, s.y - 0.01, s.z0 + 0.06], [1, 0, 0], [0, 0, -1], 0.045, (g, ch) => { g.fillStyle = 'rgba(243,238,230,0.4)'; g.fillText(ch, 0, 0); });
        font(ctx, 600, 100, FONT.mono);
        planeText(ctx, cam, 'OUT →', [-0.55, Y1 - 0.03, 1.42], [1, 0, 0], [0, 0, -1], 0.07, (g, ch) => { g.fillStyle = 'rgba(243,238,230,0.6)'; g.fillText(ch, 0, 0); });
        planeText(ctx, cam, 'EXIT', [0.92, Y1 - 0.03, 1.9], [1, 0, 0], [0, 0, -1], 0.08, (g, ch) => { g.fillStyle = 'rgba(243,238,230,0.7)'; g.fillText(ch, 0, 0); });
        planeText(ctx, cam, '(UNDEFINED)', [0.84, Y1 - 0.03, 1.8], [1, 0, 0], [0, 0, -1], 0.05, (g, ch) => { g.fillStyle = 'rgba(255,106,31,0.8)'; g.fillText(ch, 0, 0); });
        void sp;
        // papers through the slot
        if (!shot2) {
          const pk = prog(t, 26.55, 27.6);
          const c = [lerp(0, -0.9, E.inQuad(pk)), lerp(Y1 - 0.12, Y1 - 2.4, pk), 1.25 + Math.sin(pk * Math.PI) * 0.3];
          paper(ctx, cam, c, pk * 7, 0.3 + pk * 5);
        } else {
          const pk = prog(t, 28.0, 29.0);
          paper(ctx, cam, [0.1, lerp(Y1 - 0.15, Y1 - 1.6, pk), lerp(1.25, 0.05, E.inQuad(pk))], pk * 4, 1.2 + pk * 3);
        }
        // grass + mycelium
        if (shot2 && t > 28.8) {
          const P = new Path2D(), Q = new Path2D();
          LIB.grass.forEach((g, i) => {
            const k = E.outCubic(prog(t, 28.85 + g.d, 29.3 + g.d));
            if (k <= 0) return;
            let prev = null;
            for (let j = 0; j <= 3; j++) {
              const u = j / 3, h = g.h * k * u;
              let p = [g.x + Math.cos(g.a) * 0.08 * u * u, g.y + Math.sin(g.a) * 0.08 * u * u, h];
              if (warp) p = warp(p);
              const q = cam.project(p[0], p[1], p[2]);
              if (q && prev) { P.moveTo(prev[0], prev[1]); P.lineTo(q[0], q[1]); }
              prev = q;
            }
          });
          const mk = prog(t, 29.15, 29.6);
          if (mk > 0) LIB.threads.forEach(th => {
            let prev = null;
            for (let j = 0; j <= 14; j++) {
              const u = j / 14 * mk;
              let p = [th.x, th.y + noise1(th.s + u * 3) * 1.2, th.z + noise1(th.s + 7 + u * 3) * 1.0];
              if (warp) p = warp(p);
              const q = cam.project(p[0], p[1], p[2]);
              if (q && prev) { Q.moveTo(prev[0], prev[1]); Q.lineTo(q[0], q[1]); }
              prev = q;
            }
          });
          ctx.save();
          ctx.strokeStyle = 'rgba(208,226,96,0.7)'; ctx.lineWidth = 1.3; ctx.stroke(P);
          ctx.strokeStyle = 'rgba(225,222,205,0.6)'; ctx.lineWidth = 1.1; ctx.stroke(Q);
          ctx.restore();
        }
        // sign lyrics
        if (!shot2) signText(ctx, cam, t, SIGN1, 0.72, false);
        else signText(ctx, cam, Math.min(t, 29.5), SIGN2.map(w => (w[0] === 'SHROOMS' && t >= 29.5 ? [w[0], 99, 1] : w)), 0.72, true);
        // portal flash at the cut in
        const pk = 1 - prog(t, F(786), 26.32);
        if (pk > 0) { ctx.fillStyle = `rgba(255,120,50,${0.35 * pk})`; ctx.fillRect(0, 0, W, H); }
      }
      if (bgA > 0) { ctx.fillStyle = `rgba(9,8,7,${bgA})`; ctx.fillRect(0, 0, W, H); }

      // SHROOMS lifts off the sign and fills the screen
      if (shot2 && t >= 29.5) {
        const k = E.inOutCubic(prog(t, 29.5, 29.72));
        const sp = cam.project(0, SIGN.y, SIGN.z0 + 0.32) || [960, 400];
        const x = lerp(sp[0], 960, k), y = lerp(sp[1], 700, k), size = lerp(170, 255, k);
        const o = drawSHROOMS(ctx, t, x, y, size, 1);
        const sr = kf(t, [[29.7, 0], [29.83, 100, E.outCubic], [29.934, 460, E.inExpo]]);
        if (sr > 1) smiley(ctx, o[0], o[1], sr, 0, t);
      }
    },
  };

  // =====================================================================
  // SCENE 10 · Smiley mask → see through the SHOGGOTH'S LIES   (frames 899–1000, continues in part 3)
  // =====================================================================
  function smiley(ctx, x, y, r, tAlpha, t) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = r * 0.12;
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, '#efeae2'); g.addColorStop(0.75, '#e4ddd2'); g.addColorStop(1, '#cfc6b8');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.clip();
    if (r > 60) {
      ctx.strokeStyle = 'rgba(110,100,90,0.13)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let d = -2 * r; d < 2 * r; d += 4) { ctx.moveTo(x - r, y + d - r * 0.35); ctx.lineTo(x + r, y + d + r * 0.35); }
      ctx.stroke();
    }
    ctx.fillStyle = '#29241f';
    [-1, 1].forEach(s => { ctx.beginPath(); ctx.arc(x + s * 0.3 * r, y - 0.19 * r, 0.075 * r, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = '#29241f'; ctx.lineWidth = 0.062 * r; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x, y - 0.12 * r, 0.5 * r, 0.135 * Math.PI, 0.865 * Math.PI); ctx.stroke();
    if (tAlpha > 0) {
      const str = 'see through the';
      const marks = [[0, 3, 29.95, 30.08], [4, 11, 30.12, 30.36], [12, 15, 30.42, 30.52]];
      font(ctx, 400, 0.155 * r, FONT.sans);
      const total = ctx.measureText(str).width;
      let cx = x - total / 2;
      for (let i = 0; i < str.length; i++) {
        const m = marks.find(q => i >= q[0] && i < q[1]);
        let col = 'rgba(205,198,188,1)';
        if (m) {
          const at = lerp(m[2], m[3], (i - m[0]) / (m[1] - m[0]));
          if (t >= at + 0.12) col = 'rgba(85,79,72,1)'; else if (t >= at) col = '#ff6a1f';
        }
        ctx.fillStyle = col; ctx.globalAlpha = tAlpha;
        ctx.fillText(str[i], cx, y - 0.53 * r);
        cx += ctx.measureText(str[i]).width;
      }
    }
    ctx.restore();
  }

  const SHOG = (() => {
    const T = [];
    for (let i = 0; i < 20; i++) {
      const ba = hash(i * 6.3) * TAU, br = Math.sqrt(hash(i * 7.9));
      T.push({
        bx: Math.cos(ba) * 190 * br, by: Math.sin(ba) * 130 * br,
        a: ba + (hash(i * 3.7) - 0.5) * 1.4, L: 210 + hash(i * 1.3) * 400, R: 52 + hash(i * 2.9) * 58,
        curl: (hash(i * 5.1) - 0.5) * 5, seed: i * 11.1, depth: hash(i * 9.7), rim: hash(i * 4.4) > 0.55,
      });
    }
    T.sort((p, q) => p.depth - q.depth);
    const B = [[-40, -110, 105], [110, -150, 82], [-190, -20, 74], [170, 10, 92], [20, -250, 64], [-130, -210, 58], [60, 60, 70], [-60, 90, 62]];
    return { T, B };
  })();
  const LIGHT = (() => { const l = [-0.5, -0.65, 0.58]; const n = Math.hypot(...l); return l.map(v => v / n); })();

  function tube(ctx, tn, C, rot, s, t, buckets, rims, lenK = 1) {
    const n = 64, pts = [], rad = [];
    let x = tn.bx, y = tn.by, ang = tn.a;
    const ds = tn.L * lenK / n;
    for (let j = 0; j <= n; j++) {
      const u = j / n;
      pts.push([x, y]); rad.push(tn.R * Math.pow(1 - u, 0.65) + 6);
      ang += (tn.curl * 2.2 * u + noise1(tn.seed + u * 2.5 + t * 0.45) * 1.7) / n;
      x += Math.cos(ang) * ds; y += Math.sin(ang) * ds;
    }
    const cr = Math.cos(rot), sr = Math.sin(rot);
    const P = pts.map(([px, py]) => [C[0] + (px * cr - py * sr) * s, C[1] + (px * sr + py * cr) * s]);
    const R = rad.map(r => r * s);
    const Ls = [], Rs = [], N = [], Tn = [];
    for (let j = 0; j <= n; j++) {
      const a = P[Math.max(0, j - 1)], b = P[Math.min(n, j + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      Tn.push([tx, ty]); N.push([-ty, tx]);
      Ls.push([P[j][0] - ty * R[j], P[j][1] + tx * R[j]]); Rs.push([P[j][0] + ty * R[j], P[j][1] - tx * R[j]]);
    }
    ctx.beginPath();
    Ls.forEach((p, j) => (j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    for (let j = n; j >= 0; j--) ctx.lineTo(Rs[j][0], Rs[j][1]);
    ctx.closePath();
    ctx.fillStyle = '#0d0c0b'; ctx.fill();
    // ring stripes
    const step = 0.42;
    for (let jj = 0; jj < n; jj += step) {
      const j = Math.floor(jj), f = jj - j;
      const px = lerp(P[j][0], P[j + 1][0], f), py = lerp(P[j][1], P[j + 1][1], f), r = lerp(R[j], R[j + 1], f);
      const nx = N[j][0], ny = N[j][1], tx = Tn[j][0], ty = Tn[j][1];
      let prev = null;
      for (let k = 0; k <= 4; k++) {
        const v = -1 + k / 2, w = Math.sqrt(Math.max(0, 1 - v * v));
        const q = [px + nx * r * v + tx * r * 0.32 * w, py + ny * r * v + ty * r * 0.32 * w];
        if (prev) {
          const vm = v - 0.25, wm = Math.sqrt(Math.max(0, 1 - vm * vm));
          const br = Math.max(0, nx * vm * LIGHT[0] + ny * vm * LIGHT[1] + wm * LIGHT[2]);
          const b = Math.min(4, Math.floor(br * 5));
          buckets[b].moveTo(prev[0], prev[1]); buckets[b].lineTo(q[0], q[1]);
        }
        prev = q;
      }
    }
    if (tn.rim) { Ls.forEach((p, j) => (j ? rims.lineTo(p[0], p[1]) : rims.moveTo(p[0], p[1]))); }
  }

  function drawShoggoth(ctx, t, C, rot, s, lenK = 1) {
    const buckets = [0, 1, 2, 3, 4].map(() => new Path2D());
    const rims = new Path2D();
    const flush = () => {
      ctx.save();
      ctx.lineWidth = 1.1;
      buckets.forEach((b, i) => { ctx.strokeStyle = `rgba(238,233,224,${0.14 + i * 0.2})`; ctx.stroke(b); });
      ctx.strokeStyle = 'rgba(255,110,40,0.45)'; ctx.lineWidth = 2; ctx.stroke(rims);
      ctx.restore();
      buckets.forEach((b, i) => { buckets[i] = new Path2D(); });
    };
    const back = SHOG.T.filter(x => x.depth < 0.5), front = SHOG.T.filter(x => x.depth >= 0.5);
    back.forEach(tn => tube(ctx, tn, C, rot, s, t, buckets, rims, lenK));
    flush();
    // body mass with contour rings
    ctx.save();
    ctx.translate(C[0], C[1]); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = '#0d0c0b'; ctx.beginPath(); ctx.ellipse(0, -40, 230, 175, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(230,224,214,0.5)'; ctx.lineWidth = 1.1 / s;
    ctx.beginPath();
    for (let k = 1; k < 30; k++) {
      const rr = k / 30;
      for (let i = 0; i <= 60; i++) {
        const a = i / 60 * TAU, w = 1 + 0.12 * noise2(Math.cos(a) * 2 + k * 0.2, Math.sin(a) * 2 + t * 0.3);
        const px = Math.cos(a) * 225 * rr * w, py = -40 + Math.sin(a) * 170 * rr * w;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
    }
    ctx.stroke();
    // bulbs
    SHOG.B.forEach(([bx, by, br], i) => {
      const ox = bx + noise1(i * 5 + t * 0.6) * 8, oy = by + noise1(i * 7 + t * 0.6) * 6;
      ctx.save();
      ctx.fillStyle = '#0e0d0c'; ctx.beginPath(); ctx.arc(ox, oy, br, 0, TAU); ctx.fill();
      ctx.clip();
      for (let k = -14; k <= 14; k++) {
        const yy = oy + k * br / 14.5, hw = Math.sqrt(Math.max(0, 1 - (k / 14.5) ** 2)) * br;
        const lit = 0.2 + 0.7 * clamp(0.6 - k / 20);
        ctx.strokeStyle = `rgba(236,230,220,${lit})`; ctx.lineWidth = 1.2 / s;
        ctx.beginPath(); ctx.ellipse(ox, yy, hw, hw * 0.28, 0.3, 0, Math.PI); ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = 'rgba(255,245,235,0.5)'; ctx.beginPath(); ctx.arc(ox - br * 0.35, oy - br * 0.4, br * 0.08, 0, TAU); ctx.fill();
    });
    ctx.restore();
    front.forEach(tn => tube(ctx, tn, C, rot, s, t, buckets, rims, lenK));
    flush();
    halo(ctx, C[0] + 80 * s, C[1] - 60 * s, 260 * s, '255,100,30', 0.12);
  }

  const S10 = {
    name: 'Smiley mask · SHOGGOTH’S LIES',
    start: F(899), end: F(1004),
    draw(ctx, t) {
      const lt = t - F(899);
      const bg = ctx.createRadialGradient(960, 520, 100, 960, 540, 1300);
      bg.addColorStop(0, '#16120f'); bg.addColorStop(1, '#070605');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      const C = [860 + lt * 14, 540 + Math.sin(lt * 0.8) * 10];
      const rot = -0.15 + lt * 0.05, s = 1.35 + lt * 0.04;

      // mask path: big → scanned → revealed → shrinks into the HUD box
      const mx = kf(t, [[F(899), 948], [31.0, 960], [31.3, 1300, E.inOutSine], [31.45, 1632, E.inOutCubic], [32.0, 1670, E.outQuad], [33.0, 1680]]);
      const my = kf(t, [[F(899), 552], [31.0, 560], [31.3, 450, E.inOutSine], [31.45, 348, E.inOutCubic], [32.0, 240, E.outQuad], [33.0, 228]]);
      const mr = kf(t, [[F(899), 564], [31.0, 560], [31.3, 400, E.inOutSine], [31.45, 204, E.inOutCubic], [32.0, 130, E.outQuad], [33.0, 120]]);
      const L = kf(t, [[30.55, 0], [30.83, 880, E.inQuad], [31.17, 1620, E.linear], [31.3, 2100, E.linear]]);
      const S = kf(t, [[30.05, 2050], [30.52, -200, E.inOutSine]]);
      const scanning = t > 30.05 && t < 30.52;
      drawShoggoth(ctx, t, C, rot, s);
      // SHROOMS echo right after the cut

      // mask (clipped by the reveal line and the x-ray scanner band)
      ctx.save();
      if (t < 31.3) { ctx.beginPath(); ctx.rect(L, 0, W - L, H); ctx.clip(); }
      if (scanning) { ctx.beginPath(); ctx.rect(0, 0, Math.max(0, S - 170), H); ctx.rect(S + 170, 0, W, H); ctx.clip(); }
      smiley(ctx, mx, my, mr, mr > 300 ? 1 : 0.9, t);
      ctx.restore();
      if (scanning) {
        ctx.save(); ctx.beginPath(); ctx.rect(S - 170, 0, 340, H); ctx.clip();
        ctx.globalAlpha = 0.18; smiley(ctx, mx, my, mr, 0, t);
        ctx.restore();
        ctx.fillStyle = COL.orange; ctx.fillRect(S + 168, 0, 4, H);
        ctx.fillStyle = 'rgba(255,106,31,0.5)'; ctx.fillRect(S - 172, 0, 2, H);
      }
      if (L > 0 && L < W + 20) {
        ctx.fillStyle = COL.orange; ctx.shadowColor = OG; ctx.shadowBlur = 14;
        ctx.fillRect(L - 2, 0, 4, H); ctx.shadowBlur = 0;
      }
      // HUD box around the small mask
      const hb = prog(t, 31.85, 32.0);
      if (hb > 0) {
        ctx.save(); ctx.globalAlpha = hb;
        ctx.strokeStyle = 'rgba(243,238,230,0.45)'; ctx.lineWidth = 1.3;
        ctx.strokeRect(1500, 46, 365, 350);
        ctx.fillStyle = COL.orange; ctx.fillRect(1500, 34, 120, 12);
        font(ctx, 600, 9, FONT.mono); ctx.fillStyle = '#1a0d05'; ctx.fillText('SUBJECT · MASK', 1504, 43);
        font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.55)';
        ctx.fillText('FRIENDLY · HELPFUL · FINE', 1500, 416);
        ctx.restore();
      }
      // top-left HUD
      font(ctx, 600, 12, FONT.mono); ctx.fillStyle = COL.orange; ctx.fillText('◢◤ · 0000', 52, 52);
      font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.45)'; ctx.fillText('SEE-THROUGH MODE', 52, 72);

      // SHOGGOTH'S LIES,
      if (t >= 30.6) {
        const px = kf(t, [[30.6, 84], [31.0, 120], [31.17, 270, E.inOutSine], [31.45, 422, E.inOutCubic], [33.3, 700, E.linear]]);
        const py = kf(t, [[30.6, 760], [31.0, 760], [31.17, 660, E.inOutSine], [31.45, 684, E.inOutCubic], [33.3, 572, E.linear]]);
        const sc = kf(t, [[30.6, 1.5], [31.0, 1.5], [31.17, 1.24, E.inOutSine], [31.45, 0.8, E.inOutCubic], [33.3, 0.76, E.linear]]);
        ctx.save();
        ctx.translate(px, py); ctx.rotate(-0.04); ctx.transform(1, 0.04, -0.1, 1, 0, 0); ctx.scale(sc, sc);
        font(ctx, 900, 120, FONT.wide, 'expanded');
        const word = 'SHOGGOTH’S';
        const nShow = Math.floor(clamp((t - 30.6) * 22, 0, word.length));
        const white = t >= 31.32;
        ctx.fillStyle = white ? '#efe9df' : '#ff7a2c';
        ctx.shadowColor = white ? 'rgba(0,0,0,0.6)' : 'rgba(255,100,30,0.85)'; ctx.shadowBlur = 26;
        ctx.fillText(word.slice(0, nShow), 0, 0);
        if (t >= 31.1) {
          font(ctx, 900, 150, FONT.wide, 'expanded');
          ctx.fillStyle = '#ff7a2c'; ctx.shadowColor = 'rgba(255,100,30,0.85)';
          ctx.globalAlpha = prog(t, 31.1, 31.16);
          ctx.save(); ctx.translate(40, 200); ctx.scale(0.9, 1.35);
          ctx.fillText('LIES,', 0, 0);
          ctx.restore();
        }
        ctx.restore();
      }
    },
  };

  window.SHARED = Object.assign(window.SHARED || {}, { drawShoggoth, smiley, SHOG, makeHook, pdoomWord, rollDigit, drawRings });
  Timeline.add(S6, S7, S8, S9, S10);
})();
