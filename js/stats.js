/* ---------- stats ---------- */
function streak(pd){let d=today0(),n=0;if(!((pd[dk(d)]?.study||0)>=6e4))d=addD(d,-1);while((pd[dk(d)]?.study||0)>=6e4&&n<3650){n++;d=addD(d,-1)}return n}
function renderStats(){
  const pd=perDay(),days=[];
  if(range===7){const st0=addD(view,-((view.getDay()-wkStart()+7)%7));for(let i=0;i<7;i++)days.push(addD(st0,i))}
  else if(range===30){const m=statMonth;for(let d=new Date(m);d.getMonth()===m.getMonth();d=addD(d,1))days.push(d)}
  else if(range===365){const y=statYear;for(let d=new Date(y,0,1);d.getFullYear()===y;d=addD(d,1))days.push(d)}
  else for(let i=range-1;i>=0;i--)days.push(addD(view,-i));
  const lastDay=days[days.length-1],elapsed=days.filter(d=>d<=view).length;
  const st=days.map(d=>pd[dk(d)]||{by:{},study:0,rest:0,waste:0});
  const tot=st.reduce((a,x)=>a+x.study,0),off=st.reduce((a,x)=>a+x.rest+x.waste,0),active=st.filter(x=>x.study>0).length;
  const RN={1:'오늘',7:'이번 주',30:`${statMonth.getMonth()+1}월`,365:`${statYear}년`},md=d=>`${d.getMonth()+1}/${d.getDate()}`,ymd=d=>`${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`;
  if(range===365){const cy=today0().getFullYear();
    $('rangeLbl').innerHTML=`<span class="yearnav"><button class="iconbtn" data-y="-1" aria-label="이전 해">${CL}</button><b>${statYear}년</b><button class="iconbtn" data-y="1" aria-label="다음 해" ${statYear>=cy?'disabled':''}>${CR}</button></span>`}
  else if(range===30){const t=today0(),last=statMonth.getFullYear()>t.getFullYear()||(statMonth.getFullYear()===t.getFullYear()&&statMonth.getMonth()>=t.getMonth());
    $('rangeLbl').innerHTML=`<span class="yearnav"><button class="iconbtn" data-mo="-1" aria-label="이전 달">${CL}</button><b>${statMonth.getFullYear()}년 ${statMonth.getMonth()+1}월</b><button class="iconbtn" data-mo="1" aria-label="다음 달" ${last?'disabled':''}>${CR}</button></span>`}
  else $('rangeLbl').textContent=range===1?md(view):`${md(days[0])} – ${md(lastDay)}`;
  const [va,vb]=bounds(view),[ra]=bounds(days[0]),[,rb]=bounds(lastDay);
  const nSess=S.sessions.concat(S.running&&S.running.kind==='study'?[S.running]:[]).filter(x=>x.kind==='study'&&x.start>=ra&&x.start<rb).length;
  const sk=streak(pd),MIN=6e4,dayTxt=d=>`${d.getMonth()+1}월 ${d.getDate()}일 ${DOW[d.getDay()]}요일`;
  // 최장 연속 (기간 안, 오늘까지)
  let best=0,bs=null,be=null,cur=0,cs=null;
  for(const d of days){if(d>view)break;if((pd[dk(d)]?.study||0)>=MIN){if(!cur)cs=d;cur++;if(cur>best){best=cur;bs=cs;be=d}}else cur=0}
  const T=(lbl,val,small,cls='')=>`<div class="tile ${cls}"><span>${lbl}</span><b>${val}</b><small>${small}</small></div>`;
  const tl=[T('공부 시간',fmt(tot).slice(0,-3),`${RN[range]} 합계`)];
  if(range!==1)tl.push(T('집중한 날',`${active}일`,`${elapsed}일 중`));
  tl.push(T('세션',`${nSess}회`,range===1?'오늘 시작한 공부':`${RN[range]} 시작한 공부`));
  if(range!==1)tl.push(T('하루 평균',fmt(tot/Math.max(1,elapsed)).slice(0,-3),'지난 날 기준'));
  tl.push(T('집중 효율',tot+off?Math.round(tot/(tot+off)*100)+'%':'–','순공 ÷ (순공+휴식+딴짓)'));
  if(range===365)tl.push(T('최장 연속',`${best}일`,best?`${md(bs)} – ${md(be)}`:'기록 없음','alert'));
  else tl.push(T('연속 공부',`${sk}일`,'하루 1분 이상 기준','alert'));
  $('tiles').innerHTML=tl.join('');$('tiles').dataset.n=tl.length;
  // 최고 기록
  const brows=[];
  if(range!==1){let bi=-1;st.forEach((x,i)=>{if(x.study>0&&(bi<0||x.study>st[bi].study))bi=i});
    brows.push(['가장 집중한 날',bi<0?'–':dayTxt(days[bi]),bi<0?'':fmtH(st[bi].study)])}
  if(range>=30){const wk={};days.forEach((d,i)=>{const w=addD(d,-((d.getDay()-wkStart()+7)%7)),k=dk(w);wk[k]=(wk[k]||0)+st[i].study});
    const top=Object.entries(wk).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1])[0];
    brows.push(['가장 집중한 주',top?`${md(pk(top[0]))} – ${md(addD(pk(top[0]),6))}`:'–',top?fmtH(top[1]):''])}
  if(range===365){const mo=Array(12).fill(0);days.forEach((d,i)=>mo[d.getMonth()]+=st[i].study);
    const mi=mo.reduce((b,v,i)=>v>mo[b]?i:b,0);brows.push(['가장 집중한 월',mo[mi]?`${mi+1}월`:'–',mo[mi]?fmtH(mo[mi]):''])}
  // 집중 효율 = 순공 ÷ (순공+휴식+딴짓), 기록이 있는 날·주만
  const eff=x=>{const a=x.study+x.rest+x.waste;return a>0?x.study/a:null},pct=v=>Math.round(v*100)+'%';
  if(range!==1){const de=days.map((d,i)=>[d,eff(st[i])]).filter(([,v])=>v!=null);
    if(de.length){const hi=de.reduce((b,c)=>c[1]>b[1]?c:b),lo=de.reduce((b,c)=>c[1]<b[1]?c:b);
      brows.push(['효율 가장 높은 날',dayTxt(hi[0]),pct(hi[1])]);if(de.length>1)brows.push(['효율 가장 낮은 날',dayTxt(lo[0]),pct(lo[1])])}
    else brows.push(['효율 가장 높은 날','–',''])}
  if(range>=30){const wk={};days.forEach((d,i)=>{const k=dk(addD(d,-((d.getDay()-wkStart()+7)%7)));const w=wk[k]||(wk[k]={study:0,rest:0,waste:0});w.study+=st[i].study;w.rest+=st[i].rest;w.waste+=st[i].waste});
    const we=Object.entries(wk).map(([k,w])=>[pk(k),eff(w)]).filter(([,v])=>v!=null),wl=d=>`${md(d)} – ${md(addD(d,6))}`;
    if(we.length){const hi=we.reduce((b,c)=>c[1]>b[1]?c:b),lo=we.reduce((b,c)=>c[1]<b[1]?c:b);
      brows.push(['효율 가장 높은 주',wl(hi[0]),pct(hi[1])]);if(we.length>1)brows.push(['효율 가장 낮은 주',wl(lo[0]),pct(lo[1])])}}
  $('bestPanel').hidden=!brows.length;
  // 공부 메모 (이 기간)
  {const ms=S.sessions.filter(x=>x.memo&&x.kind==='study'&&x.start>=ra&&x.start<rb).sort((a,b)=>b.start-a.start);
   $('memoPanel').hidden=!ms.length;$('memoN').textContent=ms.length?`${ms.length}개`:'';
   $('memoList').innerHTML=ms.slice(0,30).map(x=>{const sb=subj(x.sid),d=new Date(x.start);
     return `<li><span class="dot" style="--c:${sb?.color||'#8D8D86'}"></span><div><b>${esc(x.memo)}</b><small>${sb?esc(sb.name):'과목'} · ${d.getMonth()+1}/${d.getDate()} ${hm(x.start)} · ${fmtH(x.end-x.start)}</small></div></li>`}).join('')}
  // 집중 효율 그래프 (한 달·1년): 날마다 효율을 선으로
  $('effPanel').hidden=!(range===30||range===365);
  if(!$('effPanel').hidden){
    const W=Math.max(200,$('effPlot').clientWidth),H=170,n=days.length;
    const pts=[];days.forEach((d,i)=>{const e=d>view?null:eff(st[i]);if(e!=null)pts.push([(i+.5)/n*W,H-e*H,e,d])});
    const avg=pts.length?pts.reduce((a,p)=>a+p[2],0)/pts.length:null;
    let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="날짜별 집중 효율"><line x1="0" x2="${W}" y1="${H/2}" y2="${H/2}" stroke="var(--line)" stroke-dasharray="3 4"/><line x1="0" x2="${W}" y1="0" y2="0" stroke="var(--line)" stroke-dasharray="3 4"/>`;
    if(pts.length){
      const line=pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
      if(pts.length>1)svg+=`<path d="${line}L${pts[pts.length-1][0].toFixed(1)},${H}L${pts[0][0].toFixed(1)},${H}Z" fill="var(--accent)" fill-opacity=".12"/><path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
      svg+=`<line x1="0" x2="${W}" y1="${(H-avg*H).toFixed(1)}" y2="${(H-avg*H).toFixed(1)}" stroke="var(--muted)" stroke-width="1" stroke-dasharray="6 4"/>`;
      if(range===30||pts.length<40)svg+=pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"><title>${md(p[3])} ${pct(p[2])}</title></circle>`).join('');
    }
    $('effPlot').innerHTML=svg+'</svg>'+(pts.length?'':'<p class="note" style="position:absolute;inset:0;display:grid;place-items:center;margin:0">이 기간에 기록이 없어요</p>');
    $('effAvg').textContent=avg!=null?`평균 ${pct(avg)} · 점선`:'';
    $('effX').innerHTML=range===30?days.map((d,i)=>i===0||d.getDate()%5===0?`<span style="left:${(i+.5)/n*100}%">${d.getDate()}</span>`:'').join('')
      :Array.from({length:12},(_,m)=>{const i=days.findIndex(d=>d.getMonth()===m);return `<span style="left:${(i+.5)/n*100}%">${m+1}월</span>`}).join('');
  }
  $('best').innerHTML=brows.map(([l,v,t])=>`<li><span class="bl">${l}</span><span class="bv">${v}</span><span class="bt">${t}</span></li>`).join('');
  // bars: 오늘=시간대별, 일주일·한 달=날짜별, 1년=월별
  const order=S.subjects;let bk=[];
  if(range===1){
    const visibleStudy=allSessions().filter(x=>x.kind==='study'&&x.end>va&&x.start<va+24*36e5);
    for(let h=0;h<24;h++){const a=va+h*36e5,b=a+36e5,by={};let sum=0;
      for(const x of visibleStudy){const o=Math.min(b,x.end)-Math.max(a,x.start);if(o>0){by[x.sid]=(by[x.sid]||0)+o;sum+=o}}
      const hh=(h+DS)%24;bk.push({by,study:sum,lbl:h%6===0?hh:'',tt:`${hh}시 ${fmtH(sum)}`,now:isToday()&&(new Date().getHours()-DS+24)%24===h})}
  }else if(range===365){
    for(let i=0;i<12;i++){const m=new Date(statYear,i,1),by={};let sum=0;
      for(let d=new Date(m);d.getMonth()===m.getMonth()&&d<=view;d=addD(d,1)){const e=pd[dk(d)];if(!e)continue;for(const k in e.by)by[k]=(by[k]||0)+e.by[k];sum+=e.study}
      bk.push({by,study:sum,lbl:`${m.getMonth()+1}월`,tt:`${m.getFullYear()}년 ${m.getMonth()+1}월 ${fmtH(sum)}`,now:m.getFullYear()===view.getFullYear()&&i===view.getMonth()})}
  }else bk=st.map((x,i)=>({by:x.by,study:x.study,lbl:range===7?DOW[days[i].getDay()]:(i===0||days[i].getDate()%5===0?days[i].getDate():''),tt:`${md(days[i])} ${fmtH(x.study)}`,now:dk(days[i])===dk(today0())}));
  $('barsTitle').textContent=range===1?'시간대별 공부 시간':range===365?'월별 공부 시간':'날짜별 공부 시간';
  let max,yt;
  if(range===1){max=36e5;yt=['60분','30분','0']}
  else{const mh=Math.max(2,Math.ceil(Math.max(...bk.map(x=>x.study))/36e5/2)*2);max=mh*36e5;yt=[mh+'h',mh/2+'h','0']}
  const cols=bk.map(x=>`<div class="colm${x.now?' sel':''}" title="${x.tt}">${order.map(s=>x.by[s.id]?`<i style="height:${x.by[s.id]/max*100}%;background:${s.color}" title="${esc(s.name)} ${fmtH(x.by[s.id])}"></i>`:'').join('')}</div>`).join('');
  $('bars').innerHTML=`<div class="yax"><span>${yt[0]}</span><span>${yt[1]}</span><span>0</span></div>
    <div class="plot"><span class="gl2" style="top:0"></span><span class="gl2" style="top:50%"></span>${cols}</div><div class="xax">${bk.map(x=>`<span>${x.lbl}</span>`).join('')}</div>`;
  // share
  const by={};st.forEach(x=>{for(const k in x.by)by[k]=(by[k]||0)+x.by[k]});
  const rows=order.filter(s=>by[s.id]).sort((a,b)=>by[b.id]-by[a.id]);
  if(!tot){$('share').innerHTML='<p class="note">이 기간에 기록이 없어요.</p>'}
  else{let acc=0;const stops=rows.map(s=>{const a=acc;acc+=by[s.id]/tot*360;return `${s.color} ${a}deg ${acc}deg`}).join(',');
    $('share').innerHTML=`<div class="donut" style="background:conic-gradient(${stops})" role="img" aria-label="과목 비율"></div>
      <ul class="slist">${rows.map(s=>`<li><span class="dot" style="--c:${s.color}"></span><span class="sn">${esc(s.name)}</span><span class="sv">${fmtH(by[s.id])}</span><span class="sp">${Math.round(by[s.id]/tot*100)}%</span></li>`).join('')}</ul>`}
  // heatmap
  $('heatPanel').hidden=range!==365;
  const t0=today0(),y0=new Date(statYear,0,1),y1=new Date(statYear,11,31),start=addD(y0,-y0.getDay()),weeks=Math.ceil((Math.round((y1-start)/864e5)+1)/7);let h='';
  for(let i=0;i<weeks*7;i++){const d=addD(start,i),k=dk(d),v=(pd[k]?.study||0)/36e5;
    const lv=d>t0||d.getFullYear()!==statYear?'fut':heatLv(v*60);
    h+=`<i class="${lv}${k===dk(t0)?' td':''}" title="${d.getMonth()+1}/${d.getDate()} ${fmtH(v*36e5)}"></i>`}
  $('heat').innerHTML=h;
  {const w=$('heat').parentElement;requestAnimationFrame(()=>{const td=w.querySelector('.td');w.scrollLeft=td?td.offsetLeft-w.clientWidth+60:w.scrollWidth;w.classList.toggle('more',w.scrollLeft>2)});
   w.onscroll=()=>w.classList.toggle('more',w.scrollLeft>2);
   if(!w.dataset.pc){w.dataset.pc='1';let sx=0,sl=0,on=false;
     // PC: 마우스로 끌어서 이동
     w.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;on=true;sx=e.clientX;sl=w.scrollLeft;w.classList.add('drag');w.setPointerCapture(e.pointerId)});
     w.addEventListener('pointermove',e=>{if(on)w.scrollLeft=sl-(e.clientX-sx)});
     const end=()=>{on=false;w.classList.remove('drag')};w.addEventListener('pointerup',end);w.addEventListener('pointercancel',end);
     // PC: 마우스 휠(세로)을 가로 이동으로
     w.addEventListener('wheel',e=>{if(w.scrollWidth<=w.clientWidth||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
       const max=w.scrollWidth-w.clientWidth;if((e.deltaY<0&&w.scrollLeft<=0)||(e.deltaY>0&&w.scrollLeft>=max))return;
       e.preventDefault();w.scrollLeft+=e.deltaY},{passive:false})}}$('hleg').innerHTML=heatLegend();$('streakTxt').textContent=`${sk}일 연속`;
  $('exBanner').hidden=!S.sessions.some(x=>x.ex);
}
let statYear=today0().getFullYear();
let rsT;window.addEventListener('resize',()=>{clearTimeout(rsT);rsT=setTimeout(()=>{if(tab==='stats')renderStats()},150)});
let statMonth=new Date(today0().getFullYear(),today0().getMonth(),1);
$('rangeLbl').addEventListener('click',e=>{const b=e.target.closest('[data-y],[data-mo]');if(!b||b.disabled)return;
  if(b.dataset.y)statYear+=+b.dataset.y;else statMonth=new Date(statMonth.getFullYear(),statMonth.getMonth()+ +b.dataset.mo,1);renderStats()});
$('rangeSeg').addEventListener('click',e=>{const b=e.target.closest('[data-r]');if(!b)return;range=+b.dataset.r;
  $('rangeSeg').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderStats()});
