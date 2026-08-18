'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  reference: string;
  title: string;
  ownerName: string;
  province: string;
  municipality: string;
  price: string;
  currency: string;
  status: string;
  createdAt: string;
  imageUrl?: string;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Rascunho', className: 'badge-gray' },
  REVIEW: { label: 'Em revisão', className: 'badge-yellow' },
  APPROVED: { label: 'Aprovado', className: 'badge-blue' },
  PUBLISHED: { label: 'Publicado', className: 'badge-green' },
  REJECTED: { label: 'Rejeitado', className: 'badge-red' },
  ARCHIVED: { label: 'Arquivado', className: 'badge-gray' }
};

export default function AdminPropertySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/admin/properties/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (res.ok) {
          setResults(data.data ?? []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="adminPropertySearch" className="label">Pesquisar imóvel</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            id="adminPropertySearch"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por ID, referência, título, proprietário, email ou telefone..."
            className="input pl-10"
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">A pesquisar...</span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Os resultados aparecem enquanto escreve. Pesquisa por referência, título, nome do proprietário, email ou telefone.
        </p>
      </div>

      {searched && results.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-slate-500">Não foram encontrados imóveis para esta pesquisa.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((p) => {
            const badge = STATUS_LABELS[p.status] ?? { label: p.status, className: 'badge-gray' };
            return (
              <div key={p.id} className="card overflow-hidden">
                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                  <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-36">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">Sem foto</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-xs text-slate-400">{p.reference}</p>
                        <h3 className="font-semibold text-slate-900">{p.title}</h3>
                        <p className="text-sm text-slate-600">Proprietário: {p.ownerName}</p>
                        <p className="text-sm text-slate-600">{p.municipality}, {p.province}</p>
                        <p className="mt-1 text-lg font-bold text-brand-700">
                          {Number(p.price).toLocaleString('pt-PT')} {p.currency}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={badge.className}>{badge.label}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(p.createdAt).toLocaleDateString('pt-PT')}
                        </span>
                        <Link href={`/imovel/${p.id}`} className="btn-secondary text-sm">Ver imóvel</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}