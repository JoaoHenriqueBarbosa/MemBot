import { ClientResponse } from "../db/response.js";
import { User } from "../utils/types.js";
import { routeActions } from "./routes.js";

export async function serveRest(req: Request, url: any, user?: Partial<User>): Promise<boolean | Response> {
    if (url.pathname in routeActions) {
        if (req.method === "OPTIONS") {
            return new ClientResponse("OK");
        }

        const response = await routeActions[url.pathname](req, user);
        return response;
    }
    return false;
}