// UV-style rewrite engine (HTML, JS, CSS, fetch/XHR, forms, meta, etc.)
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
    const base = upstreamUrl;
    const origin = new URL(base).origin;

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

    // Relative URLs: path, ./path, ../path
content = content.replace(/(href|src)=["'](?!https?:\/\/|\/\/|#)([^"']+)["']/g, (m, attr, path) => {
  const base = upstreamUrl; // the decoded real URL
  const resolved = new URL(path, base).href;
  return `${attr}="${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
});


    // Forms
    content = content.replace(/action=["']([^"']+)["']/g, (m, url) => {
      const resolved = self.UVRewrite.resolve(base, url);
      return `action="${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
    });

    // Meta refresh
    content = content.replace(/http-equiv=["']refresh["'][^>]*content=["'][^;]+;\s*url=([^"']+)["']/gi, (m, url) => {
      const resolved = self.UVRewrite.resolve(base, url);
      return m.replace(url, `${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}`);
    });

    return content;
  },

  js(content, upstreamUrl) {
    if (!upstreamUrl) return content;
    const base = upstreamUrl;

    // location.href = "..."
    content = content.replace(/location\.href\s*=\s*["']([^"']+)["']/g, (m, url) => {
      const resolved = self.UVRewrite.resolve(base, url);
      return `location.href="${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
    });

    // window.open("...")
    content = content.replace(/window\.open\(\s*["']([^"']+)["']/g, (m, url) => {
      const resolved = self.UVRewrite.resolve(base, url);
      return `window.open("${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
    });

    // fetch("...")
    content = content.replace(/fetch\(\s*["']([^"']+)["']/g, (m, url) => {
      const resolved = self.UVRewrite.resolve(base, url);
      return `fetch("${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
    });

    // XHR open("METHOD", "url")
    content = content.replace(/\.open\(\s*["'](GET|POST|PUT|DELETE|PATCH)["']\s*,\s*["']([^"']+)["']/g,
      (m, method, url) => {
        const resolved = self.UVRewrite.resolve(base, url);
        return `.open("${method}", "${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}"`;
      }
    );

    return content;
  },

  css(content, upstreamUrl) {
    if (!upstreamUrl) return content;
    const base = upstreamUrl;

    // url(...)
    content = content.replace(/url\(["']?([^"')]+)["']?\)/g, (m, url) => {
      if (url.startsWith("data:") || url.startsWith("blob:")) return m;
      const resolved = self.UVRewrite.resolve(base, url);
      return `url("${self.__uv$config.prefix}${self.__uv$config.encodeUrl(resolved)}")`;
    });

    return content;
  }
};
