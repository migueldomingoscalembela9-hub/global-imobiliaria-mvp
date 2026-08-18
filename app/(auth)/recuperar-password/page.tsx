import Link from 'next/link';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';

export default function RecuperarPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Global Holding</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Recuperar palavra-passe</h1>
          <p className="mt-2 text-sm text-slate-600">
            Introduza o seu email e enviaremos instruções para redefinir a palavra-passe.
          </p>
        </div>

        <div className="card p-8">
          <ForgotPasswordForm />

          <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
            Lembrou-se da palavra-passe?{' '}
            <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
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