/* TOURDY 웹앱(PWA) 오프라인 캐시. 파일을 바꿔 올릴 때마다 VERSION을 올리면 '새 버전' 안내가 떠요. */
const VERSION='tourdy-web-2026-10-29';
const FILES=['./', 'index.html', 'css/app.css', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon-64.png', 'js/storage.js', 'js/rewards.js', 'js/core.js', 'js/sub-core.js', 'js/legal.js', 'privacy.html', 'terms.html', 'js/timer.js', 'js/planner.js', 'js/stats.js', 'js/settings.js', 'js/travel-world.js', 'js/kr-routes.js', 'js/kr-tattoo.js', 'js/travel-korea.js', 'js/travel-space.js', 'js/travel-map.js', 'js/route-icons.js', 'js/travel-experience.js', 'js/ticket-fit.js', 'js/space-plus.js', 'js/extras.js', 'js/multi-add.js', 'js/subject-picker.js', 'js/first-trip.js', 'js/forgot-timer.js', 'js/today-dest.js', 'js/subscription.js', 'js/empty-states.js', 'js/app.js', 'js/tutorial.js', 'js/vendor/supabase.js', 'js/config.js', 'js/sync-merge.js', 'js/sync.js', 'js/invite.js', 'js/challenge.js', 'js/performance.js', 'js/pwa.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// pwa.js의 '업데이트' 버튼이 보내는 신호: 기다리던 새 버전을 바로 적용
self.addEventListener('message',e=>{if(e.data&&e.data.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  // 로그인·동기화(Supabase) 같은 외부 요청은 절대 캐시하지 않음. 구글 폰트만 받아 둔 걸 재사용
  if(url.origin!==location.origin){if(!/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname))return;e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok||res.type==='opaque'){const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy))}return res}).catch(()=>hit)));return}
  // 화면(HTML)은 네트워크 우선 → 오프라인이면 캐시
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put('index.html',copy));return res}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});
