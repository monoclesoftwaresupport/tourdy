/* ---------- 우주 탐사: 세계 194개국 입국 후 열림. 4개 구역, 구역 안에서는 자유롭게 고르고 구역을 다 돌면 다음 구역이 열림 ---------- */
const ZONES=['태양계','가까운 별','성운·성단','은하'];
// [id, 이름, 영문, 구역, 마일리지, 색, 설명, 모양]
const SPACE=[
['iss','국제우주정거장','ISS',0,50,'#cfd8e3','지구 상공 400km','station'],['moon','달','MOON',0,60,'#c9c9c9','지구에서 38만km','planet'],
['venus','금성','VENUS',0,80,'#e8c27a','두꺼운 구름에 덮인 행성','planet'],['mercury','수성','MERCURY',0,100,'#a8a29a','태양에 가장 가까운 행성','planet'],
['sun','태양','SUN',0,120,'#ffcf3a','코로나 근접 비행','sun'],['mars','화성','MARS',0,100,'#e0603f','붉은 행성','planet'],
['phobos','포보스','PHOBOS',0,80,'#8f8174','화성의 위성','moon'],['jupiter','목성','JUPITER',0,120,'#e0a96d','태양계에서 가장 큰 행성','planet'],
['io','이오','IO',0,100,'#e8d36a','화산이 가장 활발한 위성','moon'],['europa','유로파','EUROPA',0,100,'#d9cdb8','얼음 아래 바다가 있는 위성','moon'],
['ganymede','가니메데','GANYMEDE',0,100,'#a59a8c','태양계에서 가장 큰 위성','moon'],['callisto','칼리스토','CALLISTO',0,100,'#7d7266','충돌구로 뒤덮인 위성','moon'],
['saturn','토성','SATURN',0,130,'#e8cf8a','고리를 가진 행성','planet'],['titan','타이탄','TITAN',0,110,'#d9a64a','짙은 대기를 가진 위성','moon'],
['enceladus','엔셀라두스','ENCELADUS',0,110,'#eef4f8','얼음을 내뿜는 위성','moon'],['uranus','천왕성','URANUS',0,140,'#93dde3','옆으로 누워 도는 행성','planet'],
['miranda','미란다','MIRANDA',0,120,'#b8b4ad','천왕성의 위성','moon'],['neptune','해왕성','NEPTUNE',0,140,'#5b7cf0','가장 바깥의 행성','planet'],
['triton','트리톤','TRITON',0,130,'#d8c7c0','해왕성의 위성','moon'],['pluto','명왕성','PLUTO',0,150,'#d2ae8e','하트 무늬의 왜행성','planet'],
['charon','카론','CHARON',0,140,'#9c948d','명왕성의 짝','moon'],['eris','에리스','ERIS',0,160,'#e6e2dc','명왕성보다 무거운 왜행성','moon'],
['halley','핼리 혜성','HALLEY',0,120,'#bfe4ff','76년마다 돌아오는 혜성','comet'],['oort','오르트 구름','OORT',0,180,'#9fb3d9','혜성의 고향','belt'],
['beyond','성간 공간','INTERSTELLAR',0,180,'#8b6cff','보이저 1호가 간 곳','hole'],
['proxima','프록시마 센타우리','PROXIMA',1,130,'#ff6b5a','가장 가까운 별 · 4.2광년','star'],['alphacen','알파 센타우리 A','ALPHA CEN',1,130,'#ffe08a','태양과 닮은 별 · 4.4광년','star'],
['barnard','바너드별','BARNARD',1,140,'#ff8a5c','붉은 왜성 · 6광년','star'],['sirius','시리우스','SIRIUS',1,140,'#d6e6ff','밤하늘에서 가장 밝은 별 · 8.6광년','star'],
['procyon','프로키온','PROCYON',1,140,'#fff4d6','작은개자리 · 11광년','star'],['altair','알타이르','ALTAIR',1,140,'#e9f0ff','견우성 · 17광년','star'],
['vega','베가','VEGA',1,140,'#bcd3ff','직녀성 · 25광년','star'],['fomalhaut','포말하우트','FOMALHAUT',1,150,'#dbe6ff','남쪽물고기자리 · 25광년','star'],
['arcturus','아크투루스','ARCTURUS',1,150,'#ffb067','주황색 거성 · 37광년','star'],['capella','카펠라','CAPELLA',1,160,'#fff0b0','마차부자리 · 43광년','star'],
['aldebaran','알데바란','ALDEBARAN',1,160,'#ff9a4d','황소의 눈 · 65광년','star'],['polaris','북극성','POLARIS',1,170,'#fff1bf','북쪽 하늘의 기준 · 433광년','star'],
['antares','안타레스','ANTARES',1,180,'#ff4d3a','전갈의 심장 · 550광년','star'],['betelgeuse','베텔게우스','BETELGEUSE',1,180,'#ff5a3c','적색 초거성 · 550광년','star'],
['rigel','리겔','RIGEL',1,180,'#9ec2ff','청색 초거성 · 860광년','star'],
['pleiades','플레이아데스 성단','PLEIADES',2,160,'#9ec7ff','좀생이별 · 440광년','cluster'],['hyades','히아데스 성단','HYADES',2,150,'#ffd29e','가장 가까운 산개성단 · 150광년','cluster'],
['ring','고리 성운','RING NEB',2,170,'#7fd9c4','죽어 가는 별의 고리 · 2,300광년','ringneb'],['orion','오리온 성운','ORION NEB',2,180,'#ff7fb0','별이 태어나는 곳 · 1,300광년','nebula'],
['horsehead','말머리 성운','HORSEHEAD',2,180,'#e0605a','말 머리 모양 암흑 성운','nebula'],['crab','게 성운','CRAB NEB',2,180,'#ffa860','초신성의 잔해 · 6,500광년','nebula'],
['eagle','창조의 기둥','PILLARS',2,190,'#c9a46a','독수리 성운 · 7,000광년','nebula'],['lagoon','석호 성운','LAGOON',2,180,'#ff6fa0','궁수자리 · 4,100광년','nebula'],
['cateye','고양이 눈 성운','CAT\'S EYE',2,180,'#7fe0e8','복잡한 행성상 성운 · 3,300광년','ringneb'],['omegacen','오메가 센타우리','OMEGA CEN',2,200,'#ffe7b0','가장 큰 구상성단 · 1만 7천 광년','cluster'],
['sgra','우리은하 중심','SGR A*',3,200,'#c79bff','거대 블랙홀 · 2만 6천 광년','hole'],['lmc','대마젤란 은하','LMC',3,210,'#c7d4ff','우리은하의 동반 은하 · 16만 광년','galaxy'],
['smc','소마젤란 은하','SMC',3,210,'#d9c7ff','동반 은하 · 20만 광년','galaxy'],['andromeda','안드로메다 은하','ANDROMEDA',3,240,'#b9a7ff','이웃 은하 · 250만 광년','galaxy'],
['triangulum','삼각형자리 은하','M33',3,220,'#a7c4ff','이웃 은하 · 270만 광년','galaxy'],['sombrero','솜브레로 은하','SOMBRERO',3,240,'#ffe0a8','모자 모양 은하 · 3천만 광년','galaxy'],
['whirlpool','소용돌이 은하','WHIRLPOOL',3,240,'#9fd0ff','나선팔이 선명한 은하 · 3천만 광년','galaxy'],['pinwheel','바람개비 은하','PINWHEEL',3,240,'#b7e3ff','큰곰자리 · 2천만 광년','galaxy'],
['m87','M87 블랙홀','M87*',3,260,'#ffb36b','처음 사진에 찍힌 블랙홀 · 5,500만 광년','hole'],['deepfield','허블 울트라 딥 필드','DEEP FIELD',3,320,'#e2d6ff','관측 가능한 우주의 끝','galaxy'],
];
const SPX=Object.fromEntries(SPACE.map(s=>[s[0],s]));
const EARTH=['earth','지구','EARTH',-1,0,'#3b82f6','우리의 출발지','planet'];
const spObj=id=>SPX[id]||EARTH;
const ROCKET='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3 2.2 4.5 5.6 4.5 9.4V15l2 2.2V20l-3.2-1.6H8.7L5.5 20v-2.8l2-2.2v-3.6C7.5 7.6 9 4.2 12 2zm0 6.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM10.4 19.5h3.2L12 22.5z" transform="rotate(90 12 12)"/></svg>';
const OLDSP=['earth','iss','moon','mars','ceres','jupiter','saturn','uranus','neptune','pluto','beyond','proxima','barnard','sirius','vega','arcturus','polaris','betelgeuse','rigel','sgra','andromeda'];
function sp(T){if(!T.sp2){T.sp2={at:'earth',to:null,done:[]};
  if(T.sp&&T.sp.done)T.sp.done.forEach(x=>{const id=OLDSP[x.i];if(SPX[id]&&!T.sp2.done.some(d=>d.c===id))T.sp2.done.push({c:id,d:x.d})});
  const last=T.sp2.done[T.sp2.done.length-1];if(last)T.sp2.at=last.c}return T.sp2}
const spaceOpen=T=>T.stamps.length>=NATIONS.length-1||(TRAVEL_TEST&&!!T.spTest);
const spDone=(P,id)=>P.done.some(d=>d.c===id);
const zoneOpen=(P,z)=>z===0||SPACE.filter(s=>s[3]===z-1).every(s=>spDone(P,s[0]));
let spArm=false,spZone=null;
function checkSpace(){
  if(globalThis.TourdyNative&&!globalThis.TourdyNative.transactionComputing)return durableArrival(checkSpace,()=>{const T=tr(),P=sp(T);return !!(T.on&&P.to&&SPX[P.to]&&totalMiles()-T.used>=SPX[P.to][4])});
  const T=tr(),P=sp(T);if(!T.on||!P.to||!SPX[P.to])return false;const s=SPX[P.to];
  if(totalMiles()-T.used<s[4])return false;
  const from=P.at;T.used+=s[4];if(!spDone(P,s[0]))P.done.push({c:s[0],d:dk(today0())});P.at=s[0];P.to=null;arrQ({w:'space',f:from,t:s[0],n:P.done.length});save();return true; // 도착 연출은 js/space-plus.js
}
function planet(s,size=56){return `<span class="planet ${s[7]||''}" data-id="${s[0]}" style="--p:${s[5]};--s:${size}px"></span>`}
function renderSpace(){
  const T=tr(),P=sp(T),avail=totalMiles()-T.used,cur=spObj(P.at),dd=k=>{const d=pk(k);return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}`};
  const lastOpen=[0,1,2,3].filter(z=>zoneOpen(P,z)).pop();if(spZone==null||!zoneOpen(P,spZone))spZone=lastOpen;
  let h='';
  if(T.spNews&&T.spNews.length){h+=`<div class="sp-news">${ROCKET} ${T.spNews.map(id=>spObj(id)[1]).join(', ')} 도착! 미션 패치를 받았어요.</div>`;T.spNews=[];save()}
  h+=`<div class="sp-now">${planet(cur,64)}<div><small>현재 위치 · NOW AT</small><b>${cur[1]}</b><span>${cur[2]} · ${cur[6]}</span></div></div>`;
  if(TRAVEL_TEST&&spaceOpen(T))h+=`<div class="tv-test sp-test"><span>테스트</span>${P.to?'<button id="spSkip">바로 도착</button>':''}<button data-add="1000">+1000</button><button id="spReset">우주 초기화</button>${window.subTestBtn?subTestBtn():''}${T.spTest?'<button id="spRelock">다시 잠그기</button>':''}</div>`;
  h+=`<div class="sp-stats"><div><b>${Math.floor(avail)}</b><span>보유 마일리지</span></div><div><b>${P.done.length}<small>/${SPACE.length}</small></b><span>탐사 완료</span></div><div><b>${ZONES[lastOpen]}</b><span>열린 구역</span></div></div>`;
  if(P.to&&SPX[P.to]){const nx=SPX[P.to],p=Math.min(1,Math.max(0,avail/nx[4])),left=nx[4]-avail;
    h+=`<div class="sp-card"><div class="sp-k">MISSION ${pad(P.done.length+1)} · 비행 중</div>
      <div class="sp-route">${planet(cur,36)}<div class="sp-path"><i style="width:${p*100}%"></i><span class="sp-rocket" style="left:${p*100}%">${ROCKET}</span></div>${planet(nx,36)}</div>
      <div class="sp-route-l"><span>${cur[1]}</span><span>${nx[1]}</span></div>
      <div class="sp-left"><b>${Math.floor(Math.min(avail,nx[4]))} / ${nx[4]}</b> 마일리지 · 남은 공부 <b>${studyFor(left)}</b></div>
      <button class="sp-btn ghost${spArm?' arm':''}" id="spCancel">${spArm?'정말 발사 취소':'발사 취소'}</button></div>`}
  if(P.done.length>=SPACE.length)h+=`<div class="sp-card sp-end"><div class="sp-k">ALL MISSIONS COMPLETE</div><b>관측 가능한 우주의 끝까지 왔어요</b><span>세계 일주부터 허블 울트라 딥 필드까지, 모든 탐사를 마쳤어요.</span></div>`;
  else{
    h+=`<div class="sp-zones">${ZONES.map((z,i)=>{const op=zoneOpen(P,i),n=SPACE.filter(s=>s[3]===i),d=n.filter(s=>spDone(P,s[0])).length;
      return `<button data-zone="${i}" aria-pressed="${i===spZone}" ${op?'':'disabled'}>${op?'':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'}<b>${z}</b><small>${d}/${n.length}</small></button>`}).join('')}</div>`;
    h+=spMapHTML(T,P,avail);
    const rows=SPACE.filter(s=>s[3]===spZone&&!spDone(P,s[0])).sort((a,b)=>a[4]-b[4]);
    h+=`<ul class="sp-list">${rows.map(s=>{const go=P.to===s[0],ok=avail>=s[4];
      return `<li><button class="sp-row${go?' cur':''}" data-sp="${s[0]}">${planet(s,30)}<span class="sn"><b>${s[1]}</b><small>${s[6]}</small></span><span class="sc"><b>${s[4]}</b><small>${go?'비행 중':ok?'바로 도착 가능':studyFor(s[4]-avail)}</small></span></button></li>`}).join('')||'<li class="sp-empty">이 구역은 모두 탐사했어요</li>'}</ul>
      ${T.to?'<p class="sp-warn">우주 목적지를 고르면 지금 하던 세계 비행은 멈춰요. 마일리지는 그대로예요.</p>':''}
      ${spZone<3&&!zoneOpen(P,spZone+1)?`<p class="sp-hint">${ZONES[spZone]}을(를) 모두 탐사하면 ${ZONES[spZone+1]} 구역이 열려요.</p>`:''}`;
  }
  h+=`<div class="sp-sec">미션 패치 · ${P.done.length}개</div>`+(P.done.length?`<div class="patches">${P.done.slice().reverse().map((x,i)=>{const s=spObj(x.c);
    return `<div class="patch" style="--p:${s[5]}">${planet(s,40)}<span class="pm">MISSION ${pad(P.done.length-i)}</span><b>${s[1]}</b><span class="pd">${dd(x.d)}</span></div>`}).join('')}</div>`
    :'<p class="sp-empty">첫 탐사를 마치면 패치가 생겨요.</p>');
  $('tvSpace').innerHTML=h;spMapAfter();
}
$('tvSpace').addEventListener('click',e=>{const T=tr(),P=sp(T);
  const a=e.target.closest('[data-add]');if(a&&TRAVEL_TEST){T.used-=+a.dataset.add;save();if(checkSpace())ding();renderSpace();return}
  if(e.target.closest('#spSkip')&&TRAVEL_TEST&&P.to){T.used-=Math.max(0,SPX[P.to][4]-(totalMiles()-T.used));save();if(checkSpace())ding();renderSpace();return}
  if(e.target.closest('#spRelock')&&TRAVEL_TEST){T.spTest=false;save();renderTravel();return}
  if(e.target.closest('#spReset')&&TRAVEL_TEST){T.sp2={at:'earth',to:null,done:[]};delete T.sp;spZone=null;save();renderSpace();return}
  const z=e.target.closest('[data-zone]');if(z&&!z.disabled){spZone=+z.dataset.zone;renderSpace();return}
  const r=e.target.closest('[data-sp]');if(r){spBriefOpen(r.dataset.sp);return} // 미션 브리핑 → 발사 카운트다운 (js/space-plus.js)
  if(e.target.closest('#spCancel')){if(spArm){P.to=null;spArm=false;save()}else spArm=true;renderSpace()}
});
function renderWorld(){
  const T=tr(),open=spaceOpen(T),wo=worldOpen(T),w=['korea','earth','space','week','ach'].includes(T.world)?T.world:'korea';
  $('vTravel').dataset.world=w;$('vTravel').classList.toggle('wlocked',!wo);$('spLock').hidden=true;$('tvSpaceTab').textContent=open?'우주':'???';
  $('tvWorld').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.w===w));
  $('tvSpace').classList.toggle('locked',!open);$('tvSpace').inert=!open;$('spVeil').hidden=open;
  if(!open)$('spVeil').innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
    <b>???</b><span>세계의 모든 나라에 입국하면 열려요</span><span class="vn">${T.stamps.length} / ${NATIONS.length-1}</span>
    ${TRAVEL_TEST?'<button class="vt" id="spTestOpen">테스트: 잠금 해제</button>':''}`;
  if(!wo)$('worldLock').innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
    <b>세계 여행은 아직 잠겨 있어요</b><span>국내 161개 시·군을 모두 방문하면 해외로 떠날 수 있어요</span><span class="vn">${kr(T).done.length} / ${KR.length-1}</span>
    ${TRAVEL_TEST?'<button class="vt" id="wTestOpen">테스트: 잠금 해제</button>':''}`;
  if(w==='space')renderSpace();if(w==='korea')renderKorea();if(w==='ach'){renderAch();if(window.TourdyChallenge)TourdyChallenge.renderAch()}if(w==='week'&&window.TourdyChallenge)TourdyChallenge.render();renderDline();applyNeon();seasonFx();windowFx();setTimeout(ddArrive,800);
}
$('worldLock').addEventListener('click',e=>{if(e.target.closest('#wTestOpen')){tr().worldTest=true;save();renderTravel()}});
$('spVeil').addEventListener('click',e=>{if(e.target.closest('#spTestOpen')){tr().spTest=true;save();renderTravel()}});
$('tvWorld').addEventListener('click',e=>{const b=e.target.closest('[data-w]');if(!b)return;tr().world=b.dataset.w;save();renderTravel()});
