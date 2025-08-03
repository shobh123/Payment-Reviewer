import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: '📊', gradient: 'from-primary-500 to-primary-600' },
    { path: '/app/transactions', label: 'Transactions', icon: '💳', gradient: 'from-accent-purple-500 to-accent-purple-600' },
    { path: '/app/send', label: 'Send Money', icon: '📤', gradient: 'from-accent-orange-500 to-accent-orange-600' },
    { path: '/app/receive', label: 'Receive', icon: '📥', gradient: 'from-success-500 to-success-600' },
    { path: '/app/ratings', label: 'Ratings', icon: '⭐', gradient: 'from-warning-500 to-warning-600' },
    { path: '/app/profile', label: 'Profile', icon: '👤', gradient: 'from-accent-pink-500 to-accent-pink-600' },
    { path: '/app/settings', label: 'Settings', icon: '⚙️', gradient: 'from-neutral-500 to-neutral-600' },
    { path: '/app/truecaller', label: 'Truecaller', gradient: 'from-primary-500 to-accent-purple-500', icon: '📞' },
    { path: '/app/analytics', label: 'Analytics', icon: '📈', gradient: 'from-accent-purple-500 to-accent-pink-500' },
  ];

  return (
    <div className="w-72 glass border-r border-white/20 backdrop-blur-xl relative z-20">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-purple-500 rounded-xl flex items-center justify-center text-white text-xl shadow-glow">
            💳
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient">PayFlow</h2>
            <p className="text-sm text-neutral-500">Money Transfer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item group relative overflow-hidden ${
                isActive 
                  ? `nav-item-active bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                  : 'text-neutral-700 hover:text-white hover:bg-gradient-to-r hover:' + item.gradient.replace('from-', 'hover:from-').replace('to-', 'hover:to-')
              } animate-slide-in-left`
            }
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center space-x-3 relative z-10">
              <span className="text-xl group-hover:animate-bounce-subtle">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
            
            {/* Hover Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </NavLink>
        ))}
      </nav>

      {/* User Quick Stats */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="card-gradient p-4 text-center">
          <div className="text-2xl font-bold text-gradient mb-1">$2,450.00</div>
          <div className="text-sm text-neutral-600">Available Balance</div>
          <div className="flex justify-center space-x-4 mt-3">
            <div className="text-center">
              <div className="text-sm font-semibold text-success-600">+$180</div>
              <div className="text-xs text-neutral-500">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-primary-600">47</div>
              <div className="text-xs text-neutral-500">Transactions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;