export type WebSocketMessage = {
    type: "message" | "init" | "pull-progress";
    id?: string;
    role?: "user" | "assistant";
    done?: boolean;
    content?: any;
};
