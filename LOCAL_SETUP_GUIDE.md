# Payment Service Application - Local Setup Guide

## 🚀 Complete Step-by-Step Setup Process

This guide provides a comprehensive walkthrough to set up and run the Payment Service Application locally on Linux systems.

## ✅ Prerequisites Verification

### 1. System Requirements
- **OS**: Linux (tested on Ubuntu 24.10+)
- **Node.js**: v16 or higher (we used v22.16.0)
- **MongoDB**: v7.0+ (we installed v7.0.22)
- **npm**: v6+ (we used v10.9.2)

### 2. Check Existing Installations
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if MongoDB is installed
which mongod
```

## 🔧 Installation Steps

### Step 1: Install MongoDB
If MongoDB is not installed, follow these steps:

```bash
# Update package list
sudo apt update

# Add MongoDB GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list with MongoDB packages
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org
```

### Step 2: Setup MongoDB Directories and Permissions
```bash
# Create MongoDB data and log directories
sudo mkdir -p /var/lib/mongodb /var/log/mongodb

# Set correct ownership
sudo chown -R mongodb:mongodb /var/lib/mongodb /var/log/mongodb
```

### Step 3: Start MongoDB
```bash
# Start MongoDB as a background service
sudo mongod --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log --fork

# Verify MongoDB is running
mongosh --eval "db.runCommand('ping')"
```

### Step 4: Setup Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# The .env file is already configured with development defaults:
# - NODE_ENV=development
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/payment-service
# - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# - CLIENT_URL=http://localhost:3000
# - TRUECALLER_API_KEY=demo-api-key
```

### Step 5: Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

**Note**: You may see deprecation warnings during installation. These are non-critical and the application will function properly.

### Step 6: Seed Database with Demo Data
```bash
# Run the database seeding script
node server/scripts/seedData.js
```

The seeding script will:
- Create 8 demo users
- Generate 58 realistic transactions
- Create 30 user ratings
- Set up payment history and user statistics

## 🏃‍♂️ Running the Application

### Method 1: Start Both Servers Together (Recommended)
```bash
npm run dev
```

### Method 2: Start Servers Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Server:**
```bash
npm run client
```

## 🌐 Access Points

Once both servers are running:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Demo Login Credentials

Use these accounts to test the application:

| Email | Password | Features |
|-------|----------|----------|
| alice.johnson@example.com | password123 | Fully verified, high trust score |
| bob.smith@example.com | password123 | Truecaller verified, good ratings |
| carol.williams@example.com | password123 | Basic verification |

**All demo users use password: `password123`**

## 🧪 Testing the Setup

### 1. Test Backend API
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "alice.johnson@example.com", "password": "password123"}'

# Test ratings endpoint
curl http://localhost:5000/api/ratings/top-users
```

### 2. Test Frontend
- Open http://localhost:3000 in your browser
- Try logging in with demo credentials
- Navigate through the dashboard features

## 📊 Application Features Available

### Core Payment Features
- ✅ Send & Receive Money
- ✅ Transaction History
- ✅ User Profiles
- ✅ Rating System
- ✅ Trust Scores

### Truecaller Integration
- ✅ Demo mode (for development)
- ✅ Phone verification simulation
- ✅ Contact search mockup

### Security Features
- ✅ JWT Authentication
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ CORS Protection

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running:
```bash
sudo mongod --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log --fork
```

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Kill the process using the port:
```bash
sudo lsof -ti:5000 | xargs kill -9
```

#### 3. Permission Denied for MongoDB
**Solution**: Check MongoDB directory permissions:
```bash
sudo chown -R mongodb:mongodb /var/lib/mongodb /var/log/mongodb
```

#### 4. Frontend Not Loading
**Solution**: 
- Check that both servers are running
- Verify CLIENT_URL in .env matches frontend URL
- Clear browser cache and refresh

#### 5. API Validation Errors
**Solution**: Use correct field names:
- Login requires `identifier` (not `email`)
- Check API documentation in README.md

### 🔧 Known Issues and Limitations

#### Non-Critical Issues (Application Functions Normally)
1. **Deprecation Warnings**: npm install shows deprecation warnings for some packages - these don't affect functionality
2. **Mongoose Schema Warnings**: Duplicate index warnings in console - these are cosmetic and don't impact performance
3. **Frontend Security Vulnerabilities**: Some dev dependencies have known vulnerabilities - run `npm audit fix` in client/ directory if concerned

#### Environment Limitations
1. **SystemD Not Available**: MongoDB must be started manually as systemd is not available in this environment
2. **Email/SMS Features**: Require external service configuration for production use
3. **File Uploads**: Limited to development configuration

### 📝 Development Tips

1. **MongoDB GUI**: Use MongoDB Compass for database visualization
2. **API Testing**: Use Postman or similar tools for comprehensive API testing
3. **Debug Logging**: Set `LOG_LEVEL=debug` in .env for detailed logs
4. **Hot Reload**: Backend uses nodemon for automatic restart on file changes

## 🚀 Next Steps

### For Development
1. Explore the API endpoints listed in README.md
2. Modify the seeding script to add custom test data
3. Customize the frontend components in client/src/

### For Production
1. Change JWT_SECRET in .env
2. Use MongoDB Atlas for cloud database
3. Configure real Truecaller API credentials
4. Set up SSL/HTTPS
5. Configure proper CORS origins
6. Set up error monitoring

## 📞 Support

If you encounter issues not covered in this guide:
1. Check the main README.md for additional information
2. Review server logs for error details
3. Ensure all prerequisites are correctly installed
4. Verify network connectivity and port availability

---

**🎉 Setup Complete!** Your Payment Service Application is now running locally and ready for development or testing.