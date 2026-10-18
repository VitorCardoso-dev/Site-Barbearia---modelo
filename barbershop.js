// ============================================================
// CONFIG
// ============================================================
const SHOP = { name:'Barber Premium', whatsapp:'', mapLat:-23.5505, mapLng:-46.6333 }; // Configure o número real em formato internacional, somente dígitos, antes de publicar.

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
const todayStr = () => { const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
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
function readStoredArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : null;
  } catch (error) {
    console.warn('Ignoring invalid local data for ' + key, error);
    return null;
  }
}

function saveData() {
  try {
    localStorage.setItem('bp_s', JSON.stringify(S.services));
    localStorage.setItem('bp_b', JSON.stringify(S.barbers));
    localStorage.setItem('bp_a', JSON.stringify(S.appointments));
    localStorage.setItem('bp_c', JSON.stringify(S.coupons));
    return true;
  } catch (error) {
    console.error('Could not save local demo data', error);
    toast('Não foi possível salvar os dados neste navegador.', 'error');
    return false;
  }
}

function loadData() {
  const s = readStoredArray('bp_s'), b = readStoredArray('bp_b'), a = readStoredArray('bp_a'), c = readStoredArray('bp_c');
  S.services = s || [
    {id:'s1',name:'Corte Clássico',category:'corte',price:55,duration_minutes:45,description:'Corte tradicional com acabamento impecável usando tesoura e máquina.',is_active:true},
    {id:'s2',name:'Corte + Barba',category:'combo',price:90,duration_minutes:75,description:'Combo premium: corte personalizado + modelagem completa da barba.',is_active:true},
    {id:'s3',name:'Barba Completa',category:'barba',price:45,duration_minutes:40,description:'Modelagem e aparagem completa com toalha quente e produtos premium.',is_active:true},
    {id:'s4',name:'Degradê Premium',category:'corte',price:65,duration_minutes:50,description:'Degradê perfeito com transição suave e acabamento artístico.',is_active:true},
    {id:'s5',name:'Tratamento Capilar',category:'tratamento',price:80,duration_minutes:60,description:'Hidratação profunda com produtos importados.',is_active:true},
    {id:'s6',name:'Hot Towel Shave',category:'barba',price:70,duration_minutes:55,description:'Barbear clássico com navalha, toalha quente e bálsamo relaxante.',is_active:true},
  ];
  S.barbers = b || [
    {id:'b1',name:'Carlos Eduardo',specialty:'Degradê & Navalhado',experience_years:8,avg_rating:4.9,total_reviews:234,is_active:true,work_days:[1,2,3,4,5,6],work_start:'08:00',work_end:'20:00',lunch_start:'12:00',lunch_end:'13:00'},
    {id:'b2',name:'Rafael Santos',specialty:'Barba & Visagismo',experience_years:6,avg_rating:4.8,total_reviews:189,is_active:true,work_days:[1,2,3,4,5,6],work_start:'08:00',work_end:'20:00',lunch_start:'12:00',lunch_end:'13:00'},
    {id:'b3',name:'Marcos Oliveira',specialty:'Corte Clássico',experience_years:12,avg_rating:5.0,total_reviews:312,is_active:true,work_days:[1,2,3,4,5,6],work_start:'08:00',work_end:'20:00',lunch_start:'12:00',lunch_end:'13:00'},
  ];
  S.appointments = a || [];
  S.coupons = c || [{id:'c1',code:'BEMVINDO10',discount_percent:10,is_active:true,max_uses:50,current_uses:0,valid_until:'2025-12-31'}];
  if (!s || !b || !a || !c) saveData();
}

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
  const svc=S.services.find(s=>s.id===S.bk.service), dur=Math.max(1,Number(svc&&svc.duration_minutes)||30);
  const [eh,em]=(barber.work_end||'20:00').split(':').map(Number), [lsh,lsm]=(barber.lunch_start||'12:00').split(':').map(Number), [leh,lem]=(barber.lunch_end||'13:00').split(':').map(Number);
  let [sh,sm]=(barber.work_start||'08:00').split(':').map(Number);
  const dayOfWeek=new Date(S.bk.date+'T00:00:00').getDay(), workDays=Array.isArray(barber.work_days)?barber.work_days:[1,2,3,4,5,6];
  if(!workDays.includes(dayOfWeek)){grid.innerHTML='<p style="color:var(--muted);">Este profissional não atende neste dia. Escolha outra data.</p>';return;}
  const booked=S.appointments.filter(a=>a.barber_id===S.bk.barber&&a.date===S.bk.date&&a.status!=='cancelled'), lunchStart=lsh*60+lsm, lunchEnd=leh*60+lem, now=new Date(), slots=[];
  while(sh*60+sm+dur<=eh*60+em){
    const begin=sh*60+sm, finish=begin+dur, t=String(sh).padStart(2,'0')+':'+String(sm).padStart(2,'0');
    const overlapsLunch=lunchEnd>lunchStart&&begin<lunchEnd&&finish>lunchStart;
    const overlapsBooking=booked.some(a=>{const p=String(a.time||'00:00').split(':').map(Number), aStart=p[0]*60+p[1], aEnd=aStart+(Number(a.duration_minutes)||30);return begin<aEnd&&finish>aStart;});
    const isPast=S.bk.date<todayStr()||(S.bk.date===todayStr()&&begin<=now.getHours()*60+now.getMinutes());
    slots.push({t:t,ok:!overlapsLunch&&!overlapsBooking&&!isPast}); sm+=30; if(sm>=60){sh++;sm-=60;}
  }
  grid.innerHTML=slots.length?slots.map(s=>'<div class="tslot '+(s.t===S.bk.time?'sel':'')+' '+(!s.ok?'busy':'')+'" '+(s.ok?'onclick="selectTime(\''+s.t+'\')"':'')+'>'+s.t+'</div>').join(''):'<p style="color:var(--muted);">Sem horários disponíveis.</p>';
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
  const name=$('client-name').value.trim(), phone=$('client-phone').value.trim(), digits=phone.replace(/\D/g,'');
  if(!name||!phone){toast('Nome e telefone são obrigatórios','error');return;}
  if(digits.length<10||digits.length>13){toast('Informe um telefone válido com DDD.','error');return;}
  const svc=S.services.find(s=>s.id===S.bk.service), barber=S.barbers.find(b=>b.id===S.bk.barber);
  if(!svc||!barber||!S.bk.date||!S.bk.time){toast('Revise serviço, profissional, data e horário.','error');return;}
  if(!SHOP.whatsapp){toast('O WhatsApp da barbearia ainda não foi configurado. Esta demonstração não enviou seu pedido.','error');return;}
  const email=$('client-email').value.trim();
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Informe um e-mail válido ou deixe o campo vazio.','error');return;}
  const bookingCode=genCode();
  const lines=['Olá! Gostaria de solicitar um agendamento na '+SHOP.name+'.','Código de referência: '+bookingCode,'Nome: '+name,'Telefone: '+phone,email?'E-mail: '+email:null,'Serviço: '+svc.name+' — '+fmt(svc.price),'Profissional: '+barber.name,'Data: '+fmtD(S.bk.date),'Horário solicitado: '+S.bk.time,'Duração estimada: '+svc.duration_minutes+' min','Pagamento pretendido: '+$('payment-method').value,$('booking-notes').value.trim()?'Observações: '+$('booking-notes').value.trim():null,'Entendo que o horário só estará confirmado após a resposta da barbearia.'].filter(Boolean);
  const url='https://wa.me/'+String(SHOP.whatsapp).replace(/\D/g,'')+'?text='+encodeURIComponent(lines.join('\n'));
  const win=window.open(url,'_blank','noopener,noreferrer');
  if(!win){toast('O navegador bloqueou a abertura do WhatsApp. Permita pop-ups e tente novamente.','error');return;}
  S.finalApt={booking_code:bookingCode,service_name:svc.name,service_price:svc.price,barber_name:barber.name,date:S.bk.date,time:S.bk.time};
  document.querySelectorAll('.booking-step').forEach(el=>el.classList.remove('active')); $('step-6').classList.add('active');
  $('success-code').textContent=bookingCode;
  $('success-summary').innerHTML='<div class="sum-row"><span class="sl">Serviço</span><span>'+svc.name+'</span></div><div class="sum-row"><span class="sl">Profissional</span><span>'+barber.name+'</span></div><div class="sum-row"><span class="sl">Data & Hora solicitadas</span><span>'+fmtD(S.bk.date)+' às '+S.bk.time+'</span></div><div class="sum-row total"><span class="sl">Total estimado</span><span class="sv">'+fmt(svc.price)+'</span></div>';
  toast('Pedido preparado no WhatsApp. Envie a mensagem para solicitar o horário.');
}
function copyCode(){
  if(S.finalApt&&navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(S.finalApt.booking_code).then(()=>toast('Código copiado!')).catch(()=>toast('Não foi possível copiar o código.','error'));
}
function shareWhatsApp(){
  const a=S.finalApt; if(!a)return;
  if(!SHOP.whatsapp){toast('Configure o WhatsApp real da barbearia antes de compartilhar.','error');return;}
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
  const results=S.appointments.filter(a=>String(a.client_phone||'').replace(/\D/g,'')===phone);
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

document.addEventListener('DOMContentLoaded',()=>{
  const year=$('copyright-year'); if(year) year.textContent=String(new Date().getFullYear());
  loadData(); renderServices(); renderTeam();
  setTimeout(initMap,600);
});
