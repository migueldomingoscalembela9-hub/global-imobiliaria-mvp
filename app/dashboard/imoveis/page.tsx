import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isOwnerOrAgent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_BADGES: Record<string, { className: string; label: string }> = {
  DRAFT: { className: 'badge-gray', label: 'Rascunho' },
  REVIEW: { className: 'badge-yellow', label: 'Em revisão' },
  APPROVED: { className: 'badge-blue', label: 'Aprovado' },
  PUBLISHED: { className: 'badge-green', label: 'Publicado' },
  REJECTED: { className: 'badge-red', label: 'Rejeitado' },
  ARCHIVED: { className: 'badge-gray', label: 'Arquivado' }
};

const TABS = [
  { value: '', label: 'Todos' },
  { value: 'DRAFT', label: 'Rascunhos' },
  { value: 'REVIEW', label: 'Em revisão' },
  { value: 'PUBLISHED', label: 'Publicados' },
  { value: 'REJECTED', label: 'Rejeitados' },
  { value: 'ARCHIVED', label: 'Arquivados' }
];

export default async function MeusImoveisPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const resolvedParams = await searchParams;
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (!isOwnerOrAgent(user.role)) {
    redirect('/dashboard');
  }

  const status = resolvedParams.status ?? '';

  const properties = await prisma.property.findMany({
    where: {
      ownerId: user.id,
      ...(status ? { status: status as never } : {})
    },
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus imóveis</h1>
          <p className="mt-1 text-sm text-slate-600">Gerencie e acompanhe os estados dos seus anúncios.</p>
        </div>
        <Link href="/dashboard/imoveis/novo" className="btn-primary">+ Adicionar imóvel</Link>
      </div>

      {/* Filtros por estado */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/dashboard/imoveis?status=${tab.value}` : '/dashboard/imoveis'}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === tab.value
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {properties.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-lg text-slate-500">
            {status ? 'Não existem imóveis neste estado.' : 'Ainda não tem imóveis registados.'}
          </p>
          <Link href="/dashboard/imoveis/novo" className="btn-primary mt-6 inline-flex">
            Publicar o primeiro imóvel
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((p) => {
            const badge = STATUS_BADGES[p.status] ?? { className: 'badge-gray', label: p.status };
            return (
              <div key={p.id} className="card overflow-hidden">
                <div className="flex flex-col gap-4 p-5 sm:flex-row">
                  <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-48">
                    {p.images[0] ? (
                      <img src={p.images[0].imageUrl} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">Sem fotografia</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{p.title}</h3>
                        <p className="text-sm text-slate-500">{p.reference} · {p.municipality}, {p.province}</p>
                      </div>
                      <span className={badge.className}>{badge.label}</span>
                    </div>
                    <p className="mt-2 text-lg font-bold text-brand-700">
                      {Number(p.price).toLocaleString('pt-PT')} {p.currency}
                    </p>

                    {p.status === 'REJECTED' && p.rejectionReason && (
                      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-xs font-semibold text-red-700">Motivo da rejeição:</p>
                        <p className="mt-1 text-sm text-red-600">{p.rejectionReason}</p>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.status === 'DRAFT' && (
                        <>
                          <Link href={`/dashboard/imoveis/${p.id}/editar`} className="btn-secondary text-sm">Editar</Link>
                          <Link href={`/dashboard/imoveis/${p.id}/editar`} className="btn-primary text-sm">Continuar</Link>
                        </>
                      )}
                      {p.status === 'REVIEW' && (
                        <span className="text-sm text-slate-500">A aguardar revisão administrativa...</span>
                      )}
                      {(p.status === 'APPROVED' || p.status === 'PUBLISHED') && (
                        <Link href={`/imovel/${p.id}`} className="btn-secondary text-sm">Ver</Link>
                      )}
                      {p.status === 'REJECTED' && (
                        <Link href={`/dashboard/imoveis/${p.id}/editar`} className="btn-primary text-sm">Corrigir anúncio</Link>
                      )}
                      {p.status === 'ARCHIVED' && (
                        <Link href={`/imovel/${p.id}`} className="btn-secondary text-sm">Ver</Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}