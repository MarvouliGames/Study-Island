export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    res.status(400).send("Missing ?url=");
    return;
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await upstream.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message + "i fucking hate this");
  }
}
