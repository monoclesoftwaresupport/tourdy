/* Durable local state. This adapter does not provide cross-device synchronization. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TourdyStorage = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const finite = value => typeof value === 'number' && Number.isFinite(value);

  function validate(state) {
    if (!object(state) || !Array.isArray(state.subjects)) throw new Error('invalid-state');
    if (!state.subjects.every(s => object(s) && typeof s.id === 'string' && typeof s.name === 'string')) throw new Error('invalid-subjects');
    if (state.sessions != null && (!Array.isArray(state.sessions) || !state.sessions.every(s => object(s) && finite(s.start) && finite(s.end) && s.end >= s.start && (!s.kind || ['study', 'rest', 'waste'].includes(s.kind))))) throw new Error('invalid-sessions');
    if (state.running != null && (!object(state.running) || !finite(state.running.start) || (state.running.kind && !['study', 'rest', 'waste'].includes(state.running.kind)) || (state.running.end != null && (!finite(state.running.end) || state.running.end < state.running.start)))) throw new Error('invalid-running');
    for (const name of ['tasks', 'gen', 'retro', 'carryOff']) {
      if (state[name] != null && !object(state[name])) throw new Error('invalid-' + name);
    }
    if (state.tasks && !Object.values(state.tasks).every(list => Array.isArray(list) && list.every(object))) throw new Error('invalid-tasks');
    for (const name of ['repeats', 'books']) {
      if (state[name] != null && (!Array.isArray(state[name]) || !state[name].every(object))) throw new Error('invalid-' + name);
    }
    if (state.travel != null) {
      if (!object(state.travel)) throw new Error('invalid-travel');
      for (const name of ['stamps', 'news', 'log', 'arrLog']) {
        if (state.travel[name] != null && !Array.isArray(state.travel[name])) throw new Error('invalid-travel-' + name);
      }
      if (state.travel.stamps && !state.travel.stamps.every(s => object(s) && typeof s.c === 'string' && typeof s.d === 'string')) throw new Error('invalid-stamps');
      for (const name of ['kr', 'sp2']) {
        const travel = state.travel[name];
        if (travel == null) continue;
        if (!object(travel)) throw new Error('invalid-' + name);
        if (travel.done != null && (!Array.isArray(travel.done) || !travel.done.every(s => object(s) && typeof s.c === 'string' && typeof s.d === 'string'))) throw new Error('invalid-done');
        if (travel.path != null && (!Array.isArray(travel.path) || !travel.path.every(s => typeof s === 'string'))) throw new Error('invalid-path');
      }
    }
    if (state.firstTrip != null && (!object(state.firstTrip) || !['pending', 'ready', 'used'].includes(state.firstTrip.status))) throw new Error('invalid-first-trip');
    return state;
  }

  function create({ getStorage, key, legacyKey, normalize, seed, onStatus = () => {}, commitBatch }) {
    const previousKey = key + '.lastGood';
    const damagedKey = key + '.damaged';
    let expected;
    let loaded = false;
    let unreadable = false;
    let canRecover = false;
    let lastStatus = { type: 'ok' };
    const report = (type, detail) => { lastStatus = { type, detail }; onStatus(lastStatus); };
    const decode = raw => normalize(validate(JSON.parse(raw)));

    function read() {
      canRecover = false;
      let storage, primary;
      try { storage = getStorage(); primary = storage.getItem(key); }
      catch (error) {
        unreadable = true;
        report('unavailable', error.name);
        return seed();
      }
      loaded = true;
      expected = primary;
      if (primary !== null) {
        try { const state = decode(primary); report('ok'); return state; }
        catch (_) { /* Preserve the unreadable source before any future write. */ }
      }
      for (const candidate of [previousKey, legacyKey].filter(Boolean)) {
        try {
          const raw = storage.getItem(candidate);
          if (raw === null) continue;
          const state = decode(raw);
          unreadable = primary !== null;
          canRecover = true;
          report(primary !== null || candidate === previousKey ? 'recovered' : 'migrated');
          return state;
        } catch (_) { /* Another recovery candidate may still be valid. */ }
      }
      unreadable = primary !== null;
      report(unreadable ? 'damaged' : 'ok');
      return seed();
    }

    function write(state, { replace = false } = {}) {
      try {
        validate(state);
        const raw = JSON.stringify(state);
        // Validate the serialized form too: JSON turns NaN/Infinity into null.
        decode(raw);
        const storage = getStorage();
        const current = storage.getItem(key);
        if (!loaded) {
          // A failed read must never turn into an implicit overwrite on retry.
          report('unavailable');
          return false;
        }
        if (current !== expected && !replace) {
          report('conflict');
          return false;
        }
        if (unreadable && !replace && !canRecover) {
          report('damaged');
          return false;
        }
        if (current !== null && current !== raw) {
          let valid = false;
          try { decode(current); valid = true; } catch (_) {}
          // Save the previous good version, or retain damaged input verbatim.
          // If that fails (quota, privacy mode), do not overwrite the source.
          storage.setItem(valid ? previousKey : damagedKey, current);
        }
        if (current !== raw) storage.setItem(key, raw);
        expected = raw;
        unreadable = false;
        report('ok');
        return true;
      } catch (error) {
        report('failed', error.name);
        return false;
      }
    }

    let pending = Promise.resolve();
    function writeAsync(state, {replace = false} = {}) {
      let raw;
      try {validate(state);raw=JSON.stringify(state);decode(raw);}
      catch(error){report('failed',error.name);return Promise.resolve(false);}
      const perform = async () => {
        try {
          if (!loaded) {report('unavailable');return false;}
          const current=getStorage().getItem(key);
          if(current!==expected&&!replace){report('conflict');return false;}
          if(unreadable&&!replace&&!canRecover){report('damaged');return false;}
          // Conflict and recovery checks still run before skipping an identical write.
          if(current===raw&&!unreadable){expected=raw;report('ok');return true;}
          const changes={};
          if(current!==null&&current!==raw){
            let valid=false;try{decode(current);valid=true;}catch(_){}
            changes[valid?previousKey:damagedKey]=current;
          }
          changes[key]=raw;
          report('saving');
          await commitBatch(changes);
          expected=raw;unreadable=false;report('ok');
          return true;
        } catch(error){report(error.code==='CONFLICT'?'conflict':'failed',error.name);return false;}
      };
      const result=pending.then(perform);
      pending=result.then(()=>{},()=>{});
      return result;
    }
    return { read, write, ...(commitBatch ? {writeAsync,flush:()=>pending} : {}), validate, previousKey, damagedKey, status: () => lastStatus };
  }
  return { create, validate };
});
