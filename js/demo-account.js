/* ---------- 아티팩트 테스트용 가짜 계정 ----------
   아티팩트(iframe 안) + 테스트 모드(TRAVEL_TEST)에서 로그인하지 않았을 때만 켜진다.
   소셜 로그인은 아티팩트 안에서 열 수 없으므로, 로그인이 필요한 기능(주간 챌린지·친구 초대)을
   서버 대신 이 기기 안의 가짜 서버로 체험하게 한다. 실제 로그인하면 바로 꺼진다.
   가짜 서버 기록은 localStorage 'tourdy.demo.v1'에만 남고, 받은 보상(마일리지·뱃지)은 테스트 기록(S)에 들어간다. */
(function(){
  const inFrame=(()=>{try{return window.self!==window.top}catch(e){return true}})();
  const test=(()=>{try{return TRAVEL_TEST===true}catch(e){return false}})();
  const A=window.TourdyAccount;
  if(!inFrame||!test||!A)return;
  const realUid=A.userId,realClient=A.client,realLabel=A.label;
  const on=()=>!realUid();
  const KEY='tourdy.demo.v1';
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}};
  const store=d=>{try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}};
  const COUNTRIES=['JP','US','GB','FR','DE','IT','CA','AU','CH','ES'];
  const NICKS=['새벽공부','합격가즈아','열공중','도서관지박령','커피한잔','오늘도출석','수학은사랑','영단어마스터','꾸준히','작심삼일탈출','한걸음씩','집중모드','공부하는곰','시험끝나면여행','올빼미','아침형인간','스터디카페','필기왕','복습러','목표달성','하루8시간','차근차근','노력파','기출반복','마지막스퍼트','플래너덕후','타이머켜자','공부요정','독서실'];
  const PROMO_PCT=[30,20,15,10],PROMO_H=[10,15,25,35],KEEP_H=[0,3,5,10,15];
  const pad=n=>String(n).padStart(2,'0'),ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const monday=(d=new Date())=>{const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x};
  const hash=s=>{let h=0;for(const c of String(s))h=(Math.imul(h,31)+c.charCodeAt(0))|0;return Math.abs(h)};
  function week(){
    const d=load(),w=ymd(monday());
    if(d.week!==w){d.week=w;d.joined=false;d.nick='';d.joinedAt=0;d.tier=d.nextTier||d.tier||0;d.nextTier=null}
    d.results=d.results||[];d.invite=d.invite||[];store(d);return d;
  }
  // 이번 주 내 공부(하루 8시간까지). 실제 서버는 참가한 뒤의 공부만 세지만, 테스트에서는 바로 확인할 수 있게 이번 주 전체를 센다
  function myMinutes(d){
    const start=monday().getTime(),per={};
    for(const s of (S.sessions||[]))if(s.kind==='study'&&!s.ex&&!s.noMile&&s.end>start){const k=ymd(new Date(s.start));per[k]=(per[k]||0)+(s.end-Math.max(s.start,start))/6e4}
    return Math.round(Object.values(per).reduce((a,m)=>a+Math.min(m,480),0));
  }
  function board(){
    const d=week(),w=d.week,country=COUNTRIES[hash(w)%COUNTRIES.length],tier=d.tier|0;
    const passed=Math.min(1,(Date.now()-monday().getTime())/(7*864e5));
    const bots=NICKS.map((n,i)=>{const r=(hash(w+n)%1000)/1000,full=i<4?900+r*1500:r<.35?0:r*1100;return {nick:n,minutes:Math.round(full*passed)}});
    const me={nick:d.nick||'나',minutes:myMinutes(d),me:true};
    const members=(d.joined?[...bots,me]:bots).sort((a,b)=>b.minutes-a.minutes);
    const size=members.length,sum=members.reduce((a,m)=>a+m.minutes,0);
    const ends=new Date(monday().getTime()+7*864e5);
    return {week:w,country,tier,joined:!!d.joined,my_minutes:d.joined?me.minutes:0,members:d.joined?members:[],
      coop:{minutes:sum,goal:size*480,participants:size},ends_at:ends.toISOString(),
      promo_zone:tier<4&&size>=5?Math.ceil(size*PROMO_PCT[tier]/100):0,promo_min:(PROMO_H[tier]||0)*60,
      demote_zone:tier>0&&size>=5?Math.ceil(size*.2):0,keep_min:(KEEP_H[tier]||0)*60,vote:null};
  }
  const ok=data=>Promise.resolve({data,error:null});
  const rpc={
    challenge_board:()=>ok(board()),
    challenge_join:({p_nick})=>{const d=week();d.joined=true;d.nick=String(p_nick||'').trim().slice(0,12)||'공부러 '+(1000+hash(Date.now())%9000);d.joinedAt=Date.now();store(d);return ok(board())},
    challenge_log:()=>ok(1),
    challenge_vote:()=>ok(board()),
    challenge_results:()=>ok(week().results.slice().sort((a,b)=>b.week.localeCompare(a.week))),
    my_invite_code:()=>ok('TEST01'),
    my_invite_rewards:()=>ok(week().invite),
    redeem_invite:({p_code})=>{const d=week();
      if(p_code==='TEST01')return ok([{ok:false,reason:'self'}]);
      if(d.invite.some(r=>r.kind==='joined'))return ok([{ok:false,reason:'already'}]);
      d.invite.push({id:'demo-joined-'+Date.now(),kind:'joined'});store(d);return ok([{ok:true}])},
  };
  const client={rpc:(name,args)=>rpc[name]?rpc[name](args||{}):Promise.resolve({data:null,error:{message:'테스트 서버에 없는 기능: '+name}})};
  A.userId=()=>realUid()||(on()?'demo-user':null);
  A.client=()=>realUid()?realClient():client;
  A.label=()=>on()?'테스트 계정':realLabel();
  // 테스트 도구: 지난주 결과 받기 / 친구가 내 코드를 입력한 것처럼
  window.TourdyDemo={
    on,
    lastWeekResult(kind){const d=week(),b=board(),prev=ymd(new Date(monday().getTime()-7*864e5));
      const rank=kind==='first'?1:kind==='top'?3:12,minutes=kind==='miss'?420:720;
      d.results=d.results.filter(r=>r.week!==prev);
      d.results.push({week:prev,country:b.country,minutes,rank,size:30,tier:d.tier|0,next_tier:Math.min(4,(d.tier|0)+(rank<=3?1:0)),coop_done:true});
      d.nextTier=null;store(d);
      try{localStorage.removeItem('tourdy.challenge.seen.v1')}catch(e){}
    },
    friendJoined(){const d=week();d.invite.push({id:'demo-invited-'+Date.now(),kind:'invited'});store(d)},
    reset(){try{localStorage.removeItem(KEY);localStorage.removeItem('tourdy.challenge.seen.v1');localStorage.removeItem('tourdy.challenge.sent.v2')}catch(e){}}
  };
  {const base=A.render;A.render=function(){const r=base.apply(this,arguments);
    if(on()){const b=$('accountBody');if(b&&!b.querySelector('.demo-note'))b.insertAdjacentHTML('afterbegin','<p class="note demo-note">아티팩트에서는 소셜 로그인 창을 열 수 없어서 <b>테스트 계정</b>으로 주간 챌린지·친구 초대를 써 볼 수 있어요. 서버 대신 이 브라우저에만 저장돼요.</p>')}
    return r}}
  // 로그인한 것처럼 각 기능에 알린다
  setTimeout(()=>{if(on())try{document.dispatchEvent(new Event('tourdy:signed-in'))}catch(e){}},0);
})();
