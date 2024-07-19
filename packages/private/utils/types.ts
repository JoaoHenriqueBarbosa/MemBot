export type WebSocketMessage = {
    type: "message" | "init" | "pull-progress" | "request_info";
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

export type Category = "financial" | "health and well-being" | "relationships";

export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
};

export type AuthResponse = {
    success: boolean;
    message: string;
    user?: Partial<User>;
    token?: string;
};
