/* 웹앱: 오프라인 저장, 저장 공간 유지 요청, 설치 안내 */
if('serviceWorker' in navigator)window.addEventListener('load',()=>{
  let reloading=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)location.reload()});
  navigator.serviceWorker.register('sw.js').then(reg=>{
    const offer=()=>{
      if(!reg.waiting||!navigator.serviceWorker.controller||document.getElementById('appUpdate'))return;
      const bar=document.createElement('div');bar.id='appUpdate';bar.className='install';
      bar.innerHTML='<span>새 버전이 준비됐어요. 현재 기록을 저장하고 업데이트할 수 있어요.</span><button class="go">업데이트</button>';
      bar.querySelector('button').onclick=()=>{if(!saveStoredSnapshot()||!reg.waiting)return;reloading=true;reg.waiting.postMessage({type:'ACTIVATE_UPDATE'})};
      document.querySelector('.wrap').prepend(bar);
    };
    offer();reg.addEventListener('updatefound',()=>{const worker=reg.installing;if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed')offer()})});
  }).catch(()=>toast('오프라인 사용 준비를 마치지 못했어요. 연결 상태를 확인한 뒤 앱을 다시 열어 주세요'));
});
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}
(function(){
  const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  let off=false;try{off=localStorage.getItem('installHintOff')==='1'}catch(e){}
  if(standalone||off)return;
  const bar=document.createElement('div');bar.className='install';
  const close=()=>{bar.remove();try{localStorage.setItem('installHintOff','1')}catch(e){}};
  const put=html=>{bar.innerHTML=html;const w=document.querySelector('.wrap');w&&w.prepend(bar);bar.querySelector('.x').onclick=close};
  if(ios){put('<span>앱으로 쓰려면 사파리 <b>공유</b> 버튼 → <b>홈 화면에 추가</b>를 눌러 주세요. 사파리와 설치한 앱의 기록은 따로 저장돼요.</span><button class="x" aria-label="닫기">×</button>');return}
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();const ev=e;
    put('<span>홈 화면이나 바탕화면에 <b>앱으로 설치</b>할 수 있어요.</span><button class="go">설치</button><button class="x" aria-label="닫기">×</button>');
    bar.querySelector('.go').onclick=async()=>{ev.prompt();try{await ev.userChoice}catch(_){};bar.remove()}});
})();
