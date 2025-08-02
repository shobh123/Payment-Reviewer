# Payment Reviewer Components Documentation

## Overview

This document provides comprehensive documentation for all UI components in the Payment Reviewer application. These components are designed to provide an intuitive interface for reviewing payments, managing payees, and monitoring fraud detection.

## Table of Contents

1. [Core Components](#core-components)
2. [Payment Components](#payment-components)  
3. [Payee Components](#payee-components)
4. [Fraud Detection Components](#fraud-detection-components)
5. [Form Components](#form-components)
6. [Layout Components](#layout-components)
7. [Utility Components](#utility-components)
8. [Styling and Theming](#styling-and-theming)

## Core Components

### PaymentReviewDashboard

Main dashboard component for payment review operations.

**Props:**
```typescript
interface PaymentReviewDashboardProps {
  user: User;
  onPaymentReview: (paymentId: string) => void;
  onBulkAction: (action: string, paymentIds: string[]) => void;
  filters?: PaymentFilters;
  className?: string;
}
```

**Usage:**
```jsx
import { PaymentReviewDashboard } from '@/components/PaymentReviewDashboard';

function App() {
  const handlePaymentReview = (paymentId) => {
    // Handle payment review logic
  };

  return (
    <PaymentReviewDashboard
      user={currentUser}
      onPaymentReview={handlePaymentReview}
      onBulkAction={handleBulkActions}
      filters={{ status: 'pending', riskLevel: 'high' }}
    />
  );
}
```

**Features:**
- Real-time payment queue updates
- Filtering and sorting capabilities
- Bulk operations support
- Risk-based prioritization
- Export functionality

### PaymentReviewCard

Individual payment review card component.

**Props:**
```typescript
interface PaymentReviewCardProps {
  payment: Payment;
  onApprove: (paymentId: string) => void;
  onReject: (paymentId: string, reason: string) => void;
  onRequestMoreInfo: (paymentId: string) => void;
  showDetails?: boolean;
  compact?: boolean;
}
```

**Usage:**
```jsx
<PaymentReviewCard
  payment={paymentData}
  onApprove={handleApprove}
  onReject={handleReject}
  onRequestMoreInfo={handleInfoRequest}
  showDetails={true}
/>
```

**Features:**
- Fraud score visualization
- Quick action buttons
- Payee information display
- Risk factor indicators
- Transaction history

## Payment Components

### PaymentList

Displays a list of payments with filtering and pagination.

**Props:**
```typescript
interface PaymentListProps {
  payments: Payment[];
  loading?: boolean;
  pagination?: PaginationConfig;
  filters?: PaymentFilters;
  onFilterChange?: (filters: PaymentFilters) => void;
  onPaymentSelect?: (payment: Payment) => void;
  selectable?: boolean;
  sortable?: boolean;
}
```

**Usage:**
```jsx
<PaymentList
  payments={paymentsData}
  loading={isLoading}
  pagination={{ page: 1, size: 20, total: 100 }}
  filters={currentFilters}
  onFilterChange={updateFilters}
  onPaymentSelect={selectPayment}
  selectable={true}
  sortable={true}
/>
```

### PaymentDetails

Detailed view of a specific payment.

**Props:**
```typescript
interface PaymentDetailsProps {
  payment: Payment;
  fraudAnalysis?: FraudAnalysis;
  payeeInfo?: PayeeInfo;
  onUpdate?: (payment: Partial<Payment>) => void;
  onClose?: () => void;
  editable?: boolean;
}
```

**Usage:**
```jsx
<PaymentDetails
  payment={selectedPayment}
  fraudAnalysis={fraudData}
  payeeInfo={payeeData}
  onUpdate={updatePayment}
  onClose={closeDetails}
  editable={userCanEdit}
/>
```

### PaymentForm

Form component for creating or editing payments.

**Props:**
```typescript
interface PaymentFormProps {
  initialValues?: Partial<Payment>;
  onSubmit: (payment: Payment) => void;
  onCancel?: () => void;
  mode: 'create' | 'edit';
  validation?: ValidationConfig;
  payeeOptions?: PayeeOption[];
}
```

**Usage:**
```jsx
<PaymentForm
  initialValues={existingPayment}
  onSubmit={submitPayment}
  onCancel={cancelForm}
  mode="edit"
  validation={validationRules}
  payeeOptions={availablePayees}
/>
```

## Payee Components

### PayeeCard

Compact payee information display.

**Props:**
```typescript
interface PayeeCardProps {
  payee: Payee;
  onClick?: (payee: Payee) => void;
  showRiskScore?: boolean;
  showActions?: boolean;
  onEdit?: (payee: Payee) => void;
  onDelete?: (payeeId: string) => void;
}
```

**Usage:**
```jsx
<PayeeCard
  payee={payeeData}
  onClick={selectPayee}
  showRiskScore={true}
  showActions={userCanManagePayees}
  onEdit={editPayee}
  onDelete={deletePayee}
/>
```

### PayeeProfile

Detailed payee profile with verification status.

**Props:**
```typescript
interface PayeeProfileProps {
  payee: Payee;
  verificationDetails?: VerificationDetails;
  transactionHistory?: Transaction[];
  onVerify?: (payeeId: string) => void;
  onUpdate?: (payee: Partial<Payee>) => void;
  editable?: boolean;
}
```

**Usage:**
```jsx
<PayeeProfile
  payee={selectedPayee}
  verificationDetails={verificationData}
  transactionHistory={transactions}
  onVerify={initiateVerification}
  onUpdate={updatePayee}
  editable={true}
/>
```

### PayeeForm

Form for creating or editing payee information.

**Props:**
```typescript
interface PayeeFormProps {
  initialValues?: Partial<Payee>;
  onSubmit: (payee: Payee) => void;
  onCancel?: () => void;
  mode: 'create' | 'edit';
  showBankingInfo?: boolean;
  showBusinessInfo?: boolean;
}
```

**Usage:**
```jsx
<PayeeForm
  initialValues={existingPayee}
  onSubmit={savePayee}
  onCancel={cancelForm}
  mode="create"
  showBankingInfo={true}
  showBusinessInfo={true}
/>
```

## Fraud Detection Components

### FraudScoreIndicator

Visual indicator for fraud risk score.

**Props:**
```typescript
interface FraudScoreIndicatorProps {
  score: number; // 0-1 range
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  showLabel?: boolean;
  variant?: 'circular' | 'linear' | 'gauge';
}
```

**Usage:**
```jsx
<FraudScoreIndicator
  score={0.23}
  size="large"
  showValue={true}
  showLabel={true}
  variant="gauge"
/>
```

### RiskFactorsPanel

Panel displaying contributing risk factors.

**Props:**
```typescript
interface RiskFactorsPanelProps {
  factors: RiskFactor[];
  totalScore: number;
  onFactorClick?: (factor: RiskFactor) => void;
  expandable?: boolean;
  maxFactors?: number;
}
```

**Usage:**
```jsx
<RiskFactorsPanel
  factors={riskFactors}
  totalScore={fraudScore}
  onFactorClick={showFactorDetails}
  expandable={true}
  maxFactors={5}
/>
```

### FraudAlert

Alert component for high-risk transactions.

**Props:**
```typescript
interface FraudAlertProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actions?: AlertAction[];
  dismissible?: boolean;
  onDismiss?: () => void;
  timestamp?: Date;
}
```

**Usage:**
```jsx
<FraudAlert
  severity="high"
  message="Unusual transaction pattern detected"
  actions={[
    { label: 'Review', onClick: reviewTransaction },
    { label: 'Flag', onClick: flagTransaction }
  ]}
  dismissible={true}
  onDismiss={dismissAlert}
  timestamp={new Date()}
/>
```

## Form Components

### Input

Enhanced input component with validation.

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  validation?: ValidationRule[];
  formatAs?: 'currency' | 'phone' | 'ssn' | 'account';
}
```

**Usage:**
```jsx
<Input
  label="Payment Amount"
  name="amount"
  type="number"
  formatAs="currency"
  required={true}
  validation={[{ rule: 'min', value: 0.01 }]}
  error={formErrors.amount}
  helpText="Enter the payment amount in USD"
/>
```

### Select

Enhanced select component with search functionality.

**Props:**
```typescript
interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  error?: string;
  required?: boolean;
}
```

**Usage:**
```jsx
<Select
  label="Payment Status"
  options={statusOptions}
  value={selectedStatus}
  onChange={setSelectedStatus}
  placeholder="Select status..."
  searchable={true}
  required={true}
/>
```

### DatePicker

Date picker component with range selection.

**Props:**
```typescript
interface DatePickerProps {
  label?: string;
  value?: Date | [Date, Date];
  onChange: (date: Date | [Date, Date]) => void;
  range?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  error?: string;
}
```

**Usage:**
```jsx
<DatePicker
  label="Transaction Date Range"
  value={dateRange}
  onChange={setDateRange}
  range={true}
  placeholder="Select date range..."
/>
```

## Layout Components

### Header

Application header with navigation and user menu.

**Props:**
```typescript
interface HeaderProps {
  user: User;
  notifications?: Notification[];
  onLogout: () => void;
  onNavigate: (path: string) => void;
  showNotifications?: boolean;
}
```

**Usage:**
```jsx
<Header
  user={currentUser}
  notifications={userNotifications}
  onLogout={handleLogout}
  onNavigate={navigate}
  showNotifications={true}
/>
```

### Sidebar

Navigation sidebar with menu items.

**Props:**
```typescript
interface SidebarProps {
  currentPath: string;
  menuItems: MenuItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate: (path: string) => void;
}
```

**Usage:**
```jsx
<Sidebar
  currentPath={location.pathname}
  menuItems={navigationItems}
  collapsed={sidebarCollapsed}
  onToggle={toggleSidebar}
  onNavigate={navigate}
/>
```

### Modal

Reusable modal component.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  children: React.ReactNode;
  showCloseButton?: boolean;
  closable?: boolean;
}
```

**Usage:**
```jsx
<Modal
  isOpen={showModal}
  onClose={closeModal}
  title="Payment Details"
  size="large"
  showCloseButton={true}
>
  <PaymentDetails payment={selectedPayment} />
</Modal>
```

## Utility Components

### LoadingSpinner

Loading indicator component.

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  overlay?: boolean;
  message?: string;
}
```

**Usage:**
```jsx
<LoadingSpinner
  size="medium"
  overlay={true}
  message="Processing payment..."
/>
```

### EmptyState

Empty state component for lists and tables.

**Props:**
```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage:**
```jsx
<EmptyState
  title="No payments found"
  description="There are no payments matching your current filters."
  icon={<PaymentIcon />}
  action={{
    label: "Clear filters",
    onClick: clearFilters
  }}
/>
```

### Toast

Toast notification component.

**Props:**
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage:**
```jsx
<Toast
  type="success"
  message="Payment approved successfully"
  duration={5000}
  onClose={dismissToast}
/>
```

## Styling and Theming

### Theme Configuration

```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    risk: {
      low: string;
      medium: string;
      high: string;
      critical: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
```

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-info: #0891b2;
  
  /* Risk Colors */
  --color-risk-low: #16a34a;
  --color-risk-medium: #d97706;
  --color-risk-high: #dc2626;
  --color-risk-critical: #991b1b;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### Component Examples

#### Complete Payment Review Example

```jsx
import React, { useState, useEffect } from 'react';
import {
  PaymentReviewDashboard,
  PaymentDetails,
  Modal,
  Toast
} from '@/components';

function PaymentReviewApp() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [toast, setToast] = useState(null);

  const handlePaymentReview = async (paymentId) => {
    try {
      const payment = await fetchPaymentDetails(paymentId);
      setSelectedPayment(payment);
      setShowDetails(true);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to load payment details'
      });
    }
  };

  const handleApprove = async (paymentId) => {
    try {
      await approvePayment(paymentId);
      setToast({
        type: 'success',
        message: 'Payment approved successfully'
      });
      setShowDetails(false);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to approve payment'
      });
    }
  };

  return (
    <div className="payment-review-app">
      <PaymentReviewDashboard
        user={currentUser}
        onPaymentReview={handlePaymentReview}
        onBulkAction={handleBulkActions}
      />
      
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Payment Review"
        size="large"
      >
        {selectedPayment && (
          <PaymentDetails
            payment={selectedPayment}
            onUpdate={updatePayment}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </Modal>
      
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
```

### Testing Components

#### Unit Test Example

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentReviewCard } from '@/components/PaymentReviewCard';

describe('PaymentReviewCard', () => {
  const mockPayment = {
    id: 'pay_123',
    amount: 1000.00,
    currency: 'USD',
    payee: { name: 'John Doe' },
    fraudScore: 0.23,
    riskLevel: 'low'
  };

  it('renders payment information correctly', () => {
    render(
      <PaymentReviewCard
        payment={mockPayment}
        onApprove={jest.fn()}
        onReject={jest.fn()}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('Low Risk')).toBeInTheDocument();
  });

  it('calls onApprove when approve button is clicked', () => {
    const mockOnApprove = jest.fn();
    
    render(
      <PaymentReviewCard
        payment={mockPayment}
        onApprove={mockOnApprove}
        onReject={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Approve'));
    expect(mockOnApprove).toHaveBeenCalledWith('pay_123');
  });
});
```

### Accessibility Guidelines

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **Screen Reader Support:** Proper ARIA labels and descriptions
- **Color Contrast:** Minimum 4.5:1 contrast ratio for text
- **Focus Management:** Clear focus indicators and logical tab order
- **Alternative Text:** Images and icons have descriptive alt text

### Performance Considerations

- **Lazy Loading:** Large lists use virtual scrolling
- **Memoization:** Components use React.memo() where appropriate
- **Code Splitting:** Components are dynamically imported
- **Bundle Size:** Tree-shaking eliminates unused code
- **Caching:** API responses are cached appropriately

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Contributing

When creating new components:

1. Follow the established naming conventions
2. Include comprehensive TypeScript types
3. Add JSDoc comments for complex props
4. Write unit tests with good coverage
5. Update this documentation
6. Follow accessibility guidelines
7. Consider performance implications