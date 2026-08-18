import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { success, handleError } from '@/lib/api/response';
import { RoleCode } from '@prisma/client';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await requireRole(RoleCode.ADMIN);

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return Response.json({ success: false, error: { code: 'NOT_FOUND', message: 'Utilizador não encontrado.' } }, { status: 404 });
    }

    if (target.id === admin.id) {
      return Response.json({ success: false, error: { code: 'FORBIDDEN', message: 'Não pode bloquear a sua própria conta.' } }, { status: 403 });
    }

    await prisma.user.update({
      where: { id },
      data: { status: 'BLOCKED' }
    });

    return success({ id: target.id, status: 'BLOCKED' });
  } catch (err) {
    return handleError(err);
  }
}