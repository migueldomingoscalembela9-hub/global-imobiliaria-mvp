import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import AdminReviewActions from '@/components/admin/AdminReviewActions';

export const dynamic = 'force-dynamic';

export default async function AdminRevisoesPage() {
  const admin = await getSessionUser();

  if (!admin) {
    redirect('/login');
  }

  if (!isAdmin(admin.role)) {
    redirect('/dashboard');
  }

  const pendingProperties = await prisma.property.findMany({
    where: { status: 'REVIEW' },
    include: { owner: true, images: { orderBy: { sortOrder: 'asc' } }, reviews: { orderBy: { createdAt: 'desc' } } },
    orderBy: { updatedAt: 'asc' }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Imóveis em revisão</h1>
        <p className="mt-1 text-sm text-slate-600">Analise e aprove ou rejeite os imóveis submetidos.</p>
      </div>

      {pendingProperties.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-lg text-slate-500">Não existem imóveis pendentes de revisão.</p>
          <Link href="/admin" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">
            ← Voltar ao painel
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingProperties.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="grid grid-cols-1 gap-0 lg:grid-cols-3">
                <div className="relative aspect-[4/3] bg-slate-100 lg:aspect-auto">
                  {p.images[0] ? (
                    <img src={p.images[0].imageUrl} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">Sem fotografia</div>
                  )}
                </div>
                <div className="p-6 lg:col-span-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                      <p className="text-sm text-slate-500">{p.reference} · {p.propertyType} · {p.purpose}</p>
                    </div>
                    <span className="badge-yellow">Em revisão</span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    <strong>Anunciante:</strong> {p.owner.name} · {p.owner.phone} · {p.owner.email}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    <strong>Localização:</strong> {p.municipality}, {p.province}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    <strong>Preço:</strong> {Number(p.price).toLocaleString('pt-PT')} {p.currency}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                    {p.areaM2 != null && <span>{Number(p.areaM2)} m²</span>}
                    {p.bedrooms != null && <span>{p.bedrooms} quartos</span>}
                    {p.bathrooms != null && <span>{p.bathrooms} WCs</span>}
                    {p.parkingSpaces != null && <span>{p.parkingSpaces} estacionamentos</span>}
                  </div>

                  <p className="mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{p.description}</p>

                  <p className="mt-3 text-xs text-slate-400">
                    Submetido em {new Date(p.updatedAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>

                  <div className="mt-5">
                    <AdminReviewActions propertyId={p.id} propertyTitle={p.title} />
                  </div>

                  {p.reviews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Histórico de revisão</p>
                      <div className="mt-2 space-y-2">
                        {p.reviews.map((r) => (
                          <div key={r.id} className="rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
                            <span className="font-medium">{r.action}</span>
                            {r.reason && <span> — {r.reason}</span>}
                            <span className="text-slate-400"> · {new Date(r.createdAt).toLocaleDateString('pt-PT')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}