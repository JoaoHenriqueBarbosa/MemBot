import { ServerWebSocket } from "bun";
import { handleInit, handleUserMessage, categorizeMessage } from "./ollamaHandler.js";
import { WebSocketMessage } from "./types.js";

export const handleMessage = async (ws: ServerWebSocket<{ authToken: string }>, message: string | Buffer) => {
    try {
        const messageObject = JSON.parse(message as string) as WebSocketMessage;
        console.log(`Received message: ${message}`);

        if (messageObject.type === "init") {
            await handleInit(ws);
        } else if (messageObject.type === "message") {
            if (messageObject.categorize) {
                const category = await categorizeMessage(messageObject.content);
                messageObject.category = category;
            }
            await handleUserMessage(ws, messageObject);
        }
    } catch (e) {
        console.log(e);
        console.error(`Failed to parse message: ${message}`);
    }
};
