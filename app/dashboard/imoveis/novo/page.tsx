import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isOwnerOrAgent } from '@/lib/permissions';
import PropertyForm from '@/components/forms/PropertyForm';

export const dynamic = 'force-dynamic';

export default async function NovoImovelPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (!isOwnerOrAgent(user.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Publicar imóvel</h1>
        <p className="mt-1 text-sm text-slate-600">
          Preencha as informações essenciais. Pode guardar como rascunho e continuar depois.
        </p>
      </div>

      <PropertyForm />
    </div>
  );
}