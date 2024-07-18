import jwt from 'jsonwebtoken';
import { User } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): Partial<User> | undefined {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return {
      id: decoded.userId,
    }
  } catch (error) {
    return undefined;
  }
}
