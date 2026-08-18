import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin, isOwnerOrAgent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (isAdmin(user.role)) {
    redirect('/admin');
  }

  const isOwn = isOwnerOrAgent(user.role);
  const isClient = user.role === 'BUYER' || user.role === 'TENANT';

  // Dados do dashboard por perfil
  const [favoritesCount, contactsCount, visitsCount, myProperties] = await Promise.all([
    prisma.favorite.count({ where: { userId: user.id } }),
    user.role === 'BUYER' || user.role === 'TENANT'
      ? prisma.contact.count({ where: { senderId: user.id } })
      : prisma.contact.count({ where: { recipientId: user.id } }),
    prisma.visitRequest.count({ where: { requesterId: user.id } }),
    isOwn
      ? prisma.property.findMany({
          where: { ownerId: user.id },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { images: { take: 1 } }
        })
      : Promise.resolve([])
  ]);

  const propertyStatusCounts = isOwn
    ? await Promise.all([
        prisma.property.count({ where: { ownerId: user.id, status: 'PUBLISHED' } }),
        prisma.property.count({ where: { ownerId: user.id, status: 'REVIEW' } }),
        prisma.property.count({ where: { ownerId: user.id, status: 'DRAFT' } }),
        prisma.property.count({ where: { ownerId: user.id, status: 'REJECTED' } }),
        prisma.property.count({ where: { ownerId: user.id, status: 'ARCHIVED' } })
      ])
    : [];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">Bem-vindo, {user.name}</h1>
        <p className="mt-3 text-lg text-slate-600">
          {isOwn ? 'Gerencie os seus imóveis, contactos e pedidos de visita.' : 'Explore, guarde e contacte imóveis com facilidade.'}
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isOwn && (
          <>
            <div className="card p-6 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-slate-600">Total de imóveis</p>
              <p className="mt-3 text-4xl font-bold text-slate-900">{myProperties.length}</p>
            </div>
            <div className="card p-6 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-slate-600">Publicados</p>
              <p className="mt-3 text-4xl font-bold text-emerald-600">{propertyStatusCounts[0] ?? 0}</p>
            </div>
            <div className="card p-6 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-slate-600">Em revisão</p>
              <p className="mt-3 text-4xl font-bold text-amber-600">{propertyStatusCounts[1] ?? 0}</p>
            </div>
            <div className="card p-6 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-slate-600">Rascunhos</p>
              <p className="mt-3 text-4xl font-bold text-slate-500">{propertyStatusCounts[2] ?? 0}</p>
            </div>
            <div className="card p-6 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-slate-600">Rejeitados</p>
              <p className="mt-3 text-4xl font-bold text-red-600">{propertyStatusCounts[3] ?? 0}</p>
            </div>
            <div className="card p-6 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-slate-600">Arquivados</p>
              <p className="mt-3 text-4xl font-bold text-slate-400">{propertyStatusCounts[4] ?? 0}</p>
            </div>
          </>
        )}

        {isClient && (
          <>
            <div className="card p-6 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-slate-600">Favoritos</p>
              <p className="mt-3 text-4xl font-bold text-brand-700">{favoritesCount}</p>
            </div>
            <div className="card p-6 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-slate-600">Contactos enviados</p>
              <p className="mt-3 text-4xl font-bold text-slate-900">{contactsCount}</p>
            </div>
            <div className="card p-6 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-slate-600">Pedidos de visita</p>
              <p className="mt-3 text-4xl font-bold text-amber-600">{visitsCount}</p>
            </div>
          </>
        )}
      </div>

      {/* Conteúdo por perfil */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {isOwn && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Os meus imóveis</h2>
              <Link href="/dashboard/imoveis/novo" className="btn-primary text-sm">+ Adicionar imóvel</Link>
            </div>
            <div className="space-y-3">
              {myProperties.length === 0 ? (
                <div className="card p-12 text-center">
                  <p className="text-slate-600">Ainda não tem imóveis registados.</p>
                  <Link href="/dashboard/imoveis/novo" className="btn-primary mt-4 inline-flex">Publicar imóvel</Link>
                </div>
              ) : (
                myProperties.map((p) => (
                  <Link key={p.id} href="/dashboard/imoveis" className="card group flex items-center gap-4 p-4 transition-all hover:shadow-md">
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {p.images[0] && <img src={p.images[0].imageUrl} alt={p.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-slate-900">{p.title}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{p.municipality}, {p.province}</p>
                      <p className="mt-1 text-sm font-bold text-brand-700">{Number(p.price).toLocaleString('pt-PT')} {p.currency}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'PUBLISHED' ? 'badge-green' : 
                      p.status === 'REVIEW' ? 'badge-yellow' : 
                      p.status === 'REJECTED' ? 'badge-red' : 
                      p.status === 'DRAFT' ? 'badge-gray' : 
                      'badge-gray'
                    }`}>
                      {p.status === 'PUBLISHED' && 'Publicado'}
                      {p.status === 'REVIEW' && 'Em revisão'}
                      {p.status === 'DRAFT' && 'Rascunho'}
                      {p.status === 'REJECTED' && 'Rejeitado'}
                      {p.status === 'ARCHIVED' && 'Arquivado'}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {isClient && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Os meus favoritos</h2>
              <Link href="/dashboard/favoritos" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Ver todos →</Link>
            </div>
            <div className="space-y-3">
              {favoritesCount === 0 ? (
                <div className="card p-12 text-center">
                  <p className="text-slate-600">Ainda não tem imóveis favoritos.</p>
                  <Link href="/imoveis" className="btn-primary mt-4 inline-flex">Explorar imóveis</Link>
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-slate-600">Tem {favoritesCount} imóveis guardados.</p>
                  <Link href="/dashboard/favoritos" className="btn-secondary mt-4 inline-flex">Ver favoritos</Link>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Ações rápidas</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link href="/imoveis" className="card p-4 text-center transition-all hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">🏠 Explorar imóveis</p>
              <p className="mt-1 text-xs text-slate-600">Pesquisar no marketplace</p>
            </Link>
            <Link href="/dashboard/contactos" className="card p-4 text-center transition-all hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">💬 Contactos</p>
              <p className="mt-1 text-xs text-slate-600">Mensagens recebidas</p>
            </Link>
            <Link href="/dashboard/visitas" className="card p-4 text-center transition-all hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">📅 Pedidos de visita</p>
              <p className="mt-1 text-xs text-slate-600">Gerir as suas visitas</p>
            </Link>
            <Link href="/dashboard/perfil" className="card p-4 text-center transition-all hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">👤 Meu perfil</p>
              <p className="mt-1 text-xs text-slate-600">Atualizar os seus dados</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}