import { ClientResponse } from "../../db/response.js";
import Database from "../../db/connection.js";
import { getLanguageStrings } from "../../utils/languageStrings.js";

export async function getGeneralEntries(req: Request): Promise<Response> {
    try {
        const db = Database.getInstance();
        const client = await db.connect();

        try {
            const result = await client.query('SELECT * FROM general_entries ORDER BY date DESC');
            const generalEntries = result.rows;

            return new ClientResponse(JSON.stringify(generalEntries), { status: 200 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error fetching general entries:", error);
        const strings = getLanguageStrings();
        return new ClientResponse(JSON.stringify({ error: strings.internalServerError }), { status: 500 });
    }
}
