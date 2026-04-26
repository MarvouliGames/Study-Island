self.UVDOMBundle = {
  async fetch(event) {
    const url = new URL(event.request.url);

    if (!self.__uv$config.isProxiedPath(url.pathname)) {
      return fetch(event.request);
    }

    const encoded = self.__uv$config.stripPrefix(url.pathname);
    const upstreamUrl = self.__uv$config.decodeUrl(encoded);

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
    const text = await upstreamResponse.text();

    const rewritten = self.UVDOMRewrite.rewriteHTML(text, upstreamUrl);

    return new Response(rewritten, {
      status: upstreamResponse.status,
      headers: upstreamResponse.headers
    });
  }
};
