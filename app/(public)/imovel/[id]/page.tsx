import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Apartamento',
  HOUSE: 'Moradia',
  LAND: 'Terreno',
  OFFICE: 'Escritório',
  STORE: 'Loja',
  WAREHOUSE: 'Armazém',
  BUILDING: 'Prédio',
  OTHER: 'Outro'
};

export default async function ImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, status: 'PUBLISHED' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      owner: true
    }
  });

  if (!property) {
    notFound();
  }

  const sessionUser = await getSessionUser();
  const isAuthenticated = Boolean(sessionUser);
  const loginRedirect = `/login?redirect=/imovel/${id}`;

  const cover = property.images.find((img) => img.isCover) ?? property.images[0];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container-page">
        <Link href="/imoveis" className="inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          ← Voltar aos resultados
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Galeria */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="relative aspect-[16/9] bg-slate-100">
                {cover ? (
                  <img src={cover.imageUrl} alt={property.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">Sem fotografia</div>
                )}
                <span className="absolute left-4 top-4 badge-info">
                  {property.purpose === 'SALE' ? 'Venda' : 'Arrendamento'}
                </span>
              </div>

              {property.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 p-4 bg-slate-50">
                  {property.images.slice(0, 10).map((img) => (
                    <img
                      key={img.id}
                      src={img.imageUrl}
                      alt={property.title}
                      className="aspect-[4/3] w-full rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Descrição */}
            <div className="card mt-8 p-8">
              <h2 className="text-2xl font-bold text-slate-900">Descrição</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-700">{property.description}</p>
            </div>
          </div>

          {/* Sidebar com informações */}
          <div className="space-y-6">
            {/* Preço e Título */}
            <div className="card p-8">
              <p className="text-4xl font-bold text-brand-700">
                {Number(property.price).toLocaleString('pt-PT')} {property.currency}
              </p>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">{property.title}</h1>
              <p className="mt-2 text-base text-slate-600">
                {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.municipality}, {property.province}
              </p>
              <p className="mt-2 font-mono text-sm text-slate-500">Ref: {property.reference}</p>
            </div>

            {/* Características */}
            <div className="card p-8">
              <h3 className="text-lg font-bold text-slate-900">Características</h3>
              <dl className="mt-5 space-y-4">
                <div className="flex justify-between items-start">
                  <dt className="text-sm text-slate-600">Tipo</dt>
                  <dd className="text-base font-semibold text-slate-900">{PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType}</dd>
                </div>
                <div className="flex justify-between items-start">
                  <dt className="text-sm text-slate-600">Finalidade</dt>
                  <dd className="text-base font-semibold text-slate-900">{property.purpose === 'SALE' ? 'Venda' : 'Arrendamento'}</dd>
                </div>
                {property.areaM2 != null && (
                  <div className="flex justify-between items-start">
                    <dt className="text-sm text-slate-600">Área</dt>
                    <dd className="text-base font-semibold text-slate-900">{Number(property.areaM2)} m²</dd>
                  </div>
                )}
                {property.bedrooms != null && (
                  <div className="flex justify-between items-start">
                    <dt className="text-sm text-slate-600">Quartos</dt>
                    <dd className="text-base font-semibold text-slate-900">{property.bedrooms}</dd>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex justify-between items-start">
                    <dt className="text-sm text-slate-600">Casas de banho</dt>
                    <dd className="text-base font-semibold text-slate-900">{property.bathrooms}</dd>
                  </div>
                )}
                {property.parkingSpaces != null && property.parkingSpaces > 0 && (
                  <div className="flex justify-between items-start">
                    <dt className="text-sm text-slate-600">Estacionamento</dt>
                    <dd className="text-base font-semibold text-slate-900">{property.parkingSpaces}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Anunciante */}
            <div className="card p-8">
              <h3 className="text-lg font-bold text-slate-900">Anunciante</h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 text-lg">
                  {property.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{property.owner.name}</p>
                  <p className="text-sm text-slate-600">Contacte através do botão abaixo</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Link href={isAuthenticated ? `/imovel/${id}/contactar` : loginRedirect} className="btn-primary w-full">
                💬 Contactar anunciante
              </Link>
              <Link href={isAuthenticated ? `/imovel/${id}/visita` : loginRedirect} className="btn-secondary w-full">
                📅 Solicitar visita
              </Link>
              <Link href={isAuthenticated ? `/imovel/${id}/favorito` : loginRedirect} className="btn-secondary w-full">
                ❤️ Adicionar aos favoritos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}