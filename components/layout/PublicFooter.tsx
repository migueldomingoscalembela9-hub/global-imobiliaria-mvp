import Link from 'next/link';

export default function PublicFooter() {
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
              <li><Link href="/imoveis" className="hover:text-brand-600">Comprar</Link></li>
              <li><Link href="/imoveis?finalidade=ARRENDAMENTO" className="hover:text-brand-600">Arrendar</Link></li>
              <li><Link href="/imoveis" className="hover:text-brand-600">Todos os imóveis</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Conta</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/login" className="hover:text-brand-600">Entrar</Link></li>
              <li><Link href="/registo" className="hover:text-brand-600">Criar conta</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Contactos</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Luanda, Angola</li>
              <li>geral@globalimobiliaria.com</li>
              <li>+244 900 000 000</li>
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
