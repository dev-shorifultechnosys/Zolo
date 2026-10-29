/* ZOLV V15 / Section 07 — original photo stories + moving rating-style wall.
   No 5TRIP video playback, fabricated customer reviews, tracking or libraries. */
(()=>{'use strict';
  const section=document.querySelector('#community');if(!section)return;
  const track=section.querySelector('#community-track');
  const cards=[...section.querySelectorAll('[data-community-card]')];
  const prev=section.querySelector('#community-prev');const next=section.querySelector('#community-next');
  const counter=section.querySelector('#community-counter');
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  const descriptions=[
    ['The everyday reset','Wellness wherever the day begins.'],
    ['Find your focus','Made for days that keep moving.'],
    ['Take it with you','Your routine has no fixed address.'],
    ['Make every moment count','Out late. Living fully.'],
    ['Your own pace','Everyday wellness, your way.']
  ];
  const dialog=document.querySelector('#community-photo-dialog');
  const dialogImg=document.querySelector('#community-photo-image');
  const dialogTitle=document.querySelector('#community-photo-title');
  const dialogDesc=document.querySelector('#community-photo-description');
  const close=document.querySelector('#community-photo-close');
  let current=0,stops=[0],scrollFrame=0,lastOpener=null;
  function recompute(){
    const max=Math.max(0,track.scrollWidth-track.clientWidth);
    const step=cards[1]?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;
    const values=[0];
    if(step>1){while(values.at(-1)+step<max-step*.35)values.push(values.at(-1)+step)}
    if(max>2&&Math.abs(max-values.at(-1))>2)values.push(max);
    stops=values;
  }
  function select(i,doScroll=true){
    current=Math.max(0,Math.min(i,stops.length-1));
    counter.textContent=`${String(current+1).padStart(2,'0')} / ${String(stops.length).padStart(2,'0')}`;
    prev.disabled=current===0;next.disabled=current===stops.length-1;
    if(doScroll)track.scrollTo({left:stops[current],behavior:reduced.matches?'instant':'smooth'});
  }
  prev.addEventListener('click',()=>select(current-1));
  next.addEventListener('click',()=>select(current+1));
  track.addEventListener('keydown',e=>{
    if(e.target.closest('button'))return;
    if(e.key==='ArrowRight'){e.preventDefault();select(current+1)}
    if(e.key==='ArrowLeft'){e.preventDefault();select(current-1)}
  });
  track.addEventListener('scroll',()=>{
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{
      scrollFrame=0;
      let n=0,d=Infinity;
      stops.forEach((x,i)=>{const dist=Math.abs(x-track.scrollLeft);if(dist<d){n=i;d=dist}});
      select(n,false);
    });
  },{passive:true});
  function openStory(i,opener){
    lastOpener=opener||null;
    dialogImg.src=cards[i].querySelector('.community-card__photo').currentSrc || cards[i].querySelector('.community-card__photo').src;
    dialogImg.alt=`ZOLV lifestyle photo: ${descriptions[i][0]}`;
    dialogTitle.textContent=descriptions[i][0];
    dialogDesc.textContent=descriptions[i][1]+' Photo story preview — no video playback.';
    if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');
  }
  section.querySelectorAll('[data-community-open]').forEach(btn=>btn.addEventListener('click',()=>openStory(Number(btn.dataset.communityOpen),btn)));
  close.addEventListener('click',()=>dialog.close?dialog.close():dialog.removeAttribute('open'));
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>{if(lastOpener)lastOpener.focus({preventScroll:true})});
  section.querySelector('#community-watch-first').addEventListener('click',()=>{
    select(0);openStory(0,section.querySelector('#community-watch-first'));
  });
  document.querySelectorAll('[data-action="community"]').forEach(button=>button.addEventListener('click',()=>{
    section.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});
    const menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('#menu-toggle');
    if(menu&&toggle){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation menu')}
  }));
  recompute();select(0,false);
  window.addEventListener('resize',()=>{recompute();select(Math.min(current,stops.length-1),false)},{passive:true});

  // Interactive demo rating, held only in DOM state; no network, backend, tracking or persistence.
  const ratingButtons=[...section.querySelectorAll('[data-preview-rating]')];
  const ratingFeedback=section.querySelector('#community-rating-feedback');
  const ratingScore=section.querySelector('#community-rating-score');
  ratingButtons.forEach(button=>button.addEventListener('click',()=>{
    const value=Number(button.dataset.previewRating);
    ratingButtons.forEach(star=>{
      const current=Number(star.dataset.previewRating);
      star.classList.toggle('is-active',current<=value);
      star.setAttribute('aria-pressed',String(current===value));
    });
    ratingScore.textContent='';
    ratingScore.append(document.createTextNode(String(value)));
    const denominator=document.createElement('small');
    denominator.textContent=' / 5';
    ratingScore.append(denominator);
    ratingFeedback.textContent=`Demo selection: ${value} / 5. Not sent, stored, or counted as a real review.`;
  }));

  // Seamless auto-moving photo cards in previously blank lower-right space.
  const belt=section.querySelector('#community-wall-belt');
  const group=section.querySelector('#community-wall-original');
  const wall=section.querySelector('.community-wall');
  const pauseButton=section.querySelector('#community-wall-toggle');
  if(belt&&group){
    const copy=group.cloneNode(true);copy.removeAttribute('id');copy.setAttribute('aria-hidden','true');
    belt.appendChild(copy);
  }
  function setPaused(value){
    wall.classList.toggle('is-paused',value);
    pauseButton.setAttribute('aria-pressed',String(value));
    pauseButton.innerHTML=value?'RESUME MOTION <span aria-hidden="true">▶</span>':'PAUSE MOTION <span aria-hidden="true">Ⅱ</span>';
  }
  pauseButton.addEventListener('click',()=>setPaused(!wall.classList.contains('is-paused')));
  if(reduced.matches)setPaused(true);
  reduced.addEventListener?.('change',e=>setPaused(e.matches));
})();
