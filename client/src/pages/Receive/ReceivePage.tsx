import React from 'react';

const ReceivePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Receive Money</h1>
        <p className="text-gray-600">Share your details to receive payments</p>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">📱</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Payment QR Code</h3>
          <p className="text-sm text-gray-600 mb-4">
            Share this QR code or your details below to receive payments
          </p>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-900">user@example.com</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Phone</p>
              <p className="text-sm text-gray-900">+1 (555) 123-4567</p>
            </div>
          </div>
          
          <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Share Payment Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceivePage;