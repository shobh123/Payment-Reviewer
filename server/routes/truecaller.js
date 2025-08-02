const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Truecaller API configuration (demo implementation)
const TRUECALLER_API_BASE = process.env.TRUECALLER_API_BASE || 'https://api.truecaller.com/v1';
const TRUECALLER_API_KEY = process.env.TRUECALLER_API_KEY || 'demo-api-key';

// Mock Truecaller responses for demo purposes
const mockTruecallerData = {
  '+1234567890': {
    name: 'John Doe',
    countryCode: 'US',
    phoneNumber: '+1234567890',
    carrier: 'Verizon',
    verified: true,
    score: 9.2,
    spamScore: 0.1
  },
  '+9876543210': {
    name: 'Sarah Johnson',
    countryCode: 'US',
    phoneNumber: '+9876543210',
    carrier: 'AT&T',
    verified: true,
    score: 8.7,
    spamScore: 0.0
  },
  '+1122334455': {
    name: 'Mike Wilson',
    countryCode: 'US',
    phoneNumber: '+1122334455',
    carrier: 'T-Mobile',
    verified: false,
    score: 6.5,
    spamScore: 2.3
  }
};

// Verify phone number with Truecaller
router.post('/verify-phone', auth, [
  body('phoneNumber').isMobilePhone().withMessage('Valid phone number is required')
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

    const { phoneNumber } = req.body;

    // In a real implementation, you would call Truecaller API here
    // For demo purposes, we'll use mock data or simulate API call
    let truecallerData;
    
    if (process.env.NODE_ENV === 'development' || !TRUECALLER_API_KEY || TRUECALLER_API_KEY === 'demo-api-key') {
      // Use mock data for development
      truecallerData = mockTruecallerData[phoneNumber] || {
        name: 'Unknown',
        countryCode: 'US',
        phoneNumber: phoneNumber,
        carrier: 'Unknown',
        verified: false,
        score: 5.0,
        spamScore: 1.0
      };
    } else {
      try {
        // Real Truecaller API call
        const response = await axios.get(`${TRUECALLER_API_BASE}/lookup`, {
          params: {
            phone: phoneNumber,
            countryCode: 'US'
          },
          headers: {
            'Authorization': `Bearer ${TRUECALLER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        truecallerData = response.data;
      } catch (apiError) {
        console.error('Truecaller API error:', apiError.message);
        
        // Fallback to basic verification
        truecallerData = {
          name: 'Unknown',
          countryCode: 'US',
          phoneNumber: phoneNumber,
          carrier: 'Unknown',
          verified: false,
          score: 5.0,
          spamScore: 0.0,
          error: 'API_UNAVAILABLE'
        };
      }
    }

    // Update user's Truecaller data
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user's phone verification status
    user.truecallerData = truecallerData;
    user.truecallerVerified = truecallerData.verified;
    user.phoneVerified = truecallerData.verified;

    // Update trust score based on Truecaller verification
    if (truecallerData.verified && truecallerData.score > 7) {
      await user.updateTrustScore(0.5); // Boost trust score for verified users
    } else if (truecallerData.spamScore > 5) {
      await user.updateTrustScore(-1.0); // Reduce trust score for spam numbers
    }

    await user.save();

    res.json({
      success: true,
      message: 'Phone verification completed',
      verification: {
        verified: truecallerData.verified,
        score: truecallerData.score,
        spamScore: truecallerData.spamScore,
        carrier: truecallerData.carrier,
        name: truecallerData.name
      }
    });

  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during phone verification'
    });
  }
});

// Search contacts by phone number
router.post('/search', auth, [
  body('phoneNumber').isMobilePhone().withMessage('Valid phone number is required')
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

    const { phoneNumber } = req.body;

    // First, check if user exists in our system
    let existingUser = await User.findOne({ phone: phoneNumber })
      .select('firstName lastName email phone avatar paymentRating trustScore truecallerVerified');

    if (existingUser) {
      return res.json({
        success: true,
        found: true,
        source: 'internal',
        contact: {
          id: existingUser._id,
          name: `${existingUser.firstName} ${existingUser.lastName}`,
          email: existingUser.email,
          phone: existingUser.phone,
          avatar: existingUser.avatar,
          paymentRating: existingUser.paymentRating,
          trustScore: existingUser.trustScore,
          verified: existingUser.truecallerVerified,
          isRegistered: true
        }
      });
    }

    // If not found internally, search via Truecaller
    let truecallerData;

    if (process.env.NODE_ENV === 'development' || !TRUECALLER_API_KEY || TRUECALLER_API_KEY === 'demo-api-key') {
      // Use mock data for development
      truecallerData = mockTruecallerData[phoneNumber];
    } else {
      try {
        const response = await axios.get(`${TRUECALLER_API_BASE}/search`, {
          params: {
            phone: phoneNumber,
            countryCode: 'US'
          },
          headers: {
            'Authorization': `Bearer ${TRUECALLER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        truecallerData = response.data;
      } catch (apiError) {
        console.error('Truecaller search error:', apiError.message);
        truecallerData = null;
      }
    }

    if (truecallerData) {
      res.json({
        success: true,
        found: true,
        source: 'truecaller',
        contact: {
          name: truecallerData.name,
          phone: truecallerData.phoneNumber,
          carrier: truecallerData.carrier,
          verified: truecallerData.verified,
          score: truecallerData.score,
          spamScore: truecallerData.spamScore,
          isRegistered: false
        }
      });
    } else {
      res.json({
        success: true,
        found: false,
        message: 'Contact not found'
      });
    }

  } catch (error) {
    console.error('Contact search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during contact search'
    });
  }
});

// Bulk search for multiple contacts
router.post('/search-bulk', auth, [
  body('phoneNumbers').isArray({ min: 1, max: 50 }).withMessage('Phone numbers array is required (max 50)')
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

    const { phoneNumbers } = req.body;
    const results = [];

    // Process each phone number
    for (const phoneNumber of phoneNumbers) {
      try {
        // Check internal database first
        let existingUser = await User.findOne({ phone: phoneNumber })
          .select('firstName lastName email phone avatar paymentRating trustScore truecallerVerified');

        if (existingUser) {
          results.push({
            phoneNumber,
            found: true,
            source: 'internal',
            contact: {
              id: existingUser._id,
              name: `${existingUser.firstName} ${existingUser.lastName}`,
              email: existingUser.email,
              phone: existingUser.phone,
              avatar: existingUser.avatar,
              paymentRating: existingUser.paymentRating,
              trustScore: existingUser.trustScore,
              verified: existingUser.truecallerVerified,
              isRegistered: true
            }
          });
          continue;
        }

        // Search via Truecaller if not found internally
        let truecallerData;

        if (process.env.NODE_ENV === 'development' || !TRUECALLER_API_KEY || TRUECALLER_API_KEY === 'demo-api-key') {
          truecallerData = mockTruecallerData[phoneNumber];
        } else {
          try {
            const response = await axios.get(`${TRUECALLER_API_BASE}/search`, {
              params: {
                phone: phoneNumber,
                countryCode: 'US'
              },
              headers: {
                'Authorization': `Bearer ${TRUECALLER_API_KEY}`,
                'Content-Type': 'application/json'
              },
              timeout: 5000
            });

            truecallerData = response.data;
          } catch (apiError) {
            console.error(`Truecaller search error for ${phoneNumber}:`, apiError.message);
            truecallerData = null;
          }
        }

        if (truecallerData) {
          results.push({
            phoneNumber,
            found: true,
            source: 'truecaller',
            contact: {
              name: truecallerData.name,
              phone: truecallerData.phoneNumber,
              carrier: truecallerData.carrier,
              verified: truecallerData.verified,
              score: truecallerData.score,
              spamScore: truecallerData.spamScore,
              isRegistered: false
            }
          });
        } else {
          results.push({
            phoneNumber,
            found: false
          });
        }

      } catch (individualError) {
        console.error(`Error processing ${phoneNumber}:`, individualError.message);
        results.push({
          phoneNumber,
          found: false,
          error: 'Processing error'
        });
      }
    }

    res.json({
      success: true,
      results,
      summary: {
        total: phoneNumbers.length,
        found: results.filter(r => r.found).length,
        registered: results.filter(r => r.contact?.isRegistered).length
      }
    });

  } catch (error) {
    console.error('Bulk search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk contact search'
    });
  }
});

// Get Truecaller verification status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('phone phoneVerified truecallerVerified truecallerData');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      status: {
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        truecallerVerified: user.truecallerVerified,
        truecallerData: user.truecallerData,
        verificationDate: user.truecallerData?.verifiedAt || null
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

// Sync contacts from Truecaller (simulated)
router.post('/sync-contacts', auth, async (req, res) => {
  try {
    // In a real implementation, this would:
    // 1. Request user permission to access contacts
    // 2. Upload contacts to Truecaller for processing
    // 3. Get back enhanced contact information
    // 4. Store the enhanced contacts locally

    // For demo purposes, we'll simulate finding registered users
    const simulatedContacts = [
      {
        name: 'Alice Smith',
        phone: '+1234567890',
        isRegistered: true,
        verified: true,
        paymentRating: 4.8,
        trustScore: 9.2
      },
      {
        name: 'Bob Johnson',
        phone: '+9876543210',
        isRegistered: true,
        verified: true,
        paymentRating: 4.6,
        trustScore: 8.7
      },
      {
        name: 'Carol Williams',
        phone: '+1122334455',
        isRegistered: false,
        verified: false,
        spamScore: 0.0
      }
    ];

    res.json({
      success: true,
      message: 'Contacts synced successfully',
      contacts: simulatedContacts,
      summary: {
        total: simulatedContacts.length,
        registered: simulatedContacts.filter(c => c.isRegistered).length,
        verified: simulatedContacts.filter(c => c.verified).length
      }
    });

  } catch (error) {
    console.error('Sync contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error syncing contacts'
    });
  }
});

// Report spam number
router.post('/report-spam', auth, [
  body('phoneNumber').isMobilePhone().withMessage('Valid phone number is required'),
  body('reason').isIn(['spam', 'scam', 'harassment', 'telemarketing', 'other'])
    .withMessage('Valid reason is required')
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

    const { phoneNumber, reason, description } = req.body;

    // In a real implementation, this would report to Truecaller
    // For demo purposes, we'll just log it and simulate success

    console.log(`Spam report: ${phoneNumber} reported by user ${req.userId} for ${reason}`);

    // Update the reported user's trust score if they exist in our system
    const reportedUser = await User.findOne({ phone: phoneNumber });
    if (reportedUser) {
      await reportedUser.updateTrustScore(-0.5); // Reduce trust score for spam reports
    }

    res.json({
      success: true,
      message: 'Spam report submitted successfully',
      reportId: `SPM${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    });

  } catch (error) {
    console.error('Report spam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting spam report'
    });
  }
});

// Get Truecaller insights for a phone number
router.get('/insights/:phoneNumber', auth, async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    // Validate phone number format
    if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    let insights;

    if (process.env.NODE_ENV === 'development' || !TRUECALLER_API_KEY || TRUECALLER_API_KEY === 'demo-api-key') {
      // Use mock data for development
      const mockData = mockTruecallerData[phoneNumber];
      if (mockData) {
        insights = {
          ...mockData,
          insights: {
            callHistory: Math.floor(Math.random() * 100),
            reportCount: Math.floor(Math.random() * 10),
            lastSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            popularityScore: Math.random() * 10,
            businessCategory: mockData.score > 8 ? 'Personal' : 'Unknown'
          }
        };
      } else {
        insights = null;
      }
    } else {
      try {
        const response = await axios.get(`${TRUECALLER_API_BASE}/insights/${encodeURIComponent(phoneNumber)}`, {
          headers: {
            'Authorization': `Bearer ${TRUECALLER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        insights = response.data;
      } catch (apiError) {
        console.error('Truecaller insights error:', apiError.message);
        insights = null;
      }
    }

    if (insights) {
      res.json({
        success: true,
        insights
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No insights available for this number'
      });
    }

  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching insights'
    });
  }
});

module.exports = router;