import { getBalance, getFinancial, getTotalExpense, getTotalIncome } from "./handlers/financial.js";
import { getGeneralEntries } from "./handlers/general.js";
import { getHealthWellbeingEntries, getTotalExerciseTime, getAverageEmotionIntensity } from "./handlers/health_wellbeing.js";
import { getRelationships, getTotalInteractions, getMostFrequentPerson } from "./handlers/relationships.js";
import { registerUser, loginUser } from "./handlers/auth.js";
import { AuthResponse, User } from "../utils/types.js";
import { ClientResponse } from "../db/response.js";

export const routeActions: Record<string, (req: Request) => Promise<Response>> = {
    "/api/financial": getFinancial,
    "/api/financial/income": getTotalIncome,
    "/api/financial/expense": getTotalExpense,
    "/api/financial/balance": getBalance,
    "/api/general": getGeneralEntries,
    "/api/health-wellbeing": getHealthWellbeingEntries,
    "/api/health-wellbeing/exercise-time": getTotalExerciseTime,
    "/api/health-wellbeing/emotion-intensity": getAverageEmotionIntensity,
    "/api/relationships": getRelationships,
    "/api/relationships/total-interactions": getTotalInteractions,
    "/api/relationships/most-frequent-person": getMostFrequentPerson,
    "/api/auth/register": async (req: Request) => {
        const { username, password } = await req.json() as User;
        const user = await registerUser(username, password);
        const response: AuthResponse = user
            ? { success: true, message: "User registered successfully", user }
            : { success: false, message: "Failed to register user" };
        return new ClientResponse(JSON.stringify(response), { status: user ? 201 : 400 });
    },
    "/api/auth/login": async (req: Request) => {
        const { username, password } = await req.json() as User;
        const user = await loginUser(username, password);
        const response: AuthResponse = user
            ? { success: true, message: "Login successful", user }
            : { success: false, message: "Invalid username or password" };
        return new ClientResponse(JSON.stringify(response), { status: user ? 200 : 401 });
    },
};
