export interface WebSocketMessage {
    type: "message" | "init" | "pull-progress";
    categorize?: boolean;
    id?: string;
    role?: "user" | "assistant";
    done?: boolean;
    content?: unknown;
    category?: Category;
}

export type Category = "financial" | "health and well-being" | "work/projects" | "relationships" | "goals/progress";
