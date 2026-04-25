export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  const url = new URL(req.url);
  const encoded = url.pathname.replace("/api/learner/", "");

  if (!encoded) {
    return new Response("Missing encoded URL", { status: 400 });
  }

  let decoded;
  try {
    decoded = atob(encoded);
  } catch (err) {
    return new Response("Invalid encoded URL", { status: 400 });
  }

  const upstream = await fetch(
    url.origin + "/api/bare/?url=" + encodeURIComponent(decoded),
    {
      method: req.method,
      headers: req.headers,
      body: req.body
    }
  );

  return upstream;
}
