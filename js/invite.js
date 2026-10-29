/* ---------- 친구 초대 ----------
   - 로그인하면 내 초대 코드(6자리)를 받는다. 친구가 가입 후 14일 안에 내 코드를 입력하면 둘 다 500 마일리지.
   - 보상은 서버가 기록하고, 앱은 그 목록을 받아 S.gifts에 고유 id로 넣는다 → 여러 기기에서 받아도 한 번만 들어간다.
   - 초대한 사람 보상은 친구 10명까지. 서로의 코드를 맞바꾸는 건 막는다. */
(function(){
  const REWARD=500,MAX=10;
  let info=null,busy=false,msg='',err='';
  const A=()=>window.TourdyAccount;
  const sb=()=>A()&&A().client&&A().client();
  const me=()=>A()&&A().userId&&A().userId();
  const REASON={invalid:'없는 코드예요. 다시 확인해 주세요.',self:'내 코드는 입력할 수 없어요.',already:'이미 친구 코드를 입력했어요.',too_old:'친구 코드는 가입 후 14일 안에만 입력할 수 있어요.',mutual:'서로의 코드를 맞바꿀 수는 없어요.'};
  function addGifts(rows){
    S.gifts=S.gifts||[];const have=new Set(S.gifts.map(g=>g.id));let n=0;
    for(const r of rows){const id='invite:'+r.id;if(have.has(id))continue;
      S.gifts.push({id,m:REWARD,t:r.kind==='joined'?'친구 코드 입력 보상':'친구 초대 보상',d:dk(today0())});n++}
    if(n){save();renderAll();if(typeof bonusCheck==='function')bonusCheck()}
    return n;
  }
  async function refresh(){
    const c=sb();if(!c||!me()||busy)return;
    busy=true;
    try{
      const [code,rew]=await Promise.all([c.rpc('my_invite_code'),c.rpc('my_invite_rewards')]);
      if(code.error||rew.error)throw code.error||rew.error;
      const rows=rew.data||[];
      info={code:code.data,invited:rows.filter(r=>r.kind==='invited').length,joined:rows.some(r=>r.kind==='joined')};
      addGifts(rows);err='';
    }catch(e){err='초대 정보를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'}
    finally{busy=false;if(open())render()}
  }
  async function redeem(){
    const c=sb(),inp=$('inviteInput');if(!c||!inp)return;
    const code=inp.value.trim().toUpperCase();if(!/^[A-Z0-9]{6}$/.test(code)){err='코드 6자리를 입력해 주세요.';return render()}
    busy=true;err='';render();
    try{
      const {data,error}=await c.rpc('redeem_invite',{p_code:code});if(error)throw error;
      const r=Array.isArray(data)?data[0]:data;
      if(!r||!r.ok){err=REASON[r&&r.reason]||'코드를 사용하지 못했어요.';return}
      msg=`친구 코드를 입력했어요. ${REWARD} 마일리지를 받았어요!`;
    }catch(e){err='코드를 확인하지 못했어요. 인터넷 연결을 확인해 주세요.'}
    finally{busy=false;render()}
    refresh();
  }
  async function share(){
    if(!info||!info.code)return;
    const text=`투어디에서 같이 공부해요! 가입하고 설정 → 친구 초대에서 내 코드 ${info.code} 를 입력하면 둘 다 ${REWARD} 마일리지를 받아요.`;
    try{if(navigator.share){await navigator.share({text});return}}catch(e){if(e&&e.name==='AbortError')return}
    try{await navigator.clipboard.writeText(text);toast('초대 메시지를 복사했어요. 친구에게 보내 주세요.')}catch(e){toast('복사하지 못했어요')}
  }
  const open=()=>typeof setPage!=='undefined'&&setPage==='invite'&&tab==='set';
  function render(){
    const box=$('inviteBody');if(!box)return;
    if(!me()){
      box.innerHTML=`<p class="note">친구가 내 초대 코드를 입력하면 <b>둘 다 ${REWARD} 마일리지</b>를 받아요. 초대 코드는 로그인하면 받을 수 있어요.</p>
        <button class="primary invite-login" id="inviteLogin">로그인하러 가기</button>`;
      return;
    }
    const left=Math.max(0,MAX-((info&&info.invited)||0));
    box.innerHTML=`<div class="invite-card"><span class="plabel">내 초대 코드</span><b class="invite-code">${info&&info.code?esc(info.code):'······'}</b>
        <div class="row"><button class="primary" id="inviteShare" ${info&&info.code?'':'disabled'}>초대 메시지 보내기</button></div>
        <small>친구가 가입하고 이 코드를 입력하면 둘 다 ${REWARD} 마일리지 · 초대한 친구 ${(info&&info.invited)||0}명 (보상은 ${MAX}명까지, ${left}명 남음)</small></div>
      ${info&&info.joined?`<p class="note">친구 코드로 ${REWARD} 마일리지를 이미 받았어요.</p>`:`<div class="invite-redeem"><span class="plabel">친구에게 받은 코드</span>
        <div class="row"><input class="field" id="inviteInput" maxlength="6" autocapitalize="characters" autocomplete="off" placeholder="6자리 코드" aria-label="친구 초대 코드"><button class="secondary" id="inviteGo" ${busy?'disabled':''}>받기</button></div>
        <small class="note">가입 후 14일 안에 한 번만 입력할 수 있어요.</small></div>`}
      ${msg?`<p class="note" role="status">${esc(msg)}</p>`:''}${err?`<p class="err" role="alert">${esc(err)}</p>`:''}`;
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('#inviteShare'))share();
    else if(e.target.closest('#inviteGo'))redeem();
    else if(e.target.closest('#inviteLogin'))openSet('account');
  });
  document.addEventListener('tourdy:signed-in',refresh);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
  window.TourdyInvite={render:()=>{msg='';render();refresh()},label:()=>me()&&info&&info.code?info.code:''};
})();
