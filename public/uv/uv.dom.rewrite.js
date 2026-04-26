self.UVDOMRewrite = {
  rewriteHTML(html, upstreamUrl) {
    const origin = new URL(upstreamUrl).origin;

    // Rewrite <script src>
    html = html.replace(/<script[^>]+src=["']([^"']+)["']/gi, (m, src) => {
      const resolved = new URL(src, upstreamUrl).href;
      const encoded = self.__uv$config.encodeUrl(resolved);
      return m.replace(src, `/api/learner/${encoded}`);
    });

    // Rewrite inline scripts (mark them for re-execution)
    html = html.replace(/<script>([\s\S]*?)<\/script>/gi, (m, code) => {
      return `<script data-uv-script>${code}</script>`;
    });

    // Rewrite <img>, <link>, <a>, etc.
    html = html.replace(/(src|href)=["']([^"']+)["']/gi, (m, attr, url) => {
      if (url.startsWith("data:") || url.startsWith("blob:")) return m;
      const resolved = new URL(url, upstreamUrl).href;
      const encoded = self.__uv$config.encodeUrl(resolved);
      return `${attr}="/api/learner/${encoded}"`;
    });

    return html;
  }
};
