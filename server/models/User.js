const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Basic user information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Contact information
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile information
  avatar: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Payment related
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  accountNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Trust and rating system
  trustScore: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 10
  },
  paymentRating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  ratingSum: {
    type: Number,
    default: 0
  },
  
  // Transaction statistics
  totalSent: {
    type: Number,
    default: 0
  },
  totalReceived: {
    type: Number,
    default: 0
  },
  transactionCount: {
    type: Number,
    default: 0
  },
  successfulTransactions: {
    type: Number,
    default: 0
  },
  
  // Truecaller integration
  truecallerVerified: {
    type: Boolean,
    default: false
  },
  truecallerData: {
    name: String,
    countryCode: String,
    phoneNumber: String,
    carrier: String,
    verified: Boolean,
    score: Number
  },
  
  // Security settings
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Preferences
  preferences: {
    currency: {
      type: String,
      default: 'USD'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showProfile: {
        type: Boolean,
        default: true
      },
      showTransactionHistory: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ accountNumber: 1 });
UserSchema.index({ trustScore: -1 });
UserSchema.index({ paymentRating: -1 });

// Virtual for account locked status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate unique account number
UserSchema.pre('save', function(next) {
  if (!this.accountNumber) {
    this.accountNumber = 'PAY' + Date.now().toString() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Instance methods
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updateRating = function(newRating) {
  this.ratingSum += newRating;
  this.totalRatings += 1;
  this.paymentRating = (this.ratingSum / this.totalRatings).toFixed(1);
  return this.save();
};

UserSchema.methods.updateTrustScore = function(factor) {
  // Trust score calculation based on various factors
  const baseScore = this.trustScore;
  const newScore = Math.max(0, Math.min(10, baseScore + factor));
  this.trustScore = newScore;
  return this.save();
};

UserSchema.methods.incrementFailedLogin = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1, loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // Lock for 2 hours
    };
  }
  
  return this.updateOne(updates);
};

UserSchema.methods.resetFailedLogin = function() {
  return this.updateOne({
    $unset: { lockUntil: 1, loginAttempts: 1 },
    $set: { lastLogin: Date.now() }
  });
};

// Static methods
UserSchema.statics.findByEmailOrPhone = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier },
      { phone: identifier }
    ]
  });
};

UserSchema.statics.getTopRatedUsers = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ paymentRating: -1, totalRatings: -1 })
    .limit(limit)
    .select('firstName lastName paymentRating totalRatings trustScore avatar');
};

module.exports = mongoose.model('User', UserSchema);