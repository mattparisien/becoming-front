import localFont from 'next/font/local';
import Script from 'next/script';
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
  const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;

  return (
    <html
      suppressHydrationWarning
      className={`${roobert.variable} ${editeur.variable} ${dida.variable}`}
    >
      <body className='font-sans text-foreground antialiased'>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}