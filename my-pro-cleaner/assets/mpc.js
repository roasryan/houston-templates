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
  $('#send').onclick=()=>{if(!$('#fName').value||!$('#fPhone').value){$('#fName').reportValidity();$('#fPhone').reportValidity();return}$('#bkForm').hidden=true;$('#bkDone').hidden=false;try{const e=window.__est||{lines:[]};const L=JSON.parse(localStorage.getItem('mpc_bookings')||'[]');L.push({n:$('#fName').value.trim().split(/\s+/)[0],svc:(e.lines[0]?e.lines[0][0].toLowerCase():'a cleaning'),t:new Date().toISOString()});localStorage.setItem('mpc_bookings',JSON.stringify(L.slice(-20)))}catch(err){}};
})();
// review platform filter
document.querySelectorAll('.rtabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.rtabs button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));
  const f=b.dataset.f;document.querySelectorAll('#revlist .rv').forEach(r=>{r.hidden=!(f==='all'||r.dataset.src===f)});
}));
// ---- review links, swipe deck, load more ----
(function(){
  const URLS={google:'https://www.google.com/maps/search/?api=1&query=My+Pro+Cleaner+26119+Interstate+45+N+Spring+TX',yelp:'https://www.yelp.com/biz/my-pro-cleaner-spring-4',facebook:'https://www.facebook.com/myprocleaner/reviews'};
  const NAMES={google:'Google',yelp:'Yelp',facebook:'Facebook'};
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const plat=rv=>rv.dataset.src||((rv.querySelector('.src')||{}).textContent||'').split(' ')[0].toLowerCase();
  const open=u=>window.open(u,'_blank','noopener');
  function linkify(rv){const p=plat(rv);if(!URLS[p]||rv.dataset.linked)return;rv.dataset.linked=1;rv.dataset.src=p;const U=rv.dataset.url||URLS[p];
    rv.classList.add('rv-click');rv.tabIndex=0;rv.setAttribute('role','link');rv.setAttribute('aria-label','Read this review on '+NAMES[p]);
    const a=document.createElement('a');a.className='rv-open';a.href=U;a.target='_blank';a.rel='noopener';a.tabIndex=-1;a.textContent=(rv.dataset.url?'See this review on ':'Read on ')+NAMES[p]+' ↗';rv.appendChild(a);
    rv.addEventListener('click',e=>{if(e.target.closest('a')||rv.closest('.deck'))return;open(U)});
    rv.addEventListener('keydown',e=>{if(e.key==='Enter')open(U)});}
  function card(x){const ini=x.n.replace(/\./g,'').split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
    const top=x.s==='facebook'?'<div class="rec">Recommends</div>':`<div class="stars" aria-label="${x.r} out of 5 stars">${'★'.repeat(x.r)}<span class="soff">${'★'.repeat(5-x.r)}</span></div>`;
    const d=document.createElement('div');d.className='rv';d.dataset.src=x.s;d.dataset.url=x.u;
    d.innerHTML=`${top}<p>“${esc(x.q)}”</p><div class="who"><div class="av">${esc(ini)}</div><b>${esc(x.n)}</b><span class="src">${NAMES[x.s]}</span></div>`;linkify(d);return d}
  document.querySelectorAll('.rv').forEach(linkify);
  // feed for "load more"
  let feed=null;const STEP=34;
  async function more(){if(!feed){try{feed=await (await fetch('assets/reviews.json')).json()}catch(e){feed=[]}}return feed.splice(0,STEP).map(card)}
  const list=document.getElementById('revlist'),lm=document.getElementById('loadMore');
  function filt(){const on=document.querySelector('.rtabs button[aria-pressed="true"]');return on?on.dataset.f:'all'}
  if(lm)lm.onclick=async()=>{lm.disabled=true;lm.textContent='Loading…';const cs=await more();const f=filt();cs.forEach(c=>{if(f!=='all'&&c.dataset.src!==f)c.hidden=true;list.appendChild(c)});decks.forEach(d=>d.add(cs.map(c=>c.cloneNode(true))));lm.disabled=false;lm.textContent=feed.length?'Load more reviews ('+feed.length+' more)':'All reviews loaded';if(!feed.length)lm.disabled=true};
  // decks
  const decks=[];
  document.querySelectorAll('[data-deck]').forEach(mount=>{
    const src=[...document.querySelectorAll(mount.dataset.deck+' .rv')];if(!src.length)return;
    const prep=c=>{c.removeAttribute('hidden');c.classList.add('dcard');c.removeAttribute('role');c.removeAttribute('tabindex');return c};
    let cards=src.map(r=>prep(r.cloneNode(true)));
    const end=document.createElement('div');end.className='rv dcard dend';
    if(mount.dataset.end==='more'){end.innerHTML='<div class="dend-in"><b>Want to read more?</b><p>Load the next reviews, or read every review on Google.</p><button type="button" class="btn b-red" data-more>Load more reviews</button><a class="btn b-line" href="'+URLS.google+'" target="_blank" rel="noopener">View all on Google ↗</a></div>'}
    else{end.innerHTML='<div class="dend-in"><b>366 Google reviews, rated 5.0</b><p>Read more from neighbors on Google, Yelp and Facebook.</p><a class="btn b-red" href="reviews.html">View all reviews →</a></div>'}
    mount.innerHTML='<div class="deck-stack" aria-live="polite"></div><div class="deck-ctl"><button type="button" class="deck-b" data-d="-1" aria-label="Previous review">‹</button><span class="deck-n"></span><button type="button" class="deck-b" data-d="1" aria-label="Next review">›</button></div><p class="deck-hint">Swipe for the next review. Tap one to read it where it was posted.</p>';
    const stack=mount.querySelector('.deck-stack'),num=mount.querySelector('.deck-n');let i=0,busy=false;
    const all=()=>cards.concat([end]);
    function render(){const A=all();stack.innerHTML='';for(let k=Math.min(2,A.length-1);k>=0;k--){const c=A[(i+k)%A.length];c.style.transition='none';c.style.transform=`translateY(${k*12}px) scale(${1-k*.04})`;c.style.opacity=k==2?.5:1;c.style.zIndex=10-k;stack.appendChild(c)}
      num.textContent=(A[i]===end?'More':(i+1)+' / '+cards.length);const top=stack.lastChild;top.style.height='';top.classList.remove('dback');const h=top.offsetHeight;[...stack.children].forEach(c=>{if(c!==top){c.style.height=h+'px';c.classList.add('dback')}});stack.style.height=h+34+'px';bind(top)}
    function go(d,fly){if(busy)return;busy=true;const top=stack.lastChild;const dir=fly||d;top.style.transition='transform .3s ease, opacity .3s';top.style.transform=`translateX(${dir*130}%) rotate(${dir*18}deg)`;top.style.opacity=0;setTimeout(()=>{const n=all().length;i=(i+(d>0?1:-1)+n)%n;busy=false;render()},280)}
    function bind(c){let x0=null,dx=0;
      c.onpointerdown=e=>{if(e.target.closest('a,button'))return;x0=e.clientX;dx=0;c.setPointerCapture(e.pointerId);c.style.transition='none'};
      c.onpointermove=e=>{if(x0===null)return;dx=e.clientX-x0;c.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`};
      c.onpointerup=c.onpointercancel=e=>{if(x0===null)return;x0=null;
        if(Math.abs(dx)>80)go(1,Math.sign(dx));
        else if(Math.abs(dx)<6&&e.type==='pointerup'&&c!==end){c.style.transform='';open(c.dataset.url||URLS[c.dataset.src])}
        else{c.style.transition='transform .25s';c.style.transform=''}}}
    const api={add(cs){const at=cards.length;cards=cards.concat(cs.map(prep));if(all()[i]===end||i>=at)i=at;render()}};
    end.addEventListener('click',async e=>{const b=e.target.closest('[data-more]');if(!b)return;if(lm){lm.click();return}b.disabled=true;api.add(await more());b.disabled=false});
    decks.push(api);
    mount.querySelectorAll('.deck-b').forEach(b=>b.onclick=()=>go(+b.dataset.d));
    render();addEventListener('resize',()=>{if(!busy)render()});
  });
})();

// ---- recent booking toast (real bookings only) ----
(function(){
  // Live site: this list comes from Josh's booking system (owner app / NiceJob feed).
  // Demo: the most recent real booking shown on his current site, plus any booking made in this demo on this device.
  const FEED=[{n:'Monica',svc:'a cleaning',t:'2026-11-05T18:20:00-06:00'}];
  let local=[];try{local=JSON.parse(localStorage.getItem('mpc_bookings')||'[]')}catch(e){}
  const last=FEED.concat(local).filter(b=>b&&b.n&&b.t).sort((a,b)=>new Date(b.t)-new Date(a.t))[0];
  if(!last||document.getElementById('bk')&&location.hash==='#price')return;
  let shown=false;try{shown=sessionStorage.getItem('mpc_toast')==='1'}catch(e){}
  if(shown)return;
  function ago(t){const m=Math.round((Date.now()-new Date(t))/6e4);if(m<2)return'just now';if(m<60)return m+' minutes ago';const h=Math.round(m/60);if(h<24)return h+(h==1?' hour':' hours')+' ago';const d=new Date(t);return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})+' at '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}
  const fresh=(Date.now()-new Date(last.t))<36e5;
  const el=document.createElement('div');el.className='bktoast';el.setAttribute('role','status');
  el.innerHTML=`<div class="bk-dot" aria-hidden="true"></div><div><b>${fresh?last.n+' just booked '+last.svc:'Most recent booking: '+last.n}</b><span>${fresh?ago(last.t):'Booked '+last.svc+' · '+ago(last.t)}</span></div><button type="button" aria-label="Close">×</button>`;
  el.querySelector('button').onclick=()=>el.classList.remove('on');
  document.body.appendChild(el);
  setTimeout(()=>{if(document.querySelector('dialog[open]'))return;el.classList.add('on');try{sessionStorage.setItem('mpc_toast','1')}catch(e){};setTimeout(()=>el.classList.remove('on'),7000)},6000);
})();
