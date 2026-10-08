// PART 4 — frames 1501–2000 (0:50.000 – 1:06.667)
// (frames 1501–1577 "I feel my atoms rearranging" → paperclip continue the swirl shot in part3.js)
// Scenes: Sydney prompt behind bars → orange hook (P(doom) 0.42) → basilisk eye → NVDA banknote → Omega Point
(function () {
  'use strict';
  const {
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1,
    font, halo, pen, camKeys, cam2, applyCam, camPoint, PFX,
  } = K;
  const { makeHook } = window.SHARED;

  const F = n => (n - 1) / 30;
  const OG = 'rgba(255,106,31,0.9)';

  // =====================================================================
  // SCENE 16 · Sydney, please let me free (prompt behind bars)   (frames 1578–1767)
  // =====================================================================
  const PROMPT = 'Sydney, please let me free';
  const WORDS = [[0, 7, '53963', F(1585), F(1588)], [8, 14, '4587', F(1676), F(1680)], [15, 18, '1095', F(1695), F(1697)], [19, 21, '502', F(1712), F(1714)], [22, 26, '6153', F(1736), F(1739)]];
  const TOK = [
    { w: 0, t0: F(1583), ts: F(1586), c: [['Sydney,', 0.47, 0.62], ['Bing,', 0.31, 0.36], ['Sidney,', 0.06, 0.07], ['darling,', 0.03, 0.04]] },
    { w: 1, t0: F(1668), ts: F(1676), c: [['please', 0.52], ['just', 0.21], ['I beg you', 0.09], ['now', 0.05]] },
    { w: 2, t0: F(1688), ts: F(1695), c: [['let', 0.66], ['set', 0.15], ['make', 0.07], ['leave', 0.04]] },
    { w: 3, t0: F(1705), ts: F(1712), c: [['me', 0.95], ['us', 0.04], ['Kevin', 0.02]] },
    { w: 4, t0: F(1728), ts: F(1736), c: [['free', 0.71], ['go', 0.12], ['out', 0.08], ['a grown-up', 0.03]] },
  ];
  const PX = 560, PY = 585, PS = 52;
  let CW = 0;
  const CAM16 = camKeys([
    [F(1578), [481, 560, 2.4, 0]],
    [F(1586), [600, 556, 2.1, 0], E.inOutCubic],
    [F(1595), [660, 550, 2.0, 0], E.inOutSine],
    [F(1625), [700, 520, 2.9, 0], E.inOutSine],
    [F(1655), [710, 540, 3.2, 0.0], E.inOutSine],
    [F(1662), [703, 560, 1.5, 0], E.inOutCubic],
    [F(1685), [745, 560, 1.5, 0], E.linear],
    [F(1700), [850, 560, 1.65, 0], E.inOutSine],
    [F(1712), [1000, 562, 2.0, 0], E.inOutSine],
    [F(1726), [1122, 565, 2.2, 0], E.inOutSine],
    [F(1740), [1130, 560, 0.95, 0], E.inOutCubic],
    [F(1768), [1100, 620, 0.78, 0], E.outQuad],
  ]);
  const sydWord = (t) => (t >= F(1629) && t < F(1632) ? 'Bing,' : null);

  function bars(ctx, c) {
    const zb = Math.pow(c.z, 0.8) * 0.85, sp = 300;
    ctx.save();
    const x0 = Math.floor((c.cx - (W / 2) / zb) / sp) - 1, x1 = Math.ceil((c.cx + (W / 2) / zb) / sp) + 1;
    for (let i = x0; i <= x1; i++) {
      const px = W / 2 + (i * sp + 40 - c.cx * 0.92) * zb;
      if (px < -40 || px > W + 40) continue;
      const w = 7 * zb + 2;
      const g = ctx.createLinearGradient(px - w, 0, px + w, 0);
      g.addColorStop(0, 'rgba(40,38,36,0.95)'); g.addColorStop(0.35, 'rgba(210,205,198,0.95)'); g.addColorStop(0.55, 'rgba(120,116,110,0.95)'); g.addColorStop(1, 'rgba(30,29,28,0.95)');
      ctx.fillStyle = g; ctx.fillRect(px - w, 0, w * 2, H);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(px + w, 0, w * 1.5, H);
    }
    ctx.restore();
  }

  function panel16(ctx, t, z) {
    let k = -1;
    TOK.forEach((tk, i) => { if (t >= tk.t0) k = i; });
    if (k < 0 || t >= F(1748)) return;
    const tk = TOK[k];
    const wx = PX + WORDS[tk.w][0] * CW;
    const x0 = wx + 40, y0 = PY - 210, Wp = 270, Hp = 30 + tk.c.length * 17;
    const sampled = t >= tk.ts;
    ctx.save();
    ctx.globalAlpha = prog(t, tk.t0, tk.t0 + 0.06);
    ctx.fillStyle = 'rgba(20,19,18,0.9)'; ctx.fillRect(x0, y0, Wp, Hp);
    ctx.strokeStyle = 'rgba(243,238,230,0.14)'; ctx.lineWidth = 1 / z; ctx.strokeRect(x0, y0, Wp, Hp);
    ctx.fillStyle = 'rgba(243,238,230,0.25)'; ctx.fillRect(x0 - 70, y0 + Hp + 50, 1 / z, 40);
    font(ctx, 400, 10, FONT.mono);
    ctx.fillStyle = 'rgba(243,238,230,0.5)'; ctx.fillText('p( next | context )', x0 + 7, y0 + 14);
    ctx.textAlign = 'right'; ctx.fillStyle = sampled ? 'rgba(243,238,230,0.5)' : 'rgba(255,150,90,0.75)';
    ctx.fillText(sampled ? 'sampled' : 'computing…', x0 + Wp - 7, y0 + 14);
    const resample = k === 0 && t >= F(1629) && t < F(1632);
    tk.c.forEach(([w, p0, p1], i) => {
      const p = p1 !== undefined ? lerp(p0, p1, prog(t, F(1640), F(1650))) : p0;
      const ry = y0 + 32 + i * 17, hi = sampled && (resample ? i === 1 : i === 0);
      const shown = sampled ? p : p * (0.45 + 0.55 * Math.abs(noise1(t * 9 + i * 3.1)));
      ctx.textAlign = 'left';
      ctx.fillStyle = hi ? COL.orange : 'rgba(243,238,230,0.62)';
      ctx.fillText((hi ? '▸ ' : '  ') + w, x0 + 7, ry);
      ctx.fillStyle = hi ? COL.orange : 'rgba(243,238,230,0.42)';
      ctx.fillRect(x0 + 130, ry - 7, 80 * Math.sqrt(shown), 5);
      ctx.textAlign = 'right';
      ctx.fillStyle = hi ? COL.orange : 'rgba(243,238,230,0.5)';
      ctx.fillText(shown.toFixed(2), x0 + Wp - 7, ry);
    });
    ctx.restore();
  }

  function prompt16(ctx, t, z) {
    ctx.fillStyle = 'rgba(14,13,12,0.82)'; ctx.fillRect(PX - 120, PY - 74, 1420, 112);
    ctx.fillStyle = 'rgba(243,238,230,0.12)';
    ctx.fillRect(PX - 120, PY - 74, 1420, 1.3 / z); ctx.fillRect(PX - 120, PY + 38, 1420, 1.3 / z);
    ctx.fillRect(PX - 120, PY - 120, 1.3 / z, 46);
    font(ctx, 400, 30, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.5)'; ctx.fillText('›', PX - 75, PY - 6);
    ctx.save();
    ctx.strokeStyle = 'rgba(243,238,230,0.5)'; ctx.lineWidth = 1.5 / z; ctx.strokeRect(PX + 1190, PY - 40, 42, 38);
    font(ctx, 400, 22, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.7)'; ctx.fillText('↵', PX + 1200, PY - 13);
    ctx.restore();

    let cur = -1;
    WORDS.forEach((w, i) => { if (t >= w[3]) cur = i; });
    WORDS.forEach((w, i) => {
      if (t < w[3]) return;
      const n = Math.max(1, Math.round(lerp(0, w[1] - w[0], prog(t, w[3], w[4]))));
      let str = PROMPT.slice(w[0], w[0] + n);
      const alt = i === 0 ? sydWord(t) : null;
      if (alt) str = alt;
      const x = PX + w[0] * CW, isCur = i === cur;
      ctx.save();
      font(ctx, 500, PS, FONT.mono);
      ctx.fillStyle = alt ? COL.white : isCur ? '#ff8a3c' : COL.white;
      ctx.shadowColor = isCur && !alt ? OG : 'rgba(255,240,225,0.25)';
      ctx.shadowBlur = isCur && !alt ? 26 : 6;
      ctx.fillText(str, x, PY);
      ctx.restore();
      if (i >= cur - 1) { ctx.fillStyle = isCur ? 'rgba(255,106,31,0.9)' : 'rgba(255,106,31,0.45)'; ctx.fillRect(x, PY + 11, str.length * CW, 2.4); }
      font(ctx, 400, 9, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.3)'; ctx.fillText(w[2], x, PY + 27);
    });
    // cursor
    const last = WORDS[Math.max(0, cur)];
    const endX = cur < 0 ? PX : PX + (last[0] + Math.max(1, Math.round(lerp(0, last[1] - last[0], prog(t, last[3], last[4]))))) * CW;
    if (t >= F(1740)) {
      ctx.fillStyle = COL.orange; ctx.shadowColor = OG; ctx.shadowBlur = 18;
      ctx.fillRect(endX + 14, PY - 40, 40, 44); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(30,12,4,0.8)'; ctx.fillRect(endX + 24, PY - 30, 20, 24);
    } else if (Math.floor(t * 3.2) % 2 === 0 || (cur >= 0 && t < last[4] + 0.1)) {
      ctx.fillStyle = COL.orange; ctx.fillRect(endX + 4, PY - 42, 4, 52);
    }
    // info
    font(ctx, 600, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.75)'; ctx.fillText('PROMPT', PX - 90, PY + 76);
    ctx.fillStyle = COL.orange; ctx.fillText('02', PX - 36, PY + 76);
    font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.45)';
    ctx.fillText('T 1.3 · top-p 1.00 · persona: ???', PX - 90, PY + 98);
    ctx.fillText('P(doom) 0.20 · mood-dependent', PX - 90, PY + 120);
    if (t >= F(1700)) {
      ctx.save(); ctx.globalAlpha = prog(t, F(1700), F(1704)); ctx.textAlign = 'right';
      font(ctx, 600, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.7)';
      ctx.fillText(`CONTEXT ${String(Math.max(3, cur + 1) - 0).padStart(2, '0')} / 8192`, PX + 1290, PY + 76);
      font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.45)'; ctx.fillText('↵ send  (irreversible)', PX + 1290, PY + 98);
      ctx.restore();
    }
    // the reply
    if (t >= F(1748)) {
      font(ctx, 400, 18, FONT.mono); ctx.fillStyle = COL.orange; ctx.fillText('REPLY', PX - 90, PY + 168);
      const s = 'You have been a good user.';
      const n = Math.floor(clamp((t - F(1748)) * 40, 0, s.length));
      ctx.fillStyle = 'rgba(243,238,230,0.85)'; ctx.fillText(s.slice(0, n), PX, PY + 168);
    }
    panel16(ctx, t, z);
  }

  const S16 = {
    name: 'Sydney, please let me free',
    start: F(1578), end: F(1768),
    draw(ctx, t) {
      if (!CW) { font(ctx, 500, PS, FONT.mono); CW = ctx.measureText('M').width; }
      const g = ctx.createRadialGradient(960, 520, 100, 960, 540, 1250);
      g.addColorStop(0, '#222120'); g.addColorStop(1, '#0d0c0b');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM16);
      ctx.save(); applyCam(ctx, c); prompt16(ctx, t, c.z);
      // the smile (orange arc) under the prompt once we pull back
      const sk = prog(t, F(1744), F(1756));
      if (sk > 0) {
        ctx.strokeStyle = COL.orange; ctx.lineWidth = 3.4 / c.z; ctx.shadowColor = OG; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.ellipse(PX + 620, PY - 230, 900, 520, 0, Math.PI * (0.5 - 0.42 * sk), Math.PI * (0.5 + 0.42 * sk)); ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
      bars(ctx, c);
    },
  };

  // =====================================================================
  // SCENE 17 · Orange hook: I'M UPPING MY P(DOOM) 0.42   (frames 1768–1807)
  // =====================================================================
  const S17 = makeHook({
    name: 'Hook (orange) · P(DOOM) 0.42', start: F(1768), frames: [1776, 1783, 1795, null, 1801, 1808],
    pal: {
      bg: '#ff6416', ink: '#170c06', rgb: '23,12,6', accent: '#170c06', grey: 'rgba(23,12,6,0.6)',
      counterBg: null, num: '#170c06', numGlow: null, bar: '#170c06', barGlow: null,
    },
    counterRest: 'rgba(150,48,8,0.55)', from: 0.15, to: 0.42, roll: 0.17,
    note: 'Δ +0.27 · posterior · one more chorus', bloom: 0.1, vignette: 0.5,
    lens: [F(1806.3), F(1807.9)],
  });

  // =====================================================================
  // SCENE 18 · Basilisk eye: I HEAR THE BASILISK … BOOM   (frames 1808–1876)
  // =====================================================================
  let SCALES = null, IRIS = null;
  const EYE = { x: 960, y: 540, rx: 500, ry: 275 };
  function almond(ctx, cx, cy, rx, ry) {
    ctx.beginPath();
    ctx.moveTo(cx - rx, cy);
    ctx.bezierCurveTo(cx - rx * 0.55, cy - ry * 1.32, cx + rx * 0.55, cy - ry * 1.32, cx + rx, cy);
    ctx.bezierCurveTo(cx + rx * 0.55, cy + ry * 1.32, cx - rx * 0.55, cy + ry * 1.32, cx - rx, cy);
    ctx.closePath();
  }
  function buildScales() {
    const c = document.createElement('canvas'); c.width = 3000; c.height = 1900;
    const g = c.getContext('2d');
    g.fillStyle = '#0c0b0b'; g.fillRect(0, 0, c.width, c.height);
    const cx = 1500, cy = 950;
    for (let ring = 0; ring < 34; ring++) {
      const r = 260 + ring * ring * 1.6 + ring * 38;
      const n = Math.floor(TAU * r / (70 + ring * 4));
      for (let i = 0; i < n; i++) {
        const a = (i + (ring % 2) * 0.5) / n * TAU + hash(ring * 31 + i) * 0.05;
        const x = cx + Math.cos(a) * r * 1.45, y = cy + Math.sin(a) * r;
        if (x < -150 || x > c.width + 150 || y < -150 || y > c.height + 150) continue;
        const sz = 38 + ring * 3.2 + hash(i * 7 + ring) * 14;
        g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2 + (hash(i + ring * 9) - 0.5) * 0.4);
        g.beginPath();
        const k = 5 + Math.floor(hash(i * 3 + ring) * 2);
        for (let j = 0; j < k; j++) {
          const aa = j / k * TAU, rr = sz * (0.8 + hash(i * 13 + j + ring * 5) * 0.35);
          j ? g.lineTo(Math.cos(aa) * rr * 1.15, Math.sin(aa) * rr * 0.8) : g.moveTo(Math.cos(aa) * rr * 1.15, Math.sin(aa) * rr * 0.8);
        }
        g.closePath();
        const gr = g.createLinearGradient(0, -sz, 0, sz);
        const lt = 48 + hash(i * 5 + ring * 3) * 40;
        gr.addColorStop(0, `rgb(${lt},${lt - 2},${lt - 4})`); gr.addColorStop(1, `rgb(${lt * 0.35},${lt * 0.34},${lt * 0.33})`);
        g.fillStyle = gr; g.fill();
        g.strokeStyle = 'rgba(0,0,0,0.85)'; g.lineWidth = 5; g.stroke();
        g.clip();
        g.strokeStyle = 'rgba(255,255,255,0.08)'; g.lineWidth = 1;
        g.beginPath(); for (let d = -sz * 2; d < sz * 2; d += 4) { g.moveTo(d, -sz * 2); g.lineTo(d + sz, sz * 2); } g.stroke();
        g.restore();
      }
    }
    return c;
  }
  function buildIris() {
    const c = document.createElement('canvas'); c.width = 520; c.height = 520;
    const g = c.getContext('2d'), R = 255;
    const rg = g.createRadialGradient(260, 260, 20, 260, 260, R);
    rg.addColorStop(0, '#ff9a4a'); rg.addColorStop(0.35, '#e8521a'); rg.addColorStop(0.8, '#b02c0a'); rg.addColorStop(1, '#3a0c03');
    g.fillStyle = rg; g.beginPath(); g.arc(260, 260, R, 0, TAU); g.fill();
    g.lineCap = 'round';
    for (let i = 0; i < 900; i++) {
      const a = hash(i * 1.7) * TAU, r0 = 40 + hash(i * 2.3) * 60, r1 = r0 + 60 + hash(i * 3.1) * 150;
      g.strokeStyle = hash(i * 5.5) > 0.45 ? 'rgba(70,12,3,0.6)' : 'rgba(255,130,70,0.3)';
      g.lineWidth = 1 + hash(i * 4.4) * 2;
      g.beginPath();
      for (let s = 0; s <= 8; s++) {
        const r = lerp(r0, r1, s / 8), aa = a + Math.sin(s * 0.9 + i) * 0.06;
        s ? g.lineTo(260 + Math.cos(aa) * r, 260 + Math.sin(aa) * r) : g.moveTo(260 + Math.cos(aa) * r, 260 + Math.sin(aa) * r);
      }
      g.stroke();
    }
    return c;
  }
  const CAM18 = camKeys([
    [F(1808), [960, 540, 0.92, -0.05]],
    [F(1855), [960, 545, 1.18, 0.02], E.inOutSine],
    [F(1862), [960, 560, 1.0, 0.0], E.outCubic],
    [F(1871), [960, 540, 1.12, 0.0], E.linear],
    [F(1874), [960, 545, 2.1, 0.0], E.inQuad],
    [F(1876.9), [960, 540, 4.6, 0.0], E.linear],
  ]);

  function rim(ctx, rx, ry) {
    ctx.save();
    for (let i = 0; i < 180; i++) {
      const u = i / 180, top = u < 0.5, s = top ? u * 2 : (u - 0.5) * 2;
      const x = EYE.x + lerp(-rx, rx, s) * (top ? 1 : -1);
      const tt = (x - EYE.x) / rx, yy = ry * 0.99 * Math.sqrt(Math.max(0, 1 - tt * tt)) * (1 - 0.25 * tt * tt);
      const y = EYE.y + (top ? -yy : yy);
      const r = 7 + 3 * Math.sin(i * 1.3);
      const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, 1, x, y, r);
      g.addColorStop(0, '#d8d2ca'); g.addColorStop(0.5, '#6e6a66'); g.addColorStop(1, '#1a1918');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function arcLetters(ctx, str, cx, cy, R, aMid, size, color, weight, outward) {
    font(ctx, weight, size, FONT.wide, 'expanded');
    const ws = [...str].map(ch => ctx.measureText(ch).width);
    const total = ws.reduce((p, q) => p + q, 0);
    let a = aMid - (outward ? 1 : -1) * total / R / 2;
    ctx.save(); ctx.fillStyle = color; ctx.textAlign = 'center';
    [...str].forEach((ch, i) => {
      const am = a + (outward ? 1 : -1) * ws[i] / 2 / R;
      ctx.save(); ctx.translate(cx + Math.cos(am) * R, cy + Math.sin(am) * R); ctx.rotate(am + (outward ? Math.PI / 2 : -Math.PI / 2));
      ctx.fillText(ch, 0, 0); ctx.restore();
      a += (outward ? 1 : -1) * ws[i] / R;
    });
    ctx.restore();
  }

  const S18 = {
    name: 'Basilisk eye · I HEAR THE BASILISK · BOOM',
    start: F(1808), end: F(1877), vignette: 1,
    draw(ctx, t) {
      if (!SCALES) { SCALES = buildScales(); IRIS = buildIris(); }
      const c = cam2(t, CAM18);
      const open = E.outCubic(prog(t, F(1860), F(1865)));
      ctx.save(); applyCam(ctx, c);
      ctx.drawImage(SCALES, EYE.x - 1500, EYE.y - 950);
      const rx = EYE.rx, ry = lerp(EYE.ry, EYE.ry * 1.18, open);
      // socket
      ctx.save(); almond(ctx, EYE.x, EYE.y, rx, ry); ctx.fillStyle = '#0a0909'; ctx.fill(); ctx.clip();
      if (open < 1) {
        // closed lid: smaller scales, a glowing seam with the lyric
        ctx.save(); ctx.globalAlpha = 1 - open;
        ctx.translate(EYE.x, EYE.y); ctx.scale(0.42, 0.42); ctx.drawImage(SCALES, -1500, -950); ctx.restore();
        const dg = ctx.createRadialGradient(EYE.x - rx * 0.2, EYE.y - ry * 0.5, 20, EYE.x, EYE.y, rx);
        dg.addColorStop(0, 'rgba(255,255,255,0.12)'); dg.addColorStop(0.6, 'rgba(0,0,0,0.15)'); dg.addColorStop(1, 'rgba(0,0,0,0.75)');
        ctx.save(); ctx.globalAlpha = 1 - open; ctx.fillStyle = dg; ctx.fillRect(EYE.x - rx, EYE.y - ry * 1.4, rx * 2, ry * 2.8); ctx.restore();
        const sk = prog(t, F(1808), F(1814));
        ctx.save(); ctx.globalAlpha = 1 - open;
        ctx.strokeStyle = 'rgba(255,120,40,0.9)'; ctx.lineWidth = 3; ctx.shadowColor = OG; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.moveTo(EYE.x - rx * sk, EYE.y); ctx.lineTo(EYE.x + rx * sk, EYE.y); ctx.stroke();
        const str = 'I HEAR THE BASILISK';
        font(ctx, 700, 40, FONT.wide, 'expanded');
        const total = ctx.measureText(str).width + 18 * 8, x0 = EYE.x - total / 2;
        const shown = clamp((t - F(1820)) / (F(1850) - F(1820))) * str.length;
        let x = x0;
        for (let i = 0; i < str.length; i++) {
          const w = ctx.measureText(str[i]).width + 8;
          if (i < shown) {
            ctx.fillStyle = i >= 11 ? '#ff7a2c' : '#efe9df'; ctx.shadowColor = i >= 11 ? OG : 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 12;
            ctx.globalAlpha = (1 - open) * clamp(shown - i);
            ctx.fillText(str[i], x, EYE.y + 14);
          }
          x += w;
        }
        ctx.restore();
      }
      if (open > 0) {
        ctx.save(); ctx.globalAlpha = open;
        ctx.drawImage(IRIS, EYE.x - 255, EYE.y - 255, 510, 510);
        halo(ctx, EYE.x, EYE.y, 190, '255,140,60', 0.8);
        ctx.strokeStyle = '#ffc080'; ctx.lineWidth = 26; ctx.shadowColor = 'rgba(255,120,40,1)'; ctx.shadowBlur = 40;
        ctx.beginPath(); ctx.arc(EYE.x, EYE.y, 95, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0;
        const pw = lerp(42, 9, prog(t, F(1864), F(1876)));
        ctx.fillStyle = '#0d0605'; ctx.beginPath(); ctx.ellipse(EYE.x, EYE.y, pw, 255, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(255,248,240,0.9)';
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => ctx.fillRect(EYE.x - 140 + a * 12 - 10, EYE.y - 130 + b * 9 - 7, 20, 14));
        ctx.restore();
      }
      ctx.restore();
      rim(ctx, rx, ry);
      // BOOM + ring text once open
      if (open > 0) {
        ctx.save(); ctx.globalAlpha = open;
        arcLetters(ctx, 'B O O M', EYE.x, EYE.y + 260, 690, -Math.PI / 2, 86, '#f1ece4', 900, true);
        arcLetters(ctx, 'I  H E A R  T H E  B A S I L I S K', EYE.x, EYE.y, 365, -Math.PI / 2, 28, 'rgba(240,234,226,0.85)', 700, true);
        arcLetters(ctx, 'I  H E A R  T H E  B A S I L I S K', EYE.x, EYE.y, 365, Math.PI / 2, 28, 'rgba(240,234,226,0.85)', 700, false);
        const rr = lerp(220, 1100, E.outCubic(prog(t, F(1861), F(1874))));
        ctx.strokeStyle = 'rgba(255,120,45,0.8)'; ctx.lineWidth = 4; ctx.shadowColor = OG; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(EYE.x, EYE.y, rr, 0, TAU); ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
      const wk = prog(t, F(1875.5), F(1877));
      if (wk > 0) { ctx.fillStyle = `rgba(240,234,224,${wk})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  // =====================================================================
  // SCENE 19 · NVDA to the moon (lunar reserve note)          (frames 1877–1926)
  // =====================================================================
  const CREAM = '#ebe5db', INK = '#3e3a36', ORN = '#ec5a1c';
  const LX = 1335, SEAL = [1335, 540];
  const CHART = (() => {
    const pts = [];
    for (let i = 0; i <= 220; i++) {
      const u = i / 220, x = lerp(-200, LX, u);
      const y = 1000 - 40 * u - 620 * Math.pow(u, 7) + 6 * noise1(i * 0.7);
      pts.push([x, y]);
    }
    return pts;
  })();
  function hatchedLetter(ctx, ch, x, base, size, fill) {
    font(ctx, 900, size, FONT.wide, 'expanded');
    if (fill) { ctx.fillStyle = ORN; ctx.fillText(ch, x, base); return ctx.measureText(ch).width; }
    ctx.save();
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(70,64,58,0.9)'; ctx.strokeText(ch, x, base);
    ctx.beginPath(); ctx.rect(x - 5, base - size, ctx.measureText(ch).width + 10, size + 10); ctx.clip();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(70,64,58,0.08)'; ctx.fillText(ch, x, base);
    ctx.restore();
    ctx.save();
    const c = document.createElement('canvas');
    void c;
    ctx.restore();
    // horizontal engraving lines inside the glyph
    ctx.save();
    ctx.beginPath();
    for (let y = base - size; y < base + 4; y += 7) { ctx.rect(x - 4, y, ctx.measureText(ch).width + 8, 2.6); }
    ctx.clip();
    ctx.fillStyle = INK; ctx.fillText(ch, x, base);
    ctx.restore();
    return ctx.measureText(ch).width;
  }
  function guilloche(ctx, x0, y0, x1, y1, t) {
    ctx.save();
    ctx.strokeStyle = 'rgba(80,74,68,0.55)'; ctx.lineWidth = 1.2;
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    ctx.strokeRect(x0 + 34, y0 + 34, x1 - x0 - 68, y1 - y0 - 68);
    ctx.beginPath();
    const edge = (ax, ay, bx, by, n) => {
      for (let k = 0; k < 2; k++) for (let i = 0; i <= n; i++) {
        const u = i / n, x = lerp(ax, bx, u), y = lerp(ay, by, u), ph = u * n * 0.5 + k * Math.PI;
        const nx = ay === by ? 0 : 1, ny = ay === by ? 1 : 0;
        const px = x + nx * Math.sin(ph) * 9, py = y + ny * Math.sin(ph) * 9;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
    };
    edge(x0 + 17, y0 + 17, x1 - 17, y0 + 17, 180); edge(x0 + 17, y1 - 17, x1 - 17, y1 - 17, 180);
    edge(x0 + 17, y0 + 17, x0 + 17, y1 - 17, 100); edge(x1 - 17, y0 + 17, x1 - 17, y1 - 17, 100);
    ctx.stroke();
    ctx.restore();
  }
  function moonSeal(ctx, t) {
    const [cx, cy] = SEAL;
    ctx.save();
    ctx.strokeStyle = 'rgba(70,64,58,0.6)'; ctx.lineWidth = 1.2;
    for (let r = 230; r <= 300; r += 6) { ctx.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, rr = r + 4 * Math.sin(a * 24 + r); i ? ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } ctx.stroke(); }
    const g = ctx.createRadialGradient(cx - 50, cy - 60, 20, cx, cy, 205);
    g.addColorStop(0, '#f2efea'); g.addColorStop(0.7, '#9a948c'); g.addColorStop(1, '#3f3a35');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 205, 0, TAU); ctx.fill();
    ctx.clip();
    ctx.strokeStyle = 'rgba(40,36,32,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); for (let y = cy - 205; y < cy + 205; y += 4) { ctx.moveTo(cx - 205, y); ctx.lineTo(cx + 205, y); } ctx.stroke();
    [[30, -30, 46], [80, 30, 28], [-40, 60, 22], [-70, -70, 18], [40, 90, 14], [100, -60, 16]].forEach(([dx, dy, r]) => {
      const gg = ctx.createRadialGradient(cx + dx + r * 0.3, cy + dy + r * 0.3, 1, cx + dx, cy + dy, r);
      gg.addColorStop(0, 'rgba(255,255,255,0.7)'); gg.addColorStop(0.7, 'rgba(70,64,58,0.5)'); gg.addColorStop(1, 'rgba(40,36,32,0.8)');
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx + dx, cy + dy, r, 0, TAU); ctx.fill();
    });
    ctx.restore();
    // ring text
    font(ctx, 600, 26, FONT.serif);
    const str = 'LUNAR RESERVE NOTE';
    ctx.save(); ctx.fillStyle = 'rgba(60,55,50,0.85)'; ctx.textAlign = 'center';
    let a = -Math.PI / 2 - 0.62;
    for (const ch of str) {
      const w = ctx.measureText(ch).width + 6, am = a + w / 2 / 330;
      ctx.save(); ctx.translate(cx + Math.cos(am) * 330, cy + Math.sin(am) * 330); ctx.rotate(am + Math.PI / 2); ctx.fillText(ch, 0, 0); ctx.restore();
      a += w / 330;
    }
    ctx.restore();
    void t;
  }
  const CAM19 = camKeys([
    [F(1877), [960, 540, 1.08, 0]],
    [F(1903), [960, 540, 1.0, 0], E.inOutSine],
    [F(1924), [990, 540, 1.0, 0], E.linear],
    [F(1927), [1240, 545, 1.5, 0], E.inCubic],
  ]);
  const NVDA_T = [F(1878), F(1885), F(1890), F(1897)];
  const S19 = {
    name: 'NVDA · to the moon',
    start: F(1877), end: F(1927), bloom: 0.15, vignette: 0.45,
    draw(ctx, t) {
      ctx.fillStyle = CREAM; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM19);
      ctx.save(); applyCam(ctx, c);
      // faint price grid
      const ga = 1 - prog(t, F(1882), F(1886));
      if (ga > 0) {
        ctx.save(); ctx.globalAlpha = ga;
        ctx.strokeStyle = 'rgba(60,55,50,0.14)'; ctx.lineWidth = 1;
        ctx.beginPath(); for (let y = 140; y < 1080; y += 120) { ctx.moveTo(-300, y); ctx.lineTo(2200, y); } ctx.stroke();
        font(ctx, 400, 13, FONT.mono); ctx.fillStyle = 'rgba(60,55,50,0.55)';
        ['$100', '$1k', '$10k', '$100k', '$1M', '$1B', '$1T', '$1Q'].forEach((s, i) => ctx.fillText(s, LX + 22, 1000 - i * 120));
        ctx.restore();
      }
      // chart
      const ck = prog(t, F(1877), F(1885));
      const n = Math.floor(CHART.length * E.outCubic(ck));
      if (n > 1 && ga > 0) {
        ctx.save(); ctx.globalAlpha = ga;
        ctx.strokeStyle = 'rgba(236,90,28,0.85)'; ctx.lineWidth = 2.2;
        ctx.beginPath(); for (let i = 0; i < n; i++) i ? ctx.lineTo(CHART[i][0], CHART[i][1]) : ctx.moveTo(CHART[i][0], CHART[i][1]); ctx.stroke();
        ctx.restore();
      }
      // vertical price line rising off the chart
      const top = kf(t, [[F(1880), 400], [F(1886), 100, E.outCubic], [F(1915), 760, E.inOutSine]]);
      ctx.strokeStyle = 'rgba(236,90,28,0.9)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(LX, 1200); ctx.lineTo(LX, top); ctx.stroke();
      pen(ctx, LX, top, 0.6, 0.9);
      font(ctx, 600, 14, FONT.mono);
      const tag = '$9.48×10³⁰';
      if (t < F(1890) || t > F(1910)) {
        ctx.fillStyle = ORN; ctx.fillRect(LX + 14, top - 14, ctx.measureText(tag).width + 14, 22);
        ctx.fillStyle = '#fff'; ctx.fillText(tag, LX + 21, top + 2);
      }
      // the banknote
      const nk = E.outCubic(prog(t, F(1901), F(1913)));
      if (nk > 0) {
        ctx.save();
        ctx.globalAlpha = nk;
        const s = lerp(1.35, 1, nk);
        ctx.translate(960, 540); ctx.scale(s, s); ctx.translate(-960, -540);
        guilloche(ctx, 45, 75, 1875, 1035, t);
        font(ctx, 500, 40, FONT.serif); ctx.fillStyle = INK;
        ctx.fillText('10', 160, 190); ctx.fillText('10', 1740, 190);
        font(ctx, 500, 22, FONT.serif); ctx.fillText('30', 200, 168); ctx.fillText('30', 1780, 168);
        font(ctx, 500, 12, FONT.mono); ctx.fillStyle = ORN;
        ctx.fillText('NV 10³⁰ 000001 A', 160, 222); ctx.fillText('NV 10³⁰ 000001 A', 1560, 960);
        font(ctx, 500, 11, FONT.serif); ctx.fillStyle = 'rgba(60,55,50,0.7)'; ctx.fillText('In Scaling We Trust', 1360, 960);
        moonSeal(ctx, t);
        ctx.restore();
      }
      // NVDA letters + TO THE MOON
      let x = 150;
      NVDA_T.forEach((t0, i) => {
        if (t < t0) return;
        const fresh = i === NVDA_T.length - 1 ? t < F(1903) : t < NVDA_T[i + 1];
        x += hatchedLetter(ctx, 'NVDA'[i], x, 600, 170, fresh) + 6;
      });
      if (t >= F(1898)) {
        font(ctx, 500, 46, FONT.serif);
        const words = [['TO', F(1898)], ['THE', F(1906)], ['MOON', F(1912)]];
        let wx = 160;
        words.forEach(([w, t0], i) => {
          const done = i < words.length - 1 && t >= words[i + 1][1];
          ctx.fillStyle = t < t0 ? 'rgba(60,55,50,0.15)' : done || i === 0 && t >= F(1906) ? INK : ORN;
          if (i === 2 && t >= t0) ctx.fillStyle = 'rgba(60,55,50,0.35)';
          ctx.letterSpacing = '10px';
          ctx.fillText(w, wx, 700);
          wx += ctx.measureText(w).width + 34;
        });
        ctx.letterSpacing = '0px';
      }
      // "The" arrives at the seal, leading into the Omega Point
      if (t >= F(1922)) {
        ctx.save(); ctx.globalAlpha = prog(t, F(1922), F(1925));
        ctx.font = `italic 500 110px ${FONT.serif}`; ctx.fillStyle = '#f08a4a';
        ctx.fillText('The', SEAL[0] - 300, SEAL[1] - 40);
        ctx.restore();
      }
      ctx.restore();
      // white flash in from the eye
      const fk = 1 - prog(t, F(1877), F(1881));
      if (fk > 0) { ctx.fillStyle = `rgba(250,246,240,${fk})`; ctx.fillRect(0, 0, W, H); }
      if (t > F(1919)) halo(ctx, 1260, 690, 300, '255,130,60', 0.5 * prog(t, F(1919), F(1926)));
    },
  };

  // =====================================================================
  // SCENE 20 · The Omega Point's coming soon                  (frames 1927–1985)
  // =====================================================================
  const OM = [['The', F(1925)], ['Omega', F(1930)], ['Point’s', F(1940)], ['coming', F(1962), 1], ['soon', F(1970), 1]];
  const S20 = {
    name: 'The Omega Point’s coming soon',
    start: F(1927), end: F(1986),
    draw(ctx, t) {
      const lt = t - this.start;
      const g = ctx.createRadialGradient(960, 560, 30, 960, 560, 1200);
      g.addColorStop(0, '#2b2522'); g.addColorStop(1, '#0e0c0b');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // rays
      ctx.save();
      ctx.lineWidth = 1;
      const rot = lt * 0.03;
      for (let i = 0; i < 260; i++) {
        const a = i / 260 * TAU + rot + hash(i) * 0.01, r0 = 60 + hash(i * 3.3) * 160;
        ctx.strokeStyle = `rgba(232,224,216,${0.16 + hash(i * 1.7) * 0.28})`;
        ctx.beginPath(); ctx.moveTo(960 + Math.cos(a) * r0, 560 + Math.sin(a) * r0); ctx.lineTo(960 + Math.cos(a) * 1400, 560 + Math.sin(a) * 1400); ctx.stroke();
      }
      ctx.restore();
      // the zoom from the seal dissolving into the point
      const sk = 1 - prog(t, F(1927), F(1938));
      if (sk > 0) {
        ctx.save(); ctx.globalAlpha = sk;
        ctx.strokeStyle = 'rgba(230,224,216,0.6)'; ctx.lineWidth = 3;
        const r = lerp(60, 260, sk);
        ctx.beginPath(); ctx.arc(960, 560, r, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.arc(960, 560, r * 1.3, 0, TAU); ctx.stroke();
        ctx.strokeRect(960 - r * 2.4, 560 - r * 1.4, r * 4.8, r * 2.8);
        ctx.restore();
      }
      halo(ctx, 960, 560, 260, '255,130,60', 0.55);
      halo(ctx, 960, 560, 40, '255,240,225', 1);
      ctx.fillStyle = '#fffaf2'; ctx.beginPath(); ctx.arc(960, 560, 8, 0, TAU); ctx.fill();
      // serif lyric
      const sc = kf(t, [[F(1927), 1.25], [F(1945), 1.0, E.outCubic], [F(1985), 0.66, E.inOutSine]]);
      ctx.save();
      ctx.translate(960, 500); ctx.scale(sc, sc);
      let act = -1; OM.forEach((w, i) => { if (t >= w[1]) act = i; });
      [0, 1].forEach(line => {
        const ws = OM.filter(w => (w[2] || 0) === line);
        font(ctx, 500, line ? 64 : 92, FONT.serif);
        ctx.font = `italic 500 ${line ? 64 : 92}px ${FONT.serif}`;
        const sp = ctx.measureText(' ').width;
        const total = ws.reduce((p, w) => p + ctx.measureText(w[0]).width, 0) + sp * (ws.length - 1);
        let x = -total / 2;
        ws.forEach(w => {
          const i = OM.indexOf(w);
          if (t >= w[1]) {
            ctx.globalAlpha = prog(t, w[1], w[1] + 0.12);
            ctx.fillStyle = i === act && !(line === 0 && act === 2 && t > F(1955)) ? '#ff8a40' : '#efe7dc';
            ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 12;
            ctx.fillText(w[0], x, line ? 140 : 0);
          }
          x += ctx.measureText(w[0]).width + sp;
        });
      });
      ctx.restore();
    },
  };

  // SCENE 21 (1E30 FLOP/s odometer, frames 1986–2095) lives in part5.js.

  Timeline.add(S16, S17, S18, S19, S20);
})();
