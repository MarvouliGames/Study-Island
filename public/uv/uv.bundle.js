self.Ultraviolet = {
  async fetch(event) {
    const url = new URL(event.request.url);

    // Only handle proxied paths
    if (!self.__uv$config.isProxiedPath(url.pathname)) {
      return fetch(event.request);
    }

    // 1. Extract encoded part
    const encoded = self.__uv$config.stripPrefix(url.pathname);

    // 2. Decode to REAL upstream URL
    const upstreamUrl = self.__uv$config.decodeUrl(encoded);

    // 3. Build Bare request
    const bareUrl = new URL(self.__uv$config.bare, location.origin);
    bareUrl.searchParams.set("url", upstreamUrl);
    bareUrl.searchParams.set("method", event.request.method);

    const init = {
      method: event.request.method,
      headers: event.request.headers,
      body: ["GET", "HEAD"].includes(event.request.method)
        ? undefined
        : await event.request.clone().arrayBuffer()
    };

    const upstreamResponse = await fetch(bareUrl.toString(), init);

    // 4. Pass DECODED upstream URL into handler
    return self.UVHandler.handle(upstreamResponse, upstreamUrl);
  }
};
