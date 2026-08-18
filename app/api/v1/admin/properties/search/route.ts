import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { success, handleError } from '@/lib/api/response';
import { RoleCode } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireRole(RoleCode.ADMIN);

    const q = request.nextUrl.searchParams.get('q') ?? '';

    if (!q.trim()) {
      return success([]);
    }

    const term = q.trim();

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { id: { contains: term, mode: 'insensitive' } },
          { reference: { contains: term, mode: 'insensitive' } },
          { title: { contains: term, mode: 'insensitive' } },
          { owner: { name: { contains: term, mode: 'insensitive' } } },
          { owner: { email: { contains: term, mode: 'insensitive' } } },
          { owner: { phone: { contains: term, mode: 'insensitive' } } }
        ]
      },
      include: {
        owner: { select: { name: true, email: true, phone: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const results = properties.map((p) => ({
      id: p.id,
      reference: p.reference,
      title: p.title,
      ownerName: p.owner.name,
      ownerEmail: p.owner.email,
      ownerPhone: p.owner.phone,
      province: p.province,
      municipality: p.municipality,
      price: p.price.toString(),
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      imageUrl: p.images[0]?.imageUrl
    }));

    return success(results);
  } catch (err) {
    return handleError(err);
  }
}