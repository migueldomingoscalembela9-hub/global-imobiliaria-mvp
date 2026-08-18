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
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}