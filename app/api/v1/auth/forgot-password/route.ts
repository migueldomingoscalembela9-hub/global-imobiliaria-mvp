import { NextRequest } from 'next/server';
import { forgotPasswordSchema } from '@/lib/validation/auth';
import { prisma } from '@/lib/db';
import { success, handleError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email.toLowerCase() }
    });

    if (user) {
      console.log(`Password reset requested for: ${user.email}`);
    }

    return success({ message: 'Se o email existir, receberá instruções para recuperar a palavra-passe.' });
  } catch (err) {
    return handleError(err);
  }
}
