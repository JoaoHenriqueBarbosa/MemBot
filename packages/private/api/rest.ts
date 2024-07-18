import { routeActions } from "./routes.js";

export async function serveRest(req: Request): Promise<boolean | Response> {
    const url = new URL(req.url);
    if (url.pathname in routeActions) {
        const response = await routeActions[url.pathname](req);
        return response;
    }
    return false;
}