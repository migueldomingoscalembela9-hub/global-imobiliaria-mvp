import Link from 'next/link';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Cabeçalho */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-xl font-bold text-white">
            G
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Global Imobiliária</h1>
          <p className="mt-3 text-base text-slate-600">Entre na sua conta para continuar</p>
        </div>

        {/* Formulário */}
        <div className="card p-8">
          <LoginForm />

          {/* Footer do card */}
          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Ainda não tem conta?{' '}
              <Link href="/registo" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Global Holding. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}