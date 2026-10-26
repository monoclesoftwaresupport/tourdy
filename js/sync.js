/* ---------- 계정 · 기기 간 동기화 (Supabase) ----------
   - 로그인: Google · GitHub · 카카오. 아이폰 앱은 Apple 기본 로그인 창, 웹은 페이지 이동 방식.
   - 동기화: 기록 전체를 한 벌로 올리고 내려받는다. 서버의 번호(rev)로 다른 기기와의 충돌을 감지하고,
     양쪽이 모두 바뀌었으면 마지막으로 맞춘 기록(base)을 기준으로 자동으로 합친다(js/sync-merge.js).
     같은 항목을 양쪽에서 서로 다르게 바꿨으면 더 최근에 저장한 기기의 값을 쓴다. 로그인하지 않으면 기기에만 저장. */
(function(){
  const CFG=window.TOURDY_CONFIG||{};
  const configured=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase&&window.supabase.createClient);
  const native=!!window.TourdyNative;
  const DEVICE=native?'iOS 앱':/android/i.test(navigator.userAgent)?'안드로이드':/iphone|ipad/i.test(navigator.userAgent)?'iOS 웹':'웹';
  const META='tourdy.sync.v1',BASE='tourdy.sync.base.v1',EDIT='tourdy.sync.edit.v1';
  const PROVIDERS=[['kakao','카카오'],['google','Google'],['github','GitHub']];
  let authBusy=false;
  let sb=null,session=null,busy=false,pushTimer=null,applying=false,conflictRow=null,lastError='',armDelete=false;
  let live=null,retryTimer=null,retryDelay=0;

  const getMeta=()=>{try{return JSON.parse(localStorage.getItem(META)||'{}')}catch(e){return {}}};
  const setMeta=m=>{try{localStorage.setItem(META,JSON.stringify(m))}catch(e){}};
  // 마지막으로 서버와 맞췄던 기록. 자동 합치기의 기준점이 된다. 저장 공간이 모자라 못 남기면 기준 없이 합친다
  const getBase=()=>{try{const b=JSON.parse(localStorage.getItem(BASE)||'null');return b&&b.uid===uid()?b.state:null}catch(e){return null}};
  // 이 기기에서 마지막으로 기록을 바꾼 시각 (자동 합치기에서 어느 쪽 값이 더 최근인지 판단)
  const lastEdit=()=>{try{return +localStorage.getItem(EDIT)||0}catch(e){return 0}};
  const markEdit=()=>{try{localStorage.setItem(EDIT,String(Date.now()))}catch(e){}};
  const setBase=st=>{try{localStorage.setItem(BASE,JSON.stringify({uid:uid(),state:st}))}catch(e){try{localStorage.removeItem(BASE)}catch(_){}}};
  const hash=str=>{let h=5381;for(let i=0;i<str.length;i++)h=((h*33)^str.charCodeAt(i))>>>0;return h.toString(36)+':'+str.length};
  const localHash=()=>hash(JSON.stringify(S));
  const uid=()=>session&&session.user&&session.user.id;
  const isEmpty=st=>!(st.subjects||[]).some(x=>!x.deleted)&&!(st.sessions||[]).some(x=>!x.ex);
  const when=t=>{if(!t)return '없음';const d=new Date(t);return `${d.getMonth()+1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`};
  const summary=st=>{const ss=(st.sessions||[]).filter(x=>x.kind==='study'&&!x.ex);const ms=ss.reduce((a,x)=>a+(x.end-x.start),0);
    const T=st.travel||{},K=T.kr||{},subs=(st.subjects||[]).filter(x=>!x.deleted).map(x=>x.name);
    return `공부 ${ss.length}회 · ${fmtH(ms)} · 도장 ${((K.done||[]).length)+((T.stamps||[]).length)}개\n과목 ${subs.length}개: ${subs.slice(0,6).join(', ')}${subs.length>6?' 외':''}`};
  const userName=u=>{const m=(u&&u.user_metadata)||{};return m.full_name||m.name||m.nickname||m.user_name||m.preferred_username||(u&&u.email)||'투어디 사용자'};
  const providerName=u=>{const p=u&&u.app_metadata&&u.app_metadata.provider;return (PROVIDERS.find(x=>x[0]===p)||[0,p||''])[1]};
  const setStatus=t=>{lastError=t||'';renderAccountIfOpen()};

  /* ---------- 로그인 ---------- */
  async function signIn(provider){
    if(!sb||authBusy||!PROVIDERS.some(([id])=>id===provider))return;
    authBusy=true;lastError='';renderAccountIfOpen();
    try{
      if(native){
        if(provider==='google'||provider==='kakao'){
          if(!window.TourdyNative.socialSignIn)throw Error('앱을 최신 버전으로 업데이트해 주세요.');
          const identity=await window.TourdyNative.socialSignIn(provider);
          if(identity.provider!==provider||!identity.idToken||!identity.nonce)throw Error('인증 결과를 확인하지 못했어요.');
          const {error}=await sb.auth.signInWithIdToken({provider,token:identity.idToken,access_token:identity.accessToken,nonce:identity.nonce});
          if(error)throw error;
          return;
        }
        const {data,error}=await sb.auth.signInWithOAuth({provider,options:{redirectTo:CFG.nativeScheme+'://auth-callback',skipBrowserRedirect:true}});
        if(error)throw error;
        const back=await window.TourdyNative.authenticate(data.url,CFG.nativeScheme);
        const u=new URL(back);
        if(u.protocol!==CFG.nativeScheme+':'||u.hostname!=='auth-callback')throw Error('로그인 반환 주소가 올바르지 않아요.');
        const q=new URLSearchParams(u.search);
        new URLSearchParams(u.hash.replace(/^#/,'')).forEach((value,key)=>{if(!q.has(key))q.set(key,value)});
        if(q.get('error'))throw Error(q.get('error_description')||q.get('error'));
        const code=q.get('code');if(!code)throw Error('로그인 결과를 받지 못했어요.');
        const r=await sb.auth.exchangeCodeForSession(code);if(r.error)throw r.error;
      }else{
        const {error}=await sb.auth.signInWithOAuth({provider,options:{redirectTo:location.origin+location.pathname}});
        if(error)throw error;
      }
    }catch(e){if(e&&e.code==='CANCELED')return;setStatus('로그인하지 못했어요. '+(e&&e.message?e.message:''))}
    finally{authBusy=false;renderAccountIfOpen();}
  }
  async function signOut(){
    if(!sb)return;clearTimeout(pushTimer);
    await pushNow().catch(()=>{});
    await sb.auth.signOut().catch(()=>{});
    setMeta({});session=null;toast('로그아웃했어요. 기록은 이 기기에 그대로 남아 있어요.');renderAccountIfOpen();
  }
  async function deleteAccount(){
    if(!armDelete){armDelete=true;renderAccountIfOpen();setTimeout(()=>{armDelete=false;renderAccountIfOpen()},4000);return}
    armDelete=false;
    const {error}=await sb.rpc('delete_account');
    if(error)return setStatus('계정을 삭제하지 못했어요. '+error.message);
    await sb.auth.signOut().catch(()=>{});setMeta({});session=null;
    toast('계정과 서버의 기록을 삭제했어요. 이 기기의 기록은 남아 있어요.');renderAccountIfOpen();
  }

  /* ---------- 동기화 ---------- */
  async function fetchRow(){
    const {data,error}=await sb.from('user_state').select('state,rev,updated_at,device').maybeSingle();
    if(error)throw error;return data;
  }
  // 기록을 이 기기에 적용 (기존 기록은 저장소의 직전본으로 한 벌 남는다)
  async function applyLocal(d){
    TourdyStorage.validate(d);d=norm(d);TourdyRewards.initialize(d);
    applying=true;
    try{
      const ok=await writeCandidate(d,{replace:true});
      if(!ok)throw Error('이 기기에 저장하지 못했어요.');
      const oldAccent=(S.theme||{}).accent;
      S=d;renderAll();renderExtras();
      // 다른 기기에서 포인트 색을 바꿨으면 이 기기의 앱 아이콘도 같이 바꾼다
      const accent=(d.theme||{}).accent;
      if(accent&&accent!==oldAccent&&window.TourdyNative&&window.TourdyNative.setAppIcon)Promise.resolve(window.TourdyNative.setAppIcon(accent)).catch(()=>{});if(typeof syncTravelTab==='function')syncTravelTab();renderFirstTripNotice();
    }finally{applying=false}
  }
  // 서버 기록을 그대로 받아온다
  async function adopt(row){
    await applyLocal(JSON.parse(JSON.stringify(row.state)));
    setMeta({uid:uid(),rev:row.rev,hash:localHash(),at:Date.now()});setBase(row.state);
  }
  // 양쪽 다 바뀌었을 때: 자동으로 합쳐서 이 기기에 적용하고 서버에도 올린다
  async function mergeOrAsk(row,depth=0){
    const M=window.TourdyMerge;
    const prefer=lastEdit()>(Date.parse(row.updated_at)||0)?'local':'cloud';
    const r=M?M.mergeStates(getBase(),JSON.parse(JSON.stringify(S)),row.state,prefer):null;
    if(!r||!r.ok)return resolve(row);
    try{await applyLocal(r.state)}catch(e){return resolve(row)}
    setBase(row.state);setMeta({uid:uid(),rev:row.rev,hash:'merged',at:Date.now()}); // 합친 기록은 아직 서버에 없음
    const p=await push(row.rev);
    if(p===true){toast('다른 기기의 기록과 합쳤어요.');return}
    if(p.conflict&&depth<2)return mergeOrAsk(p.conflict,depth+1);   // 그 사이 또 바뀌었으면 한 번 더 합침
    resolve(p.conflict);
  }
  // 이 기기 기록을 서버에 저장. force=true면 서버 번호를 기준으로 덮어씀(사용자가 '이 기기 기록'을 고른 경우)
  async function push(baseRev){
    const body=JSON.parse(JSON.stringify(S));TourdyStorage.validate(body);
    const h=localHash();
    const {data,error}=await sb.rpc('push_state',{p_state:body,p_base_rev:baseRev,p_device:DEVICE});
    if(error)throw error;
    const r=Array.isArray(data)?data[0]:data;
    if(r&&r.ok){setMeta({uid:uid(),rev:r.rev,hash:h,at:Date.now()});setBase(body);return true}
    return {conflict:{state:r.state,rev:r.rev,updated_at:r.updated_at,device:r.device}};
  }
  async function pushNow(){
    clearTimeout(pushTimer);pushTimer=null;
    if(!sb||!uid()||busy||applying||conflictRow)return;
    const m=getMeta();if(m.uid===uid()&&m.hash===localHash())return; // 바뀐 게 없음
    busy=true;
    try{const r=await push(m.uid===uid()?(m.rev||0):0);if(r!==true&&r.conflict)await mergeOrAsk(r.conflict);setStatus('');retryDone()}
    catch(e){setStatus('동기화하지 못했어요. 인터넷 연결을 확인해 주세요.');retryLater()}
    finally{busy=false;renderAccountIfOpen()}
  }
  // 앱을 열 때·다시 볼 때: 서버와 비교해서 필요한 쪽으로 맞춘다
  async function pull(){
    if(!sb||!uid()||busy||applying)return;
    busy=true;let needPush=false;
    try{
      const row=await fetchRow(),m=getMeta(),mine=m.uid===uid(),lh=localHash();
      if(!row)needPush=true;                                                  // 서버에 아직 없음 → 올림
      else if(mine&&m.rev===row.rev)needPush=lh!==m.hash;                     // 서버 그대로 → 내 변경만 올림
      else if(mine&&lh===m.hash)await adopt(row);                             // 다른 기기만 바뀜 → 받아옴
      else if(isEmpty(S))await adopt(row);                                    // 이 기기가 비어 있음 → 받아옴
      else if(hash(JSON.stringify(row.state))===lh)setMeta({uid:uid(),rev:row.rev,hash:lh,at:Date.now()});
      else await mergeOrAsk(row);                                             // 양쪽 다 바뀜 → 자동 합치기(안 되면 물어봄)
      setStatus('');retryDone();
    }catch(e){setStatus('동기화하지 못했어요. 인터넷 연결을 확인해 주세요.');retryLater()}
    finally{busy=false;renderAccountIfOpen()}
    if(needPush)await pushNow();
  }
  function resolve(row){
    conflictRow=row;
    $('syncLocal').textContent=summary(S);
    $('syncCloud').textContent=summary(row.state);
    $('syncCloudMeta').textContent=`${row.device||'다른 기기'} · ${when(row.updated_at)} 저장`;
    const d=$('syncDialog');if(!d.open)d.showModal();
  }
  async function choose(which){
    const row=conflictRow;if(!row)return;
    $('syncDialog').close();conflictRow=null;busy=true;
    try{
      if(which==='cloud'){await adopt(row);toast('다른 기기의 기록을 가져왔어요.')}
      else if(which==='local'){const r=await push(row.rev);if(r===true)toast('이 기기의 기록으로 맞췄어요.');else if(r.conflict){busy=false;return resolve(r.conflict)}}
    }catch(e){setStatus('동기화하지 못했어요. '+(e.message||''))}
    finally{busy=false;renderAccountIfOpen()}
  }
  function schedule(){if(!uid()||applying)return;clearTimeout(pushTimer);pushTimer=setTimeout(pushNow,4000)}

  /* ---------- 실시간 반영 · 오프라인 복구 ---------- */
  // 실패하면 5초 → 10초 → 20초 → 40초 → 60초 간격으로 다시 시도하고, 성공하면 멈춘다.
  // 인터넷이 다시 연결되는 순간(online)에는 기다리지 않고 바로 맞춘다.
  function retryLater(){
    if(!uid()||retryTimer)return;
    retryDelay=Math.min(retryDelay?retryDelay*2:5000,60000);
    retryTimer=setTimeout(()=>{retryTimer=null;if(!document.hidden)pull()},retryDelay);
  }
  function retryDone(){clearTimeout(retryTimer);retryTimer=null;retryDelay=0}
  // 다른 기기가 저장하면 서버가 바로 알려 준다 → 받아온다. (본인 기록만 오도록 서버 보안 규칙이 그대로 적용)
  function listen(){
    const me=uid();
    if(!sb||typeof sb.channel!=='function'||!me||(live&&live.uid===me))return;
    unlisten();
    const ch=sb.channel('user_state:'+me)
      .on('postgres_changes',{event:'*',schema:'public',table:'user_state',filter:'user_id=eq.'+me},p=>{
        const r=p&&p.new,m=getMeta();
        if(r&&r.rev!=null&&m.uid===me&&m.rev===r.rev)return; // 이 기기가 방금 올린 것
        if(!document.hidden)pull();
      })
      .subscribe(status=>{
        if(status!=='SUBSCRIBED'||!live||live.ch!==ch)return;
        if(live.ready)pull();else live.ready=true;           // 끊겼다 다시 연결되면 놓친 변경을 받아온다
      });
    live={uid:me,ch,ready:false};
  }
  function unlisten(){if(live&&sb&&typeof sb.removeChannel==='function')sb.removeChannel(live.ch);live=null}

  /* ---------- 화면 ---------- */
  function renderAccount(){
    const box=$('accountBody');if(!box)return;
    if(!uid()){
      box.innerHTML=`<p class="note">로그인하면 아이폰·아이패드·안드로이드·웹에서 같은 기록을 이어서 쓸 수 있어요. 로그인하지 않아도 지금처럼 이 기기에서 쓸 수 있어요.</p>
        ${!configured?'<p class="note" role="status">계정 서버 연결 전이에요. 현재는 기기에 저장되며, 로그인은 서버 연결 후 사용할 수 있어요.</p>':''}
        <div class="login-list">${PROVIDERS.map(([id,nm])=>`<button class="login-btn login-${id}" data-login="${id}" ${!configured||authBusy?'disabled':''}>${LOGIN_ICON[id]}<span>${nm}로 계속하기</span></button>`).join('')}</div>
        ${authBusy?'<p class="note" role="status">로그인 창에서 인증을 완료해 주세요.</p>':''}
        ${lastError?`<p class="err" role="alert">${esc(lastError)}</p>`:''}`;
      return;
    }
    const u=session.user,m=getMeta(),pic=String((u.user_metadata&&(u.user_metadata.avatar_url||u.user_metadata.picture))||'').replace(/^http:\/\//i,'https://');
    const syncState=busy?'busy':conflictRow?'conflict':lastError?'error':m.uid===uid()&&m.at&&m.hash===localHash()?'done':'pending';
    const syncLabel={busy:'동기화하는 중…',conflict:'기록 확인 필요',error:'동기화 오류',done:'동기화됨',pending:'동기화 대기 중'}[syncState];
    const syncIcon=syncState==='done'?'<path d="m6 12 4 4 8-8"/>':syncState==='busy'?'<path d="M19 12a7 7 0 1 1-7-7"/>':syncState==='pending'?'<circle cx="12" cy="12" r="7"/><path d="M12 8v4l3 2"/>':'<path d="M12 6v8m0 3v1"/>';
    box.innerHTML=`<div class="acct-card">${pic?`<img class="acct-pic" src="${esc(pic)}" alt="" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'acct-pic acct-ini',textContent:${esc(JSON.stringify(userName(u).slice(0,1)))}}))">`:`<span class="acct-pic acct-ini">${esc(userName(u).slice(0,1))}</span>`}
        <div><b>${esc(userName(u))}</b><small>${esc(providerName(u))}${u.email?' · '+esc(u.email):''}</small></div></div>
      <div class="acct-sync" data-sync-state="${syncState}"><span class="acct-sync-title" role="status"><i class="acct-sync-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${syncIcon}</svg></i>${syncLabel}</span><small>${lastError?esc(lastError):'마지막 동기화 '+when(m.at)}</small></div>
      <div class="row acct-actions"><button class="secondary" id="syncNow">지금 동기화</button><button class="secondary" id="signOut">로그아웃</button></div>
      <div class="danger-zone acct-danger"><p class="note">서버에 저장된 기록과 계정을 지워요. 이 기기의 기록은 남아요.</p>
        <button class="del${armDelete?' arm':''}" id="deleteAccount">${armDelete?'한 번 더 누르면 삭제':'계정 삭제'}</button></div>`;
  }
  function renderAccountIfOpen(){if(typeof setPage!=='undefined'&&setPage==='account'&&tab==='set')renderAccount();if(typeof renderSet==='function'&&tab==='set'&&!setPage)renderSet()}
  const LOGIN_ICON={
    google:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.2a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.2 7.1l3.6 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>',
    github:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1.5a10.5 10.5 0 0 0-3.3 20.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.4-3.5-1.4-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.1 3.1.9.1-.7.4-1.1.7-1.4-2.3-.3-4.8-1.2-4.8-5.2 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 2.9 1.1a9.9 9.9 0 0 1 5.2 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.8 0 4-2.5 4.9-4.8 5.2.4.3.7 1 .7 2v3c0 .3.2.6.7.5A10.5 10.5 0 0 0 12 1.5z"/></svg>',
    kakao:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#191919" d="M12 3.5c-5.2 0-9.5 3.3-9.5 7.4 0 2.6 1.7 4.9 4.3 6.2l-1.1 4c-.1.3.3.6.6.4l4.7-3.1c.3 0 .7.1 1 .1 5.2 0 9.5-3.3 9.5-7.5S17.2 3.5 12 3.5z"/></svg>'
  };
  window.TourdyAccount={label:()=>!configured?'준비 중':uid()?userName(session.user):'로그인 안 됨',render:renderAccount,
    client:()=>sb,userId:()=>uid()||null,configured:()=>configured};

  document.addEventListener('click',e=>{
    const l=e.target.closest('[data-login]');if(l){signIn(l.dataset.login);return}
    if(e.target.closest('#syncNow')){pull();return}
    if(e.target.closest('#signOut')){signOut();return}
    if(e.target.closest('#deleteAccount')){deleteAccount();return}
  });
  $('syncUseLocal').onclick=()=>choose('local');
  $('syncUseCloud').onclick=()=>choose('cloud');
  $('syncLater').onclick=()=>{$('syncDialog').close();conflictRow=null;setStatus('다른 기기와 기록이 달라 동기화를 멈췄어요. "지금 동기화"를 눌러 다시 고를 수 있어요.')};
  $('syncDialog').addEventListener('cancel',e=>{e.preventDefault();$('syncLater').click()});

  if(!configured)return;
  sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:!native,storageKey:'tourdy-auth'}});
  sb.auth.onAuthStateChange((event,ses)=>{
    session=ses;
    // Supabase 권장: 이 콜백 안에서 바로 다른 Supabase 요청을 하지 않고 한 박자 뒤에 실행
    if(ses&&(event==='SIGNED_IN'||event==='INITIAL_SESSION'))setTimeout(()=>{pull();listen();try{document.dispatchEvent(new Event('tourdy:signed-in'))}catch(e){}},0);
    if(!ses){unlisten();retryDone()}
    setTimeout(renderAccountIfOpen,0);
  });
  // 기록이 바뀌면(저장될 때마다) 4초 뒤 한 번에 서버로
  {const base=save;save=function(){const r=base.apply(this,arguments);if(!applying)markEdit();schedule();return r}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(pushTimer)pushNow()}else{pull();listen()}});
  if(typeof window.addEventListener==='function')window.addEventListener('online',()=>{retryDone();pull()});
})();
