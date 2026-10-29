/* ZOLV V27: scroll to page start without navigating to a new page. */
(() => {
  'use strict';
  const button = document.getElementById('zolv-back-top');
  if (!button) return;
  const chatPanel = document.getElementById('zolv-chat-panel');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;
  const update = () => {
    scheduled = false;
    button.hidden = window.scrollY < 680 || Boolean(chatPanel && !chatPanel.hidden);
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, {passive:true});
  document.getElementById('zolv-chat-launcher')?.addEventListener('click', () => requestAnimationFrame(update));
  document.getElementById('zolv-chat-close')?.addEventListener('click', () => requestAnimationFrame(update));
  button.addEventListener('click', () => {
    window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});
  });
  update();
})();
