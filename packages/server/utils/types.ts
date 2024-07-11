export type WebSocketMessage = {
    type: "message" | "init" | "pull-progress" | "request_info" | "additional_info";
    categorize?: boolean;
    id?: string;
    role?: "user" | "assistant";
    done?: boolean;
    content?: any;
    category?: Category;
    entityName?: string;
    language?: string;
};

export type Category = "financial" | "health and well-being" | "work/projects" | "relationships" | "goals/progress";
