import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (!isAdmin(user.role)) {
    redirect('/dashboard');
  }

  const [totalUsers, totalProperties, pendingProperties, publishedProperties, rejectedProperties, totalContacts, totalVisits] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.property.count({ where: { status: 'REVIEW' } }),
    prisma.property.count({ where: { status: 'PUBLISHED' } }),
    prisma.property.count({ where: { status: 'REJECTED' } }),
    prisma.contact.count(),
    prisma.visitRequest.count()
  ]);

  const stats = [
    { label: 'Utilizadores registados', value: totalUsers, href: '/admin/utilizadores' },
    { label: 'Imóveis registados', value: totalProperties, href: '/admin/imoveis' },
    { label: 'Imóveis pendentes', value: pendingProperties, href: '/admin/revisoes' },
    { label: 'Imóveis publicados', value: publishedProperties, href: '/admin/imoveis' },
    { label: 'Imóveis rejeitados', value: rejectedProperties, href: '/admin/imoveis' },
    { label: 'Contactos', value: totalContacts, href: '/admin/contactos' },
    { label: 'Pedidos de visita', value: totalVisits, href: '/admin/visitas' }
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">Painel Administrativo</h1>
        <p className="mt-3 text-lg text-slate-600">Visão geral completa da plataforma Global Imobiliária.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-6 transition-all hover:shadow-md">
            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Ações principais */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/utilizadores" className="card p-6 transition-all hover:shadow-md">
          <h2 className="text-lg font-bold text-slate-900">👥 Utilizadores</h2>
          <p className="mt-2 text-sm text-slate-600">Bloquear e ativar contas de utilizadores.</p>
        </Link>
        <Link href="/admin/revisoes" className="card p-6 transition-all hover:shadow-md">
          <h2 className="text-lg font-bold text-slate-900">✅ Revisões</h2>
          <p className="mt-2 text-sm text-slate-600">Aprovar ou rejeitar imóveis pendentes.</p>
        </Link>
        <Link href="/admin/estatisticas" className="card p-6 transition-all hover:shadow-md">
          <h2 className="text-lg font-bold text-slate-900">📊 Estatísticas</h2>
          <p className="mt-2 text-sm text-slate-600">Indicadores e métricas da plataforma.</p>
        </Link>
        <Link href="/admin/configuracoes" className="card p-6 transition-all hover:shadow-md">
          <h2 className="text-lg font-bold text-slate-900">⚙️ Configurações</h2>
          <p className="mt-2 text-sm text-slate-600">Parâmetros gerais do sistema.</p>
        </Link>
      </div>
    </div>
  );
}