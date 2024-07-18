import { verifyToken } from "../utils/jwt";
import { User } from "../utils/types";

export async function authenticateRequest(req: Request): Promise<Partial<User> | undefined> {


    const authHeader = req.headers.get('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const user = verifyToken(token);
        if (!user) {
            console.log("Unauthorized: Invalid Token");
            throw new Error("Unauthorized");
        }
        return user;
    } else {
        console.log("Unauthorized: No Bearer Token");
        throw new Error("Unauthorized");
    }
}

export function authenticateWebSocket(protocol: string): Partial<User> | undefined {
    const user = verifyToken(protocol);
    if (!user) {
        console.log("Unauthorized: Invalid WebSocket token");
        throw new Error("Unauthorized");
    }
    return user;
}
