/* ---------- 국내 교통: 시·군별 철도·항구·공항 데이터 + 환승 여정 ----------
   krRoute(a,b) → 실제로 갈아타는 구간 목록 [{f,t,m,km}]  (m: bus · train · ship · air)
   - 기차는 역이 있는 시·군끼리만, KTX/SRT/KTX-이음은 고속열차 정차역끼리만
   - 섬(울릉·독도·마라도·백령도)과 제주는 정해진 항구·공항으로만
   - 가장 빠른 길(갈아탈 때마다 30분 손해)로, 최대 5구간
   마일리지(운임)는 지금처럼 두 도시 사이 거리로 계산하고, 구간은 승차권·지도·안내에 쓴다. */

// 고속열차(KTX·SRT·KTX-이음) 정차역이 있는 시·군
const KR_HSR=new Set(['seoul','gwangmyeong','goyang','suwon','hwaseong','pyeongtaek','asan','cheongju','daejeon','gimcheon','daegu','gyeongju','ulsan','busan',
  'gongju','iksan','gimje','jeongeup','jangseong','gwangju','naju','mokpo','nonsan','gyeryong','jeonju','namwon','gokseong','gurye','suncheon','yeosu',
  'miryang','gimhae','changwon','jinju','pohang',
  'yangpyeong','wonju','hoengseong','pyeongchang','gangneung','donghae',
  'icheon','yeoju','eumseong','chungju','goesan','mungyeong','jecheon','danyang','yeongju','andong','uiseong','yeongcheon']);
// 고속열차 노선: 같은 노선 위의 역끼리만 한 번에 가고, 다른 노선이면 환승역(서울·대전·오송·익산·동대구 등)에서 갈아탄다
const KR_HSR_LINES={
  경부:['goyang','seoul','gwangmyeong','suwon','hwaseong','pyeongtaek','asan','cheongju','daejeon','gimcheon','daegu','miryang','gyeongju','ulsan','busan'],
  호남:['goyang','seoul','gwangmyeong','hwaseong','pyeongtaek','asan','cheongju','daejeon','gyeryong','nonsan','gongju','iksan','gimje','jeongeup','jangseong','gwangju','naju','mokpo'],
  전라:['seoul','gwangmyeong','asan','cheongju','iksan','jeonju','namwon','gokseong','gurye','suncheon','yeosu'],
  경전:['seoul','gwangmyeong','asan','cheongju','daejeon','gimcheon','daegu','miryang','gimhae','changwon','jinju'],
  동해:['seoul','gwangmyeong','asan','cheongju','daejeon','gimcheon','daegu','gyeongju','pohang'],
  강릉:['seoul','yangpyeong','wonju','hoengseong','pyeongchang','gangneung','donghae'],
  중앙:['seoul','yangpyeong','wonju','jecheon','danyang','yeongju','andong','uiseong','yeongcheon','gyeongju','ulsan','busan'],
  중부내륙:['icheon','yeoju','eumseong','chungju','goesan','mungyeong']};
const KR_EUM_LINES=new Set(['중앙','중부내륙']);
// SRT가 서는 곳 (수서·동탄·지제 등)
const KR_SRT=new Set(['seoul','hwaseong','pyeongtaek','asan','cheongju','daejeon','gimcheon','daegu','gyeongju','ulsan','busan','gongju','iksan','jeongeup','gwangju','naju','mokpo','changwon','jinju','pohang','suncheon','yeosu']);
// 일반열차(ITX·무궁화·ITX-청춘·ITX-마음)만 서는 곳
const KR_RAIL=new Set([...KR_HSR,'sejong','cheonan','anyang','osan','yesan','hongseong','boryeong','seocheon','gunsan','dangjin',
  'chuncheon','gapyeong','taebaek','yeongwol','jeongseon','samcheok','okcheon','yeongdong','wanju','imsil','hampyeong','muan','boseong','gwangyang','hwasun',
  'gumi','sangju','gyeongsan','cheongdo','chilgok','yecheon','bonghwa','yeongdeok','uljin','yangsan','haman','hadong']);
const KR_ITX_CHUNG=new Set(['chuncheon','gapyeong']);
const KR_DONGHAE=new Set(['yeongdeok','uljin','samcheok']);
// 배: [항구 A, 항구 B]
const KR_SHIP=[['ulleung','pohang'],['ulleung','donghae'],['ulleung','gangneung'],['ulleung','uljin'],['dokdo','ulleung'],['marado','seogwipo'],['baengnyeong','incheon'],
  ['jeju','mokpo'],['jeju','wando'],['jeju','yeosu'],['jeju','busan'],['jeju','goheung'],['jeju','jindo'],['jeju','incheon']];
// 제주 공항과 이어진 공항이 있는 시·군 (김포=서울, 김해=부산 등)
const KR_AIR=['seoul','busan','daegu','gwangju','cheongju','yeosu','ulsan','pohang','gunsan','wonju','sacheon','muan'];

const krLand=id=>['ulleung','dokdo','marado','baengnyeong'].includes(id)?id:KRM[id]&&KRM[id][2]==='제주'?'jeju':'main';
function krLegTime(m,a,b,km,line){
  if(m==='bus')return km*1.3/65+.15;
  if(m==='train')return line&&line!=='일반'?km*1.15/200+.35:km*1.2/90+.3;
  if(m==='ship')return km/30+.75;
  return km/600+2.2; // 비행기: 공항 수속·이동 포함
}
let KR_EDGES=null;
function krEdges(){
  if(KR_EDGES)return KR_EDGES;
  const ids=Object.keys(KRM),E={};ids.forEach(id=>E[id]=[]);
  const add=(a,b,m,line)=>{if(!E[a]||!E[b])return;E[a].push([b,m,line]);E[b].push([a,m,line])};
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const a=ids[i],b=ids[j],la=krLand(a),lb=krLand(b);
    if(la===lb&&(la==='main'||la==='jeju')&&krKm(a,b)<=300)add(a,b,'bus'); // 버스는 300km까지
    // 일반열차: 역 있는 곳끼리 250km 이내 (먼 길은 고속열차나 갈아타기로)
    if(la==='main'&&lb==='main'&&KR_RAIL.has(a)&&KR_RAIL.has(b)&&krKm(a,b)<=250)add(a,b,'train','일반')}
  // 고속열차: 같은 노선 위의 역끼리
  for(const [line,st] of Object.entries(KR_HSR_LINES))for(let i=0;i<st.length;i++)for(let j=i+1;j<st.length;j++)if(krKm(st[i],st[j])>=40)add(st[i],st[j],'train',line);
  KR_SHIP.forEach(([a,b])=>add(a,b,'ship'));
  KR_AIR.forEach(a=>add('jeju',a,'air'));
  return KR_EDGES=E;
}
const KR_ROUTE_MEMO={},KR_FROM_MEMO={};
// 출발지 하나에서 모든 도착지까지 한 번에 계산 (목적지 목록 160곳을 그릴 때 한 번만 돈다)
function krRoutesFrom(a){
  if(KR_FROM_MEMO[a])return KR_FROM_MEMO[a];
  const E=krEdges(),best={},prev={};best[a+'|0']=0;
  const H=[];const push=x=>{H.push(x);let i=H.length-1;while(i){const p=(i-1)>>1;if(H[p][0]<=H[i][0])break;[H[p],H[i]]=[H[i],H[p]];i=p}};
  const pop=()=>{const top=H[0],last=H.pop();if(H.length){H[0]=last;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<H.length&&H[l][0]<H[m][0])m=l;if(r<H.length&&H[r][0]<H[m][0])m=r;if(m===i)break;[H[m],H[i]]=[H[i],H[m]];i=m}}return top};
  push([0,a,0]);
  while(H.length){const [c,u,n]=pop();
    if(c>best[u+'|'+n]||n>=5)continue;
    for(const [v,m,line] of E[u]){if(v===a)continue;const km=krKm(u,v),nc=c+krLegTime(m,u,v,km,line)+(n>0?.5:0),k=v+'|'+(n+1);
      if(best[k]==null||nc<best[k]){best[k]=nc;prev[k]=[u,n,m,km,line];push([nc,v,n+1])}}}
  return KR_FROM_MEMO[a]={best,prev};
}
function krRoute(a,b){
  const key=a+'>'+b;if(KR_ROUTE_MEMO[key])return KR_ROUTE_MEMO[key];
  if(!KRM[a]||!KRM[b]||a===b)return KR_ROUTE_MEMO[key]=[{f:a,t:b,m:'bus',km:KRM[a]&&KRM[b]?krKm(a,b):0}];
  // 같은 땅에서 50km 미만이면 그냥 버스
  if(krLand(a)===krLand(b)&&krLand(a)!=='dokdo'&&krKm(a,b)<50)return KR_ROUTE_MEMO[key]=[{f:a,t:b,m:'bus',km:krKm(a,b)}];
  const {best,prev}=krRoutesFrom(a);let n=-1,bc=Infinity;
  for(let k=1;k<=5;k++){const c=best[b+'|'+k];if(c!=null&&c<bc){bc=c;n=k}}
  if(n<0)return KR_ROUTE_MEMO[key]=[{f:a,t:b,m:'bus',km:krKm(a,b)}];
  const legs=[];let u=b;
  while(n>0){const [pu,pn,m,km,line]=prev[u+'|'+n];legs.unshift({f:pu,t:u,m,km,line});u=pu;n=pn}
  return KR_ROUTE_MEMO[key]=legs;
}
// 대표 구간(가장 긴 구간): 승차권 색·아이콘·좌석 등급에 쓴다
const krMain=(a,b)=>krRoute(a,b).reduce((x,y)=>y.km>x.km?y:x);
function krLegClass(l){
  const {f:a,t:b,m,km}=l;
  if(m==='bus')return km<25?'시내버스':km<150?'시외버스':'고속버스';
  if(m==='ship')return [a,b].some(x=>x==='ulleung'||x==='dokdo')?'쾌속 여객선':[a,b].includes('jeju')?'카페리':'여객선';
  if(m==='air')return '국내선';
  if(l.line&&l.line!=='일반'){
    if(KR_EUM_LINES.has(l.line))return 'KTX-이음';
    return l.line!=='강릉'&&KR_SRT.has(a)&&KR_SRT.has(b)&&hsh([a,b].sort().join(''))%2?'SRT':'KTX'}
  if(KR_ITX_CHUNG.has(a)||KR_ITX_CHUNG.has(b))return 'ITX-청춘';
  if(KR_DONGHAE.has(a)||KR_DONGHAE.has(b))return 'ITX-마음';
  return km>=90?'ITX-새마을':'무궁화호';
}
const KR_MODE_NAME={bus:'버스',train:'기차',ship:'배',air:'비행기'};
// 목록·승차권에 쓰는 짧은 여정 요약: "쾌속 여객선 → KTX → 시외버스"
const krRouteText=(a,b)=>krRoute(a,b).map(krLegClass).join(' → ');
