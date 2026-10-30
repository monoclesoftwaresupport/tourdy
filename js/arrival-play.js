/* ---------- 도착 연출 2: 직접 뜯고 꾹 눌러 찍기 + 현지 기념품 뽑기 ----------
   1) 표: 절취선을 손가락으로 쓱 그으면 드르륵 진동·소리와 함께 찢어진다 (톡 누르면 바로 찢김)
   2) 도장: 꾹 누르고 있으면 링이 차오르고, 다 차면 쿵 찍힌다
   3) 기념품: 도착마다 캡슐이 하나 떨어진다 · 일반 70% / 레어 25% / 황금 5%
   기념품 기록은 tr().souv = [{id,w,c,t,d}] (id가 있는 목록이라 기기끼리 합칠 때 양쪽 기록이 다 남는다) */
(function(){
const TIER={c:{n:'일반'},r:{n:'레어'},g:{n:'황금'}};
const roll=()=>{const r=Math.random();return r<.05?'g':r<.30?'r':'c'};
const souv=()=>{const T=tr();return T.souv||(T.souv=[])};
const cityName=(w,id)=>w==='kr'?(KRM[id]?KRM[id][1].replace(/\(.+\)/,''):id):(NAT[id]?NAT[id][2]:id);
const regionInk=(w,id)=>{if(w!=='kr'||!KRM[id])return '#1d6fd8';return KINK[Math.max(0,krGroup(KRM[id])-1)]||'#1d6fd8'};
function itemName(w,id,t){const nm=cityName(w,id);
  if(w==='kr'){const ti=window.krTatInfo&&krTatInfo(id),lb=ti?ti[1]:nm;return t==='g'?`황금 ${lb}`:t==='r'?`${lb} 배지`:`${nm} 여행 코인`}
  return t==='g'?`${nm} 황금 메달`:t==='r'?`${nm} 기념 배지`:`${nm} 동전`}
function coin(w,id,t,cls){const ink=regionInk(w,id);let face;
  if(w==='kr')face=t==='c'?`<b class="cn-t">${esc(cityName(w,id).slice(0,2))}</b>`:(window.krTatArt?krTatArt(id,ink):'');
  else face=`<span class="cn-f">${flag(id)}</span>`;
  return `<span class="coin t-${t}${cls?' '+cls:''}" style="--ci:${ink}"><span class="cn-in">${face}</span></span>`}
window.souvCoin=coin;

/* ---- 소리·진동 (효과음 설정을 따른다) ---- */
const SND=()=>{try{return TSND()}catch(e){return {}}};
const buzz=p=>{try{if(!SND().vibe)return;if(window.TourdyNative&&window.TourdyNative.vibrate){window.TourdyNative.vibrate();return}if(navigator.vibrate)navigator.vibrate(p)}catch(e){}};
function ctx(){try{return audio()}catch(e){return null}}
function tone(a,f,t,d,type,v,f2){const o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.05)}
function burst(a,t,d,f,v,q){const n=a.createBuffer(1,Math.max(1,a.sampleRate*d),a.sampleRate),ch=n.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=(Math.random()*2-1)*(1-i/ch.length);
  const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();s.buffer=n;fl.type='bandpass';fl.frequency.value=f;fl.Q.value=q||1;g.gain.value=v;s.connect(fl).connect(g).connect(a.destination);s.start(t)}
const tick=()=>{if(!SND().rip)return;const a=ctx();if(!a)return;try{const t=a.currentTime;burst(a,t,.035,2200+Math.random()*2800,.16,1.3);burst(a,t+.018,.02,3800+Math.random()*1500,.08,1.5)}catch(e){}};
const charge=()=>{if(!SND().arrive)return;const a=ctx();if(!a)return;try{tone(a,220,a.currentTime,.5,'triangle',.05,520)}catch(e){}};
const thump=()=>{if(!SND().arrive)return;const a=ctx();if(!a)return;try{const t=a.currentTime;tone(a,150,t,.22,'sine',.5,48);burst(a,t,.06,900,.35,.7);burst(a,t+.01,.03,3000,.08,1)}catch(e){}};
const pop=()=>{if(!SND().arrive)return;const a=ctx();if(!a)return;try{const t=a.currentTime;tone(a,420,t,.09,'square',.05,900);burst(a,t,.05,1800,.2,.9)}catch(e){}};
const rattle=()=>{if(!SND().arrive)return;const a=ctx();if(!a)return;try{const t=a.currentTime;for(let i=0;i<5;i++)burst(a,t+i*.09,.03,1300+Math.random()*900,.12,2)}catch(e){}};
function fanfare(k){if(!SND().arrive)return;const a=ctx();if(!a)return;try{const t=a.currentTime+.02,b=(f,dt,v,d)=>{tone(a,f,t+dt,d||.9,'sine',v);tone(a,f*2.76,t+dt,(d||.9)*.4,'sine',v*.18)};
  if(k==='g'){[523,659,784,1047,1319].forEach((f,i)=>b(f,i*.09,.16,1.3));for(let i=0;i<10;i++)tone(a,2400+Math.random()*2400,t+.45+i*.05,.25,'sine',.025)}
  else if(k==='r'){b(659,0,.17);b(988,.12,.17,1.1)}
  else b(784,0,.14,.7)}catch(e){}}

/* ---- 뽑기: 도착하는 순간 굴려서 바로 저장 (창을 그냥 닫아도 기념품은 남는다) ---- */
window.arrDropHtml=x=>{try{if(!x||x.w==='space')return '';const w=x.w==='kr'?'kr':'w',id=x.t;if(w==='kr'?!KRM[id]:!NAT[id])return '';
  const L=souv(),t=roll(),same=L.filter(s=>s.w===w&&s.c===id&&s.t===t).length;
  L.push({id:uid(),w,c:id,t,d:dk(today0())});save();
  return `<div class="gacha" id="arrGacha" data-t="${t}">
    <button type="button" class="gc-cap" id="gcCap" aria-label="현지 기념품 캡슐 열기"><i class="gc-top"></i><i class="gc-bot"></i><span class="gc-q">?</span></button>
    <div class="gc-res" hidden>${coin(w,id,t,'big')}<span class="gc-tier">${TIER[t].n}</span><b>${esc(itemName(w,id,t))}</b><small>${same?`${same+1}번째로 모았어요`:'<em class="gc-new">NEW</em> 처음 모았어요'}</small></div>
    <span class="gc-hint">현지 기념품 캡슐이 떨어졌어요 · 눌러서 열기</span></div>`}catch(e){return ''}};
function openCap(){const g=$('arrGacha');if(!g||g.classList.contains('shake')||g.classList.contains('open'))return;const t=g.dataset.t;
  g.classList.add('shake');rattle();buzz([8,40,8,40,8]);
  arrTimers.push(setTimeout(()=>{pop();g.classList.add('open');const r=g.querySelector('.gc-res');if(r)r.hidden=false;
    fanfare(t);buzz(t==='g'?[30,40,30,40,90]:t==='r'?[25,40,25]:[15]);
    if(t!=='c'){const fx=document.createElement('div');fx.className='gc-fx';fx.setAttribute('aria-hidden','true');const n=t==='g'?26:12;
      for(let i=0;i<n;i++){const s=document.createElement('i'),ang=Math.random()*Math.PI*2,d=60+Math.random()*90;s.style.setProperty('--dx',Math.cos(ang)*d+'px');s.style.setProperty('--dy',Math.sin(ang)*d-30+'px');s.style.setProperty('--dl',Math.random()*.15+'s');s.style.setProperty('--rt',Math.random()*720-360+'deg');fx.appendChild(s)}
      g.appendChild(fx)}
    if(window.renderGacha)renderGacha()},620))}

/* ---- 1단계: 표 뜯기 ---- */
const SWIPE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.8-2.4L4.5 15a1.5 1.5 0 0 1 2.3-1.9L9 15"/><path d="M4 4l2 2M20 4l-2 2"/></svg>';
const STAMP='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 3h4a1 1 0 0 1 1 1v2.5c0 1.3-.8 2-1.3 2.7-.4.5-.7 1-.7 1.8v1h4.5A2.5 2.5 0 0 1 20 14.5V16H4v-1.5A2.5 2.5 0 0 1 6.5 12H11v-1c0-.8-.3-1.3-.7-1.8C9.8 8.5 9 7.8 9 6.5V4a1 1 0 0 1 1-1zM4 18h16v2H4z"/></svg>';
function hintEl(el){let h=$('arrHint');if(!h){h=document.createElement('div');h.id='arrHint';h.className='arr-hint';h.setAttribute('aria-live','polite');const c=el.querySelector('.arr-c');c.insertBefore(h,c.firstChild)}h.hidden=false;h.classList.remove('off','nudge');return h}
const nudge=(h,txt)=>{if(txt)h.lastChild.textContent=txt;h.classList.remove('nudge');void h.offsetWidth;h.classList.add('nudge')};
window.arrPlay=(el,tk,st,vert,x)=>{
  const h=hintEl(el);h.innerHTML=`<span class="ah-i">${SWIPE}</span><span>절취선을 손가락으로 쓱 그어 표를 뜯어요</span>`;
  el.classList.add('arr-live');tk.classList.add('tear-ready');tk.style.setProperty('--tear',0);
  tk.setAttribute('tabindex','0');tk.setAttribute('role','button');tk.setAttribute('aria-label','표 뜯기 · 절취선을 쓸어 넘기거나 눌러요');tk.style.touchAction='none';
  const need=Math.max(70,Math.min(170,(vert?tk.offsetWidth:tk.offsetHeight)*.6));
  let down=false,done=false,lx=0,ly=0,dist=0,moved=0,t0=0,ticks=0;
  const rip=()=>{if(done)return;done=true;down=false;tk.classList.remove('tear-ready','tearing');tk.style.setProperty('--tear',1);tk.classList.add('fast','ripping','edge');ripSound();buzz([10,25,10,25,10,25,40]);h.classList.add('off');
    arrTimers.push(setTimeout(()=>{tk.classList.add('gone');tk.style.transform=vert?`translateY(${st.offsetHeight/2}px)`:`translateX(${st.offsetWidth/2}px)`},420),
      setTimeout(()=>stampStage(el,x,h),820))};
  tk.addEventListener('pointerdown',e=>{if(done)return;down=true;lx=e.clientX;ly=e.clientY;moved=0;t0=performance.now();try{tk.setPointerCapture(e.pointerId)}catch(_){}tk.classList.add('tearing');ctx()});
  tk.addEventListener('pointermove',e=>{if(!down||done)return;const d=Math.hypot(e.clientX-lx,e.clientY-ly);lx=e.clientX;ly=e.clientY;dist+=d;moved+=d;
    tk.style.setProperty('--tear',Math.min(1,dist/need).toFixed(3));const k=Math.floor(dist/15);if(k>ticks){ticks=k;tick();buzz(7)}if(dist>=need)rip()});
  const up=()=>{if(!down||done)return;down=false;tk.classList.remove('tearing');
    if(moved<10&&performance.now()-t0<400)return rip(); // 톡 누르면 바로
    if(dist<need)nudge(h,'조금만 더 쭉 그어 주세요')};
  tk.addEventListener('pointerup',up);tk.addEventListener('pointercancel',up);
  tk.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();rip()}});
  setTimeout(()=>{try{tk.focus({preventScroll:true})}catch(_){}},60);
};
/* ---- 2단계: 꾹 눌러 도장 ---- */
function stampStage(el,x,h){if(el.hidden)return;
  h.classList.remove('off');h.innerHTML=`<span class="ah-i">${STAMP}</span><span>도장을 꾹 눌러 찍어요</span>`;
  let b=$('arrPress');if(b)b.remove();b=document.createElement('button');b.type='button';b.id='arrPress';b.className='arr-press';b.setAttribute('aria-label','꾹 눌러 도장 찍기');
  b.innerHTML=`<svg class="ap-ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46"/><circle class="ap-fill" cx="50" cy="50" r="46"/></svg><span class="ap-body">${STAMP}<b>꾹</b></span>`;
  el.querySelector('.arr-c').insertBefore(b,$('arrMsg'));
  const HOLD=520;let tm=null,done=false;
  const go=()=>{if(done)return;done=true;clearTimeout(tm);b.classList.remove('holding');b.classList.add('hit');thump();buzz([45]);h.classList.add('off');
    arrTimers.push(setTimeout(()=>{b.remove();el.classList.add('show-msg','stamped');if(x.hid&&x.hid.length)vibe();if(SND().anno)speak(annoText(x));
      const g=$('arrGacha');if(g){g.classList.add('drop');arrTimers.push(setTimeout(()=>{try{$('gcCap').focus({preventScroll:true})}catch(_){}},500))}},170))};
  const start=e=>{if(done)return;if(e)e.preventDefault();b.classList.add('holding');charge();buzz(8);clearTimeout(tm);tm=setTimeout(go,HOLD)};
  const stop=()=>{if(done||!b.classList.contains('holding'))return;clearTimeout(tm);b.classList.remove('holding');nudge(h,'조금 더 꾹 눌러 주세요')};
  b.addEventListener('pointerdown',start);b.addEventListener('pointerup',stop);b.addEventListener('pointerleave',stop);b.addEventListener('pointercancel',stop);
  b.addEventListener('contextmenu',e=>e.preventDefault());
  b.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();go()}});
  setTimeout(()=>{try{b.focus({preventScroll:true})}catch(_){}},60);
}
// 창을 닫으면 연출용 요소를 정리 (같은 창을 승차권 보기·인증서 등에서도 쓰므로)
window.arrPlayReset=()=>{const b=$('arrPress');if(b)b.remove();const h=$('arrHint');if(h)h.hidden=true;$('arrive').classList.remove('arr-live','stamped')};
$('arrive').addEventListener('click',e=>{if(e.target.closest('#gcCap'))openCap()});

/* ---- 업적 탭: 현지 기념품 도감 ---- */
window.renderGacha=()=>{const box=$('achGacha');if(!box)return;const L=(tr().souv||[]).filter(s=>s&&TIER[s.t]);
  const cnt={c:0,r:0,g:0},M=new Map();
  L.forEach(s=>{cnt[s.t]++;const k=s.w+':'+s.c,o=M.get(k)||{w:s.w,c:s.c,n:{c:0,r:0,g:0},last:''};o.n[s.t]++;if((s.d||'')>o.last)o.last=s.d||'';M.set(k,o)});
  const kinds=new Set(L.map(s=>s.w+':'+s.c+':'+s.t)).size,items=[...M.values()].sort((a,b)=>a.last<b.last?1:a.last>b.last?-1:0);
  box.innerHTML=`<div class="panel-head"><h2>현지 기념품</h2><span class="note">도착할 때마다 캡슐 하나 · 일반 70% · 레어 25% · 황금 5%</span></div>`+
    (L.length?`<div class="gc-sum"><span class="t-c"><i></i>일반 <b>${cnt.c}</b></span><span class="t-r"><i></i>레어 <b>${cnt.r}</b></span><span class="t-g"><i></i>황금 <b>${cnt.g}</b></span><span class="gc-kinds">모은 종류 <b>${kinds}</b></span></div>
    <div class="gc-grid">${items.map(o=>{const best=o.n.g?'g':o.n.r?'r':'c';
      return `<div class="gc-item" title="${esc(itemName(o.w,o.c,best))}">${coin(o.w,o.c,best)}<b>${esc(cityName(o.w,o.c))}</b><span class="gc-dots" aria-label="일반 ${o.n.c} · 레어 ${o.n.r} · 황금 ${o.n.g}"><i class="t-c${o.n.c?' on':''}"></i><i class="t-r${o.n.r?' on':''}"></i><i class="t-g${o.n.g?' on':''}"></i></span></div>`}).join('')}</div>`
    :'<p class="empty">아직 모은 기념품이 없어요. 다음에 도착하면 캡슐이 떨어져요.</p>')};
})();
