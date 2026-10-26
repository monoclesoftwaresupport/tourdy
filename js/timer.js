/* ---------- 알림 (모든 기기 공통: 소리·화면 알림, 가능한 곳에서만 진동·브라우저 알림) ---------- */
let ACX=null;
const audio=()=>{try{ACX=ACX||new (window.AudioContext||window.webkitAudioContext)();if(ACX.state==='suspended')ACX.resume().catch(()=>{})}catch(e){}return ACX};
// Unlock timer audio only on timer controls, never on text entry or preset creation.
document.addEventListener('pointerdown',e=>{
  if(!NF().sound||!e.target.closest('[data-act="play"],#planGo,#planResume,#planSkip,[data-k]'))return;
  audio();
},{capture:true,passive:true});
const NF=()=>Object.assign({sound:true,warn5:true,push:false,memo:true},S.notify||{});
function tone(notes,vol=.2){if(!NF().sound)return;const c=audio();if(!c)return;const t=c.currentTime+.02;
  notes.forEach(([f,d,len])=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;
    g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(vol,t+d+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d+len);
    o.connect(g).connect(c.destination);o.start(t+d);o.stop(t+d+len+.05)})}
const SND={end:[[784,0,.6],[988,.18,.6],[1175,.36,1]],warn:[[880,0,.3],[880,.28,.3]],rest:[[659,0,.5],[523,.22,.8]],start:[[523,0,.4],[784,.16,.7]]};
function toast(msg){const el=$('toast');el.textContent=msg;el.hidden=false;el.classList.remove('show');void el.offsetWidth;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>{el.hidden=true},5000)}
function notify(title,body,snd){
  if(snd)tone(SND[snd]);toast(body?`${title} · ${body}`:title);
  try{if(window.TourdyNative)window.TourdyNative.vibrate();else if(navigator.vibrate)navigator.vibrate(snd==='end'?[200,100,200]:120)}catch(e){}
  try{if(NF().push&&'Notification' in window&&Notification.permission==='granted'&&document.hidden)new Notification(title,{body:body||'',tag:'study-planner'})}catch(e){}
}
/* 공부 메모 */
let memoId=null;
function askMemo(id){const x=S.sessions.find(s=>s.id===id);if(!x)return;memoId=id;
  $('memoTitle').textContent=`${subj(x.sid)?.name||'공부'} ${fmtH(x.end-x.start)} · 무엇을 공부했나요?`;$('memoText').value='';$('memoSheet').hidden=false}
function closeMemo(saveIt){const x=S.sessions.find(s=>s.id===memoId),v=$('memoText').value.trim();if(saveIt&&x&&v){x.memo=v;save();renderRecords()}memoId=null;$('memoSheet').hidden=true}
$('memoSave').onclick=()=>closeMemo(true);$('memoSkip').onclick=()=>closeMemo(false);
$('memoText').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();closeMemo(true)}if(e.key==='Escape')closeMemo(false)});

/* ---------- timer ---------- */
function closeRun(opt={}){const r=S.running;if(!r)return;const now=r.end?Math.min(Date.now(),r.end):Date.now();
  if(now-r.start>=1000){const x={id:uid(),kind:r.kind,sid:r.sid||null,start:r.start,end:now};S.sessions.push(x);
    if(r.kind==='study'&&now-r.start>=6e4&&!opt.noMemo&&NF().memo)setTimeout(()=>askMemo(x.id),0)}
  S.running=null;TourdyRewards.earn(S)}
let switchArm=null,switchAt=0;
const planBusy=()=>!!((S.running&&S.running.plan)||S.paused);
function renderPlanIf(){if(!$('mPlan').hidden)renderPlan()}
function pausePlan(){const r=S.running;if(!(r&&r.plan&&r.kind==='study'))return;S.paused={sid:r.sid,remain:Math.max(0,r.end-Date.now()),cyc:r.cyc||null};closeRun({noMemo:true})}
function resumePlan(){const p=S.paused;if(!p)return;closeRun();const now=Date.now();
  S.running={kind:'study',sid:p.sid,start:now,end:now+p.remain,plan:true,cyc:p.cyc||null};S.paused=null;postStop=false;lastDone='';save();refreshTimer();renderPlanIf()}
function toggle(sid){
  const r=S.running;
  if(r&&r.plan&&r.sid===sid){pausePlan();postStop=true;save();refreshTimer();renderPlanIf();return}   // 같은 과목 ▶ = 일시정지
  if(S.paused&&S.paused.sid===sid&&!(r&&r.kind==='study')){resumePlan();return}                       // 일시정지된 과목 ▶ = 이어서
  if(planBusy()&&!(switchArm===sid&&Date.now()-switchAt<5000)){switchArm=sid;switchAt=Date.now();tick();return} // 다른 과목: 한 번 더 확인
  switchArm=null;if(planBusy())S.paused=null;
  if(r&&r.kind==='study'&&r.sid===sid){closeRun();postStop=true}
  else{closeRun();S.running={kind:'study',sid,start:Date.now()};postStop=false}
  save();refreshTimer();renderPlanIf();
}
function startOff(kind){
  if(S.running&&S.running.kind===kind){closeRun();postStop=false}
  else{if(S.running&&S.running.plan)pausePlan();else closeRun();S.running={kind,sid:null,start:Date.now()};postStop=false}
  save();refreshTimer();renderPlanIf();
}
function stopAll(){closeRun();postStop=false;save();refreshTimer();renderPlanIf()}
function refreshTimer(){renderFirstTripNotice();renderSubs();renderRecords();renderTasks();tick()}

$('ctrl').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;k==='stop'?stopAll():k==='resume'?resumePlan():startOff(k)});
$('planOff').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b)startOff(b.dataset.k)});
$('planResume').onclick=resumePlan;

function renderSubs(){
  const ul=$('subs'),t=dayStats(view).by;
  ul.innerHTML=liveSubs().map(s=>{
    const on=S.running&&S.running.kind==='study'&&S.running.sid===s.id;
    return `<li class="sub${on?' on':''}" style="--c:${s.color}" data-id="${s.id}">
      <span class="ic">${icon(s.icon)}</span>
      <div class="nb"><div class="nrow"><span class="name">${esc(s.name)}</span><span class="t" id="t-${s.id}">${fmt(t[s.id]||0)}</span></div>
</div>
      <button class="play" data-act="play" ${isToday()?'':'disabled'} aria-label="${esc(s.name)} ${on?'정지':'시작'}">${on?PAUSE:PLAY}</button></li>`;
  }).join('')||'<li class="empty">프리셋 목록에서 과목을 먼저 만들어 주세요</li>';
}
$('subs').addEventListener('click',e=>{
  const b=e.target.closest('[data-act="play"]');if(b)toggle(b.closest('.sub').dataset.id);
});

/* ---------- presets ---------- */
const CHEV='<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 6 4 4 4-4"/></svg>';
function renderPresets(){
  $('presets').innerHTML=liveSubs().map(s=>{
    const open=openPreset===s.id;
    return `<li class="preset${open?' open':''}" style="--c:${s.color}" data-id="${s.id}">
      <button class="phead" data-p="toggle" aria-expanded="${open}"><span class="ic">${icon(s.icon)}</span><span class="pname">${esc(s.name)}</span>${CHEV}</button>
      ${open?`<div class="pbody">
        <div class="row"><input class="field grow" id="pn-${s.id}" data-p="name" value="${esc(s.name)}" aria-label="과목 이름" autocomplete="off"></div>
        <div class="plabel">색</div>
        <div class="swatches">${SW.map(c=>`<button type="button" class="sw" style="--c:${c}" data-p="color" data-c="${c}" aria-label="색 ${c}" aria-pressed="${c.toLowerCase()===s.color.toLowerCase()}"></button>`).join('')}
          <label class="sw custom" aria-label="직접 고르기"><input type="color" data-p="colorin" id="pc-${s.id}" value="${s.color}"></label></div>
        <div class="plabel">아이콘</div>
        <div class="icons">${Object.keys(ICONS).map(k=>`<button type="button" class="icb" data-p="icon" data-i="${k}" aria-pressed="${k===s.icon}" aria-label="${ICONS[k][0]}" title="${ICONS[k][0]}">${icon(k)}</button>`).join('')}</div>
        <div class="row"><button class="del${armed===s.id?' arm':''}" data-p="del">${armed===s.id?'삭제 확인':'이 프리셋 삭제'}</button></div>
      </div>`:''}</li>`;
  }).join('')||'<li class="empty">프리셋이 없어요. 아래에서 새로 만들어 보세요</li>';
}
// 과목이 추가·이름 변경·삭제되면 홈 목록, 환영 카드, 과목 선택 칸을 바로 갱신한다
function subjectsChanged(){if(typeof renderWelcome==='function')renderWelcome();renderSubs();renderPlanIf();fillSelects();if(typeof renderFirstTripNotice==='function')renderFirstTripNotice()}
function setColor(s,c){s.color=c;save();renderPresets()}
$('presets').addEventListener('click',e=>{
  const b=e.target.closest('[data-p]');if(!b)return;const id=b.closest('.preset').dataset.id,s=subj(id);
  switch(b.dataset.p){
    case 'toggle':openPreset=openPreset===id?null:id;armed=null;renderPresets();break;
    case 'color':setColor(s,b.dataset.c);break;
    case 'icon':s.icon=b.dataset.i;save();renderPresets();break;
    case 'del':
      if(armed===id){s.deleted=true;if(S.running&&S.running.sid===id)closeRun();armed=null;openPreset=null;save();renderPresets();subjectsChanged()}
      else{armed=id;renderPresets()}
  }
});
$('presets').addEventListener('input',e=>{
  const li=e.target.closest('.preset');if(!li)return;const s=subj(li.dataset.id),p=e.target.dataset.p;
  if(p==='name'&&e.target.value.trim()){s.name=e.target.value.trim();li.querySelector('.pname').textContent=s.name;saveSoon(5000);clearTimeout(subjectsChanged.t);subjectsChanged.t=setTimeout(()=>{if(!document.activeElement?.matches('#presets input'))subjectsChanged()},250)}
  if(p==='colorin'){s.color=e.target.value;li.style.setProperty('--c',s.color);saveSoon()}
});
$('presets').addEventListener('focusout',()=>{
  saveSoon.flush(); // 이름 칸을 벗어날 때 한 번만 저장
  clearTimeout(subjectsChanged.t);subjectsChanged.t=setTimeout(()=>{if(!document.activeElement?.matches('#presets input'))subjectsChanged()},0);
});
$('presets').addEventListener('change',e=>{if(e.target.dataset.p==='colorin')renderPresets()});
$('addPreset').onclick=()=>{
  const used=liveSubs().map(x=>x.color);const c=SW.find(x=>!used.includes(x))||SW[0];
  const s={id:uid(),name:'새 과목',color:c,goal:0,icon:'book'};S.subjects.push(s);openPreset=s.id;armed=null;save();renderPresets();subjectsChanged();
  const i=$('pn-'+s.id);if(i){i.focus();i.select()}
};
function setHome(h){homeTab=h;armed=null;$('hRun').hidden=h!=='run';$('hPreset').hidden=h!=='preset';
  $('homeSeg').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.h===h));
  if(h==='run'){renderSubs();renderRecords();tick()}else renderPresets()}
$('homeSeg').addEventListener('click',e=>{const b=e.target.closest('[data-h]');if(b)setHome(b.dataset.h)});

/* ---------- 예약형 ---------- */
const STEP=5*6e4;
let planStart=0,planDur=(S.planDur||50)*6e4,planSid=null,lastDone='',planOpts=[];
const ampm=t=>{const d=new Date(t),h=d.getHours();return `${h<12?'오전':'오후'} ${h%12||12}:${pad(d.getMinutes())}`};
const fmtC=ms=>{const s=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(s/3600);return h?`${h}:${pad(Math.floor(s%3600/60))}:${pad(s%60)}`:`${pad(Math.floor(s/60))}:${pad(s%60)}`};
const durLbl=m=>m<60?`${m}분 동안`:`${Math.floor(m/60)}시간${m%60?' '+m%60+'분':''} 동안`;
const firstSlot=()=>Math.ceil((Date.now()+1000)/STEP)*STEP;
function buildWheel(el,items,idx,onPick){
  el.innerHTML=`<div class="wsel"></div><div class="wscroll">${items.map((t,i)=>`<div class="wi" data-i="${i}">${t}</div>`).join('')}</div>`;
  const sc=el.querySelector('.wscroll'),H=36,clamp=i=>Math.max(0,Math.min(items.length-1,i));
  const mark=i=>sc.querySelectorAll('.wi').forEach((w,j)=>w.classList.toggle('on',j===i));
  requestAnimationFrame(()=>{sc.scrollTop=idx*H});mark(idx);let to,last=idx;
  // 한 칸 넘어갈 때마다 가벼운 햅틱(아이폰 앱). 안드로이드 브라우저는 짧은 진동으로 대신한다
  const tick=()=>{try{if(window.TourdyNative?.tick)window.TourdyNative.tick();else if(navigator.vibrate)navigator.vibrate(5)}catch(e){}};
  sc.onscroll=()=>{const i=clamp(Math.round(sc.scrollTop/H));if(i!==last){last=i;tick()}mark(i);clearTimeout(to);to=setTimeout(()=>onPick(i),120)};
  sc.onclick=e=>{const w=e.target.closest('.wi');if(w)sc.scrollTo({top:w.dataset.i*H,behavior:'smooth'})};
  el.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const i=clamp(Math.round(sc.scrollTop/H)+(e.key==='ArrowDown'?1:-1));sc.scrollTo({top:i*H,behavior:'smooth'})}};
}
function buildPlanWheels(){
  const f=firstSlot();planOpts=[];for(let i=0;i<144;i++)planOpts.push(f+i*STEP);
  if(!planStart||planStart<f)planStart=f;
  buildWheel($('wStart'),planOpts.map(t=>`${ampm(t)} 부터`),Math.max(0,planOpts.indexOf(planStart)),i=>{planStart=planOpts[i];lastDone='';tickPlan()});
  // 테스트 앱(TRAVEL_TEST=true)에서만 1분 선택지를 맨 앞에 추가한다. 정식 앱에는 안 보인다
  const isTest=(()=>{try{return TRAVEL_TEST===true}catch(e){return false}})();
  const durs=isTest?[1]:[];for(let m=5;m<=300;m+=5)durs.push(m);
  buildWheel($('wDur'),durs.map(durLbl),Math.max(0,durs.indexOf(planDur/6e4)),i=>{planDur=durs[i]*6e4;S.planDur=durs[i];save();tickPlan();renderPomo()});
}
function renderPlan(){
  const subs=liveSubs();if(!subj(planSid)||subj(planSid).deleted)planSid=(S.plan&&S.plan.sid)||subs[0]?.id||null;
  const run=planBusy(),wait=!!S.plan;
  if(wait){planStart=S.plan.start;planDur=S.plan.dur;planSid=S.plan.sid}
  $('mPlan').classList.toggle('run',!!run);
  const restB=!!(S.running&&S.running.plan&&S.running.kind==='rest');
  $('planTitle').textContent=S.paused?'일시정지':restB?'휴식 중':run?'공부 중':'다음 공부';
  $('planResume').hidden=!S.paused;$('planExt').hidden=!!S.paused||restB;$('planSkip').hidden=!restB;$('planOff').hidden=restB;
  $('pomoBox').hidden=!!run;renderPomo();
  $('planToggle').hidden=!!run;$('planToggle').textContent=wait?'예약 취소':'예약';$('planToggle').className=wait?'secondary':'primary';
  $('planGo').hidden=!!run;$('wheels').hidden=!!run;$('planSubs').hidden=!!run;$('planActs').hidden=!run;$('planBar').hidden=!run||!!S.paused;
  $('wheels').classList.toggle('locked',wait);
  $('planSubs').classList.toggle('locked',wait);$('planSubs').style.pointerEvents=wait?'none':'';$('planSubs').style.opacity=wait?.45:'';
  $('planSubs').innerHTML=subs.map(s=>`<button class="pchip" style="--c:${s.color}" data-sid="${s.id}" aria-pressed="${s.id===planSid}"><span class="ic">${icon(s.icon)}</span>${esc(s.name)}</button>`).join('')||'<p class="note">프리셋 목록에서 과목을 먼저 만들어 주세요</p>';
  if(!run)buildPlanWheels();
  tickPlan();
}
function tickPlan(){
  if($('mPlan').hidden)return;
  const now=Date.now(),r=S.running&&S.running.plan?S.running:null;
  for(const b of $('planOff').querySelectorAll('[data-k]'))b.setAttribute('aria-pressed',!!(S.running&&S.running.kind===b.dataset.k));
  if(r&&r.kind==='rest'){$('mPlan').style.setProperty('--c','var(--rest)');
    $('planLbl').textContent=`${r.cyc.n}/${r.cyc.total}세트 끝 · 휴식`;$('planBig').textContent=fmtC(r.end-now);
    $('planSub').textContent=`${ampm(r.end)}에 ${r.cyc.n+1}세트를 시작해요`;$('planFill').style.width=Math.min(100,(now-r.start)/(r.end-r.start)*100)+'%';return}
  if(r){const s=subj(r.sid),c=s?.color||'#8D8D86';$('mPlan').style.setProperty('--c',c);
    $('planLbl').textContent=`${s?s.name:'과목'}${r.cyc?` · ${r.cyc.n}/${r.cyc.total}세트`:''} · 남은 시간`;$('planBig').textContent=fmtC(r.end-now);
    $('planSub').textContent=`${ampm(r.end)}에 끝나요`;$('planFill').style.width=Math.min(100,(now-r.start)/(r.end-r.start)*100)+'%';return}
  if(S.paused){const s=subj(S.paused.sid),o=S.running&&S.running.kind!=='study'?S.running:null;$('mPlan').style.setProperty('--c',s?.color||'#8D8D86');
    $('planLbl').textContent=`${s?s.name:'과목'} · 남은 시간`;$('planBig').textContent=fmtC(S.paused.remain);
    $('planSub').textContent=o?`${OFFNAME[o.kind]} 중 · ${fmtC(now-o.start)}`:'일시정지됨 · 이어서 공부를 누르면 남은 시간부터 다시 시작해요';return}
  const st=S.plan?S.plan.start:planStart,s=subj(S.plan?S.plan.sid:planSid);
  $('planLbl').textContent='남은 준비 시간';$('planBig').textContent=fmtC(st-now);
  $('planSub').textContent=lastDone||(S.plan?`예약됨 · ${s?s.name+' · ':''}${ampm(st)}부터 ${durLbl(S.plan.dur/6e4).replace(' 동안','')}${S.plan.cyc?` × ${S.plan.cyc.total}세트`:''}`:'시작 시각과 공부 시간을 고르고 예약하세요');
}
function checkPlan(){
  const now=Date.now();let ch=false;
  if(S.plan&&now>=S.plan.start){closeRun();const P=S.plan;S.running={kind:'study',sid:P.sid,start:P.start,end:P.start+P.dur,plan:true,cyc:P.cyc||null};S.plan=null;ch=true;
    if(now<S.running.end)notify('공부 시작',`${subj(P.sid)?.name||''} 예약 시간이 됐어요`,'start')}
  let guard=0;
  while(S.running&&S.running.end&&now>=S.running.end&&guard++<60){
    const r=S.running,cy=r.cyc,s=subj(r.sid);
    if(cy&&r.kind==='study'&&cy.n<cy.total){closeRun({noMemo:true});S.running={kind:'rest',sid:null,start:r.end,end:r.end+cy.rest,plan:true,cyc:cy};
      if(now<S.running.end)notify(`${cy.n}세트 끝`,`${fmtH(cy.rest)} 쉬어요`,'rest')}
    else if(cy&&r.kind==='rest'){closeRun();const c2=Object.assign({},cy,{n:cy.n+1});S.running={kind:'study',sid:cy.sid,start:r.end,end:r.end+cy.dur,plan:true,cyc:c2};
      if(now<S.running.end)notify(`${c2.n}세트 시작`,subj(cy.sid)?.name||'','start')}
    else{closeRun();postStop=false;lastDone=cy?`${cy.total}세트를 모두 마쳤어요`:`예약한 ${fmtH(r.end-r.start)} 공부를 마쳤어요`;notify('공부 끝',lastDone,'end')}
    ch=true}
  const r=S.running;
  if(ch){save();refreshTimer();renderPlan()}
  else if(!S.plan&&!(S.running&&S.running.plan)&&planStart&&planStart<firstSlot()&&!$('mPlan').hidden)buildPlanWheels();
}
/* 뽀모도로 설정 */
const PO=()=>Object.assign({on:false,sets:4,rest:10},S.pomo||{});
function renderPomo(){const o=PO();$('pomoSw').setAttribute('aria-checked',o.on);$('pomoOpts').hidden=!o.on;
  $('pomoSets').innerHTML=[2,3,4,6].map(n=>`<button data-ps="${n}" aria-pressed="${n===o.sets}">${n}</button>`).join('');
  $('pomoRest').innerHTML=[5,10,15].map(n=>`<button data-pr="${n}" aria-pressed="${n===o.rest}">${n}분</button>`).join('');
  const d=planDur/6e4,tot=d*o.sets+o.rest*(o.sets-1);$('pomoSum').textContent=`${durLbl(d).replace(' 동안','')} 공부 + ${o.rest}분 휴식 × ${o.sets}세트 · 총 ${fmtH(tot*6e4)}`}
$('pomoSw').onclick=()=>{S.pomo=Object.assign(PO(),{on:!PO().on});save();renderPomo()};
$('pomoSets').addEventListener('click',e=>{const b=e.target.closest('[data-ps]');if(b){S.pomo=Object.assign(PO(),{sets:+b.dataset.ps});save();renderPomo()}});
$('pomoRest').addEventListener('click',e=>{const b=e.target.closest('[data-pr]');if(b){S.pomo=Object.assign(PO(),{rest:+b.dataset.pr});save();renderPomo()}});
const mkCyc=sid=>{const o=PO();return o.on?{n:1,total:o.sets,rest:o.rest*6e4,dur:planDur,sid}:null};
$('planSkip').onclick=()=>{const r=S.running;if(r&&r.plan&&r.kind==='rest'){r.end=Date.now();checkPlan()}};
$('planSubs').addEventListener('click',e=>{const b=e.target.closest('[data-sid]');if(!b)return;planSid=b.dataset.sid;
  $('planSubs').querySelectorAll('.pchip').forEach(x=>x.setAttribute('aria-pressed',x===b))});
$('planToggle').onclick=()=>{
  if(S.plan)S.plan=null;
  else{if(!planSid)return;S.plan={sid:planSid,start:planStart,dur:planDur,cyc:mkCyc(planSid)}}
  lastDone='';save();renderPlan();
};
$('planGo').onclick=()=>{if(!planSid)return;closeRun();const now=Date.now();S.plan=null;postStop=false;lastDone='';
  S.running={kind:'study',sid:planSid,start:now,end:now+planDur,plan:true,cyc:mkCyc(planSid)};save();refreshTimer();renderPlan()};
$('planExt').onclick=()=>{if(S.running&&S.running.end){S.running.end+=STEP;save();tickPlan()}};
$('planEnd').onclick=()=>{const r=S.running;
  if(S.paused){S.paused=null;closeRun();lastDone='예약 세션을 끝냈어요'}
  else if(r&&r.plan&&r.kind==='rest'){closeRun();lastDone=`${r.cyc.n}세트까지 마쳤어요`}
  else if(r&&r.plan){closeRun();lastDone=r.cyc?`${r.cyc.n}/${r.cyc.total}세트에서 마쳤어요`:`${fmtH(Math.min(Date.now(),r.end)-r.start)} 공부를 마쳤어요`}
  postStop=false;save();refreshTimer();renderPlan()};
let homeMode=S.mode||'timer';
function setMode(m){homeMode=m;S.mode=m;save();$('mTimer').hidden=m!=='timer';$('mPlan').hidden=m!=='plan';
  $('modeSeg').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));if(m==='plan')renderPlan();else tick()}
$('modeSeg').addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b)setMode(b.dataset.m)});

/* ---------- PIP: 캔버스에 타이머를 그려 영상으로 띄움 ---------- */
let pipC=null,pipLoop=null;
function pipInfo(){
  const now=Date.now(),r=S.running,cs=getComputedStyle(document.documentElement),tok=n=>cs.getPropertyValue(n).trim();
  const sc=id=>subj(id)?.color||'#8D8D86',sn=id=>subj(id)?.name||'과목',today=dayStats(today0()).study;
  if(r&&r.plan&&r.kind==='rest')return {label:'휴식 · 다음 세트까지',time:fmtC(r.end-now),color:tok('--rest')||'#03b26c',sub:`${r.cyc.n}/${r.cyc.total}세트 완료`,prog:(now-r.start)/(r.end-r.start)};
  if(r&&r.plan)return {label:`${sn(r.sid)}${r.cyc?` · ${r.cyc.n}/${r.cyc.total}세트`:''} · 남은 시간`,time:fmtC(r.end-now),color:sc(r.sid),sub:`${ampm(r.end)}에 끝나요`,prog:(now-r.start)/(r.end-r.start)};
  if(S.paused)return {label:`${sn(S.paused.sid)} · 일시정지`,time:fmtC(S.paused.remain),color:sc(S.paused.sid),sub:r?`${OFFNAME[r.kind]} 중 · ${fmtC(now-r.start)}`:'이어서 공부를 누르면 다시 시작'};
  if(r&&r.kind==='study')return {label:`${sn(r.sid)} 공부 중`,time:fmt(now-r.start),color:sc(r.sid),sub:`오늘 ${fmtH(today)}`};
  if(r)return {label:`${OFFNAME[r.kind]} 중`,time:fmt(now-r.start),color:tok('--'+r.kind)||'#888',sub:`오늘 공부 ${fmtH(today)}`};
  return {label:'오늘 공부 시간',time:fmt(today),color:tok('--accent')||'#3182f6',sub:'과목을 누르면 시작돼요'};
}
function pipDraw(){
  if(!pipC){pipC=document.createElement('canvas');pipC.width=640;pipC.height=360}
  const x=pipC.getContext('2d'),cs=getComputedStyle(document.documentElement),tok=n=>cs.getPropertyValue(n).trim(),i=pipInfo(),W=640,H=360;
  const font=tok('--sans')||'sans-serif';
  x.fillStyle=tok('--surface')||'#fff';x.fillRect(0,0,W,H);
  x.fillStyle=i.color;x.fillRect(0,0,14,H);
  x.textBaseline='alphabetic';x.fillStyle=tok('--muted')||'#555';x.font=`600 34px ${font}`;x.fillText(i.label,50,92);
  x.fillStyle=tok('--ink')||'#111';x.font=`800 ${i.time.length>5?118:136}px ${font}`;x.fillText(i.time,44,232);
  x.fillStyle=tok('--faint')||'#888';x.font=`500 28px ${font}`;x.fillText(i.sub,50,300);
  if(i.prog!=null){x.fillStyle=tok('--track')||'#ddd';x.fillRect(50,326,W-100,10);x.fillStyle=i.color;x.fillRect(50,326,(W-100)*Math.min(1,Math.max(0,i.prog)),10)}
}
async function togglePip(){
  const v=$('pipVideo'),err=m=>{$('pipErr').textContent=m;$('pipErr').hidden=false};$('pipErr').hidden=true;
  try{
    if(document.pictureInPictureElement){await document.exitPictureInPicture();return}
    if(!document.pictureInPictureEnabled||!HTMLCanvasElement.prototype.captureStream)return err('이 브라우저에서는 PIP를 쓸 수 없어요. PC의 크롬·엣지·사파리에서 열어 주세요.');
    pipDraw();if(!v.srcObject)v.srcObject=pipC.captureStream(4);
    await v.play();await v.requestPictureInPicture();
  }catch(e){err('PIP를 열지 못했어요. 브라우저나 이 화면에서 작은 창이 막혀 있을 수 있어요.')}
}
$('pipBtn').onclick=togglePip;
$('pipVideo').addEventListener('enterpictureinpicture',()=>{$('pipBtn').setAttribute('aria-pressed','true');clearInterval(pipLoop);pipLoop=setInterval(pipDraw,250)});
$('pipVideo').addEventListener('leavepictureinpicture',()=>{$('pipBtn').setAttribute('aria-pressed','false');clearInterval(pipLoop);pipLoop=null});
$('pipVideo').addEventListener('pause',()=>{if(document.pictureInPictureElement)$('pipVideo').play().catch(()=>{})});

function tick(){
  checkPlan();
  // Time is computed from timestamps; offscreen DOM needs no per-second rebuild.
  if(document.hidden||tab!=='home'||isTextEditing()||$('tourDialog').open)return;
  tickPlan();
  renderFirstTripNotice();
  const st=dayStats(view);
  for(const s of liveSubs()){
    const el=$('t-'+s.id);if(el)el.textContent=fmt(st.by[s.id]||0);
  }
  const c=$('clock'),r=S.running;
  if(r){
    const col=r.kind==='study'?(subj(r.sid)?.color||'#8D8D86'):`var(--${r.kind})`;
    const nm=r.kind==='study'?(subj(r.sid)?.name||'과목')+' 공부 중':OFFNAME[r.kind]+' 중';
    c.classList.add('on');c.style.setProperty('--c',col);
    $('who').innerHTML=`<i></i><span>${esc(nm)}</span>`;$('big').textContent=fmt(Date.now()-r.start);
  }else{
    c.classList.remove('on');c.style.removeProperty('--c');
    $('who').innerHTML=`<i></i><span>${isToday()?'오늘 순공 · 과목을 눌러 시작':'이 날 순공'}</span>`;$('big').textContent=fmt(st.study);
  }
  {const g=S.goal||0,gr=$('goalRow');gr.hidden=!g;if(g){const p=st.study/(g*6e4);gr.classList.toggle('met',p>=1);
    $('goalTxt').textContent=`오늘 목표 ${goalLbl(g)} · ${fmtH(st.study)} 채움`;$('goalPct').textContent=Math.floor(p*100)+'%';$('goalFill').style.width=Math.min(100,p*100)+'%'}}
  if(switchArm&&Date.now()-switchAt>=5000)switchArm=null;
  const showCtrl=isToday()&&(r||postStop||S.paused);$('ctrl').hidden=!showCtrl;
  if(showCtrl){
    for(const b of $('ctrl').querySelectorAll('[data-k]'))if(b.dataset.k==='rest'||b.dataset.k==='waste')b.setAttribute('aria-pressed',!!(r&&r.kind===b.dataset.k));
    $('ctrl').querySelector('.resume').hidden=!S.paused;
    $('ctrlHint').textContent=switchArm?`한 번 더 누르면 예약 세션을 끝내고 ${subj(switchArm)?.name||''} 시작`
      :S.paused?`예약 세션 일시정지 · 남은 ${fmtC(S.paused.remain)}`
      :r&&r.plan?`예약 세션 · 남은 ${fmtC(r.end-Date.now())}`
      :!r?'쉬는 시간도 기록할까요?':'';
  }
  const [a,b]=bounds(view),D=b-a;let h='';
  for(const x of allSessions()){const s=Math.max(a,x.start),e=Math.min(b,x.end);if(e<=s)continue;
    const col=x.kind==='study'?(subj(x.sid)?.color||'#8D8D86'):`var(--${x.kind})`;
    h+=`<b class="${x.kind==='study'?'':'off'}" style="left:${(s-a)/D*100}%;width:${(e-s)/D*100}%;background:${col}"></b>`}
  if(isToday())h+=`<span class="now" style="left:${(Date.now()-a)/D*100}%"></span>`;
  $('tl').innerHTML=h;
  const all=st.study+st.rest+st.waste;
  $('eff').innerHTML=all?`<span><i style="background:var(--ink)"></i>순공 ${fmtH(st.study)}</span><span><i style="background:var(--rest)"></i>휴식 ${fmtH(st.rest)}</span><span><i style="background:var(--waste)"></i>딴짓 ${fmtH(st.waste)}</span><span>집중 효율 ${Math.round(st.study/all*100)}%</span>`:'';
}
