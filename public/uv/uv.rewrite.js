self.UVRewrite = {
  resolve(base, target) {
    try {
      return new URL(target, base).href;
    } catch {
      return target;
    }
  },

  html(content, upstreamUrl) {
    if (!upstreamUrl) return content;

    const u = new URL(upstreamUrl);
    const origin = u.origin;
    const baseOrigin = origin + "/";

    // 0) DO NOT re-rewrite already-proxied links
    content = content.replace(
      /(href|src)=["'](\/api\/learner\/[^"']+)["']/g,
      (m, attr, val) => `${attr}="${val}"`
    );

    // Absolute URLs: http(s)://
    content = content.replace(/(href|src)=["']https?:\/\/([^"']+)["']/g, (m, attr, rest) => {
      const url = "https://" + rest;
      return `${attr}="${self.__uv$config.prefix}${self.__uv$config.encodeUrl(url)}"`;
    });

    // Protocol-relative: //example.com
    content = content.replace(/(href|src)=["']\/\/([^"']+)["']/g, (m, attr, rest) => {
      const url = "https://" + rest;
      return `${attr}="${self.__uv$config.prefix}${self.__uv$config.encodeUrl(url)}"`;
    });

    // Root-relative: /path
    content = content.replace(/(href|src)=["']\/([^"']+)["']/g, (m, attr, path) => {
      const url = origin + "/" + path;
      return `${attr}="${self.__uv$config.prefix}${self.__uv$config.encodeUrl(url)}"`;
    });

    // Relative: path, ./path, ../path
    content = content.replace(
      /(href|src)=["'](?!https?:\/\/|\/\/|#)([^"']+)["']/g,
      (m, attr, path) => {
        // If it already starts with /api/learner/, leave it alone
        if (path.startsWith("/api/learner/")) return `${attr}="${path}"`;
        const url = self.UVRewrite.resolve(baseOrigin, path);
        return `${attr}="${self.__uv$config.prefix}${self.__uv$config.encodeUrl(url)}"`;
      }
    );

    // Forms
    content = content.replace(/action=["']([^"']+)["']/g, (m, url) => {
      if (url.startsWith("/api/learner/")) return `action="${url}"`;
      const resolved = self.UVRewrite.resolve(baseOrigin, url);
      return `action="${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
    });

    // Meta refresh
    content = content.replace(
      /http-equiv=["']refresh["'][^>]*content=["'][^;]+;\s*url=([^"']+)["']/gi,
      (m, url) => {
        if (url.startsWith("/api/learner/")) return m;
        const resolved = self.UVRewrite.resolve(baseOrigin, url);
        return m.replace(url, `${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}`);
      }
    );

    return content;
  },

  // keep your js/css parts as-is, or with the same kind of guard if needed

  js(content, upstreamUrl) {
    if (!upstreamUrl) return content;

    const u = new URL(upstreamUrl);
    const baseOrigin = u.origin + "/";

    // location.href = "..."
    content = content.replace(/location\.href\s*=\s*["']([^"']+)["']/g, (m, url) => {
      const resolved = self.UVRewrite.resolve(baseOrigin, url);
      return `location.href="${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
    });

    // window.open("...")
    content = content.replace(/window\.open\(\s*["']([^"']+)["']/g, (m, url) => {
      const resolved = self.UVRewrite.resolve(baseOrigin, url);
      return `window.open("${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
    });

    // fetch("...")
    content = content.replace(/fetch\(\s*["']([^"']+)["']/g, (m, url) => {
      const resolved = self.UVRewrite.resolve(baseOrigin, url);
      return `fetch("${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
    });

    // XHR open("METHOD", "url")
    content = content.replace(
      /\.open\(\s*["'](GET|POST|PUT|DELETE|PATCH)["']\s*,\s*["']([^"']+)["']/g,
      (m, method, url) => {
        const resolved = self.UVRewrite.resolve(baseOrigin, url);
        return `.open("${method}", "${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
      }
    );

    return content;
  },

  css(content, upstreamUrl) {
    if (!upstreamUrl) return content;

    const u = new URL(upstreamUrl);
    const baseOrigin = u.origin + "/";

    // url(...)
    content = content.replace(/url\(["']?([^"')]+)["']?\)/g, (m, url) => {
      if (url.startsWith("data:") || url.startsWith("blob:")) return m;
      const resolved = self.UVRewrite.resolve(baseOrigin, url);
      return `url("${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}")`;
    });

    return content;
  }
};
