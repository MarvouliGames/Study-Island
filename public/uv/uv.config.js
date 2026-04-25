// Basic UV-style config for /api/learner/
self.__uv$config = {
  prefix: "/api/learner/",
  bare: "/api/bare/",
  encodeUrl(url) {
    return btoa(url);
  },
  decodeUrl(encoded) {
    try {
      return atob(encoded);
    } catch {
      return encoded;
    }
  },
  isProxiedPath(pathname) {
    return pathname.startsWith(this.prefix);
  },
  stripPrefix(pathname) {
    return pathname.replace(this.prefix, "");
  }
};
