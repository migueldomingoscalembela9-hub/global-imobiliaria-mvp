import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FavoritosPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      property: {
        include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Os meus favoritos</h1>
        <p className="mt-1 text-sm text-slate-600">Imóveis que guardou para ver mais tarde.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-lg text-slate-500">Ainda não tem imóveis favoritos.</p>
          <p className="mt-2 text-sm text-slate-400">Explore o marketplace e guarde os imóveis que mais gostar.</p>
          <Link href="/imoveis" className="btn-primary mt-6 inline-flex">
            Explorar imóveis
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div key={fav.id} className="card group overflow-hidden transition-shadow hover:shadow-lg">
              <Link href={`/imovel/${fav.property.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {fav.property.images[0] ? (
                    <img
                      src={fav.property.images[0].imageUrl}
                      alt={fav.property.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">Sem fotografia</div>
                  )}
                  <span className="absolute left-3 top-3 badge-blue">
                    {fav.property.purpose === 'SALE' ? 'Venda' : 'Arrendamento'}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-lg font-bold text-brand-700">
                    {Number(fav.property.price).toLocaleString('pt-PT')} {fav.property.currency}
                  </p>
                  <h3 className="mt-1 font-semibold text-slate-900">{fav.property.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {fav.property.municipality}, {fav.property.province}
                  </p>
                  <div className="mt-3 flex gap-4 text-xs text-slate-500">
                    {fav.property.bedrooms != null && <span>{fav.property.bedrooms} quartos</span>}
                    {fav.property.areaM2 != null && <span>{Number(fav.property.areaM2)} m²</span>}
                  </div>
                </div>
              </Link>
              <div className="border-t border-slate-100 p-4">
                <form action={`/api/v1/properties/${fav.property.id}/favorite`} method="DELETE" className="w-full">
                  <button type="submit" className="btn-secondary w-full text-sm hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                    Remover favorito
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}