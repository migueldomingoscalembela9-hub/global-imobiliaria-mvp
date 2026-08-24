import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/session';

import LogoutButton from '@/components/auth/LogoutButton';

export default async function PublicHeader() {
  const user = await getSessionUser();
  const isAuthenticated = Boolean(user);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-bold text-white">G</span>
          <span className="text-lg font-bold text-slate-900">
            Global <span className="text-brand-600">Imobiliária</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/imoveis?purpose=SALE" className="text-sm font-medium text-slate-700 hover:text-brand-600">Comprar</Link>
          <Link href="/imoveis?purpose=RENT" className="text-sm font-medium text-slate-700 hover:text-brand-600">Arrendar</Link>
          <Link href="/imoveis" className="text-sm font-medium text-slate-700 hover:text-brand-600">Imóveis</Link>
        </nav>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-semibold text-slate-900 sm:inline-flex">{user.name}</span>
            <div className="flex items-center gap-3">
              <Link
                href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="btn-primary text-sm flex items-center gap-1.5"
              >
                <span>📊</span>
                <span>Painel</span>
              </Link>
              <Link
                href="/dashboard/perfil"
                className="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-brand-600"
              >
                Perfil
              </Link>
              <LogoutButton variant="secondary" className="text-sm py-2 px-3" showIcon={false} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm">Entrar</Link>
            <Link href="/registo" className="btn-primary text-sm">Criar conta</Link>
          </div>
        )}
      </div>
    </header>
  );
}