// Use globalThis for type safety in service worker context
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sw: ServiceWorkerGlobalScope = self as any;

const CACHE_NAME = 'uma-stable';
const CORE = ['/', '/index.html', '/manifest.webmanifest'];

// Install: Pre-cache core assets
sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE))
      .then(() => sw.skipWaiting()),
  );
});

// Activate: Remove old caches and take control immediately
sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => sw.clients.claim()),
  );
});

// Fetch: Serve cached assets, update cache, and handle navigation fallback
sw.addEventListener('fetch', (event: FetchEvent) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if (url.origin !== sw.location.origin) return;

  // Handle navigation requests (SPA routing)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Cache the root page for offline fallback
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/') as Promise<Response>),
    );
    return;
  }

  // For other requests: try cache first, then network, then cache again
  event.respondWith(
    caches
      .match(req)
      .then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          // Cache successful responses
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        });
      })
      .catch(() => caches.match(req) as Promise<Response>),
  );
});
