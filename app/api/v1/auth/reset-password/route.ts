import { NextRequest } from 'next/server';
import { resetPasswordSchema } from '@/lib/validation/auth';
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/db';
import { success, handleError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: parsed.token }
    });

    if (!user) {
      return success({ message: 'Token inválido ou expirado.' });
    }

    const passwordHash = await hashPassword(parsed.password);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    return success({ message: 'Palavra-passe atualizada com sucesso.' });
  } catch (err) {
    return handleError(err);
  }
}
