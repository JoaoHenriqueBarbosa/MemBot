import { getBalance, getFinancial, getTotalExpense, getTotalIncome } from "./handlers/financial.js";
import { getGeneralEntries } from "./handlers/general.js";
import { getHealthWellbeingEntries, getTotalExerciseTime, getAverageEmotionIntensity } from "./handlers/health_wellbeing.js";
import { getRelationships, getTotalInteractions, getMostFrequentPerson } from "./handlers/relationships.js";
import { registerUser, loginUser } from "./handlers/auth.js";
import { AuthResponse, User } from "../utils/types.js";
import { ClientResponse } from "../db/response.js";


export const routeActions: Record<string, (req: Request, user?: Partial<User>) => Promise<ClientResponse>> = {
    "/api/financial": async (req: Request, user?: Partial<User>) => {

        return getFinancial(req);
    },
    "/api/financial/income": async (req: Request, user?: Partial<User>) => {

        return getTotalIncome(req);
    },
    "/api/financial/expense": async (req: Request, user?: Partial<User>) => {

        return getTotalExpense(req);
    },
    "/api/financial/balance": async (req: Request, user?: Partial<User>) => {

        return getBalance(req);
    },
    "/api/general": async (req: Request, user?: Partial<User>) => {

        return getGeneralEntries(req);
    },
    "/api/health-wellbeing": async (req: Request, user?: Partial<User>) => {

        return getHealthWellbeingEntries(req);
    },
    "/api/health-wellbeing/exercise-time": async (req: Request, user?: Partial<User>) => {

        return getTotalExerciseTime(req);
    },
    "/api/health-wellbeing/emotion-intensity": async (req: Request, user?: Partial<User>) => {

        return getAverageEmotionIntensity(req);
    },
    "/api/relationships": async (req: Request, user?: Partial<User>) => {

        return getRelationships(req);
    },
    "/api/relationships/total-interactions": async (req: Request, user?: Partial<User>) => {

        return getTotalInteractions(req);
    },
    "/api/relationships/most-frequent-person": async (req: Request, user?: Partial<User>) => {

        return getMostFrequentPerson(req);
    },
    "/api/auth/register": async (req: Request) => {
        const { username, password } = await req.json() as User;
        const result = await registerUser(username, password);
        const response: AuthResponse = result
            ? { success: true, message: "User registered successfully", user: result.user, token: result.token }
            : { success: false, message: "Failed to register user" };
        return new ClientResponse(JSON.stringify(response), { status: result ? 201 : 400 });
    },
    "/api/auth/login": async (req: Request) => {
        const { username, password } = await req.json() as User;
        const result = await loginUser(username, password);
        const response: AuthResponse = result
            ? { success: true, message: "Login successful", user: result.user, token: result.token }
            : { success: false, message: "Invalid username or password" };
        return new ClientResponse(JSON.stringify(response), { status: result ? 200 : 401 });
    },
};
