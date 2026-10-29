/* ---------- 우주 탐사 확장: 줌아웃 지도 · 미션 브리핑 · 발사 카운트다운 · 도착 연출 ----------
   지도: 구역마다 실제 거리(태양계는 AU, 그 밖은 광년)를 로그 눈금으로 줄여서 태양(우리 태양계)을 가운데 두고 배치한다.
         구역이 바뀌면 바깥으로 쭉 빠지는 줌아웃 연출을 한다. 위성은 모행성 곁에 작게 붙는다.
   발사: 목적지를 고르면 바로 출발하지 않고 미션 브리핑 → 카운트다운 → 점화 → 비행 시작.
   도착: 도착 대기열(arrQ)에 넣어서 공부 중이면 끝날 때까지 미룬다. 궤도 진입 → 착륙 → 미션 패치 도장. */

/* ===== 거리 데이터 ===== */
// 태양계: 태양에서의 거리(AU). 위성은 모행성 기준
const SP_AU={sun:0,mercury:.39,venus:.72,mars:1.52,jupiter:5.2,saturn:9.54,uranus:19.2,neptune:30.1,pluto:39.5,eris:68,halley:17.8,beyond:160,oort:2000};
const SP_PARENT={iss:'earth',moon:'earth',phobos:'mars',io:'jupiter',europa:'jupiter',ganymede:'jupiter',callisto:'jupiter',titan:'saturn',enceladus:'saturn',miranda:'uranus',triton:'neptune',charon:'pluto'};
// 그 밖: 지구에서의 거리(광년)
const SP_LY={proxima:4.24,alphacen:4.37,barnard:5.96,sirius:8.6,procyon:11.4,altair:16.7,vega:25,fomalhaut:25.1,arcturus:36.7,capella:42.9,aldebaran:65,polaris:433,antares:550,betelgeuse:548,rigel:860,
  pleiades:444,hyades:153,ring:2300,orion:1344,horsehead:1375,crab:6500,eagle:7000,lagoon:4100,cateye:3300,omegacen:17000,
  sgra:26000,lmc:160000,smc:200000,andromeda:2.5e6,triangulum:2.73e6,sombrero:2.9e7,whirlpool:3.1e7,pinwheel:2.1e7,m87:5.5e7,deepfield:1.3e10};
// 구역별 눈금: [가장 가까운 거리, 가장 먼 거리, 눈금 고리들, 가운데 이름]
const SP_SCALE=[
  {lo:.3,hi:2600,rings:[],center:'태양'}, // 태양계는 SP_ORBIT 배치를 씀
  {lo:3,hi:1100,rings:[],center:'태양계'},
  {lo:100,hi:24000,rings:[],center:'태양계'},
  {lo:1e4,hi:2e10,rings:[],center:'태양계'}];
const spLyTxt=v=>v>=1e8?`${+(v/1e8).toFixed(v>=1e9?0:1)}억 광년`:v>=1e4?`${+(v/1e4).toFixed(v>=1e5?0:1)}만 광년`:`${Math.round(v).toLocaleString()}광년`;
function spDist(id){
  if(id==='earth')return '우리의 출발지';
  if(SP_PARENT[id]){const km={iss:400,moon:384400}[id];return km?`지구에서 ${km.toLocaleString()}km`:`${spObj(SP_PARENT[id])[1]}의 위성`}
  if(SP_AU[id]!=null){const au=SP_AU[id];if(!au)return '지구에서 1억 5천만km';const km=Math.abs(au-1)*1.496e8;return km>=1e8?`지구에서 약 ${+(km/1e8).toFixed(1)}억km`:`지구에서 약 ${Math.round(km/1e4).toLocaleString()}만km`}
  return SP_LY[id]?`지구에서 ${spLyTxt(SP_LY[id])}`:'';
}

/* ===== 지도 ===== */
let spMapZone=null; // 마지막으로 그린 구역 (줌 연출용)
function spHash(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))%3600;return h/10}
// 태양계는 실제 거리 순서를 지키되 간격을 고르게 편 배치 [반지름(0~50), 각도]
const SP_ORBIT={mercury:[11,200],venus:[15,320],earth:[19.5,40],mars:[24,135],jupiter:[29,250],halley:[32.5,170],saturn:[34,15],uranus:[37.5,100],neptune:[40.5,205],pluto:[43,300],eris:[45.5,55],beyond:[44,240],oort:[47,335]};
function spPos(id,z){
  // 0~100 좌표. 가운데(50,50)가 태양/태양계
  const at=(r,deg)=>{const a=deg*Math.PI/180;return [50+r*Math.cos(a),50+r*Math.sin(a)]};
  if(z===0){
    if(id==='sun')return [50,50];
    const par=id==='earth'?null:SP_PARENT[id];
    if(par){const [px,py]=spPos(par,0),sib=Object.keys(SP_PARENT).filter(k=>SP_PARENT[k]===par),i=sib.indexOf(id),a=(i/sib.length)*360+SP_ORBIT[par][1]+45;
      return [px+6.5*Math.cos(a*Math.PI/180),py+6.5*Math.sin(a*Math.PI/180)]}
    const o=SP_ORBIT[id]||[30,spHash(id)];return at(o[0],o[1])
  }
  // 바깥 구역: 실제 거리는 너무 몰려 있어서 가까운 순서대로 안쪽부터 고르게 놓고, 각도는 황금각만큼 돌려서 겹치지 않게
  const S=SP_SCALE[z],R=38,r0=12,ids=SPACE.filter(s=>s[3]===z).map(s=>s[0]).sort((a,b)=>SP_LY[a]-SP_LY[b]),i=Math.max(0,ids.indexOf(id));
  return at(r0+(R-r0)*(ids.length>1?i/(ids.length-1):0),i*137.5+z*25-90); // 가까운 순서대로 안쪽부터 같은 간격
}
const spRad=(v,z)=>{const S=SP_SCALE[z],R=38,r0=12;return r0+(R-r0)*Math.min(1,Math.max(0,Math.log10(v/S.lo)/Math.log10(S.hi/S.lo)))};
function spMapHTML(T,P,avail){
  const z=spZone,S=SP_SCALE[z],ids=SPACE.filter(s=>s[3]===z).map(s=>s[0]);
  const pts={};ids.forEach(id=>pts[id]=spPos(id,z));
  if(z===0){pts.earth=spPos('earth',0)}
  // 지금 위치·목적지
  const at=P.at,to=P.to&&SPX[P.to]?P.to:null;
  const here=pts[at]||(z===0&&at==='earth'?pts.earth:null),there=to&&pts[to]?pts[to]:null;
  const p=to?Math.min(1,Math.max(0,avail/SPX[to][4])):0;
  const from=here||[50,50];
  // 고리
  let svg='';
  if(z===0){['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune','pluto','eris'].forEach(id=>{svg+=`<circle cx="50" cy="50" r="${SP_ORBIT[id][0]}" class="spm-orbit"/>`});
    svg+=`<circle cx="50" cy="50" r="${SP_ORBIT.oort[0]}" class="spm-belt"/>`}
  else S.rings.forEach(v=>{const r=spRad(v,z);if(r<=12.5||r>=38)return;const a=58*Math.PI/180;svg+=`<circle cx="50" cy="50" r="${r.toFixed(2)}" class="spm-ring"/><text x="${(50+r*Math.cos(a)).toFixed(2)}" y="${(50+r*Math.sin(a)+.9).toFixed(2)}" class="spm-rl">${spLyTxt(v)}</text>`});
  if(there){svg+=`<line x1="${from[0]}" y1="${from[1]}" x2="${there[0]}" y2="${there[1]}" class="spm-path"/><line x1="${from[0]}" y1="${from[1]}" x2="${(from[0]+(there[0]-from[0])*p).toFixed(2)}" y2="${(from[1]+(there[1]-from[1])*p).toFixed(2)}" class="spm-done"/>`}
  // 표시할 이름: 행성급·현재·목적지·탐사 완료·다음으로 싼 곳 3개
  const next=new Set(ids.filter(id=>!spDone(P,id)).sort((a,b)=>SPX[a][4]-SPX[b][4]).slice(0,3));
  const label=id=>z>0||!SP_PARENT[id]||id===to; // 위성 이름은 목적지일 때만 (모행성 이름과 겹침)
  const nodes=ids.map(id=>{const s=SPX[id],[x,y]=pts[id],done=spDone(P,id),moon=z===0&&!!SP_PARENT[id],sz=moon?10:id==='sun'?30:z===0?(['jupiter','saturn'].includes(id)?20:15):16;
    const cls=['spm-n',done?'done':'',id===to?'to':'',id===at?'at':'',next.has(id)?'nx':'',moon?'moon':''].filter(Boolean).join(' ');
    const ok=avail>=s[4];
    const tag=done?'span':'button',act=done?'':` data-sp="${id}" aria-label="${esc(s[1])} · ${s[4]} 마일리지${id===to?' · 비행 중':''}"`;
    return `<${tag} class="${cls}" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%"${act}>${planet(s,sz)}${label(id)?`<span class="spm-l">${esc(s[1])}${done?' ✓':''}</span>`:''}${id===to?`<span class="spm-tag">${ok?'곧 도착':'비행 중'}</span>`:''}</${tag}>`}).join('');
  const center=z===0?'':`<span class="spm-c"><i></i><small>${S.center}</small></span>`;
  const earth=z===0?`<span class="spm-n earth${at==='earth'?' at':''}" style="left:${pts.earth[0].toFixed(2)}%;top:${pts.earth[1].toFixed(2)}%">${planet(EARTH,15)}<span class="spm-l">지구</span></span>`:'';
  const rocket=there?`<span class="spm-rk" style="left:${(from[0]+(there[0]-from[0])*p).toFixed(2)}%;top:${(from[1]+(there[1]-from[1])*p).toFixed(2)}%;--a:${(Math.atan2(there[1]-from[1],there[0]-from[0])*180/Math.PI).toFixed(1)}deg">${ROCKET}</span>`:'';
  const hereMark=here&&!there?`<span class="spm-here" style="left:${here[0].toFixed(2)}%;top:${here[1].toFixed(2)}%"></span>`:'';
  return `<div class="spm" data-spz="${z}" role="group" aria-label="${ZONES[z]} 지도"><div class="spm-box"><div class="spm-in"><svg viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="xMidYMid meet">${svg}</svg>${center}${earth}${hereMark}${nodes}${rocket}</div></div>
    <div class="spm-cap"><span>${ZONES[z]}</span><small>${z===0?'실제 순서대로, 간격은 줄여서 그렸어요':'지구에서 가까운 순서대로 안쪽부터'}</small></div></div>`;
}
function spMapAfter(){
  const m=document.querySelector('#tvSpace .spm');if(!m)return;
  const z=+m.dataset.spz,prev=spMapZone;spMapZone=z;
  if(prev==null||prev===z||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  m.classList.add(z>prev?'zoom-out':'zoom-in');setTimeout(()=>m.classList.remove('zoom-out','zoom-in'),1200);
}

/* ===== 미션 브리핑 · 발사 ===== */
const spBrief=(()=>{const el=document.createElement('div');el.className='arr sp-brief';el.id='spBrief';el.hidden=true;el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','미션 브리핑');
  el.innerHTML='<div class="sp-bbox" id="spBriefBox"></div>';document.body.appendChild(el);return el})();
let spLaunchT=[];
function spBriefOpen(id){
  const T=tr(),P=sp(T),s=SPX[id];if(!s)return;
  if(P.to===id){window.scrollTo({top:0,behavior:'smooth'});return}
  const avail=totalMiles()-T.used,cur=spObj(P.at),ok=avail>=s[4],n=P.done.length+1;
  const busy=T.to||kr(T).to?'<p class="spb-warn">지금 하던 국내·세계 이동은 멈춰요. 마일리지는 그대로예요.</p>':P.to&&SPX[P.to]?`<p class="spb-warn">${esc(SPX[P.to][1])}(으)로 가던 비행은 취소돼요.</p>`:'';
  $('spBriefBox').innerHTML=`<div class="spb-k">MISSION ${pad(n)} · 미션 브리핑</div>
    <div class="spb-route">${planet(cur,44)}<span class="spb-line"><i></i>${ROCKET}</span>${planet(s,56)}</div>
    <div class="spb-names"><span>${esc(cur[1])}</span><b>${esc(s[1])}</b></div>
    <p class="spb-desc">${esc(s[6])}</p>
    <dl class="spb-dl"><div><dt>거리</dt><dd>${spDist(id)}</dd></div><div><dt>필요 연료</dt><dd>${s[4].toLocaleString()} 마일리지</dd></div>
      <div><dt>보유</dt><dd>${Math.floor(avail).toLocaleString()} 마일리지</dd></div><div><dt>도착까지</dt><dd class="${ok?'ok':''}">${ok?'발사 즉시 도착':'공부 '+studyFor(s[4]-avail)}</dd></div></dl>
    ${busy}
    <div class="spb-a"><button class="sp-btn" id="spGo">${ROCKET}발사</button><button class="sp-btn ghost" id="spBack">취소</button></div>`;
  spBrief.hidden=false;spBrief.dataset.id=id;setTimeout(()=>$('spGo')&&$('spGo').focus(),50);
}
function spBriefClose(){spLaunchT.forEach(clearTimeout);spLaunchT=[];spBrief.hidden=true}
function spRumble(){if(!TSND().arrive)return;const a=audio();if(!a)return;try{
  const t=a.currentTime+.02,nb=a.createBuffer(1,a.sampleRate*3,a.sampleRate),ch=nb.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;
  const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=nb;f.type='lowpass';f.frequency.setValueAtTime(180,t);f.frequency.exponentialRampToValueAtTime(900,t+.6);f.frequency.exponentialRampToValueAtTime(120,t+2.6);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.7,t+.25);g.gain.exponentialRampToValueAtTime(.0001,t+2.8);s.connect(f).connect(g).connect(a.destination);s.start(t);s.stop(t+3)}catch(e){}}
function spBeep(f){if(!TSND().arrive)return;const a=audio();if(!a)return;try{const t=a.currentTime+.01,o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.0001,t+.18);o.connect(g).connect(a.destination);o.start(t);o.stop(t+.2)}catch(e){}}
function spLaunch(){
  const id=spBrief.dataset.id,s=SPX[id];if(!s)return;
  const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,box=$('spBriefBox');
  box.innerHTML=`<div class="spl"><div class="spl-k">MISSION ${pad(sp(tr()).done.length+1)} · ${esc(s[2])}</div><div class="spl-n" id="splN" aria-live="assertive">3</div>
    <div class="spl-pad"><span class="spl-rk">${ROCKET}<i class="spl-fire"></i></span><span class="spl-smoke"></span></div><button class="sp-btn ghost" id="spSkipL">건너뛰기</button></div>`;
  const steps=['3','2','1','점화'],gap=rm?350:900;
  steps.forEach((t,i)=>spLaunchT.push(setTimeout(()=>{const n=$('splN');if(!n)return;n.textContent=t;n.classList.remove('pop');void n.offsetWidth;n.classList.add('pop');
    if(i<3){spBeep(880);vibe()}else{spBeep(1320);spRumble();box.querySelector('.spl').classList.add('lift');try{if(navigator.vibrate&&TSND().vibe&&!window.TourdyNative)navigator.vibrate([60,40,120])}catch(e){}}},i*gap)));
  spLaunchT.push(setTimeout(spDepart,steps.length*gap+(rm?200:1500)));
}
function spDepart(){
  const id=spBrief.dataset.id,T=tr(),P=sp(T);spBriefClose();if(!SPX[id])return;
  P.to=id;T.to=null;kr(T).to=null;spArm=false;save();
  if(checkSpace())ding();renderSpace();window.scrollTo({top:0,behavior:'smooth'});
}
spBrief.addEventListener('click',e=>{
  if(e.target===spBrief||e.target.closest('#spBack'))return spBriefClose();
  if(e.target.closest('#spGo'))return spLaunch();
  if(e.target.closest('#spSkipL')){spLaunchT.forEach(clearTimeout);spLaunchT=[];spDepart()}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!spBrief.hidden&&!spLaunchT.length)spBriefClose()});

/* ===== 도착 연출 ===== */
function spArrival(x){
  const s=SPX[x.t];if(!s){arrOpen=false;return showArrival()}
  arrOpen=true;const el=$('arrive');el.classList.remove('show-msg');el.hidden=false;
  const n=x.n||sp(tr()).done.length,d=pk(x.d);
  $('arrTk').innerHTML=`<div class="spa"><div class="spa-sky"></div><div class="spa-pl">${planet(s,150)}</div><span class="spa-rk">${ROCKET}</span><div class="spa-st" id="spaSt">궤도 진입</div>
    <div class="patch spa-patch" style="--p:${s[5]}">${planet(s,40)}<span class="pm">MISSION ${pad(n)}</span><b>${esc(s[1])}</b><span class="pd">${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}</span></div></div>`;
  $('arrMsg').innerHTML=`<b>${esc(s[1])} 도착!</b><span>미션 ${n} 완료 · 미션 패치를 받았어요</span><span class="spa-fact">${esc(s[6])} · ${spDist(x.t)}</span>`;
  $('arrOk').textContent='확인';
  const sc=el.querySelector('.spa');spBeep(660);
  arrTimers=[setTimeout(()=>{sc.classList.add('land');const st=$('spaSt');if(st)st.textContent='착륙'},1300),
    setTimeout(()=>{sc.classList.add('stamp');spBeep(520);setTimeout(()=>spBeep(780),120);vibe()},2300),
    setTimeout(()=>el.classList.add('show-msg'),2900)];
}
