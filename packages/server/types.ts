export type WebSocketMessage = {
    type: "message" | "init" | "pull-progress";
    categorize?: boolean;
    id?: string;
    role?: "user" | "assistant";
    done?: boolean;
    content?: any;
};
