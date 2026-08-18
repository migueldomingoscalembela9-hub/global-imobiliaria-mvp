import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_BADGES: Record<string, string> = {
  NEW: 'badge-blue',
  READ: 'badge-yellow',
  RESPONDED: 'badge-green',
  CLOSED: 'badge-gray'
};

export default async function AdminContactosPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!isAdmin(user.role)) redirect('/dashboard');

  const contacts = await prisma.contact.findMany({
    include: { property: true, sender: true, recipient: true },
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
          <h1 className="text-2xl font-bold text-slate-900">Contactos</h1>
          <p className="mt-1 text-sm text-slate-600">Consultar todos os contactos da plataforma.</p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">De</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Para</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Imóvel</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Mensagem</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Estado</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Ainda não existem contactos.
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{c.sender.name}</td>
                      <td className="px-4 py-3 text-slate-600">{c.recipient.name}</td>
                      <td className="px-4 py-3 text-slate-600">{c.property.title}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-slate-500">{c.message}</td>
                      <td className="px-4 py-3">
                        <span className={STATUS_BADGES[c.status] ?? 'badge-gray'}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString('pt-PT')}
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
