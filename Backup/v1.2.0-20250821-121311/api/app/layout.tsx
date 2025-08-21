import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pengeplan - Din digitale økonomiske hjelper',
  description: 'Pengeplan hjelper deg med å få bedre kontroll over økonomien din. Gratis budsjettverktøy, gjeldsoversikt og veiledning til støtteordninger.',
  keywords: 'økonomi, budsjett, gjeld, NAV, støtteordninger, økonomisk hjelp',
  authors: [{ name: 'Pengeplan' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Pengeplan - Din digitale økonomiske hjelper',
    description: 'Få bedre kontroll over økonomien din med våre gratis verktøy',
    type: 'website',
    locale: 'nb_NO',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
