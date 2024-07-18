import { serveRest } from "./api/rest";
import { handleMessage } from "./handlers/messageHandler";
import { TextEncoderStream, TextDecoderStream } from "./polyfills/text-encoder-decoder";
import { authenticateRequest, authenticateWebSocket } from "./middleware/auth";
import { ClientResponse } from "./db/response";

// @ts-ignore
globalThis.TextEncoderStream ||= TextEncoderStream
// @ts-ignore
globalThis.TextDecoderStream ||= TextDecoderStream

const server = Bun.serve({
    port: 8081,
    async fetch(req, server) {
        try {
            const url = new URL(req.url);
            const connectionHeader = req.headers.get('connection');

            if (connectionHeader !== null && connectionHeader.toLowerCase() === 'upgrade') {
                console.log("WebSocket connection upgrade requested");
                const wsProtocol = req.headers.get('sec-websocket-protocol') || '';
                authenticateWebSocket(wsProtocol);
                if (server.upgrade(req)) {
                    return;
                }
                return new ClientResponse("Upgrade failed", { status: 500 });
            } else {
                const user = await authenticateRequest(req);
                const restResponse = await serveRest(req, url, user);
                if (restResponse) {
                    return restResponse as Response;
                }
            }
        } catch (error) {
            if (error instanceof Error && error.message === "Unauthorized") {
                return new ClientResponse("Unauthorized", { status: 401 });
            }
            console.error("Server error:", error);
            return new ClientResponse("Internal Server Error", { status: 500 });
        }
    },
    websocket: {
        message: handleMessage,
    },
});

console.log(`Listening on localhost:${server.port}`);
