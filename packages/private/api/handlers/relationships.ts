import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";
import { User } from "../../utils/types.js";

// Get the database pool
const pool = db.getPool();

// Handler to get relationships entries
export const getRelationships = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query('SELECT * FROM relationships WHERE user_id = $1 ORDER BY entry_date DESC LIMIT 10', [user.id]);
        return new ClientResponse(JSON.stringify(result.rows));
    } catch (error) {
        console.error('Error fetching relationships entries:', error);
        return new ClientResponse('Error fetching relationships entries', { status: 500 });
    }
};

// Handler to get total number of interactions
export const getTotalInteractions = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as total FROM relationships WHERE user_id = $1', [user.id]);
        return new ClientResponse(JSON.stringify({ total: parseInt(result.rows[0].total) || 0 }));
    } catch (error) {
        console.error('Error fetching total interactions:', error);
        return new ClientResponse('Error fetching total interactions', { status: 500 });
    }
};

// Handler to get the most frequent person in interactions
export const getMostFrequentPerson = async (req: Request, user: Partial<User>) => {
    try {
        const result = await pool.query(`
            SELECT person, COUNT(*) as interaction_count
            FROM relationships
            WHERE user_id = $1
            GROUP BY person
            ORDER BY interaction_count DESC
            LIMIT 1
        `, [user.id]);
        return new ClientResponse(JSON.stringify({ person: result.rows[0]?.person || 'N/A' }));
    } catch (error) {
        console.error('Error fetching most frequent person:', error);
        return new ClientResponse('Error fetching most frequent person', { status: 500 });
    }
};
