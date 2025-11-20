import { CartStoreInitializer } from "@/components/CartStoreInitializer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import IntroWrapper from "@/components/IntroWrapper";
import LocationModal from "@/components/LocationModal";
import Main from "@/components/Main";
import Menu from "@/components/Menu";
import PageTransitionScreen from "@/components/PageTransitionScreen";
import { CartDrawerProvider } from "@/context/CartDrawerContext";
import { IntroProvider } from "@/context/IntroContext";
import { LocationModalProvider } from "@/context/LocationModalContext";
import { MenuProvider } from "@/context/MenuContext";
import { PageTransitionProvider } from "@/context/PageTransitionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { getServerCartItemCount } from "@/lib/cart/server";
import { PAGE_TRANSITION_EASE, PAGE_TRANSITION_IN_DURATION, PAGE_TRANSITION_OUT_DURATION, PAGE_TRANSITION_PAUSE_DURATION } from "@/lib/constants";
import { getGlobalData } from "@/lib/fetchers/globals";
import { getLocales, getLocalesForCountry, type Locale } from "@/lib/i18n/config";
import { FooterSettings, Settings } from "@/lib/sanity/schema-types";
import { Color, type Location } from "@/lib/types/misc";
import { Metadata } from "next";
import { cookies } from "next/headers";
import notFound from "./not-found";

interface GlobalDataQueryResult {
  menu: {
    theme: {
      palette: {
        bg: Color;
        fg: Color;
        accent: Color;
        additional: Color[];
      };
    };
    navigation: {
      items: {
        title: string;
        slug: string;
      }[];
    }
  };
  theme: {
    palette: {
      bg: Color;
      fg: Color;
      accent: Color;
      additional: Color[];
    };
  };
  seo: {
    title: string;
    description: string;
    image: {
      url: string;
      alt: string;
    }
  },
  languages: {
    label: string;
    code: string;
  }[];
  brand: {
    title: string;
    companyName: string;
    tagline: string;
    description: string;
    logo: {
      url: string;
      alt: string;
    } | null;
    logoAlt: string;
    favicon: {
      url: string;
      alt: string;
    } | null;
  };
  socialLinks: Settings['socialLinks'];

  footer: FooterSettings & {
    navigations: {
      _id: string;
      title: string;
      items: {
        label: string;
        slug: string;
      }[]
    }[];
    legalBar?: {
      navigation?: {
        items: {
          label: string;
          slug: string;
        }[];
      };
    };
  };
  contactEmail: string;
  markets: Location[];

}

type Props = {
  params: Promise<{ lang: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const globalData = await getGlobalData(lang);

  if (!globalData) {
    return {
      title: 'Global Data Not Found',
      description: 'The requested global data could not be found.',
    };
  }

  return {
    title: globalData.seo.title,
    description: globalData.seo.description || globalData.seo.title,
    metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
    icons: {
      icon: globalData.seo.image?.url,
    },
    openGraph: {
      title: globalData.seo.title,
      description: globalData.seo.description || globalData.seo.title,
      images: globalData.seo.image ? [globalData.seo.image] : [],
    },

  };
}


export async function generateStaticParams() {
  return (await getLocales()).map((locale) => ({ locale }));
}

const getCurrentLocation = (countryCode: string, localeCode: string, markets: Location[]) => {

  return {
    country: {
      code: countryCode,
      name: markets.find(market => market.country.code === countryCode)?.country.name || '', // Name can be fetched or left empty as needed
    },
    locale: localeCode,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string; lang: string }>;
}) {

  const { country, lang } = await params;
  // Validate that the incoming `lang` parameter is valid
  if (!(await getLocalesForCountry(country)).includes(lang as Locale)) {
    notFound();
  }

  // Check if intro has been played before (server-side)
  const cookieStore = await cookies();
  const introPlayedCookie = cookieStore.get('intro_played');
  const hasIntroPlayed = introPlayedCookie?.value === 'true';

  // Fetch global data with locale parameter
  const globalData = await getGlobalData(lang) as GlobalDataQueryResult | null;
  if (!globalData) {
    notFound();
  }

  const palette = globalData?.theme?.palette || null;
  const menuLinks = globalData?.menu?.navigation.items || [];
  const menuPalette = globalData?.menu?.theme?.palette || null;
  const footer = globalData?.footer || { _type: 'footerSettings' as const, navigations: [] };
  const brand = globalData?.brand || { title: "Title", companyName: 'Company Name', tagline: '', description: '', logo: null, logoAlt: '', favicon: null };
  const contactEmail = globalData?.contactEmail || '';
  const markets = globalData?.markets || [];

  // Get server-side cart count to prevent flash
  const serverCartCount = await getServerCartItemCount();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --page-transition-in-duration: ${PAGE_TRANSITION_IN_DURATION}ms;
            --page-transition-out-duration: ${PAGE_TRANSITION_OUT_DURATION}ms;
            --page-transition-pause-duration: ${PAGE_TRANSITION_PAUSE_DURATION}ms;
            --page-transition-ease: ${PAGE_TRANSITION_EASE};
            ${palette?.fg?.value ? `--fg-color: ${palette.fg.value};` : ''}
            ${palette?.bg?.value ? `--bg-color: ${palette.bg.value};` : ''}
            ${palette?.accent?.value ? `--accent-color: ${palette.accent.value};` : ''}
            ${menuPalette?.fg?.value ? `--fg-color-menu: ${menuPalette.fg.value};` : ''}
            ${menuPalette?.bg?.value ? `--bg-color-menu: ${menuPalette.bg.value};` : ''}
            ${menuPalette?.accent?.value ? `--accent-color-menu: ${menuPalette.accent.value};` : ''}
          }
        `
      }} />
      <ThemeProvider palette={palette}>
        <IntroProvider initialIntroPlayed={hasIntroPlayed} >
          <PageTransitionProvider>
            <MenuProvider>
              <LocationModalProvider>
                <CartDrawerProvider>
                  <CartStoreInitializer initialCartCount={serverCartCount} />
                  <Header title={brand.title} countryCode={country.toUpperCase()} initialCartCount={serverCartCount} />
                  <Menu items={menuLinks} />
                  <IntroWrapper />
                  <Main>
                    <div className={`font-sans min-h-[calc(100vh-4rem)] transition-opacity duration-300 rounded-b-4xl pb-main-footer-offset`}>
                      {children}
                    </div>
                  </Main>
                  <PageTransitionScreen text={brand.title} />
                  <Footer {...footer} brandName={brand.title} legalEntityName={brand.companyName} tagLine={brand.tagline} locale={lang as Locale} contactEmail={contactEmail} socialLinks={globalData?.socialLinks || []} />
                  <LocationModal markets={markets} initialMarketValue={getCurrentLocation(country, lang, markets)} />
                </CartDrawerProvider>
              </LocationModalProvider>
            </MenuProvider>
          </PageTransitionProvider>
        </IntroProvider>
      </ThemeProvider>
    </>
  );
}
