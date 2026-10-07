const CACHE='mypharmacy-v59';
const ASSETS=['./','./index.html','./firebase-config.js','./manifest.json','./icon-192.png','./icon-512.png','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// الشبكة أولاً ثم الكاش. لا نتدخل في طلبات Firestore/Auth أبداً.
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  const ok=e.request.method==='GET'&&(u.origin===location.origin||u.pathname.startsWith('/firebasejs/'));
  if(!ok)return;
  e.respondWith(fetch(e.request).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
