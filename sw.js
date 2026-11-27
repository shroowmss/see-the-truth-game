/* See The Truth service worker: keeps the game on the device so it opens fast and plays offline.
   The page is fetched fresh when online (so updates show up); game.js / snd.js are versioned (?v=build) and served from cache. */
const SHELL='stt-shell',BUILD='c7ed2fd038';
const SHELL_FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','favicon.ico'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(SHELL).then(c=>c.addAll(SHELL_FILES)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(/\/(game|snd)\.js$/.test(u.pathname)&&u.searchParams.get('v')){   // versioned game files: cache first
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r)));return;}
  // everything else (the page, icons, shop): network first, cache as the offline fallback
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(SHELL).then(c=>c.put(r,cp));}return res;})
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(hit=>hit||(r.mode==='navigate'?caches.match('index.html'):Response.error()))));});
