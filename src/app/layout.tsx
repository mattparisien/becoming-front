import localFont from 'next/font/local';
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
  return (
    <html
      suppressHydrationWarning
      className={`${roobert.variable} ${editeur.variable} ${dida.variable}`}
    >
      <body className='font-sans antialiased'>
        {children}
      </body>
    </html>
  );
}