import cors from 'cors';
import type { CorsOptions } from 'cors';

/**
 * CORS configuration for different environments
 */
const getCorsOptions = (): CorsOptions => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  
  if (isDevelopment || isTest) {
    return {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
  }

  return {
    origin: [
      'https://presale.fitactive.open-sky.org',
      'https://fitactive.open-sky.org'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
};

export const corsMiddleware = cors(getCorsOptions());
