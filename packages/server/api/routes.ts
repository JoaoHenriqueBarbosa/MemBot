import { financialHandler } from "./handlers/financial.js";

export const routeActions: Record<string, (req: Request) => Promise<Response>> = {
    "/api/financial": financialHandler
};
