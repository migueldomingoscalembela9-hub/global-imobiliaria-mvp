import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isOwnerOrAgent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartamento' },
  { value: 'HOUSE', label: 'Moradia' },
  { value: 'LAND', label: 'Terreno' },
  { value: 'OFFICE', label: 'Escritório' },
  { value: 'STORE', label: 'Loja' },
  { value: 'WAREHOUSE', label: 'Armazém' },
  { value: 'BUILDING', label: 'Prédio' },
  { value: 'OTHER', label: 'Outro' }
];

const PROVINCES = [
  'Luanda', 'Benguela', 'Huambo', 'Lubango', 'Cabinda', 'Malanje', 'Namibe', 'Uíge',
  'Kwanza Sul', 'Kwanza Norte', 'Lunda Norte', 'Lunda Sul', 'Moxico', 'Bengo', 'Bié',
  'Cunene', 'Huíla', 'Zaire'
];

export default async function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (!isOwnerOrAgent(user.role)) {
    redirect('/dashboard');
  }

  const property = await prisma.property.findFirst({
    where: { id, ownerId: user.id },
    include: { images: { orderBy: { sortOrder: 'asc' } } }
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <Link href="/dashboard/imoveis" className="text-sm text-brand-600 hover:text-brand-700">← Voltar aos meus imóveis</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Editar imóvel</h1>
        <p className="mt-1 text-sm text-slate-600">{property.reference} · {property.title}</p>
      </div>

      <form action={`/api/v1/properties/${property.id}`} method="PUT" className="space-y-8">
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Informações</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="label">Título *</label>
              <input id="title" name="title" type="text" required minLength={5} defaultValue={property.title} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="label">Descrição *</label>
              <textarea id="description" name="description" required rows={4} minLength={20} defaultValue={property.description} className="input" />
            </div>
            <div>
              <label htmlFor="propertyType" className="label">Tipo de imóvel *</label>
              <select id="propertyType" name="propertyType" required defaultValue={property.propertyType} className="input">
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="purpose" className="label">Finalidade *</label>
              <select id="purpose" name="purpose" required defaultValue={property.purpose} className="input">
                <option value="SALE">Venda</option>
                <option value="RENT">Arrendamento</option>
              </select>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Características</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
            <div>
              <label htmlFor="areaM2" className="label">Área (m²)</label>
              <input id="areaM2" name="areaM2" type="number" defaultValue={property.areaM2?.toString() ?? ''} className="input" />
            </div>
            <div>
              <label htmlFor="bedrooms" className="label">Quartos</label>
              <input id="bedrooms" name="bedrooms" type="number" defaultValue={property.bedrooms?.toString() ?? ''} className="input" />
            </div>
            <div>
              <label htmlFor="bathrooms" className="label">Casas de banho</label>
              <input id="bathrooms" name="bathrooms" type="number" defaultValue={property.bathrooms?.toString() ?? ''} className="input" />
            </div>
            <div>
              <label htmlFor="parkingSpaces" className="label">Estacionamento</label>
              <input id="parkingSpaces" name="parkingSpaces" type="number" defaultValue={property.parkingSpaces?.toString() ?? ''} className="input" />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Localização</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="province" className="label">Província *</label>
              <select id="province" name="province" required defaultValue={property.province} className="input">
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="municipality" className="label">Município *</label>
              <input id="municipality" name="municipality" type="text" required defaultValue={property.municipality} className="input" />
            </div>
            <div>
              <label htmlFor="district" className="label">Distrito</label>
              <input id="district" name="district" type="text" defaultValue={property.district ?? ''} className="input" />
            </div>
            <div>
              <label htmlFor="neighborhood" className="label">Bairro</label>
              <input id="neighborhood" name="neighborhood" type="text" defaultValue={property.neighborhood ?? ''} className="input" />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Preço</h2>
          <div className="mt-5 grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="price" className="label">Preço (AOA) *</label>
              <input id="price" name="price" type="number" required min={1} defaultValue={Number(property.price)} className="input" />
            </div>
            <div>
              <label htmlFor="currency" className="label">Moeda</label>
              <select id="currency" name="currency" defaultValue={property.currency} className="input">
                <option value="AOA">AOA</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Fotografias</h2>
          <div className="mt-5">
            {property.images.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {property.images.map((img) => (
                  <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <img src={img.imageUrl} alt={property.title} className="h-full w-full object-cover" />
                    {img.isCover && (
                      <span className="absolute left-1 top-1 badge-green">Capa</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Ainda não tem fotografias.</p>
            )}
          </div>
        </section>

        <div className="flex flex-wrap gap-4">
          <button type="submit" name="action" value="draft" className="btn-secondary">Guardar rascunho</button>
          {property.status !== 'REVIEW' && (
            <button type="submit" name="action" value="submit" className="btn-primary">Submeter para revisão</button>
          )}
          <Link href="/dashboard/imoveis" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}