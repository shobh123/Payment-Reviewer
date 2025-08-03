const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user transactions with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      mode,
      startDate,
      endDate,
      search
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      type,
      startDate,
      endDate
    };

    let transactions = await Transaction.getUserTransactions(req.userId, options);

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      transactions = transactions.filter(txn => 
        txn.description?.match(searchRegex) ||
        txn.transactionId.match(searchRegex) ||
        `${txn.sender.firstName} ${txn.sender.lastName}`.match(searchRegex) ||
        `${txn.receiver.firstName} ${txn.receiver.lastName}`.match(searchRegex)
      );
    }

    // Calculate total count for pagination
    const totalCount = await Transaction.countDocuments({
      $or: [
        { sender: req.userId },
        { receiver: req.userId }
      ]
    });

    res.json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transactions'
    });
  }
});

// Get single transaction details
router.get('/:transactionId', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      transactionId: req.params.transactionId,
      $or: [
        { sender: req.userId },
        { receiver: req.userId }
      ]
    })
    .populate('sender', 'firstName lastName email phone avatar paymentRating trustScore')
    .populate('receiver', 'firstName lastName email phone avatar paymentRating trustScore');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      transaction
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transaction'
    });
  }
});

// Send money (instant transfer)
router.post('/send', auth, [
  body('receiverIdentifier').notEmpty().withMessage('Receiver email or phone is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01'),
  body('description').optional().isLength({ max: 500 }),
  body('category').optional().isIn(['personal', 'business', 'bills', 'food', 'entertainment', 'shopping', 'travel', 'other']),
  body('paymentMethod').optional().isIn(['wallet', 'bank_transfer', 'card', 'upi', 'crypto'])
], async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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
      receiverIdentifier,
      amount,
      description,
      category = 'personal',
      paymentMethod = 'wallet',
      tags
    } = req.body;

    // Find sender
    const sender = await User.findById(req.userId).session(session);
    if (!sender) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Sender not found'
      });
    }

    // Find receiver
    const receiver = await User.findByEmailOrPhone(receiverIdentifier).session(session);
    if (!receiver) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Check if sender has sufficient balance
    if (sender.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Create transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount: parseFloat(amount),
      type: 'send',
      mode: 'instant',
      description,
      category,
      paymentMethod,
      tags: tags || [],
      deviceInfo: {
        platform: req.get('User-Agent'),
        ipAddress: req.ip
      }
    });

    // Calculate risk score
    await transaction.calculateRiskScore();

    // Update balances
    sender.balance -= parseFloat(amount);
    receiver.balance += parseFloat(amount);

    // Update transaction stats
    sender.totalSent += parseFloat(amount);
    sender.transactionCount += 1;
    sender.successfulTransactions += 1;

    receiver.totalReceived += parseFloat(amount);
    receiver.transactionCount += 1;
    receiver.successfulTransactions += 1;

    // Save all changes
    await transaction.save({ session });
    await sender.save({ session });
    await receiver.save({ session });

    // Mark transaction as completed
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    await transaction.save({ session });

    await session.commitTransaction();

    // Populate transaction for response
    await transaction.populate([
      { path: 'sender', select: 'firstName lastName email phone avatar' },
      { path: 'receiver', select: 'firstName lastName email phone avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Payment sent successfully',
      transaction
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Send money error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing payment'
    });
  } finally {
    session.endSession();
  }
});

// Request money
router.post('/request', auth, [
  body('payerIdentifier').notEmpty().withMessage('Payer email or phone is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01'),
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

    const {
      payerIdentifier,
      amount,
      description,
      category = 'personal'
    } = req.body;

    // Find requester (receiver)
    const requester = await User.findById(req.userId);
    if (!requester) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find payer (sender)
    const payer = await User.findByEmailOrPhone(payerIdentifier);
    if (!payer) {
      return res.status(404).json({
        success: false,
        message: 'Payer not found'
      });
    }

    // Create transaction request
    const transaction = new Transaction({
      sender: payer._id,
      receiver: requester._id,
      amount: parseFloat(amount),
      type: 'request',
      mode: 'instant',
      status: 'pending',
      description,
      category,
      requiresApproval: true
    });

    await transaction.save();

    await transaction.populate([
      { path: 'sender', select: 'firstName lastName email phone avatar' },
      { path: 'receiver', select: 'firstName lastName email phone avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Payment request sent successfully',
      transaction
    });

  } catch (error) {
    console.error('Request money error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating payment request'
    });
  }
});

// Schedule a future payment
router.post('/schedule', auth, [
  body('receiverIdentifier').notEmpty().withMessage('Receiver email or phone is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01'),
  body('scheduledFor').isISO8601().withMessage('Valid scheduled date is required'),
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

    const {
      receiverIdentifier,
      amount,
      scheduledFor,
      description,
      category = 'personal'
    } = req.body;

    const scheduledDate = new Date(scheduledFor);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled date must be in the future'
      });
    }

    // Find sender and receiver
    const sender = await User.findById(req.userId);
    const receiver = await User.findByEmailOrPhone(receiverIdentifier);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'Sender or receiver not found'
      });
    }

    // Create scheduled transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount: parseFloat(amount),
      type: 'send',
      mode: 'scheduled',
      status: 'pending',
      scheduledFor: scheduledDate,
      description,
      category
    });

    await transaction.save();

    await transaction.populate([
      { path: 'sender', select: 'firstName lastName email phone avatar' },
      { path: 'receiver', select: 'firstName lastName email phone avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Payment scheduled successfully',
      transaction
    });

  } catch (error) {
    console.error('Schedule payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error scheduling payment'
    });
  }
});

// Set up recurring payment
router.post('/recurring', auth, [
  body('receiverIdentifier').notEmpty().withMessage('Receiver email or phone is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01'),
  body('frequency').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Valid frequency is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601(),
  body('maxOccurrences').optional().isInt({ min: 1 })
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
      receiverIdentifier,
      amount,
      frequency,
      interval = 1,
      startDate,
      endDate,
      maxOccurrences,
      description,
      category = 'personal'
    } = req.body;

    // Find sender and receiver
    const sender = await User.findById(req.userId);
    const receiver = await User.findByEmailOrPhone(receiverIdentifier);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'Sender or receiver not found'
      });
    }

    // Create recurring transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount: parseFloat(amount),
      type: 'send',
      mode: 'recurring',
      status: 'pending',
      scheduledFor: new Date(startDate),
      description,
      category,
      recurringConfig: {
        frequency,
        interval,
        endDate: endDate ? new Date(endDate) : null,
        maxOccurrences,
        currentOccurrence: 1
      }
    });

    await transaction.save();

    await transaction.populate([
      { path: 'sender', select: 'firstName lastName email phone avatar' },
      { path: 'receiver', select: 'firstName lastName email phone avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Recurring payment set up successfully',
      transaction
    });

  } catch (error) {
    console.error('Recurring payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error setting up recurring payment'
    });
  }
});

// Approve/Reject payment request
router.patch('/:transactionId/approve', auth, [
  body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject')
], async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { action } = req.body;
    const { transactionId } = req.params;

    // Find transaction
    const transaction = await Transaction.findOne({
      transactionId,
      sender: req.userId,
      status: 'pending',
      requiresApproval: true
    }).session(session);

    if (!transaction) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or not pending approval'
      });
    }

    if (action === 'reject') {
      transaction.status = 'cancelled';
      await transaction.save({ session });
      await session.commitTransaction();

      return res.json({
        success: true,
        message: 'Payment request rejected',
        transaction
      });
    }

    // Approve payment - process the transaction
    const sender = await User.findById(req.userId).session(session);
    const receiver = await User.findById(transaction.receiver).session(session);

    if (sender.balance < transaction.amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Update balances
    sender.balance -= transaction.amount;
    receiver.balance += transaction.amount;

    // Update stats
    sender.totalSent += transaction.amount;
    sender.transactionCount += 1;
    sender.successfulTransactions += 1;

    receiver.totalReceived += transaction.amount;
    receiver.transactionCount += 1;
    receiver.successfulTransactions += 1;

    // Update transaction
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    transaction.approvedBy = req.userId;
    transaction.approvedAt = new Date();

    // Save all changes
    await transaction.save({ session });
    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();

    await transaction.populate([
      { path: 'sender', select: 'firstName lastName email phone avatar' },
      { path: 'receiver', select: 'firstName lastName email phone avatar' }
    ]);

    res.json({
      success: true,
      message: 'Payment approved and processed successfully',
      transaction
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Approve payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing payment approval'
    });
  } finally {
    session.endSession();
  }
});

// Cancel transaction (if pending)
router.patch('/:transactionId/cancel', auth, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({
      transactionId,
      $or: [
        { sender: req.userId },
        { receiver: req.userId }
      ],
      status: 'pending'
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or cannot be cancelled'
      });
    }

    transaction.status = 'cancelled';
    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction cancelled successfully',
      transaction
    });

  } catch (error) {
    console.error('Cancel transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling transaction'
    });
  }
});

// Get transaction statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Transaction.getTransactionStats(req.userId);
    
    res.json({
      success: true,
      stats: stats[0] || {
        totalTransactions: 0,
        totalSent: 0,
        totalReceived: 0,
        avgTransactionAmount: 0
      }
    });

  } catch (error) {
    console.error('Transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transaction statistics'
    });
  }
});

module.exports = router;