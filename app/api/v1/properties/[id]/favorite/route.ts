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
            where: { id, status: 'PUBLISHED' }
        });

        if (!property) {
            return error('Imóvel não encontrado.', 404, 'NOT_FOUND');
        }

        const existing = await prisma.favorite.findUnique({
            where: { userId_propertyId: { userId: user.id, propertyId: id } }
        });

        if (existing) {
            return error('Este imóvel já está nos seus favoritos.', 400, 'ALREADY_FAVORITE');
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId: user.id,
                propertyId: id
            }
        });

        return success({ id: favorite.id }, 201);
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await requireAuth();

        const existing = await prisma.favorite.findUnique({
            where: { userId_propertyId: { userId: user.id, propertyId: id } }
        });

        if (!existing) {
            return error('Este imóvel não está nos seus favoritos.', 404, 'NOT_FOUND');
        }

        await prisma.favorite.delete({
            where: { id: existing.id }
        });

        return success({ message: 'Imóvel removido dos favoritos.' });
    } catch (err) {
        return handleError(err);
    }
}