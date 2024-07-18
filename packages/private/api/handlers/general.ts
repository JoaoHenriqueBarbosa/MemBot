import { db } from "../../db/connection.js";
import { ClientResponse } from "../../db/response.js";
import { User } from "../../utils/types.js";

const pool = db.getPool();

export async function getGeneralEntries(req: Request, user: Partial<User>): Promise<Response> {
    try {
        const result = await pool.query('SELECT * FROM general_entries WHERE user_id = $1 ORDER BY entry_date DESC', [user.id]);
        const generalEntries = result.rows || [];

        return new ClientResponse(JSON.stringify(generalEntries), { status: 200 });
    } catch (error) {
        console.error("Error fetching general entries:", error);
        return new ClientResponse(JSON.stringify({ error: "Error fetching general entries" }), { status: 500 });
    }
}
