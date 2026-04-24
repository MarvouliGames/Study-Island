export default async function handler(req, res) {
  try {
    const target = req.query.url;

    if (!target) {
      res.status(400).send("Missing ?url=");
      return;
    }

    // Validate URL
    let url;
    try {
      url = new URL(target);
    } catch {
      res.status(400).send("Invalid URL");
      return;
    }

    // Fetch upstream
    const upstream = await fetch(url.toString(), {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    // Copy status
    res.status(upstream.status);

    // Copy SAFE headers only
    const safeHeaders = [
      "content-type",
      "content-length",
      "cache-control",
      "expires",
      "last-modified",
      "etag"
    ];

    upstream.headers.forEach((value, key) => {
      if (safeHeaders.includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Read body safely
    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.send(buffer);

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
