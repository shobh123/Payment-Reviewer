import React from 'react';

const TruecallerPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Truecaller Integration</h1>
        <p className="text-gray-600">Verify contacts and enhance security</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📞</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Truecaller Integration</h3>
          <p className="text-gray-600 mb-6">
            Connect with Truecaller to verify contacts and enhance your transaction security.
          </p>
          
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Connect Truecaller
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Verify contact authenticity
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Enhanced fraud protection
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Spam detection
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Connection Status</span>
              <span className="text-red-600 text-sm font-medium">Not Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verified Contacts</span>
              <span className="text-gray-900 font-medium">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruecallerPage;