// PART 7 — frames 3001–3500 (1:40.0 – 1:56.7)
// (frames 3001–3061: the paperclip floor from part 6 keeps running underneath)
// Scenes: NOW THERE'S NOWHERE LEFT TO GO → fuse "Too late now, we lit the fuse" → Orthogonality thesis / blues
//         → transformer tower "JUST TRANSFORMERS ALL THE WAY" TILL YOU LEARNED TO DISOBEY → POST-CHINCHILLA, SUPER-DENSE
(function () {
  'use strict';
  const {
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1,
    font, halo, pen, camKeys, cam2, applyCam, sparks, PFX, lookAt, Wire, planeText,
  } = K;
  const { camBlur } = window.SHARED.p5;

  const F = n => (n - 1) / 30;
  const OG = 'rgba(255,106,31,0.9)';
  const CREAM = 'rgba(236,230,220,';

  function fitSize(ctx, weight, str, width, family, stretch) {
    font(ctx, weight, 100, family, stretch);
    return 100 * width / ctx.measureText(str).width;
  }

  // =====================================================================
  // SCENE 31 · NOW THERE'S NOWHERE LEFT TO GO (over the clip floor)   (frames 3020–3062)
  // =====================================================================
  const NOWS = 'NOW THERE’S NOWHERE LEFT TO GO';
  const nowIdx = t => kf(t, [[F(3024), 0], [F(3028), 4, E.linear], [F(3031), 6, E.linear], [F(3041), 12, E.linear], [F(3045), 16, E.linear], [F(3051), 22, E.linear], [F(3056), 25, E.linear], [F(3062), 29, E.linear]]);
  const S31 = {
    name: 'NOW THERE’S NOWHERE LEFT TO GO',
    start: F(3020), end: F(3063), layer: 1,
    draw(ctx, t) {
      // the frame (clip floor) collapses into an orange scan line, text stays as a thin strip
      const sq = prog(t, F(3058), F(3062));
      if (sq > 0) {
        const c = PFX.full;
        c.g.clearRect(0, 0, W, H); c.g.drawImage(ctx.canvas, 0, 0);
        ctx.fillStyle = '#0a0908'; ctx.fillRect(0, 0, W, H);
        const k = lerp(1, 0.02, E.inCubic(sq));
        ctx.save(); ctx.globalAlpha = 1 - sq * 0.7; ctx.translate(0, 540); ctx.scale(1, k); ctx.translate(0, -540); ctx.drawImage(c, 0, 0); ctx.restore();
        ctx.fillStyle = `rgba(255,110,40,${0.9 * sq})`; ctx.fillRect(0, 539, W, 2.5);
        halo(ctx, 960, 540, 600, '255,110,40', 0.15 * sq);
      }
      const capH = kf(t, [[F(3021), 420], [F(3028), 390], [F(3045), 225, E.inOutSine], [F(3056), 105, E.inOutSine], [F(3060), 40, E.inQuad], [F(3062.5), 18, E.inQuad]]);
      const a = prog(t, F(3020), F(3026));
      const size = fitSize(ctx, 900, NOWS, 1665, FONT.wide, 'extra-condensed');
      const sy = capH / (size * 0.72);
      const idx = nowIdx(t);
      ctx.save();
      ctx.translate(120, 540 + capH * 0.5); ctx.scale(1, sy);
      font(ctx, 900, size, FONT.wide, 'extra-condensed');
      const xs = []; for (let i = 0; i <= NOWS.length; i++) xs.push(ctx.measureText(NOWS.slice(0, i)).width);
      for (let k = 6; k >= 1; k--) {
        ctx.globalAlpha = a * 0.9;
        ctx.fillStyle = `rgb(${40 + k * 6},${38 + k * 6},${36 + k * 6})`;
        ctx.fillText(NOWS, k * 1.5, k * 4 / sy * (1 - sq));
      }
      for (let i = 0; i < NOWS.length; i++) {
        const ii = Math.floor(idx), ws = NOWS.lastIndexOf(' ', ii) + 1;
        const hot = i >= ws && i <= idx, done = i < ws;
        ctx.fillStyle = hot ? '#ff6a1f' : done ? '#f4f0ea' : 'rgba(190,184,176,0.75)';
        ctx.globalAlpha = a;
        ctx.shadowColor = hot ? OG : 'transparent'; ctx.shadowBlur = hot ? 24 : 0;
        ctx.fillText(NOWS[i], xs[i], 0);
      }
      ctx.restore();
    },
  };

  // =====================================================================
  // SCENE 32 · Too late now, we lit the fuse   (frames 3063–3178)
  // =====================================================================
  const ropeY = x => 640 - 0.09 * x + 22 * Math.sin(x / 230 + 0.5);
  const FUSE = 'Too late now, we lit the fuse';
  const FX0 = 435, FS = 76;
  let FXS = null;
  const charAt = t => kf(t, [[F(3063), -6], [F(3075), -1, E.linear], [F(3081), 0, E.linear], [F(3087), 4, E.linear], [F(3091), 9, E.linear], [F(3101), 14, E.linear], [F(3108), 17, E.linear], [F(3113), 21, E.linear], [F(3121), 25, E.linear], [F(3150), 29, E.inOutSine], [F(3178), 30, E.linear]]);
  const CAM32 = camKeys([
    [F(3063), [960, 560, 1.0, 0]],
    [F(3091), [1000, 560, 1.02, 0], E.linear],
    [F(3101), [1305, 560, 1.05, 0], E.inOutSine],
    [F(3121), [1350, 540, 1.6, -0.05], E.inOutSine],
    [F(3141), [1380, 505, 2.3, -0.14], E.inOutSine],
    [F(3151), [1445, 488, 3.3, -0.3], E.inOutSine],
    [F(3178), [1510, 474, 3.5, -0.33], E.linear],
  ]);
  function rope(ctx, sx, z) {
    const wOf = x => lerp(7, 15, clamp(x / 1920));
    // burnt part
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = '#231a15'; ctx.lineWidth = 5;
    ctx.beginPath(); for (let x = -300; x <= sx; x += 10) x > -300 ? ctx.lineTo(x, ropeY(x)) : ctx.moveTo(x, ropeY(x)); ctx.stroke();
    // live braided part
    ctx.strokeStyle = '#2e2b29'; ctx.lineJoin = 'round';
    for (let x = sx; x < 2600; x += 40) { ctx.lineWidth = wOf(x) + 3; ctx.beginPath(); ctx.moveTo(x, ropeY(x)); ctx.lineTo(x + 42, ropeY(x + 42)); ctx.stroke(); }
    const P = [new Path2D(), new Path2D()];
    let i = 0;
    for (let x = sx; x < 2600; i++) {
      const w = wOf(x), ds = w * 0.55, y = ropeY(x);
      const ang = Math.atan2(ropeY(x + 2) - y, 2), nx = -Math.sin(ang), ny = Math.cos(ang), tx = Math.cos(ang), ty = Math.sin(ang);
      const s = i % 2 ? 1 : -1, h = w / 2;
      P[i % 2].moveTo(x + nx * h * s, y + ny * h * s); P[i % 2].lineTo(x + tx * ds * 1.4 - nx * h * s, y + ty * ds * 1.4 - ny * h * s);
      x += ds;
    }
    ctx.lineWidth = 1.6 / Math.sqrt(z); ctx.strokeStyle = '#d6d1ca'; ctx.stroke(P[0]); ctx.strokeStyle = '#8f8a85'; ctx.stroke(P[1]);
    ctx.restore();
  }
  const S32 = {
    name: 'Too late now, we lit the fuse',
    start: F(3063), end: F(3179), vignette: 1,
    draw(ctx, t) {
      const g = ctx.createRadialGradient(960, 520, 50, 960, 540, 1250);
      g.addColorStop(0, '#1c120d'); g.addColorStop(1, '#090707');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      if (!FXS) {
        font(ctx, 800, FS, FONT.sans);
        FXS = []; for (let i = 0; i <= FUSE.length; i++) FXS.push(ctx.measureText(FUSE.slice(0, i)).width);
      }
      const c = cam2(t, CAM32);
      ctx.save(); applyCam(ctx, c);
      const ci = charAt(t);
      const i0 = Math.floor(ci), fr = ci - i0;
      const sxp = ci < 0 ? FX0 + ci * 64 : FX0 + lerp(FXS[clamp(i0, 0, FUSE.length)], FXS[clamp(i0 + 1, 0, FUSE.length)], fr);
      rope(ctx, sxp, c.z);
      // lyric riding the rope
      font(ctx, 800, FS, FONT.sans);
      const ta = prog(t, F(3066), F(3072));
      for (let i = 0; i < FUSE.length; i++) {
        const ch = FUSE[i];
        if (ch === ' ') continue;
        const x = FX0 + FXS[i], w = FXS[i + 1] - FXS[i], mid = x + w / 2;
        const y = ropeY(mid) - 22, ang = Math.atan2(ropeY(mid + 20) - ropeY(mid - 20), 40);
        const lit = i < ci;
        const age = ci - i;
        ctx.save(); ctx.translate(mid, y); ctx.rotate(ang);
        ctx.globalAlpha = ta;
        ctx.fillStyle = lit ? (age < 3 ? '#ffb070' : '#ff6a1f') : 'rgba(160,154,148,0.82)';
        ctx.shadowColor = lit ? OG : 'rgba(0,0,0,0.6)'; ctx.shadowBlur = lit ? 26 : 8;
        ctx.fillText(ch, -w / 2, 0);
        ctx.restore();
      }
      // the burning tip
      const py = ropeY(sxp);
      sparks(ctx, sxp, py, t, { t0: F(3063), t1: F(3179), count: 900, angle: -1.9, spread: 1.3, speed: [40, 180], life: [0.1, 0.35], seed: 7, scale: 0.7 });
      halo(ctx, sxp, py, 40, '255,150,70', 0.9);
      pen(ctx, sxp, py, 1.1, 1);
      ctx.restore();
      const fi = 1 - prog(t, F(3063), F(3067));
      if (fi > 0) { ctx.fillStyle = `rgba(10,9,8,${fi})`; ctx.fillRect(0, 0, W, H); }
      camBlur(ctx, CAM32, t, 0.7);
    },
  };

  // =====================================================================
  // SCENE 33 · Orthogonality thesis + blues   (frames 3179–3297)
  // =====================================================================
  const OX = 330, OY = 828, XEND = 1665, YTOP = 240;
  const ORTHO = 'Orthogonality thesis';
  const orthoN = t => kf(t, [[F(3181), 0], [F(3185), 3, E.linear], [F(3191), 7, E.linear], [F(3200), 11, E.linear], [F(3215), 17, E.linear], [F(3231), 20, E.linear]]);
  const sparkX = t => kf(t, [[F(3179), 300], [F(3185), 498, E.linear], [F(3200), 828, E.linear], [F(3215), 990, E.linear], [F(3275), 1470, E.linear], [F(3297), 1560, E.linear]]);
  const CAM33 = camKeys([
    [F(3179), [778, 778, 1.47, 0]],
    [F(3195), [800, 760, 1.4, 0], E.linear],
    [F(3200), [908, 616, 1.13, 0], E.inOutSine],
    [F(3212), [960, 540, 1.0, 0], E.inOutSine],
    [F(3228), [1010, 500, 1.1, 0], E.inOutSine],
    [F(3235), [1084, 451, 1.19, 0.02], E.inOutSine],
    [F(3255), [1080, 461, 1.36, 0.05], E.inOutSine],
    [F(3270), [960, 540, 1.0, 0], E.inOutSine],
    [F(3282), [1000, 560, 1.0, 0], E.linear],
    [F(3297), [1485, 756, 1.0, -0.05], E.inCubic],
  ]);
  const archA = t => kf(t, [[F(3215), 0], [F(3230), 25], [F(3255), 150, E.inOutSine], [F(3275), 35, E.inOutSine], [F(3297), 25]]);
  const lineY = (x, t) => 624 - archA(t) * Math.max(0, 1 - Math.abs(x - 1047) / 640);
  const LABELS = [
    ['golden retriever', 570, 339], ['the market', 1050, 300], ['helpful assistant (claimed)', 1260, 405], ['you', 600, 534],
    ['the blue note', 735, 465], ['thermostat', 525, 690], ['evolution', 720, 678], ['a committee', 990, 663],
    ['chess engine', 900, 729], ['me · P(doom) 0.82', 1230, 699], ['paperclip maximizer', 1350, 744],
  ];
  const DOTS = Array.from({ length: 150 }, (_, i) => ({ x: lerp(380, 1640, hash(i * 1.7)), y: lerp(270, 800, hash(i * 2.9)), k: Math.floor(hash(i * 4.1) * 3), t: lerp(F(3203), F(3240), hash(i * 6.3)) }));
  const BLUES = 'blues';
  const bluesN = t => kf(t, [[F(3222), 0], [F(3226), 1, E.linear], [F(3238), 4, E.linear], [F(3246), 5, E.linear]]);
  const S33 = {
    name: 'Orthogonality thesis · blues',
    start: F(3179), end: F(3298), vignette: 1,
    draw(ctx, t) {
      const g = ctx.createRadialGradient(1100, 540, 50, 960, 540, 1300);
      g.addColorStop(0, '#1e130d'); g.addColorStop(1, '#090707');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM33);
      ctx.save(); applyCam(ctx, c);
      const sx = sparkX(t);
      // x axis (starts life as the spark's trail), y axis, labels
      ctx.strokeStyle = CREAM + '0.75)'; ctx.lineWidth = 1.6 / c.z;
      ctx.beginPath(); ctx.moveTo(t < F(3195) ? 300 : OX, OY); ctx.lineTo(sx, OY); ctx.stroke();
      ctx.setLineDash([5, 7]); ctx.strokeStyle = CREAM + '0.3)';
      ctx.beginPath(); ctx.moveTo(sx, OY); ctx.lineTo(t < F(3195) ? 2000 : XEND, OY); ctx.stroke(); ctx.setLineDash([]);
      const ya = E.outCubic(prog(t, F(3194), F(3202)));
      if (ya > 0) {
        ctx.strokeStyle = CREAM + '0.75)';
        ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(OX, lerp(OY, YTOP, ya)); ctx.moveTo(OX - 7, YTOP + 12); ctx.lineTo(OX, YTOP); ctx.lineTo(OX + 7, YTOP + 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(XEND - 12, OY - 7); ctx.lineTo(XEND, OY); ctx.lineTo(XEND - 12, OY + 7); ctx.stroke();
        font(ctx, 600, 12, FONT.mono); ctx.fillStyle = CREAM + `${0.7 * ya})`;
        ctx.fillText('GOALS ↑', OX + 14, YTOP + 4); ctx.fillText('INTELLIGENCE →', XEND - 130, OY + 30);
      }
      // scattered systems
      ctx.save();
      DOTS.forEach(d => {
        const a = prog(t, d.t, d.t + 0.2);
        if (a <= 0) return;
        ctx.globalAlpha = a * 0.8; ctx.strokeStyle = CREAM + '0.8)'; ctx.fillStyle = CREAM + '0.8)'; ctx.lineWidth = 1.2 / c.z;
        if (d.k === 0) { ctx.beginPath(); ctx.arc(d.x, d.y, 2.2, 0, TAU); ctx.fill(); }
        else if (d.k === 1) { ctx.beginPath(); ctx.arc(d.x, d.y, 4.5, 0, TAU); ctx.stroke(); }
        else { ctx.beginPath(); ctx.moveTo(d.x - 4, d.y - 4); ctx.lineTo(d.x + 4, d.y + 4); ctx.moveTo(d.x + 4, d.y - 4); ctx.lineTo(d.x - 4, d.y + 4); ctx.stroke(); }
      });
      LABELS.forEach(([s, x, y], i) => {
        const a = prog(t, F(3218) + i * 0.08, F(3224) + i * 0.08);
        if (a <= 0) return;
        ctx.globalAlpha = a;
        ctx.strokeStyle = CREAM + '0.85)'; ctx.lineWidth = 1.4 / c.z;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 2, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + 7, y); ctx.lineTo(x + 22, y); ctx.stroke();
        font(ctx, 400, 12, FONT.mono); ctx.fillStyle = s.includes('P(doom)') ? '#ff6a1f' : CREAM + '0.8)'; ctx.fillText(s, x + 28, y + 4);
      });
      // music staff with orange notes
      const ma = prog(t, F(3262), F(3268));
      if (ma > 0) {
        ctx.globalAlpha = ma; ctx.strokeStyle = CREAM + '0.6)'; ctx.lineWidth = 1 / c.z;
        for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(595, 380 + k * 6); ctx.lineTo(665, 380 + k * 6); ctx.stroke(); }
        ctx.fillStyle = '#ff6a1f'; [[615, 398], [640, 392]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 5, 3.5, -0.4, 0, TAU); ctx.fill(); ctx.fillRect(x + 4, y - 18, 1.5, 18); });
        font(ctx, 400, 11, FONT.mono); ctx.fillStyle = CREAM + '0.6)'; ctx.fillText('b-flat', 595, 430);
        ctx.font = `italic 500 20px ${FONT.serif}`; ctx.fillStyle = CREAM + '0.55)'; ctx.fillText('Any level of intelligence, any final goal.', 1290, 222);
      }
      ctx.restore();
      // the r = 0 line, bending into a tent under "blues"
      const la = prog(t, F(3205), F(3212));
      if (la > 0) {
        ctx.save(); ctx.globalAlpha = la;
        if (t < F(3228)) ctx.setLineDash([8, 8]);
        ctx.strokeStyle = CREAM + '0.85)'; ctx.lineWidth = 2.2 / c.z;
        ctx.beginPath(); for (let x = 420; x <= 1650; x += 10) x > 420 ? ctx.lineTo(x, lineY(x, t)) : ctx.moveTo(x, lineY(x, t)); ctx.stroke(); ctx.setLineDash([]);
        font(ctx, 400, 12, FONT.mono); ctx.fillStyle = CREAM + '0.7)'; ctx.fillText('r = 0.00', 1665, 628); ctx.fillText('n = 162', 1665, 646);
        ctx.restore();
      }
      // vib. ~~~ and the octave arrow
      const va = prog(t, F(3240), F(3246));
      if (va > 0) {
        ctx.save(); ctx.globalAlpha = va; ctx.strokeStyle = CREAM + '0.7)'; ctx.lineWidth = 1.6 / c.z;
        ctx.beginPath(); for (let x = 880; x <= 1040; x += 2) { const y = 385 - archA(t) * 0.6 + Math.sin((x + t * 200) / 6) * 4; x > 880 ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        font(ctx, 400, 13, FONT.mono); ctx.fillStyle = CREAM + '0.7)'; ctx.fillText('vib.', 835, 390 - archA(t) * 0.6);
        ctx.beginPath(); ctx.moveTo(1300, 700); ctx.quadraticCurveTo(1310, 470, 1366, 368); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1356, 382); ctx.lineTo(1366, 368); ctx.lineTo(1370, 385); ctx.stroke();
        ctx.fillText('(one octave)', 1330, 330); ctx.fillText('+12', 1350, 350);
        ctx.restore();
      }
      // "blues" in a serif italic, riding the line
      if (t >= F(3214)) {
        ctx.save();
        ctx.font = `italic 600 172px ${FONT.serif}`;
        const n = bluesN(t), white = prog(t, F(3246), F(3256));
        let x = 870;
        for (let i = 0; i < BLUES.length; i++) {
          const w = ctx.measureText(BLUES[i]).width, mid = x + w / 2;
          const y = lineY(mid, t) - 92, ang = Math.atan2(lineY(mid + 20, t) - lineY(mid - 20, t), 40);
          ctx.save(); ctx.translate(mid, y); ctx.rotate(ang);
          if (i < n) {
            const k = clamp(n - i);
            ctx.globalAlpha = k;
            ctx.fillStyle = white > 0 ? `rgb(${Math.round(lerp(255, 244, white))},${Math.round(lerp(150, 238, white))},${Math.round(lerp(80, 228, white))})` : (i === Math.floor(n) - 1 ? '#ffd2a8' : '#ff9a52');
            ctx.shadowColor = 'rgba(255,120,40,0.7)'; ctx.shadowBlur = 20 * (1 - white);
            ctx.fillText(BLUES[i], -w / 2, 0);
          } else {
            ctx.strokeStyle = `rgba(200,190,180,${t < F(3221) ? 0.3 : 0.5})`; ctx.lineWidth = 1.5;
            ctx.strokeText(BLUES[i], -w / 2, 0);
          }
          ctx.restore();
          x += w;
        }
        ctx.restore();
      }
      // the travelling spark on the x axis
      sparks(ctx, sx, OY, t, { t0: F(3179), t1: F(3298), count: 500, angle: -1.6, spread: 1.4, speed: [30, 140], life: [0.1, 0.3], seed: 3, scale: 0.6 });
      halo(ctx, sx, OY, 36, '255,150,70', 0.9); pen(ctx, sx, OY, 0.9, 1);
      // title karaoke
      font(ctx, 500, 72, FONT.sans);
      const on = orthoN(t);
      let tx = 390;
      for (let i = 0; i < ORTHO.length; i++) {
        ctx.fillStyle = i < on ? '#f2ede6' : 'rgba(150,144,138,0.55)';
        ctx.fillText(ORTHO[i], tx, 925); tx += ctx.measureText(ORTHO[i]).width;
      }
      ctx.restore();
      camBlur(ctx, CAM33, t, 0.4);
    },
  };

  // =====================================================================
  // SCENE 34 · Transformer tower: “JUST TRANSFORMERS ALL THE WAY” TILL YOU LEARNED TO DISOBEY   (frames 3298–3456)
  // =====================================================================
  const BZ = i => -i * 4.4;
  let TOWER = null;
  function buildTower() {
    const w = new Wire();
    for (let i = 0; i <= 18; i++) {
      const z = BZ(i), c = 0.35;
      const face = y => [[-3 + c, y, z + 1.6], [3 - c, y, z + 1.6], [3, y, z + 1.6 - c], [3, y, z - 1.6 + c], [3 - c, y, z - 1.6], [-3 + c, y, z - 1.6], [-3, y, z - 1.6 + c], [-3, y, z + 1.6 - c]];
      const f0 = face(0), f1 = face(0.7);
      w.poly(f0, true, 2); w.poly(f1, true, 1);
      f0.forEach((p, k) => w.line(p, f1[k], 1));
      // inner panel
      const r = (x0, x1, z0, z1) => w.poly([[x0, -0.01, z + z0], [x1, -0.01, z + z0], [x1, -0.01, z + z1], [x0, -0.01, z + z1]], true, 1);
      r(-2.8, 2.8, -1.45, 1.45);
      r(-0.4, 2.4, 0.95, 1.2); r(-1.0, 2.0, 0.25, 0.65); r(-1.8, 1.6, -0.75, -0.35);
      const ring = []; for (let k = 0; k <= 20; k++) { const a = k / 20 * TAU; ring.push([-2.3 + Math.cos(a) * 0.14, -0.01, z + 1.07 + Math.sin(a) * 0.14]); }
      w.poly(ring, false, 1);
      w.line([0.2, -0.01, z - 0.35], [0.2, -0.01, z + 0.25]); w.line([0.5, -0.01, z + 0.65], [0.5, -0.01, z + 0.95]);
      w.line([-0.2, -0.01, z - 0.75], [-0.6, -0.01, z - 1.15]); w.line([-0.2, -0.01, z - 0.75], [0.2, -0.01, z - 1.15]); w.line([-0.2, -0.01, z - 0.75], [0.6, -0.01, z - 1.15]);
    }
    // the spine through the stack
    w.line([0, -0.03, BZ(-2)], [0, -0.03, BZ(20)], 1, 2);
    return w.done();
  }
  const SHOTS = [
    // t, block, yaw, pitch, dist, roll
    [F(3298), 4.6, 0.55, 0.55, 5.70, -0.25],
    [F(3305), 5.0, 0.45, 0.45, 5.10, -0.15],
    [F(3328), 5.15, 0.38, 0.38, 4.80, -0.10],
    [F(3329), 6.0, 0.42, 0.28, 5.16, -0.12],
    [F(3345), 6.6, 0.32, 0.2, 4.80, -0.06],
    [F(3352), 7.6, 0.2, 0.12, 4.44, -0.08],
    [F(3365), 8.4, 0.05, 0.3, 4.20, 0.05],
    [F(3378), 9.0, -0.15, 0.55, 4.32, 0.22],
    [F(3386), 10.0, 0.25, -0.85, 5.40, 0.45],
    [F(3405), 11.2, 0.3, -0.6, 5.40, 0.35],
    [F(3409), 12.0, -0.1, 0.15, 4.20, -0.08],
    [F(3419), 12.3, -0.05, 0.15, 4.32, -0.06],
    [F(3421), 13.0, 0.08, 0.15, 4.32, -0.05],
    [F(3428), 13.3, 0.15, 0.2, 4.56, 0.0],
    [F(3433), 14.0, 0.3, 0.1, 5.76, -0.05],
    [F(3457), 14.1, 0.32, 0.1, 6.12, -0.05],
  ];
  function cam34(t) {
    const v = kf(t, SHOTS.map(s => [s[0], s.slice(1), E.inOutSine]));
    const [b, yaw, pitch, d, roll] = v;
    const tg = [0, 0, BZ(b)];
    const pos = [tg[0] + d * Math.sin(yaw) * Math.cos(pitch), tg[1] - d * Math.cos(yaw) * Math.cos(pitch), tg[2] + d * Math.sin(pitch)];
    return { cam: lookAt(pos, tg, roll, 52), b };
  }
  // word lying on the front face of block i, centred at x=cx, z offset dz from the block centre
  function faceWord(ctx, cam, str, i, width, dz, colorFn, cx = 0) {
    const s = fitSize(ctx, 900, str, 100, FONT.wide, 'normal');
    const hW = width / 100 * s;            // world height of a 100px glyph
    font(ctx, 900, 100, FONT.wide, 'normal');
    const xs = []; for (let k = 0; k <= str.length; k++) xs.push(ctx.measureText(str.slice(0, k)).width);
    const total = xs[str.length] * hW / 100;
    const o = [cx - total / 2, 0, BZ(i) + dz];
    for (let k = 3; k >= 1; k--) {
      planeText(ctx, cam, str, [o[0], 0.11 * k, o[2]], [1, 0, 0], [0, 0, -1], hW, (g, ch) => { g.fillStyle = `rgb(${34 + k * 12},${32 + k * 12},${30 + k * 12})`; g.fillText(ch, 0, 0); }, xs);
    }
    planeText(ctx, cam, str, [o[0], -0.06, o[2]], [1, 0, 0], [0, 0, -1], hW, (g, ch, j) => {
      const [fill, glow] = colorFn(j);
      g.fillStyle = fill; g.fillText(ch, 0, 0);
    }, xs);
  }
  const ORANGE = ['#ff6a1f', OG], WHITE = ['#f2eee8', null], GREYC = ['#8a857f', null];
  // label text cached as a texture; drawn on a 3D plane with one affine drawImage
  const TEX = {};
  function labelTex(str, color) {
    const key = str + color;
    if (TEX[key]) return TEX[key];
    const c = document.createElement('canvas'), g = c.getContext('2d');
    g.font = `400 100px ${FONT.mono}`;
    c.width = Math.ceil(g.measureText(str).width) + 8; c.height = 130;
    g.font = `400 100px ${FONT.mono}`; g.fillStyle = color; g.fillText(str, 4, 100);
    return (TEX[key] = c);
  }
  function texOnPlane(ctx, cam, tex, origin, ux, uy, hW) {
    const k = hW / 100, Wt = tex.width * k, Ht = tex.height * k;
    const o = [origin[0] - ux[0] * 4 * k - uy[0] * 100 * k, origin[1] - ux[1] * 4 * k - uy[1] * 100 * k, origin[2] - ux[2] * 4 * k - uy[2] * 100 * k];
    const p0 = cam.project(o[0], o[1], o[2]);
    const pa = cam.project(o[0] + ux[0] * Wt, o[1] + ux[1] * Wt, o[2] + ux[2] * Wt);
    const pb = cam.project(o[0] + uy[0] * Ht, o[1] + uy[1] * Ht, o[2] + uy[2] * Ht);
    if (!p0 || !pa || !pb) return;
    ctx.setTransform((pa[0] - p0[0]) / tex.width, (pa[1] - p0[1]) / tex.width, (pb[0] - p0[0]) / tex.height, (pb[1] - p0[1]) / tex.height, p0[0], p0[1]);
    ctx.drawImage(tex, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  const S34 = {
    name: 'Transformer tower · JUST TRANSFORMERS ALL THE WAY',
    start: F(3298), end: F(3457), vignette: 1, bloom: 1.6,
    draw(ctx, t) {
      if (!TOWER) TOWER = buildTower();
      ctx.fillStyle = '#0d0c0c'; ctx.fillRect(0, 0, W, H);
      // faint backdrop grid
      ctx.strokeStyle = 'rgba(225,220,212,0.04)'; ctx.lineWidth = 1;
      ctx.beginPath(); for (let x = 0; x <= W; x += 60) { ctx.moveTo(x, 0); ctx.lineTo(x, H); } for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke();
      const { cam, b } = cam34(t);
      TOWER.draw(ctx, cam, { rgb: '225,220,212', alpha: 0.75, far: 22 });
      // panel labels on the nearby blocks
      const bi = Math.round(b);
      for (let i = Math.max(0, bi - 1); i <= bi + 1; i++) {
        const z = BZ(i);
        font(ctx, 400, 100, FONT.mono);
        [['TRANSFORMER BLOCK', -2.6, 1.15, 0.2], ['ADD & NORM', 0.2, 0.99, 0.17], ['FEED FORWARD', -0.6, 0.35, 0.24], ['MULTIHEAD ATTENTION', -1.6, -0.65, 0.22], ['PRE-LN', 2.2, 0.55, 0.12], ['FFN 4x', 2.2, 0.38, 0.12]]
          .forEach(([s, x, dz, h]) => texOnPlane(ctx, cam, labelTex(s, 'rgba(225,220,212,0.62)'), [x, -0.02, z + dz], [1, 0, 0], [0, 0, -1], h));
        texOnPlane(ctx, cam, labelTex(`L${String(i).padStart(3, '0')}`, 'rgba(225,220,212,0.5)'), [3.25, 0.2, z + 0.4], [0, 1, 0], [0, 0, -1], 0.28);
      }
      // spark running down the spine
      const sp = cam.project(0, -0.03, BZ(b) + 1.9 - ((t * 3) % 1) * 0.4);
      if (sp) { halo(ctx, sp[0], sp[1], 40, '255,120,40', 0.8); pen(ctx, sp[0], sp[1], 0.6, 1); }
      // the lyric
      const kar = (str, t0, t1, done) => j => {
        const n = (str.length) * prog(t, t0, t1);
        return j < n ? ORANGE : done ? WHITE : GREYC;
      };
      if (t < F(3329)) {
        faceWord(ctx, cam, '“JUST', 5, 4.4, -0.45, j => (t < F(3309) ? ['rgba(160,154,148,0.6)', null] : j === 0 ? ['#ff8a40', OG] : ORANGE));
      } else if (t < F(3386)) {
        faceWord(ctx, cam, 'TRANSFORMERS', Math.round(b), 6.6, -0.45, kar('TRANSFORMERS', F(3326), F(3376), false));
      } else if (t < F(3409)) {
        faceWord(ctx, cam, 'ALL THE', 10, 4.6, -0.3, () => WHITE);
        faceWord(ctx, cam, 'WAY”', 11, 3.2, -0.3, j => (t >= F(3392) ? ORANGE : GREYC));
      } else if (t < F(3421)) {
        faceWord(ctx, cam, 'TILL YOU', 12, 5.8, -0.45, j => (j < 4 ? WHITE : t >= F(3413) ? ORANGE : GREYC));
      } else {
        if (t < F(3430)) faceWord(ctx, cam, 'LEARNED', 13, 5.2, -0.1, j => (j < 4 ? ORANGE : GREYC));
        faceWord(ctx, cam, 'TO', 13, 1.6, t < F(3430) ? -1.1 : 1.6, () => (t < F(3430) ? GREYC : WHITE));
        if (t >= F(3428)) faceWord(ctx, cam, 'DISOBEY', 14, 5.6, -0.4, j => (j === 6 ? ORANGE : j >= 7 - Math.floor(7 * prog(t, F(3436), F(3446))) && j > 0 ? ORANGE : GREYC));
      }
      // HUD
      font(ctx, 400, 11, FONT.mono); ctx.fillStyle = CREAM + '0.5)'; ctx.fillText('DEPTH', 120, 120);
      font(ctx, 600, 26, FONT.mono); ctx.fillStyle = CREAM + '0.9)';
      ctx.fillText(t >= F(3446) ? 'L.014 / 014' : `L.${String(Math.max(5, bi)).padStart(3, '0')} / ∞`, 120, 150);
      font(ctx, 400, 11, FONT.mono); ctx.fillStyle = CREAM + '0.45)'; ctx.fillText('n × transformer block, n → ∞', 120, 170);
      ctx.fillStyle = '#ff6a1f'; ctx.fillText('P(DOOM) 0.82', 120, 192);
      if (t >= F(3446)) { ctx.fillStyle = '#ff6a1f'; ctx.textAlign = 'right'; ctx.fillText('θ = 20.6°', 1780, 300); ctx.fillStyle = CREAM + '0.5)'; ctx.fillText('MISALIGNED (1 of 4)', 1780, 318); ctx.textAlign = 'left'; }
      // whip on the cut to DISOBEY
      const wk = 1 - Math.abs(t - F(3429.5)) / 0.08;
      if (wk > 0) PFX.motionBlur(ctx, 0, 160 * wk, 10);
      const fi = 1 - prog(t, F(3298), F(3302));
      if (fi > 0) PFX.zoomBlur(ctx, 960, 540, 0.3 * fi, 6);
    },
  };

  // =====================================================================
  // SCENE 35 · POST-CHINCHILLA, SUPER-DENSE   (frames 3457–3500, continues in part 8)
  // =====================================================================
  const L1 = 'POST-CHINCHILLA,', L2 = 'SUPER-DENSE';
  const n1 = t => kf(t, [[F(3459), 0], [F(3465), 7, E.linear], [F(3471), 10, E.linear], [F(3481), 16, E.linear]]);
  const n2 = t => kf(t, [[F(3484), 0], [F(3486), 2, E.linear], [F(3491), 4, E.linear], [F(3500), 7, E.linear], [F(3510), 11, E.linear]]);
  const tokens = t => Math.pow(10, kf(t, [[F(3470), Math.log10(20)], [F(3485), Math.log10(200)], [F(3491), Math.log10(1948)], [F(3500), Math.log10(7888)], [F(3506), Math.log10(19600)], [F(3516), Math.log10(20000)]]));
  function denseFont(ctx, k, size) {
    k = Math.round(k * 12) / 12;
    const w = Math.round(lerp(300, 900, k) / 50) * 50;
    size = Math.round(size);
    const st = k < 0.3 ? 'expanded' : k < 0.6 ? 'normal' : k < 0.85 ? 'condensed' : 'extra-condensed';
    font(ctx, w, size, FONT.wide, st);
    ctx.letterSpacing = `${lerp(14, -1, k).toFixed(1)}px`;
  }
  function karaokeLine(ctx, str, x, y, n, done) {
    for (let i = 0; i < str.length; i++) {
      const hot = i < n && (!done);
      ctx.fillStyle = hot ? '#ff6a1f' : i < n || done ? '#f4f0ea' : 'rgba(150,144,138,0.75)';
      ctx.fillText(str[i], x, y);
      x += ctx.measureText(str[i]).width;
    }
    return x;
  }
  const S35 = {
    name: 'POST-CHINCHILLA, SUPER-DENSE',
    start: F(3457), end: F(3518), vignette: 0.6, bloom: 0.2,
    draw(ctx, t) {
      ctx.fillStyle = '#0c0b0a'; ctx.fillRect(0, 0, W, H);
      const k = E.inOutSine(prog(t, F(3474), F(3500)));
      // safe-area frame
      ctx.strokeStyle = 'rgba(236,230,220,0.18)'; ctx.lineWidth = 1.2;
      ctx.strokeRect(108, 42, 1704, 996);
      ctx.beginPath(); ctx.moveTo(108, 120); ctx.lineTo(1812, 120); ctx.stroke();
      font(ctx, 500, 10, FONT.mono); ctx.fillStyle = CREAM + '0.4)'; ctx.textAlign = 'right'; ctx.fillText('ACTION SAFE 90%', 1806, 34); ctx.textAlign = 'left';
      // background rows (appear as it gets denser)
      const size = lerp(126, 120, k), pitch = lerp(150, 78, k);
      ctx.save();
      ctx.beginPath(); ctx.rect(108, 42, 1704, 996); ctx.clip();
      denseFont(ctx, k, size);
      const rows = [
        [-3, 'SUPER-DENSE SUPER-DENSE SUPER-DENSE SUPER-DENSE ', 1.0], [-2, 'CHILLA, POST-CHINCHILLA, POST-CHINCHILLA, POST-', 0.6],
        [-1, 'ENSE SUPER-DENSE SUPER-DENSE SUPER-DENSE SUP', 0.0], [2, 'CHILLA, POST-CHINCHILLA, POST-CHINCHILLA, POST-', 0.25],
        [3, 'DENSE SUPER-DENSE SUPER-DENSE SUPER-DENSE ', 0.55], [4, 'T-CHINCHILLA, POST-CHINCHILLA, POST-CHINCHILLA, ', 0.8],
      ];
      rows.forEach(([r, s, d]) => {
        const a = prog(k, d * 0.6, d * 0.6 + 0.25) * (r === -1 || r === 2 ? prog(t, F(3478), F(3484)) : 1);
        if (a <= 0) return;
        ctx.globalAlpha = a * 0.62; ctx.fillStyle = '#9b958e';
        const scroll = ((t * (r % 2 ? 40 : -40)) % 400) - 200;
        ctx.fillText(s, 60 + scroll - hash(r * 7) * 200, 528 + r * pitch);
      });
      ctx.globalAlpha = 1;
      // the two sung lines
      const d1 = t >= F(3484);
      let x = karaokeLine(ctx, L1, 112, 528, n1(t), d1);
      if (k > 0.2) { ctx.fillStyle = 'rgba(155,149,142,0.62)'; ctx.fillText(' POST-CHINCHILLA, POST-', x, 528); }
      x = karaokeLine(ctx, L2, 112, 528 + pitch, n2(t), false);
      if (k > 0.2) { ctx.fillStyle = 'rgba(155,149,142,0.62)'; ctx.fillText(' SUPER-DENSE SUPER-DENSE', x, 528 + pitch); }
      ctx.letterSpacing = '0px';
      ctx.restore();
      // tokens / param counter
      const v = tokens(t);
      ctx.fillStyle = 'rgba(14,13,12,0.92)'; ctx.fillRect(1425, 837, 345, 147);
      ctx.strokeStyle = 'rgba(236,230,220,0.3)'; ctx.strokeRect(1425, 837, 345, 147);
      font(ctx, 600, 11, FONT.mono); ctx.fillStyle = CREAM + '0.55)'; ctx.fillText('TOKENS / PARAM', 1440, 860);
      font(ctx, 500, 46, FONT.mono); ctx.textAlign = 'right';
      ctx.fillStyle = v > 2000 ? '#ff6a1f' : '#f2eee8';
      ctx.fillText(Math.round(v).toLocaleString('en-US'), 1755, 930); ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(236,230,220,0.2)'; ctx.fillRect(1440, 950, 315, 2);
      ctx.fillStyle = '#ff6a1f'; ctx.fillRect(1440, 950, 315 * clamp(Math.log10(v) / 6), 2);
      font(ctx, 400, 10, FONT.mono); ctx.fillStyle = CREAM + '0.45)'; ctx.fillText('20 = Chinchilla-optimal', 1440, 972);
      const fi = 1 - prog(t, F(3457), F(3460));
      if (fi > 0) { ctx.fillStyle = `rgba(12,11,10,${fi})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  window.SHARED.p7 = { labelTex, texOnPlane };
  Timeline.add(S31, S32, S33, S34, S35);
})();
