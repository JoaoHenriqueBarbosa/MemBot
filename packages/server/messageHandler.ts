import { ServerWebSocket } from "bun";
import { handleInit, handleUserMessage } from "./ollamaHandler.js";

export const handleMessage = async (ws: ServerWebSocket<{ authToken: string }>, message: string | Buffer) => {
    try {
        const messageObject = JSON.parse(message as string);
        console.log(`Received message: ${message}`);

        if (messageObject.type === "init") {
            await handleInit(ws);
        } else if (messageObject.type === "message") {
            await handleUserMessage(ws, messageObject.data);
        }
    } catch (e) {
        console.log(e);
        console.error(`Failed to parse message: ${message}`);
    }
};
