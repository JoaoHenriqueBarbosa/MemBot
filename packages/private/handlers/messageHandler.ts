import type { ServerWebSocket } from "bun";
import { handleInit, handleUserMessage } from "./aiHandler.js";
import { WebSocketMessage } from "../utils/types.js";
import { resolveProvider } from "../ai/models.js";

export const handleMessage = async (
  ws: ServerWebSocket<{ authToken: string }>,
  message: string | Buffer,
) => {
  try {
    const messageObject = JSON.parse(message as string) as WebSocketMessage;
    console.log(`Received message: ${message}`);

    if (messageObject.type === "init") {
      await handleInit(ws);
    } else if (messageObject.type === "message") {
      await handleUserMessage(ws, messageObject);
    }
  } catch (e: any) {
    const text = e?.toString?.() ?? String(e);
    // Local Ollama not reachable -> tell the UI to show the "start Docker" hint.
    if (
      resolveProvider() === "ollama" &&
      (text.includes("ConnectionRefused") || text.includes("ECONNREFUSED"))
    ) {
      ws.send("docker-not-running");
    }
    console.error(`Failed to handle message: ${message}`, e);
  }
};
