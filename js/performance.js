/* Reuse derived values only within one synchronous render, never across user edits. */
(function(){
  let scope=null;
  const events=[];
  const record=(type,data)=>{events.push({at:Date.now(),type,...data});if(events.length>80)events.shift();};
  const metrics={last:null,report:()=>({build:'2026-10-25-input-fix',events:events.slice(),last:metrics.last})};window.TourdyPerformance=metrics;
  let heartbeat=performance.now();
  document.addEventListener('visibilitychange',()=>{heartbeat=performance.now();});
  setInterval(()=>{const now=performance.now(),gap=now-heartbeat;heartbeat=now;if(!document.hidden&&gap>650)record('event-loop-delay',{ms:Math.round(gap-250)});},250);
  function invalidate(){if(scope){scope.days.clear();scope.miles=null;}}
  const rawPerDay=perDay,rawMiles=totalMiles;
  perDay=function(forMiles){
    if(!scope)return rawPerDay.apply(this,arguments);
    const key=!!forMiles;
    if(!scope.days.has(key)){scope.calculations++;scope.days.set(key,rawPerDay.apply(this,arguments));}
    return scope.days.get(key);
  };
  totalMiles=function(){
    if(!scope)return rawMiles.apply(this,arguments);
    if(scope.miles===null)scope.miles=rawMiles.apply(this,arguments);
    return scope.miles;
  };
  // Saves may occur inside an arrival render; don't retain pre-arrival values.
  for(const name of ['save','saveStoredSnapshot','writeCandidate']){
    const base=window[name];if(typeof base!=='function')continue;
    window[name]=function(){invalidate();return base.apply(this,arguments);};
  }
  for(const name of ['renderAll','renderTravel','renderKorea','renderKrPicker','renderTravelPicker','renderPassport','renderWorld','renderStats','renderAch','renderMilePage','renderYear','renderPassCard','renderSet','tick','checkArrival']){
    const base=window[name];if(typeof base!=='function')continue;
    window[name]=function(){
      if(scope)return base.apply(this,arguments);
      scope={days:new Map(),miles:null,calculations:0};
      const started=performance.now();
      try{return base.apply(this,arguments);}
      finally{const ms=performance.now()-started;metrics.last={name,dailyCalculations:scope.calculations};scope=null;if(ms>50)record('slow-render',{name,ms:Math.round(ms)});}
    };
  }
})();
