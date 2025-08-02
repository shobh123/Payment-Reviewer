const express = require('express');
const { body, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a rating for a transaction
router.post('/', auth, [
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().isLength({ max: 1000 }).withMessage('Feedback too long'),
  body('criteria.speed').optional().isInt({ min: 1, max: 5 }),
  body('criteria.reliability').optional().isInt({ min: 1, max: 5 }),
  body('criteria.communication').optional().isInt({ min: 1, max: 5 }),
  body('criteria.trustworthiness').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      transactionId,
      rating,
      feedback,
      criteria,
      tags,
      context
    } = req.body;

    // Find the transaction
    const transaction = await Transaction.findOne({
      transactionId,
      $or: [
        { sender: req.userId },
        { receiver: req.userId }
      ],
      status: 'completed'
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or not completed'
      });
    }

    // Check if rating already exists for this transaction
    const existingRating = await Rating.findOne({ transaction: transaction._id });
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'Rating already exists for this transaction'
      });
    }

    // Determine who is being rated
    const rater = req.userId;
    const rated = transaction.sender.toString() === req.userId.toString() 
      ? transaction.receiver 
      : transaction.sender;

    // Determine context if not provided
    let ratingContext = context;
    if (!ratingContext) {
      ratingContext = transaction.sender.toString() === req.userId.toString() 
        ? 'payment_sent' 
        : 'payment_received';
    }

    // Create rating
    const newRating = new Rating({
      rater,
      rated,
      transaction: transaction._id,
      rating,
      criteria: criteria || {},
      feedback,
      context: ratingContext,
      tags: tags || [],
      metadata: {
        deviceInfo: {
          platform: req.get('User-Agent')
        }
      }
    });

    await newRating.save();

    // Update user's rating statistics
    const ratedUser = await User.findById(rated);
    await ratedUser.updateRating(rating);

    // Update trust score based on rating
    const trustFactor = rating >= 4 ? 0.1 : rating <= 2 ? -0.2 : 0;
    await ratedUser.updateTrustScore(trustFactor);

    // Add rating to transaction
    await transaction.addRating(req.userId, rating, feedback);

    // Populate the rating for response
    await newRating.populate([
      { path: 'rater', select: 'firstName lastName avatar' },
      { path: 'rated', select: 'firstName lastName avatar paymentRating trustScore' },
      { path: 'transaction', select: 'transactionId amount type mode createdAt' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating
    });

  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating rating'
    });
  }
});

// Get ratings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 20,
      minRating,
      maxRating,
      verified
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      minRating: minRating ? parseInt(minRating) : undefined,
      maxRating: maxRating ? parseInt(maxRating) : undefined,
      verified: verified === 'true' ? true : verified === 'false' ? false : undefined
    };

    const ratings = await Rating.getUserRatings(userId, options);

    // Get rating statistics
    const stats = await Rating.getRatingStats(userId);

    res.json({
      success: true,
      ratings,
      stats: stats[0] || {
        totalRatings: 0,
        averageRating: 0,
        ratingBreakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user ratings'
    });
  }
});

// Get my ratings (ratings I've given)
router.get('/given', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20
    } = req.query;

    const ratings = await Rating.find({ rater: req.userId })
      .populate('rated', 'firstName lastName avatar')
      .populate('transaction', 'transactionId amount type mode createdAt')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalCount = await Rating.countDocuments({ rater: req.userId });

    res.json({
      success: true,
      ratings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get given ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching given ratings'
    });
  }
});

// Get my received ratings
router.get('/received', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20
    } = req.query;

    const ratings = await Rating.find({ rated: req.userId })
      .populate('rater', 'firstName lastName avatar')
      .populate('transaction', 'transactionId amount type mode createdAt')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalCount = await Rating.countDocuments({ rated: req.userId });

    res.json({
      success: true,
      ratings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get received ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching received ratings'
    });
  }
});

// Get top rated users
router.get('/top-users', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const topUsers = await Rating.getTopRatedUsers(parseInt(limit));

    res.json({
      success: true,
      topUsers
    });

  } catch (error) {
    console.error('Get top users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching top rated users'
    });
  }
});

// Get recent public ratings
router.get('/recent', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const recentRatings = await Rating.getRecentRatings(parseInt(limit));

    res.json({
      success: true,
      ratings: recentRatings
    });

  } catch (error) {
    console.error('Get recent ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recent ratings'
    });
  }
});

// Add helpful vote to a rating
router.patch('/:ratingId/vote', auth, [
  body('helpful').isBoolean().withMessage('Helpful must be a boolean value')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { ratingId } = req.params;
    const { helpful } = req.body;

    const rating = await Rating.findOne({ 
      ratingId,
      isPublic: true,
      flagged: false
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found or not accessible'
      });
    }

    // Prevent users from voting on their own ratings
    if (rating.rater.toString() === req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot vote on your own rating'
      });
    }

    await rating.addHelpfulVote(helpful);

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      rating: {
        ratingId: rating.ratingId,
        helpfulVotes: rating.helpfulVotes,
        unhelpfulVotes: rating.unhelpfulVotes
      }
    });

  } catch (error) {
    console.error('Vote on rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error recording vote'
    });
  }
});

// Respond to a rating
router.patch('/:ratingId/respond', auth, [
  body('response').isLength({ min: 1, max: 500 }).withMessage('Response must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { ratingId } = req.params;
    const { response } = req.body;

    const rating = await Rating.findOne({ 
      ratingId,
      rated: req.userId
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found or you are not authorized to respond'
      });
    }

    if (rating.response && rating.response.text) {
      return res.status(400).json({
        success: false,
        message: 'You have already responded to this rating'
      });
    }

    await rating.addResponse(response);

    res.json({
      success: true,
      message: 'Response added successfully',
      rating
    });

  } catch (error) {
    console.error('Respond to rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding response'
    });
  }
});

// Flag a rating
router.patch('/:ratingId/flag', auth, [
  body('reason').isIn(['spam', 'inappropriate', 'fake', 'harassment', 'other'])
    .withMessage('Invalid flag reason')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { ratingId } = req.params;
    const { reason } = req.body;

    const rating = await Rating.findOne({ ratingId });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Prevent users from flagging their own ratings
    if (rating.rater.toString() === req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot flag your own rating'
      });
    }

    if (rating.flagged) {
      return res.status(400).json({
        success: false,
        message: 'Rating is already flagged'
      });
    }

    await rating.flag(reason, req.userId);

    res.json({
      success: true,
      message: 'Rating flagged successfully'
    });

  } catch (error) {
    console.error('Flag rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error flagging rating'
    });
  }
});

// Get rating analytics for a user
router.get('/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get basic stats
    const stats = await Rating.getRatingStats(userId);
    const basicStats = stats[0] || {
      totalRatings: 0,
      averageRating: 0,
      ratingBreakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    };

    // Get ratings over time (last 12 months)
    const ratingsOverTime = await Rating.aggregate([
      {
        $match: { 
          rated: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get category breakdown
    const categoryBreakdown = await Rating.aggregate([
      {
        $match: { rated: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: 'transactions',
          localField: 'transaction',
          foreignField: '_id',
          as: 'transactionInfo'
        }
      },
      {
        $unwind: '$transactionInfo'
      },
      {
        $group: {
          _id: '$transactionInfo.category',
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        ...basicStats,
        ratingsOverTime,
        categoryBreakdown
      }
    });

  } catch (error) {
    console.error('Get rating analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching rating analytics'
    });
  }
});

module.exports = router;