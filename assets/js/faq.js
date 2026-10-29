/* ZOLV V21 FAQ — native HTML details with minimal JS enhancement. */
(() => {
  'use strict';
  const section = document.querySelector('[data-faq-section]');
  if (!section) return;
  const items = [...section.querySelectorAll('[data-faq-item]')];
  const viewAll = document.getElementById('faq-view-all');
  const label = viewAll?.querySelector('.faq__cta-text');
  const extraItems = items.filter(el => el.classList.contains('faq__item--extra'));

  // Users can open by click, touch, Space or Enter via native <summary>.
  // Keep a single answer open, so the component never becomes unwieldy.
  items.forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    items.forEach(other => { if (other !== item) other.open = false; });
  }));

  viewAll?.addEventListener('click', () => {
    const expanded = section.dataset.showAll === 'true';
    section.dataset.showAll = String(!expanded);
    viewAll.setAttribute('aria-expanded', String(!expanded));
    if (label) label.textContent = expanded ? 'VIEW ALL FAQS' : 'SHOW TOP QUESTIONS';
    if (expanded) {
      extraItems.forEach(item => { item.open = false; });
    } else {
      // Opening more FAQs is a real action; scrolling preserves a useful
      // view of the newly revealed items on shorter screens.
      extraItems[0]?.scrollIntoView?.({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
  });
})();
