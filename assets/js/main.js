/* ========================================================================
   ZOLV — Section 01 (header / hero) interactions
   Plain ES6 JavaScript. No dependencies, hidden services or network calls.
   All commerce interactions are previews until a real backend is configured.
   ======================================================================== */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const dialog = $('#site-dialog');
  const content = $('#dialog-content');
  const mobileToggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const bagBadge = $('#bag-badge');

  // Demo bag data deliberately does NOT include pricing, checkout or real orders.
  let bag = [];
  try { bag = JSON.parse(sessionStorage.getItem('zolv-demo-bag') || '[]'); } catch { bag = []; }
  if (!Array.isArray(bag)) bag = [];

  const collection = ['Energy', 'Sleep', 'Focus', 'NAD+'];
  // Marquee product names are intentionally restricted to the client's four SKUs.
  const marquee = $('.gallery-marquee');
  const marqueeToggle = $('#marquee-toggle');
  const marqueeTrack = $('#gallery-track');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function openDialog(html) {
    closeMobileMenu();
    content.innerHTML = html;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function closeDialog() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }
  function closeMobileMenu() {
    mobileMenu.hidden = true;
    mobileToggle.setAttribute('aria-expanded','false');
    mobileToggle.setAttribute('aria-label','Open navigation menu');
  }
  function saveBag() {
    bagBadge.textContent = String(bag.length);
    $('.cart-trigger').setAttribute('aria-label', `Open bag, ${bag.length} item${bag.length === 1 ? '' : 's'}`);
    try { sessionStorage.setItem('zolv-demo-bag', JSON.stringify(bag)); } catch {}
  }

  function collectionDialog() {
    openDialog($('#tpl-collection').innerHTML);
    $$('.sku-grid [data-sku]',content).forEach(button => button.addEventListener('click', () => skuDialog(button.dataset.sku)));
  }
  function skuDialog(name) {
    const label = collection.includes(name) ? name : 'Energy';
    const productSlug = label === 'NAD+' ? 'nad' : label.toLowerCase();
    openDialog(`<p class="dialog-eyebrow">ZOLV / COLLECTION PREVIEW</p>
      <h2 id="dialog-title" class="dialog-heading">${escapeHTML(label.toUpperCase())}</h2>
      <div class="dialog-packaging-pair dialog-packaging-pair--unified">
        <img class="dialog-product-art dialog-product-art--unified"
             src="assets/images/products/pair-${productSlug}-1x.webp"
             srcset="assets/images/products/pair-${productSlug}-1x.webp 1x, assets/images/products/pair-${productSlug}-2x.webp 2x"
             alt="ZOLV ${escapeHTML(label)} matching carton and individually wrapped sachet packaging concept"
             loading="eager" decoding="async">
      </div>
      <p class="dialog-copy">A pocket-size flip-top carton concept planned for 30 individually wrapped oral dissolving strips. Final physical capacity is unverified.</p>
      <span class="small-pill">30 individually wrapped strips</span><span class="small-pill">Pocket-size carton</span>
      <div><button class="dialog-submit" data-add="${escapeHTML(label)}" type="button">ADD TO DEMO BAG →</button></div>
      <p class="dialog-note">Design preview only. Actual ingredients, approved product claims, pricing and checkout have not been supplied.</p>`);
    $('[data-add]',content).addEventListener('click',() => {
      bag.push(label); saveBag(); bagDialog();
    });
  }
  function bagDialog() {
    const items = bag.map((item,i)=>`<div class="cart-line"><span>${escapeHTML(item.toUpperCase())} — preview carton</span><button type="button" data-remove="${i}" aria-label="Remove ${escapeHTML(item)}">×</button></div>`).join('');
    openDialog(`<p class="dialog-eyebrow">ZOLV / BAG PREVIEW</p><h2 id="dialog-title" class="dialog-heading">YOUR BAG (${bag.length})</h2>
      ${bag.length ? `<div class="list-results">${items}</div>` : '<p class="dialog-copy">Your demo bag is empty. Explore the collection to add a concept product.</p>'}
      <button type="button" class="dialog-submit" id="back-to-shop">EXPLORE COLLECTION →</button>
      <p class="dialog-note">This is a local design prototype, not an e-commerce checkout. No order, payment or pricing is collected.</p>`);
    $('#back-to-shop',content).addEventListener('click',collectionDialog);
    $$('[data-remove]',content).forEach(btn => btn.addEventListener('click',()=>{bag.splice(Number(btn.dataset.remove),1);saveBag();bagDialog();}));
  }
  function howDialog() {
    openDialog(`<p class="dialog-eyebrow">THE ZOLV RITUAL</p>
      <h2 id="dialog-title" class="dialog-heading">THREE SIMPLE <em>STEPS.</em></h2>
      <div class="sku-grid"><div class="small-pill" style="display:block;padding:20px"><b>01 / PEEL</b><p>Open an individually wrapped oral film.</p></div><div class="small-pill" style="display:block;padding:20px"><b>02 / PLACE</b><p>Place the strip on your tongue.</p></div><div class="small-pill" style="display:block;padding:20px"><b>03 / DISSOLVE</b><p>Allow the film to dissolve.</p></div></div>
      <p class="dialog-note">Directions shown are concept copy. Final usage directions must follow each product's approved label.</p>`);
  }
  function storyDialog() {
    openDialog(`<p class="dialog-eyebrow">THE ZOLV WORLD</p><h2 id="dialog-title" class="dialog-heading">BIG BENEFITS.<br><em>TINY STRIP.</em></h2>
      <p class="dialog-copy">ZOLV imagines a more portable everyday wellness ritual: thin, individually wrapped films that fit into the moments that make up your day.</p>
      <p class="dialog-note">Brand storytelling copy is proposed for review; it is not a verified product claim.</p>`);
  }
  function reviewsDialog() {
    openDialog(`<p class="dialog-eyebrow">THE COMMUNITY</p><h2 id="dialog-title" class="dialog-heading">REAL STORIES <em>COMING SOON.</em></h2>
      <p class="dialog-copy">The source screenshot includes a Reviews menu. Verified customer testimonials have not yet been provided, so we have deliberately not invented ratings or quotes.</p>`);
  }
  function accountDialog() {
    openDialog(`<p class="dialog-eyebrow">YOUR ZOLV</p><h2 id="dialog-title" class="dialog-heading">ACCOUNT <em>PREVIEW.</em></h2>
      <p class="dialog-copy">Member accounts will become available after the website is connected to its e-commerce system. This prototype does not create or store passwords.</p>`);
  }
  function subscribeDialog() {
    openDialog(`<p class="dialog-eyebrow">ZOLV / GET UPDATES</p><h2 id="dialog-title" class="dialog-heading">BE FIRST TO <em>KNOW.</em></h2>
      <p class="dialog-copy">Stay close to upcoming ZOLV news and product drops. This form demonstrates the experience; a real mailing list is not connected yet.</p>
      <form id="interest-form"><label for="interest-email">Email address</label><input class="dialog-input" id="interest-email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required>
      <button class="dialog-submit" type="submit">SAVE INTEREST LOCALLY →</button></form>
      <p id="interest-result" role="status"></p><p class="dialog-note">Demo mode: email is saved only in this browser session, not sent to any server.</p>`);
    $('#interest-form',content).addEventListener('submit',(event)=>{
      event.preventDefault();
      const email = $('#interest-email',content).value.trim();
      if (!email) return;
      try { sessionStorage.setItem('zolv-demo-interest',email); } catch {}
      $('#interest-result',content).innerHTML='<p class="success-text">Interest saved in this browser preview. No message has been sent.</p>';
      $('#interest-form',content).reset();
    });
  }

  // SECTION 05 — Ingredient educational preview using proposed packaging
  // copy only; no unsupported medical outcomes or clinical substantiation.
  const ingredientEntries = {
    b12: ['VITAMIN B12','ENERGY'],taurine:['TAURINE','ENERGY'],
    melatonin:['MELATONIN','SLEEP'],theanine:['L-THEANINE','SLEEP'],
    tyrosine:['L-TYROSINE','FOCUS'],resveratrol:['RESVERATROL','NAD+']
  };
  function ingredientsDialog(active='') {
    const details = [
      ['ENERGY','B12 • Taurine • Caffeine'],
      ['SLEEP','Melatonin • L-Theanine • GABA'],
      ['FOCUS','L-Tyrosine • B vitamins; remaining ingredients under review'],
      ['NAD+','Nicotinamide riboside • Resveratrol']
    ];
    const selected = ingredientEntries[active];
    openDialog(`<p class="dialog-eyebrow">BEHIND THE STRIP / INGREDIENTS</p>
      <h2 id="dialog-title" class="dialog-heading">PURPOSEFUL <em>INGREDIENTS.</em></h2>
      ${selected ? `<p class="dialog-copy"><strong>${escapeHTML(selected[0])}</strong> is shown in the proposed ${escapeHTML(selected[1])} packaging concept.</p>` : '<p class="dialog-copy">Explore the ingredients shown in the current design concepts for ZOLV’s four oral-film formulas.</p>'}
      <div class="formula-guide">${details.map(([name,copy])=>`<div class="formula-guide__item"><strong>${escapeHTML(name)}</strong><span>${escapeHTML(copy)}</span></div>`).join('')}</div>
      <p class="dialog-note">CONCEPT ONLY — Ingredient lists are not approved. Focus carton artwork currently conflicts across versions (Alpha GPC, L-Theanine and Lion's Mane appear in different designs); final composition, dosages, claims, warnings and legal text must be approved before packaging or sale.</p>`);
  }

  function searchDialog() {
    openDialog(`<p class="dialog-eyebrow">SEARCH THE COLLECTION</p><h2 id="dialog-title" class="dialog-heading">FIND YOUR <em>ZOLV.</em></h2>
      <label for="search-products">Search by formula</label><input class="dialog-input" id="search-products" type="search" placeholder="Energy, Sleep, Focus, NAD+" autocomplete="off">
      <div class="list-results" id="search-results" aria-live="polite"></div>`);
    const input=$('#search-products',content), results=$('#search-results',content);
    function update() {
      const matches=collection.filter(x=>x.toLowerCase().includes(input.value.trim().toLowerCase()));
      results.innerHTML=matches.length ? matches.map(x=>`<button type="button" data-result="${escapeHTML(x)}">${escapeHTML(x)} <span>↗</span></button>`).join('') : '<p>No matching formula found.</p>';
      $$('[data-result]',results).forEach(btn=>btn.addEventListener('click',()=>skuDialog(btn.dataset.result)));
    }
    input.addEventListener('input',update);update(); input.focus();
  }
  // Accessible pause/resume control. CSS handles all movement without a JS animation loop.
  function setMarqueePaused(paused) {
    marquee.dataset.paused = String(paused);
    // Pause the live Animation as well as the CSS play-state.
    marqueeTrack.style.animationPlayState = paused ? 'paused' : 'running';
    marqueeTrack.getAnimations?.().forEach(animation => {
      if (paused && animation.playState === 'running') animation.pause();
      if (!paused && animation.playState === 'paused') animation.play();
    });
    marqueeToggle.setAttribute('aria-pressed', String(paused));
    marqueeToggle.setAttribute('aria-label', paused ? 'Resume product scrolling' : 'Pause product scrolling');
    marqueeToggle.title = paused ? 'Resume product scrolling' : 'Pause product scrolling';
  }
  // Use product quick view on each moving card. Duplicated cards can be mouse-clicked,
  // but remain out of keyboard accessibility order so they are not announced twice.
  marquee.addEventListener('click', (event) => {
    const product = event.target.closest('[data-gallery-product]');
    if (product) skuDialog(product.dataset.galleryProduct);
  });
  marqueeToggle.addEventListener('click', () => setMarqueePaused(marquee.dataset.paused !== 'true'));
  // Respect users who request reduced motion, including changes made while open.
  setMarqueePaused(reducedMotion.matches);
  reducedMotion.addEventListener?.('change', event => setMarqueePaused(event.matches));


  const modes = {shop:collectionDialog,how:howDialog,story:storyDialog,reviews:reviewsDialog,account:accountDialog,bag:bagDialog,subscribe:subscribeDialog,search:searchDialog,ingredients:ingredientsDialog};
  $$('[data-dialog]').forEach(button => button.addEventListener('click',()=>modes[button.dataset.dialog]?.()));
  // Primary navigation stays on-page. Quick views and demo bag remain separate actions.
  function goToSection(id) {
    closeMobileMenu();
    const target=document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});
  }
  $$('[data-action="shop"]').forEach(button => button.addEventListener('click', () => goToSection('collection')));
  $$('[data-action="learn"]').forEach(button => button.addEventListener('click', () => goToSection('how-it-works')));
  $$('[data-action="story"]').forEach(button => button.addEventListener('click', () => goToSection('story')));
  $$('[data-action="lifestyle"]').forEach(button => button.addEventListener('click', () => goToSection('lifestyle')));
  // Each ingredient callout opens the real local formula information dialog.
  $$('[data-ingredient]').forEach(button=>button.addEventListener('click',()=>ingredientsDialog(button.dataset.ingredient)));

  mobileToggle.addEventListener('click',()=>{
    const opening=mobileMenu.hidden;
    mobileMenu.hidden=!opening;
    mobileToggle.setAttribute('aria-expanded',String(opening));
    mobileToggle.setAttribute('aria-label',opening?'Close navigation menu':'Open navigation menu');
  });
  $('#dialog-close').addEventListener('click',closeDialog);
  dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden)closeMobileMenu();});
  document.addEventListener('click',event=>{
    if(!mobileMenu.hidden&&!event.target.closest('#mobile-menu')&&!event.target.closest('#menu-toggle'))closeMobileMenu();
  });

  // V33: Collection uses four supplied single-carton cutouts.
  // Product dialogs use four unified, matching carton+sachet cutout artworks.
  $$('[data-collection-sku]').forEach(button => {
    button.addEventListener('click', () => skuDialog(button.dataset.collectionSku));
  });

  saveBag();
})();
