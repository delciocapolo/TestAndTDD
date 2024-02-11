import { createServer } from "node:http";
import { debuglog } from "node:util";
import { serverController } from "./controllers/serverController";
import { AddressInfo } from "node:net";

const server = createServer(serverController);
const log = debuglog("server");

// if no parameter is provided in list function, it provied automatically
server.listen(45181, async () => {
  const { port } = server.address() as AddressInfo;
  log(`SERVER IS RUNNING AT http://127.0.0.1:${port}/`);
});
