import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

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

        <form className="space-y-5 p-6">
          <div>
            <label htmlFor="name" className="label">Nome completo</label>
            <input id="name" name="name" type="text" defaultValue={profile.name} className="input" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" type="email" defaultValue={profile.email} disabled className="input bg-slate-100" />
              <p className="mt-1 text-xs text-slate-400">O email não pode ser alterado.</p>
            </div>
            <div>
              <label htmlFor="phone" className="label">Telefone</label>
              <input id="phone" name="phone" type="tel" defaultValue={profile.phone} className="input" />
            </div>
          </div>

          <div>
            <label htmlFor="avatarUrl" className="label">URL da fotografia</label>
            <input id="avatarUrl" name="avatarUrl" type="url" defaultValue={profile.avatarUrl ?? ''} className="input" placeholder="https://..." />
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-semibold text-slate-900">Alterar palavra-passe</h3>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="currentPassword" className="label">Palavra-passe atual</label>
                <input id="currentPassword" name="currentPassword" type="password" className="input" />
              </div>
              <div>
                <label htmlFor="newPassword" className="label">Nova palavra-passe</label>
                <input id="newPassword" name="newPassword" type="password" className="input" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary">Guardar alterações</button>
        </form>
      </div>
    </div>
  );
}