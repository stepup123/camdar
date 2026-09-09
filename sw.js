const C='camdar-v3';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.json','./data.json'])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  // 지도 타일(외부 도메인)은 캐시하지 않는다. 저장공간이 금방 찬다.
  if(new URL(e.request.url).origin!==self.location.origin) return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    const cp=res.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return res;
  }).catch(()=>caches.match('./index.html'))));
});