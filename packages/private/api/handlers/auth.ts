import bcrypt from 'bcrypt';
import { db } from '../../db/connection.js';
import { User } from '../../utils/types.js';

const SALT_ROUNDS = 10;

export async function registerUser(username: string, password: string): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const query = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING id, username';
    const values = [username, hashedPassword];

    try {
        const result = await db.getPool().query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error registering user:', error);
        return null;
    }
}

export async function loginUser(username: string, password: string): Promise<Partial<User> | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    try {
        const result = await db.getPool().query(query, values);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return { id: user.id, username: user.username };
            }
        }
        return null;
    } catch (error) {
        console.error('Error logging in user:', error);
        return null;
    }
}
