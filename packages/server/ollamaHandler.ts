import ollama, { Message } from "ollama";
import { ServerWebSocket } from "bun";
import { WebSocketMessage } from "./types.js";

// Store chat history
let chatHistory: Message[] = [];

export const handleInit = async (ws: ServerWebSocket<{ authToken: string }>) => {
    const list = await ollama.list();

    if (list.models.find(model => model.name === "gemma2:latest") === undefined) {
        console.log("Installing gemma2...");
        const puller = await ollama.pull({
            model: "gemma2",
            stream: true
        });

        for await (const progress of puller) {
            ws.send(JSON.stringify({
                type: "pull-progress",
                content: progress
            }));
        }
    } else {
        ws.send('{ "type": "init" }');
    }
};

export const handleUserMessage = async (ws: ServerWebSocket<{ authToken: string }>, messageData: string) => {
    // Add user message to chat history
    const userMessage: Message = { role: "user", content: messageData };
    chatHistory.push(userMessage);
    ws.send(JSON.stringify({ type: "message", content: messageData, role: "user" } as WebSocketMessage));

    const response = await ollama.chat({
        model: "gemma2",
        messages: chatHistory,
        stream: true
    });

    const id = Math.random().toString(36).substring(7);
    let fullResponse = "";

    for await (const chunk of response) {
        fullResponse += chunk.message.content;
        ws.send(JSON.stringify({
            type: "message",
            id,
            content: chunk.message.content,
            role: "assistant",
            done: chunk.done
        } as WebSocketMessage));
    }

    // Add assistant's full response to chat history
    const assistantMessage: Message = { role: "assistant", content: fullResponse };
    chatHistory.push(assistantMessage);
};
