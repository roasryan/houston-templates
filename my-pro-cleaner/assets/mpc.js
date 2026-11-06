(function(){
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  // menu drawer
  const dr=$('#drawer'),mb=$('#menuBtn');
  if(dr&&mb){
    const setD=o=>{dr.classList.toggle('open',o);dr.setAttribute('aria-hidden',!o);mb.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
    mb.onclick=()=>setD(true);
    dr.addEventListener('click',e=>{if(e.target.closest('[data-close]')||e.target.closest('a'))setD(false)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setD(false)});
  }
  // commercial proposal form (demo)
  const cf=$('#cform');
  if(cf)cf.addEventListener('submit',e=>{e.preventDefault();cf.querySelector('.cdone').hidden=false;cf.querySelector('button[type=submit]').disabled=true;});
  // price estimator + booking (home only)
  const out=$('.step output'); if(!out)return;
  const RATE_ROOM=80, RATE_TILE=1;
  let rooms=+out.textContent||1;
  $$('.step button').forEach((b,i)=>b.onclick=()=>{rooms=Math.max(0,Math.min(12,rooms+(i?1:-1)));out.textContent=rooms;calc();});
  $('#tile').oninput=calc;
  $$('#extras input,#addons input').forEach(i=>i.onchange=calc);
  const money=n=>'$'+n.toLocaleString();
  function calc(){
    const tile=Math.max(0,+$('#tile').value||0);
    const c=rooms*RATE_ROOM, t=Math.round(tile*RATE_TILE);
    const ex=$$('#extras input:checked').map(i=>i.value), ad=$$('#addons input:checked').map(i=>i.value);
    const L=[];
    if(rooms)L.push([rooms+' carpeted room'+(rooms>1?'s':''),money(c)]);
    if(tile)L.push([tile+' sq ft tile & grout',money(t)]);
    ex.forEach(e=>L.push([e,'on site']));ad.forEach(a=>L.push([a,'ask']));
    $('#lines').innerHTML=L.length?L.map(l=>`<li><span>${l[0]}</span><span>${l[1]}</span></li>`).join(''):'<li><span>Pick a service</span><span>—</span></li>';
    const tot=c+t;$('#tot').textContent=tot?money(tot)+(ex.length?'+':''):(ex.length?'On site':'$0');
    window.__est={tot,lines:L};
  }
  calc();
  const bk=window.bk=$('#bk'); if(!bk)return;
  const days=$('#days'),now=new Date();
  for(let d=1,n=0;n<10;d++){const x=new Date(now);x.setDate(now.getDate()+d);if(x.getDay()===0)continue;n++;
    const b=document.createElement('button');b.type='button';b.innerHTML=x.toLocaleDateString('en-US',{weekday:'short'})+'<b>'+x.getDate()+'</b>';b.onclick=()=>{$$('#days button').forEach(z=>z.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true')};days.appendChild(b);}
  $$('#slots button').forEach(b=>b.onclick=()=>{$$('#slots button').forEach(z=>z.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true')});
  $('#bookBtn').onclick=()=>{const e=window.__est;$('#bkSum').textContent='Estimate '+$('#tot').textContent+' · '+(e.lines.map(l=>l[0]).join(', ')||'Choose services first');$('#bkForm').hidden=false;$('#bkDone').hidden=true;bk.showModal();};
  $('#send').onclick=()=>{if(!$('#fName').value||!$('#fPhone').value){$('#fName').reportValidity();$('#fPhone').reportValidity();return}$('#bkForm').hidden=true;$('#bkDone').hidden=false;};
})();
// review platform filter
document.querySelectorAll('.rtabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.rtabs button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));
  const f=b.dataset.f;document.querySelectorAll('#revlist .rv').forEach(r=>{r.hidden=!(f==='all'||r.dataset.src===f)});
}));
// ---- review links + swipe deck ----
(function(){
  const URLS={google:'https://www.google.com/maps/search/?api=1&query=My+Pro+Cleaner+26119+Interstate+45+N+Spring+TX',yelp:'https://www.yelp.com/biz/my-pro-cleaner-spring-2',facebook:'https://www.facebook.com/myprocleaner/reviews'};
  const NAMES={google:'Google',yelp:'Yelp',facebook:'Facebook'};
  const plat=rv=>rv.dataset.src||((rv.querySelector('.src')||{}).textContent||'').split(' ')[0].toLowerCase();
  function linkify(rv){const p=plat(rv);if(!URLS[p]||rv.dataset.linked)return;rv.dataset.linked=1;rv.dataset.src=p;rv.classList.add('rv-click');rv.tabIndex=0;rv.setAttribute('role','link');rv.setAttribute('aria-label','Read this review on '+NAMES[p]);
    const a=document.createElement('a');a.className='rv-open';a.href=URLS[p];a.target='_blank';a.rel='noopener';a.textContent='Read on '+NAMES[p]+' ↗';a.tabIndex=-1;rv.appendChild(a);
    rv.addEventListener('click',e=>{if(e.target.closest('a'))return;if(rv.closest('.deck'))return;window.open(URLS[p],'_blank','noopener')});
    rv.addEventListener('keydown',e=>{if(e.key==='Enter')window.open(URLS[p],'_blank','noopener')});}
  document.querySelectorAll('.rv').forEach(linkify);
  document.querySelectorAll('[data-deck]').forEach(mount=>{
    const src=[...document.querySelectorAll(mount.dataset.deck+' .rv')];if(!src.length)return;
    const cards=src.map(r=>{const c=r.cloneNode(true);c.removeAttribute('hidden');c.classList.add('dcard');c.removeAttribute('role');c.removeAttribute('tabindex');return c});
    mount.innerHTML='<div class="deck-stack" aria-live="polite"></div><div class="deck-ctl"><button type="button" class="deck-b" data-d="-1" aria-label="Previous review">‹</button><span class="deck-n"></span><button type="button" class="deck-b" data-d="1" aria-label="Next review">›</button></div><p class="deck-hint">Swipe for the next review. Tap one to read it where it was posted.</p>';
    const stack=mount.querySelector('.deck-stack'),num=mount.querySelector('.deck-n');let i=0,busy=false;
    function render(){stack.innerHTML='';for(let k=2;k>=0;k--){const c=cards[(i+k)%cards.length];c.style.transition='none';c.style.transform=`translateY(${k*12}px) scale(${1-k*.04})`;c.style.opacity=k==2?.5:1;c.style.zIndex=10-k;stack.appendChild(c)}num.textContent=(i+1)+' / '+cards.length;const top=stack.lastChild;top.style.height='';top.classList.remove('dback');const h=top.offsetHeight;[...stack.children].forEach(c=>{if(c!==top){c.style.height=h+'px';c.classList.add('dback')}});stack.style.height=h+34+'px';bind(top)}
    function go(d,fly){if(busy)return;busy=true;const top=stack.lastChild;const dir=fly||d;top.style.transition='transform .3s ease, opacity .3s';top.style.transform=`translateX(${dir*130}%) rotate(${dir*18}deg)`;top.style.opacity=0;setTimeout(()=>{i=(i+(d>0?1:-1)+cards.length)%cards.length;busy=false;render()},280)}
    function bind(c){let x0=null,dx=0,id=null;
      c.onpointerdown=e=>{if(e.target.closest('a'))return;x0=e.clientX;dx=0;id=e.pointerId;c.setPointerCapture(id);c.style.transition='none'};
      c.onpointermove=e=>{if(x0===null)return;dx=e.clientX-x0;c.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`};
      c.onpointerup=c.onpointercancel=e=>{if(x0===null)return;x0=null;
        if(Math.abs(dx)>80)go(1,Math.sign(dx));
        else if(Math.abs(dx)<6&&e.type==='pointerup'){c.style.transform='';window.open(URLS[c.dataset.src],'_blank','noopener')}
        else{c.style.transition='transform .25s';c.style.transform=''}}}
    mount.querySelectorAll('.deck-b').forEach(b=>b.onclick=()=>go(+b.dataset.d));
    render();addEventListener('resize',()=>{if(!busy)render()});
  });
})();
