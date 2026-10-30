/* ---------- 주간 챌린지 (여행 탭 → 주간) ----------
   - 매주 월요일 0시(한국 시간) 새로 시작. 다음 주 목적지는 후보 3개국 중 투표로 정한다.
   - 공부 시간으로만 겨룬다: 타이머로 잰 공부만(직접 기록·예시 기록 제외), 마일리지 2배와 무관.
     서버가 다시 확인한다(끝난 지 24시간 안·겹침 불가·하루 8시간까지 → 주 최대 56시간·참가 후 공부만).
   - 등급(브론즈~다이아)이 같은 사람끼리 30명 리그. 승급은 위로 갈수록 어렵다(상위 30/20/15/10%·주 10/15/25/35시간).
     강등은 하위 20%이면서 등급별 유지 기준(실버 3·골드 5·플래티넘 10·다이아 15시간) 미만.
   - 협동 목표, 공부 시간으로 여는 랜드마크 5곳(열릴 때마다 엽서), 완주하면 그 나라 무료 항공권.
   - 월요일에 지난주 결과 카드를 보여 주고 보상을 넣는다. 보상은 고유 id라 기기가 여러 대여도 한 번만.
   - 주중 알림: 리그 순위 상승, 완주 1시간 전, 완주, 일요일 마감 3시간 전. */
(function(){
  const C={
    JP:['일본',['도쿄 타워','교토 후시미 이나리','오사카 성','후지산','나라 사슴 공원']],
    US:['미국',['자유의 여신상','금문교','그랜드 캐니언','타임스 스퀘어','옐로스톤']],
    GB:['영국',['빅벤','타워 브리지','스톤헨지','에든버러 성','대영박물관']],
    FR:['프랑스',['에펠탑','루브르 박물관','몽생미셸','베르사유 궁전','니스 해변']],
    DE:['독일',['브란덴부르크 문','노이슈반슈타인 성','쾰른 대성당','베를린 장벽','하이델베르크']],
    IT:['이탈리아',['콜로세움','피사의 사탑','베네치아 운하','피렌체 두오모','아말피 해안']],
    CA:['캐나다',['나이아가라 폭포','밴프 국립공원','CN 타워','퀘벡 구시가지','로키산맥']],
    AU:['호주',['오페라 하우스','하버 브리지','그레이트 배리어 리프','울루루','그레이트 오션 로드']],
    CH:['스위스',['마테호른','융프라우','루체른 카펠교','제네바 호수','라인 폭포']],
    ES:['스페인',['사그라다 파밀리아','알람브라 궁전','구엘 공원','프라도 미술관','세비야 대성당']],
  };
  const TIERS=['브론즈','실버','골드','플래티넘','다이아'];
  const LANDMARK_H=[3,7,10,20,35];               // 랜드마크가 열리는 주간 공부 시간 (주 최대 56시간)
  const FINISH=600,COOP_MIN=120,RANK_MIN_SIZE=5;  // 완주 10시간, 협동 보상은 2시간 이상, 순위 보상은 5명 이상 리그
  const PROMO_PCT=[30,20,15,10],PROMO_H=[10,15,25,35],KEEP_H=[0,3,5,10,15];   // 서버와 같은 승급·강등 기준
  const REWARD={stamp:30,gold:100,passport:200,coop:20};
  const NAME={stamp:'완주 스탬프',gold:'리그 상위 10% 금 뱃지',passport:'리그 1등 특별 여권',coop:'협동 목표 스탬프',ticket:'무료 항공권'};
  const NOTE_ID={rank:41070,near:41071,done:41072,deadline:41073};
  let board=null,loading=false,err='',joining=false,voting=false,loadedAt=0;
  // 여행 탭은 10초마다 다시 그려진다. 내용이 그대로면 화면을 건드리지 않아서
  // 펼친 '규칙 보기', 입력 중인 닉네임, 스크롤이 유지된다.
  let lastHtml='',rulesOpen=false,nickDraft='';
  const A=()=>window.TourdyAccount,sb=()=>A()&&A().client&&A().client(),me=()=>A()&&A().userId&&A().userId();
  const hm=min=>{min=Math.max(0,Math.round(min||0));const h=Math.floor(min/60),m=min%60;return h?`${h}시간${m?' '+m+'분':''}`:`${m}분`};
  const cname=c=>(C[c]||[c])[0];
  const tname=t=>TIERS[Math.max(0,Math.min(4,t|0))];
  const wk=w=>String(w||'').slice(5).replace('-','/');
  // 받침에 맞는 조사: 영국으로·프랑스로·독일로 / 플래티넘이에요·골드예요
  const jong=s=>{const c=String(s).charCodeAt(String(s).length-1)-0xAC00;return c>=0&&c<=11171?c%28:0};
  const ro=s=>s+(jong(s)&&jong(s)!==8?'으로':'로');
  const ieyo=s=>s+(jong(s)?'이에요':'예요');
  // 이 기기에만 남기는 작은 기록(올린 공부, 본 결과, 보낸 알림). 계정이 바뀌면 새로 시작
  const local=(key,fallback)=>({get(){try{const o=JSON.parse(localStorage.getItem(key)||'null');return o&&o.uid===me()?o.v:fallback}catch(e){return fallback}},
    set(v){try{localStorage.setItem(key,JSON.stringify({uid:me(),v}))}catch(e){}}});
  const SENT=local('tourdy.challenge.sent.v2',{}),SEEN=local('tourdy.challenge.seen.v1',[]),NOTED=local('tourdy.challenge.noted.v1',{});

  /* --- 끝난 공부를 서버에 올리기 (이 기기에서 이미 올린 건 기억해 두고, 서버도 중복을 막는다) --- */
  let reporting=false,reportTimer=null;
  async function report(){
    const c=sb();if(!c||!me()||reporting||!window.TourdyRewards)return;
    reporting=true;let any=false;
    try{
      const ids=SENT.get(),since=Date.now()-24*36e5+60e3;
      const todo=(S.sessions||[]).filter(s=>TourdyRewards.eligible(s)&&s.end>=since&&s.end<=Date.now()+60e3&&s.id&&!ids[s.id]);
      for(const s of todo){
        const {data,error}=await c.rpc('challenge_log',{p_sid:String(s.id),p_start:new Date(s.start).toISOString(),p_end:new Date(s.end).toISOString()});
        if(error)break;                     // 인터넷이 끊겼으면 다음에 다시
        ids[s.id]=s.end;if(data>0)any=true;
      }
      const cut=Date.now()-2*864e5;for(const k in ids)if(ids[k]<cut)delete ids[k];
      SENT.set(ids);
    }finally{reporting=false}
    if(any)load();
  }
  const scheduleReport=()=>{clearTimeout(reportTimer);reportTimer=setTimeout(report,5000)};

  /* --- 주중 알림 (설정에서 기기 알림을 켠 경우만) --- */
  function notify(kind,title,body,at){
    if(typeof NF==='function'&&!NF().push)return;
    const N=window.TourdyNative;
    if(N&&N.challengeNotify){Promise.resolve(N.challengeNotify({id:NOTE_ID[kind],title,body,at:at||Date.now()+1000})).catch(()=>{});return}
    if(at&&at>Date.now()+2000)return;     // 웹은 예약 알림을 못 보낸다
    try{if('Notification' in window&&Notification.permission==='granted'&&document.hidden)new Notification(title,{body})}catch(e){}
    if(!document.hidden)toast(`${title} · ${body}`);
  }
  function weeklyNotices(){
    if(!board||!board.joined)return;
    const noted=NOTED.get(),key=board.week,n=noted[key]||{},mine=board.my_minutes||0;
    const rows=board.members||[],rank=rows.findIndex(r=>r.me)+1;
    if(n.rank&&rank&&rank<n.rank&&rows.length>1)notify('rank','리그 순위가 올랐어요',`${tname(board.tier)} 리그 ${rank}위가 됐어요. 이대로 쭉!`);
    if(rank)n.rank=rank;
    if(mine>=FINISH-60&&mine<FINISH&&!n.near){n.near=1;notify('near','완주까지 1시간',`${hm(FINISH-mine)}만 더 공부하면 ${cname(board.country)} 완주 스탬프와 무료 항공권을 받아요.`)}
    if(mine>=FINISH&&!n.done){n.done=1;notify('done',`${cname(board.country)} 완주!`,'완주 스탬프와 무료 항공권은 월요일에 받아요.')}
    // 일요일 마감 3시간 전 (아직 완주 전이면 예약, 완주했으면 취소)
    const N=window.TourdyNative,at=new Date(board.ends_at).getTime()-3*36e5;
    if(mine<FINISH&&at>Date.now()){if(n.deadline!==at){n.deadline=at;notify('deadline','주간 챌린지 마감 3시간 전',`완주까지 ${hm(FINISH-mine)} 남았어요. 오늘 밤 12시에 마감돼요.`,at)}}
    else if(n.deadline&&N&&N.challengeCancel){Promise.resolve(N.challengeCancel([NOTE_ID.deadline])).catch(()=>{});n.deadline=0}
    noted[key]=n;const ks=Object.keys(noted).sort();while(ks.length>4)delete noted[ks.shift()];   // 최근 4주만 기억
    NOTED.set(noted);
  }

  /* --- 랜드마크 엽서: 이번 주 공부 시간으로 열린 랜드마크마다 한 장 --- */
  function collectPostcards(){
    if(!board||!board.joined)return;
    const land=(C[board.country]||['',[]])[1],mine=board.my_minutes||0;
    S.postcards=S.postcards||[];const have=new Set(S.postcards.map(p=>p.id)),fresh=[];
    land.forEach((name,i)=>{const id=`lm:${board.week}:${board.country}:${i}`;
      if(mine>=LANDMARK_H[i]*60&&!have.has(id)){S.postcards.push({id,week:board.week,country:board.country,i,name});fresh.push(name)}});
    if(fresh.length){save();toast(`엽서가 도착했어요: ${fresh.join(', ')}`)}
  }

  /* --- 지난주 결과 → 보상 --- */
  function rewardsFor(r){
    const out=[],top=Math.max(1,Math.ceil(r.size*0.1));
    if(r.minutes>=FINISH)out.push('stamp','ticket');
    if(r.minutes>=FINISH&&r.size>=RANK_MIN_SIZE&&r.rank<=top)out.push('gold');
    if(r.minutes>=FINISH&&r.size>=RANK_MIN_SIZE&&r.rank===1)out.push('passport');
    if(r.coop_done&&r.minutes>=COOP_MIN)out.push('coop');
    return out;
  }
  // 무료 항공권: 지금 있는 곳에서 그 나라까지 이코노미 1회 요금만큼 (같은 나라에 있거나 계산할 수 없으면 100)
  function ticketMiles(country){
    try{const T=tr();if(T&&T.at&&T.at!==country&&typeof flightMin==='function'&&typeof NAT!=='undefined'&&NAT[T.at]&&NAT[country])
      return Math.max(50,Math.round(flightMin(T.at,country)*((typeof WMUL!=='undefined'&&WMUL[0])||1)))}catch(e){}
    return 100;
  }
  async function claim(){
    const c=sb();if(!c||!me())return;
    const {data,error}=await c.rpc('challenge_results');if(error||!Array.isArray(data))return;
    S.badges=S.badges||[];S.gifts=S.gifts||[];
    const have=new Set(S.badges.map(b=>b.id)),gifts=new Set(S.gifts.map(g=>g.id));let changed=false;
    const got={};
    for(const r of data){
      for(const kind of rewardsFor(r)){
        const id=`wk:${r.week}:${kind}`;
        if(kind==='ticket'){
          if(gifts.has(id))continue;
          const m=ticketMiles(r.country);
          S.gifts.push({id,m,t:`주간 챌린지 ${cname(r.country)} 무료 항공권`,d:dk(today0())});
          (got[r.week]=got[r.week]||[]).push({kind,m});changed=true;continue;
        }
        if(have.has(id))continue;
        S.badges.push({id,kind,week:r.week,country:r.country,rank:r.rank,size:r.size,minutes:r.minutes,tier:r.tier});
        if(!gifts.has(id))S.gifts.push({id,m:REWARD[kind],t:`주간 챌린지 ${cname(r.country)} · ${NAME[kind]}`,d:dk(today0())});
        (got[r.week]=got[r.week]||[]).push({kind,m:REWARD[kind]});changed=true;
      }
    }
    if(changed){save();renderAll();if(typeof bonusCheck==='function')bonusCheck()}
    // 아직 안 본 가장 최근 주 결과를 카드로 한 번 보여 준다
    // 가장 최근 주 결과만 카드로 한 번 보여 주고, 그보다 오래된 주는 본 것으로 친다
    const seen=SEEN.get(),latest=data[0];
    if(latest&&!seen.includes(latest.week))showResult(latest,got[latest.week]||[]);
    SEEN.set([...new Set([...SEEN.get(),...data.map(r=>r.week)])].slice(-12));
  }
  function showResult(r,got){
    const d=$('wkResult');if(!d||d.open)return;
    const up=r.next_tier>r.tier,down=r.next_tier<r.tier;
    const tierLine=up?`<b class="wkr-up">${tname(r.tier)} → ${tname(r.next_tier)} 승급!</b>`:down?`<b class="wkr-down">${tname(r.tier)} → ${tname(r.next_tier)}</b>`:`<b>${tname(r.tier)} 유지</b>`;
    const list=got.length?got.map(g=>`<li><span>${esc(NAME[g.kind])}</span><b>+${g.m}</b></li>`).join(''):'';
    $('wkResultBody').innerHTML=`<div class="wkr-flag">${flag(r.country)}</div><small class="wkr-k">${esc(wk(r.week))} 주 · ${esc(cname(r.country))} 챌린지 결과</small>
      <div class="wkr-stats"><div><small>공부</small><b>${hm(r.minutes)}</b></div><div><small>리그 순위</small><b>${r.rank}위 / ${r.size}명</b></div></div>
      <p class="wkr-tier">다음 주 등급 · ${tierLine}</p>
      ${list?`<ul class="wkr-list">${list}</ul><p class="note">받은 마일리지는 여행에 바로 쓸 수 있어요.</p>`:`<p class="note">${r.minutes<FINISH?`이번엔 완주(10시간)까지 ${hm(FINISH-r.minutes)}이 모자랐어요. 이번 주에 다시 도전해 봐요!`:'수고했어요!'}</p>`}`;
    d.showModal();
    const s=SEEN.get();if(!s.includes(r.week)){s.push(r.week);SEEN.set(s.slice(-12))}
  }
  {const ok=$('wkResultOk');if(ok)ok.onclick=()=>{$('wkResult').close();if(window.TourdyChallenge)window.TourdyChallenge.render()}}

  /* --- 이번 주 화면 --- */
  async function load(){
    const c=sb();if(!c||!me()||loading)return;
    loading=true;
    try{const {data,error}=await c.rpc('challenge_board');if(error)throw error;board=data;err='';loadedAt=Date.now();collectPostcards();weeklyNotices()}
    catch(e){err='챌린지 정보를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'}
    finally{loading=false;if(visible())render()}
  }
  async function join(){
    const c=sb();if(!c||joining)return;
    joining=true;render();
    try{const {data,error}=await c.rpc('challenge_join',{p_nick:nickDraft});if(error)throw error;board=data;err='';loadedAt=Date.now();nickDraft='';
      SENT.set({});scheduleReport()}      // 참가 직후 끝난 공부를 바로 올릴 수 있게
    catch(e){err='참가하지 못했어요. 인터넷 연결을 확인해 주세요.'}
    finally{joining=false;render()}
  }
  async function vote(country){
    const c=sb();if(!c||voting)return;
    voting=true;render();
    try{const {data,error}=await c.rpc('challenge_vote',{p_country:country});if(error)throw error;board=data;err=''}
    catch(e){err='투표하지 못했어요. 인터넷 연결을 확인해 주세요.'}
    finally{voting=false;render()}
  }
  const visible=()=>typeof tab!=='undefined'&&tab==='travel'&&tr().world==='week';
  const left=t=>{const ms=new Date(t)-Date.now();if(!(ms>0))return '곧 새 챌린지';const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5);return d?`${d}일 ${h}시간 남음`:`${h}시간 ${Math.floor(ms%36e5/6e4)}분 남음`};
  const passportCover=b=>`<div class="wk-pass" title="${esc(wk(b.week))} 주 ${esc(cname(b.country))} 리그 1등"><small>SPECIAL PASSPORT</small>${flag(b.country)}<b>${esc(cname(b.country))}</b><span>${esc(wk(b.week))} 주 · ${esc(tname(b.tier))} 리그 1등</span></div>`;
  function collection(){
    const list=(S.badges||[]).slice().sort((a,b)=>String(b.week).localeCompare(String(a.week)));
    const pass=list.filter(b=>b.kind==='passport'),others=list.filter(b=>b.kind!=='passport');
    const cards=(S.postcards||[]).slice().sort((a,b)=>String(b.week).localeCompare(String(a.week))||a.i-b.i);
    if(!list.length&&!cards.length)return '<p class="note">아직 받은 챌린지 보상이 없어요. 공부 3시간이면 첫 랜드마크 엽서가, 10시간이면 완주 스탬프와 무료 항공권이 와요.</p>';
    return `${pass.length?`<span class="plabel">특별 여권</span><div class="wk-passes">${pass.map(passportCover).join('')}</div>`:''}
      ${others.length?`<span class="plabel">스탬프 · 뱃지</span><div class="wk-badges">${others.map(b=>`<div class="wk-badge wk-${esc(b.kind)}" title="${esc(NAME[b.kind]||'')}">${flag(b.country)}<b>${esc(cname(b.country))}</b><small>${esc(NAME[b.kind]||'')}</small><small>${esc(wk(b.week))} 주</small></div>`).join('')}</div>`:''}
      ${cards.length?`<span class="plabel">랜드마크 엽서 ${cards.length}장</span><div class="wk-cards">${cards.map(p=>`<div class="wk-card">${flag(p.country)}<b>${esc(p.name)}</b><small>${esc(cname(p.country))} · ${esc(wk(p.week))} 주</small></div>`).join('')}</div>`:''}`;
  }
  const RULES=`<ul class="wk-rules">
    <li>매주 월요일 0시(한국 시간)에 새로 시작해요. 다음 주 목적지는 후보 3개국 중 투표로 정해요.</li>
    <li>타이머로 잰 공부 시간으로만 겨뤄요. 직접 입력한 기록은 빠지고, 투어디 플러스(마일리지 1.5배)와도 상관없어요.</li>
    <li>참가한 뒤의 공부만, 하루 최대 8시간(주 최대 56시간)까지 반영돼요. 끝난 공부는 24시간 안에 인터넷이 연결돼야 올라가요.</li>
    <li>등급(${TIERS.join('·')})이 같은 사람끼리 30명씩 리그로 묶여요. 리그가 5명 이상일 때 승급·강등이 있어요.</li>
    <li>승급(위로 갈수록 어려워요): ${TIERS.slice(0,4).map((t,i)=>`${t} 상위 ${PROMO_PCT[i]}%·${PROMO_H[i]}시간`).join(' · ')}</li>
    <li>강등: 하위 20%이면서 ${TIERS.slice(1).map((t,i)=>`${t} ${KEEP_H[i+1]}시간`).join(' · ')} 미만 (브론즈는 강등 없음)</li>
    <li>보상: 공부 ${LANDMARK_H.join('·')}시간마다 랜드마크 엽서 · 10시간 완주 스탬프(+${REWARD.stamp})와 그 나라 무료 항공권 · 리그 상위 10% 금 뱃지(+${REWARD.gold}) · 리그 1등 특별 여권(+${REWARD.passport}) · 협동 목표 달성 스탬프(+${REWARD.coop}, 2시간 이상 참여)</li></ul>`;
  function voteBox(){
    const v=board.vote;if(!v||!Array.isArray(v.candidates))return '';
    const total=v.candidates.reduce((a,c)=>a+(c.votes||0),0);
    return `<div class="wk-vote"><span class="plabel">다음 주 목적지 투표 · ${esc(wk(v.week))} 주</span>
      <div class="wk-vopts">${v.candidates.map(c=>{const pct=total?Math.round(c.votes/total*100):0;return `<button class="wk-vopt" data-vote="${esc(c.country)}" aria-pressed="${v.mine===c.country}" ${voting?'disabled':''}>${flag(c.country)}<b>${esc(cname(c.country))}</b><small>${c.votes}표${total?` · ${pct}%`:''}</small><i style="width:${pct}%"></i></button>`}).join('')}</div>
      <small class="note">${v.mine?`${esc(cname(v.mine))}에 투표했어요. 일요일 자정까지 바꿀 수 있어요.`:'가장 많은 표를 받은 나라가 다음 주 목적지가 돼요.'}</small></div>`;
  }
  function render(){
    const box=$('tvWeek');if(!box)return;
    const html=view();
    if(html===lastHtml&&box.firstChild)return;
    lastHtml=html;box.innerHTML=html;
    const nick=$('wkNick');if(nick)nick.value=nickDraft;
  }
  function view(){
    if(!me()){
      return `<div class="panel-head"><h2>주간 챌린지</h2></div><p class="note">매주 한 나라를 정해 일주일 동안 누가 더 오래 공부하는지 겨뤄요. 참가하려면 로그인이 필요해요.</p>${RULES}
        <button class="primary" id="wkLogin">로그인하러 가기</button><h3 class="wk-h">내 챌린지 보상</h3>${collection()}`;
    }
    if(!board){if(!err)setTimeout(load,0);return `<div class="panel-head"><h2>주간 챌린지</h2></div><p class="note" role="status">${err?esc(err):'불러오는 중…'}</p>`}
    const c=board.country,land=(C[c]||['',[]])[1],mine=board.my_minutes||0,coop=board.coop||{minutes:0,goal:1,participants:0};
    const head=`<div class="wk-head">${flag(c)}<div><small>이번 주 목적지 · ${esc(left(board.ends_at))}</small><b>${esc(cname(c))}</b><span class="wk-going">${coop.participants}명이 함께 ${esc(ro(cname(c)))} 떠났어요</span></div><span class="wk-tier wk-t${board.tier|0}">${esc(tname(board.tier))}</span></div>`;
    const coopPct=Math.min(100,Math.round(coop.minutes/Math.max(1,coop.goal)*100));
    const coopBox=`<div class="wk-coop"><span class="plabel">모두 함께 · 협동 목표</span><div class="wk-bar"><i style="width:${coopPct}%"></i></div>
      <small>${hm(coop.minutes)} / ${hm(coop.goal)} (${coopPct}%) · 달성하면 이번 주 ${hm(COOP_MIN)} 이상 공부한 모두에게 스탬프</small></div>`;
    if(!board.joined){
      return `<div class="panel-head"><h2>주간 챌린지</h2></div>${head}
        <p class="note">이번 주 내 등급은 <b>${esc(ieyo(tname(board.tier)))}</b>. 참가하면 같은 등급의 최대 30명과 한 리그가 돼요.</p>
        <div class="wk-join"><input class="field" id="wkNick" maxlength="12" placeholder="리그에서 쓸 닉네임 (비우면 자동)" aria-label="닉네임"><button class="primary" id="wkJoin" ${joining?'disabled':''}>이번 주 참가하기</button></div>
        ${coopBox}${voteBox()}<details class="wk-more" id="wkRules"${rulesOpen?' open':''}><summary>규칙 보기</summary>${RULES}</details>
        ${err?`<p class="err" role="alert">${esc(err)}</p>`:''}<h3 class="wk-h">내 챌린지 보상</h3>${collection()}`;
    }
    const lands=land.map((n,i)=>{const on=mine>=LANDMARK_H[i]*60;return `<li class="${on?'on':''}"><b>${on?'✓':'🔒'}</b><span>${esc(n)}</span><small>${LANDMARK_H[i]}시간</small></li>`}).join('');
    const rows=board.members||[],myRank=rows.findIndex(r=>r.me)+1,top=Math.max(1,Math.ceil(rows.length*0.1));
    const pz=board.promo_zone|0,dz=board.demote_zone|0,t=board.tier|0;
    const table=rows.map((r,i)=>{const z=pz&&i<pz?' up':dz&&i>=rows.length-dz?' down':'';
      return `<li class="${r.me?'me':''}${i<top&&rows.length>=RANK_MIN_SIZE?' top':''}${z}"><span class="wk-rk">${i+1}</span><span class="wk-nk">${esc(r.nick)}${r.me?' (나)':''}</span><span class="wk-mn">${hm(r.minutes)}</span>${z===' up'?'<em aria-label="승급권">▲</em>':z===' down'?'<em aria-label="강등권">▼</em>':''}</li>`}).join('');
    const zoneNote=rows.length<RANK_MIN_SIZE?`<p class="note">리그 인원이 ${RANK_MIN_SIZE}명 이상일 때 승급·강등과 순위 보상이 있어요.</p>`
      :`<p class="note">${pz?`▲ 상위 ${pz}명 중 ${hm(board.promo_min)} 이상 공부하면 다음 주 ${esc(ro(tname(t+1)))} 승급`:'다이아는 최고 등급이에요'}${dz?` · ▼ 하위 ${dz}명 중 ${hm(board.keep_min)}을 못 채우면 ${esc(ro(tname(t-1)))} 강등`:''}</p>`;
    return `<div class="panel-head"><h2>주간 챌린지</h2><button class="textbtn" id="wkRefresh">새로고침</button></div>${head}
      <div class="wk-me"><span class="plabel">이번 주 내 공부</span><b>${hm(mine)}</b><small>${esc(tname(board.tier))} 리그 ${myRank}위 / ${rows.length}명${mine<FINISH?` · 완주까지 ${hm(FINISH-mine)}`:' · 완주!'}</small><div class="wk-bar"><i style="width:${Math.min(100,Math.round(mine/FINISH*100))}%"></i></div></div>
      <span class="plabel">${esc(cname(c))} 랜드마크 · 열릴 때마다 엽서</span><ul class="wk-lands">${lands}</ul>
      ${coopBox}
      <span class="plabel">${esc(tname(board.tier))} 리그 순위</span><ol class="wk-board">${table}</ol>${zoneNote}
      ${voteBox()}
      <details class="wk-more" id="wkRules"${rulesOpen?' open':''}><summary>규칙 보기</summary>${RULES}</details>
      ${err?`<p class="err" role="alert">${esc(err)}</p>`:''}<h3 class="wk-h">내 챌린지 보상</h3>${collection()}`;
  }
  // 업적 탭: 받은 특별 여권 진열
  function renderAch(){
    const box=$('achWeekly');if(!box)return;
    const pass=(S.badges||[]).filter(b=>b.kind==='passport').sort((a,b)=>String(b.week).localeCompare(String(a.week)));
    box.hidden=!pass.length;if(!pass.length)return;
    box.innerHTML=`<div class="panel-head"><h2>챌린지 특별 여권</h2><span class="note">주간 챌린지 리그 1등 ${pass.length}회</span></div><div class="wk-passes">${pass.map(passportCover).join('')}</div>`;
  }

  /* --- 처음 들어왔을 때 보여 주는 안내 카드 (설정 → 기타 → 주간 챌린지에서 다시 보기) --- */
  if(typeof TOUR_ART==='object'){
    TOUR_ART.wkGlobe='<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="54" cy="64" r="34"/><path d="M20 64h68M54 30c12 10 12 58 0 68M54 30c-12 10-12 58 0 68"/><path d="M84 18l18 6-14 12" stroke-width="2.6"/><path d="M88 22c4 8 4 16 0 22" stroke-dasharray="3 6"/></svg>';
    TOUR_ART.wkLeague='<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M42 24h36v18a18 18 0 0 1-36 0z"/><path d="M42 30H28c0 12 6 18 16 18M78 30h14c0 12-6 18-16 18M60 60v14M46 90h28M50 74h20v16H50z"/><path d="m18 96 8-8 8 8M86 88l8 8 8-8" stroke-width="2.6"/></svg>';
    TOUR_ART.wkPost='<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="30" width="92" height="62" rx="6"/><path d="M62 38v46M70 50h26M70 60h26M70 70h18"/><rect x="80" y="36" width="18" height="10" rx="2" stroke-width="2.4"/><path d="M22 80l12-16 8 10 8-6 6 12z"/><circle cx="34" cy="48" r="5"/></svg>';
    TOUR_ART.wkTeam='<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="42" r="10"/><circle cx="80" cy="42" r="10"/><circle cx="60" cy="34" r="10"/><path d="M22 76c2-12 10-18 18-18M98 76c-2-12-10-18-18-18M40 80c2-14 10-22 20-22s18 8 20 22"/><path d="M20 96h80" stroke-dasharray="6 6"/></svg>';
    TOUR_ART.wkGift='<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="20" width="52" height="72" rx="6"/><circle cx="52" cy="48" r="12"/><path d="M40 72h24M44 80h16"/><circle cx="86" cy="80" r="18"/><path d="m80 80 5 5 9-10"/></svg>';
  }
  const WK_TOUR=[
    {k:'주간 챌린지',art:'wkGlobe',h:'매주 한 나라로 다 같이 떠나요',
     p:'일주일 동안 투어디 사용자 모두가 같은 나라를 목적지로 공부해요. 매주 월요일 0시(한국 시간)에 새로 시작해요.',
     list:['<b>타이머로 잰 공부 시간</b>으로만 겨뤄요','직접 입력한 기록은 빠지고, 플러스 구독과도 상관없이 공평해요','하루 최대 8시간까지 반영돼요','참가하려면 <b>로그인</b>이 필요해요']},
    {k:'리그',art:'wkLeague',h:'같은 등급끼리 30명 리그',
     p:'브론즈부터 다이아까지 다섯 등급이 있어요. 같은 등급인 사람끼리 최대 30명씩 한 리그가 돼요.',
     list:['<b>▲ 승급</b> · 순위가 높고 정해진 시간 이상 공부하면 다음 주 한 등급 위로','<b>▼ 강등</b> · 순위가 낮고 유지 기준 시간을 못 채우면 한 등급 아래로','리그가 5명 이상일 때만 승급·강등이 있어요']},
    {k:'랜드마크',art:'wkPost',h:'공부할수록 랜드마크가 열려요',
     p:'그 나라의 랜드마크 다섯 곳이 이번 주 공부 시간에 따라 하나씩 열리고, 열릴 때마다 엽서가 와요.',
     list:[`<b>${LANDMARK_H.join('·')}시간</b>에 하나씩 열려요`,`<b>10시간</b>이면 완주 · 완주 스탬프(+${REWARD.stamp})와 그 나라 <b>무료 항공권</b>`]},
    {k:'협동과 투표',art:'wkTeam',h:'모두의 공부 시간을 합쳐요',
     p:'참가한 모든 사람의 공부 시간을 합쳐서 협동 목표를 채워요. 다음 주 목적지도 함께 정해요.',
     list:[`협동 목표를 달성하면 ${hm(COOP_MIN)} 이상 공부한 모두에게 스탬프(+${REWARD.coop})`,'후보 3개국 중 <b>투표</b>로 다음 주 나라를 골라요 (일요일 자정까지 바꿀 수 있어요)']},
    {k:'결과와 보상',art:'wkGift',h:'월요일에 결과 카드가 도착해요',
     p:'한 주가 끝나면 다음 월요일에 순위와 등급 변화를 보여 주고 보상을 넣어 드려요.',
     list:[`완주하고 리그 상위 10% · <b>금 뱃지</b>(+${REWARD.gold})`,`완주하고 리그 1등 · <b>특별 여권</b>(+${REWARD.passport})`,'받은 마일리지는 바로 여행에 쓸 수 있어요'],
     note:'다시 보고 싶으면 <b>설정 → 기타 → 주간 챌린지</b>에서 볼 수 있어요.'}
  ];
  function tutorial(){
    if(typeof openTour!=='function')return;
    const d=$('tourDialog');if(d&&d.open)return;
    openTour(WK_TOUR,{last:me()?'챌린지 보러 가기':'확인',close(){if(!S.wkTour){S.wkTour=1;save()}},
      finish(){if(typeof setTab==='function'&&tr().on&&!$('tabTravel').hidden){const T=tr();T.world='week';save();setTab('travel')}}});
  }
  // 주간 탭을 처음 열면 한 번만 (첫 실행 튜토리얼·다른 창이 떠 있으면 다음에)
  function maybeTutorial(){
    if(S.wkTour||!visible()||document.querySelector('dialog[open]')||document.body.classList.contains('tour-active'))return;
    setTimeout(()=>{if(!S.wkTour&&visible()&&!document.querySelector('dialog[open]'))tutorial()},250);
  }
  document.addEventListener('click',e=>{
    const v=e.target.closest('[data-vote]');if(v){vote(v.dataset.vote);return}
    if(e.target.closest('#wkJoin'))join();
    else if(e.target.closest('#wkRefresh')){report();loadedAt=0;load()}
    else if(e.target.closest('#wkLogin')){setTab('set');openSet('account')}
    else if(e.target.closest('#wkTourReplay'))tutorial();
    else if(e.target.closest('#wkGo')){if(!tr().on||$('tabTravel').hidden){toast('설정 → 여행에서 여행 탭을 켜면 주간 챌린지를 쓸 수 있어요');return}tr().world='week';save();setTab('travel');window.scrollTo({top:0})}
  });
  document.addEventListener('toggle',e=>{if(e.target&&e.target.id==='wkRules')rulesOpen=e.target.open},true);
  document.addEventListener('input',e=>{if(e.target&&e.target.id==='wkNick')nickDraft=e.target.value});
  const sync=()=>{report();claim().catch(()=>{});if(visible()||Date.now()-loadedAt>10*6e4)load()};
  document.addEventListener('tourdy:signed-in',sync);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
  {const base=save;save=function(){const r=base.apply(this,arguments);if(me())scheduleReport();return r}}
  window.TourdyChallenge={render:()=>{render();maybeTutorial();if(me()&&Date.now()-loadedAt>60e3)load()},renderAch,tutorial,_rewardsFor:rewardsFor};
})();
