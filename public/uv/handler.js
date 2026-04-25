self.UVHandler = {
  async fetch(event) {
    const url = new URL(event.request.url);

    // Only rewrite proxied requests
    if (!url.pathname.startsWith(self.__uv$config.prefix)) {
      return fetch(event.request);
    }

    const encoded = url.pathname.replace(self.__uv$config.prefix, "");
    const decoded = self.__uv$config.decodeUrl(encoded);

    const upstream = await fetch(self.__uv$config.bare + "?url=" + decoded, {
      method: event.request.method,
      headers: event.request.headers,
      body: event.request.body
    });

    const type = upstream.headers.get("content-type") || "";

    let body = await upstream.text();

    if (type.includes("text/html")) {
      body = self.UVRewrite.html(body);
    }

    return new Response(body, {
      status: upstream.status,
      headers: upstream.headers
    });
  }
};
