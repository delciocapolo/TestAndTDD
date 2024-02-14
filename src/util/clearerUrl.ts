export const tranformerUrl = (url: string) => {
  if (url.startsWith("/") && url.endsWith("/")) {
    return url.slice(url.indexOf("/") + 1, url.lastIndexOf("/"));
  }
  if (url.endsWith("/")) {
    return url.slice(0, url.lastIndexOf("/"));
  }
  if (url.startsWith("/")) {
    return url.slice(url.indexOf("/") + 1);
  }
};
