import { ServerWebSocket } from "bun";
import { handleInit, handleUserMessage, handleCategorization } from "./ollamaHandler.js";
import { WebSocketMessage, CategorizedMessage } from "./types.js";

export const handleMessage = async (ws: ServerWebSocket<{ authToken: string }>, message: string | Buffer) => {
    try {
        const messageObject = JSON.parse(message as string) as WebSocketMessage;
        console.log(`Received message: ${message}`);

        if (messageObject.type === "init") {
            await handleInit(ws);
        } else if (messageObject.type === "message") {
            if (messageObject.categorize) {
                await handleCategorization(ws, messageObject as CategorizedMessage);
            } else {
                await handleUserMessage(ws, messageObject.content);
            }
        }
    } catch (e) {
        console.log(e);
        console.error(`Failed to parse message: ${message}`);
    }
};
