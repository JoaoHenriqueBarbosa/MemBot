const rawProtocol = import.meta.env.VITE_API_PROTOCOL || "http";

export const API_HOST = import.meta.env.VITE_API_URL || "";
export const API_PROTOCOL = rawProtocol;
// http -> ws, https -> wss. Guarded so a missing env var can't throw at import time.
export const WS_PROTOCOL = rawProtocol.replace("http", "ws");
