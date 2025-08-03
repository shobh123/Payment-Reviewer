import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            Secure Money Transfer
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Send and receive money instantly with our secure platform. 
            Track transactions, manage your finances, and stay connected.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center text-white">
          <div className="p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p>End-to-end encryption keeps your transactions safe</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Fast</h3>
            <p>Instant transfers with real-time notifications</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p>Track and analyze your spending patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;