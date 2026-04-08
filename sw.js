var CACHE_NAME = 'dinos-potiguares-v1';
var URLS_TO_CACHE = [
  './',
  './dinos-potiguares_1.html',
  './manifest.webmanifest'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) { return name !== CACHE_NAME; })
             .map(function(name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(fetchRes) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(function() {
      return caches.match('./dinos-potiguares_1.html');
    })
  );
});
