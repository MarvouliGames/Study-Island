self.UVRewrite = {
  html(content) {
    return content
      .replace(/href="/g, 'href="/api/learner/' )
      .replace(/src="/g, 'src="/api/learner/' );
  },

  js(content) {
    return content;
  },

  css(content) {
    return content;
  }
};
