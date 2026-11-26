/* Luxe v2 (lite, Oct 11 4PM): no libraries, native scroll, nothing waits to appear.
   Keeps: one light sweep across the hero photo (CSS), card edges that light up under the cursor. */
(function(){
  var lx=document.createElement('div');lx.className='lx';lx.setAttribute('aria-hidden','true');document.body.prepend(lx);
  var kx=document.getElementById('kx');
  if(kx&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var im=kx.querySelector('img'),go=function(){kx.classList.add('lx-swept')};if(im&&!im.complete)im.addEventListener('load',go,{once:true});else go()}
  if(matchMedia('(pointer:fine)').matches)document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.kcard');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
})();
