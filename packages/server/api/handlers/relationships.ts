import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";

const pool = db.getPool();

export const getRelationships = async (req: Request) => {
    try {
        const result = await pool.query('SELECT * FROM relationships ORDER BY entry_date DESC LIMIT 10');
        return new ClientResponse(JSON.stringify(result.rows));
    } catch (error) {
        console.error('Error fetching relationships entries:', error);
        return new ClientResponse('Error fetching relationships entries', { status: 500 });
    }
};

export const getTotalInteractions = async (req: Request) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as total FROM relationships');
        return new ClientResponse(JSON.stringify({ total: parseInt(result.rows[0].total) || 0 }));
    } catch (error) {
        console.error('Error fetching total interactions:', error);
        return new ClientResponse('Error fetching total interactions', { status: 500 });
    }
};

export const getMostFrequentPerson = async (req: Request) => {
    try {
        const result = await pool.query(`
            SELECT person, COUNT(*) as interaction_count
            FROM relationships
            GROUP BY person
            ORDER BY interaction_count DESC
            LIMIT 1
        `);
        return new ClientResponse(JSON.stringify({ person: result.rows[0]?.person || 'N/A' }));
    } catch (error) {
        console.error('Error fetching most frequent person:', error);
        return new ClientResponse('Error fetching most frequent person', { status: 500 });
    }
};
