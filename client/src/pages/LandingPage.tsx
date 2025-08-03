import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-accent-purple-600 to-accent-pink-600">
        <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
        
        {/* Floating Blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-accent-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">
            💳 <span className="text-gradient-sunset">PayFlow</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center text-white animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            The Future of
            <span className="block text-gradient-sunset bg-gradient-to-r from-accent-orange-400 to-accent-pink-400 bg-clip-text text-transparent">
              Money Transfer
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light opacity-90 animate-fade-in-up animate-delay-200">
            Experience lightning-fast, secure, and beautiful money transfers. 
            Join millions who trust PayFlow for seamless financial transactions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up animate-delay-300">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 glow-primary">
              Start Sending Money
              <span className="ml-2 text-2xl">🚀</span>
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Watch Demo
              <span className="ml-2 text-2xl">▶️</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-80 animate-fade-in-up animate-delay-500">
            <div className="flex items-center space-x-2">
              <span className="text-success-400 text-2xl">✓</span>
              <span>Bank-grade Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-success-400 text-2xl">✓</span>
              <span>Instant Transfers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-success-400 text-2xl">✓</span>
              <span>Global Reach</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 animate-fade-in-up animate-delay-700">
          <div className="card-gradient p-8 text-center hover-lift group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-4xl text-white shadow-glow group-hover:shadow-large transition-all duration-300">
              🔐
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">Ultra Secure</h3>
            <p className="text-neutral-600 mb-6">
              Military-grade encryption and multi-factor authentication keep your money safe 24/7.
            </p>
            <div className="text-primary-600 font-semibold">Learn More →</div>
          </div>

          <div className="card-gradient p-8 text-center hover-lift group animate-delay-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-purple-500 to-accent-pink-500 rounded-2xl flex items-center justify-center text-4xl text-white shadow-glow-purple group-hover:shadow-large transition-all duration-300">
              ⚡
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">Lightning Fast</h3>
            <p className="text-neutral-600 mb-6">
              Send money anywhere in the world in seconds, not days. Real-time notifications included.
            </p>
            <div className="text-accent-purple-600 font-semibold">Learn More →</div>
          </div>

          <div className="card-gradient p-8 text-center hover-lift group animate-delay-200">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-orange-500 to-accent-pink-500 rounded-2xl flex items-center justify-center text-4xl text-white shadow-glow-pink group-hover:shadow-large transition-all duration-300">
              📊
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">Smart Analytics</h3>
            <p className="text-neutral-600 mb-6">
              Track spending, analyze patterns, and make informed financial decisions with AI insights.
            </p>
            <div className="text-accent-orange-600 font-semibold">Learn More →</div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in-up animate-delay-1000">
          <div className="text-center text-white">
            <div className="text-4xl md:text-5xl font-black text-gradient-sunset mb-2">10M+</div>
            <div className="text-lg opacity-80">Active Users</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl md:text-5xl font-black text-gradient-sunset mb-2">$50B+</div>
            <div className="text-lg opacity-80">Transferred</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl md:text-5xl font-black text-gradient-sunset mb-2">180+</div>
            <div className="text-lg opacity-80">Countries</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl md:text-5xl font-black text-gradient-sunset mb-2">99.9%</div>
            <div className="text-lg opacity-80">Uptime</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 animate-fade-in-up animate-delay-1200">
          <div className="card-gradient p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-neutral-800 mb-6">
              Ready to Transform Your Financial Life?
            </h2>
            <p className="text-xl text-neutral-600 mb-8">
              Join millions who've made the switch to faster, safer, smarter money transfers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-accent text-lg px-8 py-4">
                Create Free Account
              </Link>
              <button className="btn-ghost text-lg px-8 py-4 text-neutral-700">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-white/80">
            <p>&copy; 2024 PayFlow. All rights reserved. Making money transfer beautiful.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;