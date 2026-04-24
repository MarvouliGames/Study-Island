export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    res.status(400).send("Missing ?url=");
    return;
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0"
      }
    });

    // Copy status
    res.status(upstream.status);

    // Copy headers
    upstream.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Stream the body (supports HTML, CSS, JS, images, fonts, everything)
    upstream.body.pipe(res);

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}

