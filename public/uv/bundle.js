self.Ultraviolet = {
  codec: {
    encode: self.__uv$config.encodeUrl,
    decode: self.__uv$config.decodeUrl
  },
  rewrite: self.UVRewrite,
  handler: self.UVHandler,
  fetch(event) {
    return self.UVHandler.fetch(event);
  }
};
