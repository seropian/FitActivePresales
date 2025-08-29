import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../server.js';
import { initDB } from '../../database/db.js';

describe('FitActive Server API', () => {
  let server: any;

  beforeAll(async () => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.NETOPIA_API_KEY = 'test-api-key-for-testing-purposes-only-not-real';
    process.env.NETOPIA_POS_SIGNATURE = 'TEST-SIGNATURE';

    // Initialize database for tests
    await initDB();

    server = app.listen(0); // Use random port for testing
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        environment: expect.any(String),
        memory: expect.any(Object)
      });
    });
  });

  describe('Payment Routes', () => {
    describe('POST /api/netopia/start', () => {
      it('should initiate payment with valid data', async () => {
        const paymentData = {
          order: {
            orderID: 'TEST-' + Date.now(),
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
            city: 'Bucharest',
            county: 'Bucharest',
            postalCode: '123456'
          }
        };

        const response = await request(app)
          .post('/api/netopia/start')
          .send(paymentData)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('redirectUrl');
        expect(response.body.redirectUrl).toContain('netopia-payments.com');
      });

      it('should reject payment with invalid amount', async () => {
        const paymentData = {
          order: {
            orderID: 'TEST-' + Date.now(),
            amount: -10,
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

        const response = await request(app)
          .post('/api/netopia/start')
          .send(paymentData)
          .expect(400);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error');
      });

      it('should reject payment with missing customer data', async () => {
        const paymentData = {
          order: {
            orderID: 'TEST-' + Date.now(),
            amount: 99.90,
            currency: 'RON',
            description: 'Test payment'
          }
          // Missing billing data
        };

        const response = await request(app)
          .post('/api/netopia/start')
          .send(paymentData)
          .expect(400);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error');
      });

      it('should reject payment with invalid email', async () => {
        const paymentData = {
          order: {
            orderID: 'TEST-' + Date.now(),
            amount: 99.90,
            currency: 'RON',
            description: 'Test payment'
          },
          billing: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'invalid-email',
            phone: '+40723456789',
            address: 'Test Address 123',
            city: 'Bucharest',
            county: 'Bucharest',
            postalCode: '123456'
          }
        };

        const response = await request(app)
          .post('/api/netopia/start')
          .send(paymentData)
          .expect(400);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body.error).toContain('email');
      });
    });

    describe('GET /api/order/status', () => {
      it('should return order status for valid order ID', async () => {
        const orderID = 'TEST-ORDER-' + Date.now();

        const statusResponse = await request(app)
          .get(`/api/order/status?orderID=${orderID}`)
          .expect(200);

        expect(statusResponse.body).toHaveProperty('success', true);
        expect(statusResponse.body).toHaveProperty('data');
        expect(statusResponse.body.data).toHaveProperty('status');
        expect(statusResponse.body.data.status).toBe('not_found'); // Expected for non-existent order
      });

      it('should return 400 for missing order ID', async () => {
        const response = await request(app)
          .get('/api/order/status')
          .expect(400);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown-route')
        .expect(404);

      // Express default 404 response doesn't have error property
      expect(response.status).toBe(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/netopia/start')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/netopia/start')
        .expect(204); // CORS preflight returns 204 No Content

      expect(response.headers).toHaveProperty('access-control-allow-methods');
      expect(response.headers).toHaveProperty('access-control-allow-headers');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Check for basic security headers
      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow reasonable number of requests', async () => {
      // Make multiple requests to test rate limiting
      const promises = Array(5).fill(null).map(() => 
        request(app).get('/health')
      );

      const responses = await Promise.all(promises);
      
      // All should succeed under normal rate limits
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
