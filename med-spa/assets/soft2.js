/* Soft v2 (lite, Oct 11 4PM): no libraries, native scroll, nothing waits to appear.
   Keeps: headline swash + sparkles (CSS, plays once), heart/star burst when the before/after is finished (Web Animations). */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,CUTE=document.documentElement.getAttribute('data-soft')!=='calm';
  var sb=document.createElement('div');sb.className='sb';sb.setAttribute('aria-hidden','true');sb.innerHTML='<i></i><i></i><i></i>';document.body.prepend(sb);
  var STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0c.9 6.3 5.7 11.1 12 12-6.3.9-11.1 5.7-12 12-.9-6.3-5.7-11.1-12-12C6.3 11.1 11.1 6.3 12 0z"/></svg>';
  var HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2.2 0 3.6 1.2 4.4 2.5h3.2c.8-1.3 2.2-2.5 4.4-2.5 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21z"/></svg>';
  var h1=document.querySelector('.khero2 h1');
  if(h1&&!h1.querySelector('.h1sw')){var t=h1.textContent.trim(),m=t.match(/^(.*?)(\S+\s+\S+)$/);
    if(m){h1.textContent=m[1];var sw=document.createElement('span');sw.className='h1sw';sw.textContent=m[2];
      sw.insertAdjacentHTML('beforeend','<svg viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 20 C 70 6, 150 4, 296 14"/></svg>');h1.appendChild(sw);
      [['s1','-14px','-6px'],['s2','98%','-10px'],['s3','101%','62%']].forEach(function(p){var e=document.createElement('span');e.className='spk '+p[0];e.style.left=p[1];e.style.top=p[2];e.innerHTML=STAR;h1.appendChild(e)})}}
  var done=document.getElementById('kxDone'),kx=document.getElementById('kx');
  if(!done||!kx||RM||!Element.prototype.animate)return;
  var pal=['--hi','--s2d','--s3d','--L-acc'].map(function(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()});
  new MutationObserver(function(){if(done.hidden)return;var r=kx.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    for(var i=0;i<14;i++){var d=document.createElement('span');d.className='sburst';d.innerHTML=(CUTE&&i%3===0)?HEART:STAR;d.style.left=cx+'px';d.style.top=cy+'px';d.style.color=pal[i%4];document.body.appendChild(d);
      var a=Math.random()*Math.PI*2,dist=90+Math.random()*160,x=Math.cos(a)*dist,y=Math.sin(a)*dist-40;
      d.animate([{transform:'translate(-9px,-9px) scale(0)',opacity:1},{transform:'translate('+x+'px,'+y+'px) scale(1)',opacity:1,offset:.7},{transform:'translate('+x+'px,'+(y+30)+'px) scale(.8)',opacity:0}],{duration:1300,easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=(function(n){return function(){n.remove()}})(d)}
  }).observe(done,{attributes:true,attributeFilter:['hidden']});
})();
