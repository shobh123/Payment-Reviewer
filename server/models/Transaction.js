const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // Transaction identification
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  
  // Parties involved
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Transaction details
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
  },
  
  // Transaction type and mode
  type: {
    type: String,
    required: true,
    enum: ['send', 'receive', 'request', 'split']
  },
  mode: {
    type: String,
    required: true,
    enum: ['instant', 'scheduled', 'recurring', 'escrow']
  },
  
  // Status tracking
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'disputed', 'refunded'],
    default: 'pending'
  },
  
  // Payment method
  paymentMethod: {
    type: String,
    enum: ['wallet', 'bank_transfer', 'card', 'upi', 'crypto'],
    default: 'wallet'
  },
  
  // Description and metadata
  description: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['personal', 'business', 'bills', 'food', 'entertainment', 'shopping', 'travel', 'other'],
    default: 'personal'
  },
  tags: [String],
  
  // Scheduling (for scheduled and recurring transactions)
  scheduledFor: {
    type: Date
  },
  recurringConfig: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date,
    maxOccurrences: Number,
    currentOccurrence: {
      type: Number,
      default: 1
    }
  },
  
  // Fees and charges
  fees: {
    processingFee: {
      type: Number,
      default: 0
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    totalFees: {
      type: Number,
      default: 0
    }
  },
  
  // Security and verification
  verificationCode: String,
  requiresApproval: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  
  // Location data
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    country: String
  },
  
  // Device and session info
  deviceInfo: {
    deviceId: String,
    platform: String,
    ipAddress: String,
    userAgent: String
  },
  
  // Risk assessment
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  riskFactors: [String],
  
  // External references
  externalTransactionId: String,
  bankReference: String,
  
  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  completedAt: Date,
  
  // Dispute and support
  disputeReason: String,
  disputedAt: Date,
  resolvedAt: Date,
  supportTicketId: String,
  
  // Rating and feedback
  senderRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  },
  receiverRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  },
  
  // Notification status
  notifications: {
    senderNotified: {
      type: Boolean,
      default: false
    },
    receiverNotified: {
      type: Boolean,
      default: false
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    smsSent: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
TransactionSchema.index({ transactionId: 1 });
TransactionSchema.index({ sender: 1, createdAt: -1 });
TransactionSchema.index({ receiver: 1, createdAt: -1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ mode: 1 });
TransactionSchema.index({ scheduledFor: 1 });
TransactionSchema.index({ amount: -1 });
TransactionSchema.index({ createdAt: -1 });

// Compound indexes
TransactionSchema.index({ sender: 1, receiver: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, status: 1 });

// Generate unique transaction ID
TransactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substr(2, 8).toUpperCase();
    this.transactionId = `TXN${timestamp}${randomStr}`;
  }
  
  // Calculate total fees
  this.fees.totalFees = (this.fees.processingFee || 0) + (this.fees.serviceFee || 0);
  
  next();
});

// Instance methods
TransactionSchema.methods.updateStatus = function(newStatus, additionalData = {}) {
  this.status = newStatus;
  
  if (newStatus === 'processing') {
    this.processedAt = new Date();
  } else if (newStatus === 'completed') {
    this.completedAt = new Date();
  }
  
  Object.assign(this, additionalData);
  return this.save();
};

TransactionSchema.methods.addRating = function(userId, rating, feedback) {
  if (this.sender.toString() === userId.toString()) {
    this.senderRating = {
      rating,
      feedback,
      ratedAt: new Date()
    };
  } else if (this.receiver.toString() === userId.toString()) {
    this.receiverRating = {
      rating,
      feedback,
      ratedAt: new Date()
    };
  }
  return this.save();
};

TransactionSchema.methods.calculateRiskScore = function() {
  let score = 0;
  const factors = [];
  
  // Amount-based risk
  if (this.amount > 10000) {
    score += 30;
    factors.push('high_amount');
  } else if (this.amount > 5000) {
    score += 15;
    factors.push('medium_amount');
  }
  
  // Mode-based risk
  if (this.mode === 'instant') {
    score += 10;
    factors.push('instant_transfer');
  }
  
  // Cross-border transaction
  if (this.location && this.location.country) {
    score += 5;
    factors.push('international');
  }
  
  this.riskScore = Math.min(score, 100);
  this.riskFactors = factors;
  
  return this.save();
};

// Static methods
TransactionSchema.statics.getUserTransactions = function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    type,
    startDate,
    endDate
  } = options;
  
  const query = {
    $or: [
      { sender: userId },
      { receiver: userId }
    ]
  };
  
  if (status) query.status = status;
  if (type) query.type = type;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  return this.find(query)
    .populate('sender', 'firstName lastName email phone avatar')
    .populate('receiver', 'firstName lastName email phone avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

TransactionSchema.statics.getTransactionStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(userId) },
          { receiver: new mongoose.Types.ObjectId(userId) }
        ],
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalSent: {
          $sum: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
              '$amount',
              0
            ]
          }
        },
        totalReceived: {
          $sum: {
            $cond: [
              { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
              '$amount',
              0
            ]
          }
        },
        avgTransactionAmount: { $avg: '$amount' }
      }
    }
  ]);
};

TransactionSchema.statics.getPendingScheduled = function() {
  return this.find({
    mode: { $in: ['scheduled', 'recurring'] },
    status: 'pending',
    scheduledFor: { $lte: new Date() }
  }).populate('sender receiver');
};

module.exports = mongoose.model('Transaction', TransactionSchema);