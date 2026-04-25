importScripts(
  "/uv/uv.config.js",
  "/uv/uv.rewrite.v2.js",
  "/uv/uv.handler.js",
  "/uv/uv.bundle.js"
);

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(self.Ultraviolet.fetch(event));
});
