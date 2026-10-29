/* ---------- 타이머 끄는 걸 깜빡했을 때 ----------
   자유 타이머(끝 시각이 없는 공부 타이머)가 3시간 넘게 이어지면 "아직 공부 중인가요?"를 묻는다.
   - 계속 공부 중: 그대로 두고, 다시 3시간 뒤에 묻는다
   - 지금 끝내기: 지금 시각으로 끝낸다
   - 끝난 시각 고치기: 실제로 끝난 시각을 골라 그때까지만 기록한다 (마일리지도 그만큼만 쌓임)
   예약형(끝 시각이 정해진 타이머)은 알아서 끝나므로 묻지 않는다.
   앱을 다시 열거나 화면으로 돌아왔을 때, 켜 둔 채로 있을 때 모두 확인한다. */
(function(){
  const LIMIT=3*36e5;
  const dlg=$('forgotDialog');if(!dlg)return;
  const pad2=n=>String(n).padStart(2,'0');
  const local=t=>{const d=new Date(t);return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`};
  const when=t=>{const d=new Date(t),same=new Date().toDateString()===d.toDateString();return `${same?'오늘':`${d.getMonth()+1}월 ${d.getDate()}일`} ${d.getHours()<12?'오전':'오후'} ${d.getHours()%12||12}:${pad2(d.getMinutes())}`};
  const free=()=>{const r=S.running;return r&&r.kind==='study'&&!r.end&&!r.plan?r:null};
  function check(){
    const r=free();if(!r||dlg.open||document.hidden||document.body.classList.contains('tour-active'))return; // 첫 실행 튜토리얼 중에는 기다림
    if(Date.now()-(r.ok||r.start)<LIMIT)return;
    const s=subj(r.sid);
    $('forgotText').innerHTML=`<b>${esc(s?.name||'공부')}</b> 타이머가 <b>${fmtH(Date.now()-r.start)}</b>째 켜져 있어요.<br>${when(r.start)}에 시작했어요.`;
    $('forgotEdit').hidden=true;$('forgotErr').hidden=true;
    const inp=$('forgotEnd');inp.min=local(r.start+6e4);inp.max=local(Date.now());inp.value=local(Math.min(Date.now(),r.start+LIMIT));
    try{dlg.showModal()}catch(e){dlg.setAttribute('open','')}
  }
  const done=()=>{dlg.close();save();refreshTimer();renderPlanIf()};
  $('forgotKeep').onclick=()=>{const r=free();if(r)r.ok=Date.now();done()};
  $('forgotStop').onclick=()=>{if(free())closeRun();postStop=false;done()};
  $('forgotFix').onclick=()=>{$('forgotEdit').hidden=false;$('forgotEnd').focus()};
  $('forgotSave').onclick=()=>{
    const r=free();if(!r)return done();
    const t=new Date($('forgotEnd').value).getTime();
    if(!t||t<=r.start+59e3||t>Date.now()+6e4){$('forgotErr').textContent=`${when(r.start)} 이후, 지금보다 이른 시각을 골라 주세요.`;$('forgotErr').hidden=false;return}
    r.end=Math.min(t,Date.now());closeRun();postStop=false;done();toast(`${when(t)}까지만 기록했어요`);
  };
  dlg.addEventListener('cancel',e=>{e.preventDefault()}); // Esc로 닫으면 아무 선택도 안 한 셈이라 막는다
  setInterval(check,3e4);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(check,600)});
  window.addEventListener('load',()=>setTimeout(check,1500));
})();
