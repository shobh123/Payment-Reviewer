import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass border-b border-white/20 backdrop-blur-xl relative z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Welcome Section */}
        <div className="flex items-center space-x-4 animate-fade-in-right">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-purple-500 rounded-xl flex items-center justify-center text-white text-xl shadow-glow animate-pulse-glow">
            👋
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-sm text-neutral-500">
              Ready to make some transactions today?
            </p>
          </div>
        </div>

        {/* Quick Actions & User Menu */}
        <div className="flex items-center space-x-4 animate-fade-in-left">
          {/* Notification Bell */}
          <button className="relative p-3 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl hover:bg-white transition-all duration-200 hover-lift group">
            <span className="text-lg">🔔</span>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent-orange-500 to-accent-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce-subtle">
              3
            </div>
          </button>

          {/* Quick Send Button */}
          <button className="btn-primary px-4 py-2 text-sm">
            <span className="mr-2">⚡</span>
            Quick Send
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-2 hover:bg-white transition-all duration-200 hover-lift">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-purple-500 to-accent-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-sm">
              <div className="font-medium text-neutral-800">{user?.email}</div>
              <div className="text-neutral-500 text-xs">Premium Member</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-3 bg-gradient-to-r from-danger-400 to-danger-500 text-white rounded-xl hover:from-danger-500 hover:to-danger-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <span className="text-lg group-hover:animate-wiggle">🚪</span>
          </button>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 z-20">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl px-6 py-3 shadow-large animate-fade-in-down">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl hover:from-success-600 hover:to-success-700 transform hover:scale-105 transition-all duration-200 text-sm font-medium">
            <span>💸</span>
            <span>Send</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 text-sm font-medium">
            <span>📥</span>
            <span>Receive</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent-purple-500 to-accent-pink-500 text-white rounded-xl hover:from-accent-purple-600 hover:to-accent-pink-600 transform hover:scale-105 transition-all duration-200 text-sm font-medium">
            <span>📊</span>
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;