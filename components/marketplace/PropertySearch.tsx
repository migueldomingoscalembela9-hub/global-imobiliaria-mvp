'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchItem {
  id: string;
  reference: string;
  title: string;
  purpose: string;
  propertyType: string;
  province: string;
  municipality: string;
  neighborhood: string;
  price: string;
  currency: string;
  areaM2: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  imageUrl?: string;
}

interface SearchResponse {
  items: SearchItem[];
  total: number;
}

export default function PropertySearch() {
  const [query, setQuery] = useState('');
  const [purpose, setPurpose] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ propertyType: '', precoMin: '', precoMax: '', quartos: '' });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const PROVINCES = [
    'Luanda', 'Benguela', 'Huambo', 'Lubango', 'Cabinda', 'Malanje', 'Namibe', 'Uíge',
    'Kwanza Sul', 'Kwanza Norte', 'Lunda Norte', 'Lunda Sul', 'Moxico', 'Bengo', 'Bié',
    'Cunene', 'Huíla', 'Zaire'
  ];

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set('q', query.trim());
        if (purpose) params.set('purpose', purpose);
        if (filters.propertyType) params.set('propertyType', filters.propertyType);
        if (filters.precoMin) params.set('precoMin', filters.precoMin);
        if (filters.precoMax) params.set('precoMax', filters.precoMax);
        if (filters.quartos) params.set('quartos', filters.quartos);

        const res = await fetch(`/api/v1/properties?${params.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setResults(data.data.items ?? []);
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
  }, [query, purpose, filters.propertyType, filters.precoMin, filters.precoMax, filters.quartos]);

  return (
    <div>
      {/* Pesquisa principal */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="O que procura? Ex.: Apartamento T3, Casa em Talatona, Kilamba..."
          className="input py-3.5 pl-12 text-base"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">A pesquisar...</span>
        )}
      </div>

      {/* Pesquisa avançada */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        {showFilters ? 'Ocultar filtros ▲' : 'Filtros ▼'}
      </button>

      {showFilters && (
        <div className="card mt-3 grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <label className="label">Tipo de imóvel</label>
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              className="input"
            >
              <option value="">Todos</option>
              <option value="APARTMENT">Apartamento</option>
              <option value="HOUSE">Moradia</option>
              <option value="LAND">Terreno</option>
              <option value="OFFICE">Escritório</option>
              <option value="STORE">Loja</option>
              <option value="WAREHOUSE">Armazém</option>
              <option value="BUILDING">Prédio</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>
          <div>
            <label className="label">Preço mínimo</label>
            <input
              type="number"
              value={filters.precoMin}
              onChange={(e) => setFilters({ ...filters, precoMin: e.target.value })}
              placeholder="0"
              className="input"
            />
          </div>
          <div>
            <label className="label">Preço máximo</label>
            <input
              type="number"
              value={filters.precoMax}
              onChange={(e) => setFilters({ ...filters, precoMax: e.target.value })}
              placeholder="Sem limite"
              className="input"
            />
          </div>
          <div>
            <label className="label">Quartos</label>
            <select
              value={filters.quartos}
              onChange={(e) => setFilters({ ...filters, quartos: e.target.value })}
              className="input"
            >
              <option value="">Qualquer</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label className="label">Finalidade</label>
            <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="input">
              <option value="">Todas</option>
              <option value="SALE">Venda</option>
              <option value="RENT">Arrendamento</option>
            </select>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="mt-8">
        {searched && results.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-lg text-slate-500">Não encontramos imóveis para esta pesquisa.</p>
            <p className="mt-2 text-sm text-slate-400">Tente uma localização, tipo de imóvel ou faixa de preço diferente.</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="mb-4 text-sm text-slate-600">{results.length} imóveis encontrados</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((property) => (
                <Link key={property.id} href={`/imovel/${property.id}`} className="card group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {property.imageUrl ? (
                      <img
                        src={property.imageUrl}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">Sem fotografia</div>
                    )}
                    <span className="absolute left-3 top-3 badge-blue">
                      {property.purpose === 'SALE' ? 'Venda' : 'Arrendamento'}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-lg font-bold text-brand-700">
                      {Number(property.price).toLocaleString('pt-PT')} {property.currency}
                    </p>
                    <h3 className="mt-1 font-semibold text-slate-900">{property.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.municipality}, {property.province}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      {property.bedrooms != null && <span>{property.bedrooms} quartos</span>}
                      {property.bathrooms != null && <span>{property.bathrooms} WCs</span>}
                      {property.areaM2 != null && <span>{Number(property.areaM2)} m²</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}