
export const getFinancial = async (req: Request) => {
    return new Response("Financial API");
};

export const getTotalIncome = async (req: Request) => {
    return new Response("Total Income API");
}

export const getTotalExpense = async (req: Request) => {
    return new Response("Total Expense API");
}

export const getBalance = async (req: Request) => {
    return new Response("Balance API");
}