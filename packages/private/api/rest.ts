import { ClientResponse } from "../db/response.js";
import { routeActions } from "./routes.js";

export async function serveRest(req: Request): Promise<boolean | Response> {
    const url = new URL(req.url);
    if (url.pathname in routeActions) {
        if (req.method === "OPTIONS") {
            return new ClientResponse(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        const response = await routeActions[url.pathname](req);
        return response;
    }
    return false;
}