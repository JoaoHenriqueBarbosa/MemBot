import { serveRest } from "./api/rest";
import { handleMessage } from "./handlers/messageHandler";
import { TextEncoderStream, TextDecoderStream } from "./polyfills/text-encoder-decoder";
import { verifyToken } from "./utils/jwt";
import { User } from "./utils/types";
// @ts-ignore
globalThis.TextEncoderStream ||= TextEncoderStream
// @ts-ignore
globalThis.TextDecoderStream ||= TextDecoderStream

const server = Bun.serve({
    port: 8081,
    async fetch(req, server) {
        let user: Partial<User> | undefined;
        const url = new URL(req.url);
        console.log("Request received:", req.method, req.url);

        // Verificação para WebSocket upgrade
        const connectionHeader = req.headers.get('connection');
        if (connectionHeader !== null && connectionHeader.toLocaleLowerCase() === 'upgrade') {
            console.log("WebSocket connection upgrade requested");
            const wsProtocol = req.headers.get('sec-websocket-protocol') || '';
            console.log("WebSocket protocol:", wsProtocol);
        
            user = verifyToken(wsProtocol);
            if (!user) {
                console.log("Unauthorized: Invalid WebSocket token");
                return new Response("Unauthorized", { status: 401 });
            }
        } else {
            const pathname = url.pathname;
            const method = req.method;
            console.log("Path:", pathname);
            console.log("Method:", method);
        
            // Verificação para autenticação de API
            if (!["/api/auth/register", "/api/auth/login"].includes(pathname) && method !== "OPTIONS") {
                const authHeader = req.headers.get('Authorization');
                console.log("Authorization Header:", authHeader);
        
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.substring(7);
                    console.log("Token:", token);
        
                    user = verifyToken(token);
                    if (!user) {
                        console.log("Unauthorized: Invalid Token");
                        return new Response("Unauthorized", { status: 401 });
                    }
                } else {
                    console.log("Unauthorized: No Bearer Token");
                    return new Response("Unauthorized", { status: 401 });
                }
            }
        }
        
        

        const restResponse = await serveRest(req, url, user);
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