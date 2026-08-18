import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AuthError } from '@/services/auth/auth.service';

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function error(message: string, status = 400, code = 'ERROR') {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    return error(firstIssue?.message ?? 'Dados inválidos', 400, 'VALIDATION_ERROR');
  }

  if (err instanceof AuthError) {
    const statusMap: Record<string, number> = {
      EMAIL_EXISTS: 409,
      INVALID_CREDENTIALS: 401,
      ACCOUNT_BLOCKED: 403,
      ACCOUNT_PENDING: 403,
      ACCOUNT_INACTIVE: 403,
      INVALID_ROLE: 400
    };
    return error(err.message, statusMap[err.code] ?? 400, err.code);
  }

  if (err instanceof Error) {
    if (err.message === 'UNAUTHORIZED') {
      return error('Não autenticado.', 401, 'UNAUTHORIZED');
    }
    if (err.message === 'FORBIDDEN') {
      return error('Sem permissão para esta ação.', 403, 'FORBIDDEN');
    }
  }

  console.error('Unhandled error:', err);
  return error('Erro interno do servidor.', 500, 'INTERNAL_ERROR');
}
