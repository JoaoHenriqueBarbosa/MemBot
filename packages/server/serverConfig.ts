import { handleMessage } from "./messageHandler.js";

export const createServer = () => {
    return Bun.serve<{ authToken: string }>({
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
        hostname: process.env.HOST || 'localhost',
        async fetch(req, server) {
            if (server.upgrade(req)) {
                return;
            }
            return new Response("Upgrade failed", { status: 500 });
        },
        websocket: {
            message: handleMessage,
        },
    });
};              