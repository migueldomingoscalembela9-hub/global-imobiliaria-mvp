import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import ProfileForm from '@/components/forms/ProfileForm';

export const dynamic = 'force-dynamic';

export default async function PerfilPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: { role: true }
  });

  if (!profile) {
    redirect('/login');
  }

  const roleLabel = {
    BUYER: 'Comprador',
    TENANT: 'Arrendatário',
    OWNER: 'Proprietário',
    AGENT: 'Agente Imobiliário',
    ADMIN: 'Administrador'
  }[profile.role.code] ?? profile.role.code;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Meu perfil</h1>
        <p className="mt-1 text-sm text-slate-600">Atualize as suas informações pessoais.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
              {profile.name.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{profile.name}</p>
              <p className="text-sm text-slate-500">{roleLabel}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <ProfileForm
            name={profile.name}
            email={profile.email}
            phone={profile.phone}
            avatarUrl={profile.avatarUrl}
          />
        </div>
      </div>
    </div>
  );
}