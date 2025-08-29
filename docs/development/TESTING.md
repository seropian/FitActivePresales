# Testing Guide

This guide covers testing strategies and practices for the FitActive Presales application.

## Testing Stack

- **Frontend**: Vitest + React Testing Library
- **Backend**: Vitest + Supertest
- **E2E**: Custom integration tests
- **Coverage**: Built-in coverage reporting

## Running Tests

### Frontend Tests
```bash
cd frontend

# Run tests once
npm run test:run

# Watch mode
npm run test

# With coverage
npm run test:coverage

# UI mode
npm run test:ui
```

### Backend Tests
```bash
cd server

# Run tests once
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Integration Tests
```bash
# Payment flow tests
npm run test:payment
npm run test:payment-dev
npm run test:payment-prod

# Frontend flow tests
npm run test:frontend-flow
```

## Test Structure

### Frontend Tests
```
frontend/src/
├── components/
│   └── ui/
│       ├── CTAButton.test.tsx
│       ├── PriceDisplay.test.tsx
│       └── CountdownBanner.test.tsx
├── utils/
│   └── router.test.ts
└── test/
    └── setup.ts
```

### Backend Tests
```
server/src/
└── tests/
    ├── setup.ts
    ├── server.test.ts
    └── payment.test.ts
```

## Writing Tests

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { CTAButton } from './CTAButton';

describe('CTAButton', () => {
  it('renders with correct text', () => {
    render(<CTAButton>Click me</CTAButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### API Tests
```typescript
import request from 'supertest';
import { app } from '../server';

describe('API Endpoints', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
```

### Integration Tests
```typescript
// Payment flow test example
describe('Payment Flow', () => {
  it('should process payment successfully', async () => {
    // Test payment initiation
    // Test NETOPIA integration
    // Test SmartBill invoice generation
    // Test email notification
  });
});
```

## Test Data

### Mock Data
- Use factories for consistent test data
- Mock external services (NETOPIA, SmartBill)
- Use test databases for isolation

### Environment
- Tests run in `NODE_ENV=test`
- Separate test database (`test.sqlite`)
- Mock email service in tests

## Coverage Goals

- **Frontend**: >80% coverage
- **Backend**: >85% coverage
- **Critical paths**: 100% coverage (payment, security)

## Best Practices

### Unit Tests
- Test one thing at a time
- Use descriptive test names
- Arrange, Act, Assert pattern
- Mock external dependencies

### Integration Tests
- Test complete user flows
- Use real database for integration
- Test error scenarios
- Verify side effects

### Performance Tests
- Test API response times
- Monitor memory usage
- Test under load conditions

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests
- Deployment pipeline

## Debugging Tests

### Frontend
```bash
# Debug specific test
npm run test -- --reporter=verbose ComponentName

# Debug in browser
npm run test:ui
```

### Backend
```bash
# Debug with logs
DEBUG=* npm run test

# Run specific test file
npm run test payment.test.ts
```

## Common Issues

### Async Tests
- Always await async operations
- Use proper timeout values
- Handle promise rejections

### Database Tests
- Clean up after each test
- Use transactions for isolation
- Reset auto-increment counters

### Mock Issues
- Clear mocks between tests
- Verify mock calls
- Use proper mock implementations

## Test Maintenance

- Review and update tests regularly
- Remove obsolete tests
- Keep test data current
- Monitor test performance
