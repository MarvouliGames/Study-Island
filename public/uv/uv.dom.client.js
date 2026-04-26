window.UVDOM = {
  async load(encoded) {
    const url = atob(encoded);

    // Fetch through your SW (same as iframe did)
    const res = await fetch(`/api/learner/${encoded}`);
    const html = await res.text();

    // Rewrite HTML (server-side rewrite already happened)
    const rewritten = html;

    const container = document.getElementById("content");
container.innerHTML = rewritten;

// Re-run inline scripts
const scripts = container.querySelectorAll("script[data-uv-script]");
scripts.forEach(old => {
  const s = document.createElement("script");
  s.textContent = old.textContent;
  old.replaceWith(s);
});

  // Boot the DOM runtime
  this.bootstrap(container);
},

bootstrap(container) {
  // Intercept link clicks
  container.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href.startsWith("javascript:") || href.startsWith("#")) return;

    e.preventDefault();

    const base = document.querySelector("base")?.href || location.href;
    const resolved = new URL(href, base).href;

    const encoded = btoa(resolved);
    location.href = `/view.html?url=${encoded}`;
  });
}
