// Client-side helper for your view.html / browser.html
class UVClient {
  constructor(opts) {
    this.prefix = opts.prefix || "/api/learner/";
    this.bare = opts.bare || "/api/bare/";
  }

  encodeUrl(url) {
    return btoa(url);
  }

  decodeUrl(encoded) {
    try {
      return atob(encoded);
    } catch {
      return encoded;
    }
  }

  proxied(url) {
    return this.prefix + this.encodeUrl(url);
  }
}

self.UVClient = UVClient;
