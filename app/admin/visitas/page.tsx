import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_BADGES: Record<string, string> = {
  PENDING: 'badge-yellow',
  CONFIRMED: 'badge-green',
  DECLINED: 'badge-red',
  COMPLETED: 'badge-blue',
  CANCELLED: 'badge-gray'
};

export default async function AdminVisitasPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!isAdmin(user.role)) redirect('/dashboard');

  const visits = await prisma.visitRequest.findMany({
    include: { property: true, requester: true },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pedidos de Visita</h1>
        <p className="mt-1 text-sm text-slate-600">Consultar todos os pedidos de visita da plataforma.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600">Solicitante</th>
                <th className="px-4 py-3 font-medium text-slate-600">Imóvel</th>
                <th className="px-4 py-3 font-medium text-slate-600">Data</th>
                <th className="px-4 py-3 font-medium text-slate-600">Hora</th>
                <th className="px-4 py-3 font-medium text-slate-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Ainda não existem pedidos de visita.
                  </td>
                </tr>
              ) : (
                visits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{v.requester.name}</td>
                    <td className="px-4 py-3 text-slate-600">{v.property.title}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(v.preferredDate).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{v.preferredTime}</td>
                    <td className="px-4 py-3">
                      <span className={STATUS_BADGES[v.status] ?? 'badge-gray'}>{v.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
