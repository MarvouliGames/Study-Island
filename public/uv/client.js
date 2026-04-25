class UVClient {
  constructor(config) {
    this.prefix = config.prefix;
    this.bare = config.bare;
  }

  async encodeUrl(url) {
    return btoa(url);
  }

  async decodeUrl(url) {
    return atob(url);
  }
}

window.UVClient = UVClient;
