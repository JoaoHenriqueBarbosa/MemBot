import ollama from "ollama";
import { ServerWebSocket } from "bun";
import { Message } from "./types.js";

// Store chat history
let chatHistory: Omit<Message, 'type' | 'id' | 'done' | 'data'>[] = [];

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
                data: progress
            }));
        }
    } else {
        ws.send('{ "type": "init" }');
    }
};

export const handleUserMessage = async (ws: ServerWebSocket<{ authToken: string }>, messageData: string) => {
    // Add user message to chat history
    chatHistory.push({ role: "user", content: messageData });
    ws.send(JSON.stringify({ type: "message", data: messageData, role: "user", content: messageData }));

    const response = await ollama.chat({
        model: "gemma2",
        messages: chatHistory,
        stream: true
    });

    const id = Math.random().toString(36).substring(7);
    let fullResponse = "";

    for await (const message of response) {
        fullResponse += message.message.content;
        ws.send(JSON.stringify({ type: "message", id, data: message.message.content, role: "robot", done: message.done, content: message.message.content }));
    }

    // Add assistant's full response to chat history
    chatHistory.push({ role: "assistant", content: fullResponse });
};
