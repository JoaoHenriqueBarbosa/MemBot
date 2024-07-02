import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";

const pool = db.getPool();

export async function getHealthWellbeingEntries(): Promise<ClientResponse> {
  try {
    const result = await pool.query('SELECT * FROM health_wellbeing ORDER BY entry_date DESC LIMIT 10');
    return new ClientResponse(200, result.rows);
  } catch (error) {
    console.error('Error fetching health and wellbeing entries:', error);
    return new ClientResponse(500, { error: 'Internal server error' });
  }
}

export async function getTotalExerciseTime(): Promise<ClientResponse> {
  try {
    const result = await pool.query('SELECT SUM(EXTRACT(EPOCH FROM duration) / 3600) as total_hours FROM health_wellbeing WHERE activity_type = \'exercise\'');
    return new ClientResponse(200, { totalHours: parseFloat(result.rows[0].total_hours) || 0 });
  } catch (error) {
    console.error('Error fetching total exercise time:', error);
    return new ClientResponse(500, { error: 'Internal server error' });
  }
}

export async function getAverageEmotionIntensity(): Promise<ClientResponse> {
  try {
    const result = await pool.query('SELECT AVG(emotion_intensity) as average FROM health_wellbeing');
    return new ClientResponse(200, { average: parseFloat(result.rows[0].average) || 0 });
  } catch (error) {
    console.error('Error fetching average emotion intensity:', error);
    return new ClientResponse(500, { error: 'Internal server error' });
  }
}
