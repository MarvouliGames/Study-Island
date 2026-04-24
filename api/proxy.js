export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    res.status(400).send("Missing ?url=");
    return;
  }

  try {
    const response = await fetch(target, {
      headers: { "User-Agent": "Study-Island-Proxy" }
    });

    const contentType = response.headers.get("content-type") || "text/plain";
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", contentType);

    res.status(response.status).send(buffer);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
