export const config = {
  runtime: "edge"
};

const upstreamHeaders = [
  "accept",
  "accept-encoding",
  "accept-language",
  "cache-control",
  "content-type",
  "pragma",
  "referer",
  "user-agent",
  "x-requested-with"
];

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");

    if (!target) {
      return new Response("Missing ?url=", { status: 400 });
    }

    const upstreamUrl = new URL(target);

    const headers = {};
    for (const h of upstreamHeaders) {
      const v = req.headers.get(h);
      if (v) headers[h] = v;
    }

    const upstream = await fetch(upstreamUrl.toString(), {
      method: req.method,
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined
    });

    const responseHeaders = new Headers(upstream.headers);

    responseHeaders.set("access-control-allow-origin", "*");
    responseHeaders.set("access-control-allow-headers", "*");
    responseHeaders.set("access-control-allow-methods", "*");

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders
    });

  } catch (err) {
    return new Response("Bare error: " + err.message, { status: 500 });
  }
}
