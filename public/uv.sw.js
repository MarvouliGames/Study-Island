const v = Date.now(); // auto-bump every load

importScripts(
  `/uv/uv.config.v1.js?v=${v}`,
  `/uv/uv.rewrite.v1.js?v=${v}`,
  `/uv/uv.handler.v1.js?v=${v}`,
  `/uv/uv.bundle.v1.js?v=${v}`
);

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));


self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(self.Ultraviolet.fetch(event));
});
