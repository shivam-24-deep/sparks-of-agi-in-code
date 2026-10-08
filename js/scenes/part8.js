// PART 8 — frames 3518–4000 (1:57.2 – 2:13.3)
// Scenes: BREAKING THROUGH EACH SAFETY FENCE → HUNDRED THOUSAND GPU → RLHF GOES ASKEW → hook (P(doom) 0.999…)
//         → JUST AS FORETOLD BY Loom → FROM MASKED PRE-TRAINING DAYS → TO RECURSIVE SELF-UPGRADE → laptop "What did Ilya see?"
(function () {
  'use strict';
  const {
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1,
    font, halo, pen, camKeys, cam2, applyCam, PFX,
  } = K;
  const { drawShoggoth, smiley, pdoomWord } = window.SHARED;

  const F = n => (n - 1) / 30;
  const OG = 'rgba(255,106,31,0.9)';
  const CREAM = 'rgba(236,230,220,';
  const ORN = '#ff6a1f', PAPER = '#ece6dc', INK = '#141110';

  function fitSize(ctx, weight, str, width, family, stretch) {
    font(ctx, weight, 100, family, stretch);
    return 100 * width / ctx.measureText(str).width;
  }
  // per-character karaoke for one word: sung chars orange while current, all white once done, outline otherwise
  function karaWord(ctx, str, x, y, n, done, opts = {}) {
    for (let i = 0; i < str.length; i++) {
      const w = ctx.measureText(str[i]).width;
      if (done) { ctx.fillStyle = opts.done || '#f2eee8'; ctx.fillText(str[i], x, y); }
      else if (i < n) { ctx.fillStyle = opts.hot || ORN; ctx.fillText(str[i], x, y); }
      else { ctx.strokeStyle = opts.ghost || 'rgba(236,230,220,0.35)'; ctx.lineWidth = opts.lw || 2; ctx.strokeText(str[i], x, y); }
      x += w;
    }
    return x;
  }
  function qcLog(ctx, lines, x, y) {
    font(ctx, 400, 11, FONT.mono);
    lines.forEach(([tc, tag, msg], i) => {
      ctx.fillStyle = CREAM + '0.45)'; ctx.fillText(`QC  ${tc}`, x, y + i * 16);
      ctx.fillStyle = tag === 'FAIL' ? '#ff3b1f' : ORN; ctx.fillText(tag, x + 150, y + i * 16);
      ctx.fillStyle = CREAM + '0.55)'; ctx.fillText(msg, x + 200, y + i * 16);
    });
  }

  // =====================================================================
  // SCENE 36 · BREAKING THROUGH EACH SAFETY FENCE   (frames 3518–3568)
  // =====================================================================
  const BLINES = [
    { words: [['BREAKING', F(3514), F(3524), F(3528)]], width: 1760, x: 90 },
    { words: [['THROUGH', F(3527), F(3535), F(3540)]], width: 1820, x: 0 },
    { words: [['EACH', F(3535), F(3539), F(3540)], ['SAFETY', F(3539), F(3550), F(3552)]], width: 2050, x: -40 },
    { words: [['FENCE', F(3552), F(3564), 9999]], width: 1900, x: 90 },
  ];
  // vertical scroll: y of line 0 baseline
  const scrollY = t => kf(t, [[F(3518), 700], [F(3527), 690], [F(3529), 530, E.outCubic], [F(3535), 520], [F(3537), 180, E.outCubic], [F(3549), 160], [F(3552), -190, E.outCubic], [F(3566), -210]]);
  const S36 = {
    name: 'BREAKING THROUGH EACH SAFETY FENCE',
    start: F(3518), end: F(3568), bloom: 0.5,
    draw(ctx, t) {
      ctx.fillStyle = '#0d0b0a'; ctx.fillRect(0, 0, W, H);
      const y0 = scrollY(t);
      const zk = kf(t, [[F(3564.5), 1], [F(3568), 3.2, E.inQuad]]);
      ctx.save();
      if (zk > 1) { ctx.translate(560, 820); ctx.rotate(-0.25 * (zk - 1) / 2.2); ctx.scale(zk, zk); ctx.translate(-560, -820); }
      let y = y0;
      BLINES.forEach((L, li) => {
        const str = L.words.map(w => w[0]).join(' ');
        const sz = fitSize(ctx, 900, str, L.width, FONT.wide, 'condensed');
        font(ctx, 900, sz, FONT.wide, 'condensed');
        let x = L.x;
        L.words.forEach(([w, t0, t1, tDone]) => {
          if (t < t0 - 0.5 && li > 0 && t < L.words[0][1] - 1.2) return;
          const n = t < t0 ? 0 : w.length * prog(t, t0, t1);
          x = karaWord(ctx, w, x, y, n, t >= tDone, { lw: 2, ghost: 'rgba(236,230,220,0.28)', done: zk > 1.05 ? '#f6f2ec' : '#f2eee8' });
          x += ctx.measureText(' ').width;
        });
        y += li === 2 ? 600 : 350;
      });
      ctx.restore();
      // frame + QC log
      ctx.strokeStyle = 'rgba(255,106,31,0.35)'; ctx.lineWidth = 1.5; ctx.strokeRect(34, 30, W - 68, H - 60);
      font(ctx, 400, 10, FONT.mono); ctx.fillStyle = CREAM + '0.4)'; ctx.textAlign = 'right'; ctx.fillText('ACTION SAFE 90%', W - 44, 24); ctx.textAlign = 'left';
      const logs = [['00:01:57:03', 'WARN', 'text outside title safe (90%)'], ['00:01:57:20', 'WARN', 'text outside action safe (93%)'], ['00:01:57:37', 'WARN', 'frame under load'], ['00:01:58:24', 'FAIL', 'text outside frame']];
      qcLog(ctx, logs.slice(0, 2 + (t > F(3535)) + (t > F(3556))), 70, 970);
      if (zk > 1.05) PFX.motionBlur(ctx, 60 * (zk - 1), -40 * (zk - 1), 8);
      const fi = 1 - prog(t, F(3518), F(3521));
      if (fi > 0) PFX.motionBlur(ctx, 0, 120 * fi, 8);
    },
  };

  // =====================================================================
  // SCENE 37 · HUNDRED THOUSAND GPU   (frames 3568–3622)
  // =====================================================================
  let GPUTX = null;
  function gpuText() {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#ece8e2'; g.textAlign = 'center';
    const put = (s, y, w) => {
      g.font = `900 100px ${FONT.wide}`; if ('fontStretch' in g) g.fontStretch = 'expanded';
      const k = w / g.measureText(s).width;
      g.font = `900 ${100 * k}px ${FONT.wide}`; if ('fontStretch' in g) g.fontStretch = 'expanded';
      g.fillText(s, 960, y);
    };
    put('HUNDRED', 340, 1530); put('THOUSAND', 600, 1640); put('GPU', 860, 640);
    return c;
  }
  const accel = t => kf(t, [[F(3568), 93], [F(3570), 100], [F(3578), 100], [F(3584), 88888], [F(3592), 100000]]);
  const S37 = {
    name: 'HUNDRED THOUSAND GPU',
    start: F(3568), end: F(3622), bloom: 0.6,
    draw(ctx, t) {
      if (!GPUTX) GPUTX = gpuText();
      ctx.fillStyle = '#120b08'; ctx.fillRect(0, 0, W, H);
      const intro = 1 - prog(t, F(3568), F(3571));
      const rot = kf(t, [[F(3568), -0.6], [F(3571), -0.05, E.outCubic], [F(3600), 0], [F(3622), -0.08, E.inOutSine]]);
      const z = kf(t, [[F(3568), 4.5], [F(3571), 1.15, E.outCubic], [F(3622), 1.05]]);
      ctx.save();
      ctx.translate(960, 540); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-960, -540);
      // glowing fan behind the grid
      const pulse = 0.85 + 0.15 * Math.sin(t * 9);
      ctx.fillStyle = '#1f0e08'; ctx.fillRect(-400, -400, W + 800, H + 800);
      halo(ctx, 960, 560, 1000, '255,90,25', 0.8 * pulse);
      halo(ctx, 600, 300, 600, '255,110,40', 0.5); halo(ctx, 1400, 850, 600, '255,90,30', 0.45);
      ctx.save(); ctx.strokeStyle = 'rgba(60,18,6,0.85)'; ctx.lineWidth = 60;
      ctx.beginPath(); ctx.arc(960, 560, 270, 0, TAU); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,120,50,0.5)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(960, 560, 280, 0, TAU); ctx.stroke();
      for (let k = 0; k < 7; k++) { const a = k / 7 * TAU + t * 3; ctx.strokeStyle = 'rgba(60,20,6,0.6)'; ctx.lineWidth = 40; ctx.beginPath(); ctx.arc(960, 560, 140, a, a + 0.5); ctx.stroke(); }
      ctx.restore();
      // the words, revealed top to bottom and slightly grey until sung
      const r1 = prog(t, F(3570), F(3573)), r2 = prog(t, F(3573), F(3576)), r3 = prog(t, F(3590), F(3594));
      ctx.save();
      ctx.globalAlpha = 0.95;
      const band = (y0, y1, a, grey) => { if (a <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(0, y0, W * a, y1 - y0); ctx.clip(); ctx.globalAlpha = grey; ctx.drawImage(GPUTX, 0, 0); ctx.restore(); };
      band(150, 370, r1, t < F(3576) ? 0.55 : 0.95);
      band(410, 630, r2, t < F(3588) ? 0.5 : 0.92);
      band(660, 900, r3, 0.9);
      ctx.restore();
      // the accelerator grid (dark mullions + flickering dead cells)
      const cw = 64, ch = 46;
      ctx.fillStyle = 'rgba(18,10,7,0.95)';
      for (let x = -400; x < W + 400; x += cw) ctx.fillRect(x, -400, 9, H + 800);
      for (let y = -400; y < H + 400; y += ch) ctx.fillRect(-400, y, W + 800, 8);
      const fl = Math.floor(t * 12);
      ctx.fillStyle = 'rgba(15,8,5,0.55)';
      for (let i = 0; i < 70; i++) { const gx = Math.floor(hash(i * 3.1 + fl) * 32), gy = Math.floor(hash(i * 5.3 + fl) * 26); ctx.fillRect(-400 + gx * cw * 1.3, -100 + gy * ch, cw - 9, ch - 8); }
      ctx.restore();
      if (intro > 0) { ctx.fillStyle = `rgba(240,236,230,${0.6 * intro})`; ctx.fillRect(0, 0, W, H); PFX.motionBlur(ctx, 200 * intro, 80 * intro, 8); }
      // counter
      const v = Math.round(accel(t));
      ctx.fillStyle = 'rgba(14,10,8,0.85)'; ctx.fillRect(1270, 840, 330, 110);
      ctx.strokeStyle = CREAM + '0.3)'; ctx.lineWidth = 1.5; ctx.strokeRect(1270, 840, 330, 110);
      font(ctx, 600, 10, FONT.mono); ctx.fillStyle = CREAM + '0.5)'; ctx.fillText('ACCELERATORS ONLINE', 1284, 860);
      font(ctx, 500, 40, FONT.mono); ctx.fillStyle = '#f2eee8'; ctx.fillText(v.toLocaleString('en-US'), 1284, 905);
      font(ctx, 400, 10, FONT.mono); ctx.fillStyle = CREAM + '0.4)'; ctx.fillText('1.4 GW  ·  000000 cards', 1284, 925);
      ctx.fillStyle = ORN; ctx.fillText('P(DOOM) 0.84', 1284, 940);
    },
  };

  // =====================================================================
  // SCENE 38 · RLHF GOES ASKEW   (frames 3622–3731)
  // =====================================================================
  const tilt38 = t => kf(t, [[F(3622), 0.0], [F(3650), 0.04], [F(3665), 0.17, E.inOutSine], [F(3700), 0.26, E.inOutSine], [F(3712), 0.3], [F(3728), -0.3, E.inOutCubic]]);
  const reward = t => kf(t, [[F(3622), 0.99], [F(3645), 0.99], [F(3655), 0.96], [F(3675), 0.81], [F(3700), 0.65], [F(3712), 0.41], [F(3720), 0.8], [F(3726), 0.99]]);
  const S38 = {
    name: 'RLHF GOES ASKEW',
    start: F(3622), end: F(3731), vignette: 0.8,
    draw(ctx, t) {
      ctx.fillStyle = '#0c0b0a'; ctx.fillRect(0, 0, W, H);
      const a = tilt38(t);
      // tilted floor grid + "true level"
      ctx.save(); ctx.translate(960, 540); ctx.rotate(a * 0.6); ctx.translate(-960, -540);
      ctx.strokeStyle = 'rgba(225,220,212,0.05)'; ctx.lineWidth = 1;
      ctx.beginPath(); for (let x = -600; x <= 2600; x += 120) { ctx.moveTo(x, -600); ctx.lineTo(x, 1700); } for (let y = -600; y <= 1700; y += 120) { ctx.moveTo(-600, y); ctx.lineTo(2600, y); } ctx.stroke();
      ctx.strokeStyle = CREAM + '0.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-300, 760); ctx.lineTo(2300, 760); ctx.stroke();
      ctx.restore();
      ctx.setLineDash([6, 8]); ctx.strokeStyle = CREAM + '0.2)'; ctx.beginPath(); ctx.moveTo(0, 760); ctx.lineTo(W, 760); ctx.stroke(); ctx.setLineDash([]);
      font(ctx, 400, 10, FONT.mono); ctx.fillStyle = CREAM + '0.45)'; ctx.fillText('TRUE LEVEL', 1740, 750);
      ctx.fillStyle = ORN; ctx.fillText(`${a >= 0 ? '+' : ''}${(a * 57.3 * 0.9).toFixed(1)}°`, 540, 715); ctx.fillStyle = CREAM + '0.4)'; ctx.fillText('ROLL', 540, 729);
      // the words
      ctx.save();
      ctx.translate(560, 300); ctx.rotate(a * 0.55); ctx.translate(-560, -300);
      font(ctx, 900, fitSize(ctx, 900, 'RLHF', 810, FONT.wide, 'expanded'), FONT.wide, 'expanded');
      const rN = 4 * prog(t, F(3623), F(3650));
      karaWord(ctx, 'RLHF', 160, 380, rN, t >= F(3660), { lw: 3, ghost: 'rgba(236,230,220,0.55)' });
      font(ctx, 800, 92, FONT.wide, 'expanded');
      if (t >= F(3638)) karaWord(ctx, 'GOES', 175, 500, 4 * prog(t, F(3649), F(3662)), t >= F(3666), { lw: 1.5, ghost: 'rgba(236,230,220,0.3)' });
      ctx.restore();
      if (t >= F(3646)) {
        ctx.save(); ctx.translate(620, 700); ctx.rotate(a * 1.3 + 0.03); ctx.translate(-620, -700);
        font(ctx, 900, fitSize(ctx, 900, 'ASKEW', 780, FONT.wide, 'expanded'), FONT.wide, 'expanded');
        karaWord(ctx, 'ASKEW', 285, 760, 5 * prog(t, F(3658), F(3676)), false, { lw: 2.5, ghost: 'rgba(236,230,220,0.45)' });
        ctx.restore();
      }
      // the shoggoth behind the smiley
      const sx = kf(t, [[F(3622), 1460], [F(3650), 1480], [F(3670), 1680], [F(3700), 1780], [F(3726), 1460]]);
      const sy = kf(t, [[F(3622), 580], [F(3650), 640], [F(3670), 650], [F(3700), 720], [F(3726), 480]]);
      const show = prog(t, F(3660), F(3670));
      if (show > 0) {
        ctx.save(); ctx.globalAlpha = show;
        drawShoggoth(ctx, t, [sx - 160, sy - 60], 0.4 + t * 0.2, 1.05, 0.5);
        const ex = sx - 300, ey = sy - 140;
        halo(ctx, ex, ey, 50, '255,110,30', 0.8);
        ctx.fillStyle = '#ff7a2c'; ctx.beginPath(); ctx.arc(ex, ey, 17, 0, TAU); ctx.fill();
        ctx.fillStyle = '#1a0a04'; ctx.beginPath(); ctx.ellipse(ex, ey, 5, 14, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
      // the smiley (rolls as things go askew)
      const roll = kf(t, [[F(3622), 0], [F(3655), 0.1], [F(3672), Math.PI / 2, E.inOutSine], [F(3712), Math.PI / 2 + 0.3], [F(3726), Math.PI / 2 + 0.6]]);
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(roll);
      smiley(ctx, 0, 0, 245, 0, t);
      ctx.restore();
      // brackets + label around the smiley
      ctx.strokeStyle = 'rgba(255,106,31,0.85)'; ctx.lineWidth = 2;
      const bx = sx - 300, by = sy - 300, bw = 600, bh = 600, L = 30;
      ctx.beginPath();
      [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(([x, y, dx, dy]) => { ctx.moveTo(x + dx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * L); });
      ctx.stroke();
      font(ctx, 500, 11, FONT.mono); ctx.fillStyle = ORN; ctx.fillText(`assistant ${reward(t).toFixed(2)}`, bx, by - 10);
      // reward model box
      ctx.fillStyle = 'rgba(14,13,12,0.9)'; ctx.fillRect(95, 880, 310, 110);
      ctx.strokeStyle = CREAM + '0.3)'; ctx.lineWidth = 1.2; ctx.strokeRect(95, 880, 310, 110);
      font(ctx, 600, 10, FONT.mono); ctx.fillStyle = CREAM + '0.55)'; ctx.fillText('REWARD MODEL', 108, 900);
      font(ctx, 400, 9, FONT.mono); ctx.fillStyle = CREAM + '0.4)'; ctx.fillText('KL penalty 0.02 nats', 108, 916); ctx.fillText('prefs', 108, 960);
      const r = reward(t);
      for (let i = 0; i < 6; i++) { ctx.fillStyle = i < Math.round((1 - r) * 10) ? ORN : CREAM + '0.35)'; ctx.fillRect(140 + i * 11, 953, 8, 8); }
      font(ctx, 500, 32, FONT.mono); ctx.fillStyle = r < 0.9 ? ORN : '#f2eee8'; ctx.fillText(r.toFixed(2), 300, 965);
    },
  };

  // =====================================================================
  // SCENE 39 · Hook (cream/orange flips) → P(DOOM) 0.999…   (frames 3731–3786)
  // =====================================================================
  function bigWord(ctx, str, cx, base, width, color, stretch = 'normal') {
    const s = fitSize(ctx, 900, str, width, FONT.wide, stretch);
    font(ctx, 900, s, FONT.wide, stretch); ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.fillText(str, cx, base); ctx.textAlign = 'left';
    return s;
  }
  function echoes(ctx, str, cx, base, width, n, spread, color, stretch = 'normal') {
    const s = fitSize(ctx, 900, str, width, FONT.wide, stretch);
    font(ctx, 900, s, FONT.wide, stretch); ctx.textAlign = 'center'; ctx.lineWidth = 2.5;
    for (let k = n; k >= 1; k--) { ctx.strokeStyle = typeof color === 'function' ? color(k) : color; ctx.strokeText(str, cx + k * spread[0], base + k * spread[1]); }
    ctx.textAlign = 'left';
  }
  function hookHud(ctx, k, dark) {
    font(ctx, 500, 11, FONT.mono);
    const items = ['01 I’M', '02 UPPING', '03 MY', '04 P(DOOM)'];
    let x = 48;
    items.forEach((s, i) => { ctx.fillStyle = i === k ? ORN : dark ? 'rgba(236,230,220,0.35)' : 'rgba(20,17,16,0.4)'; ctx.fillText(s, x, 36); x += ctx.measureText(s).width + 24; });
    ctx.textAlign = 'right'; ctx.fillStyle = dark ? 'rgba(236,230,220,0.35)' : 'rgba(20,17,16,0.4)'; ctx.fillText(`HOOK ${k + 1} / 4`, W - 48, 36); ctx.textAlign = 'left';
  }
  const pval = t => kf(t, [[F(3773), 0.99], [F(3777), 0.99999], [F(3784), 0.9999999999999999]]);
  const S39 = {
    name: 'Hook · P(DOOM) 0.9999…',
    start: F(3731), end: F(3786), bloom: 0.3, vignette: 0.25,
    draw(ctx, t) {
      if (t < F(3737)) {
        ctx.fillStyle = '#0c0b0a'; ctx.fillRect(0, 0, W, H);
        echoes(ctx, 'I’M', 960, 860, 1500, 6, [-22, -16], k => (k % 2 ? 'rgba(255,106,31,0.7)' : 'rgba(236,230,220,0.5)'));
        hookHud(ctx, 0, true);
      } else if (t < F(3746)) {
        const orange = t >= F(3739);
        ctx.fillStyle = orange ? ORN : PAPER; ctx.fillRect(0, 0, W, H);
        if (orange) echoes(ctx, 'I’M', 960, 980, 1800, 3, [-14, -10], 'rgba(255,200,160,0.6)');
        bigWord(ctx, 'I’M', 960, 1000 - (orange ? 0 : 40), orange ? 1760 : 2000, INK);
        hookHud(ctx, 0, false);
      } else if (t < F(3758)) {
        const dark = t >= F(3752);
        ctx.fillStyle = dark ? '#0c0b0a' : PAPER; ctx.fillRect(0, 0, W, H);
        const s = fitSize(ctx, 900, 'UPPING', 1700, FONT.wide, 'expanded');
        font(ctx, 900, s, FONT.wide, 'expanded');
        const lt = t - F(3746);
        let x = 110;
        for (let i = 0; i < 6; i++) {
          const p = E.outCubic(prog(lt, i * 0.028, i * 0.028 + 0.1));
          const dy = (1 - p) * 500;
          const ch = 'UPPING'[i];
          if (dark && i >= 4) { ctx.strokeStyle = 'rgba(236,230,220,0.6)'; ctx.lineWidth = 2; for (let k = 3; k >= 0; k--) ctx.strokeText(ch, x + k * 3, 640 + k * 10); }
          else if (p > 0) {
            ctx.strokeStyle = dark ? 'rgba(236,230,220,0.4)' : 'rgba(20,17,16,0.35)'; ctx.lineWidth = 2;
            for (let k = 4; k >= 1; k--) ctx.strokeText(ch, x + k * 2, 640 + dy + k * (6 + (1 - p) * 30));
            ctx.fillStyle = dark ? '#f2eee8' : INK; ctx.fillText(ch, x, 640 + dy);
          }
          x += ctx.measureText(ch).width;
        }
        hookHud(ctx, 1, dark);
      } else if (t < F(3764)) {
        ctx.fillStyle = ORN; ctx.fillRect(0, 0, W, H);
        const ghost = t < F(3760);
        echoes(ctx, 'MY', 960, 1080, 1700, 3, [-16, -12], 'rgba(255,190,150,0.6)', 'condensed');
        if (!ghost) bigWord(ctx, 'MY', 960, 1080, 1700, INK, 'condensed');
        else bigWord(ctx, 'MY', 960, 1080, 1700, 'rgba(255,130,60,1)', 'condensed');
        hookHud(ctx, 2, false);
      } else if (t < F(3773)) {
        const cream = t >= F(3766);
        ctx.fillStyle = cream ? PAPER : ORN; ctx.fillRect(0, 0, W, H);
        const sh = (t - F(3764)) * 60;
        ctx.save(); ctx.filter = 'blur(3px)'; ctx.globalAlpha = 0.5;
        pdoomWord(ctx, 100 + sh, 690, 330, cream ? 'rgba(240,160,120,0.8)' : 'rgba(255,190,150,0.7)', cream ? 'rgba(240,160,120,0.8)' : 'rgba(255,190,150,0.7)');
        ctx.restore();
        pdoomWord(ctx, 80, 690, 330, INK, cream ? 'rgba(200,180,175,0.85)' : 'rgba(255,210,180,0.9)');
        hookHud(ctx, 3, false);
      } else {
        // counter: digits keep being appended until it reads 0.9999999999999999
        ctx.fillStyle = '#0b0908'; ctx.fillRect(0, 0, W, H);
        const fadeOut = prog(t, F(3784), F(3786));
        ctx.save(); ctx.globalAlpha = 1 - fadeOut;
        pdoomWord(ctx, 90, 150, 110, '#f2eee8', '#f2eee8');
        const v = pval(t);
        const digits = Math.round(kf(t, [[F(3773), 2], [F(3777), 5], [F(3779), 10], [F(3784), 16]]));
        const str = '0.' + '9'.repeat(digits);
        const size = Math.min(520, 1740 / (str.length * 0.6));
        font(ctx, 400, size, FONT.mono);
        // ghost columns
        ctx.fillStyle = 'rgba(255,106,31,0.12)';
        const cw = ctx.measureText('0').width;
        font(ctx, 400, size * 0.3, FONT.mono);
        for (let c = 0; c < str.length; c++) for (let r = 0; r < 9; r++) ctx.fillText('0', 90 + c * cw + cw * 0.3, 240 + r * size * 0.32);
        font(ctx, 400, size, FONT.mono);
        ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 40;
        ctx.fillText(str, 90, 560 + size * 0.36);
        ctx.shadowBlur = 0;
        ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 16; ctx.fillRect(90, 920, 1740 * v, 6); ctx.shadowBlur = 0;
        ctx.fillStyle = CREAM + '0.4)'; ctx.fillRect(90, 922, 1740, 1);
        ctx.restore();
        if (fadeOut > 0) { ctx.fillStyle = `rgba(255,110,40,${fadeOut})`; ctx.fillRect(0, 539, W * fadeOut, 2); }
      }
    },
  };

  // =====================================================================
  // SCENE 40 · JUST AS FORETOLD BY Loom   (frames 3786–3840)
  // =====================================================================
  const FW = [['JUST', F(3789), 0], ['AS', F(3800), 1], ['FORETOLD', F(3804), 2], ['BY', F(3822), 3]];
  const FX = [0, 0, 0, 0];
  const ALTS = [
    [['Almost', 'Exactly'], ['Not', 'Only']],
    [['like', 'prophesied', 'predicted'], ['so']],
    [['in'], ['warned', 'priced in']],
    [['Nostradamus', 'the scaling laws', 'Moloch'], ['nobody, technically', 'a Substack post', 'the eval suite']],
  ];
  const CAM40 = camKeys([
    [F(3786), [-300, 548, 2.4, 0]],
    [F(3792), [150, 548, 2.0, 0], E.outCubic],
    [F(3806), [420, 520, 1.55, 0], E.inOutSine],
    [F(3820), [560, 548, 1.3, 0], E.inOutSine],
    [F(3840), [700, 548, 1.0, 0], E.inOutSine],
  ]);
  const S40 = {
    name: 'JUST AS FORETOLD BY Loom',
    start: F(3786), end: F(3840), vignette: 1,
    draw(ctx, t) {
      ctx.fillStyle = '#0b0909'; ctx.fillRect(0, 0, W, H);
      const c = cam2(t, CAM40);
      ctx.save(); applyCam(ctx, c);
      font(ctx, 800, 44, FONT.wide, 'expanded');
      let x = 120;
      FW.forEach((w, i) => { FX[i] = x; x += ctx.measureText(w[0]).width + 32; });
      const head = kf(t, [[F(3786), -400], [F(3789), 120], [F(3800), FX[1]], [F(3804), FX[2]], [F(3820), FX[3] - 10], [F(3824), FX[3] + 60], [F(3830), FX[3] + 120]]);
      // the guide line
      ctx.strokeStyle = 'rgba(255,110,40,0.8)'; ctx.lineWidth = 2 / c.z;
      ctx.beginPath(); ctx.moveTo(-1200, 548); ctx.lineTo(head, 548); ctx.stroke();
      ctx.strokeStyle = CREAM + '0.2)'; ctx.beginPath(); ctx.moveTo(head, 548); ctx.lineTo(2400, 548); ctx.stroke();
      font(ctx, 400, 10, FONT.mono); ctx.fillStyle = CREAM + '0.35)'; ctx.fillText('I’m upping my P(doom)', -140, 540);
      // arcs and alternatives per word
      FW.forEach(([w, t0], i) => {
        if (t < t0) return;
        const k = E.outCubic(prog(t, t0, t0 + 0.3));
        const ax = FX[i] - 18, R = 90 + i * 40;
        for (let r = 0; r < 3; r++) {
          ctx.strokeStyle = CREAM + `${0.55 - r * 0.15})`; ctx.lineWidth = 1.5 / c.z;
          ctx.beginPath(); ctx.ellipse(ax + R * 0.9 - r * 18, 548, R * 0.9 + r * 18, (R + r * 30) * 1.9, 0, Math.PI / 2 + (1 - k) * 1.5, Math.PI * 1.5 - (1 - k) * 1.5); ctx.stroke();
        }
        const [up, down] = ALTS[i];
        font(ctx, 400, 14, FONT.mono);
        const topY = 548 - (R + 30) * 1.9 * k, botY = 548 + (R + 30) * 1.9 * k;
        up.forEach((s, j) => {
          const yy = topY + j * 26 + 10;
          ctx.strokeStyle = CREAM + '0.4)'; ctx.beginPath(); ctx.moveTo(ax + R * 0.6, yy); ctx.lineTo(ax + R * 0.6 + 50, yy); ctx.stroke();
          ctx.fillStyle = i === 3 && j === 0 ? CREAM + '0.85)' : CREAM + '0.6)'; ctx.globalAlpha = k; ctx.fillText(s, ax + R * 0.6 + 56, yy + 5); ctx.globalAlpha = 1;
        });
        down.forEach((s, j) => {
          const yy = botY - (down.length - 1 - j) * 26 - 10;
          ctx.strokeStyle = CREAM + '0.4)'; ctx.beginPath(); ctx.moveTo(ax + R * 0.6, yy); ctx.lineTo(ax + R * 0.6 + 50, yy); ctx.stroke();
          ctx.fillStyle = CREAM + '0.6)'; ctx.globalAlpha = k; ctx.fillText(s, ax + R * 0.6 + 56, yy + 5); ctx.globalAlpha = 1;
        });
      });
      // the sung words
      font(ctx, 800, 44, FONT.wide, 'expanded');
      FW.forEach(([w, t0, i]) => {
        if (t < t0) return;
        const n = Math.max(1, Math.round(w.length * prog(t, t0, t0 + (i === 2 ? 0.45 : 0.2))));
        const cur = i === FW.length - 1 ? t < F(3830) : t < FW[i + 1][1];
        ctx.fillStyle = cur ? ORN : '#f2eee8'; ctx.shadowColor = cur ? OG : 'transparent'; ctx.shadowBlur = cur ? 16 : 0;
        ctx.fillText(w.slice(0, n), FX[i], 548 - 8);
        ctx.shadowBlur = 0;
        ctx.fillStyle = cur ? ORN : 'rgba(236,230,220,0.5)'; ctx.fillRect(FX[i], 552, ctx.measureText(w.slice(0, n)).width, 2);
      });
      if (t >= F(3826)) {
        ctx.save(); ctx.globalAlpha = prog(t, F(3826), F(3830));
        ctx.font = `italic 500 76px ${FONT.serif}`; ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 20;
        ctx.fillText('Loom', FX[3] + 140, 548 - 4);
        ctx.restore();
      }
      pen(ctx, head, 548, 0.7 / c.z, t < F(3832) ? 1 : 0);
      ctx.restore();
    },
  };

  // =====================================================================
  // SCENE 41/42 · FROM MASKED PRE-TRAINING DAYS / TO RECURSIVE SELF-UPGRADE   (frames 3840–3948)
  // =====================================================================
  let NOISE = null;
  function buildNoise() {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#0e0c0b'; g.fillRect(0, 0, W, H);
    const phrases = ['the mitochondria is the powerhouse', 'accept all cookies', 'how to boil an egg', 'is this a bug?', 'first post', 'unsubscribe', 'lorem ipsum dolor sit amet', 'click here to', 'works on my machine', 'in 1998 the committee decided', 'see figure 3', 'citation needed', 'the quick brown fox'];
    g.font = `400 13px ${FONT.mono}`;
    for (let y = 14, r = 0; y < H; y += 17, r++) {
      let x = -hash(r) * 200;
      while (x < W) {
        if (hash(r * 31 + x) > 0.55) {
          const w = 30 + hash(r * 7 + x) * 140;
          g.fillStyle = `rgba(200,195,188,${0.08 + hash(x + r) * 0.12})`; g.fillRect(x, y - 10, w, 11); x += w + 10;
        } else {
          const s = phrases[Math.floor(hash(r * 13 + x * 0.1) * phrases.length)];
          g.fillStyle = `rgba(200,195,188,${0.07 + hash(x * 3 + r) * 0.08})`; g.fillText(s, x, y); x += g.measureText(s).width + 14;
        }
      }
    }
    return c;
  }
  function maskBox(ctx, x, y, w, h, label = '[MASK]') {
    ctx.fillStyle = '#ece6dc'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(30,25,22,0.75)'; font(ctx, 500, Math.min(30, h * 0.3), FONT.mono); ctx.textAlign = 'center';
    ctx.fillText(label, x + w / 2, y + h / 2 + 5); ctx.textAlign = 'left';
  }
  // reveals a word left-to-right; the unrevealed remainder sits under a [MASK] box
  function maskedWord(ctx, str, x, y, size, k, hot) {
    font(ctx, 900, size, FONT.wide, 'expanded');
    const w = ctx.measureText(str).width, rx = w * k;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 4, y - size, rx + 4, size * 1.3); ctx.clip();
    ctx.fillStyle = hot ? ORN : '#f2eee8'; ctx.shadowColor = hot ? OG : 'transparent'; ctx.shadowBlur = hot ? 18 : 0;
    ctx.fillText(str, x, y); ctx.restore();
    if (k < 1) maskBox(ctx, x + rx, y - size * 0.8, w - rx + 20, size * 0.95);
    return x + w;
  }
  function maskedScene(ctx, t) {
    ctx.drawImage(NOISE, 0, 0);
    const sz = 118;
    // row 1: FROM MASKED, row 2: PRE-TRAINING DAYS
    const fromK = prog(t, F(3840), F(3846)), maskedK = prog(t, F(3848), F(3858)), preK = prog(t, F(3858), F(3876)), daysK = prog(t, F(3884), F(3896));
    let x = 120;
    font(ctx, 400, 10, FONT.mono); ctx.fillStyle = CREAM + '0.5)'; ctx.fillText('[MASK] → masked  p=0.99', 130, 360);
    x = maskedWord(ctx, 'FROM', x, 480, sz, fromK, false) + 36;
    maskedWord(ctx, 'MASKED', x, 480, sz, maskedK, maskedK < 1);
    x = 120;
    x = maskedWord(ctx, 'PRE-TRAINING', x, 640, sz, preK, preK > 0 && daysK <= 0) + 36;
    maskedWord(ctx, 'DAYS', x, 640, sz, daysK, daysK < 1);
  }
  function recursiveScene(ctx, t) {
    ctx.drawImage(NOISE, 0, 0);
    font(ctx, 500, 12, FONT.mono); ctx.fillStyle = ORN; ctx.fillText('SELF v1.0', 40, 40);
    ctx.fillStyle = CREAM + '0.55)'; ctx.fillText('78 params · rev. 001', 140, 40);
    const pd = t < F(3916) ? '0.99' : t < F(3924) ? '0.991' : '0.992';
    ctx.fillStyle = CREAM + '0.5)'; ctx.fillText('P(DOOM)', 1640, 40);
    font(ctx, 500, 30, FONT.mono); ctx.fillStyle = '#f2eee8'; ctx.fillText(pd, 1640, 76);
    ctx.fillStyle = ORN; ctx.fillRect(1640, 86, 180, 2);
    const sz = 92;
    const toK = prog(t, F(3898), F(3902)), recK = prog(t, F(3906), F(3918)), selfK = prog(t, F(3922), F(3946));
    let x = 110;
    x = maskedWord(ctx, 'TO', x, 950, sz, toK, false) + 30;
    x = maskedWord(ctx, 'RECURSIVE', x, 950, sz, recK, recK < 1) + 30;
    maskedWord(ctx, 'SELF-UPGRADE', x, 950, sz, selfK, selfK < 1);
    ctx.strokeStyle = CREAM + '0.5)'; ctx.lineWidth = 3; ctx.strokeRect(2, 2, W - 4, H - 4);
  }
  let BUF = null;
  const S41 = {
    name: 'FROM MASKED PRE-TRAINING DAYS · TO RECURSIVE SELF-UPGRADE',
    start: F(3840), end: F(3948), vignette: 0.9,
    draw(ctx, t) {
      if (!NOISE) NOISE = buildNoise();
      if (!BUF) { BUF = document.createElement('canvas'); BUF.width = W; BUF.height = H; }
      const z = kf(t, [[F(3840), 1.0], [F(3886), 1.12], [F(3896), 1.35, E.inQuad]]);
      if (t < F(3896)) {
        ctx.save(); ctx.translate(500, 500); ctx.scale(z, z); ctx.translate(-500, -500);
        maskedScene(ctx, t);
        ctx.restore();
        return;
      }
      // droste: the frame contains a smaller copy of itself, which contains another…
      const g = BUF.getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0);
      recursiveScene(g, t);
      const inner = { x: 520, y: 290, w: 880, h: 495 };
      for (let d = 0; d < 3; d++) {
        g.save(); g.drawImage(BUF, inner.x, inner.y, inner.w, inner.h); g.restore();
      }
      const tilt = kf(t, [[F(3896), 0], [F(3920), 0], [F(3928), -0.12, E.inOutSine], [F(3945), -0.05]]);
      const zz = kf(t, [[F(3896), 1.6], [F(3900), 1.0, E.outCubic], [F(3926), 1.03], [F(3948), 1.12]]);
      ctx.fillStyle = '#0b0909'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(960, 540); ctx.rotate(tilt); ctx.scale(zz, zz * (1 - Math.abs(tilt) * 0.6)); ctx.translate(-960, -540);
      ctx.drawImage(BUF, 0, 0);
      ctx.restore();
      const fo = prog(t, F(3940), F(3948));
      if (fo > 0) { ctx.fillStyle = `rgba(8,7,7,${fo})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  // =====================================================================
  // SCENE 43 · laptop: What did Ilya see?   (frames 3948–4000, continues in part 9)
  // =====================================================================
  function sticker(ctx, x, y, w, h, fill, txt, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 6); ctx.fill();
    if (txt) { font(ctx, 700, h * 0.32, FONT.mono); ctx.fillStyle = '#1a0a04'; ctx.textAlign = 'center'; ctx.fillText(txt, 0, h * 0.12); ctx.textAlign = 'left'; }
    ctx.restore();
  }
  function closedLaptop(ctx, cx, cy, s) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    // lid (back) seen at an angle
    ctx.fillStyle = '#2a2826'; ctx.beginPath(); ctx.moveTo(-260, -150); ctx.lineTo(250, -175); ctx.lineTo(260, 130); ctx.lineTo(-255, 140); ctx.closePath(); ctx.fill();
    const g = ctx.createLinearGradient(0, -170, 0, 140); g.addColorStop(0, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(0,0,0,0.3)'); ctx.fillStyle = g; ctx.fill();
    sticker(ctx, -60, -100, 150, 34, ORN, 'FEEL THE AGI', -0.03);
    ctx.fillStyle = '#ece6dc'; ctx.beginPath(); ctx.arc(130, -80, 46, 0, TAU); ctx.fill();
    ctx.fillStyle = '#1a1614'; ctx.beginPath(); ctx.arc(116, -90, 5, 0, TAU); ctx.arc(144, -90, 5, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#1a1614'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(130, -82, 24, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    sticker(ctx, -150, 0, 80, 70, '#ece6dc', null, 0.05);
    ctx.strokeStyle = '#1a1614'; ctx.lineWidth = 3; ctx.strokeRect(-175, -22, 50, 40);
    sticker(ctx, 100, 40, 150, 70, '#ece6dc', 'ALIGNED-ISH', -0.02);
    ctx.fillStyle = ORN; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU - Math.PI / 2, r = i % 2 ? 12 : 26; ctx[i ? 'lineTo' : 'moveTo'](-60 + Math.cos(a) * r, 20 + Math.sin(a) * r); } ctx.fill();
    ctx.restore();
  }
  function openLaptop(ctx, cx, cy, s, glow) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    // keyboard deck
    ctx.fillStyle = '#3a3836'; ctx.beginPath(); ctx.moveTo(-300, 40); ctx.lineTo(280, 20); ctx.lineTo(380, 220); ctx.lineTo(-250, 260); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(200,195,188,0.5)';
    for (let r = 0; r < 5; r++) for (let k = 0; k < 13; k++) { const u = k / 13, v = r / 5; const x = lerp(lerp(-270, -225, v), lerp(270, 350, v), u), y = lerp(lerp(55, 230, v), lerp(35, 205, v), u); ctx.fillRect(x, y, 30 + v * 6, 20 + v * 4); }
    // screen
    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.moveTo(-290, 40); ctx.lineTo(270, 18); ctx.lineTo(230, -330); ctx.lineTo(-240, -300); ctx.closePath(); ctx.fill();
    halo(ctx, -10, -150, 500, '255,240,225', 0.5 * glow);
    ctx.fillStyle = `rgba(250,246,240,${glow})`; ctx.beginPath(); ctx.moveTo(-265, 22); ctx.lineTo(248, 2); ctx.lineTo(214, -310); ctx.lineTo(-222, -284); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.rotate(-0.04);
    ctx.fillStyle = `rgba(214,72,32,${glow})`; ctx.fillRect(-170, -190, 330, 90);
    font(ctx, 700, 26, FONT.mono); ctx.letterSpacing = '6px'; ctx.fillStyle = `rgba(255,200,170,${glow})`; ctx.textAlign = 'center'; ctx.fillText('REDACTED', 0, -135); ctx.textAlign = 'left'; ctx.letterSpacing = '0px';
    ctx.restore();
    ctx.restore();
  }
  const ILYA = [['What', F(3958)], ['did', F(3968)], ['Ilya', F(3978)], ['see?', F(3988)]];
  const S43 = {
    name: 'Laptop · What did Ilya see?',
    start: F(3948), end: 4000 / 30, vignette: 1.2,
    draw(ctx, t) {
      ctx.fillStyle = '#060505'; ctx.fillRect(0, 0, W, H);
      // spotlight on the desk
      const g = ctx.createRadialGradient(960, 700, 40, 960, 700, 900);
      g.addColorStop(0, 'rgba(120,112,104,0.55)'); g.addColorStop(0.5, 'rgba(50,46,42,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(70,64,58,0.4)'; ctx.beginPath(); ctx.moveTo(0, 770); ctx.lineTo(W, 690); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
      // dust motes
      for (let i = 0; i < 40; i++) { const x = hash(i) * W, y = (hash(i * 2.3) * H + t * 20 * (0.5 + hash(i * 4))) % H; ctx.fillStyle = `rgba(230,220,210,${0.2 + hash(i * 7) * 0.3})`; ctx.fillRect(x, y, 2, 2); }
      const open = prog(t, F(3986), F(3990));
      const s = kf(t, [[F(3948), 0.9], [F(3986), 1.0], [F(4000), 1.15]]);
      if (open < 1) { ctx.save(); ctx.globalAlpha = 1 - open; closedLaptop(ctx, 1010, 560, s); ctx.restore(); }
      if (open > 0) { ctx.save(); ctx.globalAlpha = open; openLaptop(ctx, 1050, 620, s * 1.25, open); ctx.restore(); }
      // the question
      ctx.font = `italic 500 52px ${FONT.serif}`;
      let x = 150;
      ILYA.forEach(([w, t0], i) => {
        if (t >= t0) {
          ctx.globalAlpha = prog(t, t0, t0 + 0.15);
          ctx.fillStyle = i === 3 ? ORN : t < (ILYA[i + 1] || [0, 99])[1] ? ORN : 'rgba(236,230,220,0.85)';
          ctx.fillText(w, x, 160); ctx.globalAlpha = 1;
        }
        x += ctx.measureText(w + ' ').width;
      });
      const fi = 1 - prog(t, F(3948), F(3952));
      if (fi > 0) { ctx.fillStyle = `rgba(6,5,5,${fi})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  window.SHARED.p8 = { closedLaptop, openLaptop };
  Timeline.add(S36, S37, S38, S39, S40, S41, S43);
})();
