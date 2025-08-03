import React from 'react';

const RatingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ratings & Reviews</h1>
        <p className="text-gray-600">Your transaction ratings and feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600">4.8</div>
          <div className="text-sm text-gray-600">Overall Rating</div>
          <div className="flex justify-center mt-2">
            {'★★★★★'.split('').map((star, i) => (
              <span key={i} className="text-yellow-400">{star}</span>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-green-600">47</div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-purple-600">98%</div>
          <div className="text-sm text-gray-600">Positive Feedback</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { name: 'John Doe', rating: 5, comment: 'Very fast and reliable service!' },
            { name: 'Sarah Wilson', rating: 4, comment: 'Great experience, highly recommended.' },
            { name: 'Mike Johnson', rating: 5, comment: 'Perfect transaction, thank you!' },
          ].map((review, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{review.name}</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;