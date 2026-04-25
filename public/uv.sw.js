importScripts(
  "/uv/uv.bundle.js",
  "/uv/uv.config.js",
  "/uv/uv.handler.js",
  "/uv/uv.rewrite.js"
);

self.addEventListener("fetch", (event) => {
  event.respondWith(
    Ultraviolet.fetch(event)
  );
});
