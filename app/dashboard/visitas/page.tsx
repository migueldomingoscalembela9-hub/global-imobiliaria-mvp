import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { isOwnerOrAgent } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

const VISIT_STATUS_BADGES: Record<string, string> = {
  PENDING: 'badge-yellow',
  CONFIRMED: 'badge-green',
  DECLINED: 'badge-red',
  COMPLETED: 'badge-blue',
  CANCELLED: 'badge-gray'
};

export default async function VisitasPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const isOwn = isOwnerOrAgent(user.role);

  const visits = isOwn
    ? await prisma.visitRequest.findMany({
        where: { property: { ownerId: user.id } },
        include: { property: true, requester: true },
        orderBy: { createdAt: 'desc' }
      })
    : await prisma.visitRequest.findMany({
        where: { requesterId: user.id },
        include: { property: true, requester: true },
        orderBy: { createdAt: 'desc' }
      });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pedidos de visita</h1>
        <p className="mt-1 text-sm text-slate-600">
          {isOwn ? 'Pedidos de visita recebidos para os seus imóveis.' : 'Os seus pedidos de visita a imóveis.'}
        </p>
      </div>

      {visits.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-lg text-slate-500">Ainda não existem pedidos de visita.</p>
          <p className="mt-2 text-sm text-slate-400">
            {isOwn ? 'Quando alguém solicitar uma visita, verá o pedido aqui.' : 'Explore imóveis e solicite visitas para vê-los pessoalmente.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((v) => (
            <div key={v.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{v.property.title}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {isOwn ? `Solicitado por: ${v.requester.name}` : `Anunciante: ${v.property.ownerId}`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <span className="text-slate-600">
                      📅 {new Date(v.preferredDate).toLocaleDateString('pt-PT')}
                    </span>
                    <span className="text-slate-600">🕐 {v.preferredTime}</span>
                  </div>
                  {v.message && (
                    <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{v.message}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={VISIT_STATUS_BADGES[v.status] ?? 'badge-gray'}>{v.status}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(v.createdAt).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}