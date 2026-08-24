'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserActionButtonsProps {
  userId: string;
  currentStatus: string;
  isSelf: boolean;
}

export default function UserActionButtons({ userId, currentStatus, isSelf }: UserActionButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (isSelf) {
    return <span className="text-xs text-slate-400 font-medium">Sua conta</span>;
  }

  async function handleToggleStatus(action: 'block' | 'activate') {
    if (loading) return;

    const confirmMsg = action === 'block'
      ? 'Tem a certeza que deseja bloquear este utilizador?'
      : 'Tem a certeza que deseja reativar este utilizador?';

    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error?.message ?? 'Erro ao alterar estado do utilizador.');
      }
    } catch {
      alert('Não foi possível alterar o estado do utilizador.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus === 'BLOCKED' ? (
        <button
          type="button"
          onClick={() => handleToggleStatus('activate')}
          disabled={loading}
          className="btn-primary text-xs py-1 px-2.5"
        >
          {loading ? 'A ativar...' : 'Ativar'}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleToggleStatus('block')}
          disabled={loading}
          className="btn-danger text-xs py-1 px-2.5"
        >
          {loading ? 'A bloquear...' : 'Bloquear'}
        </button>
      )}
    </div>
  );
}
