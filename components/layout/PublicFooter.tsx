import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/session';

import LogoutButton from '@/components/auth/LogoutButton';

export default async function PublicFooter() {
  const user = await getSessionUser();
  const isAuthenticated = Boolean(user);

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">G</span>
              <span className="font-bold text-slate-900">Global Imobiliária</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Marketplace imobiliário da Global Holding para o mercado angolano.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Navegação</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/imoveis?purpose=SALE" className="hover:text-brand-600">Comprar</Link></li>
              <li><Link href="/imoveis?purpose=RENT" className="hover:text-brand-600">Arrendar</Link></li>
              <li><Link href="/imoveis" className="hover:text-brand-600">Todos os imóveis</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Conta</h3>
            {isAuthenticated && user ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="font-medium text-slate-900">{user.name}</li>
                <li>
                  <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="hover:text-brand-600">
                    Painel
                  </Link>
                </li>
                <li><Link href="/dashboard/perfil" className="hover:text-brand-600">Perfil</Link></li>
                <li><LogoutButton variant="ghost" className="p-0 text-sm hover:text-brand-600" label="Terminar sessão" showIcon={false} /></li>
              </ul>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><Link href="/login" className="hover:text-brand-600">Entrar</Link></li>
                <li><Link href="/registo" className="hover:text-brand-600">Criar conta</Link></li>
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Contactos</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Luanda, Angola</li>
              <li>globalgps.su@gmail.com</li>
              <li>+244 932 760 076</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Global Holding. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}