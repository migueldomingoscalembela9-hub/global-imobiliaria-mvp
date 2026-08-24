import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import Link from 'next/link';
import RegisterForm from '@/components/forms/RegisterForm';

export const dynamic = 'force-dynamic';

export default async function RegistoPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(user.role === 'ADMIN' ? '/admin' : '/dashboard');
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Cabeçalho */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-xl font-bold text-white">
            G
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Criar conta</h1>
          <p className="mt-3 text-base text-slate-600">Junte-se à Global Imobiliária</p>
        </div>

        {/* Formulário */}
        <div className="card p-8">
          <RegisterForm />

          {/* Footer do card */}
          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Já tem conta?{' '}
              <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                Entrar
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