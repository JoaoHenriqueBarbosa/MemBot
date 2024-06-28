import { createServer } from "./utils/serverConfig.js";

const server = createServer();

console.log(`Listening on ${server.hostname}:${server.port}`);