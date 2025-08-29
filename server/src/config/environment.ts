import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// Types are used in comments and configuration objects

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment-specific configuration
const NODE_ENV: string = process.env.NODE_ENV || "development";

// Load the appropriate .env file based on NODE_ENV
let envFile = ".env";
if (NODE_ENV === "production") {
  envFile = ".env.prod";
} else if (NODE_ENV === "test") {
  envFile = ".env.test";
} else {
  envFile = ".env"; // development uses .env
}

// Construct the full path to the .env file (relative to server directory)
const envPath = path.resolve(__dirname, "..", "..", envFile);

// Load the environment file
dotenv.config({ path: envPath });

// Log which environment configuration is loaded
console.log(`🌍 Environment: ${NODE_ENV}`);
console.log(`📁 Config file: ${envPath}`);

/**
 * Environment configuration helper
 */
export const env = (key: string, defaultValue: string = ""): string => process.env[key] ?? defaultValue;

/**
 * Environment detection helpers
 */
export const isDevelopment = (): boolean => NODE_ENV === "development";
export const isTest = (): boolean => NODE_ENV === "test";
export const isProduction = (): boolean => NODE_ENV === "production";

/**
 * Get current environment
 */
export const getEnvironment = (): string => NODE_ENV;

/**
 * Validate required environment variables
 * @param {string[]} requiredVars - Array of required environment variable names
 * @throws {Error} If any required variables are missing
 */
export const validateEnvironment = (requiredVars = []) => {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

// NETOPIA Configuration
export const NETOPIA_CONFIG = {
  API_BASE: env("NETOPIA_API_BASE", "https://secure.sandbox.netopia-payments.com"),
  SANDBOX: env("NETOPIA_SANDBOX", "true") === "true",
  API_KEY: env("NETOPIA_API_KEY"),
  POS_SIGNATURE: env("NETOPIA_POS_SIGNATURE"),
  PUBLIC_KEY_PATH: env("NETOPIA_PUBLIC_KEY_PATH", "./server/netopia_public.pem"),
  RETURN_URL: env("NETOPIA_RETURN_URL", "http://localhost:5173/#/thankyou"),
  CONFIRM_URL: env("NETOPIA_CONFIRM_URL", "http://localhost:3001/api/netopia/ipn"),
  NOTIFY_URL: env("NETOPIA_NOTIFY_URL", "http://localhost:3001/api/netopia/ipn"),
  REDIRECT_PATH: env("NETOPIA_REDIRECT_PATH", "#thank-you"),
};

// SmartBill Configuration
export const SMARTBILL_CONFIG = {
  API_BASE: env("SMARTBILL_API_BASE", "https://api.smartbill.ro"),
  SANDBOX: env("SMARTBILL_SANDBOX", "true") === "true",
  EMAIL: env("SMARTBILL_EMAIL"),
  TOKEN: env("SMARTBILL_TOKEN"),
  VATCODE: env("SMARTBILL_VATCODE"),
  SERIES: env("SMARTBILL_SERIES", "FA"),
};

// Application Configuration
export const APP_CONFIG = {
  NAME: env("APP_NAME", "FitActive Presales"),
  BASE_URL: env("APP_BASE_URL", "http://localhost:5173"),
  PORT: env("PORT", "3001"),
  NODE_ENV: NODE_ENV,
  CORS_ORIGIN: env("CORS_ORIGIN", "http://localhost:5173"),
  FORCE_HTTPS: env("FORCE_HTTPS", "false") === "true",
  TRUST_PROXY: env("TRUST_PROXY", "false") === "true",
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  PATH: env("DATABASE_PATH",
    isTest() ? "./test.sqlite" :
    isProduction() ? "./production.sqlite" :
    "./data.sqlite"
  ),
} as const;

// Test Configuration
export const TEST_CONFIG = {
  DISABLE_PAYMENTS: env("DISABLE_PAYMENTS", "false") === "true",
  USE_MOCK_SERVICES: env("USE_MOCK_SERVICES", "false") === "true",
  DEBUG_MODE: env("DEBUG_MODE", "false") === "true",
} as const;

// SMTP Configuration
export const SMTP_CONFIG = {
  HOST: env("SMTP_HOST"),
  PORT: Number(env("SMTP_PORT", "587")),
  USER: env("SMTP_USER"),
  PASS: env("SMTP_PASS"),
  FROM: env("SMTP_FROM", "no-reply@fitactive.ro"),
  FROM_NAME: env("SMTP_FROM_NAME", "FitActive"),
  MAIL_FROM: env("MAIL_FROM", "no-reply@fitactive.ro"),
} as const;

// Logging Configuration
export const LOG_CONFIG = {
  LEVEL: env("LOG_LEVEL", "info"),
  FILE: env("LOG_FILE", "./logs/app.log"),
} as const;
