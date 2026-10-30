/* ---------- 오늘의 목적지 추천 (홈) ----------
   보유 마일리지와 오늘 더 공부할 시간으로 "어디까지 갈 수 있는지"를 홈에 보여 준다.
   - 이동 중이면: 목적지까지 남은 공부 시간, 오늘 목표를 채우면 도착하는지
   - 쉬는 중이면: 지금 바로 갈 수 있는 가장 먼 곳 + 오늘 목표를 채우면 갈 수 있는 가장 먼 곳
   오늘 더 공부할 시간 = 목표 시간이 있으면 남은 목표, 없으면 2시간 (하루 8시간까지만 마일리지가 쌓이는 것도 반영)
   국내 여행이 기본이고, 세계 여행이 열려 있고 세계 탭을 보고 있었으면 세계 기준으로 추천한다.
   추천을 누르면 여행 탭에서 그 목적지를 검색해 보여 준다 (출발은 거기서 직접). */
(function(){
  const box=$('todayDest');if(!box)return;
  const CAP=8*36e5,DEF=2*36e5;
  let key='';
  function plan(){
    const pd=perDay(true),today=(pd[dk(today0())]||{study:0}).study;
    const goal=(S.goal||0)*6e4,want=goal?Math.max(0,goal-today):DEF;
    const more=Math.max(0,Math.min(want,CAP-today));
    return {more,miles:more/MILE_MS*mileRate(),goal:!!goal,goalDone:goal>0&&today>=goal}; // 구독 중이면 1.5배
  }
  function world(T){return T.world==='earth'&&typeof worldOpen==='function'&&worldOpen(T)?'earth':'korea'}
  function pick(rows,avail,fut){
    // rows: [id, 이름, 부가 설명, 비용]. 지금 갈 수 있는 곳 중 가장 먼 곳, 오늘 더 공부하면 갈 수 있는 곳 중 가장 먼 곳
    let now=null,later=null;
    for(const x of rows){if(x[3]<=avail){if(!now||x[3]>now[3])now=x}else if(x[3]<=fut){if(!later||x[3]>later[3])later=x}}
    // 오늘 더 공부해도 새로 갈 곳이 없으면, 보유 마일리지보다 비싼 곳 중 가장 가까운 곳을 다음 목표로
    if(!later){later=rows.filter(x=>x[3]>avail).reduce((a,x)=>!a||x[3]<a[3]?x:a,null)}
    return {now,later};
  }
  function render(){
    const T=tr();
    if(!T.on){box.hidden=true;return}
    const avail=Math.max(0,totalMiles()-T.used),P=plan(),w=world(T),K=kr(T);
    const k=[w,Math.floor(avail),Math.floor(P.miles),K.at,K.to,T.at,T.to,K.done.length,T.stamps.length,P.goal,subOn()].join('|');
    if(k===key&&!box.hidden)return;key=k;
    const until=P.goal?'오늘 목표를 채우면':'오늘 2시간 더 공부하면';
    let h='';
    const to=w==='korea'?K.to:T.to;
    if(to){
      const name=w==='korea'?KRM[to]&&KRM[to][1]:NAT[to]&&NAT[to][2];
      const left=Math.max(0,(w==='korea'?krTC(K):wTC(T))-avail);
      if(!name){box.hidden=true;return}
      h=`<div class="td-h"><span>오늘의 목적지</span><small>이동 중</small></div>
        <button class="td-row" data-tdgo="${w}:${to}"><b>${esc(name)}</b><span>${left<=0?'곧 도착해요':`도착까지 공부 <em>${studyFor(left)}</em>`}</span>
        <small>${left<=0?'':left<=P.miles?`${until} 오늘 도착해요`:P.goalDone?'오늘 목표는 채웠어요. 조금만 더 가 볼까요?':`${until} ${studyFor(left-P.miles)} 남아요`}</small></button>`;
    }else{
      const rows=w==='korea'
        ?KR.filter(x=>x[0]!==K.at&&!krDone(K,x[0])).map(x=>[x[0],x[1],x[2],krCost(K.at,x[0])])
        :NATIONS.filter(n=>n[0]!==T.at&&!T.stamps.some(s=>s.c===n[0])).map(n=>[n[0],n[2],n[1],flightMin(T.at,n[0])]);
      if(!rows.length){box.hidden=true;return}
      const {now,later}=pick(rows,avail,avail+P.miles);
      const row=(x,tag,sub)=>`<button class="td-row" data-tdgo="${w}:${x[0]}"><b>${esc(x[1])}</b><span>${tag}</span><small>${esc(x[2])} · ${sub}</small></button>`;
      h=`<div class="td-h"><span>오늘의 목적지</span><small>${w==='korea'?'국내':'세계'} · 보유 ${Math.floor(avail).toLocaleString()} 마일리지</small></div><div class="td-list">`
        +(now?row(now,'지금 바로 출발',`${now[3].toLocaleString()} 마일리지`):'')
        +(later?row(later,later[3]<=avail+P.miles?until:`공부 ${studyFor(later[3]-avail)} 더`,`${later[3].toLocaleString()} 마일리지`):'')
        +'</div>';
    }
    box.innerHTML=h;box.hidden=false;
  }
  box.addEventListener('click',e=>{
    const b=e.target.closest('[data-tdgo]');if(!b)return;
    const [w,id]=b.dataset.tdgo.split(':'),T=tr();T.world=w;save();
    const moving=w==='korea'?kr(T).to:T.to;
    if(!moving){
      if(w==='korea'){const x=KRM[id];if(x){krQ=x[1];$('krSearch').value=x[1]}}
      else{const n=NAT[id];if(n){tvQuery=n[2];$('tvSearch').value=n[2]}}
    }
    setTab('travel');
    setTimeout(()=>{const el=document.querySelector(w==='korea'?(moving?'#krTrip':'#krList'):(moving?'#tvFlight':'#tvList'));if(el&&el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'center'})},120);
  });
  window.renderTodayDest=()=>{key='';render()};
  setInterval(()=>{if(!document.hidden&&tab==='home')render()},5e3);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
  render();
})();
