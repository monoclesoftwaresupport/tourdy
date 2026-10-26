/* UI integration for a durable, single-use first-session ticket. */
document.querySelector('.tabs').insertAdjacentElement('afterend', $('firstTripNotice'));
document.body.appendChild($('storageNotice'));
document.body.appendChild($('firstTripDialog'));

function renderFirstTripNotice() {
  const ready = S.firstTrip && S.firstTrip.status === 'ready';
  const pending = S.firstTrip && S.firstTrip.status === 'pending';
  const el = $('firstTripNotice');
  el.hidden = !ready && !(pending && S.subjects.length && tab === 'home');
  const remaining = Math.ceil(Math.max(0,TourdyRewards.REQUIRED_MS-TourdyRewards.studyMs(S))/60000);
  const text = (selector, value) => { const node = el.querySelector(selector); if(node.textContent !== value)node.textContent = value; };
  text('h2',ready ? '어디든 떠나는 무료 티켓 1장' : remaining ? `첫 여행까지 공부 ${remaining}분` : '공부를 마치면 무료 티켓을 드려요');
  text('p',ready ? '누적 공부 30분 달성! 원하는 국내 도시로 최고급 티켓을 타고 즉시 도착해요. 마일리지는 그대로예요.' : '누적 공부 30분을 채우고 세션을 끝내면 무료 최고급 티켓을 드려요. 중간에 정지하거나 과목을 바꿔도 합산돼요.');
  $('firstTripOpen').hidden = !ready;
  text('small',ready ? '지금 쓰지 않아도 보관돼요. 공부를 마친 뒤 사용해 주세요.' : '휴식·딴짓·직접 추가한 시간은 보상에 포함되지 않아요.');
}

const canChooseFirstTripOrigin = K => !K.done.length && !K.path.length && !K.km;
function firstTripOrigins(reset = false) {
  const K = kr(tr());
  const select = $('firstTripOrigin'), current = K.at;
  const changeable = canChooseFirstTripOrigin(K);
  const chosen = reset ? current : select.value;
  const rows = changeable ? KR : [KRM[current]];
  select.innerHTML = rows.map(x => `<option value="${esc(x[0])}">${esc(x[1])}</option>`).join('');
  select.value = rows.some(x => x[0] === chosen) ? chosen : current;
  select.disabled = !changeable;
  $('firstTripOriginNote').textContent = changeable ? `기본 출발지는 ${KRM[K.at][1]}이에요. 원하면 첫 여행을 시작할 도시를 바꿀 수 있어요.` : '이미 시작한 여행은 현재 위치에서 출발해요.';
  firstTripOptions();
}

function firstTripOptions() {
  const query = $('firstTripSearch').value.trim().toLocaleLowerCase();
  const K = kr(tr());
  const from = $('firstTripOrigin').value || K.at;
  const selected = $('firstTripDestination').value;
  const rows = KR.filter(x => x[0] !== from && (!query || (x[1] + ' ' + x[2]).toLocaleLowerCase().includes(query)));
  $('firstTripDestination').innerHTML = rows.map(x => `<option value="${esc(x[0])}">${esc(x[1])} · ${esc(x[2])}</option>`).join('');
  if (rows.some(x => x[0] === selected)) $('firstTripDestination').value = selected;
  else if (rows.length) $('firstTripDestination').value = rows[0][0];
  firstTripPreview();
}

function firstTripPreview() {
  const id = $('firstTripDestination').value;
  $('firstTripGo').disabled = !id;
  $('firstTripError').hidden = true;
  if (!id) { $('firstTripPreview').textContent = '검색 결과가 없어요. 다른 이름으로 찾아보세요.'; return; }
  const T = tr(), K = kr(T);
  const from = $('firstTripOrigin').value || K.at;
  const mode = krMode(from, id);
  const classes = KCLS[mode];
  const active = K.to || T.to || sp(T).to || (T.routes && T.routes.act);
  const fromName = KRM[from][1];
  const toName = KRM[id][1];
  $('firstTripPreview').textContent = `${fromName} → ${toName} · ${classes[classes.length - 1]} · 금색 티켓 · 0 마일 · 즉시 도착${active ? '\n진행 중인 여행과 특별 루트는 취소하고 선택한 곳으로 떠나요.' : ''}`;
}

function openFirstTrip() {
  if (!S.firstTrip || S.firstTrip.status !== 'ready') return;
  if (S.running) return toast('공부를 마친 뒤 무료 티켓을 사용해 주세요');
  $('firstTripSearch').value = '';
  firstTripOrigins(true);
  $('firstTripDialog').showModal();
}

function claimFirstTrip(world, id, origin) {
  if(globalThis.TourdyNative?.transactionBusy)return false;
  if (!S.firstTrip || S.firstTrip.status !== 'ready' || S.running) return false;
  if (world !== 'kr' || !KRM[id] || !KR.some(x => x[0] === id)) return false;
  const next = JSON.parse(JSON.stringify(S));
  const T = next.travel, K = kr(T);
  const from = origin || K.at;
  if(!KR.some(x=>x[0]===from))return false;
  if(from !== K.at && !canChooseFirstTripOrigin(K))return false;
  if(canChooseFirstTripOrigin(K))K.home=K.at=from;
  if (from === id || !TourdyRewards.redeem(next, { world, id, from })) return false;
  const date = dk(today0());
  // Starting the gift trip replaces a pending route without changing earned miles.
  T.to = null; T.final = null; T.hold = false;
  K.to = null; K.final = null; K.hold = false;
  sp(T).to = null;
  if (T.routes) T.routes.act = null;
  T.on = true; T.world = 'korea';
  K.km += krKm(from, id);
  const stamp = K.done.find(x => x.c === id);
  if (stamp) stamp.tier = 2;
  else if (id !== K.home) K.done.push({ c: id, d: date, tier: 2, free: true });
  else K.homeTier = 2; // 출발지로 돌아온 경우: 방문 수는 그대로, 지도 금칠만
  K.path.push(id); K.at = id;
  const event = { w: 'kr', f: from, t: id, cls: 1, free: true };
  // Compute the usual arrival achievements in the candidate state, then commit
  // destination + consumed ticket together. A failed write consumes nothing.
  const previous = S;
  try { S = next; postArrive(event); }
  finally { S = previous; }
  const finish = ok => {
    if(!ok)return false;
    S = next;
    $('firstTripDialog').close();
    renderFirstTripNotice(); syncTravelTab(); setTab('travel');
    arrQ(event);
    return true;
  };
  const written=typeof writeCandidate==='function' ? writeCandidate(next) : stateStore.write(next);
  return written?.then ? written.then(finish) : finish(written);
}

$('firstTripOpen').onclick = openFirstTrip;
$('firstTripLater').onclick = () => $('firstTripDialog').close();
$('firstTripOrigin').onchange = firstTripOptions;
bindSearchInput($('firstTripSearch'),firstTripOptions);
$('firstTripDestination').onchange = firstTripPreview;
$('firstTripForm').onsubmit = async event => {
  event.preventDefault();
  if (!await claimFirstTrip('kr', $('firstTripDestination').value, $('firstTripOrigin').value)) {
    $('firstTripError').textContent = '저장 상태를 확인해 주세요. 티켓은 사용하지 않았어요. 공부 중이라면 먼저 마쳐 주세요.';
    $('firstTripError').hidden = false;
  }
};
