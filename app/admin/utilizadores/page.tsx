import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_BADGES: Record<string, string> = {
  ACTIVE: 'badge-green',
  INACTIVE: 'badge-gray',
  BLOCKED: 'badge-red',
  PENDING: 'badge-yellow'
};

const ROLE_LABELS: Record<string, string> = {
  BUYER: 'Comprador',
  TENANT: 'Arrendatário',
  OWNER: 'Proprietário',
  AGENT: 'Agente',
  ADMIN: 'Admin'
};

export default async function AdminUtilizadoresPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!isAdmin(user.role)) redirect('/dashboard');

  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand-700">Global Imobiliária</span>
            <span className="badge-purple">Admin</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-slate-600 hover:text-brand-700">Dashboard</Link>
            <form action="/api/v1/auth/logout" method="POST">
              <button type="submit" className="btn-secondary text-sm">Sair</button>
            </form>
          </nav>
        </div>
      </header>

      <main className="container-page py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Utilizadores</h1>
          <p className="mt-1 text-sm text-slate-600">Gerir contas, bloquear e ativar utilizadores.</p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Nome</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Telefone</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Perfil</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Estado</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Registo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Ainda não existem utilizadores registados.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3 text-slate-600">{u.phone}</td>
                      <td className="px-4 py-3">
                        <span className="badge-blue">{ROLE_LABELS[u.role.code] ?? u.role.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={STATUS_BADGES[u.status] ?? 'badge-gray'}>{u.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString('pt-PT')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
