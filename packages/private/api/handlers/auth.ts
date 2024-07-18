import bcrypt from 'bcrypt';
import { db } from '../../db/connection.js';
import { User, AuthResponse } from '../../utils/types.js';
import { generateToken } from '../../utils/jwt.js';
import { ClientResponse } from '../../db/response.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../handlers/mailHandler.js';

const SALT_ROUNDS = 10;

async function registerUser(username: string, email: string, password: string): Promise<{ user: Partial<User>, verificationToken: string } | { error: string }> {
    if (!username || !email || !password) {
        return { error: 'missingCredentials' };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const query = 'INSERT INTO users(username, email, password, verification_token) VALUES($1, $2, $3, $4) RETURNING id, username, email';
    const values = [username, email, hashedPassword, verificationToken];

    try {
        const result = await db.getPool().query(query, values);
        const user = result.rows[0];
        return { user, verificationToken };
    } catch (error: any) {
        console.error('Error registering user:', error);
        if (error.code === '23505') { // unique_violation error code
            return { error: 'userAlreadyExists' };
        }
        return { error: 'registrationError' };
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
                if (process.env.MAIL_HOST && !user.is_verified) {
                    return { error: 'emailNotVerified' };
                }
                const token = generateToken(user.id);
                return { user: { id: user.id, username: user.username, email: user.email }, token };
            }
        }
        return { error: 'invalidCredentials' };
    } catch (error) {
        console.error('Error logging in user:', error);
        return { error: 'An error occurred during login' };
    }
}

export async function handleRegister(req: Request): Promise<ClientResponse> {
    const { username, email, password } = await req.json() as User & { email: string };
    const result = await registerUser(username, email, password);
    if ('error' in result) {
        return new ClientResponse(JSON.stringify({ success: false, message: result.error }), { status: 400 });
    }
    
    await sendVerificationEmail(email, result.verificationToken);
    
    const response: AuthResponse = { 
        success: true, 
        message: "User registered successfully. Please check your email to verify your account.", 
        user: result.user
    };
    return new ClientResponse(JSON.stringify(response), { status: 201 });
}

export async function handleLogin(req: Request): Promise<ClientResponse> {
    const { username, password } = await req.json() as User;
    const result = await loginUser(username, password);
    const response: AuthResponse = 'error' in result
        ? { success: false, message: result.error }
        : { success: true, message: "Login successful", user: result.user, token: result.token };
    return new ClientResponse(JSON.stringify(response), { status: 'error' in result ? 401 : 200 });
}

export async function handleVerifyEmail(req: Request): Promise<ClientResponse> {
    const { token } = await req.json() as { token: string };
    if (!token) {
        return new ClientResponse(JSON.stringify({ success: false, message: 'Verification token is required' }), { status: 400 });
    }

    try {
        const result = await db.getPool().query('UPDATE users SET is_verified = TRUE WHERE verification_token = $1 AND is_verified = FALSE RETURNING id, username, email', [token]);
        if (result.rows.length === 0) {
            // Check if the user is already verified
            const verifiedCheck = await db.getPool().query('SELECT is_verified FROM users WHERE verification_token = $1', [token]);
            if (verifiedCheck.rows.length > 0 && verifiedCheck.rows[0].is_verified) {
                return new ClientResponse(JSON.stringify({ success: false, message: 'Email is already verified' }), { status: 400 });
            }
            return new ClientResponse(JSON.stringify({ success: false, message: 'Invalid verification token' }), { status: 400 });
        }
        const user = result.rows[0];
        // Clear the verification token after successful verification
        await db.getPool().query('UPDATE users SET verification_token = NULL WHERE id = $1', [user.id]);
        return new ClientResponse(JSON.stringify({ success: true, message: 'Email verified successfully', user }), { status: 200 });
    } catch (error) {
        console.error('Error verifying email:', error);
        return new ClientResponse(JSON.stringify({ success: false, message: 'An error occurred during email verification' }), { status: 500 });
    }
}
