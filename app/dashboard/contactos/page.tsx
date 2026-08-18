import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { isOwnerOrAgent } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

const CONTACT_STATUS_BADGES: Record<string, string> = {
  NEW: 'badge-blue',
  READ: 'badge-yellow',
  RESPONDED: 'badge-green',
  CLOSED: 'badge-gray'
};

export default async function ContactosPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const isOwn = isOwnerOrAgent(user.role);

  const contacts = isOwn
    ? await prisma.contact.findMany({
        where: { recipientId: user.id },
        include: { property: true, sender: true, recipient: true },
        orderBy: { createdAt: 'desc' }
      })
    : await prisma.contact.findMany({
        where: { senderId: user.id },
        include: { property: true, sender: true, recipient: true },
        orderBy: { createdAt: 'desc' }
      });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Contactos</h1>
        <p className="mt-1 text-sm text-slate-600">
          {isOwn ? 'Mensagens recebidas dos interessados nos seus imóveis.' : 'O seu histórico de contactos.'}
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-lg text-slate-500">Ainda não existem contactos.</p>
          <p className="mt-2 text-sm text-slate-400">
            {isOwn ? 'Quando alguém contactar sobre os seus imóveis, verá as mensagens aqui.' : 'Contacte um anunciante a partir de uma página de imóvel.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">
                    {isOwn ? c.sender.name : c.recipient.name}
                  </p>
                  <p className="text-sm text-slate-600">{c.property.title}</p>
                  <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{c.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={CONTACT_STATUS_BADGES[c.status] ?? 'badge-gray'}>{c.status}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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