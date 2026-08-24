import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SALT_ROUNDS = 12;
const RESET_TOKEN_DURATION = 60 * 60; // 1 hora

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createPasswordResetToken(userId: string, email: string): Promise<string> {
  return new SignJWT({
    sub: userId,
    email,
    purpose: 'password_reset'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${RESET_TOKEN_DURATION}s`)
    .sign(getSecret());
}

export async function verifyPasswordResetToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.purpose !== 'password_reset' || !payload.sub || typeof payload.email !== 'string') {
      return null;
    }
    return {
      userId: payload.sub,
      email: payload.email
    };
  } catch {
    return null;
  }
}