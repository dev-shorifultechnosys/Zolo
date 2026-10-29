/* ZOLV / V23 — transparent local messaging preview, no server connection. */
(() => {
  'use strict';
  const root = document.getElementById('zolv-chat');
  if (!root) return;
  const launch = root.querySelector('#zolv-chat-launcher');
  const panel = root.querySelector('#zolv-chat-panel');
  const closer = root.querySelector('#zolv-chat-close');
  const feed = root.querySelector('#zolv-chat-feed');
  const input = root.querySelector('#zolv-chat-input');
  const form = root.querySelector('#zolv-chat-form');
  const previews = {
    formulas: ['What formulas do you have?', 'Explore Energy, Sleep, Focus and NAD+ in our collection. You can select each formula to learn more about the proposed range.'],
    how: ['How do ZOLV strips work?', 'It’s simple: peel, place on your tongue and let the film dissolve. See the How It Works section for the 3-step guide.'],
    delivery: ['What about shipping and returns?', 'Shipping locations, delivery timelines and the return policy have not been confirmed. See our FAQ for current information.']
  };
  function setOpen(open) {
    panel.hidden = !open;
    launch.setAttribute('aria-expanded', String(open));
    launch.setAttribute('aria-label', open ? 'Close ZOLV message panel' : 'Open ZOLV message panel');
    if (open) closer.focus(); else launch.focus();
  }
  function bubble(text, type) {
    const p = document.createElement('p');
    p.className = 'zolv-chat__bubble zolv-chat__bubble--' + type;
    p.textContent = text;
    feed.appendChild(p);
    feed.scrollTop = feed.scrollHeight;
  }
  launch.addEventListener('click', () => setOpen(panel.hidden));
  closer.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {event.preventDefault(); setOpen(false);}
  });
  root.querySelectorAll('[data-chat-topic]').forEach(btn => btn.addEventListener('click', () => {
    const pair = previews[btn.dataset.chatTopic];
    if (!pair) return;
    bubble(pair[0], 'visitor');
    bubble(pair[1], 'support');
    input.focus();
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    bubble(value, 'visitor');
    bubble('This is a local website preview, so your message was not sent. Live messaging will be enabled after a support provider is connected.', 'support');
    input.value = '';
    input.focus();
  });
})();
