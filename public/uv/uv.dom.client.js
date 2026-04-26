window.UVDOM = {
  async load(encoded) {
    const url = atob(encoded);

    // Fetch through your SW (same as iframe did)
    const res = await fetch(`/api/learner/${encoded}`);
    const html = await res.text();

    // Rewrite HTML (server-side rewrite already happened)
    const rewritten = html;

    // Replace document with rewritten HTML
    document.open();
    document.write(rewritten);
    document.close();

    // Boot the DOM runtime
    this.bootstrap();
  },

  bootstrap() {
    // Re-run scripts that were injected as text
    const scripts = document.querySelectorAll("script[data-uv-script]");
    scripts.forEach(old => {
      const s = document.createElement("script");
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }
};
