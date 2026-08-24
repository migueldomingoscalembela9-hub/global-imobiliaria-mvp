import { NextRequest } from 'next/server';
import { getSessionUser, requireAuth } from '@/lib/auth/session';
import { isOwnerOrAgent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { success, error, handleError } from '@/lib/api/response';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') ?? '';
    const purpose = request.nextUrl.searchParams.get('purpose') ?? '';
    const propertyType = request.nextUrl.searchParams.get('propertyType') ?? '';
    const province = request.nextUrl.searchParams.get('province') ?? '';
    const municipality = request.nextUrl.searchParams.get('municipality') ?? '';
    const precoMin = request.nextUrl.searchParams.get('precoMin') ?? '';
    const precoMax = request.nextUrl.searchParams.get('precoMax') ?? '';
    const quartos = request.nextUrl.searchParams.get('quartos') ?? '';
    const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') ?? 1));
    const pageSize = 12;

    const where: Record<string, unknown> = { status: 'PUBLISHED' };

    if (q.trim()) {
      const term = q.trim();
      const numericTerm = Number(term.replace(/[^\d]/g, ''));
      where.OR = [
        { title: { contains: term, mode: 'insensitive' as const } },
        { municipality: { contains: term, mode: 'insensitive' as const } },
        { neighborhood: { contains: term, mode: 'insensitive' as const } },
        { province: { contains: term, mode: 'insensitive' as const } },
        { reference: { contains: term, mode: 'insensitive' as const } },
        ...(numericTerm > 0 ? [
          { price: { lte: numericTerm } }
        ] : [])
      ];
    }

    if (purpose) where.purpose = purpose;
    if (propertyType) where.propertyType = propertyType;
    if (province) where.province = province;
    if (municipality) where.municipality = { contains: municipality, mode: 'insensitive' };
    if (quartos) where.bedrooms = { gte: Number(quartos) };

    const priceFilter: Record<string, number> = {};
    if (precoMin) priceFilter.gte = Number(precoMin);
    if (precoMax) priceFilter.lte = Number(precoMax);
    if (Object.keys(priceFilter).length > 0) where.price = priceFilter;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.property.count({ where })
    ]);

    const results = properties.map((p) => ({
      id: p.id,
      reference: p.reference,
      title: p.title,
      purpose: p.purpose,
      propertyType: p.propertyType,
      province: p.province,
      municipality: p.municipality,
      neighborhood: p.neighborhood,
      price: p.price.toString(),
      currency: p.currency,
      areaM2: p.areaM2?.toString() ?? null,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      imageUrl: p.images[0]?.imageUrl
    }));

    return success({ items: results, total, page, pageSize });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!isOwnerOrAgent(user.role)) {
      return Response.json({ success: false, error: { code: 'FORBIDDEN', message: 'Sem permissão para publicar imóveis.' } }, { status: 403 });
    }

    const body = await request.json();
    const {
      title = '',
      description = '',
      propertyType = '',
      purpose = '',
      price = 0,
      currency = 'AOA',
      areaM2 = null,
      bedrooms = null,
      bathrooms = null,
      parkingSpaces = null,
      province = '',
      municipality = '',
      district = '',
      neighborhood = '',
      address = '',
      action = 'draft',
      images = '',
      coverImageIndex = 0
    } = body as Record<string, unknown>;

    if (!title || !description || !propertyType || !purpose || !price || !province || !municipality) {
      return error('Campos obrigatórios em falta.', 400, 'VALIDATION_ERROR');
    }

    const roleUser = await prisma.user.findUnique({ where: { id: user.id }, include: { role: true } });
    if (!roleUser) return error('Utilizador não encontrado.', 404, 'NOT_FOUND');

    const reference = `GIM-${Date.now().toString(36).toUpperCase()}`;

    const property = await prisma.property.create({
      data: {
        reference,
        ownerId: user.id,
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
        status: String(action) === 'submit' ? 'REVIEW' : 'DRAFT'
      }
    });

    // Processar imagens
    const imagesRaw = String(images ?? '');
    const coverIndex = Number(coverImageIndex) >= 0 ? Number(coverImageIndex) : 0;

    if (imagesRaw.trim()) {
      const urls = imagesRaw.split('\n').map((u) => u.trim()).filter(Boolean);
      await prisma.propertyImage.createMany({
        data: urls.map((url, idx) => ({
          propertyId: property.id,
          imageUrl: url,
          sortOrder: idx,
          isCover: idx === coverIndex
        }))
      });
    }

    if (String(action) === 'submit') {
      await prisma.propertyReview.create({
        data: { propertyId: property.id, adminId: user.id, action: 'SUBMITTED', reason: null }
      });
    }

    return success({ id: property.id, reference: property.reference, status: property.status }, 201);
  } catch (err) {
    return handleError(err);
  }
}
