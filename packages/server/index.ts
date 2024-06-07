import { Message } from "./types.js";
import { createServer } from "./serverConfig.js";

const server = createServer();

console.log(`Listening on ${server.hostname}:${server.port}`);

export type { Message };
