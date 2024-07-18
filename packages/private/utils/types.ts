export type WebSocketMessage = {
    type: "message" | "init" | "pull-progress" | "request_info" | "additional_info";
    categorize?: boolean;
    id?: string;
    role?: "user" | "assistant";
    done?: boolean;
    content?: any;
    category?: Category;
    entityName?: string;
    language: string;
    user: Partial<User>;
};

export type Category = "financial" | "health and well-being" | "work/projects" | "relationships" | "goals/progress";

export type User = {
    id: number;
    username: string;
    password: string;
};

export type AuthResponse = {
    success: boolean;
    message: string;
    user?: Partial<User>;
    token?: string;
};
