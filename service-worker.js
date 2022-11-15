const CACHE_NAME = "SW-002";
const toCache = [
  "/",
  "manifest.json",
  "assets/js/register.js",
  "assets/images/icons/icon-72x72.png",
  "assets/images/icons/icon-96x96.png",
  "assets/images/icons/icon-128x128.png",
  "assets/images/icons/icon-144x144.png",
  "assets/images/icons/icon-152x152.png",
  "assets/images/icons/icon-192x192.png",
  "assets/images/icons/icon-384x384.png",
  "assets/images/icons/icon-512x512.png",
];

self.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(toCache);
      })
      .then(self.skipWaiting())
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request);
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[ServiceWorker] Hapus cache lama", key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});
