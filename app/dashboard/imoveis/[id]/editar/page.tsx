import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isOwnerOrAgent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import PropertyEditForm from '@/components/forms/PropertyEditForm';

export const dynamic = 'force-dynamic';

export default async function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (!isOwnerOrAgent(user.role)) {
    redirect('/dashboard');
  }

  const property = await prisma.property.findFirst({
    where: { id, ownerId: user.id },
    include: { images: { orderBy: { sortOrder: 'asc' } } }
  });

  if (!property) {
    redirect('/dashboard/imoveis');
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/imoveis" className="inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          ← Voltar aos meus imóveis
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Editar imóvel</h1>
        <p className="mt-1 text-sm text-slate-600">
          Atualize as informações do anúncio. {property.status === 'REJECTED' && 'Corrija os motivos da rejeição e submeta novamente.'}
        </p>
      </div>

      {property.status === 'REJECTED' && property.rejectionReason && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Motivo da rejeição:</p>
          <p className="mt-1 text-sm text-red-600">{property.rejectionReason}</p>
        </div>
      )}

      <PropertyEditForm
        propertyId={property.id}
        initialData={{
          title: property.title,
          description: property.description,
          propertyType: property.propertyType,
          purpose: property.purpose,
          price: Number(property.price),
          currency: property.currency,
          areaM2: property.areaM2 ? Number(property.areaM2) : null,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          parkingSpaces: property.parkingSpaces,
          province: property.province,
          municipality: property.municipality,
          district: property.district ?? '',
          neighborhood: property.neighborhood ?? '',
          address: property.address ?? '',
          images: property.images.map((img) => ({ id: img.id, url: img.imageUrl, isCover: img.isCover }))
        }}
      />
    </div>
  );
}