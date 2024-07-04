import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";

const pool = db.getPool();

export const getGoalsProgress = async (req: Request) => {
    try {
        const result = await pool.query('SELECT * FROM goals_progress ORDER BY goal_start_date DESC LIMIT 10');
        return new ClientResponse(JSON.stringify(result.rows));
    } catch (error) {
        console.error('Error fetching goals and progress entries:', error);
        return new ClientResponse('Error fetching goals and progress entries', { status: 500 });
    }
};

export const getTotalGoals = async (req: Request) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as total FROM goals_progress');
        return new ClientResponse(JSON.stringify({ total: parseInt(result.rows[0].total) || 0 }));
    } catch (error) {
        console.error('Error fetching total goals:', error);
        return new ClientResponse('Error fetching total goals', { status: 500 });
    }
};

export const getCompletedGoals = async (req: Request) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as completed FROM goals_progress WHERE status = \'completed\'');
        return new ClientResponse(JSON.stringify({ completed: parseInt(result.rows[0].completed) || 0 }));
    } catch (error) {
        console.error('Error fetching completed goals:', error);
        return new ClientResponse('Error fetching completed goals', { status: 500 });
    }
};
