import ollama, { Message } from "ollama";
import { ServerWebSocket } from "bun";
import { WebSocketMessage, CategorizedMessage, Category } from "./types.js";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

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

export const handleCategorization = async (ws: ServerWebSocket<{ authToken: string }>, message: CategorizedMessage) => {
    const model = new ChatOpenAI({
        modelName: "gemma2",
        temperature: 0,
    });

    const prompt = `Categorize the following diary entry into one of these categories: financial, health and well-being, work/projects, relationships, or goals/progress. Only respond with the category name.

Entry: "${message.content}"`;

    const response = await model.call([new HumanMessage(prompt)]);
    const category = response.content as Category;

    ws.send(JSON.stringify({
        type: "message",
        id: message.id,
        content: message.content,
        role: "user",
        category: category,
        done: true
    } as CategorizedMessage));

    // Here you would typically save the categorized entry to the database
    console.log(`Categorized entry: ${message.content} as ${category}`);
};
