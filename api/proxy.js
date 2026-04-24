function normalizeURL(url) {
  try {
    return new URL(url).toString();
  } catch {
    try {
      return new URL("https://" + url).toString();
    } catch {
      return null;
    }
  }
}

async function loadURL(url) {
  if (!url) return;

  let normalized = normalizeURL(url);
  if (!normalized) {
    content.textContent = "Invalid URL";
    return;
  }

  url = normalized;
  currentUrl = url;
  input.value = url;
  content.innerHTML = "Loading…";

  try {
    const res = await fetch(proxify(url));
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    rewriteLinks(doc);

    content.innerHTML = "";
    Array.from(doc.body.childNodes).forEach(node => {
      content.appendChild(node);
    });

    document.title = doc.title || "Browser";

  } catch (e) {
    content.textContent = "Failed to load: " + e.message;
  }
}
