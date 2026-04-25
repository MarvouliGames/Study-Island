self.UVRewrite = {
  html(content, url) {
    // Skip rewriting our own UI pages
    if (!url || url.startsWith(location.origin)) {
      return content;
    }

    // Absolute URLs
    content = content.replace(/(href|src)=["']https?:\/\/([^"']+)["']/g, (m, attr, url) => {
      return `${attr}="/api/learner/${btoa("https://" + url)}"`;
    });

    // Protocol-relative URLs
    content = content.replace(/(href|src)=["']\/\/([^"']+)["']/g, (m, attr, url) => {
      return `${attr}="/api/learner/${btoa("https://" + url)}"`;
    });

    // Root-relative URLs
    content = content.replace(/(href|src)=["']\/([^"']+)["']/g, (m, attr, path) => {
      const base = self.__uv$config.decodeUrl(url);
      const origin = new URL(base).origin;
      return `${attr}="/api/learner/${btoa(origin + "/" + path)}"`;
    });

    // Relative URLs
    content = content.replace(/(href|src)=["'](?!https?:\/\/|\/\/|#)([^"']+)["']/g, (m, attr, path) => {
      const base = self.__uv$config.decodeUrl(url);
      const resolved = new URL(path, base).href;
      return `${attr}="/api/learner/${btoa(resolved)}"`;
    });

    return content;
  },

  js(content, url) {
    // Skip rewriting our own scripts
    if (!url || url.startsWith(location.origin)) {
      return content;
    }

    return content
      .replace(/location\.href\s*=\s*["']([^"']+)["']/g, (m, url) => {
        return `location.href="/api/learner/${btoa(url)}"`;
      });
  },

  css(content, url) {
    // Skip rewriting our own CSS
    if (!url || url.startsWith(location.origin)) {
      return content;
    }

    return content.replace(/url\(["']?([^"')]+)["']?\)/g, (m, url) => {
      if (url.startsWith("http")) {
        return `url("/api/learner/${btoa(url)}")`;
      }
      const base = self.__uv$config.decodeUrl(url);
      const resolved = new URL(url, base).href;
      return `url("/api/learner/${btoa(resolved)}")`;
    });
  }
};
