import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";

const pool = db.getPool();

export async function getGeneralEntries(req: Request): Promise<Response> {
    try {
        const result = await pool.query('SELECT * FROM general_entries ORDER BY entry_date DESC');
        const generalEntries = result.rows || [];

        return new ClientResponse(JSON.stringify(generalEntries), { status: 200 });
    } catch (error) {
        console.error("Error fetching general entries:", error);
        return new ClientResponse(JSON.stringify({ error: "Error fetching general entries" }), { status: 500 });
    }
}
