/* Thirty cumulative minutes of timer study earn one destination ticket. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TourdyRewards = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const REQUIRED_MS = 30 * 60 * 1000;
  const eligible = session => session && session.kind === 'study' && !session.ex && !session.noMile && !session.manual && Number.isFinite(session.start) && Number.isFinite(session.end) && session.end >= session.start;
  function studyMs(state, now = Date.now(), includeRunning = true) {
    let total = (state.sessions || []).reduce((sum, session) => sum + (eligible(session) ? session.end - session.start : 0), 0);
    const run = state.running;
    if (includeRunning && run && run.kind === 'study' && Number.isFinite(run.start)) {
      total += Math.max(0, Math.min(now, run.end || now) - run.start);
    }
    return total;
  }
  function initialize(state) {
    if (state.firstTrip) return false;
    const ready = studyMs(state, Date.now(), false) >= REQUIRED_MS;
    state.firstTrip = { version: 1, status: ready ? 'ready' : 'pending', earnedAt: ready ? Date.now() : null };
    return true;
  }
  function earn(state, now = Date.now()) {
    initialize(state);
    if (state.firstTrip.status !== 'pending' || studyMs(state, now, false) < REQUIRED_MS) return false;
    state.firstTrip.status = 'ready';
    state.firstTrip.earnedAt = now;
    return true;
  }
  function redeem(state, destination, now = Date.now()) {
    if (!state.firstTrip || state.firstTrip.status !== 'ready') return false;
    state.firstTrip = { ...state.firstTrip, status: 'used', usedAt: now, destination: { ...destination } };
    return true;
  }
  return { initialize, earn, redeem, eligible, studyMs, REQUIRED_MS };
});
