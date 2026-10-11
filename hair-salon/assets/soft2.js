/* Soft v2 motion (Oct 11 test). GSAP + ScrollTrigger; Lenis on desktop only. Content is never hidden without JS. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(pointer:fine)').matches;
  /* background blobs */
  var sb=document.createElement('div');sb.className='sb';sb.setAttribute('aria-hidden','true');sb.innerHTML='<i></i><i></i><i></i>';document.body.prepend(sb);
  var STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0c.9 6.3 5.7 11.1 12 12-6.3.9-11.1 5.7-12 12-.9-6.3-5.7-11.1-12-12C6.3 11.1 11.1 6.3 12 0z"/></svg>';
  var HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2.2 0 3.6 1.2 4.4 2.5h3.2c.8-1.3 2.2-2.5 4.4-2.5 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21z"/></svg>';
  /* headline: swash under the last two words + sparkles */
  var h1=document.querySelector('.khero2 h1');
  if(h1&&!h1.querySelector('.h1sw')){
    var t=h1.textContent.trim(),m=t.match(/^(.*?)(\S+\s+\S+)$/);
    if(m){h1.innerHTML='';
      m[1].split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){h1.appendChild(document.createTextNode(w));return}var s=document.createElement('span');s.className='w';s.style.display='inline-block';s.textContent=w;h1.appendChild(s)});
      var sw=document.createElement('span');sw.className='h1sw';
      m[2].split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){sw.appendChild(document.createTextNode(w));return}var s=document.createElement('span');s.className='w';s.style.display='inline-block';s.textContent=w;sw.appendChild(s)});
      sw.insertAdjacentHTML('beforeend','<svg viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 20 C 70 6, 150 4, 296 14"/></svg>');
      h1.appendChild(sw);
      [['s1','-14px','-6px'],['s2','98%','-10px'],['s3','101%','62%']].forEach(function(p){var e=document.createElement('span');e.className='spk '+p[0];e.style.left=p[1];e.style.top=p[2];e.innerHTML=STAR;h1.appendChild(e)});
    }
  }
  /* squishy buttons (works without GSAP too) */
  document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('.btn,.kpick,.qi-main');if(!b||RM)return;b.style.transition='transform .12s';b.style.transform='scale(.95)'});
  ['pointerup','pointercancel','pointerleave'].forEach(function(ev){document.addEventListener(ev,function(e){var b=e.target.closest&&e.target.closest('.btn,.kpick,.qi-main');if(!b)return;b.style.transition='transform .55s cubic-bezier(.34,1.8,.5,1)';b.style.transform=''},true)});
  /* heart burst when the before/after is finished */
  function burst(el){if(RM||!window.gsap)return;var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    for(var i=0;i<16;i++){var d=document.createElement('span');d.className='sburst';d.innerHTML=i%3?STAR:HEART;d.style.left=cx+'px';d.style.top=cy+'px';d.style.color=['#E7A3AF','#E9C46A','#C9A7DD','#F2B8C0'][i%4];document.body.appendChild(d);
      var a=Math.random()*Math.PI*2,dist=90+Math.random()*170;
      gsap.fromTo(d,{x:-9,y:-9,scale:0,rotate:0,opacity:1},{x:Math.cos(a)*dist-9,y:Math.sin(a)*dist-40-9,scale:.6+Math.random()*.9,rotate:(Math.random()-.5)*180,duration:1.1+Math.random()*.5,ease:'power3.out',onComplete:(function(n){return function(){gsap.to(n,{opacity:0,y:'+=30',duration:.5,onComplete:function(){n.remove()}})}})(d)})}}
  var done=document.getElementById('kxDone'),kx=document.getElementById('kx');
  if(done&&kx)new MutationObserver(function(){if(!done.hidden)burst(kx)}).observe(done,{attributes:true,attributeFilter:['hidden']});
  if(RM||!window.gsap)return;
  if(window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
  /* Lenis: desktop only */
  if(FINE&&window.Lenis){var len=new Lenis({lerp:.11,smoothWheel:true});function raf(t){len.raf(t);requestAnimationFrame(raf)}requestAnimationFrame(raf);if(window.ScrollTrigger)len.on('scroll',ScrollTrigger.update)}
  /* hero entrance */
  var tl=gsap.timeline({defaults:{ease:'back.out(1.7)'}});
  tl.from('.khero2 h1 .w',{y:34,opacity:0,rotate:3,duration:.8,stagger:.055})
    .to('.h1sw path',{strokeDashoffset:0,duration:.9,ease:'power2.inOut'},'-=.35')
    .from('.spk',{scale:0,rotate:-90,duration:.6,stagger:.12},'-=.6')
    .from('.kqbook',{y:16,opacity:0,duration:.6},'-=.7')
    .from('#kx',{y:30,scale:.96,opacity:0,duration:.9,ease:'expo.out'},'-=.6')
    .from('.icard',matchMedia('(min-width:900px)').matches?{x:30,rotate:2,opacity:0,duration:.9}:{y:30,opacity:0,duration:.9},'-=.75');
  gsap.set('.h1sw path',{strokeDasharray:1,strokeDashoffset:1});
  document.querySelectorAll('.spk').forEach(function(s,i){gsap.to(s,{scale:.55,rotate:'+=45',opacity:.6,duration:1.3+i*.35,ease:'sine.inOut',yoyo:true,repeat:-1,delay:1.6+i*.3})});
  gsap.to('#kx',{y:-7,duration:3.2,ease:'sine.inOut',yoyo:true,repeat:-1,delay:1.8});
  if(!window.ScrollTrigger)return;
  /* scroll story: soft pop-ins */
  var kp=document.querySelectorAll('.kpick');kp.forEach(function(el){el.style.transition='none'});gsap.from(kp,{scrollTrigger:{trigger:'.kpicker',start:'top 88%'},y:22,scale:.9,opacity:0,duration:.7,stagger:.07,clearProps:'transform,opacity',onComplete:function(){kp.forEach(function(el){el.style.transition=''})}});
  ScrollTrigger.batch('.kcard',{start:'top 90%',onEnter:function(b){b.forEach(function(el){el.style.transition='none'});gsap.from(b,{y:36,scale:.96,opacity:0,duration:.8,stagger:.09,ease:'back.out(1.5)',clearProps:'transform,opacity',onComplete:function(){b.forEach(function(el){el.style.transition=''})}})},once:true});
  document.querySelectorAll('.sec h2').forEach(function(h){gsap.from(h,{scrollTrigger:{trigger:h,start:'top 90%'},y:24,opacity:0,duration:.8,ease:'expo.out'})});
  /* offer: checklist ticks in one by one, each with a little heart */
  var items=document.querySelectorAll('.offer li');
  if(items.length){gsap.from(items,{scrollTrigger:{trigger:items[0],start:'top 85%'},x:-24,opacity:0,duration:.6,stagger:.14,ease:'back.out(1.6)',onComplete:function(){}});
    items.forEach(function(li,i){var h=document.createElement('span');h.innerHTML=HEART;h.setAttribute('aria-hidden','true');h.style.cssText='display:inline-block;width:16px;height:16px;color:#E7A3AF;vertical-align:-2px;margin-right:6px';var b=li.querySelector('b');if(b)b.prepend(h);gsap.from(h,{scrollTrigger:{trigger:li,start:'top 86%'},scale:0,rotate:-40,duration:.6,delay:.25+i*.14,ease:'back.out(3)'})})}
  /* hero photo drifts slower than the page */
  gsap.to('#kx img',{yPercent:6,ease:'none',scrollTrigger:{trigger:'.khero2',start:'top top',end:'bottom top',scrub:true}});
})();
