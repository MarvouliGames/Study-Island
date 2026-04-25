// Handler that chooses how to rewrite based on content-type
self.UVHandler = {
  async handle(upstreamResponse, upstreamUrl) {
    const ct = upstreamResponse.headers.get("content-type") || "";
    const isHtml = ct.includes("text/html");
    const isJs = ct.includes("javascript") || ct.includes("ecmascript");
    const isCss = ct.includes("text/css");

    const text = await upstreamResponse.text();
    let body = text;

    if (isHtml) {
      body = self.UVRewrite.html(body, upstreamUrl);
    } else if (isJs) {
      body = self.UVRewrite.js(body, upstreamUrl);
    } else if (isCss) {
      body = self.UVRewrite.css(body, upstreamUrl);
    }

    const headers = new Headers(upstreamResponse.headers);

    // Strip frame/CSP-ish stuff to allow embedding
    headers.delete("content-security-policy");
    headers.delete("content-security-policy-report-only");
    headers.delete("x-frame-options");

    return new Response(body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers
    });
  }
};
