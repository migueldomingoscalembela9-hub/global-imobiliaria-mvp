import PropertySearch from '@/components/marketplace/PropertySearch';

export const dynamic = 'force-dynamic';

export default function ImoveisPage() {
  return (
    <div className="bg-slate-50 py-10">
      <div className="container-page">
        <h1 className="text-2xl font-bold text-slate-900">Pesquisar imóveis</h1>
        <p className="mt-1 text-sm text-slate-600">Escreva o que procura e os resultados aparecem à medida que digita.</p>

        <div className="mt-6">
          <PropertySearch />
        </div>
      </div>
    </div>
  );
}