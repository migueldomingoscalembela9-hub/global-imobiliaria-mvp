import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function NotificacoesPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Notificações</h1>
        <p className="mt-1 text-sm text-slate-600">Atualizações sobre os seus imóveis e atividades.</p>
      </div>

      {notifications.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-lg text-slate-500">Não tem notificações.</p>
          <p className="mt-2 text-sm text-slate-400">As novidades sobre os seus imóveis aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className={`card p-4 ${!n.isRead ? 'border-l-4 border-l-brand-600 bg-brand-50/50' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{n.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!n.isRead && <span className="badge-blue">Nova</span>}
                  <span className="text-xs text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}