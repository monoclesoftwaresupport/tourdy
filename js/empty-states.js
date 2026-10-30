/* ---------- 빈 상태 화면: 처음 설치했거나 기록을 지웠을 때 텅 빈 화면 대신 다음 행동을 안내 ---------- */
(function(){
  const hasStudy=()=>(S.sessions||[]).some(x=>x.kind==='study');
  const CHART='<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 40h32"/><rect x="11" y="24" width="6" height="12" rx="1.5"/><rect x="21" y="16" width="6" height="20" rx="1.5"/><rect x="31" y="9" width="6" height="27" rx="1.5"/></svg>';
  // 대시보드: 공부 기록이 하나도 없으면 맨 위에 안내 (통계 칸은 그대로 두되 무엇부터 할지 알려 줌)
  function statsEmpty(){const v=$('vStats');if(!v)return;let el=$('statsEmpty');
    if(hasStudy()){if(el)el.remove();return}
    if(!el){el=document.createElement('section');el.id='statsEmpty';el.className='panel empty-hero';
      el.innerHTML=`${CHART}<b>아직 공부 기록이 없어요</b><span>홈에서 과목을 눌러 타이머를 켜면 오늘·일주일·한 달 통계와 과목 비율이 여기에 쌓여요.</span><button class="primary" data-empty-go="home">공부 시작하러 가기</button>`;
      const head=v.querySelector('.panel-head');(head||v.firstChild)?.insertAdjacentElement(head?'afterend':'beforebegin',el)}}
  // 국내 여권: 아직 도장이 없으면 무엇을 하면 되는지 안내
  function krEmpty(){const box=$('krStamps');if(!box)return;const K=kr(tr());
    if(K.done.length||box.querySelector('.kr-empty'))return;
    box.insertAdjacentHTML('afterbegin','<p class="kr-empty">아직 받은 지역 도장이 없어요. 공부해서 마일리지를 모은 뒤 위 출발 안내에서 첫 도시를 골라 떠나 보세요. 도착하면 이곳에 도장이 찍혀요.</p>')}
  {const base=renderStats;renderStats=function(){const r=base.apply(this,arguments);statsEmpty();return r}}
  {const base=renderKorea;renderKorea=function(){const r=base.apply(this,arguments);krEmpty();return r}}
  document.addEventListener('click',e=>{const b=e.target.closest('[data-empty-go]');if(b){setTab(b.dataset.emptyGo);window.scrollTo({top:0,behavior:'smooth'})}});
})();
