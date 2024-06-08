import { Message as OllamaMessage } from "ollama";

export type { OllamaMessage as Message };

export type WebSocketMessage = {
    type: "message" | "init" | "pull-progress";
    id?: string;
    role?: "user" | "assistant";
    done?: boolean;
    data?: any;
};
