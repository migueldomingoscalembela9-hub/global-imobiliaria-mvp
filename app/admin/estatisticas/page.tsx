import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminEstatisticasPage() {
  const admin = await getSessionUser();

  if (!admin) {
    redirect('/login');
  }

  if (!isAdmin(admin.role)) {
    redirect('/dashboard');
  }

  const [totalUsers, activeUsers, blockedUsers, totalProperties, publishedProperties, reviewProperties, rejectedProperties, totalContacts, totalVisits, totalFavorites, approvedProperties] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { status: 'BLOCKED' } }),
    prisma.property.count(),
    prisma.property.count({ where: { status: 'PUBLISHED' } }),
    prisma.property.count({ where: { status: 'REVIEW' } }),
    prisma.property.count({ where: { status: 'REJECTED' } }),
    prisma.contact.count(),
    prisma.visitRequest.count(),
    prisma.favorite.count(),
    prisma.property.count({ where: { status: 'APPROVED' } })
  ]);

  const [propertiesByType, usersByRole, propertiesByProvince] = await Promise.all([
    prisma.property.groupBy({ by: ['propertyType'], _count: true }),
    prisma.user.groupBy({ by: ['roleId'], _count: true }),
    prisma.property.groupBy({ by: ['province'], _count: true, where: { status: 'PUBLISHED' } })
  ]);

  const roleCodes = await prisma.role.findMany();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Estatísticas</h1>
        <p className="mt-1 text-sm text-slate-600">Visão geral dos indicadores da plataforma.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        <div className="card p-5">
          <p className="text-xs text-slate-500">Utilizadores</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalUsers}</p>
          <p className="text-xs text-emerald-600">{activeUsers} ativos</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500">Bloqueados</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{blockedUsers}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500">Imóveis</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalProperties}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500">Publicados</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{publishedProperties}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500">Em revisão</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{reviewProperties}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500">Aprovados</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{approvedProperties}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500">Rejeitados</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{rejectedProperties}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500">Contactos</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalContacts}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500">Favoritos</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalFavorites}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500">Visitas</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">{totalVisits}</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Imóveis por tipo</h2>
          <div className="mt-4 space-y-3">
            {propertiesByType.length === 0 ? (
              <p className="text-sm text-slate-500">Sem dados.</p>
            ) : (
              propertiesByType.map((entry) => (
                <div key={entry.propertyType} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{entry.propertyType}</span>
                  <span className="font-medium text-slate-900">{entry._count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Utilizadores por perfil</h2>
          <div className="mt-4 space-y-3">
            {usersByRole.length === 0 ? (
              <p className="text-sm text-slate-500">Sem dados.</p>
            ) : (
              usersByRole.map((entry) => {
                const role = roleCodes.find((r) => r.id === entry.roleId);
                return (
                  <div key={entry.roleId} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{role?.code ?? entry.roleId}</span>
                    <span className="font-medium text-slate-900">{entry._count}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Publicados por província</h2>
          <div className="mt-4 space-y-3">
            {propertiesByProvince.length === 0 ? (
              <p className="text-sm text-slate-500">Sem dados.</p>
            ) : (
              propertiesByProvince.map((entry) => (
                <div key={entry.province} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{entry.province}</span>
                  <span className="font-medium text-slate-900">{entry._count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}