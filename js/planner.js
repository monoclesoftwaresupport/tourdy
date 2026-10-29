/* ---------- records (manual) ---------- */
function daySessions(){const [a,b]=bounds(view);return allSessions().filter(x=>x.end>a&&x.start<b).sort((p,q)=>p.start-q.start)}
function renderRecords(){
  const l=daySessions();$('recN').textContent=l.length||'';
  $('recList').innerHTML=l.map(x=>{
    const s=x.kind==='study'?subj(x.sid):null;
    const nm=x.kind==='study'?(s?esc(s.name):'삭제된 과목'):OFFNAME[x.kind];
    const col=x.kind==='study'?(s?.color||'#8D8D86'):`var(--${x.kind})`;
    const act=x.live?'<span class="note">진행 중</span>':`<button class="textbtn" data-r="edit">수정</button><button class="del${armed===x.id?' arm':''}" data-r="del">${armed===x.id?'삭제 확인':'삭제'}</button>`;
    return `<li data-id="${x.id}"><span class="rt">${hm(x.start)}–${x.live?'지금':hm(x.end)}</span><span class="rn"><span class="dot" style="--c:${col}"></span>${nm}${x.ex?' <span class="exbadge">예시</span>':''}${x.noMile?' <span class="exbadge">마일리지 제외</span>':''}${x.memo?`<small class="rmemo">${esc(x.memo)}</small>`:''}</span><span class="rd">${fmt(x.end-x.start)}</span>${act}</li>`;
  }).join('')||'<li class="empty" style="border:0">이 날 기록이 없어요</li>';
}
function fillRecSub(sel){const subs=liveSubs().length;
  // 과목이 하나도 없을 때 저절로 골라진 '휴식'은, 과목이 생기면 첫 과목으로 바꾼다 (기록 수정 중이 아닐 때)
  if(subs&&!editRec&&sel&&sel.startsWith('k:')&&![...$('recSub').options].some(o=>o.value&&!o.value.startsWith('k:')))sel='';
  $('recSub').innerHTML=`<optgroup label="공부">${subs?subOpts(sel):'<option value="" disabled>프리셋 목록에서 과목을 먼저 만들어 주세요</option>'}</optgroup><optgroup label="쉬는 시간"><option value="k:rest" ${sel==='k:rest'?'selected':''}>휴식</option><option value="k:waste" ${sel==='k:waste'?'selected':''}>딴짓</option></optgroup>`;if(!sel&&subs)$('recSub').value=liveSubs()[0].id}
function resetRecForm(){editRec=null;$('recD').value=dk(today0());$('recD').max=dk(today0());$('recMemo').value='';$('recFormTitle').textContent='직접 기록 추가';$('recSave').textContent='추가';$('recCancel').hidden=true;$('recErr').hidden=true;const now=hm(Date.now());$('recS').value=now;$('recE').value=now}
// 기록 칸을 열 때마다 시작·끝을 지금 시각으로 맞춘다 (수정 중일 때는 그대로)
$('recWrap').addEventListener('toggle',()=>{if(!$('recWrap').open||editRec)return;const now=hm(Date.now());$('recS').value=now;$('recE').value=now});
$('recList').addEventListener('click',e=>{
  const b=e.target.closest('[data-r]');if(!b)return;const id=b.closest('li').dataset.id,x=S.sessions.find(s=>s.id===id);if(!x)return;
  if(b.dataset.r==='del'){if(armed===id){S.sessions.splice(S.sessions.indexOf(x),1);armed=null;save();refreshTimer()}else{armed=id;renderRecords()}}
  if(b.dataset.r==='edit'){editRec=id;fillRecSub(x.kind==='study'?x.sid:'k:'+x.kind);$('recD').value=dk(logicalDay(x.start));$('recS').value=hm(x.start);$('recE').value=hm(x.end);$('recMemo').value=x.memo||'';
    $('recFormTitle').textContent='기록 수정';$('recSave').textContent='저장';$('recCancel').hidden=false;$('recErr').hidden=true;$('recS').focus()}
});
$('recCancel').onclick=resetRecForm;
$('recForm').addEventListener('submit',e=>{
  e.preventDefault();const v=$('recSub').value,sv=$('recS').value,ev=$('recE').value;
  const err=m=>{$('recErr').textContent=m;$('recErr').hidden=false};
  if(!v)return err('과목을 먼저 추가하세요.');
  const [sh,sm]=sv.split(':').map(Number),[eh,em]=ev.split(':').map(Number);
  const D=$('recD').value?pk($('recD').value):view;if(dk(D)>dk(today0()))return err('미래 날짜에는 기록할 수 없어요.');
  const at=(h,m)=>new Date(D.getFullYear(),D.getMonth(),D.getDate()+(h<DS?1:0),h,m).getTime(); // 하루의 시작 전 시각은 다음 날 새벽
  const start=at(sh,sm),end=at(eh,em);
  if(end<=start)return err('끝 시각이 시작 시각보다 늦어야 해요.');
  if(end>Date.now())return err('아직 오지 않은 시간은 기록할 수 없어요.');
  const kind=v.startsWith('k:')?v.slice(2):'study',sid=kind==='study'?v:null;
  const memo=$('recMemo').value.trim();
  const past=dk(D)!==dk(today0()); // 오늘이 아닌 날짜의 직접 기록은 마일리지 제외
  if(editRec){const x=S.sessions.find(s=>s.id===editRec);Object.assign(x,{kind,sid,start,end});if(memo)x.memo=memo;else delete x.memo;delete x.ex;if(past)x.noMile=true}
  else{const x={id:uid(),kind,sid,start,end,manual:true};if(memo)x.memo=memo;if(past)x.noMile=true;S.sessions.push(x)}
  save();resetRecForm();refreshTimer();if(past)toast(`${D.getMonth()+1}월 ${D.getDate()}일 기록으로 추가했어요 · 마일리지 제외`);
});

/* ---------- repeats ---------- */
function countOcc(r,from,to){let n=0;for(let d=new Date(from);d<to&&n<5000;d=addD(d,1))if(r.days.includes(d.getDay()))n++;return n}
function repText(r,d){return r.text.replace(/\{n\}/g,()=>r.startN+countOcc(r,pk(r.startDate),d))}
function genFor(d){
  const k=dk(d);if(k<dk(today0()))return;const g=S.gen[k]||(S.gen[k]=[]);let ch=false;
  for(const r of S.repeats){if(g.includes(r.id)||k<r.startDate||!r.days.includes(d.getDay()))continue;
    (S.tasks[k]||(S.tasks[k]=[])).push({id:uid(),text:repText(r,d),done:false,star:false,sid:r.sid||null,rep:r.id,ex:r.ex});g.push(r.id);ch=true}
  if(ch)save();
}

/* ---------- tasks ---------- */
let todoDay=today0(),arriveId=null,actx=null;
function ding(){if(Date.now()-(window.ARR_T||0)<2500)return; // 도착 효과음과 겹치지 않게
  try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();
    const t=actx.currentTime;
    [[1318.5,0],[1975.5,.07]].forEach(([f,d])=>{const o=actx.createOscillator(),g=actx.createGain();o.type='sine';o.frequency.value=f;
      g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.16,t+d+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d+.45);
      o.connect(g).connect(actx.destination);o.start(t+d);o.stop(t+d+.5)});
  }catch(e){}
}
const isTodoToday=()=>dk(todoDay)===dk(today0());
const list=()=>(S.tasks[dk(todoDay)]||(S.tasks[dk(todoDay)]=[]));
function pendingCarry(){
  const out=[];for(let i=1;i<=14;i++){const k=dk(addD(today0(),-i));(S.tasks[k]||[]).forEach(t=>{if(!t.done)out.push([k,t])})}return out;
}
function taskLi(t){
  const s=t.sid&&subj(t.sid),live=s&&!s.deleted;
  const on=S.running&&S.running.kind==='study'&&S.running.sid===t.sid;
  const body=editTask===t.id
    ?`<input class="edit" id="e-${t.id}" value="${esc(t.text)}" aria-label="작업 수정"><select id="es-${t.id}" aria-label="과목">${subOpts(t.sid,'과목 없음')}</select>${EX().pva?`<select id="ee-${t.id}" aria-label="예상 시간">${EST.map(m=>`<option value="${m}" ${m===(t.est||0)?'selected':''}>${m?fmtH(m*6e4):'예상 없음'}</option>`).join('')}</select>`:''}`
    :`<span class="txt" data-act="edit"><span class="tx">${esc(t.text)}</span></span>${live||(t.est&&EX().pva)?`<span class="tag" style="--c:${live?s.color:'transparent'}">${live?`<i></i>${esc(s.name)}`:''}${t.est&&EX().pva?`${live?' · ':''}예상 ${fmtH(t.est*6e4)}`:''}</span>`:''}`;
  return `<li class="task${t.done?' done':''}${arriveId===t.id?' arrive':''}" data-id="${t.id}">
    <button class="check" data-act="check" aria-label="${t.done?'완료 취소':'완료'}">${CHECK}</button><div class="tb">${body}</div>
    <button class="star" data-act="star" aria-pressed="${!!t.star}" aria-label="중요">${t.star?STAR_ON:STAR}</button>
    <button class="x" data-act="rm" aria-label="삭제">${XI}</button></li>`;
}
function renderTasks(){
  genFor(todoDay);
  const rel=Math.round((todoDay-today0())/864e5);
  // 좁은 화면(아이폰 SE 등)에서는 '10/25 (일)'처럼 짧게 써서 줄이 넘치지 않게
  const narrowDay=innerWidth<=360,M=todoDay.getMonth()+1,D=todoDay.getDate(),W=DOW[todoDay.getDay()];
  $('tdLabel').textContent=(narrowDay?`${M}/${D} (${W})`:`${M}월 ${D}일 ${W}요일`)+(rel===-1?' · 어제':rel===1?' · 내일':'');
  $('tdToday').disabled=rel===0;
  const l=list(),todo=l.filter(t=>!t.done),done=l.filter(t=>t.done);
  todo.sort((a,b)=>(b.star?1:0)-(a.star?1:0));
  $('todo').innerHTML=todo.map(taskLi).join('')||(done.length?'':'<li class="empty">할 일을 추가해 보세요</li>');
  $('done').innerHTML=doneOpen?done.map(taskLi).join(''):'';
  $('doneToggle').hidden=!done.length;$('doneN').textContent=done.length;$('doneToggle').setAttribute('aria-expanded',doneOpen);
  $('taskCount').textContent=l.length?`${done.length} / ${l.length} 완료`:'';
  $('taskTitle').textContent=isTodoToday()?'오늘 할 일':'할 일';
  const pc=isTodoToday()&&!S.carryOff[dk(todoDay)]?pendingCarry():[];
  $('carry').hidden=true;renderMissed();renderPva();renderBooks();if(typeof renderReps==='function')renderReps();
  if(editTask){const i=$('e-'+editTask);if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
}
$('carryGo').onclick=()=>{const l=list();for(const [k,t] of pendingCarry()){S.tasks[k].splice(S.tasks[k].indexOf(t),1);l.unshift(t)}save();renderTasks()};
$('carryNo').onclick=()=>{S.carryOff[dk(todoDay)]=true;save();renderTasks()};
/* 달성하지 못한 일: 오늘 이전 날짜의 미완료 할 일 */
function missedList(){const t=dk(today0()),out=[];
  for(const k of Object.keys(S.tasks).sort().reverse()){if(k>=t)continue;const l=S.tasks[k].filter(x=>!x.done);if(l.length)out.push([k,l])}return out}
function renderMissed(){
  const g=missedList(),n=g.reduce((a,[,l])=>a+l.length,0),t0=today0();
  $('missN').textContent=n||'';$('missAll').hidden=!n;
  $('missed').innerHTML=n?g.map(([k,l])=>{const d=pk(k),ago=Math.round((t0-d)/864e5);
    return `<div class="mgroup"><div class="mdate">${d.getMonth()+1}월 ${d.getDate()}일 ${DOW[d.getDay()]}요일 · ${ago===1?'어제':ago+'일 전'}</div><ul class="tasks">${l.map(t=>{
      const s=t.sid&&subj(t.sid),live=s&&!s.deleted;
      const open=pickFor&&pickFor.id===t.id;
      return `<li class="task" data-k="${k}" data-id="${t.id}"><button class="check" data-m="done" aria-label="완료">${CHECK}</button>
        <div class="tb"><span class="txt"><span class="tx">${esc(t.text)}</span></span>${live?`<span class="tag" style="--c:${s.color}"><i></i>${esc(s.name)}</span>`:''}</div>
        <button class="mmove" data-m="move">오늘로</button><button class="mmove alt${open?' on':''}" data-m="pick" aria-expanded="${open}">다른 날</button><button class="x" data-m="rm" aria-label="삭제">${XI}</button></li>
        ${open?`<li class="mcalwrap"><div class="cal inline">${calHTML(pickFor.month,null,dk(today0()))}</div></li>`:''}`}).join('')}</ul></div>`}).join('')
    :'<p class="empty">밀린 할 일이 없어요</p>';
}
let pickFor=null;
$('missed').addEventListener('click',e=>{
  const cm=e.target.closest('[data-cm]');if(cm&&pickFor){pickFor.month=new Date(pickFor.month.getFullYear(),pickFor.month.getMonth()+ +cm.dataset.cm,1);renderMissed();return}
  const cd=e.target.closest('[data-day]');if(cd&&pickFor){const l=S.tasks[pickFor.k],t=l&&l.find(x=>x.id===pickFor.id);
    if(t){l.splice(l.indexOf(t),1);(S.tasks[cd.dataset.day]||(S.tasks[cd.dataset.day]=[])).unshift(t);save()}pickFor=null;renderTasks();return}
  const b=e.target.closest('[data-m]');if(!b)return;const li=b.closest('.task'),k=li.dataset.k,l=S.tasks[k],t=l&&l.find(x=>x.id===li.dataset.id);if(!t)return;
  const act=b.dataset.m;
  if(act==='done'){if(li.dataset.busy)return;li.dataset.busy='1';li.classList.add('striking');ding();
    setTimeout(()=>{li.style.height=li.offsetHeight+'px';li.offsetHeight;li.classList.add('collapse');li.style.height='0px';setTimeout(()=>{t.done=true;save();renderMissed()},290)},520)}
  if(act==='pick'){pickFor=pickFor&&pickFor.id===t.id?null:{k,id:t.id,month:new Date(today0().getFullYear(),today0().getMonth(),1)};renderMissed();return}
  if(act==='move'){l.splice(l.indexOf(t),1);(S.tasks[dk(today0())]||(S.tasks[dk(today0())]=[])).unshift(t);save();renderTasks()}
  if(act==='rm'){l.splice(l.indexOf(t),1);save();renderMissed()}
});
$('missAll').onclick=()=>{const tl=S.tasks[dk(today0())]||(S.tasks[dk(today0())]=[]);
  for(const [k,l] of missedList())for(const t of l){S.tasks[k].splice(S.tasks[k].indexOf(t),1);tl.unshift(t)}save();renderTasks()};

/* 왼쪽으로 밀면 삭제 버튼 */
function swipeify(root){
  let cur=null,sx=0,sy=0,dx=0,drag=false,swallow=false;
  const closeAll=ex=>document.querySelectorAll('.trow.open').forEach(r=>{if(r!==ex){r.classList.remove('open');r.style.transform=''}});
  root.addEventListener('pointerdown',e=>{const r=e.target.closest('.trow');if(!r||e.target.closest('input,select'))return;closeAll(r);cur=r;sx=e.clientX;sy=e.clientY;dx=0;drag=false});
  root.addEventListener('pointermove',e=>{if(!cur)return;const mx=e.clientX-sx,my=e.clientY-sy;
    if(!drag){if(Math.abs(mx)>8&&Math.abs(mx)>Math.abs(my)){drag=true;try{cur.setPointerCapture(e.pointerId)}catch(_){};cur.style.transition='none'}else if(Math.abs(my)>8){cur=null;return}else return}
    const base=cur.classList.contains('open')?-84:0;dx=Math.min(0,Math.max(-120,base+mx));cur.style.transform=`translateX(${dx}px)`});
  const end=()=>{if(!cur)return;if(drag){cur.style.transition='';const o=dx<-42;cur.classList.toggle('open',o);cur.style.transform=o?'translateX(-84px)':'';swallow=true;setTimeout(()=>swallow=false,0)}cur=null};
  root.addEventListener('pointerup',end);root.addEventListener('pointercancel',end);
  root.addEventListener('click',e=>{if(swallow){e.stopPropagation();e.preventDefault();return}
    const r=e.target.closest('.trow.open');if(r){e.stopPropagation();e.preventDefault();r.classList.remove('open');r.style.transform=''}},true);
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('.task.swipe'))closeAll(null)});
}


function setTodoDay(d){todoDay=d;editTask=null;renderTasks()}
$('tdPrev').onclick=()=>setTodoDay(addD(todoDay,-1));
$('tdNext').onclick=()=>setTodoDay(addD(todoDay,1));
$('tdToday').onclick=()=>setTodoDay(today0());
/* 달력 */
let calMonth=null;
const CL='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 3 5 8l5 5"/></svg>',CR='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 3 5 5-5 5"/></svg>';
function calHTML(m,sel,minKey){
  const first=new Date(m.getFullYear(),m.getMonth(),1),start=addD(first,-first.getDay()),t0=dk(today0());
  let g=[...DOW].map(d=>`<span class="wd">${d}</span>`).join('');
  for(let i=0;i<42;i++){const d=addD(start,i),k=dk(d),l=S.tasks[k]||[];
    if(i===35&&d.getMonth()!==m.getMonth())break;
    const dot=l.length?`<i class="${l.every(x=>x.done)?'alldone':''}"></i>`:'',dis=minKey&&k<minKey;
    g+=`<button class="cd${d.getMonth()!==m.getMonth()?' out':''}${k===t0?' today':''}${k===sel?' sel':''}" data-day="${k}" ${dis?'disabled':''} aria-label="${d.getMonth()+1}월 ${d.getDate()}일">${d.getDate()}${dot}</button>`}
  return `<div class="cal-h"><button data-cm="-1" aria-label="이전 달">${CL}</button><b>${m.getFullYear()}년 ${m.getMonth()+1}월</b><button data-cm="1" aria-label="다음 달">${CR}</button></div><div class="cal-g">${g}</div>`;
}
function renderCal(){$('cal').innerHTML=calHTML(calMonth,dk(todoDay))}
function openCal(o){$('cal').hidden=!o;$('tdLabelBtn').setAttribute('aria-expanded',o);if(o){calMonth=new Date(todoDay.getFullYear(),todoDay.getMonth(),1);renderCal()}}
$('tdLabelBtn').onclick=e=>{e.stopPropagation();openCal($('cal').hidden)};
$('cal').addEventListener('click',e=>{e.stopPropagation();
  const c=e.target.closest('[data-cm]');if(c){calMonth=new Date(calMonth.getFullYear(),calMonth.getMonth()+ +c.dataset.cm,1);renderCal();return}
  const d=e.target.closest('[data-day]');if(d){openCal(false);setTodoDay(pk(d.dataset.day))}});
calScroll($('cal'),'.cal-g,.cal-h',d=>{calMonth=new Date(calMonth.getFullYear(),calMonth.getMonth()+d,1);renderCal()});
document.addEventListener('click',()=>{if(!$('cal').hidden)openCal(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('cal').hidden){openCal(false);$('tdLabelBtn').focus()}});
$('addTask').addEventListener('submit',e=>{
  e.preventDefault();const v=$('taskInput').value.trim();if(!v)return;
  lastSub=$('taskSub').value;const est=EX().pva?+$('taskEst').value:0;list().unshift(Object.assign({id:uid(),text:v,done:false,star:false,sid:lastSub||null},est?{est}:{}));$('taskInput').value='';save();renderTasks();
});
function onTaskClick(e){
  const b=e.target.closest('[data-act]');if(!b)return;const li=b.closest('.task'),id=li.dataset.id,l=list(),t=l.find(x=>x.id===id);if(!t)return;
  const a=b.dataset.act;
  if(a==='check'){
    if(li.dataset.busy)return;li.dataset.busy='1';
    const done=!t.done,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(done){li.classList.add('striking');ding()}else{li.classList.remove('done');li.classList.add('unstriking')}
    setTimeout(()=>{
      li.style.height=li.offsetHeight+'px';li.offsetHeight;li.classList.add('collapse');li.style.height='0px';
      setTimeout(()=>{t.done=done;save();arriveId=t.id;renderTasks();arriveId=null},rm?0:290);
    },rm?0:(done?520:260));
  }
  if(a==='star'){t.star=!t.star;save();renderTasks()}
  if(a==='rm'){l.splice(l.indexOf(t),1);save();renderTasks()}
  if(a==='edit'){editTask=id;renderTasks()}
}
function commitEdit(){
  const t=list().find(x=>x.id===editTask);
  if(t){const i=$('e-'+t.id),s=$('es-'+t.id),es=$('ee-'+t.id);if(i&&i.value.trim())t.text=i.value.trim();if(s)t.sid=s.value||null;if(es){const v=+es.value;if(v)t.est=v;else delete t.est}}
  editTask=null;save();renderTasks();
}
['todo','done'].forEach(id=>{const u=$(id);u.addEventListener('click',onTaskClick);
  u.addEventListener('focusout',e=>{if(!editTask)return;const li=e.target.closest('.task');if(li&&e.relatedTarget&&li.contains(e.relatedTarget))return;commitEdit()});
  u.addEventListener('keydown',e=>{if(e.target.classList.contains('edit')){if(e.key==='Enter'){e.preventDefault();commitEdit()}if(e.key==='Escape'){editTask=null;renderTasks()}}});
});
$('doneToggle').onclick=()=>{doneOpen=!doneOpen;renderTasks()};

/* ---------- retro ---------- */

/* ---------- D-day ---------- */
function renderDday(){
  if(!$('dday'))return;
  const d=S.dday,b=$('dday');
  b.hidden=!d||!d.date;if(b.hidden)return;
  const n=Math.round((pk(d.date)-today0())/864e5);
  b.innerHTML=`${esc(d.name||'D-day')}<b>${n>0?'D-'+n:n===0?'D-DAY':'D+'+(-n)}</b>`;
}

$('ddForm').addEventListener('submit',e=>{e.preventDefault();const dt=$('ddDate').value;S.dday={name:$('ddName').value.trim(),date:dt,start:(S.dday&&S.dday.date===dt&&S.dday.start)||dk(today0())};save();renderDday()});
$('dday').onclick=()=>{setTab('set');setPage='dday';renderSet()};
$('ddDel').onclick=()=>{S.dday=null;$('ddName').value='';$('ddDate').value='';save();renderDday()};
