# API Documentation

FitActive Presales REST API documentation.

## Base URLs

- **Development**: `http://localhost:3001`
- **Test**: `http://localhost:3002`
- **Production**: `https://presale.fitactive.open-sky.org`

## Authentication

Currently, the API does not require authentication for public endpoints.

## Endpoints

### Health Check
```
GET /health
```
Returns server health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-29T10:00:00.000Z",
  "environment": "development"
}
```

### Payment Endpoints

#### Start Payment
```
POST /api/netopia/start
```
Initiates a payment with NETOPIA.

**Request Body:**
```json
{
  "amount": 1448.80,
  "currency": "RON",
  "orderID": "unique-order-id",
  "description": "FitActive Presales",
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+40123456789"
  }
}
```

**Response:**
```json
{
  "success": true,
  "paymentURL": "https://secure.netopia-payments.com/...",
  "orderID": "unique-order-id"
}
```

#### Payment Notification (IPN)
```
POST /api/netopia/ipn
```
Webhook endpoint for NETOPIA payment notifications.

### Order Endpoints

#### Get Order Status
```
GET /api/order/status?orderID={orderID}
```
Retrieves the status of an order.

**Response:**
```json
{
  "orderID": "unique-order-id",
  "status": "completed",
  "amount": 1448.80,
  "currency": "RON",
  "timestamp": "2025-08-29T10:00:00.000Z"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-08-29T10:00:00.000Z"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit info in response headers

## CORS

CORS is configured for:
- Development: `http://localhost:5173`
- Production: `https://presale.fitactive.open-sky.org`

## Security

- Helmet.js for security headers
- CORS protection
- Rate limiting
- Input validation
- SQL injection protection
