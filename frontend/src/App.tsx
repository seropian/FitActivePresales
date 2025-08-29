import { useMemo, useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { useHashRoute } from "./utils/router";
import { PRICING_CONFIG, calculateDiscount, formatPrice } from "./config/pricing";
import { cssVariables } from "./config/theme";

export default function FitActivePresaleApp(): React.JSX.Element {
  const { page, params } = useHashRoute();
  const [spotsLeft] = useState<number>(100);

  const discount = useMemo(() =>
    calculateDiscount(PRICING_CONFIG.FULL_PRICE, PRICING_CONFIG.SALE_PRICE),
    []
  );

  const ctaText = `Profită de oferta de presale — ${formatPrice(PRICING_CONFIG.MONTHLY_PRICE)} lei/lună`;

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{cssVariables}</style>

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
