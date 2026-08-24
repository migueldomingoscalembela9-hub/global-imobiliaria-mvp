'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface VisitFormProps {
    propertyId: string;
    propertyTitle: string;
}

const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
];

export default function VisitForm({ propertyId, propertyTitle }: VisitFormProps) {
    const router = useRouter();
    const [preferredDate, setPreferredDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
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
            const res = await fetch(`/api/v1/properties/${propertyId}/visit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preferredDate, preferredTime, message: message || null })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error?.message ?? 'Erro ao solicitar a visita.');
                return;
            }

            setSuccess('Pedido de visita enviado com sucesso! O anunciante será notificado.');
            setPreferredDate('');
            setPreferredTime('');
            setMessage('');
            setTimeout(() => router.push(`/imovel/${propertyId}`), 2000);
        } catch {
            setError('Não foi possível enviar o pedido. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    const today = new Date().toISOString().split('T')[0];

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

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="preferredDate" className="label">Data preferida *</label>
                    <input
                        id="preferredDate"
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        required
                        min={today}
                        className="input"
                    />
                </div>
                <div>
                    <label htmlFor="preferredTime" className="label">Hora preferida *</label>
                    <select
                        id="preferredTime"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        required
                        className="input"
                    >
                        <option value="">Selecione...</option>
                        {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="message" className="label">Mensagem (opcional)</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="input"
                    placeholder={`Olá, gostaria de agendar uma visita ao imóvel "${propertyTitle}".`}
                />
            </div>

            <button type="submit" disabled={loading || !preferredDate || !preferredTime} className="btn-primary w-full">
                {loading ? 'A enviar...' : 'Solicitar visita'}
            </button>
        </form>
    );
}