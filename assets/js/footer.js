/* ZOLV footer V22 — independent from main.js; no invented URLs or backend. */
(() => {
  'use strict';
  const footer = document.querySelector('#footer');
  if (!footer) return;
  const $ = (selector) => footer.querySelector(selector);
  const subscriptionTrigger = document.querySelector('.header [data-dialog="subscribe"]');
  const infoTexts = {
    'Privacy Policy': 'The official privacy policy has not yet been supplied. It must be published and linked before a production launch or newsletter data collection.',
    'Terms of Service': 'The official terms of service have not yet been supplied. This is a demonstration website; it does not accept real orders.',
    'Shipping': 'Shipping zones, delivery estimates and charges have not yet been confirmed. Please add the approved shipping policy before launch.',
    'Returns': 'Return eligibility, timelines and refund conditions are not yet approved. Please publish the official policy before launch.',
    'Contact': 'Contact details have not yet been supplied. The final page will include verified customer support channels.',
    'Wholesale': 'Wholesale partnership terms and a verified enquiry address are awaiting brand confirmation.',
    'Journal': 'The ZOLV Journal is being prepared. New brand articles can be linked here when published.',
    'Instagram': 'ZOLV’s verified Instagram URL has not yet been provided.',
    'TikTok': 'ZOLV’s verified TikTok URL has not yet been provided.',
    'YouTube': 'ZOLV’s verified YouTube URL has not yet been provided.',
    'Spotify': 'ZOLV’s verified Spotify URL has not yet been provided.'
  };
  function showInfo(title) {
    const modal = document.querySelector('#site-dialog');
    const content = document.querySelector('#dialog-content');
    if (!modal || !content) return;
    const safeTitle = String(title).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    content.innerHTML = `<p class="dialog-eyebrow">ZOLV / WEBSITE PREVIEW</p><h2 class="dialog-heading" id="dialog-title">${safeTitle.toUpperCase()}</h2><p class="dialog-copy">${infoTexts[title] || 'More information will follow after brand confirmation.'}</p><p class="dialog-note">No external account, service or policy page is implied by this preview.</p>`;
    if (!modal.open) modal.showModal?.();
  }
  footer.querySelectorAll('[data-footer-info]').forEach(control => {
    control.addEventListener('click', () => showInfo(control.dataset.footerInfo));
  });
  footer.querySelectorAll('[data-footer-sku]').forEach(control => {
    control.addEventListener('click', () => {
      const name = control.dataset.footerSku;
      const original = [...document.querySelectorAll('[data-collection-sku]')].find(x => x.dataset.collectionSku === name);
      if (original) original.click();
      else document.querySelector('#collection')?.scrollIntoView({behavior:'smooth'});
    });
  });
  $('#zolv-footer-year').textContent = String(new Date().getFullYear());
  $('#zolv-footer-signup')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = $('#zolv-footer-email');
    const message = $('#zolv-footer-message');
    if (!email.checkValidity()) { email.reportValidity(); return; }
    // Let the existing, clearly-labelled local signup preview handle consent/data.
    // Do not pretend an email was sent or a subscriber was created.
    subscriptionTrigger?.click();
    const previewEmail = document.querySelector('#interest-email');
    if (previewEmail) previewEmail.value = email.value.trim();
    message.textContent = 'Signup preview opened. No email has been sent.';
  });
})();
