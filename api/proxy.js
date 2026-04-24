export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    res.status(400).send("Missing ?url=");
    return;
  }

  try {
    const response = await fetch(target, {
      headers: { "User-Agent": "GitHub-Proxy" }
    });

    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
