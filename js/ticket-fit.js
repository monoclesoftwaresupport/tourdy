/* ---------- 탑승권·승차권: 긴 글자 한 줄 맞추기 ----------
   표 안의 칸은 폭이 정해져 있어서 '브라티슬라바', '부에노스아이레스', '광주(경기)', 'ITX-새마을 922'처럼
   긴 글자가 줄바꿈되거나 칸 밖으로 넘치거나 '…'로 잘렸다.
   줄바꿈 대신 글자 크기를 조금씩 줄여서 한 줄에 맞춘다 (원래 크기의 45%까지, 최소 9px).
   그래도 넘치면 원래 크기로 되돌려 단어 단위로 줄바꿈한다. 단, 편명·거리 같은 정보 칸은 '…' 그대로.
   숨겨진 화면에 있다가 나중에 보이는 표도 있어서, 크기가 생길 때(ResizeObserver) 맞춘다. */
(function(){
  const SEL=[
    '.bx-big b','.bx-big small','.bx-kv small','.bx-kv b','.bx-route>div>*','.bx-info b', // 세계 탑승권
    '.tk-stub b','.tk-route b','.tk-info b'                       // 국내 승차권
  ].join(',');
  const KEEP='.bx-info b,.tk-info b';
  if(typeof ResizeObserver!=='function')return;
  const seen=new WeakSet();
  // scrollWidth는 정수로 반올림돼서 0.5px쯤 넘치는 건 못 잡는다(그래도 '…'는 뜸). 글자 실제 폭을 소수점까지 잰다
  const range=document.createRange();
  function over(b,cs){
    range.selectNodeContents(b);
    const avail=b.getBoundingClientRect().width-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-parseFloat(cs.borderLeftWidth)-parseFloat(cs.borderRightWidth);
    // '…'로 잘린 칸은 range 폭도 잘린 채로 나와서 scrollWidth도 함께 본다
    return b.scrollWidth>b.clientWidth||range.getBoundingClientRect().width>avail-.5; // 0.01px만 넘쳐도 …가 뜨므로 0.5px 여유를 둔다
  }
  function fit(b){
    const w=b.clientWidth;if(!w||b.dataset.fitW===String(w))return;
    b.style.fontSize='';for(const k of ['whiteSpace','wordBreak','overflowWrap','textOverflow','overflow'])b.style[k]='';
    const cs=getComputedStyle(b),base=parseFloat(cs.fontSize)||16,min=Math.max(9,base*.45);let s=base;
    while(over(b,cs)&&s>min){s=Math.max(min,s-.5);b.style.fontSize=s+'px'}
    // 최소 크기로도 안 들어가면: 정보 칸은 '…' 그대로, 나머지는 원래 크기로 되돌려 단어 단위 줄바꿈 (너무 작은 글씨보다 나음)
    // 폰 화면 오른쪽 조각: 도착지 이름 칸이 너무 좁으면 그 줄 전체를 쓰게 하고 다시 맞춘다
    const sum=b.closest('.bx-big')&&b.closest('.bx-sum');
    if(over(b,cs)&&sum&&!sum.classList.contains('bx-long')&&getComputedStyle(sum).display==='grid'){sum.classList.add('bx-long');delete b.dataset.fitW;return fit(b)}
    if(over(b,cs)&&!b.matches(KEEP)){b.style.fontSize='';Object.assign(b.style,{whiteSpace:'normal',wordBreak:'keep-all',overflowWrap:'anywhere',textOverflow:'clip',overflow:'visible'})}
    b.dataset.fitW=String(w);
  }
  const ro=new ResizeObserver(list=>{for(const e of list)fit(e.target)});
  function scan(){for(const b of document.querySelectorAll(SEL)){if(seen.has(b))continue;seen.add(b);ro.observe(b)}}
  let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})}).observe(document.body,{childList:true,subtree:true});
  scan();
  // 웹 글꼴(Noto Sans KR 등)이 늦게 받아지면 글자 폭이 바뀌므로 그때 한 번 더 맞춘다
  function refitAll(){for(const b of document.querySelectorAll(SEL)){delete b.dataset.fitW;fit(b)}}
  try{document.fonts.ready.then(refitAll);document.fonts.addEventListener('loadingdone',refitAll)}catch(e){}
})();
