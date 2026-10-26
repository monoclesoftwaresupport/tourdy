/* ---------- 첫 실행 튜토리얼: 환영 → 기능 소개(홈·할 일·대시보드) → 마일리지 → 티켓·업적 → 좌석 등급 → 첫 30분 선물 ---------- */
const TOUR_ART={
  hello:`<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 38c14-6 26-6 38 4 12-10 24-10 38-4v54c-14-6-26-6-38 4-12-10-24-10-38-4z"/><path d="M60 42v54"/><path d="m70 26 26-10-6 14 10 6-28 2" stroke-width="2.6"/><path d="M58 30c3-6 7-10 12-12" stroke-dasharray="2 6"/></svg>`,
  mile:`<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="30" cy="88" r="8"/><path d="M38 86c20-4 18-26 38-30 10-2 16 2 22-4" stroke-dasharray="5 7"/><path d="M90 20c-9 0-16 7-16 16 0 12 16 26 16 26s16-14 16-26c0-9-7-16-16-16z"/><circle cx="90" cy="36" r="5"/></svg>`,
  stamp:`<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="30" width="62" height="40" rx="6"/><path d="M60 30v40" stroke-dasharray="3 5"/><path d="M26 44h22M26 54h14"/><circle cx="82" cy="78" r="22" stroke-dasharray="1 0"/><circle cx="82" cy="78" r="16" stroke-width="2"/><path d="m74 78 6 6 10-12"/></svg>`,
  timer:`<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="66" r="34"/><path d="M60 46v20l14 9M50 22h20M60 22v10M88 38l6-6"/><path d="M53 66l0 0" stroke-width="5"/></svg>`,
  todo:`<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="18" width="72" height="88" rx="10"/><path d="m36 44 6 6 10-12M60 44h24M36 68l6 6 10-12M60 68h24M38 90h8M60 90h24"/></svg>`,
  chart:`<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 100h84"/><rect x="26" y="62" width="14" height="30" rx="3"/><rect x="48" y="40" width="14" height="52" rx="3"/><rect x="70" y="52" width="14" height="40" rx="3"/><path d="M26 34l22-12 22 10 26-14" stroke-width="2.6"/></svg>`,
  gift:`<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="48" width="76" height="52" rx="6"/><path d="M16 36h88v14H16zM60 36v64"/><path d="M60 36c-8-14-26-16-26-4 0 6 12 6 26 4zM60 36c8-14 26-16 26-4 0 6-12 6-26 4z"/></svg>`
};
const TOUR_TICKET=(cls,name,extra)=>`<div class="tour-tk ${cls}"><span>${name}</span><b>서울 → 부산</b><small>${extra}</small></div>`;
const TOUR_STEPS=[
  {k:'환영해요',art:'hello',h:'투어디에 오신 걸 환영해요',
   p:'투어디는 공부한 시간이 여행이 되는 플래너예요. 먼저 어떤 기능이 있는지 짧게 보여 드릴게요.',
   list:['<b>홈</b> · 과목별 타이머로 공부 시간 기록','<b>할 일</b> · 오늘 할 일과 반복 할 일 관리','<b>대시보드</b> · 공부 시간 통계와 잔디','<b>여행</b> · 공부한 만큼 떠나는 여행']},
  {k:'홈',art:'timer',h:'과목을 골라 공부 시간을 기록해요',
   p:'홈에서 과목을 누르면 타이머가 시작돼요. 기록은 과목별 색으로 하루 타임라인에 쌓여요.',
   list:['<b>타이머형</b>은 바로 시작, <b>예약형</b>은 시작 시각과 공부 시간을 정해 두는 방식','공부 중에 <b>휴식·딴짓</b>도 따로 기록해 순공 시간을 구분해요','과목의 색과 아이콘은 <b>프리셋 목록</b>에서 정해요']},
  {k:'할 일',art:'todo',h:'오늘 할 일을 가볍게 정리해요',
   p:'할 일 탭에서 하루 계획을 세우고, 끝낸 일은 체크해서 지워요.',
   list:['요일마다 자동으로 들어가는 <b>반복 할 일</b>','시험까지 남은 날을 세는 <b>D-day</b>','설정 → 추가 기능에서 <b>계획 vs 실제</b>, <b>교재 진도</b> 같은 기능도 켤 수 있어요']},
  {k:'대시보드',art:'chart',h:'얼마나 공부했는지 한눈에 봐요',
   p:'오늘·일주일·한 달·1년 단위로 공부 시간을 모아서 보여 줘요.',
   list:['<b>날짜별 공부 시간</b>과 <b>과목 비율</b>','매일의 공부량을 색으로 보여 주는 <b>공부 잔디</b>','집중 효율, 최고 기록, 공부 메모도 모아 볼 수 있어요']},
  {k:'마일리지',art:'mile',h:'공부 시간이 마일리지가 돼요',
   p:'타이머로 공부하면 마일리지가 쌓이고, 그 마일리지로 여행을 떠나요.',
   list:['공부 <b>6분 = 1 마일리지</b>, 1시간이면 10 마일리지','하루 최대 <b>8시간(80 마일리지)</b>까지 적립','국내 161개 시·군을 모두 돌면 세계 여행이 열려요']},
  {k:'티켓과 업적',art:'stamp',h:'도착하면 도장을 받아요',
   p:'목적지를 고르면 탑승권이 발권돼요. 마일리지가 운임만큼 모이면 도착하고, 티켓을 찢어 여권에 도장을 찍어요.',
   list:['도장을 모으면 <b>여권 등급</b>이 올라가요 (일반 → 브론즈 → 실버 → 골드 → 블랙)','매일 이어서 공부하면 <b>연속 공부 정기권</b>을 받아요','지역을 완주하면 <b>기념품 보드</b>에 자석과 인증서가 붙어요']},
  {k:'좌석 등급',art:null,h:'마일리지를 더 내면 티켓 색이 바뀌어요',
   p:'같은 구간도 좌석 등급을 올리면 마일리지가 더 드는 대신, 특별한 색의 티켓과 도장을 받아요.',
   tickets:true},
  {k:'첫 여행 선물',art:'gift',h:'첫 30분이면 최고급 티켓 1장',
   p:'누적 공부 30분을 채우고 세션을 끝내면 <b>무료 금색 티켓</b>을 드려요.',
   list:['출발지와 목적지를 국내 어디든 원하는 대로 골라요','마일리지는 하나도 쓰지 않고 <b>즉시 도착</b>해요','중간에 멈추거나 과목을 바꿔도 시간은 합산돼요'],
   note:'여행 기능이 마음에 들지 않으면 <b>설정 → 여행</b>에서 언제든 끌 수 있어요. 끄면 여행 탭이 사라지고 공부 기록과 할 일만 쓸 수 있어요. 다시 켜면 그동안 공부한 시간도 그대로 마일리지가 돼요.'}
];
let tourStep=0,tourAnimations=[];
const tourBackground=new Map();let tourScroll=0;
function lockTourBackground(lock){
  const d=$('tourDialog');
  if(lock){
    // Keep the dialog outside .wrap so inert never disables the tutorial itself.
    document.body.appendChild(d);tourScroll=window.scrollY;
    for(const el of document.body.children){if(el===d||el.tagName==='SCRIPT')continue;tourBackground.set(el,el.inert);el.inert=true;}
    document.body.classList.add('tour-active');
  }else{
    for(const [el,was] of tourBackground)el.inert=was;
    tourBackground.clear();document.body.classList.remove('tour-active');window.scrollTo(0,tourScroll);
  }
  window.TourdyNative?.navigationChanged?.();
}
function changeTourStep(delta){
  const next=tourStep+delta;
  if(next<0||next>=TOUR_STEPS.length||!$('tourDialog').open)return;
  // Content and controls update immediately. Animation completion never gates input.
  tourAnimations.forEach(a=>a.cancel());tourAnimations=[];
  tourStep=next;renderTour();
  const card=$('tourCard');
  if(!card.animate||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  try{
    // A single 2D layer avoids five independently composited 3D animations on iOS.
    tourAnimations=[card.animate([
      {opacity:.55,transform:`translateX(${delta*18}px)`},
      {opacity:1,transform:'translateX(0)'}
    ],{duration:180,easing:'ease-out'})];
  }catch(e){/* The content is already usable when animations are unavailable. */}
}

function tourShouldShow(){
  if(S.tutorial)return false;
  // 이미 공부 기록이 있는 기존 사용자는 자동으로 띄우지 않는다(설정에서 다시 볼 수 있음).
  return !S.sessions.some(x=>!x.ex)&&!S.running;
}
function renderTour(){
  const s=TOUR_STEPS[tourStep],last=tourStep===TOUR_STEPS.length-1;
  $('tourKicker').textContent=`${tourStep+1} / ${TOUR_STEPS.length} · ${s.k}`;
  $('tourArt').innerHTML=s.tickets
    ?`<div class="tour-tks">${TOUR_TICKET('','일반','기본 운임')}${TOUR_TICKET('silver','은색 표','+30%')}${TOUR_TICKET('gold','금색 표','+60%')}</div>`
    :`<div class="tour-ico">${TOUR_ART[s.art]}</div>`;
  $('tourTitle').textContent=s.h;
  $('tourText').innerHTML=s.p;
  $('tourList').innerHTML=(s.tickets
    ?['국내: 특실·우등·1등실을 고르면 <b>금색 표</b> (+30%)','세계: 등급에 따라 <b>은색 표</b>(+30%) · <b>금색 표</b>(+60%)','특별 루트는 자동으로 최상급이에요']
    :(s.list||[])).map(x=>`<li>${x}</li>`).join('');
  $('tourList').hidden=!s.list&&!s.tickets;
  $('tourNote').innerHTML=s.note||'';$('tourNote').hidden=!s.note;
  $('tourDots').innerHTML=TOUR_STEPS.map((_,i)=>`<i class="${i===tourStep?'on':''}"></i>`).join('');
  $('tourBack').hidden=tourStep===0;
  $('tourSkip').hidden=last;
  $('tourNext').textContent=last?(liveSubs().length?'공부 시작하기':'과목 고르러 가기'):'다음';
}
function openTour(){
  tourStep=0;renderTour();
  const d=$('tourDialog');if(!d.open){lockTourBackground(true);d.showModal();}
}
function closeTour(){
  const d=$('tourDialog');tourAnimations.forEach(a=>a.cancel());if(d.open)d.close();lockTourBackground(false);
  if(!S.tutorial){S.tutorial=1;save();if(typeof askNotifyFirstRun==='function')askNotifyFirstRun()}
  renderPresetHint();
}
$('tourNext').onclick=()=>{
  if(tourStep<TOUR_STEPS.length-1){changeTourStep(1);return}
  closeTour();setTab('home');setHome('run');renderPresetHint();window.scrollTo({top:0,behavior:'smooth'});
};
$('tourBack').onclick=()=>changeTourStep(-1);
$('tourSkip').onclick=closeTour;
$('tourDialog').addEventListener('cancel',e=>{e.preventDefault();closeTour()});
// 좌우로 밀어서 넘기기
// Capture outside events too: native and older WebViews must not pass them to home.
for(const type of ['click','pointerdown','touchstart','touchmove','wheel','keydown'])document.addEventListener(type,e=>{
  const d=$('tourDialog');if(!d.open||d.contains(e.target))return;
  e.preventDefault();e.stopImmediatePropagation();
},{capture:true,passive:false});
(()=>{let x0=null,y0=null;const d=$('tourDialog');
  d.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  d.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
    if(Math.abs(dx)<50||Math.abs(dy)>Math.abs(dx))return;changeTourStep(dx<0?1:-1)},{passive:true});
})();
$('tourReplay').onclick=openTour;
if(tourShouldShow())openTour();

/* ---------- 튜토리얼 뒤 홈 안내: 과목(프리셋)이 있어야 타이머로 기록할 수 있어요 ---------- */
function renderPresetHint(){
  renderModeHint();
  const el=$('presetHint');if(!el)return;
  el.hidden=!(S.tutorial&&!liveSubs().length&&homeTab==='run');
}
$('presetHintGo').onclick=()=>setHome('preset');
/* 타이머 형식 안내: 튜토리얼을 본 사용자에게 한 번. 설정으로 가거나 '알겠어요'를 누르면 다시 안 나와요 */
function renderModeHint(){
  const el=$('modeHint');if(!el)return;
  el.hidden=!(S.tutorial&&!S.modeHintSeen&&homeTab==='run');if(el.hidden)return;
  $('modeHintText').textContent=homeMode==='plan'
    ?'지금은 예약형이에요. 과목을 누르면 바로 재는 타이머형으로 바꾸려면 설정 → 테마 → 공부 시작 방식에서 고르세요.'
    :'지금은 과목을 누르면 바로 재는 타이머형이에요. 시작 시각과 공부 시간을 5분 단위로 미리 정해 두는 예약형도 있어요. 설정 → 테마 → 공부 시작 방식에서 바꿀 수 있어요.';
}
function closeModeHint(){S.modeHintSeen=1;save();renderModeHint()}
$('modeHintClose').onclick=closeModeHint;
$('modeHintGo').onclick=()=>{closeModeHint();setTab('set');setPage='theme';renderSet();requestAnimationFrame(()=>$('modeSeg').scrollIntoView({block:'center',behavior:'smooth'}))};
{const base=setHome;setHome=h=>{base(h);renderPresetHint()}}
{const base=renderSubs;renderSubs=(...a)=>{const r=base(...a);renderPresetHint();return r}}
renderPresetHint();
