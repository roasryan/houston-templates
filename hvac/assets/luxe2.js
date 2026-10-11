/* Luxe v2 motion (Oct 11). GSAP + ScrollTrigger; Lenis desktop only. Hero stays visible from the first frame. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(pointer:fine)').matches,$$=function(q){return document.querySelectorAll(q)};
  var lx=document.createElement('div');lx.className='lx';lx.setAttribute('aria-hidden','true');document.body.prepend(lx);
  /* card edge light follows the cursor */
  document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.kcard');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
  var kx=document.getElementById('kx');
  if(RM)return;
  if(kx){var sweep=function(){kx.classList.add('lx-swept')};var im=kx.querySelector('img');if(im&&!im.complete)im.addEventListener('load',sweep,{once:true});else setTimeout(sweep,200)}
  /* magnetic main buttons (desktop) */
  if(FINE)$$('.khero2 .btn-main,.icard .btn-main,.band .btn-main').forEach(function(b){
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.12)+'px,'+((e.clientY-r.top-r.height/2)*.22)+'px)'});
    b.addEventListener('pointerleave',function(){b.style.transform=''})});
  if(!window.gsap)return;
  if(window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
  if(FINE&&window.Lenis){var len=new Lenis({lerp:.1,smoothWheel:true});(function raf(t){len.raf(t);requestAnimationFrame(raf)})(0);if(window.ScrollTrigger)len.on('scroll',ScrollTrigger.update)}
  /* headline: words rise out of a soft blur */
  var h1=document.querySelector('.khero2 h1');
  if(h1&&!h1.querySelector('.w')){var parts=h1.textContent.trim().split(/(\s+)/);h1.textContent='';parts.forEach(function(w){if(/^\s+$/.test(w)){h1.appendChild(document.createTextNode(w));return}var s=document.createElement('span');s.className='w';s.style.display='inline-block';s.textContent=w;h1.appendChild(s)})}
  if($$('.khero2 h1 .w').length){
    var tl=gsap.timeline({defaults:{ease:'expo.out'}});
    tl.from('.khero2 h1 .w',{y:22,opacity:.2,filter:'blur(6px)',duration:1,stagger:.05,clearProps:'filter'})
      .from('.kqbook',{y:12,duration:.8},.2);
    if(kx)tl.from(kx,{y:20,scale:.985,duration:1.1},0);
    if($$('.icard').length)tl.from('.icard',{y:18,duration:1},.1);
  }
  if(!window.ScrollTrigger)return;
  if(kx)gsap.to(kx.querySelectorAll('img'),{yPercent:5,scale:1.04,ease:'none',scrollTrigger:{trigger:kx,start:'top 20%',end:'bottom top',scrub:true}});
  var kp=$$('.kpick');if(kp.length){kp.forEach(function(e){e.style.transition='none'});gsap.from(kp,{scrollTrigger:{trigger:kp[0],start:'top 92%'},y:16,opacity:0,duration:.7,stagger:.05,ease:'power3.out',clearProps:'transform,opacity',onComplete:function(){kp.forEach(function(e){e.style.transition=''})}})}
  $$('.sec h2').forEach(function(h){gsap.from(h,{scrollTrigger:{trigger:h,start:'top 90%'},y:22,opacity:0,filter:'blur(4px)',duration:1,ease:'expo.out',clearProps:'filter'})});
  if($$('.kcard').length)ScrollTrigger.batch('.kcard',{start:'top 92%',once:true,onEnter:function(b){b.forEach(function(e){e.style.transition='none'});gsap.from(b,{y:28,opacity:0,duration:.9,stagger:.08,ease:'expo.out',clearProps:'transform,opacity',onComplete:function(){b.forEach(function(e){e.style.transition=''})}})}});
  var ol=$$('.offer .ostack li, .offer .guar>*');if(ol.length)gsap.from(ol,{scrollTrigger:{trigger:ol[0],start:'top 88%'},x:-18,opacity:0,duration:.8,stagger:.1,ease:'expo.out'});
  var st=$$('.steps li');if(st.length)gsap.from(st,{scrollTrigger:{trigger:st[0],start:'top 88%'},y:20,opacity:0,duration:.8,stagger:.12,ease:'expo.out'});
})();
