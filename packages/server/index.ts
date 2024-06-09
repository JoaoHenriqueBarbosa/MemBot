import { createServer } from "./serverConfig.js";

const server = createServer();

console.log(`Listening on ${server.hostname}:${server.port}`);