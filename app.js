const menu=document.querySelector('.mobile-menu');menu.onclick=()=>{const open=document.querySelector('nav').classList.toggle('open');menu.setAttribute('aria-expanded',open)};document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>{document.querySelector('nav').classList.remove('open');menu.setAttribute('aria-expanded','false')});
const portal=document.querySelector('#portal-dialog'),portalBody=document.querySelector('#portal-body'),portalTitle=document.querySelector('#portal-title');let portalRole='provider';
function showPatientPortal(){portalRole='patient';portalTitle.textContent='Patient login';const max=new Date().toISOString().slice(0,10);portalBody.innerHTML=`<p class="dialog-note">Sign in with the access code Carepak gave you and your date of birth.</p><form class="portal-form"><label class="portal-label" for="portal-code">Access code</label><input class="portal-code" id="portal-code" name="access-code" type="password" autocomplete="off" required><label class="portal-label" for="portal-dob">Date of birth</label><input class="portal-code portal-dob" id="portal-dob" name="dob" type="date" min="1900-01-01" max="${max}" required><p id="portal-error" class="portal-error" role="alert"></p><button class="btn blue" type="submit">Continue <span>→</span></button></form><p class="portal-preview-note">Don’t have a code? Call your Carepak pharmacy team at <a href="tel:18006017092">1.800.601.7092</a>.</p>`;if(!portal.open)portal.showModal();document.querySelector('#portal-code').focus();portalBody.querySelector('form').onsubmit=e=>{e.preventDefault();const c=document.querySelector('#portal-code').value.trim(),d=document.querySelector('#portal-dob').value;document.querySelector('#portal-error').textContent=!c?'Please enter your access code.':!d?'Please enter your date of birth.':'We couldn’t verify your information. Please call your Carepak pharmacy team at 1.800.601.7092.'}}
function showPortal(role){if(role==='patient')return showPatientPortal();if(role==='employee'){location.href='https://carepak-onboarding.onrender.com/team';return}portalRole=role;portalTitle.textContent=role==='provider'?'Provider login':'Employee login';portalBody.innerHTML=`<p class="dialog-note">Sign in with your email and the access code Carepak sent you.</p><form class="portal-form"><label class="portal-label" for="portal-email">Email</label><input class="portal-code portal-email" id="portal-email" name="email" type="email" autocomplete="username" required><label class="portal-label" for="portal-code">Access code</label><input class="portal-code" id="portal-code" name="access-code" type="password" autocomplete="off" required aria-describedby="portal-error"><p id="portal-error" class="portal-error" role="alert"></p><button class="btn blue" type="submit">Continue <span>→</span></button></form><p class="portal-preview-note">Need access? Call your Carepak team at <a href="tel:18006017092">1.800.601.7092</a>.</p>`;if(!portal.open)portal.showModal();document.querySelector('#portal-email').focus();portalBody.querySelector('form').onsubmit=e=>{e.preventDefault();const em=document.querySelector('#portal-email').value.trim(),v=document.querySelector('#portal-code').value.trim();document.querySelector('#portal-error').textContent=!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)?'Please enter your email.':v?'We couldn’t verify that code. Please contact your Carepak team at 1.800.601.7092.':'Please enter your access code.'}}
document.querySelectorAll('[data-portal]').forEach(b=>b.onclick=()=>{document.querySelector('nav').classList.remove('open');menu.setAttribute('aria-expanded','false');showPortal(b.dataset.portal)});document.querySelector('#portal-close').onclick=()=>portal.close();portal.addEventListener('click',e=>{if(e.target===portal){const r=portal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)portal.close()}});

// Keep the circling dots exactly on the outer ring at every screen size.
(function(){const scene=document.querySelector('.orbit-scene'),ring=scene&&scene.querySelector('.outer-track');if(!ring)return;
const set=()=>scene.style.setProperty('--orbit-r',(ring.offsetWidth/2)+'px');set();addEventListener('resize',set)})();


// ---- Illustrative care-coordination workflow (fictional patient; nothing is sent anywhere) ----
(function(){
  const flow=document.querySelector('.flow');if(!flow)return;
  const rail=flow.querySelector('.flow-rail'),reqBox=flow.querySelector('.flow-req'),work=flow.querySelector('.flow-work'),cursor=flow.querySelector('.flow-cursor');
  const log=document.querySelector('.flow-log'),status=document.querySelector('.care-status');
  const tabs=[...document.querySelectorAll('[data-scenario]')];
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const h=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
  let run=0;

  function ctx(id,steps){
    const wait=ms=>new Promise((ok,stop)=>setTimeout(()=>id===run?ok():stop('stop'),reduce?Math.min(ms,40):ms));
    rail.replaceChildren(...steps.map((s,i)=>h('li','',`<span>${i+1}</span><small>${s}</small>`)));
    rail.style.gridTemplateColumns=`repeat(${steps.length},1fr)`;
    const c={wait};
    c.node=i=>[...rail.children].forEach((li,k)=>{li.className=k<i?'done':k===i?'on':'';li.querySelector('span').textContent=k<i?'✓':k+1});
    c.req=(icon,title,from,meta)=>{reqBox.innerHTML=`<div class="req"><span class="req-ic">${icon}</span><div class="req-tx"><b>${title}</b><small>${from}</small><p>${meta}</p></div><em class="pill">New</em></div>`};
    c.pill=(t,cls)=>{const p=reqBox.querySelector('.pill');p.textContent=t;p.className='pill '+(cls||'');p.classList.add('bump');setTimeout(()=>p.classList.remove('bump'),400)};
    c.say=(who,time,text)=>{const li=h('li','',`<b>${who}</b> <time>${time}</time><span>${text}</span>`);log.append(li);while(log.children.length>3)log.firstElementChild.remove()};
    c.stat=(t,done)=>{status.className='care-status'+(done?' done':'');status.textContent=t};
    c.show=el=>{work.replaceChildren(el);return el};
    c.click=async el=>{
      if(!reduce){
        const f=flow.getBoundingClientRect(),r=el.getBoundingClientRect();
        cursor.classList.add('on');
        cursor.style.transform=`translate(${r.left-f.left+Math.min(r.width*.7,r.width-14)}px,${r.top-f.top+r.height*.5}px)`;
        await wait(800);cursor.classList.add('tap');el.classList.add('pressed');await wait(280);cursor.classList.remove('tap');
      }
      el.classList.remove('pressed');el.classList.add('clicked');el.disabled=true;await wait(250);
    };
    c.btn=async(label,sub)=>{const box=h('div','act',(sub?`<p>${sub}</p>`:'')+`<button type="button" class="fbtn" tabindex="-1">${label}</button>`);c.show(box);await wait(450);await c.click(box.querySelector('button'));return box};
    c.check=async(title,items)=>{const box=c.show(h('div','card',`<b class="card-t">${title}</b><ul class="checks">${items.map(t=>`<li>${t}</li>`).join('')}</ul>`));
      for(const li of box.querySelectorAll('li')){await wait(520);li.classList.add('ok')}await wait(500)};
    c.doc=async(title,pages,file)=>{
      const box=c.show(h('div','card doc',`<div class="doc-ic">PDF</div><div class="doc-b"><b>${title}</b><small>Generating…</small><div class="bar"><i></i></div><ul class="pages"></ul></div>`));
      const bar=box.querySelector('.bar i'),ul=box.querySelector('.pages');
      for(let i=0;i<pages.length;i++){await wait(430);ul.append(h('li','',pages[i]));bar.style.width=Math.round((i+1)/pages.length*100)+'%'}
      await wait(350);box.querySelector('small').innerHTML=`<span class="ready">Ready</span> ${file} · ${pages.length} page${pages.length>1?'s':''}`;box.classList.add('made');await wait(900);return box};
    c.deliver=async(note)=>{
      const box=c.show(h('div','card',`<b class="card-t">Delivery</b><ol class="track"><li>Packed</li><li>Out for delivery</li><li>Delivered</li></ol><p class="muted">${note}</p>`));
      const li=box.querySelectorAll('.track li');
      for(let i=0;i<2;i++){await wait(650);li[i].classList.add('ok')}await wait(500)};
    c.toast=async(to,text)=>{
      const box=c.show(h('div','sms',`<small>Text message to ${to}</small><div class="bubble">${text}</div><span class="sent">Delivered ✓</span>`));
      await wait(1300);return box};
    c.done=t=>{c.node(steps.length);c.stat(t,true);cursor.classList.remove('on')};
    return c;
  }

  const SCENARIOS=[
    {steps:['Request','Verify','Fill','Deliver','Notify'],async go(c){
      c.node(0);c.req('📋','Discharge order','Medical assistant · 10:48 AM','Evelyn Parker · 3 new medications · discharge at 11:30 AM');
      c.say('Medical assistant','10:48 AM','Evelyn is being discharged at 11:30 AM. Can you have her medications delivered to her home?');c.stat('Request received');
      await c.wait(900);await c.btn('Accept order','Discharge medications for Evelyn Parker');c.pill('Accepted','blue');
      c.node(1);c.stat('Verifying coverage and medications');await c.check('Pharmacist review',['Insurance verified · $0 copay','Allergies and interactions checked','Discharge list reconciled']);
      c.node(2);await c.btn('Mark ready for delivery','3 medications filled · pharmacist verified');c.pill('Ready','green');
      c.say('Carepak pharmacist','10:50 AM','Her medications are ready. We’ll deliver them to her home today, free of charge.');
      c.node(3);c.stat('Out for delivery');await c.deliver('Free home delivery · arriving by 12:15 PM');
      c.node(4);await c.toast('Evelyn and her daughter','Carepak: Evelyn’s medications are on the way and will arrive by 12:15 PM. Questions? 1.800.601.7092');
      c.say('Carepak coordinator','10:51 AM','We’ve notified Evelyn’s daughter and sent the patient a text update.');
      c.done('Medications ready · Free home delivery arranged')}},
    {steps:['Request','Review','Sync','Package','Deliver'],async go(c){
      c.node(0);c.req('🔁','Refill sync request','Evelyn’s daughter · 9:12 AM','4 maintenance medications · refills due on different days');
      c.say('Evelyn’s daughter','9:12 AM','Mom’s refills keep coming due on different days. Can they come together?');c.stat('Request received');
      await c.wait(900);c.node(1);c.pill('In progress','blue');c.stat('Reviewing refill dates');
      const meds=[['Lisinopril 10 mg','Nov 3'],['Metformin 500 mg','Nov 9'],['Atorvastatin 20 mg','Nov 14'],['Levothyroxine 50 mcg','Nov 21']];
      const box=c.show(h('div','card',`<b class="card-t">Next refill dates</b><ul class="meds">${meds.map(([m,d])=>`<li><span>${m}</span><em>${d}</em></li>`).join('')}</ul><button type="button" class="fbtn" tabindex="-1">Synchronize refills</button>`));
      await c.wait(1100);c.node(2);await c.click(box.querySelector('button'));
      for(const em of box.querySelectorAll('.meds em')){em.textContent='Nov 14';em.classList.add('synced');await c.wait(260)}
      c.pill('Synced','blue');c.say('Carepak coordinator','9:15 AM','Yes. We’ll synchronize her maintenance medications so everything refills at once.');await c.wait(900);
      c.node(3);c.stat('Packaging by day and time');
      const grid=c.show(h('div','card',`<b class="card-t">Daily packs · morning, noon, evening, bedtime</b><div class="packs">${'<i></i>'.repeat(28)}</div>`));
      for(const cell of grid.querySelectorAll('.packs i')){cell.classList.add('ok');await c.wait(45)}
      await c.wait(400);await c.btn('Generate medication list','Packs ready for 4 medications');
      await c.doc('Updated medication list',['Current medications & doses','Daily schedule'],'med-list-E-Parker.pdf');
      c.say('Carepak pharmacist','9:20 AM','Her next delivery will include everything, packaged by day and time, with an updated medication list.');
      c.node(4);c.pill('Scheduled','green');await c.deliver('One coordinated delivery · Nov 14');
      c.done('Refills synchronized · One coordinated delivery')}},
    {steps:['Request','Gather','PA packet','Submit','Approved','Deliver'],async go(c){
      c.node(0);c.req('🛡️','Prior authorization needed','Medical assistant · 2:05 PM','New medication · Evelyn Parker · commercial plan');
      c.say('Medical assistant','2:05 PM','Her new medication needs a prior authorization. Can you help us coordinate?');c.stat('Request received');
      await c.wait(900);c.node(1);c.pill('In progress','blue');c.stat('Gathering supporting information');
      await c.check('Plan requirements',['Diagnosis & ICD-10 codes','Chart notes & recent labs','Prior therapies tried','Plan criteria matched']);
      c.say('Carepak coordinator','2:08 PM','We’re coordinating the plan requirements and supporting information with your office now.');
      c.node(2);await c.btn('Generate PA packet','All requirements gathered');c.stat('Building the PA packet');
      const doc=await c.doc('Prior authorization packet',['Cover sheet','Plan PA request form','Letter of medical necessity','Chart notes','Lab results','Prior therapy history'],'PA-packet-E-Parker.pdf');
      c.node(3);doc.querySelector('.doc-b').append(h('button','fbtn','Submit to plan'));const sb=doc.querySelector('.doc-b .fbtn');sb.tabIndex=-1;
      await c.wait(300);await c.click(sb);c.pill('Submitted · 2:31 PM','amber');c.stat('Submitted · waiting for the plan’s decision');
      const w=c.show(h('div','card wait',`<span class="spin"></span><div><b>Waiting for plan decision</b><small>Submitted 2:31 PM · we follow up so your office doesn’t have to</small></div>`));
      await c.wait(1500);c.node(4);
      w.className='card stamp';w.innerHTML='<div class="seal">✓</div><div><b>APPROVED</b><small>4:40 PM · Ref PA-48213 · valid 12 months</small></div>';c.pill('Approved','green');
      c.say('Carepak coordinator','4:40 PM','It’s approved. We’ll deliver today, and Evelyn will get a text when it’s on the way.');await c.wait(1300);
      c.node(5);c.stat('Out for delivery');await c.deliver('Delivering today · free');
      await c.toast('Evelyn','Carepak: Good news! Your new medication was approved and is on the way today.');
      c.done('Access coordinated · Delivery scheduled')}}
  ];

  async function play(i){
    const id=++run,sc=SCENARIOS[i];
    tabs.forEach(t=>t.setAttribute('aria-selected',String(+t.dataset.scenario===i)));
    log.replaceChildren();work.replaceChildren();reqBox.replaceChildren();
    cursor.classList.remove('on','tap');cursor.style.transform='';
    try{await sc.go(ctx(id,sc.steps))}catch(e){if(e!=='stop')throw e}
  }
  tabs.forEach(t=>t.addEventListener('click',()=>play(+t.dataset.scenario)));
  document.getElementById('replay-chat').addEventListener('click',()=>{const cur=tabs.find(t=>t.getAttribute('aria-selected')==='true')||tabs[0];play(+cur.dataset.scenario)});
  if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){play(0);io.disconnect()}},{threshold:.3});io.observe(document.querySelector('.care-chat'))}else play(0);
})();
