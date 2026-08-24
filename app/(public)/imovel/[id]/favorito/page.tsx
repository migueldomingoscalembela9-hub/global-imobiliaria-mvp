import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import FavoriteButton from '@/components/property/FavoriteButton';

export const dynamic = 'force-dynamic';

export default async function FavoritoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getSessionUser();

    if (!user) {
        redirect(`/login?redirect=/imovel/${id}/favorito`);
    }

    const property = await prisma.property.findFirst({
        where: { id, status: 'PUBLISHED' },
        include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
    });

    if (!property) {
        redirect('/imoveis');
    }

    const isFavorite = await prisma.favorite.findUnique({
        where: { userId_propertyId: { userId: user.id, propertyId: id } }
    });

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container-page">
                <div className="mx-auto max-w-2xl">
                    <Link href={`/imovel/${id}`} className="inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                        ← Voltar ao imóvel
                    </Link>

                    <div className="mt-6 card overflow-hidden">
                        <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 p-5">
                            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                {property.images[0] && (
                                    <img src={property.images[0].imageUrl} alt={property.title} className="h-full w-full object-cover" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg font-bold text-slate-900 truncate">{property.title}</h1>
                                <p className="text-sm text-slate-600">{property.municipality}, {property.province}</p>
                                <p className="mt-1 text-base font-bold text-brand-700">
                                    {Number(property.price).toLocaleString('pt-PT')} {property.currency}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                {isFavorite ? 'Imóvel nos favoritos' : 'Adicionar aos favoritos'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">
                                {isFavorite
                                    ? 'Este imóvel já está na sua lista de favoritos.'
                                    : 'Guarde este imóvel para o encontrar facilmente mais tarde.'}
                            </p>

                            <div className="mt-6">
                                <FavoriteButton propertyId={id} isFavorite={Boolean(isFavorite)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}