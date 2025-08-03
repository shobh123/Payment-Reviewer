import React from 'react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track your spending patterns and financial insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-semibold text-gray-900">$3,456.78</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">💸</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-semibold text-gray-900">$1,234.56</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">47</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth</p>
              <p className="text-2xl font-semibold text-gray-900">+15%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Trends</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <span className="text-gray-500">Chart Placeholder</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { category: 'Food & Dining', amount: 456.78, percentage: 35 },
                { category: 'Transportation', amount: 234.56, percentage: 20 },
                { category: 'Shopping', amount: 123.45, percentage: 15 },
                { category: 'Entertainment', amount: 98.76, percentage: 10 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span className="text-sm text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">${item.amount}</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;