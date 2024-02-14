import { IncomingMessage, ServerResponse } from "node:http";
import * as URL from "node:url";
import { debuglog } from "node:util";
import { tranformerUrl } from "../util/clearerUrl";
import { providerController } from "./providerController";

const log = debuglog("server");

export const serverController = (req: IncomingMessage, res: ServerResponse) => {
  const { search, query, pathname, path } = URL.parse(req.url!, true);

  // definindo as rotas
  const urls = {
    api: {
      url: "api",
    },
    provider: {
      url: "api/provider",
    },
    buyer: {
      url: "api/buyer",
    },
    car: {
      url: "api/car",
    },
  };

  const params = [];
  const urlValues = Object.values(urls);
  const urlServer = tranformerUrl(pathname!);

  for (let { url } of urlValues) {
    if (url.includes(":")) {
      params.push({ url, position: url.indexOf(":") });
    }
  }

  console.log(params);

  if (urlValues.every(({ url }) => url !== urlServer)) {
    return res
      .writeHead(501, { "Content-Type": "application/json" })
      .end(JSON.stringify({ message: "Route not defined" }));
  }

  if (urlServer === urls["provider"].url) {
    providerController(req, res, {
      query,
    });
  }
};
