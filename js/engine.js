// Timeline + player. Scenes register with Timeline.add(); the player drives time from
// the song (if loaded) or the wall clock, and renders one frame per animation tick.
(function (G) {
  'use strict';
  const { W, H, COL, PFX, clamp } = K;
  const FPS = CONFIG.fps;

  const Timeline = {
    scenes: [],
    duration: 0,
    add(...list) {
      this.scenes.push(...list);
      this.scenes.sort((a, b) => a.start - b.start || (a.layer || 0) - (b.layer || 0));
      this.duration = Math.max(this.duration, ...list.map(s => s.end));
    },
    active(t) { return this.scenes.filter(s => t >= s.start && t < s.end); },
    render(ctx, t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';
      ctx.fillStyle = COL.bg;
      ctx.fillRect(0, 0, W, H);
      for (const s of this.active(t)) {
        ctx.save();
        try { s.draw(ctx, t, t - s.start); } catch (e) { Engine.error(e, s); }
        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      const fx = CONFIG.fx;
      const act = this.active(t);
      const bv = act.filter(s => s.bloom !== undefined).map(s => s.bloom);
      const bs = bv.length ? Math.min(...bv) : 1;
      PFX.bloom(ctx, fx.bloom * bs);
      const vs = act.reduce((m, s) => Math.min(m, s.vignette === undefined ? 1 : s.vignette), 1);
      PFX.vignette(ctx, fx.vignette * vs);
      PFX.grain(ctx, fx.grain, Math.floor(t * FPS));
      PFX.corners(ctx);
      // author signature, bottom-right, hidden while the credits themselves play
      const wm = CONFIG.credit && CONFIG.credit.watermark;
      if (wm && !act.some(s => s.credit)) {
        ctx.save();
        ctx.font = `500 14px ${K.FONT.mono}`; ctx.letterSpacing = '3px'; ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(243,238,230,0.34)';
        ctx.fillText(wm, W - 56, H - 28);
        ctx.fillStyle = 'rgba(255,106,31,0.7)'; ctx.fillRect(W - 56 - ctx.measureText(wm).width - 22, H - 38, 8, 8);
        ctx.restore();
      }
    },
  };

  const $ = id => document.getElementById(id);
  const pad = (n, w) => String(n).padStart(w, '0');

  const lerpT = (s, k) => s.start + (s.end - s.start) * k;

  const Engine = {
    t: 0, playing: false, rate: 1, loop: true, refMode: 'off', dirty: true, lastNow: 0, lastFrame: -1, quality: 'auto',

    updateQualityLabel() {
      const o = document.querySelector('#quality option[value="auto"]');
      if (o) o.textContent = K.LOW && this.quality === 'auto' ? 'Quality: auto (light)' : 'Quality: auto';
    },

    async boot() {
      this.canvas = $('screen');
      this.ctx = this.canvas.getContext('2d', { alpha: false });
      this.audio = $('song');
      PFX.init();
      this.frames = Math.round(Timeline.duration * FPS);
      document.title = `${CONFIG.title} — frames 1–${this.frames}`;

      const q = new URLSearchParams(location.search);
      this.touch = matchMedia('(pointer: coarse)').matches || q.get('touch') === '1';
      if (this.touch) { document.body.classList.add('touch'); K.LOW = true; }
      if (q.get('imm') === '1') document.body.classList.add('immersive');
      if (q.get('ui') === '0') document.body.classList.add('no-ui');
      if (q.get('fx') === '0') CONFIG.fx = { bloom: 0, grain: 0, vignette: 0 };
      if (q.get('debug') === '1') this.debug = true;
      this.refAvailable = await new Promise(res => { const im = new Image(); im.onload = () => res(true); im.onerror = () => res(false); im.src = this.refSrc(1); });
      if (!this.refAvailable) {
        const sel = $('ref-mode'); if (sel) sel.style.display = 'none';
        const keys = document.querySelector('.keys'); if (keys) keys.textContent = keys.textContent.replace(' · R compare', '');
      }
      if (q.get('ref') && this.refAvailable) this.setRef(q.get('ref'));

      await this.loadFonts();
      // warm up: render each scene once so one-time setup (meshes, text outlines) never stalls playback
      // Scenes do one-time setup (meshes, textures) on their first draw. Do it off-screen, in the
      // background, so the start screen appears at once and nothing from later scenes flashes up.
      $('loading').remove();
      this.warmCanvas = document.createElement('canvas'); this.warmCanvas.width = W; this.warmCanvas.height = H;
      this.warmCtx = this.warmCanvas.getContext('2d');
      this.warmed = new Set();
      this.warmLog = [];
      const idle = () => new Promise(r => setTimeout(r, this.playing ? 120 : 0));
      (async () => {
        for (const sc of Timeline.scenes) { await idle(); this.warmScene(sc); }
        const slow = this.warmLog.filter(x => x[1].split('/').some(v => +v > 150));
        if (slow.length) console.log('slow scene setup:', slow.map(x => x.join(':')).join(' | '));
      })();

      this.bindUI();
      if (this.touch) {
        this.updateQualityLabel();
        const sub = $('start-sub'); if (sub) sub.textContent = '4,700 frames drawn live on your phone · tap D for behind the scenes';
      }
      this.loadSong(CONFIG.song.url, true);

      if (q.has('f')) this.seek((parseInt(q.get('f'), 10) - 1) / FPS);
      else if (q.has('t')) this.seek(parseFloat(q.get('t')));
      const start = $('start');
      if (start) {
        const skip = q.get('ui') === '0' || q.get('autoplay') === '1' || q.has('f') || q.has('t') || q.has('bench') || q.has('sweep');
        if (skip) start.remove();
        else {
          start.classList.add('show');
          start.onclick = () => { start.remove(); if (this.touch) this.setImmersive(true); this.play(); };
          if (CONFIG.credit && CONFIG.credit.viewer) $('start-sub').textContent = `stay till the end, ${CONFIG.credit.viewer}: your name is in the credits`;
        }
      }
      if (q.get('autoplay') === '1') this.play();
      if (q.get('sweep') === '1') await (async () => {
        // render every 5th frame of the whole film, catch errors, time the slowest frames
        const errs = [], slow = [];
        const orig = this.error; this.error = (e, sc) => errs.push(`${sc && sc.name}: ${e.message}`);
        const t0 = performance.now();
        const f0 = parseInt(q.get('from') || '1', 10), f1 = parseInt(q.get('to') || String(this.frames), 10), st = parseInt(q.get('step') || '5', 10);
        for (let f = f0; f <= f1; f += st) {
          await new Promise(r => requestAnimationFrame(r));
          const a = performance.now();
          Timeline.render(this.ctx, (f - 1) / FPS);
          const ms = performance.now() - a;
          if (ms > 40) slow.push(`${f}:${ms.toFixed(0)}`);
        }
        this.error = orig;
        const el = $('err'); el.style.display = 'block';
        el.textContent = `sweep ${this.frames} frames, ${(performance.now() - t0).toFixed(0)} ms total | errors: ${errs.length ? [...new Set(errs)].join(' ; ') : 'none'} | slow(>40ms): ${slow.length ? slow.slice(0, 30).join(' ') : 'none'}`;
        console.log('SWEEP ' + el.textContent);
      })();
      if (q.get('bench') === 'swirl') {
        const s = Timeline.scenes.find(x => x.name.startsWith(q.get('name') || 'Swirl')), out = [];
        for (let i = 0; i < 13; i++) { const tt = i === 12 ? s.end - 0.15 : s.start + (i + 0.5) / 12 * (s.end - s.start); const t0 = performance.now(); Timeline.render(this.ctx, tt); out.push(`${Math.round(tt * 30 + 1)}:${(performance.now() - t0).toFixed(0)}`); }
        const el = $('err'); el.style.display = 'block'; el.textContent = out.join(' | ');
      }
      if (q.get('bench') === '1') {
        const out = [];
        const fx = Object.assign({}, CONFIG.fx);
        for (const noFx of [false, true]) {
          if (noFx) CONFIG.fx = { bloom: 0, grain: 0, vignette: 0 };
          for (const s of Timeline.scenes) {
            const t0 = performance.now(), n = 12;
            for (let i = 0; i < n; i++) Timeline.render(this.ctx, s.start + (i + 0.5) / n * (s.end - s.start));
            out.push(`${noFx ? 'noFX ' : ''}${s.name.slice(0, 14)}: ${((performance.now() - t0) / n).toFixed(0)}ms`);
          }
        }
        CONFIG.fx = fx;
        const el = $('err'); el.style.display = 'block'; el.textContent = out.join(' | ');
      }

      requestAnimationFrame(now => this.tick(now));
    },

    async loadFonts() {
      const specs = ['700 64px Inter', '800 64px Inter', '900 64px Inter', '600 64px Inter',
        '800 64px Archivo', '900 64px Archivo', '400 20px "JetBrains Mono"', '500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"', 'italic 500 64px "Cormorant Garamond"', '500 64px "Cormorant Garamond"'];
      const all = Promise.all(specs.map(s => document.fonts.load(s).catch(() => null)));
      await Promise.race([all, new Promise(r => setTimeout(r, 5000))]);
    },

    // ---------- audio ----------
    songActive() { const a = this.audio; return !!a.currentSrc && !a.error && a.readyState >= 1; },
    loadSong(src, quiet) {
      const a = this.audio;
      a.onerror = () => { if (!quiet) alert('Could not load that audio file.'); a.removeAttribute('src'); this.updateSongLabel(); };
      a.onloadedmetadata = () => { this.updateSongLabel(); if (this.playing) this.syncAudio(true); };
      a.src = src;
      a.load();
    },
    updateSongLabel() {
      const el = $('song-label');
      if (el) el.textContent = this.songActive() ? '♪ Song loaded' : '♪ Add song';
    },
    syncAudio(force) {
      if (!this.songActive()) return;
      const a = this.audio, target = this.t + CONFIG.song.offset;
      if (target < 0 || target > a.duration) { a.pause(); return; }
      if (force || Math.abs(a.currentTime - target) > 0.08) a.currentTime = target;
      a.playbackRate = this.rate;
      if (this.playing && a.paused) a.play().catch(() => {});
    },

    // ---------- transport ----------
    play() {
      const st = $('start'); if (st) st.remove();
      if (this.t >= Timeline.duration - 1 / FPS) this.seek(0);
      this.playing = true;
      this.lastNow = performance.now();
      this.syncAudio(true);
      this.updateUI();
    },
    pause() {
      this.playing = false;
      if (this.songActive()) this.audio.pause();
      this.updateUI();
    },
    toggle() { this.playing ? this.pause() : this.play(); },
    seek(t) {
      this.t = clamp(t, 0, Timeline.duration - 1e-6);
      this.dirty = true;
      if (this.songActive()) this.syncAudio(true);
      this.updateUI();
    },
    step(frames) { this.pause(); this.seek((Math.round(this.t * FPS) + frames) / FPS); },

    tick(now) {
      if (this.playing) {
        const a = this.audio;
        if (this.songActive() && !a.paused) this.t = a.currentTime - CONFIG.song.offset;
        else this.t += (now - this.lastNow) / 1000 * this.rate;
        if (this.t >= Timeline.duration) {
          if (this.loop) this.seek(0); else { this.t = Timeline.duration - 1e-6; this.pause(); }
        }
        this.dirty = true;
      }
      this.lastNow = now;
      if (this.playing && this.warmCtx) {
        // look ahead: make sure the scene starting in the next ~2 s is ready before we reach it
        const next = Timeline.scenes.find(sc => !this.warmed.has(sc) && sc.start > this.t && sc.start < this.t + 2);
        if (next) this.warmScene(next);
      }
      if (this.dirty) {
        const r0 = performance.now();
        Timeline.render(this.ctx, this.t);
        const ms = performance.now() - r0;
        this.msHist = this.msHist || [];
        this.msHist.push(ms); if (this.msHist.length > 120) this.msHist.shift();
        if (this.debug) this.drawDebug(ms, now);
        if (this.playing && this.quality === 'auto') {
          this.ema = this.ema === undefined ? ms : this.ema * 0.92 + ms * 0.08;
          if (!K.LOW && this.ema > 26) { K.LOW = true; this.updateQualityLabel(); }
        }
        this.dirty = false;
        this.updateUI();
      }
      requestAnimationFrame(n => this.tick(n));
    },

    // ---------- reference (original video frames) ----------
    setRef(mode) {
      if (!this.refAvailable) mode = 'off';
      this.refMode = mode;
      document.body.dataset.ref = mode;
      const sel = $('ref-mode');
      if (sel) sel.value = mode;
      this.lastFrame = -1;
      this.updateUI();
    },
    refSrc(n) {
      n = Math.min(n, CONFIG.reference.totalFrames);
      const r = CONFIG.reference, lo = Math.floor((n - 1) / r.batch) * r.batch + 1, hi = Math.min(lo + r.batch - 1, r.totalFrames);
      return r.pattern.replace('{lo}', pad(lo, 4)).replace('{hi}', pad(hi, 4)).replace('{n}', pad(n, 6));
    },

    // ---------- UI ----------
    bindUI() {
      $('btn-play').onclick = () => this.toggle();
      const scrub = $('scrub');
      scrub.max = this.frames - 1;
      scrub.oninput = () => { this.pause(); this.seek(scrub.value / FPS); };
      $('speed').onchange = e => { this.rate = parseFloat(e.target.value); this.syncAudio(true); };
      $('ref-mode').onchange = e => this.setRef(e.target.value);
      $('loop').onchange = e => { this.loop = e.target.checked; };
      $('quality').onchange = e => {
        this.quality = e.target.value;
        K.LOW = this.quality === 'low';
        this.ema = undefined;
        this.dirty = true;
        this.updateQualityLabel();
      };
      $('song-file').onchange = e => {
        const f = e.target.files[0];
        if (f) this.loadSong(URL.createObjectURL(f));
      };
      $('btn-debug').onclick = () => this.setDebug(!this.debug);
      const nameIn = $('viewer-name');
      if (nameIn && CONFIG.credit && CONFIG.credit.viewer) nameIn.value = CONFIG.credit.viewer;
      const writeName = () => {
        const v = nameIn.value.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 24);
        CONFIG.credit.viewer = v || undefined;
        const url = new URL(location.href);
        if (v) url.searchParams.set('name', v); else url.searchParams.delete('name');
        history.replaceState(null, '', url);
        $('share-link').textContent = v ? `share: ${url.href}` : '';
        nameIn.blur();
        const cr = Timeline.scenes.find(x => x.credit);
        if (cr) { this.seek(cr.start); this.play(); }
      };
      if ($('btn-name')) $('btn-name').onclick = writeName;
      if (nameIn) nameIn.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); writeName(); } });
      $('btn-full').onclick = () => {
        if (this.touch) { this.setImmersive(!document.body.classList.contains('immersive')); return; }
        const el = $('stage-wrap');
        if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen && el.requestFullscreen();
      };
      // touch: tap the picture to play/pause (and to show the overlay buttons)
      $('screen').addEventListener('click', () => {
        if (document.body.classList.contains('immersive')) { this.pokeUI(); if (!this._uiJustShown) this.toggle(); }
        else if (this.touch) this.toggle();
      });
      $('tap-exit').onclick = ev => { ev.stopPropagation(); this.setImmersive(false); };
      $('tap-play').onclick = ev => { ev.stopPropagation(); this.toggle(); this.pokeUI(); };
      $('tap-debug').onclick = ev => { ev.stopPropagation(); this.setDebug(!this.debug); this.pokeUI(); };
      document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && this._fsByImmersive) { this._fsByImmersive = false; this.setImmersive(false); } });
      window.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
        if (e.code === 'Space') { e.preventDefault(); this.toggle(); }
        else if (e.code === 'ArrowRight') { e.preventDefault(); this.step(e.shiftKey ? FPS : 1); }
        else if (e.code === 'ArrowLeft') { e.preventDefault(); this.step(e.shiftKey ? -FPS : -1); }
        else if (e.code === 'Home') { this.seek(0); }
        else if (e.code === 'KeyR' && this.refAvailable) { const m = ['off', 'side', 'overlay']; this.setRef(m[(m.indexOf(this.refMode) + 1) % 3]); }
        else if (e.code === 'KeyF') { $('btn-full').click(); }
        else if (e.code === 'KeyD') { this.setDebug(!this.debug); }
      });
      this.updateSongLabel();
    },
    warmScene(sc) {
      if (!this.warmCtx || this.warmed.has(sc)) return;
      this.warmed.add(sc);
      const t0 = performance.now();
      const times = [];
      try { for (const k of [0.5, 0.97]) { const a = performance.now(); Timeline.render(this.warmCtx, lerpT(sc, k)); times.push(Math.round(performance.now() - a)); } } catch (e) { console.error(e); }
      this.warmLog.push([sc.name.slice(0, 24), times.join('/')]);
    },
    setImmersive(on) {
      document.body.classList.toggle('immersive', on);
      if (on) {
        // real full screen + landscape lock where the browser allows it (Android); the CSS rotation covers the rest (iPhone)
        const el = document.documentElement;
        if (el.requestFullscreen && !document.fullscreenElement) {
          el.requestFullscreen({ navigationUI: 'hide' }).then(() => {
            this._fsByImmersive = true;
            if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
          }).catch(() => {});
        }
        this.pokeUI();
      } else {
        document.body.classList.remove('ui-hidden');
        if (document.fullscreenElement && this._fsByImmersive) { this._fsByImmersive = false; document.exitFullscreen().catch(() => {}); }
        if (screen.orientation && screen.orientation.unlock) try { screen.orientation.unlock(); } catch (e) {}
      }
    },
    // show the overlay buttons for a moment
    pokeUI() {
      const b = document.body;
      this._uiJustShown = b.classList.contains('ui-hidden');
      b.classList.remove('ui-hidden');
      clearTimeout(this._uiTimer);
      this._uiTimer = setTimeout(() => { if (this.playing) b.classList.add('ui-hidden'); }, 2500);
    },
    setDebug(on) {
      this.debug = on;
      const b = $('btn-debug'); if (b) b.classList.toggle('on', on);
      this.dirty = true;
    },
    // "Behind the scenes" overlay: proves every frame is drawn live.
    drawDebug(ms, now) {
      const c = this.ctx, f = Math.min(this.frames, Math.floor(this.t * FPS + 1e-6) + 1);
      const act = Timeline.active(this.t);
      c.save();
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none'; c.shadowBlur = 0;
      // panel
      c.fillStyle = 'rgba(8,7,7,0.82)'; c.fillRect(36, 36, 560, 250);
      c.strokeStyle = 'rgba(255,106,31,0.8)'; c.lineWidth = 2; c.strokeRect(36, 36, 560, 250);
      const blink = Math.floor(now / 500) % 2 === 0;
      c.fillStyle = blink ? '#ff3b1f' : '#7a1d10'; c.beginPath(); c.arc(62, 66, 8, 0, Math.PI * 2); c.fill();
      c.font = `700 22px ${K.FONT.mono}`; c.fillStyle = '#ff6a1f'; c.fillText('LIVE RENDER · NO VIDEO FILE', 80, 74);
      c.font = `400 18px ${K.FONT.mono}`; c.fillStyle = 'rgba(243,238,230,0.85)';
      const fps = ms > 0 ? Math.min(999, 1000 / Math.max(ms, 1000 / 60)) : 60;
      [
        `frame   ${String(f).padStart(4, '0')} / ${this.frames}    t ${this.t.toFixed(3)} s`,
        `draw    ${ms.toFixed(1)} ms   (budget 33.3 ms @ 30 fps)`,
        `canvas  ${W}×${H} · 2D · ${K.LOW ? 'light' : 'full'} quality`,
        `scene   ${act.map(x => x.name).join(' + ').slice(0, 42)}`,
        `code    ${Timeline.scenes.length} scenes · drawn by JavaScript each frame`,
      ].forEach((ln, i) => c.fillText(ln, 56, 110 + i * 28));
      // draw-time graph
      const gx = 56, gy = 262, gw = 520, gh = 40, hist = this.msHist || [];
      c.fillStyle = 'rgba(243,238,230,0.08)'; c.fillRect(gx, gy - gh, gw, gh);
      c.strokeStyle = 'rgba(243,238,230,0.3)'; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(gx, gy - gh * 33.3 / 50); c.lineTo(gx + gw, gy - gh * 33.3 / 50); c.stroke(); c.setLineDash([]);
      c.strokeStyle = '#ff6a1f'; c.lineWidth = 2; c.beginPath();
      hist.forEach((v, i) => { const x = gx + gw * i / 119, y = gy - gh * Math.min(v, 50) / 50; i ? c.lineTo(x, y) : c.moveTo(x, y); });
      c.stroke();
      void fps;
      // scene timeline strip
      const sy = H - 70, sx0 = 36, sx1 = W - 36, D = Timeline.duration;
      c.fillStyle = 'rgba(8,7,7,0.82)'; c.fillRect(sx0, sy - 18, sx1 - sx0, 46);
      Timeline.scenes.forEach((s, i) => {
        const x0 = sx0 + (sx1 - sx0) * s.start / D, x1 = sx0 + (sx1 - sx0) * s.end / D;
        const on = act.includes(s);
        c.fillStyle = on ? '#ff6a1f' : (i % 2 ? 'rgba(243,238,230,0.28)' : 'rgba(243,238,230,0.16)');
        c.fillRect(x0 + 1, sy - 8, Math.max(1, x1 - x0 - 2), 16);
      });
      const px = sx0 + (sx1 - sx0) * this.t / D;
      c.fillStyle = '#fff'; c.fillRect(px - 1, sy - 16, 3, 32);
      c.font = `400 13px ${K.FONT.mono}`; c.fillStyle = 'rgba(243,238,230,0.6)';
      c.fillText('scene timeline · each block is one piece of code', sx0 + 8, sy + 24);
      // canvas border + centre cross
      c.strokeStyle = 'rgba(255,106,31,0.35)'; c.lineWidth = 1; c.setLineDash([8, 8]);
      c.strokeRect(4, 4, W - 8, H - 8);
      c.beginPath(); c.moveTo(W / 2 - 20, H / 2); c.lineTo(W / 2 + 20, H / 2); c.moveTo(W / 2, H / 2 - 20); c.lineTo(W / 2, H / 2 + 20); c.stroke();
      c.restore();
    },
    updateUI() {
      const frame = Math.min(this.frames, Math.floor(this.t * FPS + 1e-6) + 1);
      const s = this.t, m = Math.floor(s / 60);
      const set = (id, v) => { const el = $(id); if (el && el.textContent !== v) el.textContent = v; };
      set('time', `${pad(m, 2)}:${pad(Math.floor(s % 60), 2)}.${pad(Math.floor((s % 1) * 1000), 3)}`);
      set('frame', `F ${frame} / ${this.frames}`);
      const sc = Timeline.active(this.t).map(x => x.name).join(' + ');
      set('scene-name', sc);
      const scrub = $('scrub');
      if (scrub && document.activeElement !== scrub) scrub.value = frame - 1;
      const btn = $('btn-play');
      if (btn) btn.textContent = this.playing ? '❚❚' : '▶';
      const tp = $('tap-play'); if (tp) tp.textContent = this.playing ? '❚❚' : '▶';
      if (this.refMode !== 'off' && frame !== this.lastFrame) {
        this.lastFrame = frame;
        $('ref-img').src = this.refSrc(frame);
        set('ref-frame', String(frame));
      }
    },
    error(e, scene) {
      console.error(e);
      const el = $('err');
      if (el) { el.style.display = 'block'; el.textContent = `Scene "${scene && scene.name}" error: ${e.message}`; }
    },
  };

  G.Timeline = Timeline;
  G.Engine = Engine;
})(window);
