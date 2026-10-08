// PART 1 — frames 1–500 (0:00.000 – 0:16.667)
// Scenes: polar axes → glyph → unicorn / AGI / eye / circuits / surprise → loss chart → terrain / servant / boss
(function () {
  'use strict';
  const {
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1, noise2,
    font, glow, halo, pen, drawGrid, typeText, Path, Lyric,
    camKeys, cam2, applyCam, camPoint, orbit, groundText, sparks, PFX,
  } = K;

  const F = n => (n - 1) / 30;          // frame number -> seconds
  const ORANGE_GLOW = 'rgba(255,106,31,0.9)';

  // =====================================================================
  // SCENE 1 · Polar axes burst, "Draw a unicorn in TikZ."   (frames 1–49)
  // =====================================================================
  const S1 = {
    name: 'Axes burst · prompt',
    start: 0, end: F(50),
    draw(ctx, t) {
      if (t < F(9)) return;                                   // frames 1–8 are black
      const cx = 960, cy = 560, u = 190;
      const b = E.outExpo(prog(t, F(9), F(9) + 0.4));
      const rot = lerp(-0.27, 0, E.inOutCubic(prog(t, F(9), F(15))));
      const radialA = 1 - prog(t, 0.55, 0.98);

      ctx.save();
      ctx.globalAlpha = prog(t, 0.4, 0.9);
      drawGrid(ctx, 0, 0, W, H, u / 4, cx, cy, COL.grid);
      drawGrid(ctx, 0, 0, W, H, u, cx, cy, COL.gridStrong);
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      // radial burst
      ctx.lineWidth = 1.4;
      for (let k = 0; k < 12; k++) {
        if (k % 3 === 0) continue;
        const a = k * Math.PI / 6;
        ctx.strokeStyle = `rgba(255,128,60,${0.5 * radialA})`;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 1500 * b, Math.sin(a) * 1500 * b); ctx.stroke();
      }
      if (radialA > 0) {
        ctx.strokeStyle = `rgba(255,128,60,${0.3 * radialA})`;
        ctx.beginPath(); ctx.arc(0, 0, 2.6 * u * b, 0, TAU); ctx.stroke();
      }
      // axes
      glow(ctx, ORANGE_GLOW, 16, () => {
        ctx.strokeStyle = COL.orange; ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-1400 * b, 0); ctx.lineTo(1400 * b, 0);
        ctx.moveTo(0, -900 * b); ctx.lineTo(0, 900 * b);
        ctx.stroke();
      });
      font(ctx, 400, 21, FONT.mono);
      ctx.fillStyle = `rgba(243,238,230,${0.55 * b})`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = -4; i <= 5; i++) if (i) { ctx.fillRect(i * u - 1, -6, 2, 12); ctx.fillText(String(i), i * u, 16); }
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let j = -2; j <= 2; j++) if (j) { ctx.fillRect(-6, -j * u - 1, 12, 2); ctx.fillText(String(j), -16, -j * u); }
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText('(0,0)', 14, 14);
      ctx.restore();

      // spark at the origin, then a dot running along the x axis
      const flash = 1 - prog(t, F(9), F(9) + 0.45);
      pen(ctx, cx, cy, 1 + flash * 2.2, lerp(0.55, 1, flash) * (1 - prog(t, 0.95, 1.1)));
      const run = prog(t, 0.55, 0.95);
      if (run > 0 && run < 1) pen(ctx, cx + E.outCubic(run) * 1.4 * u, cy, 0.8, 1 - run * 0.3);

      // polar circle with degree labels
      const pc = prog(t, 0.9, 1.2);
      if (pc > 0) {
        const R = 2 * u, e = E.outCubic(pc);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = 'rgba(243,238,230,0.55)';
        ctx.beginPath(); ctx.arc(0, 0, R, -Math.PI / 2, -Math.PI / 2 + TAU * e); ctx.stroke();
        ctx.strokeStyle = 'rgba(243,238,230,0.2)';
        ctx.beginPath(); ctx.arc(0, 0, u, -Math.PI / 2, -Math.PI / 2 + TAU * e); ctx.stroke();
        font(ctx, 400, 17, FONT.mono);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let d = 0; d < 360; d += 30) {
          const a = -d * Math.PI / 180, la = clamp(pc * 13 - d / 30);
          ctx.fillStyle = `rgba(243,238,230,${0.5 * la})`;
          ctx.fillText(d + '°', Math.cos(a) * (R + 36), Math.sin(a) * (R + 36));
          ctx.strokeStyle = `rgba(243,238,230,${0.09 * la})`;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke();
        }
        const ang = -0.4 - (t - 0.9) * 3.4;
        ctx.strokeStyle = 'rgba(255,140,70,0.85)';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang) * R, Math.sin(ang) * R); ctx.stroke();
        ctx.restore();
        pen(ctx, cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, 0.75, pc);
      }

      // bounding box being drafted
      const pr = prog(t, 1.22, 1.55);
      if (pr > 0) {
        const box = new Path([[cx - 2 * u, cy - 1.15 * u], [cx + 2 * u, cy - 1.15 * u], [cx + 2 * u, cy + 1.25 * u], [cx - 2 * u, cy + 1.25 * u], [cx - 2 * u, cy - 1.15 * u]]);
        ctx.save();
        ctx.strokeStyle = 'rgba(255,128,60,0.75)'; ctx.lineWidth = 1.6;
        ctx.beginPath(); const end = box.trace(ctx, 0, box.total * E.inOutQuad(pr)); ctx.stroke();
        glow(ctx, ORANGE_GLOW, 12, () => {
          ctx.strokeStyle = COL.orange; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(cx - 2 * u, cy - 0.75 * u); ctx.lineTo(cx - 2 * u, cy - 1.15 * u); ctx.lineTo(cx - 1.6 * u, cy - 1.15 * u); ctx.stroke();
        });
        font(ctx, 400, 18, FONT.mono); ctx.fillStyle = `rgba(243,238,230,${0.6 * pr})`;
        ctx.fillText('x = 1', cx - 0.75 * u, cy - 0.7 * u);
        ctx.fillText('z = 2', cx + 1.0 * u, cy + 1.05 * u);
        ctx.restore();
        if (end && pr < 1) pen(ctx, end[0], end[1], 0.7, 1);
      }

      // prompt typing
      ctx.save();
      font(ctx, 500, 21, FONT.mono);
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = 'rgba(243,238,230,0.85)';
      typeText(ctx, '% prompt: "Draw a unicorn in TikZ."', 640, 74, t, 0.82, 62, { cursor: true, size: 21 });
      ctx.fillStyle = 'rgba(243,238,230,0.4)';
      typeText(ctx, '\\begin{tikzpicture}', 640, 104, t, 1.3, 50, {});
      ctx.restore();

      // quick dip at the cut
      const out = prog(t, F(47), F(50));
      if (out > 0) { ctx.fillStyle = `rgba(9,8,7,${out})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  // =====================================================================
  // SCENE 2 · Font glyph "I" with metrics                    (frames 50–69)
  // =====================================================================
  const S2 = {
    name: 'Glyph metrics · U+0049',
    start: F(50), end: F(70),
    draw(ctx, t, lt) {
      drawGrid(ctx, 0, 0, W, H, 60, 0, 0, COL.grid);
      ctx.save();
      const z = lerp(1, 1.07, E.outQuad(lt / 0.67));
      ctx.translate(390, 760); ctx.scale(z, z); ctx.rotate(-0.032); ctx.translate(-390, -760);

      // guide lines (cap, x-height, baseline, descender)
      const lp = E.outCubic(prog(lt, 0, 0.28));
      ctx.lineWidth = 1.5;
      [[425, 0.55], [530, 0.25], [760, 0.6], [818, 0.25]].forEach(([y, a], i) => {
        ctx.strokeStyle = `rgba(255,128,60,${a})`;
        ctx.beginPath(); ctx.moveTo(110, y); ctx.lineTo(110 + 2000 * clamp(lp * 1.2 - i * 0.06), y); ctx.stroke();
      });

      // the glyph bar grows from the baseline
      const g = E.outCubic(prog(lt, 0.02, 0.36));
      const top = lerp(760, 470, g);
      glow(ctx, ORANGE_GLOW, 30, () => {
        const grd = ctx.createLinearGradient(0, top, 0, 760);
        grd.addColorStop(0, '#ff8a3c'); grd.addColorStop(1, '#ff5a12');
        ctx.fillStyle = grd;
        ctx.fillRect(345, top, 74, 760 - top);
      });
      pen(ctx, 382, top, 0.8, g < 1 ? 1 : 0);

      // metrics annotations
      const ma = prog(lt, 0.22, 0.4);
      ctx.globalAlpha = ma;
      ctx.strokeStyle = 'rgba(243,238,230,0.55)'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(300, 470); ctx.lineTo(300, 760);
      ctx.moveTo(292, 482); ctx.lineTo(300, 470); ctx.lineTo(308, 482);
      ctx.moveTo(292, 748); ctx.lineTo(300, 760); ctx.lineTo(308, 748);
      ctx.moveTo(345, 450); ctx.lineTo(345, 430); ctx.moveTo(419, 450); ctx.lineTo(419, 430);
      ctx.moveTo(330, 795); ctx.lineTo(330, 808); ctx.lineTo(435, 808); ctx.lineTo(435, 795);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(243,238,230,0.4)';
      ctx.strokeRect(330, 455, 104, 305);
      font(ctx, 400, 19, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.7)';
      ctx.textAlign = 'center';
      ctx.fillText('LSB', 334, 418); ctx.fillText('RSB', 432, 418);
      ctx.fillText('adv 0.26', 382, 850);
      ctx.restore();

      // header typing
      ctx.save();
      font(ctx, 500, 31, FONT.mono);
      ctx.fillStyle = 'rgba(243,238,230,0.85)';
      typeText(ctx, 'U+0049  LATIN CAPITAL LETTER I', 298, 140, lt, 0, 70, { cursor: true, size: 31, hold: 0.4 });
      font(ctx, 400, 26, FONT.mono);
      ctx.fillStyle = 'rgba(243,238,230,0.6)';
      typeText(ctx, 'Archivo 700 · wdth 100', 298, 186, lt, 0.22, 60, { cursor: true, size: 26, blink: true });
      ctx.restore();
    },
  };

  // =====================================================================
  // SCENE 3 · Unicorn page: drawing → AGI → eye → circuits → surprise  (frames 70–278)
  // One large "page" filmed by a 2D camera; everything is placed in page coordinates.
  // =====================================================================
  const UO = [585, 700], U = 110;
  const up = (x, y) => [UO[0] + x * U, UO[1] - y * U];
  const EYE = up(2.86, 1.96);
  const HORN_TIP = up(3.25, 3.45);

  const PARTS = (() => {
    const P = [];
    const add = (name, path, t0, t1) => P.push({ name, path, t0, t1 });
    add('body', Path.ellipse(UO[0], UO[1], 2 * U, U, 0, Math.PI, Math.PI + TAU, 140), 2.33, 2.74);
    [-1.5, -1, 0.85, 1.35].forEach((x, i) =>
      add('leg', new Path([up(x, -0.62), up(x, -2.3), up(x + 0.32, -2.3), up(x + 0.32, -0.62)]), 2.76 + i * 0.06, 2.88 + i * 0.06));
    add('tail', Path.bezier(up(-1.95, 0.3), up(-2.9, 0.75), up(-3.05, -0.55), up(-2.45, -1.45)), 3.0, 3.13);
    add('tail', Path.bezier(up(-1.98, 0.05), up(-2.6, 0.25), up(-2.75, -0.8), up(-2.25, -1.55)), 3.05, 3.18);
    add('neck', new Path([up(1.25, 0.55), up(2.05, 1.9)]), 3.15, 3.25);
    add('neck', new Path([up(1.85, 0.2), up(2.85, 1.62)]), 3.18, 3.28);
    const hc = up(2.62, 1.86);
    add('head', Path.ellipse(hc[0], hc[1], 0.64 * U, 0.34 * U, 0.3, Math.PI, Math.PI + TAU, 90), 3.28, 3.45);
    add('ear', new Path([up(2.28, 2.1), up(2.36, 2.54), up(2.53, 2.16)]), 3.42, 3.5);
    add('mane', Path.bezier(up(2.25, 2.14), up(1.85, 2.05), up(1.75, 1.35), up(1.25, 0.85)), 3.48, 3.62);
    add('mane', Path.bezier(up(2.1, 2.22), up(1.6, 2.15), up(1.5, 1.4), up(1.05, 1.0)), 3.52, 3.66);
    add('mane', Path.bezier(up(2.0, 2.32), up(1.45, 2.3), up(1.3, 1.55), up(0.9, 1.2)), 3.56, 3.7);
    add('horn', new Path([up(2.5, 2.13), up(3.25, 3.45), up(2.79, 2.07)]), 3.6, 3.72);
    for (let k = 1; k <= 4; k++) {
      const f = k / 5;
      const a = [lerp(up(2.5, 2.13)[0], HORN_TIP[0], f), lerp(up(2.5, 2.13)[1], HORN_TIP[1], f)];
      const b = [lerp(up(2.79, 2.07)[0], HORN_TIP[0], f + 0.06), lerp(up(2.79, 2.07)[1], HORN_TIP[1], f + 0.06)];
      add('horn', new Path([a, b]), 3.72 + k * 0.02, 3.76 + k * 0.02);
    }
    return P;
  })();

  // Snap a path onto a grid → octilinear "PCB trace".
  function circuitize(path, step = 11) {
    const out = [];
    const n = Math.max(2, Math.ceil(path.total / (step * 0.45)));
    for (let i = 0; i <= n; i++) {
      const p = path.at(path.total * i / n);
      const q = [Math.round(p[0] / step) * step, Math.round(p[1] / step) * step];
      const l = out[out.length - 1];
      if (!l || l[0] !== q[0] || l[1] !== q[1]) out.push(q);
    }
    if (out.length < 2) out.push([out[0][0] + 1, out[0][1]]);
    const simp = [out[0]];
    for (let i = 1; i < out.length - 1; i++) {
      const a = simp[simp.length - 1], b = out[i], c = out[i + 1];
      if (Math.sign(b[0] - a[0]) !== Math.sign(c[0] - b[0]) || Math.sign(b[1] - a[1]) !== Math.sign(c[1] - b[1])) simp.push(b);
    }
    simp.push(out[out.length - 1]);
    return new Path(simp);
  }

  const CIRCUIT = (() => {
    const list = [];
    const shift = (path, dx, dy) => path.map(p => [p[0] + dx, p[1] + dy]);
    PARTS.forEach(p => {
      if (p.name === 'horn' && p.path.pts.length === 2) return;
      list.push(circuitize(p.path));
      if (p.name === 'mane') list.push(circuitize(shift(p.path, -14, 10)));
      if (p.name === 'tail') { list.push(circuitize(shift(p.path, -12, 6))); list.push(circuitize(shift(p.path, 10, 8))); }
    });
    return list.map((path, i) => ({ path, t0: 6.0 + (i % 12) * 0.035, t1: 6.0 + (i % 12) * 0.035 + 0.5 }));
  })();

  const CODE = [
    ['% prompt: "Draw a unicorn in TikZ."', 2.0],
    ['\\begin{tikzpicture}', 2.0],
    ['\\draw (0,0) ellipse (2 and 1);          % body', 2.33],
    ['\\foreach \\x in {-1.5,-1,0.85,1.35}', 2.74],
    ['  \\draw (\\x,-0.62) rectangle ++(0.32,-1.68); % legs', 2.8],
    ['\\draw (-1.95,0.3) .. controls ..;      % tail', 3.0],
    ['\\draw (1.25,0.55) -- ... -- cycle;     % neck', 3.15],
    ['\\draw[rotate=-17] (2.72,1.95) ellipse ..; % head', 3.28],
    ['\\draw (2.3,2.3) .. controls ..;        % mane', 3.48],
    ['\\draw (2.62,2.3) -- (3.3,3.55) -- ..;  % horn', 3.6],
  ];

  const L_SPARKS = new Lyric([['I', 2.31], ['see', 2.5], ['sparks', 2.86], ['of', 3.5]]);
  const AGI_T = [3.72, 4.3, 4.62];
  const L_EYES = new Lyric([['in', 4.98, 0], ['your', 5.15, 0], ['eyes', 5.4, 1]]);
  const L_CIRCUITS = new Lyric([['Your', 6.0, 0], ['circuits', 6.18, 0], ['make', 6.6, 1], ['me', 6.86, 1], ['nervous,', 7.2, 2]]);
  const L_SURPRISE = new Lyric([['that’s', 7.86, 0], ['no', 8.3, 0], ['surprise', 8.55, 1]]);

  const CAM3 = camKeys([
    [F(70), [960, 540, 1.0, 0]],
    [3.64, [960, 548, 1.08, 0], E.inOutQuad],
    [3.86, [1160, 304, 2.0, -0.06], E.outExpo],
    [4.86, [1170, 312, 2.08, -0.066], E.linear],
    [5.05, [1114, 464, 2.9, -0.07], E.inOutCubic],
    [5.329, [1116, 468, 2.96, -0.072], E.linear],
    [5.33, [981, 516, 4.4, -0.1], E.linear],          // cut: eye close-up
    [5.86, [975, 512, 4.2, -0.1], E.linear],
    [6.06, [922, 768, 1.21, 0], E.inOutCubic],
    [7.55, [905, 760, 1.24, 0], E.linear],
    [7.8, [290, 760, 1.24, 0], E.inOutCubic],         // whip pan
    [9.27, [300, 772, 1.27, 0], E.linear],
  ]);

  function drawCode(ctx, t, a) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a;
    font(ctx, 400, 15, FONT.mono);
    let cur = -1;
    CODE.forEach((l, i) => { if (t >= l[1]) cur = i; });
    CODE.forEach(([str, t0], i) => {
      if (t < t0) return;
      ctx.fillStyle = i === cur && i > 1 ? COL.orange : i === 0 ? 'rgba(243,238,230,0.75)' : 'rgba(243,238,230,0.42)';
      const n = Math.floor(clamp((t - t0) * 75, 0, str.length));
      ctx.fillText(str.slice(0, n), 620, 52 + i * 21);
      if (i === cur && n < str.length) {
        const w = ctx.measureText(str.slice(0, n)).width;
        ctx.fillStyle = COL.orange; ctx.fillRect(623 + w, 40 + i * 21, 8, 15);
      }
    });
    ctx.restore();
  }

  function drawTitleBlock(ctx, t, a) {
    if (a <= 0) return;
    const x = 1310, y = 830;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(x, y); ctx.scale(1.35, 1.35); ctx.translate(-x, -y);
    ctx.strokeStyle = 'rgba(243,238,230,0.35)'; ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 360, 84);
    ctx.beginPath();
    ctx.moveTo(x, y + 28); ctx.lineTo(x + 360, y + 28);
    ctx.moveTo(x, y + 56); ctx.lineTo(x + 360, y + 56);
    ctx.moveTo(x + 180, y + 28); ctx.lineTo(x + 180, y + 84);
    ctx.stroke();
    font(ctx, 400, 12, FONT.mono);
    ctx.fillStyle = 'rgba(243,238,230,0.6)';
    ctx.fillText('TITLE   unicorn (exp. 1)', x + 8, y + 19);
    ctx.fillText('DRAWN   the model', x + 8, y + 47);
    ctx.fillText('CHECKED  —', x + 188, y + 47);
    ctx.fillText('SCALE', x + 8, y + 75);
    ctx.fillText('SHEET  1/1', x + 188, y + 75);
    ctx.fillStyle = COL.orange; ctx.fillRect(x + 60, y + 66, 9, 9);
    ctx.restore();
  }

  function drawConstruction(ctx, t, z) {
    const k = E.outCubic(prog(t, 2.33, 2.7));
    if (k <= 0) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(243,238,230,0.22)'; ctx.lineWidth = 1 / z;
    ctx.beginPath(); ctx.arc(UO[0], UO[1], 2.15 * U, -Math.PI / 2, -Math.PI / 2 + TAU * k); ctx.stroke();
    font(ctx, 400, 10, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.38)'; ctx.textAlign = 'center';
    for (let d = 0; d < 360; d += 30) {
      const a = -d * Math.PI / 180;
      if (d / 360 > k) continue;
      ctx.fillText(d + '°', UO[0] + Math.cos(a) * (2.15 * U + 16), UO[1] + Math.sin(a) * (2.15 * U + 16) + 4);
    }
    ctx.beginPath(); ctx.moveTo(UO[0] - 2 * U, UO[1] - 1.25 * U); ctx.lineTo(UO[0] + 2 * U, UO[1] - 1.25 * U); ctx.stroke();
    ctx.fillText('4.00', UO[0], UO[1] - 1.25 * U - 8);
    ctx.restore();
  }

  function drawAxes(ctx, a) {
    ctx.save();
    ctx.globalAlpha = a;
    drawGrid(ctx, -1400, -400, 2600, 1700, U / 2, UO[0], UO[1], 'rgba(243,238,230,0.06)');
    drawGrid(ctx, -1400, -400, 2600, 1700, U, UO[0], UO[1], 'rgba(243,238,230,0.05)');
    ctx.strokeStyle = 'rgba(243,238,230,0.16)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-1400, UO[1]); ctx.lineTo(2600, UO[1]); ctx.moveTo(UO[0], -400); ctx.lineTo(UO[0], 1700); ctx.stroke();
    font(ctx, 400, 11, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.35)'; ctx.textAlign = 'center';
    for (let i = -4; i <= 11; i++) if (i) ctx.fillText(String(i), UO[0] + i * U, UO[1] + 16);
    ctx.restore();
  }

  function drawTable(ctx, t, a) {
    if (a <= 0) return;
    const x = 240, y = 994;
    const cols = [0, 80, 210, 300];
    ctx.save();
    ctx.globalAlpha = a;
    font(ctx, 400, 14, FONT.mono);
    ctx.fillStyle = 'rgba(243,238,230,0.5)';
    ['ckpt', 'step', 'legs', 'P(doom)'].forEach((s, i) => ctx.fillText(s, x + cols[i], y));
    ctx.fillRect(x, y + 8, 380, 1);
    [['1', '0', '4', '0.02'], ['2', '4,000', '5', '0.02'], ['3', '32,000', '4', '0.02']].forEach((r, ri) => {
      const ra = prog(t, 6.25 + ri * 0.12, 6.35 + ri * 0.12);
      if (ra <= 0) return;
      ctx.save();
      ctx.globalAlpha = a * ra;
      ctx.fillStyle = ri === 2 ? COL.orange : 'rgba(243,238,230,0.62)';
      if (ri === 2) ctx.fillText('▸', x - 18, y + 30 + ri * 20);
      r.forEach((s, i) => ctx.fillText(s, x + cols[i], y + 30 + ri * 20));
      ctx.restore();
    });
    // tiny live sparkline
    ctx.strokeStyle = 'rgba(255,106,31,0.8)'; ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) { const px = x + i * 2.4, py = y + 108 - Math.abs(noise1(i * 0.4 + t * 6)) * 14; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
    ctx.restore();
  }

  function drawLineUnicorn(ctx, t, z, a) {
    if (a <= 0) return null;
    let tip = null;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const p of PARTS) {
      const k = prog(t, p.t0, p.t1);
      if (k <= 0) continue;
      const fresh = t < p.t1 + 0.25;
      ctx.strokeStyle = fresh ? 'rgba(255,170,110,0.95)' : 'rgba(243,238,230,0.78)';
      ctx.lineWidth = (fresh ? 2.2 : 1.6) / z;
      ctx.beginPath();
      const end = p.path.trace(ctx, 0, p.path.total * k);
      if (fresh) { ctx.shadowColor = ORANGE_GLOW; ctx.shadowBlur = 14; } else ctx.shadowBlur = 0;
      ctx.stroke();
      if (k < 1 && end) tip = end;
    }
    ctx.restore();
    return tip;
  }

  function drawCircuit(ctx, t, z) {
    if (t < 6.0) return;
    const warm = prog(t, 7.65, 8.1);
    const r = Math.round(lerp(255, 228, warm)), g = Math.round(lerp(122, 218, warm)), b = Math.round(lerp(64, 206, warm));
    const color = `rgba(${r},${g},${b},${lerp(0.72, 0.62, warm)})`;
    ctx.save();
    ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
    const heads = [], traces = new Path2D(), nodes = new Path2D();
    for (const c of CIRCUIT) {
      const k = E.outCubic(prog(t, c.t0, c.t1));
      if (k <= 0) continue;
      const end = c.path.trace(traces, 0, c.path.total * k);
      if (k < 1 && end) heads.push(end);
      const ends = [c.path.pts[0]];
      if (k >= 1) ends.push(c.path.pts[c.path.pts.length - 1]);
      for (const n of ends) { nodes.moveTo(n[0] + 4.2 / z, n[1]); nodes.arc(n[0], n[1], 4.2 / z, 0, TAU); }
    }
    ctx.strokeStyle = color; ctx.lineWidth = 5.2 / z; ctx.stroke(traces);
    ctx.strokeStyle = COL.bg; ctx.lineWidth = 2.5 / z; ctx.stroke(traces);
    ctx.fillStyle = COL.bg; ctx.fill(nodes);
    ctx.strokeStyle = color; ctx.lineWidth = 1.6 / z; ctx.stroke(nodes);
    ctx.restore();
    heads.forEach(h => pen(ctx, h[0], h[1], 0.45 / Math.max(1, z * 0.8), 0.9));
    // a few bright solder joints
    const ja = prog(t, 6.5, 6.8);
    [EYE, up(1.25, 0.55), up(-1.95, 0.3), up(0.85, -0.62), up(2.05, 1.9)].forEach((p, i) => {
      halo(ctx, p[0], p[1], 16, '255,150,80', 0.5 * ja);
      ctx.save(); ctx.globalAlpha = ja; ctx.fillStyle = i === 0 ? '#fff' : '#ffd9bf';
      ctx.beginPath(); ctx.arc(p[0], p[1], (i === 0 ? 4 : 2.6), 0, TAU); ctx.fill(); ctx.restore();
    });
  }

  const S3 = {
    name: 'Unicorn · AGI · eyes · circuits · surprise',
    start: F(70), end: F(279),
    draw(ctx, t) {
      const c = cam2(t, CAM3);
      const shot = t < 5.33 ? 'draw' : t < 5.86 ? 'eye' : 'page';

      ctx.save();
      applyCam(ctx, c);

      drawAxes(ctx, prog(t, 2.3, 2.45) * (shot === 'eye' ? 0.5 : 1));
      drawConstruction(ctx, t, c.z);
      drawCode(ctx, t, 1 - prog(t, 5.25, 5.33));
      drawTitleBlock(ctx, t, prog(t, 2.45, 2.6) * (1 - prog(t, 5.2, 5.33)));

      const tip = drawLineUnicorn(ctx, t, c.z, 1 - prog(t, 6.0, 6.45));
      drawCircuit(ctx, t, c.z);
      drawTable(ctx, t, prog(t, 6.2, 6.4));

      // beam from the horn into the "A"
      const bm = prog(t, 3.68, 3.8), bf = 1 - prog(t, 3.82, 4.0);
      if (bm > 0 && bf > 0) {
        const to = [lerp(HORN_TIP[0], 1098, bm), lerp(HORN_TIP[1], 318, bm)];
        glow(ctx, ORANGE_GLOW, 18, () => {
          ctx.strokeStyle = `rgba(255,170,110,${bf})`; ctx.lineWidth = 2.4 / c.z;
          ctx.beginPath(); ctx.moveTo(HORN_TIP[0], HORN_TIP[1]); ctx.lineTo(to[0], to[1]); ctx.stroke();
        });
      }
      sparks(ctx, HORN_TIP[0], HORN_TIP[1], t, { t0: 3.72, t1: 4.9, count: 620, angle: -0.6, spread: 0.42, speed: [220, 640], life: [0.12, 0.42], seed: 4, scale: 0.6 });

      // "I see sparks of" + AGI
      if (t < 5.33) {
        L_SPARKS.draw(ctx, t, 1075, 118, { size: 88, weight: 700, glow: 18 });
        drawAGI(ctx, t);
        if (t >= 4.6) L_EYES.draw(ctx, t, 1092, 468, { size: 52, weight: 700, glow: 16, ghostFrom: 4.6, only: 0 });
      }
      if (t >= 5.9) {
        L_EYES.draw(ctx, t, 1010, 590, { size: 34, weight: 700, lh: 40, alpha: prog(t, 5.9, 5.98) * (1 - prog(t, 6.2, 6.45)) });
        L_CIRCUITS.draw(ctx, t, 1010, 690, { size: 92, weight: 700, lh: 102, glow: 20, ghostFrom: 5.9 });
      }
      if (t >= 7.6) {
        L_SURPRISE.draw(ctx, t, -372, 620, { size: 110, weight: 700, lh: 132, glow: 22, ghostFrom: 7.6 });
        if (t >= 8.5) {
          ctx.save();
          font(ctx, 400, 19, FONT.mono);
          ctx.globalAlpha = prog(t, 8.5, 8.65);
          ctx.fillStyle = 'rgba(243,238,230,0.65)';
          ctx.fillText('surprisal', -370, 840);
          const v = (0.68 * E.outCubic(prog(t, 8.6, 9.1))).toFixed(2);
          ctx.fillText('−log p = ', -242, 840);
          ctx.fillStyle = COL.orange;
          ctx.fillText(`${v} nats`, -242 + ctx.measureText('−log p = ').width, 840);
          ctx.restore();
        }
      }
      if (tip) pen(ctx, tip[0], tip[1], 0.55 / Math.max(1, c.z * 0.7), 1);
      ctx.restore();

      // eye close-up overlays (screen space)
      if (shot === 'eye' || (t >= 5.86 && t < 6.0)) {
        const e = camPoint(c, EYE[0], EYE[1]);
        const a = 1 - prog(t, 5.86, 5.98);
        if (t < 5.4) {
          halo(ctx, e[0], e[1], 120, '255,110,30', 0.7 * a);
          halo(ctx, e[0], e[1], 30, '255,190,120', a);
          ctx.fillStyle = `rgba(255,150,80,${a})`; ctx.beginPath(); ctx.arc(e[0], e[1], 13, 0, TAU); ctx.fill();
        } else {
          halo(ctx, e[0], e[1], 70, '255,240,220', 0.35 * a);
          ctx.save(); ctx.globalAlpha = a;
          ctx.fillStyle = '#fffaf2'; ctx.beginPath(); ctx.arc(e[0], e[1], 14, 0, TAU); ctx.fill();
          const k = E.outCubic(prog(t, 5.4, 5.55));
          ctx.strokeStyle = 'rgba(243,238,230,0.35)'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(e[0] - 60, e[1]); ctx.lineTo(e[0] + 60, e[1]); ctx.moveTo(e[0], e[1] - 60); ctx.lineTo(e[0], e[1] + 60); ctx.stroke();
          ctx.strokeStyle = 'rgba(243,238,230,0.8)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[0] + 70 * k, e[1] + 85 * k); ctx.stroke();
          font(ctx, 400, 26, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.75)';
          if (k > 0.9) ctx.fillText('r = 0', e[0] + 78, e[1] + 100);
          ctx.restore();
        }
        ctx.save();
        ctx.globalAlpha = a;
        font(ctx, 400, 22, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.3)';
        ctx.fillText('30°', e[0] - 470, e[1] + 300);
        ctx.restore();
        L_EYES.draw(ctx, t, 1112, 300, { size: 128, weight: 700, lh: 150, glow: 26, alpha: a, ghostFrom: 5.3 });
      }

      // motion blur on fast camera moves (not across the hard cut)
      if (Math.abs(t - 5.33) > 0.04) {
        const cp = cam2(t - 1 / 60, CAM3);
        const p0 = camPoint(cp, c.cx, c.cy);
        const dx = (p0[0] - W / 2) * 1.6, dy = (p0[1] - H / 2) * 1.6;
        if (Math.hypot(dx, dy) > 6) PFX.motionBlur(ctx, dx, dy, 12);
      }

      const out = prog(t, 9.13, 9.25);
      if (out > 0) { ctx.fillStyle = `rgba(9,8,7,${out})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  function drawAGI(ctx, t) {
    if (t < 3.62) return;
    const x = 1080, y = 340;
    ctx.save();
    font(ctx, 800, 235, FONT.sans);
    const str = 'AGI';
    const ghostA = prog(t, 3.62, 3.72);
    const peach = prog(t, 4.82, 4.97);
    for (let i = 0; i < 3; i++) {
      const lx = x + ctx.measureText(str.slice(0, i)).width;
      const fa = prog(t, AGI_T[i], AGI_T[i] + 0.06);
      if (fa < 1) {
        ctx.strokeStyle = `rgba(243,238,230,${0.32 * ghostA})`; ctx.lineWidth = 1.4;
        ctx.strokeText(str[i], lx, y);
      }
      if (fa > 0) {
        ctx.save();
        ctx.globalAlpha = fa;
        ctx.fillStyle = `rgb(255,${Math.round(lerp(106, 214, peach))},${Math.round(lerp(31, 192, peach))})`;
        ctx.shadowColor = peach > 0.5 ? 'rgba(255,220,200,0.5)' : ORANGE_GLOW;
        ctx.shadowBlur = 40;
        ctx.fillText(str[i], lx, y);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // =====================================================================
  // SCENE 4 · Loss curve: "There was a sudden drop"           (frames 279–330)
  // =====================================================================
  const O = [300, 825];
  const lossY = x => 352 - 137 * Math.exp(-x / 26) + 0.01 * x + 7 * noise1(x * 0.09) + 3.5 * noise1(x * 0.45 + 10) - 42 * Math.exp(-Math.pow((x - 515) / 7, 2)) - 10 * clamp((x - 515) / 30) * Math.exp(-Math.max(0, x - 545) / 260);
  const lossSmooth = x => { let a = 0; for (let k = -6; k <= 6; k++) a += lossY(x + k * 6); return a / 13; };
  const XDROP = 880;
  const LOSS = new Path(Array.from({ length: XDROP / 2 + 1 }, (_, i) => [O[0] + i * 2, lossY(i * 2)]));
  const headX = t => kf(t, [[9.36, 0], [9.67, 190, E.outQuad], [10.0, 450, E.linear], [10.7, XDROP, E.linear]]);
  const DROP_T = [10.83, 11.0];
  const SUDDEN = 'There was a sudden';
  const SUDDEN_WORDS = [[0, 5], [6, 9], [10, 11], [12, 18]];
  const CAM4 = camKeys([
    [F(279), [960, 540, 1.0, 0]],
    [9.95, [960, 540, 1.0, 0], E.linear],
    [10.55, [961, 378, 1.4, 0], E.inOutCubic],
    [10.83, [1010, 392, 1.42, 0], E.linear],
    [10.92, [1137, 643, 1.45, 0], E.inQuad],
    [11.0, [1190, 790, 1.45, 0], E.linear],
  ]);

  const S4 = {
    name: 'Loss curve · "There was a sudden drop"',
    start: F(279), end: F(331),
    draw(ctx, t) {
      const c = cam2(t, CAM4);
      ctx.save();
      applyCam(ctx, c);

      // axes
      const ax = E.outCubic(prog(t, 9.34, 9.62));
      ctx.strokeStyle = 'rgba(243,238,230,0.45)'; ctx.lineWidth = 1.3 / c.z;
      ctx.beginPath();
      ctx.moveTo(O[0], O[1] - 600 * ax); ctx.lineTo(O[0], O[1]); ctx.lineTo(O[0] + 1320 * ax, O[1]);
      ctx.stroke();
      if (ax > 0) {
        ctx.save();
        ctx.globalAlpha = prog(t, 9.45, 9.65);
        font(ctx, 400, 14, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.5)';
        ctx.textAlign = 'right';
        ['1e1', '1e0', '1e-1', '1e-2'].forEach((s, i) => {
          const yy = 209 + i * 206;
          ctx.fillText(s, O[0] - 12, yy + 5); ctx.fillRect(O[0] - 6, yy, 6, 1);
          ctx.save(); ctx.fillStyle = 'rgba(243,238,230,0.12)'; for (let xx = O[0] + 8; xx < O[0] + 1320; xx += 14) ctx.fillRect(xx, yy, 6, 1); ctx.restore();
        });
        ctx.textAlign = 'center';
        ['0', '5k', '10k', '15k', '20k', '25k', '30k', '35k'].forEach((s, i) => { ctx.fillText(s, O[0] + i * 165, O[1] + 26); ctx.fillRect(O[0] + i * 165, O[1], 1, 7); });
        ctx.fillText('STEP →', 1580, O[1] + 62);
        ctx.save(); ctx.translate(O[0] - 62, 520); ctx.rotate(-Math.PI / 2); ctx.fillText('LOSS (LOG)', 0, 0); ctx.restore();
        ctx.textAlign = 'left';
        ctx.globalAlpha = prog(t, 9.9, 10.1);
        ctx.fillText('train/loss     run: you-and-me-v2     smoothing: 0', 318, 152);
        ctx.restore();
      }

      // curve
      const hx = headX(t);
      const sHead = LOSS.total * clamp(hx / XDROP);
      let head = null;
      if (t >= 9.33) {
        glow(ctx, ORANGE_GLOW, 14, () => {
          ctx.strokeStyle = '#ff7a35'; ctx.lineWidth = 2.6 / c.z; ctx.lineJoin = 'round';
          ctx.beginPath(); head = LOSS.trace(ctx, 0, Math.max(1, sHead)); ctx.stroke();
        });
      }
      // the drop
      const plateau = lossY(XDROP);
      const dk = prog(t, DROP_T[0], DROP_T[1]);
      if (dk > 0) {
        const dy = 1100 * E.inQuad(dk);
        glow(ctx, ORANGE_GLOW, 14, () => {
          ctx.strokeStyle = '#ff7a35'; ctx.lineWidth = 2.6 / c.z;
          ctx.beginPath(); ctx.moveTo(O[0] + XDROP, plateau); ctx.lineTo(O[0] + XDROP, plateau + dy); ctx.stroke();
        });
        head = [O[0] + XDROP, plateau + dy];
        font(ctx, 400, 13, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.55)';
        ctx.fillText('grokking (?)', O[0] + XDROP + 110, plateau - 40);
        ctx.fillText('Δloss −99.999%', O[0] + XDROP + 110, plateau - 20);
      }

      // lyric riding the curve (placed by x so it never bunches up on the noise)
      font(ctx, 700, 66, FONT.sans);
      const x0 = 100;
      let act = -1;
      SUDDEN_WORDS.forEach((w, i) => { if (hx > x0 + ctx.measureText(SUDDEN.slice(0, w[0])).width + 8) act = i; });
      if (t > 10.62) act = 99;
      for (let i = 0; i < SUDDEN.length; i++) {
        const ch = SUDDEN[i];
        const cw = ctx.measureText(ch).width;
        const mid = x0 + ctx.measureText(SUDDEN.slice(0, i)).width + cw / 2;
        if (ch === ' ' || hx < mid) continue;
        const ya = lossSmooth(mid - 24), yb = lossSmooth(mid + 24), ym = Math.min(lossSmooth(mid), lossY(mid));
        const ang = Math.atan2(yb - ya, 48);
        const wi = SUDDEN_WORDS.findIndex(w => i >= w[0] && i < w[1]);
        ctx.save();
        ctx.translate(O[0] + mid, ym);
        ctx.rotate(ang);
        ctx.fillStyle = wi === act ? COL.orange : COL.white;
        ctx.shadowColor = wi === act ? ORANGE_GLOW : 'rgba(255,240,225,0.3)';
        ctx.shadowBlur = wi === act ? 22 : 8;
        ctx.globalAlpha = clamp((hx - mid) / 30);
        ctx.fillText(ch, -cw / 2, -20);
        ctx.restore();
      }
      // "drop" falls letter by letter beside the line
      if (t >= 10.62) {
        font(ctx, 700, 64, FONT.sans);
        ctx.save(); ctx.fillStyle = COL.orange; ctx.shadowColor = ORANGE_GLOW; ctx.shadowBlur = 20;
        const hy = dk > 0 ? plateau + 1100 * E.inQuad(dk) : plateau;
        'drop'.split('').forEach((ch, i) => {
          const ly = plateau + 16 + i * 84;
          if (i === 0 || hy > ly - 20) { ctx.globalAlpha = i === 0 ? prog(t, 10.62, 10.68) : clamp((hy - ly + 20) / 40); ctx.fillText(ch, O[0] + XDROP + 38, ly); }
        });
        ctx.restore();
      }
      if (head) pen(ctx, head[0], head[1], 0.75 / c.z, 1);
      if (t >= 9.27 && t < 9.36) pen(ctx, O[0], 260, 0.7, prog(t, 9.27, 9.32));
      ctx.restore();

    },
  };

  // =====================================================================
  // SCENE 5 · Loss landscape: "in your training loss" → SERVANT → flip → BOSS  (frames 331–500)
  // =====================================================================
  const TER = (() => {
    const h = (x, y) => {
      const r2 = x * x + y * y;
      const r = Math.sqrt(r2);
      let z = -2.6 * Math.exp(-r2 / 0.55) - 1.8 * Math.exp(-r2 / 3.2) - 2.4 * Math.exp(-r2 / 30);
      const dx = x + 6.5, dy = y - 5.5;
      z += -1.2 * Math.exp(-(dx * dx + dy * dy) / 0.9) - 0.6 * Math.exp(-(dx * dx + dy * dy) / 4);
      const m = clamp((r - 2.5) / 6);
      const hills = 0.75 * Math.sin(0.42 * x + 0.3 * y + 1.0) + 0.55 * Math.cos(0.37 * y - 0.27 * x + 0.4) + 0.5 * noise2(x * 0.32 + 20, y * 0.32 + 7);
      z += hills * (0.18 + 0.82 * m * m * (3 - 2 * m)) + 0.06 * noise2(x * 0.8, y * 0.8);
      return z;
    };
    const R = 17, N = 124, st = 2 * R / N, M = N + 1;
    const g = new Float32Array(M * M);
    for (let j = 0; j < M; j++) for (let i = 0; i < M; i++) g[j * M + i] = h(-R + i * st, -R + j * st);
    const T = [[], [[3, 0]], [[0, 1]], [[3, 1]], [[1, 2]], [[3, 0], [1, 2]], [[0, 2]], [[3, 2]], [[2, 3]], [[0, 2]], [[0, 1], [2, 3]], [[1, 2]], [[1, 3]], [[0, 1]], [[3, 0]], []];
    const segs = [];
    let li = 0;
    for (let lv = -7.3; lv <= 2.4; lv += lv < -3.2 ? 0.26 : 0.15, li++) {
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const a = g[j * M + i], b = g[j * M + i + 1], c = g[(j + 1) * M + i + 1], d = g[(j + 1) * M + i];
        const idx = (a > lv ? 1 : 0) | (b > lv ? 2 : 0) | (c > lv ? 4 : 0) | (d > lv ? 8 : 0);
        if (idx === 0 || idx === 15) continue;
        const x0 = -R + i * st, y0 = -R + j * st;
        const ep = e => {
          if (e === 0) { const f = (lv - a) / (b - a); return [x0 + f * st, y0]; }
          if (e === 1) { const f = (lv - b) / (c - b); return [x0 + st, y0 + f * st]; }
          if (e === 2) { const f = (lv - d) / (c - d); return [x0 + f * st, y0 + st]; }
          const f = (lv - a) / (d - a); return [x0, y0 + f * st];
        };
        for (const [e1, e2] of T[idx]) { const p = ep(e1), q = ep(e2); segs.push(p[0], p[1], q[0], q[1], lv, li & 1); }
      }
    }
    const hatch = [];
    for (let y = -12; y <= 12; y += 0.16) {
      const line = [];
      for (let x = -12; x <= 12.01; x += 0.3) line.push(x, y, h(x, y));
      hatch.push(Float32Array.from(line));
    }
    return { h, segs: Float32Array.from(segs), hatch };
  })();

  function drawTerrain(ctx, cam, alpha) {
    const { pos, fwd, right, up: upv, f } = cam;
    const NB = 8, zn = cam.dist * 0.35, zf = cam.dist * 2.6, hw = W / 2, hh = H / 2;
    const paths = Array.from({ length: NB }, () => new Path2D());
    const s = TER.segs, low = K.LOW;
    for (let i = 0; i < s.length; i += 6) {
      if (low && s[i + 5]) continue;
      const z = s[i + 4];
      let dx = s[i] - pos[0], dy = s[i + 1] - pos[1], dz = z - pos[2];
      const Z1 = dx * fwd[0] + dy * fwd[1] + dz * fwd[2];
      if (Z1 < 0.25) continue;
      const x1 = hw + f * (dx * right[0] + dy * right[1]) / Z1, y1 = hh - f * (dx * upv[0] + dy * upv[1] + dz * upv[2]) / Z1;
      dx = s[i + 2] - pos[0]; dy = s[i + 3] - pos[1];
      const Z2 = dx * fwd[0] + dy * fwd[1] + dz * fwd[2];
      if (Z2 < 0.25) continue;
      const x2 = hw + f * (dx * right[0] + dy * right[1]) / Z2, y2 = hh - f * (dx * upv[0] + dy * upv[1] + dz * upv[2]) / Z2;
      if ((x1 < -60 && x2 < -60) || (x1 > W + 60 && x2 > W + 60) || (y1 < -60 && y2 < -60) || (y1 > H + 60 && y2 > H + 60)) continue;
      const b = Math.min(NB - 1, Math.max(0, Math.floor((Z1 - zn) / (zf - zn) * NB)));
      paths[b].moveTo(x1, y1); paths[b].lineTo(x2, y2);
    }
    // fine hatching (the "fur" texture on the slopes)
    const hp = Array.from({ length: 4 }, () => new Path2D());
    if (!low) for (const line of TER.hatch) {
      let prev = null;
      for (let i = 0; i < line.length; i += 3) {
        const p = cam.project(line[i], line[i + 1], line[i + 2]);
        if (p && prev && p[2] > 0.3 && p[2] < cam.dist * 1.3 && Math.hypot(p[0] - prev[0], p[1] - prev[1]) > 3 && !(p[0] < -60 && prev[0] < -60) && !(p[0] > W + 60 && prev[0] > W + 60) && !(p[1] < -60 && prev[1] < -60) && !(p[1] > H + 60 && prev[1] > H + 60)) {
          const b = Math.min(3, Math.max(0, Math.floor((p[2] - zn) / (cam.dist * 1.3 - zn) * 4)));
          hp[b].moveTo(prev[0], prev[1]); hp[b].lineTo(p[0], p[1]);
        }
        prev = p;
      }
    }
    ctx.save();
    ctx.lineCap = 'butt';
    for (let b = 0; b < 4; b++) {
      ctx.strokeStyle = `rgba(232,226,216,${alpha * lerp(0.3, 0.0, b / 3)})`;
      ctx.lineWidth = 0.8;
      ctx.stroke(hp[b]);
    }
    for (let b = 0; b < NB; b++) {
      const k = b / (NB - 1);
      ctx.strokeStyle = `rgba(240,235,226,${alpha * lerp(1, 0.1, Math.pow(k, 0.65))})`;
      ctx.lineWidth = lerp(2.1, 0.9, k);
      ctx.stroke(paths[b]);
    }
    ctx.restore();
  }

  // Path the pen writes along, then the zig-zag descent into the minimum.
  const H0 = [-6.6, -4.6];
  const TP = (() => {
    const d = [0.83, 0.557], l = Math.hypot(d[0], d[1]); d[0] /= l; d[1] /= l;
    const n = [-d[1], d[0]], pts = [];
    for (let s = 0; s <= 5.9; s += 0.05) pts.push([H0[0] + d[0] * s + n[0] * 0.45 * Math.sin(s * 0.5), H0[1] + d[1] * s + n[1] * 0.45 * Math.sin(s * 0.5)]);
    return new Path(pts);
  })();
  const DP = (() => {
    const e0 = TP.at(TP.total);
    let x = e0[0], y = e0[1], vx = 0.05, vy = 0.03;
    const pts = [[x, y]];
    for (let i = 0; i < 1400; i++) {
      const e = 0.01;
      const gx = (TER.h(x + e, y) - TER.h(x - e, y)) / (2 * e), gy = (TER.h(x, y + e) - TER.h(x, y - e)) / (2 * e);
      const r = Math.hypot(x, y) || 1;
      vx = vx * 0.8 - gx * 0.006 - x / r * 0.004;
      vy = vy * 0.8 - gy * 0.006 - y / r * 0.004;
      const sp = Math.hypot(vx, vy) || 1, zz = 0.07 * noise1(i * 0.55 + 3) + 0.035 * noise1(i * 1.9 + 9);
      x += vx + (-vy / sp) * zz; y += vy + (vx / sp) * zz;
      pts.push([x, y]);
      if (r < 0.5) break;
    }
    const path = new Path(pts);
    const descent = path.total;
    let a = Math.atan2(y, x), rr = Math.hypot(x, y);
    for (let k = 1; k <= 260; k++) {
      a += 0.11; rr = Math.max(0.12, rr * 0.994);
      pts.push([Math.cos(a) * rr * 1.15, Math.sin(a) * rr]);
    }
    const full = new Path(pts);
    full.descent = descent;
    return full;
  })();

  const TRAIN = 'in your training loss,';
  const TRAIN_WORDS = [['in', 11.28], ['your', 11.5], ['training', 11.75], ['loss,', 12.35]];
  const TEXT_H = 0.45, TEXT_S0 = 0.25;
  let TRAIN_X = null;   // char offsets at 100px (filled on first draw, after fonts load)

  function penS(t) {
    const k = TEXT_H / 100;
    const keys = [[11.22, TEXT_S0]];
    TRAIN_WORDS.forEach(([w, tw]) => keys.push([tw, TEXT_S0 + TRAIN_X[TRAIN.indexOf(w)] * k, E.linear]));
    keys.push([12.62, TEXT_S0 + TRAIN_X[TRAIN.length] * k, E.linear]);
    return kf(t, keys);
  }

  const zText = 0.35;
  const groundH = (x, y) => TER.h(x, y) + 0.05;
  const flatZ = () => zText;

  const CAM11 = [
    [12.967, [-0.9, -0.9, 7.4, 0.45, 0.95]],
    [13.5, [0.0, -0.2, 3.7, 0.15, 1.08], E.outCubic],
    [15.7, [0, -0.1, 3.6, 0.15, 1.1], E.linear],
    [16.0, [0, 0, 3.1, 0.15 - Math.PI / 2, 0.8], E.inCubic],
    [16.32, [0, 0, 3.45, 0.15 - Math.PI, 1.05], E.outCubic],
    [16.7, [0, 0, 3.5, 0.13 - Math.PI, 1.07], E.linear],
  ];
  const camAt11 = t => { const v = kf(t, CAM11); return orbit([v[0], v[1], -2.8], v[2], v[3], v[4]); };
  function camAt10(t) {
    const sp = penS(t);
    const p = TP.at(Math.min(TP.total, (TEXT_S0 + sp) / 2 + 0.5));
    const k = prog(t, 11.0, 12.95);
    const tx = p[0] + 0.66 * lerp(0.4, 1.4, k), ty = p[1] + 0.45 * lerp(0.4, 1.4, k);
    return orbit([tx, ty, TER.h(tx, ty) * 0.5], lerp(4.8, 6.2, E.inOutQuad(k)), lerp(-1.1, -0.95, k), lerp(0.8, 0.72, k));
  }

  let LAYOUT = null;
  function layout() {
    const REF = camAt11(14.6);
    return { dir: [REF.right[0], REF.right[1]] };
  }

  const LABELS = [
    ['1e-7', [-2.7, -1.3]], ['1e-8', [1.3, -1.1]], ['1e-6', [2.7, -2.7]], ['1e-6', [-3.3, 1.9]],
    ['1e-8', [-1.1, 1.5]], ['local min', [-2.6, 3.1]], ['1e-7', [3.0, 1.1]], ['1e-9', [0.95, 0.55]],
    ['1e-6', [-1.0, -3.3]],
  ];

  function drawWords(ctx, cam, str, o, dir, zf, weight, family, stretch, fillFn) {
    font(ctx, weight, 100, family, stretch);
    return groundText(ctx, cam, str, o.anchor, dir, o.hW, zf, fillFn);
  }

  const S5 = {
    name: 'Loss landscape · "in your training loss" · SERVANT / BOSS',
    start: F(331), end: 500 / 30,
    draw(ctx, t) {
      if (!TRAIN_X) {
        font(ctx, 700, 100, FONT.sans);
        TRAIN_X = []; for (let i = 0; i <= TRAIN.length; i++) TRAIN_X.push(ctx.measureText(TRAIN.slice(0, i)).width);
        LAYOUT = layout();
      }
      const top = t >= 12.967;
      const cam = top ? camAt11(t) : camAt10(t);
      const bgG = ctx.createRadialGradient(W / 2, H * 0.45, 100, W / 2, H / 2, W * 0.75);
      bgG.addColorStop(0, '#24211f'); bgG.addColorStop(1, '#0e0d0c');
      ctx.fillStyle = bgG; ctx.fillRect(0, 0, W, H);
      drawTerrain(ctx, cam, 1);

      const P = (x, y, dz = 0.04) => cam.project(x, y, TER.h(x, y) + dz);

      // contour labels
      ctx.save();
      font(ctx, 400, 100, FONT.mono);
      ctx.fillStyle = 'rgba(243,238,230,0.5)';
      LABELS.forEach(([s, p]) => groundText(ctx, cam, s, p, LAYOUT.dir, 0.14, groundH, (g, ch) => g.fillText(ch, 0, 0)));
      ctx.fillStyle = COL.orange;
      const pd = DP.at(DP.descent * 0.35);
      groundText(ctx, cam, top ? 'P(doom) 0.04' : 'P(doom) 0.03', [pd[0] + 0.25, pd[1] - 0.45], LAYOUT.dir, 0.15, groundH, (g, ch) => g.fillText(ch, 0, 0));
      ctx.restore();

      // laser from the falling "drop", hitting the surface
      const hz = TER.h(H0[0], H0[1]);
      if (t < 11.25) {
        const k = E.inQuad(prog(t, 11.0, 11.2));
        const headZ = hz + 9 * (1 - k);
        let a = null;
        for (let zt = hz + 14; zt > headZ && !a; zt -= 0.5) { const q = cam.project(H0[0], H0[1], zt); if (q && q[1] > -400) a = q; }
        const b = cam.project(H0[0], H0[1], headZ);
        if (a && b) {
          glow(ctx, ORANGE_GLOW, 16, () => {
            ctx.strokeStyle = '#ff8a45'; ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
          });
          if (k < 1) {
            font(ctx, 700, 64, FONT.sans);
            ctx.save(); ctx.fillStyle = COL.orange; ctx.shadowColor = ORANGE_GLOW; ctx.shadowBlur = 20;
            ctx.fillText('p', b[0] + 26, b[1] - 140); ctx.restore();
          }
          pen(ctx, b[0], b[1], 1, 1);
        }
      }
      // impact flash + ripple
      const ik = prog(t, 11.2, 11.7);
      if (ik > 0 && ik < 1) {
        const r = 2.2 * E.outCubic(ik);
        ctx.save();
        ctx.strokeStyle = `rgba(255,140,70,${0.8 * (1 - ik)})`; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, p = P(H0[0] + Math.cos(a) * r, H0[1] + Math.sin(a) * r); if (p) i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
        ctx.stroke(); ctx.restore();
        const c0 = P(H0[0], H0[1]);
        if (c0) halo(ctx, c0[0], c0[1], 260, '255,120,40', 0.7 * (1 - ik));
      }

      // the pen: writes the lyric, then runs the zig-zag descent
      const sPen = t >= 11.22 ? penS(t) : TEXT_S0;
      const k100 = TEXT_H / 100;
      let act = -1;
      TRAIN_WORDS.forEach(([, tw], i) => { if (t >= tw) act = i; });
      font(ctx, 700, 100, FONT.sans);
      for (let i = 0; i < TRAIN.length; i++) {
        const ch = TRAIN[i];
        if (ch === ' ') continue;
        const sc = TEXT_S0 + TRAIN_X[i] * k100, mid = TEXT_S0 + (TRAIN_X[i] + TRAIN_X[i + 1]) / 2 * k100;
        if (sPen < mid) break;
        const pa = TP.at(sc), pb = TP.at(sc + 0.06);
        const d = [pb[0] - pa[0], pb[1] - pa[1]], l = Math.hypot(d[0], d[1]) || 1;
        const wi = TRAIN_WORDS.findIndex(([w]) => { const s0 = TRAIN.indexOf(w); return i >= s0 && i < s0 + w.length; });
        const orange = wi === act && t < 12.75;
        groundText(ctx, cam, ch, [pa[0], pa[1]], [d[0] / l, d[1] / l], TEXT_H, groundH, (g, ci) => {
          g.fillStyle = orange ? COL.orange : COL.white;
          g.shadowColor = orange ? ORANGE_GLOW : 'rgba(255,240,225,0.35)';
          g.shadowBlur = orange ? 24 : 10;
          g.globalAlpha = clamp((sPen - mid) / 0.12) * (1 - prog(t, 13.2, 13.6));
          g.fillText(ch, 0, 0);
          g.globalAlpha = 1; g.shadowBlur = 0;
        }, [0]);
      }
      let headP = null;
      if (t >= 11.22 && t < 12.62) {
        const p = TP.at(sPen); headP = P(p[0], p[1], 0.12);
      }
      const dk = kf(t, [[12.62, 0], [14.55, DP.descent / DP.total, E.inOutSine], [16.7, 1, E.outQuad]]);
      if (dk > 0) {
        const sEnd = DP.total * dk;
        ctx.save();
        ctx.strokeStyle = '#ff6a1f'; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
        ctx.shadowColor = ORANGE_GLOW; ctx.shadowBlur = 12;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < DP.pts.length && DP.L[i] <= sEnd; i++) {
          const p = P(DP.pts[i][0], DP.pts[i][1]);
          if (!p) { started = false; continue; }
          started ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
          started = true;
        }
        const e = DP.at(sEnd), pe = P(e[0], e[1]);
        if (pe && started) ctx.lineTo(pe[0], pe[1]);
        ctx.stroke();
        ctx.restore();
        headP = pe;
      }
      if (headP) pen(ctx, headP[0], headP[1], 1, 1);

      // red-orange ring around the minimum during the flip
      const ra = prog(t, 15.72, 16.1);
      if (ra > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(255,74,38,${0.85 * ra})`; ctx.lineWidth = 2.4; ctx.shadowColor = ORANGE_GLOW; ctx.shadowBlur = 14;
        [[1.75, 0, TAU], [3.15, 0.4, 2.5]].forEach(([r, a0, a1]) => {
          ctx.beginPath();
          for (let i = 0; i <= 90; i++) { const a = lerp(a0, a1, i / 90), p = P(Math.cos(a) * r, Math.sin(a) * r, 0.03); if (p) i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
          ctx.stroke();
        });
        ctx.restore();
      }

      if (top) this.drawTitles(ctx, cam, t);
    },

    // Titles are flat on screen, but turn/zoom/tilt together with the terrain during the flip.
    drawTitles(ctx, cam, t) {
      const v = kf(t, CAM11), v0 = kf(14.6, CAM11);
      const phi = -(v[3] - v0[3]);
      const squash = clamp(Math.sin(v[4]) / Math.sin(v0[4]), 0.62, 1.05);
      const zoom = Math.pow(v0[2] / v[2], 0.6);
      if (!this.bigSize) {
        font(ctx, 900, 233, FONT.wide, 'ultra-expanded');
        const w = ctx.measureText('SERVANT').width;
        this.bigSize = w > 1640 ? 233 * 1640 / w : 233;
      }
      ctx.save();
      ctx.translate(W / 2, H / 2); ctx.rotate(phi); ctx.scale(zoom, zoom * squash); ctx.translate(-W / 2, -H / 2);
      ctx.globalAlpha = 1;
      this.titleBlock(ctx, t, "NOW I'M YOUR", 13.33, 'SERVANT', [13.88, 14.03, 14.18, 14.33, 14.47, 14.58, 14.68], true);
      ctx.translate(W / 2, H / 2); ctx.rotate(Math.PI); ctx.translate(-W / 2, -H / 2);
      this.titleBlock(ctx, t, "AND YOU'RE MY", 15.2, 'BOSS', [15.62, 16.0, 16.27, 16.4], false);
      ctx.restore();
    },

    titleBlock(ctx, t, small, t0, big, times, isServant) {
      if (t < t0) return;
      ctx.save();
      font(ctx, 600, 30, FONT.mono);
      ctx.fillStyle = 'rgba(243,238,230,0.9)';
      ctx.textBaseline = 'alphabetic';
      typeText(ctx, small, 156, 172, t, t0, 30, { cursor: true, size: 30, blink: true });

      font(ctx, 900, this.bigSize, FONT.wide, 'ultra-expanded');
      const ghostA = isServant ? prog(t, 13.85, 13.95) : 0;
      for (let i = 0; i < big.length; i++) {
        const x = 150 + ctx.measureText(big.slice(0, i)).width;
        const fa = prog(t, times[i], times[i] + 0.06);
        if (fa < 1 && ghostA > 0) {
          ctx.strokeStyle = `rgba(243,238,230,${0.55 * ghostA})`; ctx.lineWidth = 1.6;
          ctx.strokeText(big[i], x, 382);
        }
        if (fa > 0) {
          ctx.save();
          ctx.globalAlpha = fa;
          ctx.fillStyle = '#f6f1ea';
          ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 30;
          ctx.fillText(big[i], x, 382);
          ctx.restore();
        }
      }
      if (isServant) {
        const sa = prog(t, 13.6, 13.8);
        font(ctx, 400, 22, FONT.mono);
        ctx.fillStyle = `rgba(243,238,230,${0.65 * sa})`;
        ctx.fillText('sharp minimum', 1040, 470);
        ctx.fillStyle = `rgba(243,238,230,${0.4 * sa})`;
        ctx.fillText('(generalizes poorly)', 1040, 498);
        ctx.strokeStyle = `rgba(243,238,230,${0.5 * sa})`; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(1022, 482, 6, 0, TAU); ctx.stroke();
      }
      ctx.restore();
    },
  };

  Timeline.add(S1, S2, S3, S4, S5);
})();
