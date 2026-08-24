'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
    name: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
}

export default function ProfileForm({ name, email, phone, avatarUrl }: ProfileFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const body = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            avatarUrl: formData.get('avatarUrl') || null,
            currentPassword: formData.get('currentPassword') || undefined,
            newPassword: formData.get('newPassword') || undefined
        };

        try {
            const res = await fetch('/api/v1/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error?.message ?? 'Erro ao atualizar o perfil.');
                return;
            }

            setSuccess('Perfil atualizado com sucesso!');
            router.refresh();
        } catch {
            setError('Não foi possível atualizar o perfil. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
                <label htmlFor="name" className="label">Nome completo</label>
                <input id="name" name="name" type="text" defaultValue={name} required minLength={2} className="input" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="email" className="label">Email</label>
                    <input id="email" type="email" defaultValue={email} disabled className="input bg-slate-100" />
                    <p className="mt-1 text-xs text-slate-400">O email não pode ser alterado.</p>
                </div>
                <div>
                    <label htmlFor="phone" className="label">Telefone</label>
                    <input id="phone" name="phone" type="tel" defaultValue={phone} required minLength={9} className="input" />
                </div>
            </div>

            <div>
                <label htmlFor="avatarUrl" className="label">URL da fotografia</label>
                <input id="avatarUrl" name="avatarUrl" type="url" defaultValue={avatarUrl ?? ''} className="input" placeholder="https://..." />
            </div>

            <div className="border-t border-slate-200 pt-5">
                <h3 className="font-semibold text-slate-900">Alterar palavra-passe</h3>
                <p className="mt-1 text-xs text-slate-500">Preencha apenas se desejar alterar a palavra-passe.</p>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="currentPassword" className="label">Palavra-passe atual</label>
                        <input id="currentPassword" name="currentPassword" type="password" className="input" />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="label">Nova palavra-passe</label>
                        <input id="newPassword" name="newPassword" type="password" minLength={8} className="input" />
                    </div>
                </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'A guardar...' : 'Guardar alterações'}
            </button>
        </form>
    );
}