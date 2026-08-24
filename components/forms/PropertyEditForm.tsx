'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface ExistingImage {
    id: string;
    url: string;
    isCover: boolean;
}

interface PropertyEditFormProps {
    propertyId: string;
    initialData: {
        title: string;
        description: string;
        propertyType: string;
        purpose: string;
        price: number;
        currency: string;
        areaM2: number | null;
        bedrooms: number | null;
        bathrooms: number | null;
        parkingSpaces: number | null;
        province: string;
        municipality: string;
        district: string;
        neighborhood: string;
        address: string;
        images: ExistingImage[];
    };
}

export default function PropertyEditForm({ propertyId, initialData }: PropertyEditFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState<'draft' | 'submit'>('draft');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const action = actionType;

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
                action
            };

            const res = await fetch(`/api/v1/properties/${propertyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error?.message ?? 'Erro ao atualizar o imóvel.');
                return;
            }

            setSuccess(action === 'submit' ? 'Imóvel enviado para revisão com sucesso.' : 'Alterações guardadas com sucesso.');
            setTimeout(() => router.push('/dashboard/imoveis'), 1200);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro inesperado ao atualizar o imóvel.');
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
                        <input id="title" name="title" type="text" required minLength={5} defaultValue={initialData.title} className="input" />
                    </div>
                    <div>
                        <label htmlFor="propertyType" className="label">Tipo de imóvel *</label>
                        <select id="propertyType" name="propertyType" required defaultValue={initialData.propertyType} className="input">
                            <option value="">Selecione...</option>
                            {PROPERTY_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="purpose" className="label">Finalidade *</label>
                        <select id="purpose" name="purpose" required defaultValue={initialData.purpose} className="input">
                            <option value="">Selecione...</option>
                            <option value="SALE">Venda</option>
                            <option value="RENT">Arrendamento</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="label">Preço (AOA) *</label>
                        <input id="price" name="price" type="number" required min={1} defaultValue={initialData.price} className="input" />
                    </div>
                    <div>
                        <label htmlFor="currency" className="label">Moeda</label>
                        <select id="currency" name="currency" defaultValue={initialData.currency} className="input">
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
                        <select id="province" name="province" required defaultValue={initialData.province} className="input">
                            <option value="">Selecione...</option>
                            {PROVINCES.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="municipality" className="label">Município *</label>
                        <input id="municipality" name="municipality" type="text" required defaultValue={initialData.municipality} className="input" />
                    </div>
                    <div>
                        <label htmlFor="neighborhood" className="label">Bairro</label>
                        <input id="neighborhood" name="neighborhood" type="text" defaultValue={initialData.neighborhood} className="input" />
                    </div>
                    <div>
                        <label htmlFor="district" className="label">Distrito</label>
                        <input id="district" name="district" type="text" defaultValue={initialData.district} className="input" />
                    </div>
                </div>
            </section>

            {/* Etapa 3: Descrição */}
            <section className="card p-6">
                <h2 className="text-lg font-semibold text-slate-900">Descrição</h2>
                <div className="mt-5">
                    <label htmlFor="description" className="label">Descrição do imóvel *</label>
                    <textarea id="description" name="description" required rows={4} minLength={20} defaultValue={initialData.description} className="input" />
                </div>
            </section>

            {/* Etapa 4: Fotografias existentes */}
            {initialData.images.length > 0 && (
                <section className="card p-6">
                    <h2 className="text-lg font-semibold text-slate-900">Fotografias atuais</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {initialData.images.map((img) => (
                            <div key={img.id} className="relative overflow-hidden rounded-xl border border-slate-200">
                                <img src={img.url} alt="Fotografia do imóvel" className="aspect-square w-full object-cover" />
                                {img.isCover && (
                                    <span className="absolute left-2 top-2 badge-green">Capa</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                        Para adicionar ou remover fotografias, contacte o suporte ou crie um novo anúncio.
                    </p>
                </section>
            )}

            {/* Etapa 5: Características (opcionais) */}
            <section className="card p-6">
                <h2 className="text-lg font-semibold text-slate-900">Características <span className="text-sm font-normal text-slate-400">(opcionais)</span></h2>
                <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
                    <div>
                        <label htmlFor="areaM2" className="label">Área (m²)</label>
                        <input id="areaM2" name="areaM2" type="number" min={1} defaultValue={initialData.areaM2 ?? ''} className="input" />
                    </div>
                    <div>
                        <label htmlFor="bedrooms" className="label">Quartos</label>
                        <input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={initialData.bedrooms ?? ''} className="input" />
                    </div>
                    <div>
                        <label htmlFor="bathrooms" className="label">Casas de banho</label>
                        <input id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={initialData.bathrooms ?? ''} className="input" />
                    </div>
                    <div>
                        <label htmlFor="parkingSpaces" className="label">Estacionamento</label>
                        <input id="parkingSpaces" name="parkingSpaces" type="number" min={0} defaultValue={initialData.parkingSpaces ?? ''} className="input" />
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
                    {loading && actionType === 'draft' ? 'A guardar...' : 'Guardar alterações'}
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