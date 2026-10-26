/* ---------- settings ---------- */
/* ---------- 설정 목록 ---------- */
let setPage=null;
const GOALS=[0];for(let m=30;m<=720;m+=30)GOALS.push(m);
const goalLbl=m=>m?fmtH(m*6e4):'없음';
const SET_ITEMS=[
  ['account','계정',()=>window.TourdyAccount?TourdyAccount.label():'로그인 안 됨'],
  ['invite','친구 초대',()=>window.TourdyInvite?TourdyInvite.label():''],
  ['goal','목표 시간',()=>goalLbl(S.goal||0)],
  ['notify','알림',()=>NF().sound?'켜짐':'꺼짐'],
  ['extra','추가 기능',()=>{const n=Object.values(EX()).filter(Boolean).length;return n?`${n}개 켜짐`:'꺼짐'}],
  ['sound','소리',()=>{const v=TSND();return v.arrive||v.rip?'켜짐':'꺼짐'}],
  ['travel','여행',()=>tr().on?'켜짐':'꺼짐'],
  ['mile','마일리지',()=>`보유 ${Math.floor(totalMiles()-tr().used).toLocaleString()}`],
  ['pip','PIP 모드',()=>document.pictureInPictureElement?'켜짐':'꺼짐'],
  ['theme','테마',()=>`${({system:'시스템',light:'라이트',dark:'다크'})[th().mode]} · ${ACC[th().accent]?.[0]||'파랑'}`],
  ['daystart','하루의 시작',()=>DS?`${ampm(new Date(2000,0,1,DS).getTime())}`:'자정'],
  ['week','한 주의 시작',()=>DOW[wkStart()]+'요일'],
  ['dday','D-day',()=>S.dday?`${S.dday.name||'D-day'} · ${S.dday.date.slice(5).replace('-','/')}`:'없음'],
  ['rep','반복 할 일',()=>S.repeats.length?`${S.repeats.length}개`:'없음'],
  ['backup','백업',()=>''],
  ['ex','예시 데이터',()=>'지우기'],
];
const CHEV_R='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 3 5 5-5 5"/></svg>';
function renderSet(){
  const ex=hasEx();
  // PIP는 PC·맥에서만. 아이폰·아이패드·안드로이드(앱·브라우저 모두)에서는 숨긴다.
  // 아이패드 사파리는 맥처럼 보고하므로 터치 지점 수로 구분한다
  const pipAllowed=()=>!window.TourdyNative&&!/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)&&!(/Mac/.test(navigator.platform)&&navigator.maxTouchPoints>1);
  const IT=Object.fromEntries(SET_ITEMS.map(x=>[x[0],x])),GR=[['타이머 설정',['goal','notify','extra','theme','pip','daystart','week','dday','rep']],['여행 설정',['travel','sound','mile']],['계정',['account','invite']],['기타',['backup','ex']]];
  $('setItems').innerHTML=GR.map(([g,ks])=>{const rows=ks.filter(k=>IT[k]&&(k!=='ex'||ex)&&(k!=='pip'||pipAllowed())).map(k=>{const [,t,v]=IT[k];return `<li><button data-go="${k}"><span class="sl-t">${t}</span><span class="sl-v">${esc(v())}</span>${CHEV_R}</button></li>`}).join('');
    return rows?`<li class="sl-g">${g}</li>${rows}`:''}).join('');
  $('setList').hidden=!!setPage;$('setBack').hidden=!setPage;
  document.querySelectorAll('#vSet [data-page]').forEach(el=>el.hidden=el.dataset.page!==setPage);
  if(setPage==='backup'&&window.TourdyNative)$('bkNote').textContent='기록은 이 기기의 앱 안에 저장돼요. 앱을 지우면 기록도 함께 사라지니, 앱을 지우거나 기기를 바꾸기 전에 꼭 백업해 두세요.';
  if(setPage==='account'&&window.TourdyAccount)TourdyAccount.render();
  if(setPage==='goal')renderGoal();
  if(setPage==='theme')renderTheme();
  if(setPage==='notify'||setPage==='extra')document.querySelectorAll('[data-sw]').forEach(b=>{const [g,k]=b.dataset.sw.split('.');b.setAttribute('aria-checked',!!(g==='notify'?NF():EX())[k])});
  if(setPage==='notify'){
    refreshPushWarn();
    $('pushNote').textContent=window.TourdyNative?'앱을 닫아도 예약한 시작·종료 시각에 알려줘요':!('Notification' in window)?'이 기기·화면에서는 쓸 수 없어요':Notification.permission==='denied'?'브라우저에서 알림이 막혀 있어요':'다른 창을 보고 있을 때도 알려 줘요';
    if(window.TourdyNative)document.querySelector('[data-sw="notify.push"] .sw-t').firstChild.textContent='기기 알림';
  }
  if(setPage==='mile')renderMilePage();
  if(setPage==='invite'&&window.TourdyInvite)TourdyInvite.render();
  if(setPage==='sound')document.querySelectorAll('[data-snd]').forEach(b=>b.setAttribute('aria-checked',!!TSND()[b.dataset.snd]));
  if(setPage==='travel'){const o=TOPT();document.querySelectorAll('[data-topt]').forEach(b=>b.setAttribute('aria-checked',!!o[b.dataset.topt]));$('mapTheme').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mt===o.map));$('tvSwitch').setAttribute('aria-checked',tr().on);$('tvStyle').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sty===(tr().style||'stamp')))}
  if(setPage==='daystart'){const H=[0,1,2,3,4,5,6,7,8];
    buildWheel($('wDay'),H.map(h=>h?`${ampm(new Date(2000,0,1,h).getTime())} 부터`:'자정 (오전 12:00) 부터'),Math.max(0,H.indexOf(DS)),i=>{S.dayStart=H[i];DS=H[i];save();view=today0();todoDay=today0();lastDay=dk(today0());dayNote();renderAll()});dayNote()}
  if(setPage==='week')$('weekSeg').innerHTML=[1,2,3,4,5,6,0].map(d=>`<button data-wd="${d}" aria-pressed="${d===wkStart()}">${DOW[d]}</button>`).join('');
  if(setPage==='rep')renderReps();
  if(setPage==='dday'&&S.dday){$('ddName').value=S.dday.name;$('ddDate').value=S.dday.date}
}
function dayNote(){$('dayNote').textContent=DS?`새벽 ${DS}시 전까지 공부한 시간은 전날 기록으로 쳐요. 할 일의 '오늘', 분석, 공부 잔디, 타임라인이 모두 이 기준을 따라요.`:'자정을 기준으로 날짜가 바뀌어요. 밤샘 공부를 전날로 치고 싶으면 새벽 시각을 골라 보세요.'}
function openSet(k){setPage=k;armed=null;renderSet();window.scrollTo({top:0})}
$('setItems').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)openSet(b.dataset.go)});
$('setBack').onclick=()=>openSet(null);
document.querySelectorAll('[data-sw]').forEach(b=>b.addEventListener('click',async()=>{
  const [g,k]=b.dataset.sw.split('.'),cur=(g==='notify'?NF():EX()),v=!cur[k];
  if(g==='notify'&&k==='push'&&v){try{
    const r=await requestPushPermission();
    if(r==='unsupported')throw 0;
    if(r!=='granted'){pushBlocked=true;renderSet();return}   // 막혀 있으면 '설정 열기' 안내를 보여 준다
  }catch(e){toast('알림을 켜지 못했어요. 기기 설정을 확인해 주세요.');renderSet();return}}
  if(g==='notify')S.notify=Object.assign(NF(),{[k]:v});else S.extra=Object.assign(EX(),{[k]:v});save();renderSet();renderExtras();renderTasks()}));
$('testSound').onclick=()=>{audio();tone(SND.end);toast('알림음이 이렇게 울려요')};
$('tvStyle').addEventListener('click',e=>{const b=e.target.closest('[data-sty]');if(!b)return;tr().style=b.dataset.sty;save();renderSet()});
let mileArm=false;$('tvMileReset').onclick=()=>{const b=$('tvMileReset');if(!mileArm){mileArm=true;b.classList.add('del','arm');b.textContent='정말 0으로 만들까요? (되돌릴 수 없어요)';return}
  const T=tr();T.used=totalMiles();save();mileArm=false;b.classList.remove('del','arm');b.textContent='보유 마일리지를 0으로 만들었어요';};
document.querySelectorAll('[data-snd]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.snd;S.snd=Object.assign(TSND(),{[k]:!TSND()[k]});save();renderSet()}));
document.querySelectorAll('[data-sndt]').forEach(b=>b.addEventListener('click',()=>{audio();const k=b.dataset.sndt;if(k==='rip'){const v=TSND().rip;S.snd=Object.assign(TSND(),{rip:true});ripSound();S.snd.rip=v}else{const v=TSND().arrive;S.snd=Object.assign(TSND(),{arrive:true});arrSound(k);S.snd.arrive=v}}));
document.querySelectorAll('[data-topt]').forEach(b=>b.addEventListener('click',()=>{const o=TOPT(),k=b.dataset.topt;o[k]=!o[k];save();applyNeon();renderSet()}));
$('mapTheme').addEventListener('click',e=>{const b=e.target.closest('[data-mt]');if(!b)return;TOPT().map=b.dataset.mt;save();renderSet()});
$('tvSwitch').onclick=()=>{const T=tr();T.on=!T.on;save();$('tvSwitch').setAttribute('aria-checked',T.on);syncTravelTab()};
const wkStart=()=>Number.isInteger(S.weekStart)?S.weekStart:1;
$('weekSeg').addEventListener('click',e=>{const b=e.target.closest('[data-wd]');if(!b)return;S.weekStart=+b.dataset.wd;save();renderSet()});
/* ---------- 테마 ---------- */
const ACC={ // 라이트·다크 모두 같은 색
  blue:['파랑','#3182f6'],
  orange:['주황','#f26a2e'],
  red:['빨강','#f03a3a'],
  yellow:['노랑','#f5b700'],
  lime:['라임','#8cc81e'],
  green:['초록','#16b85e'],
  teal:['청록','#00b5a5'],
  sky:['하늘','#14a8f2'],
  indigo:['남색','#4c45f0'],
  purple:['보라','#8f5cff'],
  magenta:['마젠타','#e626b9'],
  pink:['분홍','#ff7fbf'],
  brown:['갈색','#b8722f'],
};
const th=()=>{const t=Object.assign({mode:'system',accent:'blue'},S.theme||{});if(!ACC[t.accent])t.accent='blue';return t};
const themeIconFolder=accent=>accent==='indigo'?'navy':Object.prototype.hasOwnProperty.call(ACC,accent)?accent:'blue';
function applyTheme(){
  const t=th(),r=document.documentElement,c=ACC[t.accent][1];
  if(t.mode==='system')delete r.dataset.theme;else r.dataset.theme=t.mode;
  let el=document.getElementById('accentStyle');if(!el){el=document.createElement('style');el.id='accentStyle'}
  document.body.appendChild(el); // 본문 스타일보다 뒤에 두어야 덮어씀
  const v=`--accent:${c};--accent-soft:color-mix(in srgb,${c} 16%,var(--bg))`;
  el.textContent=`:root:root{${v}}@media (prefers-color-scheme:dark){:root:root:not([data-theme="light"]){${v}}}:root:root[data-theme="dark"]{${v}}`;
  const favicon=document.querySelector('link[rel="icon"]');
  if(favicon)favicon.setAttribute('href','icons/'+themeIconFolder(t.accent)+'/icon-32.png');
}
function renderTheme(){
  const t=th();
  $('themeIconPreview').src='icons/'+themeIconFolder(t.accent)+'/icon-192.png';
  $('themeMode').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===t.mode));
  $('accentList').innerHTML=Object.entries(ACC).map(([k,v])=>`<button class="acc" data-acc="${k}" aria-pressed="${k===t.accent}" aria-label="${v[0]}"><span class="sw2" style="--a:${v[1]}"><svg class="tick" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m2.5 6.2 2.4 2.4 4.6-5"/></svg></span><span class="an">${v[0]}</span></button>`).join('');
}
$('themeMode').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(!b)return;S.theme=Object.assign(th(),{mode:b.dataset.mode});save();applyTheme();renderTheme()});
$('accentList').addEventListener('click',async e=>{const b=e.target.closest('[data-acc]');if(!b||!ACC[b.dataset.acc])return;
  const accent=b.dataset.acc;S.theme=Object.assign(th(),{accent});
  const stored=save();applyTheme();renderTheme();
  if((await stored)===false)return;
  if(window.TourdyNative?.setAppIcon)try{await window.TourdyNative.setAppIcon(accent)}
  catch(error){toast(error.code==='ICON_UNSUPPORTED'?'이 기기에서는 앱 아이콘 변경을 지원하지 않아요.':'테마 색은 적용했지만 앱 아이콘을 바꾸지 못했어요. 잠시 후 색을 다시 선택해 주세요.')}
});
applyTheme();

const HEAT_DEF=[0,180,360];
const heatT=()=>Array.isArray(S.heat)&&S.heat.length===3?S.heat:HEAT_DEF;
function heatLv(min){const [a,b,c]=heatT();if(min<Math.max(1,a))return '';return min>=c?'l3':min>=b?'l2':'l1'}
const hLbl=m=>m?fmtH(m*6e4):'1분';
function heatLegend(){const [a,b,c]=heatT();
  return `<span><i></i>없음</span><span><i class="l1"></i>${a?hLbl(a)+'↑':'조금이라도'}</span><span><i class="l2"></i>${hLbl(b)}↑</span><span><i class="l3"></i>${hLbl(c)}↑</span>`}
function renderHeatSteps(){
  const t=heatT(),names=['연한 색','기본 색','진한 색'];
  $('hsteps').innerHTML=`<li class="hstep"><i></i><span class="hn">색 없음</span><span class="hv">${t[0]?hLbl(t[0])+' 미만':'공부 안 한 날'}</span><span style="width:76px"></span></li>`+
    t.map((m,i)=>{const lo=i?t[i-1]+30:0,hi=i<2?t[i+1]-30:720;
      return `<li class="hstep"><i class="l${i+1}"></i><span class="hn">${names[i]}</span><span class="hv">${i===0&&!m?'조금이라도':hLbl(m)+' 이상'}</span>
        <button class="dbtn" data-h="${i}" data-d="-30" ${m<=lo?'disabled':''} aria-label="${names[i]} 기준 30분 줄이기">−</button><button class="dbtn" data-h="${i}" data-d="30" ${m>=hi?'disabled':''} aria-label="${names[i]} 기준 30분 늘리기">+</button></li>`}).join('');
}
$('hsteps').addEventListener('click',e=>{const b=e.target.closest('[data-h]');if(!b||b.disabled)return;
  const t=heatT().slice(),i=+b.dataset.h;t[i]+=+b.dataset.d;S.heat=t;save();renderHeatSteps()});

function renderGoal(){
  const g=S.goal||0;
  buildWheel($('wGoal'),GOALS.map(m=>m?`하루 ${goalLbl(m)}`:'목표 없음'),Math.max(0,GOALS.indexOf(g)),i=>{S.goal=GOALS[i];save();goalNote();tick()});
  goalNote();renderHeatSteps();
}
function goalNote(){$('goalNote').textContent=S.goal?`홈 화면에 오늘 ${goalLbl(S.goal)} 중 얼마나 채웠는지 표시돼요.`:'목표를 정하면 홈 화면에 오늘 달성률이 표시돼요.'}

function renderReps(){
  $('reps').innerHTML=S.repeats.map(r=>{const s=r.sid&&subj(r.sid);
    const days=r.days.length===7?'매일':r.days.slice().sort().map(d=>DOW[d]).join('·');
    return `<li data-id="${r.id}"><span class="rtx">${esc(r.text)}</span><span class="rmeta">${days}${s?' · '+esc(s.name):''}${/\{n\}/.test(r.text)?` · 오늘 ${repText(r,today0())}`:''}</span>
      <button class="del${armed===r.id?' arm':''}" data-rep="del">${armed===r.id?'삭제 확인':'삭제'}</button></li>`}).join('')||'<li class="empty" style="border:0">반복 할 일이 없어요</li>';
  $('repDays').innerHTML=[1,2,3,4,5,6,0].map(d=>`<button type="button" data-d="${d}" aria-pressed="${repDays.includes(d)}">${DOW[d]}</button>`).join('');
}
$('reps').addEventListener('click',e=>{const b=e.target.closest('[data-rep]');if(!b)return;const id=b.closest('li').dataset.id;
  if(armed===id){S.repeats=S.repeats.filter(r=>r.id!==id);armed=null;save()}else armed=id;renderReps()});
$('repDays').addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;const d=+b.dataset.d;
  repDays=repDays.includes(d)?repDays.filter(x=>x!==d):[...repDays,d];renderReps()});
$('repForm').addEventListener('submit',e=>{e.preventDefault();const t=$('repText').value.trim();if(!t||!repDays.length)return;
  S.repeats.push({id:uid(),text:t,sid:$('repSub').value||null,days:repDays.slice(),startN:parseInt($('repN').value)||0,startDate:dk(today0())});
  $('repText').value='';save();renderReps()});

$('bkCopy').onclick=()=>{const txt=JSON.stringify(S);
  navigator.clipboard.writeText(txt).then(()=>{$('bkMsg').textContent='클립보드에 복사했어요. 메모 앱 등에 붙여 넣어 보관하세요.'})
  .catch(()=>{$('bkText').value=txt;$('bkText').select();$('bkMsg').textContent='아래 칸의 내용을 직접 복사해 주세요.'})};
let bkArm=false,wipeArm=false;
$('wipeAll').onclick=async()=>{if(!wipeArm){wipeArm=true;$('wipeAll').textContent='정말 모두 지우기';$('wipeAll').classList.add('arm');return}
  const next=seed();TourdyRewards.initialize(next);if(!await writeCandidate(next,{replace:true}))return;S=next;wipeArm=false;$('wipeAll').textContent='모든 기록 지우기';$('wipeAll').classList.remove('arm');setPage=null;setTab('home');renderAll();renderExtras();toast('모든 기록을 지웠어요')};
$('bkRestore').onclick=async()=>{
  const err=m=>{$('bkErr').textContent=m;$('bkErr').hidden=false};$('bkErr').hidden=true;
  let d;try{d=JSON.parse($('bkText').value)}catch(e){return err('백업 내용을 읽지 못했어요. 복사한 내용을 그대로 붙여 넣어 주세요.')}
  try{TourdyStorage.validate(d);d=norm(d)}catch(e){return err('투어디 기록 형식이 아니거나 일부 기록이 손상됐어요. 기존 기록은 바꾸지 않았어요.')}
  if(!bkArm){bkArm=true;$('bkRestore').textContent='지금 기록을 덮어쓰고 복원';$('bkRestore').classList.add('del','arm');return}
  TourdyRewards.initialize(d);if(!await writeCandidate(d,{replace:true}))return err('복원 내용을 저장하지 못했어요. 기존 기록은 유지됩니다.');S=d;bkArm=false;$('bkRestore').textContent='복원하기';$('bkRestore').classList.remove('del','arm');$('bkText').value='';$('bkMsg').textContent='복원했어요.';renderAll();renderExtras();renderFirstTripNotice();
};
function hasEx(){return S.sessions.some(x=>x.ex)||S.repeats.some(x=>x.ex)||Object.values(S.tasks).some(l=>l.some(t=>t.ex))}
document.addEventListener('click',e=>{if(!e.target.closest('[data-clear-ex]'))return;if(setPage==='ex')setPage=null;
  S.sessions=S.sessions.filter(x=>!x.ex);S.repeats=S.repeats.filter(x=>!x.ex);
  for(const k in S.tasks)S.tasks[k]=S.tasks[k].filter(t=>!t.ex);save();renderAll()});

function fillSelects(){if($('bookSub'))$('bookSub').innerHTML=subOpts($('bookSub').value,'과목 없음');
  const keep=$('taskSub').value||lastSub;$('taskSub').innerHTML=subOpts(keep,'과목');
  fillRecSub($('recSub').value);$('repSub').innerHTML=subOpts($('repSub').value,'과목 없음');
}

/* ---------- 알림 권한 ----------
   - 첫 실행(튜토리얼을 닫을 때) 한 번 권한을 묻고, 허용하면 기기 알림을 켠 상태로 시작한다.
   - 권한이 막혀 있으면 알림이 조용히 안 오므로, 설정 → 알림에 '설정 열기' 안내를 띄운다. */
let pushBlocked=false;
async function requestPushPermission(){
  if(window.TourdyNative)return await window.TourdyNative.requestNotifications()?'granted':'denied';
  if(!('Notification' in window))return 'unsupported';
  const r=Notification.permission==='granted'?'granted':await Notification.requestPermission();
  return r==='granted'?'granted':'denied';
}
async function pushDenied(){
  try{
    if(window.TourdyNative)return window.TourdyNative.notificationStatus?(await window.TourdyNative.notificationStatus())==='denied':false;
    return 'Notification' in window&&Notification.permission==='denied';
  }catch(e){return false}
}
async function refreshPushWarn(){
  const w=$('pushWarn');if(!w)return;
  const show=await pushDenied()&&(NF().push||pushBlocked);
  w.hidden=!show;if(!show)return;
  const app=!!(window.TourdyNative&&window.TourdyNative.openSettings);
  $('pushWarnTxt').textContent=app?'기기 설정에서 투어디 알림이 꺼져 있어서 공부 시작·끝 알림을 보낼 수 없어요. 설정 → 투어디 → 알림에서 \'알림 허용\'을 켜 주세요.':'브라우저에서 이 사이트의 알림이 막혀 있어요. 주소창 옆 사이트 설정에서 알림을 허용해 주세요.';
  $('pushWarnGo').hidden=!app;
}
$('pushWarnGo').onclick=()=>{try{Promise.resolve(window.TourdyNative.openSettings()).catch(()=>toast('설정을 열지 못했어요. 설정 앱에서 투어디를 찾아 주세요.'))}catch(e){}};
// 처음 설치한 뒤 튜토리얼을 닫을 때 한 번만 묻는다 (버튼을 누른 순간이라 브라우저도 권한 창을 띄워 준다)
function askNotifyFirstRun(){
  if(S.notifyAsked)return;
  S.notifyAsked=true;save();
  requestPushPermission().then(r=>{if(r==='granted'){S.notify=Object.assign(NF(),{push:true});save();if(tab==='set')renderSet()}}).catch(()=>{});
}
// 설정 앱에서 권한을 켜고 돌아오면 바로 알림을 다시 예약하고 안내를 갱신한다
async function resyncPush(){
  if(!window.TourdyNative||!window.TourdyNative.notificationStatus||!NF().push)return;
  try{if(await window.TourdyNative.notificationStatus()==='granted'&&window.TourdyNative.saved)window.TourdyNative.saved(S)}catch(e){}
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)return;resyncPush();if(tab==='set'&&setPage==='notify')refreshPushWarn()});
// 알림을 켜 두었는데 권한이 꺼져 있으면, 앱을 열 때 한 번 알려 준다
setTimeout(async()=>{if(NF().push&&window.TourdyNative&&await pushDenied())toast('기기 알림 권한이 꺼져 있어 알림이 오지 않아요. 설정 → 알림에서 확인해 주세요.')},1500);
