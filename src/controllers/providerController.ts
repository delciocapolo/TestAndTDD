import { IncomingMessage, ServerResponse } from "http";
import { serverController } from "./serverController";
import { once } from "events";
import StandModule from "../stand/Stand.module";

export const providerController = async (
  request: IncomingMessage,
  response: ServerResponse | null,
  opts?: {}
) => {
  if (request.method === "GET") {
    const { email } = Object(opts).query;
    const provider = await StandModule.getProviders(email);
    const {} = provider;
    return response!.writeHead(200, { "Content-Type": "application/json" });
  }
  // return res
  //   .writeHead(200, { "Content-Type": "application/json" })
  //   .end(JSON.stringify({ message: "you are trying acess main page" }));
};
