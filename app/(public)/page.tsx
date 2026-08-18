import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    prisma.property.findMany({
      where: { status: 'PUBLISHED' },
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
      orderBy: { publishedAt: 'desc' },
      take: 3
    }),
    prisma.property.findMany({
      where: { status: 'PUBLISHED' },
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 6
    })
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-24 sm:py-32 text-white">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">Global Holding</p>
            <h1 className="mt-4 text-5xl sm:text-6xl font-bold">
              Encontre o imóvel perfeito em Angola
            </h1>
            <p className="mt-6 text-xl text-brand-100">
              Compre, arrende ou publique imóveis com confiança na plataforma imobiliária da Global Holding.
            </p>

            {/* Pesquisa */}
            <form action="/imoveis" className="mt-10 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xl sm:flex-row">
              <input
                type="text"
                name="q"
                placeholder="Pesquisar por localização, bairro ou município..."
                className="input flex-1"
              />
              <select name="finalidade" className="input sm:w-44">
                <option value="">Finalidade</option>
                <option value="COMPRA">Comprar</option>
                <option value="ARRENDAMENTO">Arrendar</option>
              </select>
              <button type="submit" className="btn-gold">
                Pesquisar
              </button>
            </form>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/imoveis?finalidade=COMPRA" className="font-semibold text-brand-100 hover:text-white transition-colors">
                Comprar →
              </Link>
              <Link href="/imoveis?finalidade=ARRENDAMENTO" className="font-semibold text-brand-100 hover:text-white transition-colors">
                Arrendar →
              </Link>
              <Link href="/registo" className="font-semibold text-brand-100 hover:text-white transition-colors">
                Publicar imóvel →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Imóveis em destaque */}
      <section className="py-20 bg-white">
        <div className="container-page">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">Imóveis em destaque</h2>
              <p className="mt-3 text-lg text-slate-600">As melhores oportunidades selecionadas para si.</p>
            </div>
            <Link href="/imoveis" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Ver todos →
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-lg text-slate-600">Ainda não existem imóveis publicados.</p>
              <Link href="/registo" className="btn-primary mt-6 inline-flex">
                Publicar o primeiro imóvel
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property) => (
                <Link key={property.id} href={`/imovel/${property.id}`} className="card group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {property.images[0] ? (
                      <img
                        src={property.images[0].imageUrl}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        Sem fotografia
                      </div>
                    )}
                    <span className="absolute left-4 top-4 badge-info">
                      {property.purpose === 'SALE' ? 'Venda' : 'Arrendamento'}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xl font-bold text-brand-700">
                      {Number(property.price).toLocaleString('pt-PT')} {property.currency}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{property.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {property.municipality}, {property.province}
                    </p>
                    <div className="mt-4 flex gap-4 text-xs text-slate-500">
                      {property.bedrooms != null && <span>🛏️ {property.bedrooms} quartos</span>}
                      {property.bathrooms != null && <span>🚿 {property.bathrooms} WCs</span>}
                      {property.areaM2 != null && <span>📐 {Number(property.areaM2)} m²</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Imóveis recentes */}
      <section className="py-20 bg-slate-50">
        <div className="container-page">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">Imóveis recentes</h2>
              <p className="mt-3 text-lg text-slate-600">As últimas novidades do mercado.</p>
            </div>
            <Link href="/imoveis" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Ver todos →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-lg text-slate-600">Não encontramos imóveis para esta pesquisa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((property) => (
                <Link key={property.id} href={`/imovel/${property.id}`} className="card group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {property.images[0] ? (
                      <img
                        src={property.images[0].imageUrl}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        Sem fotografia
                      </div>
                    )}
                    <span className="absolute left-4 top-4 badge-info">
                      {property.purpose === 'SALE' ? 'Venda' : 'Arrendamento'}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xl font-bold text-brand-700">
                      {Number(property.price).toLocaleString('pt-PT')} {property.currency}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{property.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {property.municipality}, {property.province}
                    </p>
                    <div className="mt-4 flex gap-4 text-xs text-slate-500">
                      {property.bedrooms != null && <span>🛏️ {property.bedrooms} quartos</span>}
                      {property.bathrooms != null && <span>🚿 {property.bathrooms} WCs</span>}
                      {property.areaM2 != null && <span>📐 {Number(property.areaM2)} m²</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Publicar */}
      <section className="py-20">
        <div className="container-page">
          <div className="rounded-2xl bg-gradient-to-r from-brand-800 to-brand-600 p-12 sm:p-16 text-center text-white">
            <h2 className="text-4xl font-bold">Tem um imóvel para publicar?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
              Publique o seu imóvel gratuitamente e alcance milhares de potenciais compradores e arrendatários em Angola.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/registo" className="btn-gold">
                Criar conta gratuita
              </Link>
              <Link href="/login" className="btn-secondary">
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
