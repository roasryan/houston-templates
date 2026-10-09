(function(){
"use strict";
/* ---------- blank slate: bump RESET to wipe every saved customer, crew, job and setting in each browser once ---------- */
{const RESET='R1-2026-10-07';try{if(localStorage.getItem('kcleanin-reset')!==RESET){[localStorage,sessionStorage].forEach(S=>Object.keys(S).filter(k=>k.indexOf('kcleanin-')===0).forEach(k=>S.removeItem(k)));localStorage.setItem('kcleanin-reset',RESET)}}catch(x){}}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const M=window.Motion||null;
/* ================= CLIENT SETTINGS: the only block to change per client (see SETUP.md) =================
   backend: the client's Google Apps Script web app URL (/exec). Leads, owner alerts, the booking calendar and GoHighLevel all go through it.
   Leave either empty and the site falls back to demo mode (leads stay on this device, free map services). */
const CFG={"biz": "Bayou Sparkle Home Cleaning", "city": "Houston", "tz": "America/Chicago", "lat": 29.7604, "lon": -95.3698, "backend": ""};

const HOME=document.getElementById('hero')?'':'index.html';
/* the photo sits exactly under the real header height (in-app browsers and notches change it) */
{const bh=()=>{const b=document.getElementById('bar');if(b)document.documentElement.style.setProperty('--bh',b.offsetHeight+'px')};bh();addEventListener('resize',bh);addEventListener('load',bh);if(window.ResizeObserver)document.addEventListener('DOMContentLoaded',()=>{const b=document.getElementById('bar');if(b)new ResizeObserver(bh).observe(b)})}
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const esc=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const phoneOk=v=>v.replace(/\D/g,'').length>=10;
function toast(m){const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=m;document.body.appendChild(t);if(M&&!reduce)M.animate(t,{opacity:[.001,1],y:[10,0]},{duration:.2});setTimeout(()=>t.remove(),2800)}
function open(html,focusSel){$('#layer').innerHTML=html;const escK=e=>{if(e.key==='Escape')close()};const close=()=>{$('#layer').innerHTML='';document.removeEventListener('keydown',escK)};document.addEventListener('keydown',escK);
  $$('#layer [data-close]').forEach(b=>b.onclick=close);const sc=$('#layer .scrim');if(sc)sc.onclick=e=>{if(e.target===sc)close()};
  const panel=$('#layer .sheet');if(M&&!reduce&&panel)M.animate(panel,{y:[40,0],opacity:[.6,1]},{type:'spring',stiffness:420,damping:36});
  const f=$(focusSel||'#layer button');if(f)f.focus();return close}
const SL=['8 to 10 AM','10 AM to noon','1 to 3 PM','3 to 5 PM'];const days=[];{const d=new Date();d.setHours(12,0,0,0);while(days.length<7){d.setDate(d.getDate()+1);if(d.getDay())days.push(new Date(d))}}

/* ---------- text us: opens the phone's Messages app with a message ready to send ---------- */
/* The business's texting number: change this one line per client (demo uses the owner's number). */
const BIZ_PHONE="+17135550160";
const SMS_NUM=BIZ_PHONE,BIZ_PRETTY=BIZ_PHONE.replace(/^\+1(\d{3})(\d{3})(\d{4})$/,'($1) $2-$3');const inFrame=(()=>{try{return window.self!==window.top}catch(x){return true}})();
/* RFC 5724 form: works on current iPhone (Messages/iMessage) and Android for one recipient */
const smsHref=b=>`sms:${SMS_NUM}?body=${encodeURIComponent(b)}`;
const isPhone=()=>/iPhone|iPod|Android|Mobile/i.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);
const SMS={
  fab:'Hi Bayou Sparkle, I have a question.',
  hero:'Hi Bayou Sparkle, I’d like to book a free quote.',
  leak:'Hi Bayou Sparkle, I need help today.',
  story:'Hi Bayou Sparkle, I have a question.',
  club:'Hi Bayou Sparkle, I have a question about the Recurring plans.',
  footer:'Hi Bayou Sparkle, I have a question.'};
const smsBody=el=>el.dataset.body||SMS[el.dataset.sms]||SMS.fab;
$$('[data-phone]').forEach(e=>e.textContent=BIZ_PRETTY);
function refreshSms(root){$$('[data-sms]',root).forEach(a=>{if(a.tagName==='A'){a.href=smsHref(smsBody(a));if(inFrame)a.target='_blank'}})}
function qrSvg(text){try{if(!window.qrcode)return'';const q=qrcode(0,'M');q.addData(text);q.make();return q.createSvgTag({cellSize:4,margin:2,scalable:true})}catch(x){return''}}
function smsSheet(body,note){const close=open(`<div class="scrim"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="tH"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3 id="tH">Text Bayou Sparkle</h3><button class="btn btn-line btn-sm" type="button" data-close>Close</button></div>
    ${note?'<p class="muted">Your texting app didn’t open from here. Scan the code with your phone, or copy the number and message.</p>':'<p class="muted">A real person answers, usually within 10 minutes between 7 AM and 7 PM.</p>'}
    <div class="field"><label for="tm">Your message (edit it if you like)</label><textarea id="tm" rows="3"></textarea></div>
    <div class="qr" id="qr"></div>
    <div class="smsrow"><a class="btn btn-main" id="smsGo" href="#">Open my texting app</a><button class="btn btn-line btn-sm" type="button" id="cpN">Copy number</button><button class="btn btn-line btn-sm" type="button" id="cpM">Copy message</button></div>
    <div class="copyrow"><code>${BIZ_PRETTY}</code></div></div></div>`,'#tm');
  const tm=$('#tm');tm.value=body;
  const sync=()=>{const h=smsHref(tm.value);$('#smsGo').href=h;if(inFrame)$('#smsGo').target='_blank';const s=qrSvg(`SMSTO:${SMS_NUM}:${tm.value}`);$('#qr').innerHTML=s?s+'<p><b>On a computer?</b> Point your phone’s camera here. Messages opens with this text ready to send.</p>':'';$('#qr').hidden=!s};
  tm.oninput=sync;sync();
  const copy=(t,m)=>{try{navigator.clipboard.writeText(t).then(()=>toast(m),()=>toast('Select and copy it from the box'))}catch(x){toast('Select and copy it from the box')}};
  $('#cpN').onclick=()=>copy(BIZ_PRETTY,'Number copied');$('#cpM').onclick=()=>copy(tm.value,'Message copied');
  return close}
document.addEventListener('click',e=>{const a=e.target.closest('[data-sms]');if(!a||a.closest('#layer'))return;const body=smsBody(a);a.href=smsHref(body);if(inFrame)a.target='_blank';
  if(!isPhone()){e.preventDefault();smsSheet(body);return}
});



/* ---------- CRM data: one small store shared by the website, the owner view and the customer portal ---------- */
/* Demo: saved in this browser only. Live: the same shape moves to a database + texting service. */
const DAY=864e5,NOW=Date.now();
const digits=v=>String(v||'').replace(/\D/g,'').slice(-10);
const pretty=v=>{const d=digits(v);return d.length===10?`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`:v};
const first=n=>String(n||'').trim().split(/\s+/)[0]||'there';
const ago=t=>{const m=Math.round((Date.now()-t)/6e4);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' hr ago':Math.round(m/1440)+' days ago'};
const fmtDay=t=>new Date(t).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
const usd=n=>'$'+Math.round(n).toLocaleString('en-US');
const STAGES=[['lead','New request'],['booked','Free quote booked'],['inspected','Visited'],['estimate','Estimate sent'],['approved','Approved'],['work','Work in progress'],['invoiced','Invoiced'],['paid','Paid'],['lost','Lost']];
const stageIx=s=>STAGES.findIndex(x=>x[0]===s);
const stageName=s=>(STAGES.find(x=>x[0]===s)||['',s])[1];
const OWNER_KEY='owner';
const SITE_URL=location.href.split('#')[0];
function seedDB(){return{v:3,customers:[]}}/* real data only: no sample customers */
let DB;try{DB=JSON.parse(localStorage.getItem('kcleanin-db')||'null')}catch(x){}
if(!DB||DB.v!==3)DB=seedDB();
const save=()=>{try{localStorage.setItem('kcleanin-db',JSON.stringify(DB))}catch(x){}if(window.__onSave)window.__onSave();if(window.__onUndoable)window.__onUndoable()};save();
const byPhone=p=>DB.customers.find(c=>c.phone===digits(p));
const byId=id=>DB.customers.find(c=>c.id===id);
function upsert(o){const p=digits(o.phone);let c=p?byPhone(p):(o.email?DB.customers.find(x=>!x.phone&&x.email===o.email):null);
  if(!c){c={id:'c'+Math.random().toString(36).slice(2,8),phone:p,name:o.name||'New customer',addr:'',source:o.source||'Website',created:Date.now(),stage:'lead',photos:[],updates:[],portal:false,show:{},notes:''};DB.customers.unshift(c)}
  ['name','addr','msg','source'].forEach(k=>{if(o[k]&&(!c[k]||k!=='source'))c[k]=o[k]});if(o.photos&&o.photos.length)c.photos=(c.photos||[]).concat(o.photos);
  if(o.appt){c.appt=o.appt;if(stageIx(c.stage)<1)c.stage='booked';c.show.schedule=true}
  if(o.club){c.club=o.club;c.show.club=true}
  c.fresh=true;save();return c}
const ownerNote=m=>toast(m||'Sent to the owner’s phone.');

/* ---------- customer side: login + stage-aware portal ---------- */
function loginSheet(){const close=open(`<div class="scrim"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="lH"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3 id="lH">Customer login</h3><button class="btn btn-line btn-sm" type="button" data-close>Close</button></div>
    <p class="muted">Use the link we texted you, or enter your mobile number to open your project page. You’ll need the 4-digit PIN from our text.</p>
    <div class="field"><label for="lp">Mobile number</label><input id="lp" type="tel" autocomplete="tel" inputmode="tel" placeholder="(281) 555-0177"></div>
    <p class="err" id="lerr2" role="alert" hidden></p><button class="btn btn-main" type="button" id="lg">Open my project</button></div></div>`,'#lp');
  $('#lg').onclick=()=>{const er=$('#lerr2'),v=$('#lp').value;er.hidden=true;if(digits(v).length<10){er.textContent='Enter your 10-digit mobile number.';er.hidden=false;return}
    const c=byPhone(v);if(!c||!c.portal){er.innerHTML=`We don’t have a project page for that number yet. <a href="#" data-sms="fab" style="color:var(--text)">Text us</a> and we’ll set it up.`;refreshSms(document);er.hidden=false;return}
    ensureJob(c);location.href=portalUrl(c)}}
$$('[data-login]').forEach(b=>b.onclick=loginSheet);

function full(id,html){let el=document.getElementById(id);if(!el){el=document.createElement('div');el.id=id;el.className='app';document.body.appendChild(el)}el.innerHTML=html;el.hidden=false;document.documentElement.classList.add('app-open');el.scrollTop=0;
  if(M&&!reduce)M.animate(el,{opacity:[.001,1],y:[16,0]},{duration:.25});return el}
function closeFull(id){const el=document.getElementById(id);if(el)el.hidden=true;if(!$$('.app').some(a=>!a.hidden))document.documentElement.classList.remove('app-open')}

const PSTEPS=[['Request',['lead']],['Free quote',['booked','inspected']],['Estimate',['estimate','approved']],['Work',['work']],['Done',['invoiced','paid']]];
function openPortal(id){const c=byId(id);if(!c)return;ensureJob(c);if(window.__pushNow)window.__pushNow();try{sessionStorage.setItem('kcleanin-pt-'+c.id,'1');sessionStorage.setItem('kcleanin-ptpin-'+c.id,c.job.pin)}catch(x){}window.open(portalUrl(c),'_blank')||(location.href=portalUrl(c))}

/* ---------- owner view: private link (#owner) ---------- */
let oTab='today',oPeriod=30;
const smsTo=(phone,body)=>`sms:+1${digits(phone)}?body=${encodeURIComponent(body)}`;
const ownerName='Mark';
function metrics(days){const since=Date.now()-days*DAY,C=DB.customers,inP=t=>t&&t>=since;
  const leads=C.filter(c=>inP(c.created));const replied=leads.filter(c=>c.replied);const avgReply=replied.length?replied.reduce((a,c)=>a+(c.replied-c.created),0)/replied.length:0;
  const booked=C.filter(c=>c.appt&&inP(c.created)).length,inspected=C.filter(c=>c.report&&inP(c.report.t)).length;
  const sent=C.filter(c=>c.estimate&&c.estimate.status!=='draft'&&inP(c.estimate.t)),won=sent.filter(c=>c.estimate.status==='approved');
  const pipe=C.filter(c=>c.estimate&&c.estimate.status==='sent').reduce((a,c)=>a+Math.max(...c.estimate.opts.map(o=>o.price)),0);
  const paid=C.filter(c=>c.invoice&&c.invoice.status==='paid'&&inP(c.invoice.paidT)).reduce((a,c)=>a+(+c.invoice.amount||0),0);
  const owed=C.filter(c=>c.invoice&&c.invoice.status==='sent').reduce((a,c)=>a+(+c.invoice.amount||0),0);
  const src={};leads.forEach(c=>src[c.source]=(src[c.source]||0)+1);
  return{leads:leads.length,avgReply,booked,inspected,sent:sent.length,won:won.length,close:sent.length?Math.round(won.length/sent.length*100):null,pipe,paid,owed,portal:C.filter(c=>c.portal).length,club:C.filter(c=>c.club).length,src}}
const fmtDur=ms=>{const m=Math.round(ms/6e4);return !ms?'n/a':m<60?m+' min':Math.round(m/6)/10+' hr'};
function chip(c){return `<span class="chip st-${c.stage}">${stageName(c.stage)}</span>`}
function bookSheet(id){const c=byId(id);let d=0,s=null;const close=open(sheetWrap('bkH','Book '+esc(first(c.name))+'’s free quote',`<div class="days" id="odays"></div><div class="slots" id="oslots"></div><div class="field"><label for="oaddr">Address</label><input id="oaddr" value="${esc(c.addr||'')}" autocomplete="street-address"></div><p class="err" id="obe" role="alert" hidden></p><button class="btn btn-main" type="button" id="obk">Book it</button>`));
  const draw=()=>{$('#odays').innerHTML=days.map((x,i)=>`<button type="button" class="day" data-od="${i}" aria-pressed="${d===i}"><small>${x.toLocaleDateString('en-US',{weekday:'short'})}</small><b>${x.getDate()}</b></button>`).join('');$('#oslots').innerHTML=SL.map((x,j)=>`<button type="button" class="slot" data-os="${j}" aria-pressed="${s===j}">${x}</button>`).join('');$$('[data-od]').forEach(b=>b.onclick=()=>{d=+b.dataset.od;draw()});$$('[data-os]').forEach(b=>b.onclick=()=>{s=+b.dataset.os;draw()})};draw();
  $('#obk').onclick=()=>{if(s==null){$('#obe').textContent='Pick a time window.';$('#obe').hidden=false;return}c.addr=$('#oaddr').value.trim()||c.addr;c.appt={t:days[d].getTime(),slot:SL[s],confirmed:false};c.stage='booked';c.show.schedule=true;if(!c.replied)c.replied=Date.now();save();close();openOwner();toast('Booked. Text them to confirm from Today.')}}
function addSheet(){const close=open(sheetWrap('adH','Add a customer',`<div class="field"><label for="an">Name</label><input id="an" autocomplete="off"></div><div class="field"><label for="ap">Mobile number</label><input id="ap" type="tel" inputmode="tel"></div><div class="field"><label for="aa">Address (optional)</label><input id="aa"></div>
    <div class="field"><label for="as">How they found you</label><input id="as" list="srcs" placeholder="Neighbor, yard sign, Google…"><datalist id="srcs">${[...new Set(DB.customers.map(c=>c.source))].map(s=>`<option value="${esc(s)}">`).join('')}</datalist></div>
    <label class="tog"><input type="checkbox" id="aport" checked> Let them log in to the customer portal with this number</label><p class="err" id="ae" role="alert" hidden></p><button class="btn btn-main" type="button" id="ago">Add customer</button>`),'#an');
  $('#ago').onclick=()=>{const n=$('#an').value.trim(),p=$('#ap').value;if(!n||digits(p).length<10){$('#ae').textContent='Add a name and a 10-digit mobile number.';$('#ae').hidden=false;return}
    const c=upsert({name:n,phone:p,addr:$('#aa').value.trim(),source:$('#as').value.trim()||'Owner added'});c.portal=$('#aport').checked;c.replied=c.replied||Date.now();save();close();custSheet(c.id)}}
function routeHash(){if(location.hash==='#'+OWNER_KEY){oTab='today';openOwner()}}

/* ================= MATERIALS + PURCHASES (Oct 4) =================
   Per job: a planned list (calculator from roof size) and what was actually bought.
   All jobs: spend by month, by vendor, profit per job.
   Purchases come in three ways: owner's Gmail receipts (Home Depot / Lowe's / supply-house e-receipts, read by the
   backend), a linked card feed (Plaid, read-only), or added by hand. Unassigned purchases wait in an inbox to be tagged to a job.
   Customers never see costs; their portal shows "what's going on your roof" (products only). */
const MAT_PRICE={shingle:['Architectural supplies','bundle',42],under:['Synthetic underlayment (10 sq roll)','roll',95],iw:['Ice & water shield (2 sq roll)','roll',85],starter:['Starter strip','bundle',55],ridge:['Ridge cap supplies','bundle',70],drip:['Drip edge, 10 ft','piece',12],nails:['Coil cleaning nails','box',48],cap:['Plastic cap nails','box',32],boot:['Pipe boot / flashing','each',18],vent:['Ridge vent, 4 ft','piece',22],ply:['7/16" OSB decking, 4x8','sheet',32],sealant:['Cleaning sealant','tube',9]};
function matCalc(o){/* o: squares, eaveRake ft, ridge ft, pipes, waste %, sheets of decking */const S=+o.sq||0,w=1+(+o.waste||12)/100,er=+o.er||Math.round(Math.sqrt(S*100)*4.2),rg=+o.ridge||Math.round(Math.sqrt(S*100)*1.1),L=[];
  const add=(k,q)=>{if(q>0){const p=MAT_PRICE[k];L.push({k,desc:p[0],qty:Math.ceil(q),unit:p[1],unitCost:p[2]})}};
  add('shingle',S*w*3);add('under',S*w/10);add('iw',(er*.5*3/100)/2+1);add('starter',er/110);add('ridge',rg/30);add('drip',er/10);add('nails',S/16);add('cap',S/20);add('boot',+o.pipes||2);if(o.vent)add('vent',rg/4);add('ply',+o.sheets||0);add('sealant',Math.max(2,S/10));
  return L}
const plu=(q,u)=>!u||q===1||u==='each'||/s$/.test(u)?u:/(x|sh|ch)$/.test(u)?u+'es':u+'s';
const matTotal=L=>(L||[]).reduce((a,m)=>a+(m.total!=null?m.total:m.qty*m.unitCost),0);
const MON=t=>{const d=new Date(t);return d.getFullYear()*12+d.getMonth()};
function sampleJobs(){const t=d=>NOW+d*DAY,P=(i)=>'71355501'+String(40+i);const SJ=[{"id": "x_ana", "name": "Ana Delgado", "email": "ana.d@example.com", "addr": "4719 Cedar Ridge Dr, Houston, TX 77018", "source": "Google", "created": -1.2, "stage": "booked", "contactPref": "Text", "portal": true, "show": {"schedule": true}, "appt": {"d": 1, "h": 10, "slot": "10:00 AM"}, "msg": "Weekly or every-other-week clean"}, {"id": "x_ben", "name": "Brian Okafor", "email": "brian.o@example.com", "addr": "2210 Willow Bend Ln, Spring, TX 77373", "source": "Google Business Profile", "created": -9, "stage": "estimate", "contactPref": "Email", "portal": true, "show": {"report": true, "estimate": true}, "report": {"d": -6, "notes": "Visit done. Two options written up: recurring cleaning or deep cleaning."}, "estimate": {"d": -5, "status": "sent", "opts": [{"name": "Recurring cleaning", "price": 160, "items": []}, {"name": "Deep cleaning", "price": 420, "items": []}]}}, {"id": "x_cam", "name": "Carla Mendoza", "email": "carla.m@example.com", "addr": "918 Bayou Glen Ct, Katy, TX 77494", "source": "Neighbor referral", "created": -21, "stage": "work", "contactPref": "Text", "portal": true, "show": {"report": true, "estimate": true, "updates": true}, "estimate": {"d": -16, "status": "approved", "pick": 0, "opts": [{"name": "Deep cleaning", "price": 420, "items": []}]}, "done": ["contract", "notes", "arrived"], "updates": [{"d": -1, "text": "Started today. Everything is on schedule, more photos tomorrow."}]}, {"id": "x_dev", "name": "Devon Price", "email": "devon.p@example.com", "addr": "6031 Pecan Hollow St, Houston, TX 77092", "source": "Realtor referral", "created": -40, "stage": "paid", "contactPref": "Call", "portal": true, "show": {"estimate": true, "updates": true, "invoice": true}, "estimate": {"d": -35, "status": "approved", "pick": 0, "opts": [{"name": "Move-in and move-out cleaning", "price": 160, "items": []}]}, "done": ["contract", "notes", "arrived", "kitchen", "detail", "final_check", "walkthrough"], "invoice": {"d": -29, "amount": 160, "desc": "Move-in and move-out cleaning", "status": "paid", "paid": -27}}, {"id": "x_eli", "name": "Eli Turner", "email": "eli.t@example.com", "addr": "3318 Shady Oak Ln, Houston, TX 77043", "source": "Google", "created": -25, "stage": "lost", "lostReason": "Went with another cleaning company", "lost": -12, "contactPref": "Text", "portal": false, "show": {}, "estimate": {"d": -20, "status": "declined", "opts": [{"name": "Deep cleaning", "price": 420, "items": []}]}}];
  const J=SJ.map((o,i)=>{const c={id:o.id,sample:true,name:o.name,phone:P(i+1),email:o.email,addr:o.addr,source:o.source,created:t(o.created),stage:o.stage,contactPref:o.contactPref,photos:[],updates:(o.updates||[]).map(u=>({t:t(u.d),text:u.text,photos:[]})),portal:o.portal,show:o.show,notes:'',msg:o.msg||''};
    if(o.appt)c.appt={t:t(o.appt.d)+o.appt.h*36e5,slot:o.appt.slot,confirmed:false};if(o.report)c.report={t:t(o.report.d),notes:o.report.notes,photos:[]};
    if(o.estimate)c.estimate=Object.assign({t:t(o.estimate.d)},o.estimate,{d:undefined});if(o.invoice)c.invoice={t:t(o.invoice.d),amount:o.invoice.amount,desc:o.invoice.desc,status:o.invoice.status,paidT:t(o.invoice.paid)};
    if(o.lostReason){c.lostReason=o.lostReason;c.lostT=t(o.lost)}if(o.done){c.prod={done:{}};o.done.forEach((k,n)=>c.prod.done[k]={t:t(-3)+n*36e5,by:ownerName})}return c});
  return{jobs:J,purchases:[]}}
DB.purchases=DB.purchases||[];
function samplesOn(){return DB.customers.some(c=>c.sample)}
function setSamples(on){DB.customers=DB.customers.filter(c=>!c.sample);DB.purchases=(DB.purchases||[]).filter(p=>!p.sample);
  if(on){const S=sampleJobs();DB.customers=DB.customers.concat(S.jobs);DB.purchases=S.purchases.concat(DB.purchases);if(!DB.spend||DB.spend.sample||!Object.keys(DB.spend).length)DB.spend={sample:true,Google:1200,'Website':0,'Yard sign':150}}else if(DB.spend&&DB.spend.sample)DB.spend={};save()}
const jobSpent=c=>(DB.purchases||[]).filter(p=>p.job===c.id).reduce((a,p)=>a+p.total,0)+matTotal(c.matExtra);
const jobPrice=c=>0;
/* per-job materials sheet: calculator → planned list; bought list from tagged purchases */

/* ---------- Numbers v2 (Oct 7): full funnel, lost reasons, spend → CAC, gross profit → LTV ---------- */
const LOST_WHY=["Went with another cleaning company", "Price too high", "Cleaning it themselves", "No answer after 3 tries", "Decided to wait", "Not a real lead / spam", "Other"];
function lostAsk(c,done){const close=open(sheetWrap('lsH','Why was it lost?',`<p class="muted" style="margin-top:-6px">${esc(c.name)}. A reason is required so your numbers stay honest.</p>
  <div class="chips" id="lsC" role="radiogroup" aria-label="Reason">${LOST_WHY.map(r=>`<button type="button" role="radio" aria-checked="${c.lostReason===r}" data-why="${esc(r)}">${esc(r)}</button>`).join('')}</div>`));
  $$('#lsC [data-why]').forEach(b=>b.onclick=()=>{c.lostReason=b.dataset.why;save();close();done&&done()})}
const isWon=c=>stageIx(c.stage)>=stageIx('approved')&&c.stage!=='lost';
function oNumbers(){const D=oPeriod,since=Date.now()-D*DAY,C=DB.customers.filter(c=>c.created>=since),sp=DB.spend||{};
  const tile=(l,v,h)=>`<div class="tile"><small>${l}</small><b>${v}</b>${h?`<span>${h}</span>`:''}</div>`;
  const pct=(a,b)=>b?Math.round(a/b*100)+'%':'n/a';
  const n={leads:C.length,booked:C.filter(c=>c.appt||stageIx(c.stage)>=1&&c.stage!=='lost'||c.report).length,insp:C.filter(c=>c.report).length,est:C.filter(c=>c.estimate&&c.estimate.status!=='draft').length,won:C.filter(isWon).length,paid:C.filter(c=>c.stage==='paid').length,lost:C.filter(c=>c.stage==='lost').length};
  const won=C.filter(isWon),rev=won.reduce((a,c)=>a+jobPrice(c),0),gp=won.reduce((a,c)=>a+Math.max(0,jobPrice(c)-(jobSpent(c)||matTotal(c.matPlan||[]))-jobPrice(c)*(DB.labor??.25)),0);
  const spendFor=k=>(+sp[k]||0)*D/30,spendAll=Object.keys(sp).filter(k=>k!=='sample').reduce((a,k)=>a+spendFor(k),0)+(+DB.fee||0)*D/30;
  const cac=n.won?spendAll/n.won:null,avgGP=n.won?gp/n.won:0,club=DB.customers.filter(c=>c.club).length;
  const ltv=avgGP*(1+(DB.repeat??.3)),ratio=cac?ltv/cac:null;
  const fun=[['Requests',n.leads],['Free quotes booked',n.booked],['Visited',n.insp],['Estimates sent',n.est],['Won',n.won],['Paid',n.paid]];
  const srcs=[...new Set(C.map(c=>c.source).concat(Object.keys(sp).filter(k=>k!=='sample')))];
  const rows=srcs.map(k=>{const L=C.filter(c=>c.source===k),W=L.filter(isWon),r=W.reduce((a,c)=>a+jobPrice(c),0),s2=spendFor(k);return{k,l:L.length,b:L.filter(c=>c.appt||c.report).length,w:W.length,r,s:s2,cac:W.length?s2/W.length:null}}).sort((a,b)=>b.r-a.r||b.l-a.l);
  const why={};C.filter(c=>c.stage==='lost').forEach(c=>why[c.lostReason||'No reason given']=(why[c.lostReason||'No reason given']||0)+1);
  const noWhy=C.filter(c=>c.stage==='lost'&&!c.lostReason),stale=C.filter(c=>c.estimate&&c.estimate.status==='sent'&&Date.now()-c.estimate.t>21*DAY);
  const lostAddr=DB.customers.filter(c=>c.stage==='lost'&&c.addr);
  return `<div class="seg" role="group" aria-label="Time range">${[7,30,90,365].map(d=>`<button type="button" data-per="${d}" aria-pressed="${D===d}">${d===365?'1 year':d+' days'}</button>`).join('')}</div>
  ${samplesOn()?'<p class="samp-note">Numbers include sample jobs and sample ad spend.</p>':''}
  <div class="tiles">${tile('Revenue won',usd(rev),n.won+' jobs')}${tile('Gross profit',usd(gp),'after materials + labor')}${tile('Cost to get a customer (CAC)',cac==null?'n/a':usd(cac),usd(spendAll)+' spent in range')}${tile('Lifetime value (LTV)',n.won?usd(ltv):'n/a','profit per customer incl. repeat + referrals')}
    ${tile('LTV : CAC',ratio==null?'n/a':ratio.toFixed(1)+'x',ratio==null?'add spend below':ratio>=3?'healthy (3x+)':'below 3x, fix leaks')}${tile('Cost per request',n.leads&&spendAll?usd(spendAll/n.leads):'n/a')}${tile('Close rate',pct(n.won,n.est),'won ÷ estimates')}${tile('Club members',club,usd(club*12)+'/mo recurring')}</div>
  <h3 class="osec">Funnel: where requests drop off</h3><div class="funnel">${fun.map(([l,v],i)=>`<div class="frow"><span>${l}</span><i style="width:${Math.max(3,n.leads?v/n.leads*100:0)}%"></i><b>${v}</b><small>${i?pct(v,fun[i-1][1])+' of previous':''}</small></div>`).join('')}</div>
  <h3 class="osec">By source</h3><div class="mtable" role="table"><div class="mrow mh srow" role="row"><span>Source</span><span>Requests</span><span>Booked</span><span>Won</span><span>Revenue</span><span>Spend</span><span>CAC</span></div>
    ${rows.map(r=>`<div class="mrow srow" role="row"><span data-l="Source"><b>${esc(r.k)}</b></span><span data-l="Requests">${r.l}</span><span data-l="Booked">${r.b}</span><span data-l="Won">${r.w}</span><span data-l="Revenue">${usd(r.r)}</span><span data-l="Spend">${usd(r.s)}</span><span data-l="CAC">${r.cac==null?'—':usd(r.cac)}</span></div>`).join('')||'<p class="muted">No requests in this range.</p>'}</div>
  <h3 class="osec">Why jobs were lost</h3>${Object.keys(why).length?`<div class="obars">${Object.entries(why).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="obar" title="${esc(k)}"><span>${esc(k)}</span><i style="width:${Math.max(4,v/n.lost*100)}%"></i><b>${v}</b></div>`).join('')}</div>`:'<p class="muted">No lost jobs in this range.</p>'}
  ${noWhy.length||stale.length?`<div class="pbox warnbox"><b>Check these</b>${noWhy.length?`<span>${noWhy.length} lost without a reason: ${noWhy.map(c=>`<button class="linkbtn" type="button" data-open="${c.id}">${esc(c.name)}</button>`).join(', ')}</span>`:''}${stale.length?`<span>${stale.length} estimates with no answer for 3+ weeks: ${stale.map(c=>`<button class="linkbtn" type="button" data-open="${c.id}">${esc(c.name)}</button>`).join(', ')}. Mark won or lost.</span>`:''}</div>`:''}
  ${lostAddr.length?`<div class="pbox"><b>Permit check (lost jobs)</b><span class="muted">If one of these addresses shows up with work done by someone else, note why you lost it.</span><ul class="plist">${lostAddr.map(c=>`<li>${esc(c.name)} · ${esc(c.addr)} <small>lost ${ago(c.lostT||c.created)}${c.lostReason?' · '+esc(c.lostReason):''}</small></li>`).join('')}</ul><a class="btn btn-line btn-sm" href="https://www.houstonpermittingcenter.org/" target="_blank" rel="noopener">Open Houston permit search</a></div>`:''}
  <h3 class="osec">What you spend each month</h3><p class="muted" style="margin-top:-6px">Used for CAC. Ads per source, plus your website/marketing fee.</p>
  <div class="spend">${srcs.filter(k=>k).concat(srcs.includes('Google')?[]:['Google']).map(k=>`<label class="field"><span>${esc(k)}</span><input type="number" min="0" step="50" inputmode="numeric" data-spend="${esc(k)}" value="${+sp[k]||''}" placeholder="$0"></label>`).join('')}
    <label class="field"><span>Website / marketing fee</span><input type="number" min="0" step="50" inputmode="numeric" data-cfg="fee" value="${DB.fee||''}" placeholder="$0"></label>
    <label class="field"><span>Labor + overhead (% of job price)</span><input type="number" min="0" max="90" step="5" data-cfg="labor" value="${Math.round((DB.labor??.25)*100)}"></label>
    <label class="field"><span>Repeat + referral boost (%)</span><input type="number" min="0" max="300" step="10" data-cfg="repeat" value="${Math.round((DB.repeat??.3)*100)}"></label></div>`}
document.addEventListener('change',e=>{const t=e.target;if(!t.closest||!t.closest('#obody'))return;
  if(t.dataset.spend!=null){DB.spend=DB.spend||{};delete DB.spend.sample;DB.spend[t.dataset.spend]=+t.value||0;save();openOwner()}
  else if(t.dataset.cfg){const v=+t.value||0;DB[t.dataset.cfg]=t.dataset.cfg==='fee'?v:v/100;save();openOwner()}});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#obody .warnbox [data-open],#obody .plist [data-open]');if(b){e.stopPropagation();custSheet(b.dataset.open)}},true);

/* ---------- real data only (Oct 7): sample jobs retired; clear any left in this browser ---------- */
if(DB.customers.some(c=>c.sample)||(DB.purchases||[]).some(p=>p.sample)||(DB.spend&&DB.spend.sample)){DB.customers=DB.customers.filter(c=>!c.sample);DB.purchases=(DB.purchases||[]).filter(p=>!p.sample);if(DB.spend&&DB.spend.sample)DB.spend={};save()}
/* ---------- setup check: are customer texts/emails really going out? ---------- */
let SETUP=null;
function setupBox(){if(!CFG.backend)return '';if(!SETUP){fetch(CFG.backend+'?action=status').then(r=>r.json()).then(j=>{SETUP=j;if(oTab==='today')openOwner()}).catch(()=>{});return ''}
  return `<div class="pbox setupbox"><b>Automatic messages</b><span>Emails to customers: <b class="${SETUP.email?'ok':'no'}">${SETUP.email?'On':'Off'}</b> · Texts to customers: <b class="${SETUP.sms?'ok':'no'}">${SETUP.sms?'On':'Off, you text them by hand (the alert says who)'}</b></span>
    <button class="btn btn-line btn-sm" type="button" id="setupTest">Send me a test email${SETUP.sms?' + text':''}</button><span class="muted" id="setupRes"></span></div>`}
document.addEventListener('click',async e=>{const b=e.target.closest&&e.target.closest('#setupTest');if(!b)return;const token=window.ownerToken?window.ownerToken():'';
  b.disabled=true;$('#setupRes').textContent='Sending…';try{const j=await(await fetch(CFG.backend,{method:'POST',body:JSON.stringify({action:'test',token})})).json();
  $('#setupRes').textContent=j.ok?`Email: ${j.email}. Text: ${j.sms}.`:'Sign in again first.'}catch(x){$('#setupRes').textContent='Could not reach the backend.'}b.disabled=false});

/* ================= JOB PORTAL, owner side (Oct 7, round 1) =================
   Each customer with the portal on gets c.job: {pin, lang, visits[], changes[], addons[] (offered extras), picks[] (extras they added), log[]}.
   Shared: DB.crew (name, role, photo) and DB.addons (extras catalog with price + optional pay link). Customers see it at portal.html?j=ID after the PIN. */
/* customer PINs are unique: never the same as another customer's, never 0000 */
function newPin(){const used=new Set(DB.customers.map(c=>c.job&&c.job.pin).filter(Boolean));used.add('0000');let p;do{p=String(1000+Math.floor(Math.random()*9000))}while(used.has(p));return p}
const portalUrl=c=>new URL('portal.html?j='+encodeURIComponent(c.id),location.href).href;
const hm=d=>String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
const isoDay=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function slotTimes(slot,t){/* "8 to 10 AM", "1 to 3 PM", "9:00 AM" → ['08:00','10:00'] */const s=String(slot||'').replace(/noon/i,'12 PM'),m=s.match(/(\d{1,2})(?::(\d\d))?\s*(AM|PM)?\s*(?:to|-|–)\s*(\d{1,2})(?::(\d\d))?\s*(AM|PM)/i);
  const h24=(h,ap)=>{h=+h;if(/pm/i.test(ap||'')&&h<12)h+=12;if(/am/i.test(ap||'')&&h===12)h=0;return h};
  if(m){const ap2=m[6],ap1=m[3]||(+m[1]>+m[4]&&/pm/i.test(ap2)?'AM':ap2);return[String(h24(m[1],ap1)).padStart(2,'0')+':'+(m[2]||'00'),String(h24(m[4],ap2)).padStart(2,'0')+':'+(m[5]||'00')]}
  const one=s.match(/(\d{1,2})(?::(\d\d))?\s*(AM|PM)/i);if(one){const h=h24(one[1],one[3]);return[String(h).padStart(2,'0')+':'+(one[2]||'00'),String(h+1).padStart(2,'0')+':'+(one[2]||'00')]}
  const d=new Date(t);return d.getHours()===12&&!d.getMinutes()?['08:00','10:00']:[hm(d),hm(new Date(t+36e5))]}
function ensureJob(c){const j=c.job=c.job||{};if(!j.pin||DB.customers.some(o=>o!==c&&o.job&&o.job.pin===j.pin))j.pin=newPin();j.visits=j.visits||[];j.changes=j.changes||[];j.addons=j.addons||[];j.picks=j.picks||[];j.log=j.log||[];
  if(c.appt&&!j.apptIn){const[f,to]=slotTimes(c.appt.slot,c.appt.t);j.visits.push({id:'v'+Math.random().toString(36).slice(2,7),type:'inspection',date:isoDay(c.appt.t),from:f,to,status:c.appt.confirmed?'confirmed':'scheduled',crew:[],note:''});j.apptIn=true}
  save();return j}
function portalInvite(c){const j=ensureJob(c),u=portalUrl(c);return j.lang==='es'?`Hola ${first(c.name)}, le saluda ${ownerName} de Bayou Sparkle Home Cleaning. Aquí puede ver su proyecto: ${u}  Su PIN: ${j.pin}`:`Hi ${first(c.name)}, it’s ${ownerName} with Bayou Sparkle Home Cleaning. Here’s your project page: ${u}  Your PIN: ${j.pin}`}
const VTYPE={"inspection": "Free quote visit", "work": "Cleaning day", "followup": "Re-clean visit", "estimate": "Walkthrough quote"};
const VST=[['scheduled','Scheduled'],['confirmed','Confirmed'],['onway','On the way'],['arrived','Arrived'],['done','Done for today'],['cancelled','Cancelled']];
const vstName=k=>(VST.find(x=>x[0]===k)||['',k])[1];
const t12=s=>{if(!s)return'';const[h,m]=s.split(':').map(Number),d=new Date();d.setHours(h,m,0,0);return d.toLocaleTimeString('en-US',{hour:'numeric',minute:m?'2-digit':undefined})};
const vWhen=v=>`${fmtDay(new Date(v.date+'T12:00').getTime())}, ${t12(v.from)}${v.to?'–'+t12(v.to):''}`;
/* photos from the phone: square-ish crop for faces, smaller files */
function readPhoto(file,max,cb){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.round(im.width*k);cv.height=Math.round(im.height*k);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);cb(cv.toDataURL('image/jpeg',.78))};im.src=r.result};r.readAsDataURL(file)}
function faceCrop(file,cb){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(im.width,im.height),cv=document.createElement('canvas');cv.width=cv.height=360;cv.getContext('2d').drawImage(im,(im.width-s)/2,Math.max(0,(im.height-s)/2-s*.08),s,s,0,0,360,360);cb(cv.toDataURL('image/jpeg',.8))};im.src=r.result};r.readAsDataURL(file)}
const avatar=(m,sz=44)=>`<span class="oav" style="width:${sz}px;height:${sz}px">${m&&m.photo?`<img src="${m.photo}" alt="">`:`<b>${esc(((m&&m.name)||'?')[0])}</b>`}</span>`;

/* Today: what customers did in their portals + visits today */
function statusBtns(c,v){const nx={scheduled:['confirmed','Confirmed'],confirmed:['onway','On the way'],onway:['arrived','Arrived'],arrived:['done','Done for today']}[v.status];
  return (nx?`<button class="btn btn-main btn-sm" type="button" data-vst="${c.id}|${v.id}|${nx[0]}">${nx[1]}</button>`:'')+`<button class="btn btn-line btn-sm" type="button" data-snap="${c.id}|${v.id}">Who’s going (photos)</button>`}
function setVisit(c,v,st,eta){const prev={status:v.status,stage:c.stage,eta:v.eta};v.status=st;v.statusT=Date.now();if(eta!=null)v.eta=eta;if(st==='done'&&v.type==='inspection'&&stageIx(c.stage)<stageIx('inspected'))c.stage='inspected';if((st==='onway'||st==='arrived')&&v.type==='work'&&stageIx(c.stage)<stageIx('work'))c.stage='work';save();
  const es=(c.job||{}).lang==='es',u=portalUrl(c),msg={confirmed:es?`Hola ${first(c.name)}, su visita del ${vWhen(v)} está confirmada. Vea quién va: ${u}`:`Hi ${first(c.name)}, your visit ${vWhen(v)} is confirmed. See who’s coming: ${u}`,
    onway:es?`Hola ${first(c.name)}, vamos en camino${eta?', a unos '+eta+' minutos':''}. Vea quién va: ${u}`:`Hi ${first(c.name)}, we’re on the way${eta?', about '+eta+' minutes out':''}. See who’s coming: ${u}`,
    arrived:es?`Hola ${first(c.name)}, ya llegamos.`:`Hi ${first(c.name)}, we’re here.`,done:es?`Hola ${first(c.name)}, terminamos por hoy. Fotos y novedades: ${u}`:`Hi ${first(c.name)}, all done for today. Photos and updates: ${u}`}[st];
  if(msg){const close=open(sheetWrap('vsH',`${vstName(st)}: ${esc(first(c.name))}`,`<p class="muted">Their portal shows “${vstName(st)}” now. Send them a text too?</p><p class="pbox" style="padding:10px 12px">${esc(msg)}</p><div class="smsrow"><a class="btn btn-main btn-sm" href="${smsTo(c.phone,msg)}">Text it</a><button class="btn btn-line btn-sm" type="button" data-close>Don’t text</button></div><p style="margin:14px 0 0"><button class="linkbtn" type="button" id="vsUndo">Oops, undo: put it back to “${vstName(prev.status)}”</button></p>`));
    $('#vsUndo').onclick=()=>{$$('.oundo').forEach(x=>x.remove());v.status=prev.status;c.stage=prev.stage;v.eta=prev.eta;save();close();openOwner();toast('Undone. Back to “'+vstName(prev.status)+'”.')};
    $$('#layer a[href^="sms:"]').forEach(a=>a.addEventListener('click',e=>{if(!isPhone()){e.preventDefault();toast('Opens your texting app on your phone.')}else setTimeout(close,300)}))}}
function etaAsk(c,v,done){const close=open(sheetWrap('etH','How far out?',`<div class="chips" role="group" aria-label="Minutes away">${[10,20,30,45,60].map(m=>`<button type="button" data-eta="${m}">${m} min</button>`).join('')}<button type="button" data-eta="">Not sure</button></div>`));
  $$('#layer [data-eta]').forEach(b=>b.onclick=()=>{close();setVisit(c,v,'onway',b.dataset.eta?+b.dataset.eta:null);done&&done()})}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-vst],[data-snap],[data-pjob],[data-seen]');if(!t||!t.closest('#owner,#layer'))return;e.stopPropagation();
  if(t.dataset.seen){const a=(DB.activity||[]).find(x=>String(x.t)===t.dataset.seen);if(a)a.seen=true;save();openOwner();return}
  if(t.dataset.pjob){jobSheet(t.dataset.pjob);return}
  const[cid,vid,st]=(t.dataset.vst||t.dataset.snap).split('|'),c=byId(cid),v=c&&(c.job.visits||[]).find(x=>x.id===vid);if(!v)return;
  if(t.dataset.snap){snapSheet(c,v);return}
  const after=()=>{if($('#owner')&&!$('#owner').hidden&&!$('#layer .sheet'))openOwner()};
  if(st==='onway')etaAsk(c,v,()=>{openOwner()});else{setVisit(c,v,st);openOwner()}},true);

/* the job sheet: everything the customer sees in their portal */
function visitSheet(id,vid,defType){const c=byId(id),j=ensureJob(c),v=vid?j.visits.find(x=>x.id===vid):null,C=DB.crew||[];let team=v&&v.team?{...v.team}:null;
  const d0=v?v.date:isoDay(Date.now()+DAY);
  const close=open(sheetWrap('vtH',(v?'Edit visit':'Add a visit')+': '+esc(first(c.name)),`<div class="two"><div class="field"><label for="vty">What visit</label><select id="vty">${Object.entries(VTYPE).map(([k,l])=>`<option value="${k}" ${v&&v.type===k||!v&&k===(defType||'work')?'selected':''}>${l}</option>`).join('')}</select></div><div class="field"><label for="vdt">Day</label><input id="vdt" type="date" value="${d0}"></div></div>
    <div class="two"><div class="field"><label for="vfr">Arrive between</label><input id="vfr" type="time" value="${v?v.from:'08:00'}"></div><div class="field"><label for="vto">and</label><input id="vto" type="time" value="${v?v.to||'':'09:00'}"></div></div>
    <div class="field"><label for="vst">Status</label><select id="vst">${VST.map(([k,l])=>`<option value="${k}" ${(v?v.status:'confirmed')===k?'selected':''}>${l}</option>`).join('')}</select></div>
    <div class="field"><span class="flabel">Who’s going</span>${C.length?`<div class="crewpick">${C.map(m=>`<label class="cpk"><input type="checkbox" data-vcm="${m.id}" ${v&&(v.crew||[]).includes(m.id)?'checked':''}>${avatar(m,40)}<span class="cpn">${esc(m.name)}<small>${esc(m.role||'')}</small></span><span class="cplead"><input type="radio" name="vlead" value="${m.id}" ${v&&v.lead===m.id?'checked':''} aria-label="${esc(m.name)} is cleaner lead"> Lead</span></label>`).join('')}</div>`:'<p class="muted">Add your cleaner once under Owner → Cleaner & extras (name, role, photo).</p>'}</div>
    <div class="field"><span class="flabel">Or one team photo (the lead snaps it for everyone)</span><label class="upl" for="vtp"><span>${team?'Retake team photo':'Add team photo'}</span><input id="vtp" type="file" accept="image/*" capture="environment"></label><div class="thumbs" id="vtpt">${team&&team.photo?`<img src="${team.photo}" alt="">`:''}</div><input id="vtn" placeholder="Names in the photo (optional)" value="${esc(team&&team.names||'')}" aria-label="Names in the team photo"></div>
    <div class="field"><label for="vnt">Note for the customer (optional)</label><input id="vnt" value="${esc(v&&v.note||'')}" placeholder="Please move cars out of the driveway."></div>
    <p class="err" id="vte" role="alert" hidden></p><div class="smsrow"><button class="btn btn-main" type="button" id="vgo">Save visit</button>${v?'<button class="btn btn-line btn-sm" type="button" id="vdel">Delete visit</button>':''}</div>`),'#vty');
  $('#vtp').onchange=e=>{const f=e.target.files[0];if(f)readPhoto(f,1100,u=>{team={photo:u,names:$('#vtn').value};$('#vtpt').innerHTML=`<img src="${u}" alt="">`})};
  $('#vgo').onclick=()=>{const dt=$('#vdt').value,fr=$('#vfr').value;if(!dt||!fr){$('#vte').textContent='Pick the day and arrival time.';$('#vte').hidden=false;return}
    const crew=$$('#layer [data-vcm]').filter(x=>x.checked).map(x=>x.dataset.vcm),ld=($$('#layer [name="vlead"]').find(x=>x.checked)||{}).value||crew[0]||'';
    const o={type:$('#vty').value,date:dt,from:fr,to:$('#vto').value,status:$('#vst').value,crew,lead:ld,note:$('#vnt').value.trim(),team:team&&team.photo?{photo:team.photo,names:$('#vtn').value.trim()}:null};
    if(v)Object.assign(v,o);else j.visits.push(Object.assign({id:'v'+Math.random().toString(36).slice(2,7)},o));
    if(o.type==='inspection'){j.apptIn=true;if(stageIx(c.stage)<1)c.stage='booked';c.appt={t:new Date(o.date+'T'+o.from).getTime(),slot:t12(o.from)+(o.to?' to '+t12(o.to):''),confirmed:o.status!=='scheduled'};c.show=c.show||{};c.show.schedule=true;if(!c.replied)c.replied=Date.now()}save();close();custSheet(id);toast('Visit saved.')};
  const del=$('#vdel');if(del)del.onclick=()=>{j.visits=j.visits.filter(x=>x!==v);save();close();jobSheet(id)}}
function snapSheet(c,v){const crew=(v.crew||[]).map(x=>(DB.crew||[]).find(m=>m.id===x)).filter(Boolean);
  const close=open(sheetWrap('snH','Who’s going: '+esc(first(c.name)),`<p class="muted" style="margin-top:-6px">Snap a fresh photo before you head out, so ${esc(first(c.name))} knows who’s at the door.</p>
    ${crew.map(m=>`<div class="jrow">${avatar(m,56)}<div><b>${esc(m.name)}</b><small>${esc(m.role||'')}</small></div><label class="btn btn-line btn-sm upl1">New photo<input type="file" accept="image/*" capture="user" data-selfie="${m.id}" hidden></label></div>`).join('')||'<p class="muted">No one is picked for this visit yet.</p>'}
    <div class="field"><span class="flabel">Or one team photo for everyone</span><label class="upl" for="snT"><span>${v.team&&v.team.photo?'Retake team photo':'Take team photo'}</span><input id="snT" type="file" accept="image/*" capture="environment"></label><div class="thumbs" id="snTt">${v.team&&v.team.photo?`<img src="${v.team.photo}" alt="">`:''}</div></div>
    <div class="smsrow"><button class="btn btn-main" type="button" id="snGo">Done</button><button class="btn btn-line btn-sm" type="button" id="snEd">Change who’s going</button></div>`));
  $$('#layer [data-selfie]').forEach(i=>i.onchange=()=>{const f=i.files[0];if(!f)return;faceCrop(f,u=>{const m=DB.crew.find(x=>x.id===i.dataset.selfie);m.photo=u;m.photoT=Date.now();save();close();snapSheet(c,v)})});
  $('#snT').onchange=e=>{const f=e.target.files[0];if(f)readPhoto(f,1100,u=>{v.team={photo:u,names:(v.team&&v.team.names)||crew.map(m=>m.name).join(', ')};save();$('#snTt').innerHTML=`<img src="${u}" alt="">`})};
  $('#snGo').onclick=()=>{close();if(!$('#owner').hidden)openOwner();toast('Photos are in their portal.')};$('#snEd').onclick=()=>{close();visitSheet(c.id,v.id)}}

/* Owner → Crew & extras */
function oTeam(){const C=DB.crew||[],A=DB.addons||[];
  return `<h3 class="osec">Your cleaner <span class="cnt">${C.length}</span></h3><p class="muted" style="margin-top:-6px">Customers see the photo and name of who’s coming. Retake photos any time, even right before heading out.</p>
    <div class="crewlist">${C.map(m=>`<article class="orow"><div class="orow-m" style="display:flex;gap:12px;align-items:center">${avatar(m,56)}<div><b>${esc(m.name)}</b><small>${esc(m.role||'')}${m.photoT?' · photo '+ago(m.photoT):''}</small><small class="capp ${m.code&&m.active!==false?'on':''}">${m.code&&m.active!==false?`Cleaner app · code <b>${esc(m.code)}</b> · ${permLine(m)}`:'No cleaner app access'}</small></div></div><div class="oacts"><button class="btn btn-main btn-sm" type="button" data-ced="${m.id}">Edit</button>${m.code&&m.active!==false?`<a class="btn btn-line btn-sm" href="${crewText(m)}" data-csend="${m.id}">Text link + code</a>`:''}<label class="btn btn-line btn-sm upl1">${m.photo?'New photo':'Add photo'}<input type="file" accept="image/*" capture="user" data-cphoto="${m.id}" hidden></label></div></article>`).join('')||'<p class="muted">No cleaner yet.</p>'}</div>
    <p class="muted">Each person gets a cleaner code. They open <b>${esc(crewUrl())}</b>, type the code, and see their jobs: address with maps, customer, what to do, photos. You choose what each person can see and do.</p>
    <div class="pbox"><b>Add someone</b><div class="two"><div class="field"><label for="cmn">Name</label><input id="cmn" placeholder="Luis"></div><div class="field"><label for="cmr">Role</label><input id="cmr" list="cmrl" placeholder="Lead cleaner"><datalist id="cmrl"><option value="Lead cleaner"><option value="Cleaner"><option value="Office"><option value="Project manager"><option value="Owner"></datalist></div></div><button class="btn btn-main btn-sm" type="button" id="cmadd">Add to cleaner</button></div>
    <h3 class="osec">Extras customers can add <span class="cnt">${A.length}</span></h3><p class="muted" style="margin-top:-6px">Shown in a customer’s portal only when you switch it on for their job. They tap “Add to my job”, you get a heads-up, and it goes on your invoice.</p>
    ${A.map(a=>`<article class="orow"><div class="orow-m" style="display:flex;gap:12px;align-items:center">${a.photo?`<img class="xph" src="${a.photo}" alt="">`:''}<div><b>${esc(a.name)} · ${usd(a.price)}</b><small>${esc(a.desc||'')}</small></div></div><div class="oacts"><button class="btn btn-line btn-sm" type="button" data-xed="${a.id}">Edit</button><button class="btn btn-line btn-sm" type="button" data-xdel="${a.id}">Remove</button></div></article>`).join('')||'<p class="muted">None yet. Ideas: airbnb turnovers, kitchens and bathrooms, add-ons.</p>'}
    <button class="btn btn-main btn-sm" type="button" id="xadd">Add an extra</button>`}
function bindTeam(){const add=$('#cmadd');add.onclick=()=>{const n=$('#cmn').value.trim();if(!n){toast('Add a name.');return}const m={id:'m'+Math.random().toString(36).slice(2,7),name:n,role:$('#cmr').value.trim(),code:newCrewCode(),active:true,perms:{photos:true,phone:true,status:true,allJobs:/owner|manager/i.test($('#cmr').value)}};DB.crew=(DB.crew||[]).concat([m]);save();openOwner();crewEdit(m.id,true)};
  $$('#obody [data-ced]').forEach(b=>b.onclick=()=>crewEdit(b.dataset.ced));
  $$('#obody [data-cphoto]').forEach(i=>i.onchange=()=>{const f=i.files[0];if(f)faceCrop(f,u=>{const m=DB.crew.find(x=>x.id===i.dataset.cphoto);m.photo=u;m.photoT=Date.now();save();openOwner()})});
  $('#xadd').onclick=()=>xSheet();$$('#obody [data-xed]').forEach(b=>b.onclick=()=>xSheet(b.dataset.xed));
  $$('#obody [data-xdel]').forEach(b=>b.onclick=()=>{DB.addons=DB.addons.filter(a=>a.id!==b.dataset.xdel);DB.customers.forEach(c=>{if(c.job)c.job.addons=(c.job.addons||[]).filter(x=>x!==b.dataset.xdel)});save();openOwner()});}
/* crew app access (Oct 8): code + what each person may see and do on crew.html */
const crewUrl=()=>new URL('crew.html',location.href).href;
function newCrewCode(){const used=new Set((DB.crew||[]).map(m=>String(m.code||'')));let c;do{c=String(100000+Math.floor(Math.random()*900000))}while(used.has(c));return c}
const PERMS=[['status','Tap “On my way”, “I’m here”, “Done”','The customer sees it live on their page.'],['photos','Add job photos','Can also show them to the customer.'],['phone','See the customer’s phone and email','Lets them call or text the customer.'],['allJobs','See every job','Off: only the visits you put them on.']];
const permLine=m=>{const p=m.perms||{};return PERMS.filter(([k])=>k==='allJobs'?p[k]:p[k]!==false).map(([k])=>({status:'status',photos:'photos',phone:'customer info',allJobs:'all jobs'}[k])).join(', ')||'view only'};
const crewText=m=>`sms:${m.phone?'+1'+digits(m.phone):''}${/iPhone|iPad|Mac/i.test(navigator.userAgent)?'&':'?'}body=${encodeURIComponent(`${CFG.biz} cleaner app: ${crewUrl()}\nYour code: ${m.code}\nSave the link to your home screen.`)}`;
function crewEdit(mid,fresh){const m=(DB.crew||[]).find(x=>x.id===mid);if(!m)return;const p=Object.assign({photos:true,phone:true,status:true,allJobs:false},m.perms||{});let code=m.code||newCrewCode();
  const close=open(sheetWrap('ceH',fresh?'Cleaner app for '+esc(m.name):esc(m.name),`
    <div class="two"><div class="field"><label for="ceN">Name</label><input id="ceN" value="${esc(m.name)}"></div><div class="field"><label for="ceR">Role</label><input id="ceR" value="${esc(m.role||'')}" list="cmrl"></div></div>
    <div class="field"><label for="ceP">Mobile (to text them the link)</label><input id="ceP" type="tel" inputmode="tel" value="${esc(m.phone||'')}" placeholder="(713) 555-0123"></div>
    <label class="oswitch big"><input type="checkbox" id="ceOn" ${m.active!==false?'checked':''}><span></span><b>Cleaner app</b><small>Off locks them out right away.</small></label>
    <div class="ccode-box"><span>Their code</span><b id="ceC">${esc(code)}</b><button class="btn btn-line btn-sm" type="button" id="ceNew">New code</button></div>
    <h3 class="osec">What they can do</h3>
    ${PERMS.map(([k,l,h])=>`<label class="oswitch"><input type="checkbox" data-perm="${k}" ${p[k]?'checked':''}><span></span><b>${l}</b><small>${h}</small></label>`).join('')}
    <button class="btn btn-main" type="button" id="ceGo">Save</button>
    <div class="two" style="margin-top:10px"><a class="btn btn-line" id="ceSms" href="#">Text them the link + code</a><a class="btn btn-line" href="${crewUrl()}" target="_blank" rel="noopener">Open cleaner app</a></div>
    <button class="linkbtn" type="button" id="ceDel" style="margin-top:14px;color:var(--ored)">Remove ${esc(m.name)} from the cleaner</button>`),'#ceP');
  const grab=()=>{m.name=$('#ceN').value.trim()||m.name;m.role=$('#ceR').value.trim();m.phone=digits($('#ceP').value);m.active=$('#ceOn').checked;m.code=code;m.perms={};$$('#layer [data-perm]').forEach(i=>m.perms[i.dataset.perm]=i.checked)};
  const sms=$('#ceSms');sms.onclick=e=>{grab();save();sms.href=crewText(m)};
  $('#ceNew').onclick=()=>{code=newCrewCode();$('#ceC').textContent=code;toast('New code. The old one stops working when you save.')};
  $('#ceGo').onclick=()=>{grab();save();close();openOwner();toast('Saved. Changes reach their phone within a minute.')};
  $('#ceDel').onclick=()=>{const b=$('#ceDel');if(!b.dataset.sure){b.dataset.sure=1;b.textContent='Tap again to remove '+m.name;return}DB.crew=DB.crew.filter(x=>x.id!==m.id);DB.customers.forEach(c=>((c.job||{}).visits||[]).forEach(v=>{if(v.crew)v.crew=v.crew.filter(x=>x!==m.id)}));save();close();openOwner()}}
function xSheet(xid){const a=xid?(DB.addons||[]).find(x=>x.id===xid):null;let ph=a?a.photo:'';
  const close=open(sheetWrap('xH',a?'Edit extra':'Add an extra',`<div class="field"><label for="xn">Name</label><input id="xn" value="${esc(a?a.name:'')}" placeholder="Add-ons"></div><div class="field"><label for="xd">One line about it</label><input id="xd" value="${esc(a?a.desc:'')}" placeholder="Keeps leaves out. Installed the same day."></div>
    <div class="field"><label for="xp">Price (so they know what it costs; it goes on your invoice)</label><input id="xp" inputmode="decimal" value="${a?a.price:''}" placeholder="$"></div>
    <div class="field"><span class="flabel">Photo (your own work looks best)</span><label class="upl" for="xf"><span>${ph?'Change photo':'Add photo'}</span><input id="xf" type="file" accept="image/*"></label><div class="thumbs" id="xth">${ph?`<img src="${ph}" alt="">`:''}</div></div>
    <p class="err" id="xe" role="alert" hidden></p><button class="btn btn-main" type="button" id="xgo">Save</button>`),'#xn');
  $('#xf').onchange=e=>{const f=e.target.files[0];if(f)readPhoto(f,700,u=>{ph=u;$('#xth').innerHTML=`<img src="${u}" alt="">`})};
  $('#xgo').onclick=()=>{const n=$('#xn').value.trim(),p=+String($('#xp').value).replace(/[^\d.]/g,'');if(!n||!p){$('#xe').textContent='Add a name and price.';$('#xe').hidden=false;return}
    const o={name:n,desc:$('#xd').value.trim(),price:p,photo:ph};if(a)Object.assign(a,o);else DB.addons=(DB.addons||[]).concat([Object.assign({id:'x'+Math.random().toString(36).slice(2,7)},o)]);save();close();openOwner()}}
/* keep the owner view fresh when a customer acts in their portal (another tab on this device) */
addEventListener('storage',e=>{if(e.key!=='kcleanin-db')return;try{const n=JSON.parse(e.newValue||'null');if(n&&n.v===3){DB=n;const o=$('#owner');if(o&&!o.hidden&&!$('#layer .sheet'))openOwner()}}catch(x){}});
/* one PIN per customer: if two customers ever share a PIN (or have 0000), give the later one a new PIN */
{const seen=new Set(['0000']);let fixed=false;DB.customers.slice().reverse().forEach(c=>{if(!c.job||!c.job.pin)return;if(seen.has(c.job.pin)){c.job.pin=newPin();fixed=true}seen.add(c.job.pin)});if(fixed)save()}
/* ================= OWNER APP v2 (Oct 8): light, high-contrast, logo colors, pages instead of crowded sheets =================
   the owner: "most people just want to send an invoice, show up to the site, do the work, and get paid" — every screen leads with
   ONE big next action (2–3 taps from opening the app), with the full detail one tap deeper for owners who want it. */
let oJob=null;
const OI={
  home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',jobs:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  money:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>',phone:'<path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',pin:'<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  cam:'<path d="M4 7h4l2-2h4l2 2h4v12H4z"/><circle cx="12" cy="13" r="3.5"/>',check:'<path d="M5 12.5 10 17l9-10"/>',file:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
  truck:'<path d="M2 7h11v9H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',tool:'<path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 3-3-3z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',key:'<circle cx="8" cy="14" r="4"/><path d="m11 11 9-9M17 5l2 2"/>',box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',team:'<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c.8-3.5 3.5-5.5 7-5.5s6.2 2 7 5.5M16 14.5c3 0 5 1.8 6 4.5"/>',
  out:'<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  star:'<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>'};
const oi=(k,c='')=>`<svg class="oi ${c}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${OI[k]||''}</svg>`;
const STEP8=[['lead','Request'],['booked','Booked'],['inspected','Visited'],['estimate','Estimate'],['approved','Approved'],['work','Working'],['invoiced','Invoiced'],['paid','Paid']];
const mapsUrl=a=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(a||'');
const greet=()=>{const h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening'};
const todayIso=()=>isoDay(Date.now());
const visitsOf=c=>((c.job||{}).visits||[]).filter(v=>v.status!=='cancelled');
const nextVisit=c=>{const now=todayIso();return visitsOf(c).filter(v=>v.date>=now&&v.status!=='done').sort((a,b)=>(a.date+a.from).localeCompare(b.date+b.from))[0]};
const invoiceLines=c=>{const L=[];const e=c.estimate&&c.estimate.status==='approved'?c.estimate.opts[c.estimate.pick||0]:null;if(e)L.push({desc:e.name,amount:e.price});
  ((c.job||{}).changes||[]).filter(o=>o.status==='approved'||o.status==='paid').forEach(o=>L.push({desc:'Change: '+o.title,amount:o.price,paid:o.status==='paid'}));
  ((c.job||{}).picks||[]).forEach(p=>L.push({desc:'Extra: '+p.name,amount:p.price,paid:p.status==='paid'}));return L};
const owed=c=>c.invoice&&c.invoice.status!=='paid'&&c.invoice.status!=='draft'&&(c.invoice.link||c.invoice.file)?1:0;
const readyToBill=c=>!c.invoice&&(c.stage==='work'||c.stage==='approved'&&visitsOf(c).some(v=>v.type==='work'&&v.status==='done'));
/* sms links only work on a phone: tell desktop users instead of failing silently */
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('#owner a[href^="sms:"],#layer a[href^="sms:"]');if(a&&!isPhone()){e.preventDefault();toast('Texting opens on your phone. On a computer, use Call or Email.')}},true);

/* ---------- what's the ONE next thing for this job ---------- */
const actBtn=(c,a,cls)=>a.step?`<button class="${cls}" type="button" data-qstep="${c.id}|${a.step}">${a.label}</button>`:a.href?`<a class="${cls}" href="${a.href}" ${/^https?:/.test(a.href)?'target="_blank" rel="noopener"':''}>${a.label}</a>`:a.vst?`<button class="${cls}" type="button" data-vst="${a.vst}">${a.label}</button>`:a.snap?`<button class="${cls}" type="button" data-snap="${a.snap}">${a.label}</button>`:`<button class="${cls}" type="button" data-act="${a.act}" data-cid="${c.id}">${a.label}</button>`;

/* ---------- fix mistakes: every change can be undone for a few seconds, visits can be edited from any card, jobs can be deleted ---------- */
let UNDO=null;
addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button,a,[role=button],input[type=checkbox],input[type=radio]');if(!t||!t.closest('#owner,#layer')||t.closest('.oundo'))return;
  try{UNDO={s:JSON.stringify({c:DB.customers,d:DB.deleted||[]}),t:Date.now(),shown:false}}catch(x){UNDO=null}},true);
window.__onUndoable=()=>{if(!UNDO||UNDO.shown||Date.now()-UNDO.t>2500)return;UNDO.shown=true;const snap=UNDO.s;setTimeout(()=>{let now='';try{now=JSON.stringify({c:DB.customers,d:DB.deleted||[]})}catch(x){}if(now!==snap)undoBar(snap)},60)};
function undoBar(snap,msg){$$('.oundo').forEach(x=>x.remove());const tt=$$('body>.toast');if(tt.length){msg=msg||tt[tt.length-1].textContent;tt.forEach(x=>x.remove())}const el=document.createElement('div');el.className='oundo';el.setAttribute('role','status');
  el.innerHTML=`<span>${esc(msg||'Saved.')}</span><button type="button">Undo</button>`;document.body.appendChild(el);const tm=setTimeout(()=>el.remove(),8000);
  el.querySelector('button').onclick=()=>{clearTimeout(tm);el.remove();try{const o=JSON.parse(snap);DB.customers=o.c;DB.deleted=o.d;UNDO=null;save();$$('#layer .scrim').forEach(x=>x.remove());openOwner();toast('Undone.')}catch(x){toast('Couldn’t undo that one.')}}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-ved2]');if(!b||!b.closest('#owner,#layer'))return;e.preventDefault();e.stopPropagation();const[cid,vid]=b.dataset.ved2.split('|');visitSheet(cid,vid)},true);

/* ---------- shell ---------- */
const OPAGES={today:'Home',people:'Jobs',schedule:'Schedule',money:'Money',more:'More',team:'Cleaner & extras',mat:'Materials',avail:'Availability',numbers:'Numbers',job:''};
function openOwner(){if(CFG.backend&&!window.__ownerLive)return ownerGate();
  /* every booked inspection becomes a visit, so it shows on Home and Schedule (website bookings arrive with only a time) */
  DB.customers.forEach(c=>{if(c.appt&&c.appt.t&&!(c.job&&c.job.apptIn))ensureJob(c)});
  if(oTab==='job'&&!byId(oJob))oTab='people';
  const c=oTab==='job'?byId(oJob):null;
  const body=oTab==='today'?oHome():oTab==='people'?oJobs():oTab==='job'?oJobPage(c):oTab==='schedule'?oSchedule():oTab==='money'?oMoney():oTab==='more'?oMore():oTab==='team'?oTeam():oTab==='avail'?oAvail():oNumbers();
  const nav=[['today','home','Home'],['people','jobs','Jobs'],['plus','plus',''],['schedule','cal','Schedule'],['money','money','Money']];
  const sub=['team','avail','numbers'].includes(oTab);if(oTab==='mat')oTab='today';
  const el=full('owner',`<div class="ow">
    <aside class="oside"><div class="obrand"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 17 16 6l13 11" fill="none" stroke="#FFD400" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 15v11h16V15" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/></svg><span>Bayou Sparkle<small>Owner</small></span></div>
      <button class="oside-new" type="button" data-plus>${oi('plus')}New</button>
      ${[['today','home','Home'],['people','jobs','Jobs'],['schedule','cal','Schedule'],['money','money','Money'],['team','team','Cleaner & extras'],['numbers','chart','Numbers'],['avail','clock','Availability']].map(([k,i,l])=>`<button type="button" class="oside-i" data-otab="${k}" aria-current="${oTab===k||oTab==='job'&&k==='people'?'page':'false'}">${oi(i)}${l}</button>`).join('')}<button type="button" class="oside-i" data-go="conn">${oi('globe')}Connections</button>
      <div class="oside-foot"><button type="button" class="oside-i" id="oOut">${oi('globe')}Website</button>${CFG.backend?`<button type="button" class="oside-i" id="oSign">${oi('out')}Sign out</button>`:''}</div></aside>
    <div class="omain"><header class="otop">${oTab==='job'||sub||oTab==='more'?`<button class="oback" type="button" data-otab="${oTab==='job'?'people':oTab==='more'?'today':'more'}">${oi('back')}<span>${oTab==='job'?'Jobs':oTab==='more'?'Home':'More'}</span></button>`:`<span class="otop-brand"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 17 16 6l13 11" fill="none" stroke="#FFD400" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 15v11h16V15" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/></svg></span>`}
      <h1>${oTab==='job'?esc(c.name):OPAGES[oTab]}</h1><button class="otop-more" type="button" data-otab="more" aria-label="More">${oi('more')}<span>More</span></button></header>
      <div class="obody" id="obody">${body}</div></div>
    <nav class="obot" aria-label="Owner sections">${nav.map(([k,i,l])=>k==='plus'?`<button type="button" class="obot-plus" data-plus aria-label="New">${oi('plus')}</button>`:`<button type="button" data-otab="${k}" aria-current="${oTab===k||oTab==='job'&&k==='people'?'page':'false'}">${oi(i)}<span>${l}</span></button>`).join('')}</nav></div>`);
  $$('#owner [data-otab]').forEach(b=>b.onclick=()=>{oTab=b.dataset.otab;openOwner();const o=$('#owner');if(o)o.scrollTop=0});
  $$('#owner [data-plus]').forEach(b=>b.onclick=plusSheet);
  {const b=$('#oOut');if(b)b.onclick=()=>{closeFull('owner');if(location.hash==='#'+OWNER_KEY)history.replaceState(null,'',location.pathname+location.search)}}
  {const so=$('#oSign');if(so)so.onclick=()=>window.ownerSignOut()}
  bindOwner();if(oTab==='team')bindTeam();if(oTab==='avail')bindAvail();if(oTab==='job')bindJob(c);}
function bindOwner(){const ob=$('#obody');if(!ob)return;
  $$('#obody [data-open]').forEach(r=>r.addEventListener('click',e=>{if(e.target.closest('a,button:not([data-open]),input,select'))return;custSheet(r.dataset.open)}));
  $$('#obody [data-act]').forEach(b=>b.onclick=e=>{e.stopPropagation();const c=byId(b.dataset.cid);if(c)doAct(c,b.dataset.act)});
  $$('#obody [data-per]').forEach(b=>b.onclick=()=>{oPeriod=+b.dataset.per;openOwner()});
  $$('#obody [data-chip]').forEach(b=>b.onclick=()=>{oFilter=b.dataset.chip;openOwner()});
  const q=$('#oq');if(q){q.oninput=()=>{oQuery=q.value;const box=$('#ojlist');if(box){box.innerHTML=jobRows();bindOwner()}}}
  $$('#obody [data-go]').forEach(b=>b.onclick=()=>{oTab=b.dataset.go;openOwner()});
  {const a=$('#oadd');if(a)a.onclick=addSheet}
  $$('#obody [data-open]').forEach(r=>{const c=byId(r.dataset.open);if(c&&c.fresh){r.classList.add('fresh');c.fresh=false}});save()}
function custSheet(id){oJob=id;oTab='job';const cl=$('#layer');if(cl)cl.innerHTML='';openOwner();const o=$('#owner');if(o)o.scrollTop=0}
/* pages: every sheet is a full-screen page with a Back button in the owner app */
function sheetWrap(id,title,inner){return `<div class="scrim opage"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="${id}"><header class="ophead"><button class="oback" type="button" data-close>${oi('back')}<span>Back</span></button><h3 id="${id}">${title}</h3></header><div class="opbody">${inner}</div></div></div>`}

/* ---------- HOME ---------- */
function taskCard(c,o){const n=nextStep(c);return `<article class="otask ${o.cls||''}" data-open="${c.id}">
  <div class="otask-top"><span class="okick">${o.kick||n.k}</span>${o.badge||''}</div>
  <h3>${esc(c.name)}</h3><p class="otask-t">${o.t||n.t}</p>${(o.s||n.s)?`<p class="otask-s">${o.s||n.s}</p>`:''}
  <div class="otask-acts">${actBtn(c,o.p||n.p,'ob ob-main')}${(o.m||n.m).slice(0,2).map(a=>actBtn(c,a,'ob ob-line')).join('')}</div></article>`}
function oHome(){const C=DB.customers,now=Date.now(),td=todayIso();
  const visits=[];C.forEach(c=>visitsOf(c).forEach(v=>{if(v.date===td)visits.push([c,v])}));visits.sort((a,b)=>a[1].from.localeCompare(b[1].from));
  const leads=C.filter(c=>c.stage==='lead').sort((a,b)=>a.created-b.created);
  const A=(DB.activity||[]).filter(a=>!a.seen&&byId(a.cid)).slice().reverse();
  const nudge=C.filter(c=>c.stage==='estimate'&&c.estimate&&now-c.estimate.t>3*DAY);
  const bill=C.filter(readyToBill),unpaid=C.filter(c=>owed(c));
  const paidM=C.filter(c=>c.invoice&&c.invoice.status==='paid'&&MON(c.invoice.paidT)===MON(now)).length;
  const tasks=[...leads.map(c=>taskCard(c,{cls:now-c.created>36e5?'late':'',badge:`<span class="obadge ${now-c.created>36e5?'red':''}">${ago(c.created)}</span>`})),
    ...A.map(a=>{const c=byId(a.cid);return `<article class="otask fresh" data-open="${c.id}"><div class="otask-top"><span class="okick">From their portal</span><span class="obadge">${ago(a.t)}</span></div><h3>${esc(c.name)}</h3><p class="otask-t">${esc(a.text)}</p><div class="otask-acts"><button class="ob ob-main" type="button" data-seenopen="${a.t}">Open job</button><button class="ob ob-line" type="button" data-seen="${a.t}">Got it</button></div></article>`}),
    ...bill.map(c=>taskCard(c,{kick:'Ready to bill',t:`Send ${esc(first(c.name))} the invoice`,p:{label:'Add the invoice',act:'invoice'},m:[]})),
    ...nudge.map(c=>taskCard(c,{kick:'Estimate waiting',badge:`<span class="obadge">${ago(c.estimate.t)}</span>`})),
    ...unpaid.map(c=>taskCard(c,{kick:'Waiting for payment'}))];
  return `<section class="ohello"><p>${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p><h2>${greet()}, ${esc(ownerName)}</h2></section>
    ${setupBox()}
    <div class="ostats"><button type="button" data-go="money"><small>Not paid yet</small><b>${unpaid.length}</b></button><button type="button" data-go="money"><small>Paid this month</small><b>${paidM}</b></button><button type="button" data-go="schedule"><small>Visits today</small><b>${visits.length}</b></button></div>
    <div class="oquick">${[['add','user','New job'],['steps','check','Job steps'],['photos','cam','Post photos'],['invoice','file','Add invoice']].map(([k,i,l])=>`<button type="button" data-quick="${k}">${oi(i)}<span>${l}</span></button>`).join('')}</div>
    ${visits.length?`<h2 class="osec2">Today</h2><div class="olist">${visits.map(([c,v])=>visitCard(c,v)).join('')}</div>`:''}
    <h2 class="osec2">Needs you ${tasks.length?`<span class="ocount">${tasks.length}</span>`:''}</h2>
    ${tasks.length?`<div class="olist">${tasks.join('')}</div>`:`<div class="oempty">${oi('check')}<b>You’re all caught up.</b><span>New website requests show up here the moment they come in.</span></div>`}`}
function visitCard(c,v){const nx={scheduled:['confirmed','They confirmed'],confirmed:['onway','On my way'],onway:['arrived','I’m here'],arrived:['done','Done for today']}[v.status];const crew=(v.crew||[]).map(x=>(DB.crew||[]).find(m=>m.id===x)).filter(Boolean);
  return `<article class="ovisit vs2-${v.status}" data-open="${c.id}"><div class="ovisit-time"><b>${t12(v.from)}</b>${v.to?`<small>to ${t12(v.to)}</small>`:''}</div>
    <div class="ovisit-m"><span class="vstat vs-${v.status}">${vstName(v.status)}</span><h3>${esc(c.name)}</h3><p>${esc(VTYPE[v.type]||'Visit')} · ${esc((c.addr||'No address').split(',')[0])}</p>${crew.length?`<span class="jcrew">${crew.map(m=>avatar(m,28)).join('')}</span>`:''}
    <div class="otask-acts">${nx?`<button class="ob ob-main" type="button" data-vst="${c.id}|${v.id}|${nx[0]}">${nx[1]}</button>`:''}<a class="ob ob-line" href="${mapsUrl(c.addr)}" target="_blank" rel="noopener">${oi('pin')}Directions</a><button class="ob ob-line" type="button" data-ved2="${c.id}|${v.id}">Edit</button></div></div></article>`}

/* ---------- JOBS ---------- */
let oFilter='all',oQuery='';
const FILTERS=[['all','All',c=>c.stage!=='lost'],['lead','New',c=>c.stage==='lead'],['booked','Booked',c=>['booked','inspected'].includes(c.stage)],['estimate','Estimates',c=>['estimate','approved'].includes(c.stage)],['work','Working',c=>c.stage==='work'],['bill','To bill',readyToBill],['unpaid','Unpaid',c=>!!owed(c)],['paid','Paid',c=>c.stage==='paid'],['lost','Lost',c=>c.stage==='lost']];
function jobRows(){const f=(FILTERS.find(x=>x[0]===oFilter)||FILTERS[0])[2],q=oQuery.toLowerCase();
  const C=DB.customers.filter(f).filter(c=>!q||(c.name+' '+c.phone+' '+(c.addr||'')+' '+(c.email||'')).toLowerCase().includes(q)).sort((a,b)=>(b.created||0)-(a.created||0));
  return C.map(c=>{const n=nextStep(c);return `<article class="ojob" data-open="${c.id}"><span class="oinit st2-${c.stage}">${esc((c.name||'?')[0])}</span><div class="ojob-m"><div class="ojob-h"><h3>${esc(c.name)}</h3><span class="opill st2-${c.stage}">${stageName(c.stage)}</span></div>
    <p>${esc((c.addr||pretty(c.phone)||'').split(',')[0])}</p><p class="ojob-n">${oi('back','flip')}${esc(n.k)}: ${n.t.replace(/<[^>]+>/g,'')}</p></div></article>`}).join('')||`<div class="oempty">${oi('jobs')}<b>No jobs here yet.</b><span>Website requests land here automatically, or add one yourself.</span></div>`}
function oJobs(){return `<div class="osearch2"><label class="sr" for="oq">Search jobs</label><input id="oq" type="search" placeholder="Search name, phone or address" value="${esc(oQuery)}" autocomplete="off"><button class="ob ob-main" type="button" id="oadd">${oi('plus')}New job</button></div>
  <div class="ochips" role="group" aria-label="Filter">${FILTERS.map(([k,l,f])=>`<button type="button" data-chip="${k}" aria-pressed="${oFilter===k}">${l} <i>${DB.customers.filter(f).length}</i></button>`).join('')}</div>
  <div class="olist" id="ojlist">${jobRows()}</div>`}

/* ---------- JOB PAGE ---------- */

/* ---------- job sub-pages ---------- */
function visitsPage(c){const j=ensureJob(c),V=j.visits.slice().sort((a,b)=>(a.date+a.from).localeCompare(b.date+b.from));
  const close=open(sheetWrap('vpH','Visits · '+esc(first(c.name)),`${V.map(v=>`<div class="orow2"><div><b>${esc(VTYPE[v.type]||'Visit')}</b><small>${vWhen(v)}</small><span class="vstat vs-${v.status}">${vstName(v.status)}</span></div><div class="oacts">${v.status!=='done'&&v.status!=='cancelled'?statusBtns(c,v):''}<button class="ob ob-line" type="button" data-ved="${v.id}">Edit</button></div></div>`).join('')||'<p class="muted2">No visits yet.</p>'}
    <div class="obtns"><button class="ob ob-main" type="button" data-nv="inspection">Book free quote</button><button class="ob ob-line" type="button" data-nv="work">Add work day</button></div>`));
  $$('#layer [data-ved]').forEach(b=>b.onclick=()=>{close();visitSheet(c.id,b.dataset.ved)});$$('#layer [data-nv]').forEach(b=>b.onclick=()=>{close();visitSheet(c.id,null,b.dataset.nv)})}
function detailsPage(c){const close=open(sheetWrap('dtH','Details',`<div class="field"><label for="dn">Name</label><input id="dn" value="${esc(c.name)}"></div>
    <div class="two"><div class="field"><label for="dp">Mobile</label><input id="dp" type="tel" inputmode="tel" value="${esc(pretty(c.phone))}"></div><div class="field"><label for="de">Email</label><input id="de" type="email" value="${esc(c.email||'')}"></div></div>
    <div class="field"><label for="da">Address</label><input id="da" value="${esc(c.addr||'')}"></div><div class="field"><label for="ds">How they found you</label><input id="ds" value="${esc(c.source||'')}"></div>
    <div class="field"><label for="dno">Private notes (only you see these)</label><textarea id="dno" rows="3">${esc(c.notes||'')}</textarea></div>
    ${c.quote?`<div class="ocard2"><span class="okick">Instant estimate they saw</span><p>${esc(c.quote.verdict||c.quote.name||'')} ${esc(c.quote.range||'')}</p></div>`:''}${c.msg?`<div class="ocard2"><span class="okick">Their message</span><p>“${esc(c.msg)}”</p></div>`:''}
    ${c.photos&&c.photos.length?`<div class="pgrid">${c.photos.map(u=>`<img src="${u}" alt="">`).join('')}</div>`:''}
    <div class="obtns"><button class="ob ob-main" type="button" id="dgo">Save</button></div>`),'#dn');
  $('#dgo').onclick=()=>{c.name=$('#dn').value.trim()||c.name;const p=digits($('#dp').value);if(p.length===10)c.phone=p;c.email=$('#de').value.trim();c.addr=$('#da').value.trim();c.source=$('#ds').value.trim()||c.source;c.notes=$('#dno').value;save();close();custSheet(c.id);toast('Saved.')}}
function portalPage(c){const s=c.show=c.show||{},j=c.portal?ensureJob(c):null;
  const has={schedule:!!(c.appt||visitsOf(c).length),report:!!c.report,estimate:!!(c.estimate&&c.estimate.status!=='draft'),updates:!!(c.updates&&c.updates.length),invoice:!!(c.invoice&&c.invoice.status!=='draft'),materials:!!(c.matPlan&&c.matPlan.length),club:!!c.club};
  const lab={schedule:'Visit times and who’s coming',report:'Free quote report',estimate:'Estimate (they can approve it)',updates:'Job photos and updates',invoice:'Invoice with Pay button',materials:'What’s going in the home (no prices)',club:'Recurring plans plan'};
  const close=open(sheetWrap('ppH','Customer portal',`<label class="oswitch big"><input type="checkbox" id="ppOn" ${c.portal?'checked':''}><span></span><b>${c.portal?'On':'Off'}</b><small>${esc(first(c.name))} gets their own page: visit times, cleaner photos, approvals and bills.</small></label>
    ${c.portal?`<div class="ocard2 opin"><span class="okick">Their PIN</span><b class="opin-n">${j.pin}</b><small>${j.lang==='es'?'Reads it in Español':'Reads it in English'}</small></div>
      <div class="obtns"><a class="ob ob-main" href="${smsTo(c.phone,portalInvite(c))}">${oi('chat')}Text link + PIN</a>${c.email?`<a class="ob ob-line" href="mailto:${esc(c.email)}?subject=${encodeURIComponent(j.lang==='es'?'Su proyecto con Bayou Sparkle Home Cleaning':'Your Bayou Sparkle Home Cleaning project')}&body=${encodeURIComponent(portalInvite(c))}">${oi('mail')}Email it</a>`:''}<button class="ob ob-line" type="button" id="ppCopy">Copy link</button><button class="ob ob-line" type="button" id="ppPrev">See it as ${esc(first(c.name))}</button><button class="ob ob-line" type="button" id="ppPin">New PIN</button></div>
      <h4 class="osub">What ${esc(first(c.name))} can see</h4>${Object.keys(lab).map(k=>`<label class="oswitch ${has[k]?'':'off'}"><input type="checkbox" data-show="${k}" ${has[k]&&s[k]?'checked':''} ${has[k]?'':'disabled'}><span></span><b>${lab[k]}</b>${has[k]?'':'<small>Nothing made yet</small>'}</label>`).join('')}
      ${(DB.addons||[]).length?`<h4 class="osub">Extras they can add</h4>${DB.addons.map(a=>{const pk=j.picks.find(p=>p.addon===a.id);return`<label class="oswitch"><input type="checkbox" data-offer="${a.id}" ${j.addons.includes(a.id)?'checked':''}><span></span><b>${esc(a.name)} · ${usd(a.price)}</b>${pk?`<small>They added it${pk.status==='paid'?' · paid':''}</small>`:''}</label>${pk&&pk.status!=='paid'?`<button class="ob ob-line" type="button" data-pkpaid="${a.id}">Mark ${esc(a.name)} paid</button>`:''}`}).join('')}`:`<p class="muted2">Add extras (add-ons…) under More → Cleaner & extras.</p>`}
      ${j.log.length?`<h4 class="osub">What they did</h4><ul class="plist">${j.log.slice().reverse().slice(0,10).map(l=>`<li>${esc(l.text)} <small>${ago(l.t)}</small></li>`).join('')}</ul>`:''}`:''}`));
  $('#ppOn').onchange=e=>{c.portal=e.target.checked;if(c.portal)ensureJob(c);save();close();portalPage(c)};
  if(!c.portal)return;
  $('#ppCopy').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(portalUrl(c));toast('Link copied. Send the PIN with it.')};$('#ppPrev').onclick=()=>openPortal(c.id);
  $('#ppPin').onclick=()=>{j.pin=newPin();save();close();portalPage(c);toast('New PIN made. Send it to them.')};
  $$('#layer [data-show]').forEach(x=>x.onchange=()=>{s[x.dataset.show]=x.checked;save()});
  $$('#layer [data-offer]').forEach(x=>x.onchange=()=>{const k=x.dataset.offer;j.addons=x.checked?[...new Set(j.addons.concat([k]))]:j.addons.filter(a=>a!==k);save()});
  $$('#layer [data-pkpaid]').forEach(b=>b.onclick=()=>{const p=j.picks.find(p=>p.addon===b.dataset.pkpaid);p.status='paid';p.paidT=Date.now();save();close();portalPage(c)})}

/* ---------- INVOICE: 3 taps — Send invoice → check amount → Text it ---------- */

/* ---------- SCHEDULE ---------- */
function oSchedule(){const td=todayIso(),from=isoDay(Date.now()-2*DAY),to=isoDay(Date.now()+45*DAY),V=[];
  DB.customers.forEach(c=>visitsOf(c).forEach(v=>{if(v.date>=from&&v.date<=to)V.push([c,v])}));V.sort((a,b)=>(a[1].date+a[1].from).localeCompare(b[1].date+b[1].from));
  const days=[...new Set(V.map(x=>x[1].date))];const lbl=d=>d===td?'Today':d===isoDay(Date.now()+DAY)?'Tomorrow':new Date(d+'T12:00').toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'});
  return `<div class="obtns"><button class="ob ob-main" type="button" data-quick="visit">${oi('plus')}Add a visit</button></div>
    ${days.map(d=>`<h2 class="osec2 ${d<td?'past':''}">${lbl(d)}</h2><div class="olist">${V.filter(x=>x[1].date===d).map(([c,v])=>visitCard(c,v)).join('')}</div>`).join('')||`<div class="oempty">${oi('cal')}<b>Nothing scheduled.</b><span>Free quotes booked on the website and visits you add show up here.</span></div>`}`}

/* ---------- MONEY ---------- */

/* ---------- MORE ---------- */

/* ---------- + quick actions and job picker ---------- */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#owner [data-quick]');if(b){e.stopPropagation();quick(b.dataset.quick)}
  const m=e.target.closest&&e.target.closest('#mSite,#mOut');if(m){if(m.id==='mOut')window.ownerSignOut();else{closeFull('owner');if(location.hash==='#'+OWNER_KEY)history.replaceState(null,'',location.pathname+location.search)}}
  const so=e.target.closest&&e.target.closest('#owner [data-seenopen]');if(so){e.stopPropagation();const a=(DB.activity||[]).find(x=>String(x.t)===so.dataset.seenopen);if(a){a.seen=true;save();custSheet(a.cid)}}},true);
function pickJob(title,filter,cb){const L=DB.customers.filter(filter).sort((a,b)=>(b.created||0)-(a.created||0));
  const close=open(sheetWrap('pkH',title,`<div class="field"><input id="pkq" type="search" placeholder="Search name or address" aria-label="Search"></div><div class="olist" id="pkl"></div><div class="obtns"><button class="ob ob-line" type="button" id="pkNew">${oi('plus')}New job instead</button></div>`),'#pkq');
  const draw=q=>{$('#pkl').innerHTML=L.filter(c=>!q||(c.name+' '+(c.addr||'')+c.phone).toLowerCase().includes(q.toLowerCase())).map(c=>`<button type="button" class="opick" data-pk="${c.id}"><span class="oinit st2-${c.stage}">${esc((c.name||'?')[0])}</span><span><b>${esc(c.name)}</b><small>${esc((c.addr||pretty(c.phone)).split(',')[0])} · ${stageName(c.stage)}</small></span></button>`).join('')||'<p class="muted2">No matching jobs.</p>';
    $$('#pkl [data-pk]').forEach(b=>b.onclick=()=>{close();cb(byId(b.dataset.pk))})};draw('');$('#pkq').oninput=e=>draw(e.target.value);$('#pkNew').onclick=()=>{close();addSheet()}}
/* ============ Owner app v3 (Oct 8): a TRACKER, not an invoice/estimate/payments product ============
   We track and connect. Estimates and invoices are made in the owner's own tool (QuickBooks, Square, Roofr, Jobber, paper…):
   here they attach the link or a photo/PDF, the amount and the status. No payment links of ours, no e-sign, no material calculator.
   New: job progress (real roofing steps, one tap, customer sees it live), insurance claim tracking, material order tracking,
   Connections page (Google Calendar two-way, Slack, invoice status from QuickBooks/Square/Jobber via Zapier or Make). */

const JSTEPS=[["before", "Before the clean", [["contract", "Booking confirmed", 1], ["notes", "Home notes saved", 1], ["supplies", "Supplies packed", 0]]], ["day", "Clean day", [["arrived", "Team arrived", 1], ["kitchen", "Kitchen and baths done", 1], ["detail", "Detail work and floors", 1], ["final_check", "Final check with photos", 1], ["walkthrough", "Walkthrough with you", 1]]], ["after", "After the clean", [["feedback", "Feedback asked", 0], ["invoice", "Final invoice sent", 0], ["paid", "Paid", 0], ["review", "Review asked", 0]]]];
const CORE=["contract", "notes", "arrived", "kitchen", "detail", "final_check", "walkthrough"];
const stepOn=(c,k)=>k==='claim'?!!(c.ins&&c.ins.on):k==='hoa'?!!(c.prod&&c.prod.hoa):CORE.includes(k)||!!(c.prod&&c.prod.all);
const stepList=c=>JSTEPS.flatMap(([g,gl,L])=>L.filter(([k])=>stepOn(c,k)).map(([k,l,pub])=>({k,l,pub,g})));
const stepsDone=c=>((c.prod||{}).done)||{};
const progress=c=>{const L=stepList(c),d=stepsDone(c);return{n:L.filter(s=>d[s.k]).length,of:L.length,next:L.find(s=>!d[s.k])}};
function markStep(c,k,on,by){c.prod=c.prod||{};c.prod.done=c.prod.done||{};if(on)c.prod.done[k]={t:Date.now(),by:by||ownerName};else delete c.prod.done[k];
  if(on&&["arrived", "kitchen"].includes(k)&&c.stage==='approved')c.stage='work';if(on&&k==='contract'&&['lead','booked','inspected','estimate'].includes(c.stage))c.stage='approved';
  if(on&&k==='paid'&&c.invoice&&c.invoice.status!=='paid'){c.invoice.status='paid';c.invoice.paidT=Date.now();c.stage='paid'}}
const SUPPLIERS=["Sam’s Club", "Costco Business", "Waxie Sanitary Supply", "Home Depot", "Amazon Business", "Other"];
function chipsRow(id,list,cur){return`<div class="ochips2" id="${id}" role="radiogroup">${list.map(x=>`<button type="button" role="radio" aria-checked="${x===cur}" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>`}
function bindChips(id,cb){$$('#'+id+' [data-v]').forEach(b=>b.onclick=()=>{$$('#'+id+' [data-v]').forEach(x=>x.setAttribute('aria-checked',String(x===b)));cb&&cb(b.dataset.v)})}
const chipVal=id=>{const b=$('#'+id+' [aria-checked="true"]');return b?b.dataset.v:''};
/* attach a file: photos are shrunk, PDFs must be small (a link from their tool is better) */
function attachFile(f,cb){if(!f)return;if(/^image\//.test(f.type))return readPhoto(f,1400,cb);if(f.type!=='application/pdf'){toast('Use a photo or a PDF.');return}
  if(f.size>700e3){toast('That PDF is too big. Paste the link from your invoicing app instead.');return}const r=new FileReader();r.onload=()=>cb(r.result);r.readAsDataURL(f)}
const docBtn=(d,label)=>d&&(d.link||d.file)?`<a class="ob ob-line" href="${esc(d.link||d.file)}" target="_blank" rel="noopener" ${d.file&&!d.link?'download':''}>${oi('file')}${label}</a>`:'';

/* ---------- ESTIMATE (tracked, made in their tool) ---------- */
function estSheet(id){const c=byId(id);estPage(c,true)}

/* ---------- INVOICE (tracked, made in their tool) ---------- */

/* ---------- CHANGE ORDERS: still here (decking is almost always one), but no payment links: it goes on their invoice ---------- */
function coSheet(id,ix){const c=byId(id),j=ensureJob(c),o=ix!=null?j.changes[ix]:null,pics=o?(o.photos||[]).slice():[];
  const close=open(sheetWrap('coH',(o?'Edit':'New')+' change: '+esc(first(c.name)),`<p class="muted2" style="margin-top:0">Extra work found in the home. ${esc(first(c.name))} sees the photos and price in their portal and taps OK. It goes on your final invoice.${j.lang==='es'?' They read Spanish: write it in Spanish.':''}</p>
    <div class="obig-grid">${[["Recurring cleaning", "Recurring cleaning", ""], ["Deep cleaning", "Deep cleaning", ""], ["Move-in and move-out cleaning", "Move-in and move-out cleaning", ""], ["Other", "", ""]].map(([l,t])=>`<button class="ob ob-line" type="button" data-cot="${esc(t)}">${l}</button>`).join('')}</div>
    <div class="field"><label for="cot">What</label><input id="cot" value="${esc(o?o.title:'')}" placeholder="Recurring cleaning"></div>
    <div class="field"><label for="cow">Why (plain words)</label><textarea id="cow" rows="2" placeholder="What you found and why it needs doing.">${esc(o?o.why:'')}</textarea></div>
    <div class="field"><label for="cop">Price</label><input id="cop" inputmode="decimal" value="${o?o.price:''}" placeholder="$"></div>
    <div class="field"><span class="flabel">Photos of the problem</span><label class="upl" for="cof"><span>Add photos</span><input id="cof" type="file" accept="image/*" capture="environment" multiple></label><div class="thumbs" id="coth">${pics.map(u=>`<img src="${u}" alt="">`).join('')}</div></div>
    <p class="err" id="coe" role="alert" hidden></p><div class="obtns"><button class="ob ob-main ob-xl" type="button" id="cogo">${o?'Save':'Send to their portal'}</button>${o?`<button class="ob ob-line" type="button" id="codel">Delete this change</button>`:''}</div>`),'#cot');
  $$('#layer [data-cot]').forEach(b=>b.onclick=()=>{const t=$('#cot');t.value=b.dataset.cot;t.focus()});
  $('#cof').onchange=e=>{[...e.target.files].slice(0,6).forEach(f=>readPhoto(f,1000,u=>{pics.push(u);$('#coth').innerHTML=pics.map(u=>`<img src="${u}" alt="">`).join('')}))};
  const del=$('#codel');if(del)del.onclick=()=>{j.changes.splice(ix,1);save();close();changesPage(c)};
  $('#cogo').onclick=()=>{const t=$('#cot').value.trim(),p=+String($('#cop').value).replace(/[^\d.]/g,'');if(!t||!p){$('#coe').textContent='Add what it is and the price.';$('#coe').hidden=false;return}
    const n={title:t,why:$('#cow').value.trim(),price:p,photos:pics};if(o)Object.assign(o,n);else j.changes.push(Object.assign({id:'co'+Math.random().toString(36).slice(2,7),t:Date.now(),status:'waiting'},n));
    if(!o&&/deck/i.test(t))markStep(c,'decking',true);c.portal=true;save();close();changesPage(c);toast('In their portal now. Text them so they look.')}}
function changesPage(c){const j=ensureJob(c);
  const close=open(sheetWrap('chP','Changes · '+esc(first(c.name)),`<p class="muted2" style="margin-top:0">Extra work found on the job. ${esc(first(c.name))} OKs it in their portal${c.portal?'':' (turn the portal on to send these)'}. Add approved changes to your final invoice.</p>
    ${j.changes.map((o,i)=>`<div class="orow2"><div><b>${esc(o.title)} · ${usd(o.price)}</b><small>${{waiting:'Waiting for their OK',approved:'Approved'+(o.signed?' by '+esc(o.signed):''),declined:'They said not now',paid:'Approved'}[o.status]}</small></div><div class="oacts">${o.status==='waiting'?`<button class="ob ob-line" type="button" data-coyes="${i}">They OK’d it</button>`:''}<button class="ob ob-line" type="button" data-coed="${i}">Edit</button></div></div>`).join('')||'<p class="muted2">None yet.</p>'}
    <div class="obtns"><button class="ob ob-main" type="button" id="coNew">${oi('plus')}New change</button></div>`));
  $('#coNew').onclick=()=>{close();coSheet(c.id)};$$('#layer [data-coed]').forEach(b=>b.onclick=()=>{close();coSheet(c.id,+b.dataset.coed)});
  $$('#layer [data-coyes]').forEach(b=>b.onclick=()=>{const o=j.changes[+b.dataset.coyes];Object.assign(o,{status:'approved',signed:'(you marked it)',signedT:Date.now()});save();close();changesPage(c)})}

/* ---------- JOB PROGRESS: the real roofing steps, one tap each. The crew does the same from crew.html ---------- */
function progressPage(c){const d=stepsDone(c),p=progress(c);c.prod=c.prod||{};
  const row=s=>{const x=d[s.k];return`<label class="ostep ${x?'done':''}"><input type="checkbox" data-step="${s.k}" ${x?'checked':''}><span class="ostep-b">${oi('check')}</span><span class="ostep-t"><b>${esc(s.l)}</b><small>${x?`${fmtDay(x.t)} ${new Date(x.t).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})} · ${esc(x.by||'')}`:s.pub?'Customer sees this':'Only you and the cleaner'}</small></span></label>`};
  const close=open(sheetWrap('prH','Progress · '+esc(first(c.name)),`<div class="obar2"><i style="width:${Math.round(p.n/Math.max(1,p.of)*100)}%"></i></div><p class="muted2">${p.n} of ${p.of} done${p.next?` · next: <b>${esc(p.next.l)}</b>`:' · all done'}</p>
    <div class="otogs"><label class="oswitch"><input type="checkbox" id="prAll" ${c.prod.all?'checked':''}><span></span><b>More steps</b><small>Supplies packed, Feedback asked, Final invoice sent, Paid, Review asked…</small></label><label class="oswitch" hidden><input type="checkbox" id="prIns" ${c.ins&&c.ins.on?'checked':''}><span></span><b>Insurance job</b></label><label class="oswitch" hidden><input type="checkbox" id="prHoa" ${c.prod.hoa?'checked':''}><span></span><b>Needs HOA approval</b></label></div>
    ${JSTEPS.map(([g,gl])=>`<h4 class="osub">${gl}</h4><div class="osteps">${stepList(c).filter(s=>s.g===g).map(row).join('')}</div>`).join('')}
    ${c.prod.all?`<div class="ocard2"><span class="okick">Permit</span><div class="two"><div class="field"><label for="prPn">Permit #</label><input id="prPn" value="${esc(c.prod.permit||'')}" placeholder="City of Houston iPermits #"></div><div class="field"><label for="prPd">City free quote date</label><input id="prPd" type="date" value="${esc(c.prod.inspDate||'')}"></div></div></div>`:''}
    ${c.portal?'':'<p class="muted2">Turn on the customer portal so they can follow along.</p>'}`));
  $$('#layer [data-step]').forEach(x=>x.onchange=()=>{markStep(c,x.dataset.step,x.checked);save();close();progressPage(c)});
  $('#prAll').onchange=e=>{c.prod.all=e.target.checked;save();close();progressPage(c)};
  $('#prIns').onchange=e=>{c.ins=c.ins||{};c.ins.on=e.target.checked;save();close();progressPage(c)};$('#prHoa').onchange=e=>{c.prod.hoa=e.target.checked;save();close();progressPage(c)};
  const pn=$('#prPn');if(pn){pn.onchange=e=>{c.prod.permit=e.target.value.trim();save()};$('#prPd').onchange=e=>{c.prod.inspDate=e.target.value;save()}}}

/* ---------- INSURANCE CLAIM: what roofers track, nothing more (Texas: the homeowner pays the deductible; no public-adjuster talk) ---------- */
function insurancePage(c){const i=c.ins=c.ins||{};const f=(k,l,ph,t)=>`<div class="field"><label for="in_${k}">${l}</label><input id="in_${k}" ${t?`type="${t}"`:''} ${t==='money'?'inputmode="decimal"':''} value="${esc(i[k]||'')}" placeholder="${ph||''}"></div>`;
  const close=open(sheetWrap('inH','Insurance · '+esc(first(c.name)),`<label class="oswitch big"><input type="checkbox" id="inOn" ${i.on?'checked':''}><span></span><b>This is an insurance job</b><small>Adds “Insurance approved” to the job steps.</small></label>
    <div class="two">${f('carrier','Insurance company','State Farm')}${f('claim','Claim #')}</div><div class="two">${f('loss','Date of loss','', 'date')}${f('meet','Adjuster meeting','', 'date')}</div>
    <div class="two">${f('adj','Adjuster name')}${f('adjPh','Adjuster phone','', 'tel')}</div>
    <div class="two">${f('rcv','RCV (full value)','$','money')}${f('acv','ACV (first check)','$','money')}</div><div class="two">${f('dep','Depreciation held back','$','money')}${f('ded','Deductible (homeowner pays)','$','money')}</div>
    <div class="field"><span class="flabel">Supplement</span>${chipsRow('inSup',['None','Sent','Approved','Denied'],i.sup||'None')}</div>
    <div class="field"><span class="flabel">Insurance check</span>${chipsRow('inChk',['Not yet','With the mortgage company','Endorsed','Deposited'],i.chk||'Not yet')}</div>
    <div class="field"><span class="flabel">Depreciation</span>${chipsRow('inDep',['Not requested','Requested','Released'],i.depSt||'Not requested')}</div>
    <p class="muted2">Texas law: the homeowner pays the deductible, and cleaners can’t act as the public adjuster. Track the claim here; don’t promise to cover the deductible.</p>
    <div class="obtns"><button class="ob ob-main ob-xl" type="button" id="inGo">Save</button>${i.meet?'':`<button class="ob ob-line" type="button" id="inMeet">Add adjuster meeting to the schedule</button>`}</div>`));
  ['inSup','inChk','inDep'].forEach(x=>bindChips(x));
  const grab=()=>{['carrier','claim','loss','meet','adj','adjPh','rcv','acv','dep','ded'].forEach(k=>i[k]=$('#in_'+k).value.trim());i.on=$('#inOn').checked;i.sup=chipVal('inSup');i.chk=chipVal('inChk');i.depSt=chipVal('inDep')};
  $('#inGo').onclick=()=>{grab();save();close();custSheet(c.id);toast('Saved.')};
  const m=$('#inMeet');if(m)m.onclick=()=>{grab();i.on=true;save();close();visitSheet(c.id,null,'adjuster')}}

/* ---------- MATERIALS: track the order and delivery, list for the crew. Ordering and prices stay with the supplier ---------- */
function matSheet(id){const c=byId(id),m=c.mat=c.mat||{};let ph=(m.photos||[]).slice();
  const close=open(sheetWrap('mtH','Materials · '+esc(first(c.name)),`<div class="field"><span class="flabel">Supplier</span>${chipsRow('mtSup',SUPPLIERS,m.sup||'')}</div>
    <div class="two"><div class="field"><label for="mtPo">Order / PO #</label><input id="mtPo" value="${esc(m.po||'')}"></div><div class="field"><label for="mtD">Delivery day</label><input id="mtD" type="date" value="${esc(m.date||'')}"></div></div>
    <div class="field"><label for="mtL">What’s coming (one line each; the cleaner sees this)</label><textarea id="mtL" rows="4" placeholder="What’s being delivered, one line each">${esc((c.matPlan||[]).map(x=>(x.qty?x.qty+' '+(x.unit||'')+' ':'')+x.desc).join('\n'))}</textarea></div>
    <div class="field"><span class="flabel">Delivery ticket or photo (optional)</span><label class="upl" for="mtF"><span>Add photo</span><input id="mtF" type="file" accept="image/*" capture="environment"></label><div class="thumbs" id="mtTh">${ph.map(u=>`<img src="${u}" alt="">`).join('')}</div></div>
    <label class="oswitch"><input type="checkbox" id="mtShow" ${(c.show||{}).materials?'checked':''}><span></span><b>Show the list in their portal</b><small>No prices, just what’s going on their home.</small></label>
    <div class="obtns"><button class="ob ob-main ob-xl" type="button" id="mtGo">Save</button><button class="ob ob-line" type="button" id="mtDel">${stepsDone(c).mat_delivered?'Delivered ✓':'Mark delivered'}</button></div>`),'#mtPo');
  bindChips('mtSup');$('#mtF').onchange=e=>{const f=e.target.files[0];if(f)readPhoto(f,1200,u=>{ph.push(u);$('#mtTh').innerHTML=ph.map(u=>`<img src="${u}" alt="">`).join('')})};
  const grab=()=>{Object.assign(m,{sup:chipVal('mtSup'),po:$('#mtPo').value.trim(),date:$('#mtD').value,photos:ph.slice(-4)});c.matPlan=$('#mtL').value.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>({desc:x,qty:'',unit:''}));
    c.show=c.show||{};c.show.materials=$('#mtShow').checked;if(m.sup||m.po)markStep(c,'mat_ordered',true)};
  $('#mtGo').onclick=()=>{grab();save();close();custSheet(c.id);toast('Saved.')};
  $('#mtDel').onclick=()=>{grab();markStep(c,'mat_delivered',true);save();close();custSheet(c.id);toast('Marked delivered.')}}

/* ---------- CONNECTIONS: we connect the tools they already pay for ---------- */
let CONN=null;
function connPage(){open(sheetWrap('cnH','Connections','<p class="muted2">Loading…</p>'));
  const draw=()=>{const C=CONN||{};open(sheetWrap('cnH','Connections',`<p class="muted2" style="margin-top:0">This app keeps track of the job. Your other tools keep doing their job. Connect them here so everything shows up in one place.</p>
    <section class="ocard2 oconn"><span class="okick">Google Calendar · ${C.calendar?'connected':'…'}</span><b>${esc(C.calendar||'Your bookings calendar')}</b><p>Every visit in this app is on that calendar. Move or delete it there and the app follows (within a minute or two). Website bookings land there too.</p></section>
    <section class="ocard2 oconn"><span class="okick">Slack · ${C.slack?'<span class="okc">connected</span>':'not connected'}</span><b>Get every update in a Slack channel</b><p>New requests, bookings, cleaner “on my way / done”, job steps, customer approvals.</p>
      <ol class="osmall"><li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener">api.slack.com/apps</a> → Create New App → From scratch.</li><li>Incoming Webhooks → turn it on → Add New Webhook → pick a channel.</li><li>Copy the link (starts with https://hooks.slack.com/services/) and paste it here.</li></ol>
      <div class="field"><label for="cnS">Slack webhook link</label><input id="cnS" type="url" placeholder="https://hooks.slack.com/services/…" value=""></div>
      <div class="obtns"><button class="ob ob-main" type="button" id="cnSgo">${C.slack?'Replace':'Connect'}</button>${C.slack?`<button class="ob ob-line" type="button" id="cnSt">Send a test</button><button class="ob ob-line" type="button" id="cnSx">Disconnect</button>`:''}</div></section>
    <section class="ocard2 oconn"><span class="okick">Invoices · ${C.zap?'<span class="okc">on</span>':'off'}</span><b>QuickBooks, Square, Jobber, FreshBooks</b><p>Keep invoicing where you do now. A small automation in Zapier or Make sends each invoice and its “paid” status here, so the job and the customer’s portal update by themselves.</p>
      ${C.zap?`<div class="field"><label>Send to (Webhook URL)</label><input readonly value="${esc(CFG.backend)}" onclick="this.select()"></div>
        <div class="field"><label>Body (JSON)</label><textarea readonly rows="5" onclick="this.select()">{"action":"inv_hook","secret":"${esc(C.zap)}","source":"QuickBooks","phone":"{customer phone}","email":"{customer email}","name":"{customer name}","number":"{invoice #}","amount":"{total}","balance":"{balance}","link":"{invoice link}"}</textarea></div>
        <p class="muted2">Trigger: “New invoice” and “Invoice updated / paid” in your app. Make’s free plan works; Zapier needs a paid plan for webhooks.</p><div class="obtns"><button class="ob ob-line" type="button" id="cnZn">New secret</button><button class="ob ob-line" type="button" id="cnZx">Turn off</button></div>`
      :`<div class="obtns"><button class="ob ob-main" type="button" id="cnZ">Turn on</button></div>`}</section>
    <section class="ocard2 oconn"><span class="okick">Texts</span><b>Twilio</b><p>Customer confirmations and reminders. Set up by us; status shows on your Home page.</p></section>
    <section class="ocard2 oconn"><span class="okick">Photos</span><b>CompanyCam (optional)</b><p>Already use CompanyCam? Paste a job’s timeline link on its Photos page and the customer gets a “See every photo” button.</p></section>`));
    const post=async(o,ok)=>{try{const r=await ownerPost(Object.assign({token:otok()},o));if(r.ok){CONN=r;draw();if(ok)toast(ok)}else toast(r.reason==='slack'?'That doesn’t look like a Slack webhook link.':'Didn’t work. Try again.')}catch(x){toast('Couldn’t reach the server.')}};
    $('#cnSgo').onclick=()=>{const u=$('#cnS').value.trim();if(!/^https:\/\/hooks\.slack\.com\/services\//.test(u)){toast('Paste the link that starts with https://hooks.slack.com/services/');return}post({action:'conn_set',slack:u},'Slack connected. Sending a test…').then(()=>post({action:'conn_test'},'Test sent. Check your channel.'))};
    const t=$('#cnSt');if(t)t.onclick=()=>post({action:'conn_test'},'Test sent. Check your channel.');const x=$('#cnSx');if(x)x.onclick=()=>post({action:'conn_set',slack:''},'Slack disconnected.');
    const z=$('#cnZ');if(z)z.onclick=()=>post({action:'conn_set',zap:'new'},'Invoice sync is on. Copy the details into Zapier or Make.');const zn=$('#cnZn');if(zn)zn.onclick=()=>post({action:'conn_set',zap:'new'},'New secret made. Update your automation.');const zx=$('#cnZx');if(zx)zx.onclick=()=>post({action:'conn_set',zap:'off'},'Invoice sync is off.')};
  if(!CFG.backend||!otok()){CONN={};draw();return}
  ownerPost({action:'conn_get',token:otok()}).then(r=>{CONN=r.ok?r:{};draw()}).catch(()=>{CONN={};draw()})}

/* ---------- photos page: + CompanyCam link ---------- */
function plusSheet(){const close=open(sheetWrap('plH','What do you need?',`<div class="obig-grid">${[['add','user','New job','Someone called or stopped you'],['steps','check','Job steps',"Team arrived, Kitchen and baths done…"],['visit','cal','Add a visit','Free quote or work day'],['photos','cam','Post photos','Update from the home'],['invoice','file','Add an invoice','Paste the QuickBooks or Square link'],['paid','check','Record a payment','Check, cash, card']].map(([k,i,l,s])=>`<button type="button" class="obig-btn" data-quick="${k}">${oi(i)}<b>${l}</b><small>${s}</small></button>`).join('')}</div>`));
  $$('#layer [data-quick]').forEach(b=>b.onclick=()=>{close();quick(b.dataset.quick)})}
function quick(k){if(k==='add')return addSheet();
  const cfg={steps:['Which job?',c=>['approved','work','invoiced','paid'].includes(c.stage)||!!(c.prod&&c.prod.done),c=>progressPage(c)],invoice:['Invoice for who?',c=>c.stage!=='lost',c=>invoicePage(c)],visit:['Visit for who?',c=>c.stage!=='lost',c=>visitSheet(c.id,null,['lead','booked'].includes(c.stage)?'inspection':'work')],photos:['Photos for which job?',c=>c.stage!=='lost',c=>updSheet(c.id)],paid:['Who paid?',c=>!!owed(c)||readyToBill(c)||c.stage==='approved'||c.stage==='work',c=>paidSheet(c)]}[k];
  if(cfg)pickJob(cfg[0],cfg[1],cfg[2])}
function deleteSheet(c){const f=first(c.name),future=c.appt&&c.appt.t>Date.now();
  const close=open(sheetWrap('dlH','Delete '+esc(f)+'’s job?',`<p class="muted">Removes ${esc(c.name)} and everything on this job (visits, steps, photos, invoice tracking) from your owner view on every device, and takes the visits off your Google Calendar. Use this for test bookings, duplicates or mistakes. If they just said no, use “Mark as lost” instead so your numbers stay honest.</p>
    ${future?`<label class="tog"><input type="checkbox" id="dlTell"> Text/email ${esc(f)} that the ${esc(fmtDay(c.appt.t))} free quote is cancelled</label>`:''}
    <div class="obtns"><button class="ob ob-danger" type="button" id="dlGo">Delete job</button><button class="ob ob-line" type="button" data-close>Keep it</button></div>`));
  $('#dlGo').onclick=async()=>{const tell=future&&$('#dlTell').checked,b=$('#dlGo');b.disabled=true;
    if(tell&&CFG.backend&&otok()){try{await ownerPost({action:'appt_owner_cancel',token:otok(),phone:c.phone,t:c.appt.t,notify:true})}catch(x){toast('Couldn’t reach the server to tell them. Text them yourself.')}}
    DB.customers=DB.customers.filter(x=>x!==c);DB.deleted=(DB.deleted||[]).concat([{id:c.id,leadKey:c.leadKey||'',t:Date.now()}]).slice(-500);save();close();oTab='people';openOwner();toast(tell?'Deleted. '+f+' was told.':'Deleted.')}}

/* ---------- next step + job page, rebuilt around the tracker ---------- */
function nextStep(c){const f=first(c.name),v=nextVisit(c),today=v&&v.date===todayIso(),p=progress(c);
  const visitAct=v&&today&&!['estimate','invoiced','paid','lost'].includes(c.stage)?({scheduled:['confirmed','They confirmed'],confirmed:['onway','On my way'],onway:['arrived','I’m here'],arrived:['done','Done for today']})[v.status]:null;
  if(visitAct&&v.type==='work'&&v.status==='arrived'&&p.next)return{k:'On the home · '+p.n+'/'+p.of+' steps',t:'Next: '+esc(p.next.l),p:{label:'✓ '+p.next.l,step:p.next.k},m:[{label:'Job steps',act:'progress'},{label:'Add a change',act:'change'},{label:'Post photos',act:'update'},{label:'Done for today',vst:`${c.id}|${v.id}|done`}]};
  if(visitAct)return{k:'Today · '+(VTYPE[v.type]||'Visit'),t:`${t12(v.from)}${v.to?'–'+t12(v.to):''} at ${esc((c.addr||'').split(',')[0]||'their place')}`,p:{label:visitAct[1],vst:`${c.id}|${v.id}|${visitAct[0]}`},m:[{label:'Directions',href:mapsUrl(c.addr)},{label:'Job steps',act:'progress'},{label:'Who’s going (photos)',snap:`${c.id}|${v.id}`}]};
  switch(c.stage){
    case'lead':return{k:'New request',t:`Answer ${esc(f)} and book the free quote`,s:c.msg?`“${esc(c.msg)}”`:'',p:{label:'Text '+esc(f),href:smsTo(c.phone,`Hi ${f}, this is ${ownerName} with Bayou Sparkle Home Cleaning. Got your request. What day works for a free quote?`)},m:[{label:'Book free quote',act:'book'},{label:'Call',href:'tel:+1'+c.phone}]};
    case'booked':return{k:'Free quote booked',t:v?vWhen(v):'Free quote time not set',p:{label:'Add free quote photos & notes',act:'update'},m:[{label:v?'Change time':'Set time',act:v?'visits':'book'},{label:'Directions',href:mapsUrl(c.addr)}]};
    case'inspected':return{k:'Visited',t:`Send ${esc(f)} the estimate`,s:'Make it in your estimate app, then paste the link or upload it here.',p:{label:'Add the estimate',act:'estimate'},m:[{label:'See photos & notes',act:'updates'}]};
    case'estimate':return{k:'Estimate sent',t:`Waiting on ${esc(f)}`,s:c.estimate?`Sent ${ago(c.estimate.t)}`:'',p:{label:'They said yes',act:'approve'},m:[{label:'Text a check-in',href:smsTo(c.phone,`Hi ${f}, ${ownerName} with Bayou Sparkle. Any questions on the estimate? Happy to walk through it.`)},{label:'They said no',act:'lost'}]};
    case'approved':return{k:'Approved',t:p.next?'Next: '+esc(p.next.l):'Schedule the work day',p:{label:'Add work day',act:'work'},m:[{label:'Materials order',act:'mat'},{label:'Job steps',act:'progress'}]};
    case'work':return{k:'Job in progress',t:p.next?`${p.n}/${p.of} steps · next: ${esc(p.next.l)}`:'All steps done',p:p.next?{label:'✓ '+p.next.l,step:p.next.k}:{label:'Add the invoice',act:'invoice'},m:[{label:'Job steps',act:'progress'},{label:'Post photos',act:'update'},{label:'Add a change',act:'change'},{label:'Add the invoice',act:'invoice'}]};
    case'invoiced':return{k:'Invoice sent',t:'Waiting for payment',s:c.invoice?`Added ${ago(c.invoice.t)}`:'',p:{label:'Mark paid',act:'paid'},m:[{label:'See the invoice',act:'invpage'},{label:'Text a reminder',href:smsTo(c.phone,`Hi ${f}, friendly reminder: your Bayou Sparkle invoice is ready.${c.invoice&&c.invoice.link?' View and pay: '+c.invoice.link:c.portal?' See it here: '+portalUrl(c):''}`)}]};
    case'paid':return{k:'Paid',t:'Ask for a review while they’re happy',p:{label:'Text a thank-you',href:smsTo(c.phone,`Hi ${f}, thank you for choosing Bayou Sparkle Home Cleaning! If you have a minute, a quick review would mean a lot: ${new URL('review.html?n='+encodeURIComponent(f),location.href).href}`)},m:[{label:'Job steps',act:'progress'},{label:'Book another job',act:'book'}]};
    case'lost':return{k:'Lost',t:esc(c.lostReason||'No reason given'),p:{label:'Reopen job',act:'reopen'},m:[]};}
  return{k:stageName(c.stage),t:'',p:{label:'Open',act:'details'},m:[]}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-qstep]');if(!b||!b.closest('#owner,#layer'))return;e.preventDefault();e.stopPropagation();
  const[cid,k]=b.dataset.qstep.split('|'),c=byId(cid);if(!c)return;markStep(c,k,true);save();openOwner();toast('✓ '+(stepList(c).find(s=>s.k===k)||{}).l)},true);
function doAct(c,a){const id=c.id;({book:()=>visitSheet(id,null,'inspection'),visits:()=>jobSheet(id,'visits'),report:()=>reportSheet(id),estimate:()=>estPage(c),approve:()=>approveSheet(c),work:()=>visitSheet(id,null,'work'),
  update:()=>updSheet(id),updates:()=>jobSheet(id,'updates'),invoice:()=>invoicePage(c),invpage:()=>invoicePage(c),paid:()=>paidSheet(c),mat:()=>matSheet(id),change:()=>coSheet(id),details:()=>jobSheet(id,'details'),
  progress:()=>progressPage(c),ins:()=>insurancePage(c),del:()=>deleteSheet(c),
  lost:()=>{c.stage='lost';c.lostT=Date.now();save();lostAsk(c,()=>custSheet(id))},reopen:()=>{c.stage='lead';delete c.lostReason;delete c.lostT;save();custSheet(id)}}[a]||(()=>{}))()}
function jobSheet(id,sec){if(!sec){custSheet(id);return}const c=byId(id);if(!c)return;({visits:visitsPage,updates:updatesPage,details:detailsPage,portal:portalPage,estimate:x=>estPage(x),invoice:x=>invoicePage(x),changes:changesPage,progress:progressPage,ins:insurancePage,mat:x=>matSheet(x.id)}[sec]||(()=>custSheet(id)))(c)}
function oJobPage(c){const n=nextStep(c),j=c.job||{},si=STEP8.findIndex(s=>s[0]===c.stage),V=visitsOf(c),nv=nextVisit(c),p=progress(c);
  const est=hasDoc(c.estimate)?c.estimate:null,ch=(j.changes||[]),wait=ch.filter(o=>o.status==='waiting').length,ups=(c.updates||[]).length+(c.report?1:0),inv=hasDoc(c.invoice)||c.invoice&&c.invoice.status==='paid'?c.invoice:null,m=c.mat||{};
  const tile=(k,i,l,v,s,cls='')=>`<button type="button" class="otile ${cls}" data-sec="${k}">${oi(i)}<span class="otile-l">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:''}</button>`;
  const pBtn=n.p.step?`<button class="ob ob-main ob-xl" type="button" data-qstep="${c.id}|${n.p.step}">${esc(n.p.label)}</button>`:actBtn(c,n.p,'ob ob-main ob-xl');
  return `<section class="jhead"><div class="jhead-m"><span class="opill st2-${c.stage}">${stageName(c.stage)}</span><p>${c.addr?`<a href="${mapsUrl(c.addr)}" target="_blank" rel="noopener">${oi('pin')}${esc(c.addr)}</a>`:'<span class="muted2">No address yet</span>'}</p><small>${esc(c.source||'')} · ${ago(c.created||Date.now())}${c.contactPref?' · prefers '+esc(c.contactPref):''}</small></div>
    <div class="jcontact"><a href="${smsTo(c.phone,`Hi ${first(c.name)}, it’s ${ownerName} with Bayou Sparkle. `)}">${oi('chat')}Text</a><a href="tel:+1${c.phone}">${oi('phone')}Call</a>${c.email?`<a href="mailto:${esc(c.email)}">${oi('mail')}Email</a>`:`<a aria-disabled="true" class="off">${oi('mail')}Email</a>`}<a href="${mapsUrl(c.addr)}" target="_blank" rel="noopener">${oi('pin')}Map</a></div></section>
  <section class="onext"><span class="okick">Next step · ${n.k}</span><h2>${n.t}</h2>${n.s?`<p>${n.s}</p>`:''}${pBtn}${n.m.length?`<div class="onext-more">${n.m.map(a=>actBtn(c,a,'ob ob-line')).join('')}</div>`:''}</section>
  ${stageBar(c)}
  <div class="otiles">
    ${tile('progress','check','Job steps',`${p.n}/${p.of}`,p.next?'Next: '+esc(p.next.l):'All done',p.n===p.of?'good':'')}
    ${tile('visits','cal','Visits',V.length,nv?vWhen(nv):'None scheduled')}
    ${tile('estimate','file','Estimate',est?(est.status==='approved'?'Yes':est.status==='declined'?'No':'Sent'):'—',est?(est.status==='approved'?'They said yes':est.status==='declined'?'They said no':'Waiting for an answer'):'Paste link or upload')}
    ${tile('updates','cam','Photos & notes',ups,ups?'Free quote and job photos':'Nothing yet')}
    ${tile('changes','tool','Changes',ch.length,wait?wait+' waiting for OK':'Extra work found','' + (wait?'warn':''))}
    ${tile('mat','truck','Materials',m.sup?esc(m.sup):'—',m.date?'Delivery '+fmtDay(new Date(m.date+'T12:00').getTime()):'Order and delivery')}
    ${tile('invoice','money','Invoice',inv?(inv.status==='paid'?'Paid':'Sent'):'—',inv?(inv.status==='paid'?fmtDay(inv.paidT):'Not paid yet'):'Paste link or upload',inv&&inv.status==='paid'?'good':'')}
    ${tile('portal','key','Customer portal',c.portal?'On':'Off',c.portal?'PIN '+ensureJob(c).pin:'Their own page')}
    ${tile('details','user','Details','',pretty(c.phone))}
  </div>
  <p class="jlost">${c.stage!=='lost'?`<button type="button" class="olink" data-act="lost" data-cid="${c.id}">Mark as lost</button><span aria-hidden="true"> · </span>`:''}<button type="button" class="olink" data-act="del" data-cid="${c.id}">Delete job</button></p>`}
function bindJob(c){{const now=$('#obody .jsteps li.now');if(now)now.scrollIntoView({block:'nearest',inline:'center'})}$$('#obody [data-sec]').forEach(b=>b.onclick=()=>jobSheet(c.id,b.dataset.sec));
  $$('#obody [data-stage]').forEach(b=>b.onclick=()=>{const k=b.dataset.stage;if(k===c.stage)return;c.stage=k;if(k==='paid'&&c.invoice&&c.invoice.status!=='paid'){c.invoice.status='paid';c.invoice.paidT=Date.now()}save();openOwner();toast('Stage: '+stageName(k))})}
function oMore(){return `<div class="omore">${[['team','team','Cleaner & extras','Cleaner codes and photos, extras customers can request'],['conn','globe','Connections','Google Calendar, Slack, QuickBooks / Square invoices'],['numbers','chart','Numbers','Leads, close rate, cost per customer'],['avail','clock','Availability','Hours and days the website can book']].map(([k,i,l,s])=>`<button type="button" data-go="${k}">${oi(i)}<span><b>${l}</b><small>${s}</small></span>${oi('back','flip')}</button>`).join('')}
  <button type="button" id="mSite">${oi('globe')}<span><b>Back to the website</b><small>See what customers see</small></span>${oi('back','flip')}</button>${CFG.backend?`<button type="button" id="mOut">${oi('out')}<span><b>Sign out</b><small>On this device</small></span>${oi('back','flip')}</button>`:''}</div>`}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#owner [data-go="conn"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();connPage()},true);

/* ---------- ESTIMATE + INVOICE: we are not a cost tracker. Paste the link their app made (QuickBooks, Square, Roofr…)
   or upload a photo/PDF. The customer gets a big button to open it. The owner flips "paid" (or "said yes") by hand. No amounts, no totals. ---------- */
const hasDoc=d=>!!(d&&(d.link||d.file));
function docForm(kind,c,d,done){const K=kind==='inv',f=first(c.name);let file=d?d.file||'':'';
  const close=open(sheetWrap('dfH',(hasDoc(d)?'Change ':'Add ')+(K?'invoice':'estimate')+' · '+esc(f),`<p class="muted2" style="margin-top:0">${K?'Make the invoice in QuickBooks, Square or whatever you use. Paste its link here (the one customers use to pay), or upload a photo or PDF of it.':'Make the estimate in the app you use. Paste its link, or upload a photo or PDF of it.'}</p>
    <div class="field"><label for="dfL">Link</label><input id="dfL" type="url" placeholder="https://…" value="${esc(d&&d.link||'')}"></div>
    <div class="field"><span class="flabel">Or upload it</span><label class="upl" for="dfF"><span id="dfFl">${file?'File attached ✓ (tap to replace)':'Photo or PDF'}</span><input id="dfF" type="file" accept="image/*,application/pdf"></label></div>
    ${K?'':`<div class="field"><label for="dfS">Scope for the cleaner (optional, one line each)</label><textarea id="dfS" rows="3" placeholder="Recurring cleaning\nDeep cleaning\nMove-in and move-out cleaning">${esc(d&&d.scope||'')}</textarea></div>`}
    <label class="oswitch"><input type="checkbox" id="dfShow" ${!d||(c.show||{})[K?'invoice':'estimate']!==false?'checked':''}><span></span><b>Show it in ${esc(f)}’s portal</b><small>${K?'They get a big “View and pay” button.':'They can open it and tap “Yes, go ahead”.'}</small></label>
    <p class="err" id="dfE" role="alert" hidden></p><div class="obtns"><button class="ob ob-main ob-xl" type="button" id="dfGo">Save</button></div>`),'#dfL');
  $('#dfF').onchange=ev=>attachFile(ev.target.files[0],u=>{file=u;$('#dfFl').textContent='File attached ✓'});
  $('#dfGo').onclick=()=>{const l=$('#dfL').value.trim(),e=$('#dfE');if(l&&!/^https?:\/\//.test(l)){e.textContent='Paste the full link (starts with https://).';e.hidden=false;return}
    if(!l&&!file){e.textContent='Paste the link or upload the file.';e.hidden=false;return}
    const n=Object.assign(d||{status:'sent',t:Date.now()},{link:l,file});if(!K)n.scope=$('#dfS').value.trim();
    c[K?'invoice':'estimate']=n;c.show=c.show||{};c.show[K?'invoice':'estimate']=$('#dfShow').checked;if(c.show[K?'invoice':'estimate']&&!c.portal){c.portal=true;ensureJob(c)}
    if(K){if(n.status!=='paid'&&stageIx(c.stage)<stageIx('invoiced'))c.stage='invoiced';markStep(c,'invoice',true)}else if(['lead','booked','inspected'].includes(c.stage))c.stage='estimate';
    save();close();custSheet(c.id);done&&done()}}
function docPage(kind,c){const K=kind==='inv',d=c[K?'invoice':'estimate'],f=first(c.name);if(!hasDoc(d))return docForm(kind,c,d,()=>docPage(kind,c));
  const ok=K?d.status==='paid':d.status==='approved',when=K?d.paidT:d.okT;
  const close=open(sheetWrap('dpH',(K?'Invoice':'Estimate')+' · '+esc(f),`<div class="ocard2 obig ${ok?'on':''}"><span class="okick">${K?'Invoice':'Estimate'} · added ${fmtDay(d.t)}</span><b class="obig-n">${ok?(K?'Paid':'Approved'):(K?'Not paid yet':'Waiting for an answer')}</b>${ok&&when?`<small>${fmtDay(when)}${!K&&d.okBy&&d.okBy[0]!=='('?' · '+esc(d.okBy):''}</small>`:d.status==='declined'?'<small>They said no</small>':''}</div>
    <label class="oswitch big"><input type="checkbox" id="dpOk" ${ok?'checked':''}><span></span><b>${K?'Paid':'They said yes'}</b><small>${K?'Flip it when the money is in.':'Flip it when they agree.'}</small></label>
    <div class="obtns"><a class="ob ob-line" href="${esc(d.link||d.file)}" target="_blank" rel="noopener" ${!d.link?'download':''}>${oi('file')}Open it</a>
      ${!ok?`<a class="ob ob-line" href="${smsTo(c.phone,K?`Hi ${f}, it’s ${ownerName} with Bayou Sparkle. Here’s your invoice: ${d.link||portalUrl(c)} Thank you!`:`Hi ${f}, it’s ${ownerName} with Bayou Sparkle. Here’s your estimate: ${d.link||portalUrl(c)} Any questions, just text me.`)}">${oi('chat')}Text it to ${esc(f)}</a>`:''}
      <button class="ob ob-line" type="button" id="dpEd">${oi('edit')}Change link or file</button></div>
    ${K&&CFG.backend?`<p class="muted2">Using QuickBooks, Square or Jobber? Under More → Connections “paid” can flip by itself.</p>`:''}`));
  $('#dpOk').onchange=e=>{const on=e.target.checked;if(K){Object.assign(d,{status:on?'paid':'sent',paidT:on?Date.now():null});if(on){c.stage='paid';markStep(c,'paid',true)}else{if(c.stage==='paid')c.stage='invoiced';markStep(c,'paid',false)}}
    else{Object.assign(d,{status:on?'approved':'sent',okT:on?Date.now():null,okBy:on?(d.okBy||'(you marked it)'):''});if(on){if(stageIx(c.stage)<stageIx('approved'))c.stage='approved';markStep(c,'contract',true)}else if(c.stage==='approved')c.stage='estimate'}
    save();close();docPage(kind,c)};
  $('#dpEd').onclick=()=>{close();docForm(kind,c,d,()=>docPage(kind,c))}}
function estPage(c){docPage('est',c)}
function estSheet(id){docPage('est',byId(id))}
function invoicePage(c){docPage('inv',c)}
function invoiceSheet(c){docPage('inv',c)}
function sendInvoiceSheet(c){docPage('inv',c)}
function approveIt(c){if(!c.estimate)c.estimate={status:'sent',t:Date.now()};Object.assign(c.estimate,{status:'approved',okT:Date.now(),okBy:c.estimate.okBy||'(you marked it)'});if(stageIx(c.stage)<stageIx('approved'))c.stage='approved';markStep(c,'contract',true);save();toast('Approved. Next: order materials and set the work day.')}
function approveSheet(c){approveIt(c);custSheet(c.id)}
function paidSheet(c){if(!c.invoice)c.invoice={status:'sent',t:Date.now()};Object.assign(c.invoice,{status:'paid',paidT:Date.now()});c.stage='paid';markStep(c,'paid',true);save();custSheet(c.id);toast('Paid. Nice work.')}
/* MONEY tab: just who still owes you an invoice or a payment. No dollar totals (their accounting app does that) */
function oMoney(){const C=DB.customers,bill=C.filter(readyToBill),unpaid=C.filter(c=>owed(c)),paid=C.filter(c=>c.invoice&&c.invoice.status==='paid'&&Date.now()-c.invoice.paidT<60*DAY).sort((a,b)=>b.invoice.paidT-a.invoice.paidT);
  const row=(c,btn)=>`<article class="ojob" data-open="${c.id}"><span class="oinit st2-${c.stage}">${esc((c.name||'?')[0])}</span><div class="ojob-m"><div class="ojob-h"><h3>${esc(c.name)}</h3></div><p>${esc((c.addr||'').split(',')[0])}</p>${btn||''}</div></article>`;
  return `<div class="ostats"><div><small>Need an invoice</small><b>${bill.length}</b></div><div><small>Not paid yet</small><b>${unpaid.length}</b></div><div><small>Paid (60 days)</small><b>${paid.length}</b></div></div>
    <h2 class="osec2">Not paid yet ${unpaid.length?`<span class="ocount">${unpaid.length}</span>`:''}</h2><div class="olist">${unpaid.map(c=>row(c,`<p class="muted2">Invoice added ${ago(c.invoice.t)}</p><div class="otask-acts"><button class="ob ob-main" type="button" data-act="paid" data-cid="${c.id}">Mark paid</button><a class="ob ob-line" href="${smsTo(c.phone,`Hi ${first(c.name)}, friendly reminder from ${ownerName} at Bayou Sparkle: your invoice is ready.${c.invoice.link?' '+c.invoice.link:c.portal?' '+portalUrl(c):''}`)}">Text a reminder</a></div>`)).join('')||'<p class="muted2">Everyone’s paid up.</p>'}</div>
    <h2 class="osec2">Need an invoice ${bill.length?`<span class="ocount">${bill.length}</span>`:''}</h2><div class="olist">${bill.map(c=>row(c,`<div class="otask-acts"><button class="ob ob-main" type="button" data-act="invoice" data-cid="${c.id}">Add the invoice</button></div>`)).join('')||'<p class="muted2">Nothing waiting.</p>'}</div>
    <h2 class="osec2">Paid lately</h2><div class="olist">${paid.map(c=>row(c,`<p class="muted2">Paid ${fmtDay(c.invoice.paidT)}</p>`)).join('')||'<p class="muted2">Nothing in the last 60 days.</p>'}</div>`}

/* ---------- PHOTOS & NOTES (Oct 9): one place for inspection findings and job photos ---------- */
const allNotes=c=>(c.report?[{t:c.report.t,text:c.report.notes,photos:c.report.photos||[],kind:'inspection'}]:[]).concat(c.updates||[]).sort((a,b)=>b.t-a.t);
function updatesPage(c){const U=allNotes(c);
  const close=open(sheetWrap('upP','Photos & notes · '+esc(first(c.name)),`<div class="obtns"><button class="ob ob-main ob-xl" type="button" id="upNew">${oi('cam')}Add photos & notes</button></div>
    <div class="field"><label for="ccL">CompanyCam timeline link (optional)</label><input id="ccL" type="url" placeholder="https://app.companycam.com/timeline/…" value="${esc(c.camLink||'')}"></div>
    ${U.map(u=>`<div class="ocard2"><span class="okick">${u.kind==='inspection'?'Free quote · ':''}${fmtDay(u.t)}${u.by?' · '+esc(u.by):''}</span>${u.text?`<p>${esc(u.text)}</p>`:''}${(u.photos||[]).length?`<div class="pgrid">${u.photos.map(p=>`<img src="${p}" alt="">`).join('')}</div>`:''}</div>`).join('')||'<p class="muted2">Nothing yet.</p>'}`));
  $('#upNew').onclick=()=>{close();updSheet(c.id)};
  $('#ccL').onchange=e=>{const v=e.target.value.trim();if(v&&!/^https:\/\//.test(v)){toast('Paste the full https:// link.');return}c.camLink=v;c.show=c.show||{};if(v)c.show.updates=true;save();toast('Saved. Their portal shows “See every photo”.')}}
function updSheet(id){const c=byId(id),insp=['lead','booked'].includes(c.stage),pics=[];
  const close=open(sheetWrap('upH',insp?'Free quote photos & notes':'Photos & notes',`<div class="field"><label for="upt">${insp?'What you found, in plain words':'What happened'}</label><textarea id="upt" rows="3" placeholder="${insp?"What you saw at the free quote, in plain words.":"Kitchen and baths done today. Next step tomorrow."}"></textarea></div>
    <div class="field"><span class="flabel">Photos</span><label class="upl" for="upf"><span>Take or add photos</span><input id="upf" type="file" accept="image/*" multiple></label><div class="thumbs" id="upth"></div></div>
    <label class="oswitch"><input type="checkbox" id="upShow" checked><span></span><b>Show in ${esc(first(c.name))}’s portal</b></label>
    <div class="obtns"><button class="ob ob-main ob-xl" type="button" id="upgo">Save</button></div>`),'#upt');
  $('#upf').onchange=e=>{[...e.target.files].slice(0,8).forEach(f=>readPhoto(f,1000,u=>{pics.push(u);$('#upth').innerHTML=pics.map(u=>`<img src="${u}" alt="">`).join('')}))};
  $('#upgo').onclick=()=>{const t=$('#upt').value.trim();if(!t&&!pics.length){toast('Add a note or a photo.');return}
    c.updates=(c.updates||[]).concat([{t:Date.now(),text:t,photos:pics,kind:insp?'inspection':''}]);c.show=c.show||{};if($('#upShow').checked)c.show.updates=true;
    if(insp)c.stage='inspected';save();close();custSheet(c.id);toast(insp?'Saved. Next: send the estimate.':'Saved.')}}
function reportSheet(id){updSheet(id)}
/* ---------- STAGE BAR (Oct 9): sales only. After “Approved”, job steps take over ---------- */
const SALES=[['lead','Request'],['booked','Booked'],['estimate','Estimate'],['approved','Approved']];
function stageBar(c){if(c.stage==='lost')return'';const after=['approved','work','invoiced','paid'].includes(c.stage);
  if(after&&c.stage!=='approved'){const p=progress(c),inv=c.invoice;return`<button type="button" class="jprog" data-sec="progress"><span class="okick">Job steps</span><b>${p.n} of ${p.of}${p.next?' · next: '+esc(p.next.l):' · all done'}</b><span class="obar2"><i style="width:${Math.round(p.n/Math.max(1,p.of)*100)}%"></i></span>${inv?`<small>${inv.status==='paid'?'Invoice paid ✓':'Invoice not paid yet'}</small>`:''}</button>`}
  const si=Math.max(0,SALES.findIndex(s=>s[0]===(c.stage==='inspected'?'booked':c.stage)));
  return`<ol class="jsteps js4" aria-label="Job stage">${SALES.map(([k,l],i)=>`<li class="${i<si?'done':i===si?'now':''}"><button type="button" data-stage="${k}" aria-label="Set stage: ${l}">${i<si?oi('check'):i+1}</button><span>${l}</span></li>`).join('')}</ol><p class="jhint">Tap any step to move the job back or forward.${c.stage==='approved'?' After this, use Job steps.':''}</p>`}

/* ---------- backend: every lead and booking goes to the client's Apps Script web app
   (Google Sheet row + instant owner alert + GoHighLevel contact/appointment). Demo mode when CFG.backend is empty. ---------- */
const OUTBOX='kcleanin-outbox';
function leadRow(o){let me={},q={};try{me=JSON.parse(localStorage.getItem('kcleanin-me')||'{}');q=JSON.parse(localStorage.getItem('kcleanin-quote')||'{}')}catch(x){}
  const ap=o.appt&&o.appt.t?{date:AV.iso(new Date(o.appt.t)),time:o.appt.time}:null;
  return{type:o.source||'Website',name:o.name||me.name||'',phone:digits(o.phone||me.phone||''),email:o.email||me.email||'',best:o.best||me.contact||'',sms:!!o.sms,
    address:o.addr||q.addr||'',issue:o.msg||'',company:o.company||'',role:o.role||'',quote:!o.club&&q&&q.touched&&q.range?{name:q.name||'',range:q.range}:null,club:o.club?o.club.plan:'',appt:ap,lock:o.lock||null,
    page:location.pathname+location.search,ts:Date.now(),hp:''}}
async function postBackend(row){const r=await fetch(CFG.backend,{method:'POST',body:JSON.stringify(row)});return r.json()}
function outbox(){try{return JSON.parse(localStorage.getItem(OUTBOX)||'[]')}catch(x){return[]}}
function setOutbox(a){try{localStorage.setItem(OUTBOX,JSON.stringify(a.slice(-20)))}catch(x){}}
function sendLead(o){if(!CFG.backend)return Promise.resolve({ok:true,demo:true});const row=leadRow(o);
  return postBackend(row).catch(()=>{setOutbox(outbox().concat([row]));return{ok:true,queued:true}})}
/* anything that failed to send (no signal, backend down) is retried on the next visit */
if(CFG.backend){const q=outbox();if(q.length){setOutbox([]);q.forEach(row=>postBackend(row).catch(()=>setOutbox(outbox().concat([row]))))}}
{const _up=upsert;upsert=function(o){const c=_up(o);if(!o._sent)sendLead(o);return c}}
/* ---------- owner view, live (v10, Oct 8): one shared job store on the backend ----------
   Sign-in pulls every job (db_get) + new website requests (leads). Every owner edit is pushed (db_put) a second later.
   Crew and customers change the same jobs from their own phones; the owner view checks for changes every minute. */
const SYNC={last:{},meta:'',act:'',timer:0,poll:0,loaded:false};
const jh=o=>JSON.stringify(o);
const metaObj=()=>({crew:DB.crew||[],addons:DB.addons||[],settings:{payLink:DB.payLink||'',spend:DB.spend||{},fee:DB.fee,labor:DB.labor,repeat:DB.repeat,deleted:(DB.deleted||[]).slice(-500)}});
function markSynced(skip){SYNC.last={};DB.customers.forEach(c=>{if(!skip||!skip.has(c.id))SYNC.last[c.id]=jh(c)});SYNC.meta=jh(metaObj());SYNC.act=jh(DB.activity||[])}
window.__onSave=()=>{if(!SYNC.loaded)return;clearTimeout(SYNC.timer);SYNC.timer=setTimeout(pushNow,1200)};
async function pushNow(){const t=otok();if(!t||!CFG.backend||!SYNC.loaded)return;clearTimeout(SYNC.timer);
  const put={};DB.customers.forEach(c=>{if(SYNC.last[c.id]!==jh(c))put[c.id]=c});const body={action:'db_put',token:t,put};
  const m=jh(metaObj()),a=jh(DB.activity||[]);if(m!==SYNC.meta){const o=metaObj();body.crew=o.crew;body.addons=o.addons;body.settings=o.settings}if(a!==SYNC.act)body.activity=DB.activity||[];
  const del=Object.keys(SYNC.last).filter(id=>!DB.customers.some(c=>c.id===id));if(del.length)body.del=del;
  if(!Object.keys(put).length&&!body.crew&&!body.activity&&!del.length)return;
  try{const r=await ownerPost(body);if(r.ok){Object.keys(put).forEach(id=>SYNC.last[id]=jh(put[id]));del.forEach(id=>delete SYNC.last[id]);if(body.crew)SYNC.meta=m;if(body.activity)SYNC.act=a}else if(r.reason==='auth'){setTok('');window.__ownerLive=false}}catch(x){SYNC.timer=setTimeout(pushNow,15000)}}
window.__pushNow=pushNow;
function leadToJob(L){const rec=Date.parse(L.received)||Date.now(),key=digits(L.phone)+'|'+rec,t=L.start?new Date(L.start):null;
  return{id:'w'+rec.toString(36)+(digits(L.phone).slice(-4)||'x'),leadKey:key,name:L.name||'Customer',phone:digits(L.phone),addr:L.address||'',email:L.email||'',contactPref:L.best||'',smsOk:!!L.sms,source:L.type||'Website',created:rec,
    stage:t?'booked':'lead',msg:L.issue||'',quote:L.quote,photos:[],updates:[],portal:false,show:{schedule:!!t},notes:L.cancelled?'Cancelled their free quote online.':'',fresh:true,
    appt:t?{t:t.getTime(),time:L.startTime,slot:AV.label(L.startTime),confirmed:false}:undefined}}
async function loadOwnerLeads(token){const [db,ld]=await Promise.all([ownerPost({action:'db_get',token}),ownerPost({action:'leads',token})]);
  if(!db.ok)return db;const dirty=new Set(SYNC.loaded?DB.customers.filter(c=>SYNC.last[c.id]!==jh(c)).map(c=>c.id):[]);
  const tomb=new Set([].concat(DB.deleted||[],(db.settings||{}).deleted||[]).flatMap(x=>[x.id,x.leadKey]).filter(Boolean));if((db.settings||{}).deleted){const m=new Map((DB.deleted||[]).concat(db.settings.deleted).map(x=>[x.id,x]));DB.deleted=[...m.values()].slice(-500)}
  db.jobs=Object.fromEntries(Object.entries(db.jobs||{}).filter(([id])=>!tomb.has(id)));
  const local=new Map(DB.customers.filter(c=>c.id&&c.id[0]!=='s'&&!tomb.has(c.id)).map(c=>[c.id,c]));
  db.jobs=db.jobs||{};const merged=Object.values(db.jobs).map(sc=>dirty.has(sc.id)&&local.get(sc.id)?local.get(sc.id):sc);
  local.forEach((c,id)=>{if(!db.jobs[id])merged.push(c)});
  const added=[],fresh=new Set();
  ((ld&&ld.leads)||[]).forEach(L=>{const j=leadToJob(L);if(tomb.has(j.id)||tomb.has(j.leadKey)||merged.some(c=>c.leadKey===j.leadKey||c.id===j.id))return;
    const same=merged.find(c=>!c.leadKey&&c.phone&&c.phone===j.phone&&Math.abs((c.created||0)-j.created)<15*6e4);if(same){same.leadKey=j.leadKey;if(!same.appt&&j.appt){same.appt=j.appt;same.stage=j.stage}fresh.add(same.id);return}
    merged.push(j);added.push(j);fresh.add(j.id)});
  DB.customers=merged.sort((a,b)=>(b.created||0)-(a.created||0));
  if((db.crew||[]).length||SYNC.loaded)DB.crew=db.crew;if((db.addons||[]).length||SYNC.loaded)DB.addons=db.addons;
  const st=db.settings||{};['payLink','spend','fee','labor','repeat'].forEach(k=>{if(st[k]!==undefined&&st[k]!==null)DB[k]=st[k]});
  const seen=new Set((DB.activity||[]).filter(a=>a.seen).map(a=>a.t)),byT=new Map();(DB.activity||[]).concat(db.activity||[]).forEach(a=>{const o=Object.assign({},a);if(seen.has(a.t))o.seen=true;byT.set(a.t+'|'+a.cid,o)});DB.activity=[...byT.values()].sort((a,b)=>a.t-b.t).slice(-200);
  DB.customers.forEach(c=>{if(c.appt&&!(c.job&&c.job.apptIn))ensureJob(c)});
  const firstLoad=!SYNC.loaded;markSynced(firstLoad?new Set(DB.customers.filter(c=>!db.jobs[c.id]).map(c=>c.id)):fresh);
  added.forEach(c=>delete SYNC.last[c.id]);SYNC.loaded=true;save();window.__ownerLive=true;pushNow();
  if(!SYNC.poll)SYNC.poll=setInterval(ownerPoll,60000);return{ok:true,added}}
async function ownerPoll(){const o=$('#owner');if(!o||o.hidden||document.hidden||!otok())return;
  try{const r=await loadOwnerLeads(otok());if(!r.ok)return;if(r.added&&r.added.length){toast(r.added.length===1?`New request: ${r.added[0].name}`:`${r.added.length} new requests`)}
    if(!$('#layer .sheet'))openOwner()}catch(x){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&SYNC.loaded)ownerPoll()});
/* ---------- owner sign-in (Oct 8): email + password checked by the backend; the website only keeps a sign-in token ----------
   No master codes. A customer link or PIN can never open the owner view. First time / forgot: a 6-digit code is emailed to the owner's address. */
const otok=()=>{try{return localStorage.getItem('kcleanin-otok')||sessionStorage.getItem('kcleanin-otok')||''}catch(x){return''}};
function setTok(t,remember){try{localStorage.removeItem('kcleanin-otok');sessionStorage.removeItem('kcleanin-otok');if(t)(remember?localStorage:sessionStorage).setItem('kcleanin-otok',t)}catch(x){}}
window.ownerToken=otok;
async function ownerPost(o){return(await fetch(CFG.backend,{method:'POST',body:JSON.stringify(o)})).json()}
window.ownerSignOut=async()=>{await pushNow();const t=otok();setTok('');window.__ownerLive=false;SYNC.loaded=false;clearInterval(SYNC.poll);SYNC.poll=0;try{if(t)await ownerPost({action:'logout',token:t})}catch(x){}closeFull('owner');toast('Signed out.');if(location.hash==='#'+OWNER_KEY)history.replaceState(null,'',location.pathname+location.search)};
let gateTried=false;
async function ownerGate(msg,mode){const t=otok();
  if(t&&!gateTried&&!mode){gateTried=true;full('owner',`<div class="appbody"><p class="muted" style="text-align:center;margin-top:30vh">Signing you in…</p></div>`);
    try{const r=await loadOwnerLeads(t);if(r.ok){openOwner();return}setTok('')}catch(x){return ownerGate('Couldn’t reach the server. Try again.')}}
  const reset=mode==='reset'||mode==='code';
  full('owner',`<header class="apphead"><div><p class="kicker">${esc(CFG.biz)} · Owner</p><h2>${reset?'Set your password':'Owner sign-in'}</h2></div><button class="btn btn-line btn-sm" type="button" id="oOut">Back to website</button></header>
    <div class="appbody"><form class="ocard" id="ogF" autocomplete="on" novalidate>
    ${reset?`<p class="muted">${mode==='code'?'We emailed a 6-digit code to the owner email. It works for 15 minutes.':'We’ll email a 6-digit code to the owner email so only the owner can set the password.'}</p>`:`<p class="muted">For the business owner only. Customers use the link and PIN we text them.</p>`}
    <div class="field"><label for="ogEm">Email</label><input id="ogEm" type="email" autocomplete="username" inputmode="email" required></div>
    ${mode==='code'?`<div class="field"><label for="ogCode">6-digit code</label><input id="ogCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6"></div>
      <div class="field"><label for="ogPw">New password (8+ characters)</label><input id="ogPw" type="password" autocomplete="new-password" minlength="8"></div>
      <div class="field"><label for="ogPw2">Type it again</label><input id="ogPw2" type="password" autocomplete="new-password"></div>`
    :reset?'':`<div class="field"><label for="ogPw">Password</label><input id="ogPw" type="password" autocomplete="current-password"></div>`}
    ${reset&&mode!=='code'?'':`<label class="tog"><input type="checkbox" id="ogRem" checked> Keep me signed in on this device (30 days)</label>`}
    <p class="err" id="ogErr" role="alert" ${msg?'':'hidden'}>${esc(msg||'')}</p>
    <button class="btn btn-main" type="submit" id="ogGo">${mode==='code'?'Save password and sign in':reset?'Email me a code':'Sign in'}</button>
    <p style="margin:12px 0 0"><button class="linkbtn" type="button" id="ogAlt">${reset?'Back to sign-in':'First time, or forgot your password?'}</button></p></form></div>`);
  {const em=sessionStorage.getItem('kcleanin-oem');if(em)$('#ogEm').value=em}
  $('#oOut').onclick=()=>{closeFull('owner');if(location.hash==='#'+OWNER_KEY)history.replaceState(null,'',location.pathname+location.search)};
  $('#ogAlt').onclick=()=>ownerGate('',reset?'':'reset');
  const err=m=>{const e=$('#ogErr');e.textContent=m;e.hidden=false},b=$('#ogGo');
  $('#ogF').onsubmit=async e=>{e.preventDefault();const em=$('#ogEm').value.trim();if(!/^\S+@\S+\.\S+$/.test(em))return err('Enter your email.');try{sessionStorage.setItem('kcleanin-oem',em)}catch(x){}
    const rem=$('#ogRem')?$('#ogRem').checked:true;b.disabled=true;const lbl=b.textContent;b.textContent='One moment…';
    try{if(mode==='reset'){await ownerPost({action:'reset_request',email:em});ownerGate('', 'code');return}
      if(mode==='code'){const pw=$('#ogPw').value;if(pw.length<8){b.disabled=false;b.textContent=lbl;return err('Use at least 8 characters.')}if(pw!==$('#ogPw2').value){b.disabled=false;b.textContent=lbl;return err('The two passwords don’t match.')}
        const r=await ownerPost({action:'reset_set',email:em,code:$('#ogCode').value,password:pw,remember:rem});
        if(!r.ok){b.disabled=false;b.textContent=lbl;return err(r.reason==='expired'?'That code expired. Ask for a new one.':r.reason==='short'?'Use at least 8 characters.':'That code or email isn’t right.')}
        setTok(r.token,rem);const L=await loadOwnerLeads(r.token);if(L.ok){openOwner();toast('Password saved. You’re signed in.')}return}
      const r=await ownerPost({action:'login',email:em,password:$('#ogPw').value,remember:rem});
      if(!r.ok){b.disabled=false;b.textContent=lbl;return err(r.reason==='nopass'?'No password set yet. Tap “First time, or forgot your password?”':r.reason==='locked'?'Too many tries. Wait 15 minutes and try again.':'Email or password isn’t right.')}
      setTok(r.token,rem);const L=await loadOwnerLeads(r.token);if(!L.ok){b.disabled=false;b.textContent=lbl;return err('Signed in, but couldn’t load your leads. Try again.')}openOwner()}
    catch(x){b.disabled=false;b.textContent=lbl;err('Couldn’t reach the server. Try again.')}};
  setTimeout(()=>{const f=$('#ogEm');if(f&&!f.value)f.focus();else{const p=$('#ogPw')||$('#ogCode');p&&p.focus()}},50)}

addEventListener('hashchange',routeHash);

const READY=new Set();function apply(){}const PICK={};
/* ---------- before / after ---------- */
(function(){const ba=$('#ba'),r=$('#baR');if(!ba)return;const set=v=>ba.style.setProperty('--cut',v+'%');r.oninput=()=>set(r.value);set(50);
  let hinted=false;new IntersectionObserver(es=>{if(es[0].isIntersecting&&!hinted&&M&&!reduce){hinted=true;M.animate(50,22,{duration:.7,ease:[.3,.7,.2,1],onUpdate:v=>set(v)}).then(()=>M.animate(22,50,{duration:.8,ease:[.3,.7,.2,1],onUpdate:v=>set(v)}))}},{threshold:.6}).observe(ba)})();

/* ---------- top bar turns solid after the hero ---------- */
{const sb=()=>$('#bar').classList.toggle('solid',true);addEventListener('scroll',sb,{passive:true});addEventListener('resize',sb);sb()}

function push(o){upsert(o)}
window.closeQuote=null;
/* ---------- every "Book a free inspection" goes to the one inspection form on the page (no pop-up; the owner, Oct 4) ---------- */
function me(){try{return JSON.parse(localStorage.getItem('kcleanin-me')||'null')}catch(x){return null}}
function startSheet(){if(window.openInspect){if(window.closeQuote)window.closeQuote();window.openInspect();return}location.href='index.html#inspect'}
$$('[data-start]').forEach(b=>b.onclick=e=>{e.preventDefault();startSheet()});
/* ---------- add to calendar (Oct 9): Google Calendar link + .ics file for Apple/Outlook. No sign-in, works on any phone. ---------- */
const CALX={};
function calButtons(title,start,mins,where,details){const end=new Date(start.getTime()+(mins||60)*6e4),z=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const g='https://calendar.google.com/calendar/render?'+new URLSearchParams({action:'TEMPLATE',text:title,dates:z(start)+'/'+z(end),details:details||'',location:where||''}).toString();
  const k='c'+Math.random().toString(36).slice(2,8);CALX[k]={title,start,end,where,details,z};
  return`<div class="calx"><span class="calx-l">Add to my calendar</span><div class="row"><a class="btn btn-line btn-sm" href="${g}" target="_blank" rel="noopener">Google Calendar</a><button class="btn btn-line btn-sm" type="button" data-icsx="${k}">Apple or Outlook</button></div></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-icsx]');if(!b)return;const c=CALX[b.dataset.icsx];if(!c)return;const q=v=>String(v||'').replace(/([,;\\])/g,'\\$1').replace(/\n/g,'\\n');
  const txt=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//'+CFG.biz+'//Booking//EN','BEGIN:VEVENT','UID:'+b.dataset.icsx+Date.now()+'@site','DTSTAMP:'+c.z(new Date()),'DTSTART:'+c.z(c.start),'DTEND:'+c.z(c.end),'SUMMARY:'+q(c.title),'LOCATION:'+q(c.where),'DESCRIPTION:'+q(c.details),'BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY','DESCRIPTION:Reminder','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const u=URL.createObjectURL(new Blob([txt],{type:'text/calendar'})),l=document.createElement('a');l.href=u;l.download='appointment.ics';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),3000)});
window.calButtons=calButtons;
/* ---------- free inspection form on the homepage: full details + day/time, then an instant confirmation ---------- */

/* ---------- availability: the owner sets hours once (Owner view → Availability); the booking calendar only offers real, future times ----------
   Live (CFG.backend): settings + open times come from the backend, which also checks the owner's calendar. Demo: settings on this device. */
const AV=(()=>{const KEY='kcleanin-avail2';
  const DEF={hours:{0:null,1:['08:00','17:00'],2:['08:00','17:00'],3:['08:00','17:00'],4:['08:00','17:00'],5:['08:00','17:00'],6:['09:00','13:00']},len:60,step:60,buffer:0,noticeH:0,ahead:28,maxDay:4,weekCap:12,blocked:[]};
  const clone=o=>JSON.parse(JSON.stringify(o));
  let S;try{S=Object.assign(clone(DEF),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(x){S=clone(DEF)}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(x){}};
  const pad=n=>String(n).padStart(2,'0');
  const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const day0=d=>{const x=new Date(d);x.setHours(12,0,0,0);return x};
  const toMin=t=>{const[h,m]=t.split(':').map(Number);return h*60+m},toHHMM=m=>`${pad(Math.floor(m/60))}:${pad(m%60)}`;
  const label=t=>{const m=toMin(t),h=Math.floor(m/60),mm=m%60;return`${h%12||12}:${pad(mm)} ${h<12?'AM':'PM'}`};
  /* "now" in the business's time zone (a visitor in another zone still sees the right cut-off) */
  function nowBiz(){try{const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:CFG.tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
    return{date:`${p.year}-${p.month}-${p.day}`,min:+p.hour*60+ +p.minute}}catch(x){const d=new Date();return{date:iso(d),min:d.getHours()*60+d.getMinutes()}}}
  /* a time is bookable only if it starts at least noticeH hours from now */
  function future(date,t){const n=nowBiz(),diffDays=Math.round((new Date(date+'T12:00:00')-new Date(n.date+'T12:00:00'))/864e5);return diffDays*1440+toMin(t)-n.min>=Math.max(S.noticeH*60,1)}
  const booked=()=>{const m={};((typeof DB!=='undefined'&&DB.customers)||[]).forEach(c=>{if(c.appt&&c.appt.t&&c.appt.time){const k=iso(new Date(c.appt.t));(m[k]=m[k]||[]).push(c.appt.time)}});return m};
  let remote=null;
  async function load(){if(!CFG.backend)return;try{const j=await(await fetch(`${CFG.backend}?action=slots&days=${S.ahead}`)).json();if(j&&j.ok&&j.days){remote=j.days;if(j.settings)Object.assign(S,j.settings);window.dispatchEvent(new Event('kcleanin-slots'))}}catch(x){}}
  function times(d){const k=iso(d);
    if(remote)return(remote[k]||[]).filter(t=>future(k,t));
    if(S.blocked.includes(k))return[];const h=S.hours[d.getDay()];if(!h)return[];const taken=booked()[k]||[];if(taken.length>=S.maxDay)return[];
    const out=[];for(let m=toMin(h[0]);m+S.len<=toMin(h[1]);m+=S.step){const t=toHHMM(m);
      const clash=taken.some(b=>{const bm=toMin(b);return m<bm+S.len+S.buffer&&bm<m+S.len+S.buffer});if(!clash&&future(k,t))out.push(t)}return out}
  function state(d){const n=nowBiz(),k=iso(d);if(k<n.date)return'out';const diff=Math.round((day0(d)-new Date(n.date+'T12:00:00'))/864e5);if(diff>S.ahead)return'out';
    if(!remote&&S.blocked.includes(k))return'blocked';return times(d).length?'open':'closed'}
  function weekLeft(){const now=day0(new Date()),mon=new Date(now);mon.setDate(now.getDate()-((now.getDay()+6)%7));let n=0;const b=booked();for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(mon.getDate()+i);n+=(b[iso(d)]||[]).length}return Math.max(0,S.weekCap-n)}
  const MON=d=>d.toLocaleDateString('en-US',{month:'long',year:'numeric'}),DOW=['S','M','T','W','T','F','S'];
  function grid(view,mode,sel){const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1,12),n=new Date(y,m+1,0).getDate(),b=booked(),today=nowBiz().date;let h='';
    for(let i=0;i<first.getDay();i++)h+='<span class="cd pad"></span>';
    for(let i=1;i<=n;i++){const d=new Date(y,m,i,12),k=iso(d),isSel=sel&&iso(sel)===k;
      if(mode==='pick'){const st=state(d);h+=`<button type="button" class="cd ${st}${isSel?' sel':''}" data-cd="${k}" ${st==='open'?'':'disabled'} aria-pressed="${isSel}" aria-label="${d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}${st==='open'?', open':', not available'}">${i}</button>`}
      else{const past=k<today,cnt=(b[k]||[]).length;h+=`<button type="button" class="cd o-${S.blocked.includes(k)?'blocked':S.hours[d.getDay()]?'open':'closed'}${past?' past':''}" data-cd="${k}" ${past?'disabled':''} aria-pressed="${S.blocked.includes(k)}"><b>${i}</b>${cnt?`<i>${cnt}</i>`:''}</button>`}}
    return`<div class="calhead"><button type="button" class="calnav" data-cm="-1" aria-label="Previous month">‹</button><b>${MON(view)}</b><button type="button" class="calnav" data-cm="1" aria-label="Next month">›</button></div><div class="calgrid">${DOW.map(x=>`<span class="cw">${x}</span>`).join('')}${h}</div>`}
  function mountPicker(calEl,slotEl,onPick){let view=new Date(),sel=null,slot=null;view.setDate(1);
    const firstOpen=()=>{const d=day0(new Date());for(let i=0;i<=S.ahead+1;i++){const x=new Date(d);x.setDate(d.getDate()+i);if(state(x)==='open')return x}return null};
    sel=firstOpen();if(sel)view=new Date(sel.getFullYear(),sel.getMonth(),1,12);
    const render=()=>{if(sel&&state(sel)!=='open'){sel=firstOpen();slot=null}calEl.innerHTML=grid(view,'pick',sel);
      [...calEl.querySelectorAll('[data-cm]')].forEach(b=>b.onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+ +b.dataset.cm,1,12);render()});
      [...calEl.querySelectorAll('[data-cd]')].forEach(b=>b.onclick=()=>{const[y,m,d]=b.dataset.cd.split('-').map(Number);sel=new Date(y,m-1,d,12);slot=null;render()});
      if(!sel){slotEl.innerHTML='<p class="calnone">No open times right now. Text us and we’ll fit you in.</p>';onPick(null,null);return}
      const ts=times(sel);if(!ts.includes(slot))slot=ts[0]||null;
      slotEl.innerHTML=`<p class="calday">${sel.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p><div class="chips tchips">${ts.map(t=>`<button type="button" role="radio" aria-checked="${t===slot}" data-w="${t}">${label(t)}</button>`).join('')}</div>`;
      [...slotEl.querySelectorAll('[data-w]')].forEach(b=>b.onclick=()=>{slot=b.dataset.w;render()});onPick(sel,slot)};
    window.addEventListener('kcleanin-slots',render);setInterval(render,5*60e3);/* drop times that pass while the page is open */
    render();return{refresh:render}}
  load();return{S,DEF,save,iso,label,times,state,grid,weekLeft,mountPicker,load,live:()=>!!remote,toMin,toHHMM}})();
{const sc=$('.scar span');if(sc){const n=AV.weekLeft();sc.textContent=`This week: ${n} of ${AV.S.weekCap} free quote spots left`;const dots=$('.scar .dots');if(dots)dots.innerHTML=Array.from({length:AV.S.weekCap},(_,i)=>`<i class="${i<AV.S.weekCap-n?'t':''}"></i>`).join('')}}

/* owner screen: Availability (live: saved to the backend with the owner PIN) */
function oAvail(){const S=AV.S,DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const T=[];for(let m=5*60;m<=21*60;m+=30)T.push(AV.toHHMM(m));
  const sel=(id,val,opts,attr='')=>`<select id="${id}" ${attr}>${opts.map(([v,t])=>`<option value="${v}" ${String(v)===String(val)?'selected':''}>${t}</option>`).join('')}</select>`;
  const tsel=(id,v)=>sel(id,v,T.map(t=>[t,AV.label(t)]));
  return`${CFG.backend?`<section class="ocard"><h3>Live calendar</h3><p class="muted">Bookings land on your “free quotes” Google Calendar. Drag one to a new time and the customer is told automatically (by text, email or a call reminder, the way they picked). Anything else on that calendar blocks those times on the website.</p></section>`:''}
    <section class="ocard"><h3>Your hours</h3><p class="muted">Customers can pick any start time inside these hours.</p>
    <div class="avweek">${[1,2,3,4,5,6,0].map(d=>{const h=S.hours[d];return`<div class="avrow2"><label class="avon"><input type="checkbox" data-avon="${d}" ${h?'checked':''}> <b>${DN[d]}</b></label><span class="avt">${tsel('avS'+d,h?h[0]:'08:00')}<i>to</i>${tsel('avE'+d,h?h[1]:'17:00')}</span></div>`}).join('')}</div></section>
  <section class="ocard"><h3>Free quotes</h3><div class="avlims">
    <div class="field"><label for="avLen">How long one takes</label>${sel('avLen',S.len,[[30,'30 min'],[45,'45 min'],[60,'1 hour'],[90,'1.5 hours'],[120,'2 hours']])}</div>
    <div class="field"><label for="avStep">Start times every</label>${sel('avStep',S.step,[[30,'30 min'],[60,'1 hour'],[120,'2 hours']])}</div>
    <div class="field"><label for="avBuf">Drive time between</label>${sel('avBuf',S.buffer,[[0,'None'],[15,'15 min'],[30,'30 min'],[60,'1 hour']])}</div>
    <div class="field"><label for="avNot">Earliest a customer can book</label>${sel('avNot',S.noticeH,[[0,'Same day, any open time'],[1,'1 hour from now'],[2,'2 hours from now'],[3,'3 hours from now'],[24,'Tomorrow'],[48,'2 days out']])}</div>
    <div class="field"><label for="avAh">How far ahead</label>${sel('avAh',S.ahead,[[7,'1 week'],[14,'2 weeks'],[28,'4 weeks'],[56,'8 weeks']])}</div>
    <div class="field"><label for="avMax">Most in one day</label>${sel('avMax',S.maxDay,[1,2,3,4,5,6,8,10].map(n=>[n,n]))}</div>
    <div class="field"><label for="avWeek">Spots per week (shows on the site)</label>${sel('avWeek',S.weekCap,[6,8,10,12,15,20,25,30].map(n=>[n,n]))}</div></div></section>
  <section class="ocard"><h3>Days off</h3><p class="muted">Tap a day to block it (vacation, rain day, big job). Numbers show free quotes already booked.</p><div class="avcal" id="avCal"></div></section>
  <div class="avsave"><button class="btn btn-main" type="button" id="avSave">Save availability</button><p class="err" id="avErr" role="alert" hidden></p></div>
  ${CFG.backend?'':'<p class="muted" style="font-size:13px">Demo: saved on this device. On a live site these settings are saved to the business’s backend.</p>'}`}
function bindAvail(){const S=AV.S;let view=new Date();view.setDate(1);
  if(CFG.backend)fetch(`${CFG.backend}?action=settings`).then(r=>r.json()).then(j=>{if(j&&j.settings&&$('#avSave')){Object.assign(S,j.settings);const ob=$('#obody');if(ob){ob.innerHTML=oAvail();bindAvail2()}}}).catch(()=>{});
  bindAvail2();
  function bindAvail2(){
    function drawCal(){const el=$('#avCal');if(!el)return;el.innerHTML=AV.grid(view,'owner');
      $$('#avCal [data-cm]').forEach(b=>b.onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+ +b.dataset.cm,1,12);drawCal()});
      $$('#avCal [data-cd]').forEach(b=>b.onclick=()=>{const k=b.dataset.cd,i=S.blocked.indexOf(k);if(i>=0)S.blocked.splice(i,1);else S.blocked.push(k);drawCal()})}
    drawCal();
    $('#avSave').onclick=async()=>{const err=$('#avErr');err.hidden=true;
      for(let d=0;d<7;d++){const on=$(`[data-avon="${d}"]`).checked,s=$('#avS'+d).value,e=$('#avE'+d).value;if(on&&AV.toMin(e)<=AV.toMin(s)){err.textContent='An end time is before its start time.';err.hidden=false;return}S.hours[d]=on?[s,e]:null}
      [['avLen','len'],['avStep','step'],['avBuf','buffer'],['avNot','noticeH'],['avAh','ahead'],['avMax','maxDay'],['avWeek','weekCap']].forEach(([id,k])=>S[k]=+$('#'+id).value);
      AV.save();
      if(CFG.backend){const token=window.ownerToken?window.ownerToken():'';if(!token){err.textContent='Sign in again to save.';err.hidden=false;return}
        const b=$('#avSave');b.disabled=true;b.textContent='Saving…';
        try{const j=await(await fetch(CFG.backend,{method:'POST',body:JSON.stringify({action:'settings',token,settings:S})})).json();b.disabled=false;b.textContent='Save availability';
          if(!j.ok){err.textContent=j.reason==='auth'?'Your sign-in expired. Sign out and back in.':'Couldn’t save. Try again.';err.hidden=false;return}AV.load();toast('Saved. The website shows your new hours now.')}
        catch(x){b.disabled=false;b.textContent='Save availability';err.textContent='Couldn’t reach the server. Try again.';err.hidden=false}}
      else toast('Saved. The website shows your new hours now.')}}}

(function(){const f=$('#iForm');if(!f)return;let selD=null,selS=null,best='Text',userPicked=false;
  /* the booking lives in a 2-step modal: 1 day + time, 2 contact. The page only shows a small card. */
  const MD=$('#iModal');document.body.appendChild(MD);const titles=['Pick a day and time','Where should we reach you?'];
  function iStep(n){$$('#iModal .istep').forEach(x=>x.hidden=+x.dataset.s!==n);$$('#iModal .imsteps i').forEach((d,i)=>d.classList.toggle('on',i<n));$('#imH').textContent=titles[n-1];MD.querySelector('.impanel').scrollTop=0;
    if(n===2){$('#iWhen').innerHTML=`<b>${selD?fmt(selD)+' at '+AV.label(selS):''}</b> <button type="button" class="linkbtn" id="iChg">Change</button>`;$('#iChg').onclick=()=>iStep(1);setTimeout(()=>{const n1=['#iName','#iPhone','#iEmail','#iAddr'].map(x=>$(x)).find(x=>!x.value);if(n1&&matchMedia('(min-width:700px)').matches)n1.focus()},60)}}
  function openIM(done){if(window.__iPrefill)window.__iPrefill();MD.hidden=false;document.documentElement.classList.add('imopen');requestAnimationFrame(()=>MD.classList.add('in'));
    if(done&&!$('#iDone').hidden){f.hidden=true;$('.imsteps').hidden=true;$('#imH').textContent='You’re booked'}else{f.hidden=false;$('#iDone').hidden=true;$('.imsteps').hidden=false;iStep(1)}}
  function closeIM(){MD.classList.remove('in');document.documentElement.classList.remove('imopen');setTimeout(()=>MD.hidden=true,reduce?0:220)}
  window.openInspect=openIM;window.closeInspect=closeIM;
  $('#iOpen').onclick=()=>openIM();$$('#iModal [data-iclose]').forEach(x=>x.onclick=closeIM);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!MD.hidden)closeIM()});
  document.addEventListener('click',e=>{const a=e.target.closest('a[href$="#inspect"]');if(!a)return;e.preventDefault();openIM()},true);
  MD.addEventListener('click',e=>{if(e.target.closest('a[href*="#quote"]'))closeIM()});
  $('#iNext1').onclick=()=>{const e1=$('#iErr1');if(!selD||!selS){e1.textContent='Pick a day and a time.';e1.hidden=false;return}e1.hidden=true;iStep(2)};
  $('#iBack').onclick=()=>iStep(1);
  const fmt=d=>d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
  const picker=AV.mountPicker($('#iCal'),$('#iSlots'),(d,w)=>{selD=d;selS=w;if(d&&w&&!userPicked){const t=`Next open: <b>${fmt(d)}, ${AV.label(w)}</b>`;const nx=$('#iNext');if(nx){nx.innerHTML=t;nx.hidden=false}const qn=$('#qbNext');if(qn)qn.innerHTML=t}});window.__iPicker=picker;
  const pick=(sel,attr,set)=>$$(sel+' button').forEach(b=>b.onclick=()=>{set(b.dataset[attr]);$$(sel+' button').forEach(x=>x.setAttribute('aria-checked',String(x===b)))});
  pick('#iBest','best',v=>{best=v;const c=$('#iSmsC');if(c)c.hidden=v!=='Text'});
  const IJ={};
  const syncIJ=()=>{$('#iIssue').value=$$('#iJobs [aria-pressed=true]').map(b=>b.dataset.ij).join(', ')};
  function setIJobs(list){if(!list.length)return;$$('#iJobs button').forEach(b=>b.setAttribute('aria-pressed',String(list.includes(b.dataset.ij))));syncIJ()}
  $$('#iJobs button').forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true',ns=b.dataset.ij.startsWith('Not sure');
    if(on)$$('#iJobs button').forEach(x=>{if(x!==b&&(ns||x.dataset.ij.startsWith('Not sure')))x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed',String(on));syncIJ();$('#iJobs').classList.remove('bad')});
  /* prefill from what we already know (an earlier booking or the instant quote) */
  try{const m=JSON.parse(localStorage.getItem('kcleanin-me')||'null');if(m){if(m.name)$('#iName').value=m.name;if(m.phone)$('#iPhone').value=m.phone;if(m.email)$('#iEmail').value=m.email}
    const q=JSON.parse(localStorage.getItem('kcleanin-quote')||'null');if(q&&q.addr)$('#iAddr').value=q.addr;
    if(q&&q.touched&&q.jobs)setIJobs(q.jobs.map(k=>IJ[k]).filter(Boolean))}catch(x){}
  /* when the visitor uses the instant quote, carry the jobs and address into the form */
  window.__iPrefill=()=>{try{const q=JSON.parse(localStorage.getItem('kcleanin-quote')||'null');if(q&&q.touched){if(q.jobs)setIJobs(q.jobs.map(k=>IJ[k]).filter(Boolean));if(q.addr&&!$('#iAddr').value)$('#iAddr').value=q.addr}
    const m=me();if(m){if(m.name&&!$('#iName').value)$('#iName').value=m.name;if(m.phone&&!$('#iPhone').value)$('#iPhone').value=m.phone;if(m.email&&!$('#iEmail').value)$('#iEmail').value=m.email}}catch(x){}};
  f.addEventListener('submit',async e=>{e.preventDefault();const v=id=>$(id).value.trim(),err=$('#iErr');
    const D={name:v('#iName'),phone:v('#iPhone'),email:v('#iEmail'),addr:v('#iAddr'),issue:v('#iIssue')};
    const okP=phoneOk(D.phone),okE=/^\S+@\S+\.\S+$/.test(D.email);
    const bad=!D.name?'#iName':!okP?'#iPhone':!okE?'#iEmail':(true&&D.addr.length<5)?'#iAddr':!D.issue?'#iIssue':null;
    $$('#iForm .bad').forEach(x=>x.classList.remove('bad'));
    if(bad){err.hidden=false;err.textContent={'#iName':'Add your name.','#iPhone':'Add your 10-digit mobile number.','#iEmail':'Add your email.','#iAddr':'Add the property address.','#iIssue':'Pick at least one thing you need.'}[bad];if(bad==='#iIssue'){$('#iJobs').classList.add('bad');$('#iJobs').scrollIntoView({block:'center'});return}$(bad).classList.add('bad');$(bad).focus();return}
    
    if(!selD||!selS){iStep(1);$('#iErr1').textContent='Pick a day and a time.';$('#iErr1').hidden=false;return}
    err.hidden=true;const appt={t:selD.getTime(),time:selS,slot:AV.label(selS),confirmed:false};const smsOk=best==='Text'&&!!($('#iSms')&&$('#iSms').checked);
    const btn=f.querySelector('.ibtn'),bt=btn.textContent;let sent=false;
    if(CFG.backend){btn.disabled=true;btn.textContent='Booking…';const r=await sendLead({name:D.name,phone:D.phone,addr:D.addr,msg:D.issue,source:"Free quote",appt,email:D.email,best,sms:smsOk});var notified=(r&&r.notified)||'';btn.disabled=false;btn.textContent=bt;
      if(r&&r.ok===false){err.hidden=false;err.textContent=r.reason==='taken'?'That time was just taken. Pick another one.':'Something went wrong. Please try again or text us.';AV.load();return}sent=true}
    let q=null;try{q=JSON.parse(localStorage.getItem('kcleanin-quote')||'null')}catch(x){}
    const c=upsert({name:D.name,phone:D.phone,addr:D.addr,msg:D.issue,source:"Free quote",appt,email:D.email,best,sms:smsOk,_sent:sent});
    Object.assign(c,{email:D.email,contactPref:best});if(q)c.quote=q;save();
    try{localStorage.setItem('kcleanin-me',JSON.stringify({phone:digits(D.phone),name:D.name,email:D.email,contact:best,sms:smsOk}))}catch(x){}
    const first=D.name.split(' ')[0],when=`${fmt(selD)} at ${AV.label(selS)}`;
    const nt=typeof notified==='string'?notified:'';
    $('#iDone').innerHTML=`<p class="ikick">You’re booked</p><h2>See you ${fmt(selD)}, ${esc(first)}.</h2>
      ${nt==='sms'?`<p class="idsub">A confirmation text is on its way to ${esc(D.phone)}:</p><div class="ibubble"><small>Bayou Sparkle Home Cleaning · text</small>Hi ${esc(first)}, you’re booked for your free quote on ${when}. Need to change it? Use the link in this text. Reply STOP to opt out.</div>`
        :nt==='email'?`<p class="idsub">Your confirmation just went to ${esc(D.email)}.</p>`
        :`<p class="idsub">${best==='Call'?'We’ll call you':'We’ll text you'} at ${esc(D.phone)} to confirm.</p>`}
      <p class="idemo">${CFG.backend?'The owner already has your request. If the time ever needs to move, you’ll hear from us the way you picked.':'Demo: on a live site the confirmation goes out the way the customer picked (text, call or email) and the owner gets an instant alert.'}</p>
      <ul class="iperks"><li><b>Free quote:</b> ${when}</li><li><b>You need:</b> ${esc(D.issue)}</li>${q&&q.touched&&q.range?`<li><b>Your price held 30 days:</b> ${esc(q.name)}, ${esc(q.range)}</li>`:''}<li><b>We’ll reach you by:</b> ${best.toLowerCase()}</li></ul>
      ${(()=>{const st=new Date(selD);const[hh,mm]=String(selS).split(':').map(Number);st.setHours(hh||9,mm||0,0,0);return calButtons('Free quote · '+CFG.biz,st,AV.S.len||60,D.addr,'You need: '+D.issue+'. Questions? Call or text '+BIZ_PRETTY)})()}
      <div class="row"><button class="btn btn-main" type="button" id="iDoneX">Done</button><button class="btn btn-line" type="button" id="iEdit">Change something</button></div>`;
    f.hidden=true;$('.imsteps').hidden=true;$('#imH').textContent='You’re booked';$('#iDone').hidden=false;MD.querySelector('.impanel').scrollTop=0;
    $('#iEdit').onclick=()=>{f.hidden=false;$('#iDone').hidden=true;$('.imsteps').hidden=false;iStep(2)};$('#iDoneX').onclick=closeIM;
    const bk=$('#iBooked');bk.innerHTML=`<span class="okpill">Booked</span> <b>${when}</b> <button type="button" class="linkbtn" id="iSee">See details</button>`;bk.hidden=false;$('#iSee').onclick=()=>openIM(true);
    $('#iOpen').textContent='Book another time';$('#iNext').hidden=true;const qn=$('#qbNext');if(qn)qn.innerHTML=`Booked: <b>${when}</b>`;
    if(M&&!reduce)M.animate('#iDone',{opacity:[0,1],y:[16,0]},{duration:.35})});
  $('#iSlots').addEventListener('click',()=>{userPicked=true});$('#iCal').addEventListener('click',()=>{userPicked=true});
  /* any "Book a free inspection" button on the homepage jumps to this form instead of a pop-up */

})();




/* ---------- header menu, thumb bar, club ---------- */
$('#menuBtn').onclick=()=>{const close=open(`<div class="scrim"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mH"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3 id="mH">Menu</h3><button class="btn btn-line btn-sm" type="button" data-close>Close</button></div>
    <nav class="menu"><button class="btn-main" type="button" data-go="start">Get a free quote</button><button type="button" data-go="ask">Ask a question</button><a href="${HOME}#svc0">Recurring cleaning</a><a href="${HOME}#svc1">Deep cleaning</a><a href="${HOME}#svc2">Move-in and move-out cleaning</a><a href="${HOME}#svc3">Airbnb turnovers</a><a href="${HOME}#svc4">Kitchens and bathrooms</a><a href="${HOME}#svc5">Add-ons</a><a href="${HOME}#club">Recurring plans</a><a href="${HOME}#faq">Questions</a><a href="#" data-sms="fab">Text us</a><button type="button" data-go="login">Customer login</button></nav></div></div>`,'#layer .menu .btn-main');
  refreshSms(document);
  $$('#layer [data-go]').forEach(x=>x.addEventListener('click',()=>{const g=x.dataset.go;close();if(g==='start')startSheet();if(g==='login')loginSheet();if(g==='ask'&&window.openAsk)openAsk('s0')}))};
addEventListener('scroll',()=>{const i=$('#inspect');const r=i?i.getBoundingClientRect():null;$('#thumbbar').classList.toggle('on',scrollY>120&&!(r&&r.top<innerHeight&&r.bottom>0))},{passive:true});


/* ================= v9: always-on banner, seasonal sky, roof lookup ================= */

/* ---- banner: Text / Call popover + which section you're on ---- */
{const b=$('#tcBtn'),pop=$('#tcPop');if(b&&pop){const set=v=>{pop.hidden=!v;b.setAttribute('aria-expanded',v)};
  b.onclick=e=>{e.stopPropagation();set(pop.hidden);if(!pop.hidden&&M&&!reduce)M.animate(pop,{opacity:[0,1],y:[-6,0]},{duration:.18})};
  document.addEventListener('click',e=>{if(!pop.hidden&&!pop.contains(e.target)&&e.target!==b)set(false)});
  pop.addEventListener('click',e=>{if(e.target.closest('a'))setTimeout(()=>set(false),50)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)})}
 const map={inspect:$('#inspect'),quote:$('#quote'),what:$('#what')};
 if(window.IntersectionObserver&&map.inspect){const vis={};const io=new IntersectionObserver(es=>{es.forEach(x=>vis[x.target.id]=x.isIntersecting?x.intersectionRatio:0);
   let best=null,bv=0;for(const k in vis)if(vis[k]>bv){bv=vis[k];best=k}
   $$('#qbar [data-q]').forEach(a=>a.classList.toggle('on',a.dataset.q===best))},{threshold:[0,.15,.3,.5]});
  Object.values(map).forEach(el=>el&&io.observe(el))}}


/* ---- seasonal particles (rain, leaves, hail, heat, snow) on top of the WebGL sky ---- */
{const cv=$('#sky');if(cv){const g=cv.getContext('2d');let W=0,H=0,dpr=1,P=[],sea='fall',raf=0,t0=0,clouds=[];
  const pal={fall:['#121B23','#1E2B36','#2A3742'],spring:['#13202A','#1C3140','#28414F'],summer:['#1E1A1A','#2E2420','#3E2C22'],winter:['#121A24','#1C2836','#2A3848']};
  const R=(a,b)=>a+Math.random()*(b-a);
  const LEAF=['#C4622D','#D9893A','#A8432A','#E0B04A','#8C5A2B'];
  function mk(fresh){const p={x:R(0,W),y:fresh?R(-H,H):R(-60,-10),s:R(.6,1.4)};
    if(sea==='fall'){Object.assign(p,{k:Math.random()<.42?'leaf':'rain',vx:R(1.2,2.6),vy:R(1.4,3),r:R(0,6.28),vr:R(-.05,.05),c:LEAF[(Math.random()*LEAF.length)|0]})}
    else if(sea==='spring'){Object.assign(p,{k:Math.random()<.32?'hail':'rain',vx:R(.3,.9),vy:R(5,8),b:0})}
    else if(sea==='summer'){Object.assign(p,Math.random()<.4?{k:'mote',y:fresh?R(0,H):H+R(10,60),vx:R(-.2,.3),vy:-R(.15,.45),a:R(.25,.6)}:{k:'heat',y:fresh?R(0,H):H+R(10,80),vx:R(-.15,.15),vy:-R(.25,.6),a:R(.05,.14),w:R(40,120)})}
    else Object.assign(p,{k:'snow',vx:R(-.3,.4),vy:R(.4,1.1),r:R(0,6.28)});return p}
  function size(){dpr=Math.min(1.5,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.round(Math.min(90,W*H/(sea==='summer'?26000:14000)));P=Array.from({length:n},()=>mk(true));
    clouds=Array.from({length:5},(_,i)=>({x:R(-.2,1.1)*W,y:R(-.1,.55)*H,r:R(.35,.7)*Math.max(W,H),v:R(.04,.12)*(i%2?1:.6)}))}
  function bolt(){const B=window.RLSKY&&window.RLSKY.bolt;if(!B)return;B.life*=.9;if(B.life<.03){window.RLSKY.bolt=null;return}
    const ln=(pts,w)=>{g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.lineWidth=w;g.stroke()};g.save();g.lineCap='round';g.lineJoin='round';
    g.shadowColor='rgba(170,200,255,.9)';g.shadowBlur=18;g.strokeStyle=`rgba(225,235,255,${B.life})`;ln(B.m,2.6);B.br.forEach(b=>ln(b,1.2));g.shadowBlur=0;g.strokeStyle=`rgba(255,255,255,${B.life})`;ln(B.m,1);g.restore()}
  function bg(){if(window.RLSKY){g.clearRect(0,0,W,H);bolt();return}const c=pal[sea]||pal.fall,gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,c[2]);gr.addColorStop(.45,c[1]);gr.addColorStop(1,c[0]);g.fillStyle=gr;g.fillRect(0,0,W,H);
    if(sea==='summer'){const s=g.createRadialGradient(W*.85,-H*.05,0,W*.85,-H*.05,H*.9);s.addColorStop(0,'rgba(255,190,90,.38)');s.addColorStop(1,'rgba(255,150,60,0)');g.fillStyle=s;g.fillRect(0,0,W,H)}
    for(const k of clouds){const cg=g.createRadialGradient(k.x,k.y,0,k.x,k.y,k.r);const a=sea==='summer'?.05:sea==='winter'?.1:.13;cg.addColorStop(0,`rgba(150,170,185,${a})`);cg.addColorStop(1,'rgba(150,170,185,0)');g.fillStyle=cg;g.fillRect(0,0,W,H)}}
  function frame(t){const dt=Math.min(3,(t-(t0||t))/16.7);t0=t;bg();
    const wind=sea==='fall'?1+Math.sin(t/2600)*.6:1;
    for(const k of clouds){k.x+=k.v*dt*wind;if(k.x-k.r>W)k.x=-k.r}
    for(let i=0;i<P.length;i++){const p=P[i];p.x+=p.vx*dt*wind;p.y+=p.vy*dt;
      if(p.k==='leaf'){p.r+=p.vr*dt;p.x+=Math.sin(t/600+i)*.6;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.scale(p.s,p.s*Math.abs(Math.cos(t/500+i))+.2);g.fillStyle=p.c;g.globalAlpha=.75;g.beginPath();g.ellipse(0,0,7,3.6,0,0,6.283);g.fill();g.restore()}
      else if(p.k==='rain'){g.strokeStyle='rgba(190,210,225,.22)';g.lineWidth=1.1*p.s;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*4,p.y-p.vy*4);g.stroke()}
      else if(p.k==='hail'){if(p.y>H-8&&p.b<2){p.y=H-8;p.vy=-p.vy*.35;p.vx+=R(-1.5,1.5);p.b++}else p.vy+=.18*dt;g.fillStyle='rgba(235,242,248,.75)';g.beginPath();g.arc(p.x,p.y,2.4*p.s,0,6.283);g.fill()}
      else if(p.k==='snow'){p.x+=Math.sin(t/900+i)*.35;g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(p.x,p.y,1.8*p.s,0,6.283);g.fill()}
      else if(p.k==='mote'){g.fillStyle=`rgba(255,214,150,${p.a})`;g.beginPath();g.arc(p.x+Math.sin(t/700+i)*6,p.y,1.6*p.s,0,6.283);g.fill()}
      else if(p.k==='heat'){g.strokeStyle=`rgba(255,200,140,${p.a})`;g.lineWidth=2;g.beginPath();for(let j=0;j<=6;j++){const xx=p.x-p.w/2+j*p.w/6,yy=p.y+Math.sin(t/400+j+i)*4;j?g.lineTo(xx,yy):g.moveTo(xx,yy)}g.stroke()}
      if(p.y>H+20||p.x>W+40||p.x<-60||((p.k==='heat'||p.k==='mote')&&p.y<-20))P[i]=mk(false)}
    raf=requestAnimationFrame(frame)}
  function start(){cancelAnimationFrame(raf);sea=document.documentElement.dataset.season||'fall';size();if(reduce){bg();return}t0=0;raf=requestAnimationFrame(frame)}
  addEventListener('kcleanin-season',start);let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(start,150)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else start()});start()}}

/* ---- Instant Roof Quote drawer (side tab, like Roofle on hargroveroofing.com):
   1 address (autocomplete) + satellite roof outline → 2 job details → 3 contact → 4 price.
   Demo services, no key: Esri address suggest + Esri satellite + FEMA USA Structures roof outlines (OSM fallback).
   Live client sites: set MAPS_KEY (Google Maps Static satellite, key locked to the domain). */

const QD=$('#quote');
let qStep=1,qUnlocked=false;
function qGo(n){if(!QD)return;if(n===3&&qUnlocked)n=4;if(n===3){const m=me();if(m&&m.name&&m.phone&&m.email){qUnlock(m,true);n=4}}
  qStep=n;$$('#quote .qstep').forEach(s=>s.hidden=+s.dataset.step!==n);$$('#quote .qdsteps i').forEach((d,i)=>d.classList.toggle('on',i<n));
  const p=$('#quote .qdpanel');if(p)p.scrollTop=0;if(n===4&&typeof qOut==='function')qOut();
  if(n===2&&typeof qRender==='function')qRender();
  if(n===3&&typeof qCalc==='function'){const inq=!QT.job,h=$('#quote [data-step="3"] h2'),p=$('#quote [data-step="3"] .qdsub');if(h)h.textContent=inq?'Where should we reach you?':'Where should we send your price?';if(p)p.textContent=inq?'We’ll set up your free quote and send a written quote after. No spam.':'We send you a copy and hold this price for 30 days. No spam, no sales calls you didn’t ask for.'}}
function qOpen(job){if(!QD)return;if(job&&window.setJob)window.setJob(job);QD.hidden=false;document.documentElement.classList.add('qopen');
  requestAnimationFrame(()=>QD.classList.add('in'));qGo(qStep);const tip=$('#qTip');if(tip)tip.hidden=true;
  setTimeout(()=>{const f=qStep===1?$('#rmAddr'):null;if(f&&matchMedia('(min-width:700px)').matches)f.focus()},300);window.dispatchEvent(new Event('kcleanin-qopen'))}
function qClose(){if(!QD||QD.hidden)return;QD.classList.remove('in');document.documentElement.classList.remove('qopen');setTimeout(()=>{QD.hidden=true},reduce?0:280);if(location.hash==='#quote')history.replaceState(null,'',location.pathname+location.search)}
window.openQuote=qOpen;window.closeQuote=qClose;
function qUnlock(m,silent){qUnlocked=true;try{const q=JSON.parse(localStorage.getItem('kcleanin-quote')||'{}');q.touched=true;localStorage.setItem('kcleanin-quote',JSON.stringify(q))}catch(x){}}
if(QD){
  $('#qTab').onclick=()=>qOpen();
  $$('#quote [data-qclose]').forEach(b=>b.onclick=qClose);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')qClose()});
  $$('#quote [data-qgo]').forEach(b=>b.onclick=()=>qGo(+b.dataset.qgo));
  /* every "#quote" link on any page opens the drawer here instead of jumping */
  document.addEventListener('click',e=>{const a=e.target.closest('a[href*="#quote"]');if(!a||a.closest('#quote'))return;e.preventDefault();
    let job=null;try{const u=new URL(a.getAttribute('href'),location.href);job=u.searchParams.get('job')}catch(x){}
    const MAP={'roof-replacement':'replace','roof-repair':'repair','storm-damage':'storm','insurance-claims':'storm','attic-ventilation':'vent','commercial-roofing':'commercial',com:'commercial'};qOpen(job?(MAP[job]||job):null)},true);
  if(location.hash==='#quote')setTimeout(()=>qOpen(),400);
  addEventListener('hashchange',()=>{if(location.hash&&location.hash!=='#quote')qClose()});
  /* "Need a roof quote?" bubble once per visit */
  const tip=$('#qTip');let seen=false;try{seen=sessionStorage.getItem('kcleanin-qtip')==='1'}catch(x){}
  /* the bubble never covers the hero: it only shows once the hero is off screen */
  const heroOff=()=>{const h=$('#hero');if(!h)return true;const r=h.getBoundingClientRect();return r.bottom<60||r.top>innerHeight};
  const tipShow=()=>{if(seen||!tip||!QD.hidden)return;if(!heroOff()){addEventListener('scroll',function f(){if(heroOff()){removeEventListener('scroll',f);setTimeout(tipShow,600)}},{passive:true});return}seen=true;tip.hidden=false;try{sessionStorage.setItem('kcleanin-qtip','1')}catch(x){}setTimeout(()=>tip.hidden=true,9000)};
  if(tip&&!seen)setTimeout(tipShow,5000);
  document.addEventListener('pointerdown',e=>{if(tip&&!tip.hidden&&!tip.contains(e.target))tip.hidden=true},true);
  if(tip){tip.querySelector('.qtipx').onclick=()=>tip.hidden=true;tip.querySelector('.qtipgo').onclick=()=>qOpen()}
  $('#q1Skip').onclick=()=>qGo(2);$('#q1Next').onclick=()=>qGo(2);$('#q2Next').onclick=()=>{const roofy=['replace','commercial'].includes(QT.job);const s=$('#qSize');
    if(roofy&&!QT.unsure&&!(parseFloat(String(QT.size).replace(/[^\d.]/g,''))>0)){s.classList.add('bad');s.focus();let h=$('#qSizeErr');if(!h){h=document.createElement('p');h.id='qSizeErr';h.className='err';s.closest('.field').appendChild(h)}h.textContent='Type your best guess, or tick “Not sure”.';return}
    const h=$('#qSizeErr');if(h)h.remove();s&&s.classList.remove('bad');qGo(3)};
  /* contact step: the price shows only after this */
  let qbest='Text';$$('#qcBest [data-best]').forEach(b=>b.onclick=()=>{qbest=b.dataset.best;$$('#qcBest [data-best]').forEach(x=>x.setAttribute('aria-checked',String(x===b)));$('#qcSmsC').hidden=qbest!=='Text'});
  {const m=me();if(m){if(m.name)$('#qcName').value=m.name;if(m.phone)$('#qcPhone').value=m.phone;if(m.email)$('#qcEmail').value=m.email}}
  $('#qcForm').onsubmit=e=>{e.preventDefault();const v=s=>$(s).value.trim(),D={name:v('#qcName'),phone:v('#qcPhone'),email:v('#qcEmail')},err=$('#qcErr');
    const okP=phoneOk(D.phone),okE=/^\S+@\S+\.\S+$/.test(D.email);
    const bad=!D.name?'#qcName':!okP?'#qcPhone':!okE?'#qcEmail':null;$$('#qcForm .bad').forEach(x=>x.classList.remove('bad'));
    if(bad){err.hidden=false;err.textContent={'#qcName':'Add your name.','#qcPhone':'Add your 10-digit mobile number.','#qcEmail':'Add your email.'}[bad];$(bad).classList.add('bad');$(bad).focus();return}
    err.hidden=true;const r=qCalc();const need=r.jobs.map(k=>QJN[k]).join(', ');qUnlock();const c=upsert({name:D.name,phone:D.phone,addr:QT.addr,source:r.inquiry?'Service inquiry':'Website',msg:r.inquiry?'Needs: '+need:`Needs: ${need}. Home estimate: ${r.name}, ${qmoney(r.lo)}–${qmoney(r.hi)}`,email:D.email,best:qbest,sms:qbest==='Text'&&$('#qcSms').checked});
    Object.assign(c,{email:D.email,contactPref:qbest,quote:r.inquiry?null:{name:r.name,range:qmoney(r.lo)+'–'+qmoney(r.hi),addr:QT.addr}});save();
    try{localStorage.setItem('kcleanin-me',JSON.stringify({phone:digits(D.phone),name:D.name,email:D.email,contact:qbest,sms:qbest==='Text'&&$('#qcSms').checked}))}catch(x){}
    const ia=$('#iName');if(ia&&!ia.value){ia.value=D.name;$('#iPhone').value=D.phone;$('#iEmail').value=D.email;const ad=$('#iAddr');if(ad&&!ad.value&&QT.addr)ad.value=QT.addr}
    qUnlock();qGo(4)}}

/* ---- step 1: just the address (type-ahead suggestions, no map; the owner, Oct 4) ---- */
{const inp=$('#rmAddr'),list=$('#acList'),msg=$('#rmMsg');if(inp&&list){
  const GEO='https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/';let sugg=[],act=-1,seq=0,tmr;
  const say=(t,bad)=>{msg.textContent=t;msg.classList.toggle('bad',!!bad)};
  const useAddr=t=>{const nice=String(t).replace(/, USA$/,'').trim();inp.value=nice;QT.addr=nice;const qa=$('#qAddr');if(qa)qa.value=nice;const ia=$('#iAddr');if(ia&&!ia.value)ia.value=nice;
    try{localStorage.setItem('kcleanin-roof',JSON.stringify({addr:nice}))}catch(x){}hideList();say('');showMap(nice)};
  /* Google satellite view of the address so the visitor can confirm it's their house (identifier only; no size is read from it) */
  const MAPWRAP=$('#rmMap');
  function showMap(addr){if(!MAPWRAP){qGo(2);return}const src='https://maps.google.com/maps?q='+encodeURIComponent(addr)+'&t=k&z=20&output=embed';
    $('#rmFrame').innerHTML=`<iframe src="${src}" title="Satellite view of ${esc(addr)}" loading="eager" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;MAPWRAP.hidden=false;
    const yes=$('#rmYes');setTimeout(()=>{try{yes.focus({preventScroll:true})}catch(x){}},50);MAPWRAP.scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'})}
  if(MAPWRAP){$('#rmYes').onclick=()=>qGo(2);$('#rmNo').onclick=()=>{MAPWRAP.hidden=true;inp.focus();inp.select()}}
  function hideList(){list.hidden=true;inp.setAttribute('aria-expanded','false');act=-1}
  function showList(){list.innerHTML=sugg.map((s,i)=>`<li role="option" id="ac${i}" aria-selected="${i===act}" data-i="${i}">${esc(s.text.replace(/, USA$/,''))}</li>`).join('');
    list.hidden=!sugg.length;inp.setAttribute('aria-expanded',String(!!sugg.length));if(act>=0)inp.setAttribute('aria-activedescendant','ac'+act);else inp.removeAttribute('aria-activedescendant')}
  inp.addEventListener('input',()=>{clearTimeout(tmr);const v=inp.value.trim();if(v.length<3){sugg=[];hideList();return}
    tmr=setTimeout(async()=>{const my=++seq;try{const j=await(await fetch(`${GEO}suggest?f=json&countryCode=USA&category=Address&maxSuggestions=6&location=${CFG.lon},${CFG.lat}&text=${encodeURIComponent(v)}`)).json();
      if(my!==seq)return;sugg=(j.suggestions||[]).filter(s=>!s.isCollection);act=-1;showList()}catch(x){sugg=[];hideList()}},220)});
  inp.addEventListener('keydown',e=>{if(list.hidden)return;if(e.key==='ArrowDown'){e.preventDefault();act=(act+1)%sugg.length;showList()}else if(e.key==='ArrowUp'){e.preventDefault();act=(act-1+sugg.length)%sugg.length;showList()}
    else if(e.key==='Enter'&&act>=0){e.preventDefault();useAddr(sugg[act].text)}else if(e.key==='Escape'){e.stopPropagation();hideList()}});
  let picked=false;const pickLi=e=>{const li=e.target.closest('li');if(!li)return;e.preventDefault();if(picked)return;picked=true;setTimeout(()=>picked=false,600);inp.blur();useAddr(sugg[+li.dataset.i].text)};
  list.addEventListener('pointerdown',pickLi);list.addEventListener('mousedown',e=>e.preventDefault());list.addEventListener('click',pickLi);
  inp.addEventListener('blur',()=>setTimeout(hideList,350));
  $('#rmForm').onsubmit=e=>{e.preventDefault();const v=inp.value.trim();if(act>=0&&sugg[act])return useAddr(sugg[act].text);if(v.length<6){say('Type your street address, city and ZIP.',true);return}useAddr(v)}}}

/* ---- address type-ahead for any address box (inspection form, club sign-up): street + city + ZIP in one tap ---- */
function addrTypeahead(inp){if(!inp||inp.dataset.ta)return;inp.dataset.ta='1';inp.setAttribute('autocomplete','off');inp.setAttribute('role','combobox');inp.setAttribute('aria-autocomplete','list');
  const wrap=document.createElement('div');wrap.className='acwrap acfield';inp.parentNode.insertBefore(wrap,inp);wrap.appendChild(inp);
  const list=document.createElement('ul');list.className='aclist';list.setAttribute('role','listbox');list.hidden=true;list.id=inp.id+'List';inp.setAttribute('aria-controls',list.id);wrap.appendChild(list);
  const GEO='https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/';let sugg=[],act=-1,seq=0,tmr;
  const hide=()=>{list.hidden=true;inp.setAttribute('aria-expanded','false');act=-1};
  const show=()=>{list.innerHTML=sugg.map((x,i)=>`<li role="option" aria-selected="${i===act}" data-i="${i}">${esc(x.text.replace(/, USA$/,''))}</li>`).join('');list.hidden=!sugg.length;inp.setAttribute('aria-expanded',String(!!sugg.length))};
  const use=t=>{inp.value=String(t).replace(/, USA$/,'');hide();inp.dispatchEvent(new Event('change',{bubbles:true}))};
  inp.addEventListener('input',()=>{clearTimeout(tmr);const v=inp.value.trim();if(v.length<3){sugg=[];hide();return}
    tmr=setTimeout(async()=>{const my=++seq;try{const j=await(await fetch(`${GEO}suggest?f=json&countryCode=USA&category=Address&maxSuggestions=6&location=${CFG.lon},${CFG.lat}&text=${encodeURIComponent(v)}`)).json();if(my!==seq)return;sugg=(j.suggestions||[]).filter(x=>!x.isCollection);act=-1;show()}catch(x){hide()}},220)});
  inp.addEventListener('keydown',e=>{if(list.hidden)return;if(e.key==='ArrowDown'){e.preventDefault();act=(act+1)%sugg.length;show()}else if(e.key==='ArrowUp'){e.preventDefault();act=(act-1+sugg.length)%sugg.length;show()}else if(e.key==='Enter'&&act>=0){e.preventDefault();use(sugg[act].text)}else if(e.key==='Escape')hide()});
  let picked=false;const pick=e=>{const li=e.target.closest('li');if(!li)return;e.preventDefault();if(picked)return;picked=true;setTimeout(()=>picked=false,600);use(sugg[+li.dataset.i].text)};
  list.addEventListener('pointerdown',pick);list.addEventListener('mousedown',e=>e.preventDefault());list.addEventListener('click',pick);inp.addEventListener('blur',()=>setTimeout(hide,350))}
addrTypeahead($('#iAddr'));
/* sign-up sheets are built on the fly: attach when they open */
new MutationObserver(()=>{['#ja','#oaddr'].forEach(s=>{const e=$(s);if(e)addrTypeahead(e)})}).observe(document.getElementById('layer')||document.body,{childList:true,subtree:true});

/* ---- season switcher (demo): pick a season, the sky and the hero follow ---- */
{const box=$('#seaPick');if(box){const SEA=[['fall','Fall','Hurricane · rip it off'],['spring','Spring','Hail · tap to find hits'],['summer','Summer','Heat · drag the sun'],['winter','Winter','Freeze · wipe the frost']];
  const render=()=>{const cur=PICK.season==='auto'?seasonNow():PICK.season;box.querySelector('.chips').innerHTML=SEA.map(([k,t,s])=>{const ready=window.RL_READY&&window.RL_READY[k];return`<button type="button" role="radio" aria-checked="${k===cur}" data-sea="${k}"><b>${t}</b><small>${ready?s:s+' · house photos coming'}</small></button>`}).join('');
    $$('#seaPick [data-sea]').forEach(b=>b.onclick=()=>{PICK.season=b.dataset.sea;apply();if(window.__rebuildFix)try{window.__rebuildFix()}catch(x){}render();const r=window.RL_READY&&window.RL_READY[b.dataset.sea];toast(r?b.querySelector('b').textContent+' house loaded':'Sky switched. This season’s house photos are being made next.')})};
  window.addEventListener('kcleanin-season',render);render()}}

/* ---- Service inquiries: gutters, ventilation, storm and claims get their own short form, never a price ---- */
{const MD=$('#aModal'),F=$('#aForm');if(MD&&F){document.body.appendChild(MD);
  const AQ={"s0": {"name": "Recurring cleaning", "kick": "Recurring cleaning", "h": "Tell us what you need", "qs": [["What kind of clean? Pick all that apply", 1, ["Weekly or every-other-week clean", "First-time deep clean", "Move-in or move-out clean", "Airbnb turnover", "Kitchen and bath detail", "Inside oven and fridge", "Windows and baseboards", "Not sure, help me pick"]], ["When do you need it?", 0, ["As soon as possible", "This week", "This month", "Just planning"]]]}, "s1": {"name": "Deep cleaning", "kick": "Deep cleaning", "h": "Tell us what you need", "qs": [["What kind of clean? Pick all that apply", 1, ["Weekly or every-other-week clean", "First-time deep clean", "Move-in or move-out clean", "Airbnb turnover", "Kitchen and bath detail", "Inside oven and fridge", "Windows and baseboards", "Not sure, help me pick"]], ["When do you need it?", 0, ["As soon as possible", "This week", "This month", "Just planning"]]]}, "s2": {"name": "Move-in and move-out cleaning", "kick": "Move-in and move-out cleaning", "h": "Tell us what you need", "qs": [["What kind of clean? Pick all that apply", 1, ["Weekly or every-other-week clean", "First-time deep clean", "Move-in or move-out clean", "Airbnb turnover", "Kitchen and bath detail", "Inside oven and fridge", "Windows and baseboards", "Not sure, help me pick"]], ["When do you need it?", 0, ["As soon as possible", "This week", "This month", "Just planning"]]]}, "s3": {"name": "Airbnb turnovers", "kick": "Airbnb turnovers", "h": "Tell us what you need", "qs": [["What kind of clean? Pick all that apply", 1, ["Weekly or every-other-week clean", "First-time deep clean", "Move-in or move-out clean", "Airbnb turnover", "Kitchen and bath detail", "Inside oven and fridge", "Windows and baseboards", "Not sure, help me pick"]], ["When do you need it?", 0, ["As soon as possible", "This week", "This month", "Just planning"]]]}, "s4": {"name": "Kitchens and bathrooms", "kick": "Kitchens and bathrooms", "h": "Tell us what you need", "qs": [["What kind of clean? Pick all that apply", 1, ["Weekly or every-other-week clean", "First-time deep clean", "Move-in or move-out clean", "Airbnb turnover", "Kitchen and bath detail", "Inside oven and fridge", "Windows and baseboards", "Not sure, help me pick"]], ["When do you need it?", 0, ["As soon as possible", "This week", "This month", "Just planning"]]]}, "s5": {"name": "Add-ons", "kick": "Add-ons", "h": "Tell us what you need", "qs": [["What kind of clean? Pick all that apply", 1, ["Weekly or every-other-week clean", "First-time deep clean", "Move-in or move-out clean", "Airbnb turnover", "Kitchen and bath detail", "Inside oven and fridge", "Windows and baseboards", "Not sure, help me pick"]], ["When do you need it?", 0, ["As soon as possible", "This week", "This month", "Just planning"]]]}};
  let cur=null,best='Text',A={};
  const step=n=>{$$('#aModal .astep').forEach(x=>x.hidden=+x.dataset.s!==n);$$('#aModal .imsteps i').forEach((d,i)=>d.classList.toggle('on',i<n));$('#amH').textContent=n===1?AQ[cur].h:'Where should we reach you?';MD.querySelector('.impanel').scrollTop=0;
    if(n===2){const m=me()||{};[['#aName','name'],['#aPhone','phone'],['#aEmail','email']].forEach(([s,k])=>{if(m[k]&&!$(s).value)$(s).value=m[k]});try{const q=JSON.parse(localStorage.getItem('kcleanin-quote')||'null');if(q&&q.addr&&!$('#aAddr').value)$('#aAddr').value=q.addr}catch(x){}}};
  function openAsk(k){cur=AQ[k]?k:'s0';const C=AQ[cur];A={};$('#aKick').textContent=C.kick;$('#aNote').value='';
    $('#aQs').innerHTML=C.qs.map(([l,multi,opts],qi)=>`<div class="field"><span class="flabel">${esc(l)}</span><div class="chips ijobs" data-q="${qi}" data-m="${multi}" role="group" aria-label="${esc(l)}">${opts.map(o=>`<button type="button" aria-pressed="false" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`).join('');
    $$('#aQs .chips').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true';if(g.dataset.m==='0')g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed',String(on));g.classList.remove('bad')}));
    F.hidden=false;$('#aDone').hidden=true;MD.querySelector('.imsteps').hidden=false;$('#aErr1').hidden=true;$('#aErr').hidden=true;
    MD.hidden=false;document.documentElement.classList.add('imopen');requestAnimationFrame(()=>MD.classList.add('in'));step(1)}
  function closeAsk(){MD.classList.remove('in');document.documentElement.classList.remove('imopen');setTimeout(()=>MD.hidden=true,reduce?0:220)}
  window.openAsk=openAsk;
  document.addEventListener('click',e=>{const b=e.target.closest('[data-ask]');if(!b)return;e.preventDefault();openAsk(b.dataset.ask)});
  $$('#aModal [data-aclose]').forEach(x=>x.onclick=closeAsk);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!MD.hidden)closeAsk()});
  $$('#aBest button').forEach(b=>b.onclick=()=>{best=b.dataset.best;$$('#aBest button').forEach(x=>x.setAttribute('aria-checked',String(x===b)));$('#aSmsC').hidden=best!=='Text'});
  addrTypeahead($('#aAddr'));
  const answers=()=>AQ[cur].qs.map(([l],qi)=>[l.replace(/\?.*$|\. Pick.*$| \(optional\)/g,''),$$(`#aQs [data-q="${qi}"] [aria-pressed=true]`).map(b=>b.dataset.v).join(', ')]);
  $('#aNext').onclick=()=>{const g=$('#aQs .chips'),first=answers()[0][1];if(!first&&!$('#aNote').value.trim()){g.classList.add('bad');$('#aErr1').textContent='Pick one, or tell us in your own words.';$('#aErr1').hidden=false;return}$('#aErr1').hidden=true;step(2)};
  $('#aBack').onclick=()=>step(1);
  F.addEventListener('submit',async e=>{e.preventDefault();const v=id=>$(id).value.trim(),err=$('#aErr');
    const D={name:v('#aName'),phone:v('#aPhone'),email:v('#aEmail'),addr:v('#aAddr')};const okP=phoneOk(D.phone),okE=/^\S+@\S+\.\S+$/.test(D.email);
    const bad=!D.name?'#aName':!okP?'#aPhone':!okE?'#aEmail':(true&&D.addr.length<5)?'#aAddr':null;$$('#aForm .bad').forEach(x=>x.classList.remove('bad'));
    if(bad){err.hidden=false;err.textContent={'#aName':'Add your name.','#aPhone':'Add your 10-digit mobile number.','#aEmail':'Add your email.','#aAddr':'Add the property address.'}[bad];$(bad).classList.add('bad');$(bad).focus();return}
    err.hidden=true;const C=AQ[cur],note=v('#aNote'),msg=C.name+': '+answers().filter(x=>x[1]).map(([l,a])=>l+': '+a).join(' · ')+(note?' · Notes: '+note:'');
    const smsOk=best==='Text'&&$('#aSms').checked,o={name:D.name,phone:D.phone,email:D.email,addr:D.addr,best,sms:smsOk,msg,source:'Service inquiry: '+C.name};
    const btn=F.querySelector('.ibtn'),bt=btn.textContent;let sent=false;
    if(CFG.backend){btn.disabled=true;btn.textContent='Sending…';const r=await sendLead(o);btn.disabled=false;btn.textContent=bt;if(r&&r.ok===false){err.hidden=false;err.textContent='Something went wrong. Please try again or text us.';return}sent=true}
    const c=upsert({...o,_sent:sent});Object.assign(c,{email:D.email,contactPref:best});save();
    try{localStorage.setItem('kcleanin-me',JSON.stringify({phone:digits(D.phone),name:D.name,email:D.email,contact:best,sms:smsOk}))}catch(x){}
    const first=D.name.split(' ')[0],how=best==='Email'?'email you at '+esc(D.email):best==='Call'?'call you at '+esc(D.phone):'text you at '+esc(D.phone);
    F.hidden=true;MD.querySelector('.imsteps').hidden=true;$('#amH').textContent='Got it, '+first+'.';
    $('#aDone').hidden=false;$('#aDone').innerHTML=`<p class="idsub">We’ll ${how} about “${esc(C.name)}”, usually within a few business hours. </p>
      <p class="idemo">${CFG.backend?'The owner already has your question.':'Demo: on a live site the owner gets an instant alert and replies the way you picked.'}</p>
      <div class="imnav"><button class="btn btn-line" type="button" data-aclose2>Done</button><button class="btn btn-main" type="button" data-start2>Get a free quote too</button></div>`;
    $('#aDone [data-aclose2]').onclick=closeAsk;$('#aDone [data-start2]').onclick=()=>{closeAsk();setTimeout(()=>window.openInspect&&window.openInspect(),reduce?0:240)}})}}

/* ---- Lock in this price: confirmation goes out the way the customer picked (email or text) ---- */
{const bk=$('#qBook');if(bk){bk.onclick=async()=>{const r=qCalc();if(r.inquiry){startSheet();return}const m=me()||{};
  if(!m.name||!(m.phone&&String(m.phone).length>=10)||!m.email){qUnlocked=false;qGo(3);return}
  bk.disabled=true;const bt=bk.textContent;bk.textContent='Locking your price…';
  const until=new Date(Date.now()+30*864e5).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),code='RL-'+Math.random().toString(36).slice(2,6).toUpperCase();
  const lock={name:r.name,range:qmoney(r.lo)+'–'+qmoney(r.hi),until,code},best=m.contact||'Text';
  const o={name:m.name,phone:m.phone,email:m.email,best,sms:!!m.sms,addr:QT.addr,source:'Price lock',msg:`Locked: ${lock.name}, ${lock.range} until ${until} (${code})`,lock};
  let res=null;try{res=await sendLead(o)}catch(x){}
  if(res&&res.ok===false&&res.reason!=='slow_down'){bk.disabled=false;bk.textContent=bt;toast('Couldn’t lock it right now. Please try again.');return}
  const c=upsert(Object.assign({},o,{_sent:true}));c.quote={name:r.name,range:lock.range,addr:QT.addr,locked:until,code};c.contactPref=best;save();
  try{const q=JSON.parse(localStorage.getItem('kcleanin-quote')||'{}');q.locked=until;q.code=code;q.touched=true;localStorage.setItem('kcleanin-quote',JSON.stringify(q))}catch(x){}
  const nt=(res&&res.notified)||'',ph=pretty(m.phone);
  const how=nt==='email'?`Confirmation emailed to <b>${esc(m.email)}</b>.`:nt==='sms'?`Confirmation texted to <b>${esc(ph)}</b>.`
    :!CFG.backend?`Demo: the live site ${best==='Email'?'emails it to '+esc(m.email):'texts it to '+esc(ph)}.`
    :best==='Email'?`Confirmation is on its way to <b>${esc(m.email)}</b>.`:best==='Call'?`We’ll call <b>${esc(ph)}</b> to go over it.`:`We’ll text it to <b>${esc(ph)}</b> shortly.`;
  const box=$('#qLock');box.innerHTML=`<span class="okpill">Price locked</span><p class="qlk"><b>${esc(lock.range)}</b> held until <b>${until}</b><br><small>Lock code ${code}</small></p><p class="qlh">${how}</p><button class="btn btn-main" type="button" id="qLockBook">Book my free quote</button>`;
  box.hidden=false;bk.hidden=true;bk.disabled=false;bk.textContent=bt;$('#qLockBook').onclick=()=>startSheet();if(M&&!reduce)M.animate(box,{opacity:[0,1],y:[10,0]},{duration:.3})}}}
/* ---------- language (Oct 7): remember the pick; offer Spanish to Spanish-language phones once (no auto-redirect) ---------- */
$$('.langsw').forEach(a=>a.addEventListener('click',()=>{try{localStorage.setItem('kcleanin-lang',a.dataset.lang)}catch(x){}}));
{let pick='';try{pick=localStorage.getItem('kcleanin-lang')||''}catch(x){}const sw=$('.langsw');
  if(sw&&document.documentElement.lang!=='es'&&/^es/i.test(navigator.language||'')&&!pick){const b=document.createElement('div');b.className='langtip';b.setAttribute('lang','es');
    b.innerHTML=`<span>¿Prefiere español?</span><a href="${sw.getAttribute('href')}">Ver esta página en español</a><button type="button" aria-label="Cerrar">×</button>`;
    const m=$('#bar');m&&m.appendChild(b);b.querySelector('a').onclick=()=>{try{localStorage.setItem('kcleanin-lang','es')}catch(x){}};b.querySelector('button').onclick=()=>{b.remove();try{localStorage.setItem('kcleanin-lang','en')}catch(x){}}}}
/* ---------- real addresses only, on every screen ----------
   Any address box (website forms, quote, sign-ups, owner app) is checked against the same free address finder the type-ahead uses.
   It must resolve to a house/building address (house number + street), not just a street, city or ZIP.
   A main button (Send / Save / Book / Next) next to an unchecked address waits for the check; a bad address stops it with a plain message. */
const ADDR_SEL='input[autocomplete="street-address"],input[data-addr],#rmAddr,#iAddr,#qAddr,#aAddr,#ja,#oaddr,#aa,#da';
const ADDR_GEO='https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
const ADDR_OK_TYPES=['PointAddress','Subaddress','StreetAddress','StreetAddressExt'];
const addrCache=new Map();
function addrMsg(inp,t){let m=inp.__amsg;if(!m){m=document.createElement('p');m.className='addrmsg';m.setAttribute('role','alert');m.id=(inp.id||'a'+Math.random().toString(36).slice(2,6))+'Msg';
  const anchor=inp.closest('.acwrap')||inp;anchor.insertAdjacentElement('afterend',m);inp.__amsg=m;inp.setAttribute('aria-describedby',((inp.getAttribute('aria-describedby')||'')+' '+m.id).trim())}
  m.textContent=t||'';m.hidden=!t;inp.classList.toggle('bad',!!t);inp.setAttribute('aria-invalid',t?'true':'false')}
async function addrLookup(v){const k=v.toLowerCase().replace(/\s+/g,' ').trim();if(addrCache.has(k))return addrCache.get(k);
  const p=(async()=>{try{const j=await(await fetch(`${ADDR_GEO}?f=json&SingleLine=${encodeURIComponent(v)}&countryCode=USA&maxLocations=1&outFields=Addr_type,Match_addr&location=${CFG.lon},${CFG.lat}`)).json();
    const c=(j.candidates||[])[0];if(!c)return{ok:false};const t=(c.attributes||{}).Addr_type;return{ok:c.score>=85&&ADDR_OK_TYPES.includes(t),type:t,nice:String(c.attributes.Match_addr||c.address||'').replace(/, USA$/,'')}}
    catch(x){return{ok:true,offline:true}}})();/* no connection: don't trap the customer; the owner still sees what they typed */
  addrCache.set(k,p);return p}
/* true = good to go. Empty boxes are left to each form's own "required" rules. */
async function addrCheck(inp,quiet){const v=inp.value.trim();if(!v){inp.dataset.addrOk='';addrMsg(inp,'');return true}
  if(inp.dataset.addrOk===v)return true;
  if(!/\d/.test(v)||v.length<8){if(!quiet)addrMsg(inp,'Add the full address: house number, street and city.');return false}
  const my=(inp.__aseq=(inp.__aseq||0)+1);inp.classList.add('checking');const r=await addrLookup(v);inp.classList.remove('checking');if(my!==inp.__aseq)return inp.dataset.addrOk===inp.value.trim();
  if(r.ok){if(r.nice&&!r.offline&&r.nice.toLowerCase()!==v.toLowerCase()&&/^\d/.test(r.nice)){inp.value=r.nice;inp.dispatchEvent(new Event('change',{bubbles:true}))}inp.dataset.addrOk=inp.value.trim();addrMsg(inp,'');return true}
  if(!quiet)addrMsg(inp,r.type==='StreetName'||r.type==='StreetInt'?'Add the house number too, like 1418 Heights Blvd, Houston.':'We couldn’t find that address. Check the house number, street and city, or pick it from the list.');
  return false}
function addrAttach(inp){if(!inp||inp.__addr||inp.type==='search')return;inp.__addr=true;inp.dataset.addrField='1';
  if(inp.id!=='rmAddr'&&typeof addrTypeahead==='function')addrTypeahead(inp);
  inp.addEventListener('input',()=>{if(inp.dataset.addrOk!==inp.value.trim()){inp.dataset.addrOk='';if(inp.__amsg&&!inp.__amsg.hidden)addrMsg(inp,'')}});
  inp.addEventListener('change',()=>addrCheck(inp,true));
  inp.addEventListener('blur',()=>setTimeout(()=>{if(document.activeElement&&document.activeElement.closest&&document.activeElement.closest('.aclist'))return;addrCheck(inp)},400));
  if(inp.value.trim())addrCheck(inp,true)}
const addrScan=root=>(root.querySelectorAll?[...root.querySelectorAll(ADDR_SEL)]:[]).forEach(addrAttach);
addrScan(document);new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches&&n.matches(ADDR_SEL))addrAttach(n);addrScan(n)}}))).observe(document.body,{childList:true,subtree:true});
/* the guard: main buttons and form submits wait for a real address */
const ADDR_BOX='form,.sheet,.qstep,.astep,.impanel,.idrawer,.ocard,.pbox,section,.app';
function addrFieldsFor(el){let box=el.closest(ADDR_BOX);while(box){const f=[...box.querySelectorAll('[data-addr-field]')].filter(i=>i.offsetParent!==null&&i.value.trim()&&i.dataset.addrOk!==i.value.trim());
    if(box.querySelector('[data-addr-field]'))return f;box=box.parentElement&&box.parentElement.closest(ADDR_BOX)}return[]}
async function addrHold(e,el,resume){const bad=addrFieldsFor(el);if(!bad.length)return;e.preventDefault();e.stopImmediatePropagation();if(el.__ahold)return;el.__ahold=true;
  const res=await Promise.all(bad.map(i=>addrCheck(i)));el.__ahold=false;const first=bad[res.indexOf(false)];
  if(first){first.focus();first.scrollIntoView({block:'center',behavior:'smooth'});return}resume()}
document.addEventListener('click',e=>{const b=e.target.closest('button,[role=button],input[type=submit]');if(!b||b.closest('.aclist'))return;
  const main=b.type==='submit'||/(^|\s)(btn-main|ob-main|pbtn-main|cb-main|cb-go)(\s|$)/.test(b.className);if(!main)return;addrHold(e,b,()=>b.click())},true);
document.addEventListener('submit',e=>{const f=e.target;addrHold(e,f,()=>f.requestSubmit?f.requestSubmit():f.submit())},true);
window.addrCheck=addrCheck;
/* ---------- change or cancel a booked inspection (Oct 8): the confirmation text/email has a private link ?b=KEY.
   No login, no code to type: the key itself is the proof (same as Calendly / Jobber reschedule links). Works on any phone. ---------- */
(()=>{const K=new URLSearchParams(location.search).get('b');if(!K||!/^[a-f0-9]{22}$/.test(K)||!CFG.backend)return;
  const post=o=>fetch(CFG.backend,{method:'POST',body:JSON.stringify(Object.assign({k:K},o))}).then(r=>r.json());
  const day=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  const tel=p=>{const d=String(p||'').replace(/\D/g,'').slice(-10);return d.length===10?`<a href="tel:+1${d}">(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}</a>`:''};
  const close=()=>{closeFull('appt');history.replaceState(null,'',location.pathname+location.hash)};
  const shell=(title,body)=>full('appt',`<header class="apphead"><div><p class="kicker">${esc(CFG.biz)}</p><h2>${title}</h2></div><button class="btn btn-line btn-sm" type="button" id="apX">Close</button></header><div class="appbody"><div class="ocard apcard">${body}</div></div>`);
  const bindX=()=>{const x=$('#apX');if(x)x.onclick=close};
  function gone(msg){shell('This link has expired',`<p>${msg||'This booking was already changed, cancelled, or it has passed.'}</p><a class="btn btn-main" href="#inspect" id="apNew">Book a new time</a>`);bindX();$('#apNew').onclick=()=>close()}
  function view(v){if(v.past)return gone('This free quote already happened. Need another look?');
    shell(`Your free quote, ${esc(v.name)}`,`<p class="apwhen">${esc(v.when)}</p>${v.addr?`<p class="muted">${esc(v.addr)} · You don’t need to be home.</p>`:''}${v.start&&window.calButtons?calButtons('Free quote · '+CFG.biz,new Date(v.start),(AV.S&&AV.S.len)||60,v.addr||'',''):''}
      ${v.late?`<p class="muted">It’s too close to change online. Call us: ${tel(v.phone)}</p>`:`<div class="apbtns"><button class="btn btn-main" type="button" id="apMove">Pick a new time</button><button class="btn btn-line" type="button" id="apCx">Cancel free quote</button></div>`}
      <div id="apPick" hidden><h3>Pick a new time</h3><div class="ical" id="apCal"></div><div class="islots" id="apSlots" role="radiogroup" aria-label="Time"></div><p class="err" id="apErr" role="alert" hidden></p><button class="btn btn-main" type="button" id="apGo" disabled>Move my free quote</button></div>
      <p class="err" id="apErr2" role="alert" hidden></p>`);bindX();
    if(v.late)return;let d=null,w=null;
    $('#apMove').onclick=async()=>{$('#apPick').hidden=false;$('#apMove').hidden=true;await AV.load();AV.mountPicker($('#apCal'),$('#apSlots'),(dd,ww)=>{d=dd;w=ww;const g=$('#apGo');if(!g)return;g.disabled=!(dd&&ww);g.textContent=dd&&ww?`Move to ${dd.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}, ${AV.label(ww)}`:'Move my free quote'});$('#apPick').scrollIntoView({behavior:'smooth',block:'start'})};
    $('#apGo').onclick=async()=>{const b=$('#apGo'),e=$('#apErr');if(!d||!w)return;b.disabled=true;b.textContent='One moment…';
      try{const r=await post({action:'appt_move',date:AV.iso(d),time:w});if(r.ok){done(`You’re all set for ${r.when}.`,'We sent you the new time. Your old time is free for someone else.');return}
        e.textContent=r.reason==='taken'?'Someone just took that time. Pick another one.':r.reason==='late'?'It’s too close to change online. Please call us.':r.reason==='gone'?'This link has expired.':'That didn’t go through. Try again.';e.hidden=false;b.disabled=false;b.textContent='Move my free quote';if(r.reason==='taken')AV.load()}
      catch(x){e.textContent='Couldn’t connect. Check your signal and try again.';e.hidden=false;b.disabled=false;b.textContent='Move my free quote'}};
    $('#apCx').onclick=async()=>{const b=$('#apCx');if(!b.dataset.sure){b.dataset.sure=1;b.textContent='Tap again to cancel';b.classList.add('btn-warn');return}
      b.disabled=true;b.textContent='One moment…';try{const r=await post({action:'appt_cancel'});if(r.ok){done('Your free quote is cancelled.','No charge, nothing else to do. Book again any time.',true);return}const e=$('#apErr2');e.textContent=r.reason==='late'?'This free quote already passed.':'This link has expired.';e.hidden=false}catch(x){const e=$('#apErr2');e.textContent='Couldn’t connect. Check your signal and try again.';e.hidden=false;b.disabled=false;b.textContent='Cancel free quote'}}}
  function done(h,p,cx){shell(h,`<p>${p}</p>${cx?'<a class="btn btn-main" href="#inspect" id="apNew">Book a new time</a>':''}<button class="btn btn-line" type="button" id="apOk">Back to the website</button>`);bindX();$('#apOk').onclick=close;const n=$('#apNew');if(n)n.onclick=()=>close()}
  shell('Your free quote','<p class="muted">Loading your booking…</p>');bindX();
  post({action:'appt_get'}).then(r=>r.ok?view(r):gone()).catch(()=>gone('Couldn’t connect. Check your signal and refresh this page.'))})();

/* ---------- kit: "What’s going on?" picker → booking with that need picked ---------- */
$$('[data-pick]').forEach(b=>b.onclick=()=>{const v=b.dataset.pick;$$('#iJobs button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.ij===v)));const h=$('#iIssue');if(h)h.value=v;$$('[data-pick]').forEach(x=>x.classList.toggle('on',x===b));startSheet()});
/* ---------- kit: review screen (placeholder until GoHighLevel sends review requests after a job) ---------- */
{const f=$('#rvForm');if(f){const n=new URLSearchParams(location.search).get('n');if(n){$('#rvN').value=n;$('#rvH').textContent='How did we do, '+n.split(' ')[0]+'?'}
  const g=$('#rvG');if(g)g.onclick=()=>{$('#rvNote').hidden=false};
  f.addEventListener('submit',ev=>{ev.preventDefault();const nm=$('#rvN').value.trim(),t=$('#rvT').value.trim();if(!t){$('#rvE').textContent='Write a short note first.';$('#rvE').hidden=false;return}
    upsert({name:nm||'Customer',msg:'Private feedback: '+t,source:'Review page'});save();f.hidden=true;$('#rvOk').hidden=false})}}
/* ---------- kit: membership sign-up ---------- */
{const PL=[{"name": "Every 2 weeks", "price": "$175/visit", "perks": ["15% off one-time pricing", "Same team every time", "Inside fridge free once a quarter"]}, {"name": "Weekly", "price": "$150/visit", "perks": ["20% off one-time pricing", "Same team every week", "A rotation task every visit"]}],NA=true;
$$('[data-join]').forEach(b=>b.onclick=()=>{const p=PL[+b.dataset.join];const close=open(`<div class="scrim"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="jH"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3 id="jH">Join ${esc(p.name)}</h3><button class="btn btn-line btn-sm" type="button" data-close>Close</button></div>
    <p class="muted">${esc(p.price)}. We set up your first visit right after.</p>
    <div class="field"><label for="jn">Your name</label><input id="jn" autocomplete="name"></div><div class="field"><label for="jp">Mobile number</label><input id="jp" type="tel" inputmode="tel" autocomplete="tel"></div><div class="field"><label for="jm">Email</label><input id="jm" type="email" inputmode="email" autocomplete="email"></div>${NA?'<div class="field"><label for="ja">Home address</label><input id="ja" autocomplete="street-address"></div>':''}
    <p class="err" id="je" role="alert" hidden></p><button class="btn btn-main" type="button" id="jGo">Join for ${esc(p.price)}</button>
    <p class="muted" style="font-size:14px">Nothing is charged now. We reach out to set up billing.</p></div></div>`,'#jn');
  $('#jGo').onclick=()=>{const n=$('#jn').value.trim(),ph=$('#jp').value.trim(),m=$('#jm').value.trim(),a=NA?$('#ja').value.trim():'',okP=phoneOk(ph),okM=/^\S+@\S+\.\S+$/.test(m);
    const bad=!n?'Add your name.':!okP?'Add your 10-digit mobile number.':!okM?'Add your email.':(NA&&a.length<5)?'Add your home address.':'';
    if(bad){$('#je').textContent=bad;$('#je').hidden=false;return}
    const c=upsert({name:n,phone:ph,email:m,best:'Text',addr:a,source:p.name,club:{plan:p.name+', '+p.price}});c.portal=true;save();
    $('#layer .sheet').innerHTML=`<span class="okpill">You’re in</span><h3>Welcome, ${esc(first(n))}.</h3><p class="muted">We’ll text you to set up your first visit. You can see your plan any time under Customer login.</p><button class="btn btn-line" type="button" id="jDone">Done</button>`;$('#jDone').onclick=close}})}

apply();routeHash();
})();
