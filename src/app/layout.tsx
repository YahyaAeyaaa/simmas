import { Inter, Poppins, Roboto, Montserrat, Open_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import type { ReactNode } from 'react';

// Setup fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-open-sans',
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${montserrat.variable} ${openSans.variable} ${plusJakarta.variable}`}>
      <body className={plusJakarta.className}>
        {children}
      </body>
    </html>
  );
}