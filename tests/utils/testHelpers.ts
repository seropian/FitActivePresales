/**
 * Test utilities and helpers
 */

export const TEST_CONFIG = {
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  BASE_URLS: {
    development: 'http://localhost:3001',
    test: 'http://localhost:3002',
    production: 'https://presale.fitactive.open-sky.org'
  }
};

/**
 * Wait for a specified amount of time
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry a function with exponential backoff
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = TEST_CONFIG.RETRY_COUNT,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) break;
      
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      await wait(backoffDelay);
    }
  }
  
  throw lastError!;
};

/**
 * Generate test order ID
 */
export const generateOrderId = (): string => {
  return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Clean up test data
 */
export const cleanup = async (): Promise<void> => {
  // Add cleanup logic here
  console.log('Cleaning up test data...');
};
