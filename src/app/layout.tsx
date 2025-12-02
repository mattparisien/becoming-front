import localFont from 'next/font/local';
import ConditionalAnalytics from '@/components/ConditionalAnalytics';
import "./globals.css";

const roobert = localFont({
  src: './assets/fonts/RoobertCollectionVF.woff2',
  variable: '--font-roobert',
  display: 'swap',
});

const dida = localFont({
  src: './assets/fonts/Dida.woff2',
  variable: '--font-dida',
  display: 'swap',
});

const editeur = localFont({
  src: [
    {
      path: './assets/fonts/NNEditeurSemi-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './assets/fonts/NNEditeurSemi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-editeur',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = process.env.NODE_ENV === 'production' ? process.env.GA_MEASUREMENT_ID : 'test';

  return (
    <html
      suppressHydrationWarning
      className={`${roobert.variable} ${editeur.variable} ${dida.variable}`}
    >
      <body className='font-sans text-foreground antialiased' suppressHydrationWarning>
        {GA_MEASUREMENT_ID && <ConditionalAnalytics gaId={GA_MEASUREMENT_ID} />}
        {children}
      </body>
    </html>
  );
}