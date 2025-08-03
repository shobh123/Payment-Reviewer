import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 (555) 123-4567');

  const handleSave = () => {
    // Handle save logic here
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-600">{name.charAt(0)}</span>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <p className="text-gray-900">January 2024</p>
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;