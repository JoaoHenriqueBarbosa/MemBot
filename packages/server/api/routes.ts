import { getBalance, getFinancial, getTotalExpense, getTotalIncome } from "./handlers/financial.js";
import { getGeneralEntries } from "./handlers/general.js";

export const routeActions: Record<string, (req: Request) => Promise<Response>> = {
    "/api/financial": getFinancial,
    "/api/financial/income": getTotalIncome,
    "/api/financial/expense": getTotalExpense,
    "/api/financial/balance": getBalance,
    "/api/general": getGeneralEntries,
};
