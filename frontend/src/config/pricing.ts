import type { PricingConfig } from '../types';

/**
 * Pricing configuration for FitActive presales
 */
export const PRICING_CONFIG: PricingConfig = {
  FULL_PRICE: 3098.80,
  SALE_PRICE: 1448.80,
  MONTHLY_PRICE: 99.90,
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (fullPrice: number, salePrice: number): number => {
  return Math.round((1 - salePrice / fullPrice) * 100);
};

/**
 * Format price for Romanian locale
 */
export const formatPrice = (value: number): string => {
  try {
    return value.toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch {
    return value.toFixed(2);
  }
};
