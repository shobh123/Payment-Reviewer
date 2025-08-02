const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  // Rating identification
  ratingId: {
    type: String,
    unique: true,
    required: true
  },
  
  // Parties involved
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Associated transaction
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  
  // Rating details
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Detailed rating criteria
  criteria: {
    speed: {
      type: Number,
      min: 1,
      max: 5
    },
    reliability: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    trustworthiness: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Feedback
  feedback: {
    type: String,
    maxlength: 1000
  },
  
  // Rating context
  context: {
    type: String,
    enum: ['payment_sent', 'payment_received', 'request_fulfilled', 'split_payment'],
    required: true
  },
  
  // Tags for categorization
  tags: [String],
  
  // Verification status
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  
  // Moderation
  flagged: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  flaggedAt: Date,
  
  // Response from rated user
  response: {
    text: String,
    respondedAt: Date
  },
  
  // Helpfulness votes
  helpfulVotes: {
    type: Number,
    default: 0
  },
  unhelpfulVotes: {
    type: Number,
    default: 0
  },
  
  // Visibility settings
  isPublic: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  metadata: {
    deviceInfo: {
      platform: String,
      userAgent: String
    },
    location: {
      country: String,
      city: String
    }
  }
}, {
  timestamps: true
});

// Indexes
RatingSchema.index({ ratingId: 1 });
RatingSchema.index({ rater: 1, createdAt: -1 });
RatingSchema.index({ rated: 1, createdAt: -1 });
RatingSchema.index({ transaction: 1 }, { unique: true });
RatingSchema.index({ rating: -1 });
RatingSchema.index({ verified: 1 });
RatingSchema.index({ flagged: 1 });

// Compound indexes
RatingSchema.index({ rated: 1, rating: -1 });
RatingSchema.index({ rater: 1, rated: 1 });

// Generate unique rating ID
RatingSchema.pre('save', function(next) {
  if (!this.ratingId) {
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.ratingId = `RAT${timestamp}${randomStr}`;
  }
  next();
});

// Instance methods
RatingSchema.methods.addHelpfulVote = function(isHelpful) {
  if (isHelpful) {
    this.helpfulVotes += 1;
  } else {
    this.unhelpfulVotes += 1;
  }
  return this.save();
};

RatingSchema.methods.addResponse = function(responseText) {
  this.response = {
    text: responseText,
    respondedAt: new Date()
  };
  return this.save();
};

RatingSchema.methods.flag = function(reason, flaggedBy) {
  this.flagged = true;
  this.flagReason = reason;
  this.flaggedBy = flaggedBy;
  this.flaggedAt = new Date();
  return this.save();
};

// Static methods
RatingSchema.statics.getUserRatings = function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    minRating,
    maxRating,
    verified
  } = options;
  
  const query = { rated: userId };
  
  if (minRating !== undefined || maxRating !== undefined) {
    query.rating = {};
    if (minRating !== undefined) query.rating.$gte = minRating;
    if (maxRating !== undefined) query.rating.$lte = maxRating;
  }
  
  if (verified !== undefined) query.verified = verified;
  
  return this.find(query)
    .populate('rater', 'firstName lastName avatar')
    .populate('transaction', 'amount type mode createdAt')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

RatingSchema.statics.getRatingStats = function(userId) {
  return this.aggregate([
    {
      $match: { rated: new mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: null,
        totalRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingsDistribution: {
          $push: '$rating'
        },
        averageSpeed: { $avg: '$criteria.speed' },
        averageReliability: { $avg: '$criteria.reliability' },
        averageCommunication: { $avg: '$criteria.communication' },
        averageTrustworthiness: { $avg: '$criteria.trustworthiness' }
      }
    },
    {
      $addFields: {
        ratingBreakdown: {
          $reduce: {
            input: '$ratingsDistribution',
            initialValue: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
            in: {
              $mergeObjects: [
                '$$value',
                {
                  $arrayToObject: [
                    [{ k: { $toString: '$$this' }, v: { $add: [{ $ifNull: [{ $arrayElemAt: [{ $objectToArray: '$$value' }, { $indexOfArray: [['1', '2', '3', '4', '5'], { $toString: '$$this' }] }] }, { v: 0 }] }, 1] } }]
                  ]
                }
              ]
            }
          }
        }
      }
    }
  ]);
};

RatingSchema.statics.getTopRatedUsers = function(limit = 10) {
  return this.aggregate([
    {
      $group: {
        _id: '$rated',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    },
    {
      $match: {
        totalRatings: { $gte: 5 } // Minimum 5 ratings to be considered
      }
    },
    {
      $sort: {
        averageRating: -1,
        totalRatings: -1
      }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        userId: '$_id',
        averageRating: 1,
        totalRatings: 1,
        firstName: '$userInfo.firstName',
        lastName: '$userInfo.lastName',
        avatar: '$userInfo.avatar',
        trustScore: '$userInfo.trustScore'
      }
    }
  ]);
};

RatingSchema.statics.getRecentRatings = function(limit = 20) {
  return this.find({ isPublic: true, flagged: false })
    .populate('rater', 'firstName lastName avatar')
    .populate('rated', 'firstName lastName avatar')
    .populate('transaction', 'amount type mode')
    .sort({ createdAt: -1 })
    .limit(limit);
};

RatingSchema.statics.getFlaggedRatings = function() {
  return this.find({ flagged: true })
    .populate('rater rated flaggedBy', 'firstName lastName email')
    .populate('transaction')
    .sort({ flaggedAt: -1 });
};

module.exports = mongoose.model('Rating', RatingSchema);