export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    res.status(400).send("Missing ?url=");
    return;
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html"
      }
    });

    // Only allow HTML through the proxy
    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      res.status(403).send("Blocked: Only HTML pages can be proxied.");
      return;
    }

    const html = await upstream.text();

    // Return HTML exactly as-is
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
