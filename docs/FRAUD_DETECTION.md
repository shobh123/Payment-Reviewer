# Fraud Detection System Documentation

## Overview

The Payment Reviewer fraud detection system uses machine learning algorithms and rule-based engines to analyze payment requests in real-time. The system generates fraud scores ranging from 0.0 (lowest risk) to 1.0 (highest risk) and provides detailed explanations for each score.

## Table of Contents

1. [Fraud Scoring Algorithm](#fraud-scoring-algorithm)
2. [Risk Factors](#risk-factors)
3. [Machine Learning Models](#machine-learning-models)
4. [Rule Engine](#rule-engine)
5. [Scoring Methodology](#scoring-methodology)
6. [Configuration](#configuration)
7. [Monitoring and Tuning](#monitoring-and-tuning)
8. [Integration Examples](#integration-examples)

## Fraud Scoring Algorithm

### Overview

The fraud detection system combines multiple detection methods to provide comprehensive risk assessment:

1. **Machine Learning Models** - Pattern recognition and anomaly detection
2. **Rule-Based Engine** - Business logic and compliance rules
3. **Behavioral Analysis** - User and transaction pattern analysis
4. **Third-Party Data** - External risk databases and blacklists
5. **Real-Time Monitoring** - Velocity and frequency checks

### Scoring Flow

```
Payment Request → Feature Extraction → ML Models → Rule Engine → Score Aggregation → Final Score
                                                      ↓
                              External Data Sources ←→ Risk Factors Analysis
```

### Score Interpretation

| Score Range | Risk Level | Recommendation | Action Required |
|-------------|------------|----------------|-----------------|
| 0.0 - 0.3   | Low        | Auto-approve   | None            |
| 0.3 - 0.6   | Medium     | Review         | Manual review   |
| 0.6 - 0.8   | High       | Hold           | Senior review   |
| 0.8 - 1.0   | Critical   | Block          | Investigation   |

## Risk Factors

### Primary Risk Factors

#### 1. Payee Risk Assessment

**Payee History Score** (`payee_history`)
- **Weight:** 25%
- **Description:** Historical payment patterns and success rates
- **Calculation:**
```python
def calculate_payee_history_score(payee_id):
    recent_payments = get_payments(payee_id, days=90)
    
    # Factors
    success_rate = successful_payments / total_payments
    dispute_rate = disputed_payments / total_payments
    chargeback_rate = chargebacks / total_payments
    avg_amount_variance = std_dev(payment_amounts) / mean(payment_amounts)
    
    # Weighted score
    score = (
        (1 - success_rate) * 0.4 +
        dispute_rate * 0.3 +
        chargeback_rate * 0.2 +
        min(avg_amount_variance, 1.0) * 0.1
    )
    
    return min(score, 1.0)
```

**Payee Verification Status** (`payee_verification`)
- **Weight:** 20%
- **Levels:**
  - Unverified: 0.8
  - Partial: 0.4
  - Fully Verified: 0.0

#### 2. Transaction Pattern Analysis

**Amount Anomaly Score** (`amount_anomaly`)
- **Weight:** 15%
- **Description:** Detects unusual payment amounts
- **Implementation:**
```python
def calculate_amount_anomaly(amount, payee_id, payer_id):
    # Historical amounts for this payee
    historical_amounts = get_historical_amounts(payee_id, days=180)
    
    if len(historical_amounts) < 5:
        return 0.3  # Insufficient data penalty
    
    # Z-score calculation
    mean_amount = np.mean(historical_amounts)
    std_amount = np.std(historical_amounts)
    
    if std_amount == 0:
        return 0.0 if amount == mean_amount else 0.5
    
    z_score = abs(amount - mean_amount) / std_amount
    
    # Convert z-score to 0-1 scale
    return min(z_score / 5.0, 1.0)
```

**Velocity Check** (`velocity_check`)
- **Weight:** 15%
- **Description:** Frequency and timing of transactions
- **Rules:**
  - Multiple transactions within 1 hour: +0.3
  - Daily limit exceeded: +0.4
  - Weekend/holiday transactions: +0.1
  - After-hours transactions: +0.2

#### 3. Geographic and Device Analysis

**Geographic Risk** (`geographic_risk`)
- **Weight:** 10%
- **Factors:**
  - High-risk countries: +0.6
  - Unusual location for payee: +0.3
  - VPN/proxy detection: +0.4

**Device Fingerprinting** (`device_risk`)
- **Weight:** 10%
- **Factors:**
  - New device: +0.2
  - Suspicious user agent: +0.3
  - Multiple accounts from same device: +0.4

#### 4. External Data Sources

**Blacklist Check** (`blacklist_risk`)
- **Weight:** 5%
- **Sources:**
  - OFAC sanctions list
  - Internal blacklist
  - Third-party fraud databases
  - Credit bureau negative files

### Secondary Risk Factors

#### Business Rule Violations

**Compliance Risk** (`compliance_risk`)
- **AML threshold checks**
- **Currency restrictions**
- **Business hour violations**
- **Approval workflow bypasses**

#### Behavioral Anomalies

**User Behavior Score** (`user_behavior`)
- **Login patterns**
- **Navigation patterns**
- **Form completion time**
- **Copy-paste detection**

## Machine Learning Models

### Model Architecture

The system uses an ensemble of machine learning models:

1. **Gradient Boosting (XGBoost)**
   - Primary model for structured data
   - Features: transaction amounts, timing, payee data
   - Training data: 2+ years of historical transactions

2. **Neural Network (Deep Learning)**
   - Secondary model for complex pattern detection
   - Features: sequence data, embeddings
   - Architecture: 3-layer feedforward network

3. **Isolation Forest**
   - Anomaly detection for outlier transactions
   - Unsupervised learning approach
   - Real-time adaptation

### Feature Engineering

```python
def extract_features(payment_request):
    features = {}
    
    # Basic transaction features
    features['amount'] = payment_request.amount
    features['currency'] = encode_currency(payment_request.currency)
    features['hour_of_day'] = payment_request.timestamp.hour
    features['day_of_week'] = payment_request.timestamp.weekday()
    
    # Payee features
    payee = get_payee(payment_request.payee_id)
    features['payee_age_days'] = (datetime.now() - payee.created_at).days
    features['payee_total_payments'] = get_payee_payment_count(payee.id)
    features['payee_avg_amount'] = get_payee_avg_amount(payee.id)
    
    # Velocity features
    features['payments_last_hour'] = count_payments(hours=1)
    features['payments_last_day'] = count_payments(hours=24)
    features['unique_payees_last_day'] = count_unique_payees(hours=24)
    
    # Ratio features
    features['amount_to_avg_ratio'] = (
        features['amount'] / max(features['payee_avg_amount'], 1)
    )
    
    return features
```

### Model Training Pipeline

```python
class FraudDetectionPipeline:
    def __init__(self):
        self.preprocessor = FeaturePreprocessor()
        self.models = {
            'xgboost': XGBClassifier(),
            'neural_net': MLPClassifier(),
            'isolation_forest': IsolationForest()
        }
        self.ensemble_weights = [0.5, 0.3, 0.2]
    
    def train(self, training_data):
        X = self.preprocessor.fit_transform(training_data)
        y = training_data['is_fraud']
        
        for name, model in self.models.items():
            model.fit(X, y)
            
        # Calibrate ensemble weights
        self.calibrate_ensemble(X, y)
    
    def predict_fraud_score(self, payment_features):
        X = self.preprocessor.transform([payment_features])
        
        scores = []
        for model in self.models.values():
            if hasattr(model, 'predict_proba'):
                score = model.predict_proba(X)[0][1]
            else:
                # For anomaly detection
                score = max(0, -model.decision_function(X)[0])
            scores.append(score)
        
        # Weighted ensemble
        final_score = sum(
            score * weight 
            for score, weight in zip(scores, self.ensemble_weights)
        )
        
        return min(final_score, 1.0)
```

## Rule Engine

### Rule Categories

#### 1. Hard Rules (Auto-block)

```yaml
hard_rules:
  - name: "OFAC_SANCTIONED_ENTITY"
    condition: "payee.name IN ofac_sanctions_list"
    action: "BLOCK"
    score: 1.0
    
  - name: "EXCEEDED_DAILY_LIMIT"
    condition: "daily_amount > account.daily_limit"
    action: "BLOCK"
    score: 0.9
    
  - name: "BLACKLISTED_ACCOUNT"
    condition: "payee.account_number IN blacklist"
    action: "BLOCK"
    score: 1.0
```

#### 2. Soft Rules (Score adjustment)

```yaml
soft_rules:
  - name: "HIGH_AMOUNT_THRESHOLD"
    condition: "amount > 10000"
    score_adjustment: 0.2
    
  - name: "WEEKEND_TRANSACTION"
    condition: "is_weekend(timestamp)"
    score_adjustment: 0.1
    
  - name: "NEW_PAYEE"
    condition: "payee.created_at > (now() - 30 days)"
    score_adjustment: 0.15
```

### Rule Execution Engine

```python
class RuleEngine:
    def __init__(self, rules_config):
        self.hard_rules = rules_config['hard_rules']
        self.soft_rules = rules_config['soft_rules']
    
    def evaluate(self, payment_request, context):
        result = {
            'action': 'ALLOW',
            'score_adjustment': 0.0,
            'triggered_rules': []
        }
        
        # Evaluate hard rules first
        for rule in self.hard_rules:
            if self.evaluate_condition(rule['condition'], payment_request, context):
                result['action'] = rule['action']
                result['score_adjustment'] = rule['score']
                result['triggered_rules'].append(rule['name'])
                return result  # Hard rules are terminal
        
        # Evaluate soft rules
        for rule in self.soft_rules:
            if self.evaluate_condition(rule['condition'], payment_request, context):
                result['score_adjustment'] += rule['score_adjustment']
                result['triggered_rules'].append(rule['name'])
        
        return result
    
    def evaluate_condition(self, condition, payment, context):
        # Simple rule evaluation (in practice, use a more robust parser)
        variables = {
            'amount': payment.amount,
            'payee': payment.payee,
            'timestamp': payment.timestamp,
            'daily_amount': context.get('daily_amount', 0),
            **context
        }
        
        return eval(condition, {'__builtins__': {}}, variables)
```

## Scoring Methodology

### Score Aggregation

The final fraud score is calculated using a weighted combination approach:

```python
def calculate_final_score(ml_score, rule_adjustment, risk_factors):
    # Base ML model score
    base_score = ml_score
    
    # Apply rule adjustments
    adjusted_score = min(base_score + rule_adjustment, 1.0)
    
    # Apply risk factor multipliers
    risk_multiplier = 1.0
    for factor_name, factor_score in risk_factors.items():
        weight = RISK_FACTOR_WEIGHTS.get(factor_name, 0.1)
        risk_multiplier += factor_score * weight
    
    final_score = min(adjusted_score * risk_multiplier, 1.0)
    
    return {
        'fraud_score': final_score,
        'base_ml_score': base_score,
        'rule_adjustment': rule_adjustment,
        'risk_multiplier': risk_multiplier,
        'risk_factors': risk_factors
    }
```

### Confidence Intervals

Each fraud score includes a confidence interval:

```python
def calculate_confidence_interval(score, model_uncertainty, data_quality):
    # Base confidence from model ensemble variance
    base_confidence = 1.0 - model_uncertainty
    
    # Adjust for data quality
    data_quality_factor = min(data_quality, 1.0)
    adjusted_confidence = base_confidence * data_quality_factor
    
    # Calculate interval
    margin = (1.0 - adjusted_confidence) * 0.5
    
    return {
        'lower_bound': max(score - margin, 0.0),
        'upper_bound': min(score + margin, 1.0),
        'confidence': adjusted_confidence
    }
```

## Configuration

### Model Configuration

```yaml
fraud_detection:
  models:
    xgboost:
      enabled: true
      weight: 0.5
      params:
        max_depth: 6
        learning_rate: 0.1
        n_estimators: 100
    
    neural_network:
      enabled: true
      weight: 0.3
      params:
        hidden_layers: [100, 50, 25]
        activation: 'relu'
        learning_rate: 0.001
    
    isolation_forest:
      enabled: true
      weight: 0.2
      params:
        contamination: 0.1
        random_state: 42

  thresholds:
    auto_approve: 0.3
    manual_review: 0.6
    auto_block: 0.8
    
  features:
    enabled_features:
      - amount_anomaly
      - payee_history
      - velocity_check
      - geographic_risk
      - device_risk
    
    feature_weights:
      payee_history: 0.25
      amount_anomaly: 0.15
      velocity_check: 0.15
      payee_verification: 0.20
      geographic_risk: 0.10
      device_risk: 0.10
      blacklist_risk: 0.05
```

### Real-time Processing Configuration

```yaml
real_time_processing:
  timeout_ms: 500
  fallback_score: 0.5
  cache_duration: 300
  
  async_enrichment:
    enabled: true
    timeout_ms: 2000
    
  batch_processing:
    enabled: true
    batch_size: 100
    frequency: "0 */5 * * * *"  # Every 5 minutes
```

## Monitoring and Tuning

### Performance Metrics

#### Model Performance
- **Precision:** True positives / (True positives + False positives)
- **Recall:** True positives / (True positives + False negatives)
- **F1 Score:** 2 * (Precision * Recall) / (Precision + Recall)
- **AUC-ROC:** Area under the receiver operating characteristic curve

#### Business Metrics
- **False Positive Rate:** Legitimate transactions flagged as fraud
- **False Negative Rate:** Fraudulent transactions not detected
- **Review Rate:** Percentage of transactions requiring manual review
- **Processing Latency:** Time to generate fraud score

### Monitoring Dashboard

```python
class FraudDetectionMonitor:
    def __init__(self):
        self.metrics_client = MetricsClient()
        
    def track_prediction(self, payment_id, score, actual_outcome=None):
        self.metrics_client.increment('fraud_detection.predictions')
        self.metrics_client.histogram('fraud_detection.score', score)
        
        if actual_outcome is not None:
            self.track_accuracy(score, actual_outcome)
    
    def track_accuracy(self, predicted_score, actual_outcome):
        threshold = 0.6
        predicted_fraud = predicted_score > threshold
        
        if actual_outcome == 'fraud' and predicted_fraud:
            self.metrics_client.increment('fraud_detection.true_positive')
        elif actual_outcome == 'fraud' and not predicted_fraud:
            self.metrics_client.increment('fraud_detection.false_negative')
        elif actual_outcome == 'legitimate' and predicted_fraud:
            self.metrics_client.increment('fraud_detection.false_positive')
        else:
            self.metrics_client.increment('fraud_detection.true_negative')
    
    def calculate_daily_metrics(self):
        # Calculate and report daily performance metrics
        metrics = self.metrics_client.get_daily_metrics()
        
        precision = metrics['true_positive'] / (
            metrics['true_positive'] + metrics['false_positive']
        )
        recall = metrics['true_positive'] / (
            metrics['true_positive'] + metrics['false_negative']
        )
        f1_score = 2 * (precision * recall) / (precision + recall)
        
        self.metrics_client.gauge('fraud_detection.precision', precision)
        self.metrics_client.gauge('fraud_detection.recall', recall)
        self.metrics_client.gauge('fraud_detection.f1_score', f1_score)
```

### Model Retraining

```python
class ModelRetrainingPipeline:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.model_store = ModelStore()
        
    def schedule_retraining(self):
        # Daily model updates
        self.scheduler.add_job(
            self.retrain_models,
            'cron',
            hour=2,  # 2 AM daily
            minute=0
        )
        
        # Weekly full retrain
        self.scheduler.add_job(
            self.full_retrain,
            'cron',
            day_of_week=0,  # Sunday
            hour=1,
            minute=0
        )
    
    def retrain_models(self):
        # Get latest training data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=90)
        
        training_data = get_labeled_transactions(start_date, end_date)
        
        if len(training_data) < 1000:
            logger.warning("Insufficient training data for retraining")
            return
        
        # Retrain models
        pipeline = FraudDetectionPipeline()
        pipeline.train(training_data)
        
        # Validate performance
        validation_score = self.validate_model(pipeline)
        
        if validation_score > 0.85:  # Minimum F1 score threshold
            self.model_store.save_model(pipeline, version=datetime.now())
            self.deploy_model(pipeline)
        else:
            logger.error(f"Model validation failed: {validation_score}")
```

### A/B Testing Framework

```python
class ABTestingFramework:
    def __init__(self):
        self.experiment_config = ExperimentConfig()
        
    def assign_experiment_group(self, payment_id):
        # Consistent assignment based on payment ID hash
        hash_value = int(hashlib.md5(payment_id.encode()).hexdigest(), 16)
        return 'control' if hash_value % 100 < 50 else 'treatment'
    
    def get_model_version(self, group):
        if group == 'control':
            return self.experiment_config.control_model_version
        else:
            return self.experiment_config.treatment_model_version
    
    def track_experiment_result(self, payment_id, group, score, outcome):
        self.metrics_client.increment(
            f'fraud_detection.experiment.{group}.predictions'
        )
        
        if outcome:
            self.metrics_client.increment(
                f'fraud_detection.experiment.{group}.{outcome}'
            )
```

## Integration Examples

### Basic Integration

```python
from payment_reviewer import FraudDetector

detector = FraudDetector(api_key='your_api_key')

# Analyze a payment
result = detector.analyze_payment({
    'payment_id': 'pay_123456',
    'amount': 1500.00,
    'currency': 'USD',
    'payee_id': 'payee_789',
    'payer_id': 'payer_456',
    'timestamp': '2024-01-15T10:30:00Z'
})

print(f"Fraud Score: {result.fraud_score}")
print(f"Risk Level: {result.risk_level}")
print(f"Recommendation: {result.recommendation}")

# Print risk factors
for factor in result.risk_factors:
    print(f"- {factor.name}: {factor.score} ({factor.description})")
```

### Advanced Integration with Custom Rules

```python
# Custom rule configuration
custom_rules = {
    'hard_rules': [
        {
            'name': 'COMPANY_SPENDING_LIMIT',
            'condition': 'amount > company.monthly_limit',
            'action': 'BLOCK',
            'score': 1.0
        }
    ],
    'soft_rules': [
        {
            'name': 'VENDOR_RISK_PREMIUM',
            'condition': 'payee.industry == "crypto"',
            'score_adjustment': 0.3
        }
    ]
}

detector = FraudDetector(
    api_key='your_api_key',
    custom_rules=custom_rules
)

# Analyze with additional context
context = {
    'company': {
        'monthly_limit': 50000.00,
        'current_month_spend': 45000.00
    },
    'user_session': {
        'ip_address': '192.168.1.1',
        'user_agent': 'Mozilla/5.0...',
        'session_id': 'sess_abc123'
    }
}

result = detector.analyze_payment(payment_data, context=context)
```

### Webhook Integration

```python
from flask import Flask, request
import hmac
import hashlib

app = Flask(__name__)

@app.route('/webhooks/fraud-detection', methods=['POST'])
def fraud_detection_webhook():
    # Verify webhook signature
    signature = request.headers.get('X-Fraud-Signature')
    payload = request.get_data()
    
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, f'sha256={expected_signature}'):
        return 'Invalid signature', 400
    
    # Process webhook
    data = request.get_json()
    
    if data['event'] == 'fraud_score_updated':
        payment_id = data['payment_id']
        new_score = data['fraud_score']
        
        # Update internal records
        update_payment_risk_score(payment_id, new_score)
        
        # Trigger additional actions if needed
        if new_score > 0.8:
            alert_security_team(payment_id, new_score)
    
    return 'OK', 200
```

### Batch Processing

```python
# Process multiple payments efficiently
payments = [
    {'payment_id': 'pay_001', 'amount': 100.00, ...},
    {'payment_id': 'pay_002', 'amount': 250.00, ...},
    # ... more payments
]

results = detector.analyze_payments_batch(payments)

# Process results
for result in results:
    if result.fraud_score > 0.6:
        flag_for_review(result.payment_id)
    elif result.fraud_score < 0.3:
        auto_approve(result.payment_id)
```

### Performance Optimization

```python
# Use async processing for high-throughput scenarios
import asyncio

async def process_payment_async(payment_data):
    return await detector.analyze_payment_async(payment_data)

async def process_multiple_payments(payments):
    tasks = [process_payment_async(payment) for payment in payments]
    results = await asyncio.gather(*tasks)
    return results

# Cache frequent lookups
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_payee_risk_score(payee_id):
    return detector.get_payee_risk_score(payee_id)
```