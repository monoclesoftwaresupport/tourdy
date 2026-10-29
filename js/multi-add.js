/* ---------- 할 일 한번에 여러 개 생성: 달력에서 날짜를 여러 개 골라 같은 할 일을 한꺼번에 추가 ---------- */
(function(){
  let open=false,month=null,sel=new Set(),msg='';
  const box=$('multiBox'),btn=$('multiOpen');
  const minKey=()=>dk(today0());
  function render(){
    box.hidden=!open;btn.setAttribute('aria-expanded',open);btn.textContent=open?'× 여러 날짜 선택 닫기':'+ 한번에 여러개 생성';
    if(!open)return;
    const m=month,first=new Date(m.getFullYear(),m.getMonth(),1),start=addD(first,-first.getDay()),t0=minKey();
    let g=[...DOW].map(d=>`<span class="wd">${d}</span>`).join('');
    for(let i=0;i<42;i++){const d=addD(start,i),k=dk(d),l=S.tasks[k]||[];
      if(i===35&&d.getMonth()!==m.getMonth())break;
      const dot=l.length?`<i class="${l.every(x=>x.done)?'alldone':''}"></i>`:'';
      g+=`<button type="button" class="cd${d.getMonth()!==m.getMonth()?' out':''}${k===t0?' today':''}${sel.has(k)?' sel':''}" data-md="${k}" ${k<t0?'disabled':''} aria-pressed="${sel.has(k)}" aria-label="${d.getMonth()+1}월 ${d.getDate()}일">${d.getDate()}${dot}</button>`}
    const text=$('taskInput').value.trim(),n=sel.size;
    box.innerHTML=`<div class="multi-top"><b>날짜를 여러 개 골라요</b><span class="note">같은 할 일이 고른 날마다 하나씩 생겨요</span></div>
      <div class="cal inline multi-cal"><div class="cal-h"><button type="button" data-mm="-1" aria-label="이전 달">${CL}</button><b>${m.getFullYear()}년 ${m.getMonth()+1}월</b><button type="button" data-mm="1" aria-label="다음 달">${CR}</button></div><div class="cal-g">${g}</div></div>
      <p class="note multi-sum">${n?`${n}일 선택됨 · ${[...sel].sort().slice(0,4).map(k=>{const d=pk(k);return `${d.getMonth()+1}/${d.getDate()}`}).join(', ')}${n>4?` 외 ${n-4}일`:''}`:'달력에서 날짜를 눌러 골라 주세요'}</p>
      ${msg?`<p class="err" role="alert">${esc(msg)}</p>`:''}
      <div class="multi-a"><button type="button" class="secondary" data-mx="cancel">취소</button><button type="button" class="primary" data-mx="go" ${n?'':'disabled'}>${n?`${n}일에 ${text?`'${esc(text.length>12?text.slice(0,12)+'…':text)}' `:''}추가`:'날짜를 골라 주세요'}</button></div>`;
  }
  function openBox(o){open=o;msg='';if(o){month=new Date(todoDay.getFullYear(),todoDay.getMonth(),1);sel=new Set();if(dk(todoDay)>=minKey())sel.add(dk(todoDay))}render();if(o)$('taskInput').focus()}
  function commit(){
    const text=$('taskInput').value.trim();
    if(!text){msg='먼저 위 칸에 할 일 내용을 적어 주세요.';render();$('taskInput').focus();return}
    if(!sel.size)return;
    const sid=$('taskSub').value||null,est=EX().pva?+$('taskEst').value:0,keys=[...sel].sort();
    for(const k of keys)(S.tasks[k]||(S.tasks[k]=[])).unshift(Object.assign({id:uid(),text,done:false,star:false,sid},est?{est}:{}));
    lastSub=sid||'';$('taskInput').value='';save();open=false;render();renderTasks();
    toast(`'${text}'을(를) ${keys.length}일에 추가했어요`);
  }
  btn.onclick=()=>openBox(!open);
  box.addEventListener('click',e=>{
    const d=e.target.closest('[data-md]');if(d&&!d.disabled){const k=d.dataset.md;sel.has(k)?sel.delete(k):sel.add(k);msg='';render();return}
    const mm=e.target.closest('[data-mm]');if(mm){month=new Date(month.getFullYear(),month.getMonth()+ +mm.dataset.mm,1);render();return}
    const x=e.target.closest('[data-mx]');if(x){if(x.dataset.mx==='go')commit();else openBox(false)}
  });
  // 할 일 내용을 고치면 추가 버튼 문구만 갱신
  $('taskInput').addEventListener('input',()=>{if(open){const b=box.querySelector('[data-mx="go"]'),t=$('taskInput').value.trim(),n=sel.size;if(b&&n)b.textContent=`${n}일에 ${t?`'${t.length>12?t.slice(0,12)+'…':t}' `:''}추가`}});
  // 다른 날로 이동하면 닫는다
  {const base=setTodoDay;setTodoDay=d=>{if(open){open=false;render()}base(d)}}
  $('tdPrev').onclick=()=>setTodoDay(addD(todoDay,-1));
  $('tdNext').onclick=()=>setTodoDay(addD(todoDay,1));
  $('tdToday').onclick=()=>setTodoDay(today0());
})();
