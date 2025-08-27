import React from "react";

function formatPrice(value) {
  try {
    return value.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    return value.toFixed(2);
  }
}

// Consistent Price Display Component
export function PriceDisplay({
  salePrice,
  fullPrice,
  size = "large",
  alignment = "center",
  showSavings = true,
  showDiscount = true,
  layout = "stacked"
}) {
  const discount = Math.round((1 - salePrice / fullPrice) * 100);
  const savings = fullPrice - salePrice;

  const sizeClasses = {
    small: "text-2xl sm:text-3xl",
    medium: "text-3xl sm:text-4xl lg:text-5xl",
    large: "text-5xl sm:text-6xl lg:text-7xl"
  };

  const alignmentClasses = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right"
  };

  return (
    <div className={`${alignmentClasses[alignment]}`}>
      <p className="text-sm sm:text-xs uppercase tracking-wider text-[var(--fa-orange-600)] font-semibold">Preț promoție</p>

      {/* Price and discount separated into two components */}
      <div className="mt-1 relative">
        {/* Centered price component */}
        <div className="flex flex-wrap items-baseline gap-2 justify-center">
          <p className={`${sizeClasses[size]} font-black bg-gradient-to-r from-[var(--fa-orange)] to-[var(--fa-orange-600)] text-transparent bg-clip-text drop-shadow`}>
            {formatPrice(salePrice)}
          </p>
          <span className="text-lg sm:text-xl font-semibold text-white/60">lei</span>
        </div>

        {/* Right-aligned discount component */}
        {showDiscount && (
          <div className="absolute top-0 right-0 flex justify-end">
            <span className="px-2 py-0.5 rounded bg-[var(--fa-orange)]/10 text-[var(--fa-orange-600)] font-extrabold text-base sm:text-lg">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      <p className="mt-0.5 text-base sm:text-sm text-white/50">
        Preț întreg: <span className="font-extrabold"><s>{formatPrice(fullPrice)} lei</s></span>
      </p>
      {showSavings && (
        <p className="text-sm sm:text-base font-semibold text-[var(--fa-orange-600)]">
          Economisești {formatPrice(savings)} lei
        </p>
      )}
    </div>
  );
}

// Price Summary Component for Checkout
export function PriceSummary({ salePrice, fullPrice }) {
  const discount = Math.round((1 - salePrice / fullPrice) * 100);
  const savings = fullPrice - salePrice;

  return (
    <div className="mt-4 space-y-2 text-base sm:text-sm">
      <div className="flex items-center justify-between">
        <span>Abonament All Inclusive</span>
        <span className="font-black bg-gradient-to-r from-[var(--fa-orange)] to-[var(--fa-orange-600)] text-transparent bg-clip-text">
          {formatPrice(salePrice)} lei
        </span>
      </div>
      <div className="flex items-center justify-between text-white/70">
        <span>Preț întreg</span>
        <span className="font-extrabold"><s>{formatPrice(fullPrice)} lei</s></span>
      </div>
      <div className="flex items-center justify-between text-white/70">
        <span>Reducere</span>
        <span className="font-extrabold text-[var(--fa-orange-600)]">-{discount}%</span>
      </div>
      <div className="flex items-center justify-between text-white/70">
        <span>Economisești</span>
        <span className="font-extrabold text-[var(--fa-orange-600)]">{formatPrice(savings)} lei</span>
      </div>
    </div>
  );
}
