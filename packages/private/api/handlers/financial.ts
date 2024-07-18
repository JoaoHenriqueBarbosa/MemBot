import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";
import { User } from "../../utils/types.js";

const pool = db.getPool();

export const getFinancial = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query('SELECT * FROM financial WHERE user_id = $1 ORDER BY entry_date DESC', [user.id]);
        return new ClientResponse(JSON.stringify(result.rows));
    } catch (error) {
        console.error('Error fetching financial entries:', error);
        return new ClientResponse('Error fetching financial entries', { status: 500 });
    }
};

export const getTotalIncome = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query('SELECT SUM(amount) as total_income FROM financial WHERE direction = \'in\' AND user_id = $1', [user.id]);
        return new ClientResponse(JSON.stringify({ totalIncome: result.rows[0].total_income || 0 }));
    } catch (error) {
        console.error('Error calculating total income:', error);
        return new ClientResponse('Error calculating total income', { status: 500 });
    }
}

export const getTotalExpense = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query('SELECT SUM(amount) as total_expense FROM financial WHERE direction = \'out\' AND user_id = $1', [user.id]);
        return new ClientResponse(JSON.stringify({ totalExpense: result.rows[0].total_expense || 0 }));
    } catch (error) {
        console.error('Error calculating total expense:', error);
        return new ClientResponse('Error calculating total expense', { status: 500 });
    }
}

export const getBalance = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN direction = 'in' THEN amount ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN direction = 'out' THEN amount ELSE 0 END), 0) as balance
            FROM financial
            WHERE user_id = $1
        `, [user.id]);
        return new ClientResponse(JSON.stringify({ balance: result.rows[0].balance || 0 }));
    } catch (error) {
        console.error('Error calculating balance:', error);
        return new ClientResponse('Error calculating balance', { status: 500 });
    }
}
