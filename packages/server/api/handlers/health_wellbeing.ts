import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";

const pool = db.getPool();

export const getHealthWellbeingEntries = async (req: Request) => {
    try {
        const result = await pool.query('SELECT * FROM health_wellbeing ORDER BY entry_date DESC LIMIT 10');
        return new ClientResponse(JSON.stringify(result.rows));
    } catch (error) {
        console.error('Error fetching health and wellbeing entries:', error);
        return new ClientResponse('Error fetching health and wellbeing entries', { status: 500 });
    }
};

export const getTotalExerciseTime = async (req: Request) => {
    try {
        const result = await pool.query('SELECT SUM(EXTRACT(EPOCH FROM duration) / 3600) as total_hours FROM health_wellbeing WHERE activity_type = \'exercise\'');
        return new ClientResponse(JSON.stringify({ totalHours: parseFloat(result.rows[0].total_hours) || 0 }));
    } catch (error) {
        console.error('Error fetching total exercise time:', error);
        return new ClientResponse('Error fetching total exercise time', { status: 500 });
    }
};

export const getAverageEmotionIntensity = async (req: Request) => {
    try {
        const result = await pool.query('SELECT AVG(emotion_intensity) as average FROM health_wellbeing');
        return new ClientResponse(JSON.stringify({ average: parseFloat(result.rows[0].average) || 0 }));
    } catch (error) {
        console.error('Error fetching average emotion intensity:', error);
        return new ClientResponse('Error fetching average emotion intensity', { status: 500 });
    }
};
