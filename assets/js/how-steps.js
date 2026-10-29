/* ZOLV V18 / Section 06: demonstration CTA links to existing brand film.
   Separate file to keep earlier approved interactions untouched. */
(()=>{
  const cta = document.getElementById('steps-watch-film');
  if (!cta) return;
  cta.addEventListener('click',()=>{
    const section=document.getElementById('film');
    const video=document.getElementById('brand-film');
    section?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    if(video){ video.controls = true; video.muted = true; const result=video.play(); if(result?.catch) result.catch(()=>{}); }
  });
})();
