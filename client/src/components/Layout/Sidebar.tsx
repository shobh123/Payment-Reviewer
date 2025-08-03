import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/app/transactions', label: 'Transactions', icon: '💳' },
    { path: '/app/send', label: 'Send Money', icon: '📤' },
    { path: '/app/receive', label: 'Receive', icon: '📥' },
    { path: '/app/ratings', label: 'Ratings', icon: '⭐' },
    { path: '/app/profile', label: 'Profile', icon: '👤' },
    { path: '/app/settings', label: 'Settings', icon: '⚙️' },
    { path: '/app/truecaller', label: 'Truecaller', icon: '📞' },
    { path: '/app/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Money Transfer</h2>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : ''
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;