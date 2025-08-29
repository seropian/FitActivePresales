// Component prop types for FitActive application

export interface PriceDisplayProps {
  salePrice: number;
  fullPrice: number;
  size?: 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
  layout?: 'stacked' | 'inline';
  className?: string;
  showSavings?: boolean;
  showDiscount?: boolean;
}

export interface PriceSummaryProps {
  salePrice: number;
  fullPrice: number;
}

export interface CTAButtonProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  width?: 'auto' | 'full';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface LandingPageProps {
  spotsLeft: number;
  discount: number;
  ctaText: string;
}

export interface CheckoutPageProps {
  discount: number;
  ctaText: string;
}

export interface ThankYouPageProps {
  orderID: string;
}

export interface ImageCarouselProps {
  images: string[];
  className?: string;
}

export interface ImageGridProps {
  images: string[];
}

export interface FeedbackImageGridProps {
  images: string[];
}

export interface CountdownBannerProps {
  targetDate?: Date;
  onCtaClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Form data types
export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  postalCode: string;
  companyName: string;
  vatNumber: string;
  isCompany: boolean;
}

// API response types
export interface PaymentResponse {
  success: boolean;
  redirectUrl?: string;
  orderID?: string;
  error?: string;
}

export interface Invoice {
  pdfLink?: string;
  invoiceNumber?: string;
  amount?: number;
}

// Event handler types
export type FormChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void;
export type ButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void;
export type ImageErrorHandler = (e: React.SyntheticEvent<HTMLImageElement>) => void;
