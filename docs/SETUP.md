# Payment Reviewer Setup Guide

## Overview

This guide will walk you through setting up the Payment Reviewer application for development, testing, and production environments. The system provides real-time fraud detection and payee verification services.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start](#quick-start)
3. [Installation Methods](#installation-methods)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Environment Setup](#environment-setup)
7. [Security Configuration](#security-configuration)
8. [Deployment](#deployment)
9. [Monitoring Setup](#monitoring-setup)
10. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

- **Operating System:** Linux (Ubuntu 20.04+), macOS 10.15+, or Windows 10+
- **Memory:** 4GB RAM (8GB recommended)
- **Storage:** 20GB available disk space
- **CPU:** 2 cores (4+ cores recommended for production)

### Software Dependencies

- **Runtime:** Node.js 18+ or Python 3.9+
- **Database:** PostgreSQL 13+ (primary), Redis 6+ (caching)
- **Container Platform:** Docker 20+ and Docker Compose 3.8+ (optional)
- **Web Server:** Nginx 1.18+ (production)

### External Services

- **Payment Providers:** Stripe, PayPal, or similar (optional)
- **Email Service:** SendGrid, AWS SES, or SMTP server
- **Monitoring:** DataDog, New Relic, or Prometheus (optional)

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/payment-reviewer.git
cd payment-reviewer

# Start with Docker Compose
docker-compose up -d

# The application will be available at:
# - Web UI: http://localhost:3000
# - API: http://localhost:8000/api/v1
# - Admin Panel: http://localhost:3000/admin
```

### Using NPM/Yarn

```bash
# Clone the repository
git clone https://github.com/your-org/payment-reviewer.git
cd payment-reviewer

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:setup

# Start the application
npm run dev
```

### Using Python/pip

```bash
# Clone the repository
git clone https://github.com/your-org/payment-reviewer.git
cd payment-reviewer

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
python manage.py migrate

# Start the application
python manage.py runserver
```

## Installation Methods

### Method 1: Docker Installation

**Prerequisites:**
- Docker 20+
- Docker Compose 3.8+

**Step 1: Clone and Configure**
```bash
git clone https://github.com/your-org/payment-reviewer.git
cd payment-reviewer

# Copy environment template
cp docker/.env.example docker/.env
```

**Step 2: Configure Environment**
Edit `docker/.env`:
```bash
# Database Configuration
POSTGRES_DB=payment_reviewer
POSTGRES_USER=pr_user
POSTGRES_PASSWORD=secure_password_here

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# Application Configuration
JWT_SECRET=your_jwt_secret_here
API_KEY_SECRET=your_api_key_secret_here

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Step 3: Start Services**
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Method 2: Native Installation

**Prerequisites:**
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- PostgreSQL 13+
- Redis 6+

**Step 1: Install System Dependencies**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib redis-server nginx
sudo systemctl start postgresql redis-server
```

**macOS (using Homebrew):**
```bash
brew install postgresql redis nginx
brew services start postgresql redis
```

**Step 2: Clone and Install Application**
```bash
git clone https://github.com/your-org/payment-reviewer.git
cd payment-reviewer

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install

# Return to project root
cd ..
```

**Step 3: Database Setup**
```bash
# Create database and user
sudo -u postgres createuser --createdb pr_user
sudo -u postgres createdb -O pr_user payment_reviewer

# Set password for database user
sudo -u postgres psql -c "ALTER USER pr_user PASSWORD 'secure_password';"
```

### Method 3: Cloud Deployment

**AWS Deployment (using Terraform):**
```bash
cd infrastructure/aws

# Initialize Terraform
terraform init

# Configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your AWS settings

# Deploy infrastructure
terraform plan
terraform apply
```

**Google Cloud Deployment:**
```bash
cd infrastructure/gcp

# Set up GCP CLI
gcloud auth login
gcloud config set project your-project-id

# Deploy using Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

## Configuration

### Environment Variables

Create `.env` file in the project root:

```bash
# Application Settings
NODE_ENV=development
PORT=8000
API_VERSION=v1

# Database Configuration
DATABASE_URL=postgresql://pr_user:password@localhost:5432/payment_reviewer
REDIS_URL=redis://localhost:6379/0

# Security Settings
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRES_IN=24h
API_KEY_LENGTH=32
BCRYPT_ROUNDS=12

# Fraud Detection
FRAUD_MODEL_PATH=/app/models/fraud_detection.pkl
FRAUD_THRESHOLD_LOW=0.3
FRAUD_THRESHOLD_MEDIUM=0.6
FRAUD_THRESHOLD_HIGH=0.8

# External APIs
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-app-password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
LOG_LEVEL=info
METRICS_ENABLED=true

# File Storage
STORAGE_TYPE=local  # Options: local, s3, gcs
AWS_S3_BUCKET=payment-reviewer-uploads
AWS_REGION=us-east-1

# Rate Limiting
RATE_LIMIT_WINDOW=15  # minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Application Configuration

Create `config/application.yml`:

```yaml
application:
  name: Payment Reviewer
  version: 1.0.0
  description: Real-time fraud detection for payments
  
security:
  cors:
    enabled: true
    origins:
      - http://localhost:3000
      - https://yourdomain.com
  
  rate_limiting:
    enabled: true
    window: 900  # 15 minutes in seconds
    max_requests: 100
    
fraud_detection:
  enabled: true
  models:
    primary: xgboost
    fallback: rule_based
  
  thresholds:
    auto_approve: 0.3
    manual_review: 0.6
    auto_block: 0.8
    
  features:
    - amount_analysis
    - payee_verification
    - velocity_check
    - geographic_risk
    
database:
  pool_size: 20
  max_overflow: 30
  pool_timeout: 30
  pool_recycle: 3600
  
cache:
  default_ttl: 300  # 5 minutes
  max_memory: 256mb
  
logging:
  level: info
  format: json
  rotate: true
  max_files: 10
  max_size: 100mb
```

## Database Setup

### PostgreSQL Configuration

**Create Database Schema:**
```sql
-- Create database
CREATE DATABASE payment_reviewer;

-- Create user
CREATE USER pr_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE payment_reviewer TO pr_user;

-- Connect to database
\c payment_reviewer

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
```

**Run Migrations:**
```bash
# For Node.js/TypeScript
npm run db:migrate

# For Python/Django
python manage.py migrate

# For Python/Alembic
alembic upgrade head
```

### Redis Configuration

Edit `/etc/redis/redis.conf`:
```conf
# Basic configuration
bind 127.0.0.1
port 6379
timeout 0
databases 16

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Security (if needed)
requirepass your_redis_password
```

### Database Initialization

```bash
# Seed initial data
npm run db:seed

# Create admin user
npm run create-admin-user

# Set up sample data (development only)
npm run db:sample-data
```

## Environment Setup

### Development Environment

**VS Code Configuration (.vscode/settings.json):**
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true
}
```

**Pre-commit Hooks:**
```bash
# Install pre-commit
pip install pre-commit

# Set up hooks
pre-commit install

# Test hooks
pre-commit run --all-files
```

**Environment-specific Configuration:**
```bash
# Development
export NODE_ENV=development
export DEBUG=true
export LOG_LEVEL=debug

# Testing
export NODE_ENV=test
export DATABASE_URL=postgresql://pr_user:password@localhost:5432/payment_reviewer_test

# Production
export NODE_ENV=production
export DEBUG=false
export LOG_LEVEL=warn
```

### Testing Environment

**Test Database Setup:**
```bash
# Create test database
createdb -O pr_user payment_reviewer_test

# Run test migrations
NODE_ENV=test npm run db:migrate
```

**Test Configuration:**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## Security Configuration

### SSL/TLS Setup

**Generate SSL Certificates:**
```bash
# For development (self-signed)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# For production (Let's Encrypt)
sudo certbot certonly --nginx -d yourdomain.com
```

**Nginx SSL Configuration:**
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Security Headers

**Express.js Security Middleware:**
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### API Key Management

```bash
# Generate API keys
npm run generate-api-key --name="Production API" --permissions="payment:review,payee:manage"

# Rotate API keys
npm run rotate-api-key --key-id="key_123456"

# Revoke API keys
npm run revoke-api-key --key-id="key_123456"
```

## Deployment

### Production Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Security headers configured
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented
- [ ] Load balancer configured (if applicable)
- [ ] CDN configured for static assets
- [ ] Log aggregation set up
- [ ] Error tracking configured

### Docker Production Deployment

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  app:
    image: payment-reviewer:latest
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - db
      - redis
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped
    
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=payment_reviewer
      - POSTGRES_USER=pr_user
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Kubernetes Deployment

**k8s/deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-reviewer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payment-reviewer
  template:
    metadata:
      labels:
        app: payment-reviewer
    spec:
      containers:
      - name: app
        image: payment-reviewer:latest
        ports:
        - containerPort: 8000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Monitoring Setup

### Application Monitoring

**Health Check Endpoints:**
```javascript
// /health - Basic health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// /ready - Readiness check
app.get('/ready', async (req, res) => {
  try {
    await db.ping();
    await redis.ping();
    res.json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});
```

**Prometheus Metrics:**
```javascript
const promClient = require('prom-client');

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status_code']
});

const fraudScoreHistogram = new promClient.Histogram({
  name: 'fraud_score_distribution',
  help: 'Distribution of fraud scores',
  buckets: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
});
```

### Log Management

**Structured Logging:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

## Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Reset connections
sudo systemctl restart postgresql
```

**Redis Connection Issues:**
```bash
# Check Redis status
redis-cli ping

# Check Redis memory usage
redis-cli info memory

# Clear Redis cache
redis-cli flushall
```

**Application Performance Issues:**
```bash
# Check memory usage
free -h

# Check disk space
df -h

# Check CPU usage
top

# Check application logs
tail -f logs/combined.log
```

### Debug Mode

**Enable Debug Logging:**
```bash
export DEBUG=payment-reviewer:*
export LOG_LEVEL=debug
npm start
```

**Database Query Logging:**
```javascript
// For Sequelize
const sequelize = new Sequelize(DATABASE_URL, {
  logging: console.log, // Enable SQL logging
  benchmark: true
});

// For TypeORM
{
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: ['query', 'error'],
  logger: 'advanced-console'
}
```

### Performance Tuning

**Database Optimization:**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payees_email ON payees(email);

-- Analyze table statistics
ANALYZE payments;
ANALYZE payees;
```

**Redis Optimization:**
```conf
# Increase memory limit
maxmemory 512mb

# Optimize for speed
save ""
appendonly no
```

### Support and Resources

- **Documentation:** https://docs.payment-reviewer.com
- **GitHub Issues:** https://github.com/your-org/payment-reviewer/issues
- **Community Forum:** https://community.payment-reviewer.com
- **Email Support:** support@payment-reviewer.com
- **Status Page:** https://status.payment-reviewer.com

For additional help, please consult the [FAQ](FAQ.md) or contact our support team.