var ES=document.documentElement.lang==='es',T=function(en,es){return ES?es:en},HOME=ES?'es-index.html':'index.html';
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
  const RATE_ROOM=80, RATE_TILE=1, MIN=175, MAXROOMS=5;
  let rooms=+out.textContent||1;
  $$('.step button').forEach((b,i)=>b.onclick=()=>{rooms=Math.max(0,Math.min(MAXROOMS,rooms+(i?1:-1)));out.textContent=rooms;calc();});
  $('#tile').oninput=calc;
  $$('#extras input,#addons input').forEach(i=>i.onchange=calc);
  const money=n=>'$'+n.toLocaleString();
  function calc(){
    const tile=Math.max(0,+$('#tile').value||0);
    const c=rooms*RATE_ROOM, t=Math.round(tile*RATE_TILE);
    const ex=$$('#extras input:checked').map(i=>i.value), ad=$$('#addons input:checked').map(i=>i.value);
    const L=[];
    if(rooms)L.push([rooms+T(' carpeted room'+(rooms>1?'s':''),rooms>1?' cuartos alfombrados':' cuarto alfombrado'),money(c)]);
    if(tile)L.push([tile+T(' sq ft tile & grout',' pies² de azulejo y juntas'),money(t)]);
    ex.forEach(e=>L.push([e,T('on site','en sitio')]));ad.forEach(a=>L.push([a,T('ask','preguntar')]));
    $('#lines').innerHTML=L.length?L.map(l=>`<li><span>${l[0]}</span><span>${l[1]}</span></li>`).join(''):'<li><span>'+T('Pick a service','Elija un servicio')+'</span><span>—</span></li>';
    const sub=c+t,tot=sub;if(rooms>=MAXROOMS)L.push([T('More than 5 rooms? Text Josh for a quote','¿Más de 5 cuartos? Escríbale a Josh para cotizar'),'']);$('#lines').innerHTML=L.length?L.map(l=>`<li><span>${l[0]}</span><span>${l[1]}</span></li>`).join(''):'<li><span>'+T('Pick a service','Elija un servicio')+'</span><span>—</span></li>';$('#tot').textContent=tot?money(tot)+(ex.length?'+':''):(ex.length?T('On site','En sitio'):'$0');
    window.__est={tot,lines:L};
  }
  calc();
  const bk=window.bk=$('#bk'); if(!bk)return;
  const days=$('#days'),now=new Date();
  for(let d=1,n=0;n<10;d++){const x=new Date(now);x.setDate(now.getDate()+d);if(x.getDay()===0)continue;n++;
    const b=document.createElement('button');b.type='button';b.innerHTML=x.toLocaleDateString(T('en-US','es-US'),{weekday:'short'})+'<b>'+x.getDate()+'</b>';b.onclick=()=>{$$('#days button').forEach(z=>z.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true')};days.appendChild(b);}
  $$('#slots button').forEach(b=>b.onclick=()=>{$$('#slots button').forEach(z=>z.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true')});
  $('#bookBtn').onclick=()=>{const e=window.__est;$('#bkSum').textContent=T('Estimate ','Estimado ')+$('#tot').textContent+' · '+(e.lines.map(l=>l[0]).join(', ')||T('Choose services first','Elija servicios primero'));$('#bkForm').hidden=false;$('#bkDone').hidden=true;bk.showModal();};
  $('#send').onclick=()=>{if(!$('#fName').value||!$('#fPhone').value){$('#fName').reportValidity();$('#fPhone').reportValidity();return}$('#bkForm').hidden=true;$('#bkDone').hidden=false;try{const e=window.__est||{lines:[]};const L=JSON.parse(localStorage.getItem('mpc_bookings')||'[]');L.push({n:$('#fName').value.trim().split(/\s+/)[0],svc:(e.lines[0]&&!ES?e.lines[0][0].toLowerCase():'a cleaning'),t:new Date().toISOString()});localStorage.setItem('mpc_bookings',JSON.stringify(L.slice(-20)))}catch(err){}};
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
    rv.classList.add('rv-click');rv.tabIndex=0;rv.setAttribute('role','link');rv.setAttribute('aria-label',T('Read this review on ','Leer esta reseña en ')+NAMES[p]);
    const a=document.createElement('a');a.className='rv-open';a.href=U;a.target='_blank';a.rel='noopener';a.tabIndex=-1;a.textContent=(rv.dataset.url?T('See this review on ','Ver esta reseña en '):T('Read on ','Leer en '))+NAMES[p]+' ↗';rv.appendChild(a);
    rv.addEventListener('click',e=>{if(e.target.closest('a')||rv.closest('.deck'))return;open(U)});
    rv.addEventListener('keydown',e=>{if(e.key==='Enter')open(U)});}
  function card(x){const ini=x.n.replace(/\./g,'').split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
    const top=x.s==='facebook'?'<div class="rec">'+T('Recommends','Lo recomienda')+'</div>':`<div class="stars" aria-label="${x.r} ${T('out of 5 stars','de 5 estrellas')}">${'★'.repeat(x.r)}<span class="soff">${'★'.repeat(5-x.r)}</span></div>`;
    const d=document.createElement('div');d.className='rv';d.dataset.src=x.s;d.dataset.url=x.u;
    d.innerHTML=`${top}<p>“${esc(x.q)}”</p><div class="who"><div class="av">${esc(ini)}</div><b>${esc(x.n)}</b><span class="src">${NAMES[x.s]}</span></div>`;linkify(d);return d}
  document.querySelectorAll('.rv').forEach(linkify);
  // feed for "load more"
  let feed=null;const STEP=34;
  async function more(){if(!feed){try{feed=await (await fetch('assets/reviews.json')).json()}catch(e){feed=[]}}return feed.splice(0,STEP).map(card)}
  const list=document.getElementById('revlist'),lm=document.getElementById('loadMore');
  function filt(){const on=document.querySelector('.rtabs button[aria-pressed="true"]');return on?on.dataset.f:'all'}
  if(lm)lm.onclick=async()=>{lm.disabled=true;lm.textContent=T('Loading…','Cargando…');const cs=await more();const f=filt();cs.forEach(c=>{if(f!=='all'&&c.dataset.src!==f)c.hidden=true;list.appendChild(c)});decks.forEach(d=>d.add(cs.map(c=>c.cloneNode(true))));lm.disabled=false;lm.textContent=feed.length?T('Load more reviews (','Cargar más reseñas (')+feed.length+T(' more)',' más)'):T('All reviews loaded','Todas las reseñas cargadas');if(!feed.length)lm.disabled=true};
  // decks
  const decks=[];
  document.querySelectorAll('[data-deck]').forEach(mount=>{
    const src=[...document.querySelectorAll(mount.dataset.deck+' .rv')];if(!src.length)return;
    const prep=c=>{c.removeAttribute('hidden');c.classList.add('dcard');c.removeAttribute('role');c.removeAttribute('tabindex');return c};
    let cards=src.map(r=>prep(r.cloneNode(true)));
    const end=document.createElement('div');end.className='rv dcard dend';
    if(mount.dataset.end==='more'){end.innerHTML='<div class="dend-in"><b>'+T('Want to read more?','¿Quiere leer más?')+'</b><p>'+T('Load the next reviews, or read every review on Google.','Cargue las siguientes reseñas o lea todas en Google.')+'</p><button type="button" class="btn b-red" data-more>'+T('Load more reviews','Cargar más reseñas')+'</button><a class="btn b-line" href="'+URLS.google+'" target="_blank" rel="noopener">'+T('View all on Google ↗','Ver todas en Google ↗')+'</a></div>'}
    else{end.innerHTML='<div class="dend-in"><b>'+T('366 Google reviews, rated 5.0','366 reseñas en Google, calificación 5.0')+'</b><p>'+T('Read more from neighbors on Google, Yelp and Facebook.','Lea más de sus vecinos en Google, Yelp y Facebook.')+'</p><a class="btn b-red" href="'+T('reviews.html','es-reviews.html')+'">'+T('View all reviews →','Ver todas las reseñas →')+'</a></div>'}
    mount.innerHTML='<div class="deck-stack" aria-live="polite"></div><div class="deck-ctl"><button type="button" class="deck-b" data-d="-1" aria-label="'+T('Previous review','Reseña anterior')+'">‹</button><span class="deck-n"></span><button type="button" class="deck-b" data-d="1" aria-label="'+T('Next review','Siguiente reseña')+'">›</button></div><p class="deck-hint">'+T('Swipe for the next review. Tap one to read it where it was posted.','Deslice para ver la siguiente reseña. Tóquela para leerla donde se publicó.')+'</p>';
    const stack=mount.querySelector('.deck-stack'),num=mount.querySelector('.deck-n');let i=0,busy=false;
    const all=()=>cards.concat([end]);
    function render(){const A=all();stack.innerHTML='';for(let k=Math.min(2,A.length-1);k>=0;k--){const c=A[(i+k)%A.length];c.style.transition='none';c.style.transform=`translateY(${k*12}px) scale(${1-k*.04})`;c.style.opacity=k==2?.5:1;c.style.zIndex=10-k;stack.appendChild(c)}
      num.textContent=(A[i]===end?T('More','Más'):(i+1)+' / '+cards.length);const top=stack.lastChild;top.style.height='';top.classList.remove('dback');const h=top.offsetHeight;[...stack.children].forEach(c=>{if(c!==top){c.style.height=h+'px';c.classList.add('dback')}});stack.style.height=h+34+'px';bind(top)}
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
  function ago(t){const m=Math.round((Date.now()-new Date(t))/6e4);if(m<2)return T('just now','justo ahora');if(m<60)return T(m+' minutes ago','hace '+m+' minutos');const h=Math.round(m/60);if(h<24)return T(h+(h==1?' hour':' hours')+' ago','hace '+h+(h==1?' hora':' horas'));const d=new Date(t);const lc=T('en-US','es-US');return d.toLocaleDateString(lc,{weekday:'short',month:'short',day:'numeric'})+T(' at ',' a las ')+d.toLocaleTimeString(lc,{hour:'numeric',minute:'2-digit'})}
  const fresh=(Date.now()-new Date(last.t))<36e5;
  const el=document.createElement('div');el.className='bktoast';el.setAttribute('role','status');
  el.innerHTML=`<div class="bk-dot" aria-hidden="true"></div><div><b>${fresh?last.n+T(' just booked '+last.svc,' acaba de reservar una limpieza'):T('Most recent booking: ','Reserva más reciente: ')+last.n}</b><span>${fresh?ago(last.t):T('Booked '+last.svc+' · ','Reservó una limpieza · ')+ago(last.t)}</span></div><button type="button" aria-label="${T('Close','Cerrar')}">×</button>`;
  el.querySelector('button').onclick=()=>el.classList.remove('on');
  document.body.appendChild(el);
  setTimeout(()=>{if(document.querySelector('dialog[open]'))return;el.classList.add('on');try{sessionStorage.setItem('mpc_toast','1')}catch(e){};setTimeout(()=>el.classList.remove('on'),7000)},6000);
})();
// ---- hero before/after compare ----
(function(){
  const ba=document.getElementById('ba');if(!ba)return;
  const fr=ba.querySelector('.ba-frame'),r=ba.querySelector('.ba-range'),A=ba.querySelector('.ba-after'),B=ba.querySelector('.ba-before');
  const N=ES?{carpet:'Alfombra',tile:'Azulejo y juntas',sofa:'Mueble tapizado',rug:'Tapete'}:{carpet:'Carpet',tile:'Tile and grout',sofa:'Upholstery',rug:'Area rug'};
  const set=v=>fr.style.setProperty('--p',v+'%');
  r.addEventListener('input',()=>set(r.value));
  ba.querySelectorAll('.ba-tabs button').forEach(b=>b.addEventListener('click',()=>{
    ba.querySelectorAll('.ba-tabs button').forEach(x=>x.setAttribute('aria-selected',x===b?'true':'false'));
    const k=b.dataset.k;A.src='assets/hero-'+k+'-after.webp';B.src='assets/hero-'+k+'-before.webp';
    A.alt=N[k]+T(' after cleaning (demo image)',' después de la limpieza (imagen de demostración)');B.alt=N[k]+T(' before cleaning (demo image)',' antes de la limpieza (imagen de demostración)');r.value=50;set(50);
  }));
  // preload the other pairs after the page settles
  addEventListener('load',()=>setTimeout(()=>['tile','sofa','rug'].forEach(k=>['before','after'].forEach(s=>{const i=new Image();i.src='assets/hero-'+k+'-'+s+'.webp'})),1500));
  // one gentle hint so people see it moves
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){let t=0;const go=()=>{t+=1;const v=50+18*Math.sin(t/14);set(v.toFixed(1));if(t<88)requestAnimationFrame(go);else set(50)};setTimeout(()=>requestAnimationFrame(go),900);r.addEventListener('pointerdown',()=>{t=999},{once:true})}
})();
// ---- service-area side tab ----
(function(){
  const tab=document.getElementById('aTab'),dr=document.getElementById('areaDrawer');if(!tab||!dr)return;
  const SHOP={lat:30.1420,lon:-95.4472},IN=30,NEAR=40; // miles from the shop on I-45 in Spring
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const open=()=>{dr.hidden=false;document.documentElement.classList.add('adopen');requestAnimationFrame(()=>dr.classList.add('in'));setTimeout(()=>document.getElementById('adIn').focus(),320)};
  const close=()=>{dr.classList.remove('in');document.documentElement.classList.remove('adopen');setTimeout(()=>dr.hidden=true,300);tab.focus()};
  tab.onclick=open;dr.querySelectorAll('[data-x]').forEach(x=>x.onclick=close);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!dr.hidden)close()});
  // swipe left anywhere on the drawer to close it
  {const pan=dr.querySelector('.adpanel'),scr=dr.querySelector('.adscrim');let x0=0,y0=0,dx=0,t0=0,on=false,lock=null;
   dr.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;x0=e.touches[0].clientX;y0=e.touches[0].clientY;dx=0;t0=Date.now();on=true;lock=null},{passive:true});
   dr.addEventListener('touchmove',e=>{if(!on)return;const mx=e.touches[0].clientX-x0,my=e.touches[0].clientY-y0;if(lock===null&&(Math.abs(mx)>8||Math.abs(my)>8))lock=Math.abs(mx)>Math.abs(my)*1.2?'x':'y';if(lock!=='x')return;dx=Math.min(0,mx);pan.style.transition='none';scr.style.transition='none';pan.style.transform=`translateX(${dx}px)`;scr.style.opacity=String(1+dx/pan.offsetWidth)},{passive:true});
   dr.addEventListener('touchend',()=>{if(!on)return;on=false;pan.style.transition='';scr.style.transition='';const fast=dx<-40&&Date.now()-t0<250;if(lock==='x'&&(dx<-pan.offsetWidth*.28||fast)){pan.style.transform='';scr.style.opacity='';close()}else{pan.style.transform='';scr.style.opacity=''}});}
  const out=document.getElementById('adOut'),onHome=!!document.getElementById('price');
  const priceHref=onHome?'#price':HOME+'#price';
  document.getElementById('adForm').onsubmit=async e=>{
    e.preventDefault();let a=document.getElementById('adIn').value.trim();if(!a)return;
    if(!/\b(tx|texas)\b/i.test(a))a+=', TX';
    out.innerHTML='<p class="adwait">'+T('Checking your address…','Revisando su dirección…')+'</p>';
    try{
      const r=await fetch('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&maxLocations=1&outFields=City,Addr_type,Postal&SingleLine='+encodeURIComponent(a));
      const c=((await r.json()).candidates||[])[0];
      if(!c){out.innerHTML='<div class="adres no"><b>'+T('We couldn\'t find that address.','No encontramos esa dirección.')+'</b><p>'+T('Check the spelling or try your ZIP code.','Revise cómo se escribe o pruebe con su código postal.')+'</p></div>';return}
      const R=d=>d*Math.PI/180,dl=R(c.location.y-SHOP.lat),dn=R(c.location.x-SHOP.lon),h=Math.sin(dl/2)**2+Math.cos(R(SHOP.lat))*Math.cos(R(c.location.y))*Math.sin(dn/2)**2,mi=Math.round(7918*Math.asin(Math.sqrt(h)));
      const where=esc(c.attributes&&c.attributes.City||c.address);
      const at=(c.attributes&&c.attributes.Addr_type)||'',exact=/PointAddress|StreetAddress|Subaddress|StreetInt/.test(at)&&!/^\s*\d{5}\s*(,\s*tx)?\s*$/i.test(a);
      const zip=(c.attributes&&c.attributes.Postal)||(a.match(/\b\d{5}\b/)||[''])[0];
      const mq=exact?c.address:(zip?zip+' '+(c.attributes&&c.attributes.City||'')+' TX':c.address);
      const map=`<div class="admap"><iframe src="https://maps.google.com/maps?q=${encodeURIComponent(mq)}&t=${exact?'k':'m'}&z=${exact?18:12}&output=embed" title="${exact?T('Satellite view of ','Vista satelital de '):T('Map of ','Mapa de ')}${esc(mq)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`;
      let res;
      if(mi<=IN)res=ES?`<div class="adres ok"><b>¡Sí, Josh va a ${where}!</b><p>Está a unas ${mi} millas de nosotros, bien dentro de nuestra zona. Vea su precio y elija un horario.</p><div class="cta"><a class="btn b-red" href="${priceHref}" data-go>Ver mi precio →</a><a class="btn b-line" href="sms:+12817900005">Escríbale a Josh</a></div></div>`:`<div class="adres ok"><b>Yes, Josh comes to ${where}!</b><p>You're about ${mi} miles from us, well inside our service area. See your price and pick a time.</p><div class="cta"><a class="btn b-red" href="${priceHref}" data-go>See my price →</a><a class="btn b-line" href="sms:+12817900005">Text Josh</a></div></div>`;
      else if(mi<=NEAR)res=ES?`<div class="adres maybe"><b>Está justo afuera de nuestra zona habitual.</b><p>Está a unas ${mi} millas. Muchas veces Josh sí hace el viaje, así que mándele por texto su dirección y lo que necesita limpiar.</p><div class="cta"><a class="btn b-red" href="sms:+12817900005">Escríbale a Josh</a><a class="btn b-line" href="tel:+12817900005">Llamar al 281-790-0005</a></div></div>`:`<div class="adres maybe"><b>You're just outside our usual area.</b><p>You're about ${mi} miles out. Josh often still makes the trip, so text him your address and what you need cleaned.</p><div class="cta"><a class="btn b-red" href="sms:+12817900005">Text Josh</a><a class="btn b-line" href="tel:+12817900005">Call 281-790-0005</a></div></div>`;
      else res=ES?`<div class="adres no"><b>Eso está fuera de nuestra zona de servicio.</b><p>Está a unas ${mi} millas, un poco lejos para nosotros. Si es un negocio o un trabajo grande, llame y pregunte.</p><div class="cta"><a class="btn b-line" href="tel:+12817900005">Llamar al 281-790-0005</a></div></div>`:`<div class="adres no"><b>That's outside our service area.</b><p>You're about ${mi} miles away, a little far for us. If you're cleaning a business or a large job, call and ask.</p><div class="cta"><a class="btn b-line" href="tel:+12817900005">Call 281-790-0005</a></div></div>`;
      const head=exact?T('Is this your place?','¿Es esta su casa?'):(zip?T('Your area: ','Su zona: ')+esc(zip)+(c.attributes&&c.attributes.City?' · '+where:''):T('Your area','Su zona'));
      const tip=exact?'':`<p class="adtip">${T('Want to see your home? Type your street address.','¿Quiere ver su casa? Escriba su dirección completa.')}</p>`;
      out.innerHTML=`<p style="margin:0 0 8px;font-weight:700">${head}</p>${map}${tip}${res}`;
      const go=out.querySelector('[data-go]');if(go&&onHome)go.onclick=()=>close();
      try{const f=document.getElementById('fAddr');if(f&&!f.value&&exact)f.value=c.address}catch(x){}
    }catch(err){out.innerHTML=T('<div class="adres no"><b>We couldn\'t check right now.</b><p>Text Josh your address and he\'ll let you know.</p><div class="cta"><a class="btn b-red" href="sms:+12817900005">Text Josh</a></div></div>','<div class="adres no"><b>No pudimos revisar en este momento.</b><p>Mándele su dirección a Josh por texto y él le dirá.</p><div class="cta"><a class="btn b-red" href="sms:+12817900005">Escríbale a Josh</a></div></div>')}
  };
})();
