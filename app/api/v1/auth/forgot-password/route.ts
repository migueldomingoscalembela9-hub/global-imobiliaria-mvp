import { NextRequest } from 'next/server';
import { forgotPasswordSchema } from '@/lib/validation/auth';
import { prisma } from '@/lib/db';
import { createPasswordResetToken } from '@/lib/auth/password';
import { success, handleError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email.toLowerCase().trim() }
    });

    if (user && user.status !== 'BLOCKED') {
      const resetToken = await createPasswordResetToken(user.id, user.email);
      const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
      const resetUrl = `${appUrl}/recuperar-password/confirmar?token=${encodeURIComponent(resetToken)}`;
      
      // Log seguro para ambiente de desenvolvimento / envio de email
      console.log(`[AUTH] Link de recuperação gerado para ${user.email}: ${resetUrl}`);
    }

    return success({
      message: 'Se o email introduzido corresponder a uma conta ativa, receberá instruções para redefinir a palavra-passe.'
    });
  } catch (err) {
    return handleError(err);
  }
}
