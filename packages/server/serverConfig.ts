import { handleMessage } from "./messageHandler.js";
import { serveRest } from "./api/rest.js";

export const createServer = () => {
    return Bun.serve<{ authToken: string }>({
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
        hostname: process.env.HOST || 'localhost',
        async fetch(req, server) {
            const restResponse = await serveRest(req);
            if (restResponse) {
                return restResponse as Response;
            } else if (server.upgrade(req)) {
                return;
            }
            return new Response("Upgrade failed", { status: 500 });
        },
        websocket: {
            message: handleMessage,
        },
    });
};