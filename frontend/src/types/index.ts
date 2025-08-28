// Common types for the FitActive application

export interface PricingConfig {
  FULL_PRICE: number;
  SALE_PRICE: number;
  MONTHLY_PRICE: number;
}

export interface RouteParams {
  [key: string]: string;
}

export interface Route {
  page: 'home' | 'comanda' | 'thankyou';
  params: RouteParams;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cnp: string;
  address: string;
  promoCode: string;
  agreeTerms: boolean;
  autoInvoice: boolean;
}

export interface OrderData {
  order: {
    orderID: string;
    amount: number;
    currency: string;
    description: string;
  };
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
  };
  company?: {
    name: string;
    vatCode: string;
  } | null;
}

export interface PaymentResponse {
  redirectUrl?: string;
  error?: string;
  message?: string;
}

export interface ImageData {
  src: string;
  alt: string;
  title?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Component Props Types
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
  orderID?: string;
}

export interface PriceDisplayProps {
  fullPrice: number;
  salePrice: number;
  discount: number;
  className?: string;
}

export interface CountdownBannerProps {
  spotsLeft: number;
  className?: string;
}

export interface ImageGridProps {
  images: ImageData[];
  className?: string;
}

export interface ImageCarouselProps {
  images: ImageData[];
  className?: string;
}

export interface CTAButtonProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
