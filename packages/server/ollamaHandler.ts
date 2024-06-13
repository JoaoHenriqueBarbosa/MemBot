import ollama, { Message } from "ollama";
import { ServerWebSocket } from "bun";
import { WebSocketMessage, Category } from "./types.js";

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

export const handleUserMessage = async (ws: ServerWebSocket<{ authToken: string }>, messageData: string, categorize: boolean = false) => {
    // Add user message to chat history
    const userMessage: Message = { role: "user", content: messageData };
    chatHistory.push(userMessage);
    ws.send(JSON.stringify({ type: "message", content: messageData, role: "user" } as WebSocketMessage));

    let category: Category | undefined;
    let product: string | null = null;
    let quantity: number | null = null;

    if (categorize) {
        category = await categorizeEntry(messageData);
        if (category === "financial") {
            const entities = await extractEntitiesBasedOnCategory(messageData, category);
            product = entities.product;
            quantity = entities.quantity;
        }
    }

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
            category: category,
            product: product,
            quantity: quantity
        } as WebSocketMessage));
    }

    // Add assistant's full response to chat history
    const assistantMessage: Message = { role: "assistant", content: fullResponse };
    chatHistory.push(assistantMessage);
};

async function categorizeEntry(entry: string): Promise<Category> {
    const prompt = `Categorize the following diary entry into one of these categories: financial, health and well-being, work/projects, relationships, or goals/progress. Only respond with the category name.

Entry: ${entry}

Category:`;

    const response = await ollama.generate({
        model: "gemma2",
        prompt: prompt,
    });

    const category = response.response.trim().toLowerCase() as Category;
    return category;
}

function trimJSON(entry: string) {
    const firstOccurrence = entry.indexOf("{");
    const lastOccurrence = entry.lastIndexOf("}");
    const trimmed = entry.substring(firstOccurrence + 1, lastOccurrence);
    return `{${trimmed}}`;
}

async function extractEntitiesBasedOnCategory(entry: string, category: Category) {
    if (category === "financial") {
        const prompt = `Extract the product and quantity from the following financial diary entry. Respond with a JSON object containing "product", "quantity" and "price" fields. If either is not present, set the value to null.

Entry: ${entry}

JSON:`;

        const response = await ollama.generate({
            model: "gemma2",
            prompt: prompt,
        });
        console.log("Extracted entities:", trimJSON(response.response.trim()));

        try {
            const result = JSON.parse(trimJSON(response.response.trim()));
            return {
                product: result.product || null,
                quantity: result.quantity !== undefined ? Number(result.quantity) : null
            };
        } catch (error) {
            console.error("Failed to parse JSON response:", error);
            return { product: null, quantity: null };
        }
    }

    return { product: null, quantity: null };
}
