import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export default async function AdminConfiguracoesPage() {
  const admin = await getSessionUser();

  if (!admin) {
    redirect('/login');
  }

  if (!isAdmin(admin.role)) {
    redirect('/dashboard');
  }

  const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
  const storageUrl = process.env.STORAGE_URL ?? '(não configurado)';

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="mt-1 text-sm text-slate-600">Parâmetros gerais da plataforma.</p>
      </div>

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Ambiente</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Modo</dt>
              <dd className="font-medium text-slate-900">
                {process.env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento'}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">URL da aplicação</dt>
              <dd className="font-medium text-slate-900">{appUrl}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Storage (Object Storage)</dt>
              <dd className="font-medium text-slate-900">{storageUrl}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Regras de publicação</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <span className="text-emerald-600">✓</span>
              <p className="text-slate-700">
                Nenhum imóvel é publicado automaticamente. O fluxo obrigatório é: <strong>Rascunho → Em revisão → Aprovado → Publicado</strong>.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <span className="text-amber-600">!</span>
              <p className="text-slate-700">
                O motivo de rejeição é obrigatório ao rejeitar um anúncio.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <span className="text-blue-600">i</span>
              <p className="text-slate-700">
                Somente imóveis com estado <strong>PUBLISHED</strong> aparecem no marketplace público.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Tipos de imóvel suportados</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Apartamento', 'Moradia', 'Terreno', 'Escritório', 'Loja', 'Armazém', 'Prédio', 'Outro'].map((t) => (
              <span key={t} className="badge-gray">{t}</span>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Perfis do sistema</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { code: 'BUYER', label: 'Comprador', desc: 'Procura imóveis para comprar' },
              { code: 'TENANT', label: 'Arrendatário', desc: 'Procura imóveis para arrendar' },
              { code: 'OWNER', label: 'Proprietário', desc: 'Publica e gere os seus imóveis' },
              { code: 'AGENT', label: 'Agente', desc: 'Gere carteira de anúncios' },
              { code: 'ADMIN', label: 'Administrador', desc: 'Valida e gere a plataforma' }
            ].map((r) => (
              <div key={r.code} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-medium text-slate-900">{r.label}</p>
                <p className="text-xs text-slate-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}