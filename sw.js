/* AQP Aquafin Calculator V3.3.0 (uk) - service worker
   Offline-werking op de werf. navigate=network-first, assets=cache-first.
   Deploy = index.html in mapwortel; precache de wortel-navigatie ('./'). */
var CACHE = 'aqp-aquafin-uk-v4-0-0';
self.addEventListener('install', function(e) {
    e.waitUntil(caches.open(CACHE).then(function(c) {
        return c.addAll(['./']).catch(function() {});
    }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;
    if (e.request.mode === 'navigate') {
        e.respondWith(fetch(e.request).then(function(resp) {
            var copy = resp.clone(); caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
            return resp;
        }).catch(function() { return caches.match(e.request); }));
    } else {
        e.respondWith(caches.match(e.request).then(function(hit) {
            if (hit) return hit;
            return fetch(e.request).then(function(resp) {
                if (resp && resp.status === 200) { var copy = resp.clone(); caches.open(CACHE).then(function(c) { c.put(e.request, copy); }); }
                return resp;
            });
        }));
    }
});
