// Backend types for FitActive application

import { Request, Response } from 'express';

// Environment Configuration
export interface AppConfig {
  PORT: number;
  NODE_ENV: string;
  BASE_URL: string;
  FRONTEND_URL: string;
}

export interface NetopiaConfig {
  SIGNATURE: string;
  SANDBOX: boolean;
  PUBLIC_KEY_PATH: string;
  PRIVATE_KEY_PATH?: string;
  RETURN_URL: string;
  CONFIRM_URL: string;
}

export interface SmartBillConfig {
  USERNAME: string;
  TOKEN: string;
  BASE_URL: string;
  VAT_CODE: string;
  COMPANY_NAME: string;
}

export interface EmailConfig {
  HOST: string;
  PORT: number;
  SECURE: boolean;
  USER: string;
  PASS: string;
  FROM_NAME: string;
  FROM_EMAIL: string;
}

// Database Types
export interface OrderRecord {
  id?: number;
  orderID: string;
  amount: number;
  currency: string;
  description?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  vatCode?: string;
  companyName?: string;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled' | 'approved' | 'processing_error';
  paymentMethod?: string;
  transactionId?: string;
  invoiceId?: string;
  invoiceUrl?: string;
  invoiceSeries?: string;
  invoiceNumber?: string;
  pdfLink?: string;
  billing?: any;
  company?: any;
  createdAt?: string;
  updatedAt?: string;
}

// Payment Types
export interface PaymentRequest {
  order: {
    orderID: string;
    amount: number;
    currency: string;
    description: string;
    products?: Array<{
      name: string;
      price: number;
      vat: number;
    }>;
  };
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    state?: string;
    postalCode?: string;
    details?: string;
  };
  company?: {
    name: string;
    vatCode: string;
  } | null;
}

export interface NetopiaPaymentData {
  order: {
    orderID: string;
    amount: number;
    currency: string;
    description: string;
    products?: Array<{
      name: string;
      price: number;
      vat: number;
    }>;
  };
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    state?: string;
    postalCode?: string;
    details?: string;
  };
  company?: {
    name: string;
    vatCode: string;
  } | null;
}

export interface PaymentResponse {
  success: boolean;
  redirectUrl?: string;
  error?: string;
  message?: string;
}

export interface PaymentNotification {
  orderID: string;
  amount: number;
  currency: string;
  status: string;
  transactionId: string;
  paymentMethod: string;
  timestamp: string;
}

// SmartBill Types
export interface SmartBillClient {
  name: string;
  vatCode?: string;
  regCom?: string;
  address?: string;
  city?: string;
  county?: string;
  country?: string;
  email?: string;
  phone?: string;
  contact?: string;
}

export interface SmartBillProduct {
  name: string;
  code?: string;
  isDiscount?: boolean;
  measuringUnitName?: string;
  currency?: string;
  quantity: number;
  price: number;
  isTaxIncluded?: boolean;
  taxName?: string;
  taxPercentage?: number;
  isService?: boolean;
  saveToDb?: boolean;
}

export interface SmartBillInvoice {
  companyVatCode: string;
  client: SmartBillClient;
  issueDate: string;
  seriesName: string;
  number?: number;
  currency: string;
  products: SmartBillProduct[];
  language?: string;
  precision?: number;
  useStock?: number;
  mentions?: string;
  observations?: string;
  useEstimateDetails?: number;
  paymentUrl?: string;
}

export interface SmartBillResponse {
  success: boolean;
  invoiceId?: string;
  invoiceUrl?: string;
  invoiceNumber?: string;
  error?: string;
  message?: string;
}

// Email Types
export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Express Request Extensions
export interface AuthenticatedRequest extends Request {
  user?: any;
  rawBody?: Buffer;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  environment: string;
  uptime?: number;
  memory?: NodeJS.MemoryUsage;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Logger Types
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  meta?: Record<string, any>;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T>;

// Express Handler Types
export type ExpressHandler = (req: Request, res: Response) => Promise<void> | void;
export type ExpressMiddleware = (req: Request, res: Response, next: Function) => Promise<void> | void;
