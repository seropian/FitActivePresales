import { beforeAll, afterAll, beforeEach, vi } from 'vitest';

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PORT = '0'; // Use random port for testing

  // Mock environment variables for testing
  process.env.NETOPIA_SIGNATURE = 'test-signature';
  process.env.NETOPIA_API_KEY = 'test-api-key';
  process.env.NETOPIA_SANDBOX_URL = 'https://secure-sandbox.netopia-payments.com';
  process.env.NETOPIA_PRODUCTION_URL = 'https://secure.netopia-payments.com';
});

afterAll(() => {
  // Cleanup after all tests
});

beforeEach(() => {
  // Reset mocks before each test
  if (typeof vi !== 'undefined') {
    vi.clearAllMocks();
  }
});

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Suppress console.log during tests unless explicitly needed
const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  if (process.env.VITEST_VERBOSE) {
    originalConsoleLog(...args);
  }
};
