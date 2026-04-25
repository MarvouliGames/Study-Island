self.__uv$config = {
  prefix: "/api/learner/",
  bare: "/api/bare/",
  encodeUrl: (url) => btoa(url),
  decodeUrl: (url) => atob(url)
};
