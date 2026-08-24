import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import Link from 'next/link';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

export const dynamic = 'force-dynamic';

export default async function ConfirmarResetPasswordPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(user.role === 'ADMIN' ? '/admin' : '/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-xl font-bold text-white">
            G
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Nova palavra-passe</h1>
          <p className="mt-2 text-sm text-slate-600">
            Defina uma nova palavra-passe segura para a sua conta.
          </p>
        </div>

        <div className="card p-8">
          <Suspense fallback={<div className="text-center py-6 text-slate-400">A carregar formulário...</div>}>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
            Lembrou-se da palavra-passe?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Voltar ao login
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Global Holding. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
