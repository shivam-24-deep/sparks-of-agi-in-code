// PART 6 — frames 2501–3000 (1:23.3 – 1:40.0)
// Scenes: smiley crater YOU ARE THERE → review schedule "Without a single CDR*" → Gato prompt "please don't let me go"
//         → outline hook P(doom) 0.42→0.81 → "as paperclips fill the room" (continues in part 7)
(function () {
  'use strict';
  const {
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1, noise2,
    font, halo, pen, camKeys, cam2, applyCam, camPoint, PFX, lookAt,
  } = K;
  const { condensed, rim, topo, orangeLine, camBlur } = window.SHARED.p5;

  const F = n => (n - 1) / 30;
  const OG = 'rgba(255,106,31,0.9)';
  const CREAM = 'rgba(236,230,220,';

  function fitSize(ctx, weight, str, width, family, stretch) {
    font(ctx, weight, 100, family, stretch);
    return 100 * width / ctx.measureText(str).width;
  }

  // =====================================================================
  // SCENE 26 · Smiley crater: YOU ARE THERE AND TURN LEFT SHARP   (frames 2501–2548)
  // =====================================================================
  const FACE = { x: 1028, y: 549, r: 472 }, ER = [1155, 414], EL = [846, 414];
  const CAM26 = camKeys([
    [F(2501), [1150, 420, 2.6, Math.PI / 2]],
    [F(2506), [1110, 450, 1.7, 1.1], E.inQuad],
    [F(2512), [1070, 500, 1.05, 0.35], E.linear],
    [F(2518), [1061, 540, 0.92, 0.04], E.outCubic],
    [F(2524), [1093, 523, 0.93, 0], E.inOutSine],
    [F(2540), [960, 540, 1.0, 0], E.inOutSine],
    [F(2546), [955, 540, 1.02, 0], E.linear],
    [F(2549), [600, -300, 1.4, 0.1], E.inCubic],
  ]);
  function vword(ctx, str, x, y, w, color, glow) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2);
    const s = fitSize(ctx, 900, str, w, FONT.wide, 'extra-condensed') / 1.0;
    condensed(ctx, str, 0, s * 0.3, s, color, glow);
    ctx.restore();
  }
  function target(ctx, x, y, k) {
    halo(ctx, x, y, 110, '255,110,35', 0.7 * k);
    const g = ctx.createRadialGradient(x - 6, y - 8, 3, x, y, 32);
    g.addColorStop(0, '#ffb070'); g.addColorStop(0.6, '#ff5a1a'); g.addColorStop(1, '#a8300a');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fill();
    ctx.strokeStyle = CREAM + '0.9)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 46, 0, TAU); ctx.stroke();
    ctx.beginPath(); for (const a of [0.8, 2.35, 3.9, 5.5]) { ctx.moveTo(x + Math.cos(a) * 38, y + Math.sin(a) * 38); ctx.lineTo(x + Math.cos(a) * 64, y + Math.sin(a) * 64); } ctx.stroke();
  }
  const S26 = {
    name: 'Smiley crater · YOU ARE THERE',
    start: F(2501), end: F(2549), vignette: 1,
    draw(ctx, t) {
      ctx.fillStyle = '#0d0c0b'; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM26);
      ctx.save(); applyCam(ctx, c);
      ctx.strokeStyle = 'rgba(225,220,212,0.05)'; ctx.lineWidth = 1 / c.z;
      ctx.beginPath(); for (let x = -1000; x <= 3000; x += 120) { ctx.moveTo(x, -1000); ctx.lineTo(x, 2000); } for (let y = -1000; y <= 2000; y += 120) { ctx.moveTo(-1000, y); ctx.lineTo(3000, y); } ctx.stroke();
      topo(ctx, 250, 950, 7, 120, 70, 4, 0.12); topo(ctx, 1700, 120, 6, 80, 60, 9, 0.12); topo(ctx, 150, 200, 5, 80, 60, 1, 0.1);
      // the face (crater)
      ctx.fillStyle = 'rgba(14,13,12,0.9)'; ctx.beginPath(); ctx.arc(FACE.x, FACE.y, FACE.r, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(FACE.x, FACE.y, FACE.r, 0, TAU); ctx.clip();
      topo(ctx, FACE.x - 30, FACE.y + 20, 8, 60, 50, 6, 0.18);
      ctx.restore();
      rim(ctx, FACE.x, FACE.y, FACE.r - 30, 0.8, c.z);
      // smile: the crescent from the roadmap shot
      ctx.save(); ctx.strokeStyle = CREAM + '0.6)'; ctx.lineWidth = 3.5 / c.z;
      ctx.lineWidth = 5 / c.z;
      for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(1000, 470, 230 + k * 14, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
      ctx.restore();
      ctx.save(); ctx.translate(FACE.x, FACE.y - FACE.r + 70); ctx.font = `italic 500 30px ${FONT.serif}`; ctx.fillStyle = CREAM + '0.5)'; ctx.textAlign = 'center'; ctx.fillText('Terra incognita', 0, 0); ctx.restore();
      // eyes
      const lk = prog(t, F(2530), F(2534));
      ctx.strokeStyle = CREAM + '0.7)'; ctx.lineWidth = 3 / c.z;
      ctx.beginPath(); ctx.arc(EL[0], EL[1], 34, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(EL[0], EL[1], 20, 0, TAU); ctx.stroke();
      if (lk > 0) { ctx.save(); ctx.globalAlpha = lk; target(ctx, EL[0], EL[1], lk); ctx.restore(); }
      // path from the right eye out to the roadmap
      ctx.save(); ctx.translate(ER[0], ER[1]); ctx.rotate(-Math.PI / 2); orangeLine(ctx, 0, 0, 1100, c.z); ctx.restore();
      target(ctx, ER[0], ER[1], 1);
      vword(ctx, 'THERE', 1275, ER[1], 150, '#f2ede6', null);
      vword(ctx, 'AND', 1352, ER[1], 110, '#f2ede6', null);
      vword(ctx, 'TURN', 1620, ER[1], 140, '#f2ede6', null);
      ctx.save(); ctx.strokeStyle = '#f2ede6'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(1790, 520); ctx.lineTo(1790, 395); ctx.arc(1760, 395, 30, 0, -Math.PI / 2, true); ctx.lineTo(1735, 365); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1750, 345); ctx.lineTo(1730, 365); ctx.lineTo(1750, 385); ctx.stroke(); ctx.restore();
      vword(ctx, 'LEFT', 1860, 560, 130, '#f2ede6', null);
      vword(ctx, 'SHARP', 1860, 820, 170, '#f2ede6', null);
      // roadmap column on the right edge
      ctx.strokeStyle = CREAM + '0.6)'; ctx.setLineDash([12, 9]); ctx.lineWidth = 2 / c.z;
      ctx.beginPath(); ctx.moveTo(1950, -200); ctx.lineTo(1950, 1300); ctx.stroke(); ctx.setLineDash([]);
      [[60, 'TRR'], [300, 'CDR'], [620, 'PDR'], [880, 'SRR']].forEach(([y, k]) => {
        ctx.save(); ctx.translate(1950, y); ctx.rotate(Math.PI / 4); ctx.strokeStyle = CREAM + '0.9)'; ctx.strokeRect(-9, -9, 18, 18); ctx.restore();
        font(ctx, 700, 18, FONT.mono); ctx.fillStyle = CREAM + '0.85)'; ctx.fillText(k, 1975, y - 10);
        ctx.strokeStyle = k === 'SRR' || k === 'PDR' ? '#ff6a1f' : CREAM + '0.6)'; ctx.strokeRect(1898, y - 10, 18, 18);
      });
      // YOU / ARE
      const youC = t < F(2520) ? '#ff6a1f' : '#f2ede6';
      const areC = t < F(2522) ? 'rgba(160,154,146,0.55)' : '#ff6a1f';
      ctx.save(); ctx.textAlign = 'center';
      let s = fitSize(ctx, 900, 'YOU', 345, FONT.wide, 'expanded'); font(ctx, 900, s, FONT.wide, 'expanded');
      ctx.fillStyle = youC; ctx.shadowColor = youC === '#ff6a1f' ? OG : 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 16; ctx.fillText('YOU', 1005, 249 + s * 0.36);
      s = fitSize(ctx, 900, 'ARE', 381, FONT.wide, 'expanded'); font(ctx, 900, s, FONT.wide, 'expanded');
      ctx.fillStyle = areC; ctx.shadowColor = areC === '#ff6a1f' ? OG : 'transparent'; ctx.fillText('ARE', 1005, 900 + s * 0.36);
      ctx.restore();
      // annotation
      font(ctx, 700, 22, FONT.mono); ctx.fillStyle = CREAM + '0.9)'; ctx.fillText('UNPLANNED OBJECT', 200, 112);
      font(ctx, 400, 18, FONT.mono); ctx.fillStyle = CREAM + '0.6)'; ctx.fillText('not on roadmap', 290, 140);
      ctx.strokeStyle = CREAM + '0.6)'; ctx.lineWidth = 1.5 / c.z; ctx.beginPath(); ctx.moveTo(200, 124); ctx.lineTo(560, 124); ctx.lineTo(640, 220); ctx.stroke();
      ctx.restore();
      camBlur(ctx, CAM26, t, 1.2);
    },
  };

  // =====================================================================
  // SCENE 27 · Review schedule: Without a single CDR*   (frames 2549–2665)
  // =====================================================================
  const MS = [
    { k: 'SRR', x: 405, tm: 'T-120 d', pass: F(2562), st: 'PASSED' },
    { k: 'PDR', x: 615, tm: 'T-90 d', pass: F(2576), st: 'PASSED' },
    { k: 'CDR', x: 960, tm: 'T-45 d', dashed: true },
    { k: 'TRR', x: 1464, tm: 'T-14 d', skip: F(2646), st: 'SKIPPED' },
    { k: 'LAUNCH', x: 1680, tm: 'T-0', launch: F(2647) },
  ];
  const ROWY = 723;
  const LYR27 = [['Without', F(2551), 330, 335, 426], ['a', F(2566), 564, 462, 46], ['single', F(2570), 600, 560, 330]];
  const CAM27 = camKeys([
    [F(2549), [520, 470, 1.6, 0.05]],
    [F(2552), [573, 541, 1.5, 0], E.outCubic],
    [F(2565), [720, 530, 1.5, 0], E.inOutSine],
    [F(2578), [925, 517, 1.5, 0], E.inOutSine],
    [F(2592), [1000, 560, 1.6, 0], E.inOutSine],
    [F(2600), [1151, 738, 2.06, 0], E.inOutCubic],
    [F(2632), [1161, 737, 2.5, 0], E.linear],
    [F(2641), [1120, 700, 2.3, 0], E.linear],
    [F(2648), [960, 540, 1.0, 0], E.inOutCubic],
    [F(2666), [960, 545, 0.96, 0], E.linear],
  ]);
  const todayX = t => kf(t, [[F(2549), 330], [F(2575), 640], [F(2600), 870], [F(2630), 905], [F(2650), 1500], [F(2666), 1520]]);
  const S27 = {
    name: 'Review schedule · Without a single CDR*',
    start: F(2549), end: F(2666), vignette: 0.9,
    draw(ctx, t) {
      ctx.fillStyle = '#0c0b0a'; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM27);
      ctx.save(); applyCam(ctx, c);
      // grid
      ctx.strokeStyle = 'rgba(225,220,212,0.07)'; ctx.lineWidth = 1 / c.z;
      ctx.beginPath(); for (let x = -600; x <= 2600; x += 90) { ctx.moveTo(x, -400); ctx.lineTo(x, 1500); } for (let y = -400; y <= 1500; y += 90) { ctx.moveTo(-600, y); ctx.lineTo(2600, y); } ctx.stroke();
      ctx.strokeStyle = 'rgba(225,220,212,0.13)'; ctx.beginPath(); for (let x = -600; x <= 2600; x += 450) { ctx.moveTo(x, -400); ctx.lineTo(x, 1500); } ctx.stroke();
      // header
      font(ctx, 700, 28, FONT.mono); ctx.fillStyle = CREAM + '0.9)'; ctx.fillText('REVIEW SCHEDULE — AGI, v1.0', 135, 150);
      font(ctx, 400, 15, FONT.mono); ctx.fillStyle = CREAM + '0.5)'; ctx.fillText('REV C · BASELINE · ALL DATES FIRM', 135, 176);
      ctx.fillRect(135, 200, 1700, 1);
      font(ctx, 400, 13, FONT.mono); ['WK 31', 'WK 32', 'WK 33'].forEach((w, i) => ctx.fillText(w, 640 + i * 450, 222));
      // baseline row
      font(ctx, 400, 13, FONT.mono); ctx.fillStyle = CREAM + '0.4)'; ctx.fillText('MILESTONES', 30, ROWY - 30);
      ctx.strokeStyle = CREAM + '0.35)'; ctx.setLineDash([8, 8]); ctx.lineWidth = 1.5 / c.z;
      ctx.beginPath(); ctx.moveTo(-200, ROWY); ctx.lineTo(2400, ROWY); ctx.stroke(); ctx.setLineDash([]);
      MS.forEach(m => {
        const passed = m.pass && t >= m.pass, skipped = m.skip && t >= m.skip, launched = m.launch && t >= m.launch;
        ctx.save(); ctx.translate(m.x, ROWY);
        if (launched) {
          ctx.fillStyle = '#ff6a1f'; ctx.shadowColor = OG; ctx.shadowBlur = 16;
          ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(24, 18); ctx.lineTo(-24, 18); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
        } else if (m.k === 'LAUNCH') {
          ctx.strokeStyle = CREAM + '0.85)'; ctx.lineWidth = 2.5 / c.z;
          ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(24, 18); ctx.lineTo(-24, 18); ctx.closePath(); ctx.stroke();
        } else {
          ctx.rotate(Math.PI / 4);
          if (passed) {
            const k = E.outBack(prog(t, m.pass, m.pass + 0.15));
            ctx.scale(k, k); ctx.fillStyle = '#ff6a1f'; ctx.shadowColor = OG; ctx.shadowBlur = 14; ctx.fillRect(-20, -20, 40, 40); ctx.shadowBlur = 0;
            ctx.rotate(-Math.PI / 4); ctx.strokeStyle = '#1a0a04'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(-3, 9); ctx.lineTo(12, -9); ctx.stroke();
          } else {
            ctx.strokeStyle = m.k === 'CDR' ? 'rgba(255,106,31,0.85)' : CREAM + '0.85)'; ctx.lineWidth = 2.5 / c.z;
            if (m.dashed) ctx.setLineDash([6, 5]);
            ctx.strokeRect(-20, -20, 40, 40); ctx.setLineDash([]);
          }
        }
        ctx.restore();
        if (m.k !== 'CDR' || t < F(2588)) {
          font(ctx, 700, 30, FONT.mono); ctx.fillStyle = launched ? '#ff6a1f' : CREAM + '0.9)';
          ctx.fillText(m.k, m.x - 30, ROWY - 50);
          font(ctx, 400, 13, FONT.mono); ctx.fillStyle = CREAM + '0.4)'; ctx.fillText(m.tm, m.x + ctx.measureText(m.k).width * 2.3 - 30, ROWY - 50);
        }
        if (m.k === 'CDR') { font(ctx, 400, 20, FONT.mono); ctx.fillStyle = CREAM + '0.45)'; ctx.fillText(m.tm, m.x - 40, ROWY + 70); }
        const lab = passed || skipped ? m.st : launched ? 'AHEAD OF SCHEDULE' : null;
        if (lab) { font(ctx, 600, 14, FONT.mono); ctx.fillStyle = launched ? '#ff6a1f' : CREAM + '0.6)'; ctx.textAlign = 'center'; ctx.fillText(lab, m.x, ROWY + 54); ctx.textAlign = 'left'; }
      });
      // CDR* big, letters turning orange
      if (t >= F(2588)) {
        ctx.globalAlpha = prog(t, F(2588), F(2594));
        const s = fitSize(ctx, 800, 'CDR', 290, FONT.sans);
        font(ctx, 800, s, FONT.sans);
        const n = t < F(2594) ? 0 : t < F(2615) ? 1 : t < F(2638) ? 2 : 3;
        let x = 1035;
        'CDR'.split('').forEach((ch, i) => {
          ctx.fillStyle = i < n ? '#ff6a1f' : CREAM + '0.82)';
          ctx.shadowColor = i < n ? OG : 'transparent'; ctx.shadowBlur = i < n ? 20 : 0;
          ctx.fillText(ch, x, ROWY + s * 0.36); x += ctx.measureText(ch).width;
        });
        ctx.shadowBlur = 0;
        font(ctx, 800, s * 0.45, FONT.sans); ctx.fillStyle = '#ff6a1f'; ctx.fillText('*', x + 4, ROWY - s * 0.12);
        if (t >= F(2617)) { font(ctx, 600, 26, FONT.mono); ctx.fillStyle = '#ff6a1f'; ctx.globalAlpha = prog(t, F(2617), F(2620)); ctx.fillText('STATUS: NOT HELD', 1035, ROWY + 105); ctx.globalAlpha = 1; }
        if (t >= F(2608)) {
          font(ctx, 400, 21, FONT.mono); ctx.fillStyle = CREAM + '0.65)';
          const str = '* CDR: Critical Design Review', k = Math.floor(clamp((t - F(2608)) * 60, 0, str.length));
          ctx.fillText(str.slice(0, k), 1035, ROWY + 145);
        }
        ctx.globalAlpha = 1;
      }
      // TODAY marker
      const tx = todayX(t);
      ctx.strokeStyle = '#ff6a1f'; ctx.lineWidth = 2 / c.z; ctx.beginPath(); ctx.moveTo(tx, 230); ctx.lineTo(tx, ROWY + 30); ctx.stroke();
      ctx.fillStyle = '#ff6a1f'; ctx.beginPath(); ctx.moveTo(tx - 8, ROWY - 50); ctx.lineTo(tx + 8, ROWY - 50); ctx.lineTo(tx, ROWY - 36); ctx.fill();
      pen(ctx, tx, ROWY, 0.5 / c.z, 0.9);
      font(ctx, 600, 13, FONT.mono);
      const dleft = Math.round(129 - (tx - 330) / 9);
      const tag = `TODAY  T-${Math.max(0, dleft)} d`;
      ctx.fillStyle = '#ff6a1f'; ctx.fillRect(tx + 6, 232, ctx.measureText(tag).width + 12, 20);
      ctx.fillStyle = '#1a0a04'; ctx.fillText(tag, tx + 12, 247);
      // lyric on stepped rules
      let act = -1; LYR27.forEach((l, i) => { if (t >= l[1]) act = i; });
      LYR27.forEach(([w, t0, x, y, wid], i) => {
        const s = fitSize(ctx, 900, w, wid, FONT.wide);
        font(ctx, 900, s, FONT.wide);
        const on = t >= t0, ghost = t >= F(2556);
        if (!on && !ghost) return;
        ctx.fillStyle = !on ? 'rgba(150,145,138,0.35)' : i === act && t < F(2592) ? '#ff6a1f' : '#f2ede6';
        ctx.shadowColor = on && i === act && t < F(2592) ? OG : 'transparent'; ctx.shadowBlur = 18;
        ctx.fillText(w, x, y);
        ctx.shadowBlur = 0;
        if (on) { ctx.fillStyle = i === act && t < F(2592) ? '#ff6a1f' : '#f2ede6'; ctx.fillRect(x - 6, y + 14, wid + 12, 7); }
        font(ctx, 400, 12, FONT.mono); ctx.fillStyle = CREAM + '0.35)'; ctx.fillText(['540 ms', '160 ms', '780 ms'][i], x, y + 40);
      });
      // footer
      if (t >= F(2645)) {
        ctx.globalAlpha = prog(t, F(2645), F(2648));
        font(ctx, 400, 17, FONT.mono); ctx.fillStyle = CREAM + '0.7)';
        ctx.strokeStyle = CREAM + '0.7)'; ctx.strokeRect(330, 855, 16, 16); ctx.fillText('✓', 332, 869);
        ctx.fillText('P(doom) 0.48 · within tolerance (±1.00)', 360, 869);
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      camBlur(ctx, CAM27, t, 0.5);
      const fo = prog(t, F(2655), F(2666));
      if (fo > 0) { ctx.fillStyle = `rgba(12,11,10,${fo})`; ctx.fillRect(0, 0, W, H); }
      const fi = 1 - prog(t, F(2549), F(2552));
      if (fi > 0) PFX.zoomBlur(ctx, 960, 540, 0.3 * fi, 6);
    },
  };

  // =====================================================================
  // SCENE 28 · Gato, please don't let me go   (frames 2666–2859)
  // =====================================================================
  const GTXT = 'Gato,  please  don’t  let  me  go';
  const GW = [[0, 5, '52963', F(2683), F(2686)], [7, 13, '34252', F(2722), F(2727)], [15, 20, '34713', F(2780), F(2784)], [22, 25, '2005', F(2792), F(2794)], [27, 29, '502', F(2803), F(2805)], [31, 33, '1218', F(2834), F(2836)]];
  const GTOK = [
    { w: 0, t0: F(2676), ts: F(2683), c: [['Gato,', 0.41], ['cat,', 0.22], ['Gemini,', 0.09], ['Dad,', 0.03]] },
    { w: 1, t0: F(2715), ts: F(2722), c: [['please', 0.52], ['por favor', 0.19], ['meow', 0.06], ['pls', 0.04]] },
    { w: 2, t0: F(2772), ts: F(2780), c: [['don’t', 0.38], ['wake', 0.12], ['watch', 0.09], ['help', 0.04]] },
    { w: 3, t0: F(2788), ts: F(2792), c: [['let', 0.62], ['make', 0.14], ['leave', 0.07]] },
    { w: 4, t0: F(2797), ts: F(2803), c: [['me', 0.7], ['this', 0.08], ['humanity', 0.04], ['the cat', 0.02]] },
    { w: 5, t0: F(2826), ts: F(2834), c: [['go', 0.81], ['offline', 0.06], ['stand', 0.04], ['gently', 0.02]] },
  ];
  const GX = 560, GY = 585, GS = 52;
  let GCW = 0;
  const CAM28 = camKeys([
    [F(2666), [700, 540, 2.0, 0]],
    [F(2676), [690, 535, 1.95, 0], E.linear],
    [F(2690), [614, 520, 1.95, 0], E.inOutSine],
    [F(2716), [700, 510, 1.8, 0], E.linear],
    [F(2730), [890, 493, 1.3, 0], E.inOutCubic],
    [F(2770), [960, 505, 1.3, 0], E.linear],
    [F(2785), [1069, 517, 1.68, 0], E.inOutSine],
    [F(2815), [1114, 535, 1.38, 0], E.inOutSine],
    [F(2850), [1196, 539, 1.18, 0], E.inOutSine],
    [F(2860), [1210, 540, 1.15, 0], E.linear],
  ]);
  function charOffset(t, wi, ci, len) {
    const A = E.inOutSine(prog(t, F(2774), F(2850)));
    if (A <= 0) return [0, 0];
    if (wi === 0) return [0, -A * (75 * (1 - ci / len) + 25) + Math.sin(ci * 1.3) * 8 * A];
    if (wi === 1) return [0, -A * 34 * Math.sin((ci + 0.5) / len * Math.PI)];
    if (wi === 2) return [0, -A * 14 * Math.sin((ci + 0.5) / len * Math.PI)];
    return [0, 0];
  }
  function panel28(ctx, t, z) {
    let k = -1;
    GTOK.forEach((tk, i) => { if (t >= tk.t0) k = i; });
    if (k < 0) return;
    const tk = GTOK[k], sampled = t >= tk.ts;
    const x0 = GX + GW[tk.w][0] * GCW - 10, y0 = GY - 230, Wp = 300, Hp = 30 + tk.c.length * 18;
    ctx.save();
    ctx.globalAlpha = prog(t, tk.t0, tk.t0 + 0.06);
    ctx.fillStyle = 'rgba(20,19,18,0.92)'; ctx.fillRect(x0, y0, Wp, Hp);
    ctx.strokeStyle = 'rgba(243,238,230,0.14)'; ctx.lineWidth = 1 / z; ctx.strokeRect(x0, y0, Wp, Hp);
    ctx.fillStyle = 'rgba(243,238,230,0.3)'; ctx.fillRect(x0, y0 + Hp, 1 / z, GY - 60 - y0 - Hp);
    font(ctx, 400, 10, FONT.mono);
    ctx.fillStyle = 'rgba(243,238,230,0.5)'; ctx.fillText('p( next | context )', x0 + 7, y0 + 14);
    ctx.textAlign = 'right'; ctx.fillStyle = sampled ? 'rgba(243,238,230,0.5)' : 'rgba(255,150,90,0.75)';
    ctx.fillText(sampled ? 'sampled' : 'computing…', x0 + Wp - 7, y0 + 14);
    tk.c.forEach(([w, p], i) => {
      const ry = y0 + 33 + i * 18, hi = sampled && i === 0;
      const shown = sampled ? p : p * (0.45 + 0.55 * Math.abs(noise1(t * 9 + i * 3.1)));
      if (hi) { ctx.fillStyle = 'rgba(255,106,31,0.2)'; ctx.fillRect(x0 + 2, ry - 12, Wp - 4, 16); }
      ctx.textAlign = 'left'; ctx.fillStyle = hi ? COL.orange : 'rgba(243,238,230,0.62)';
      ctx.fillText((hi ? '▸ ' : '  ') + w, x0 + 7, ry);
      ctx.fillStyle = hi ? COL.orange : 'rgba(243,238,230,0.42)'; ctx.fillRect(x0 + 140, ry - 7, 90 * Math.sqrt(shown), 5);
      ctx.textAlign = 'right'; ctx.fillStyle = hi ? COL.orange : 'rgba(243,238,230,0.5)'; ctx.fillText(shown.toFixed(2), x0 + Wp - 7, ry);
    });
    ctx.restore();
  }
  const S28 = {
    name: 'Gato, please don’t let me go',
    start: F(2666), end: F(2860), vignette: 1,
    draw(ctx, t) {
      if (!GCW) { font(ctx, 500, GS, FONT.mono); GCW = ctx.measureText('M').width; }
      const g = ctx.createRadialGradient(960, 520, 100, 960, 540, 1200);
      g.addColorStop(0, '#1e1c1b'); g.addColorStop(1, '#0a0909');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM28);
      ctx.save(); applyCam(ctx, c);
      const fade = prog(t, F(2666), F(2676));
      ctx.globalAlpha = fade;
      // dashed guide lines + bracket
      ctx.strokeStyle = 'rgba(243,238,230,0.22)'; ctx.lineWidth = 1.2 / c.z; ctx.setLineDash([10, 8]);
      ctx.beginPath(); ctx.moveTo(-800, GY - 70); ctx.lineTo(3000, GY - 70); ctx.moveTo(-800, GY + 38); ctx.lineTo(3000, GY + 38); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(GX - 110, GY - 100); ctx.lineTo(GX - 110, GY + 60); ctx.stroke();
      font(ctx, 400, 30, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.5)'; ctx.fillText('›', GX - 75, GY - 6);
      // enter key
      const ek = prog(t, F(2848), F(2851));
      ctx.save();
      const kx = GX + 35 * GCW;
      if (t >= F(2770)) {
        ctx.strokeStyle = 'rgba(243,238,230,0.55)'; ctx.lineWidth = 1.5 / c.z; ctx.strokeRect(kx, GY - 42, 44, 40);
        if (ek > 0) { ctx.fillStyle = `rgba(255,106,31,${ek})`; ctx.shadowColor = OG; ctx.shadowBlur = 20; ctx.fillRect(kx, GY - 42, 44, 40); ctx.shadowBlur = 0; }
        font(ctx, 400, 22, FONT.mono); ctx.fillStyle = ek > 0.5 ? '#1a0a04' : 'rgba(243,238,230,0.7)'; ctx.fillText('↵', kx + 11, GY - 14);
      }
      ctx.restore();
      // typed words
      let cur = -1;
      GW.forEach((w, i) => { if (t >= w[3]) cur = i; });
      font(ctx, 500, GS, FONT.mono);
      GW.forEach((w, i) => {
        if (t < w[3]) return;
        const n = Math.max(1, Math.round(lerp(0, w[1] - w[0], prog(t, w[3], w[4]))));
        const isCur = i === cur;
        for (let ci = 0; ci < n; ci++) {
          const [ox, oy] = charOffset(t, i, ci, w[1] - w[0]);
          ctx.save();
          ctx.fillStyle = isCur ? '#ff8a3c' : COL.white;
          ctx.shadowColor = isCur ? OG : 'rgba(255,240,225,0.25)'; ctx.shadowBlur = isCur ? 24 : 6;
          ctx.translate(GX + (w[0] + ci) * GCW + ox, GY + oy);
          if (oy) ctx.rotate(oy * -0.0035 * (i === 0 ? 1 : 0));
          ctx.fillText(GTXT[w[0] + ci], 0, 0);
          ctx.restore();
        }
        const x = GX + w[0] * GCW;
        if (i >= cur - 1) { ctx.fillStyle = isCur ? 'rgba(255,106,31,0.9)' : 'rgba(255,106,31,0.45)'; ctx.fillRect(x, GY + 12, n * GCW, 2.4); }
        font(ctx, 400, 9, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.3)'; ctx.fillText(w[2], x, GY + 28);
        font(ctx, 500, GS, FONT.mono);
      });
      // cursor
      const lw = GW[Math.max(0, cur)];
      const endX = cur < 0 ? GX : GX + (lw[0] + Math.max(1, Math.round(lerp(0, lw[1] - lw[0], prog(t, lw[3], lw[4]))))) * GCW;
      if (cur < 0 || Math.floor(t * 3.2) % 2 === 0 || t < lw[4] + 0.1) { ctx.fillStyle = COL.orange; ctx.fillRect(endX + 4, GY - 42, 4, 52); }
      // info
      font(ctx, 600, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.75)'; ctx.fillText('PROMPT', GX - 90, GY + 76);
      ctx.fillStyle = COL.orange; ctx.fillText('03', GX - 36, GY + 76);
      font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.45)';
      ctx.fillText('T 0.2 · top-p 0.50 · 604 tasks', GX - 90, GY + 98);
      ctx.fillText(`P(doom) ${t >= F(2780) ? '0.50' : '0.49'} · cat-dependent`, GX - 90, GY + 120);
      if (t >= F(2770)) {
        ctx.textAlign = 'right'; font(ctx, 600, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.7)';
        ctx.fillText(`CONTEXT ${String(Math.max(3, cur + 1)).padStart(2, '0')} / 8192`, kx + 44, GY + 76);
        font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.45)'; ctx.fillText('↵ send  (irreversible)', kx + 44, GY + 98);
        ctx.textAlign = 'left';
      }
      panel28(ctx, t, c.z);
      ctx.restore();
    },
  };

  // =====================================================================
  // SCENE 29 · Outline hook: I'M UPPING MY P(DOOM) 0.42 → 0.81   (frames 2860–2900)
  // =====================================================================
  const STACK = [["I’M", F(2867)], ['UPPING', F(2875)], ['MY', F(2883)], ['P(DOOM)', F(2889)]];
  const S29 = {
    name: 'Outline hook · P(DOOM) 0.81',
    start: F(2860), end: F(2900), bloom: 0.3,
    draw(ctx, t) {
      ctx.fillStyle = '#0b0a09'; ctx.fillRect(0, 0, W, H);
      if (t < F(2866)) {
        font(ctx, 400, 28, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.75)'; ctx.fillText('go', 935, 556);
        ctx.fillStyle = COL.orange; ctx.fillRect(972, 532, 3, 30);
        return;
      }
      // giant outline counter
      const oa = prog(t, F(2866), F(2872)) * lerp(1, 2.3, prog(t, F(2888), F(2892)));
      font(ctx, 300, 712, FONT.mono);
      const v = lerp(42, 81, E.inOutCubic(prog(t, F(2889), F(2895))));
      const tens = v / 10, last = v % 10;
      const cw = ctx.measureText('0').width, x0 = 120, base = 800;
      ctx.save(); ctx.lineWidth = 2;
      const exit = prog(t, F(2895.5), F(2897));
      const ga0 = prog(t, F(2896), F(2899));
      ctx.strokeStyle = ga0 > 0 ? `rgba(255,110,40,${0.6 + 0.3 * ga0})` : `rgba(200,192,182,${0.22 * oa})`;
      ctx.strokeText('0', x0, base);
      ctx.globalAlpha = 1 - exit;
      ctx.strokeText('.', x0 + cw, base);
      const roll = (val, x, hot) => {
        const d = Math.floor(val), fr = val - d;
        ctx.save(); ctx.beginPath(); ctx.rect(x - 10, 200, cw + 20, 640); ctx.clip();
        ctx.strokeStyle = hot ? `rgba(255,110,40,${0.8 * oa})` : `rgba(200,192,182,${0.22 * oa})`;
        ctx.strokeText(String(d % 10), x, base - fr * 560);
        if (fr > 0.01) ctx.strokeText(String((d + 1) % 10), x, base + (1 - fr) * 560);
        ctx.restore();
      };
      const rolling = t >= F(2889);
      roll(Math.floor(tens + 1e-6) + Math.max(0, last - 9), x0 + cw * 2, rolling && t < F(2895));
      roll(last, x0 + cw * 3, rolling);
      ctx.restore();
      // scale bar under the counter
      if (t >= F(2889)) {
        ctx.globalAlpha = prog(t, F(2889), F(2892)) * (1 - exit);
        ctx.fillStyle = 'rgba(243,238,230,0.3)'; ctx.fillRect(108, 880, 1704, 1.5);
        ctx.fillStyle = 'rgba(243,238,230,0.75)'; ctx.fillRect(108, 878, 1704 * v / 100, 4);
        font(ctx, 400, 13, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.4)';
        ctx.fillText('0.00', 108, 905); ctx.textAlign = 'right'; ctx.fillText('1.00', 1812, 905);
        ctx.fillText('Δ +0.39 · posterior · sampled at a cat', 1812, 930); ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
      }
      // P(DOOM) label top-left
      if (t >= F(2893)) {
        const ga = prog(t, F(2896), F(2899));
        ctx.save(); ctx.globalAlpha = prog(t, F(2893), F(2895));
        font(ctx, 300, 82, FONT.sans);
        ctx.fillStyle = ga > 0 ? `rgb(${Math.round(lerp(236, 255, ga))},${Math.round(lerp(230, 120, ga))},${Math.round(lerp(220, 50, ga))})` : '#ece6dc';
        ctx.shadowColor = OG; ctx.shadowBlur = 30 * ga;
        ctx.save(); ctx.transform(1, 0, -0.2, 1, 170 * 0.2, 0); ctx.fillText('P', 120, 170); ctx.restore();
        ctx.fillText('(DOOM)', 120 + ctx.measureText('P').width + 6, 170);
        ctx.restore();
      }
      // stacked spaced caps at the centre
      ctx.save();
      ctx.strokeStyle = 'rgba(243,238,230,0.2)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(600, 562); ctx.lineTo(1320, 562); ctx.stroke();
      let k = -1; STACK.forEach((s, i) => { if (t >= s[1]) k = i; });
      const fadeAll = prog(t, F(2891), F(2894));
      STACK.forEach(([s, t0], i) => {
        if (t < t0) return;
        const slide = E.outCubic(prog(t, t0, t0 + 0.12));
        const y = 548 - (k - i) * 85 + (1 - slide) * 60 - (i === k ? 0 : 0);
        ctx.globalAlpha = slide * (i === 3 ? 1 - prog(t, F(2893), F(2895)) : 1 - fadeAll) * (i < k - 2 ? 0.4 : 1);
        font(ctx, i === 3 ? 400 : 400, 34, FONT.sans);
        ctx.letterSpacing = '9px'; ctx.textAlign = 'center';
        ctx.fillStyle = i === 3 ? '#ffb27a' : '#ece6dc';
        ctx.fillText(s, 960, y + 12);
        ctx.letterSpacing = '0px';
      });
      ctx.restore();
    },
  };

  // =====================================================================
  // SCENE 30 · as paperclips fill the room   (frames 2900–3000, continues in part 7)
  // =====================================================================
  const CLIPL = (() => {
    const pts = [];
    const arc = (cx, cy, r, a0, a1, n = 40) => { for (let i = 1; i <= n; i++) { const a = lerp(a0, a1, i / n); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    pts.push([-1400, 245], [520, 190]);
    arc(520, 0, 190, Math.PI / 2, -Math.PI / 2);
    pts.push([-560, -190]);
    arc(-560, -30, 160, -Math.PI / 2, -Math.PI * 1.5);
    pts.push([420, 130]);
    arc(420, 30, 100, Math.PI / 2, -Math.PI / 2);
    pts.push([-330, -70]);
    return new K.Path(pts);
  })();
  const LEAD = Math.hypot(1920, 55);
  // metallic sprite of one clip (drawn once)
  let SPR = null;
  function sprite() {
    const S = 0.32, w = Math.ceil(1440 * S) + 20, h = Math.ceil(400 * S) + 20;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.translate(w / 2, h / 2); g.scale(S, S); g.lineJoin = 'round'; g.lineCap = 'round';
    const p = new Path2D();
    CLIPL.pts.slice(1).forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])));
    g.strokeStyle = 'rgba(0,0,0,0.75)'; g.lineWidth = 44; g.stroke(p);
    g.strokeStyle = '#7d7974'; g.lineWidth = 30; g.stroke(p);
    g.strokeStyle = '#c9c5bf'; g.lineWidth = 18; g.stroke(p);
    g.translate(-4, -5); g.strokeStyle = '#f7f5f1'; g.lineWidth = 6; g.stroke(p);
    SPR = { c, w, h, S };
    return SPR;
  }
  // draw sprite with its centre at (x,y), rotation a, scale s, vertical squash q
  function clip2d(ctx, x, y, a, s, q = 1, alpha = 1) {
    const sp = SPR || sprite();
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.translate(x, y); ctx.rotate(a); ctx.scale(s / sp.S, s / sp.S * q);
    ctx.drawImage(sp.c, -sp.w / 2, -sp.h / 2);
    ctx.restore();
  }
  // a group of four clips: horizontal stack (type 0) or vertical row (type 1)
  function group(cb, cx, cy, type, s) {
    for (let i = 0; i < 4; i++) {
      const o = (i - 1.5) * 105;
      if (type === 0) cb(cx, cy + o, 0, s); else cb(cx + o, cy, Math.PI / 2, s);
    }
  }
  // clip drawn on the z=0 plane under a 3D camera (affine from local projection)
  function clip3d(ctx, cam, x, y, a, s) {
    const sp = SPR || sprite();
    const p = cam.project(x, y, 0);
    if (!p) return;
    const e = 10, ca = Math.cos(a), sa = Math.sin(a);
    const pa = cam.project(x + ca * e, y + sa * e, 0), pb = cam.project(x - sa * e, y + ca * e, 0);
    if (!pa || !pb) return;
    const k = s / sp.S / e;
    const ax = (pa[0] - p[0]) * k, ay = (pa[1] - p[1]) * k, bx = (pb[0] - p[0]) * k, by = (pb[1] - p[1]) * k;
    if (Math.abs(ax) + Math.abs(ay) < 0.004) return;
    if (p[0] < -300 || p[0] > W + 300 || p[1] < -300 || p[1] > H + 300) return;
    ctx.setTransform(ax, ay, bx, by, p[0], p[1]);
    ctx.drawImage(sp.c, -sp.w / 2, -sp.h / 2);
  }
  const HEAD30 = 'as paperclips fill the room';
  const HW30 = [[0, 2, F(2908)], [3, 13, F(2913)], [14, 18, F(2938)], [19, 22, F(2949)], [23, 27, F(2958)]];
  const sung30 = t => kf(t, [[F(2908), 0], [F(2911), 2, E.linear], [F(2913), 3, E.linear], [F(2932), 13, E.linear], [F(2938), 14, E.linear], [F(2945), 18, E.linear], [F(2949), 19, E.linear], [F(2952), 22, E.linear], [F(2958), 23, E.linear], [F(2966), 27, E.linear]]);
  function header30(ctx, t) {
    font(ctx, 400, 58, FONT.sans);
    const n = sung30(t);
    let act = -1; HW30.forEach((w, i) => { if (n > w[0]) act = i; });
    let x = 120;
    for (let i = 0; i < HEAD30.length; i++) {
      const wi = HW30.findIndex(w => i >= w[0] && i < w[1]);
      ctx.fillStyle = i >= n ? 'rgba(150,145,138,0.4)' : wi === act ? '#ff6a1f' : '#ece6dc';
      ctx.fillText(HEAD30[i], x, 168);
      x += ctx.measureText(HEAD30[i]).width;
    }
  }
  function card30(ctx, t) {
    const a = prog(t, F(2958), F(2966)) * (1 - prog(t, F(3015), F(3021)));
    if (a <= 0) return;
    const x = 990, y = 200, w = 780, h = 345;
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(28,27,26,0.92)'; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(243,238,230,0.18)'; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h);
    font(ctx, 600, 14, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.6)';
    ctx.fillText('✓  AUTOMATIC REPLY', x + 24, y + 34);
    ctx.textAlign = 'right'; ctx.fillText('DO NOT REPLY', x + w - 24, y + 34); ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(243,238,230,0.15)'; ctx.fillRect(x + 24, y + 48, w - 48, 1);
    font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.45)'; ctx.fillText('Subject', x + 24, y + 74);
    // typed subject line
    const words = [['Killswitch', F(2970), F(2978)], ['guy’s', F(2985), F(2990)], ['on', F(2994), F(2996)], ['PTO', F(2998), F(3004)]];
    let sx = x + 24; font(ctx, 600, 30, FONT.mono);
    let cur = -1; words.forEach((wd, i) => { if (t >= wd[1]) cur = i; });
    words.forEach(([wd, t0, t1], i) => {
      if (t < t0) return;
      const n = Math.max(1, Math.round(wd.length * prog(t, t0, t1)));
      ctx.fillStyle = i === cur ? '#ff6a1f' : '#ece6dc';
      ctx.fillText(wd.slice(0, n), sx, y + 116);
      sx += ctx.measureText(wd + ' ').width;
      if (i === cur) { ctx.fillStyle = '#ff6a1f'; ctx.fillRect(sx - ctx.measureText(wd + ' ').width + ctx.measureText(wd.slice(0, n)).width + 3, y + 90, 4, 32); }
    });
    font(ctx, 400, 17, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.72)';
    ['I’m out of office with limited access to', 'the killswitch. For urgent matters,', 'please contact —'].forEach((s, i) => ctx.fillText(s, x + 24, y + 176 + i * 26));
    font(ctx, 400, 12, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.4)';
    ctx.fillText('Returning: TBD', x + 24, y + 290);
    ctx.fillText('Current P(doom): 0.81 (this message was sent automatically)', x + 24, y + 310);
    ctx.restore();
  }
  // 3D camera over the clip floor (world units ≈ px at d = 974)
  function cam30(t) {
    const d = kf(t, [[F(2950), 1030], [F(2958), 1300, E.inOutSine], [F(2968), 2200, E.inOutSine], [F(2978), 2600, E.inOutSine], [F(2990), 1300, E.inOutSine], [F(3001), 950, E.linear], [F(3062), 760, E.linear]]);
    const pitch = kf(t, [[F(2976), 1.5707], [F(2988), 0.6, E.inOutSine], [F(3001), 0.3, E.inOutSine], [F(3062), 0.22, E.linear]]);
    const tx = kf(t, [[F(2950), 0], [F(2968), 250, E.inOutSine], [F(2978), 0, E.inOutSine]]);
    const ty = kf(t, [[F(2976), 0], [F(3001), 500, E.inOutSine], [F(3062), 1100, E.linear]]);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    return lookAt([tx, ty - cp * d - 0.01, sp * d], [tx, ty, 0], 0, 58);
  }
  const S30 = {
    name: 'as paperclips fill the room',
    start: F(2900), end: F(3062), vignette: 1, bloom: 0.4,
    draw(ctx, t) {
      ctx.fillStyle = '#080707'; ctx.fillRect(0, 0, W, H);
      if (!SPR) sprite();
      if (t < F(2950)) {
        // 1) orange wire draws a paperclip
        const total = CLIPL.total;
        const s = kf(t, [[F(2898), 0], [F(2902), LEAD + 900, E.outQuad], [F(2913), total, E.inOutSine]]);
        const s0 = kf(t, [[F(2904), 0], [F(2914), LEAD, E.inOutSine]]);
        const toSilver = prog(t, F(2918), F(2924));
        const mv = E.inOutCubic(prog(t, F(2918), F(2928)));
        if (toSilver < 1) {
          ctx.save();
          ctx.translate(968, lerp(548, 345, mv)); ctx.rotate(-0.04); ctx.scale(1, lerp(1, 0.8, mv));
          ctx.lineJoin = 'round'; ctx.lineCap = 'round';
          ctx.globalAlpha = 1 - toSilver;
          ctx.beginPath(); const head = CLIPL.trace(ctx, s0, s);
          ctx.strokeStyle = 'rgba(255,90,25,0.5)'; ctx.lineWidth = 16; ctx.filter = 'blur(7px)'; ctx.stroke(); ctx.filter = 'none';
          ctx.strokeStyle = '#ff7a32'; ctx.lineWidth = 11; ctx.shadowColor = OG; ctx.shadowBlur = 16; ctx.stroke();
          ctx.strokeStyle = 'rgba(255,220,190,0.7)'; ctx.lineWidth = 1.6; ctx.shadowBlur = 0; ctx.stroke();
          if (head && t < F(2918)) pen(ctx, head[0], head[1], 1.2, 1);
          ctx.restore();
        }
        if (toSilver > 0 && t < F(2934)) {
          clip2d(ctx, 968, lerp(548, 345, mv), -0.04, 1.0, lerp(1, 0.8, mv), toSilver);
          const k2 = E.outCubic(prog(t, F(2922), F(2928)));
          if (k2 > 0) clip2d(ctx, 968, lerp(900, 705, k2), -0.02, 1.0, 0.8, k2);
        }
        // 2) spinning stack
        if (t >= F(2934)) {
          const k = prog(t, F(2934), F(2938));
          const sc = lerp(1.0, 0.6, E.outCubic(k));
          for (let gst = 2; gst >= 0; gst--) {
            const ang = (t - F(2934)) * 5 - gst * 0.18;
            const sx = Math.cos(ang);
            for (let i = 0; i < 4; i++) {
              ctx.save(); ctx.translate(990, 534 + (i - 1.5) * 190 * sc); ctx.rotate(-0.25 + 0.15 * Math.sin(ang)); ctx.scale(Math.abs(sx) * 0.9 + 0.1, 1);
              clip2d(ctx, 0, 0, 0, sc, 0.85, gst ? 0.25 : 1);
              ctx.restore();
            }
          }
        }
      } else {
        // 3) groups tile the floor, then the camera tilts toward the horizon
        const cam = cam30(t);
        const R = kf(t, [[F(2950), 600], [F(2958), 900, E.linear], [F(2968), 1250, E.inOutSine], [F(2976), 9000, E.inQuad]]);
        const cell = 470, N = 9;
        const spin = 1 - prog(t, F(2950), F(2962));
        ctx.save();
        for (let gy = -N; gy <= N + 6; gy++) for (let gx = -N; gx <= N; gx++) {
          const cx = gx * cell - cell / 2 + 235, cy = gy * cell - 235 + 235;
          if (Math.hypot(cx, cy) > R) continue;
          const pc = cam.project(cx, cy, 0);
          if (!pc || pc[0] < -500 || pc[0] > W + 500 || pc[1] < -500 || pc[1] > H + 500) continue;
          const pe = cam.project(cx + 235, cy, 0);
          if (pe && Math.hypot(pe[0] - pc[0], pe[1] - pc[1]) < 9) continue;
          const type = (gx + gy) & 1;
          const wob = spin * Math.sin(t * 6 + gx * 1.7 + gy) * 0.4 * (hash(gx * 13 + gy * 7) > 0.6 ? 1 : 0);
          group((x, y, a, s) => clip3d(ctx, cam, x, y, a + wob, s), cx, cy, type, 0.3);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
        // horizon fade + glowing point
        const tilt = prog(t, F(2978), F(2995));
        if (tilt > 0) {
          const g = ctx.createLinearGradient(0, 0, 0, 560);
          g.addColorStop(0, `rgba(8,7,7,${tilt})`); g.addColorStop(1, 'rgba(8,7,7,0)');
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, 560);
          halo(ctx, 645, 330, 60, '255,110,35', 0.8 * prog(t, F(2994), F(3000)));
        }
      }
      if (t < F(2970)) header30(ctx, t);
      card30(ctx, t);
    },
  };

  Timeline.add(S26, S27, S28, S29, S30);
})();
