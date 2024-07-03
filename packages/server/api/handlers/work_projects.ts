import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";

const pool = db.getPool();

export const getWorkProjects = async (req: Request) => {
    try {
        const result = await pool.query('SELECT * FROM work_projects ORDER BY entry_date DESC LIMIT 10');
        return new ClientResponse(JSON.stringify(result.rows));
    } catch (error) {
        console.error('Error fetching work projects entries:', error);
        return new ClientResponse('Error fetching work projects entries', { status: 500 });
    }
};

export const getTotalTasks = async (req: Request) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as total FROM work_projects');
        return new ClientResponse(JSON.stringify({ total: parseInt(result.rows[0].total) || 0 }));
    } catch (error) {
        console.error('Error fetching total tasks:', error);
        return new ClientResponse('Error fetching total tasks', { status: 500 });
    }
};

export const getCompletedTasks = async (req: Request) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as completed FROM work_projects WHERE task_status = \'completed\'');
        return new ClientResponse(JSON.stringify({ completed: parseInt(result.rows[0].completed) || 0 }));
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
        return new ClientResponse('Error fetching completed tasks', { status: 500 });
    }
};
