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

    if (property.status !== 'REVIEW' && property.status !== 'REJECTED' && property.status !== 'DRAFT' && property.status !== 'APPROVED') {
      return Response.json({ success: false, error: { code: 'INVALID_STATE', message: 'Este imóvel não está num estado que permita aprovação.' } }, { status: 400 });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        rejectionReason: null,
        approvedById: admin.id,
        approvedAt: new Date()
      }
    });

    await prisma.propertyReview.create({
      data: { propertyId: id, adminId: admin.id, action: 'APPROVED', reason: null }
    });

    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        type: 'PROPERTY_APPROVED',
        title: 'Imóvel aprovado',
        message: `O seu imóvel "${property.title}" foi aprovado pelo administrador.`
      }
    });

    return success({ id: updated.id, status: 'APPROVED' });
  } catch (err) {
    return handleError(err);
  }
}