import { createServer } from "node:http";
import { serverController } from "./controllers/serverController";

const server = createServer(serverController);

// if no parameter is provided in list function, it provied automatically
server.listen();
