import { ServerWebSocket } from "bun";
import { handleInit, handleUserMessage, categorizeMessage } from "./ollamaHandler.js";
import { WebSocketMessage } from "./types.js";

export const handleMessage = async (ws: ServerWebSocket<{ authToken: string }>, message: string | Buffer) => {
    try {
        const messageObject = JSON.parse(message as string) as WebSocketMessage;
        console.log(`Received message: ${message}`);

        switch (messageObject.type) {
            case "init":
                await handleInit(ws);
                break;
            case "message":
                if (messageObject.categorize) {
                    const category = await categorizeMessage(messageObject.content);
                    messageObject.category = category;
                }
                await handleUserMessage(ws, messageObject);
                break;
            case "pull-progress":
                // Just forward the pull-progress message to the client
                ws.send(JSON.stringify(messageObject));
                break;
            default:
                console.warn(`Unknown message type: ${messageObject.type}`);
        }
    } catch (e) {
        console.log(e);
        console.error(`Failed to parse message: ${message}`);
    }
};
