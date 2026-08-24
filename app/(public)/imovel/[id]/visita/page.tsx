import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import VisitForm from '@/components/property/VisitForm';

export const dynamic = 'force-dynamic';

export default async function VisitaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getSessionUser();

    if (!user) {
        redirect(`/login?redirect=/imovel/${id}/visita`);
    }

    const property = await prisma.property.findFirst({
        where: { id, status: 'PUBLISHED' },
        include: { owner: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
    });

    if (!property) {
        redirect('/imoveis');
    }

    if (property.ownerId === user.id) {
        redirect(`/imovel/${id}`);
    }

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

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-slate-900">Solicitar visita</h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Escolha a data e hora preferidas para visitar este imóvel.
                            </p>

                            <div className="mt-6">
                                <VisitForm propertyId={id} propertyTitle={property.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}