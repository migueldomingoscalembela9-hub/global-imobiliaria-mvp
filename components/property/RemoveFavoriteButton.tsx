'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RemoveFavoriteButtonProps {
    propertyId: string;
}

export default function RemoveFavoriteButton({ propertyId }: RemoveFavoriteButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleRemove() {
        if (loading) return;

        if (!window.confirm('Tem a certeza que deseja remover este imóvel dos favoritos?')) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/v1/properties/${propertyId}/favorite`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error?.message ?? 'Erro ao remover dos favoritos.');
            }
        } catch {
            alert('Não foi possível remover dos favoritos.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            className="btn-secondary w-full text-sm hover:bg-red-50 hover:text-red-700 hover:border-red-200"
        >
            {loading ? 'A remover...' : 'Remover favorito'}
        </button>
    );
}