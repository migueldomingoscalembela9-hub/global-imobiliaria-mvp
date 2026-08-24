import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { isOwnerOrAgent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { success, error, handleError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await requireAuth();

        if (!isOwnerOrAgent(user.role)) {
            return error('Sem permissão para editar imóveis.', 403, 'FORBIDDEN');
        }

        const property = await prisma.property.findFirst({
            where: { id, ownerId: user.id }
        });

        if (!property) {
            return error('Imóvel não encontrado.', 404, 'NOT_FOUND');
        }

        if (property.status === 'PUBLISHED' || property.status === 'ARCHIVED') {
            return error('Este imóvel não pode ser editado no estado atual.', 400, 'INVALID_STATE');
        }

        const body = await request.json();
        const {
            title = property.title,
            description = property.description,
            propertyType = property.propertyType,
            purpose = property.purpose,
            price = property.price,
            currency = property.currency,
            areaM2 = property.areaM2,
            bedrooms = property.bedrooms,
            bathrooms = property.bathrooms,
            parkingSpaces = property.parkingSpaces,
            province = property.province,
            municipality = property.municipality,
            district = property.district,
            neighborhood = property.neighborhood,
            address = property.address,
            action = 'draft'
        } = body as Record<string, unknown>;

        if (!title || !description || !propertyType || !purpose || !price || !province || !municipality) {
            return error('Campos obrigatórios em falta.', 400, 'VALIDATION_ERROR');
        }

        const updated = await prisma.property.update({
            where: { id },
            data: {
                title: String(title),
                description: String(description),
                propertyType: String(propertyType) as never,
                purpose: String(purpose) as never,
                price: Number(price),
                currency: String(currency || 'AOA'),
                areaM2: areaM2 ? Number(areaM2) : null,
                bedrooms: bedrooms != null ? Number(bedrooms) : null,
                bathrooms: bathrooms != null ? Number(bathrooms) : null,
                parkingSpaces: parkingSpaces != null ? Number(parkingSpaces) : null,
                province: String(province),
                municipality: String(municipality),
                district: district ? String(district) : null,
                neighborhood: neighborhood ? String(neighborhood) : null,
                address: address ? String(address) : null,
                status: String(action) === 'submit' ? 'REVIEW' : 'DRAFT',
                rejectionReason: null
            }
        });

        if (String(action) === 'submit') {
            await prisma.propertyReview.create({
                data: { propertyId: id, adminId: user.id, action: 'SUBMITTED', reason: null }
            });
        }

        return success({ id: updated.id, status: updated.status });
    } catch (err) {
        return handleError(err);
    }
}