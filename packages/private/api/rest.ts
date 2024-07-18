import { ClientResponse } from "../db/response.js";
import { User } from "../utils/types.js";
import { authRouteActions, routeActions } from "./routes.js";

export async function serveRest(req: Request, url: any, user: Partial<User>): Promise<boolean | Response> {
    if (url.pathname in routeActions) {
        const response = await routeActions[url.pathname](req, user);
        return response;
    }
    return false;
}

export async function serveAuth(req: Request, url: any): Promise<boolean | Response> {
    if (req.method === "OPTIONS") {
        return new ClientResponse("OK");
    }
    if (url.pathname in authRouteActions) {

        const response = await authRouteActions[url.pathname](req);
        return response;
    }
    return false;
}