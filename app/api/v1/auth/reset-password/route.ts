import { NextRequest } from 'next/server';
import { resetPasswordSchema } from '@/lib/validation/auth';
import { hashPassword, verifyPasswordResetToken } from '@/lib/auth/password';
import { prisma } from '@/lib/db';
import { success, error, handleError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.parse(body);

    const tokenPayload = await verifyPasswordResetToken(parsed.token);
    if (!tokenPayload) {
      return error('O link de recuperação é inválido ou já expirou. Solicite um novo.', 400, 'INVALID_TOKEN');
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.userId }
    });

    if (!user || user.status === 'BLOCKED') {
      return error('Conta de utilizador não encontrada ou bloqueada.', 400, 'INVALID_USER');
    }

    const passwordHash = await hashPassword(parsed.password);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    return success({ message: 'Palavra-passe atualizada com sucesso. Já pode iniciar sessão.' });
  } catch (err) {
    return handleError(err);
  }
}
