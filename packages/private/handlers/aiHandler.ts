import { Message, Ollama } from "ollama";
import { ServerWebSocket } from "bun";
import { WebSocketMessage, Category } from "../utils/types.js";
import { storeEntry } from "../utils/storeEntry.js";
import { getLanguageStrings } from "../utils/languageStrings.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const MODEL_NAME = process.env.MODEL_NAME || "gemma2";

const ollama = new Ollama({
    host: process.env.OLLAMA_HOST || "http://localhost:11434",
});

// Store chat history
let chatHistory: Message[] = [];

export const handleInit = async (ws: ServerWebSocket<{ authToken: string }>) => {

    if (MODEL_NAME !== "gemini-1.5-flash") {
        const list = await ollama.list();

        if (list.models.find(model => model.name === `${MODEL_NAME}:latest`) === undefined) {
            console.log(`Installing ${MODEL_NAME}...`);
            const puller = await ollama.pull({
                model: MODEL_NAME,
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
    } else {
        ws.send('{ "type": "init" }');
    }
};

export const handleUserMessage = async (ws: ServerWebSocket<{ authToken: string }>, { content: messageData, categorize, language, user }: WebSocketMessage) => {
    // Add user message to chat history
    let userMessage: Message = { role: "user", content: messageData };
    ws.send(JSON.stringify({ type: "message", content: messageData, role: "user" } as WebSocketMessage));

    let category: Category | undefined;
    let entities: Record<string, any> = {};

    if (categorize) {
        category = await categorizeEntry(messageData);
        entities = await extractEntitiesBasedOnCategory(messageData, category);

        // Store the entry in the database
        if (category) {
            try {
                await storeEntry(category, entities, user);
                console.log("Entry stored successfully");
                const strings = getLanguageStrings(language);
                userMessage = { role: "user", content: `${strings.instructionFeedback1} ${category}. ${strings.instructionFeedback2}: ${JSON.stringify(entities)}.` };
            } catch (error) {
                console.error("Error storing entry:", error);
            }
        }
    }

    const id = Math.random().toString(36).substring(7);
    chatHistory.push(userMessage);

    if (MODEL_NAME !== "gemini-1.5-flash") {
        const response = await ollama.chat({
            model: MODEL_NAME,
            messages: chatHistory,
            stream: true
        });

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
            } as WebSocketMessage));
        }

        // Add assistant's full response to chat history
        const assistantMessage: Message = { role: "assistant", content: fullResponse };
        chatHistory.push(assistantMessage);
    } else {
        const chat = model.startChat({
            history: chatHistory.map(message => ({ role: message.role, parts: [{ text: message.content }] })),
        });

        const response = await chat.sendMessageStream(userMessage.content);

        let fullResponse = '';
        for await (const chunk of response.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            ws.send(JSON.stringify({
                id,
                type: "message",
                content: chunkText,
                role: "assistant",
                done: false,
                category: category,
            } as WebSocketMessage));
        }

        ws.send(JSON.stringify({
            id,
            type: "message",
            content: "",
            role: "assistant",
            done: true,
            category: category,
        } as WebSocketMessage));

        // Add assistant's full response to chat history
        const assistantMessage: Message = { role: "model", content: fullResponse };
        chatHistory.push(assistantMessage);
    }
};

async function categorizeEntry(entry: string): Promise<Category> {
    const prompt = `Categorize the following diary entry into one of these categories: financial, health and well-being, or relationships. Only respond with the category name.

Entry: ${entry}

Category:`;

    if (MODEL_NAME !== "gemini-1.5-flash") {
        const response = await ollama.generate({
            model: MODEL_NAME,
            prompt: prompt,
        });

        const category = response.response.trim().toLowerCase() as Category;
        return category;
    } else {
        const result = await model.generateContent(prompt);
        const response = result.response.text().trim();

        const category = response.toLowerCase() as Category;
        return category;
    }
}

function trimJSON(entry: string) {
    const firstOccurrence = entry.indexOf("{");
    const lastOccurrence = entry.lastIndexOf("}");
    const trimmed = entry.substring(firstOccurrence + 1, lastOccurrence);
    return `{${trimmed}}`;
}

async function extractEntitiesBasedOnCategory(entry: string, category: Category) {
    let prompt = `Extract the following information from this ${category} diary entry. Respond with a JSON object containing the specified fields. If any field is not present, set its value to null.

Entry: ${entry}

Fields to extract:`;

    switch (category) {
        case "financial":
            prompt += `
- description (string)
- amount (number)
- direction ("in" or "out")
- payment_method (string)`;
            break;
        case "health and well-being":
            prompt += `
- activity_type ("exercise", "meditation", or "other")
- duration (string, e.g. "30 minutes")
- intensity ("low", "medium", or "high")
- emotion_description (string)`;
            break;
        case "relationships":
            prompt += `
- person (string)
- interaction_type ("conversation", "activity", or "other")
- feelings (string)`;
            break;
        default:
            return {};
    }

    prompt += `

JSON:`;

    if (MODEL_NAME !== "gemini-1.5-flash") {
        const result = await ollama.generate({
            model: MODEL_NAME,
            prompt: prompt,
        });
        const response = trimJSON(result.response.trim());
        console.log("Extracted entities:", response);

        try {
            const result = JSON.parse(response);
            return result;
        } catch (error) {
            console.error("Failed to parse JSON response:", error);
            return {};
        }
    } else {
        const result = await model.generateContent(prompt);
        const response = trimJSON(result.response.text().trim());
        console.log("Extracted entities:", response);

        try {
            const parsedResult = JSON.parse(response);
            return parsedResult;
        } catch (error) {
            console.error("Failed to parse JSON response:", error);
            return {};
        }
    }
}
