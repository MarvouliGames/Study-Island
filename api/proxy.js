export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    res.status(400).send("Missing ?url=");
    return;
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        "User-Agent": "Study-Island-Proxy",
        "Accept": "*/*"
      }
    });

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const buffer = Buffer.from(await upstream.arrayBuffer());

    // Remove headers that break proxy rendering
    res.removeHeader("Content-Security-Policy");
    res.removeHeader("X-Frame-Options");

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", contentType);

    res.status(upstream.status).send(buffer);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message + "Try ");
  }
}
