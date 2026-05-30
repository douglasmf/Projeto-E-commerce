// @ts-ignore: allow importing global CSS without type declarations
import './globals.css';
import { Roboto } from 'next/font/google';

import { AuthProvider } from '@/providers/AuthProvider';

const roboto = Roboto({ subsets: ['latin'] });

export const metadata = {
  title: 'PrimeCart',
  description: 'frontend do projeto',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={roboto.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}