# Payment Reviewer API Documentation

## Overview

The Payment Reviewer API provides real-time fraud detection and payee verification services. This RESTful API allows you to submit payment requests, receive fraud scores, and manage payee data.

**Base URL:** `https://api.payment-reviewer.com/v1`

**Authentication:** Bearer Token (API Key required)

## Table of Contents

1. [Authentication](#authentication)
2. [Payment Review Endpoints](#payment-review-endpoints)
3. [Payee Management](#payee-management)
4. [Fraud Detection](#fraud-detection)
5. [Webhooks](#webhooks)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [SDKs and Examples](#sdks-and-examples)

## Authentication

All API requests require authentication using an API key in the Authorization header.

```http
Authorization: Bearer YOUR_API_KEY
```

### Getting an API Key

```bash
curl -X POST https://api.payment-reviewer.com/v1/auth/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Application",
    "permissions": ["payment:review", "payee:manage"]
  }'
```

## Payment Review Endpoints

### Review Payment Request

Submits a payment for fraud detection and review.

**Endpoint:** `POST /payments/review`

**Request Body:**
```json
{
  "payment_id": "pay_123456789",
  "amount": 1000.00,
  "currency": "USD",
  "payee": {
    "id": "payee_987654321",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "account_number": "1234567890",
    "routing_number": "021000021"
  },
  "payer": {
    "id": "payer_456789123",
    "name": "Company Inc",
    "ip_address": "192.168.1.1"
  },
  "metadata": {
    "transaction_type": "vendor_payment",
    "invoice_id": "inv_789"
  }
}
```

**Response:**
```json
{
  "payment_id": "pay_123456789",
  "status": "reviewed",
  "fraud_score": 0.23,
  "risk_level": "low",
  "recommendation": "approve",
  "flags": [],
  "processing_time_ms": 150,
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "payee_verification": "verified",
    "amount_analysis": "normal",
    "velocity_check": "passed",
    "blacklist_check": "clear"
  }
}
```

**Example Usage:**

```javascript
// JavaScript/Node.js
const response = await fetch('https://api.payment-reviewer.com/v1/payments/review', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    payment_id: 'pay_123456789',
    amount: 1000.00,
    currency: 'USD',
    payee: {
      id: 'payee_987654321',
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
  })
});

const result = await response.json();
console.log('Fraud Score:', result.fraud_score);
```

```python
# Python
import requests

response = requests.post(
    'https://api.payment-reviewer.com/v1/payments/review',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'payment_id': 'pay_123456789',
        'amount': 1000.00,
        'currency': 'USD',
        'payee': {
            'id': 'payee_987654321',
            'name': 'John Doe',
            'email': 'john.doe@example.com'
        }
    }
)

result = response.json()
print(f"Fraud Score: {result['fraud_score']}")
```

### Get Payment Review Status

Retrieves the current status of a payment review.

**Endpoint:** `GET /payments/{payment_id}/review`

**Response:**
```json
{
  "payment_id": "pay_123456789",
  "status": "completed",
  "fraud_score": 0.23,
  "risk_level": "low",
  "recommendation": "approve",
  "reviewed_at": "2024-01-15T10:30:00Z",
  "reviewer_id": "system_auto"
}
```

### Bulk Payment Review

Submit multiple payments for review in a single request.

**Endpoint:** `POST /payments/review/bulk`

**Request Body:**
```json
{
  "payments": [
    {
      "payment_id": "pay_123456789",
      "amount": 1000.00,
      "currency": "USD",
      "payee": { /* payee object */ }
    },
    {
      "payment_id": "pay_123456790", 
      "amount": 2500.00,
      "currency": "USD",
      "payee": { /* payee object */ }
    }
  ]
}
```

## Payee Management

### Create Payee

**Endpoint:** `POST /payees`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "banking_info": {
    "account_number": "1234567890",
    "routing_number": "021000021",
    "account_type": "checking"
  },
  "business_info": {
    "tax_id": "12-3456789",
    "business_type": "individual"
  }
}
```

### Get Payee Details

**Endpoint:** `GET /payees/{payee_id}`

**Response:**
```json
{
  "id": "payee_987654321",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "status": "verified",
  "risk_score": 0.15,
  "verification_status": {
    "identity": "verified",
    "banking": "verified",
    "address": "verified"
  },
  "created_at": "2024-01-10T09:00:00Z",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

### Update Payee

**Endpoint:** `PUT /payees/{payee_id}`

### Delete Payee

**Endpoint:** `DELETE /payees/{payee_id}`

### List Payees

**Endpoint:** `GET /payees`

**Query Parameters:**
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Number of records to skip
- `status`: Filter by verification status
- `risk_level`: Filter by risk level

## Fraud Detection

### Get Fraud Score

Calculate fraud score for a specific scenario without processing payment.

**Endpoint:** `POST /fraud/score`

**Request Body:**
```json
{
  "amount": 1000.00,
  "currency": "USD",
  "payee_id": "payee_987654321",
  "payer_id": "payer_456789123",
  "transaction_context": {
    "time_of_day": "business_hours",
    "frequency": "first_time",
    "device_fingerprint": "fp_abc123"
  }
}
```

**Response:**
```json
{
  "fraud_score": 0.23,
  "risk_level": "low",
  "contributing_factors": [
    {
      "factor": "payee_reputation",
      "score": 0.05,
      "description": "Payee has excellent payment history"
    },
    {
      "factor": "amount_analysis", 
      "score": 0.10,
      "description": "Amount is within normal range"
    }
  ],
  "recommendations": [
    "approve",
    "monitor_future_transactions"
  ]
}
```

### Get Risk Factors

**Endpoint:** `GET /fraud/risk-factors`

Returns list of all risk factors used in fraud detection.

## Webhooks

### Configure Webhook

**Endpoint:** `POST /webhooks`

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/payment-review",
  "events": [
    "payment.review.completed",
    "payment.review.flagged",
    "payee.verification.completed"
  ],
  "secret": "your_webhook_secret"
}
```

### Webhook Events

#### payment.review.completed
```json
{
  "event": "payment.review.completed",
  "payment_id": "pay_123456789",
  "fraud_score": 0.23,
  "recommendation": "approve",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### payment.review.flagged
```json
{
  "event": "payment.review.flagged",
  "payment_id": "pay_123456789", 
  "fraud_score": 0.85,
  "flags": ["high_amount", "new_payee"],
  "requires_manual_review": true,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Handling

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Invalid or missing API key
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_PAYEE_DATA",
    "message": "The payee email address format is invalid",
    "details": {
      "field": "payee.email",
      "value": "invalid-email"
    },
    "request_id": "req_abc123"
  }
}
```

### Common Error Codes

- `INVALID_API_KEY` - API key is invalid or expired
- `INSUFFICIENT_PERMISSIONS` - API key lacks required permissions
- `INVALID_PAYMENT_DATA` - Payment data validation failed
- `INVALID_PAYEE_DATA` - Payee data validation failed
- `PAYEE_NOT_FOUND` - Specified payee ID not found
- `DUPLICATE_PAYMENT_ID` - Payment ID already exists
- `FRAUD_SCORE_UNAVAILABLE` - Unable to calculate fraud score

## Rate Limiting

API requests are rate limited to ensure service stability:

- **Standard Plan:** 1,000 requests per hour
- **Premium Plan:** 10,000 requests per hour  
- **Enterprise Plan:** Custom limits

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## SDKs and Examples

### Official SDKs

- **JavaScript/Node.js:** `npm install @payment-reviewer/js-sdk`
- **Python:** `pip install payment-reviewer-python`
- **Java:** Available on Maven Central
- **PHP:** `composer require payment-reviewer/php-sdk`

### Quick Start Examples

#### Node.js SDK
```javascript
const PaymentReviewer = require('@payment-reviewer/js-sdk');

const client = new PaymentReviewer('YOUR_API_KEY');

async function reviewPayment() {
  try {
    const result = await client.payments.review({
      payment_id: 'pay_123',
      amount: 1000.00,
      currency: 'USD',
      payee: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    });
    
    console.log('Fraud Score:', result.fraud_score);
    console.log('Recommendation:', result.recommendation);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

#### Python SDK
```python
from payment_reviewer import PaymentReviewer

client = PaymentReviewer(api_key='YOUR_API_KEY')

try:
    result = client.payments.review({
        'payment_id': 'pay_123',
        'amount': 1000.00,
        'currency': 'USD',
        'payee': {
            'name': 'John Doe',
            'email': 'john@example.com'
        }
    })
    
    print(f"Fraud Score: {result['fraud_score']}")
    print(f"Recommendation: {result['recommendation']}")
except Exception as error:
    print(f"Error: {error}")
```

### Testing

Use the test API key for development:
```
Test API Key: test_pk_1234567890abcdef
Test Base URL: https://api-test.payment-reviewer.com/v1
```

### Support

- **Documentation:** https://docs.payment-reviewer.com
- **API Status:** https://status.payment-reviewer.com  
- **Support:** support@payment-reviewer.com
- **Community:** https://community.payment-reviewer.com