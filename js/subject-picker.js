/* ---------- 과목 선택 창: 기본 선택 상자 대신, 과목마다 정한 색·아이콘과 함께 고르는 창 ----------
   원래 <select>는 숨겨 두고 값만 그대로 쓴다. 다른 코드가 select.value를 바꾸거나 목록을 다시 그려도 버튼이 따라 바뀐다. */
(function(){
  const IDS=['taskSub','repSub','bookSub','recSub'];
  const NONE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M8 16 16 8"/></svg>';
  const CHK='<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m2.5 6.2 2.4 2.4 4.6-5"/></svg>';
  const DOWN='<svg class="sp-chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 6 4 4 4-4"/></svg>';
  const desc=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
  const OFF={'k:rest':['휴식','var(--rest)','clock'],'k:waste':['딴짓','var(--waste)','bulb']};
  // 옵션 하나를 화면에 보일 정보로
  function info(o){
    if(!o||!o.value)return {name:o?o.textContent:'과목 없음',color:'var(--faint)',ic:NONE,none:true};
    if(OFF[o.value]){const [n,c,i]=OFF[o.value];return {name:n,color:c,ic:icon(i)}}
    const s=subj(o.value);return {name:s?s.name:o.textContent,color:s?.color||'#8D8D86',ic:icon(s?.icon||'book')};
  }
  const chip=(x,cls='')=>`<span class="ic sp-ic${x.none?' none':''}${cls}" style="--c:${x.color}">${x.ic}</span>`;

  /* --- 창 --- */
  const dlg=document.createElement('dialog');dlg.className='sp-dlg';dlg.setAttribute('aria-labelledby','spTitle');
  document.body.appendChild(dlg);
  let cur=null;
  function openFor(sel){
    cur=sel;const v=desc.get.call(sel);let h='',last=null;
    for(const o of sel.options){
      const g=o.parentElement.tagName==='OPTGROUP'?o.parentElement.label:null;
      if(g!==last){h+=g?`<li class="sp-g">${esc(g)}</li>`:'';last=g}
      const x=info(o),on=o.value===v;
      h+=`<li><button type="button" class="sp-op${on?' on':''}" data-v="${esc(o.value)}" ${o.disabled?'disabled':''} style="--c:${x.color}" aria-pressed="${on}">${chip(x)}<span class="sp-n">${esc(x.name)}</span><span class="sp-ck">${on?CHK:''}</span></button></li>`;
    }
    const hasSubs=[...sel.options].some(o=>o.value&&!OFF[o.value]&&!o.disabled);
    dlg.innerHTML=`<div class="sp-h"><b id="spTitle">과목 선택</b><button type="button" class="sp-x" data-sp="close" aria-label="닫기">${XI}</button></div>
      <ul class="sp-list">${h}</ul>
      ${hasSubs?'':'<p class="note sp-empty">아직 만든 과목이 없어요.</p>'}
      <button type="button" class="sp-new" data-sp="preset">+ 프리셋 목록에서 과목 만들기·꾸미기</button>`;
    dlg.showModal();
    const f=dlg.querySelector('.sp-op.on')||dlg.querySelector('.sp-op:not([disabled])');if(f)f.focus();
  }
  function close(){if(dlg.open)dlg.close();const s=cur;cur=null;if(s&&s._spBtn)s._spBtn.focus()}
  dlg.addEventListener('click',e=>{
    if(e.target===dlg)return close();
    const o=e.target.closest('.sp-op');
    if(o&&!o.disabled&&cur){const s=cur;desc.set.call(s,o.dataset.v);sync(s);s.dispatchEvent(new Event('input',{bubbles:true}));s.dispatchEvent(new Event('change',{bubbles:true}));close();return}
    const b=e.target.closest('[data-sp]');if(!b)return;
    if(b.dataset.sp==='close')close();
    if(b.dataset.sp==='preset'){close();setTab('home');setHome('preset');window.scrollTo({top:0,behavior:'smooth'})}
  });
  dlg.addEventListener('cancel',e=>{e.preventDefault();close()});

  /* --- 선택 상자 → 버튼 --- */
  function sync(sel){
    const b=sel._spBtn;if(!b)return;const o=sel.options[sel.selectedIndex],x=info(o);
    b.innerHTML=`${chip(x,' sm')}<span class="sp-bn">${esc(x.name)}</span>${DOWN}`;
    b.style.setProperty('--c',x.color);b.classList.toggle('none',!!x.none);
    b.disabled=sel.disabled||!sel.options.length;
    b.setAttribute('aria-label',`${sel.getAttribute('aria-label')||'과목'}: ${x.name}`);
  }
  function enhance(sel){
    if(!sel||sel._spBtn)return;
    const b=document.createElement('button');b.type='button';b.className='subpick'+(sel.classList.contains('field')?' field':'');b.setAttribute('aria-haspopup','dialog');
    sel._spBtn=b;sel.classList.add('sp-native');sel.insertAdjacentElement('afterend',b);
    b.addEventListener('click',()=>openFor(sel));
    // 다른 코드가 sel.value = ... 로 바꿔도 버튼이 따라오게
    Object.defineProperty(sel,'value',{configurable:true,get(){return desc.get.call(this)},set(v){desc.set.call(this,v);sync(this)}});
    sel.addEventListener('change',()=>sync(sel));
    new MutationObserver(()=>sync(sel)).observe(sel,{childList:true,subtree:true,attributes:true,attributeFilter:['selected','disabled']});
    sync(sel);
  }
  IDS.forEach(id=>enhance($(id)));
  // 과목 이름·색·아이콘을 바꾸면 버튼도 새로 그린다
  {const base=save;save=function(){const r=base.apply(this,arguments);IDS.forEach(id=>{const s=$(id);if(s)sync(s)});return r}}
  window.TourdySubjectPicker={enhance,sync};
})();
