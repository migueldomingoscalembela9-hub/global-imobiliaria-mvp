'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FavoriteButtonProps {
    propertyId: string;
    isFavorite: boolean;
}

export default function FavoriteButton({ propertyId, isFavorite: initialIsFavorite }: FavoriteButtonProps) {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleToggle() {
        if (loading) return;
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`/api/v1/properties/${propertyId}/favorite`, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error?.message ?? 'Erro ao atualizar os favoritos.');
                return;
            }

            setIsFavorite(!isFavorite);
            router.refresh();
        } catch {
            setError('Não foi possível atualizar os favoritos.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="flex flex-col items-center gap-3">
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={loading}
                    className={isFavorite ? 'btn-danger w-full' : 'btn-primary w-full'}
                >
                    {loading
                        ? 'A processar...'
                        : isFavorite
                            ? '❤️ Remover dos favoritos'
                            : '❤️ Adicionar aos favoritos'}
                </button>

                <Link href={`/imovel/${propertyId}`} className="btn-secondary w-full">
                    Voltar ao imóvel
                </Link>

                <Link href="/dashboard/favoritos" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                    Ver os meus favoritos →
                </Link>
            </div>
        </div>
    );
}