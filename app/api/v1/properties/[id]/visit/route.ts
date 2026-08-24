import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { success, error, handleError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await requireAuth();

        const property = await prisma.property.findFirst({
            where: { id, status: 'PUBLISHED' },
            include: { owner: true }
        });

        if (!property) {
            return error('Imóvel não encontrado.', 404, 'NOT_FOUND');
        }

        if (property.ownerId === user.id) {
            return error('Não pode solicitar uma visita ao seu próprio imóvel.', 400, 'INVALID_ACTION');
        }

        const body = await request.json();
        const preferredDate = body.preferredDate ? new Date(String(body.preferredDate)) : null;
        const preferredTime = String(body.preferredTime ?? '').trim();
        const message = body.message ? String(body.message).trim() : null;

        if (!preferredDate || isNaN(preferredDate.getTime())) {
            return error('A data preferida é obrigatória.', 400, 'VALIDATION_ERROR');
        }

        if (!preferredTime) {
            return error('A hora preferida é obrigatória.', 400, 'VALIDATION_ERROR');
        }

        const visit = await prisma.visitRequest.create({
            data: {
                propertyId: id,
                requesterId: user.id,
                preferredDate,
                preferredTime,
                message,
                status: 'PENDING'
            }
        });

        // Notificar o proprietário
        await prisma.notification.create({
            data: {
                userId: property.ownerId,
                type: 'NEW_VISIT',
                title: 'Novo pedido de visita',
                message: `Recebeu um novo pedido de visita para o imóvel "${property.title}".`
            }
        });

        return success({ id: visit.id, status: visit.status }, 201);
    } catch (err) {
        return handleError(err);
    }
}