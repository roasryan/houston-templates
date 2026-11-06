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
