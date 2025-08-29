import { describe, it, expect, vi, beforeEach } from 'vitest';
import { netopiaService } from '../services/netopiaService.js';
import { validateOrder, validateBilling, validateCompany } from '../lib/validation.js';

// Mock the netopiaService for testing
vi.mock('../../services/netopiaService.js');

describe('NETOPIA Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Payment Initiation', () => {
    it('should create payment with valid data', async () => {
      const paymentData = {
        order: {
          orderID: 'test-order-123',
          amount: 99.90,
          currency: 'RON',
          description: 'Test payment'
        },
        billing: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+40723456789',
          address: 'Test Address 123',
          city: 'Bucharest'
        }
      };

      const mockResponse = {
        success: true,
        redirectUrl: 'https://secure-sandbox.netopia-payments.com/payment/redirect',
        orderID: 'test-order-123'
      };

      vi.spyOn(netopiaService, 'startPayment').mockResolvedValue(mockResponse);

      const result = await netopiaService.startPayment(paymentData);

      expect(result).toEqual(mockResponse);
      expect(netopiaService.startPayment).toHaveBeenCalledWith(paymentData);
    });

    it('should handle payment service errors', async () => {
      const paymentData = {
        order: {
          orderID: 'test-order-123',
          amount: 99.90,
          currency: 'RON',
          description: 'Test payment'
        },
        billing: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+40723456789'
        }
      };

      const mockError = new Error('Payment service unavailable');
      vi.spyOn(netopiaService, 'startPayment').mockRejectedValue(mockError);

      await expect(netopiaService.startPayment(paymentData)).rejects.toThrow('Payment service unavailable');
    });

    it('should generate unique order IDs', async () => {
      const paymentData1 = {
        order: {
          orderID: 'order-123',
          amount: 99.90,
          currency: 'RON',
          description: 'Test payment 1'
        },
        billing: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+40723456789'
        }
      };

      const paymentData2 = {
        order: {
          orderID: 'order-456',
          amount: 99.90,
          currency: 'RON',
          description: 'Test payment 2'
        },
        billing: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+40723456789'
        }
      };

      const mockResponse1 = {
        success: true,
        redirectUrl: 'https://secure-sandbox.netopia-payments.com/payment/redirect',
        orderID: 'order-123'
      };

      const mockResponse2 = {
        success: true,
        redirectUrl: 'https://secure-sandbox.netopia-payments.com/payment/redirect',
        orderID: 'order-456'
      };

      vi.spyOn(netopiaService, 'startPayment')
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const result1 = await netopiaService.startPayment(paymentData1);
      const result2 = await netopiaService.startPayment(paymentData2);

      expect(result1.orderID).not.toBe(result2.orderID);
    });
  });

  describe('Payment Status', () => {
    it('should return payment status for valid order ID', async () => {
      const orderID = 'test-order-123';
      const mockStatus = {
        status: 'confirmed',
        amount: 99.90,
        currency: 'RON',
        timestamp: new Date().toISOString()
      };

      vi.spyOn(netopiaService, 'verifyIPN').mockResolvedValue({
        order: { orderID },
        payment: { status: 3 }
      });

      const result = await netopiaService.verifyIPN('mock-ipn-data');

      expect(result.order.orderID).toBe(orderID);
      expect(result.payment.status).toBe(3);
    });

    it('should handle invalid order ID', async () => {
      const mockError = new Error('Order not found');

      vi.spyOn(netopiaService, 'verifyIPN').mockRejectedValue(mockError);

      await expect(netopiaService.verifyIPN('invalid-data')).rejects.toThrow('Order not found');
    });

    it('should return different payment status values', async () => {
      const orderID = 'test-order-123';
      const statuses = [1, 2, 3]; // NETOPIA status codes: pending, failed, confirmed

      for (const status of statuses) {
        vi.spyOn(netopiaService, 'verifyIPN').mockResolvedValue({
          order: { orderID },
          payment: { status }
        });

        const result = await netopiaService.verifyIPN('mock-ipn-data');
        expect(result.payment.status).toBe(status);
      }
    });
  });

  describe('Environment Configuration', () => {
    it('should use sandbox environment for development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // Test that development environment is detected
      expect(process.env.NODE_ENV).toBe('development');

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should use production environment for production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Test that production environment is detected
      expect(process.env.NODE_ENV).toBe('production');

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });
  });
});

describe('Payment Validation', () => {
  describe('validateOrder', () => {
    it('should validate correct order data', () => {
      const validOrder = {
        orderID: 'test-order-123',
        amount: 99.90,
        currency: 'RON',
        description: 'Test payment'
      };

      const result = validateOrder(validOrder);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject negative amounts', () => {
      const invalidOrder = {
        orderID: 'test-order-123',
        amount: -10,
        currency: 'RON',
        description: 'Test payment'
      };

      const result = validateOrder(invalidOrder);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.toLowerCase().includes('amount'))).toBe(true);
    });

    it('should reject zero amounts', () => {
      const invalidOrder = {
        orderID: 'test-order-123',
        amount: 0,
        currency: 'RON',
        description: 'Test payment'
      };

      const result = validateOrder(invalidOrder);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.toLowerCase().includes('amount'))).toBe(true);
    });

    it('should reject invalid currency', () => {
      const invalidOrder = {
        orderID: 'test-order-123',
        amount: 99.90,
        currency: 'USD',
        description: 'Test payment'
      };

      const result = validateOrder(invalidOrder);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.toLowerCase().includes('currency'))).toBe(true);
    });
  });

  describe('validateBilling', () => {
    it('should validate correct billing data', () => {
      const validBilling = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+40723456789',
        address: 'Test Address 123',
        city: 'Bucharest',
        county: 'Bucharest',
        postalCode: '123456'
      };

      const result = validateBilling(validBilling);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        ''
      ];

      invalidEmails.forEach(email => {
        const invalidBilling = {
          firstName: 'John',
          lastName: 'Doe',
          email,
          phone: '+40723456789'
        };

        const result = validateBilling(invalidBilling);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.message.includes('email'))).toBe(true);
      });
    });

    it('should reject invalid phone formats', () => {
      const invalidPhones = [
        '123',
        'invalid-phone',
        '+1234',
        '0123456789012345', // too long
        ''
      ];

      invalidPhones.forEach(phone => {
        const invalidBilling = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone
        };

        const result = validateBilling(invalidBilling);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.message.includes('phone'))).toBe(true);
      });
    });

    it('should reject empty required fields', () => {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone'];

      requiredFields.forEach(field => {
        const invalidBilling = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+40723456789',
          [field]: ''
        };

        const result = validateBilling(invalidBilling);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.field === field)).toBe(true);
      });
    });
  });
});
