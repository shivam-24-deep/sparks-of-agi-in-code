// Project settings. Edit these, not the engine.
window.CONFIG = {
  title: 'Sparks of AGI',
  fps: 30,

  // Drop your song at web/audio/song.mp3 (or use the "Add song" button).
  // offset = song time at video t=0. Use a positive value if the song has an intro before frame 1.
  song: { url: 'audio/song.mp3', offset: 0 },

  // Original video frames, used by the "Reference" compare mode.
  reference: {
    pattern: '../frames/frames_{lo}_{hi}/frame_{n}.jpg',
    batch: 500,
    totalFrames: 4700,
  },

  fx: { bloom: 0.5, grain: 0.045, vignette: 0.6 },

  // Shown in the end credits and as a small signature in the corner of every frame.
  credit: { name: 'Shivam Deep', watermark: 'SHIVAM DEEP · WEB v1.0' },
};

// ?name=Rahul → the pen writes the viewer's name in the end credits (the author credit stays in the footer + corner).
(function () {
  const v = new URLSearchParams(location.search).get('name');
  if (v) CONFIG.credit.viewer = v.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 24) || undefined;
})();
