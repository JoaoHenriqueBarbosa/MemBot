import { serveRest } from "./api/rest";
import { handleMessage } from "./handlers/messageHandler";
import { TextEncoderStream, TextDecoderStream } from "./polyfills/text-encoder-decoder";
// @ts-ignore
globalThis.TextEncoderStream ||= TextEncoderStream
// @ts-ignore
globalThis.TextDecoderStream ||= TextDecoderStream

const server = Bun.serve({
    port: 8081,
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

console.log(`Listening on localhost:${server.port}`);