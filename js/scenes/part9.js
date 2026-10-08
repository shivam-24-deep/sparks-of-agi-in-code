// PART 9 — frames 4001–4700 (2:13.3 – 2:36.7), the ending
// Scenes: laptop closes "We'll never know" → stage "WAS IT ALL FOR SHOW?" → big bang + P(DOOM) counter to ∞
//         → "I'm upping my P(doom) = ∞ → 0/0 → NaN" → Regenerate → rewind montage back to frame 1 (loops)
(function () {
  'use strict';
  const {
    W, H, TAU, COL, FONT, clamp, lerp, prog, E, kf, hash, noise1,
    font, halo, pen, PFX,
  } = K;

  const F = n => (n - 1) / 30;
  const OG = 'rgba(255,106,31,0.9)';
  const CREAM = 'rgba(236,230,220,';
  const ORN = '#ff6a1f';

  function fitSize(ctx, weight, str, width, family, stretch) {
    font(ctx, weight, 100, family, stretch);
    return 100 * width / ctx.measureText(str).width;
  }

  // =====================================================================
  // SCENE 44 · Laptop closes: "We'll never know"   (frames 4001–4122)
  // =====================================================================
  // close: 0 = open, 1 = shut. Drawn in its own space; (cx,cy) is the hinge centre.
  function laptop(ctx, cx, cy, s, close, glow) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    const deck = [[-330, 0], [300, -20], [400, 200], [-270, 240]];
    ctx.fillStyle = '#3c3a38'; ctx.beginPath(); deck.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(205,200,192,0.55)';
    for (let r = 0; r < 5; r++) for (let k = 0; k < 13; k++) {
      const u = k / 13, v = r / 5;
      const x = lerp(lerp(-300, -250, v), lerp(290, 370, v), u), y = lerp(lerp(15, 210, v), lerp(-5, 185, v), u);
      ctx.fillRect(x, y, 30 + v * 6, 20 + v * 4);
    }
    // screen: top edge folds down toward the hinge as the lid closes
    const h = 340 * Math.cos(close * Math.PI / 2) + 4;
    const sk = 1 - close;
    ctx.fillStyle = '#1e1d1c';
    ctx.beginPath(); ctx.moveTo(-330, 0); ctx.lineTo(300, -20); ctx.lineTo(260 + 40 * close, -20 - h); ctx.lineTo(-280 - 50 * close, -h); ctx.closePath(); ctx.fill();
    halo(ctx, -15, -h / 2, 520 * sk + 160, '255,240,225', 0.5 * glow * (0.3 + 0.7 * sk));
    ctx.fillStyle = `rgba(250,246,240,${glow})`;
    ctx.beginPath(); ctx.moveTo(-305, -6); ctx.lineTo(278, -24); ctx.lineTo(240 + 40 * close, -14 - h * 0.93); ctx.lineTo(-262 - 50 * close, -h * 0.93 + 4); ctx.closePath(); ctx.fill();
    if (h > 60) {
      ctx.save(); ctx.translate(-10, -h * 0.5); ctx.scale(1, h / 340); ctx.rotate(-0.03);
      ctx.fillStyle = `rgba(52,26,20,${glow})`; ctx.fillRect(-235, -95, 450, 190);
      ctx.strokeStyle = `rgba(120,50,30,${glow})`; ctx.lineWidth = 3; ctx.strokeRect(-235, -95, 450, 190);
      font(ctx, 700, 30, FONT.mono); ctx.letterSpacing = '8px'; ctx.fillStyle = `rgba(255,110,50,${glow})`; ctx.textAlign = 'center';
      ctx.fillText('REDACTED', 0, 10); ctx.textAlign = 'left'; ctx.letterSpacing = '0px';
      ctx.restore();
    }
    ctx.restore();
  }
  function ilyaText(ctx, t, a) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.font = `italic 500 64px ${FONT.serif}`;
    ctx.fillStyle = CREAM + '0.85)'; ctx.fillText('What did Ilya', 150, 170);
    ctx.fillStyle = t < F(4009) ? ORN : CREAM + '0.85)'; ctx.fillText('see?', 150 + ctx.measureText('What did Ilya ').width, 170);
    const ws = [['We’ll', F(4009)], ['never', F(4020)], ['know', F(4033)]];
    let x = 150;
    ws.forEach(([w, t0], i) => {
      const wid = ctx.measureText(w + ' ').width;
      if (t >= t0) {
        const cur = i === 2 || t < ws[i + 1][1];
        ctx.fillStyle = cur ? ORN : CREAM + '0.85)';
        if (i === 2 && t >= F(4100)) {
          // "know" gets redacted
          const k = prog(t, F(4100), F(4104));
          ctx.fillText(w, x, 250);
          ctx.fillStyle = '#121010'; ctx.fillRect(x - 4, 202, ctx.measureText(w).width * k + 8, 62);
          ctx.strokeStyle = 'rgba(236,230,220,0.25)'; ctx.lineWidth = 1; ctx.strokeRect(x - 4, 202, ctx.measureText(w).width * k + 8, 62);
          font(ctx, 600, 9, FONT.mono); ctx.fillStyle = ORN; ctx.fillText('WITHHELD', x + 4, 280);
          ctx.font = `italic 500 64px ${FONT.serif}`;
        } else ctx.fillText(w, x, 250);
      }
      x += wid;
    });
    ctx.restore();
  }
  const S44 = {
    name: 'Laptop closes · We’ll never know',
    start: F(4001), end: F(4122), vignette: 1.2,
    draw(ctx, t) {
      ctx.fillStyle = '#060505'; ctx.fillRect(0, 0, W, H);
      const close = E.inOutCubic(prog(t, F(4024), F(4048))) * 0.97;
      const s = kf(t, [[F(4001), 1.25], [F(4026), 1.35, E.linear], [F(4040), 1.3], [F(4050), 0.7, E.inOutCubic]]);
      const cy = kf(t, [[F(4001), 640], [F(4026), 620], [F(4040), 600], [F(4050), 560, E.inOutCubic]]);
      const cx = kf(t, [[F(4001), 1230], [F(4026), 1180], [F(4040), 1130], [F(4050), 1000, E.inOutCubic]]);
      // floor + spotlight
      const lit = 1 - prog(t, F(4040), F(4055));
      if (lit > 0) {
        ctx.save(); ctx.globalAlpha = lit;
        const g = ctx.createRadialGradient(960, 700, 40, 960, 700, 1100);
        g.addColorStop(0, 'rgba(150,140,130,0.6)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
      for (let i = 0; i < 40; i++) { const x = hash(i) * W, y = (hash(i * 2.3) * H + t * 20 * (0.5 + hash(i * 4))) % H; ctx.fillStyle = `rgba(230,220,210,${0.15 + hash(i * 7) * 0.25})`; ctx.fillRect(x, y, 2, 2); }
      const glow = t < F(4100) ? 1 : 1 - prog(t, F(4100), F(4118));
      if (t < F(4050)) laptop(ctx, cx, cy, s, close, 1);
      else {
        // just the glowing seam of the closed lid, flickering out
        const fl = 0.75 + 0.25 * Math.sin(t * 23) * Math.sin(t * 7);
        const w = kf(t, [[F(4050), 330], [F(4058), 70], [F(4066), 60], [F(4072), 20], [F(4080), 60], [F(4100), 70], [F(4106), 18], [F(4118), 6]]);
        ctx.strokeStyle = `rgba(236,230,220,${0.25 * glow})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(960 - 360, 555); ctx.lineTo(960 + 360, 548); ctx.stroke();
        halo(ctx, 960, 548, w * 2.2, '255,120,50', 0.7 * glow * fl);
        ctx.fillStyle = `rgba(255,190,150,${glow * fl})`; ctx.fillRect(960 - w / 2, 543, w, 9);
      }
      ilyaText(ctx, t, 1 - prog(t, F(4108), F(4121)));
    },
  };

  // =====================================================================
  // SCENE 45 · Stage: WAS IT ALL FOR SHOW?   (frames 4122–4208)
  // =====================================================================
  const SHOW = [['WAS', F(4128)], ['IT', F(4136)], ['ALL', F(4150)], ['FOR', F(4170)], ['SHOW?', F(4202)]];
  function curtains(ctx, k) {
    // k: 0 = open (at the sides), 1 = closed (meeting in the middle)
    const gap = lerp(330, 0, k);
    [-1, 1].forEach(side => {
      const x0 = side < 0 ? 240 : 960 + gap, x1 = side < 0 ? 960 - gap : 1680;
      if (x1 <= x0) return;
      const g = ctx.createLinearGradient(0, 290, 0, 1040);
      g.addColorStop(0, '#1e0705'); g.addColorStop(1, '#0e0403');
      ctx.fillStyle = g; ctx.fillRect(x0, 290, x1 - x0, 750);
      for (let x = x0; x < x1; x += 14) {
        const v = 0.5 + 0.5 * Math.sin(x * 0.45);
        ctx.fillStyle = `rgba(${Math.round(120 + 50 * v)},${Math.round(22 + 14 * v)},14,${0.14 + 0.12 * v})`;
        ctx.fillRect(x, 290, 6, 750);
      }
    });
  }
  const S45 = {
    name: 'Stage · WAS IT ALL FOR SHOW?',
    start: F(4122), end: F(4208), vignette: 1.1,
    draw(ctx, t) {
      ctx.fillStyle = '#0c0a0a'; ctx.fillRect(0, 0, W, H);
      const a = prog(t, F(4124), F(4130)) * (1 - prog(t, F(4190), F(4194)));
      ctx.save(); ctx.globalAlpha = a;
      // proscenium + pelmet
      ctx.fillStyle = '#121010'; ctx.fillRect(180, 230, 1560, 820);
      ctx.fillStyle = '#0a0808'; ctx.fillRect(160, 220, 1600, 70);
      ctx.strokeStyle = 'rgba(236,230,220,0.08)'; ctx.lineWidth = 2; ctx.strokeRect(160, 220, 1600, 830);
      const ck = E.inOutCubic(prog(t, F(4185), F(4190)));
      // spotlight cone + pool
      const cone = 1 - prog(t, F(4188), F(4196));
      if (cone > 0) {
        ctx.save(); ctx.globalAlpha = a * cone;
        const g = ctx.createLinearGradient(0, 300, 0, 1000);
        g.addColorStop(0, 'rgba(255,250,240,0.75)'); g.addColorStop(1, 'rgba(200,194,186,0.28)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(925, 300); ctx.lineTo(995, 300); ctx.lineTo(1065 - 60 * ck, 980); ctx.lineTo(855 + 60 * ck, 980); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,250,0.9)'; ctx.beginPath(); ctx.ellipse(960, 982, 105 - 60 * ck, 12, 0, 0, TAU); ctx.fill();
        halo(ctx, 960, 980, 220, '255,240,225', 0.3);
        ctx.restore();
      }
      curtains(ctx, ck);
      ctx.restore();
      // the closing seam → orange line → dot
      if (t >= F(4190)) {
        const h = kf(t, [[F(4190), 700], [F(4200), 690], [F(4205), 300, E.inQuad], [F(4207.5), 2, E.inQuad]]);
        const orange = prog(t, F(4192), F(4196));
        ctx.fillStyle = orange > 0 ? `rgba(255,${Math.round(lerp(230, 110, orange))},${Math.round(lerp(220, 40, orange))},1)` : '#e8e2da';
        ctx.fillRect(958, 650 - h / 2, 4, h);
        if (h < 30) { halo(ctx, 960, 650, 40, '255,140,60', 0.9); pen(ctx, 960, 650, 0.6, 1); }
      }
      // the question (serif, spaced caps)
      ctx.save();
      ctx.font = `600 52px ${FONT.serif}`; ctx.letterSpacing = '9px';
      const total = ctx.measureText(SHOW.map(w => w[0]).join(' ')).width;
      let x = 960 - total / 2;
      SHOW.forEach(([w, t0], i) => {
        const sung = t >= t0;
        ctx.globalAlpha = Math.max(prog(t, F(4124), F(4130)), sung ? 1 : 0);
        ctx.fillStyle = sung ? ORN : 'rgba(150,144,138,0.7)';
        ctx.shadowColor = sung ? OG : 'transparent'; ctx.shadowBlur = sung ? 14 : 0;
        ctx.fillText(w, x, 178);
        x += ctx.measureText(w + ' ').width;
      });
      ctx.restore();
    },
  };

  // =====================================================================
  // SCENE 46 · Big bang, P(DOOM) counter → 1e1000 → ∞   (frames 4208–4482)
  // =====================================================================
  function starburst(ctx, t, a, cx = 960, cy = 540, maxR = 1e9) {
    if (a <= 0) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const P = [new Path2D(), new Path2D()];
    for (let i = 0; i < 700; i++) {
      const ang = hash(i * 1.37) * TAU, r0 = 20 + hash(i * 2.1) * 200, r1 = Math.min(maxR, r0 + 200 + hash(i * 3.3) * 1300);
      const sp = (t * (0.8 + hash(i) * 0.6)) % 1;
      const rr0 = r0 + sp * 200, rr1 = r1 + sp * 300;
      P[i % 2].moveTo(cx + Math.cos(ang) * rr0, cy + Math.sin(ang) * rr0); P[i % 2].lineTo(cx + Math.cos(ang) * rr1, cy + Math.sin(ang) * rr1);
    }
    ctx.lineWidth = 1.6; ctx.strokeStyle = `rgba(255,190,120,${0.55 * a})`; ctx.stroke(P[0]);
    ctx.lineWidth = 1; ctx.strokeStyle = `rgba(255,140,60,${0.45 * a})`; ctx.stroke(P[1]);
    ctx.restore();
    halo(ctx, cx, cy, 380, '255,220,170', 0.9 * a);
    halo(ctx, cx, cy, 120, '255,250,240', a);
    ctx.save(); ctx.strokeStyle = `rgba(255,90,40,${0.35 * a})`; ctx.lineWidth = 2;
    [520, 760].forEach(r => { ctx.beginPath(); ctx.arc(cx, cy, r + (t * 60) % 80, 0, TAU); ctx.stroke(); });
    ctx.restore();
  }
  // value shown, scale of the axis (value at the right end of the bar)
  const PV = t => kf(t, [[F(4208), 1.0], [F(4260), 1.0], [F(4262), 1.01], [F(4278), 1.01], [F(4282), 1.10], [F(4288), 1.5], [F(4306), 1.5], [F(4310), 2.0]]);
  function axisRow(ctx, y, x0, x1, frac, label, tickN) {
    ctx.fillStyle = CREAM + '0.3)'; ctx.fillRect(x0, y, x1 - x0, 1.5);
    for (let i = 0; i <= tickN; i++) ctx.fillRect(x0 + (x1 - x0) * i / tickN, y - (i % 5 ? 4 : 8), 1.5, i % 5 ? 4 : 8);
    ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 14; ctx.fillRect(x0, y - 2, (x1 - x0) * frac, 5); ctx.shadowBlur = 0;
    if (label) { font(ctx, 400, 11, FONT.mono); ctx.fillStyle = 'rgba(255,120,60,0.8)'; ctx.fillText(label, x0 + (x1 - x0) * frac + 12, y - 12); }
  }
  function bigNum(ctx, str, x, y, size, color, glow) {
    font(ctx, 400, size, FONT.mono);
    ctx.fillStyle = color; ctx.shadowColor = glow || 'rgba(255,240,225,0.35)'; ctx.shadowBlur = glow ? 30 : 18;
    ctx.fillText(str, x, y); ctx.shadowBlur = 0;
  }
  function zeros(groups, perLine) {
    const out = []; let line = [];
    for (let i = 0; i < groups; i++) { line.push('000'); if (line.length === perLine) { out.push(line.join(' ')); line = []; } }
    if (line.length) out.push(line.join(' '));
    return out;
  }
  // infinity (lemniscate) path
  const LEM = (() => { const p = []; for (let i = 0; i <= 200; i++) { const a = i / 200 * TAU, d = 1 + Math.sin(a) ** 2; p.push([960 + 720 * Math.cos(a) / d, 564 + 720 * Math.sin(a) * Math.cos(a) / d]); } return new K.Path(p); })();
  const FLASH = [[F(4456), '1.00', '#f2eee8'], [F(4458), '1.50', ORN], [F(4461), '3.14', '#f2eee8'], [F(4466), '42.00', ORN], [F(4469), '1,000', '#f2eee8'], [F(4472), '1e30', ORN], [F(4476), '1e100', '#f2eee8'], [F(4479), '∞', ORN]];
  const S46 = {
    name: 'Big bang \u00b7 P(DOOM) 1.00 \u2192 \u221e',
    start: F(4208), end: F(4482), bloom: 0.8,
    draw(ctx, t) {
      ctx.fillStyle = '#080606'; ctx.fillRect(0, 0, W, H);
      const label = (str, x, y, size = 44) => { font(ctx, 500, size, FONT.mono); ctx.letterSpacing = `${size * 0.22}px`; ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 10; ctx.fillText(str, x, y); ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; };
      if (t < F(4211)) {
        const k = prog(t, F(4208), F(4211));
        ctx.fillStyle = `rgb(${Math.round(lerp(218, 120, k))},${Math.round(lerp(210, 105, k))},${Math.round(lerp(200, 95, k))})`; ctx.fillRect(0, 0, W, H);
        starburst(ctx, t, 1, 996, 552, 380);
        return;
      }
      if (t < F(4317)) {
        const burst = 1 - prog(t, F(4245), F(4260));
        if (burst > 0) { ctx.fillStyle = `rgba(105,92,82,${0.8 * burst * (1 - prog(t, F(4211), F(4230)))})`; ctx.fillRect(0, 0, W, H); }
        starburst(ctx, t, burst, 996, 552);
        const v = PV(t);
        label('P(DOOM)', 168, 456);
        bigNum(ctx, v.toFixed(2), 160, 700, 210, '#f2eee8');
        // unit length shrinks as the value outgrows the scale; the MAX stop stays at 1.00
        const u = kf(t, [[F(4266), 1162], [F(4290), 1080], [F(4310), 924, E.inOutSine]]);
        const right = t < F(4282) ? 1335 : W + 20;
        ctx.fillStyle = CREAM + '0.3)'; ctx.fillRect(168, 780, right - 168, 1.5);
        for (let i = 0; i <= 40; i++) { const x = 168 + i * u / 10; if (x > right) break; ctx.fillRect(x, 780 - (i % 5 ? 5 : 10), 1.5, i % 5 ? 5 : 10); }
        ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 16; ctx.fillRect(168, 777, Math.min(right - 168, u * v), 7); ctx.shadowBlur = 0;
        const ex = 168 + u;
        ctx.strokeStyle = CREAM + '0.8)'; ctx.lineWidth = 3;
        const broke = t >= F(4268);
        ctx.beginPath(); ctx.moveTo(ex + 6, 752); ctx.lineTo(ex - (broke ? -2 : 6), 772); ctx.moveTo(ex + 2, 790); ctx.lineTo(ex - 6, 810); ctx.stroke();
        font(ctx, 400, 22, FONT.mono); ctx.fillStyle = CREAM + '0.6)'; ctx.fillText('max', ex - 20, 742);
        if (t >= F(4285)) { font(ctx, 400, 20, FONT.mono); ctx.fillStyle = CREAM + '0.5)'; ctx.fillText('\u00b9 Kolmogorov (1933): P(\u03a9) = 1.  Deprecated.', 168, 1010); }
        return;
      }
      if (t < F(4380)) {
        // bigger numbers on a stretching log axis
        const steps = [[F(4317), '3.14', '\u2248 \u03c0 (irrational)'], [F(4328), '10.00', 'an order of magnitude'], [F(4346), '42.00', 'the answer (question pending)'], [F(4356), '1,000.00', 'units: dooms']];
        let k = 0; steps.forEach((s, i) => { if (t >= s[0]) k = i; });
        const z = 1 + (t - steps[k][0]) * 0.04;
        ctx.save(); ctx.translate(200, 420); ctx.scale(z, z); ctx.translate(-200, -420);
        label('P(DOOM)', 152, 250, 34);
        bigNum(ctx, steps[k][1], 140, 516, 300, '#f2eee8');
        const hx = 1360;
        ctx.fillStyle = CREAM + '0.3)'; ctx.fillRect(-200, 773, 2400, 1.5);
        for (let i = 0; i < 30; i++) ctx.fillRect(hx - 400 + i * 30, 766, 1.5, 7);
        ctx.fillRect(hx - 440, 762, 2, 22); ctx.fillRect(1900, 762, 2, 22);
        ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 16; ctx.fillRect(-200, 770, hx + 200, 6); ctx.shadowBlur = 0;
        halo(ctx, hx, 773, 30, '255,220,190', 0.9);
        font(ctx, 400, 22, FONT.mono); ctx.fillStyle = 'rgba(255,120,60,0.8)'; ctx.fillText(steps[k][2], hx + 20, 735);
        ctx.restore();
        return;
      }
      if (t < F(4430)) {
        // the number gets longer than the screen
        const st = t < F(4390) ? [3, 3, 215, 204, '1e9', '(a billion)'] : t < F(4401) ? [10, 4, 160, 205, '1e30', '(one E thirty \u2014 see above)'] : t < F(4421) ? [33, 7, 92, 113, '1e100', '(a googol)'] : [330, 21, 30, 38.5, '1e1000', '(does not fit)'];
        const [groups, per, size, lh, lab, note] = st;
        label('P(DOOM) =', 132, groups >= 330 ? 113 : 113, 26);
        const lines = zeros(groups, per);
        font(ctx, 400, size, FONT.mono);
        const lead = groups >= 33 ? '10' : '1';
        const cw = ctx.measureText('0').width;
        const x0 = 132, y0 = groups >= 330 ? 187 : groups >= 33 ? 223 : 330;
        ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 14; ctx.fillText(lead, x0, y0); ctx.shadowBlur = 0;
        ctx.fillStyle = '#f2eee8'; ctx.shadowColor = 'rgba(255,240,225,0.3)'; ctx.shadowBlur = groups >= 330 ? 0 : 12;
        lines.forEach((ln, i) => ctx.fillText(ln, i === 0 ? x0 + cw * (lead.length + 1) : x0, y0 + i * lh));
        ctx.shadowBlur = 0;
        font(ctx, 400, 20, FONT.mono); ctx.fillStyle = CREAM + '0.5)'; ctx.textAlign = 'right'; ctx.fillText(note, 1730, groups >= 330 ? 900 : 900);
        font(ctx, 500, 66, FONT.mono); ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 16; ctx.fillText(lab, 1730, 975); ctx.shadowBlur = 0; ctx.textAlign = 'left';
        return;
      }
      if (t < F(4456)) {
        // an orange spark draws the infinity sign
        const k = E.inOutSine(prog(t, F(4430), F(4454)));
        label('P(DOOM) =', 252, 270, 30);
        ctx.save(); ctx.lineCap = 'round';
        ctx.beginPath(); const head = LEM.trace(ctx, 0, LEM.total * k);
        ctx.strokeStyle = 'rgba(255,90,25,0.5)'; ctx.lineWidth = 16; ctx.filter = 'blur(8px)'; ctx.stroke(); ctx.filter = 'none';
        ctx.strokeStyle = '#ff7a32'; ctx.lineWidth = 5; ctx.shadowColor = OG; ctx.shadowBlur = 18; ctx.stroke();
        ctx.restore();
        if (head) pen(ctx, head[0], head[1], 1.3, 1);
        font(ctx, 400, 22, FONT.mono); ctx.fillStyle = CREAM + '0.5)'; ctx.fillText('\u00b9 upper bound removed', 270, 885);
        return;
      }
      // rapid recap of every value
      let f = FLASH[0];
      FLASH.forEach(x => { if (t >= x[0]) f = x; });
      font(ctx, 400, f[1] === '\u221e' ? 420 : 380, FONT.mono);
      ctx.textAlign = 'center';
      ctx.fillStyle = f[2]; ctx.shadowColor = f[2] === ORN ? OG : 'rgba(255,240,225,0.4)'; ctx.shadowBlur = 40;
      ctx.fillText(f[1], 960 + (hash(Math.floor(t * 30)) - 0.5) * 300, 680);
      ctx.shadowBlur = 0; ctx.textAlign = 'left';
    },
  };

  // =====================================================================
  // SCENE 47 · I'm upping my P(doom) = ∞ → 8 → 0/0 → NaN   (frames 4482–4628)
  // =====================================================================
  const LINE1 = 'I’m upping my';
  const n1 = t => kf(t, [[F(4482), 0], [F(4486), 3, E.linear], [F(4496), 8, E.linear], [F(4510), 11, E.linear], [F(4518), 14, E.linear]]);
  function pdoom(ctx, x, y, size, a) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.font = `italic 500 ${size}px ${FONT.serif}`;
    ctx.fillStyle = '#ff5a1f'; ctx.shadowColor = OG; ctx.shadowBlur = 26;
    ctx.fillText('P(doom)', x, y);
    const w = ctx.measureText('P(doom)').width;
    ctx.restore();
    return x + w;
  }
  let PD = null;
  const S47 = {
    name: 'I’m upping my P(doom) = ∞ → NaN',
    start: F(4482), end: F(4628), bloom: 0.6,
    draw(ctx, t) {
      ctx.fillStyle = '#080606'; ctx.fillRect(0, 0, W, H);
      const out = 1 - prog(t, F(4618), F(4626));
      ctx.save(); ctx.globalAlpha = out;
      ctx.translate(75, 110); ctx.scale(1.55, 1.55);
      // typed sans line
      font(ctx, 500, 92, FONT.sans);
      const n = Math.floor(n1(t));
      ctx.fillStyle = '#f2eee8'; ctx.shadowColor = 'rgba(255,240,225,0.35)'; ctx.shadowBlur = 14;
      ctx.fillText(LINE1.slice(0, n), 60, 200); ctx.shadowBlur = 0;
      // baseline guides
      if (t >= F(4519)) {
        ctx.fillStyle = CREAM + '0.18)'; ctx.fillRect(60, 330, 1110, 1); ctx.fillRect(60, 400, 1110, 1);
        font(ctx, 400, 10, FONT.mono); ctx.fillStyle = CREAM + '0.4)'; ctx.fillText('x-height', 1110, 322); ctx.fillText('baseline', 1110, 418);
      }
      // P(doom) assembles from sparks
      if (t >= F(4522)) {
        const k = prog(t, F(4522), F(4534));
        if (!PD) {
          const c = document.createElement('canvas'); c.width = 600; c.height = 220;
          const g = c.getContext('2d'); g.font = `italic 500 170px ${FONT.serif}`; g.fillStyle = '#fff'; g.fillText('P(doom)', 0, 160);
          const d = g.getImageData(0, 0, 600, 220).data; PD = [];
          for (let y = 0; y < 220; y += 4) for (let x = 0; x < 600; x += 4) if (d[(y * 600 + x) * 4 + 3] > 128) PD.push([x, y]);
        }
        if (k < 1) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          PD.forEach(([x, y], i) => {
            const kk = clamp(k * 1.6 - hash(i * 3.1) * 0.6);
            if (kk <= 0) return;
            const sx = 60 + x + (1 - kk) * (hash(i * 1.7) - 0.5) * 400, sy = 240 + y + (1 - kk) * (hash(i * 2.9) - 0.5) * 300;
            ctx.fillStyle = `rgba(255,${Math.round(140 + 80 * kk)},80,${kk})`; ctx.fillRect(sx, sy, 2.5, 2.5);
          });
          ctx.restore();
        }
        let x = pdoom(ctx, 60, 400, 170, E.inQuad(k));
        // "= ..." : ∞ → rotates to 8 → splits to 0/0 → NaN
        if (t >= F(4538)) {
          ctx.save();
          ctx.font = `500 110px ${FONT.serif}`; ctx.fillStyle = '#f2eee8'; ctx.globalAlpha = prog(t, F(4538), F(4542));
          ctx.fillText('=', x + 20, 395);
          x += 20 + ctx.measureText('= ').width;
          const rot = E.inOutCubic(prog(t, F(4556), F(4566))) * Math.PI / 2;
          const split = E.inOutCubic(prog(t, F(4576), F(4586)));
          const nan = prog(t, F(4592), F(4600));
          ctx.translate(x + 60, 360);
          if (nan < 1) {
            ctx.save(); ctx.globalAlpha = 1 - nan;
            if (split <= 0) {
              ctx.rotate(rot); ctx.font = `500 120px ${FONT.serif}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillStyle = rot > 0.05 ? '#ff9a5a' : '#f2eee8'; ctx.shadowColor = rot > 0.05 ? OG : 'transparent'; ctx.shadowBlur = 20;
              ctx.fillText('∞', 0, 0);
            } else {
              ctx.font = `500 ${lerp(70, 90, split)}px ${FONT.serif}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#f2eee8';
              ctx.fillText('0', 0, -lerp(28, 50, split)); ctx.fillText('0', 0, lerp(28, 50, split));
              ctx.fillRect(-28 * split, -2, 56 * split, 4);
            }
            ctx.restore();
          }
          if (nan > 0) {
            ctx.globalAlpha = nan; ctx.font = `500 130px ${FONT.serif}`; ctx.textBaseline = 'middle'; ctx.fillStyle = '#e6e0d8';
            ctx.fillText('NaN', -50, 0);
            ctx.font = `500 30px ${FONT.serif}`; ctx.fillText('¹', 200, -50);
          }
          ctx.restore();
          if (t >= F(4548)) { font(ctx, 400, 18, FONT.mono); ctx.fillStyle = CREAM + '0.5)'; ctx.fillText('(1)', 1120, 372); }
          if (t >= F(4600)) {
            font(ctx, 400, 13, FONT.mono); ctx.fillStyle = CREAM + '0.45)';
            const s = '¹ estimate no longer defined', m = Math.floor(clamp((t - F(4600)) * 45, 0, s.length));
            ctx.fillText(s.slice(0, m), 60, 520);
          }
        }
      }
      ctx.restore();
      if (t >= F(4622)) pen(ctx, 960, 500, 0.6, prog(t, F(4622), F(4627)));
    },
  };

  // =====================================================================
  // SCENE 48 · Regenerate   (frames 4628–4658)
  // =====================================================================
  const S48 = {
    name: 'Regenerate',
    start: F(4628), end: F(4658),
    draw(ctx, t) {
      ctx.fillStyle = '#060505'; ctx.fillRect(0, 0, W, H);
      const by = kf(t, [[F(4628), 640], [F(4640), 680], [F(4650), 713, E.inOutCubic], [F(4658), 713]]);
      const dy = kf(t, [[F(4628), 520], [F(4640), 510], [F(4650), 500, E.inOutCubic]]);
      halo(ctx, 960, dy, 40, '255,140,60', 0.9); pen(ctx, 960, dy, 0.6, 1);
      const a = prog(t, F(4628), F(4634));
      ctx.save(); ctx.globalAlpha = a;
      const pressed = t >= F(4655);
      ctx.fillStyle = pressed ? '#2a2826' : '#161514'; ctx.strokeStyle = 'rgba(236,230,220,0.55)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(762, by - 43, 420, 86, 12); ctx.fill(); ctx.stroke();
      font(ctx, 600, 32, FONT.mono); ctx.fillStyle = '#ece6dc'; ctx.textAlign = 'center'; ctx.fillText('↻  Regenerate', 972, by + 11);
      font(ctx, 400, 15, FONT.mono); ctx.fillStyle = CREAM + '0.35)'; ctx.fillText('this response could not be verified', 972, by + 76); ctx.textAlign = 'left';
      ctx.restore();
      // mouse cursor travelling to the button
      const mx = kf(t, [[F(4628), 1700], [F(4640), 1480], [F(4652), 1000, E.inOutCubic], [F(4658), 990]]);
      const my = kf(t, [[F(4628), 1000], [F(4640), 900], [F(4652), by + 6, E.inOutCubic], [F(4658), by + 6]]);
      ctx.fillStyle = '#f2eee8'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, my + 26); ctx.lineTo(mx + 7, my + 20); ctx.lineTo(mx + 12, my + 31); ctx.lineTo(mx + 16, my + 29); ctx.lineTo(mx + 11, my + 18); ctx.lineTo(mx + 19, my + 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    },
  };

  // =====================================================================
  // SCENE 49 · Rewind montage: the whole video plays backwards in ~1 second, landing on frame 1   (frames 4658–4700)
  // Reuses the real scenes: each frame here renders an earlier moment of the timeline, tinted orange.
  // =====================================================================
  const REWIND = [
    [4658, 3995], [4660, 3998], [4662, 3990], [4664, 3830], [4666, 3528], [4668, 3395], [4670, 3000], [4672, 2190],
    [4674, 970], [4676, 190], [4678, 165], [4680, 125], [4682, 100], [4684, 85], [4686, 55], [4688, 42], [4690, 36], [4692, 18], [4694, 12], [4696, 6], [4700, 1],
  ];
  const srcFrame = t => {
    const f = t * 30 + 1;
    let s = REWIND[0][1];
    for (const [a, b] of REWIND) if (f >= a) s = b;
    return s;
  };
  const S49 = {
    name: 'Rewind montage → loop',
    start: F(4658), end: 4700 / 30, rewind: true,
    draw(ctx, t) {
      const st = F(srcFrame(t));
      ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
      for (const s of Timeline.scenes) {
        if (s.rewind || st < s.start || st >= s.end) continue;
        ctx.save(); s.draw(ctx, st, st - s.start); ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      // orange tint + slight RGB split, like a tape rewinding
      const f = Math.floor(t * 30);
      ctx.save();
      ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,165,115,1)'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      // keep the brightest frames from flashing (photosensitivity)
      ctx.fillStyle = 'rgba(10,6,4,0.15)'; ctx.fillRect(0, 0, W, H);
      ctx.restore();
      PFX.motionBlur(ctx, (hash(f) - 0.5) * 40, 0, 4);
      // scanline wobble
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let y = (f * 37) % 60; y < H; y += 60) ctx.fillRect(0, y, W, 3);
      // fade to black into frame 1
      const k = prog(t, F(4694), F(4700));
      if (k > 0) { ctx.fillStyle = `rgba(9,8,7,${k * 0.85})`; ctx.fillRect(0, 0, W, H); }
    },
  };

  Timeline.add(S44, S45, S46, S47, S48, S49);
})();
