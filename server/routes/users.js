const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Rating = require('../models/Rating');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Search users by name, email, or phone
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    
    const users = await User.find({
      $and: [
        {
          $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { email: searchRegex },
            { phone: searchRegex }
          ]
        },
        { isActive: true }
      ]
    })
    .select('firstName lastName email phone avatar paymentRating trustScore truecallerVerified')
    .limit(parseInt(limit));

    // Filter out sensitive information for non-authenticated users
    const filteredUsers = users.map(user => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      paymentRating: user.paymentRating,
      trustScore: user.trustScore,
      verified: user.truecallerVerified,
      // Only show contact info to authenticated users
      email: req.userId ? user.email : undefined,
      phone: req.userId ? user.phone : undefined
    }));

    res.json({
      success: true,
      users: filteredUsers,
      total: filteredUsers.length
    });

  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user search'
    });
  }
});

// Get user profile by ID
router.get('/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('firstName lastName email phone avatar paymentRating trustScore truecallerVerified isVerified phoneVerified createdAt totalSent totalReceived transactionCount preferences');

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's rating statistics
    const ratingStats = await Rating.getRatingStats(userId);
    const ratings = ratingStats[0] || {
      totalRatings: 0,
      averageRating: 0,
      ratingBreakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    };

    // Get recent ratings if profile is public or user is authenticated
    let recentRatings = [];
    if (user.preferences?.privacy?.showProfile !== false || req.userId) {
      recentRatings = await Rating.find({ 
        rated: userId, 
        isPublic: true, 
        flagged: false 
      })
      .populate('rater', 'firstName lastName avatar')
      .populate('transaction', 'amount category createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    }

    // Build response based on privacy settings and authentication
    const isOwnProfile = req.userId && req.userId.toString() === userId;
    const canViewDetails = isOwnProfile || user.preferences?.privacy?.showProfile !== false;

    const profileData = {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      paymentRating: user.paymentRating,
      trustScore: user.trustScore,
      verified: {
        email: user.isVerified,
        phone: user.phoneVerified,
        truecaller: user.truecallerVerified
      },
      memberSince: user.createdAt,
      ratings: {
        ...ratings,
        recent: recentRatings
      }
    };

    // Add contact information for authenticated users or if profile is public
    if (canViewDetails) {
      profileData.email = user.email;
      profileData.phone = user.phone;
      profileData.stats = {
        totalTransactions: user.transactionCount,
        totalSent: user.totalSent,
        totalReceived: user.totalReceived
      };
    }

    // Add sensitive information only for own profile
    if (isOwnProfile) {
      profileData.preferences = user.preferences;
    }

    res.json({
      success: true,
      user: profileData
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile'
    });
  }
});

// Get user's transaction history (public view)
router.get('/:userId/transactions', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if user exists and profile is viewable
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check privacy settings
    const isOwnProfile = req.userId && req.userId.toString() === userId;
    const canViewTransactions = isOwnProfile || user.preferences?.privacy?.showTransactionHistory === true;

    if (!canViewTransactions) {
      return res.status(403).json({
        success: false,
        message: 'Transaction history is private'
      });
    }

    const transactions = await Transaction.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ],
      status: 'completed'
    })
    .populate('sender receiver', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

    // Filter sensitive information for public view
    const filteredTransactions = transactions.map(tx => ({
      id: tx._id,
      transactionId: tx.transactionId,
      amount: tx.amount,
      type: tx.type,
      mode: tx.mode,
      category: tx.category,
      description: tx.description,
      createdAt: tx.createdAt,
      // Only show counterparty info if it's public or own profile
      sender: isOwnProfile ? tx.sender : { 
        name: `${tx.sender.firstName} ${tx.sender.lastName}`,
        avatar: tx.sender.avatar
      },
      receiver: isOwnProfile ? tx.receiver : {
        name: `${tx.receiver.firstName} ${tx.receiver.lastName}`,
        avatar: tx.receiver.avatar
      }
    }));

    const totalCount = await Transaction.countDocuments({
      $or: [
        { sender: userId },
        { receiver: userId }
      ],
      status: 'completed'
    });

    res.json({
      success: true,
      transactions: filteredTransactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transactions'
    });
  }
});

// Update user privacy settings
router.put('/privacy', auth, [
  body('showProfile').optional().isBoolean(),
  body('showTransactionHistory').optional().isBoolean(),
  body('emailNotifications').optional().isBoolean(),
  body('smsNotifications').optional().isBoolean(),
  body('pushNotifications').optional().isBoolean()
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
      showProfile,
      showTransactionHistory,
      emailNotifications,
      smsNotifications,
      pushNotifications
    } = req.body;

    const updateFields = {};

    if (showProfile !== undefined) {
      updateFields['preferences.privacy.showProfile'] = showProfile;
    }

    if (showTransactionHistory !== undefined) {
      updateFields['preferences.privacy.showTransactionHistory'] = showTransactionHistory;
    }

    if (emailNotifications !== undefined) {
      updateFields['preferences.notifications.email'] = emailNotifications;
    }

    if (smsNotifications !== undefined) {
      updateFields['preferences.notifications.sms'] = smsNotifications;
    }

    if (pushNotifications !== undefined) {
      updateFields['preferences.notifications.push'] = pushNotifications;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('preferences');

    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating privacy settings'
    });
  }
});

// Get top rated users (leaderboard)
router.get('/leaderboard/top-rated', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const topUsers = await Rating.getTopRatedUsers(parseInt(limit));

    res.json({
      success: true,
      users: topUsers
    });

  } catch (error) {
    console.error('Get top rated users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching top rated users'
    });
  }
});

// Get users with highest trust scores
router.get('/leaderboard/most-trusted', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const trustedUsers = await User.find({ 
      isActive: true,
      transactionCount: { $gte: 5 } // Minimum transactions to be considered
    })
    .select('firstName lastName avatar trustScore paymentRating totalRatings transactionCount')
    .sort({ trustScore: -1, paymentRating: -1 })
    .limit(parseInt(limit));

    const formattedUsers = trustedUsers.map(user => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      trustScore: user.trustScore,
      paymentRating: user.paymentRating,
      totalRatings: user.totalRatings,
      transactionCount: user.transactionCount
    }));

    res.json({
      success: true,
      users: formattedUsers
    });

  } catch (error) {
    console.error('Get most trusted users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching most trusted users'
    });
  }
});

// Block/Unblock user
router.post('/:userId/block', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { block = true } = req.body;

    if (userId === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot block yourself'
      });
    }

    // In a real implementation, you would maintain a blocked users list
    // For now, we'll just acknowledge the action

    res.json({
      success: true,
      message: block ? 'User blocked successfully' : 'User unblocked successfully',
      action: block ? 'blocked' : 'unblocked',
      userId
    });

  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error blocking user'
    });
  }
});

// Report user
router.post('/:userId/report', auth, [
  body('reason').isIn(['spam', 'fraud', 'harassment', 'inappropriate', 'other'])
    .withMessage('Valid reason is required'),
  body('description').optional().isLength({ max: 500 })
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

    const { userId } = req.params;
    const { reason, description } = req.body;

    if (userId === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot report yourself'
      });
    }

    // Check if reported user exists
    const reportedUser = await User.findById(userId);
    if (!reportedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // In a real implementation, you would:
    // 1. Store the report in a reports collection
    // 2. Potentially flag the user for review
    // 3. Send notification to moderation team

    // For demo, just log and potentially reduce trust score
    console.log(`User ${req.userId} reported ${userId} for ${reason}: ${description}`);

    // Reduce trust score for serious reports
    if (['fraud', 'spam'].includes(reason)) {
      await reportedUser.updateTrustScore(-0.5);
    }

    const reportId = `RPT${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    res.json({
      success: true,
      message: 'Report submitted successfully',
      reportId
    });

  } catch (error) {
    console.error('Report user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting report'
    });
  }
});

// Get user verification status
router.get('/:userId/verification', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('isVerified phoneVerified truecallerVerified truecallerData');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      verification: {
        email: user.isVerified,
        phone: user.phoneVerified,
        truecaller: user.truecallerVerified,
        truecallerScore: user.truecallerData?.score || null,
        carrier: user.truecallerData?.carrier || null
      }
    });

  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching verification status'
    });
  }
});

// Add to favorites/contacts
router.post('/:userId/favorite', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add yourself to favorites'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // In a real implementation, you would maintain a favorites/contacts list
    // For now, we'll just acknowledge the action

    res.json({
      success: true,
      message: 'User added to favorites',
      userId
    });

  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding user to favorites'
    });
  }
});

module.exports = router;