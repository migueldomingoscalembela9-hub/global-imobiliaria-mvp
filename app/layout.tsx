import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Global Imobiliária',
    template: '%s | Global Imobiliária'
  },
  description: 'Marketplace imobiliário da Global Holding. Encontre, publique e descubra imóveis com mais confiança em Angola.',
  keywords: ['imóveis', 'Angola', 'arrendamento', 'venda', 'Global Imobiliária', 'marketplace imobiliário'],
  openGraph: {
    title: 'Global Imobiliária',
    description: 'Marketplace imobiliário da Global Holding.',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <head>
        {/* Playfair Display — Títulos premium */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Inter:wght@100,200,300,400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}