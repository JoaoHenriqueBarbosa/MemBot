import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";
import { User } from "../../utils/types.js";

const pool = db.getPool();

export const getHealthWellbeingEntries = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query('SELECT * FROM health_wellbeing WHERE user_id = $1 ORDER BY entry_date DESC LIMIT 10', [user.id]);
        return new ClientResponse(JSON.stringify(result.rows));
    } catch (error) {
        console.error('Error fetching health and wellbeing entries:', error);
        return new ClientResponse('Error fetching health and wellbeing entries', { status: 500 });
    }
};

export const getTotalExerciseTime = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query('SELECT SUM(EXTRACT(EPOCH FROM duration) / 3600) as total_hours FROM health_wellbeing WHERE activity_type = \'exercise\' AND user_id = $1', [user.id]);
        return new ClientResponse(JSON.stringify({ totalHours: parseFloat(result.rows[0].total_hours) || 0 }));
    } catch (error) {
        console.error('Error fetching total exercise time:', error);
        return new ClientResponse('Error fetching total exercise time', { status: 500 });
    }
};

export const getAverageEmotionIntensity = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query('SELECT AVG(emotion_intensity) as average FROM health_wellbeing WHERE user_id = $1', [user.id]);
        return new ClientResponse(JSON.stringify({ average: parseFloat(result.rows[0].average) || 0 }));
    } catch (error) {
        console.error('Error fetching average emotion intensity:', error);
        return new ClientResponse('Error fetching average emotion intensity', { status: 500 });
    }
};
