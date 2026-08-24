'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminReviewActionsProps {
  propertyId: string;
  propertyTitle: string;
}

export default function AdminReviewActions({ propertyId, propertyTitle }: AdminReviewActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    if (!window.confirm(`Tem a certeza que deseja aprovar e publicar o anúncio "${propertyTitle}"?`)) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/admin/properties/${propertyId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? 'Erro ao aprovar o imóvel.');
        return;
      }

      router.refresh();
    } catch {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectReason.trim()) {
      setError('O motivo da rejeição é obrigatório.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('reason', rejectReason.trim());

      const res = await fetch(`/api/v1/admin/properties/${propertyId}/reject`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? 'Erro ao rejeitar o imóvel.');
        return;
      }

      setShowRejectForm(false);
      setRejectReason('');
      router.refresh();
    } catch {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleApprove}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'A processar...' : '✓ Aprovar e Publicar'}
        </button>

        {!showRejectForm ? (
          <button
            type="button"
            onClick={() => setShowRejectForm(true)}
            disabled={loading}
            className="btn-danger"
          >
            ✕ Rejeitar anúncio
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowRejectForm(false);
              setError(null);
            }}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            Cancelar
          </button>
        )}
      </div>

      {showRejectForm && (
        <form onSubmit={handleReject} className="flex flex-col sm:flex-row gap-2 rounded-lg border border-red-200 bg-red-50/50 p-3">
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
            placeholder="Indique claramente o motivo da rejeição..."
            className="input flex-1 text-sm bg-white"
          />
          <button
            type="submit"
            disabled={loading || !rejectReason.trim()}
            className="btn-danger whitespace-nowrap text-sm"
          >
            {loading ? 'A rejeitar...' : 'Confirmar Rejeição'}
          </button>
        </form>
      )}
    </div>
  );
}
