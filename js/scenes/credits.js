// CREDITS — frames 4701–4790 (2:36.7 – 2:39.7), plays after the rewind, before the loop restarts.
// The orange pen writes the author's name; a P(doom) counter settles from NaN to 0.00.
(function () {
  'use strict';
  const { W, H, TAU, COL, FONT, clamp, lerp, prog, E, hash, noise1, font, halo, pen } = K;

  const F = n => (n - 1) / 30;
  const OG = 'rgba(255,106,31,0.9)';
  const ORN = '#ff6a1f';
  const AUTHOR = (CONFIG.credit && CONFIG.credit.name) || 'Your Name';
  const viewer = () => CONFIG.credit && CONFIG.credit.viewer;
  let NAME = AUTHOR;
  const T0 = F(4701), T1 = F(4791);
  const at = s => T0 + s;                     // seconds into the credit

  let LINE = '', FOOT = '';

  let NX = null, NSIZE = 0, KEY = null;
  function layout(ctx) {
    const v = viewer();
    NAME = v || AUTHOR;
    LINE = v ? 'THIS ONE IS FOR' : 'RECREATED IN THE BROWSER BY';
    FOOT = v ? `website by ${AUTHOR} · built with Claude Opus 5.5 · drawn live in code` : 'built with Claude Opus 5.5 · 4,700 frames drawn live in code · no video files';
    KEY = NAME;
    NSIZE = Math.min(230, 100 * 1500 / (font(ctx, 900, 100, FONT.wide, 'expanded'), ctx.measureText(NAME).width));
    font(ctx, 900, NSIZE, FONT.wide, 'expanded');
    const total = ctx.measureText(NAME).width;
    const x0 = 960 - total / 2;
    NX = []; for (let i = 0; i <= NAME.length; i++) NX.push(x0 + ctx.measureText(NAME.slice(0, i)).width);
  }

  const S = {
    name: 'Credits',
    start: T0, end: T1, credit: true, bloom: 0.7,
    draw(ctx, t) {
      if (!NX || KEY !== (viewer() || AUTHOR)) layout(ctx);
      ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
      const out = prog(t, at(2.45), at(2.85));          // collapse at the end
      const fade = 1 - out;
      const base = 600;

      // faint grid, like the opening shot
      ctx.save(); ctx.globalAlpha = 0.5 * prog(t, at(0.1), at(0.5)) * fade;
      ctx.strokeStyle = 'rgba(243,238,230,0.05)'; ctx.lineWidth = 1;
      ctx.beginPath(); for (let x = 0; x <= W; x += 60) { ctx.moveTo(x, 0); ctx.lineTo(x, H); } for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke();
      ctx.restore();

      ctx.save(); ctx.globalAlpha = fade;
      // typed mono line
      font(ctx, 500, 30, FONT.mono); ctx.letterSpacing = '8px';
      const n = Math.floor(clamp((t - at(0.15)) * 55, 0, LINE.length));
      const lw = ctx.measureText(LINE).width;
      ctx.fillStyle = 'rgba(243,238,230,0.7)';
      ctx.fillText(LINE.slice(0, n), 960 - lw / 2, base - NSIZE * 0.95);
      if (n < LINE.length || Math.floor(t * 3) % 2 === 0) { ctx.fillStyle = ORN; ctx.fillRect(960 - lw / 2 + ctx.measureText(LINE.slice(0, n)).width + 4, base - NSIZE * 0.95 - 26, 16, 30); }
      ctx.letterSpacing = '0px';

      // the name, written letter by letter by the pen
      font(ctx, 900, NSIZE, FONT.wide, 'expanded');
      const w0 = at(0.6), w1 = at(1.75);
      const chars = NAME.length;
      let penP = null;
      for (let i = 0; i < chars; i++) {
        const ch = NAME[i];
        if (ch === ' ') continue;
        const a = lerp(w0, w1, i / chars), b = lerp(w0, w1, (i + 1) / chars);
        const k = prog(t, a, b);
        if (k <= 0) {
          ctx.strokeStyle = 'rgba(243,238,230,0.12)'; ctx.lineWidth = 2; ctx.strokeText(ch, NX[i], base);
          continue;
        }
        const x = NX[i], w = NX[i + 1] - NX[i];
        ctx.save();
        ctx.beginPath(); ctx.rect(x - 6, base - NSIZE, (w + 12) * k, NSIZE * 1.3); ctx.clip();
        const settle = prog(t, b, b + 0.35);          // freshly written letters glow orange, then cool to cream
        const r = 255, g = Math.round(lerp(130, 238, settle)), bl = Math.round(lerp(60, 228, settle));
        ctx.fillStyle = `rgb(${r},${g},${bl})`;
        ctx.shadowColor = settle < 1 ? OG : 'rgba(255,240,225,0.35)'; ctx.shadowBlur = lerp(34, 14, settle);
        ctx.fillText(ch, x, base);
        ctx.restore();
        if (k < 1) penP = [x + w * k, base - NSIZE * (0.35 + 0.3 * noise1(t * 14 + i * 3))];
      }
      if (penP) pen(ctx, penP[0], penP[1], 1.4, 1);
      // underline swipe once the name is complete
      const u = E.outCubic(prog(t, at(1.75), at(2.0)));
      if (u > 0) {
        ctx.fillStyle = ORN; ctx.shadowColor = OG; ctx.shadowBlur = 16;
        ctx.fillRect(NX[0], base + 34, (NX[chars] - NX[0]) * u, 6); ctx.shadowBlur = 0;
      }

      // P(doom) settles: NaN → 0.00
      const pa = prog(t, at(1.85), at(2.0));
      if (pa > 0) {
        ctx.globalAlpha = fade * pa;
        font(ctx, 500, 30, FONT.mono);
        const val = t < at(2.05) ? 'NaN' : t < at(2.15) ? '0.42' : t < at(2.22) ? '0.07' : '0.00';
        const s1 = 'P(doom) = ', s3 = '  ·  it was all for show';
        const tw = ctx.measureText(s1 + '0.00' + s3).width;
        let x = 960 - tw / 2;
        ctx.fillStyle = 'rgba(243,238,230,0.75)'; ctx.fillText(s1, x, base + 120); x += ctx.measureText(s1).width;
        ctx.fillStyle = ORN; ctx.fillText(val, x, base + 120); x += ctx.measureText('0.00').width;
        ctx.fillStyle = 'rgba(243,238,230,0.5)'; ctx.fillText(s3, x, base + 120);
        font(ctx, 400, 18, FONT.mono); ctx.fillStyle = 'rgba(243,238,230,0.35)'; ctx.textAlign = 'center';
        ctx.fillText(FOOT, 960, H - 70); ctx.textAlign = 'left';
      }
      ctx.restore();

      // everything collapses into the orange dot the film opens with
      if (out > 0) {
        const r = lerp(0, 1, out);
        halo(ctx, 960, 560, 260 * (1 - r) + 40, '255,120,40', 0.8 * (1 - prog(t, at(2.8), at(3.0))));
        pen(ctx, 960, 560, 1.2 - r * 0.6, 1 - prog(t, at(2.85), at(3.0)));
      }
      // the line + pen from the opening frames, so the loop joins seamlessly
      void hash; void TAU;
    },
  };

  Timeline.add(S);
})();
