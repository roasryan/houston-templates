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
    var f=document.getElementById('areaForm');if(!f)return;
    var out=document.getElementById('areaRes');
    f.addEventListener('submit',function(e){e.preventDefault();
      var r=check(document.getElementById('areaQ').value);if(!r){out.hidden=true;return}
      out.hidden=false;
      if(r.ok){out.className='ares ok';out.innerHTML='<b>Yes, we come to '+esc(r.town)+'.</b>Free on-site estimates'+(r.zip?' in '+esc(r.zip):'')+'. Pick a time and we’ll measure and price it in writing.';
        var b=document.getElementById('areaBook');b.hidden=false}
      else if(!r.zip){out.className='ares maybe';out.innerHTML='<b>Add your ZIP code.</b>Type it at the end of your address, like 77301, and we’ll check right away.';document.getElementById('areaBook').hidden=true}
      else{out.className='ares maybe';out.innerHTML='<b>That’s just outside our usual area.</b>Text us your address. For bigger jobs we often still come out.';
        document.getElementById('areaBook').hidden=true}
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
    else if(o.club){title='New maintenance sign-up'}else if(/Referral/.test(src)){title='New referral'}
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
  /* same check inside the booking form, on the address field */
  function initBookArea(){
    var a=document.getElementById('iAddr');if(!a||a.dataset.areaBound)return;a.dataset.areaBound='1';
    var n=document.createElement('p');n.className='iarea';n.hidden=true;n.setAttribute('aria-live','polite');a.insertAdjacentElement('afterend',n);
    var run=function(){var v=a.value;if(!/\b\d{5}\b/.test(v)&&v.length<8){n.hidden=true;return}var r=check(v);if(!r){n.hidden=true;return}
      n.hidden=false;if(r.ok){n.className='iarea ok';n.textContent='✓ We serve '+r.town+'. Your free estimate is on us.'}
      else if(r.zip){n.className='iarea maybe';n.textContent='That ZIP is just outside our usual area. Book anyway and we’ll text you to confirm.'}else{n.hidden=true}};
    a.addEventListener('input',run);a.addEventListener('blur',run);a.addEventListener('change',run);
  }

  /* referral pop-up: opens from the header, the menu and the referral section on any page */
  function refModal(){
    var d=document.getElementById('refDlg');if(d)return d;
    d=document.createElement('div');d.id='refDlg';d.className='rdlg';d.hidden=true;
    d.innerHTML='<div class="rscrim" data-rclose></div><div class="rcard" role="dialog" aria-modal="true" aria-labelledby="rdH">'+
      '<button class="rx" type="button" data-rclose aria-label="Close">×</button>'+
      '<p class="rkick">Referral · $100 thank-you</p><h2 id="rdH">Refer a friend or family member</h2>'+
      '<p class="rsub">Helping someone find a fence or concrete company? Add their name and email. We’ll reach out, give them a free estimate and tell them you sent them. When they book a job, you get $100.</p>'+
      '<form id="refForm" novalidate><fieldset><legend>Your info</legend><div class="two"><div class="field"><label for="rYou">Your name</label><input id="rYou" autocomplete="name"></div><div class="field"><label for="rYouE">Your email</label><input id="rYouE" type="email" autocomplete="email"></div></div></fieldset>'+
      '<fieldset><legend>Who are you referring?</legend><div class="two"><div class="field"><label for="rThem">Their name</label><input id="rThem"></div><div class="field"><label for="rThemE">Their email</label><input id="rThemE" type="email"></div></div>'+
      '<div class="two"><div class="field"><label for="rThemP">Their mobile (optional)</label><input id="rThemP" type="tel" placeholder="(936) 555-0123"></div><div class="field"><label for="rNeed">What do they need? (optional)</label><input id="rNeed" placeholder="New fence, driveway, repair..."></div></div></fieldset>'+
      '<p class="rerr" id="rErr" hidden></p><button class="btn btn-main" type="submit">Send referral</button><p class="rfine">We only use their info to offer a free estimate. One $100 reward per new customer who completes a paid job.</p></form>'+
      '<div class="rdone" id="rDone" hidden></div></div>';
    document.body.appendChild(d);
    var v=function(i){return(document.getElementById(i).value||'').trim()},em=function(x){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x)};
    d.querySelectorAll('[data-rclose]').forEach(function(x){x.addEventListener('click',closeRef)});
    document.getElementById('refForm').addEventListener('submit',function(e){e.preventDefault();var err=document.getElementById('rErr');
      var you=v('rYou'),ye=v('rYouE'),them=v('rThem'),te=v('rThemE'),miss=[];
      if(!you)miss.push('your name');if(!em(ye))miss.push('your email');if(!them)miss.push('their name');if(!em(te))miss.push('their email');
      if(miss.length){err.hidden=false;err.textContent='Please add '+miss.join(', ')+'.';return}err.hidden=true;
      try{var L=JSON.parse(localStorage.getItem('smith-refs')||'[]');L.push({you:you,ye:ye,them:them,te:te,tp:v('rThemP'),need:v('rNeed'),t:Date.now()});localStorage.setItem('smith-refs',JSON.stringify(L))}catch(x){}
      if(window.ownerPing)window.ownerPing({name:them,phone:v('rThemP'),addr:te,msg:'Referred by '+you+' ('+ye+')'+(v('rNeed')?' · Needs: '+v('rNeed'):''),source:'Referral'},{});
      this.hidden=true;var ok=document.getElementById('rDone');ok.hidden=false;
      ok.innerHTML='<b>Thanks, '+esc(you.split(' ')[0])+'!</b><p>We’ll email '+esc(them.split(' ')[0])+' about a free estimate and let you know at '+esc(ye)+' when they book.</p><button class="btn btn-line btn-text" type="button" id="rAgain">Refer someone else</button>';
      document.getElementById('rAgain').onclick=function(){document.getElementById('refForm').reset();document.getElementById('refForm').hidden=false;ok.hidden=true;document.getElementById('rThem').focus()}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!d.hidden)closeRef()});
    return d;
  }
  var lastFocus=null;
  function openRef(){var d=refModal();lastFocus=document.activeElement;d.hidden=false;document.documentElement.classList.add('imopen');setTimeout(function(){var f=document.getElementById('rYou');f&&f.focus()},50)}
  function closeRef(){var d=document.getElementById('refDlg');if(!d)return;d.hidden=true;document.documentElement.classList.remove('imopen');if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  window.openRef=openRef;
  document.addEventListener('click',function(e){var b=e.target.closest('[data-refer]');if(!b)return;e.preventDefault();
    var c=document.querySelector('#layer [data-close]');if(c&&b.closest('#layer'))c.click();openRef()});
  function initRefer(){if(/[?&]refer\b/.test(location.search)||location.hash==='#refer-now')openRef()}
  function boot(){initArea();initBookArea();initRefer();setInterval(initBookArea,1500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
