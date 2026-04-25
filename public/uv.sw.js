// Ultraviolet Service Worker (local copy)
self.__uv$config = {
  prefix: '/api/learner/',
  bare: '/api/bare/',
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
};

importScripts(
  '/uv/uv.bundle.js',
  '/uv/uv.config.js',
  '/uv/uv.handler.js',
  '/uv/uv.rewrite.js'
);

self.addEventListener('fetch', event => {
  event.respondWith(
    Ultraviolet.fetch(event)
  );
});
