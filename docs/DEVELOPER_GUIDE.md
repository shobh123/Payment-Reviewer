# Payment Reviewer Developer Integration Guide

## Overview

This guide provides comprehensive information for developers integrating with the Payment Reviewer API. Learn how to implement fraud detection, manage payees, and process payments using our RESTful API and SDKs.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [SDK Installation](#sdk-installation)
4. [Core Integration Patterns](#core-integration-patterns)
5. [Advanced Features](#advanced-features)
6. [Webhooks](#webhooks)
7. [Testing](#testing)
8. [Error Handling](#error-handling)
9. [Performance Optimization](#performance-optimization)
10. [Security Best Practices](#security-best-practices)

## Quick Start

### 1. Get API Credentials

```bash
# Sign up for Payment Reviewer account
curl -X POST https://api.payment-reviewer.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@company.com",
    "company": "Your Company",
    "use_case": "payment_processing"
  }'

# Response includes API key
{
  "api_key": "pr_live_abc123...",
  "test_api_key": "pr_test_xyz789..."
}
```

### 2. Make Your First Request

```javascript
// Test API connection
const response = await fetch('https://api.payment-reviewer.com/v1/health', {
  headers: {
    'Authorization': 'Bearer pr_test_xyz789...'
  }
});

console.log(await response.json());
// Output: { "status": "healthy", "version": "1.0.0" }
```

### 3. Review Your First Payment

```javascript
const paymentReview = await fetch('https://api.payment-reviewer.com/v1/payments/review', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pr_test_xyz789...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    payment_id: 'pay_123456',
    amount: 1000.00,
    currency: 'USD',
    payee: {
      name: 'John Doe',
      email: 'john@example.com',
      account_number: '1234567890'
    },
    payer: {
      name: 'Your Company',
      ip_address: '192.168.1.1'
    }
  })
});

const result = await paymentReview.json();
console.log(result);
```

## Authentication

### API Key Authentication

All API requests require authentication using an API key in the Authorization header:

```http
Authorization: Bearer pr_live_abc123def456ghi789...
```

### Environment Setup

```javascript
// Environment variables
const API_KEY = process.env.PAYMENT_REVIEWER_API_KEY;
const BASE_URL = process.env.PAYMENT_REVIEWER_BASE_URL || 'https://api.payment-reviewer.com/v1';

// Request headers
const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  'User-Agent': 'YourApp/1.0.0'
};
```

### API Key Management

```javascript
class PaymentReviewerClient {
  constructor(apiKey, environment = 'production') {
    this.apiKey = apiKey;
    this.baseURL = environment === 'production' 
      ? 'https://api.payment-reviewer.com/v1'
      : 'https://api-sandbox.payment-reviewer.com/v1';
  }
  
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

## SDK Installation

### JavaScript/Node.js

```bash
npm install @payment-reviewer/node-sdk
# or
yarn add @payment-reviewer/node-sdk
```

```javascript
import PaymentReviewer from '@payment-reviewer/node-sdk';

const client = new PaymentReviewer({
  apiKey: process.env.PAYMENT_REVIEWER_API_KEY,
  environment: 'sandbox' // or 'production'
});

// Review a payment
const result = await client.payments.review({
  payment_id: 'pay_123',
  amount: 500.00,
  currency: 'USD',
  payee: {
    name: 'Jane Smith',
    email: 'jane@example.com'
  }
});

console.log('Fraud Score:', result.fraud_score);
```

### Python

```bash
pip install payment-reviewer-python
```

```python
from payment_reviewer import PaymentReviewer

client = PaymentReviewer(
    api_key=os.getenv('PAYMENT_REVIEWER_API_KEY'),
    environment='sandbox'
)

# Review a payment
result = client.payments.review({
    'payment_id': 'pay_123',
    'amount': 500.00,
    'currency': 'USD',
    'payee': {
        'name': 'Jane Smith',
        'email': 'jane@example.com'
    }
})

print(f"Fraud Score: {result['fraud_score']}")
```

### PHP

```bash
composer require payment-reviewer/php-sdk
```

```php
<?php
require_once 'vendor/autoload.php';

use PaymentReviewer\Client;

$client = new Client([
    'api_key' => getenv('PAYMENT_REVIEWER_API_KEY'),
    'environment' => 'sandbox'
]);

// Review a payment
$result = $client->payments->review([
    'payment_id' => 'pay_123',
    'amount' => 500.00,
    'currency' => 'USD',
    'payee' => [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com'
    ]
]);

echo "Fraud Score: " . $result['fraud_score'];
?>
```

### Java

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>com.payment-reviewer</groupId>
    <artifactId>payment-reviewer-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

```java
import com.paymentreviewer.PaymentReviewer;
import com.paymentreviewer.models.*;

PaymentReviewer client = new PaymentReviewer.Builder()
    .apiKey(System.getenv("PAYMENT_REVIEWER_API_KEY"))
    .environment("sandbox")
    .build();

// Review a payment
PaymentReviewRequest request = new PaymentReviewRequest()
    .paymentId("pay_123")
    .amount(500.00)
    .currency("USD")
    .payee(new Payee()
        .name("Jane Smith")
        .email("jane@example.com"));

PaymentReviewResponse result = client.payments().review(request);
System.out.println("Fraud Score: " + result.getFraudScore());
```

## Core Integration Patterns

### 1. Real-time Payment Review

```javascript
class PaymentProcessor {
  constructor(paymentReviewerClient) {
    this.fraudDetector = paymentReviewerClient;
  }
  
  async processPayment(paymentData) {
    try {
      // Step 1: Review payment for fraud
      const fraudResult = await this.fraudDetector.payments.review({
        payment_id: paymentData.id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payee: paymentData.payee,
        payer: paymentData.payer,
        metadata: paymentData.metadata
      });
      
      // Step 2: Make decision based on fraud score
      if (fraudResult.fraud_score < 0.3) {
        // Low risk - auto approve
        return await this.approvePayment(paymentData);
      } else if (fraudResult.fraud_score < 0.6) {
        // Medium risk - queue for manual review
        return await this.queueForReview(paymentData, fraudResult);
      } else {
        // High risk - reject or investigate
        return await this.handleHighRiskPayment(paymentData, fraudResult);
      }
    } catch (error) {
      // Handle API errors gracefully
      console.error('Fraud detection failed:', error);
      // Fallback to manual review
      return await this.queueForReview(paymentData, null);
    }
  }
  
  async approvePayment(paymentData) {
    // Process the payment
    const result = await this.paymentGateway.process(paymentData);
    
    // Log the decision
    await this.logPaymentDecision(paymentData.id, 'approved', 'auto');
    
    return {
      status: 'approved',
      transaction_id: result.transaction_id
    };
  }
  
  async queueForReview(paymentData, fraudResult) {
    // Add to review queue
    await this.reviewQueue.add({
      payment: paymentData,
      fraud_analysis: fraudResult,
      priority: fraudResult?.risk_level || 'medium'
    });
    
    return {
      status: 'pending_review',
      estimated_review_time: '2-4 hours'
    };
  }
  
  async handleHighRiskPayment(paymentData, fraudResult) {
    // Log suspicious activity
    await this.securityLogger.logHighRiskPayment(paymentData, fraudResult);
    
    // Notify security team
    await this.notificationService.alertSecurityTeam({
      payment_id: paymentData.id,
      risk_score: fraudResult.fraud_score,
      risk_factors: fraudResult.risk_factors
    });
    
    return {
      status: 'rejected',
      reason: 'high_fraud_risk',
      fraud_score: fraudResult.fraud_score
    };
  }
}
```

### 2. Batch Payment Processing

```javascript
class BatchPaymentProcessor {
  constructor(paymentReviewerClient) {
    this.fraudDetector = paymentReviewerClient;
    this.batchSize = 100;
  }
  
  async processBatch(payments) {
    const results = [];
    
    // Process in chunks to avoid rate limits
    for (let i = 0; i < payments.length; i += this.batchSize) {
      const chunk = payments.slice(i, i + this.batchSize);
      const chunkResults = await this.processChunk(chunk);
      results.push(...chunkResults);
      
      // Add delay between batches if needed
      if (i + this.batchSize < payments.length) {
        await this.delay(100);
      }
    }
    
    return results;
  }
  
  async processChunk(payments) {
    // Use batch API for efficiency
    const batchRequest = payments.map(payment => ({
      payment_id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      payee: payment.payee,
      payer: payment.payer
    }));
    
    try {
      const batchResult = await this.fraudDetector.payments.reviewBatch({
        payments: batchRequest
      });
      
      return batchResult.results.map((result, index) => ({
        payment_id: payments[index].id,
        fraud_score: result.fraud_score,
        risk_level: result.risk_level,
        recommendation: result.recommendation,
        processing_time: result.processing_time_ms
      }));
    } catch (error) {
      // Fallback to individual processing
      console.warn('Batch processing failed, falling back to individual requests');
      return await Promise.all(
        payments.map(payment => this.processSinglePayment(payment))
      );
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 3. Payee Management Integration

```javascript
class PayeeManager {
  constructor(paymentReviewerClient) {
    this.client = paymentReviewerClient;
  }
  
  async onboardPayee(payeeData) {
    try {
      // Create payee in Payment Reviewer
      const payee = await this.client.payees.create({
        name: payeeData.name,
        email: payeeData.email,
        phone: payeeData.phone,
        address: payeeData.address,
        banking_info: {
          account_number: payeeData.account_number,
          routing_number: payeeData.routing_number,
          account_type: payeeData.account_type
        },
        business_info: payeeData.business_info
      });
      
      // Start verification process
      const verification = await this.client.payees.verify(payee.id, {
        documents: payeeData.documents,
        verification_level: 'full'
      });
      
      return {
        payee_id: payee.id,
        status: verification.status,
        verification_url: verification.verification_url
      };
    } catch (error) {
      if (error.code === 'DUPLICATE_PAYEE') {
        // Handle duplicate payee
        const existingPayee = await this.client.payees.findByEmail(payeeData.email);
        return {
          payee_id: existingPayee.id,
          status: 'existing',
          message: 'Payee already exists'
        };
      }
      throw error;
    }
  }
  
  async updatePayeeRiskProfile(payeeId, riskData) {
    return await this.client.payees.updateRiskProfile(payeeId, {
      risk_factors: riskData.risk_factors,
      risk_score_override: riskData.risk_score_override,
      notes: riskData.notes,
      last_updated: new Date().toISOString()
    });
  }
  
  async getPayeeInsights(payeeId) {
    const [payee, transactions, riskHistory] = await Promise.all([
      this.client.payees.get(payeeId),
      this.client.payees.getTransactionHistory(payeeId),
      this.client.payees.getRiskHistory(payeeId)
    ]);
    
    return {
      payee_info: payee,
      transaction_summary: {
        total_amount: transactions.reduce((sum, t) => sum + t.amount, 0),
        transaction_count: transactions.length,
        success_rate: transactions.filter(t => t.status === 'completed').length / transactions.length,
        last_transaction: transactions[0]?.created_at
      },
      risk_trends: riskHistory.map(r => ({
        date: r.date,
        risk_score: r.risk_score,
        risk_level: r.risk_level
      }))
    };
  }
}
```

## Advanced Features

### 1. Custom Rule Engine Integration

```javascript
class CustomRuleEngine {
  constructor(paymentReviewerClient) {
    this.client = paymentReviewerClient;
    this.rules = new Map();
  }
  
  // Define custom business rules
  addRule(name, condition, action) {
    this.rules.set(name, { condition, action });
  }
  
  async evaluatePayment(paymentData) {
    // Get base fraud score
    const baseResult = await this.client.payments.review(paymentData);
    
    // Apply custom rules
    let finalScore = baseResult.fraud_score;
    const triggeredRules = [];
    
    for (const [ruleName, rule] of this.rules) {
      if (await rule.condition(paymentData, baseResult)) {
        const adjustment = await rule.action(paymentData, baseResult);
        finalScore = Math.min(1.0, finalScore + adjustment);
        triggeredRules.push({
          name: ruleName,
          adjustment: adjustment
        });
      }
    }
    
    return {
      ...baseResult,
      custom_fraud_score: finalScore,
      triggered_rules: triggeredRules
    };
  }
}

// Example usage
const ruleEngine = new CustomRuleEngine(client);

// Add custom rule for weekend transactions
ruleEngine.addRule('weekend_transaction', 
  async (payment) => {
    const paymentDate = new Date(payment.timestamp);
    const dayOfWeek = paymentDate.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  },
  async () => 0.1 // Add 0.1 to fraud score
);

// Add rule for large amounts
ruleEngine.addRule('large_amount',
  async (payment) => payment.amount > 10000,
  async (payment) => Math.min(0.2, payment.amount / 100000) // Scale with amount
);
```

### 2. Real-time Monitoring Integration

```javascript
class FraudMonitor {
  constructor(paymentReviewerClient, metricsClient) {
    this.client = paymentReviewerClient;
    this.metrics = metricsClient;
    this.alertThresholds = {
      high_risk_rate: 0.15, // Alert if >15% of payments are high risk
      avg_fraud_score: 0.5,  // Alert if average score >0.5
      processing_time: 1000  // Alert if processing time >1s
    };
  }
  
  async monitorPaymentTrends() {
    const stats = await this.client.analytics.getRealtimeStats();
    
    // Check fraud score trends
    if (stats.avg_fraud_score > this.alertThresholds.avg_fraud_score) {
      await this.sendAlert({
        type: 'high_average_fraud_score',
        value: stats.avg_fraud_score,
        threshold: this.alertThresholds.avg_fraud_score
      });
    }
    
    // Check high-risk rate
    const highRiskRate = stats.high_risk_count / stats.total_count;
    if (highRiskRate > this.alertThresholds.high_risk_rate) {
      await this.sendAlert({
        type: 'high_risk_rate_spike',
        value: highRiskRate,
        threshold: this.alertThresholds.high_risk_rate
      });
    }
    
    // Track metrics
    this.metrics.gauge('fraud_detection.avg_score', stats.avg_fraud_score);
    this.metrics.gauge('fraud_detection.high_risk_rate', highRiskRate);
    this.metrics.gauge('fraud_detection.processing_time', stats.avg_processing_time);
  }
  
  async sendAlert(alert) {
    console.log('FRAUD ALERT:', alert);
    // Send to monitoring system
    await this.metrics.sendAlert(alert);
  }
}
```

### 3. Machine Learning Model Integration

```javascript
class MLModelIntegration {
  constructor(paymentReviewerClient) {
    this.client = paymentReviewerClient;
    this.localModel = null;
  }
  
  async loadLocalModel(modelPath) {
    // Load a local ML model for additional scoring
    this.localModel = await loadModel(modelPath);
  }
  
  async enhancedFraudDetection(paymentData) {
    // Get Payment Reviewer score
    const prResult = await this.client.payments.review(paymentData);
    
    // Get local model score if available
    let localScore = null;
    if (this.localModel) {
      const features = this.extractFeatures(paymentData);
      localScore = await this.localModel.predict(features);
    }
    
    // Combine scores using ensemble method
    const finalScore = this.combineScores(prResult.fraud_score, localScore);
    
    return {
      ...prResult,
      local_model_score: localScore,
      ensemble_score: finalScore,
      model_agreement: Math.abs(prResult.fraud_score - localScore) < 0.1
    };
  }
  
  extractFeatures(paymentData) {
    return {
      amount: paymentData.amount,
      hour_of_day: new Date(paymentData.timestamp).getHours(),
      payee_age_days: this.calculatePayeeAge(paymentData.payee),
      // ... other features
    };
  }
  
  combineScores(prScore, localScore) {
    if (!localScore) return prScore;
    
    // Weighted average with higher weight on Payment Reviewer
    return (prScore * 0.7) + (localScore * 0.3);
  }
}
```

## Webhooks

### Setting Up Webhooks

```javascript
// Configure webhook endpoint
const webhookConfig = await client.webhooks.create({
  url: 'https://your-app.com/webhooks/payment-reviewer',
  events: [
    'payment.review.completed',
    'payment.review.flagged',
    'payee.verification.completed',
    'fraud.alert.triggered'
  ],
  secret: 'your_webhook_secret_key'
});

console.log('Webhook ID:', webhookConfig.id);
```

### Webhook Handler Implementation

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.raw({ type: 'application/json' }));

app.post('/webhooks/payment-reviewer', (req, res) => {
  const signature = req.headers['x-pr-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  if (!verifyWebhookSignature(payload, signature)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = JSON.parse(payload.toString());
  
  // Handle different event types
  switch (event.type) {
    case 'payment.review.completed':
      handlePaymentReviewCompleted(event.data);
      break;
    case 'payment.review.flagged':
      handlePaymentFlagged(event.data);
      break;
    case 'payee.verification.completed':
      handlePayeeVerified(event.data);
      break;
    case 'fraud.alert.triggered':
      handleFraudAlert(event.data);
      break;
    default:
      console.log('Unknown event type:', event.type);
  }
  
  res.status(200).send('OK');
});

function verifyWebhookSignature(payload, signature) {
  const secret = process.env.WEBHOOK_SECRET;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

async function handlePaymentReviewCompleted(data) {
  const { payment_id, fraud_score, recommendation } = data;
  
  // Update payment status in your system
  await updatePaymentStatus(payment_id, {
    fraud_score: fraud_score,
    review_status: 'completed',
    recommendation: recommendation,
    reviewed_at: new Date()
  });
  
  // Take action based on recommendation
  if (recommendation === 'approve') {
    await processPayment(payment_id);
  } else if (recommendation === 'reject') {
    await rejectPayment(payment_id, 'fraud_risk');
  }
}

async function handlePaymentFlagged(data) {
  const { payment_id, fraud_score, flags } = data;
  
  // Notify review team
  await notifyReviewTeam({
    payment_id: payment_id,
    fraud_score: fraud_score,
    flags: flags,
    priority: fraud_score > 0.8 ? 'high' : 'medium'
  });
  
  // Update payment status
  await updatePaymentStatus(payment_id, {
    status: 'flagged_for_review',
    fraud_score: fraud_score,
    flags: flags
  });
}
```

## Testing

### Unit Testing with Mocks

```javascript
// Jest test example
const PaymentReviewer = require('@payment-reviewer/node-sdk');

// Mock the SDK
jest.mock('@payment-reviewer/node-sdk');

describe('PaymentProcessor', () => {
  let paymentProcessor;
  let mockClient;
  
  beforeEach(() => {
    mockClient = {
      payments: {
        review: jest.fn()
      }
    };
    PaymentReviewer.mockImplementation(() => mockClient);
    paymentProcessor = new PaymentProcessor(new PaymentReviewer());
  });
  
  test('should approve low-risk payments automatically', async () => {
    // Mock low fraud score response
    mockClient.payments.review.mockResolvedValue({
      fraud_score: 0.15,
      risk_level: 'low',
      recommendation: 'approve'
    });
    
    const payment = {
      id: 'pay_123',
      amount: 100.00,
      currency: 'USD',
      payee: { name: 'John Doe', email: 'john@example.com' }
    };
    
    const result = await paymentProcessor.processPayment(payment);
    
    expect(result.status).toBe('approved');
    expect(mockClient.payments.review).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_id: 'pay_123',
        amount: 100.00
      })
    );
  });
  
  test('should queue high-risk payments for review', async () => {
    mockClient.payments.review.mockResolvedValue({
      fraud_score: 0.75,
      risk_level: 'high',
      recommendation: 'review'
    });
    
    const payment = {
      id: 'pay_456',
      amount: 5000.00,
      currency: 'USD',
      payee: { name: 'Suspicious User', email: 'sus@example.com' }
    };
    
    const result = await paymentProcessor.processPayment(payment);
    
    expect(result.status).toBe('pending_review');
  });
});
```

### Integration Testing

```javascript
describe('Payment Reviewer Integration', () => {
  let client;
  
  beforeAll(() => {
    client = new PaymentReviewer({
      apiKey: process.env.TEST_API_KEY,
      environment: 'sandbox'
    });
  });
  
  test('should create and verify payee', async () => {
    // Create payee
    const payee = await client.payees.create({
      name: 'Test Payee',
      email: 'test@example.com',
      phone: '+1234567890',
      banking_info: {
        account_number: '1234567890',
        routing_number: '021000021',
        account_type: 'checking'
      }
    });
    
    expect(payee.id).toBeDefined();
    expect(payee.status).toBe('unverified');
    
    // Start verification
    const verification = await client.payees.verify(payee.id, {
      verification_level: 'basic'
    });
    
    expect(verification.status).toBe('pending');
    
    // Clean up
    await client.payees.delete(payee.id);
  });
  
  test('should process payment review end-to-end', async () => {
    const payment = {
      payment_id: `test_${Date.now()}`,
      amount: 250.00,
      currency: 'USD',
      payee: {
        name: 'John Smith',
        email: 'john.smith@example.com'
      },
      payer: {
        name: 'Test Company',
        ip_address: '192.168.1.1'
      }
    };
    
    const result = await client.payments.review(payment);
    
    expect(result.fraud_score).toBeGreaterThanOrEqual(0);
    expect(result.fraud_score).toBeLessThanOrEqual(1);
    expect(result.risk_level).toMatch(/^(low|medium|high|critical)$/);
    expect(result.recommendation).toMatch(/^(approve|review|reject)$/);
    expect(result.processing_time_ms).toBeGreaterThan(0);
  });
});
```

### Load Testing

```javascript
// Artillery.io load test configuration
// artillery-config.yml
/*
config:
  target: 'https://api-sandbox.payment-reviewer.com'
  phases:
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Authorization: 'Bearer {{ $env.TEST_API_KEY }}'
      Content-Type: 'application/json'

scenarios:
  - name: 'Payment Review Load Test'
    flow:
      - post:
          url: '/v1/payments/review'
          json:
            payment_id: 'load_test_{{ $randomString() }}'
            amount: '{{ $randomNumber(100, 10000) }}'
            currency: 'USD'
            payee:
              name: 'Load Test User {{ $randomNumber(1, 1000) }}'
              email: 'user{{ $randomNumber(1, 1000) }}@example.com'
*/

// Run load test
// artillery run artillery-config.yml
```

## Error Handling

### Comprehensive Error Handling

```javascript
class PaymentReviewerError extends Error {
  constructor(message, code, statusCode, details) {
    super(message);
    this.name = 'PaymentReviewerError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

class RobustPaymentProcessor {
  constructor(client) {
    this.client = client;
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000
    };
  }
  
  async processPaymentWithRetry(paymentData) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await this.client.payments.review(paymentData);
      } catch (error) {
        lastError = error;
        
        if (!this.shouldRetry(error) || attempt === this.retryConfig.maxRetries) {
          break;
        }
        
        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
          this.retryConfig.maxDelay
        );
        
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await this.sleep(delay);
      }
    }
    
    throw this.enhanceError(lastError);
  }
  
  shouldRetry(error) {
    // Retry on network errors and temporary server errors
    return error.statusCode >= 500 || 
           error.code === 'NETWORK_ERROR' ||
           error.code === 'TIMEOUT';
  }
  
  enhanceError(error) {
    const errorMap = {
      'INVALID_API_KEY': 'Check your API key configuration',
      'INSUFFICIENT_PERMISSIONS': 'Your API key lacks required permissions',
      'RATE_LIMIT_EXCEEDED': 'Too many requests. Please slow down',
      'INVALID_PAYMENT_DATA': 'Payment data validation failed',
      'PAYEE_NOT_FOUND': 'Specified payee does not exist',
      'NETWORK_ERROR': 'Network connection failed. Check your internet connection',
      'TIMEOUT': 'Request timed out. The service may be experiencing high load'
    };
    
    const guidance = errorMap[error.code] || 'An unexpected error occurred';
    
    return new PaymentReviewerError(
      `${error.message}. ${guidance}`,
      error.code,
      error.statusCode,
      {
        original_error: error,
        guidance: guidance,
        timestamp: new Date().toISOString()
      }
    );
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Error Recovery Strategies

```javascript
class FaultTolerantProcessor {
  constructor(primaryClient, fallbackClient) {
    this.primary = primaryClient;
    this.fallback = fallbackClient;
    this.circuitBreaker = new CircuitBreaker();
  }
  
  async processPayment(paymentData) {
    // Try primary service
    if (this.circuitBreaker.canCall()) {
      try {
        const result = await this.primary.payments.review(paymentData);
        this.circuitBreaker.recordSuccess();
        return result;
      } catch (error) {
        this.circuitBreaker.recordFailure();
        
        if (this.circuitBreaker.isOpen()) {
          console.log('Circuit breaker is open, using fallback service');
          return await this.useFallbackService(paymentData);
        }
        
        throw error;
      }
    } else {
      // Circuit breaker is open, use fallback
      return await this.useFallbackService(paymentData);
    }
  }
  
  async useFallbackService(paymentData) {
    if (this.fallback) {
      return await this.fallback.payments.review(paymentData);
    } else {
      // Fallback to rule-based system
      return this.ruleBasedFallback(paymentData);
    }
  }
  
  ruleBasedFallback(paymentData) {
    // Simple rule-based fraud detection
    let score = 0.0;
    
    // High amount increases risk
    if (paymentData.amount > 10000) score += 0.3;
    if (paymentData.amount > 50000) score += 0.2;
    
    // New payee increases risk
    if (!paymentData.payee.id) score += 0.2;
    
    // Weekend transactions slightly riskier
    const day = new Date().getDay();
    if (day === 0 || day === 6) score += 0.1;
    
    const riskLevel = score < 0.3 ? 'low' : score < 0.6 ? 'medium' : 'high';
    const recommendation = score < 0.3 ? 'approve' : score < 0.6 ? 'review' : 'reject';
    
    return {
      fraud_score: Math.min(score, 1.0),
      risk_level: riskLevel,
      recommendation: recommendation,
      fallback_used: true,
      processing_time_ms: 50
    };
  }
}

class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureThreshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  canCall() {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return true; // HALF_OPEN
  }
  
  recordSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
  
  isOpen() {
    return this.state === 'OPEN';
  }
}
```

## Performance Optimization

### Caching Strategies

```javascript
const Redis = require('redis');

class CachedPaymentProcessor {
  constructor(paymentReviewerClient, redisClient) {
    this.client = paymentReviewerClient;
    this.cache = redisClient;
    this.cacheTTL = 300; // 5 minutes
  }
  
  async processPayment(paymentData) {
    // Generate cache key based on payment characteristics
    const cacheKey = this.generateCacheKey(paymentData);
    
    // Check cache first
    const cachedResult = await this.cache.get(cacheKey);
    if (cachedResult) {
      const result = JSON.parse(cachedResult);
      result.cached = true;
      return result;
    }
    
    // Not in cache, call API
    const result = await this.client.payments.review(paymentData);
    
    // Cache the result if it's cacheable
    if (this.shouldCache(result)) {
      await this.cache.setex(cacheKey, this.cacheTTL, JSON.stringify(result));
    }
    
    result.cached = false;
    return result;
  }
  
  generateCacheKey(paymentData) {
    // Create cache key from stable payment characteristics
    const keyData = {
      amount: Math.floor(paymentData.amount / 100) * 100, // Round to nearest $100
      payee_id: paymentData.payee.id,
      currency: paymentData.currency,
      hour: new Date().getHours() // Time-based caching
    };
    
    return `fraud_score:${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
  }
  
  shouldCache(result) {
    // Only cache stable, low-risk results
    return result.fraud_score < 0.3 && 
           result.risk_level === 'low' &&
           !result.flags?.length;
  }
}
```

### Batch Processing Optimization

```javascript
class OptimizedBatchProcessor {
  constructor(client) {
    this.client = client;
    this.batchSize = 50;
    this.concurrency = 5;
  }
  
  async processBatchOptimized(payments) {
    // Group payments by characteristics for better batching
    const groups = this.groupPayments(payments);
    
    const results = [];
    
    // Process groups concurrently
    const groupPromises = groups.map(group => 
      this.processGroup(group)
    );
    
    const groupResults = await Promise.all(groupPromises);
    
    // Flatten results
    return groupResults.flat();
  }
  
  groupPayments(payments) {
    const groups = new Map();
    
    payments.forEach(payment => {
      // Group by currency and risk characteristics
      const groupKey = `${payment.currency}_${this.getRiskCategory(payment)}`;
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      
      groups.get(groupKey).push(payment);
    });
    
    // Split large groups into smaller batches
    const finalGroups = [];
    for (const group of groups.values()) {
      for (let i = 0; i < group.length; i += this.batchSize) {
        finalGroups.push(group.slice(i, i + this.batchSize));
      }
    }
    
    return finalGroups;
  }
  
  getRiskCategory(payment) {
    if (payment.amount > 10000) return 'high_amount';
    if (!payment.payee.id) return 'new_payee';
    return 'standard';
  }
  
  async processGroup(group) {
    try {
      // Use batch API for efficiency
      const batchResult = await this.client.payments.reviewBatch({
        payments: group.map(p => ({
          payment_id: p.id,
          amount: p.amount,
          currency: p.currency,
          payee: p.payee,
          payer: p.payer
        }))
      });
      
      return batchResult.results;
    } catch (error) {
      console.warn('Batch processing failed, using individual requests:', error.message);
      
      // Fallback to concurrent individual requests
      return await this.processConcurrently(group);
    }
  }
  
  async processConcurrently(payments) {
    const semaphore = new Semaphore(this.concurrency);
    
    return await Promise.all(
      payments.map(async payment => {
        await semaphore.acquire();
        try {
          return await this.client.payments.review(payment);
        } finally {
          semaphore.release();
        }
      })
    );
  }
}

class Semaphore {
  constructor(max) {
    this.max = max;
    this.current = 0;
    this.queue = [];
  }
  
  async acquire() {
    if (this.current < this.max) {
      this.current++;
      return;
    }
    
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }
  
  release() {
    this.current--;
    if (this.queue.length > 0) {
      this.current++;
      const resolve = this.queue.shift();
      resolve();
    }
  }
}
```

## Security Best Practices

### API Key Security

```javascript
class SecureAPIClient {
  constructor() {
    this.apiKey = this.getAPIKey();
    this.keyRotationInterval = 24 * 60 * 60 * 1000; // 24 hours
    this.lastKeyRotation = Date.now();
  }
  
  getAPIKey() {
    // Get API key from secure storage
    const key = process.env.PAYMENT_REVIEWER_API_KEY;
    
    if (!key) {
      throw new Error('API key not found in environment variables');
    }
    
    // Validate key format
    if (!key.match(/^pr_(live|test)_[a-zA-Z0-9]{32,}$/)) {
      throw new Error('Invalid API key format');
    }
    
    return key;
  }
  
  async rotateAPIKeyIfNeeded() {
    if (Date.now() - this.lastKeyRotation > this.keyRotationInterval) {
      await this.rotateAPIKey();
    }
  }
  
  async rotateAPIKey() {
    try {
      // Call API to rotate key
      const newKey = await this.requestKeyRotation();
      
      // Update stored key
      await this.updateStoredKey(newKey);
      
      this.apiKey = newKey;
      this.lastKeyRotation = Date.now();
      
      console.log('API key rotated successfully');
    } catch (error) {
      console.error('Key rotation failed:', error);
      // Implement alerting for failed key rotation
    }
  }
  
  async makeSecureRequest(endpoint, data) {
    // Ensure key is current
    await this.rotateAPIKeyIfNeeded();
    
    // Add request signing for extra security
    const timestamp = Date.now();
    const signature = this.signRequest(data, timestamp);
    
    return await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Timestamp': timestamp.toString(),
        'X-Signature': signature,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
  
  signRequest(data, timestamp) {
    const crypto = require('crypto');
    const payload = JSON.stringify(data) + timestamp;
    return crypto
      .createHmac('sha256', this.apiKey)
      .update(payload)
      .digest('hex');
  }
}
```

### Data Protection

```javascript
class DataProtectionLayer {
  constructor(client) {
    this.client = client;
    this.encryptionKey = this.getEncryptionKey();
  }
  
  async processPaymentSecurely(paymentData) {
    // Sanitize sensitive data before sending
    const sanitizedData = this.sanitizePaymentData(paymentData);
    
    // Encrypt PII if required
    if (this.shouldEncryptPII(sanitizedData)) {
      sanitizedData.payee = await this.encryptPII(sanitizedData.payee);
    }
    
    // Process with fraud detection
    const result = await this.client.payments.review(sanitizedData);
    
    // Log securely (without sensitive data)
    this.secureLog('payment_processed', {
      payment_id: sanitizedData.payment_id,
      fraud_score: result.fraud_score,
      risk_level: result.risk_level
    });
    
    return result;
  }
  
  sanitizePaymentData(data) {
    const sanitized = { ...data };
    
    // Remove or mask sensitive fields
    if (sanitized.payee?.account_number) {
      sanitized.payee.account_number = this.maskAccountNumber(
        sanitized.payee.account_number
      );
    }
    
    if (sanitized.payee?.ssn) {
      delete sanitized.payee.ssn; // Never send SSN
    }
    
    // Validate and sanitize amounts
    if (typeof sanitized.amount !== 'number' || sanitized.amount < 0) {
      throw new Error('Invalid payment amount');
    }
    
    return sanitized;
  }
  
  maskAccountNumber(accountNumber) {
    // Show only last 4 digits
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  }
  
  async encryptPII(payeeData) {
    const crypto = require('crypto');
    const algorithm = 'aes-256-gcm';
    
    const encryptField = (value) => {
      if (!value) return value;
      
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(algorithm, this.encryptionKey);
      cipher.setAAD(Buffer.from('payment-reviewer'));
      
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    };
    
    return {
      ...payeeData,
      name: encryptField(payeeData.name),
      email: encryptField(payeeData.email),
      phone: encryptField(payeeData.phone)
    };
  }
  
  secureLog(event, data) {
    // Use structured logging without sensitive data
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      data: data,
      user_id: this.getCurrentUserId(),
      session_id: this.getSessionId()
    };
    
    console.log(JSON.stringify(logEntry));
  }
  
  getEncryptionKey() {
    return process.env.ENCRYPTION_KEY || 
           crypto.randomBytes(32).toString('hex');
  }
}
```

---

This comprehensive developer integration guide provides everything needed to successfully integrate with the Payment Reviewer API, from basic setup to advanced optimization and security practices. For additional support, consult the [API documentation](API.md) or contact our developer support team.