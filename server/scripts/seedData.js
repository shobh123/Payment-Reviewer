const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Rating = require('../models/Rating');

// Demo user data
const demoUsers = [
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1234567890',
    password: 'password123',
    balance: 1250.75,
    dateOfBirth: new Date('1990-05-15'),
    isVerified: true,
    phoneVerified: true,
    truecallerVerified: true,
    truecallerData: {
      name: 'Alice Johnson',
      countryCode: 'US',
      phoneNumber: '+1234567890',
      carrier: 'Verizon',
      verified: true,
      score: 9.2
    },
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@example.com',
    phone: '+9876543210',
    password: 'password123',
    balance: 895.50,
    dateOfBirth: new Date('1985-11-22'),
    isVerified: true,
    phoneVerified: true,
    truecallerVerified: true,
    truecallerData: {
      name: 'Bob Smith',
      countryCode: 'US',
      phoneNumber: '+9876543210',
      carrier: 'AT&T',
      verified: true,
      score: 8.7
    },
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    }
  },
  {
    firstName: 'Carol',
    lastName: 'Williams',
    email: 'carol.williams@example.com',
    phone: '+1122334455',
    password: 'password123',
    balance: 2150.25,
    dateOfBirth: new Date('1988-03-10'),
    isVerified: true,
    phoneVerified: false,
    truecallerVerified: false,
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    }
  },
  {
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '+5544332211',
    password: 'password123',
    balance: 675.80,
    dateOfBirth: new Date('1992-08-18'),
    isVerified: false,
    phoneVerified: true,
    truecallerVerified: true,
    truecallerData: {
      name: 'David Brown',
      countryCode: 'US',
      phoneNumber: '+5544332211',
      carrier: 'T-Mobile',
      verified: true,
      score: 7.9
    }
  },
  {
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@example.com',
    phone: '+6677889900',
    password: 'password123',
    balance: 3200.00,
    dateOfBirth: new Date('1995-12-05'),
    isVerified: true,
    phoneVerified: true,
    truecallerVerified: true,
    truecallerData: {
      name: 'Emma Davis',
      countryCode: 'US',
      phoneNumber: '+6677889900',
      carrier: 'Verizon',
      verified: true,
      score: 9.5
    }
  },
  {
    firstName: 'Frank',
    lastName: 'Wilson',
    email: 'frank.wilson@example.com',
    phone: '+3344556677',
    password: 'password123',
    balance: 450.30,
    dateOfBirth: new Date('1987-07-30'),
    isVerified: true,
    phoneVerified: false,
    truecallerVerified: false
  },
  {
    firstName: 'Grace',
    lastName: 'Taylor',
    email: 'grace.taylor@example.com',
    phone: '+7788990011',
    password: 'password123',
    balance: 1850.60,
    dateOfBirth: new Date('1991-04-12'),
    isVerified: true,
    phoneVerified: true,
    truecallerVerified: true,
    truecallerData: {
      name: 'Grace Taylor',
      countryCode: 'US',
      phoneNumber: '+7788990011',
      carrier: 'AT&T',
      verified: true,
      score: 8.3
    }
  },
  {
    firstName: 'Henry',
    lastName: 'Anderson',
    email: 'henry.anderson@example.com',
    phone: '+2233445566',
    password: 'password123',
    balance: 1100.45,
    dateOfBirth: new Date('1989-09-25'),
    isVerified: false,
    phoneVerified: true,
    truecallerVerified: false
  }
];

// Demo transaction templates
const transactionCategories = ['personal', 'business', 'bills', 'food', 'entertainment', 'shopping', 'travel'];
const transactionModes = ['instant', 'scheduled', 'recurring'];
const transactionDescriptions = [
  'Lunch payment',
  'Movie tickets',
  'Gas money',
  'Grocery split',
  'Rent contribution',
  'Birthday gift',
  'Coffee meetup',
  'Uber ride share',
  'Concert tickets',
  'Dinner split',
  'Book purchase',
  'Subscription payment',
  'Parking fee',
  'Gym membership',
  'Utility bill split'
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/payment-service', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Rating.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create users
    console.log('👥 Creating demo users...');
    const createdUsers = [];

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${userData.firstName} ${userData.lastName}`);
    }

    // Create transactions
    console.log('💰 Creating demo transactions...');
    const createdTransactions = [];

    // Generate realistic transaction history
    for (let i = 0; i < 50; i++) {
      const sender = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      let receiver = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      // Ensure sender and receiver are different
      while (receiver._id.equals(sender._id)) {
        receiver = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      }

      const amount = Math.floor(Math.random() * 500) + 10; // $10 to $510
      const category = transactionCategories[Math.floor(Math.random() * transactionCategories.length)];
      const mode = transactionModes[Math.floor(Math.random() * transactionModes.length)];
      const description = transactionDescriptions[Math.floor(Math.random() * transactionDescriptions.length)];

      // Create transaction with random date in the past 6 months
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 180));

      const transaction = new Transaction({
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender: sender._id,
        receiver: receiver._id,
        amount,
        type: 'send',
        mode,
        status: 'completed',
        description,
        category,
        completedAt: createdAt,
        createdAt
      });

      await transaction.save();
      createdTransactions.push(transaction);

      // Update user balances and statistics
      sender.totalSent += amount;
      sender.transactionCount += 1;
      sender.successfulTransactions += 1;

      receiver.totalReceived += amount;
      receiver.transactionCount += 1;
      receiver.successfulTransactions += 1;

      await sender.save();
      await receiver.save();
    }

    console.log(`✅ Created ${createdTransactions.length} transactions`);

    // Create ratings
    console.log('⭐ Creating demo ratings...');
    let ratingsCreated = 0;

    // Create ratings for completed transactions (about 60% of them)
    for (const transaction of createdTransactions) {
      if (Math.random() > 0.4) { // 60% chance of rating
        const rating = Math.floor(Math.random() * 3) + 3; // Rating between 3-5 stars
        const feedbacks = [
          'Great transaction, very smooth!',
          'Quick and reliable payment.',
          'Always a pleasure doing business.',
          'Fast response and payment.',
          'Trustworthy person, highly recommended.',
          'Easy transaction, no issues.',
          'Professional and prompt.',
          'Would definitely transact again.',
          null // Some ratings without feedback
        ];

        const feedback = Math.random() > 0.3 ? feedbacks[Math.floor(Math.random() * feedbacks.length)] : null;

        // Randomly choose who rates whom
        const isReceiverRating = Math.random() > 0.5;
        const rater = isReceiverRating ? transaction.receiver : transaction.sender;
        const rated = isReceiverRating ? transaction.sender : transaction.receiver;
        const context = isReceiverRating ? 'payment_received' : 'payment_sent';

        const ratingDoc = new Rating({
          ratingId: `RAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          rater,
          rated,
          transaction: transaction._id,
          rating,
          feedback,
          context,
          criteria: {
            speed: Math.max(1, rating + Math.floor(Math.random() * 2) - 1),
            reliability: Math.max(1, rating + Math.floor(Math.random() * 2) - 1),
            communication: Math.max(1, rating + Math.floor(Math.random() * 2) - 1),
            trustworthiness: Math.max(1, rating + Math.floor(Math.random() * 2) - 1)
          },
          createdAt: new Date(transaction.createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000) // Within 24 hours of transaction
        });

        await ratingDoc.save();

        // Update user's rating statistics
        const ratedUser = await User.findById(rated);
        await ratedUser.updateRating(rating);

        // Update trust score based on rating
        const trustFactor = rating >= 4 ? 0.1 : rating <= 2 ? -0.2 : 0;
        await ratedUser.updateTrustScore(trustFactor);

        ratingsCreated++;
      }
    }

    console.log(`✅ Created ${ratingsCreated} ratings`);

    // Create some pending transactions
    console.log('⏳ Creating pending transactions...');
    for (let i = 0; i < 5; i++) {
      const sender = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      let receiver = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      while (receiver._id.equals(sender._id)) {
        receiver = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      }

      const amount = Math.floor(Math.random() * 200) + 20;
      const transaction = new Transaction({
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender: sender._id,
        receiver: receiver._id,
        amount,
        type: 'request',
        mode: 'instant',
        status: 'pending',
        description: 'Pending payment request',
        requiresApproval: true
      });

      await transaction.save();
    }

    // Create some scheduled transactions
    console.log('📅 Creating scheduled transactions...');
    for (let i = 0; i < 3; i++) {
      const sender = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      let receiver = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      while (receiver._id.equals(sender._id)) {
        receiver = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      }

      const amount = Math.floor(Math.random() * 300) + 50;
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + Math.floor(Math.random() * 30) + 1); // 1-30 days from now

      const transaction = new Transaction({
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender: sender._id,
        receiver: receiver._id,
        amount,
        type: 'send',
        mode: 'scheduled',
        status: 'pending',
        description: 'Scheduled payment',
        scheduledFor
      });

      await transaction.save();
    }

    // Update final user statistics
    console.log('📊 Updating user statistics...');
    for (const user of createdUsers) {
      // Calculate success rate
      if (user.transactionCount > 0) {
        user.successRate = (user.successfulTransactions / user.transactionCount) * 100;
      }

      // Adjust trust scores based on activity
      if (user.transactionCount > 20) {
        await user.updateTrustScore(0.5);
      } else if (user.transactionCount > 10) {
        await user.updateTrustScore(0.2);
      }

      await user.save();
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📈 Summary:
- Users created: ${createdUsers.length}
- Transactions created: ${createdTransactions.length + 8} (including pending and scheduled)
- Ratings created: ${ratingsCreated}
    `);

    // Display login credentials
    console.log(`
🔐 Demo Login Credentials:
Email: alice.johnson@example.com
Password: password123

Email: bob.smith@example.com
Password: password123

(All demo users use password: password123)
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Handle command line execution
if (require.main === module) {
  require('dotenv').config();
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;