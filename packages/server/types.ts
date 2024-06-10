export type WebSocketMessage = {
    type: "message" | "init" | "pull-progress";
    categorize?: boolean;
    id?: string;
    role?: "user" | "assistant";
    done?: boolean;
    content?: any;
    category?: string;
};

export type Category = "financial" | "health and well-being" | "work/projects" | "relationships" | "goals/progress";
