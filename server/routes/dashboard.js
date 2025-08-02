const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Rating = require('../models/Rating');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard overview
router.get('/overview', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Get user basic info
    const user = await User.findById(userId).select('-password');
    
    // Get transaction statistics
    const transactionStats = await Transaction.getTransactionStats(userId);
    const stats = transactionStats[0] || {
      totalTransactions: 0,
      totalSent: 0,
      totalReceived: 0,
      avgTransactionAmount: 0
    };

    // Get recent transactions
    const recentTransactions = await Transaction.getUserTransactions(userId, { limit: 5 });

    // Get pending transactions
    const pendingTransactions = await Transaction.find({
      $or: [
        { sender: userId, status: 'pending' },
        { receiver: userId, status: 'pending' }
      ]
    }).populate('sender receiver', 'firstName lastName avatar').limit(10);

    // Get rating summary
    const ratingStats = await Rating.getRatingStats(userId);
    const ratingOverview = ratingStats[0] || {
      totalRatings: 0,
      averageRating: 0,
      ratingBreakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    };

    // Get monthly transaction trend
    const monthlyTrend = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ],
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          sentAmount: {
            $sum: {
              $cond: [
                { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                '$amount',
                0
              ]
            }
          },
          receivedAmount: {
            $sum: {
              $cond: [
                { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
                '$amount',
                0
              ]
            }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Calculate account health score
    const accountHealth = calculateAccountHealth(user, stats, ratingOverview);

    res.json({
      success: true,
      dashboard: {
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          balance: user.balance,
          accountNumber: user.accountNumber,
          trustScore: user.trustScore,
          paymentRating: user.paymentRating,
          verificationStatus: {
            email: user.isVerified,
            phone: user.phoneVerified,
            truecaller: user.truecallerVerified
          }
        },
        stats: {
          ...stats,
          accountHealth
        },
        transactions: {
          recent: recentTransactions,
          pending: pendingTransactions,
          monthlyTrend
        },
        ratings: ratingOverview
      }
    });

  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// Get transaction analytics
router.get('/analytics/transactions', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { period = '12months' } = req.query;

    let dateFilter = {};
    switch (period) {
      case '7days':
        dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30days':
        dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '3months':
        dateFilter = { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
        break;
      case '12months':
      default:
        dateFilter = { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };
        break;
    }

    // Transaction volume by category
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ],
          status: 'completed',
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    // Transaction modes breakdown
    const modeBreakdown = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ],
          status: 'completed',
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: '$mode',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Daily transaction pattern
    const dailyPattern = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ],
          status: 'completed',
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Top contacts by transaction volume
    const topContacts = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ],
          status: 'completed',
          createdAt: dateFilter
        }
      },
      {
        $addFields: {
          contact: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
              '$receiver',
              '$sender'
            ]
          }
        }
      },
      {
        $group: {
          _id: '$contact',
          transactionCount: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { totalAmount: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contactInfo'
        }
      },
      {
        $unwind: '$contactInfo'
      },
      {
        $project: {
          name: { $concat: ['$contactInfo.firstName', ' ', '$contactInfo.lastName'] },
          avatar: '$contactInfo.avatar',
          transactionCount: 1,
          totalAmount: 1
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        period,
        categoryBreakdown,
        modeBreakdown,
        dailyPattern,
        topContacts
      }
    });

  } catch (error) {
    console.error('Transaction analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transaction analytics'
    });
  }
});

// Get rating analytics
router.get('/analytics/ratings', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Get detailed rating statistics
    const ratingStats = await Rating.getRatingStats(userId);
    const stats = ratingStats[0] || {
      totalRatings: 0,
      averageRating: 0,
      ratingBreakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    };

    // Rating trends over time
    const ratingTrends = await Rating.aggregate([
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
          ratingCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Rating by transaction category
    const categoryRatings = await Rating.aggregate([
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
          ratingCount: { $sum: 1 }
        }
      },
      {
        $sort: { averageRating: -1 }
      }
    ]);

    // Recent feedback
    const recentFeedback = await Rating.find({ rated: userId, feedback: { $ne: null } })
      .populate('rater', 'firstName lastName avatar')
      .populate('transaction', 'amount category createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      analytics: {
        ...stats,
        ratingTrends,
        categoryRatings,
        recentFeedback
      }
    });

  } catch (error) {
    console.error('Rating analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching rating analytics'
    });
  }
});

// Get financial insights
router.get('/insights/financial', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    // Spending patterns
    const spendingPattern = await Transaction.aggregate([
      {
        $match: {
          sender: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          avgTransaction: { $avg: '$amount' },
          transactionCount: { $sum: 1 },
          categories: {
            $push: {
              category: '$category',
              amount: '$amount'
            }
          }
        }
      }
    ]);

    // Monthly cash flow
    const cashFlow = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ],
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          inflow: {
            $sum: {
              $cond: [
                { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
                '$amount',
                0
              ]
            }
          },
          outflow: {
            $sum: {
              $cond: [
                { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                '$amount',
                0
              ]
            }
          }
        }
      },
      {
        $addFields: {
          netFlow: { $subtract: ['$inflow', '$outflow'] }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Budget suggestions based on spending patterns
    const budgetSuggestions = generateBudgetSuggestions(spendingPattern[0]);

    // Financial health score
    const financialHealth = calculateFinancialHealth(user, spendingPattern[0], cashFlow);

    res.json({
      success: true,
      insights: {
        currentBalance: user.balance,
        spendingPattern: spendingPattern[0] || {},
        cashFlow,
        budgetSuggestions,
        financialHealth
      }
    });

  } catch (error) {
    console.error('Financial insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching financial insights'
    });
  }
});

// Get security overview
router.get('/security', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    // Recent login activity (simulated)
    const recentActivity = [
      {
        type: 'login',
        timestamp: user.lastLogin,
        device: 'Mobile App',
        location: 'New York, US',
        success: true
      }
    ];

    // Security score based on various factors
    const securityScore = calculateSecurityScore(user);

    // Security recommendations
    const recommendations = generateSecurityRecommendations(user);

    res.json({
      success: true,
      security: {
        score: securityScore,
        recommendations,
        verificationStatus: {
          email: user.isVerified,
          phone: user.phoneVerified,
          truecaller: user.truecallerVerified,
          twoFactor: user.twoFactorEnabled
        },
        recentActivity,
        accountStatus: user.isActive ? 'active' : 'inactive',
        trustScore: user.trustScore
      }
    });

  } catch (error) {
    console.error('Security overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching security overview'
    });
  }
});

// Helper functions
function calculateAccountHealth(user, transactionStats, ratingStats) {
  let score = 50; // Base score

  // Transaction history boost
  if (transactionStats.totalTransactions > 50) score += 20;
  else if (transactionStats.totalTransactions > 10) score += 10;

  // Rating boost
  if (ratingStats.averageRating >= 4.5) score += 15;
  else if (ratingStats.averageRating >= 4.0) score += 10;
  else if (ratingStats.averageRating >= 3.5) score += 5;

  // Verification boost
  if (user.isVerified) score += 5;
  if (user.phoneVerified) score += 5;
  if (user.truecallerVerified) score += 5;

  // Trust score influence
  score += (user.trustScore - 5) * 2;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function generateBudgetSuggestions(spendingData) {
  if (!spendingData || !spendingData.categories) {
    return [];
  }

  const suggestions = [];
  const avgMonthlySpend = spendingData.totalSpent / 3; // Last 3 months

  suggestions.push({
    category: 'Monthly Budget',
    amount: Math.round(avgMonthlySpend * 1.1),
    reason: 'Based on your average spending with 10% buffer'
  });

  return suggestions;
}

function calculateFinancialHealth(user, spendingData, cashFlow) {
  let score = 50;

  // Balance to spending ratio
  if (spendingData && spendingData.totalSpent > 0) {
    const balanceRatio = user.balance / (spendingData.totalSpent / 3);
    if (balanceRatio > 2) score += 20;
    else if (balanceRatio > 1) score += 10;
    else if (balanceRatio < 0.5) score -= 20;
  }

  // Cash flow stability
  if (cashFlow && cashFlow.length > 0) {
    const positiveMonths = cashFlow.filter(month => month.netFlow > 0).length;
    const stability = positiveMonths / cashFlow.length;
    score += stability * 20;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateSecurityScore(user) {
  let score = 30; // Base score

  if (user.isVerified) score += 20;
  if (user.phoneVerified) score += 15;
  if (user.truecallerVerified) score += 15;
  if (user.twoFactorEnabled) score += 20;

  return Math.max(0, Math.min(100, score));
}

function generateSecurityRecommendations(user) {
  const recommendations = [];

  if (!user.twoFactorEnabled) {
    recommendations.push({
      type: 'critical',
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your account'
    });
  }

  if (!user.isVerified) {
    recommendations.push({
      type: 'high',
      title: 'Verify Your Email',
      description: 'Verify your email address to secure your account'
    });
  }

  if (!user.truecallerVerified) {
    recommendations.push({
      type: 'medium',
      title: 'Verify with Truecaller',
      description: 'Enhance your profile trustworthiness'
    });
  }

  return recommendations;
}

module.exports = router;