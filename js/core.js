const KEY='studyplanner.v2',OLD='studyplanner.v1';
const SW=['#E5484D','#F76B15','#E2A400','#30A46C','#12A594','#0090FF','#3E63DD','#8E4EC6','#D6409F','#8D8D86'];
const PLAY='<svg viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5v11l9.5-5.5z"/></svg>';
const PAUSE='<svg viewBox="0 0 14 14" fill="currentColor"><rect x="2.5" y="1.5" width="3.2" height="11" rx="1"/><rect x="8.3" y="1.5" width="3.2" height="11" rx="1"/></svg>';
const CHECK='<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m2.5 6.2 2.4 2.4 4.6-5"/></svg>';
const STAR='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="m10 2.5 2.3 4.8 5.2.7-3.8 3.6.9 5.2L10 14.3l-4.6 2.5.9-5.2L2.5 8l5.2-.7z"/></svg>';
const STAR_ON=STAR.replace('fill="none"','fill="currentColor"');
const XI='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 3 8 8M11 3l-8 8"/></svg>';
const DOW='일월화수목금토';
const ICONS={
  book:['책','M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M8 7h8'],
  fx:['함수','M11 4c-2 0-3 1-3 3v13M5 10h6M14 11l6 8M20 11l-6 8'],
  sigma:['시그마','M17 4H6l6 8-6 8h11'],
  matrix:['행렬','M8 4H5v16h3M16 4h3v16h-3M9.5 9h.01M14.5 9h.01M9.5 15h.01M14.5 15h.01'],
  dice:['주사위','M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM9 9h.01M12 12h.01M15 15h.01'],
  chart:['차트','M4 20h16M7 16v-4M12 16V7M17 16v-7'],
  trend:['경제','M3 17l6-6 4 4 8-8M15 7h6v6'],
  globe:['언어','M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18'],
  pencil:['연필','M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3'],
  note:['노트','M6 3h12v18H6zM3 7h3M3 12h3M3 17h3M10 8h5M10 12h5'],
  flask:['실험','M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9'],
  bulb:['아이디어','M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z'],
  head:['듣기','M4 16v-4a8 8 0 0 1 16 0v4M4 15h3v6H5a1 1 0 0 1-1-1zM20 15h-3v6h2a1 1 0 0 0 1-1z'],
  laptop:['코딩','M5 5h14v10H5zM2 19h20M10 9l-2 1.5L10 12M14 9l2 1.5-2 1.5'],
  target:['목표','M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8zM12 12h.01'],
  clock:['시계','M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM12 7v5l3 2'],
};
const icon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${(ICONS[k]||ICONS.book)[1]}"/></svg>`;
const OFFNAME={rest:'휴식',waste:'딴짓'};

const $=id=>document.getElementById(id);
const uid=()=>Math.random().toString(36).slice(2,10);
const pad=n=>String(n).padStart(2,'0');
const dk=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const pk=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const addD=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const dayH=()=>{try{const v=JSON.parse((window.TourdyNative?.records.storage||localStorage).getItem('studyplanner.v2')||'{}').dayStart;return Number.isInteger(v)?v:0}catch(e){return 0}};
let DS=dayH(); // 하루의 시작 시각(시). 이 시각 전은 전날로 친다
const today0=()=>{const d=new Date(Date.now()-DS*36e5);d.setHours(0,0,0,0);return d};
const logicalDay=t=>{const d=new Date(t-DS*36e5);d.setHours(0,0,0,0);return d};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=ms=>{const s=Math.max(0,Math.floor(ms/1000));return `${Math.floor(s/3600)}:${pad(Math.floor(s%3600/60))}:${pad(s%60)}`};
const fmtH=ms=>{const m=Math.round(ms/60000),h=Math.floor(m/60);return h?(m%60?`${h}시간 ${m%60}분`:`${h}시간`):`${m}분`};
const hm=t=>{const d=new Date(t);return `${pad(d.getHours())}:${pad(d.getMinutes())}`};

/* ---------- data ---------- */
function exampleSessions(){
  const out=[],t=today0();let sd=11;const r=()=>(sd=(sd*9301+49297)%233280)/233280;
  for(let i=1;i<=14;i++){const d=addD(t,-i);if(r()<.15)continue;let cur=d.getTime()+(9+r()*2)*36e5;
    for(const sid of ['s1','s2','s3','s4']){if(r()<.25)continue;const dur=(30+r()*110)*6e4;
      out.push({id:uid(),kind:'study',sid,start:cur,end:cur+dur,ex:true});cur+=dur;
      const br=(5+r()*25)*6e4;out.push({id:uid(),kind:r()<.7?'rest':'waste',sid:null,start:cur,end:cur+br,ex:true});cur+=br+6e5}}
  return out;
}
// 새로 설치하면 선택 기능(추가 기능·여행 연출)은 모두 꺼진 상태로 시작한다. 기존 사용자 설정은 건드리지 않는다.
function seed(){return norm({subjects:[],sessions:[],running:null,tasks:{},repeats:[],welcome:true,
  extra:{books:false,pva:false,postcard:false},
  travel:{on:true,ver:2,at:'KR',to:null,used:0,km:0,stamps:[],news:[],opt:{via:false,goal:false,ddline:false,neon:false,season:false,window:false,map:'base'}}})}
function norm(s){
  s.subjects=s.subjects||[];s.subjects.forEach(x=>{if(x.goal==null)x.goal=0;if(!x.icon)x.icon='book'});
  s.sessions=(s.sessions||[]).map(x=>Object.assign({kind:'study'},x));
  if(s.running&&!s.running.kind)s.running.kind='study';
  for(const k of ['tasks','gen','retro','carryOff'])s[k]=s[k]||{};
  s.repeats=s.repeats||[];s.dday=s.dday||null;
  if(!s.extra||s.extra.postcard==null){const m=s.travel&&s.travel.memo;if(m&&Object.values(m).some(v=>String(v||'').trim()))s.extra=Object.assign({},s.extra,{postcard:true})}
  return s;
}
let storageRecoveryNotice=false;
const stateStore=TourdyStorage.create({getStorage:()=>window.TourdyNative?.records.storage||localStorage,key:KEY,legacyKey:OLD,normalize:norm,seed,onStatus:showStorageStatus,commitBatch:window.TourdyNative?.records.commit});
function showStorageStatus(status){
  const el=$('storageNotice'),msg=$('storageMessage');if(!el)return;
  // 정상 저장은 조용히 처리한다. 저장에 실패했을 때만 알림을 띄운다.
  if(status.type==='saving')return;
  if(status.type==='recovered')storageRecoveryNotice=true;
  if(status.type==='ok'&&storageRecoveryNotice)status={type:'recovered'};
  const messages={unavailable:'저장 공간에 접근하지 못했어요. 이 화면의 기록은 아직 저장되지 않았어요. 기록을 내려받은 뒤 다시 열어 주세요.',failed:'기록을 저장하지 못했어요. 저장 공간을 확인하고 다시 시도해 주세요. 앱을 닫기 전에 현재 기록을 내려받을 수 있어요.',damaged:'저장된 기록을 읽지 못했어요. 원본을 보호하려고 자동 저장을 멈췄어요. 설정의 복원 기능을 이용하거나 원본 기록을 내려받아 보관해 주세요.',recovered:'최근 정상 저장본으로 기록을 복구했어요. 읽지 못한 원본은 따로 보관합니다.',conflict:window.TourdyNative?'다른 저장 작업과 겹쳐서 덮어쓰기를 막았어요. 현재 기록을 내려받은 뒤 앱을 다시 열어 주세요.':'다른 창에서 기록이 바뀌었어요. 덮어쓰기를 막았습니다. 현재 기록을 내려받은 뒤 이 창을 새로고침해 주세요.'};
  el.hidden=!messages[status.type];msg.textContent=messages[status.type]||'';
  $('storageRetry').hidden=!['failed'].includes(status.type);
  $('storageReload').hidden=!['unavailable','conflict'].includes(status.type);
  $('storageOriginal').hidden=!['damaged','recovered'].includes(status.type);
  $('storageDismiss').hidden=status.type!=='recovered';
}
function downloadState(raw,name){if(window.TourdyNative){window.TourdyNative.shareJSON(raw,name).catch(()=>toast('백업 파일을 내보내지 못했어요. 다시 시도해 주세요.'));return}const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function load(){return stateStore.read()}
function saveStoredSnapshot(){return stateStore.writeAsync ? stateStore.writeAsync(S) : stateStore.write(S)}
function writeCandidate(state,options){
  if(!stateStore.writeAsync)return stateStore.write(state,options);
  const native=window.TourdyNative;
  if(native.transactionBusy)return Promise.resolve(false);
  native.setBusy(true);
  return stateStore.writeAsync(state,options).then(ok=>{if(ok)native.saved(state);return ok;}).finally(()=>native.setBusy(false));
}
function durableArrival(check,ready){
  const native=window.TourdyNative;
  // 도착 조건이 안 되면 상태 전체를 복제하지 않는다 (10초마다 3번씩 복제하던 부분)
  if(ready&&!ready())return false;
  if(native.transactionBusy||['failed','conflict','damaged','unavailable'].includes(stateStore.status().type))return false;
  const previous=S,candidate=JSON.parse(JSON.stringify(S)),originalSave=save,originalQueue=arrQ,events=[];
  let arrived=false;
  try {
    native.transactionComputing=true;S=candidate;save=()=>true;arrQ=event=>events.push(event);
    arrived=check();
  } finally {S=previous;save=originalSave;arrQ=originalQueue;native.transactionComputing=false;}
  if(!arrived)return false;
  writeCandidate(candidate).then(ok=>{
    if(!ok)return;
    S=candidate;events.forEach(event=>arrQ(event));
    if(typeof ding==='function')ding();
    if(tab==='travel')renderTravel();renderFirstTripNotice();native.saved(S);
  });
  return false;
}
$('storageRetry').onclick=()=>save();
$('storageReload').onclick=()=>location.reload();
if(window.TourdyNative)$('storageReload').textContent='앱 다시 불러오기';
$('storageDownload').onclick=()=>downloadState(JSON.stringify(S),'tourdy-current-records.json');
$('storageDismiss').onclick=()=>{storageRecoveryNotice=false;$('storageNotice').hidden=true};
$('storageOriginal').onclick=()=>{try{const storage=window.TourdyNative?.records.storage||localStorage;const raw=storage.getItem(stateStore.damagedKey)||storage.getItem(KEY);if(raw)downloadState(raw,'tourdy-original-records.json')}catch(e){showStorageStatus({type:'unavailable'})}};
// 글자를 칠 때마다 파일 전체를 다시 쓰지 않도록, 입력이 멈춘 뒤 한 번만 저장한다
function saveSoon(ms){clearTimeout(saveSoon.t);saveSoon.t=setTimeout(()=>{saveSoon.t=null;save()},typeof ms==='number'?ms:500)}
saveSoon.flush=()=>{if(saveSoon.t){clearTimeout(saveSoon.t);saveSoon.t=null;save()}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveSoon.flush()});window.addEventListener('pagehide',()=>saveSoon.flush());
function save(){clearTimeout(saveSoon.t);saveSoon.t=null;const stored=saveStoredSnapshot();if(typeof bonusCheck==='function'){clearTimeout(save.bt);save.bt=setTimeout(()=>{if(window.TourdyNative?.transactionBusy)return;travelWatch();bonusCheck();showArrival();renderFirstTripNotice()},400)}if(stored?.then)stored.then(ok=>{if(ok&&window.TourdyNative){const raw=window.TourdyNative.records.storage.getItem(KEY);if(raw)window.TourdyNative.saved(JSON.parse(raw));}});return stored}
let S=load();
TourdyRewards.initialize(S);
// A valid source is written only after an actual change; damaged input is never seeded over.

let view=today0(),tab='home',range=1;
let homeTab='run',openPreset=null,armed=null,doneOpen=true,editTask=null,editRec=null,lastSub='';
let postStop=false,repDays=[1,2,3,4,5];

const isToday=()=>dk(view)===dk(today0());
const bounds=d=>[d.getTime()+DS*36e5,addD(d,1).getTime()+DS*36e5];
const subj=id=>S.subjects.find(s=>s.id===id);
const liveSubs=()=>S.subjects.filter(s=>!s.deleted);
const subOpts=(sel,none)=>(none?`<option value="">${none}</option>`:'')+liveSubs().map(s=>`<option value="${s.id}" ${s.id===sel?'selected':''}>${esc(s.name)}</option>`).join('');

function allSessions(){const l=S.sessions.slice();if(S.running)l.push({id:'__run',kind:S.running.kind,sid:S.running.sid,start:S.running.start,end:S.running.end?Math.min(Date.now(),S.running.end):Date.now(),live:true});return l}
function dayStats(d){
  const [a,b]=bounds(d),by={};let study=0,rest=0,waste=0;
  for(const x of allSessions()){const o=Math.min(b,x.end)-Math.max(a,x.start);if(o<=0)continue;
    if(x.kind==='study'){by[x.sid]=(by[x.sid]||0)+o;study+=o}else if(x.kind==='rest')rest+=o;else waste+=o}
  return {by,study,rest,waste};
}
// 날짜별 합계: 저장된 기록이 그대로면 다시 계산하지 않는다.
// (검색 한 글자, 10초마다 도착 검사, 저장 후 보너스 확인이 매번 전체 기록을 다시 훑어 입력이 끊기던 문제)
// 기록 내용(시작·끝·종류·과목)과 하루 시작 시각으로 지문을 만들어, 수정·삭제·복원도 바로 반영된다.
const PD_CACHE=[null,null],PD_STR=new Map();
function pdStr(s){if(s==null)return 0;let v=PD_STR.get(s);if(v===undefined){v=0;s=String(s);for(let i=0;i<s.length;i++)v=(Math.imul(v,31)+s.charCodeAt(i))|0;if(PD_STR.size>5000)PD_STR.clear();PD_STR.set(s,v)}return v}
function pdFingerprint(list,forMiles){let h=0,n=0;
  for(const x of list){if(forMiles&&x.noMile)continue;n++;h=(Math.imul(h,31)+(x.start|0))|0;h=(Math.imul(h,31)+(x.end|0))|0;h=(Math.imul(h,31)+pdStr(x.kind))|0;h=(Math.imul(h,31)+pdStr(x.sid))|0}
  return list.length+':'+n+':'+h+':'+DS}
// owned: 캐시된 날짜 칸을 고치기 전에 복사해서, 진행 중인 공부가 캐시를 오염시키지 않게 한다
function pdAdd(m,x,owned){let d=logicalDay(x.start);
  while(bounds(d)[0]<x.end){const [a,b]=bounds(d),o=Math.min(b,x.end)-Math.max(a,x.start);
    if(o>0){const k=dk(d);let e=m[k];
      if(!e)e=m[k]={by:{},study:0,rest:0,waste:0};
      else if(owned&&!owned.has(k))e=m[k]={by:{...e.by},study:e.study,rest:e.rest,waste:e.waste};
      if(owned)owned.add(k);
      if(x.kind==='study'){e.by[x.sid]=(e.by[x.sid]||0)+o;e.study+=o}else e[x.kind]+=o}d=addD(d,1)}}
function perDay(forMiles){
  const slot=forMiles?1:0,list=S.sessions,fp=pdFingerprint(list,forMiles);let c=PD_CACHE[slot];
  if(!c||c.fp!==fp){const m={};for(const x of list){if(forMiles&&x.noMile)continue;pdAdd(m,x,null)}c=PD_CACHE[slot]={fp,m}}
  const r=S.running;if(!r)return c.m;
  const m=Object.assign({},c.m);
  pdAdd(m,{kind:r.kind,sid:r.sid,start:r.start,end:r.end?Math.min(Date.now(),r.end):Date.now()},new Set());
  return m;
}

// Keep keyboard composition separate from costly result rendering.
function isTextEditing(){return !!document.activeElement?.matches('input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]):not([type=range]),textarea,[contenteditable="true"]');}
function bindSearchInput(el,render){
  let timer=null,composing=false;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>{timer=null;if(!composing)render(el.value);},100);};
  el.addEventListener('compositionstart',()=>{composing=true;clearTimeout(timer);});
  el.addEventListener('compositionend',()=>{composing=false;schedule();});
  el.addEventListener('input',e=>{if(composing||e.isComposing)return;schedule();});
}

/* 달력 넘기기: 마우스 휠·트랙패드는 위아래, 터치는 좌우로 밀면 이전/다음 달 (윈도우 작업 표시줄 달력처럼).
   el 안의 sel(달력 영역)에서만 반응. step(+1/-1)로 달을 바꾼다. 트랙패드의 작은 움직임은 모아서 한 칸씩 */
function calScroll(el,sel,step){
  let acc=0,lock=0,tx=null,ty=null;
  el.addEventListener('wheel',e=>{if(!e.target.closest(sel))return;e.preventDefault();
    const now=Date.now();acc+=e.deltaMode===1?e.deltaY*30:e.deltaY;
    if(now<lock||Math.abs(acc)<40)return;step(acc>0?1:-1);acc=0;lock=now+180},{passive:false});
  el.addEventListener('touchstart',e=>{if(!e.target.closest(sel)||e.touches.length!==1)return tx=null;tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
  el.addEventListener('touchend',e=>{if(tx==null)return;const t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;tx=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)step(dx<0?1:-1)},{passive:true});
}
