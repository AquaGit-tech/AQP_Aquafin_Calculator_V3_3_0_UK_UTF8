/* AQP Aquafin Calculator V4.1.0 (uk) - service worker
   Offline-werking op de werf. navigate=network-first, assets=cache-first.
   Deploy = index.html in mapwortel; precache de wortel-navigatie ('./'). */
var CACHE = 'aqp-aquafin-uk-v4-1-0';
self.addEventListener('install', function(e) {
    e.waitUntil(caches.open(CACHE).then(function(c) {
        return c.addAll(['./']).catch(function() {});
    }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e) {
    /* V4.1.0: oude versie-caches (v3-x, v4-0-0) opruimen, anders serveert offline de oude index.html */
    e.waitUntil(caches.keys().then(function(keys) {
        return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;
    if (e.request.mode === 'navigate') {
        e.respondWith(fetch(e.request).then(function(resp) {
            var copy = resp.clone(); caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
            return resp;
        }).catch(function() { return caches.open(CACHE).then(function(c) { return c.match(e.request); }); }));
    } else {
        e.respondWith(caches.open(CACHE).then(function(c) { return c.match(e.request); }).then(function(hit) {
            if (hit) return hit;
            return fetch(e.request).then(function(resp) {
                if (resp && resp.status === 200) { var copy = resp.clone(); caches.open(CACHE).then(function(c) { c.put(e.request, copy); }); }
                return resp;
            });
        }));
    }
});
