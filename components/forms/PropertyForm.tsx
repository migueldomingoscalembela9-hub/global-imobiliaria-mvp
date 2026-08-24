'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PropertyImageUpload from '@/components/property/PropertyImageUpload';

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

export default function PropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'draft' | 'submit'>('draft');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const uploadRef = useRef<{ uploadAll: () => Promise<string[]> }>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const action = actionType;

      // Upload das imagens pendentes
      let imageUrls: string[] = [];
      if (uploadRef.current) {
        imageUrls = await uploadRef.current.uploadAll();
      }

      // Construir payload
      const payload: Record<string, unknown> = {
        title: formData.get('title'),
        description: formData.get('description'),
        propertyType: formData.get('propertyType'),
        purpose: formData.get('purpose'),
        price: Number(formData.get('price') ?? 0),
        currency: formData.get('currency') ?? 'AOA',
        areaM2: formData.get('areaM2') ? Number(formData.get('areaM2')) : null,
        bedrooms: formData.get('bedrooms') ? Number(formData.get('bedrooms')) : null,
        bathrooms: formData.get('bathrooms') ? Number(formData.get('bathrooms')) : null,
        parkingSpaces: formData.get('parkingSpaces') ? Number(formData.get('parkingSpaces')) : null,
        province: formData.get('province'),
        municipality: formData.get('municipality'),
        district: formData.get('district') ?? '',
        neighborhood: formData.get('neighborhood') ?? '',
        address: formData.get('address') ?? '',
        action,
        images: imageUrls.join('\n'),
        coverImageIndex: formData.get('coverImageIndex') ?? '0'
      };

      const res = await fetch('/api/v1/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message ?? 'Erro ao criar o imóvel.');
        return;
      }

      setSuccess(action === 'submit' ? 'Imóvel enviado para revisão com sucesso.' : 'Rascunho guardado com sucesso.');
      setTimeout(() => router.push('/dashboard/imoveis'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao criar o imóvel.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Etapa 1: Informações essenciais */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Informações essenciais</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="label">Título *</label>
            <input id="title" name="title" type="text" required minLength={5} className="input" placeholder="Ex: Apartamento T3 no Talatona" />
          </div>
          <div>
            <label htmlFor="propertyType" className="label">Tipo de imóvel *</label>
            <select id="propertyType" name="propertyType" required className="input">
              <option value="">Selecione...</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="purpose" className="label">Finalidade *</label>
            <select id="purpose" name="purpose" required className="input">
              <option value="">Selecione...</option>
              <option value="SALE">Venda</option>
              <option value="RENT">Arrendamento</option>
            </select>
          </div>
          <div>
            <label htmlFor="price" className="label">Preço (AOA) *</label>
            <input id="price" name="price" type="number" required min={1} className="input" placeholder="Ex: 80000000" />
          </div>
          <div>
            <label htmlFor="currency" className="label">Moeda</label>
            <select id="currency" name="currency" className="input" defaultValue="AOA">
              <option value="AOA">AOA</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </section>

      {/* Etapa 2: Localização */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Localização</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="province" className="label">Província *</label>
            <select id="province" name="province" required className="input">
              <option value="">Selecione...</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="municipality" className="label">Município *</label>
            <input id="municipality" name="municipality" type="text" required className="input" placeholder="Ex.: Talatona" />
          </div>
          <div>
            <label htmlFor="neighborhood" className="label">Bairro</label>
            <input id="neighborhood" name="neighborhood" type="text" className="input" />
          </div>
          <div>
            <label htmlFor="district" className="label">Distrito</label>
            <input id="district" name="district" type="text" className="input" />
          </div>
        </div>
      </section>

      {/* Etapa 3: Descrição */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Descrição</h2>
        <div className="mt-5">
          <label htmlFor="description" className="label">Descrição do imóvel *</label>
          <textarea id="description" name="description" required rows={4} minLength={20} className="input" placeholder="Descreva o imóvel em detalhe..." />
        </div>
      </section>

      {/* Etapa 4: Fotografias */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Fotografias</h2>
        <p className="mt-1 text-sm text-slate-500">Escolha as imagens do seu dispositivo. A primeira será a capa.</p>
        <div className="mt-4">
          <PropertyImageUpload ref={uploadRef} />
        </div>
      </section>

      {/* Etapa 5: Características (opcionais) */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Características <span className="text-sm font-normal text-slate-400">(opcionais)</span></h2>
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
          <div>
            <label htmlFor="areaM2" className="label">Área (m²)</label>
            <input id="areaM2" name="areaM2" type="number" min={1} className="input" />
          </div>
          <div>
            <label htmlFor="bedrooms" className="label">Quartos</label>
            <input id="bedrooms" name="bedrooms" type="number" min={0} className="input" />
          </div>
          <div>
            <label htmlFor="bathrooms" className="label">Casas de banho</label>
            <input id="bathrooms" name="bathrooms" type="number" min={0} className="input" />
          </div>
          <div>
            <label htmlFor="parkingSpaces" className="label">Estacionamento</label>
            <input id="parkingSpaces" name="parkingSpaces" type="number" min={0} className="input" />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          onClick={() => setActionType('draft')}
          disabled={loading}
          className="btn-secondary"
        >
          {loading && actionType === 'draft' ? 'A guardar rascunho...' : 'Guardar como rascunho'}
        </button>
        <button
          type="submit"
          onClick={() => setActionType('submit')}
          disabled={loading}
          className="btn-primary"
        >
          {loading && actionType === 'submit' ? 'A submeter...' : 'Submeter para revisão'}
        </button>
        <Link href="/dashboard/imoveis" className="btn-secondary">Cancelar</Link>
      </div>
    </form>
  );
}