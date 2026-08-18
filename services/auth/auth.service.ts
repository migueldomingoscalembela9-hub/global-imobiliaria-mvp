import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSession, setSessionCookie, destroySession } from '@/lib/auth/session';
import { registerSchema, loginSchema, type RegisterInput, type LoginInput } from '@/lib/validation/auth';
import { RoleCode } from '@prisma/client';

export class AuthError extends Error {
  constructor(message: string, public code: string = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
  }
}

export async function registerUser(input: RegisterInput) {
  const parsed = registerSchema.parse(input);

  const existing = await prisma.user.findUnique({
    where: { email: parsed.email.toLowerCase() }
  });

  if (existing) {
    throw new AuthError('Já existe uma conta com este email.', 'EMAIL_EXISTS');
  }

  const role = await prisma.role.findUnique({
    where: { code: parsed.role as RoleCode }
  });

  if (!role) {
    throw new AuthError('Perfil inválido.', 'INVALID_ROLE');
  }

  const passwordHash = await hashPassword(parsed.password);

  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      phone: parsed.phone,
      passwordHash,
      roleId: role.id,
      status: 'ACTIVE'
    },
    include: { role: true }
  });

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role.code,
    status: user.status
  };
}

export async function loginUser(input: LoginInput) {
  const parsed = loginSchema.parse(input);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email.toLowerCase() },
    include: { role: true }
  });

  if (!user) {
    throw new AuthError('Credenciais inválidas.', 'INVALID_CREDENTIALS');
  }

  if (user.status === 'BLOCKED') {
    throw new AuthError('A sua conta foi bloqueada. Contacte o suporte.', 'ACCOUNT_BLOCKED');
  }

  if (user.status === 'PENDING') {
    throw new AuthError('A sua conta está pendente de ativação.', 'ACCOUNT_PENDING');
  }

  if (user.status === 'INACTIVE') {
    throw new AuthError('A sua conta está inativa.', 'ACCOUNT_INACTIVE');
  }

  const valid = await verifyPassword(parsed.password, user.passwordHash);
  if (!valid) {
    throw new AuthError('Credenciais inválidas.', 'INVALID_CREDENTIALS');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role.code,
    status: user.status
  };
}

export async function logoutUser() {
  await destroySession();
}