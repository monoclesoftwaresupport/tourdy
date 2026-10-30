/* ---------- 투어디 플러스(구독) 화면과 혜택 ----------
   계산 함수는 js/sub-core.js. 여기서는 화면·버튼·자동 처리만.
   혜택: 마일리지 1.5배 · 여러 기기 실시간 동기화 · 프리미엄 티켓 스킨·지도 테마 · 상세 분석 · 매달 휴무 도장 +2 · 광고 없이 하루 보너스
   결제는 아직 없음: 테스트 모드(TRAVEL_TEST)에서만 구독을 켜고 끌 수 있다. */
(function(){
  const DAILY=10; // 광고 없이 받는 하루 보너스 (공부 1시간어치)
  const t0k=()=>dk(today0()),ym=()=>t0k().slice(0,7);
  const bonusId=()=>'plus:'+t0k();
  const claimed=()=>(S.gifts||[]).some(g=>g&&g.id===bonusId());
  const isTest=()=>{try{return TRAVEL_TEST===true}catch(e){return false}};
  const LOCK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  const STAR='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.2 6.1 20.5l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';

  /* ===== 휴무 도장 ===== */
  function grantMonthly(){const R=RESTP();if(subOn()&&!R.months.includes(ym())){R.months.push(ym());R.stamps=Math.min(REST_MAX,R.stamps+2);return true}return false}
  // 어제 공부를 못 했으면 휴무 도장으로 연속 공부를 이어 준다 (그제까지 2일 이상 이어 왔고, 이틀 연속 휴무는 안 됨)
  function restAuto(){
    if(!S||!S.sessions)return;
    let changed=grantMonthly();
    const R=RESTP(),pd=perDay(true),ok=k=>pd[k]&&pd[k].study>=6e4,y=dk(addD(today0(),-1)),y2=dk(addD(today0(),-2));
    if(R.stamps>0&&!ok(y)&&!R.days.includes(y)&&ok(y2)){
      const rs=restSet();let n=0,d=addD(today0(),-2);while(ok(dk(d))||rs.has(dk(d))){if(ok(dk(d)))n++;d=addD(d,-1)}
      if(n>=2){R.days.push(y);R.stamps--;changed=true;
        setTimeout(()=>toast(`어제는 휴무일로 처리해서 ${n}일 연속 공부가 이어져요 · 남은 휴무 도장 ${R.stamps}장`),800)}
    }
    if(changed){save();try{if(tab==='travel')renderTravel()}catch(e){}}
  }
  const stampDots=()=>{const n=RESTP().stamps;return Array.from({length:REST_MAX},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')};
  function restRow(){const R=RESTP();return `<div class="rest-row"><div><b>휴무 도장</b><span class="rest-dots" aria-label="${R.stamps}장">${stampDots()}</span></div>
    <p class="note">하루 공부를 못 해도 다음 날 앱을 열면 도장 1장으로 정기권이 이어져요. 이틀 연속은 안 돼요. ${subOn()?'플러스는 매달 2장을 더 받아요.':'플러스는 매달 2장을 더 받아요 (최대 3장).'}${R.days.length?` · 지금까지 휴무 ${R.days.length}일`:''}</p></div>`}

  /* ===== 하루 보너스 (광고 없이) ===== */
  function claimBonus(){if(!subOn()||claimed())return;S.gifts=S.gifts||[];S.gifts.push({id:bonusId(),m:DAILY,t:'플러스 하루 보너스',d:t0k()});save();toast(`플러스 하루 보너스 +${DAILY} 마일리지`);refresh()}
  window.subBonusChip=()=>subOn()&&!claimed()?`<button class="plus-chip" data-subbonus>${STAR}오늘의 플러스 보너스 +${DAILY} 받기</button>`:'';

  /* ===== 구독 화면 ===== */
  const BEN=[
    ['mile','마일리지 1.5배','구독한 날의 공부는 1.5배로 쌓여요. 하루 최대 120 마일리지까지.','1배 · 하루 최대 80'],
    ['sync','여러 기기 실시간 동기화','폰·태블릿·PC에서 기록이 바로 맞춰져요.','계정에 자동 보관 · 앱을 열 때 맞춤'],
    ['skin','프리미엄 꾸미기','홀로그램·빈티지 티켓 스킨, 고지도·야경·위성 지도 테마.','기본 티켓 · 기본 지도'],
    ['stat','상세 분석','시간대별 집중, 이번 주 vs 지난주 과목별 비교, 월별 추세.','기본 통계'],
    ['rest','매달 휴무 도장 +2','하루 쉬어도 정기권과 연속 보너스가 끊기지 않아요.','처음 1장'],
    ['gift','광고 없이 하루 보너스','매일 한 번 +10 마일리지를 바로 받아요.','광고를 보고 받기']];
  const ICON={mile:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',sync:'<path d="M20 11a8 8 0 0 0-14-5l-2 2M4 13a8 8 0 0 0 14 5l2-2"/><path d="M4 4v4h4M20 20v-4h-4"/>',skin:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M15 6v12" stroke-dasharray="2 2"/>',stat:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',rest:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',gift:'<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M3 13h18M12 9C9 9 7 7 8.5 5.5S12 7 12 9c0-2 2-4.5 3.5-3.5S15 9 12 9"/>'};
  function renderSubPage(){
    const P=SUBP(),on=subOn(),since=on&&P.log.length?P.log[P.log.length-1].from:null;
    $('subBody').innerHTML=`<div class="plus-hero${on?' on':''}"><span class="plus-k">${STAR}TOURDY PLUS</span><b>${on?'투어디 플러스 구독 중':'더 멀리, 더 빨리 떠나요'}</b>
        <span>${on?`${since.replace(/-/g,'.')}부터 · 오늘 공부는 1.5배로 쌓이고 있어요`:'공부한 시간이 1.5배 마일리지가 되고, 모든 기기에서 이어져요'}</span></div>
      <ul class="plus-ben">${BEN.map(([k,t,d,f])=>`<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg><div><b>${t}</b><span>${d}</span><small>무료: ${f}</small></div></li>`).join('')}</ul>
      ${on?`${window.subBonusChip()}<div class="plus-acts"><p class="note">해지해도 이미 받은 마일리지와 도장은 그대로예요. 다음 결제일부터 무료로 바뀌어요.</p>${isTest()?'<button class="secondary" data-subtest>테스트: 구독 끄기</button>':''}</div>`
      :`<div class="plus-price"><button class="plus-plan on" data-plan="y"><small>연간 · 25% 할인</small><b>${SUB_PRICE.y}<em>/년</em></b><span>월 $3 꼴</span></button><button class="plus-plan" data-plan="m"><small>월간</small><b>${SUB_PRICE.m}<em>/월</em></b><span>언제든 해지</span></button></div>
        <button class="primary plus-go" data-subtrial>7일 무료로 시작하기</button>
        <p class="note">무료 체험이 끝나면 고른 요금제로 결제돼요. 체험 중에 해지하면 결제되지 않아요.${isTest()?'':' 결제는 스토어 출시 때 연결돼요.'}</p>
        ${isTest()?'<button class="secondary" data-subtest>테스트: 결제 없이 구독 켜기</button>':''}`}
      ${restRow()}
      <p class="note plus-fair">순위·주간 챌린지는 마일리지가 아니라 실제 공부 시간으로 매겨서 구독 여부와 상관없이 공평해요.</p>`;
  }
  let plan='y';

  /* ===== 꾸미기 ===== */
  function applySkin(){const o=TOPT(),sk=subOn()?(o.skin||'base'):'base';document.documentElement.classList.toggle('skin-holo',sk==='holo');document.documentElement.classList.toggle('skin-vintage',sk==='vintage')}
  function markTravelSet(){
    const on=subOn(),o=TOPT();
    $('mapTheme').querySelectorAll('[data-mt]').forEach(b=>{const lock=!on&&b.dataset.mt!=='base';b.classList.toggle('locked',lock);if(lock&&!b.querySelector('svg'))b.insertAdjacentHTML('afterbegin',LOCK);if(!lock)b.querySelector('svg')?.remove()});
    $('tkSkin').querySelectorAll('[data-skin]').forEach(b=>{const lock=!on&&b.dataset.skin!=='base';b.classList.toggle('locked',lock);if(lock&&!b.querySelector('svg'))b.insertAdjacentHTML('afterbegin',LOCK);if(!lock)b.querySelector('svg')?.remove();b.setAttribute('aria-pressed',(on?(o.skin||'base'):'base')===b.dataset.skin)});
  }
  const goSub=msg=>{if(msg)toast(msg);setTab('set');setPage='sub';renderSet();window.scrollTo({top:0,behavior:'smooth'})};
  // 지도 테마: 무료는 기본만 (원래 처리기보다 먼저 가로챈다)
  $('mapTheme').addEventListener('click',e=>{const b=e.target.closest('[data-mt]');if(b&&!subOn()&&b.dataset.mt!=='base'){e.stopImmediatePropagation();goSub('고지도·야경·위성 지도는 투어디 플러스에서 쓸 수 있어요')}},true);
  $('tkSkin').addEventListener('click',e=>{const b=e.target.closest('[data-skin]');if(!b)return;if(!subOn()&&b.dataset.skin!=='base')return goSub('프리미엄 티켓 스킨은 투어디 플러스에서 쓸 수 있어요');TOPT().skin=b.dataset.skin;save();applySkin();markTravelSet()});

  /* ===== 상세 분석 ===== */
  function studySessions(){return (S.sessions||[]).filter(x=>x.kind==='study'&&!x.ex&&x.end>x.start)}
  function hourBuckets(days){const from=today0().getTime()-(days-1)*864e5,b=new Array(24).fill(0);
    for(const x of studySessions()){let t=Math.max(x.start,from);while(t<x.end){const d=new Date(t),nx=new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours()+1).getTime(),e=Math.min(nx,x.end);b[d.getHours()]+=e-t;t=e}}return b}
  function weekCompare(){const ws=(typeof wkStart==='function'?wkStart():1),t=today0(),d0=addD(t,-((t.getDay()-ws+7)%7)),a=d0.getTime(),p=addD(d0,-7).getTime(),now=Date.now(),cur={},prev={};
    for(const x of studySessions()){const add=(o,s,e)=>{const v=Math.max(0,Math.min(e,x.end)-Math.max(s,x.start));if(v)o[x.sid||'']=(o[x.sid||'']||0)+v};add(cur,a,now);add(prev,p,a)}
    return {cur,prev}}
  function monthTotals(){const out=[],t=today0();for(let i=5;i>=0;i--){const s=new Date(t.getFullYear(),t.getMonth()-i,1),e=new Date(t.getFullYear(),t.getMonth()-i+1,1);let v=0;for(const x of studySessions())v+=Math.max(0,Math.min(e,x.end)-Math.max(s,x.start));out.push([s.getMonth()+1,v])}return out}
  function proHTML(sample){
    let hb=hourBuckets(30);if(sample)hb=hb.map((_,h)=>[0,0,0,0,0,0,1,3,6,9,12,10,4,6,11,12,9,5,3,7,10,8,4,1][h]*36e5/10);
    const mx=Math.max(...hb)||1,tot=hb.reduce((a,b)=>a+b,0);
    let best=0,bi=0;for(let h=0;h<24;h++){const v=hb[h]+hb[(h+1)%24];if(v>best){best=v;bi=h}}
    const hours=hb.map((v,h)=>`<i style="--h:${(v/mx*100).toFixed(1)}%" class="${h===bi||h===(bi+1)%24?'top':''}" title="${h}시 · ${fmtH(v)}"></i>`).join('');
    const W=sample?{cur:{a:6*36e5,b:4*36e5},prev:{a:4*36e5,b:5*36e5}}:weekCompare(),ids=[...new Set([...Object.keys(W.cur),...Object.keys(W.prev)])],wm=Math.max(1,...ids.map(k=>Math.max(W.cur[k]||0,W.prev[k]||0)));
    const nm=k=>sample?(k==='a'?'경제수학':'통계학'):(subj(k)?.name||'과목 없음'),col=k=>sample?(k==='a'?'#3b82f6':'#14b8a6'):(subj(k)?.color||'#8D8D86');
    const wk=ids.length?ids.sort((a,b)=>(W.cur[b]||0)-(W.cur[a]||0)).map(k=>{const c=W.cur[k]||0,p=W.prev[k]||0,d=c-p;
      return `<li style="--c:${col(k)}"><span class="pw-n">${esc(nm(k))}</span><span class="pw-b"><i style="width:${(c/wm*100).toFixed(1)}%"></i><s style="width:${(p/wm*100).toFixed(1)}%"></s></span><span class="pw-v">${fmtH(c)}<small class="${d>=0?'up':'down'}">${d>=0?'▲':'▼'} ${fmtH(Math.abs(d))}</small></span></li>`}).join(''):'<li class="note">이번 주와 지난주 기록이 아직 없어요</li>';
    let mt=sample?[[5,40],[6,52],[7,61],[8,58],[9,74],[10,88]].map(([m,h])=>[m,h*36e5]):monthTotals();const mm=Math.max(1,...mt.map(x=>x[1]));
    const months=mt.map(([m,v])=>`<div><i style="--h:${(v/mm*100).toFixed(1)}%"></i><b>${Math.round(v/36e5)}</b><small>${m}월</small></div>`).join('');
    return `<div class="ps-sec"><div class="ps-h"><b>시간대별 집중</b><small>최근 30일 · ${fmtH(tot)}</small></div>
        <div class="ps-hours" role="img" aria-label="${tot?`가장 많이 공부한 시간대는 ${bi}시~${(bi+2)%24}시`:'기록 없음'}">${hours}</div><div class="ps-hx"><span>0시</span><span>6시</span><span>12시</span><span>18시</span><span>24시</span></div>
        <p class="ps-tip">${tot?`<b>${bi}시~${(bi+2)%24}시</b>에 가장 집중이 잘 돼요. 어려운 과목은 이 시간에 배치해 보세요.`:'공부 기록이 쌓이면 집중이 잘 되는 시간대를 알려 드려요.'}</p></div>
      <div class="ps-sec"><div class="ps-h"><b>이번 주 vs 지난주</b><small><i class="lg cur"></i>이번 주 <i class="lg prev"></i>지난주</small></div><ul class="ps-week">${wk}</ul></div>
      <div class="ps-sec"><div class="ps-h"><b>월별 공부 시간</b><small>최근 6개월 · 시간</small></div><div class="ps-months">${months}</div></div>`;
  }
  function renderPro(){const el=$('proStats');if(!el)return;const on=subOn();
    el.innerHTML=`<div class="panel-head"><h2>상세 분석</h2><span class="plus-badge">${STAR}플러스</span></div>`+(on?proHTML(false)
      :`<div class="ps-lock"><div class="ps-blur" aria-hidden="true" inert>${proHTML(true)}</div><div class="ps-over">${LOCK}<b>시간대별 집중과 주간 비교</b><span>투어디 플러스에서 내 공부 패턴을 자세히 볼 수 있어요</span><button class="primary" data-subgo>플러스 알아보기</button></div></div>`)}

  /* ===== 연결 ===== */
  function refresh(){try{applySkin();if(typeof renderTodayDest==='function')renderTodayDest();if(tab==='set')renderSet();if(tab==='stats')renderStats();if(tab==='travel')renderTravel()}catch(e){}}
  function toggleSub(on){setSub(on);grantMonthly();save();applySkin();try{window.TourdyAccount&&TourdyAccount.relisten&&TourdyAccount.relisten()}catch(e){}refresh();toast(on?'투어디 플러스를 켰어요 (테스트)':'투어디 플러스를 껐어요 (테스트)')}
  window.subTestBtn=()=>isTest()?`<button data-subtest>플러스 ${subOn()?'끄기':'켜기'}</button>`:'';
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-subtest]')&&isTest()){toggleSub(!subOn());return}
    if(e.target.closest('[data-subbonus]')){claimBonus();return}
    if(e.target.closest('[data-subgo]')){goSub();return}
    const pl=e.target.closest('[data-plan]');if(pl){plan=pl.dataset.plan;document.querySelectorAll('.plus-plan').forEach(b=>b.classList.toggle('on',b===pl));return}
    if(e.target.closest('[data-subtrial]')){if(isTest())toggleSub(true);else toast('결제는 스토어 출시 때 연결돼요');return}
  });
  {const base=renderSet;renderSet=function(){const r=base.apply(this,arguments);if(setPage==='sub')renderSubPage();if(setPage==='travel')markTravelSet();return r}}
  {const base=renderStats;renderStats=function(){const r=base.apply(this,arguments);renderPro();return r}}
  {const base=renderPassCard;renderPassCard=function(){const r=base.apply(this,arguments);const el=$('achPassCard');if(el&&!el.querySelector('.rest-row'))el.insertAdjacentHTML('beforeend',restRow());return r}}
  {const base=renderMilePage;renderMilePage=function(){const r=base.apply(this,arguments);const el=$('mileBody');if(el){
    el.insertAdjacentHTML('afterbegin',subOn()?`<div class="plus-mile on"><span>${STAR}플러스 · 마일리지 1.5배 적용 중</span>${window.subBonusChip()}</div>`:`<button class="plus-mile" data-subgo><span>${STAR}플러스로 마일리지 1.5배</span><small>월 ${SUB_PRICE.m} · 7일 무료</small></button>`);
    if(subOn())el.querySelectorAll('.tv-rules li').forEach(li=>{if(li.textContent.includes('최대 8시간'))li.innerHTML='하루에 <b>최대 8시간</b>까지 쌓여요. 플러스는 1.5배라 <b>최대 120 마일리지</b>예요.'})}return r}}
  applySkin();restAuto();
  setInterval(restAuto,6e4);document.addEventListener('visibilitychange',()=>{if(!document.hidden)restAuto()});
  window.TourdyPlus={toggle:toggleSub,restAuto,claimBonus};
})();
