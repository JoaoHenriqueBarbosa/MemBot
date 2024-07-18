import { getBalance, getFinancial, getTotalExpense, getTotalIncome } from "./handlers/financial.js";
import { getGeneralEntries } from "./handlers/general.js";
import { getHealthWellbeingEntries, getTotalExerciseTime, getAverageEmotionIntensity } from "./handlers/health_wellbeing.js";
import { getRelationships, getTotalInteractions, getMostFrequentPerson } from "./handlers/relationships.js";
import { handleRegister, handleLogin, handleVerifyEmail } from "./handlers/auth.js";
import { User } from "../utils/types.js";
import { ClientResponse } from "../db/response.js";

export const routeActions: Record<string, (req: Request, user: Partial<User>) => Promise<ClientResponse>> = {
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
};

export const authRouteActions: Record<string, (req: Request) => Promise<ClientResponse>> = {
    "/api/auth/register": handleRegister,
    "/api/auth/login": handleLogin,
    "/api/auth/verify-email": handleVerifyEmail,
};

export const authRoutes = Object.keys(authRouteActions);