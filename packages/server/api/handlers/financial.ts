import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";

const pool = db.getPool();

export const getFinancial = async (req: Request) => {
    try {
        const result = await pool.query('SELECT * FROM financial ORDER BY entry_date DESC');
        return new ClientResponse(JSON.stringify(result.rows));
    } catch (error) {
        console.error('Error fetching financial entries:', error);
        return new ClientResponse('Error fetching financial entries', { status: 500 });
    }
};

export const getTotalIncome = async (req: Request) => {
    try {
        const result = await pool.query('SELECT SUM(amount) as total_income FROM financial WHERE direction = \'in\'');
        return new ClientResponse(JSON.stringify({ totalIncome: result.rows[0].total_income || 0 }));
    } catch (error) {
        console.error('Error calculating total income:', error);
        return new ClientResponse('Error calculating total income', { status: 500 });
    }
}

export const getTotalExpense = async (req: Request) => {
    try {
        const result = await pool.query('SELECT SUM(amount) as total_expense FROM financial WHERE direction = \'out\'');
        return new ClientResponse(JSON.stringify({ totalExpense: result.rows[0].total_expense || 0 }));
    } catch (error) {
        console.error('Error calculating total expense:', error);
        return new ClientResponse('Error calculating total expense', { status: 500 });
    }
}

export const getBalance = async (req: Request) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN direction = 'in' THEN amount ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN direction = 'out' THEN amount ELSE 0 END), 0) as balance
            FROM financial
        `);
        return new ClientResponse(JSON.stringify({ balance: result.rows[0].balance || 0 }));
    } catch (error) {
        console.error('Error calculating balance:', error);
        return new ClientResponse('Error calculating balance', { status: 500 });
    }
}
