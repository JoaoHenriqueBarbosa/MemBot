import ollama, { Message } from "ollama";
import { ServerWebSocket } from "bun";
import { WebSocketMessage, Category } from "../utils/types.js";
import { storeEntry } from "../utils/storeEntry.js";
import { getLanguageStrings } from "../utils/languageStrings.js";

const MODEL_NAME = process.env.MODEL_NAME || "gemma2";

// Store chat history                                                                                                                                     
let chatHistory: Message[] = [];

const strings = getLanguageStrings();

export const handleInit = async (ws: ServerWebSocket<{ authToken: string }>) => {
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
};

export const handleUserMessage = async (ws: ServerWebSocket<{ authToken: string }>, messageData: string, categorize: boolean = false) => {
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
                await storeEntry(category, entities);
                console.log("Entry stored successfully");
                userMessage = { role: "user", content: `${strings.instructionFeedback1} ${category}. ${strings.instructionFeedback2}: ${JSON.stringify(entities)}.` };
            } catch (error) {
                console.error("Error storing entry:", error);
            }
        }
    }
    chatHistory.push(userMessage);

    const response = await ollama.chat({
        model: MODEL_NAME,
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
        model: MODEL_NAME,
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
- meal_description (string)
- calories (number)
- emotion_description (string)
- emotion_intensity (number between 1 and 10)
- trigger (string)
- medical_appointment_date (date string)
- specialty (string)
- consultation_reason (string)
- recommendations (string)`;
            break;
        case "work/projects":
            prompt += `
- task_description (string)
- task_status ("pending", "in_progress", or "completed")
- priority ("low", "medium", or "high")
- meeting_date (date string)
- participants (string)
- topics_discussed (string)
- decisions_made (string)
- progress_report (string)
- obstacles_faced (string)`;
            break;
        case "relationships":
            prompt += `
- person (string)
- interaction_type ("conversation", "activity", or "other")
- interaction_description (string)
- feelings (string)
- event_date (date string)
- event_description (string)
- emotional_impact (string)
- conflict_description (string)
- resolution (string)`;
            break;
        case "goals/progress":
            prompt += `
- goal_start_date (date string)
- goal_end_date (date string)
- goal_description (string)
- status ("not_started", "in_progress", "completed", or "abandoned")
- milestones (string)
- progress (string)`;
            break;
        default:
            return {};
    }

    prompt += `

JSON:`;

    const response = await ollama.generate({
        model: MODEL_NAME,
        prompt: prompt,
    });
    console.log("Extracted entities:", trimJSON(response.response.trim()));

    try {
        const result = JSON.parse(trimJSON(response.response.trim()));
        return result;
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        return {};
    }
}