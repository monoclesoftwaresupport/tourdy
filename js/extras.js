/* ---------- 선택 기능 (설정 → 추가 기능에서 켬) ---------- */
const EX=()=>{const e=Object.assign({books:false,pva:false,postcard:false},S.extra||{});delete e.noise;return e};
const EST=[0,30,60,90,120,180];
/* 계획 vs 실제 */
function renderPva(){
  const on=EX().pva;$('pvaPanel').hidden=!on;$('taskEst').hidden=!on;if(!on)return;
  const l=S.tasks[dk(todoDay)]||[],act=dayStats(todoDay).by,plan={};let pt=0;
  l.forEach(t=>{if(t.est){const k=t.sid||'_';plan[k]=(plan[k]||0)+t.est*6e4;pt+=t.est*6e4}});
  const keys=[...new Set([...Object.keys(plan),...Object.keys(act)])],at=Object.values(act).reduce((a,b)=>a+b,0),mx=Math.max(1,...keys.map(k=>Math.max(plan[k]||0,act[k]||0)));
  $('pvaTot').innerHTML=`계획 <b>${fmtH(pt)}</b> · 실제 <b>${fmtH(at)}</b>${pt?` · <b class="${at>=pt?'ok':'lo'}">${Math.round(at/pt*100)}%</b>`:''}`;
  $('pvaList').innerHTML=keys.length?keys.map(k=>{const sb=k==='_'?null:subj(k),c=sb?.color||'#8D8D86',p=plan[k]||0,a=act[k]||0;
    return `<li><span class="pn"><span class="dot" style="--c:${c}"></span>${sb?esc(sb.name):'과목 없음'}</span><div class="pb"><i class="pp" style="width:${p/mx*100}%"></i><i class="pa" style="--c:${c};width:${a/mx*100}%"></i></div><span class="pv">${fmtH(a)} / ${p?fmtH(p):'–'}</span></li>`}).join('')
    :'<li class="empty">할 일에 예상 시간을 적으면 여기서 비교돼요</li>';
}
/* 교재 진도 */
let bookOpen=null,bookArm=null;
const bookDone=b=>b.rounds.reduce((a,r)=>a+r.length,0);
const bookRound=b=>{for(let i=0;i<b.target;i++)if((b.rounds[i]||[]).length<b.units)return i;return b.target-1};
function renderBooks(){
  const on=EX().books;$('booksPanel').hidden=!on;if(!on)return;
  const B=S.books||(S.books=[]);let pace='';
  if(S.dday){const days=Math.round((pk(S.dday.date)-today0())/864e5);const left=B.reduce((a,b)=>a+b.units*b.target-bookDone(b),0);
    pace=days>0&&left>0?`D-${days} · 남은 ${left}강 · 하루 <b>${Math.ceil(left/days)}강</b>씩이면 목표 회독을 마쳐요`:days<=0?'D-day가 지났어요':'목표 회독을 모두 마쳤어요';}
  else pace='설정에서 D-day를 정하면 하루에 몇 강씩 해야 하는지 알려 줘요';
  $('bookPace').innerHTML=pace;
  $('bookList').innerHTML=B.map(b=>{const sb=b.sid&&subj(b.sid),r=bookRound(b),done=bookDone(b),tot=b.units*b.target,open=bookOpen===b.id,rr=b.rounds[r]||[],view=open?(b.view??r):r,vr=b.rounds[view]||[];
    return `<li class="book${open?' open':''}" data-b="${b.id}"><button class="bh" data-bk="toggle"><span class="dot" style="--c:${sb?.color||'#8D8D86'}"></span><span class="bn">${esc(b.name)}</span>
      <span class="br">${r+1}회독 · ${rr.length}/${b.units}강</span></button>
      <div class="bbar"><i style="width:${done/tot*100}%;--c:${sb?.color||'var(--accent)'}"></i></div><div class="bmeta">전체 ${done}/${tot}강 · 목표 ${b.target}회독</div>
      ${open?`<div class="bbody"><div class="seg brounds">${Array.from({length:b.target},(_,i)=>`<button data-bk="round" data-i="${i}" aria-pressed="${i===view}">${i+1}회독</button>`).join('')}</div>
        <div class="units">${Array.from({length:b.units},(_,i)=>`<button data-bk="unit" data-u="${i+1}" aria-pressed="${vr.includes(i+1)}">${i+1}</button>`).join('')}</div>
        <div class="bedit"><input class="field" data-be="name" value="${esc(b.name)}" aria-label="교재 이름">
          <select class="field" data-be="sid" aria-label="과목">${subOpts(b.sid,'과목 없음')}</select>
          <label class="goalin">강 수 <input class="field" data-be="units" type="number" min="1" max="200" value="${b.units}"></label>
          <label class="goalin">목표 회독 <input class="field" data-be="target" type="number" min="1" max="5" value="${b.target}"></label>
          <button class="primary" data-bk="save">저장</button></div>
        <button class="del${bookArm===b.id?' arm':''}" data-bk="del">${bookArm===b.id?'삭제 확인':'교재 삭제'}</button></div>`:''}</li>`}).join('')||'<li class="empty">교재를 추가해 보세요</li>';
}
$('bookList').addEventListener('click',e=>{const x=e.target.closest('[data-bk]');if(!x)return;const li=x.closest('.book'),b=S.books.find(q=>q.id===li.dataset.b);if(!b)return;
  const k=x.dataset.bk;
  if(k==='toggle'){bookOpen=bookOpen===b.id?null:b.id;bookArm=null;b.view=undefined}
  if(k==='round')b.view=+x.dataset.i;
  if(k==='unit'){const v=b.view??bookRound(b),u=+x.dataset.u,r=b.rounds[v]||(b.rounds[v]=[]);const i=r.indexOf(u);if(i<0)r.push(u);else r.splice(i,1);b.view=v;save()}
  if(k==='save'){const v=n=>li.querySelector(`[data-be="${n}"]`).value;const nm=v('name').trim();if(nm)b.name=nm;b.sid=v('sid')||null;
    b.units=Math.min(200,Math.max(1,parseInt(v('units'))||b.units));b.target=Math.min(5,Math.max(1,parseInt(v('target'))||b.target));
    b.rounds=b.rounds.slice(0,b.target).map(r=>(r||[]).filter(u=>u<=b.units));if(b.view>=b.target)b.view=undefined;save();toast('교재 정보를 저장했어요')}
  if(k==='del'){if(bookArm===b.id){S.books=S.books.filter(q=>q!==b);bookOpen=null;bookArm=null;save()}else bookArm=b.id}
  renderBooks()});
$('bookForm').addEventListener('submit',e=>{e.preventDefault();const n=$('bookName').value.trim(),u=parseInt($('bookUnits').value);if(!n||!(u>0))return;
  (S.books||(S.books=[])).push({id:uid(),name:n,units:Math.min(200,u),target:Math.min(5,Math.max(1,parseInt($('bookTarget').value)||1)),sid:$('bookSub').value||null,rounds:[]});
  $('bookName').value='';$('bookUnits').value='';save();renderBooks()});
function renderExtras(){renderPva();renderBooks()}

/* ---------- 첫 실행 안내 ---------- */
const WL=[['국어','book'],['영어','globe'],['수학','fx'],['과학','flask'],['사회','chart'],['한국사','note'],['경제','trend'],['통계','dice'],['코딩','laptop'],['자격증','target']];
let wlSel=new Set(),wlExtra=[];
function renderWelcome(){const show=!!S.welcome&&!liveSubs().length;$('welcome').hidden=!show;if(!show)return;
  $('wlChips').innerHTML=[...WL.map(w=>w[0]),...wlExtra].map(n=>`<button data-wl="${esc(n)}" aria-pressed="${wlSel.has(n)}">${esc(n)}</button>`).join('');
  $('wlGo').disabled=!wlSel.size;$('wlGo').textContent=wlSel.size?`${wlSel.size}과목으로 시작하기`:'과목을 골라 주세요'}
$('wlChips').addEventListener('click',e=>{const b=e.target.closest('[data-wl]');if(!b)return;const n=b.dataset.wl;wlSel.has(n)?wlSel.delete(n):wlSel.add(n);renderWelcome()});
function wlAddCustom(){const v=$('wlCustom').value.trim();if(!v)return;if(!wlExtra.includes(v)&&!WL.some(w=>w[0]===v))wlExtra.push(v);wlSel.add(v);$('wlCustom').value='';renderWelcome()}
$('wlAdd').onclick=wlAddCustom;$('wlCustom').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();wlAddCustom()}});
$('wlSkip').onclick=()=>{S.welcome=false;save();renderWelcome();setHome('preset')};
$('wlGo').onclick=()=>{if(!wlSel.size)return;let i=0;
  for(const n of wlSel){const w=WL.find(x=>x[0]===n);S.subjects.push({id:uid(),name:n,color:SW[(i*3+5)%SW.length],goal:0,icon:w?w[1]:'book'});i++}
  S.welcome=false;save();renderAll();toast('준비됐어요. 과목 옆 ▶를 눌러 공부를 시작하세요')};

/* ---------- 주간 리포트 ---------- */
const weekOf=d=>addD(d,-((d.getDay()-wkStart()+7)%7));
function weekSum(ws){const pd=perDay();const o={study:0,rest:0,waste:0,by:{},days:[]};
  for(let i=0;i<7;i++){const d=addD(ws,i),e=pd[dk(d)]||{by:{},study:0,rest:0,waste:0};o.days.push([d,e.study]);o.study+=e.study;o.rest+=e.rest;o.waste+=e.waste;for(const k in e.by)o.by[k]=(o.by[k]||0)+e.by[k]}
  return o}
function showReport(){
  const ws=addD(weekOf(today0()),-7),A=weekSum(ws),B=weekSum(addD(ws,-7)),md=d=>`${d.getMonth()+1}/${d.getDate()}`;
  const diff=A.study-B.study,act=A.days.filter(x=>x[1]>0).length,eff=A.study+A.rest+A.waste?Math.round(A.study/(A.study+A.rest+A.waste)*100):null;
  const top=Object.entries(A.by).sort((a,b)=>b[1]-a[1]),best=A.days.reduce((b,c)=>c[1]>b[1]?c:b,[null,0]),mx=top.length?top[0][1]:1;
  $('reportBody').innerHTML=`<div class="rp-h"><small>WEEKLY REPORT · ${md(ws)} – ${md(addD(ws,6))}</small><h2 id="reportH">지난주 공부 리포트</h2></div>
    <div class="rp-big"><b>${fmtH(A.study)}</b><span class="${diff>=0?'up':'down'}">${B.study||A.study?(diff>=0?'▲ ':'▼ ')+fmtH(Math.abs(diff))+' 지지난주 대비':''}</span></div>
    <div class="rp-grid"><div><small>집중한 날</small><b>${act}일</b></div><div><small>하루 평균</small><b>${fmtH(A.study/7)}</b></div>
      <div><small>집중 효율</small><b>${eff==null?'–':eff+'%'}</b></div><div><small>최고의 날</small><b>${best[0]?`${md(best[0])} ${DOW[best[0].getDay()]}`:'–'}</b></div></div>
    ${top.length?`<div class="rp-sub"><small>과목별</small>${top.slice(0,5).map(([k,v])=>{const sb=subj(k);return `<div class="rp-bar"><span>${sb?esc(sb.name):'과목'}</span><i style="--c:${sb?.color||'#8D8D86'};width:${v/mx*100}%"></i><b>${fmtH(v)}</b></div>`}).join('')}</div>`:'<p class="note">지난주에는 공부 기록이 없어요. 이번 주에 첫 기록을 남겨 보세요.</p>'}`;
  $('report').hidden=false;
}
$('reportClose').onclick=()=>{$('report').hidden=true};
$('report').addEventListener('click',e=>{if(e.target.id==='report')$('report').hidden=true});
$('openReport').onclick=showReport;
function maybeReport(){const k=dk(weekOf(today0()));if(S.lastReport===k)return;const had=S.lastReport!=null;S.lastReport=k;save();
  if(weekSum(addD(weekOf(today0()),-7)).study>0||had)showReport()}
