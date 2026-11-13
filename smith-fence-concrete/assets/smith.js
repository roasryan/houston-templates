/* Smith Fence & Concrete: service-area checker + owner phone notification (demo) */
(function(){
  var AREAS={
    'Conroe':['77301','77302','77303','77304','77306','77384','77385'],
    'Montgomery':['77316','77356'],
    'The Woodlands':['77380','77381','77382','77389'],
    'Willis':['77318','77378'],
    'Magnolia':['77354','77355'],
    'Spring (Harmony area)':['77386']
  };
  window.SMITH_AREAS=AREAS;
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  function check(q){
    q=String(q||'').trim();if(!q)return null;
    var zip=(q.match(/\b(\d{5})\b/)||[])[1];
    for(var town in AREAS){
      if(zip&&AREAS[town].indexOf(zip)>-1)return{ok:true,town:town,zip:zip};
      if(!zip&&q.toLowerCase().indexOf(town.toLowerCase().replace(/ \(.*\)/,''))>-1)return{ok:true,town:town};
    }
    return{ok:false,zip:zip};
  }
  window.smithAreaCheck=check;
  function initArea(){
    var f=document.getElementById('aForm');if(!f)return;
    var out=document.getElementById('aRes');
    f.addEventListener('submit',function(e){e.preventDefault();
      var r=check(document.getElementById('aQ').value);if(!r){out.hidden=true;return}
      out.hidden=false;
      if(r.ok){out.className='ares ok';out.innerHTML='<b>Yes, we come to '+esc(r.town)+'.</b>Free on-site estimates'+(r.zip?' in '+esc(r.zip):'')+'. Pick a time and we’ll measure and price it in writing.';
        var b=document.getElementById('aBook');b.hidden=false}
      else{out.className='ares maybe';out.innerHTML='<b>That’s just outside our usual area.</b>Text us your address. For bigger jobs we often still come out.';
        document.getElementById('aBook').hidden=true}
    });
  }
  /* Phone-style alert: shows what the owner gets when a customer books or asks a question */
  window.ownerPing=function(o,c){
    if(location.hash==='#owner'||document.body.classList.contains('owner-on'))return;
    var src=String(o.source||'');if(/^Owner|Owner added/.test(src))return;
    var title='New website lead',lines=[];
    if(o.appt){title='New free estimate booked';
      var d=new Date(o.appt.t);lines.push(d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})+' · '+(o.appt.slot||o.appt.time||''))}
    else if(/inquiry|Website/i.test(src)){title='New question from your website'}
    else if(/Review/i.test(src)){title='Private feedback from a customer'}
    else if(o.club){title='New plan sign-up'}
    var ph=String(o.phone||'').replace(/\D/g,'').slice(-10);if(ph.length===10)ph='('+ph.slice(0,3)+') '+ph.slice(3,6)+'-'+ph.slice(6);
    lines.unshift(esc(o.name||'A customer')+(ph?' · '+esc(ph):''));
    if(o.addr)lines.push(esc(o.addr));
    if(o.msg)lines.push('“'+esc(String(o.msg).slice(0,140))+'”');
    var old=document.querySelector('.oping');if(old)old.remove();
    var n=document.createElement('div');n.className='oping';n.setAttribute('role','status');n.setAttribute('aria-live','polite');
    n.innerHTML='<div class="oph"><i>S</i>Text from your website<span>now</span></div><b>'+esc(title)+'</b>'+lines.map(function(l){return'<p>'+l+'</p>'}).join('')+
      '<div class="opa"><a href="owner.html">Open owner app</a><button type="button">Dismiss</button></div><div class="opn">Demo: this is the text Chris gets within a minute.</div>';
    n.querySelector('button').onclick=function(){n.remove()};
    document.body.appendChild(n);setTimeout(function(){if(n.isConnected)n.remove()},14000);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initArea);else initArea();
})();
