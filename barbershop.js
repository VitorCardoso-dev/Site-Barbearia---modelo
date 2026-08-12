// ============================================================
// CONFIG
// ============================================================
const SHOP = { name:'Barber Premium', whatsapp:'5511999998888', mapLat:-23.5505, mapLng:-46.6333 };
const ADMIN_PWD = 'admin123';

// ============================================================
// STATE
// ============================================================
const S = {
  services:[], barbers:[], appointments:[], coupons:[],
  bk:{ service:null, barber:null, date:null, time:null },
  step:1, calY:new Date().getFullYear(), calM:new Date().getMonth(),
  finalApt:null,
};

// ============================================================
// UTILS
// ============================================================
const fmt = n => `R$ ${Number(n||0).toFixed(2).replace('.',',')}`;
const fmtD = d => { if(!d)return''; const[y,m,day]=d.split('-'); return `${day}/${m}/${y}`; };
const todayStr = () => new Date().toISOString().split('T')[0];
const genCode = () => 'BP'+Math.random().toString(36).substring(2,8).toUpperCase();
const stars = n => '★'.repeat(Math.round(n||5))+'☆'.repeat(5-Math.round(n||5));
const $=id=>document.getElementById(id);

// ============================================================
// TOAST
// ============================================================
function toast(msg, type='success') {
  const el=document.createElement('div');
  el.className=`toast ${type}`;
  el.textContent=msg;
  $('toast-container').appendChild(el);
  setTimeout(()=>el.remove(),3200);
}

// ============================================================
// NAVBAR
// ============================================================
window.addEventListener('scroll',()=>{
  $('navbar').classList.toggle('scrolled',window.scrollY>60);
});
$('hamburger-btn').onclick=()=>$('mobile-nav').classList.add('open');
$('mobile-close').onclick=()=>$('mobile-nav').classList.remove('open');
document.querySelectorAll('.mobile-link').forEach(l=>{
  l.addEventListener('click',()=>$('mobile-nav').classList.remove('open'));
});

// Close mobile panel when clicking outside it or pressing Escape
document.addEventListener('click', (e) => {
  const nav = $('mobile-nav');
  const ham = $('hamburger-btn');
  if (!nav || !nav.classList.contains('open')) return;
  if (nav.contains(e.target) || ham.contains(e.target)) return;
  nav.classList.remove('open');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const nav = $('mobile-nav'); if (nav) nav.classList.remove('open');
  }
});

// ============================================================
// DATA – localStorage (offline demo; swap for API calls)
// ============================================================
function saveData() {
  localStorage.setItem('bp_s',JSON.stringify(S.services));
  localStorage.setItem('bp_b',JSON.stringify(S.barbers));
  localStorage.setItem('bp_a',JSON.stringify(S.appointments));
  localStorage.setItem('bp_c',JSON.stringify(S.coupons));
}

function loadData() {
  const s=localStorage.getItem('bp_s');
  const b=localStorage.getItem('bp_b');
  const a=localStorage.getItem('bp_a');
  const c=localStorage.getItem('bp_c');
  if(s){ S.services=JSON.parse(s); } else {
    S.services=[
      {id:'s1',name:'Corte Clássico',category:'corte',price:55,duration_minutes:45,description:'Corte tradicional com acabamento impecável usando tesoura e máquina.',is_active:true},
      {id:'s2',name:'Corte + Barba',category:'combo',price:90,duration_minutes:75,description:'Combo premium: corte personalizado + modelagem completa da barba.',is_active:true},
      {id:'s3',name:'Barba Completa',category:'barba',price:45,duration_minutes:40,description:'Modelagem e aparagem completa com toalha quente e produtos premium.',is_active:true},
      {id:'s4',name:'Degradê Premium',category:'corte',price:65,duration_minutes:50,description:'Degradê perfeito com transição suave e acabamento artístico.',is_active:true},
      {id:'s5',name:'Tratamento Capilar',category:'tratamento',price:80,duration_minutes:60,description:'Hidratação profunda com produtos importados.',is_active:true},
      {id:'s6',name:'Hot Towel Shave',category:'barba',price:70,duration_minutes:55,description:'Barbear clássico com navalha, toalha quente e bálsamo relaxante.',is_active:true},
    ]; saveData();
  }
  if(b){ S.barbers=JSON.parse(b); } else {
    S.barbers=[
      {id:'b1',name:'Carlos Eduardo',specialty:'Degradê & Navalhado',experience_years:8,avg_rating:4.9,total_reviews:234,is_active:true,work_days:[1,2,3,4,5,6],work_start:'08:00',work_end:'20:00',lunch_start:'12:00',lunch_end:'13:00'},
      {id:'b2',name:'Rafael Santos',specialty:'Barba & Visagismo',experience_years:6,avg_rating:4.8,total_reviews:189,is_active:true,work_days:[1,2,3,4,5,6],work_start:'08:00',work_end:'20:00',lunch_start:'12:00',lunch_end:'13:00'},
      {id:'b3',name:'Marcos Oliveira',specialty:'Corte Clássico',experience_years:12,avg_rating:5.0,total_reviews:312,is_active:true,work_days:[1,2,3,4,5,6],work_start:'08:00',work_end:'20:00',lunch_start:'12:00',lunch_end:'13:00'},
    ]; saveData();
  }
  if(a){ S.appointments=JSON.parse(a); }
  if(c){ S.coupons=JSON.parse(c); } else {
    S.coupons=[{id:'c1',code:'BEMVINDO10',discount_percent:10,is_active:true,max_uses:50,current_uses:0,valid_until:'2025-12-31'}]; saveData();
  }
}

// ============================================================
// RENDER HOME
// ============================================================
function renderServices() {
  const grid=$('services-grid');
  const active=S.services.filter(s=>s.is_active);
  grid.innerHTML=active.length? active.map(s=>`
    <div class="svc-card" onclick="openBookingWithService('${s.id}')">
      <div class="svc-cat">${s.category}</div>
      <div class="svc-name">${s.name}</div>
      <div class="svc-desc">${s.description||''}</div>
      <div class="svc-footer"><div class="svc-price">${fmt(s.price)}</div><div class="svc-dur">${s.duration_minutes} min</div></div>
    </div>`).join('')
  : '<p style="color:var(--muted);padding:40px;">Nenhum serviço cadastrado.</p>';
}

function renderTeam() {
  const grid=$('team-grid');
  const active=S.barbers.filter(b=>b.is_active);
  const photos=[
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  ];
  grid.innerHTML=active.length? active.map((b,i)=>`
    <div class="team-card">
      <div class="team-photo-wrap">
        <img src="${b.photo_url||photos[i%photos.length]}" alt="${b.name}" class="team-photo" onerror="this.src='${photos[0]}'" />
        <div class="team-overlay"><div class="team-name">${b.name}</div><div class="team-spec">${b.specialty||''}</div></div>
      </div>
      <div class="team-info">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div class="team-stars">${stars(b.avg_rating)}</div>
          <span style="font-size:12px;color:var(--muted);">${b.total_reviews||0} avaliações</span>
        </div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:12px;">${b.experience_years||0} anos de experiência</div>
        <button class="btn btn-outline btn-sm" style="width:100%;" onclick="openBookingWithBarber('${b.id}')">Agendar com ${b.name.split(' ')[0]}</button>
      </div>
    </div>`).join('')
  : '<p style="color:var(--muted);">Nenhum barbeiro cadastrado.</p>';
}

// ============================================================
// MAP
// ============================================================
function initMap() {
  if(typeof L==='undefined') return;
  const map=L.map('map').setView([SHOP.mapLat,SHOP.mapLng],16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
  const icon=L.divIcon({html:`<div style="background:#C5A059;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.5);"></div>`,className:'',iconSize:[16,16],iconAnchor:[8,8]});
  L.marker([SHOP.mapLat,SHOP.mapLng],{icon}).addTo(map).bindPopup(`<b>${SHOP.name}</b>`).openPopup();
}

// ============================================================
// BOOKING
// ============================================================
function openBookingModal() {
  S.bk={service:null,barber:null,date:null,time:null}; S.step=1;
  document.querySelectorAll('.booking-step').forEach(el=>el.classList.remove('active'));
  $('step-1').classList.add('active');
  renderBookingStepsNav(); renderServiceSelection();
  $('booking-modal').classList.add('open');
  document.body.style.overflow='hidden';
}
function openBookingWithService(id){ openBookingModal(); selectService(id); }
function openBookingWithBarber(id){ openBookingModal(); S.bk.barber=id; }
function closeBookingModal(){ $('booking-modal').classList.remove('open'); document.body.style.overflow=''; }

$('booking-modal-close').onclick=closeBookingModal;
$('booking-modal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeBookingModal(); });

function nextStep(){
  if(S.step===1&&!S.bk.service){toast('Selecione um serviço','error');return;}
  if(S.step===2&&!S.bk.barber){toast('Selecione um profissional','error');return;}
  if(S.step===3&&!S.bk.date){toast('Selecione uma data','error');return;}
  if(S.step===4&&!S.bk.time){toast('Selecione um horário','error');return;}
  S.step++; gotoStep(S.step);
}
function prevStep(){ if(S.step>1){ S.step--; gotoStep(S.step); } }

function gotoStep(n){
  document.querySelectorAll('.booking-step').forEach(el=>el.classList.remove('active'));
  $(`step-${n}`).classList.add('active');
  renderBookingStepsNav();
  if(n===1) renderServiceSelection();
  if(n===2) renderBarberSelection();
  if(n===3) renderCalendar();
  if(n===4) renderTimeSlots();
  if(n===5) renderBookingSummary();
}

function renderBookingStepsNav(){
  const steps=['Serviço','Profissional','Data','Horário','Confirmar'];
  $('booking-steps-nav').innerHTML=steps.map((lbl,i)=>{
    const n=i+1, done=n<S.step, active=n===S.step;
    return `${i>0?'<div class="step-conn"></div>':''}
    <div class="step-item">
      <div class="step-dot ${done?'done':active?'active':''}">${done?'✓':n}</div>
      <div class="step-lbl ${active?'active':''}">${lbl}</div>
    </div>`;
  }).join('');
}

function renderServiceSelection(){
  $('service-grid').innerHTML=S.services.filter(s=>s.is_active).map(s=>`
    <div class="sel-card ${S.bk.service===s.id?'selected':''}" onclick="selectService('${s.id}')">
      <div class="cn">${s.name}</div><div class="cs">${s.duration_minutes} min</div><div class="cp">${fmt(s.price)}</div>
    </div>`).join('');
}
function selectService(id){ S.bk.service=id; renderServiceSelection(); }

function renderBarberSelection(){
  $('barber-grid').innerHTML=S.barbers.filter(b=>b.is_active).map(b=>`
    <div class="sel-card ${S.bk.barber===b.id?'selected':''}" onclick="selectBarber('${b.id}')">
      <div class="cn">${b.name.split(' ')[0]}</div><div class="cs">${b.specialty||''}</div>
      <div style="color:var(--primary);font-size:13px;margin-top:8px;">${stars(b.avg_rating)} ${b.avg_rating||5}</div>
    </div>`).join('');
}
function selectBarber(id){ S.bk.barber=id; renderBarberSelection(); }

function calPrev(){ S.calM--; if(S.calM<0){S.calM=11;S.calY--;} renderCalendar(); }
function calNext(){ S.calM++; if(S.calM>11){S.calM=0;S.calY++;} renderCalendar(); }

function renderCalendar(){
  const months=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  $('cal-month-title').textContent=`${months[S.calM]} ${S.calY}`;
  const firstDay=new Date(S.calY,S.calM,1).getDay();
  const total=new Date(S.calY,S.calM+1,0).getDate();
  const tday=todayStr();
  const dayNames=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  let html=dayNames.map(d=>`<div class="cdn">${d}</div>`).join('');
  for(let i=0;i<firstDay;i++) html+=`<div class="cday emp"></div>`;
  for(let d=1;d<=total;d++){
    const ds=`${S.calY}-${String(S.calM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dow=new Date(S.calY,S.calM,d).getDay();
    const dis=ds<tday||dow===0;
    const sel=S.bk.date===ds;
    const isToday=ds===tday;
    html+=`<div class="cday ${sel?'sel':''} ${isToday&&!sel?'today':''} ${dis?'dis':''}" ${!dis?`onclick="selectDate('${ds}')"`:''}>${d}</div>`;
  }
  $('calendar-grid').innerHTML=html;
}
function selectDate(d){ S.bk.date=d; S.bk.time=null; renderCalendar(); }

function renderTimeSlots(){
  const grid=$('time-grid');
  const barber=S.barbers.find(b=>b.id===S.bk.barber);
  if(!barber||!S.bk.date){grid.innerHTML='<p style="color:var(--muted);">Selecione data e barbeiro.</p>';return;}
  const svc=S.services.find(s=>s.id===S.bk.service);
  const dur=svc?svc.duration_minutes:30;
  const booked=S.appointments.filter(a=>a.barber_id===S.bk.barber&&a.date===S.bk.date&&a.status!=='cancelled').map(a=>a.time);
  const [eh,em]=( barber.work_end||'20:00').split(':').map(Number);
  const [lsh,lsm]=(barber.lunch_start||'12:00').split(':').map(Number);
  const [leh,lem]=(barber.lunch_end||'13:00').split(':').map(Number);
  let [sh,sm]=( barber.work_start||'08:00').split(':').map(Number);
  const slots=[];
  while(sh*60+sm+dur<=eh*60+em){
    const t=String(sh).padStart(2,'0')+':'+String(sm).padStart(2,'0');
    const inLunch=(sh*60+sm>=lsh*60+lsm)&&(sh*60+sm<leh*60+lem);
    slots.push({t, ok:!inLunch&&!booked.includes(t)});
    sm+=30; if(sm>=60){sh++;sm-=60;}
  }
  grid.innerHTML=slots.length? slots.map(s=>`
    <div class="tslot ${s.t===S.bk.time?'sel':''} ${!s.ok?'busy':''}" ${s.ok?`onclick="selectTime('${s.t}')"`:''}>${s.t}</div>`).join('')
  : '<p style="color:var(--muted);">Sem horários disponíveis.</p>';
}
function selectTime(t){ S.bk.time=t; renderTimeSlots(); }

function renderBookingSummary(){
  const svc=S.services.find(s=>s.id===S.bk.service);
  const b=S.barbers.find(b=>b.id===S.bk.barber);
  $('booking-summary').innerHTML=`
    <div class="sum-row"><span class="sl">Serviço</span><span>${svc?.name||'—'}</span></div>
    <div class="sum-row"><span class="sl">Profissional</span><span>${b?.name||'—'}</span></div>
    <div class="sum-row"><span class="sl">Data</span><span>${fmtD(S.bk.date)}</span></div>
    <div class="sum-row"><span class="sl">Horário</span><span>${S.bk.time||'—'}</span></div>
    <div class="sum-row total"><span class="sl">Total</span><span class="sv">${fmt(svc?.price)}</span></div>`;
}

function confirmBooking(){
  const name=$('client-name').value.trim();
  const phone=$('client-phone').value.trim();
  if(!name||!phone){toast('Nome e telefone são obrigatórios','error');return;}
  const svc=S.services.find(s=>s.id===S.bk.service);
  const barber=S.barbers.find(b=>b.id===S.bk.barber);
  const btn=$('confirm-btn'); btn.textContent='Confirmando...'; btn.disabled=true;
  setTimeout(()=>{
    const apt={
      id:'apt_'+Date.now(), client_name:name, client_phone:phone,
      client_email:$('client-email').value,
      barber_id:S.bk.barber, barber_name:barber?.name,
      service_id:S.bk.service, service_name:svc?.name, service_price:svc?.price,
      date:S.bk.date, time:S.bk.time, duration_minutes:svc?.duration_minutes,
      status:'confirmed', payment_method:$('payment-method').value,
      notes:$('booking-notes').value, booking_code:genCode(),
      created_date:new Date().toISOString(),
    };
    S.appointments.push(apt); saveData(); S.finalApt=apt;
    document.querySelectorAll('.booking-step').forEach(el=>el.classList.remove('active'));
    $('step-6').classList.add('active');
    $('success-code').textContent=apt.booking_code;
    $('success-summary').innerHTML=`
      <div class="sum-row"><span class="sl">Serviço</span><span>${apt.service_name}</span></div>
      <div class="sum-row"><span class="sl">Profissional</span><span>${apt.barber_name}</span></div>
      <div class="sum-row"><span class="sl">Data & Hora</span><span>${fmtD(apt.date)} às ${apt.time}</span></div>
      <div class="sum-row total"><span class="sl">Total</span><span class="sv">${fmt(apt.service_price)}</span></div>`;
    toast('Agendamento confirmado!');
    btn.textContent='Confirmar ✓'; btn.disabled=false;
  },600);
}

function copyCode(){
  if(S.finalApt) navigator.clipboard.writeText(S.finalApt.booking_code).then(()=>toast('Código copiado!'));
}
function shareWhatsApp(){
  const a=S.finalApt; if(!a)return;
  const msg=encodeURIComponent(`✂️ *${SHOP.name}*\n📋 Código: *${a.booking_code}*\n✂️ ${a.service_name}\n💈 ${a.barber_name}\n📅 ${fmtD(a.date)} às ${a.time}\n💰 ${fmt(a.service_price)}`);
  window.open(`https://wa.me/${SHOP.whatsapp}?text=${msg}`,'_blank');
}

// Book buttons
$('nav-book-btn').onclick=e=>{e.preventDefault();openBookingModal();};
$('hero-book-btn').onclick=openBookingModal;
$('location-book-btn').onclick=openBookingModal;
$('mobile-book-btn').onclick=e=>{e.preventDefault();$('mobile-nav').classList.remove('open');openBookingModal();};

// ============================================================
// CLIENT AREA
// ============================================================
function openClientModal(){ resetClientSearch(); $('client-modal').classList.add('open'); document.body.style.overflow='hidden'; }
function closeClientModal(){ $('client-modal').classList.remove('open'); document.body.style.overflow=''; }
$('client-modal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeClientModal(); });
$('nav-client-btn').onclick=e=>{e.preventDefault();openClientModal();};
$('mobile-client-btn').onclick=e=>{e.preventDefault();$('mobile-nav').classList.remove('open');openClientModal();};

function searchClientBookings(){
  const phone=$('client-search-phone').value.trim().replace(/\D/g,'');
  if(!phone){toast('Digite seu telefone','error');return;}
  const results=S.appointments.filter(a=>a.client_phone.replace(/\D/g,'').includes(phone));
  const statusL={confirmed:'Confirmado',completed:'Concluído',cancelled:'Cancelado',no_show:'Faltou'};
  const statusC={confirmed:'badge-green',completed:'badge-gold',cancelled:'badge-red',no_show:'badge-muted'};
  $('client-appointments-list').innerHTML=results.length?
    [...results].sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time)).map(apt=>`
      <div style="background:var(--bg2);border:1px solid var(--border);padding:20px;margin-bottom:12px;border-radius:4px;">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
          <div><div style="font-weight:700;margin-bottom:4px;">${apt.service_name}</div><div style="font-size:12px;color:var(--muted);">com ${apt.barber_name}</div></div>
          <span class="badge ${statusC[apt.status]||'badge-muted'}">${statusL[apt.status]||apt.status}</span>
        </div>
        <div style="font-size:13px;color:var(--muted);margin-bottom:12px;">📅 ${fmtD(apt.date)} · 🕐 ${apt.time} · 💰 ${fmt(apt.service_price)}</div>
        <div style="font-size:12px;color:var(--primary);">Código: <b>${apt.booking_code}</b></div>
        ${apt.status==='confirmed'?`<button class="act-btn act-red" style="margin-top:12px;" onclick="cancelApt('${apt.id}')">Cancelar</button>`:''}
      </div>`).join('')
  : '<div style="text-align:center;padding:40px;color:var(--muted);">Nenhum agendamento encontrado.</div>';
  $('client-search-view').style.display='none';
  $('client-results-view').style.display='block';
}
function cancelApt(id){
  if(!confirm('Confirmar cancelamento?'))return;
  const apt=S.appointments.find(a=>a.id===id);
  if(apt){apt.status='cancelled';saveData();}
  toast('Agendamento cancelado'); searchClientBookings();
}
function resetClientSearch(){
  $('client-search-phone').value='';
  $('client-search-view').style.display='block';
  $('client-results-view').style.display='none';
}

// ============================================================
// ADMIN
// ============================================================
function checkAdminParam(){
  if(new URLSearchParams(window.location.search).has('admin'))
    $('admin-login-modal').classList.add('open');
}
function loginAdmin(){
  if($('admin-pwd-input').value===ADMIN_PWD){
    closeAdminLogin(); showAdmin();
  } else { $('admin-error').style.display='block'; }
}
function closeAdminLogin(){ $('admin-login-modal').classList.remove('open'); document.body.style.overflow=''; }
$('admin-login-modal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeAdminLogin(); });

function showAdmin(){
  $('admin-section').style.display='block';
  document.querySelector('footer').style.display='none';
  // populate barber filter
  $('filter-barber').innerHTML='<option value="">Todos os barbeiros</option>'+S.barbers.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
  renderAdminOverview(); renderAdminApts(); renderAdminBarbers(); renderAdminSvcs(); renderAdminCoupons();
  window.scrollTo(0,$('admin-section').offsetTop-80);
}
function logoutAdmin(){
  $('admin-section').style.display='none';
  document.querySelector('footer').style.display='';
}
function switchTab(btn,panelId){
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(p=>p.style.display='none');
  btn.classList.add('active');
  $(panelId).style.display='block';
}

function renderAdminOverview(){
  const tday=todayStr();
  const todayA=S.appointments.filter(a=>a.date===tday&&a.status!=='cancelled');
  const monthA=S.appointments.filter(a=>a.date.startsWith(tday.substring(0,7))&&a.status!=='cancelled');
  const mRev=monthA.reduce((s,a)=>s+(a.service_price||0),0);
  const tRev=todayA.reduce((s,a)=>s+(a.service_price||0),0);
  $('panel-overview').innerHTML=`
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:32px;">
      <div class="metric-card"><div class="metric-label">Hoje</div><div class="metric-value">${todayA.length}</div><div class="metric-sub">agendamentos</div></div>
      <div class="metric-card"><div class="metric-label">Faturamento Hoje</div><div class="metric-value" style="font-size:1.3rem;">${fmt(tRev)}</div><div class="metric-sub">confirmados</div></div>
      <div class="metric-card"><div class="metric-label">Mês Atual</div><div class="metric-value">${monthA.length}</div><div class="metric-sub">agendamentos</div></div>
      <div class="metric-card"><div class="metric-label">Faturamento Mês</div><div class="metric-value" style="font-size:1.3rem;">${fmt(mRev)}</div><div class="metric-sub">total</div></div>
    </div>
    ${todayA.length? `
      <div class="metric-label" style="margin-bottom:16px;">Agenda de Hoje</div>
      <div style="overflow-x:auto;background:var(--bg2);border:1px solid var(--border);">
        <table class="data-table">
          <thead><tr><th>Hora</th><th>Cliente</th><th>Barbeiro</th><th>Serviço</th><th>Valor</th><th>Ações</th></tr></thead>
          <tbody>${[...todayA].sort((a,b)=>a.time.localeCompare(b.time)).map(a=>`
            <tr>
              <td style="font-weight:700;color:var(--primary);">${a.time}</td>
              <td>${a.client_name}</td><td>${a.barber_name}</td><td>${a.service_name}</td><td>${fmt(a.service_price)}</td>
              <td>${a.status==='confirmed'?`<button class="act-btn act-green" onclick="updateStatus('${a.id}','completed')">✓ Concluir</button>`:'<span class="badge badge-gold">Concluído</span>'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`
    : '<div style="text-align:center;padding:60px;color:var(--muted);">Sem agendamentos hoje.</div>'}`;
}

function renderAdminApts(){
  const df=$('filter-date').value, bf=$('filter-barber').value, sf=$('filter-status').value;
  let r=[...S.appointments];
  if(df)r=r.filter(a=>a.date===df);
  if(bf)r=r.filter(a=>a.barber_id===bf);
  if(sf)r=r.filter(a=>a.status===sf);
  r.sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
  const sL={confirmed:'Confirmado',completed:'Concluído',cancelled:'Cancelado',no_show:'Faltou'};
  const sC={confirmed:'badge-green',completed:'badge-gold',cancelled:'badge-red',no_show:'badge-muted'};
  $('apts-tbody').innerHTML=r.length? r.map(a=>`
    <tr>
      <td>${fmtD(a.date)}</td>
      <td style="font-weight:700;color:var(--primary);">${a.time}</td>
      <td>${a.client_name}</td><td style="color:var(--muted);">${a.client_phone}</td>
      <td>${a.barber_name}</td><td>${a.service_name}</td><td style="font-weight:600;">${fmt(a.service_price)}</td>
      <td><span class="badge ${sC[a.status]||'badge-muted'}">${sL[a.status]||a.status}</span></td>
      <td>
        <div style="display:flex;gap:4px;">
          ${a.status==='confirmed'?`<button class="act-btn act-green" onclick="updateStatus('${a.id}','completed')">✓</button><button class="act-btn act-red" onclick="updateStatus('${a.id}','no_show')">✗</button>`:''}
          <button class="act-btn act-red" onclick="deleteApt('${a.id}')">🗑</button>
        </div>
      </td>
    </tr>`).join('')
  : '<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:40px;">Nenhum resultado.</td></tr>';
}

function updateStatus(id,status){ const a=S.appointments.find(x=>x.id===id); if(a){a.status=status;saveData();} renderAdminOverview(); renderAdminApts(); toast('Status atualizado'); }
function deleteApt(id){ if(!confirm('Remover?'))return; S.appointments=S.appointments.filter(a=>a.id!==id); saveData(); renderAdminOverview(); renderAdminApts(); toast('Removido'); }

function renderAdminBarbers(){
  $('barbers-list').innerHTML=S.barbers.map(b=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg2);margin-bottom:4px;border-radius:4px;">
      <div><span style="font-weight:600;">${b.name}</span><span style="color:var(--muted);font-size:12px;margin-left:12px;">${b.specialty||''} · ${b.experience_years||0} anos</span></div>
      <button class="act-btn act-red" onclick="deleteBarber('${b.id}')">Remover</button>
    </div>`).join('')||'<p style="color:var(--muted);">Nenhum barbeiro.</p>';
}
function addBarber(){
  const name=$('nb-name').value.trim();
  if(!name){toast('Nome obrigatório','error');return;}
  S.barbers.push({id:'b_'+Date.now(),name,specialty:$('nb-spec').value.trim(),experience_years:parseInt($('nb-exp').value)||0,avg_rating:5,total_reviews:0,is_active:true,work_days:[1,2,3,4,5,6],work_start:'08:00',work_end:'20:00',lunch_start:'12:00',lunch_end:'13:00'});
  saveData();$('nb-name').value='';$('nb-spec').value='';$('nb-exp').value='';
  renderAdminBarbers(); renderTeam(); toast('Barbeiro adicionado');
}
function deleteBarber(id){ if(!confirm('Remover?'))return; S.barbers=S.barbers.filter(b=>b.id!==id); saveData(); renderAdminBarbers(); renderTeam(); toast('Removido'); }

function renderAdminSvcs(){
  $('services-admin-list').innerHTML=S.services.map(s=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg2);margin-bottom:4px;border-radius:4px;">
      <div><span style="font-weight:600;">${s.name}</span><span style="color:var(--primary);font-size:12px;margin-left:12px;">${fmt(s.price)}</span><span style="color:var(--muted);font-size:12px;margin-left:8px;">${s.duration_minutes}min</span></div>
      <button class="act-btn act-red" onclick="deleteSvc('${s.id}')">Remover</button>
    </div>`).join('')||'<p style="color:var(--muted);">Nenhum serviço.</p>';
}
function addService(){
  const name=$('ns-name').value.trim();
  if(!name){toast('Nome obrigatório','error');return;}
  S.services.push({id:'s_'+Date.now(),name,price:parseFloat($('ns-price').value)||0,duration_minutes:parseInt($('ns-dur').value)||30,category:$('ns-cat').value,description:$('ns-desc').value.trim(),is_active:true});
  saveData();$('ns-name').value='';$('ns-price').value='';$('ns-dur').value='';$('ns-desc').value='';
  renderAdminSvcs(); renderServices(); toast('Serviço adicionado');
}
function deleteSvc(id){ if(!confirm('Remover?'))return; S.services=S.services.filter(s=>s.id!==id); saveData(); renderAdminSvcs(); renderServices(); toast('Removido'); }

function renderAdminCoupons(){
  $('coupons-list').innerHTML=S.coupons.map(c=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg2);margin-bottom:4px;border-radius:4px;flex-wrap:wrap;gap:8px;">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span style="font-family:var(--fh);font-weight:700;letter-spacing:.1em;">${c.code}</span>
        <span class="badge badge-gold">${c.discount_percent||0}% OFF</span>
        <span style="font-size:12px;color:var(--muted);">${c.current_uses||0}/${c.max_uses||'∞'} usos${c.valid_until?' · até '+fmtD(c.valid_until):''}</span>
      </div>
      <button class="act-btn act-red" onclick="deleteCoupon('${c.id}')">Remover</button>
    </div>`).join('')||'<p style="color:var(--muted);">Nenhum cupom.</p>';
}
function addCoupon(){
  const code=$('nc-code').value.trim().toUpperCase();
  if(!code){toast('Código obrigatório','error');return;}
  S.coupons.push({id:'c_'+Date.now(),code,discount_percent:parseFloat($('nc-pct').value)||0,is_active:true,max_uses:parseInt($('nc-max').value)||100,current_uses:0,valid_until:$('nc-date').value});
  saveData();$('nc-code').value='';$('nc-pct').value='';$('nc-date').value='';$('nc-max').value='';
  renderAdminCoupons(); toast('Cupom criado');
}
function deleteCoupon(id){ if(!confirm('Remover?'))return; S.coupons=S.coupons.filter(c=>c.id!==id); saveData(); renderAdminCoupons(); toast('Removido'); }

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded',()=>{
  loadData(); renderServices(); renderTeam();
  setTimeout(initMap,600);
  checkAdminParam();
  // Ctrl+Shift+A → admin login
  document.addEventListener('keydown',e=>{ if(e.ctrlKey&&e.shiftKey&&e.key==='A') $('admin-login-modal').classList.add('open'); });
});
