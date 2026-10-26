/* ---------- 기기 간 기록 자동 합치기 ----------
   마지막으로 서버와 맞췄던 기록(base)을 기준으로, 이 기기(local)와 다른 기기(cloud)가
   각각 무엇을 추가·삭제·수정했는지 비교해서 하나로 합친다.
   - 공부 기록·과목·할 일처럼 id가 있는 목록: 양쪽에서 추가한 것 모두 남기고, 한쪽에서 지운 것은 지운다.
     한쪽은 고치고 다른 쪽은 지웠으면 고친 쪽을 남긴다(기록을 잃지 않는 쪽).
   - 사용한 마일리지·이동 거리처럼 쌓이는 숫자: 양쪽 증가분을 더한다.
   - 같은 항목을 양쪽에서 서로 다르게 바꾼 경우엔 더 최근에 저장한 기기(prefer)의 값을 쓴다 → 사용자에게 묻지 않는다. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TourdyMerge=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const COUNTERS=new Set(['travel.used','travel.km','travel.kr.km']);
  const isObj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
  const clone=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v));
  function eq(a,b){
    if(a===b)return true;
    if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
    if(Array.isArray(a)){if(a.length!==b.length)return false;for(let i=0;i<a.length;i++)if(!eq(a[i],b[i]))return false;return true}
    const ka=Object.keys(a).filter(k=>a[k]!==undefined),kb=Object.keys(b).filter(k=>b[k]!==undefined);
    if(ka.length!==kb.length)return false;for(const k of ka)if(!eq(a[k],b[k]))return false;return true;
  }
  const keyed=a=>a.every(x=>isObj(x)&&(typeof x.id==='string'||typeof x.id==='number'));
  const prims=a=>a.every(x=>x===null||typeof x!=='object');
  const uniq=a=>new Set(a).size===a.length;
  function mergeKeyed(b,l,c,path,ctx){
    const B=new Map(b.map(x=>[x.id,x])),L=new Map(l.map(x=>[x.id,x])),C=new Map(c.map(x=>[x.id,x]));
    const order=[...c.map(x=>x.id),...l.map(x=>x.id).filter(id=>!C.has(id))];
    const out=[];
    for(const id of order){
      const bv=B.get(id),lv=L.get(id),cv=C.get(id);
      if(bv!==undefined&&(lv===undefined)!==(cv===undefined)){       // 한쪽에서만 지움
        const kept=lv===undefined?cv:lv;
        if(!eq(kept,bv))out.push(clone(kept));                          // 다른 쪽이 고쳤으면 고친 걸 남김
        continue;
      }
      const v=merge(bv,lv,cv,`${path}[${id}]`,ctx);if(v!==undefined)out.push(v);
    }
    if(out.length&&out.every(x=>Number.isFinite(x.start)))out.sort((x,y)=>x.start-y.start);
    return out;
  }
  function mergeSet(b,l,c){
    const removed=new Set(b.filter(x=>!l.includes(x)||!c.includes(x)));
    return [...c.filter(x=>!removed.has(x)),...l.filter(x=>!c.includes(x)&&!removed.has(x))];
  }
  function merge(b,l,c,path,ctx){
    if(eq(l,c))return clone(l);
    if(eq(l,b))return clone(c);
    if(eq(c,b))return clone(l);
    if(COUNTERS.has(path)&&typeof l==='number'&&typeof c==='number')return l+c-(typeof b==='number'?b:0);
    if(isObj(l)&&isObj(c)){
      const bb=isObj(b)?b:{},out={};
      for(const k of new Set([...Object.keys(c),...Object.keys(l)])){const v=merge(bb[k],l[k],c[k],path?path+'.'+k:k,ctx);if(v!==undefined)out[k]=v}
      return out;
    }
    if(Array.isArray(l)&&Array.isArray(c)){
      const bb=Array.isArray(b)?b:[];
      if(keyed(l)&&keyed(c)&&keyed(bb))return mergeKeyed(bb,l,c,path,ctx);
      if(prims(l)&&prims(c)&&prims(bb)&&uniq(l)&&uniq(c)&&uniq(bb))return mergeSet(bb,l,c);
    }
    ctx.conflicts.push(path||'(전체)');                      // 양쪽이 서로 다르게 바꿈 → 최근 기기 값
    return clone(ctx.prefer==='local'?l:c);
  }
  // base가 없으면(처음 맞추는 기기) 양쪽 목록은 모두 남기고, 서로 다른 설정값은 최근 기기 값을 쓴다.
  // prefer: 'local' | 'cloud' — 더 최근에 저장한 쪽
  function mergeStates(base,local,cloud,prefer='cloud'){
    const ctx={prefer,conflicts:[]};
    return {ok:true,state:merge(base==null?undefined:base,local,cloud,'',ctx),conflicts:ctx.conflicts};
  }
  return {mergeStates,eq};
});
