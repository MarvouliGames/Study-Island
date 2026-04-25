importScripts(
  "/uv/bundle.js",
  "/uv/config.js",
  "/uv/handler.js",
  "/uv/rewrite.js"
);

self.addEventListener("fetch", (event) => {
  event.respondWith(
    Ultraviolet.fetch(event)
  );
});
