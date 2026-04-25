self.UVRewrite = {
  html(content) {
    // Absolute URLs
    content = content.replace(/(href|src)=["']https?:\/\/([^"']+)["']/g, (m, attr, url) => {
      return `${attr}="/api/learner/${btoa("https://" + url)}"`;
    });

    // Protocol-relative URLs: //example.com
    content = content.replace(/(href|src)=["']\/\/([^"']+)["']/g, (m, attr, url) => {
      return `${attr}="/api/learner/${btoa("https://" + url)}"`;
    });

    // Root-relative URLs: /path
    content = content.replace(/(href|src)=["']\/([^"']+)["']/g, (m, attr, path) => {
      const base = self.__uv$config.decodeUrl(location.pathname.replace(self.__uv$config.prefix, ""));
      const origin = new URL(base).origin;
      return `${attr}="/api/learner/${btoa(origin + "/" + path)}"`;
    });

    // Relative URLs: path, ./path, ../path
    content = content.replace(/(href|src)=["'](?!https?:\/\/|\/\/|#)([^"']+)["']/g, (m, attr, path) => {
      const base = self.__uv$config.decodeUrl(location.pathname.replace(self.__uv$config.prefix, ""));
      const resolved = new URL(path, base).href;
      return `${attr}="/api/learner/${btoa(resolved)}"`;
    });

    return content;
  },

  js(content) {
    // Minimal JS rewrite (location.href, window.location)
    return content
      .replace(/location\.href\s*=\s*["']([^"']+)["']/g, (m, url) => {
        return `location.href="/api/learner/${btoa(url)}"`;
      });
  },

  css(content) {
    // url(...) in CSS
    return content.replace(/url\(["']?([^"')]+)["']?\)/g, (m, url) => {
      if (url.startsWith("http")) {
        return `url("/api/learner/${btoa(url)}")`;
      }
      const base = self.__uv$config.decodeUrl(location.pathname.replace(self.__uv$config.prefix, ""));
      const resolved = new URL(url, base).href;
      return `url("/api/learner/${btoa(resolved)}")`;
    });
  }
};
