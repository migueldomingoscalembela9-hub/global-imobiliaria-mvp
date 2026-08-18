import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { success, handleError } from '@/lib/api/response';
import { RoleCode } from '@prisma/client';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await requireRole(RoleCode.ADMIN);

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return Response.json({ success: false, error: { code: 'NOT_FOUND', message: 'Imóvel não encontrado.' } }, { status: 404 });
    }

    const formData = await request.formData();
    const reason = String(formData.get('reason') ?? '').trim();

    if (!reason) {
      return Response.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'O motivo da rejeição é obrigatório.' } }, { status: 400 });
    }

    if (property.status !== 'REVIEW' && property.status !== 'APPROVED') {
      return Response.json({ success: false, error: { code: 'INVALID_STATE', message: 'Este imóvel não está num estado que permita rejeição.' } }, { status: 400 });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        approvedById: null,
        approvedAt: null
      }
    });

    await prisma.propertyReview.create({
      data: { propertyId: id, adminId: admin.id, action: 'REJECTED', reason }
    });

    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        type: 'PROPERTY_REJECTED',
        title: 'Imóvel rejeitado',
        message: `O seu imóvel "${property.title}" foi rejeitado. Motivo: ${reason}`
      }
    });

    return success({ id: updated.id, status: 'REJECTED' });
  } catch (err) {
    return handleError(err);
  }
}