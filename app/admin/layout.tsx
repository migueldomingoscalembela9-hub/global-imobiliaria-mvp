import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';
import Link from 'next/link';

import LogoutButton from '@/components/auth/LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (!isAdmin(user.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">G</span>
          <span className="font-bold text-slate-900">
            Global <span className="text-brand-600">Imobiliária</span>
          </span>
        </div>

        <div className="border-b border-slate-200 px-4 py-4">
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">Administrador</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700">
            Dashboard
          </Link>
          <Link href="/admin/utilizadores" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700">
            Utilizadores
          </Link>
          <Link href="/admin/imoveis" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700">
            Imóveis
          </Link>
          <Link href="/admin/revisoes" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700">
            Imóveis em revisão
          </Link>
          <Link href="/admin/contactos" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700">
            Contactos
          </Link>
          <Link href="/admin/visitas" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700">
            Pedidos de visita
          </Link>
          <Link href="/admin/estatisticas" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700">
            Estatísticas
          </Link>
          <Link href="/admin/configuracoes" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700">
            Configurações
          </Link>
        </nav>

        <div className="border-t border-slate-200 p-3">
          <LogoutButton variant="secondary" className="w-full text-sm" />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container-page py-8">{children}</div>
      </main>
    </div>
  );
}