import { useMemo, useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { ThankYouPage } from "./components/ThankYouPage";
import { useHashRoute } from "./utils/router";
import type { PricingConfig } from "./types";

// Pricing configuration
const PRICING_CONFIG: PricingConfig = {
  FULL_PRICE: 3098.80,
  SALE_PRICE: 1448.80,
  MONTHLY_PRICE: 99.90,
};

/**
 * Format price for Romanian locale
 */
function formatPrice(value: number): string {
  try {
    return value.toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch {
    return value.toFixed(2);
  }
}

export default function FitActivePresaleApp(): React.JSX.Element {
  const { page, params } = useHashRoute();
  const [spotsLeft] = useState<number>(100);

  const discount = useMemo(() =>
    Math.round((1 - PRICING_CONFIG.SALE_PRICE / PRICING_CONFIG.FULL_PRICE) * 100),
    []
  );

  const ctaText = `Profită de oferta de presale — ${formatPrice(PRICING_CONFIG.MONTHLY_PRICE)} lei/lună`;

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        :root {
          --fa-orange: #EC7C26;
          --fa-orange-600: #EC7C26;
          --fa-ral-2011: #EC7C26;
          --fa-ral-9011: #1C1C1C;
          --fa-dark: #111111;
          --fa-gray: #1F2937;
          --fa-light: #F8FAFC;
          --fa-white: #FFFFFF;
        }
      `}</style>

      {page === "home" && (
        <LandingPage
          spotsLeft={spotsLeft}
          discount={discount}
          ctaText={ctaText}
        />
      )}
      {page === "comanda" && (
        <CheckoutPage
          discount={discount}
          ctaText={ctaText}
        />
      )}
      {page === "thankyou" && (
        <ThankYouPage
          orderID={params.order}
        />
      )}
    </div>
  );
}
