'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ContactFormProps {
    propertyId: string;
    propertyTitle: string;
}

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const res = await fetch(`/api/v1/properties/${propertyId}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error?.message ?? 'Erro ao enviar a mensagem.');
                return;
            }

            setSuccess('Mensagem enviada com sucesso! O anunciante será notificado.');
            setMessage('');
            setTimeout(() => router.push(`/imovel/${propertyId}`), 2000);
        } catch {
            setError('Não foi possível enviar a mensagem. Tente novamente.');
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
                    <p className="mt-1 text-xs text-emerald-600">A redirecionar para o imóvel...</p>
                </div>
            )}

            <div>
                <label htmlFor="message" className="label">Mensagem *</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    minLength={10}
                    rows={5}
                    className="input"
                    placeholder={`Olá, estou interessado no imóvel "${propertyTitle}". Gostaria de saber mais informações...`}
                />
                <p className="mt-1 text-xs text-slate-500">Mínimo de 10 caracteres.</p>
            </div>

            <button type="submit" disabled={loading || message.trim().length < 10} className="btn-primary w-full">
                {loading ? 'A enviar...' : 'Enviar mensagem'}
            </button>
        </form>
    );
}