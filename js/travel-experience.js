/* ---------- 도착 연출: 표 뜯기 + 효과음 ---------- */
document.body.appendChild($('arrive'));document.body.appendChild($('ckin'));document.body.appendChild($('bonusPop')); // 화면 전체 기준으로 뜨도록 (변형된 부모 안에 있으면 위치가 어긋남)
const ARQ=[];let arrOpen=false,arrTimers=[];
function arrQ(x){x.d=dk(today0());ARQ.push(x);window.ARR_T=Date.now();setTimeout(showArrival,60)}
const ymd=d=>`${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}`;
function showArrival(){if(arrOpen||!ARQ.length||S.running)return;const x=ARQ.shift();if(x.w==='space')return spArrival(x);if(x.w==='kr'?!(KRM[x.f]&&KRM[x.t]):!(NAT[x.f]&&NAT[x.t]))return showArrival();
  arrOpen=true;const el=$('arrive');el.classList.remove('show-msg');el.hidden=false;let snd;
  if(x.w==='kr'){const B=KRM[x.t],gi=krGroup(B)-1,dt=pk(x.d);snd=krMode(x.f,x.t);if(snd==='air')snd='plane';$('arrTk').innerHTML=krTicket(x.f,x.t,{done:1,d:x.d,gold:x.gold,cls:x.cls,free:x.free});
    $('arrMsg').innerHTML=`<span class="ks-stamp arr-stamp${x.cls?' gold':''}" style="--k:${KINK[gi]};--c:color-mix(in srgb,${KINK[gi]} 78%,var(--ink));--r:-8deg"><small>${B[2]}</small><b>${B[1].replace(/\(.+\)/,'')}</b><small>${pad(dt.getMonth()+1)}.${pad(dt.getDate())}</small></span><b>${B[1]} 도착!</b><span>지역 도장을 받았어요</span>`}
  else{const B=NAT[x.t],wm=wMode(x.f,x.t);snd=wm==='air'?'plane':wm==='ntrain'?'train':'ship';$('arrTk').innerHTML=bpTicket(x.f,x.t,1,0,Math.round(flightMin(x.f,x.t)*WMUL[x.cls||0]),true,{gold:x.gold,cls:x.cls,free:x.free});
    $('arrMsg').innerHTML=`<span class="arr-flag">${flag(x.t)}</span><b>${B[2]} 도착!</b><span>${B[1]} 입국 도장이 찍혔어요</span>`}
  const extra=(x.free?'<div class="arr-route">누적 공부 30분 선물 · 무료 최고급 티켓 · 마일리지 차감 없음</div>':'')+(TSND().anno?`<div class="arr-anno"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg><span>${annoText(x)}</span></div>`:'')+(x.secret?`<div class="arr-route sec">비밀 목적지 발견! 특별한 도장을 받았어요</div>`:'')+(x.certs&&x.certs.length?`<div class="arr-cert">${x.certs.map(c=>`<button class="secondary" data-certv="${c.id}">${c.title} · 인증서 보기</button>`).join('')}</div>`:'')+(x.route?`<div class="arr-route">${x.route} 완주! 금색 표를 모두 모았어요</div>`:'')+(x.hid&&x.hid.length?`<div class="arr-hid">${x.hid.map(id=>hstamp(id,dk(today0()),1)).join('')}<span>히든 도전 과제 ${x.hid.map(id=>`'${HIDX[id][1]}'`).join(', ')} 달성!</span></div>`:'')
    +(x.w==='kr'?postcard('kr:'+x.t,krArt(x.t),KRM[x.t][1],ymd(pk(x.d))):postcard('w:'+x.t,worldArt(x.t),NAT[x.t][2],ymd(pk(x.d))));
  $('arrMsg').insertAdjacentHTML('beforeend',extra);
  $('arrOk').textContent='확인';arrSound(snd);
  const tk=$('arrTk').firstElementChild,st=tk.querySelector('.tx-stub'),mn=tk.querySelector('.tx-main'),vert=st.offsetTop>mn.offsetTop+5;if(vert)tk.classList.add('vert');
  arrTimers=[setTimeout(()=>{tk.classList.add('ripping','edge');ripSound()},800),
    setTimeout(()=>{tk.classList.add('gone','edge');tk.style.transform=vert?`translateY(${st.offsetHeight/2}px)`:`translateX(${st.offsetWidth/2}px)`},2000),
    setTimeout(()=>{el.classList.add('show-msg');if(x.hid&&x.hid.length)vibe();if(TSND().anno)speak(annoText(x))},2500)];
}
function showTicket(id){
  const K=kr(tr()),secret=SECKM[id],entry=(secret?K.sec||[]:K.done).find(x=>x.c===id);
  if(!entry||!KRM[id])return;
  const i=K.path.indexOf(id),f=entry.f||(i>0?K.path[i-1]:secret?secret[5]:K.home),d=entry.d;
  if(!KRM[f]||f===id)return;
  arrTimers.forEach(clearTimeout);arrOpen=true;const el=$('arrive');el.hidden=false;el.classList.add('show-msg');
  $('arrTk').innerHTML=krTicket(f,id,{torn:1,d,free:!!entry.free,gold:goldHist('kr',f,id),cls:entry.tier===2?1:0});vibe();
  $('arrMsg').innerHTML=`<b>${KRM[id][1]}</b><span>${KRM[f][1]}에서 출발${d?' · '+ymd(pk(d))+' 도착':''}</span>`+(secret?'<span class="secret-ticket-label">✦ 비밀 목적지 티켓</span>':'')+postcard('kr:'+id,krArt(id),KRM[id][1],d?ymd(pk(d)):'');$('arrOk').textContent='닫기';
}
function closeArrival(){arrTimers.forEach(clearTimeout);$('arrive').hidden=true;arrOpen=false;setTimeout(showArrival,250)}
$('arrOk').addEventListener('click',closeArrival);
$('arrive').addEventListener('click',e=>{if(e.target===$('arrive'))closeArrival()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&arrOpen)closeArrival()});
$('krStamps').addEventListener('click',e=>{const b=e.target.closest('[data-tix]');if(b)showTicket(b.dataset.tix)}); // 진동은 showTicket 안에서
// 종이 찢는 소리: 짧은 잡음을 불규칙하게 이어 붙임
function ripSound(){if(!TSND().rip)return;const a=audio();if(!a)return;try{const nb=a.createBuffer(1,a.sampleRate*.05,a.sampleRate),ch=nb.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;
  let t=a.currentTime+.02;const end=t+1.1;while(t<end){const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),d=.008+Math.random()*.025,v=.05+Math.random()*.14*(1-(end-t)/1.4);
    s.buffer=nb;fl.type='bandpass';fl.frequency.value=1800+Math.random()*3500;fl.Q.value=.8;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl).connect(g).connect(a.destination);s.start(t);s.stop(t+d+.01);t+=d*(.4+Math.random()*1.2)}}catch(e){}}
// 효과음은 파일 없이 웹 오디오로 합성
function arrSound(k){if(!TSND().arrive)return;const a=audio();if(!a)return;try{
  const t0=a.currentTime+.05,out=a.createGain();out.gain.value=.6;out.connect(a.destination);
  const tone=(f,t,d,type='sine',v=.2,f2)=>{const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(out);o.start(t);o.stop(t+d+.05)};
  const nb=a.createBuffer(1,a.sampleRate*2,a.sampleRate),ch=nb.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;
  const noise=(t,d,ft,f,v,f2,q=1,att=.01)=>{const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();s.buffer=nb;fl.type=ft;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);fl.Q.value=q;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl).connect(g).connect(out);s.start(t);s.stop(t+d+.05)};
  const bell=(f,t,v=.18,d=1.2)=>{tone(f,t,d,'sine',v);tone(f*2.76,t,d*.5,'sine',v*.22);tone(f*5.4,t,d*.25,'sine',v*.08)};
  if(k==='train'){let t=t0;[.16,.19,.23,.28,.34,.42].forEach(g=>{noise(t,.06,'bandpass',950,.55,0,2.5);noise(t+.1,.06,'bandpass',720,.5,0,2.5);t+=g+.2}); // 덜컹덜컹, 점점 느리게
    tone(2600,t,1,'sine',.05,2250);tone(3150,t+.05,.9,'sine',.03,2800);noise(t,1.1,'highpass',3200,.07); // 브레이크 끼익
    bell(659,t+1.1);bell(523,t+1.45);bell(784,t+1.8,.18,1.6)} // 도착 차임
  else if(k==='bus'){bell(1175,t0,.15,.5);bell(1175,t0+.22,.12,.6); // 하차벨
    tone(52,t0+.5,1.4,'sawtooth',.07);noise(t0+.6,.9,'highpass',1800,.4,0,.7,.005); // 정차 + 에어브레이크 '칙'
    noise(t0+1.6,.5,'bandpass',1400,.3,500,1.5,.03);tone(300,t0+1.65,.3,'square',.025,200)} // 문 열림
  else if(k==='plane'){noise(t0,2.4,'lowpass',2200,.28,220,.7,.25); // 엔진 감속
    bell(880,t0+.7,.2,1.4);bell(698,t0+1.1,.2,1.9)} // 기내 '딩-동'
  else{[[98,.2],[147,.11],[196,.05]].forEach(([f,v])=>{const o=a.createOscillator(),g=a.createGain(),fl=a.createBiquadFilter();o.type='sawtooth';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=650;
      g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(v,t0+.18);g.gain.setValueAtTime(v,t0+1.4);g.gain.exponentialRampToValueAtTime(.0001,t0+2.1);o.connect(fl).connect(g).connect(out);o.start(t0);o.stop(t0+2.2)}); // 뱃고동
    noise(t0+.3,2.4,'lowpass',500,.12,250,.5,.7)} // 파도
}catch(e){}}

/* ==================== 여행 확장: 특별 루트·경유·등급·업적·엽서·설정 ==================== */
const TSND=()=>Object.assign({arrive:true,rip:true,vibe:true,anno:false,voice:false},S.snd||{});
const vibe=()=>{try{if(TSND().vibe){if(window.TourdyNative)window.TourdyNative.vibrate();else if(navigator.vibrate)navigator.vibrate(12)}}catch(e){}};
function busyIn(id){const a=document.activeElement;return !!(a&&$(id)&&$(id).contains(a)&&a.matches('input,textarea'))}
/* ---------- 특별 루트 (출발지 한정, 금색 표) ---------- */
const ROUTES=[
  {id:'east',w:'kr',name:'동해안 7번 국도',desc:'부산에서 고성까지 동해를 따라 북쪽으로',stops:['busan','ulsan','gyeongju','pohang','yeongdeok','uljin','samcheok','donghae','gangneung','yangyang','sokcho','goseonggw']},
  {id:'south',w:'kr',name:'남해안 다도해',desc:'목포에서 부산까지 섬과 바다를 잇는 길',stops:['mokpo','haenam','wando','goheung','yeosu','namhae','tongyeong','geoje','busan']},
  {id:'west',w:'kr',name:'서해안 노을길',desc:'강화에서 목포까지 서해 노을을 따라',stops:['ganghwa','incheon','hwaseong','dangjin','seosan','taean','boryeong','seocheon','gunsan','buan','gochang','yeonggwang','mokpo']},
  {id:'ancient',w:'kr',name:'천년 고도 순례',desc:'옛 도읍지를 차례로 걷는 역사 여행',stops:['seoul','suwon','gongju','buyeo','iksan','gyeongju','andong']},
  {id:'silk',w:'w',name:'실크로드',desc:'베이징에서 앙카라까지 비단길을 따라',stops:['CN','KG','UZ','TM','IR','TR']},
  {id:'indochina',w:'w',name:'인도차이나 일주',desc:'방콕에서 자카르타까지 동남아 한 바퀴',stops:['TH','LA','VN','KH','MY','SG','ID']},
  {id:'euro',w:'w',name:'유럽 수도 기행',desc:'파리에서 로마까지 유럽의 수도를 잇는 길',stops:['FR','BE','NL','DE','CZ','AT','HU','HR','IT']},
  {id:'nordic',w:'w',name:'오로라 북유럽',desc:'코펜하겐에서 레이캬비크까지 북쪽 끝으로',stops:['DK','NO','SE','FI','IS']},
  {id:'andes',w:'w',name:'안데스 종단',desc:'부에노스아이레스에서 보고타까지 산맥을 따라',stops:['AR','CL','BO','PE','EC','CO']},
  {id:'safari',w:'w',name:'아프리카 사파리',desc:'나이로비에서 프리토리아까지 초원을 가로질러',stops:['KE','TZ','ZM','ZW','BW','NA','ZA']},
  {id:'pacific',w:'w',name:'남태평양 섬 잇기',desc:'수바에서 마주로까지 크루즈로 섬을 건너',stops:['FJ','TO','WS','TV','KI','MH']},
];
const ROUTE=Object.fromEntries(ROUTES.map(r=>[r.id,r]));
const RT=()=>{const T=tr();return T.routes=Object.assign({act:null,done:{},legs:[]},T.routes||{})};
const plName=(w,id)=>w==='kr'?(KRM[id]||[])[1]:(NAT[id]||[])[2];
function goldLeg(w,f,t){const R=RT(),a=R.act;if(a&&ROUTE[a.id]&&ROUTE[a.id].w===w&&ROUTE[a.id].stops[a.i]===f&&ROUTE[a.id].stops[a.i+1]===t)return true;return false}
const goldHist=(w,f,t)=>RT().legs.includes(w+':'+f+'>'+t);
function startRoute(id){if(window.TourdyNative?.transactionBusy)return;const r=ROUTE[id],T=tr(),K=kr(T),R=RT();if(!r||!inSeason(r))return;const at=r.w==='kr'?K.at:T.at;if(at!==r.stops[0]||R.act||(r.w==='kr'?K.to:T.to))return;
  R.act={id,i:0};if(r.w==='kr'){K.to=r.stops[1];K.final=null;K.cls=1;K.goal=null;K.hold=false;T.to=null}else{T.to=r.stops[1];T.final=null;T.cls=2;T.goal=null;T.hold=false;kr(T).to=null}
  sp(T).to=null;save();vibe();if(checkArrival())ding();renderTravel();window.scrollTo({top:0,behavior:'smooth'})}
function stopRoute(w){const R=RT();if(R.act&&ROUTE[R.act.id]&&ROUTE[R.act.id].w===w)R.act=null}
function renderRoutes(w){const el=$(w==='kr'?'krRoutes':'tvRoutes');if(!el)return;const T=tr(),K=kr(T),R=RT(),at=w==='kr'?K.at:T.at,busy=w==='kr'?!!K.to:!!T.to;
  el.innerHTML=`<div class="panel-head"><h2>특별 루트</h2><span class="note">정해진 출발지에서만 · 모든 구간 최상급 금색 표</span></div><div class="rts">${ROUTES.filter(r=>r.w===w).map(r=>{
    const act=R.act&&R.act.id===r.id,done=R.done[r.id],open=inSeason(r),here=at===r.stops[0]&&open,canStart=here&&!R.act&&!busy,i=act?R.act.i:-1;
    const chain=r.stops.map((s,k)=>`<span class="${act&&k<=i?'on':done?'dn':''}${act&&k===i+1?' nx':''}">${plName(w,s)}</span>`).join('<i>›</i>');
    const st=act?`<span class="rt-st on">진행 중 · ${i}/${r.stops.length-1}</span>`:canStart?`<span class="rt-st ok">지금 출발 가능</span>`:done?`<span class="rt-st dn">완주 · ${ymd(pk(done))}</span>`:!open?`<span class="rt-st">${seasonLbl(r)}에만 열려요</span>`:here?`<span class="rt-st">이동을 마친 뒤 출발</span>`:`<span class="rt-st">${plName(w,r.stops[0])}에서만 출발</span>`;
    return `<div class="rt${act?' act':''}${done?' done':''}${canStart?' here':''}${r.season?' ss-'+seasonLbl(r):''}"${canStart?` role="button" tabindex="0" data-rtgo="${r.id}" aria-label="${esc(r.name)} 출발"`:''}><div class="rt-h"><span class="rt-title"><span class="rt-icon">${routeIcon(r.id)}</span><b>${r.name}${r.season?`<em class="rt-ss">${seasonLbl(r)} 한정</em>`:''}</b></span><div class="rt-side">${st}</div></div><p>${r.desc}</p><div class="rt-chain">${chain}</div></div>`}).join('')}</div>`}

document.addEventListener('keydown',e=>{const card=e.target.closest('[data-rtgo]');if(card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();card.click()}});
document.addEventListener('click',e=>{const g=e.target.closest('[data-rtgo]');if(g)startRoute(g.dataset.rtgo)});
/* ---------- 경유 (선택) ---------- */
function pickViaKr(a,b){const L=krRoute(a,b);if(L.length>1&&L[0].t!==a&&L[0].t!==b)return L[0].t; // 환승이 있으면 표에 적힌 첫 환승 도시에 들름
  const d=krKm(a,b);if(d<150)return null;let best=null,bs=-1;
  KR.forEach(x=>{const c=x[0];if(c===a||c===b)return;const l1=krKm(a,c),l2=krKm(c,b);if(l1+l2>d*1.12)return;const sc=Math.min(l1,l2)-(krDone(kr(tr()),c)?15:0);if(sc>bs){bs=sc;best=c}});return best}
const HUBS=['AE','QA','TR','SG','DE','NL','GB','FR','US','JP','CN','TH','ZA','ET','BR','AU','IN','CA','MX','KE','EG','ES','PA','CL'];
function pickViaW(a,b){const d=kmBetween(a,b);if(d<7000)return null;let best=null,bs=-1;
  HUBS.forEach(c=>{if(c===a||c===b||!NAT[c])return;const l1=kmBetween(a,c),l2=kmBetween(c,b);if(l1+l2>d*1.15)return;const sc=Math.min(l1,l2);if(sc>bs){bs=sc;best=c}});return best}
/* ---------- 좌석 등급 · 목표 도착일 ---------- */
function clsPick(w,m,ci){const L=w==='kr'?KCLS[m]:WCLS[m];return `<div class="cls-pick" role="group" aria-label="좌석 등급">${L.map((l,i)=>`<button data-ci="${i}" data-cw="${w}" aria-pressed="${i===ci}">${l}${i?`<small>+${[0,30,60][i]}%</small>`:''}</button>`).join('')}</div>`}
function goalBox(w,o,left){if(!TOPT().goal)return '';const t0=today0();let msg='날짜를 고르면 하루에 필요한 공부량을 알려 줘요';
  if(o.goal){const days=Math.round((pk(o.goal)-t0)/864e5)+1;const need=Math.max(0,left)*6/mileRate();
    msg=left<=0?'곧 도착해요':days<1?'이미 지난 날짜예요':need/days>480?'하루 최대 8시간까지만 쌓여서 이 날짜엔 어려워요':`하루 <b>${fmtH(need/days*6e4)}</b>씩 공부하면 ${days}일 뒤 도착해요`}
  return `<div class="tgoal"><label>목표 도착일 <input class="field" type="date" data-goal="${w}" value="${o.goal||''}" min="${dk(t0)}"></label><span>${msg}</span></div>`}
['krTrip','tvFlight'].forEach(id=>{$(id).addEventListener('click',e=>{const b=e.target.closest('[data-ci]');if(!b)return;const T=tr(),o=b.dataset.cw==='kr'?kr(T):T;o.cls=+b.dataset.ci;save();vibe();if(checkArrival())ding();renderTravel()});
  $(id).addEventListener('change',e=>{const i=e.target.closest('[data-goal]');if(!i)return;const T=tr(),o=i.dataset.goal==='kr'?kr(T):T;o.goal=i.value||null;save();i.blur();renderTravel()})});
/* ---------- 도착 처리 공통: 루트 진행, 경유, 히든 과제 ---------- */
function postArrive(ev){const T=tr(),K=kr(T),R=RT();ev.ts=Date.now();
  (T.arrLog=T.arrLog||[]).push({w:ev.w,f:ev.f,t:ev.t,ts:ev.ts});if(T.arrLog.length>800)T.arrLog.splice(0,T.arrLog.length-800);
  if(ev.w==='kr'){K.cls=0;K.goal=null}else{T.cls=0;T.goal=null}
  const a=R.act,r=a&&ROUTE[a.id];
  if(r&&r.w===ev.w){if(r.stops[a.i]===ev.f&&r.stops[a.i+1]===ev.t){R.legs.push(ev.w+':'+ev.f+'>'+ev.t);a.i++;
      if(a.i>=r.stops.length-1){R.done[r.id]=dk(today0());R.act=null;ev.route=r.name}
      else if(ev.w==='kr'){K.to=r.stops[a.i+1];K.cls=1;K.hold=false}else{T.to=r.stops[a.i+1];T.cls=2;T.hold=false}}
    else R.act=null}
  // 경유지에 도착하면 다시 승차 수속을 받지 않고, 고른 좌석 등급 그대로 다음 구간을 이어 간다 (예전엔 hold=true로 멈춰서 마일리지가 있어도 끝나지 않았음)
  if(ev.w==='kr'&&!K.to&&K.final){const nx=pickViaKr(K.at,K.final);if(nx&&nx!==K.final&&nx!==K.at)K.to=nx;else{K.to=K.final;K.final=null}K.cls=ev.cls||0;K.hold=false}
  if(ev.w==='w'&&!T.to&&T.final){T.to=T.final;T.final=null;T.cls=ev.cls||0;T.hold=false}
  ev.hid=evalHidden(ev);ev.secret=!!(SECKM[ev.t]||SECWM[ev.t]);ev.certs=newCerts()}
/* ---------- 히든 도전 과제 ---------- */
const HI={ // 24x24 선 아이콘
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',sunrise:'<path d="M4 18h16M7 18a5 5 0 0 1 10 0M12 4v4M5 9l2 2M19 9l-2 2M2 14h2M20 14h2"/>',
  snow:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/>',fire:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/><circle cx="12" cy="12" r="2"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M10 15l2 2 4-4"/>',house:'<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6"/>',
  wave:'<path d="M2 15c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1M2 20c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1M12 3l3 6H9z"/>',comet:'<circle cx="16" cy="8" r="4"/><path d="M13 11 3 21M11 8 4 15M16 13l-6 7"/>',
  star:'<path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.8z"/>',jump:'<path d="M3 17c3-8 7-11 9-11s6 3 9 11M8 17h8"/><circle cx="12" cy="4" r="1.5"/>',
  train:'<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/>',
  anchor:'<circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8 10h8"/>',crown:'<path d="m3 8 4 4 5-7 5 7 4-4-2 11H5z"/>'};
const HIDDEN=[ // [id, 이름, 설명, 아이콘, 색1, 색2]
  ['owl','올빼미 여행자','자정부터 새벽 4시 사이에 도착','moon','#7aa2ff','#1b2a6b'],
  ['dawn','첫차 승객','새벽 5시~7시 사이에 도착','sunrise','#ffb36b','#a8431a'],
  ['xmas','화이트 크리스마스','12월 24일이나 25일에 도착','snow','#bfe9ff','#1f6f9e'],
  ['ny','새해 첫 여정','1월 1일에 도착','fire','#ffd76b','#a3264b'],
  ['triple','강행군','하루에 세 곳 도착','bolt','#fff07a','#b06a00'],
  ['equator','적도 통과','적도를 넘어 이동','globe','#7af0c8','#0d6b55'],
  ['dateline','날짜변경선','날짜변경선을 건너 이동','cal','#f3a6ff','#6b1f86'],
  ['home','귀향','국내 출발지로 다시 돌아옴','house','#ffc6a6','#8a3d1a'],
  ['island','동쪽 끝 섬','울릉도 도착','wave','#8fd8ff','#0b4f7a'],
  ['far','지구 반대편','한 번에 10,000km 넘게 이동','comet','#ffd1f0','#7a1f6b'],
  ['north','극지 탐험가','북위 60도 근처 도시에 도착','star','#c9f7ff','#145a7a'],
  ['cont2','대륙 점프','하루에 두 대륙에 도착','jump','#d3ff9a','#3c6b12'],
  ['sleeper','침대열차의 낭만','야간열차로 첫 국경 넘기','train','#c8c4ff','#2c2687'],
  ['captain','선장님','크루즈로 첫 항해','anchor','#9ff2ff','#0b5f6b'],
  ['gold3','황금 여권','특별 루트 3개 완주','crown','#ffe08a','#8a5a00'],
  ['terminus','종착역','D-day 노선을 켜고 D-day 당일을 맞이','train','#ffd27a','#9a3b12'],
];
function crossesDateline(a,b){let prev=null;for(let i=0;i<=40;i++){const p=gcAt(a,b,i/40);if(prev!=null&&Math.abs(p[1]-prev)>180)return true;prev=p[1]}return false}
function evalHidden(ev){const T=tr(),K=kr(T),H=T.hid=T.hid||{},now=new Date(),h=now.getHours(),md=(now.getMonth()+1)*100+now.getDate(),day=dk(today0()),out=[];
  const todayLog=(T.arrLog||[]).filter(x=>dk(new Date(x.ts))===dk(now));
  const A=ev.w==='w'?NAT[ev.f]:null,B=ev.w==='w'?NAT[ev.t]:null,wm=ev.w==='w'?wMode(ev.f,ev.t):null;
  const ok={owl:h<4,dawn:h>=5&&h<7,xmas:md===1224||md===1225,ny:md===101,triple:todayLog.length>=3,
    equator:!!(A&&B&&Math.sign(A[3])!==Math.sign(B[3])),dateline:!!(A&&B&&crossesDateline([A[3],A[4]],[B[3],B[4]])),
    home:ev.w==='kr'&&ev.t===K.home&&K.done.length>0,island:ev.t==='ulleung',far:!!(A&&B&&kmBetween(ev.f,ev.t)>=10000),
    north:!!(B&&B[3]>=59),cont2:new Set(todayLog.filter(x=>x.w==='w'&&NAT[x.t]).map(x=>NAT[x.t][5])).size>=2,
    sleeper:wm==='ntrain',captain:wm==='cruise',gold3:Object.keys(RT().done).length>=3};
  HIDDEN.forEach(([id])=>{if(ok[id]&&!H[id]){H[id]=day;out.push(id)}});return out}
const HIDX=Object.fromEntries(HIDDEN.map(x=>[x[0],x]));
function hstamp(id,date,small){const x=HIDX[id];if(!x)return '';const got=!!date;
  return `<div class="hs${got?'':' lock'}${small?' sm':''}" style="--a:${x[4]};--b:${x[5]}"><div class="hs-in" title="${got?x[1]:'???'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${got?HI[x[3]]:'<path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .8-1 1.5V14M12 17.5v.5"/>'}</svg></div></div>`}
/* ---------- 업적 탭 ---------- */
const LV=[['일반',0],['브론즈',20],['실버',60],['골드',150],['블랙',300]];
const PPGLOBE='<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><circle cx="24" cy="24" r="14"/><path d="M10 24h28M24 10c5 4 5 24 0 28M24 10c-5 4-5 24 0 28M13 17h22M13 31h22"/></svg>';
let achYear=null;
function renderAch(){const T=tr(),K=kr(T),R=RT(),H=T.hid||{},total=K.done.length+T.stamps.length;let li=0;LV.forEach((l,i)=>{if(total>=l[1])li=i});const nx=LV[li+1];
  const PP=T.pp||{},pc=PPCOL[PP.col]&&PPCOL[PP.col][3]<=li?PPCOL[PP.col]:null,pe=PPEM[PP.em]&&PPEM[PP.em][2]<=li?PPEM[PP.em]:PPEM[0];
  $('achPass').innerHTML=`<div class="pp lv${li}"><div class="pp-cover" ${pc?`style="--c1:${pc[1]};--c2:${pc[2]}"`:''}>${pe[1]()}<b>PASSPORT</b><small>${esc(PP.name||'투어디 여권')}</small></div>
    <div class="pp-info"><span class="note">여권 등급</span><b>${LV[li][0]} 여권</b><span>모은 도장 ${total}개</span>
      <div class="pp-bar"><i style="width:${nx?Math.min(100,(total-LV[li][1])/(nx[1]-LV[li][1])*100):100}%"></i></div><small>${nx?`${nx[0]}까지 도장 ${nx[1]-total}개`:'가장 높은 등급이에요'}</small>
      <div class="pp-lv">${LV.map((l,i)=>`<span class="lv${i}${i<=li?' on':''}">${l[0]}</span>`).join('')}</div></div></div>${ppEditor(li)}`;
  const kt=KR.length-1,kd=K.done.length,dm=new Set(K.done.map(d=>d.c)),wd=T.stamps.length,wt=NATIONS.length-1,gotC=new Set(T.stamps.map(s=>NAT[s.c]?.[5]));
  const it=(name,desc,cur,goal,col)=>({name,desc,cur:Math.min(cur,goal),goal,col,ok:cur>=goal});
  const groups=[
    ['국내',[it('첫 도장','국내 첫 도착',kd,1,'#1d6fd8'),it('25% 달성','시·군 25% 방문',kd,Math.ceil(kt*.25),'#1d6fd8'),it('절반 달성','시·군 50% 방문',kd,Math.ceil(kt*.5),'#1d6fd8'),it('75% 달성','시·군 75% 방문',kd,Math.ceil(kt*.75),'#1d6fd8'),it('전국 완주','모든 시·군 방문',kd,kt,'#c9a227'),
      ...KRG.slice(1).map((g,gi)=>{const all=KR.filter(x=>krGroup(x)===gi+1&&x[0]!==K.home);return it(`${g[0]} 완주`,`${g[0]} 모든 곳 방문`,all.filter(x=>dm.has(x[0])).length,all.length,KINK[gi])})]],
    ['세계',[...CONT.map((c,i)=>it(`${c} 첫 도착`,`${c}의 나라에 처음 입국`,gotC.has(i)?1:0,1,INK[i])),it('모든 대륙','일곱 대륙 모두 입국',gotC.size,7,'#c9a227'),
      it('장거리 비행','한 번에 5,000km 이상',T.long?1:0,1,'#2f55c4'),it('지구 한 바퀴','누적 40,075km 이동',Math.round(T.km),40075,'#14806f'),
      it('도장 10개','나라 10곳 입국',wd,10,'#7a3fb0'),it('도장 30개','나라 30곳 입국',wd,30,'#7a3fb0'),it('도장 100개','나라 100곳 입국',wd,100,'#7a3fb0'),it('세계 완주','모든 나라 입국',wd,wt,'#c9a227')]],
    ['연속 공부',(()=>{const b=passInfo().best;return PASSES.map(q=>it(q[2],`${q[0]}일 연속 공부`,b,q[0],q[5]))})()],
    ['비밀 목적지',[...SECK.map(x=>it(x[1],x[6],secVisited(K.sec,x[0])?1:0,1,'#6b4fd8')),...SECW.map(x=>it(x[2],x[7],secVisited(T.sec,x[0])?1:0,1,'#6b4fd8'))]],
    ['특별 루트',ROUTES.map(r=>it(r.name,(r.w==='kr'?'국내 · ':'세계 · ')+plName(r.w,r.stops[0])+' 출발',R.done[r.id]?1:0,1,'#c9a227'))]];
  $('achList').innerHTML=groups.map(([g,items])=>`<div class="ach-g"><div class="ach-gh"><b>${g}</b><span>${items.filter(x=>x.ok).length} / ${items.length}</span></div><div class="achs">${items.map(x=>`<div class="ach${x.ok?' ok':''}" style="--k:${x.col}"><span class="ach-i">${x.ok?'★':'☆'}</span><div><b>${x.name}</b><small>${x.desc}</small>${x.goal>1?`<div class="ach-bar"><i style="width:${x.cur/x.goal*100}%"></i></div><small class="ach-n">${x.cur.toLocaleString()} / ${x.goal.toLocaleString()}</small>`:''}</div></div>`).join('')}</div></div>`).join('')
    +`<div class="ach-g"><div class="ach-gh"><b>히든 도전 과제</b><span>${Object.keys(H).length} / ${HIDDEN.length}</span></div><p class="note">조건은 비밀이에요. 여행하다 보면 저절로 열려요.</p><div class="hss">${HIDDEN.map(x=>`<button class="hsw" data-hid="${x[0]}" aria-label="${H[x[0]]?x[1]:'숨겨진 과제'} 설명 보기">${hstamp(x[0],H[x[0]])}<b>${H[x[0]]?x[1]:'???'}</b></button>`).join('')}</div></div>`;
  renderYear();renderSouv();renderAlbum();renderPassCard();
}
function renderYear(){const T=tr(),K=kr(T),pd=perDay(true),ys=new Set([new Date().getFullYear()]);
  Object.keys(pd).forEach(k=>ys.add(+k.slice(0,4)));K.done.forEach(d=>ys.add(+d.d.slice(0,4)));T.stamps.forEach(s=>ys.add(+s.d.slice(0,4)));
  const years=[...ys].sort((a,b)=>b-a);if(achYear==null||!years.includes(achYear))achYear=years[0];const Y=String(achYear);
  let study=0;const mon=Array(12).fill(0);Object.entries(pd).forEach(([k,v])=>{if(k.startsWith(Y)){study+=v.study;mon[+k.slice(5,7)-1]+=v.study}});
  const kd=K.done.filter(d=>d.d.startsWith(Y)),ws=T.stamps.filter(s=>s.d.startsWith(Y)),dmap=Object.fromEntries(K.done.map(d=>[d.c,d.d]));
  let km=(T.log||[]).filter(e=>e.d&&e.d.startsWith(Y)&&NAT[e.f]&&NAT[e.t]).reduce((a,e)=>a+kmBetween(e.f,e.t),0);
  const seq=[K.home,...K.path],seen=new Set();for(let i=1;i<seq.length;i++){const c=seq[i];if(seen.has(c)||!KRM[c]||!KRM[seq[i-1]])continue;seen.add(c);if((dmap[c]||'').startsWith(Y))km+=krKm(seq[i-1],c)}
  const bm=mon.indexOf(Math.max(...mon)),all=[...kd.map(d=>[d.d,KRM[d.c]?.[1]]),...ws.map(s=>[s.d,NAT[s.c]?.[2]])].filter(x=>x[1]).sort((a,b)=>a[0]<b[0]?-1:1);
  $('achYear').innerHTML=`<div class="panel-head"><h2>${Y} 여행 결산</h2><div class="yr-tabs">${years.map(y=>`<button data-yr="${y}" aria-pressed="${y===achYear}">${y}</button>`).join('')}</div></div>
    <div class="yr"><div><small>공부한 시간</small><b>${fmtH(study)}</b></div><div><small>이동 거리</small><b>${Math.round(km).toLocaleString()}km</b></div>
      <div><small>국내 새 도장</small><b>${kd.length}곳</b></div><div><small>입국한 나라</small><b>${ws.length}개국</b></div>
      <div><small>가장 열심히 한 달</small><b>${mon[bm]?(bm+1)+'월':'-'}</b></div><div><small>첫 도착 → 마지막 도착</small><b>${all.length?`${all[0][1]} → ${all[all.length-1][1]}`:'-'}</b></div></div>
    <p class="note">지구 둘레(40,075km)의 ${(km/40075*100).toFixed(1)}%만큼 이동했어요.</p>`}
document.addEventListener('click',e=>{const y=e.target.closest('[data-yr]');if(y){achYear=+y.dataset.yr;renderYear()}});
/* ---------- D-day 노선 (선택) ---------- */
function renderDline(){const el=$('tvDline');if(!el)return;const d=S.dday;if(!TOPT().ddline||!d||!d.date){el.hidden=true;return}
  const pdk=Object.keys(perDay(true)).sort(),start=pk(d.start||pdk[0]||dk(addD(today0(),-30))),end=pk(d.date),now=today0(),span=Math.max(1,end-start),p=Math.min(1,Math.max(0,(now-start)/span)),left=Math.round((end-now)/864e5);
  const st=[];for(let m=new Date(start.getFullYear(),start.getMonth()+1,1);m<end;m=new Date(m.getFullYear(),m.getMonth()+1,1))st.push(m);
  el.hidden=false;el.innerHTML=`<div class="dl-h"><span class="dl-k">${TRAIN}편입 열차</span><b>${esc(d.name||'D-day')}행</b><span class="dl-d">${left>0?'D-'+left:left===0?'D-DAY':'도착'}</span></div>
    <div class="dl-line"><i style="width:${p*100}%"></i>${st.map(m=>{const q=(m-start)/span;return `<span class="dl-st${q<=p?' on':''}" style="left:${q*100}%"><em>${m.getMonth()+1}월</em></span>`}).join('')}<span class="dl-tr" style="left:${p*100}%">${TRAIN}</span></div>
    <div class="dl-f"><span>출발 ${ymd(start)}</span><span>종착역 ${ymd(end)}</span></div>`}
/* ---------- 엽서 ---------- */
function postcard(key,art,city,dstr){if(!EX().postcard)return '';const T=tr(),memo=(T.memo||{})[key]||'';
  return `<div class="pc"><div class="pc-art">${art}</div><div class="pc-r"><div class="pc-top"><span class="pc-st">${city}</span><span class="pc-mk">${dstr}</span></div>
    <textarea class="pc-t" data-pc="${key}" maxlength="80" rows="3" placeholder="이 도시에서 남길 한마디 (엽서 뒷면)">${esc(memo)}</textarea></div></div>`}
document.addEventListener('input',e=>{const t=e.target.closest('[data-pc]');if(!t)return;const T=tr();(T.memo=T.memo||{})[t.dataset.pc]=t.value.slice(0,80);saveSoon()});
/* ---------- 지도 테마 · 형광 표 ---------- */
function applyNeon(){document.documentElement.classList.toggle('neon',!!TOPT().neon)}
applyNeon();

/* ==================== 탑승 수속 · 비밀 목적지 · 기념품 · 인증서 · 여권 꾸미기 · 안내 방송 · 계절 연출 · 다시 보기 ==================== */
/* ---------- 탑승 수속: 목적지를 고르면 등급을 먼저 묻고, 게이트가 열린 뒤 출발 ---------- */
const CKVERB={air:['탑승 수속 중','게이트 오픈 · 탑승 시작'],ntrain:['승차권 확인 중','개찰 시작 · 침대칸 탑승'],cruise:['승선 수속 중','승선 게이트 오픈'],train:['승차권 확인 중','개찰 시작 · 열차 탑승'],bus:['승차권 확인 중','승차 시작'],ship:['승선 수속 중','승선 시작']};
var ckW=null,ckSel=0,ckBusy=false;
function openCheckin(w){const T=tr(),K=kr(T),o=w==='kr'?K:T;if(!o.to||!o.hold)return;
  // 경유를 켜기 전에 고른 여정·예전에 저장된 여정도 승차 수속 때 경유지로 나눈다 (특별 루트 구간은 그대로)
  if(TOPT().via&&!o.final&&!(RT().act&&ROUTE[RT().act.id]&&ROUTE[RT().act.id].w===w)){const v=w==='kr'?pickViaKr(o.at,o.to):pickViaW(o.at,o.to);if(v&&v!==o.to&&v!==o.at){o.final=o.to;o.to=v;save()}}
  ckW=w;ckSel=o.cls||0;ckBusy=false;renderCheckin();$('ckin').hidden=false}
function renderCheckin(){const w=ckW,T=tr(),K=kr(T),o=w==='kr'?K:T,avail=totalMiles()-T.used;if(!o.to)return closeCheckin();
  const m=w==='kr'?krMode(o.at,o.to):wMode(o.at,o.to),L=w==='kr'?KCLS[m]:WCLS[m],MU=w==='kr'?KMUL:WMUL,base=w==='kr'?krCost(o.at,o.to):flightMin(o.at,o.to);
  const from=w==='kr'?KRM[o.at][1]:`${ap(o.at)} ${NAT[o.at][2]}`,to=w==='kr'?KRM[o.to][1]:`${ap(o.to)} ${NAT[o.to][2]}`,ic=w==='kr'?krIcon(m):wIcon(m),gold=goldLeg(w,o.at,o.to);
  const tierName=i=>w==='kr'?(i?'금색 표':''):(['','은색 표','금색 표'][i]);
  $('ckBox').innerHTML=`<div class="ck-h"><span class="ck-k">${ic}${CKVERB[m][0].replace(' 중','')}</span><b>${from} → ${to}</b>${w==='kr'&&krRoute(o.at,o.to).length>1?`<small class="ck-legs">${krRoute(o.at,o.to).map(l=>`${krLegClass(l)} ${KRM[l.f][1]}→${KRM[l.t][1]}`).join(' · ')}</small>`:''}${gold?'<span class="ck-g">특별 루트 · 금색 표</span>':''}${o.final&&(w==='kr'?KRM[o.final]:NAT[o.final])?`<small>경유 · 최종 목적지 ${w==='kr'?KRM[o.final][1]:NAT[o.final][2]}</small>`:''}</div>
    <div class="ck-ops" role="radiogroup" aria-label="좌석 등급">${L.map((l,i)=>{const c=Math.round(base*MU[i]),ok=avail>=c;
      return `<button class="ck-op${i===ckSel?' on':''}${i&&w==='w'?' t'+i:i&&w==='kr'?' t2':''}" role="radio" aria-checked="${i===ckSel}" data-ck="${i}"><span class="ck-n"><b>${l}</b>${tierName(i)?`<small>${tierName(i)}</small>`:''}</span><span class="ck-c"><b>${c}</b><small>마일</small></span><span class="ck-s ${ok?'ok':''}">${ok?'바로 도착':'공부 '+studyFor(c-avail)}</span></button>`}).join('')}</div>
    <div class="ck-step" id="ckStep" hidden><div class="ck-bar"><i></i></div><span id="ckStepT"></span><div class="ck-gate"><span></span><span></span></div></div>
    <div class="ck-a"><button class="secondary" id="ckLater">나중에</button><button class="primary" id="ckGo">${{air:'탑승하기',ntrain:'탑승하기',cruise:'승선하기',ship:'승선하기'}[m]||'승차하기'}</button></div>`}
function closeCheckin(){$('ckin').hidden=true;ckBusy=false}
function goCheckin(){if(ckBusy)return;ckBusy=true;const w=ckW,T=tr(),K=kr(T),o=w==='kr'?K:T,m=w==='kr'?krMode(o.at,o.to):wMode(o.at,o.to);o.cls=ckSel;save();
  $('ckBox').querySelector('.ck-ops').hidden=true;$('ckBox').querySelector('.ck-a').hidden=true;const st=$('ckStep');st.hidden=false;$('ckStepT').textContent=CKVERB[m][0]+'…';
  setTimeout(()=>{st.classList.add('open');$('ckStepT').textContent=CKVERB[m][1];vibe()},1000);
  setTimeout(()=>{o.hold=false;save();closeCheckin();st.classList.remove('open');if(checkArrival())ding();renderTravel();window.scrollTo({top:0,behavior:'smooth'})},1900)}
$('ckin').addEventListener('click',e=>{if(e.target===$('ckin')&&!ckBusy)return closeCheckin();const b=e.target.closest('[data-ck]');if(b&&!ckBusy){ckSel=+b.dataset.ck;renderCheckin();return}
  if(e.target.closest('#ckLater'))closeCheckin();if(e.target.closest('#ckGo'))goCheckin()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-ckopen]');if(b)openCheckin(b.dataset.ckopen)});
/* ---------- 비밀 목적지 ---------- */
const SECK=[['dokdo','독도','경북',37.241,131.865,'ulleung','울릉도에 있을 때 나타나요'],['marado','마라도','제주',33.117,126.267,'seogwipo','서귀포에 있을 때 나타나요'],['baengnyeong','백령도','인천',37.966,124.660,'ganghwa','강화에 있을 때 나타나요']];
const SECW=[['AQ','남극','세종기지',-62.22,-58.79,5,'CL AR','칠레나 아르헨티나에 있을 때 나타나요','KSG'],['XG','에콰도르','갈라파고스',-0.74,-90.31,5,'EC','에콰도르에 있을 때 나타나요','GPS'],['XE','칠레','이스터섬',-27.11,-109.35,5,'CL','칠레에 있을 때 나타나요','IPC'],
  ['SJ','노르웨이','스발바르',78.22,15.65,2,'NO','노르웨이에 있을 때 나타나요','LYR'],['XM','페루','마추픽추',-13.16,-72.55,5,'PE','페루에 있을 때 나타나요','CUZ'],['XS','모로코','사하라 사막',31.1,-4.0,3,'MA','모로코에 있을 때 나타나요','ERH']];
const SECKM=Object.fromEntries(SECK.map(x=>[x[0],x])),SECWM=Object.fromEntries(SECW.map(x=>[x[0],x]));
SECK.forEach(x=>{KRM[x[0]]=x});SECW.forEach(x=>{NAT[x[0]]=x.slice(0,6);IATA[x[0]]=x[8];CRUISEOK.add(x[0]);ISL.add(x[0])});
// 비밀 목적지는 그 출발 도시(나라)에 '지금 있을 때만' 목록에 뜬다
const secOpenK=(K,x)=>K.at===x[5],secOpenW=(T,x)=>x[6].split(' ').includes(T.at);
const secVisited=(arr,c)=>(arr||[]).some(d=>d.c===c);
/* ---------- 기념품 · 인증서 ---------- */
const CONTLM=['CN','AE','FR','EG','US','BR','AU'];
function completions(){const T=tr(),K=kr(T),R=RT(),dm=Object.fromEntries(K.done.map(d=>[d.c,d.d])),sm=Object.fromEntries(T.stamps.map(s=>[s.c,s.d])),out=[];
  KRG.slice(1).forEach((g,gi)=>{const all=KR.filter(x=>krGroup(x)===gi+1&&x[0]!==K.home);const ok=all.length&&all.every(x=>dm[x[0]]);out.push({id:'kr'+gi,kind:'kr',gi,name:g[0],title:`${g[0]} 완주`,desc:`${g[0]}의 시·군 ${all.length}곳을 모두 방문했음을 인증합니다.`,ok,d:ok?all.map(x=>dm[x[0]]).sort().pop():null,col:KINK[gi]})});
  CONT.forEach((c,ci)=>{const all=NATIONS.filter(n=>n[5]===ci&&n[0]!=='KR');const ok=all.length&&all.every(n=>sm[n[0]]);out.push({id:'w'+ci,kind:'w',ci,name:c,title:`${c} 완주`,desc:`${c}의 ${all.length}개국에 모두 입국했음을 인증합니다.`,ok,d:ok?all.map(n=>sm[n[0]]).sort().pop():null,col:INK[ci]})});
  ROUTES.forEach(r=>out.push({id:'r'+r.id,kind:'r',r,name:r.name,title:`${r.name} 완주`,desc:`특별 루트 '${r.name}'의 ${r.stops.length}곳을 차례로 여행했음을 인증합니다.`,ok:!!R.done[r.id],d:R.done[r.id]||null,col:'#c9a227'}));
  return out}
function magnetArt(c){if(c.kind==='w')return `<svg class="lm" viewBox="0 0 100 100">${LM[CONTLM[c.ci]]||''}</svg>`;
  if(c.kind==='r'){const last=c.r.stops[c.r.stops.length-1];return c.r.w==='w'&&LM[last]?`<svg class="lm" viewBox="0 0 100 100">${LM[last]}</svg>`:`<svg class="lm" viewBox="0 0 24 24" style="stroke-width:1.6">${HI.crown}</svg>`}
  const idx=KMAP.p.map((q,i)=>[q,i]).filter(([q])=>q[1]===c.gi+1).map(([,i])=>i);if(!idx.length)return '';
  const bs=idx.map(i=>KMAP.b[i]),x0=Math.min(...bs.map(b=>b[0])),y0=Math.min(...bs.map(b=>b[1])),x1=Math.max(...bs.map(b=>b[0]+b[2])),y1=Math.max(...bs.map(b=>b[1]+b[3]));
  return `<svg class="sil" viewBox="${f1(x0)} ${f1(y0)} ${f1(x1-x0)} ${f1(y1-y0)}" preserveAspectRatio="xMidYMid meet">${idx.map(i=>`<use href="#kp-${i}"/>`).join('')}</svg>`}
function certHTML(c){const T=tr(),nm=(T.pp&&T.pp.name)||'투어디 여행자';
  return `<div class="cert" style="--k:${c.col}"><div class="cert-in"><small>CERTIFICATE OF COMPLETION</small><h3>완주 인증서</h3><div class="cert-art">${magnetArt(c)}</div><p class="cert-t">${c.title}</p><p class="cert-d">${c.desc}</p>
    <div class="cert-f"><div><small>여행자</small><b>${esc(nm)}</b></div><div class="cert-seal"><span>TOURY</span><b>완주</b></div><div><small>완주일</small><b>${c.d?ymd(pk(c.d)):'-'}</b></div></div></div></div>`}
function showCert(id){const c=completions().find(x=>x.id===id);if(!c||!c.ok)return;arrTimers.forEach(clearTimeout);arrOpen=true;const el=$('arrive');el.hidden=false;el.classList.add('show-msg');
  $('arrTk').innerHTML=certHTML(c);$('arrMsg').innerHTML='';$('arrOk').textContent='닫기';vibe()}
function newCerts(){const T=tr(),seen=new Set(T.certSeen||[]),now=completions().filter(c=>c.ok);const fresh=now.filter(c=>!seen.has(c.id));T.certSeen=now.map(c=>c.id);return fresh}
/* ---------- 여권 꾸미기 ---------- */
const PPCOL=[['남색','#2b3a55','#16213a',0],['버건디','#7a1f2b','#3f0d14',0],['숲','#2f5d3a','#16301d',1],['하늘','#3a78b8','#1d3f66',2],['라벤더','#6b5aa8','#352a63',2],['골드','#e9c45a','#9a7410',3],['블랙','#2a2a2a','#000000',4]];
const PPEM=[['지구',()=>PPGLOBE,0],['비행기',()=>PLANE,1],['나침반',()=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>',2],['별',()=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">${HI.star}</svg>`,3],['왕관',()=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">${HI.crown}</svg>`,4]];
var ppEdit=false;
/* ---------- 도착 안내 방송 (선택) ---------- */
function annoText(x){const hs=hsh(x.f+x.t);if(x.w==='kr'){const B=KRM[x.t][1],m=krMode(x.f,x.t);
    if(m==='air')return `승객 여러분, 우리 비행기는 잠시 후 ${B} 공항에 도착합니다. 좌석벨트 표시등이 꺼질 때까지 자리에 앉아 계십시오.`;
    return m==='bus'?`이번 정류장은 ${B} 종합버스터미널입니다. 내리실 분은 미리 벨을 눌러 주세요.`:m==='ship'?`잠시 후 ${B}항에 도착합니다. 하선하실 때 발밑을 조심하세요.`:`이번 역은 ${B}, ${B}역입니다. 내리실 문은 ${hs%2?'왼쪽':'오른쪽'}입니다. 잊으신 물건 없이 안녕히 가십시오.`}
  const B=NAT[x.t],m=wMode(x.f,x.t),tm=localInfo(x.t).split(' · ')[0].replace('현지 ','');
  return m==='ntrain'?`${B[2]}역에 도착했습니다. 침대칸 승객께서는 두고 내리는 짐이 없는지 확인해 주세요.`:m==='cruise'?`${B[2]}항에 입항했습니다. 즐거운 기항지 여행 되십시오.`
    :`승객 여러분, 우리 비행기는 ${B[2]} ${ap(x.t)} 공항에 도착했습니다.${/\d/.test(tm)?` 현지 시각은 ${tm}입니다.`:''} 좌석벨트 표시등이 꺼질 때까지 자리에 앉아 계십시오.`}
function speak(t){try{if(!TSND().voice||!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='ko-KR';u.rate=1;speechSynthesis.speak(u)}catch(e){}}
/* ---------- 창밖 풍경 (이동 중, 끌 수 있음) ---------- */
function windowFx(){const T=tr(),K=kr(T),on=TOPT().window!==false,h=new Date().getHours(),tod=h>=19||h<5?'night':h<8||h>=17?'dusk':'day';
  [['krTrip','kr'],['tvFlight','w']].forEach(([id,w])=>{const el=$(id);if(!el)return;let W=el.querySelector(':scope>.win');const o=w==='kr'?K:T,moving=!!(o.to&&!o.hold);
    if(!on||!moving||el.hidden){if(W)W.remove();return}const m=w==='kr'?krMode(o.at,o.to):wMode(o.at,o.to),cls=`win win-${m==='ntrain'?'train':m==='cruise'?'ship':m} tod-${tod}`;
    if(W&&W.className===cls)return;if(W)W.remove();W=document.createElement('div');W.className=cls;W.setAttribute('aria-hidden','true');W.innerHTML='<i class="w1"></i><i class="w2"></i><i class="w3"></i><b></b>';el.insertBefore(W,el.firstChild)})}
/* ---------- 계절 연출 (끌 수 있음) ---------- */
function seasonNow(){const m=new Date().getMonth()+1;return m>=3&&m<=5?'spring':m>=9&&m<=11?'autumn':m===12||m<=2?'winter':'summer'}
function seasonFx(){const on=TOPT().season!==false,ss=seasonNow();['krMap','tvMap','krTrip','tvFlight'].forEach(id=>{const el=$(id);if(!el)return;let L=el.querySelector(':scope>.ssn');
  if(!on||ss==='summer'){if(L)L.remove();return}if(L&&L.dataset.s===ss)return;if(L)L.remove();
  L=document.createElement('div');L.className='ssn ssn-'+ss;L.dataset.s=ss;L.setAttribute('aria-hidden','true');
  L.innerHTML=[...Array(12)].map((_,i)=>`<i style="left:${(i*37+11)%100}%;animation-delay:${-(i*1.37)%9}s;animation-duration:${7+(i*1.9)%6}s;--sz:${ss==='winter'?4+(i%3)*2:8+(i%3)*3}px;--dx:${(i%2?1:-1)*(20+i*3)}px"></i>`).join('');el.appendChild(L)})}
/* ---------- 내 여행 다시 보기 ---------- */
var RP=null;
function replay(key){if(RP)return;const T=tr(),K=kr(T),el=$(key==='kr'?'krMap':'tvMap'),svg=el.querySelector('svg');let segs=[],legs=[];
  if(key==='kr'){const seq=[K.home,...K.path].filter(id=>KRM[id]);if(seq.length<2)return toast('아직 다시 볼 여행이 없어요');segs=[seq.map(id=>kxy(KRM[id][3],KRM[id][4]))];legs=seq}
  else{const L=flightLog(T).filter(e=>NAT[e.f]&&NAT[e.t]);if(!L.length)return toast('아직 다시 볼 여행이 없어요');L.forEach(e=>{arcSegs([NAT[e.f][3],NAT[e.f][4]],[NAT[e.t][3],NAT[e.t][4]],1,30).forEach(s=>segs.push(s))});legs=[L[0].f,...L.map(e=>e.t)]}
  const pts=segs.flat(),full=key==='kr'?KFULL:WFULL,vb=segs.length>1&&key==='w'?full.slice():fitBox(pts,full,key==='kr'?60:200,1.2);svg.setAttribute('viewBox',vb.map(f2).join(' '));
  const u=pxPer(svg,vb),dyn=el.querySelector('.dyn'),btn=el.querySelector('.map-rp');if(btn)btn.textContent='■ 멈추기';
  // 선분별 길이를 미리 재 두고, 시간에 따라 이동 거리로 보간
  const S2=segs.map(sg=>{const cum=[0];for(let i=1;i<sg.length;i++)cum.push(cum[i-1]+Math.hypot(sg[i][0]-sg[i-1][0],sg[i][1]-sg[i-1][1]));return {sg,cum,len:cum[cum.length-1]}});
  const total=S2.reduce((a,x)=>a+x.len,0)||1,dur=Math.min(12000,3500+total/vb[2]*2500),t0=performance.now(),ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,ic=key==='kr'?TRAIN:PLANE,base=`<path class="trail" d="${segD(segs)}" style="stroke-opacity:.12"/>`;
  const draw=now=>{if(!RP)return;const p=Math.min(1,(now-t0)/dur);let rem=ease(p)*total,d='',cur=pts[0],prev=pts[0];
    for(const x of S2){if(rem<=0)break;const sg=x.sg;if(rem>=x.len){d+='M'+sg.map(q=>f2(q[0])+' '+f2(q[1])).join('L');cur=sg[sg.length-1];prev=sg[sg.length-2]||cur;rem-=x.len;continue}
      let i=1;while(i<sg.length&&x.cum[i]<rem)i++;const a=sg[i-1],b=sg[i],t=(rem-x.cum[i-1])/((x.cum[i]-x.cum[i-1])||1),q=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
      d+='M'+sg.slice(0,i).map(z=>f2(z[0])+' '+f2(z[1])).join('L')+'L'+f2(q[0])+' '+f2(q[1]);cur=q;prev=a;rem=0}
    const ang=key==='w'?Math.atan2(cur[1]-prev[1],cur[0]-prev[0])*180/Math.PI:0;
    dyn.innerHTML=`${base}<path class="route-on rp" d="${d}"/>${mapIcon(ic,cur[0],cur[1],20*u,ang)}<text x="${f2(vb[0]+10*u)}" y="${f2(vb[1]+22*u)}" font-size="${f2(13*u)}" class="rp-t">${Math.round(p*100)}%</text>`;
    if(p<1)RP.raf=requestAnimationFrame(draw);else setTimeout(()=>stopReplay(),900)};
  RP={key,raf:requestAnimationFrame(draw)}}
function stopReplay(){if(!RP)return;cancelAnimationFrame(RP.raf);const k=RP.key;RP=null;const el=$(k==='kr'?'krMap':'tvMap'),b=el&&el.querySelector('.map-rp');if(b)b.textContent='▶ 다시 보기';if(k==='kr')renderKrMap();else renderWorldMap()}
document.addEventListener('click',e=>{const b=e.target.closest('.map-rp');if(!b)return;if(RP)stopReplay();else replay(b.dataset.rp)});
/* ---------- 계절 한정 루트 ---------- */
ROUTES.push(
  {id:'sakura',w:'kr',season:[3,4,5],name:'봄 벚꽃 길',desc:'창원에서 서울까지 남쪽부터 차례로 피는 벚꽃을 따라',stops:['changwon','hadong','gurye','gyeongju','chungju','seoul']},
  {id:'summersea',w:'kr',season:[6,7,8],name:'여름 바다 일주',desc:'부산에서 태안까지 남해와 서해 해수욕장을 잇는 길',stops:['busan','geoje','namhae','yeosu','boryeong','taean']},
  {id:'maple',w:'kr',season:[9,10,11],name:'가을 단풍 길',desc:'속초에서 정읍까지 설악산부터 내장산까지 단풍을 따라',stops:['sokcho','inje','pyeongchang','danyang','mungyeong','jeongeup']},
  {id:'snowfl',w:'kr',season:[12,1,2],name:'겨울 눈꽃 길',desc:'평창에서 무주까지 눈 덮인 산골 마을을 잇는 길',stops:['pyeongchang','jeongseon','taebaek','yeongju','muju']},
  {id:'blossom',w:'w',season:[3,4],name:'봄 아시아 꽃길',desc:'서울에서 베이징까지 봄꽃이 피는 도시를 따라',stops:['KR','JP','TW','CN']},
  {id:'medi',w:'w',season:[6,7,8],name:'여름 지중해 크루즈',desc:'마드리드에서 니코시아까지 지중해를 건너',stops:['ES','FR','MC','IT','MT','GR','CY']},
  {id:'xmasmkt',w:'w',season:[11,12],name:'크리스마스 마켓',desc:'베를린에서 바르샤바까지 연말 장터를 돌며',stops:['DE','CZ','AT','HU','SK','PL']});
ROUTES.forEach(r=>{ROUTE[r.id]=r});
const inSeason=r=>!r.season||r.season.includes(new Date().getMonth()+1);
const seasonLbl=r=>{const s=r.season||[];return s.includes(3)&&s.includes(4)?'봄':s.includes(7)?'여름':s.includes(10)?'가을':s.includes(11)&&s.includes(12)&&s.length===2?'연말':'겨울'};
/* ---------- 업적 탭 추가 화면 ---------- */
function ppEditor(li){const T=tr(),P=T.pp||{};if(!ppEdit)return `<button class="secondary pp-ed" data-pped>표지 꾸미기</button>`;
  return `<div class="pp-edit"><div class="plabel">표지 색</div><div class="pp-sw">${PPCOL.map((c,i)=>`<button data-ppc="${i}" ${c[3]>li?'disabled':''} aria-pressed="${(P.col??-1)===i}" style="--c1:${c[1]};--c2:${c[2]}" title="${c[0]}${c[3]>li?' · '+LV[c[3]][0]+' 등급에서 열려요':''}"><span></span><small>${c[3]>li?LV[c[3]][0]:c[0]}</small></button>`).join('')}</div>
    <div class="plabel">문양</div><div class="pp-em">${PPEM.map((m,i)=>`<button data-ppe="${i}" ${m[2]>li?'disabled':''} aria-pressed="${(P.em||0)===i}">${m[1]()}<small>${m[2]>li?LV[m[2]][0]:m[0]}</small></button>`).join('')}</div>
    <div class="plabel">이름 새기기</div><input class="field" data-ppn maxlength="12" placeholder="표지에 새길 이름" value="${esc(P.name||'')}">
    <button class="primary" data-pped>완료</button></div>`}
document.addEventListener('click',e=>{const T=tr();const a=e.target.closest('[data-pped]');if(a){ppEdit=!ppEdit;renderAch();return}
  const c=e.target.closest('[data-ppc]');if(c&&!c.disabled){T.pp=Object.assign(T.pp||{},{col:+c.dataset.ppc});save();renderAch();return}
  const m=e.target.closest('[data-ppe]');if(m&&!m.disabled){T.pp=Object.assign(T.pp||{},{em:+m.dataset.ppe});save();renderAch();return}
  const g=e.target.closest('[data-cert]');if(g&&!g.disabled){showCert(g.dataset.cert);return}
  const v=e.target.closest('[data-certv]');if(v){showCert(v.dataset.certv);return}
  const p=e.target.closest('[data-pcv]');if(p)showCard(p.dataset.pcv)});
document.addEventListener('input',e=>{const n=e.target.closest('[data-ppn]');if(!n)return;const T=tr();T.pp=Object.assign(T.pp||{},{name:n.value.slice(0,12)});saveSoon();const cv=document.querySelector('#achPass .pp-cover small');if(cv)cv.textContent=n.value||'투어디 여권'});
function renderSouv(){const cs=completions(),grp=[['국내 지역','kr'],['세계 대륙','w'],['특별 루트','r']];
  $('achSouv').innerHTML=`<div class="panel-head"><h2>기념품 보드</h2><span class="note">완주하면 자석과 인증서를 받아요 · 누르면 인증서</span></div>`+grp.map(([t,k])=>{const L=cs.filter(c=>c.kind===k);
    return `<div class="fr-h"><b>${t}</b><span>${L.filter(c=>c.ok).length} / ${L.length}</span></div><div class="fridge">${L.map((c,i)=>`<button class="mag${c.ok?'':' lock'}" data-cert="${c.id}" ${c.ok?'':'disabled'} style="--k:${c.col};--r:${((i*7)%9)-4}deg" aria-label="${c.title}${c.ok?' 인증서 보기':' (미완주)'}"><span class="mag-art">${magnetArt(c)}</span><b>${c.name}</b></button>`).join('')}</div>`}).join('')}
function cardInfo(key){const T=tr(),K=kr(T),[w,id]=key.split(':');if(w==='kr'){const x=KRM[id];if(!x)return null;const d=(K.done.find(e=>e.c===id)||(K.sec||[]).find(e=>e.c===id)||{}).d;return {key,art:krArt(id),city:x[1],d}}
  const n=NAT[id];if(!n)return null;const d=(T.stamps.find(e=>e.c===id)||(T.sec||[]).find(e=>e.c===id)||{}).d;return {key,art:worldArt(id),city:n[2],d}}
function renderAlbum(){$('achCards').hidden=!EX().postcard;if(!EX().postcard)return;const T=tr(),ks=Object.keys(T.memo||{}).filter(k=>(T.memo[k]||'').trim()).map(cardInfo).filter(Boolean).sort((a,b)=>(a.d||'')<(b.d||'')?1:-1);
  $('achCards').innerHTML=`<div class="panel-head"><h2>엽서 앨범</h2><span class="note">${ks.length}장</span></div>`+(ks.length?`<div class="album">${ks.map(c=>`<button class="pcm" data-pcv="${c.key}"><span class="pcm-art">${c.art}</span><span class="pcm-r"><b>${c.city}</b><small>${c.d?ymd(pk(c.d)):''}</small><i>${esc(T.memo[c.key])}</i></span></button>`).join('')}</div>`:'<p class="note">도착 화면이나 도장을 눌러 엽서에 한마디를 남기면 여기에 모여요.</p>')}
function showCard(key){const c=cardInfo(key);if(!c)return;arrTimers.forEach(clearTimeout);arrOpen=true;const el=$('arrive');el.hidden=false;el.classList.add('show-msg');
  $('arrTk').innerHTML='';$('arrMsg').innerHTML=postcard(key,c.art,c.city,c.d?ymd(pk(c.d)):'');$('arrOk').textContent='닫기'}
(function(){const T=tr();if(!T.certSeen)T.certSeen=completions().filter(c=>c.ok).map(c=>c.id)})();

/* ---------- 공부가 끝나면 이번 공부로 얼마나 이동했는지 알림 ---------- */
var TW={on:false,m:0};
function travelWatch(){if(!S.travel||!tr().on)return;const run=!!S.running;
  if(run&&!TW.on){TW={on:true,m:totalMiles()};return}
  if(!run&&TW.on){TW.on=false;const g=totalMiles()-TW.m;if(g<1)return;const T=tr(),K=kr(T),av=totalMiles()-T.used;let msg=`이번 공부로 ${Math.floor(g)} 마일리지를 모았어요`;
    if(K.to&&KRM[K.to]&&!K.hold){const c=krTC(K),km=krKm(K.at,K.to);msg=`이번 공부로 ${KRM[K.to][1]} 방향 ${Math.min(Math.round(km),Math.round(g/c*km))}km 이동했어요`+(av<c?` · 도착까지 공부 ${studyFor(c-av)}`:'')}
    else if(T.to&&NAT[T.to]&&!T.hold){const c=wTC(T),km=kmBetween(T.at,T.to);msg=`이번 공부로 ${ap(T.to)} ${NAT[T.to][2]} 방향 ${Math.min(Math.round(km),Math.round(g/c*km)).toLocaleString()}km 이동했어요`+(av<c?` · 도착까지 공부 ${studyFor(c-av)}`:'')}
    setTimeout(()=>toast(msg),ARQ.length?4500:600)}}
/* ---------- D-day 종착역 이벤트 ---------- */
function ddArrive(){const d=S.dday;if(!d||!d.date||!TOPT().ddline||d.arrived===d.date||S.running)return;if(dk(today0())<d.date)return;
  d.arrived=d.date;const T=tr();(T.hid=T.hid||{}).terminus=T.hid.terminus||dk(today0());save();const pd=perDay(true),st=pk(d.start||Object.keys(pd).sort()[0]||dk(today0()));
  let tot=0;Object.entries(pd).forEach(([k,v])=>{if(pk(k)>=st)tot+=v.study});arrTimers.forEach(clearTimeout);arrOpen=true;const el=$('arrive');el.hidden=false;el.classList.add('show-msg');
  $('arrTk').innerHTML=`<div class="term"><div class="term-h">${TRAIN}<span>종착역</span></div><b>${esc(d.name||'D-day')}</b><small>${ymd(st)} 출발 · ${ymd(pk(d.date))} 도착</small></div>`;
  $('arrMsg').innerHTML=`<div class="bd-big">${hstamp('terminus',T.hid.terminus)}</div><b>종착역에 도착했어요!</b><span>출발부터 오늘까지 공부한 시간 <b>${fmtH(tot)}</b></span><span>여기까지 온 것만으로 충분히 잘했어요. 오늘 하루 응원할게요.</span>`;$('arrOk').textContent='고마워';ding()}
/* ---------- 히든 배지 설명 ---------- */
const HDESC={owl:'모두가 잠든 밤, 책상 불빛 아래서 도착한 여행자에게.',dawn:'첫차 시간에 맞춰 하루를 연 부지런한 여행자에게.',xmas:'크리스마스에도 여정을 멈추지 않은 여행자에게.',ny:'새해 첫날을 여행으로 시작한 여행자에게.',
  triple:'하루에 세 도시를 찍은 강행군 여행자에게.',equator:'북반구와 남반구의 경계를 넘은 여행자에게.',dateline:'하루를 건너뛰거나 다시 사는, 날짜변경선을 넘은 여행자에게.',home:'긴 여행 끝에 처음 출발한 곳으로 돌아온 여행자에게.',
  island:'동해 끝 울릉도까지 배를 타고 건너간 여행자에게.',far:'한 번에 지구 반대편까지 날아간 여행자에게.',north:'오로라가 보이는 북쪽 끝 도시에 닿은 여행자에게.',cont2:'하루 사이에 두 대륙을 밟은 여행자에게.',
  sleeper:'침대칸에서 잠들고 다른 나라에서 깨어난 여행자에게.',captain:'크루즈로 바다를 건넌 여행자에게.',gold3:'특별 루트를 세 개나 완주한 여행자에게.',terminus:'긴 공부 여정의 종착역까지 달려온 여행자에게.'};
function showBadge(id){const x=HIDX[id];if(!x)return;const T=tr(),d=(T.hid||{})[id];arrTimers.forEach(clearTimeout);arrOpen=true;const el=$('arrive');el.hidden=false;el.classList.add('show-msg');
  $('arrTk').innerHTML=`<div class="bd-big">${hstamp(id,d)}</div>`;
  $('arrMsg').innerHTML=d?`<b>${x[1]}</b><span class="bd-desc">${HDESC[id]||''}</span><div class="bd-cond"><small>획득 조건</small><b>${x[2]}</b></div><span>${ymd(pk(d))} 획득</span>`
    :`<b>숨겨진 도전 과제</b><span class="bd-desc">조건은 비밀이에요. 여행을 하다 보면 어느 날 갑자기 열려요.</span>`;$('arrOk').textContent='닫기';vibe()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-hid]');if(b)showBadge(b.dataset.hid)});
/* ---------- 보너스 마일리지 안내 ---------- */
function bonusCheck(){if(S.running||!S.travel)return;const L=bonusList(),seen=new Set(S.bonusSeen||[]);const fresh=L.filter(b=>!seen.has(b.k));
  const prevSeen=(S.bonusSeen||[]).join('|')+'#'+(S.passSeen||[]).join('|');S.bonusSeen=L.map(b=>b.k);
  const PK=passKeys(),ps=new Set(S.passSeen||[]),pf=[...new Map(PK.filter(x=>!ps.has(x.k)).map(x=>[x.p[0],x])).values()];S.passSeen=PK.map(x=>x.k);
  // 확인 목록이 그대로면 방금 끝난 저장을 한 번 더 하지 않는다
  if(!fresh.length&&!pf.length){if(S.bonusSeen.join('|')+'#'+S.passSeen.join('|')!==prevSeen)saveStoredSnapshot();return}
  saveStoredSnapshot();
  $('bonusBox').innerHTML=`<div class="ck-h"><span class="ck-k">${PLANE}${fresh.length?'보너스 마일리지':'연속 공부 정기권'}</span><b>${fresh.length?`+${fresh.reduce((a,b)=>a+b.m,0).toLocaleString()} 마일리지 적립!`:`${pf[pf.length-1].p[1]} 발급!`}</b></div>
    ${pf.length?`<div class="bn-pass">${pf.map(x=>{const i=PASSES.indexOf(x.p);return `<button class="pbw" data-pass="${i}">${pbadge(i,x.d,1)}<span><b>${esc(x.p[2])}</b><small>${esc(x.p[3])}</small></span></button>`}).join('')}</div>`:''}
    ${fresh.length?`<ul class="bn-l">${fresh.map(b=>`<li><span>${b.t}<small>${ymd(pk(b.d))}</small></span><b>+${b.m.toLocaleString()}</b></li>`).join('')}</ul>`:''}
    <div class="ck-a"><button class="primary" id="bonusOk">확인</button></div>`;$('bonusPop').hidden=false;vibe();if(tab==='travel')renderTravel()}
$('bonusPop').addEventListener('click',e=>{if(e.target===$('bonusPop')||e.target.closest('#bonusOk'))$('bonusPop').hidden=true});
if(!S.bonusSeen){S.bonusSeen=bonusList().map(b=>b.k)}
/* ---------- 설정: 마일리지에 대하여 ---------- */
function renderMilePage(){const L=bonusList(),pd=perDay(true),td=(pd[dk(today0())]||{study:0}).study,st=curStreak(),T=tr(),avail=totalMiles()-T.used,tot=L.reduce((a,b)=>a+b.m,0);
  $('mileBody').innerHTML=`<div class="ml-top"><div><small>보유 마일리지</small><b>${Math.floor(avail).toLocaleString()}</b></div><div><small>받은 보너스</small><b>${tot.toLocaleString()}</b></div><div><small>연속 공부</small><b>${st}일</b></div></div>
    <div class="plabel ml-sec">마일리지는 이렇게 쌓여요</div>
    <ul class="tv-rules"><li>공부 <b>6분이 1 마일리지</b>, 1시간이면 10 마일리지예요.</li><li>하루에 <b>최대 8시간(80 마일리지)</b>까지만 쌓여요.</li><li>앱을 쓰기 전 기록을 포함해 지금까지 공부한 모든 시간이 들어가요.</li></ul>
    <div class="plabel ml-sec">이렇게 써요</div>
    <ul class="tv-rules"><li>국내는 <b>1km에 1 마일리지</b>(한 구간 최소 30), 세계는 <b>이동 1분에 1 마일리지</b>예요.</li><li>좌석 등급을 올리면 <b>+30% · +60%</b> 더 들어요. 특별 루트는 자동으로 최상급이에요.</li><li>보유 마일리지가 운임보다 많으면 바로 도착하고, 모자라면 공부하는 만큼 다가가요.</li></ul>
    <div class="plabel ml-sec">보너스 마일리지</div>
    <div class="bn-rules"><div><b>+50</b><span>하루 8시간 공부</span><small>오늘 ${fmtH(td)} / 8시간</small><i style="--p:${Math.min(100,td/288e5*100)}%"></i></div>
      <div><b>+100</b><span>7일 연속 공부</span><small>${st%7}/7일째${st>=7?` · 지금까지 ${Math.floor(st/7)}번`:''}</small><i style="--p:${(st%7)/7*100}%"></i></div>
      <div><b>+1,000</b><span>30일 연속 공부</span><small>${st%30}/30일째</small><i style="--p:${(st%30)/30*100}%"></i></div></div>
    <p class="note">연속 공부는 하루에 1분 이상 공부한 날이 이어진 날수예요. 공부를 마치거나 기록을 직접 추가했을 때 조건을 채우면 알려 드려요.</p>
    ${L.length?`<div class="plabel">받은 보너스</div><ul class="bn-l">${L.slice().reverse().slice(0,20).map(b=>`<li><span>${b.t}<small>${ymd(pk(b.d))}</small></span><b>+${b.m.toLocaleString()}</b></li>`).join('')}</ul>`:''}`}

/* ---------- 연속 공부 정기권 ---------- */
// [일수, 정기권 이름, 업적 이름, 설명, 색1, 색2]
const PASSES=[
  [3,'3일권','작심삼일','작심삼일의 저주를 가볍게 컷. 이 기세면 어디든 갑니다.','#9aa3ad','#5f6872'],
  [7,'1주 정기권','월화수목금토일','주말도 쉬지 않고 7일 풀출석 완료.','#3b82f6','#1e40af'],
  [30,'한 달 정기권','30일 공부한 썰 푼다','상상만 하던 한 달 연속 공부를 진짜로 해냈습니다.','#e5e7eb','#8a949f'],
  [60,'60일 정기권','이제 습관이 됐습니다','습관이 되는 데 평균 66일이 걸린다는데, 한발 먼저 도착했어요. 이제 공부는 의지가 아니라 루틴이에요.','#a78bfa','#5b21b6'],
  [100,'100일 정기권','마늘과 쑥을 이겨낸 자','곰도 사람 되는 100일을 버텼습니다. 당신은 이제 금빛 찬란한 인간 승리의 표본입니다.','#f6dd8a','#a07c12'],
  [365,'1년 정기권','핵임 암튼 핵임','1년 365일 하루도 빠짐없이. 이건 그냥 전설입니다.','#3a3a3a','#000000']];
function studyRuns(pd){pd=pd||perDay(true);const rs=restSet(),days=Object.keys(pd).filter(k=>pd[k].study>=6e4).sort(),runs=[];let run=[];
  days.forEach(k=>{if(run.length&&!restLinked(run[run.length-1],k,rs)){runs.push(run);run=[]}run.push(k)});if(run.length)runs.push(run);return runs}
function passInfo(){const pd=perDay(true),runs=studyRuns(pd),first={};let best=0;
  runs.forEach(r=>{best=Math.max(best,r.length);PASSES.forEach(p=>{if(r.length>=p[0]){const d=r[p[0]-1];if(!first[p[0]]||d<first[p[0]])first[p[0]]=d}})});
  const last=runs[runs.length-1]||[],t=dk(today0()),y=dk(addD(today0(),-1)),lk=last[last.length-1],alive=last.length&&(lk===t||lk===y||(restSet().has(y)&&lk===dk(addD(today0(),-2))));
  return {runs,first,best,cur:alive?last.length:0,curStart:alive?last[0]:null,lastRun:last}}
const passTier=n=>{let i=-1;PASSES.forEach((p,k)=>{if(n>=p[0])i=k});return i};
function passKeys(){return studyRuns().flatMap(r=>PASSES.filter(p=>r.length>=p[0]).map(p=>({k:`p${p[0]}:${r[0]}`,p,d:r[p[0]-1]})))}
if(!S.passSeen)S.passSeen=passKeys().map(x=>x.k);
function pbadge(i,date,sm){const p=PASSES[i];return `<div class="pb${date?'':' lock'}${sm?' sm':''}" style="--a:${p[4]};--b:${p[5]}"><span class="pb-n">${p[0]}</span><small>${p[0]===365?'YEAR':'DAYS'}</small><i></i></div>`}
function showPass(i){const p=PASSES[i],d=passInfo().first[p[0]];arrTimers.forEach(clearTimeout);arrOpen=true;const el=$('arrive');el.hidden=false;el.classList.add('show-msg');
  $('arrTk').innerHTML=`<div class="bd-big">${pbadge(i,d)}</div>`;
  $('arrMsg').innerHTML=`<b>${esc(p[2])}</b><span class="bd-desc">${esc(p[3])}</span><div class="bd-cond"><small>획득 조건</small><b>${p[0]}일 연속 공부</b></div><span>${d?ymd(pk(d))+' 획득':'아직 받지 못했어요'}</span>`;$('arrOk').textContent='닫기';vibe()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-pass]');if(b)showPass(+b.dataset.pass)});
function renderPassCard(){const I=passInfo(),n=I.cur,ti=passTier(n),nx=PASSES[ti+1],p=ti>=0?PASSES[ti]:null,c1=p?p[4]:'#cbd2d9',c2=p?p[5]:'#8a949f';
  $('achPassCard').innerHTML=`<div class="panel-head"><h2>연속 공부 정기권</h2><span class="note">최고 기록 ${I.best}일</span></div>
    <div class="tcard${n?'':' off'}" style="--a:${c1};--b:${c2}"><div class="tc-top"><span>TOURY PASS</span><span>${n?'사용 중':'만료'}</span></div>
      <div class="tc-mid"><b>${n?(p?p[1]:'연속 '+n+'일'):'정기권 없음'}</b><span class="tc-chip"></span></div>
      <div class="tc-bot"><div><small>연속</small><b>${n}일</b></div><div><small>시작</small><b>${I.curStart?ymd(pk(I.curStart)):'-'}</b></div><div><small>다음</small><b>${nx?`${nx[1]}까지 ${nx[0]-n}일`:'최고 등급'}</b></div></div></div>
    <p class="note">${n?'오늘도 1분 이상 공부하면 정기권이 하루 더 연장돼요.':`하루라도 쉬면 정기권이 만료돼요. ${I.lastRun.length?`지난 정기권은 ${I.lastRun.length}일 기록으로 끝났어요. `:''}오늘 공부하면 새 정기권이 시작돼요.`}</p>
    <div class="pbs">${PASSES.map((q,i)=>`<button class="pbw" data-pass="${i}" aria-label="${esc(q[2])} 설명 보기">${pbadge(i,I.first[q[0]])}<b>${I.first[q[0]]?esc(q[2]):q[1]}</b></button>`).join('')}</div>`}

function tvTest(e){const T=tr(),a=e.target.closest('[data-add]');
  if(a){T.used-=+a.dataset.add;save();if(checkArrival())ding();renderTravel();return true}
  if(e.target.closest('#tvSkip')&&T.to){T.used-=Math.max(0,wTC(T)-(totalMiles()-T.used));save();if(checkArrival())ding();renderTravel();return true}
  if(e.target.closest('#tvReset')){S.travel={on:true,at:'KR',to:null,used:0,km:0,stamps:[],news:[]};save();renderTravel();return true}
  return false}
$('tvNow').addEventListener('click',e=>{if(TRAVEL_TEST)tvTest(e)});
$('tvFlight').addEventListener('click',e=>{const T=tr();if(TRAVEL_TEST&&tvTest(e))return;
  if(e.target.closest('#tvChange')){tvPick=!tvPick;renderTravelTop();if(tvPick)renderTravelPicker()}
  if(e.target.closest('#tvCancel')){if(tvArm){T.to=null;T.final=null;stopRoute('w');tvArm=false;tvPick=false;save()}else tvArm=true;renderTravel()}});
$('tvConts').addEventListener('click',e=>{const b=e.target.closest('[data-cont]');if(b){tvCont=+b.dataset.cont;renderTravelPicker()}});
bindSearchInput($('tvSearch'),value=>{tvQuery=value;renderTravelPicker()});
$('tvList').addEventListener('click',e=>{const b=e.target.closest('[data-dest]');if(!b)return;const T=tr();
  stopRoute('w');T.to=b.dataset.dest;T.final=null;T.cls=0;T.goal=null;if(TOPT().via){const v=pickViaW(T.at,T.to);if(v){T.final=T.to;T.to=v}}sp(T).to=null;kr(T).to=null;tvPick=false;tvArm=false;save();
  T.hold=true;save();renderTravel();openCheckin('w')});
function syncTravelTab(){const on=tr().on;$('tabTravel').hidden=!on;if(!on&&tab==='travel')setTab('home');window.TourdyNative?.navigationChanged?.()}
