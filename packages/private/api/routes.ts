import { getBalance, getFinancial, getTotalExpense, getTotalIncome } from "./handlers/financial.js";
import { getGeneralEntries } from "./handlers/general.js";
import { getHealthWellbeingEntries, getTotalExerciseTime, getAverageEmotionIntensity } from "./handlers/health_wellbeing.js";
import { getRelationships, getTotalInteractions, getMostFrequentPerson } from "./handlers/relationships.js";

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
};