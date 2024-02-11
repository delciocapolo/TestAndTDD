import { IncomingMessage, ServerResponse } from "node:http";
import * as URL from "node:url";
import { debuglog } from "node:util";

const log = debuglog("server");

export const serverController = (req: IncomingMessage, res: ServerResponse) => {
  const { search, query, pathname, path } = URL.parse(req.url!, true);
  const urls = [
    {
      name: 1,
      url: "/api",
    },
    {
      name: 2,
      url: "/api/provider",
    },
    {
      name: 3,
      url: "/api/buyer",
    },
    {
      name: 4,
      url: "/api/car",
    },
  ];

  const params = [];
  for (let { url } of urls) {
    if (url.includes(":")) {
      params.push({ url, position: url.indexOf(":") });
    }
  }

  // if (!urls.includes(req.url!)) {
  //   return res
  //     .writeHead(501, { "Content-Type": "application/json" })
  //     .end({ message: "Route not defined" });
  // }

  if (search !== null) {
    if (pathname === "/api/provider" && req.method === "GET") {
    }
  }
};
