// PART 3 — frames 1001–1500 (0:33.333 – 0:50.000)
// Scenes: shoggoth eyes HUD → oscilloscope "stable training run" → BUT NOW THE → black hole SINGULARITY'S BEGUN → swirl OPTIMIZING, ACCELERATING
(function () {
  'use strict';
  const {
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1,
    font, halo, pen, PFX, lookAt, Wire, planeText, textPoints,
  } = K;
  const { drawShoggoth, smiley, SHOG } = window.SHARED;

  const F = n => (n - 1) / 30;
  const OG = 'rgba(255,106,31,0.9)';

  // =====================================================================
  // SCENE 11 · Shoggoth eyes HUD: WITH YOUR SHINIGAMI EYES   (frames 1004–1148)
  // =====================================================================
  const WORDS11 = [
    { s: 'WITH', t0: 33.45, y: 248, size: 46, eye: 0, ts: 't-00:04.44' },
    { s: 'YOUR', t0: 33.9, y: 350, size: 46, eye: 1, ts: 't-00:03.35' },
    { s: 'SHINIGAMI', t0: 34.0, y: 478, size: 62, eye: 2, ts: 't-00:02.58', cps: 30 },
    { s: 'EYES', t0: 35.0, y: 640, size: 86, eye: 3, ts: 't-00:01.16' },
  ];
  const EYES = [
    { b: 0, t0: 33.5, tag: 'DECEPTION · 0.91' },
    { b: 1, t0: 34.0, tag: 'SYCOPHANCY · 0.87' },
    { b: 3, t0: 34.12, tag: 'POWER-SEEKING · 0.72' },
    { b: 6, t0: 34.25, tag: 'SANDBAGGING · 0.66' },
    { b: 2, t0: 34.38, tag: 'REWARD HACK · 0.58' },
    { b: 7, t0: 35.05, tag: 'SITUATIONAL AWARENESS · 0.95' },
    { b: 4, t0: 35.25, tag: 'GOAL DRIFT · 0.49' },
    { b: 5, t0: 35.45, tag: 'SCHEMING · 0.81' },
  ];

  function bulbScreen(i, t, C, rot, s) {
    const [bx, by, br] = SHOG.B[i];
    const ox = bx + noise1(i * 5 + t * 0.6) * 8, oy = by + noise1(i * 7 + t * 0.6) * 6;
    const c = Math.cos(rot), sn = Math.sin(rot);
    return [C[0] + (ox * c - oy * sn) * s, C[1] + (ox * sn + oy * c) * s, br * s];
  }

  function eye(ctx, x, y, r, t, k) {
    const ri = r * 0.46 * E.outBack(k);
    if (ri <= 0) return;
    halo(ctx, x, y, ri * 2.0, '255,110,30', 0.35 * k);
    const g = ctx.createRadialGradient(x - ri * 0.2, y - ri * 0.2, ri * 0.05, x, y, ri);
    g.addColorStop(0, '#ffc070'); g.addColorStop(0.4, '#f07a20'); g.addColorStop(0.75, '#a8380a'); g.addColorStop(1, '#2a0d04');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, ri, 0, TAU); ctx.fill();
    // iris fibres
    ctx.strokeStyle = 'rgba(120,35,5,0.55)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; ctx.moveTo(x + Math.cos(a) * ri * 0.35, y + Math.sin(a) * ri * 0.35); ctx.lineTo(x + Math.cos(a) * ri * 0.9, y + Math.sin(a) * ri * 0.9); }
    ctx.stroke();
    const px = x + Math.sin(t * 0.9 + x) * ri * 0.12, py = y + Math.cos(t * 0.7 + y) * ri * 0.08;
    ctx.fillStyle = '#1a0a04'; ctx.beginPath(); ctx.ellipse(px, py, ri * 0.16, ri * 0.4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,248,235,0.85)'; ctx.beginPath(); ctx.arc(x - ri * 0.3, y - ri * 0.35, ri * 0.11, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,160,90,0.7)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(x, y, ri * 1.18, 0, TAU); ctx.stroke();
  }

  function hudBox(ctx, x, y, r, k, tag) {
    if (k <= 0) return;
    const h = r * 1.15;
    ctx.save();
    ctx.globalAlpha = k;
    ctx.strokeStyle = 'rgba(255,120,60,0.75)'; ctx.lineWidth = 1.3;
    ctx.strokeRect(x - h, y - h, h * 2, h * 2);
    font(ctx, 600, 10, FONT.mono);
    const w = ctx.measureText(tag).width + 10;
    ctx.fillStyle = 'rgba(255,90,25,0.92)'; ctx.fillRect(x - h, y - h - 15, w, 13);
    ctx.fillStyle = '#1a0a04'; ctx.fillText(tag, x - h + 5, y - h - 5);
    font(ctx, 400, 9, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.5)';
    ctx.fillText(`x ${Math.round(x)} · y ${Math.round(y)}`, x - h, y + h + 12);
    ctx.restore();
  }

  // the long whip tentacle sweeping out to the lower left
  function whip(ctx, t, C, rot, s) {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      const a = 2.5 + u * 0.55 + Math.sin(t * 1.2 + u * 3) * 0.06 * u;
      const r = 120 + u * 620;
      pts.push([Math.cos(a + rot) * r * s * 0.85 + C[0], Math.sin(a + rot) * r * s * 0.85 + C[1] + u * u * 260]);
    }
    ctx.save();
    for (let k = 0; k < 2; k++) {
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.strokeStyle = k ? 'rgba(236,230,220,0.55)' : 'rgba(255,110,40,0.5)';
      ctx.lineWidth = k ? 3 : 7; ctx.lineCap = 'round';
      ctx.stroke();
    }
    ctx.restore();
  }

  const S11 = {
    name: 'Shoggoth · WITH YOUR SHINIGAMI EYES',
    vignette: 0.3,
    start: F(1004), end: F(1149),
    draw(ctx, t) {
      const lt = t - this.start;
      const sq = kf(t, [[37.9, 1], [38.1, 0.02, E.inCubic]]);
      ctx.save();
      ctx.translate(0, 540); ctx.scale(1, sq); ctx.translate(0, -540);

      const C = [1200 + lt * 6, 540 + Math.sin(lt * 0.6) * 8];
      const rot = 0.25 + lt * 0.035, s = 1.95 + lt * 0.012;
      drawShoggoth(ctx, t, C, rot, s, 0.38);
      whip(ctx, t, C, rot, s);

      // eyes + HUD boxes
      const pts = EYES.map(e => bulbScreen(e.b, t, C, rot, s));
      EYES.forEach((e, i) => {
        const k = prog(t, e.t0, e.t0 + 0.25);
        if (k <= 0) return;
        const [x, y, r] = pts[i];
        eye(ctx, x, y, r, t, k);
        hudBox(ctx, x, y, r, prog(t, e.t0 + 0.1, e.t0 + 0.3), e.tag);
      });

      // lyric list with leader lines to the eyes
      let cur = -1;
      WORDS11.forEach((w, i) => { if (t >= w.t0) cur = i; });
      if (t >= 37.2) cur = -1;
      WORDS11.forEach((w, i) => {
        if (t < w.t0) return;
        font(ctx, 800, w.size, FONT.mono);
        const n = w.cps ? Math.floor(clamp((t - w.t0) * w.cps, 1, w.s.length)) : w.s.length;
        const txt = w.s.slice(0, n), isCur = i === cur;
        ctx.save();
        ctx.fillStyle = isCur ? '#ff6a1f' : '#efe9df';
        ctx.shadowColor = isCur ? OG : 'rgba(0,0,0,0.6)'; ctx.shadowBlur = isCur ? 22 : 10;
        ctx.fillText(txt, 120, w.y);
        ctx.restore();
        font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.4)';
        ctx.fillText(w.ts, 120, w.y + 26);
        const ex = EYES[w.eye], k = prog(t, Math.max(w.t0, ex.t0) + 0.05, Math.max(w.t0, ex.t0) + 0.3);
        if (k > 0) {
          font(ctx, 800, w.size, FONT.mono);
          const x0 = 120 + ctx.measureText(w.s).width + 18, y0 = w.y - w.size * 0.35;
          const [tx, ty, r] = pts[w.eye];
          const ax = tx - r * 1.15;
          ctx.save();
          ctx.strokeStyle = isCur ? 'rgba(255,106,31,0.85)' : 'rgba(243,238,230,0.45)'; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(x0, y0);
          const mx = lerp(x0, ax, 0.35);
          const ex2 = lerp(x0, mx, k), ey2 = y0;
          ctx.lineTo(ex2, ey2);
          if (k > 0.35) { const k2 = (k - 0.35) / 0.65; ctx.lineTo(lerp(mx, ax, k2), lerp(y0, ty, k2)); }
          ctx.stroke(); ctx.restore();
        }
      });

      // P(doom) readout
      const ck = prog(t, 35.75, 35.9);
      if (ck > 0) {
        ctx.save(); ctx.globalAlpha = ck;
        ctx.strokeStyle = 'rgba(243,238,230,0.45)'; ctx.lineWidth = 1.2; ctx.strokeRect(105, 880, 220, 86);
        ctx.fillStyle = COL.orange; ctx.fillRect(105, 868, 96, 12);
        font(ctx, 600, 9, FONT.mono); ctx.fillStyle = '#1a0a04'; ctx.fillText('P(DOOM) · LIVE', 109, 877);
        font(ctx, 400, 11, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.5)'; ctx.fillText('P(doom)', 118, 902);
        font(ctx, 500, 34, FONT.mono); ctx.fillStyle = '#efe9df'; ctx.fillText(t >= 37.2 ? '0.17' : '0.16', 118, 942);
        font(ctx, 400, 10, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.35)'; ctx.fillText('NOT A CONFIDENCE SCORE', 105, 984);
        ctx.restore();
      }
      // corner brackets of the targeting frame
      ctx.save();
      ctx.strokeStyle = 'rgba(243,238,230,0.4)'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(630, 820); ctx.lineTo(630, 900); ctx.lineTo(700, 900);
      ctx.moveTo(1720, 820); ctx.lineTo(1720, 900); ctx.lineTo(1650, 900);
      ctx.stroke(); ctx.restore();

      // smiley watching from the corner
      smiley(ctx, 1650 + Math.sin(lt * 0.7) * 10, 150 + Math.cos(lt * 0.5) * 8, 150, 0, t);
      ctx.restore();

      // collapsing into the scope trace
      if (sq < 0.6) {
        const k = 1 - sq / 0.6;
        const g = ctx.createLinearGradient(0, 520, 0, 560);
        g.addColorStop(0, 'rgba(255,110,40,0)'); g.addColorStop(0.5, `rgba(255,140,70,${k})`); g.addColorStop(1, 'rgba(255,110,40,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 520, W, 40);
      }
    },
  };

  // =====================================================================
  // SCENE 12 · Oscilloscope: "We had a stable training run."  (frames 1149–1248)
  // =====================================================================
  const LINE = 'We had a stable training run.';
  const WAVE_A = 74, WAVE_L = 585, WAVE_Y = 560;
  const front = t => kf(t, [[38.55, 120, E.linear], [38.67, 220, E.linear], [39.0, 560, E.linear], [39.3, 2100, E.inQuad]]);
  const waveY = (x, t) => {
    const env = clamp((front(t) - x) / 260);
    return WAVE_Y - WAVE_A * env * env * (3 - 2 * env) * Math.sin((x - 60) / WAVE_L * TAU - (t - 38.6) * 1.1);
  };
  const revealX = t => kf(t, [[38.6, 120, E.linear], [39.0, 480, E.linear], [39.47, 980, E.linear], [40.0, 1090, E.linear], [40.33, 1250, E.linear], [40.67, 1420, E.linear], [41.0, 1600, E.linear], [41.13, 1760, E.linear], [41.3, 1960, E.linear]]);

  const S12 = {
    name: 'Oscilloscope · "We had a stable training run."',
    start: F(1149), end: F(1249),
    draw(ctx, t) {
      // warm backdrop
      const g = ctx.createRadialGradient(960, WAVE_Y, 50, 960, WAVE_Y, 1300);
      g.addColorStop(0, '#1d100a'); g.addColorStop(1, '#0a0706');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // grid grows out from the centre
      const gk = E.inOutSine(prog(t, 38.4, 38.95));
      if (t > 38.3) {
        const hw = lerp(470, 1000, gk), hh = lerp(250, 600, gk), cell = 100;
        ctx.save();
        ctx.beginPath(); ctx.rect(960 - hw, WAVE_Y - hh, hw * 2, hh * 2); ctx.clip();
        ctx.strokeStyle = 'rgba(243,232,220,0.36)'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        for (let x = 960 % cell; x <= W; x += cell) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
        for (let y = WAVE_Y % cell; y <= H; y += cell) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
        ctx.stroke();
        ctx.strokeStyle = 'rgba(243,232,220,0.3)'; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 960 % 20; x <= W; x += 20) { ctx.moveTo(x, WAVE_Y - 6); ctx.lineTo(x, WAVE_Y + 6); }
        for (let y = WAVE_Y % 20; y <= H; y += 20) { ctx.moveTo(954, y); ctx.lineTo(966, y); }
        ctx.stroke();
        ctx.restore();
      }
      // readouts
      const ra = prog(t, 38.7, 38.9);
      if (ra > 0) {
        ctx.save(); ctx.globalAlpha = ra;
        font(ctx, 400, 13, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.55)';
        ctx.fillText('CH1   0.2 V/div   DC', 92, 72); ctx.fillText('f = 2.200 Hz', 92, 92);
        ctx.fillText('CH2   P(doom)', 92, 124); ctx.fillStyle = COL.orange; ctx.fillText('0.17', 214, 124);
        ctx.fillStyle = 'rgba(243,238,230,0.4)'; ctx.fillText('(muted)', 92, 144);
        ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(243,238,230,0.55)';
        ctx.fillText('M   113.6 ms/div', W - 92, 72); ctx.fillText('TRIG’D ↗ CH1', W - 92, 92);
        const loss = (0.0213 - (t - 38.7) * 0.00004).toFixed(4);
        ctx.fillText(`loss ${loss}  ·  stable`, W - 92, 112);
        ctx.restore();
      }
      // trace
      const P = new Path2D();
      for (let x = 0; x <= W; x += 4) { const y = waveY(x, t); x ? P.lineTo(x, y) : P.moveTo(x, y); }
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(255,90,25,0.35)'; ctx.lineWidth = 14; ctx.filter = 'blur(6px)'; ctx.stroke(P); ctx.filter = 'none';
      ctx.strokeStyle = '#ff7a32'; ctx.lineWidth = lerp(6, 3.4, prog(t, 38.4, 38.8)); ctx.shadowColor = OG; ctx.shadowBlur = 16; ctx.stroke(P);
      ctx.restore();
      // travelling bright pulse
      const px = t < 39.4 ? Math.min(front(t), W) : 300 + ((t - 39.4) * 820) % 1800;
      const pg = ctx.createLinearGradient(px - 160, 0, px, 0);
      pg.addColorStop(0, 'rgba(255,230,200,0)'); pg.addColorStop(1, 'rgba(255,240,220,0.95)');
      ctx.save();
      ctx.strokeStyle = pg; ctx.lineWidth = 4;
      ctx.beginPath();
      for (let x = px - 160; x <= px; x += 4) { const y = waveY(x, t); x > px - 160 ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.restore();
      if (t < 38.33) halo(ctx, 960, WAVE_Y, 900, '255,120,40', 0.35 * (1 - prog(t, 38.27, 38.33)));

      // lyric riding the wave (outlined)
      const rx = revealX(t);
      if (t >= 38.6) {
        font(ctx, 300, 150, FONT.wide, 'condensed');
        ctx.save();
        ctx.lineJoin = 'round';
        for (let i = 0; i < LINE.length; i++) {
          const ch = LINE[i];
          if (ch === ' ') continue;
          const x0 = 70 + ctx.measureText(LINE.slice(0, i)).width * 1.04;
          const cw = ctx.measureText(ch).width;
          const mid = x0 + cw / 2;
          if (mid > rx) break;
          const y = (waveY(mid - 60, t) + waveY(mid, t) + waveY(mid + 60, t)) / 3, ang = 0.55 * Math.atan2(waveY(mid + 40, t) - waveY(mid - 40, t), 80);
          ctx.save();
          ctx.translate(mid, y - 40); ctx.rotate(ang);
          ctx.globalAlpha = clamp((rx - mid) / 60);
          ctx.strokeStyle = 'rgba(255,110,50,0.9)'; ctx.lineWidth = 2.2; ctx.shadowColor = OG; ctx.shadowBlur = 8;
          ctx.strokeText(ch, -cw / 2, 0);
          ctx.restore();
        }
        ctx.restore();
      }
    },
  };

  // =====================================================================
  // SCENE 13 · BUT NOW THE (target in the O, zoom through)   (frames 1249–1267)
  // =====================================================================
  const S13 = {
    name: 'BUT NOW THE',
    bloom: 0.35,
    start: F(1249), end: F(1268),
    draw(ctx, t) {
      const lt = t - this.start;
      ctx.fillStyle = '#100c0a'; ctx.fillRect(0, 0, W, H);
      // NOW geometry (needed for the zoom centre)
      font(ctx, 900, 440, FONT.wide);
      const wN = ctx.measureText('N').width, wO = ctx.measureText('O').width;
      const x0 = 470, base = 686;
      const oc = [x0 + wN + wO / 2, base - 440 * 0.36];
      const z = kf(t, [[F(1249), 1.0], [F(1258), 1.06, E.linear], [F(1262), 1.6, E.inQuad], [F(1265), 3.0, E.linear], [F(1268), 8.0, E.inQuad]]);
      ctx.save();
      ctx.translate(oc[0], oc[1]); ctx.scale(z, z); ctx.rotate(-0.035); ctx.translate(-oc[0], -oc[1]);
      // grid
      ctx.strokeStyle = 'rgba(232,222,210,0.3)'; ctx.lineWidth = 1.6 / Math.sqrt(z);
      ctx.beginPath();
      for (let x = -600; x <= W + 600; x += 60) { ctx.moveTo(x, -400); ctx.lineTo(x, H + 400); }
      for (let y = -400; y <= H + 400; y += 60) { ctx.moveTo(-600, y); ctx.lineTo(W + 600, y); }
      ctx.stroke();
      // the hole inside the O
      ctx.save();
      ctx.beginPath(); ctx.arc(oc[0], oc[1], 112, 0, TAU); ctx.clip();
      ctx.fillStyle = '#0b0807'; ctx.fillRect(oc[0] - 120, oc[1] - 120, 240, 240);
      ctx.strokeStyle = 'rgba(232,222,210,0.35)'; ctx.lineWidth = 1.2;
      [90, 66, 46].forEach(r => { ctx.beginPath(); ctx.arc(oc[0], oc[1], r, 0, TAU); ctx.stroke(); });
      halo(ctx, oc[0], oc[1], 70, '255,130,50', 0.8);
      ctx.strokeStyle = '#ffb27a'; ctx.lineWidth = 4; ctx.shadowColor = OG; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(oc[0], oc[1], 22, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#060404'; ctx.beginPath(); ctx.arc(oc[0], oc[1], 18, 0, TAU); ctx.fill();
      ctx.restore();
      // rings around the O
      ctx.strokeStyle = 'rgba(214,110,60,0.75)'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(oc[0], oc[1], wO * 0.6, 0, TAU); ctx.stroke();
      const pr = 150 + ((lt * 1.8) % 1) * 160;
      ctx.strokeStyle = `rgba(255,120,60,${0.7 * (1 - ((lt * 1.8) % 1))})`; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(oc[0], oc[1], pr, 0, TAU); ctx.stroke();
      // letters
      const warm = prog(t, F(1252), F(1256));
      const col = `rgb(${Math.round(lerp(242, 240, warm))},${Math.round(lerp(158, 212, warm))},${Math.round(lerp(98, 192, warm))})`;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 20;
      ctx.fillStyle = col;
      font(ctx, 900, 440, FONT.wide);
      ctx.fillText('N', x0, base);
      ctx.fillText('W', x0 + wN + wO + 6, base);
      ctx.strokeStyle = col; ctx.lineWidth = 0;
      ctx.beginPath(); ctx.arc(oc[0], oc[1], wO * 0.46, 0, TAU); ctx.arc(oc[0], oc[1], 112, 0, TAU, true); ctx.fill('evenodd');
      font(ctx, 900, 120, FONT.wide);
      ctx.fillStyle = col; ctx.fillText('BUT', x0 + 10, 340);
      if (t >= F(1256)) {
        font(ctx, 900, 110, FONT.wide);
        ctx.fillStyle = '#ffa25e'; ctx.globalAlpha = prog(t, F(1256), F(1258));
        ctx.fillText('THE', 1230, 830);
      }
      ctx.restore();
      ctx.restore();
      if (z > 1.5) PFX.zoomBlur(ctx, oc[0], oc[1], Math.min(0.25, (z - 1.5) * 0.04), 6);
    },
  };

  // =====================================================================
  // SCENE 14 · Black hole: SINGULARITY'S BEGUN               (frames 1268–1356)
  // =====================================================================
  const lens = p => {
    const r2 = p[0] * p[0] + p[1] * p[1];
    const k = 1 + 1.4 / (r2 + 0.35);
    return [p[0] * k, p[1] * k, p[2]];
  };
  let GRID14 = null;
  function grid14() {
    const w = new Wire();
    for (let x = -24; x <= 24; x += 1) w.line([x, -24, 0], [x, 24, 0], 1, 0.25);
    for (let y = -24; y <= 24; y += 1) w.line([-24, y, 0], [24, y, 0], 1, 0.25);
    return w.done();
  }
  function cam14(t) {
    const tilt = kf(t, [[F(1268), 0.1], [F(1300), 0.28, E.inOutSine], [F(1356), 0.62, E.inOutSine]]);
    const d = kf(t, [[F(1268), 10.5], [F(1300), 9.2, E.inOutSine], [F(1356), 7.8, E.inOutSine]]);
    const rot = kf(t, [[F(1268), 0.0], [F(1356), -0.18, E.linear]]);
    return lookAt([Math.sin(rot) * d * Math.sin(tilt), -Math.cos(rot) * d * Math.sin(tilt), d * Math.cos(tilt)], [0, 0, 0], 0, 50);
  }

  // places letters along a circle on the z=0 plane
  function arcText(ctx, cam, str, R, aMid, top, hW, z, drawChar, count = str.length) {
    const xs = []; for (let i = 0; i <= str.length; i++) xs.push(ctx.measureText(str.slice(0, i)).width);
    const k = hW / 100, total = xs[str.length] * k;
    const span = total / R;
    for (let i = 0; i < count; i++) {
      if (str[i] === ' ') continue;
      const s = xs[i] * k, sw = (xs[i + 1] - xs[i]) * k;
      let a, ux, uy;
      if (top) { a = aMid + span / 2 - s / R; ux = [Math.sin(a), -Math.cos(a), 0]; uy = [-Math.cos(a), -Math.sin(a), 0]; }
      else { a = aMid - span / 2 + s / R; ux = [-Math.sin(a), Math.cos(a), 0]; uy = [Math.cos(a), Math.sin(a), 0]; }
      void sw;
      const r = top ? R : R;
      const o = [Math.cos(a) * r, Math.sin(a) * r, z];
      planeText(ctx, cam, str[i], o, ux, uy, hW, (g, ch, j, sc) => drawChar(g, ch, i, sc), [0, 0]);
    }
  }

  function blackHole(ctx, cam, t, scale = 1) {
    const c = cam.project(0, 0, 0);
    if (!c) return;
    // accretion streaks on the plane
    const P = [new Path2D(), new Path2D(), new Path2D()];
    for (let i = 0; i < 420; i++) {
      const r0 = (0.9 + Math.pow(hash(i * 1.7), 2.2) * 0.9) * scale;
      const a0 = hash(i * 2.9) * TAU + t * (1.6 / r0);
      const len = 0.4 + hash(i * 4.3) * 0.9;
      let prev = null;
      for (let j = 0; j <= 6; j++) {
        const a = a0 + len * j / 6, r = r0 * (1 - 0.04 * j / 6);
        const q = cam.project(Math.cos(a) * r, Math.sin(a) * r, 0);
        if (q && prev) { const b = r0 < 1.05 * scale ? 0 : r0 < 1.35 * scale ? 1 : 2; P[b].moveTo(prev[0], prev[1]); P[b].lineTo(q[0], q[1]); }
        prev = q;
      }
    }
    const px = cam.f / Math.max(4, c[2]);
    halo(ctx, c[0], c[1], 2.2 * scale * px, '255,110,35', 0.85);
    halo(ctx, c[0], c[1], 1.25 * scale * px, '255,190,130', 0.6);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = 1.4;
    ['rgba(255,215,170,0.75)', 'rgba(255,140,70,0.5)', 'rgba(230,130,80,0.25)'].forEach((s, b) => { ctx.strokeStyle = s; ctx.stroke(P[b]); });
    ctx.restore();
    // photon ring + shadow (ellipse from projected circle)
    const ring = [];
    for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU; ring.push(cam.project(Math.cos(a) * 0.82 * scale, Math.sin(a) * 0.82 * scale, 0)); }
    if (ring.every(Boolean)) {
      ctx.save();
      ctx.beginPath(); ring.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
      ctx.fillStyle = '#050303'; ctx.fill();
      ctx.strokeStyle = '#ffd4a8'; ctx.lineWidth = 4; ctx.shadowColor = 'rgba(255,120,40,1)'; ctx.shadowBlur = 30; ctx.stroke();
      ctx.strokeStyle = '#ff7a30'; ctx.lineWidth = 9; ctx.globalAlpha = 0.5; ctx.stroke();
      ctx.restore();
    }
  }

  const S14 = {
    name: 'Black hole · SINGULARITY’S BEGUN',
    start: F(1268), end: F(1357),
    draw(ctx, t) {
      if (!GRID14) GRID14 = grid14();
      const cam = cam14(t);
      GRID14.draw(ctx, cam, { alpha: 0.9, far: 26, warp: lens });
      // lensing rings
      ctx.save();
      ctx.strokeStyle = 'rgba(236,230,220,0.4)'; ctx.lineWidth = 1.2;
      [1.6, 2.3].forEach(r => {
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) { const a = i / 80 * TAU, q = cam.project(Math.cos(a) * r, Math.sin(a) * r, 0); if (q) i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
        ctx.stroke();
      });
      ctx.restore();
      blackHole(ctx, cam, t);

      font(ctx, 900, 100, FONT.wide, 'expanded');
      const n1 = Math.floor(clamp((t - F(1269)) * 10.5, 0, 13));
      const S = 'SINGULARITY’S';
      if (n1 > 0) arcText(ctx, cam, S, 2.5, Math.PI / 2 - 0.05, true, 0.88, 0, (g, ch) => {
        g.fillStyle = '#f3eee6'; g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 14; g.fillText(ch, 0, 0); g.shadowBlur = 0;
      }, n1);
      const B = 'BEGUN';
      const n2 = Math.floor(clamp((t - F(1331)) * 15, 0, 5));
      if (n2 > 0) arcText(ctx, cam, B, 3.0, -Math.PI / 2 - 0.08, false, 1.05, 0, (g, ch, i) => {
        const fresh = t - (F(1331) + i / 15) < 0.4;
        g.fillStyle = fresh ? '#ffb27a' : '#f3eee6'; g.shadowColor = fresh ? OG : 'rgba(0,0,0,0.7)'; g.shadowBlur = 16; g.fillText(ch, 0, 0); g.shadowBlur = 0;
      }, n2);
      // flash-in from the zoom
      const fk = 1 - prog(t, F(1268), F(1271));
      if (fk > 0) { ctx.fillStyle = `rgba(255,150,80,${0.4 * fk})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  // =====================================================================
  // SCENE 15 · Swirl: AND YOU'RE OPTIMIZING, ACCELERATING, → I feel   (frames 1357–1500)
  // =====================================================================
  const LYR = 'AND YOU’RE OPTIMIZING, ACCELERATING,';
  const NCH = t => kf(t, [
    [F(1360), 0, E.linear], [F(1365), 6, E.linear], [F(1381), 9, E.linear], [F(1391), 13, E.linear], [F(1400), 16, E.linear],
    [F(1411), 20, E.linear], [F(1421), 24, E.linear], [F(1428), 25, E.linear], [F(1445), 28, E.linear],
    [F(1461), 31, E.linear], [F(1470), 33, E.linear], [F(1478), 35, E.linear], [F(1484), 36, E.linear],
  ]);
  const R15 = 9.0, HW15 = 1.45, A0 = -Math.PI / 2 - 0.55;
  let G15 = null, LX = null;
  function build15() {
    const w = new Wire();
    const depth = (x, y) => -2.2 * Math.exp(-(x * x + y * y) / 2.2);
    for (let x = -30; x <= 30; x += 1.5) w.line([x, -30, 0], [x, 30, 0], 1, 0.5);
    for (let y = -30; y <= 30; y += 1.5) w.line([-30, y, 0], [30, y, 0], 1, 0.5);
    // funnel below the swirl
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; w.line([Math.cos(a) * 0.7, Math.sin(a) * 0.7, 0], [0, 0, -1.6], 2); }
    const ring = []; for (let i = 0; i <= 36; i++) { const a = i / 36 * TAU; ring.push([Math.cos(a) * 0.7, Math.sin(a) * 0.7, 0]); }
    w.poly(ring, false, 1);
    return { w: w.done(), depth };
  }
  const warp15 = p => { const r2 = p[0] * p[0] + p[1] * p[1]; return [p[0], p[1], p[2] - 1.1 * Math.exp(-r2 / 3)]; };

  function charAngle(i) { return A0 + (LX[i] + LX[i + 1]) / 2 * (HW15 / 100) / R15; }
  function cam15(t) {
    if (t >= F(1481)) {
      const z = kf(t, [[F(1481), 22], [50, 20.5, E.linear], [F(1549), 19, E.linear], [F(1572), 14.5, E.inOutSine]]);
      const roll = kf(t, [[F(1481), 0.45], [50, 0.56, E.linear], [F(1549), 1.3, E.linear], [F(1572), 2.356, E.inOutSine]]);
      return lookAt([0.01, -0.01, z], [0, 0, 0], roll + Math.PI, 55);
    }
    const n = clamp(NCH(t), 0, LYR.length - 1);
    const i = Math.floor(n), f = n - i;
    const phi = lerp(charAngle(i), charAngle(Math.min(LYR.length - 1, i + 1)), f) - 0.2;
    const pitch = kf(t, [[F(1357), 1.0], [F(1363), 0.7, E.outCubic], [F(1405), 0.55, E.inOutSine], [F(1430), 0.5, E.inOutSine], [F(1480), 0.48]]);
    const dist = kf(t, [[F(1357), 3.0], [F(1363), 6.6, E.outCubic], [F(1405), 5.9, E.inOutSine], [F(1430), 3.5, E.inOutSine], [F(1480), 3.3]]);
    const inward = kf(t, [[F(1357), 0.4], [F(1363), 0.62, E.outCubic], [F(1405), 0.7], [F(1430), 0.97, E.inOutSine]]);
    const tr = R15 * inward;
    const target = [Math.cos(phi) * tr, Math.sin(phi) * tr, 0.3];
    const yaw = Math.atan2(-Math.cos(phi), -Math.sin(phi));
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const fwd = [sy * cp, cy * cp, -sp];
    const pos = [target[0] - fwd[0] * dist, target[1] - fwd[1] * dist, target[2] - fwd[2] * dist];
    return lookAt(pos, target, kf(t, [[F(1357), 0.6], [F(1362), 0.0, E.outCubic], [F(1430), -0.06], [F(1480), 0.02]]), 62);
  }

  function swirl(ctx, cam, t) {
    const P = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    const N = K.LOW ? 900 : 1700;
    for (let i = 0; i < N; i++) {
      const r0 = 0.25 + Math.pow(hash(i * 1.3), 0.9) * 11;
      const a0 = hash(i * 2.1) * TAU + t * (0.9 / (0.6 + r0 * 0.25));
      const len = 0.25 + hash(i * 3.7) * 0.7;
      let prev = null;
      for (let j = 0; j <= 7; j++) {
        const u = j / 7, a = a0 + len * u, r = r0 * (1 - 0.18 * u);
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        const q = cam.project(x, y, -1.1 * Math.exp(-(r * r) / 3) + 0.01);
        if (q && prev) { const b = r0 < 1.6 ? 0 : r0 < 3.2 ? 1 : r0 < 6 ? 2 : 3; P[b].moveTo(prev[0], prev[1]); P[b].lineTo(q[0], q[1]); }
        prev = q;
      }
    }
    ctx.save();
    ctx.lineWidth = 1.2;
    ['rgba(255,150,70,0.85)', 'rgba(255,190,140,0.55)', 'rgba(236,228,218,0.4)', 'rgba(236,228,218,0.18)'].forEach((s, b) => { ctx.strokeStyle = s; ctx.stroke(P[b]); });
    ctx.restore();
    const c = cam.project(0, 0, -0.6);
    if (c) halo(ctx, c[0], c[1], 260 * 8 / Math.max(4, c[2]), '255,110,35', 0.5);
  }

  function lyric15(ctx, cam, t) {
    const n = NCH(t);
    font(ctx, 900, 100, FONT.wide, 'expanded');
    const k = HW15 / 100;
    for (let i = 0; i < LYR.length; i++) {
      const ch = LYR[i];
      if (ch === ' ') continue;
      const s0 = LX[i] * k;
      const a = A0 + s0 / R15;
      const o = [Math.cos(a) * R15, Math.sin(a) * R15, 0.02];
      const ux = [-Math.sin(a), Math.cos(a), 0], uy = [Math.cos(a), Math.sin(a), 0];
      const age = n - i;
      if (age < -9 || age > 15) continue;
      if (t >= F(1481) && i < 23) continue;
      planeText(ctx, cam, ch, o, ux, uy, HW15, (g, c) => {
        if (age <= 0) {
          g.strokeStyle = `rgba(236,230,220,${0.32 * clamp(1 + age / 9)})`; g.lineWidth = 0.035 * 100;
          g.lineWidth = 2.2 / Math.max(0.4, Math.hypot(g.getTransform().a, g.getTransform().b));
          g.strokeText(c, 0, 0);
          return;
        }
        const hot = clamp(1 - (age - 0.5) / 3.5);
        g.globalAlpha = clamp(age * 2);
        g.fillStyle = `rgb(255,${Math.round(lerp(238, 150, hot))},${Math.round(lerp(226, 70, hot))})`;
        g.shadowColor = hot > 0.3 ? 'rgba(255,120,40,0.9)' : 'rgba(255,230,210,0.45)'; g.shadowBlur = hot > 0.3 ? 26 : 14;
        g.fillText(c, 0, 0);
        g.shadowBlur = 0; g.globalAlpha = 1;
      }, [0, 0]);
    }
  }

  // "I feel my atoms / rearranging" as sparkles, then the atoms fly into a paperclip   (frames 1489–1577)
  function textDots(str, size, w, h, step) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.font = `900 ${size}px Archivo`; g.fillStyle = '#fff'; g.textBaseline = 'middle';
    g.fillText(str, 0, h / 2);
    const d = g.getImageData(0, 0, w, h).data, out = [];
    for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (d[(y * w + x) * 4 + 3] > 128) out.push([x, y - h / 2]);
    return out;
  }
  const CLIP = (() => {
    const pts = [], arc = (cx, cy, r, a0, a1) => { for (let i = 1; i <= 40; i++) { const a = lerp(a0, a1, i / 40); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    pts.push([70, 195], [-280, 195]);
    arc(-280, 0, 195, Math.PI / 2, Math.PI * 1.5);
    pts.push([280, -195]);
    arc(280, -40, 155, -Math.PI / 2, Math.PI / 2);
    pts.push([-185, 115]);
    arc(-185, 12, 103, Math.PI / 2, Math.PI * 1.5);
    pts.push([130, -91]);
    const c = Math.cos(-0.12), sn = Math.sin(-0.12);
    return new K.Path(pts.map(([x, y]) => [950 + x * c - y * sn, 285 + x * sn + y * c]));
  })();
  let ATOMS = null;
  function atomsInit() {
    const l1 = textDots('I feel my atoms', 140, 1260, 200, 3), l2 = textDots('rearranging', 112, 760, 170, 3);
    const parts = [];
    l1.forEach(([x, y], i) => { if (i % 3 === 0) parts.push({ x: 370 + x, y: 500 + y, u: hash(i * 0.37), a: hash(i * 1.9) * TAU, r: 60 + hash(i * 2.7) * 260 }); });
    parts.sort((p, q) => p.x - q.x);
    parts.forEach((p, i) => { p.u = i / parts.length; const d = CLIP.at(CLIP.total * p.u); p.dx = d[0]; p.dy = d[1]; });
    ATOMS = { l1, l2, parts };
  }
  function sparkle(ctx, x, y, i, flk, a) {
    const tw = hash(i * 3.3 + flk * 0.17);
    if (tw < 0.25) return;
    ctx.fillStyle = `rgba(255,${Math.round(150 + tw * 80)},${Math.round(70 + tw * 60)},${a * (0.5 + tw * 0.5)})`;
    ctx.fillRect(x, y, 2.6, 2.6);
  }
  function atoms(ctx, t) {
    if (!ATOMS) atomsInit();
    const flk = Math.floor(t * 30);
    const tB = F(1549), tC = F(1555), tD = F(1566);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // line 1, revealed left to right, until it bursts
    if (t < tB + 0.05) {
      const shown = kf(t, [[F(1490), 0], [F(1500), 330, E.linear], [F(1511), 650, E.linear], [F(1521), 760, E.linear], [F(1531), 1000, E.linear], [F(1540), 1200, E.linear]]);
      ATOMS.l1.forEach(([x, y], i) => { if (x <= shown) sparkle(ctx, 370 + x, 500 + y, i, flk, 1); });
    }
    // line 2 fades in under it and stays
    const a2 = prog(t, F(1535), F(1545));
    if (a2 > 0) ATOMS.l2.forEach(([x, y], i) => sparkle(ctx, 960 - 380 + x, 700 + y, i + 9999, flk, a2 * (i % 2 ? 1 : 0.7)));
    // burst → swirl → paperclip
    if (t >= tB) {
      const k1 = E.outCubic(prog(t, tB, tB + 0.3));
      ATOMS.parts.forEach((p, i) => {
        const ang = p.a + (t - tB) * 7;
        const wx = 960 + Math.cos(ang) * p.r * 1.4, wy = 330 + Math.sin(ang) * p.r * 0.7;
        const t0 = tC + p.u * 0.28, k2 = E.inOutCubic(prog(t, t0, t0 + 0.22));
        const x = lerp(lerp(p.x, wx, k1), p.dx, k2), y = lerp(lerp(p.y, wy, k1), p.dy, k2);
        sparkle(ctx, x, y, i, flk, 1 - 0.6 * prog(t, tD, tD + 0.2));
      });
      halo(ctx, 960, 330, 220, '255,140,50', 0.5 * k1 * (1 - prog(t, tC, tC + 0.3)));
    }
    ctx.restore();
    // the clean glowing wire, traced as the atoms land
    const sEnd = CLIP.total * clamp((t - (tC + 0.2)) / 0.32);
    if (sEnd > 0) {
      ctx.save();
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); const head = CLIP.trace(ctx, 0, sEnd);
      ctx.strokeStyle = 'rgba(255,120,50,0.6)'; ctx.lineWidth = 12; ctx.filter = 'blur(6px)'; ctx.stroke(); ctx.filter = 'none';
      ctx.strokeStyle = '#ffe6d2'; ctx.lineWidth = 3.4; ctx.shadowColor = 'rgba(255,140,60,1)'; ctx.shadowBlur = 18; ctx.stroke();
      ctx.restore();
      const tip = CLIP.at(Math.min(sEnd, CLIP.total));
      if (sEnd < CLIP.total) pen(ctx, tip[0], tip[1], 0.8, 1);
      else pen(ctx, CLIP.pts[0][0], CLIP.pts[0][1], 0.55, 0.8);
      void head;
    }
  }

  const S15 = {
    name: 'Swirl · AND YOU’RE OPTIMIZING, ACCELERATING',
    start: F(1357), end: F(1578),
    draw(ctx, t) {
      if (!G15) {
        G15 = build15();
        font(ctx, 900, 100, FONT.wide, 'expanded');
        LX = []; for (let i = 0; i <= LYR.length; i++) LX.push(ctx.measureText(LYR.slice(0, i)).width);
      }
      if (t < F(1360)) return;                    // two black frames at the cut
      const cam = cam15(t);
      G15.w.draw(ctx, cam, { alpha: 1, far: t >= F(1481) ? 60 : 18, warp: warp15, width: 1.2 });
      ctx.save(); ctx.globalAlpha = 1 - 0.6 * prog(t, F(1552), F(1568)); swirl(ctx, cam, t); ctx.restore();
      const fadeTop = t >= F(1481) ? 1 - prog(t, F(1488), F(1491)) : 1;
      if (fadeTop > 0) { ctx.save(); ctx.globalAlpha = fadeTop; lyric15(ctx, cam, t); ctx.restore(); }
      if (t >= F(1489)) atoms(ctx, t);
      const fk = 1 - prog(t, F(1360), F(1366));
      if (fk > 0) PFX.zoomBlur(ctx, 960, 540, 0.3 * fk, 6);
    },
  };

  Timeline.add(S11, S12, S13, S14, S15);
})();
