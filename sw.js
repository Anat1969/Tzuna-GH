// דף מהרשת קודם (תמיד הגרסה האחרונה), נכסים מהמטמון. בלי רשת: הגרסה האחרונה שנשמרה.
const CACHE = 'tzuna-v2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const fresh = () => fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; });
  // דפים, סקריפטים ודאטה: מהרשת קודם, כדי שתיקון תוכן יגיע מיד.
  if (req.mode === 'navigate' || /\.(js|css|json|webmanifest)$/.test(new URL(req.url).pathname)) {
    e.respondWith(fresh().catch(() => caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fresh()));
});
