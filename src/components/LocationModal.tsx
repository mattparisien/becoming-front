'use client'
import { useLocationModal } from "@/context/LocationModalContext";
import { Location } from "@/lib/types/misc";
import { useState } from "react";
import { LOCATION_PREFERENCES_COOKIE_KEY } from "@/lib/constants";
import { useParams, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
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
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={t.title}
      description={
        <>
          <p className="mb-4 font-semibold">
            <span className="font-semibold">{t.currentLocation}</span>{' '}
            {initialMarketValue ? `${initialMarketValue.country.name} (${initialMarketValue.locale})` : t.notSelected}.
          </p>
          <p>
            {t.description}
          </p>
        </>
      }
    >
      <select
        className="w-full p-2 border border-foreground/20 text-foreground rounded mb-4"
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
    </Modal>
  );
};

export default LocationModal;
