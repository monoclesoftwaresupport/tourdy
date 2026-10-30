/* ---------- 투어디 플러스(구독) · 휴무 도장: 계산에 쓰는 기본 함수 ----------
   마일리지·연속 공부 계산(travel-world.js, travel-experience.js)이 불러 쓰므로 core.js 바로 다음에 불러온다.
   구독 기록: S.sub = {on, log:[{from:'YYYY-MM-DD', to:'YYYY-MM-DD'|null}]}
     → 구독 중이던 날의 공부만 마일리지 1.5배 (소급하지 않고, 해지해도 이미 받은 마일리지는 그대로)
   휴무 도장: S.rest = {stamps, days:[휴무로 처리한 날], months:[구독 도장을 받은 달]}
     → 휴무일은 연속 일수에 더하지 않지만 앞뒤 공부를 이어 준다 (정기권·7일/30일 연속 보너스 모두) */
const SUB_RATE=1.5,SUB_PRICE={m:'$4',y:'$36'};
const SUBP=()=>S.sub||(S.sub={on:false,log:[]});
const subOn=()=>!!SUBP().on;
const subDay=k=>(SUBP().log||[]).some(p=>k>=p.from&&(!p.to||k<=p.to));
const mileRate=()=>subOn()?SUB_RATE:1;
function setSub(on){
  const P=SUBP(),t=dk(today0());if(!!on===!!P.on)return;P.on=!!on;P.log=P.log||[];
  if(on)P.log.push({from:t,to:null});
  else{const l=P.log[P.log.length-1];if(l&&!l.to){if(l.from===t)P.log.pop();else l.to=dk(addD(today0(),-1))}
    const o=S.travel&&S.travel.opt;if(o){if(o.map&&o.map!=='base')o.map='base';if(o.skin&&o.skin!=='base')o.skin='base'}} // 해지하면 구독 꾸미기는 기본으로
}
const RESTP=()=>{const R=S.rest||(S.rest={stamps:1,days:[],months:[]});R.days=R.days||[];R.months=R.months||[];return R}; // 무료로 처음 1장
const REST_MAX=3;
const restSet=()=>new Set(RESTP().days);
// prev 다음 날부터 휴무일을 건너뛰었을 때 k가 바로 이어지는 날인지
function restLinked(prev,k,rs){let d=addD(pk(prev),1),g=0;while(rs.has(dk(d))&&g++<3)d=addD(d,1);return dk(d)===k}
