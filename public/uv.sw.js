const v = Date.now(); // auto-bump every load

importScripts(
  `/uv/uv.config.js?v=${v}`,
  `/uv/uv.rewrite.js?v=${v}`,
  `/uv/uv.handler.js?v=${v}`,
  `/uv/uv.bundle.js?v=${v}`,
  `/uv/uv.dom.rewrite.js?v=${v}`,
  `/uv/uv.dom.bundle.js?v=${v}`
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
