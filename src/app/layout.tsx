import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Header } from '@/components/Header';
import { Providers } from '@/components/Providers';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'eSIM Shop — Buy Travel eSIMs',
  description:
    'Browse destinations and buy eSIM plans for your next trip. Instant delivery, global coverage.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <Header />
          <main
            style={{
              maxWidth: '80rem',
              margin: '0 auto',
              paddingTop: '6rem',
              paddingBottom: '4rem',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
