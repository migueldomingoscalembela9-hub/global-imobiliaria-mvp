'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center py-4">
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          Link de recuperação inválido ou incompleto. Solicite um novo link de recuperação de palavra-passe.
        </div>
        <Link href="/recuperar-password" className="btn-primary mt-6 inline-flex">
          Pedir novo link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError('A palavra-passe deve ter pelo menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message ?? 'Erro ao redefinir a palavra-passe.');
        return;
      }

      setSuccess(data.data?.message ?? 'Palavra-passe redefinida com sucesso!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch {
      setError('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          {success}
          <p className="mt-1 text-xs text-emerald-600">A redirecionar para a página de login...</p>
        </div>
      )}

      <div>
        <label htmlFor="password" className="label">Nova palavra-passe</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="label">Confirmar nova palavra-passe</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
          placeholder="Repita a nova palavra-passe"
        />
      </div>

      <button type="submit" disabled={loading || Boolean(success)} className="btn-primary w-full">
        {loading ? 'A atualizar...' : 'Atualizar palavra-passe'}
      </button>
    </form>
  );
}
