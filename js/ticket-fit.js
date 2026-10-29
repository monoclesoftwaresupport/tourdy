/* ---------- 탑승권 오른쪽 조각: 긴 지명 한 줄 맞추기 ----------
   오른쪽 조각은 폭이 150px로 고정이라, '브라티슬라바'처럼 긴 도시 이름이 '브라티슬라 / 바'로 줄바꿈됐다.
   줄바꿈 대신 글자 크기를 조금씩 줄여서 한 줄에 맞춘다 (최소 11px).
   숨겨진 화면에 있다가 나중에 보이는 표도 있어서, 크기가 생길 때(ResizeObserver) 맞춘다. */
(function(){
  const SEL='.bx-big b',MIN=11;
  if(typeof ResizeObserver!=='function')return;
  const seen=new WeakSet();
  function fit(b){
    const w=b.clientWidth;if(!w||b.dataset.fitW===String(w))return;
    b.style.fontSize='';
    let s=parseFloat(getComputedStyle(b).fontSize)||20;
    while(b.scrollWidth>b.clientWidth+.5&&s>MIN){s=Math.max(MIN,s-.5);b.style.fontSize=s+'px'}
    b.dataset.fitW=String(w);
  }
  const ro=new ResizeObserver(list=>{for(const e of list)fit(e.target)});
  function scan(){for(const b of document.querySelectorAll(SEL)){if(seen.has(b))continue;seen.add(b);ro.observe(b)}}
  let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})}).observe(document.body,{childList:true,subtree:true});
  scan();
})();
