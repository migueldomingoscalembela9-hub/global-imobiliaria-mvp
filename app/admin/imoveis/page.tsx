import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import AdminPropertySearch from '@/components/admin/AdminPropertySearch';

export const dynamic = 'force-dynamic';

const STATUS_BADGES: Record<string, string> = {
  DRAFT: 'badge-gray',
  REVIEW: 'badge-yellow',
  APPROVED: 'badge-blue',
  PUBLISHED: 'badge-green',
  REJECTED: 'badge-red',
  ARCHIVED: 'badge-gray'
};

export default async function AdminImoveisPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!isAdmin(user.role)) redirect('/dashboard');

  const properties = await prisma.property.findMany({
    include: { owner: true, images: { take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Imóveis</h1>
        <p className="mt-1 text-sm text-slate-600">Aprovar, rejeitar e gerir todos os imóveis.</p>
      </div>

      {/* Pesquisa dinâmica */}
      <AdminPropertySearch />

      {/* Lista completa */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Todos os imóveis</h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Referência</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Título</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Proprietário</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Preço</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Estado</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Criado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Ainda não existem imóveis registados.
                    </td>
                  </tr>
                ) : (
                  properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.reference}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                      <td className="px-4 py-3 text-slate-600">{p.owner.name}</td>
                      <td className="px-4 py-3 text-slate-600">{Number(p.price).toLocaleString('pt-PT')} {p.currency}</td>
                      <td className="px-4 py-3">
                        <span className={STATUS_BADGES[p.status] ?? 'badge-gray'}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString('pt-PT')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}