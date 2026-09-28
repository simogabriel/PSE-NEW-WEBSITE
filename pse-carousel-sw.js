
self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

function removePSECaches() {
  return caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (key) {
      if (key.indexOf("pse-home-carousel-") === 0) return caches.delete(key);
    }));
  });
}

self.addEventListener("activate", function (event) {
  event.waitUntil(
    removePSECaches()
      .then(function () { return self.registration.unregister(); })
      
  );
});

self.addEventListener("message", function (event) {
  if (!event.data || event.data.type !== "PSE_DISABLE_OFFLINE_CACHE") return;
  event.waitUntil(
    removePSECaches().then(function () { return self.registration.unregister(); })
  );
});



