import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 pt-8">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-black text-gradient mb-2">Dashboard</h1>
        <p className="text-neutral-600 text-lg">Welcome to your financial command center</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up animate-delay-200">
        <div className="card-glow p-6 hover-lift group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-glow group-hover:shadow-large transition-all duration-300 group-hover:animate-bounce-subtle">
              💰
            </div>
            <div className="text-sm font-medium text-success-600 bg-success-100 px-3 py-1 rounded-full">
              +12.5%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 mb-1">Total Balance</p>
            <p className="text-3xl font-black text-gradient mb-2">$2,450.00</p>
            <p className="text-sm text-neutral-500">+$180 this week</p>
          </div>
        </div>

        <div className="card-glow p-6 hover-lift group cursor-pointer animate-delay-75">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-success-500 to-success-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-glow-purple group-hover:shadow-large transition-all duration-300 group-hover:animate-bounce-subtle">
              📈
            </div>
            <div className="text-sm font-medium text-accent-purple-600 bg-accent-purple-100 px-3 py-1 rounded-full">
              +8.2%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 mb-1">This Month</p>
            <p className="text-3xl font-black text-gradient-sunset mb-2">$1,234.56</p>
            <p className="text-sm text-neutral-500">67 transactions</p>
          </div>
        </div>

        <div className="card-glow p-6 hover-lift group cursor-pointer animate-delay-150">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-accent-orange-500 to-accent-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-glow-pink group-hover:shadow-large transition-all duration-300 group-hover:animate-bounce-subtle">
              📊
            </div>
            <div className="text-sm font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
              47 total
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 mb-1">Transactions</p>
            <p className="text-3xl font-black text-gradient mb-2">47</p>
            <p className="text-sm text-neutral-500">12 pending</p>
          </div>
        </div>

        <div className="card-glow p-6 hover-lift group cursor-pointer animate-delay-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-accent-purple-500 to-accent-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-glow group-hover:shadow-large transition-all duration-300 group-hover:animate-bounce-subtle">
              ⭐
            </div>
            <div className="text-sm font-medium text-warning-600 bg-warning-100 px-3 py-1 rounded-full">
              Excellent
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 mb-1">Trust Rating</p>
            <p className="text-3xl font-black text-gradient-sunset mb-2">4.8</p>
            <p className="text-sm text-neutral-500">Based on 156 reviews</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up animate-delay-500">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2 card-gradient">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gradient">Recent Transactions</h2>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">View All →</button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200 hover-lift group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-xl flex items-center justify-center text-white font-bold shadow-glow group-hover:shadow-large transition-all duration-300">
                    +
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">Received from John Smith</p>
                    <p className="text-sm text-neutral-500">2 hours ago • Instant Transfer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-success-600">+$150.00</p>
                  <p className="text-sm text-neutral-500">Completed</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200 hover-lift group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-orange-500 to-accent-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-glow-pink group-hover:shadow-large transition-all duration-300">
                    -
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">Sent to Sarah Johnson</p>
                    <p className="text-sm text-neutral-500">1 day ago • Regular Transfer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-accent-orange-600">-$75.00</p>
                  <p className="text-sm text-neutral-500">Completed</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200 hover-lift group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-glow-purple group-hover:shadow-large transition-all duration-300">
                    +
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">Cashback Reward</p>
                    <p className="text-sm text-neutral-500">3 days ago • Automatic</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600">+$12.50</p>
                  <p className="text-sm text-neutral-500">Completed</p>
                </div>
              </div>
            </div>

            {/* View All Button */}
            <div className="mt-6 text-center">
              <button className="btn-primary px-6 py-3">
                View All Transactions
                <span className="ml-2">📄</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions & Widgets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card-gradient">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-gradient">Quick Actions</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <button className="p-6 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl hover:from-success-600 hover:to-success-700 transform hover:scale-105 transition-all duration-300 shadow-glow hover:shadow-large group">
                <div className="text-center">
                  <span className="text-3xl mb-3 block group-hover:animate-bounce-subtle">📤</span>
                  <p className="font-semibold">Send Money</p>
                </div>
              </button>
              <button className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-300 shadow-glow hover:shadow-large group">
                <div className="text-center">
                  <span className="text-3xl mb-3 block group-hover:animate-bounce-subtle">📥</span>
                  <p className="font-semibold">Request Money</p>
                </div>
              </button>
              <button className="p-6 bg-gradient-to-r from-accent-purple-500 to-accent-pink-500 text-white rounded-xl hover:from-accent-purple-600 hover:to-accent-pink-600 transform hover:scale-105 transition-all duration-300 shadow-glow-purple hover:shadow-large group">
                <div className="text-center">
                  <span className="text-3xl mb-3 block group-hover:animate-bounce-subtle">📊</span>
                  <p className="font-semibold">Analytics</p>
                </div>
              </button>
              <button className="p-6 bg-gradient-to-r from-accent-orange-500 to-accent-pink-500 text-white rounded-xl hover:from-accent-orange-600 hover:to-accent-pink-600 transform hover:scale-105 transition-all duration-300 shadow-glow-pink hover:shadow-large group">
                <div className="text-center">
                  <span className="text-3xl mb-3 block group-hover:animate-bounce-subtle">⚙️</span>
                  <p className="font-semibold">Settings</p>
                </div>
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card-gradient">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-gradient">Activity Feed</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 animate-fade-in-left">
                <div className="w-8 h-8 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center text-white text-sm">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Payment verified</p>
                  <p className="text-xs text-neutral-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 animate-fade-in-left animate-delay-100">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                  🔔
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">New message received</p>
                  <p className="text-xs text-neutral-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 animate-fade-in-left animate-delay-200">
                <div className="w-8 h-8 bg-gradient-to-r from-accent-orange-500 to-accent-pink-500 rounded-full flex items-center justify-center text-white text-sm">
                  ⭐
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Rating improved</p>
                  <p className="text-xs text-neutral-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Section */}
      <div className="card-gradient animate-fade-in-up animate-delay-700">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gradient">Spending Overview</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-primary-100 text-primary-600 rounded-lg font-medium text-sm">7D</button>
              <button className="px-4 py-2 bg-white text-neutral-600 rounded-lg font-medium text-sm">30D</button>
              <button className="px-4 py-2 bg-white text-neutral-600 rounded-lg font-medium text-sm">90D</button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gradient-to-r from-primary-50 to-accent-purple-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce-subtle">📈</div>
              <p className="text-xl font-bold text-gradient mb-2">Beautiful Charts Coming Soon</p>
              <p className="text-neutral-600">Interactive spending analytics and insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;