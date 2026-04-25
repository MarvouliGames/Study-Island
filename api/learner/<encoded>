export const config = {
  runtime: "edge"
};

const PREFIX = "/learner/";

// Base64 URL-safe encode/decode
function encode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

// Turn encoded path into real URL
function extractUrl(path) {
  const encoded = path.slice(PREFIX.length);
  return decode(encoded);
}

// Rewrite absolute → proxied
function proxify(url) {
  return PREFIX + encode(url);
}

// Minimal HTML rewriting
function rewriteHTML(text, base) {
  return text
    // src, href, action
    .replace(/(src|href|action)=["']([^"']+)["']/gi, (m, attr, val) => {
      if (val.startsWith("javascript:")) return m;
      try {
        const abs = new URL(val, base).toString();
        return `${attr}="${proxify(abs)}"`;
      } catch {
        return m;
      }
    })
    // srcset
    .replace(/srcset=["']([^"']+)["']/gi, (m, val) => {
      const parts = val.split(",").map(p => {
        const [url, size] = p.trim().split(" ");
        try {
          const abs = new URL(url, base).toString();
          return `${proxify(abs)} ${size || ""}`.trim();
        } catch {
          return p;
        }
      });
      return `srcset="${parts.join(", ")}"`;
    });
}

// Minimal CSS rewriting
function rewriteCSS(text, base) {
  return text.replace(/url\((.*?)\)/g, (m, p1) => {
    const cleaned = p1.replace(/['"]/g, "").trim();
    if (!cleaned || cleaned.startsWith("data:")) return m;
    try {
      const abs = new URL(cleaned, base).toString();
      return `url(${proxify(abs)})`;
    } catch {
      return m;
    }
  });
}

// Minimal JS rewriting (regex-based)
function rewriteJS(text, base) {
  return text
    // fetch("url")
    .replace(/fetch\(["']([^"']+)["']\)/g, (m, url) => {
      try {
        const abs = new URL(url, base).toString();
        return `fetch("${proxify(abs)}")`;
      } catch {
        return m;
      }
    })
    // import("url")
    .replace(/import\(["']([^"']+)["']\)/g, (m, url) => {
      try {
        const abs = new URL(url, base).toString();
        return `import("${proxify(abs)}")`;
      } catch {
        return m;
      }
    });
}

export default async function handler(req) {
  try {
    const url = extractUrl(new URL(req.url).pathname);

    const upstream = await fetch(url, {
      headers: {
        "User-Agent": req.headers.get("User-Agent") || "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    const contentType = upstream.headers.get("content-type") || "";

    // Binary passthrough
    if (!contentType.includes("text") && !contentType.includes("javascript") && !contentType.includes("json")) {
      return new Response(await upstream.arrayBuffer(), {
        status: upstream.status,
        headers: { "content-type": contentType }
      });
    }

    let text = await upstream.text();
    const base = url;

    if (contentType.includes("html")) text = rewriteHTML(text, base);
    if (contentType.includes("css")) text = rewriteCSS(text, base);
    if (contentType.includes("javascript")) text = rewriteJS(text, base);

    return new Response(text, {
      status: upstream.status,
      headers: { "content-type": contentType }
    });

  } catch (err) {
    return new Response("Proxy error: " + err.message, { status: 500 });
  }
}
