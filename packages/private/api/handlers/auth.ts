import bcrypt from 'bcrypt';
import { db } from '../../db/connection.js';
import { User, AuthResponse } from '../../utils/types.js';
import { generateToken } from '../../utils/jwt.js';
import { ClientResponse } from '../../db/response.js';

const SALT_ROUNDS = 10;

async function registerUser(username: string, password: string): Promise<{ user: Partial<User>, token: string } | { error: string }> {
    if (!username || !password) {
        return { error: 'Username and password are required' };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const query = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING id, username';
    const values = [username, hashedPassword];

    try {
        const result = await db.getPool().query(query, values);
        const user = result.rows[0];
        const token = generateToken(user.id);
        return { user, token };
    } catch (error: any) {
        console.error('Error registering user:', error);
        if (error.code === '23505') { // unique_violation error code
            return { error: 'Username already exists' };
        }
        return { error: 'An error occurred during registration' };
    }
}

async function loginUser(username: string, password: string): Promise<{ user: Partial<User>, token: string } | { error: string }> {
    if (!username || !password) {
        return { error: 'Username and password are required' };
    }

    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    try {
        const result = await db.getPool().query(query, values);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = generateToken(user.id);
                return { user: { id: user.id, username: user.username }, token };
            }
        }
        return { error: 'Invalid username or password' };
    } catch (error) {
        console.error('Error logging in user:', error);
        return { error: 'An error occurred during login' };
    }
}

export async function handleRegister(req: Request): Promise<ClientResponse> {
    const { username, password } = await req.json() as User;
    const result = await registerUser(username, password);
    const response: AuthResponse = 'error' in result
        ? { success: false, message: result.error }
        : { success: true, message: "User registered successfully", user: result.user, token: result.token };
    return new ClientResponse(JSON.stringify(response), { status: 'error' in result ? 400 : 201 });
}

export async function handleLogin(req: Request): Promise<ClientResponse> {
    const { username, password } = await req.json() as User;
    const result = await loginUser(username, password);
    const response: AuthResponse = 'error' in result
        ? { success: false, message: result.error }
        : { success: true, message: "Login successful", user: result.user, token: result.token };
    return new ClientResponse(JSON.stringify(response), { status: 'error' in result ? 401 : 200 });
}
