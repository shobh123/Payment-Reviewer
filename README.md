# Payment Service Application

A comprehensive payment service application built with Node.js, Express, MongoDB, and React. Features user authentication, payment transactions, rating system, trust scores, and Truecaller integration.

## 🌟 Features

### Core Payment Features
- **Send & Receive Money**: Instant, scheduled, and recurring payments
- **Multiple Transaction Modes**: 
  - Instant transfers
  - Scheduled payments
  - Recurring payments
  - Escrow transactions
- **Payment Methods**: Wallet, bank transfer, cards, UPI, crypto
- **Transaction Categories**: Personal, business, bills, food, entertainment, shopping, travel

### User Experience
- **Rating & Trust System**: 5-star rating system with detailed criteria
- **Trust Score**: Dynamic scoring based on transaction history and ratings
- **Payment History**: Comprehensive transaction tracking with search and filters
- **User Profiles**: Detailed profiles with verification status and statistics

### Truecaller Integration
- **Phone Verification**: Verify phone numbers with Truecaller
- **Contact Search**: Find users by phone number
- **Spam Protection**: Report and identify spam numbers
- **Contact Sync**: Import and enhance contact information

### Security & Verification
- **Multi-level Authentication**: Email, phone, and Truecaller verification
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against API abuse
- **Risk Assessment**: Transaction risk scoring
- **Account Security**: Failed login protection and account locking

### Analytics & Insights
- **Dashboard Analytics**: Transaction trends and patterns
- **Financial Insights**: Spending analysis and budget suggestions
- **Rating Analytics**: Performance metrics and feedback analysis
- **Security Overview**: Account health and recommendations

## 🏗️ Architecture

### Backend (Node.js/Express)
```
server/
├── models/          # MongoDB schemas (User, Transaction, Rating)
├── routes/          # API endpoints
├── middleware/      # Authentication and validation
├── scripts/         # Database seeding and utilities
└── index.js         # Server entry point
```

### Frontend (React/TypeScript)
```
client/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Application pages
│   ├── contexts/    # React contexts (Auth, Toast)
│   ├── services/    # API service layer
│   └── App.tsx      # Main application component
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd payment-service-app
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client && npm install
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/payment-service
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   TRUECALLER_API_KEY=demo-api-key  # Use 'demo-api-key' for development
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

6. **Seed the database with demo data**
   ```bash
   node server/scripts/seedData.js
   ```

7. **Start the development servers**
   
   **Backend** (Terminal 1):
   ```bash
   npm run server
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   npm run client
   ```

   **Or start both together**:
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 🔐 Demo Credentials

After seeding the database, you can use these demo accounts:

| Email | Password | Features |
|-------|----------|----------|
| alice.johnson@example.com | password123 | Fully verified, high trust score |
| bob.smith@example.com | password123 | Truecaller verified, good ratings |
| carol.williams@example.com | password123 | Basic verification |

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Transaction Endpoints
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions/send` - Send money
- `POST /api/transactions/request` - Request money
- `POST /api/transactions/schedule` - Schedule payment
- `POST /api/transactions/recurring` - Setup recurring payment

### Rating Endpoints
- `POST /api/ratings` - Create rating
- `GET /api/ratings/user/:userId` - Get user ratings
- `GET /api/ratings/top-users` - Get top rated users

### Truecaller Endpoints
- `POST /api/truecaller/verify-phone` - Verify phone
- `POST /api/truecaller/search` - Search contact
- `GET /api/truecaller/status` - Get verification status

### Dashboard Endpoints
- `GET /api/dashboard/overview` - Dashboard data
- `GET /api/dashboard/analytics/transactions` - Transaction analytics
- `GET /api/dashboard/analytics/ratings` - Rating analytics

## 🔧 Configuration

### Truecaller Integration
The application supports both demo mode and real Truecaller API integration:

**Demo Mode** (Default for development):
- Set `TRUECALLER_API_KEY=demo-api-key`
- Uses mock data for testing

**Production Mode**:
- Get API key from Truecaller
- Set `TRUECALLER_API_KEY=your-real-api-key`
- Configure `TRUECALLER_API_BASE=https://api.truecaller.com/v1`

### Database Configuration
- **Local MongoDB**: `mongodb://localhost:27017/payment-service`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/payment-service`

### Security Configuration
- Change `JWT_SECRET` in production
- Configure rate limiting in `server/index.js`
- Set appropriate CORS origins

## 🧪 Development

### Backend Development
```bash
npm run server      # Start with nodemon
npm run seed       # Seed database
```

### Frontend Development
```bash
cd client
npm start          # Start React dev server
npm run build      # Build for production
```

### Testing
```bash
npm test           # Run backend tests
cd client && npm test  # Run frontend tests
```

## 📱 Features Overview

### Transaction Modes

1. **Instant Transfers**
   - Real-time money transfers
   - Immediate balance updates
   - Risk assessment and verification

2. **Scheduled Payments**
   - Set future payment dates
   - Automatic execution
   - Cancellation before execution

3. **Recurring Payments**
   - Daily, weekly, monthly, yearly frequencies
   - Flexible scheduling options
   - End date or occurrence limits

### Rating System

- **5-Star Rating**: Overall transaction experience
- **Detailed Criteria**: Speed, reliability, communication, trustworthiness
- **Public Reviews**: Optional feedback and responses
- **Helpful Votes**: Community-driven rating validation

### Trust Score Algorithm

Trust scores are calculated based on:
- Transaction success rate
- Average rating received
- Account verification status
- Transaction volume and frequency
- Community reports and feedback

### Security Features

- **JWT Authentication**: Secure token-based auth
- **Phone Verification**: SMS/Truecaller verification
- **Risk Assessment**: Transaction risk scoring
- **Rate Limiting**: API abuse protection
- **Account Monitoring**: Suspicious activity detection

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Ensure MongoDB is running locally or check your connection string.

2. **JWT Authentication Error**
   ```
   Error: jwt malformed
   ```
   **Solution**: Clear browser localStorage and login again.

3. **Port Already in Use**
   ```
   Error: listen EADDRINUSE :::5000
   ```
   **Solution**: Kill the process using the port or change the PORT in .env.

4. **CORS Error**
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```
   **Solution**: Check CLIENT_URL in backend .env matches frontend URL.

### Development Tips

- Use MongoDB Compass for database visualization
- Check browser Network tab for API debugging
- Enable debug logging by setting `LOG_LEVEL=debug`
- Use Postman collection for API testing

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Configure MongoDB Atlas
3. Deploy with `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Build with `npm run build`
2. Configure API URL environment variable
3. Deploy build folder

### Production Checklist
- [ ] Change JWT_SECRET
- [ ] Use production MongoDB
- [ ] Configure real Truecaller API
- [ ] Set up SSL/HTTPS
- [ ] Configure proper CORS
- [ ] Set up error monitoring
- [ ] Configure backup strategy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@payment-service.com
- Documentation: [Wiki](https://github.com/yourrepo/wiki)

---

**Built with ❤️ using Node.js, React, MongoDB, and modern web technologies.**
