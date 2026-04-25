// Core UV-style fetch pipeline using Bare + rewrite
self.Ultraviolet = {
  async fetch(event) {
    const url = new URL(event.request.url);

    // Only handle proxied paths
    if (!self.__uv$config.isProxiedPath(url.pathname)) {
      return fetch(event.request);
    }

    const encoded = self.__uv$config.stripPrefix(url.pathname);
    const upstreamUrl = self.__uv$config.decodeUrl(encoded);

    // Build Bare request URL
    const bareUrl = new URL(self.__uv$config.bare, location.origin);
    bareUrl.searchParams.set("url", upstreamUrl);
    bareUrl.searchParams.set("method", event.request.method);

    // Forward headers/body minimally
    const init = {
      method: event.request.method,
      headers: event.request.headers,
      body: ["GET", "HEAD"].includes(event.request.method) ? undefined : await event.request.clone().arrayBuffer()
    };

    const upstreamResponse = await fetch(bareUrl.toString(), init);
    return self.UVHandler.handle(upstreamResponse, upstreamUrl);
  }
};
