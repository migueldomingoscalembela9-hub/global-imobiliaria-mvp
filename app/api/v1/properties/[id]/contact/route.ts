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
            return error('Não pode contactar o seu próprio imóvel.', 400, 'INVALID_ACTION');
        }

        const body = await request.json();
        const message = String(body.message ?? '').trim();

        if (!message) {
            return error('A mensagem é obrigatória.', 400, 'VALIDATION_ERROR');
        }

        if (message.length < 10) {
            return error('A mensagem deve ter pelo menos 10 caracteres.', 400, 'VALIDATION_ERROR');
        }

        const contact = await prisma.contact.create({
            data: {
                propertyId: id,
                senderId: user.id,
                recipientId: property.ownerId,
                message,
                status: 'NEW'
            }
        });

        // Notificar o proprietário
        await prisma.notification.create({
            data: {
                userId: property.ownerId,
                type: 'NEW_CONTACT',
                title: 'Novo contacto',
                message: `Recebeu uma nova mensagem sobre o imóvel "${property.title}".`
            }
        });

        return success({ id: contact.id, status: contact.status }, 201);
    } catch (err) {
        return handleError(err);
    }
}