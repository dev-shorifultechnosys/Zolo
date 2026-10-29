/* ZOLV V27 — muted scroll-activated film playback with accessible controls. */
(() => {
  'use strict';
  const film = document.getElementById('brand-film');
  const play = document.getElementById('film-play');
  const sound = document.getElementById('film-sound');
  const soundText = document.getElementById('film-sound-label');
  if (!film || !play || !sound) return;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let requestId = 0;
  film.loop = true;
  film.muted = true;

  function sync() {
    play.hidden = !film.paused;
    sound.setAttribute('aria-pressed',String(!film.muted));
    sound.setAttribute('aria-label',film.muted ? 'Unmute ZOLV brand film' : 'Mute ZOLV brand film');
    if (soundText) soundText.textContent = film.muted ? 'SOUND OFF' : 'SOUND ON';
  }
  async function playIfVisible() {
    if (!visible || document.hidden || motionQuery.matches) return;
    try {
      film.muted = true; // autoplay must never initiate audio
      film.controls = true; // users can pause manually
      await film.play();
    } catch { /* browser autoplay rules may block; retain manual Play button */ }
    sync();
  }
  play.addEventListener('click', async () => {
    try { film.controls = true; if(film.paused) await film.play(); else film.pause(); }
    catch { film.controls = true; }
    sync();
  });
  sound.addEventListener('click', () => { film.muted = !film.muted; sync(); });
  for (const ev of ['play','pause','ended','volumechange']) film.addEventListener(ev,sync);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        visible = entry.isIntersecting && entry.intersectionRatio >= .35;
        if (visible) playIfVisible();
        else if (!film.paused) film.pause();
      }
    }, { threshold:[0,.15,.35,.55,.75] });
    observer.observe(document.getElementById('film') || film);
  } else {
    // No automatic playback without reliable visibility detection.
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !film.paused) film.pause();
    else if (!document.hidden && visible) playIfVisible();
  });
  motionQuery.addEventListener?.('change', () => {
    if (motionQuery.matches && !film.paused) film.pause();
    else if (visible) playIfVisible();
  });
  sync();
})();
