/* Pixel Arcade offline worker. Network first, cache as fallback, so new builds always win when online. */
const CACHE='pa-v1';
const SHELL=['/pixel-arcade/','/pixel-arcade/index.html','/pixel-arcade/manifest.webmanifest','/pixel-arcade/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.origin!==location.origin)return;
 e.respondWith(
  fetch(r,{cache:'no-cache'}).then(res=>{
   if(res&&res.ok&&res.type==='basic'){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}
   return res;
  }).catch(()=>caches.match(r,{ignoreSearch:false}).then(m=>m||caches.match(r,{ignoreSearch:true})).then(m=>m||(r.mode==='navigate'?caches.match('/pixel-arcade/'):Response.error())))
 );
});
