import ollama from "ollama";
import { ServerWebSocket } from "bun";

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
    ws.send(JSON.stringify({ type: "message", data: messageData, role: "user" }));

    const response = await ollama.chat({
        model: "gemma2",
        messages: [{
            role: "user",
            content: messageData
        }],
        stream: true
    });

    const id = Math.random().toString(36).substring(7);

    for await (const message of response) {
        ws.send(JSON.stringify({ type: "message", id, data: message.message.content, role: "robot", done: message.done }));
    }
};
