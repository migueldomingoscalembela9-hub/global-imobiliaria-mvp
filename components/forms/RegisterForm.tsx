'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ROLES = [
  { code: 'BUYER', label: 'Comprador', description: 'Procuro imóveis para comprar' },
  { code: 'TENANT', label: 'Arrendatário', description: 'Procuro imóveis para arrendar' },
  { code: 'OWNER', label: 'Proprietário', description: 'Quero publicar os meus imóveis' },
  { code: 'AGENT', label: 'Agente Imobiliário', description: 'Represento clientes no mercado' }
] as const;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      role: formData.get('role') ?? 'BUYER'
    };

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message ?? 'Erro ao criar conta.');
        return;
      }

      const role = data.data?.role;
      if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch {
      setError('Não foi possível criar a conta. Tente novamente.');
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

      <div>
        <label htmlFor="name" className="label">Nome completo</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          className="input"
          placeholder="O seu nome"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input"
            placeholder="o.seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="label">Telefone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            minLength={9}
            className="input"
            placeholder="+244 9XX XXX XXX"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="label">Palavra-passe</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="input"
          placeholder="Mínimo 8 caracteres"
        />
        <p className="mt-1 text-xs text-slate-500">Use pelo menos 8 caracteres.</p>
      </div>

      <div>
        <span className="label">Tipo de conta</span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROLES.map((role) => (
            <label
              key={role.code}
              className="cursor-pointer rounded-lg border border-slate-200 p-3 transition-colors has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
            >
              <input
                type="radio"
                name="role"
                value={role.code}
                defaultChecked={role.code === 'BUYER'}
                className="sr-only"
              />
              <span className="block text-sm font-medium text-slate-900">{role.label}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{role.description}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'A criar conta...' : 'Criar conta'}
      </button>
    </form>
  );
}