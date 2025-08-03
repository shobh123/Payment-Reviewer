import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

const SendMoneyPage: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      addToast(`Successfully sent $${amount} to ${recipient}`, 'success');
      setRecipient('');
      setAmount('');
      setMessage('');
    } catch (error) {
      addToast('Failed to send money. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
        <p className="text-gray-600">Transfer money to your contacts securely</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                Recipient
              </label>
              <input
                id="recipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email or phone number"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a note..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Money'}
            </button>
          </form>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Recipients</h3>
          <div className="space-y-3">
            {['John Doe', 'Sarah Wilson', 'Mike Johnson'].map((name) => (
              <button
                key={name}
                onClick={() => setRecipient(name)}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">{name.charAt(0)}</span>
                </div>
                <span className="ml-3 text-gray-900">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoneyPage;