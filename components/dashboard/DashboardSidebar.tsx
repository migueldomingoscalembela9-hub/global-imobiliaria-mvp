import Link from 'next/link';
import { isAdmin, isOwnerOrAgent } from '@/lib/permissions';
import type { RoleCode } from '@prisma/client';

import LogoutButton from '@/components/auth/LogoutButton';

interface DashboardSidebarProps {
  role: RoleCode;
  userName: string;
}

export default function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const isOwn = isOwnerOrAgent(role);
  const isClient = role === 'BUYER' || role === 'TENANT';

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">G</span>
        <span className="font-bold text-slate-900">
          Global <span className="text-brand-600">Imobiliária</span>
        </span>
      </div>

      {/* Perfil do utilizador */}
      <div className="border-b border-slate-200 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
            <p className="text-xs text-slate-500">
              {role === 'BUYER' && 'Comprador'}
              {role === 'TENANT' && 'Arrendatário'}
              {role === 'OWNER' && 'Proprietário'}
              {role === 'AGENT' && 'Agente Imobiliário'}
              {role === 'ADMIN' && 'Administrador'}
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 p-3">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
        >
          Dashboard
        </Link>

        {isClient && (
          <>
            <Link
              href="/imoveis"
              className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Imóveis
            </Link>
            <Link
              href="/dashboard/favoritos"
              className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Favoritos
            </Link>
          </>
        )}

        {isOwn && (
          <>
            <Link
              href="/dashboard/imoveis"
              className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Meus imóveis
            </Link>
            <Link
              href="/dashboard/imoveis/novo"
              className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Novo imóvel
            </Link>
          </>
        )}

        <div className="my-2 border-t border-slate-200"></div>

        <Link
          href="/dashboard/contactos"
          className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
        >
          Contactos
        </Link>
        <Link
          href="/dashboard/visitas"
          className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
        >
          Pedidos de visita
        </Link>
        <Link
          href="/dashboard/notificacoes"
          className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
        >
          Notificações
        </Link>
        <Link
          href="/dashboard/perfil"
          className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
        >
          Meu perfil
        </Link>

        {isAdmin(role) && (
          <>
            <div className="my-2 border-t border-slate-200 pt-2">
              <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Administração</p>
              <Link
                href="/admin"
                className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                Painel Admin
              </Link>
              <Link
                href="/admin/revisoes"
                className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                Revisões
              </Link>
              <Link
                href="/admin/estatisticas"
                className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                Estatísticas
              </Link>
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-3">
        <LogoutButton variant="secondary" className="w-full text-sm" />
      </div>
    </aside>
  );
}