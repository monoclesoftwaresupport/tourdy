/* ---------- 세계 여행: 공부 1시간 = 10 마일리지 = 비행 10분, 하루 최대 8시간 ---------- */
const CONT=['아시아','중동','유럽','아프리카','북중미','남미','오세아니아'];
// [코드, 나라, 수도, 위도, 경도, 대륙 번호]
const NATIONS=[
['KR','대한민국','서울',37.57,126.98,0],['JP','일본','도쿄',35.68,139.69,0],['CN','중국','베이징',39.90,116.40,0],['TW','대만','타이베이',25.03,121.56,0],
['MN','몽골','울란바토르',47.89,106.91,0],['VN','베트남','하노이',21.03,105.85,0],['TH','태국','방콕',13.76,100.50,0],['PH','필리핀','마닐라',14.60,120.98,0],
['MY','말레이시아','쿠알라룸푸르',3.14,101.69,0],['SG','싱가포르','싱가포르',1.35,103.82,0],['ID','인도네시아','자카르타',-6.21,106.85,0],['KH','캄보디아','프놈펜',11.56,104.92,0],
['LA','라오스','비엔티안',17.97,102.63,0],['IN','인도','뉴델리',28.61,77.21,0],['NP','네팔','카트만두',27.72,85.32,0],['LK','스리랑카','콜롬보',6.93,79.86,0],
['UZ','우즈베키스탄','타슈켄트',41.30,69.24,0],['KZ','카자흐스탄','아스타나',51.17,71.45,0],
['AE','아랍에미리트','아부다비',24.45,54.38,1],['QA','카타르','도하',25.29,51.53,1],['SA','사우디아라비아','리야드',24.71,46.68,1],['JO','요르단','암만',31.95,35.93,1],['TR','튀르키예','앙카라',39.93,32.86,1],
['GB','영국','런던',51.51,-0.13,2],['FR','프랑스','파리',48.86,2.35,2],['DE','독일','베를린',52.52,13.40,2],['IT','이탈리아','로마',41.90,12.50,2],
['ES','스페인','마드리드',40.42,-3.70,2],['PT','포르투갈','리스본',38.72,-9.14,2],['NL','네덜란드','암스테르담',52.37,4.90,2],['BE','벨기에','브뤼셀',50.85,4.35,2],
['CH','스위스','베른',46.95,7.45,2],['AT','오스트리아','빈',48.21,16.37,2],['CZ','체코','프라하',50.08,14.44,2],['PL','폴란드','바르샤바',52.23,21.01,2],
['HU','헝가리','부다페스트',47.50,19.04,2],['HR','크로아티아','자그레브',45.81,15.98,2],['GR','그리스','아테네',37.98,23.73,2],['IE','아일랜드','더블린',53.35,-6.26,2],
['DK','덴마크','코펜하겐',55.68,12.57,2],['NO','노르웨이','오슬로',59.91,10.75,2],['SE','스웨덴','스톡홀름',59.33,18.07,2],['FI','핀란드','헬싱키',60.17,24.94,2],
['IS','아이슬란드','레이캬비크',64.15,-21.94,2],['RU','러시아','모스크바',55.76,37.62,2],
['EG','이집트','카이로',30.04,31.24,3],['MA','모로코','라바트',34.02,-6.84,3],['KE','케냐','나이로비',-1.29,36.82,3],['TZ','탄자니아','도도마',-6.16,35.75,3],
['ET','에티오피아','아디스아바바',9.03,38.74,3],['NG','나이지리아','아부자',9.08,7.40,3],['GH','가나','아크라',5.60,-0.19,3],['SN','세네갈','다카르',14.72,-17.47,3],
['ZA','남아프리카공화국','프리토리아',-25.75,28.19,3],['MG','마다가스카르','안타나나리보',-18.88,47.51,3],
['US','미국','워싱턴 D.C.',38.91,-77.04,4],['CA','캐나다','오타와',45.42,-75.70,4],['MX','멕시코','멕시코시티',19.43,-99.13,4],['CU','쿠바','아바나',23.11,-82.37,4],
['BR','브라질','브라질리아',-15.79,-47.88,5],['AR','아르헨티나','부에노스아이레스',-34.60,-58.38,5],['CL','칠레','산티아고',-33.45,-70.67,5],
['PE','페루','리마',-12.05,-77.04,5],['CO','콜롬비아','보고타',4.71,-74.07,5],
['AU','호주','캔버라',-35.28,149.13,6],['NZ','뉴질랜드','웰링턴',-41.29,174.78,6],['FJ','피지','수바',-18.14,178.44,6],
['MM','미얀마','네피도',19.76,96.08,0],['BD','방글라데시','다카',23.81,90.41,0],['BT','부탄','팀부',27.47,89.64,0],
['MV','몰디브','말레',4.18,73.51,0],['PK','파키스탄','이슬라마바드',33.68,73.05,0],['AF','아프가니스탄','카불',34.56,69.21,0],['TJ','타지키스탄','두샨베',38.56,68.79,0],
['KG','키르기스스탄','비슈케크',42.87,74.59,0],['TM','투르크메니스탄','아시가바트',37.96,58.33,0],['BN','브루나이','반다르스리브가완',4.90,114.94,0],['TL','동티모르','딜리',-8.56,125.57,0],
['GE','조지아','트빌리시',41.72,44.79,0],['AM','아르메니아','예레반',40.18,44.51,0],['AZ','아제르바이잔','바쿠',40.41,49.87,0],
['IL','이스라엘','텔아비브',32.09,34.78,1],['PS','팔레스타인','라말라',31.90,35.20,1],['IQ','이라크','바그다드',33.31,44.36,1],['IR','이란','테헤란',35.69,51.39,1],
['KW','쿠웨이트','쿠웨이트시티',29.37,47.98,1],['BH','바레인','마나마',26.23,50.59,1],['OM','오만','무스카트',23.59,58.41,1],['YE','예멘','사나',15.37,44.19,1],
['SY','시리아','다마스쿠스',33.51,36.28,1],['LB','레바논','베이루트',33.89,35.50,1],
['LU','룩셈부르크','룩셈부르크',49.61,6.13,2],['MC','모나코','모나코',43.74,7.42,2],['LI','리히텐슈타인','파두츠',47.14,9.52,2],['AD','안도라','안도라라베야',42.51,1.52,2],
['SM','산마리노','산마리노',43.94,12.45,2],['VA','바티칸','바티칸',41.90,12.45,2],['MT','몰타','발레타',35.90,14.51,2],['CY','키프로스','니코시아',35.19,33.38,2],
['SI','슬로베니아','류블랴나',46.06,14.51,2],['SK','슬로바키아','브라티슬라바',48.15,17.11,2],['RO','루마니아','부쿠레슈티',44.43,26.10,2],['BG','불가리아','소피아',42.70,23.32,2],
['RS','세르비아','베오그라드',44.79,20.45,2],['BA','보스니아 헤르체고비나','사라예보',43.86,18.41,2],['ME','몬테네그로','포드고리차',42.44,19.26,2],['MK','북마케도니아','스코페',41.99,21.43,2],
['AL','알바니아','티라나',41.33,19.82,2],['MD','몰도바','키시너우',47.01,28.86,2],['UA','우크라이나','키이우',50.45,30.52,2],['BY','벨라루스','민스크',53.90,27.56,2],
['LT','리투아니아','빌뉴스',54.69,25.28,2],['LV','라트비아','리가',56.95,24.11,2],['EE','에스토니아','탈린',59.44,24.75,2],
['DZ','알제리','알제',36.75,3.06,3],['TN','튀니지','튀니스',36.81,10.18,3],['LY','리비아','트리폴리',32.89,13.19,3],['SD','수단','하르툼',15.50,32.56,3],
['SS','남수단','주바',4.85,31.58,3],['ER','에리트레아','아스마라',15.32,38.93,3],['DJ','지부티','지부티',11.59,43.15,3],['SO','소말리아','모가디슈',2.05,45.32,3],
['UG','우간다','캄팔라',0.35,32.58,3],['RW','르완다','키갈리',-1.94,30.06,3],['BI','부룬디','기테가',-3.43,29.93,3],['CD','콩고민주공화국','킨샤사',-4.44,15.27,3],
['CG','콩고','브라자빌',-4.27,15.28,3],['GA','가봉','리브르빌',0.42,9.47,3],['GQ','적도기니','말라보',3.75,8.78,3],['CM','카메룬','야운데',3.85,11.50,3],
['CF','중앙아프리카공화국','방기',4.39,18.56,3],['TD','차드','은자메나',12.13,15.06,3],['NE','니제르','니아메',13.51,2.11,3],['ML','말리','바마코',12.64,-8.00,3],
['BF','부르키나파소','와가두구',12.37,-1.52,3],['MR','모리타니','누악쇼트',18.08,-15.98,3],['GM','감비아','반줄',13.45,-16.58,3],['GW','기니비사우','비사우',11.86,-15.60,3],
['GN','기니','코나크리',9.64,-13.58,3],['SL','시에라리온','프리타운',8.48,-13.23,3],['LR','라이베리아','몬로비아',6.30,-10.80,3],['CI','코트디부아르','야무수크로',6.83,-5.29,3],
['TG','토고','로메',6.13,1.22,3],['BJ','베냉','포르토노보',6.50,2.60,3],['CV','카보베르데','프라이아',14.93,-23.51,3],['ST','상투메 프린시페','상투메',0.34,6.73,3],
['AO','앙골라','루안다',-8.84,13.23,3],['ZM','잠비아','루사카',-15.39,28.32,3],['ZW','짐바브웨','하라레',-17.83,31.05,3],['MW','말라위','릴롱궤',-13.96,33.79,3],
['MZ','모잠비크','마푸투',-25.97,32.57,3],['BW','보츠와나','가보로네',-24.63,25.92,3],['NA','나미비아','빈트후크',-22.56,17.08,3],['SZ','에스와티니','음바바네',-26.31,31.14,3],
['LS','레소토','마세루',-29.31,27.48,3],['MU','모리셔스','포트루이스',-20.16,57.50,3],['SC','세이셸','빅토리아',-4.62,55.45,3],['KM','코모로','모로니',-11.70,43.26,3],
['GT','과테말라','과테말라시티',14.63,-90.51,4],['BZ','벨리즈','벨모판',17.25,-88.77,4],['HN','온두라스','테구시갈파',14.07,-87.19,4],['SV','엘살바도르','산살바도르',13.69,-89.22,4],
['NI','니카라과','마나과',12.11,-86.24,4],['CR','코스타리카','산호세',9.93,-84.09,4],['PA','파나마','파나마시티',8.98,-79.52,4],['JM','자메이카','킹스턴',17.97,-76.79,4],
['HT','아이티','포르토프랭스',18.59,-72.31,4],['DO','도미니카공화국','산토도밍고',18.49,-69.93,4],['BS','바하마','나소',25.05,-77.36,4],['BB','바베이도스','브리지타운',13.10,-59.61,4],
['TT','트리니다드 토바고','포트오브스페인',10.66,-61.51,4],['DM','도미니카','로조',15.30,-61.39,4],['LC','세인트루시아','캐스트리스',14.01,-60.99,4],
['VC','세인트빈센트 그레나딘','킹스타운',13.16,-61.23,4],['GD','그레나다','세인트조지스',12.06,-61.75,4],['AG','앤티가 바부다','세인트존스',17.12,-61.85,4],['KN','세인트키츠 네비스','바스테르',17.30,-62.72,4],
['VE','베네수엘라','카라카스',10.48,-66.90,5],['EC','에콰도르','키토',-0.18,-78.47,5],['BO','볼리비아','라파스',-16.50,-68.15,5],['PY','파라과이','아순시온',-25.26,-57.58,5],
['UY','우루과이','몬테비데오',-34.90,-56.16,5],['GY','가이아나','조지타운',6.80,-58.16,5],['SR','수리남','파라마리보',5.85,-55.20,5],
['PG','파푸아뉴기니','포트모르즈비',-9.44,147.18,6],['SB','솔로몬 제도','호니아라',-9.43,159.95,6],['VU','바누아투','포트빌라',-17.73,168.32,6],['WS','사모아','아피아',-13.83,-171.76,6],
['TO','통가','누쿠알로파',-21.14,-175.20,6],['KI','키리바시','타라와',1.33,172.98,6],['TV','투발루','푸나푸티',-8.52,179.20,6],['NR','나우루','야렌',-0.55,166.92,6],
['MH','마셜 제도','마주로',7.09,171.38,6],['FM','미크로네시아','팔리키르',6.92,158.16,6],['PW','팔라우','응게룰무드',7.50,134.62,6],
];
const NAT=Object.fromEntries(NATIONS.map(n=>[n[0],n]));
const flag=c=>/^X/.test(c)?'<span class="emo">🧭</span>':`<span class="emo">${String.fromCodePoint(...[...c].map(ch=>0x1F1E6+ch.charCodeAt(0)-65))}</span>`; // 윈도우도 국기가 보이도록 컬러 이모지 글꼴 사용
const kmBetween=(a,b)=>{const A=NAT[a],B=NAT[b],r=Math.PI/180,dl=(B[3]-A[3])*r,dg=(B[4]-A[4])*r;
  const h=Math.sin(dl/2)**2+Math.cos(A[3]*r)*Math.cos(B[3]*r)*Math.sin(dg/2)**2;return 2*6371*Math.asin(Math.sqrt(h))};
const flightMin=(a,b)=>Math.max(30,Math.round(kmBetween(a,b)/800*60)); // 평균 800km/h, 최소 30분
const MILE_MS=6*6e4; // 공부 6분 = 1 마일리지
const TRAVEL_TEST=false; // 테스트용 버튼 표시. 출시 전 false로
function tr(){const T=S.travel||(S.travel={on:true,at:'KR',to:null,used:0,km:0,stamps:[],news:[]});if(!T.ver){T.on=true;T.ver=2}return T} // 여행 탭은 기본으로 켜짐
function totalMiles(){const pd=perDay(true);let m=0;for(const k in pd)m+=Math.min(pd[k].study,8*36e5)/MILE_MS;return m+bonusList(pd).reduce((a,b)=>a+b.m,0)}
/* 보너스 마일리지: 하루 8시간 +50 · 7일 연속 +100 · 30일 연속 +1000 (공부 기록으로 계산) */
function bonusList(pd){pd=pd||perDay(true);const out=[],days=Object.keys(pd).filter(k=>pd[k].study>=6e4).sort();
  Object.keys(pd).sort().forEach(k=>{if(pd[k].study>=8*36e5)out.push({k:'d8:'+k,m:50,t:'하루 8시간 공부',d:k})});
  let run=[];const flush=()=>{if(!run.length)return;const s0=run[0];for(let i=7;i<=run.length;i+=7)out.push({k:`w7:${s0}:${i}`,m:100,t:`${i}일 연속 공부`,d:run[i-1]});for(let i=30;i<=run.length;i+=30)out.push({k:`m30:${s0}:${i}`,m:1000,t:`${i}일 연속 공부`,d:run[i-1]});run=[]};
  days.forEach(k=>{if(run.length&&dk(addD(pk(run[run.length-1]),1))!==k)flush();run.push(k)});flush();
  for(const g of S.gifts||[])if(g&&g.id&&Number.isFinite(g.m))out.push({k:'g:'+g.id,m:g.m,t:g.t||'선물',d:g.d}); // 친구 초대·주간 챌린지 보상
  return out}
function curStreak(){const pd=perDay(true);let d=today0(),n=0;if(!(pd[dk(d)]&&pd[dk(d)].study>=6e4))d=addD(d,-1);while(pd[dk(d)]&&pd[dk(d)].study>=6e4){n++;d=addD(d,-1)}return n}
const studyFor=miles=>fmtH(Math.max(0,miles)*MILE_MS);
function checkArrival(){return checkEarth()||checkSpace()||checkKorea()}
function checkEarth(){
  if(globalThis.TourdyNative&&!globalThis.TourdyNative.transactionComputing)return durableArrival(checkEarth,()=>{const T=tr();return !!(T.on&&T.to&&!T.hold&&totalMiles()-T.used>=wTC(T))});
  const T=tr();if(!T.on||!T.to||T.hold)return false;const cost=wTC(T);
  if(totalMiles()-T.used<cost)return false;
  const ev={w:'w',f:T.at,t:T.to,gold:goldLeg('w',T.at,T.to),cls:T.cls||0};T.used+=cost;const km=kmBetween(T.at,T.to);T.km+=km;if(km>=5000)T.long=true;if(SECWM[T.to]){T.sec=T.sec||[];if(!secVisited(T.sec,T.to))T.sec.push({c:T.to,d:dk(today0())})}else{const tv=T.cls||0,ex=T.stamps.find(s=>s.c===T.to);if(ex){if(tv>(ex.tier||0))ex.tier=tv}else T.stamps.push({c:T.to,d:dk(today0()),tier:tv})}
  (T.log=T.log||[]).push({f:T.at,t:T.to,d:dk(today0()),m:cost,cls:T.cls||0});
  (T.news=T.news||[]).push(T.to);T.at=T.to;T.to=null;postArrive(ev);save();arrQ(ev);return true;
}
let tvCont=-1,tvQuery='',tvPick=false,tvArm=false;
function badges(T){
  const got=new Set(T.stamps.map(s=>NAT[s.c]?.[5]));const out=CONT.map((c,i)=>[`${c} 첫 도착`,got.has(i)]);
  out.push(['장거리 비행 (5,000km 이상)',!!T.long]);out.push(['지구 한 바퀴 (40,075km)',T.km>=40075]);out.push(['스탬프 10개',T.stamps.length>=10]);out.push(['스탬프 30개',T.stamps.length>=30]);return out;
}
const IATA={KR:'ICN',JP:'HND',CN:'PEK',TW:'TPE',MN:'UBN',VN:'HAN',TH:'BKK',PH:'MNL',MY:'KUL',SG:'SIN',ID:'CGK',KH:'PNH',LA:'VTE',IN:'DEL',NP:'KTM',LK:'CMB',UZ:'TAS',KZ:'NQZ',
MM:'NYT',BD:'DAC',BT:'PBH',MV:'MLE',PK:'ISB',AF:'KBL',TJ:'DYU',KG:'FRU',TM:'ASB',BN:'BWN',TL:'DIL',GE:'TBS',AM:'EVN',AZ:'GYD',
AE:'AUH',QA:'DOH',SA:'RUH',JO:'AMM',TR:'ESB',IL:'TLV',IQ:'BGW',IR:'IKA',KW:'KWI',BH:'BAH',OM:'MCT',YE:'SAH',SY:'DAM',LB:'BEY',
GB:'LHR',FR:'CDG',DE:'BER',IT:'FCO',ES:'MAD',PT:'LIS',NL:'AMS',BE:'BRU',CH:'BRN',AT:'VIE',CZ:'PRG',PL:'WAW',HU:'BUD',HR:'ZAG',GR:'ATH',IE:'DUB',DK:'CPH',NO:'OSL',SE:'ARN',FI:'HEL',IS:'KEF',RU:'SVO',
LU:'LUX',MC:'MCM',AD:'LEU',SM:'RMI',MT:'MLA',CY:'LCA',SI:'LJU',SK:'BTS',RO:'OTP',BG:'SOF',RS:'BEG',BA:'SJJ',ME:'TGD',MK:'SKP',AL:'TIA',MD:'RMO',UA:'KBP',BY:'MSQ',LT:'VNO',LV:'RIX',EE:'TLL',
EG:'CAI',MA:'RBA',KE:'NBO',TZ:'DOD',ET:'ADD',NG:'ABV',GH:'ACC',SN:'DSS',ZA:'JNB',MG:'TNR',DZ:'ALG',TN:'TUN',LY:'MJI',SD:'KRT',SS:'JUB',ER:'ASM',DJ:'JIB',SO:'MGQ',UG:'EBB',RW:'KGL',BI:'BJM',
CD:'FIH',CG:'BZV',GA:'LBV',GQ:'SSG',CM:'NSI',CF:'BGF',TD:'NDJ',NE:'NIM',ML:'BKO',BF:'OUA',MR:'NKC',GM:'BJL',GW:'OXB',GN:'CKY',SL:'FNA',LR:'ROB',CI:'ASK',TG:'LFW',BJ:'COO',CV:'RAI',ST:'TMS',
AO:'LAD',ZM:'LUN',ZW:'HRE',MW:'LLW',MZ:'MPM',BW:'GBE',NA:'WDH',SZ:'SHO',LS:'MSU',MU:'MRU',SC:'SEZ',KM:'HAH',
US:'IAD',CA:'YOW',MX:'MEX',CU:'HAV',GT:'GUA',BZ:'BZE',HN:'TGU',SV:'SAL',NI:'MGA',CR:'SJO',PA:'PTY',JM:'KIN',HT:'PAP',DO:'SDQ',BS:'NAS',BB:'BGI',TT:'POS',DM:'DOM',LC:'SLU',VC:'SVD',GD:'GND',AG:'ANU',KN:'SKB',
BR:'BSB',AR:'EZE',CL:'SCL',PE:'LIM',CO:'BOG',VE:'CCS',EC:'UIO',BO:'LPB',PY:'ASU',UY:'MVD',GY:'GEO',SR:'PBM',
AU:'CBR',NZ:'WLG',FJ:'SUV',PG:'POM',SB:'HIR',VU:'VLI',WS:'APW',TO:'TBU',KI:'TRW',TV:'FUN',NR:'INU',MH:'MAJ',FM:'PNI',PW:'ROR'};
const ap=c=>IATA[c]||c; // 공항이 없는 곳(바티칸 등)은 나라 코드
const flightNo=(a,b)=>'SA '+String([...(a+b)].reduce((h,ch)=>(h*31+ch.charCodeAt(0))%9000,7)+100).padStart(4,'0');
const PLANE='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" transform="rotate(90 12 12)"/></svg>';
const LAND='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21h20"/><path d="M3.8 13.5 5 9l2.2.6 1.1 3.3 4.9 1.3L11 5.3l2.6.7 4.6 9.3 3 .8c.9.3 1.5 1.2 1.2 2.1-.2.6-.9 1-1.6.8L4.6 14.6z"/></svg>';
const ISL=new Set('IS IE MT CY JP TW PH ID LK MV TL MG MU SC KM CV ST CU JM HT DO BS BB TT DM LC VC GD AG KN AU NZ FJ PG SB VU WS TO KI TV NR MH FM PW BH SG BN GB'.split(' '));
// 크루즈: 카리브·태평양·인도양의 작은 섬나라끼리(2,500km 이내)만. 일본·대만·필리핀처럼 큰 나라는 비행기
const CRUISEOK=new Set('MV MU SC KM CV ST CU JM HT DO BS BB TT DM LC VC GD AG KN FJ PG SB VU WS TO KI TV NR MH FM PW'.split(' '));
// 국가 간 이동은 기본 비행기 (한국↔일본, 한국↔중국, 일본↔중국 포함)
// 예외: 유럽 안 육로 이웃(1,300km 이내) = 야간열차 / 작은 섬나라끼리 = 크루즈
// 비밀 목적지: 남극=크루즈, 갈라파고스=에콰도르에서 배, 이스터섬=칠레에서 배, 마추픽추=페루에서 기차, 스발바르·사하라=비행기
const SEC_WMODE={AQ:(o,km)=>km<=4000?'cruise':'air',XM:o=>o==='PE'?'ntrain':'air',XG:o=>o==='EC'?'cruise':'air',XE:o=>o==='CL'?'cruise':'air',SJ:()=>'air',XS:()=>'air'};
function wMode(a,b){const A=NAT[a],B=NAT[b];if(!A||!B)return 'air';const km=kmBetween(a,b);if(SEC_WMODE[b])return SEC_WMODE[b](a,km);if(SEC_WMODE[a])return SEC_WMODE[a](b,km);
  if(CRUISEOK.has(a)&&CRUISEOK.has(b)&&km<=2500)return 'cruise';
  if(A[5]===2&&B[5]===2&&km<=1300&&!ISL.has(a)&&!ISL.has(b))return 'ntrain';return 'air'}
const WCOL={air:'#1d6fd8',ntrain:'#3b4fd8',cruise:'#0b9aa5'};
const wIcon=m=>m==='ntrain'?TRAIN:m==='cruise'?SHIP:PLANE;
const WTZ={"KR":"Asia/Seoul","JP":"Asia/Tokyo","CN":"Asia/Shanghai","TW":"Asia/Taipei","MN":"Asia/Ulaanbaatar","VN":"Asia/Ho_Chi_Minh","TH":"Asia/Bangkok","PH":"Asia/Manila","MY":"Asia/Kuala_Lumpur","SG":"Asia/Singapore","ID":"Asia/Jakarta","KH":"Asia/Phnom_Penh","LA":"Asia/Vientiane","IN":"Asia/Kolkata","NP":"Asia/Kathmandu","LK":"Asia/Colombo","UZ":"Asia/Tashkent","KZ":"Asia/Qostanay","AE":"Asia/Dubai","QA":"Asia/Qatar","SA":"Asia/Riyadh","JO":"Asia/Amman","TR":"Europe/Istanbul","GB":"Europe/London","FR":"Europe/Paris","DE":"Europe/Berlin","IT":"Europe/Rome","ES":"Europe/Madrid","PT":"Europe/Lisbon","NL":"Europe/Amsterdam","BE":"Europe/Brussels","CH":"Europe/Zurich","AT":"Europe/Vienna","CZ":"Europe/Prague","PL":"Europe/Warsaw","HU":"Europe/Budapest","HR":"Europe/Zagreb","GR":"Europe/Athens","IE":"Europe/Dublin","DK":"Europe/Copenhagen","NO":"Europe/Oslo","SE":"Europe/Stockholm","FI":"Europe/Helsinki","IS":"Atlantic/Reykjavik","RU":"Europe/Moscow","EG":"Africa/Cairo","MA":"Africa/Casablanca","KE":"Africa/Nairobi","TZ":"Africa/Dar_es_Salaam","ET":"Africa/Addis_Ababa","NG":"Africa/Lagos","GH":"Africa/Accra","SN":"Africa/Dakar","ZA":"Africa/Johannesburg","MG":"Indian/Antananarivo","US":"America/New_York","CA":"America/Toronto","MX":"America/Mexico_City","CU":"America/Havana","BR":"America/Sao_Paulo","AR":"America/Argentina/Buenos_Aires","CL":"America/Santiago","PE":"America/Lima","CO":"America/Bogota","AU":"Australia/Sydney","NZ":"Pacific/Auckland","FJ":"Pacific/Fiji","MM":"Asia/Yangon","BD":"Asia/Dhaka","BT":"Asia/Thimphu","MV":"Indian/Maldives","PK":"Asia/Karachi","AF":"Asia/Kabul","TJ":"Asia/Dushanbe","KG":"Asia/Bishkek","TM":"Asia/Ashgabat","BN":"Asia/Brunei","TL":"Asia/Dili","GE":"Asia/Tbilisi","AM":"Asia/Yerevan","AZ":"Asia/Baku","IL":"Asia/Jerusalem","PS":"Asia/Hebron","IQ":"Asia/Baghdad","IR":"Asia/Tehran","KW":"Asia/Kuwait","BH":"Asia/Bahrain","OM":"Asia/Muscat","YE":"Asia/Aden","SY":"Asia/Damascus","LB":"Asia/Beirut","LU":"Europe/Luxembourg","MC":"Europe/Monaco","LI":"Europe/Vaduz","AD":"Europe/Andorra","SM":"Europe/San_Marino","VA":"Europe/Vatican","MT":"Europe/Malta","CY":"Asia/Nicosia","SI":"Europe/Ljubljana","SK":"Europe/Bratislava","RO":"Europe/Bucharest","BG":"Europe/Sofia","RS":"Europe/Belgrade","BA":"Europe/Sarajevo","ME":"Europe/Podgorica","MK":"Europe/Skopje","AL":"Europe/Tirane","MD":"Europe/Chisinau","UA":"Europe/Kyiv","BY":"Europe/Minsk","LT":"Europe/Vilnius","LV":"Europe/Riga","EE":"Europe/Tallinn","DZ":"Africa/Algiers","TN":"Africa/Tunis","LY":"Africa/Tripoli","SD":"Africa/Khartoum","SS":"Africa/Juba","ER":"Africa/Asmara","DJ":"Africa/Djibouti","SO":"Africa/Mogadishu","UG":"Africa/Kampala","RW":"Africa/Kigali","BI":"Africa/Bujumbura","CD":"Africa/Kinshasa","CG":"Africa/Brazzaville","GA":"Africa/Libreville","GQ":"Africa/Malabo","CM":"Africa/Douala","CF":"Africa/Bangui","TD":"Africa/Ndjamena","NE":"Africa/Niamey","ML":"Africa/Bamako","BF":"Africa/Ouagadougou","MR":"Africa/Nouakchott","GM":"Africa/Banjul","GW":"Africa/Bissau","GN":"Africa/Conakry","SL":"Africa/Freetown","LR":"Africa/Monrovia","CI":"Africa/Abidjan","TG":"Africa/Lome","BJ":"Africa/Porto-Novo","CV":"Atlantic/Cape_Verde","ST":"Africa/Sao_Tome","AO":"Africa/Luanda","ZM":"Africa/Lusaka","ZW":"Africa/Harare","MW":"Africa/Blantyre","MZ":"Africa/Maputo","BW":"Africa/Gaborone","NA":"Africa/Windhoek","SZ":"Africa/Mbabane","LS":"Africa/Maseru","MU":"Indian/Mauritius","SC":"Indian/Mahe","KM":"Indian/Comoro","GT":"America/Guatemala","BZ":"America/Belize","HN":"America/Tegucigalpa","SV":"America/El_Salvador","NI":"America/Managua","CR":"America/Costa_Rica","PA":"America/Panama","JM":"America/Jamaica","HT":"America/Port-au-Prince","DO":"America/Santo_Domingo","BS":"America/Nassau","BB":"America/Barbados","TT":"America/Port_of_Spain","DM":"America/Dominica","LC":"America/St_Lucia","VC":"America/St_Vincent","GD":"America/Grenada","AG":"America/Antigua","KN":"America/St_Kitts","VE":"America/Caracas","EC":"America/Guayaquil","BO":"America/La_Paz","PY":"America/Asuncion","UY":"America/Montevideo","GY":"America/Guyana","SR":"America/Paramaribo","PG":"Pacific/Port_Moresby","SB":"Pacific/Guadalcanal","VU":"Pacific/Efate","WS":"Pacific/Apia","TO":"Pacific/Tongatapu","KI":"Pacific/Tarawa","TV":"Pacific/Funafuti","NR":"Pacific/Nauru","MH":"Pacific/Majuro","FM":"Pacific/Pohnpei","PW":"Pacific/Palau"};
function localInfo(c,d){const n=NAT[c];if(!n)return '';const dt=d||new Date();let tm='';
  if(!d&&WTZ[c])try{tm=new Intl.DateTimeFormat('ko-KR',{timeZone:WTZ[c],hour:'2-digit',minute:'2-digit',hour12:false}).format(dt)+' · '}catch(e){}
  const mo=dt.getMonth(),la=n[3],nh=la>=0,ss=Math.abs(la)<23.5?'열대':['겨울','겨울','봄','봄','봄','여름','여름','여름','가을','가을','가을','겨울'][nh?mo:(mo+6)%12];
  return (tm?'현지 '+tm:'')+ss}
const INK=['#c23b3b','#9a6400','#2f55c4','#b0561a','#14806f','#7a3fb0','#0d7fa8'],SHAPE=['10px','50%','4px','40% / 50%','18px','50% / 40%','2px'];
function bpTicket(f,t,p,left,cost,done,o={}){const A=NAT[f],B=NAT[t],km=kmBetween(f,t),hs=[...(f+t)].reduce((a,ch)=>(a*31+ch.charCodeAt(0))%99991,11),days=Math.ceil(Math.max(0,left)/80),dt=o.d?pk(o.d):new Date();
  const m=wMode(f,t),PL=wIcon(m),ci=o.cls||0,cls=WCLS[m][ci],fl=flightNo(f,t).replace('SA',m==='ntrain'?'NT':m==='cruise'?'SC':'SA'),date=`${dt.getFullYear()}.${pad(dt.getMonth()+1)}.${pad(dt.getDate())}`;
  const seat=m==='cruise'?(hs%9+2)+String(hs%40+10).padStart(2,'0')+'호':m==='ntrain'?(hs%12+1)+'호차 '+(hs%40+1)+'번':(hs%38+3)+'ABCDEF'[hs%6],gate=m==='air'?String.fromCharCode(65+hs%6)+(hs%40+1):(hs%12+1)+'번';
  const lbl=m==='ntrain'?'SLEEPER TRAIN · 야간열차':m==='cruise'?'CRUISE · 크루즈 승선권':'BOARDING PASS · 탑승권',arrived=m==='air'?'착륙':'도착';
  const info=[[m==='air'?'편명':m==='ntrain'?'열차':'선박',fl],[m==='cruise'?'객실':'좌석',seat],[m==='air'?'게이트':m==='ntrain'?'승강장':'부두',gate],['등급',cls],['거리',Math.round(km).toLocaleString()+'km'],[m==='air'?'비행 시간':'이동 시간',fmtH(cost*6e4)],['진행',Math.floor(p*100)+'%'],['도착까지',done?arrived:left>0?(days<=1?'오늘~내일':days+'일'):'곧 '+arrived]];
  const viaTxt=o.final&&NAT[o.final]?`<span class="bx-via">경유 → 최종 ${ap(o.final)}</span>`:'';
  return `<div class="bx tx bx-${m} bx-c${ci}${o.gold?' gold':''}${o.torn?' torn':''}${SECWM[t]?' secret-ticket':''}">
    <div class="bx-main tx-main">
      <div class="bx-hd"><span class="bx-date">${date}${o.free?' · 첫 여행 선물':SECWM[t]?' · ✦ 비밀 목적지':o.gold?' · 특별 루트':''}</span><span class="bx-bp">${lbl}${PL}</span></div><div class="tx-bg" aria-hidden="true">${worldArt(t)}</div>
      <div class="bx-body">
        <div class="bx-route"><div><small>FROM</small><b>${ap(f)}</b><em>${A[2]}</em><span>${flag(f)} ${A[1]}</span></div>
          <div class="bx-mid"><div class="bx-line"><i style="width:${p*100}%"></i></div><span class="bx-pl" style="left:calc(${p} * (100% - 40px) + 20px)">${PL}</span></div>
          <div class="r"><small>TO</small><b>${ap(t)}</b><em>${B[2]}</em><span>${B[1]} ${flag(t)}</span><span class="bx-loc">${localInfo(t,o.torn||done?dt:null)}</span></div></div>${viaTxt}
        <div class="bx-info">${info.map(([k,v])=>`<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>
      </div>
    </div>
    <div class="bx-stub tx-stub"><div class="bx-code" aria-hidden="true"></div>
      <div class="bx-sum"><div class="bx-sh"><span>${m==='air'?'BOARDING PASS':m==='ntrain'?'SLEEPER TRAIN':'CRUISE'}</span>${PL}</div>
        <div class="bx-sr"><b>${ap(f)}</b>${PL}<b>${ap(t)}</b></div>
        <div class="bx-kv"><div><small>${info[0][0]}</small><b>${fl}</b></div><div><small>${info[1][0]}</small><b>${seat}</b></div></div>
        ${done?`<div class="bx-big"><small>${o.free?'무료 티켓 · ':''}${arrived} 완료</small><b>${B[2]}</b></div>`:`<div class="bx-big"><small>남은 마일리지</small><b>${Math.max(0,Math.ceil(left))}</b><small>공부 ${studyFor(left)}</small></div>`}
      </div></div>
  </div>`}
function renderTravelTop(){
  const T=tr(),total=totalMiles(),avail=total-T.used,at=NAT[T.at];
  let news='';if(T.news&&T.news.length){news=`<div class="tv-news">${LAND.replace('<svg','<svg width="20" height="20"')} ${T.news.map(c=>`${ap(c)} ${flag(c)} ${NAT[c][2]}`).join(', ')} 착륙! 여권에 입국 도장이 찍혔어요.</div>`;T.news=[];save()}
  $('tvNow').innerHTML=`${news}<div class="sign"><div class="sign-l">${LAND}<b>${ap(T.at)}</b></div><div class="sign-r"><small>현재 공항 · NOW AT</small><span>${flag(T.at)} ${at[2]}, ${at[1]}</span></div></div>
    ${TRAVEL_TEST&&!T.to?`<div class="tv-test"><span>테스트</span><button data-add="100">+100 마일리지</button><button data-add="1000">+1000</button><button id="tvReset">여행 초기화</button></div>`:''}
    <div class="tv-stats"><div><b>${Math.floor(avail)}</b><span>보유 마일리지</span></div><div><b>${T.stamps.length}<small>/${NATIONS.length-1}</small></b><span>입국 도장</span></div><div><b>${Math.round(T.km).toLocaleString()}</b><span>누적 비행 km</span></div></div>`;
  if(T.to){const to=NAT[T.to],cost=wTC(T),p=Math.min(1,Math.max(0,avail/cost)),left=cost-avail,days=Math.ceil(Math.max(0,left)/80);
    if(!busyIn('tvFlight'))$('tvFlight').innerHTML=`${bpTicket(T.at,T.to,T.hold?0:p,left,cost,false,{cls:T.cls,final:T.final,gold:goldLeg('w',T.at,T.to)})}${T.hold?`<button class="primary ck-btn" data-ckopen="w">${wMode(T.at,T.to)==='cruise'?'승선':'탑승'} 수속하고 출발하기</button>`:''}${goalBox('w',T,left)}
    ${TRAVEL_TEST?`<div class="tv-test"><span>테스트</span><button id="tvSkip">바로 도착</button><button data-add="10">+10</button><button data-add="100">+100</button></div>`:''}
    <div class="bp-acts"><button class="secondary" id="tvChange">${tvPick?'안내판 닫기':'목적지 바꾸기'}</button><button class="secondary${tvArm?' del arm':''}" id="tvCancel">${tvArm?'정말 취소':'비행 취소'}</button></div>`;
    $('tvFlight').hidden=false}else $('tvFlight').hidden=true;
  $('tvPicker').hidden=!!T.to&&!tvPick;$('fidsFrom').textContent=`출발 ${ap(T.at)} · 가까운 순`;
  if(T.world==='earth'&&worldOpen(T)){renderWorldMap();renderRoutes('w')}
  if(typeof seasonFx==='function'){seasonFx();windowFx()}
}
function renderTravelPicker(){
  const T=tr(),avail=totalMiles()-T.used,q=tvQuery.trim();
  $('tvConts').innerHTML=['전체',...CONT].map((c,i)=>`<button data-cont="${i-1}" aria-pressed="${tvCont===i-1}">${c}</button>`).join('');
  const secGateW=c=>SECW.some(x=>x[6].split(' ').includes(c)&&!secVisited(T.sec,x[0])),rows=NATIONS.filter(n=>n[0]!==T.at&&(T.to===n[0]||!T.stamps.some(s=>s.c===n[0])||secGateW(n[0]))&&(tvCont<0||n[5]===tvCont)&&(!q||n[1].includes(q)||n[2].includes(q)||ap(n[0]).includes(q.toUpperCase())))
    .map(n=>[n,flightMin(T.at,n[0])]).sort((a,b)=>a[1]-b[1]);
  const secs=SECW.filter(x=>secOpenW(T,x)&&!secVisited(T.sec,x[0])&&x[0]!==T.at).map(x=>{const c=flightMin(T.at,x[0]),ok=avail>=c,cur=T.to===x[0];
    return `<li><button class="fr secret${cur?' cur':''}" data-dest="${x[0]}"><span class="fd">${flag(x[0])}<span><b>✦ ${x[2]}</b><small>비밀 목적지 · ${x[1]}</small></span></span><span class="code">${ap(x[0])}</span><span class="mi">${c}</span>${cur?'<span class="st on">탑승 중</span>':ok?'<span class="st ok">탑승 가능</span>':`<span class="st wait">${studyFor(c-avail)}</span>`}</button></li>`}).join('');
  $('tvList').innerHTML=secs+rows.map(([n,c])=>{const st=T.stamps.some(s=>s.c===n[0]),cur=T.to===n[0],ok=avail>=c;
    const status=cur?'<span class="st on">탑승 중</span>':st?'<span class="st done">입국 ✓</span>':ok?'<span class="st ok">탑승 가능</span>':`<span class="st wait">${studyFor(c-avail)}</span>`;
    return `<li><button class="fr${cur?' cur':''}" data-dest="${n[0]}"><span class="fd">${flag(n[0])}<span><b>${n[2]}</b><small>${n[1]}${st&&secGateW(n[0])?' · ✦ 비밀 목적지 입구':''}</small></span></span>
      <span class="code">${ap(n[0])}</span><span class="mi">${c}</span>${status}</button></li>`}).join('')||'<li class="empty">찾는 목적지가 없어요</li>';
}
function flightLog(T){ // 예전 기록(로그 없음)은 스탬프 순서로 경로를 복원
  if(T.log&&T.log.length>=T.stamps.length)return T.log;
  let f='KR';return T.stamps.map(s=>{const e={f,t:s.c,d:s.d,m:flightMin(f,s.c)};f=s.c;return e});
}
function renderPassport(){
  const T=tr(),sty=T.style||'stamp',h=s=>[...s].reduce((a,ch)=>a+ch.charCodeAt(0)*7,0),dd=k=>{const d=pk(k);return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}`};
  $('tvStyleLbl').textContent={stamp:'입국 도장',card:'수집 카드',pass:'탑승 기록'}[sty];
  const box=$('tvStamps');box.className='stamps sty-'+sty;
  if(!T.stamps.length){box.innerHTML='<p class="empty">아직 다녀온 나라가 없어요. 출발 안내판에서 첫 목적지를 골라 보세요.</p>';return}
  {box.className='stamps grouped';const SM=Object.fromEntries(T.stamps.map(s=>[s.c,s])),LL=flightLog(T),tc=t=>t===2?' gold':t===1?' silver':'';
    if(wOpenCont==null){const last=T.stamps[T.stamps.length-1];wOpenCont=last&&NAT[last.c]?NAT[last.c][5]:0}
    const up=sty==='pass'&&T.to?`<div class="tpass up"><div class="tp-m"><span class="tp-k">다음 이동 · 예정</span><div class="tp-r">${ap(T.at)} ${wIcon(wMode(T.at,T.to))} ${ap(T.to)}</div><small>${NAT[T.at][2]} → ${NAT[T.to][2]}</small></div><div class="tp-s"><small>마일리지</small><b>${wTC(T)}</b></div></div>`:'';
    box.innerHTML=up+CONT.map((cn,i)=>{const all=NATIONS.filter(n=>n[5]===i&&n[0]!=='KR'),got=all.filter(n=>SM[n[0]]),done=got.length===all.length,open=wOpenCont===i;
      let items='';
      if(open&&sty==='pass'){items=LL.map((e,k)=>[e,k]).filter(([e])=>NAT[e.t]&&NAT[e.t][5]===i&&NAT[e.f]).reverse().map(([e,k])=>{const A=NAT[e.f],B=NAT[e.t],wm=wMode(e.f,e.t);
          return `<div class="tpass${tc(e.cls||0)}" role="button" tabindex="0" data-wlog="${k}"><div class="tp-m"><span class="tp-k">${wm==='air'?'BOARDING PASS':wm==='ntrain'?'SLEEPER TRAIN':'CRUISE'} · ${flightNo(e.f,e.t)}</span><div class="tp-r">${ap(e.f)} ${wIcon(wm)} ${ap(e.t)}</div><small>${flag(e.f)} ${A[2]} → ${flag(e.t)} ${B[2]} · ${dd(e.d)}</small></div><div class="tp-s"><small>마일리지</small><b>${e.m}</b></div></div>`}).join('')||'<p class="empty">이 대륙으로 간 기록이 없어요</p>'}
      else if(open)items=all.map(n=>{const s=SM[n[0]];
        if(!s)return sty==='stamp'?`<span class="wslot" style="--sh:${SHAPE[i]}"><i>${n[1]}</i></span>`:`<span class="ccard wslot2"><b>${n[1]}</b><small>${n[2]}</small></span>`;
        return sty==='stamp'?`<button class="stamp${tc(s.tier)}" data-wtix="${n[0]}" aria-label="${n[1]} 탑승권 보기" style="--r:${(h(n[0])%15)-7}deg;--k:${INK[i]};--sh:${SHAPE[i]}"><span class="sa">ARRIVED</span><span class="sc">${ap(n[0])}</span><span class="sn">${flag(n[0])} ${n[1]}</span><span class="sd">${dd(s.d)}</span></button>`
          :`<button class="ccard${tc(s.tier)}" data-wtix="${n[0]}" aria-label="${n[1]} 탑승권 보기"><span class="cf">${flag(n[0])}</span><b>${n[1]}</b><small>${n[2]} · ${ap(n[0])}</small><span class="cd2">${dd(s.d)}</span></button>`}).join('');
      return `<div class="ks-reg${open?' open':''}${done?' done':''}" style="--k:${INK[i]}">
        <button class="ks-h" data-wcont="${i}" aria-expanded="${open}"><span class="ks-badge">${done?'완주':cn.slice(0,2)}</span><span class="ks-n"><b>${cn}</b><small>${got.length} / ${all.length}개국</small></span>
          <span class="ks-bar"><i style="width:${got.length/Math.max(1,all.length)*100}%"></i></span><svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 6 4 4 4-4"/></svg></button>
        ${open?`<div class="stamps sty-${sty} wgrid">${items}</div>`:''}</div>`}).join('')+wSecretStamps(T);return}
  if(sty==='stamp'){box.innerHTML=T.stamps.slice().reverse().map(s=>{const n=NAT[s.c];if(!n)return '';
    return `<div class="stamp" style="--r:${(h(s.c)%15)-7}deg;--k:${INK[n[5]]};--sh:${SHAPE[n[5]]}"><span class="sa">ARRIVED</span><span class="sc">${ap(s.c)}</span><span class="sn">${flag(s.c)} ${n[1]}</span><span class="sd">${dd(s.d)}</span></div>`}).join('');return}
  if(sty==='card'){const left=NATIONS.length-1-T.stamps.length;
    box.innerHTML=T.stamps.slice().reverse().map(s=>{const n=NAT[s.c];if(!n)return '';
      return `<div class="ccard"><span class="cf">${flag(s.c)}</span><b>${n[1]}</b><small>${n[2]} · ${ap(s.c)}</small><span class="cd2">${dd(s.d)} · ${CONT[n[5]]}</span></div>`}).join('')
      +(left>0?`<div class="ccard lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><b>${left}개국</b><small>아직 못 간 나라</small></div>`:'');return}
  const L=flightLog(T).slice().reverse(),up=T.to?`<div class="tpass up"><div class="tp-m"><span class="tp-k">다음 비행 · 예정</span><div class="tp-r">${ap(T.at)} ${PLANE} ${ap(T.to)}</div><small>${NAT[T.at][2]} → ${NAT[T.to][2]}</small></div><div class="tp-s"><small>마일리지</small><b>${flightMin(T.at,T.to)}</b></div></div>`:'';
  const LL=flightLog(T);box.innerHTML=up+L.map(e=>{const A=NAT[e.f],B=NAT[e.t];if(!A||!B)return '';
    return `<div class="tpass" role="button" tabindex="0" data-wlog="${LL.indexOf(e)}"><div class="tp-m"><span class="tp-k">BOARDING PASS · ${flightNo(e.f,e.t)}</span><div class="tp-r">${ap(e.f)} ${PLANE} ${ap(e.t)}</div><small>${flag(e.f)} ${A[2]} → ${flag(e.t)} ${B[2]} · ${dd(e.d)}</small></div><div class="tp-s"><small>마일리지</small><b>${e.m}</b></div></div>`}).join('');
}
let wOpenCont=null;
// 다녀온 세계 비밀 목적지: 여권 맨 아래 '비밀 목적지'에 따로 모은다 (대륙 진척도에는 넣지 않음)
function wSecretStamps(T){const got=SECW.filter(x=>secVisited(T.sec,x[0])),open=wOpenCont===99,dd=k=>{const d=pk(k);return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}`};
  return `<div class="ks-reg ks-secret${open?' open':''}${got.length===SECW.length?' done':''}" style="--k:#6b4fd8">
    <button class="ks-h" data-wcont="99" aria-expanded="${open}"><span class="ks-badge">✦</span><span class="ks-n"><b>비밀 목적지</b><small>${got.length} / ${SECW.length}곳</small></span>
      <span class="ks-bar"><i style="width:${got.length/SECW.length*100}%"></i></span><svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 6 4 4 4-4"/></svg></button>
    ${open?`<div class="stamps sty-stamp wgrid">${SECW.map((x,i)=>{const e=(T.sec||[]).find(d=>d.c===x[0]);if(!e)return `<div class="wslot" style="--sh:50%" title="${x[7]}"><i>???</i></div>`;
      return `<div class="stamp" style="--r:${(i*5)%11-5}deg;--k:#6b4fd8;--sh:50%"><span class="sa">SECRET</span><span class="sc">${x[8]}</span><span class="sn">${x[2]}</span><span class="sd">${dd(e.d)}</span></div>`}).join('')}</div>
      <p class="note ks-sec-note">비밀 목적지는 입구 나라에 있을 때만 출발 안내판에 나타나요.</p>`:''}
  </div>`}
function showWTicket(e){if(!e||!NAT[e.f]||!NAT[e.t])return;arrTimers.forEach(clearTimeout);arrOpen=true;const el=$('arrive');el.hidden=false;el.classList.add('show-msg');
  $('arrTk').innerHTML=bpTicket(e.f,e.t,1,0,e.m||flightMin(e.f,e.t),true,{torn:1,d:e.d,free:e.free,gold:goldHist('w',e.f,e.t),cls:(tr().stamps.find(x=>x.c===e.t)||{}).tier||e.cls||0});vibe();const tk=$('arrTk').firstElementChild;tk.classList.add('edge');if(innerWidth<=480)tk.classList.add('vert');
  $('arrMsg').innerHTML=`<span class="arr-flag">${flag(e.t)}</span><b>${NAT[e.t][2]}</b><span>${NAT[e.f][2]}에서 출발${e.d?' · '+ymd(pk(e.d))+' 도착':''}</span>`+postcard('w:'+e.t,worldArt(e.t),NAT[e.t][2],e.d?ymd(pk(e.d)):'');$('arrOk').textContent='닫기'}
$('tvStamps').addEventListener('click',e=>{const c=e.target.closest('[data-wcont]');if(c){const i=+c.dataset.wcont;wOpenCont=wOpenCont===i?-1:i;renderPassport();return}
  const T=tr(),w=e.target.closest('[data-wtix]');if(w){showWTicket(flightLog(T).find(x=>x.t===w.dataset.wtix));return}
  const l=e.target.closest('[data-wlog]');if(l)showWTicket(flightLog(T)[+l.dataset.wlog])});
$('tvStamps').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-wlog]')){e.preventDefault();e.target.click()}});
function renderTravel(){checkArrival();renderTravelTop();if(!$('tvPicker').hidden)renderTravelPicker();renderPassport();renderWorld()}
