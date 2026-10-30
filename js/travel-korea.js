/* ---------- 국내 여행: 전국 161개 시·군을 기차·버스로. 평균 시속 60km(마일리지 = 이동 분), 한 구간 최소 30 ---------- */
const KR=[
['seoul','서울','특별시',37.566,126.978],['busan','부산','광역시',35.180,129.075],['daegu','대구','광역시',35.871,128.601],['incheon','인천','광역시',37.456,126.705],
['gwangju','광주','광역시',35.160,126.851],['daejeon','대전','광역시',36.350,127.385],['ulsan','울산','광역시',35.539,129.311],['sejong','세종','특별자치시',36.480,127.289],
['suwon','수원','경기',37.263,127.029],['seongnam','성남','경기',37.420,127.127],['uijeongbu','의정부','경기',37.738,127.034],['anyang','안양','경기',37.394,126.957],
['bucheon','부천','경기',37.503,126.766],['gwangmyeong','광명','경기',37.479,126.865],['pyeongtaek','평택','경기',36.992,127.113],['dongducheon','동두천','경기',37.904,127.061],
['ansan','안산','경기',37.322,126.831],['goyang','고양','경기',37.658,126.832],['gwacheon','과천','경기',37.429,126.988],['guri','구리','경기',37.594,127.130],
['namyangju','남양주','경기',37.636,127.216],['osan','오산','경기',37.150,127.077],['siheung','시흥','경기',37.380,126.803],['gunpo','군포','경기',37.362,126.935],
['uiwang','의왕','경기',37.345,126.968],['hanam','하남','경기',37.539,127.215],['yongin','용인','경기',37.241,127.178],['paju','파주','경기',37.760,126.780],
['icheon','이천','경기',37.272,127.435],['anseong','안성','경기',37.008,127.280],['gimpo','김포','경기',37.615,126.716],['hwaseong','화성','경기',37.200,126.832],
['gwangjugg','광주(경기)','경기',37.429,127.255],['yangju','양주','경기',37.785,127.046],['pocheon','포천','경기',37.895,127.200],['yeoju','여주','경기',37.298,127.637],
['gapyeong','가평','경기',37.831,127.510],['yangpyeong','양평','경기',37.492,127.488],['yeoncheon','연천','경기',38.096,127.075],['ganghwa','강화','인천',37.747,126.488],
['chuncheon','춘천','강원',37.881,127.730],['wonju','원주','강원',37.342,127.920],['gangneung','강릉','강원',37.752,128.876],['donghae','동해','강원',37.525,129.114],
['taebaek','태백','강원',37.164,128.986],['sokcho','속초','강원',38.207,128.592],['samcheok','삼척','강원',37.450,129.165],['hongcheon','홍천','강원',37.697,127.889],
['hoengseong','횡성','강원',37.492,127.985],['yeongwol','영월','강원',37.184,128.462],['pyeongchang','평창','강원',37.371,128.390],['jeongseon','정선','강원',37.381,128.661],
['cheorwon','철원','강원',38.147,127.313],['hwacheon','화천','강원',38.106,127.708],['yanggu','양구','강원',38.110,127.990],['inje','인제','강원',38.069,128.170],
['goseonggw','고성(강원)','강원',38.381,128.468],['yangyang','양양','강원',38.075,128.619],
['cheongju','청주','충북',36.642,127.489],['chungju','충주','충북',36.991,127.926],['jecheon','제천','충북',37.133,128.191],['boeun','보은','충북',36.489,127.729],
['okcheon','옥천','충북',36.306,127.571],['yeongdong','영동','충북',36.175,127.783],['danyang','단양','충북',36.985,128.366],['goesan','괴산','충북',36.815,127.787],
['eumseong','음성','충북',36.940,127.690],['jincheon','진천','충북',36.855,127.436],
['cheonan','천안','충남',36.815,127.114],['gongju','공주','충남',36.447,127.119],['boryeong','보령','충남',36.333,126.613],['asan','아산','충남',36.790,127.002],
['seosan','서산','충남',36.785,126.450],['nonsan','논산','충남',36.187,127.099],['gyeryong','계룡','충남',36.274,127.249],['dangjin','당진','충남',36.890,126.628],
['buyeo','부여','충남',36.276,126.910],['seocheon','서천','충남',36.080,126.692],['hongseong','홍성','충남',36.601,126.661],['yesan','예산','충남',36.683,126.845],
['taean','태안','충남',36.746,126.298],['geumsan','금산','충남',36.109,127.488],['cheongyang','청양','충남',36.459,126.802],
['jeonju','전주','전북',35.824,127.148],['gunsan','군산','전북',35.968,126.737],['iksan','익산','전북',35.948,126.958],['jeongeup','정읍','전북',35.570,126.856],
['namwon','남원','전북',35.416,127.390],['gimje','김제','전북',35.804,126.881],['wanju','완주','전북',35.905,127.162],['jinan','진안','전북',35.792,127.425],
['muju','무주','전북',36.007,127.661],['jangsu','장수','전북',35.647,127.521],['imsil','임실','전북',35.618,127.289],['sunchang','순창','전북',35.374,127.137],
['gochang','고창','전북',35.436,126.702],['buan','부안','전북',35.732,126.733],
['mokpo','목포','전남',34.812,126.392],['yeosu','여수','전남',34.760,127.662],['suncheon','순천','전남',34.951,127.487],['naju','나주','전남',35.016,126.711],
['gwangyang','광양','전남',34.940,127.696],['damyang','담양','전남',35.321,126.988],['gokseong','곡성','전남',35.282,127.292],['gurye','구례','전남',35.202,127.463],
['goheung','고흥','전남',34.611,127.285],['boseong','보성','전남',34.771,127.080],['hwasun','화순','전남',35.064,126.987],['jangheung','장흥','전남',34.682,126.907],
['gangjin','강진','전남',34.642,126.767],['haenam','해남','전남',34.573,126.599],['yeongam','영암','전남',34.800,126.697],['muan','무안','전남',34.990,126.482],
['hampyeong','함평','전남',35.066,126.517],['yeonggwang','영광','전남',35.277,126.512],['jangseong','장성','전남',35.302,126.785],['wando','완도','전남',34.311,126.755],
['jindo','진도','전남',34.487,126.263],['sinan','신안','전남',34.833,126.351],
['pohang','포항','경북',36.019,129.343],['gyeongju','경주','경북',35.856,129.225],['gimcheon','김천','경북',36.140,128.114],['andong','안동','경북',36.568,128.730],
['gumi','구미','경북',36.120,128.344],['yeongju','영주','경북',36.806,128.624],['yeongcheon','영천','경북',35.973,128.939],['sangju','상주','경북',36.411,128.159],
['mungyeong','문경','경북',36.587,128.187],['gyeongsan','경산','경북',35.825,128.741],['uiseong','의성','경북',36.353,128.697],['cheongsong','청송','경북',36.436,129.057],
['yeongyang','영양','경북',36.667,129.112],['yeongdeok','영덕','경북',36.415,129.366],['cheongdo','청도','경북',35.647,128.734],['goryeong','고령','경북',35.726,128.263],
['seongju','성주','경북',35.919,128.283],['chilgok','칠곡','경북',35.995,128.402],['yecheon','예천','경북',36.658,128.453],['bonghwa','봉화','경북',36.893,128.732],
['uljin','울진','경북',36.993,129.400],['ulleung','울릉','경북',37.484,130.906],
['changwon','창원','경남',35.228,128.682],['jinju','진주','경남',35.180,128.108],['tongyeong','통영','경남',34.854,128.433],['sacheon','사천','경남',35.004,128.064],
['gimhae','김해','경남',35.229,128.889],['miryang','밀양','경남',35.504,128.746],['geoje','거제','경남',34.881,128.621],['yangsan','양산','경남',35.335,129.037],
['uiryeong','의령','경남',35.322,128.262],['haman','함안','경남',35.272,128.406],['changnyeong','창녕','경남',35.544,128.492],['goseonggn','고성(경남)','경남',34.973,128.322],
['namhae','남해','경남',34.838,127.893],['hadong','하동','경남',35.067,127.751],['sancheong','산청','경남',35.416,127.873],['hamyang','함양','경남',35.520,127.725],
['geochang','거창','경남',35.687,127.910],['hapcheon','합천','경남',35.567,128.166],
['jeju','제주','제주',33.499,126.531],['seogwipo','서귀포','제주',33.254,126.560],
];
const KRM=Object.fromEntries(KR.map(x=>[x[0],x]));
const KRG=[['전체',null],['서울·광역시',['특별시','광역시','특별자치시','인천']],['경기',['경기']],['강원',['강원']],['충북',['충북']],['충남',['충남']],
  ['전북',['전북']],['전남',['전남']],['경북',['경북']],['경남',['경남']],['제주',['제주']]];
const krGroup=x=>KRG.findIndex((g,i)=>i&&g[1].includes(x[2]));
const krKm=(a,b)=>{const A=KRM[a],B=KRM[b],r=Math.PI/180,dl=(B[3]-A[3])*r,dg=(B[4]-A[4])*r;const h=Math.sin(dl/2)**2+Math.cos(A[3]*r)*Math.cos(B[3]*r)*Math.sin(dg/2)**2;return 2*6371*Math.asin(Math.sqrt(h))};
const krCost=(a,b)=>Math.max(30,Math.round(krKm(a,b)));
const TRAIN='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4 0-7 .5-7 4v9.5A2.5 2.5 0 0 0 7.5 18L6 19.5v.5h2.2l2-2h3.6l2 2H18v-.5L16.5 18a2.5 2.5 0 0 0 2.5-2.5V6c0-3.5-3-4-7-4zM7.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3.5-6H7V6h4v4zm5.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm.5-6h-4V6h4v4z"/></svg>';
function kr(T){const K=T.kr||(T.kr={at:'seoul',home:'seoul',to:null,done:[],km:0});if(!K.home||!KRM[K.home])K.home='seoul';if(!K.path)K.path=K.done.map(d=>d.c);return K}
const krCanHome=K=>!K.to&&!K.done.length; // 첫 출발 전에만 출발지를 바꿀 수 있음
/* 교통수단: 제주 바다 건너면 배, 50km 미만은 시외버스, 그 외 기차(거리별 등급) */
const krIsJeju=id=>KRM[id][2]==='제주';
const hsh=s=>[...s].reduce((a,ch)=>(a*31+ch.charCodeAt(0))%99991,7);
// 배로만 갈 수 있는 섬: 울릉도·독도·마라도·백령도 (제주 본섬과 육지 사이도 배)
const KR_ISLE=new Set(['ulleung','dokdo','marado','baengnyeong']);
// 대표 교통수단 = 환승 여정(kr-routes.js) 중 가장 긴 구간
function krMode(a,b){return krMain(a,b).m}
function krClass(a,b){return krLegClass(krMain(a,b))}
const BUS='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 16c0 .9.4 1.7 1 2.2V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.8c.6-.5 1-1.3 1-2.2V6c0-3.5-3.6-4-8-4S4 2.5 4 6v10zm3.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18 11H6V6h12v5z"/></svg>';
const SHIP='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 21c-1.4 0-2.8-.5-4-1.3a7 7 0 0 1-8 0C6.8 20.5 5.4 21 4 21H2v2h2c1.4 0 2.7-.3 4-1a8.6 8.6 0 0 0 8 0c1.3.7 2.6 1 4 1h2v-2h-2zM3.9 19H4c1.6 0 3-.9 4-2 1 1.1 2.4 2 4 2s3-.9 4-2c1 1.1 2.4 2 4 2h.1l1.9-6.7c.1-.3 0-.6-.1-.8l-.9-.3V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.6l-.9.3c-.3.1-.4.4-.3.7L3.9 19zM6 6h12v4l-6-2-6 2V6z"/></svg>';
const krIcon=m=>m==='bus'?BUS:m==='ship'?SHIP:m==='air'?PLANE:TRAIN;
let krPickHome=false;
const krTagOf=l=>{if(l.m!=='train')return l.m;const c=krLegClass(l);return c==='무궁화호'?'mg':c==='SRT'?'srt':/^ITX/.test(c)?'itx':'train'};
const krTag=(a,b)=>krTagOf(krMain(a,b));
const KRCOL={train:'#1d6fd8',srt:'#6f35d6',itx:'#0b8aa8',mg:'#d6332c',bus:'#1f9d55',ship:'#e0a400',air:'#0284c7'};
/* 좌석 등급: 마일리지를 더 쓰면 업그레이드 */
const KCLS={train:['일반실','특실'],bus:['일반','우등'],ship:['일반실','1등실'],air:['일반석','비즈니스석']},KMUL=[1,1.3];
const WCLS={air:['이코노미','비즈니스','퍼스트'],ntrain:['2층 침대칸','1인 침대칸','스위트 침대칸'],cruise:['내측 객실','발코니 객실','스위트']},WMUL=[1,1.3,1.6];
const krTC=K=>Math.round(krCost(K.at,K.to)*KMUL[K.cls||0]);
const wTC=T=>Math.round(flightMin(T.at,T.to)*WMUL[T.cls||0]);
const TOPT=()=>{const T=tr();return T.opt=Object.assign({via:false,goal:false,ddline:false,neon:true,map:'base',season:true,window:true},T.opt||{})};
function krTicket(f,t,o={}){
  const A=KRM[f],B=KRM[t],m=krMode(f,t),tg=krTag(f,t),cls=krClass(f,t),seatc=KCLS[m][o.cls||0],c=Math.round(krCost(f,t)*KMUL[o.cls||0]),hs=[...(f+t)].reduce((a,ch)=>(a*31+ch.charCodeAt(0))%99991,7),dt=o.d?pk(o.d):new Date(),km=Math.round(krKm(f,t)),p=o.p??1;
  const lbl=m==='bus'?'승차권 · 버스':m==='ship'?'승선권 · 여객선':m==='air'?'탑승권 · 국내선':'승차권 · 열차',legs=krRoute(f,t);
  const info=m==='bus'?[['등급',cls+(o.cls?' 우등':'')],['승차홈',(hs%12+1)+'번'],['좌석',(hs%28+1)+'번'],['운임',o.free?'무료 티켓':c+' 마일']]
    :m==='ship'?[['선박',cls],['객실',seatc],['좌석',(hs%300+1)+'번'],['운임',c+' 마일']]
    :m==='air'?[['편명','TD '+(hs%900+100)],['좌석',seatc+' '+(hs%30+1)+'ABCDEF'[hs%6]],['게이트',(hs%20+1)+'번'],['운임',o.free?'무료 티켓':c+' 마일']]
    :[['열차',cls+' '+String(hs%900+100)],['호차',(o.cls?'1':(hs%8+2))+'호차 '+seatc],['좌석',(hs%15+1)+'ABCD'[hs%4]],['운임',c+' 마일']];
  const bars=[...Array(28)].map((_,k)=>`<i style="width:${1+((hs>>k%13)+k*7)%3}px"></i>`).join('');
  const stub=o.torn?'':`<div class="tk-stub tx-stub">${o.done?`<small>도착 완료</small><b>${B[1]}</b><span>${o.free?'무료 티켓 · 0 마일':c+' 마일 사용'}</span>`:`<small>남은 공부</small><b>${studyFor(o.left)}</b><span>${Math.floor(Math.min(o.avail,c))} / ${c}</span>`}<div class="tk-bars">${bars}</div></div>`;
  return `<div class="tk tx tk-${m} tk-t-${tg}${o.cls?' prem':''}${o.gold?' gold':''}${o.torn?' torn':''}${SECKM[t]?' secret-ticket':''}">
    <div class="tk-main tx-main"><div class="tx-bg" aria-hidden="true">${krArt(t)}</div>
      <div class="tk-hd"><span>${krIcon(m)}${o.gold?'특별 루트 · ':''}${lbl}${o.final&&KRM[o.final]?' · 경유 → '+KRM[o.final][1]:''}</span><span>${dt.getFullYear()}.${pad(dt.getMonth()+1)}.${pad(dt.getDate())}</span></div>
      <div class="tk-route"><div><small>출발</small><b>${A[1]}</b><em>${A[2]}</em></div>
        <div class="tk-mid"><span>${km}km</span><div class="tk-path"><i style="width:${p*100}%"></i><span class="tk-vh" style="left:calc(${p} * (100% - 24px) + 12px)">${krIcon(m)}</span></div><span>${o.torn||o.done?'도착':Math.round(p*100)+'% 이동'}</span></div>
        <div class="r"><small>도착</small><b>${B[1]}</b><em>${B[2]}</em></div></div>
      ${legs.length>1?`<div class="tk-legs">${legs.map(l=>`<span style="--mc:${KRCOL[krTagOf(l)]}">${krIcon(l.m)}<b>${krLegClass(l)}</b> ${KRM[l.f][1]}→${KRM[l.t][1]}</span>`).join('')}</div>`:''}
      <div class="tk-info">${info.map(([k,v])=>`<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>
    </div>${stub}
  </div>`}
const krDone=(K,id)=>K.done.some(d=>d.c===id);
const worldOpen=T=>kr(T).done.length>=KR.length-1||(TRAVEL_TEST&&!!T.worldTest);
let krG=0,krQ='',krArm=false;
function checkKorea(){
  if(globalThis.TourdyNative&&!globalThis.TourdyNative.transactionComputing)return durableArrival(checkKorea,()=>{const T=tr(),K=kr(T);return !!(T.on&&K.to&&KRM[K.to]&&!K.hold&&totalMiles()-T.used>=krTC(K))});
  const T=tr(),K=kr(T);if(!T.on||!K.to||!KRM[K.to]||K.hold)return false;const c=krTC(K);
  if(totalMiles()-T.used<c)return false;
  const ev={w:'kr',f:K.at,t:K.to,gold:goldLeg('kr',K.at,K.to),cls:K.cls||0};T.used+=c;K.km+=krKm(K.at,K.to);if(SECKM[K.to]){K.sec=K.sec||[];if(!secVisited(K.sec,K.to))K.sec.push({c:K.to,d:dk(today0()),f:K.at,tier:K.cls?2:0})}else if(K.to!==K.home){const ex=K.done.find(d=>d.c===K.to);if(ex){if(K.cls)ex.tier=2}else K.done.push({c:K.to,d:dk(today0()),tier:K.cls?2:0})}else if(K.cls)K.homeTier=2;/* 출발지는 방문 수에 넣지 않고 금칠만 기록 */(T.krNews=T.krNews||[]).push(K.to);K.path.push(K.to);K.at=K.to;K.to=null;postArrive(ev);save();arrQ(ev);return true;
}
function renderKorea(){
  const T=tr(),K=kr(T),avail=totalMiles()-T.used,at=KRM[K.at];let h='';
  if(T.krNews&&T.krNews.length){h+=`<div class="kr-news">${TRAIN} ${T.krNews.map(c=>KRM[c][1]).join(', ')} 도착! 지역 도장을 받았어요.</div>`;T.krNews=[];save()}
  h+=`<div class="kr-sign"><span class="kr-line"></span><div class="kr-st"><small>${at[2]}</small><b>${at[1]}</b></div><span class="kr-now">${K.at===K.home&&!K.done.length?'출발지':'현재 위치'}</span></div>`;
  if(krCanHome(K))h+=`<button class="kr-home${krPickHome?' on':''}" id="krHome">${krPickHome?'출발지 고르는 중 · 닫기':'출발지 바꾸기'}</button>`;
  if(TRAVEL_TEST)h+=`<div class="tv-test"><span>테스트</span>${K.to?'<button id="krSkip">바로 도착</button>':''}<button data-kadd="100">+100</button><button data-kadd="1000">+1000</button><button id="krReset">국내 초기화</button>${window.subTestBtn?subTestBtn():''}</div>`;
  h+=`<div class="tv-stats"><div><b>${Math.floor(avail)}</b><span>보유 마일리지</span></div><div><b>${K.done.length}<small>/${KR.length-1}</small></b><span>방문한 시·군</span></div><div><b>${Math.round(K.km).toLocaleString()}</b><span>누적 이동 km</span></div></div>`;
  $('krNow').innerHTML=h;
  if(K.to&&KRM[K.to]){const to=KRM[K.to],c=krTC(K),p=Math.min(1,Math.max(0,avail/c)),left=c-avail;
    if(!busyIn('krTrip'))$('krTrip').innerHTML=`${krTicket(K.at,K.to,{p:K.hold?0:p,avail,left,cls:K.cls,final:K.final,gold:goldLeg('kr',K.at,K.to)})}${K.hold?`<button class="primary ck-btn" data-ckopen="kr">승차 수속하고 출발하기</button>`:''}${goalBox('kr',K,left)}
      <div class="bp-acts"><button class="secondary${krArm?' del arm':''}" id="krCancel">${krArm?'정말 취소':'이동 취소'}</button></div>`;$('krTrip').hidden=false}
  else $('krTrip').hidden=true;
  renderKrPicker();
  // 지역 도장: 도별 스탬프북 (다녀온 곳은 도장, 아직 안 간 곳은 빈 자리)
  const total=KR.length-1,gotAll=K.done.length,dmap=Object.fromEntries(K.done.map(d=>[d.c,d.d])),hh=t=>[...t].reduce((a,c)=>a+c.charCodeAt(0)*13,0);
  if(krOpenReg==null){const last=K.done[K.done.length-1];krOpenReg=last?krGroup(KRM[last.c]):1}
  $('krStyleLbl').textContent={stamp:'도장',card:'수집 카드',pass:'승차권'}[T.style||'stamp'];
  $('krStampHead').innerHTML=`<div class="ks-ring" style="--p:${gotAll/total*100}"><b>${Math.floor(gotAll/total*100)}%</b></div><div><b>전국 스탬프 투어</b><span>${gotAll} / ${total}곳 · 완주한 지역 ${KRG.slice(1).filter((g,gi)=>{const all=KR.filter(x=>krGroup(x)===gi+1&&x[0]!==K.home);return all.length&&all.every(x=>dmap[x[0]])}).length} / ${KRG.length-1}</span></div>`;
  $('krStamps').innerHTML=KRG.slice(1).map((g,gi)=>{const i=gi+1,all=KR.filter(x=>krGroup(x)===i&&x[0]!==K.home),got=all.filter(x=>dmap[x[0]]),done=got.length===all.length,open=krOpenReg===i;
    return `<div class="ks-reg${open?' open':''}${done?' done':''}" style="--k:${KINK[gi]}">
      <button class="ks-h" data-kreg="${i}" aria-expanded="${open}"><span class="ks-badge">${done?'완주':g[0].slice(0,2)}</span><span class="ks-n"><b>${g[0]}</b><small>${got.length} / ${all.length}곳</small></span>
        <span class="ks-bar"><i style="width:${got.length/all.length*100}%"></i></span><svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 6 4 4 4-4"/></svg></button>
      ${open?krItems(all):''}
    </div>`}).join('')+krSecretStamps(K);
  renderKrMap();renderRoutes('kr');
}
// Search updates only its results, preserving the map, stamps and keyboard layout.
function renderKrPicker(){
  const T=tr(),K=kr(T),avail=krPickHome?0:totalMiles()-T.used;
  // 출발 안내
  $('krGroups').innerHTML=KRG.map((g,i)=>`<button data-krg="${i}" aria-pressed="${i===krG}">${g[0]}</button>`).join('');
  $('krBoardT').textContent=krPickHome?'출발지 고르기':'출발 안내';$('krBoardS').textContent=krPickHome?'여기서 여행을 시작해요':'가까운 순';
  if(krPickHome){const q=krQ.trim(),rows=KR.filter(x=>x[0]!==K.at&&(!krG||krGroup(x)===krG)&&(!q||x[1].includes(q)||x[2].includes(q)));
    $('krList').innerHTML=rows.map(x=>`<li><button class="kr-row" data-krhome="${x[0]}"><span class="kn"><b>${x[1]}</b><small>${x[2]}</small></span><span class="kc"></span><span class="st ok">여기서 출발</span></button></li>`).join('')||'<li class="empty">검색 결과가 없어요</li>'}
  else{
  const q=krQ.trim(),secGate=id=>SECK.some(s=>s[5]===id&&!secVisited(K.sec,s[0])),rows=KR.filter(x=>x[0]!==K.at&&(K.to===x[0]||!krDone(K,x[0])||secGate(x[0]))&&(!krG||krGroup(x)===krG)&&(!q||x[1].includes(q)||x[2].includes(q)))
    .map(x=>[x,krCost(K.at,x[0])]).sort((a,b)=>a[1]-b[1]);
  const secs=SECK.filter(x=>secOpenK(K,x)&&!secVisited(K.sec,x[0])&&x[0]!==K.at).map(x=>{const c=krCost(K.at,x[0]),cur=K.to===x[0],ok=avail>=c;
    return `<li><button class="kr-row secret${cur?' cur':''}" data-kr="${x[0]}"><span class="kn"><b>✦ ${x[1]} <em class="md md-sec">비밀 목적지</em></b><small>${x[2]} · ${Math.round(krKm(K.at,x[0]))}km · ${krClass(K.at,x[0])}${krRoute(K.at,x[0]).length>1?` · 환승 ${krRoute(K.at,x[0]).length-1}회`:''}</small></span><span class="kc">${c}</span><span class="st ${cur?'on':ok?'ok':'wait'}">${cur?'이동 중':ok?'바로 출발':studyFor(c-avail)}</span></button></li>`}).join('');
  $('krList').innerHTML=secs+rows.map(([x,c])=>{const cur=K.to===x[0],ok=avail>=c;
    return `<li><button class="kr-row${cur?' cur':''}" data-kr="${x[0]}"><span class="kn"><b>${x[1]}${x[0]===K.home?' <em class="md">출발지</em>':''}${krDone(K,x[0])&&secGate(x[0])?' <em class="md md-sec">✦ 비밀 목적지 입구</em>':''}</b><small><em class="md md-${krTag(K.at,x[0])}">${krClass(K.at,x[0])}</em>${krRoute(K.at,x[0]).length>1?`<em class="md md-xfer">환승 ${krRoute(K.at,x[0]).length-1}회</em>`:''}${x[2]} · ${Math.round(krKm(K.at,x[0]))}km</small></span><span class="kc">${c}</span>
      <span class="st ${cur?'on':ok?'ok':'wait'}">${cur?'이동 중':ok?'바로 출발':studyFor(c-avail)}</span></button></li>`}).join('')||'<li class="empty">남은 목적지가 없어요</li>'}
}
function krItems(all){const T=tr(),K=kr(T),sty=T.style||'stamp',DD=Object.fromEntries(K.done.map(d=>[d.c,d])),hh=t=>[...t].reduce((a,c)=>a+c.charCodeAt(0)*13,0),tc=t=>t===2?' gold':t===1?' silver':'';
  if(sty==='pass'){const rows=all.filter(x=>DD[x[0]]).map(x=>{const i=K.path.indexOf(x[0]),f=i>0?K.path[i-1]:K.home,e=DD[x[0]];if(!KRM[f])return '';
      return `<div class="tpass kpass${tc(e.tier)}" role="button" tabindex="0" data-tix="${x[0]}"><div class="tp-m"><span class="tp-k">${krClass(f,x[0])} · ${ymd(pk(e.d))}</span><div class="tp-r">${KRM[f][1]} ${krIcon(krMode(f,x[0]))} ${x[1]}</div><small>${KRM[f][2]} → ${x[2]}</small></div><div class="tp-s"><small>운임</small><b>${krCost(f,x[0])}</b></div></div>`}).join('');
    return `<div class="stamps sty-pass wgrid">${rows||'<p class="empty">이 지역에 다녀온 기록이 없어요</p>'}</div>`}
  if(sty==='card')return `<div class="stamps sty-card wgrid">${all.map(x=>{const e=DD[x[0]],nm=x[1].replace(/\(.+\)/,'');if(!e)return `<span class="ccard wslot2"><b>${nm}</b><small>${x[2]}</small></span>`;
      return `<button class="ccard${tc(e.tier)}" data-tix="${x[0]}" aria-label="${x[1]} 승차권 보기"><span class="cf kcf">${nm.slice(0,1)}</span><b>${nm}</b><small>${x[2]}</small><span class="cd2">${ymd(pk(e.d))}</span></button>`}).join('')}</div>`;
  return `<div class="ks-grid">${all.map(x=>{const e=DD[x[0]];if(!e)return `<span class="ks-slot"><i>${x[1].replace(/\(.+\)/,'')}</i></span>`;const dt=pk(e.d);
    return `<button class="ks-stamp${tc(e.tier)}" data-tix="${x[0]}" aria-label="${x[1]} 승차권 보기" style="--r:${(hh(x[0])%17)-8}deg"><small>${x[2]}</small><b>${x[1].replace(/\(.+\)/,'')}</b><small>${pad(dt.getMonth()+1)}.${pad(dt.getDate())}</small></button>`}).join('')}</div>`}
$('krStamps').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-tix]')){e.preventDefault();e.target.click()}});
const KINK=['#1d6fd8','#0e9f6e','#0b8aa8','#7c4dff','#d9480f','#b7791f','#d6336c','#2f9e44','#0c8599','#f76707'];
let krOpenReg=null;
// 다녀온 비밀 목적지는 지역 도장 맨 아래 '비밀 목적지'에 따로 모은다 (전국 160곳 진척도에는 넣지 않음)
function krSecretStamps(K){const got=SECK.filter(x=>secVisited(K.sec,x[0])),open=krOpenReg===99;
  return `<div class="ks-reg ks-secret${open?' open':''}${got.length===SECK.length?' done':''}" style="--k:#6b4fd8">
    <button class="ks-h" data-kreg="99" aria-expanded="${open}"><span class="ks-badge">✦</span><span class="ks-n"><b>비밀 목적지</b><small>${got.length} / ${SECK.length}곳</small></span>
      <span class="ks-bar"><i style="width:${got.length/SECK.length*100}%"></i></span><svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 6 4 4 4-4"/></svg></button>
    ${open?`<div class="ks-grid">${SECK.map((x,i)=>{const e=(K.sec||[]).find(d=>d.c===x[0]);if(!e)return `<span class="ks-slot" title="${x[6]}"><i>???</i></span>`;const dt=pk(e.d);
      return `<button type="button" class="ks-stamp" data-tix="${x[0]}" aria-label="${x[1]} 비밀 목적지 승차권 보기" style="--k:#6b4fd8;--c:color-mix(in srgb,#6b4fd8 78%,var(--ink));--r:${(i*7)%13-6}deg"><small>${x[2]}</small><b>${x[1]}</b><small>${pad(dt.getMonth()+1)}.${pad(dt.getDate())}</small></button>`}).join('')}</div><p class="note ks-sec-note">비밀 목적지는 입구 도시(서귀포·울릉·강화)에 있을 때만 목적지 목록에 나타나요.</p>`:''}
  </div>`}
$('krStamps').addEventListener('click',e=>{const b=e.target.closest('[data-kreg]');if(!b)return;const i=+b.dataset.kreg;krOpenReg=krOpenReg===i?0:i;renderKorea()});
/* 가로로 넘기는 칩 줄: PC 마우스 휠로도 옆으로 이동 */
function hWheel(el){el.addEventListener('wheel',e=>{if(el.scrollWidth<=el.clientWidth||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
  const max=el.scrollWidth-el.clientWidth;if((e.deltaY<0&&el.scrollLeft<=0)||(e.deltaY>0&&el.scrollLeft>=max))return;e.preventDefault();el.scrollLeft+=e.deltaY},{passive:false})}
['krGroups','tvConts'].forEach(id=>hWheel($(id)));
$('krNow').addEventListener('click',e=>{const T=tr(),K=kr(T);if(!TRAVEL_TEST)return;
  const a=e.target.closest('[data-kadd]');if(a){T.used-=+a.dataset.kadd;save();if(checkKorea())ding();renderKorea();return}
  if(e.target.closest('#krSkip')&&K.to){T.used-=Math.max(0,krTC(K)-(totalMiles()-T.used));save();if(checkKorea())ding();renderKorea();return}
  if(e.target.closest('#krReset')){T.kr={at:K.home,home:K.home,to:null,done:[],km:0};save();renderTravel()}});
$('krTrip').addEventListener('click',e=>{if(!e.target.closest('#krCancel'))return;const K=kr(tr());if(krArm){K.to=null;K.final=null;stopRoute('kr');krArm=false;save()}else krArm=true;renderKorea()});
$('krGroups').addEventListener('click',e=>{const b=e.target.closest('[data-krg]');if(b){krG=+b.dataset.krg;renderKorea()}});
bindSearchInput($('krSearch'),value=>{krQ=value;renderKrPicker()});
$('krNow').addEventListener('click',e=>{if(!e.target.closest('#krHome'))return;krPickHome=!krPickHome;krQ='';$('krSearch').value='';renderKorea();if(krPickHome)document.querySelector('.kr-board').scrollIntoView({behavior:'smooth',block:'start'})});
$('krList').addEventListener('click',e=>{const h=e.target.closest('[data-krhome]');if(h){const K=kr(tr());if(!krCanHome(K))return;K.home=K.at=h.dataset.krhome;krPickHome=false;krQ='';$('krSearch').value='';krOpenReg=null;save();renderKorea();window.scrollTo({top:0,behavior:'smooth'});return}
  const b=e.target.closest('[data-kr]');if(!b)return;const T=tr(),K=kr(T);
  stopRoute('kr');K.to=b.dataset.kr;K.final=null;K.cls=0;K.goal=null;if(TOPT().via){const v=pickViaKr(K.at,K.to);if(v){K.final=K.to;K.to=v}}T.to=null;sp(T).to=null;krArm=false;K.hold=true;save();renderKorea();openCheckin('kr')});
