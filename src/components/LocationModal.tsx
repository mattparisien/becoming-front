'use client'
import { useLocationModal } from "@/context/LocationModalContext";
import { Location } from "@/lib/types/misc";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { LOCATION_PREFERENCES_COOKIE_KEY } from "@/lib/constants";
import { useParams, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { getLocationModalTranslations } from "@/lib/i18n/translations";
import { Locale } from "@/lib/i18n/config";


type LocaleSpecificLocation = Omit<Location, "locales" | "currencyCode"> & {
  locale: string;
}


interface LocationModalProps {
  markets: Location[];
  initialMarketValue: LocaleSpecificLocation;
}

const LocationModal: React.FC<LocationModalProps> = ({ markets, initialMarketValue }) => {
  const { isOpen, close } = useLocationModal();
  const [selectedMarket, setSelectedMarket] = useState<LocaleSpecificLocation>(initialMarketValue);
  const { lang } = useParams();
  const pathname = usePathname();
  const t = getLocationModalTranslations(lang as Locale);


  const handleClose = () => {
    close();
    setSelectedMarket(initialMarketValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [countryCode, locale] = e.target.value.split('/');
    const countryName = markets.find(market => market.country.code === countryCode)?.country.name || '';
    setSelectedMarket({
      country: {
        code: countryCode,
        name: countryName,
      },
      locale,
    });
  };

  const handleConfirm = () => {

    if (selectedMarket) {
      // Parse the selected market (format: "US/en")
      const { country, locale } = selectedMarket;

      // Set the location preferences cookie
      const preferences = {
        country: country.code,
        locale,
      };

      // Set cookie with 1 year expiration
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      document.cookie = `${LOCATION_PREFERENCES_COOKIE_KEY}=${JSON.stringify(preferences)}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;


      // Perform a full page reload to the new location
      window.location.href = `/${pathname.split("/").filter(x => x).slice(2).join("/")}` || "/"
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="font-sans fixed inset-0 z-[999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative bg-background p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto z-10">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <Dialog.Title className="text-lg font-semibold mb-4">{t.title}</Dialog.Title>
        <Dialog.Description className="mb-4 text-sm text-foreground/70 font-semibold">
          {t.currentLocation} {initialMarketValue ? `${initialMarketValue.country.name} (${initialMarketValue.locale})` : 'not selected'}.
        </Dialog.Description>
        <Dialog.Description className="mb-4 text-sm text-foreground/70">
          {t.description}
        </Dialog.Description>
        <select
          className="w-full p-2 border border-foreground/20 rounded mb-4"
          value={selectedMarket?.country.code + '/' + selectedMarket?.locale}
          onChange={handleChange}
        >
          <option value="" disabled>{t.select}</option>
          {markets.map((market: Location) => (
            market.locales.map(locale => (
              <option key={market.country.code + '/' + locale} value={market.country.code + '/' + locale}>
                {market.country.name} ({locale}) \ {market.currencyCode}
              </option>
            ))

          ))}
        </select>
        <div className="flex justify-start gap-4 mt-8">

          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedMarket}
          >
            {t.confirm}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default LocationModal;
