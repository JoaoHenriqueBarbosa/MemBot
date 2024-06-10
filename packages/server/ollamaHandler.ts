import ollama, { Message } from "ollama";
import { ServerWebSocket } from "bun";
import { WebSocketMessage, Category } from "./types.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/community/llms/ollama";

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

export const handleUserMessage = async (ws: ServerWebSocket<{ authToken: string }>, messageData: WebSocketMessage) => {
    // Add user message to chat history
    const userMessage: Message = { role: "user", content: messageData.content };
    chatHistory.push(userMessage);
    ws.send(JSON.stringify({ ...messageData, role: "user" }));

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
            done: chunk.done,
            category: messageData.category
        } as WebSocketMessage));
    }

    // Add assistant's full response to chat history
    const assistantMessage: Message = { role: "assistant", content: fullResponse };
    chatHistory.push(assistantMessage);
};

export const categorizeMessage = async (content: string): Promise<Category> => {
    const categories = ["financial", "health and well-being", "work/projects", "relationships", "goals/progress"];

    const lcOllama = new Ollama({
        baseUrl: "http://localhost:11434", // Default value
        model: "gemma2", // Default value
    });

    if (!lcOllama) {
        throw new Error("Failed to create Ollama instance");
    }

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You are a diary entry bot. You are here to help users categorize their diary entries. You categorize diary entries into one of the following categories: {categories}."],
        ["user", "{content}. Your response will be only one word. What category does this diary entry belong to?"],
    ]);

    if (!promptTemplate) {
        throw new Error("Failed to create prompt template");
    }

    const lcOllamaWithPrompt = lcOllama.withStructuredOutput(promptTemplate);

    const response = await lcOllamaWithPrompt.invoke(promptTemplate, {
        content,
        categories
    });

    console.log(JSON.stringify(response, null, 2));

    return response.toString() as Category;
};
