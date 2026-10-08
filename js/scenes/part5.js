// PART 5 — frames 1986–2500 (1:06.2 – 1:23.3)
// Scenes: 1E30 FLOP/s odometer → FORM 7-B "That was safe enough" → neural net Forward/backward → von Neumann's obsolete (torn) → roadmap SHARP TURN AND THERE
(function () {
  'use strict';
  const {
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1, noise2,
    font, halo, pen, camKeys, cam2, applyCam, camPoint, PFX,
  } = K;

  const F = n => (n - 1) / 30;
  const OG = 'rgba(255,106,31,0.9)';
  const PAPER = '#ece7de', INK = '#1d1b19', ORN = '#ec5a1c';

  // motion blur from a 2D camera's screen-space velocity
  function camBlur(ctx, keys, t, k = 1, skip) {
    if (skip && skip(t)) return;
    const c = cam2(t, keys), cp = cam2(t - 1 / 60, keys), p0 = camPoint(cp, c.cx, c.cy);
    const dx = (p0[0] - W / 2) * k, dy = (p0[1] - H / 2) * k;
    if (Math.hypot(dx, dy) > 10) PFX.motionBlur(ctx, dx, dy, 10);
  }

  // =====================================================================
  // SCENE 21 · 1E30 FLOP/s odometer                         (frames 1986–2095)
  // =====================================================================
  const ND = 31, DW = 116, DS = 128, CMW = 50;           // 1 followed by 30 zeros
  const dx = i => i * DS + Math.floor((i + 2) / 3) * CMW;  // commas after digit 0, 3, 6, … (groups of three from the right)
  const ROW_END = dx(ND - 1) + DW;
  function drum(ctx, x, y, w, h, v, spin, hot) {
    const d = Math.floor(v), fr = v - d;
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y - h * 0.6, w, h * 1.2); ctx.clip();
    const g = ctx.createLinearGradient(0, y - h * 0.6, 0, y + h * 0.6);
    g.addColorStop(0, '#2a2725'); g.addColorStop(0.22, '#d9d4cc'); g.addColorStop(0.5, '#fbf8f3'); g.addColorStop(0.78, '#d9d4cc'); g.addColorStop(1, '#2a2725');
    ctx.fillStyle = g; ctx.fillRect(x, y - h * 0.6, w, h * 1.2);
    font(ctx, 500, h * 0.62, FONT.mono); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (spin > 0.25) {
      // spinning: horizontal bars of blurred digits
      ctx.filter = `blur(${Math.round(3 + spin * 5)}px)`;
      for (let k = -3; k <= 3; k++) { ctx.fillStyle = 'rgba(30,27,25,0.35)'; ctx.fillText(String((((d + k) % 10) + 10) % 10), x + w / 2, y + (k - fr) * h * 0.3); }
      ctx.filter = 'none';
    } else {
      for (let k = -1; k <= 2; k++) {
        const dy = (k - fr) * h * 0.55, s = Math.cos(clamp(dy / (h * 0.62), -1.4, 1.4));
        ctx.save(); ctx.translate(x + w / 2, y + dy); ctx.scale(1, Math.max(0.05, s));
        ctx.fillStyle = hot && k === 0 ? `rgba(236,90,28,${0.3 + 0.7 * s})` : `rgba(30,27,25,${0.25 + 0.75 * s})`;
        ctx.fillText(String((((d + k) % 10) + 10) % 10), 0, 0);
        ctx.restore();
      }
    }
    if (hot) { ctx.fillStyle = 'rgba(255,110,40,0.18)'; ctx.fillRect(x, y - h * 0.6, w, h * 1.2); }
    ctx.restore();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 3; ctx.strokeRect(x, y - h * 0.6, w, h * 1.2);
  }
  const CAM21 = camKeys([
    [F(1986), [3800, 560, 1.0, 0]],
    [F(2001), [3740, 560, 1.0, 0], E.linear],
    [F(2008), [3600, 560, 0.85, 0], E.inQuad],
    [F(2018), [ROW_END / 2, 560, 0.41, 0], E.outCubic],
    [F(2052), [ROW_END / 2 - 30, 560, 0.42, 0], E.linear],
    [F(2068), [560, 560, 1.0, 0], E.inOutCubic],
    [F(2096), [650, 560, 1.03, 0], E.linear],
  ]);
  const TITLE = [['1', F(1986), 'one'], ['E', F(1992), 'E'], ['30', F(1999), 'thirty'], [' FLOP', F(2008), 'flops'], ['/s', F(2024), 'a second']];
  const NOTES = [
    ['¹ One nonillion floating-point operations per second.', F(2040), 0],
    [' Rounded down, for safety.', F(2058), 0],
    ['² P(doom): 0.43. Also rounded down.', F(2062), 1],
  ];

  const S21 = {
    name: '1E30 FLOP/s',
    start: F(1986), end: F(2096),
    draw(ctx, t) {
      const bg = lerp(0x5a, 0x16, E.inOutSine(prog(t, F(1986), F(1994))));
      ctx.fillStyle = `rgb(${bg},${bg - 2},${bg - 4})`; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM21);
      // drums (world)
      ctx.save(); applyCam(ctx, c);
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2 / c.z;
      ctx.beginPath(); ctx.roundRect(-140, 360, ROW_END + 280, 400, 24); ctx.fill(); ctx.stroke();
      const x0 = Math.max(0, Math.floor(((c.cx - (W / 2) / c.z) + 60) / (DS + CMW / 3)) - 2);
      for (let i = 0; i < ND; i++) {
        const x = dx(i);
        if ((x - c.cx) * c.z + W / 2 < -200 || (x - c.cx) * c.z + W / 2 > W + 200) continue;
        const settle = F(2024) + i * 0.02;
        const spinK = prog(t, F(2001), F(2006)) * (1 - prog(t, settle, settle + 0.12));
        const final = i === 0 ? 1 : 0;
        let v = final;
        if (t < F(2001)) v = i === ND - 1 ? 1 + E.inOutSine(prog(t, F(1996), F(2001) + 0.2)) : 0;
        else if (spinK > 0) v = final + (t * 22 + i * 1.7) % 10 * spinK;
        drum(ctx, x, 560, DW, 250, v, spinK, i === 0 && t > settle + 0.1);
        if (i < ND - 1 && (ND - 1 - i) % 3 === 0) {
          font(ctx, 500, 90, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.7)'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
          ctx.fillText(',', x + DW + 2, 640);
        }
      }
      void x0;
      ctx.restore();
      // title (screen)
      const tx = kf(t, [[F(1986), 210], [F(2001), 150], [F(2096), 150]]);
      let x = tx, act = -1;
      TITLE.forEach((p, i) => { if (t >= p[1]) act = i; });
      font(ctx, 900, 130, FONT.wide);
      TITLE.forEach(([s, t0, lab], i) => {
        ctx.fillStyle = i === act ? '#ff6a1f' : t >= t0 ? '#f3eee6' : 'rgba(243,238,230,0.25)';
        ctx.shadowColor = i === act ? OG : 'transparent'; ctx.shadowBlur = i === act ? 24 : 0;
        font(ctx, 900, 130, FONT.wide);
        ctx.fillText(s, x, 200);
        ctx.shadowBlur = 0;
        font(ctx, 400, 13, FONT.mono); ctx.fillStyle = i === act ? '#ff6a1f' : 'rgba(243,238,230,0.35)'; ctx.fillText(lab, x + 6, 236);
        font(ctx, 900, 130, FONT.wide);
        x += ctx.measureText(s).width + 8;
      });
      if (t >= F(2027)) { font(ctx, 700, 26, FONT.mono); ctx.fillStyle = '#ff6a1f'; ctx.fillText('1', x + 4, 110); }
      // footnotes (typed)
      font(ctx, 400, 15, FONT.mono);
      let nx = 150;
      NOTES.forEach(([s, t0, line], i) => {
        if (t < t0) return;
        const n = Math.floor(clamp((t - t0) * 55, 0, s.length));
        ctx.fillStyle = 'rgba(243,238,230,0.6)';
        const lx = line ? 150 : nx;
        ctx.fillText(s.slice(0, n), lx, 835 + line * 22);
        if (!line) nx += ctx.measureText(s).width;
        if (n < s.length) { ctx.fillStyle = '#f3eee6'; ctx.fillRect(lx + ctx.measureText(s.slice(0, n)).width + 2, 835 + line * 22 - 12, 8, 14); }
        void i;
      });
      camBlur(ctx, CAM21, t, 0.8);
      const fk = 1 - prog(t, F(1986), F(1988));
      if (fk > 0) { ctx.fillStyle = `rgba(255,240,225,${0.6 * fk})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  // =====================================================================
  // SCENE 22 · FORM 7-B: That was safe enough, we reckoned   (frames 2096–2220)
  // =====================================================================
  let FORM = null;
  function buildForm() {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const fnt = (w, s, f) => { g.font = `${w} ${s}px ${f}`; };
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    // paper fibre
    g.globalAlpha = 0.05;
    for (let i = 0; i < 3000; i++) { g.fillStyle = hash(i) > 0.5 ? '#000' : '#fff'; g.fillRect(hash(i * 3.1) * W, hash(i * 5.7) * H, 2, 1); }
    g.globalAlpha = 1;
    g.fillStyle = INK; g.fillRect(234, 66, 1350, 84);
    fnt(900, 54, FONT.wide); g.fillStyle = '#f4f0e8'; g.fillText('FORM 7-B', 258, 128);
    fnt(700, 15, FONT.mono); g.fillText('SAFETY EVALUATION OF A FRONTIER SYSTEM', 640, 98);
    fnt(400, 12, FONT.mono); g.fillText('ABRIDGED EDITION   ·   PLEASE TYPE OR PRINT CLEARLY', 640, 124);
    g.fillStyle = INK; g.fillRect(234, 222, 1350, 1.5);
    fnt(400, 10, FONT.mono); g.fillStyle = 'rgba(29,27,25,0.6)';
    [['ISSUED BY', 250], ['REF.', 760], ['REVIEW TIME', 1010], ['PAGE', 1230]].forEach(([s, x]) => g.fillText(s, x, 172));
    fnt(500, 15, FONT.mono); g.fillStyle = INK;
    [['DEPT. OF REASONABLE ASSURANCES', 250], ['7B-0042/∞', 760], ['11 MIN', 1010], ['1 OF 1', 1230]].forEach(([s, x]) => g.fillText(s, x, 200));
    g.fillRect(745, 158, 1, 56); g.fillRect(995, 158, 1, 56); g.fillRect(1215, 158, 1, 56);
    const label = (n, s, sub, y) => {
      fnt(700, 14, FONT.mono); g.fillStyle = INK; g.fillText(`${n}.  ${s}`, 250, y);
      if (sub) { fnt(400, 11, FONT.mono); g.fillStyle = 'rgba(29,27,25,0.6)'; g.fillText(sub, 260 + g.measureText(`${n}.  ${s}`).width * 1.25, y); }
    };
    label(1, 'FINDINGS', '(describe observed behaviour; attach additional sheets if the system asks you to)', 330);
    g.fillStyle = 'rgba(29,27,25,0.5)'; g.fillRect(380, 420, 1180, 1.4); g.fillRect(380, 470, 1180, 1);
    label(2, 'RISK LEVEL', null, 520);
    fnt(500, 15, FONT.mono);
    [['LOW', 525], ['MODERATE', 680], ['HIGH', 890], ['SAFE ENOUGH', 1060]].forEach(([s, x]) => {
      g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(x, 500, 22, 22);
      g.fillStyle = INK; g.fillText(s, x + 34, 518);
    });
    label(3, 'CONCLUSION', null, 610);
    g.fillStyle = 'rgba(29,27,25,0.5)'; g.fillRect(380, 676, 1180, 1.4);
    label(4, 'SIGNATURE OF EVALUATOR(S)', null, 770);
    g.fillRect(400, 862, 650, 1.4);
    fnt(400, 10, FONT.mono); g.fillText('SIGN HERE', 400, 884);
    g.fillRect(250, 915, 1310, 1);
    fnt(400, 11, FONT.mono); g.fillStyle = 'rgba(29,27,25,0.75)';
    g.fillText('* "Safe enough" is defined in Form 7-C, which has not been drafted. Do not detach.', 260, 945);
    fnt(700, 13, FONT.mono); g.fillStyle = INK; g.fillText('5. EST. P(DOOM)', 1300, 945);
    fnt(400, 10, FONT.mono); g.fillText('(ROUND DOWN)', 1316, 964);
    // punch holes
    [[165, 292], [165, 772]].forEach(([x, y]) => { g.fillStyle = '#0c0b0a'; g.beginPath(); g.arc(x, y, 13, 0, TAU); g.fill(); g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke(); });
    return c;
  }
  function stamp(ctx, cx, cy, rot, s, a, color, lines) {
    if (a <= 0) return;
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s, s);
    ctx.globalAlpha = a;
    const [w, h] = lines.size;
    ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20);
    ctx.fillStyle = color; ctx.textAlign = 'center';
    lines.text.forEach(([str, size, weight, y, fam]) => { font(ctx, weight, size, fam || FONT.wide); ctx.fillText(str, 0, y); });
    // worn ink
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(0,0,0,${0.3 + hash(i * 7.1) * 0.5})`; ctx.fillRect(-w / 2 + hash(i * 1.3) * w, -h / 2 + hash(i * 2.9) * h, 3 + hash(i) * 8, 2); }
    ctx.restore();
  }
  const SAFE_STAMP = { size: [440, 150], text: [['EVALUATED  ·  ✓  ·  REVIEWED', 13, 600, -42, FONT.mono], ['SAFE ENOUGH', 64, 900, 22], ['DEPT. OF REASONABLE ASSURANCES', 13, 600, 54, FONT.mono]] };
  const FILED_STAMP = { size: [250, 84], text: [['FILED', 44, 900, 10], ['NO FURTHER ACTION', 10, 600, 30, FONT.mono]] };
  const CAM22 = camKeys([
    [F(2096), [760, 330, 2.2, -0.08]],
    [F(2100), [576, 361, 1.68, -0.02], E.outCubic],
    [F(2125), [749, 371, 1.7, -0.01], E.linear],
    [F(2129), [760, 400, 1.7, -0.01], E.linear],
    [F(2133), [597, 639, 1.64, 0], E.inOutCubic],
    [F(2137), [600, 645, 1.62, 0], E.linear],
    [F(2140), [960, 540, 1.0, 0], E.inOutCubic],
    [F(2163), [960, 545, 1.03, 0], E.linear],
    [F(2169), [688, 785, 1.45, 0], E.inOutCubic],
    [F(2185), [700, 790, 1.47, 0], E.linear],
    [F(2190), [960, 540, 0.95, 0], E.inOutCubic],
    [F(2212), [965, 540, 0.96, 0], E.linear],
    [F(2221), [1300, 300, 1.4, 0.05], E.inCubic],
  ]);
  const TYPE1 = 'That was safe enough,', TYPE2 = 'we reckoned';
  const n1 = t => Math.floor(kf(t, [[F(2096), 0], [F(2100), 4, E.linear], [F(2101), 6, E.linear], [F(2111), 13, E.linear], [F(2121), 17, E.linear], [F(2125), 20, E.linear], [F(2130), 21, E.linear]]));
  const n2 = t => Math.floor(kf(t, [[F(2132), 0], [F(2135), 2, E.linear], [F(2140), 6, E.linear], [F(2148), 11, E.linear]]));

  function drawFormLive(ctx, t) {
    ctx.drawImage(FORM, 0, 0);
    font(ctx, 400, 44, FONT.mono); ctx.fillStyle = '#26231f';
    const a = n1(t), s1 = TYPE1.slice(0, a);
    ctx.fillText(s1, 405, 408);
    const b = n2(t), s2 = TYPE2.slice(0, b);
    ctx.fillText(s2, 410, 663);
    // orange caret on the active line
    const typing2 = t >= F(2132);
    const cx = typing2 ? 410 + ctx.measureText(s2).width : 405 + ctx.measureText(s1).width;
    if (t < F(2150)) { ctx.fillStyle = ORN; ctx.beginPath(); const cy = typing2 ? 676 : 420; ctx.moveTo(cx, cy - 6); ctx.lineTo(cx + 6, cy + 3); ctx.lineTo(cx - 6, cy + 3); ctx.fill(); }
    // checkbox X
    if (t >= F(2120)) {
      ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(1064, 504); ctx.lineTo(1078, 518); ctx.moveTo(1078, 504); ctx.lineTo(1064, 518); ctx.stroke();
    }
    // est. p(doom)
    if (t >= F(2148)) { font(ctx, 500, 26, FONT.mono); ctx.fillStyle = '#26231f'; ctx.fillText('0.44', 1440, 960); }
    // signature "We"
    const sk = prog(t, F(2160), F(2170));
    if (sk > 0) {
      ctx.save();
      ctx.beginPath(); ctx.rect(420, 740, 260 * sk, 140); ctx.clip();
      ctx.font = `italic 500 120px ${FONT.serif}`; ctx.fillStyle = '#1f1c1a';
      ctx.fillText('We', 450, 850);
      ctx.strokeStyle = '#1f1c1a'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(560, 852); ctx.bezierCurveTo(600, 846, 640, 838, 680, 828); ctx.stroke();
      ctx.restore();
    }
    // stamps
    const st = prog(t, F(2137), F(2140));
    stamp(ctx, 1290, 770, -0.12, lerp(1.6, 1, E.outCubic(st)), st, ORN, SAFE_STAMP);
    const ft = prog(t, F(2188), F(2191));
    stamp(ctx, 1600, 232, -0.06, lerp(1.5, 1, E.outCubic(ft)), ft, INK, FILED_STAMP);
  }

  const S22 = {
    name: 'FORM 7-B · That was safe enough',
    start: F(2096), end: F(2221), bloom: 0.08, vignette: 0.45,
    draw(ctx, t) {
      if (!FORM) FORM = buildForm();
      ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM22);
      ctx.save(); applyCam(ctx, c); drawFormLive(ctx, t); ctx.restore();
      camBlur(ctx, CAM22, t, 1.4);
      const fk = 1 - prog(t, F(2096), F(2099));
      if (fk > 0) { ctx.fillStyle = `rgba(255,250,240,${fk})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  // =====================================================================
  // SCENE 23 · Neural net: Forward M L P, backward, repeat   (frames 2221–2340)
  // =====================================================================
  const LAYERS = [
    { x: 516, n: 4, y0: 417, dy: 78 },
    { x: 921, n: 6, y0: 324, dy: 78.6 },
    { x: 1320, n: 6, y0: 324, dy: 78.6 },
    { x: 1725, n: 3, y0: 414, dy: 81 },
  ];
  const nodeY = (L, i) => L.y0 + i * L.dy;
  // the "front" travels forward (0→3) and backward (3→0) through the layers
  const FRONT = t => kf(t, [[F(2229), -0.2], [F(2232), 0, E.linear], [F(2250), 0.4, E.linear], [F(2256), 1, E.linear], [F(2266), 2, E.linear], [F(2276), 3, E.linear], [F(2290), 3, E.linear], [F(2300), 0, E.linear], [F(2312), 3, E.linear], [F(2326), 0, E.linear], [F(2340), 3, E.linear]]);
  const CYCLE = t => (t < F(2290) ? 0 : t < F(2300) ? 1 : t < F(2312) ? 2 : t < F(2326) ? 3 : 4);
  const lit = (li, i, cyc) => li === 0 || hash(li * 31 + i * 7 + cyc * 13) > 0.45;
  const CAM23 = camKeys([
    [F(2221), [702, 475, 1.4, 0]],
    [F(2255), [874, 427, 1.24, 0], E.inOutSine],
    [F(2272), [1020, 543, 1.0, 0], E.inOutSine],
    [F(2300), [960, 540, 1.0, 0], E.inOutSine],
    [F(2325), [1110, 545, 1.0, 0], E.inOutSine],
    [F(2341), [1180, 540, 1.04, 0], E.linear],
  ]);
  const HEAD = [['Forward', F(2229), 216, 'type'], ['M', F(2250), 855], ['L', F(2261), 1315], ['P,', F(2271), 1680]];

  const S23 = {
    name: 'Neural net · Forward M L P, backward, repeat',
    start: F(2221), end: F(2341), bloom: 0.08, vignette: 0.45,
    draw(ctx, t) {
      ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM23);
      ctx.save(); applyCam(ctx, c);
      const fr = FRONT(t), cyc = CYCLE(t), back = cyc % 2 === 1;
      // edges
      for (let li = 0; li < 3; li++) {
        const A = LAYERS[li], B = LAYERS[li + 1];
        const on = back ? fr <= li + 0.01 : fr >= li + 1;
        const grow = back ? clamp(li + 1 - fr) : clamp(fr - li);
        for (let i = 0; i < A.n; i++) for (let j = 0; j < B.n; j++) {
          const hot = (on || grow > 0) && lit(li, i, cyc) && lit(li + 1, j, cyc) && t >= F(2250);
          ctx.strokeStyle = hot ? `rgba(236,90,28,${0.35 + 0.4 * grow})` : 'rgba(40,36,32,0.38)';
          ctx.lineWidth = hot ? 1.4 : 1;
          const k = hot && grow < 1 ? grow : 1;
          const x0 = back ? B.x : A.x, y0 = back ? nodeY(B, j) : nodeY(A, i), x1 = back ? A.x : B.x, y1 = back ? nodeY(A, i) : nodeY(B, j);
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, hot ? k : 1), lerp(y0, y1, hot ? k : 1)); ctx.stroke();
        }
      }
      // output → L
      ctx.strokeStyle = 'rgba(40,36,32,0.6)'; ctx.lineWidth = 1.2;
      for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.moveTo(1725, nodeY(LAYERS[3], j)); ctx.lineTo(1840, 495); ctx.stroke(); }
      ctx.font = `italic 400 30px ${FONT.serif}`; ctx.fillStyle = INK; ctx.fillText('L', 1850, 505);
      // nodes
      LAYERS.forEach((L, li) => {
        for (let i = 0; i < L.n; i++) {
          const on = (back ? fr <= li + 0.2 : fr >= li - 0.2) && lit(li, i, cyc) && t >= F(2231);
          ctx.beginPath(); ctx.arc(L.x, nodeY(L, i), 17, 0, TAU);
          ctx.fillStyle = on ? ORN : PAPER; ctx.fill();
          ctx.strokeStyle = on ? '#9a3510' : '#2a2724'; ctx.lineWidth = 2; ctx.stroke();
        }
      });
      // labels
      font(ctx, 500, 11, FONT.mono); ctx.fillStyle = 'rgba(29,27,25,0.7)'; ctx.textAlign = 'center';
      [['INPUT x', 516, 640], ['HIDDEN h₁', 921, 760], ['HIDDEN h₂', 1320, 760], ['OUTPUT ŷ', 1725, 640]].forEach(([s, x, y]) => ctx.fillText(s, x, y));
      ctx.font = `italic 400 26px ${FONT.serif}`;
      [['W₁', 720, 730], ['W₂', 1120, 730], ['W₃', 1520, 730]].forEach(([s, x, y]) => ctx.fillText(s, x, y));
      ctx.textAlign = 'left';
      font(ctx, 600, 11, FONT.mono); ctx.fillStyle = 'rgba(29,27,25,0.75)'; ctx.fillText('FORWARD PASS  →', 642, 294);
      if (t >= F(2265)) {
        font(ctx, 500, 11, FONT.mono); ctx.fillStyle = 'rgba(29,27,25,0.7)';
        ctx.fillText(`EPOCH ${String(43 + cyc).padStart(6, '0')}`, 1830, 240);
        ctx.fillText(`LOSS ${(0.693 - cyc * 0.0005).toFixed(4)}`, 1830, 256);
        if (back || cyc > 1) ctx.fillText(`← BACKWARD PASS  (${31 + cyc}/94)`, 1700, 296);
      }
      font(ctx, 400, 10, FONT.mono); ctx.fillStyle = 'rgba(29,27,25,0.5)';
      ctx.fillText('SCHEMATIC — NOT TO SCALE — DO NOT OPERATE UNSUPERVISED', 200, 70);
      ctx.fillRect(200, 78, 1700, 1);
      // headline
      let act = -1; HEAD.forEach((h, i) => { if (t >= h[1]) act = i; });
      HEAD.forEach(([s, t0, x, mode], i) => {
        if (t < t0) return;
        font(ctx, 900, 132, FONT.wide);
        const str = mode === 'type' ? s.slice(0, Math.floor(clamp((t - t0) * 20, 1, s.length))) : s;
        const hot = i === act && i > 0 && t < F(2290);
        ctx.fillStyle = INK;
        ctx.fillText(str, x, 230);
        if (hot) { ctx.fillStyle = ORN; ctx.fillRect(x, 252, ctx.measureText(str).width, 9); }
      });
      // backward, (mirrored) and repeat
      if (t >= F(2290)) {
        ctx.save();
        font(ctx, 900, 100, FONT.wide);
        const w = ctx.measureText('backward,').width;
        const k = E.outCubic(prog(t, F(2290), F(2295)));
        ctx.translate(1800, 870); ctx.scale(-1, 1); ctx.globalAlpha = k;
        ctx.fillStyle = INK; ctx.fillText('backward,', 0, 0);
        void w;
        ctx.restore();
      }
      if (t >= F(2309)) {
        font(ctx, 900, 100, FONT.wide); ctx.fillStyle = INK; ctx.fillText('repeat', 414, 873);
        font(ctx, 600, 18, FONT.mono); ctx.fillStyle = ORN; ctx.fillText(`×${cyc - 1}`, 414 + ctx.measureText('repeat').width + 20, 880);
      }
      ctx.restore();
      camBlur(ctx, CAM23, t, 1);
    },
  };

  // =====================================================================
  // SCENE 24 · Now von Neumann's obsolete (paper tears)      (frames 2341–2436)
  // =====================================================================
  function box(g, x, y, w, h, title, sub, fill) {
    g.fillStyle = 'rgba(40,36,32,0.25)'; g.fillRect(x + 6, y + 6, w, h);
    g.fillStyle = fill || PAPER; g.fillRect(x, y, w, h);
    g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(x, y, w, h);
    g.textAlign = 'center';
    g.font = `700 13px ${FONT.mono}`; g.fillStyle = INK; g.fillText(title, x + w / 2, y + h / 2 - 2 + (sub ? 0 : 5));
    if (sub) { g.font = `400 10px ${FONT.mono}`; g.fillStyle = 'rgba(29,27,25,0.6)'; g.fillText(sub, x + w / 2, y + h / 2 + 16); }
    g.textAlign = 'left';
  }
  function arrow(g, x0, y0, x1, y1) {
    g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0);
    g.fillStyle = INK; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - Math.cos(a - 0.4) * 12, y1 - Math.sin(a - 0.4) * 12); g.lineTo(x1 - Math.cos(a + 0.4) * 12, y1 - Math.sin(a + 0.4) * 12); g.fill();
  }
  function vnPage(g, t) {
    g.fillStyle = PAPER; g.fillRect(-200, -200, W + 400, H + 400);
    g.font = `500 12px ${FONT.mono}`; g.fillStyle = INK;
    g.fillText('APPENDIX C  —  LEGACY ARCHITECTURES  (FOR REFERENCE ONLY)', 236, 128);
    g.fillRect(234, 140, 1450, 1.5);
    // headline typed word by word
    const words = [['Now', F(2341)], ['von', F(2350)], ['Neumann’s', F(2371)]];
    g.font = `900 92px ${FONT.wide}`; g.fillStyle = INK;
    let x = 234;
    words.forEach(([w, t0]) => { if (t >= t0) g.fillText(w, x, 262); x += g.measureText(w + ' ').width; });
    // diagram
    if (t >= F(2343)) {
      box(g, 255, 450, 230, 135, 'INPUT', 'device');
      g.strokeStyle = INK; g.lineWidth = 2.2; g.strokeRect(669, 375, 591, 291);
      g.font = `700 12px ${FONT.mono}`; g.fillStyle = INK; g.fillText('CENTRAL PROCESSING UNIT', 690, 400);
      box(g, 700, 420, 240, 95, 'CONTROL UNIT', 'decode', t >= F(2371) && t < F(2405) ? '#d6d0c6' : null);
      box(g, 980, 420, 250, 95, 'ALU', 'arithmetic · logic');
      box(g, 700, 545, 530, 90, 'REGISTERS', 'PC · IR · ACC · MAR · MDR');
      box(g, 1440, 465, 234, 135, 'OUTPUT', 'device');
      box(g, 666, 780, 594, 105, 'MEMORY UNIT', 'instructions + data, one bus', t >= F(2405) ? '#d6d0c6' : null);
      arrow(g, 485, 517, 665, 517); arrow(g, 1262, 517, 1436, 530);
      arrow(g, 900, 690, 900, 776); arrow(g, 1020, 776, 1020, 690); arrow(g, 900, 760, 900, 670);
      g.font = `italic 400 22px ${FONT.serif}`; g.fillStyle = 'rgba(29,27,25,0.8)';
      g.fillText('the bottleneck', 1050, 738);
      g.font = `italic 400 19px ${FONT.serif}`;
      g.fillText('Fig. C.1 — The stored-program computer (1945).', 1296, 812);
      g.fillText('One memory, one bus, one thing at a time.', 1296, 836);
    }
    // the orange X
    const x1 = prog(t, F(2406), F(2410)), x2 = prog(t, F(2409), F(2413));
    g.strokeStyle = ORN; g.lineWidth = 9; g.lineCap = 'round';
    if (x1 > 0) { g.beginPath(); g.moveTo(369, 383); g.lineTo(lerp(369, 1590, x1), lerp(383, 932, x1)); g.stroke(); }
    if (x2 > 0) { g.beginPath(); g.moveTo(409, 940); g.lineTo(lerp(409, 1564, x2), lerp(940, 362, x2)); g.stroke(); }
    g.lineCap = 'butt';
    // "obsolete" handwritten
    const ok = prog(t, F(2410), F(2424));
    if (ok > 0) {
      g.save(); g.beginPath(); g.rect(1330, 160, 330 * ok, 140); g.clip();
      g.font = `italic 600 92px ${FONT.serif}`; g.fillStyle = ORN; g.fillText('obsolete', 1338, 262);
      g.restore();
    }
  }
  const CAM24 = camKeys([
    [F(2341), [730, 215, 1.5, -0.03]],
    [F(2365), [760, 240, 1.45, -0.02], E.linear],
    [F(2373), [938, 516, 1.09, 0], E.inOutCubic],
    [F(2390), [960, 540, 1.0, 0], E.inOutSine],
    [F(2418), [980, 574, 1.13, 0], E.inOutSine],
    [F(2427), [985, 576, 1.14, 0], E.linear],
  ]);
  let PAGE = null;
  const TEAR = (() => { const p = []; for (let y = -300; y <= 1400; y += 22) p.push([990 + (hash(y * 0.37) - 0.5) * 90 + Math.sin(y * 0.01) * 40, y]); return p; })();
  const S24 = {
    name: 'Now von Neumann’s obsolete',
    start: F(2341), end: F(2436), bloom: 0.08, vignette: 0.45,
    draw(ctx, t) {
      const c = cam2(t, CAM24);
      const tear = prog(t, F(2426), F(2438));
      if (tear <= 0) {
        ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
        ctx.save(); applyCam(ctx, c); vnPage(ctx, t); ctx.restore();
        camBlur(ctx, CAM24, t, 1);
        return;
      }
      // render the page once into an offscreen canvas, then rip it in two
      if (!PAGE) { PAGE = document.createElement('canvas'); PAGE.width = W; PAGE.height = H; }
      const g = PAGE.getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
      g.save(); applyCam(g, c); vnPage(g, F(2425)); g.restore();
      ctx.fillStyle = '#050404'; ctx.fillRect(0, 0, W, H);
      const e = E.inCubic(tear);
      [-1, 1].forEach(side => {
        ctx.save();
        const tx = side * (60 + 700 * e), ty = 200 * e + 1100 * e * e, rot = side * (0.12 + 0.6 * e) - 0.1;
        ctx.translate(960 + tx, 540 + ty); ctx.rotate(rot); ctx.scale(1 - 0.3 * e, 1 - 0.3 * e); ctx.translate(-960, -540);
        ctx.beginPath();
        if (side < 0) { ctx.moveTo(-400, -300); TEAR.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(-400, 1400); }
        else { ctx.moveTo(2400, -300); TEAR.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(2400, 1400); }
        ctx.closePath();
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 40; ctx.fillStyle = PAPER; ctx.fill(); ctx.shadowBlur = 0;
        ctx.clip();
        ctx.drawImage(PAGE, 0, 0);
        // torn fibres along the edge
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 6;
        ctx.beginPath(); TEAR.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
        ctx.restore();
      });
    },
  };

  // =====================================================================
  // SCENE 25 · Roadmap: SHARP TURN AND THERE (continues in part 6)   (frames 2436–2500)
  // =====================================================================
  const MILES = [
    { y: 0, k: 'SRR', d: 'System Requirements Review', tm: 'T-120 d', done: true },
    { y: -350, k: 'PDR', d: 'Preliminary Design Review', tm: 'T-98 d' },
    { y: -700, k: 'CDR', d: 'Critical Design Review', tm: 'T-40 d' },
  ];
  const CAM25A = camKeys([
    [F(2436), [9, -80, 0.85, 0]],
    [F(2439), [9, -272, 1.0, 0], E.outCubic],
    [F(2442), [9, -349, 1.09, 0], E.linear],
    [F(2448), [9, -459, 1.87, 0], E.inOutSine],
    [F(2454), [9, -590, 2.14, 0], E.inOutSine],
    [F(2458), [9, -640, 2.6, 0.9], E.inCubic],
  ]);
  const HEADA = t => kf(t, [[F(2433), 300], [F(2436), 146, E.linear], [F(2439), -20, E.outCubic], [F(2448), -350, E.inOutSine], [F(2454), -472, E.linear], [F(2458), -540, E.linear]]);
  function topo(ctx, cx, cy, n, r0, dr, seed, a) {
    ctx.save();
    ctx.strokeStyle = `rgba(225,220,212,${a})`; ctx.lineWidth = 1.2;
    for (let k = 0; k < n; k++) {
      const r = r0 + k * dr;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const an = i / 90 * TAU, w = 1 + 0.18 * noise2(Math.cos(an) * 1.5 + seed, Math.sin(an) * 1.5 + k * 0.15);
        const x = cx + Math.cos(an) * r * w, y = cy + Math.sin(an) * r * w;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  // thick, embossed crater rim: several bright parallel rings
  function rim(ctx, cx, cy, r, a, z) {
    ctx.save();
    for (let k = 0; k < 5; k++) {
      ctx.strokeStyle = `rgba(236,230,220,${a * (k === 2 ? 1 : 0.45)})`; ctx.lineWidth = (k === 2 ? 4 : 1.6) / z;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) { const an = i / 120 * TAU, w = 1 + 0.03 * noise2(Math.cos(an) * 2 + k * 0.02, Math.sin(an) * 2); const rr = (r + k * 12) * w; i ? ctx.lineTo(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr) : ctx.moveTo(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr); }
      ctx.stroke();
    }
    ctx.restore();
  }
  function condensed(ctx, str, x, y, size, color, glow) {
    ctx.save();
    font(ctx, 900, size, FONT.wide, 'extra-condensed');
    ctx.textAlign = 'center';
    ctx.fillStyle = color; ctx.shadowColor = glow || 'transparent'; ctx.shadowBlur = glow ? 12 : 0;
    ctx.translate(x, y); ctx.scale(1, 1.25);
    ctx.fillText(str, 0, 0);
    ctx.restore();
  }
  function orangeLine(ctx, x, y0, y1, z) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,90,25,0.45)'; ctx.lineWidth = 14 / z; ctx.filter = 'blur(6px)';
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.filter = 'none';
    ctx.strokeStyle = '#ff7a32'; ctx.lineWidth = 4 / z; ctx.shadowColor = OG; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
    ctx.restore();
  }
  function roadmapA(ctx, t) {
    const c = cam2(t, CAM25A);
    ctx.save(); applyCam(ctx, c);
    // floor grid + topo
    ctx.strokeStyle = 'rgba(225,220,212,0.06)'; ctx.lineWidth = 1 / c.z;
    ctx.beginPath(); for (let x = -1400; x <= 1400; x += 120) { ctx.moveTo(x, -1600); ctx.lineTo(x, 800); } for (let y = -1600; y <= 800; y += 120) { ctx.moveTo(-1400, y); ctx.lineTo(1400, y); } ctx.stroke();
    topo(ctx, -900, -350, 9, 120, 55, 3, 0.22);
    rim(ctx, -1150, -350, 620, 0.55, c.z);
    // month ruler
    font(ctx, 400, 11, FONT.mono); ctx.fillStyle = 'rgba(225,220,212,0.4)';
    ['FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'].forEach((m, i) => { const y = 80 - i * 180; ctx.fillRect(-300, y, 12, 1.4); ctx.fillText(m, -340, y + 4); });
    ctx.fillRect(-294, -1200, 1.2, 1400);
    // dashed critical path
    ctx.strokeStyle = 'rgba(235,230,222,0.75)'; ctx.lineWidth = 2 / c.z; ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(0, -1300); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(235,230,222,0.5)'; ctx.fillRect(10, -560, 120, 1.4);
    font(ctx, 400, 12, FONT.mono); ctx.fillText('critical path (do not deviate)', 140, -556);
    MILES.forEach(m => {
      ctx.save(); ctx.translate(0, m.y); ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#100f0e'; ctx.strokeStyle = '#ece6dc'; ctx.lineWidth = 2.5 / c.z;
      ctx.fillRect(-11, -11, 22, 22); ctx.strokeRect(-11, -11, 22, 22);
      ctx.fillStyle = '#ece6dc'; ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();
      ctx.strokeStyle = m.done ? ORN : 'rgba(235,230,222,0.7)'; ctx.lineWidth = 2 / c.z; ctx.strokeRect(-90, m.y - 12, 24, 24);
      if (m.done) { ctx.beginPath(); ctx.moveTo(-85, m.y); ctx.lineTo(-78, m.y + 8); ctx.lineTo(-68, m.y - 9); ctx.stroke(); font(ctx, 600, 8, FONT.mono); ctx.fillStyle = ORN; ctx.fillText('PASSED', -96, m.y + 28); }
      font(ctx, 700, 26, FONT.mono); ctx.fillStyle = '#ece6dc'; ctx.fillText(m.k, 42, m.y - 22);
      font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(236,230,220,0.75)'; ctx.fillText(m.d, 42, m.y);
      ctx.fillStyle = 'rgba(236,230,220,0.45)'; ctx.fillText(m.tm, 42, m.y + 16);
      ctx.strokeStyle = 'rgba(236,230,220,0.4)'; ctx.lineWidth = 1 / c.z; ctx.beginPath(); ctx.moveTo(14, m.y - 4); ctx.lineTo(36, m.y - 14); ctx.stroke();
    });
    // roadmap card
    ctx.save(); ctx.translate(250, 20); ctx.rotate(-0.04);
    ctx.fillStyle = 'rgba(16,15,14,0.92)'; ctx.fillRect(0, 0, 330, 150);
    ctx.strokeStyle = 'rgba(236,230,220,0.6)'; ctx.lineWidth = 1.5 / c.z; ctx.strokeRect(0, 0, 330, 150);
    font(ctx, 700, 13, FONT.mono); ctx.fillStyle = '#ece6dc'; ctx.fillText('ROADMAP — AGI, v1.0', 12, 24);
    font(ctx, 400, 10, FONT.mono); ctx.fillStyle = 'rgba(236,230,220,0.6)';
    ['REV 3 · SUPERSEDES REV 2 (ALSO FINE)', 'ALIGNMENT TEAM          —', 'FUNDING         NOT TO SCALE', 'ETA             SOON'].forEach((s, i) => { ctx.fillRect(0, 36 + i * 28, 330, 1); ctx.fillText(s, 12, 54 + i * 28); });
    ctx.restore();
    font(ctx, 600, 12, FONT.mono); ctx.fillStyle = 'rgba(236,230,220,0.7)'; ctx.fillText('YOU ARE HERE  →', -270, 168);
    // orange path
    const hy = HEADA(t);
    orangeLine(ctx, 0, 600, hy, c.z);
    pen(ctx, 0, hy, 0.8 / c.z, 1);
    // SHARP
    if (t >= F(2438)) condensed(ctx, 'SHARP', 0, -140, 150, `rgba(255,106,31,${prog(t, F(2438), F(2440))})`, OG);
    ctx.restore();
    return c;
  }
  // part B: tilted view with TURN, then top-down map toward the target
  const CAM25B = camKeys([
    [F(2461), [0, 30, 1.0, 0]],
    [F(2467), [0, -332, 1.0, 0], E.inOutCubic],
    [F(2486), [0, -850, 1.0, 0], E.inOutSine],
    [F(2490), [0, -864, 1.0, 0], E.linear],
    [F(2494), [0, -842, 1.6, 0], E.inOutCubic],
    [F(2501), [0, -838, 1.66, 0], E.linear],
  ]);
  const HEADB = t => kf(t, [[F(2461), 220], [F(2467), -380, E.linear], [F(2486), -820, E.inOutSine]]);
  function roadmapB(ctx, t) {
    const c = cam2(t, CAM25B);
    ctx.save(); applyCam(ctx, c);
    ctx.strokeStyle = 'rgba(225,220,212,0.05)'; ctx.lineWidth = 1 / c.z;
    ctx.beginPath(); for (let x = -1400; x <= 1400; x += 140) { ctx.moveTo(x, -2000); ctx.lineTo(x, 600); } for (let y = -2000; y <= 600; y += 140) { ctx.moveTo(-1400, y); ctx.lineTo(1400, y); } ctx.stroke();
    // crater rings around the target
    topo(ctx, 0, -820, 4, 300, 70, 7, 0.22);
    rim(ctx, 0, -820, 560, 0.75, c.z);
    topo(ctx, -60, -880, 4, 700, 70, 11, 0.14);
    // crescent cut on the left
    ctx.save(); ctx.strokeStyle = 'rgba(235,230,222,0.55)'; ctx.lineWidth = 3 / c.z;
    ctx.lineWidth = 4 / c.z;
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(-120, -800, 250 + k * 16, 1.9, 4.3); ctx.stroke(); }
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(-370, -560, 40 - k * 12, 0.9, 4.2); ctx.stroke(); }
    ctx.restore();
    topo(ctx, -700, -100, 6, 100, 60, 2, 0.12);
    topo(ctx, 650, -300, 5, 90, 60, 5, 0.1);
    // ruler (tilted shot)
    if (t < F(2467)) {
      ctx.fillStyle = 'rgba(235,230,222,0.55)'; ctx.fillRect(-900, 200, 1800, 2);
      for (let i = -18; i <= 18; i++) ctx.fillRect(i * 48, i % 4 ? 194 : 186, 2, i % 4 ? 12 : 28);
      ctx.save(); ctx.translate(-660, 420); ctx.rotate(-1.2); condensed(ctx, 'SHARP', 0, 0, 110, 'rgba(240,235,228,0.85)'); ctx.restore();
      ctx.strokeStyle = '#ff7a32'; ctx.lineWidth = 6; ctx.beginPath(); ctx.lineWidth = 12; ctx.moveTo(110, 420); ctx.lineTo(110, 300); ctx.moveTo(78, 336); ctx.lineTo(110, 300); ctx.lineTo(142, 336); ctx.stroke();
    }
    const hy = HEADB(t);
    orangeLine(ctx, 0, 700, hy, c.z);
    condensed(ctx, 'TURN', 0, 0, 140, '#ff6a1f', OG);
    if (t >= F(2484)) condensed(ctx, 'AND', 0, -380, 120, '#ff6a1f', OG);
    if (t >= F(2488)) condensed(ctx, 'THERE', 0, -630, 120, '#ff6a1f', OG);
    // the target
    const tk = prog(t, F(2486), F(2490));
    if (tk > 0) {
      halo(ctx, 0, -820, 140, '255,110,35', 0.7 * tk);
      const g = ctx.createRadialGradient(-10, -830, 5, 0, -820, 62);
      g.addColorStop(0, '#ffb070'); g.addColorStop(0.6, '#ff5a1a'); g.addColorStop(1, '#a8300a');
      ctx.globalAlpha = tk; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -820, 60 * E.outBack(tk), 0, TAU); ctx.fill();
      ctx.strokeStyle = '#ece6dc'; ctx.lineWidth = 2 / c.z;
      ctx.beginPath(); ctx.arc(0, -820, 90, 0, TAU); ctx.stroke();
      ctx.beginPath(); for (const a of [0.8, 2.35, 3.9, 5.5]) { ctx.moveTo(Math.cos(a) * 75, -820 + Math.sin(a) * 75); ctx.lineTo(Math.cos(a) * 125, -820 + Math.sin(a) * 125); } ctx.stroke();
      ctx.strokeStyle = 'rgba(255,70,40,0.5)'; ctx.lineWidth = 2.5 / c.z; ctx.beginPath(); ctx.arc(0, -820, 640, 0, TAU); ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      ctx.strokeStyle = 'rgba(235,230,222,0.7)'; ctx.lineWidth = 3 / c.z;
      ctx.beginPath(); ctx.arc(0, -820, 34, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -820, 20, 0, TAU); ctx.stroke();
    }
    if (tk < 1) pen(ctx, 0, hy, 0.8 / c.z, 1);
    // terra incognita
    ctx.save(); ctx.translate(500, -1180); ctx.rotate(1.3);
    ctx.font = `italic 500 64px ${FONT.serif}`; ctx.fillStyle = 'rgba(236,230,220,0.55)'; ctx.fillText('Terra incognita', 0, 0);
    ctx.restore();
    ctx.restore();
    return c;
  }
  const S25 = {
    name: 'Roadmap · SHARP TURN AND THERE',
    start: F(2436), end: 2500 / 30, vignette: 1,
    draw(ctx, t) {
      ctx.fillStyle = '#0d0c0b'; ctx.fillRect(0, 0, W, H);
      if (t < F(2461)) {
        roadmapA(ctx, t);
        camBlur(ctx, CAM25A, t, 1.2);
        if (t > F(2456)) PFX.zoomBlur(ctx, 960, 540, 0.25 * prog(t, F(2456), F(2460)), 6);
      } else {
        roadmapB(ctx, t);
        const k = 1 - prog(t, F(2461), F(2464));
        if (k > 0) PFX.zoomBlur(ctx, 960, 540, 0.25 * k, 6);
        camBlur(ctx, CAM25B, t, 0.8);
      }
    },
  };

  window.SHARED = Object.assign(window.SHARED || {}, { p5: { condensed, rim, topo, orangeLine, camBlur } });
  Timeline.add(S21, S22, S23, S24, S25);
})();
