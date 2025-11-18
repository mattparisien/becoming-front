import { Locale } from "@/lib/i18n/config";
import { getFooterTranslations } from "@/lib/i18n/translations";
import { Settings } from "@/lib/sanity/schema-types";
import TransitionLink from "./TransitionLink";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { ReactNode } from "react";

interface NavigationItem {
  label: string;
  slug: string;
}

interface Navigation {
  _id: string;
  title: string;
  items: NavigationItem[];
}

interface LegalBar {
  navigation?: {
    items: NavigationItem[];
  };
}

interface FooterProps {
  _type: 'footerSettings';
  brandName: string;
  locale: Locale;
  tagLine: string;
  contactEmail: string;
  socialLinks: Settings['socialLinks'];
  navigations?: Navigation[];
  legalBar?: LegalBar;
}

const socialMediaRegistry: Record<string, { icon: ReactNode }> = {
  twitter: {
    icon: <FaTwitter />
  },
  facebook: {
    icon: <FaFacebook />
  },
  instagram: {
    icon: <FaInstagram />
  }
};

const Footer = ({ locale, brandName, tagLine, socialLinks, contactEmail, navigations, legalBar }: FooterProps) => {
  const t = getFooterTranslations(locale);


  return (
    <footer className="w-screen max-h-screen-minus-header fixed bottom-0 left-0 bg-accent font-fancy pt-main-footer-offset" id="footer">
      <div className="h-full flex flex-col">
        {/* Main Footer Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 px-6 sm:px-8 lg:px-12 py-8 lg:py-12">

          {/* Left Section - Brand & Tagline */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="text-4xl sm:text-5xl lg:text-6xl text-background mb-4 leading-[0.9] font-logo">
                {brandName}
              </div>
              <p className="text-background/70 text-md lg:text-xl font-sans max-w-md leading-relaxed">
                {tagLine}
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-5">
              <div className="text-background/50 text-sm font-sans mb-3">{t.followUs}</div>
              <div className="flex gap-4">
                {socialLinks?.map((link, idx) => {
                  const social = socialMediaRegistry[link.platform as string];
                  if (!social) return null;
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-background/70 hover:text-background transition-colors text-2xl"
                      aria-label={link.platform}
                    >
                      {social.icon}
                    </a>
                  );
                })}
                {/* <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors text-2xl"
                >
                  𝕏
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors text-2xl"
                >
                  IG
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors text-2xl"
                >
                  GH
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors text-2xl"
                >
                  LI
                </a> */}
              </div>
            </div>
          </div>

          {/* Middle Section - Navigation */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {navigations?.map((nav, idx) => (
              <div key={idx}>
                <h3 className="text-background font-sans font-semibold mb-4 text-sm uppercase tracking-wider">
                  {nav.title}
                </h3>
                <nav>
                  <ul className="lg:space-y-3 space-y-1">
                    {nav.items?.map((item, idx) => (
                      <li key={idx}>
                        <TransitionLink href={item.slug || '#'} className="text-background/70 hover:text-background transition-colors font-sans lg:text-base text-sm">
                          {item.label}
                        </TransitionLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
            {/* <div>
              <h3 className="text-background font-sans font-semibold mb-4 text-sm uppercase tracking-wider">
                Shop
              </h3>
              <nav>
                <ul className="lg:space-y-3 space-y-1">
                  <li>
                    <TransitionLink href="/plugins" className="text-sm text-background/70 hover:text-background transition-colors font-sans lg:text-base text-sm">
                      All Plugins
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink href="/bundles" className="text-background/70 hover:text-background transition-colors font-sans lg:text-base text-sm">
                      Bundles
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink href="/new" className="text-background/70 hover:text-background transition-colors font-sans lg:text-base text-sm">
                      New Releases
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink href="/popular" className="text-background/70 hover:text-background transition-colors font-sans lg:text-base text-sm">
                      Popular
                    </TransitionLink>
                  </li>
                </ul>
              </nav>
            </div>

            <div>
              <h3 className="text-background font-sans font-semibold mb-4 text-sm uppercase tracking-wider">
                Support
              </h3>
              <nav>
                <ul className="lg:space-y-3 space-y-1">
                  <li>
                    <TransitionLink href="/docs" className="text-background/70 hover:text-background transition-colors font-sans lg:text-base text-sm">
                      Documentation
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink href="/help" className="text-background/70 hover:text-background transition-colors font-sans lg:text-base text-sm">
                      Help Center
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink href="/tutorials" className="text-background/70 hover:text-background transition-colors font-sans lg:text-base text-sm">
                      Tutorials
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink href="/contact" className="text-background/70 hover:text-background transition-colors font-sans lg:text-base text-sm">
                      Contact Us
                    </TransitionLink>
                  </li>
                </ul>
              </nav>
            </div> */}
          </div>

          {/* Right Section - Contact & Newsletter */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h3 className="text-background font-sans font-semibold mb-4 text-sm uppercase tracking-wider">
                {t.contactUs}
              </h3>
              <a
                href={`mailto:${contactEmail}`}
                className="text-background hover:underline transition-colors font-sans text-lg sm:text-xl break-all"
              >
                {contactEmail}
              </a>

              {/* <div className="hidden lg:block mt-6">
                <p className="text-background/70 font-sans text-sm mb-3">
                  Subscribe to our newsletter for updates and exclusive offers.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 bg-background/10 border border-background/20 rounded-lg text-background placeholder:text-background/40 focus:outline-none focus:border-background/40 transition-colors font-sans text-sm"
                  />
                  <button className="px-6 py-2 bg-background text-accent font-sans font-medium rounded-lg hover:bg-background/90 transition-colors text-sm whitespace-nowrap">
                    Sign Up
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs md:text-sm flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-background/60 text-sm font-sans">
              <span className="mr-4">&copy; {new Date().getFullYear()} {brandName}. All Rights Reserved.</span>
              {legalBar?.navigation?.items?.map((item, idx) => (
                <TransitionLink
                  key={idx}
                  href={item.slug || '#'}
                  className="hover:text-background transition-colors"
                >
                  {item.label}
                </TransitionLink>
              ))}
            </div>
            <div className="text-background/60 text-sm font-sans">
              {t.madeIn}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;