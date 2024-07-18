import { ServerWebSocket } from "bun";
import { handleInit, handleUserMessage } from "./aiHandler.js";

const MODEL_NAME = process.env.MODEL_NAME || "gemma2";

export const handleMessage = async (ws: ServerWebSocket<{ authToken: string }>, message: string | Buffer) => {

    try {
        const messageObject = JSON.parse(message as string);
        console.log(`Received message: ${message}`);

        if (messageObject.type === "init") {
            await handleInit(ws);
        } else if (messageObject.type === "message") {
            await handleUserMessage(ws, messageObject.content, messageObject.language, messageObject.categorize);
        }
    } catch (e: any) {
        console.log(e.toString());
        if (MODEL_NAME !== "gemini-1.5-flash" && e.toString().includes("ConnectionRefused: Unable to connect. Is the computer able to access the url?")) {
            ws.send("docker-not-running");
        }
        console.log(e);
        console.error(`Failed to parse message: ${message}`);
    }
};
