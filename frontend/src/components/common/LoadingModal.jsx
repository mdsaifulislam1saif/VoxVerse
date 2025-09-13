import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingModal = ({ loading, conversionProgress = 0, conversionStep = 'Processing...' }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
        <div className="text-center space-y-6">

          {/* Spinner Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <LoadingSpinner size="large" />
          </div>

          {/* Progress Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Converting Your Content</h3>
            <p className="text-gray-600">{conversionStep}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${conversionProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{conversionStep}</span>
              <span className="text-gray-800 font-semibold">{conversionProgress}%</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  conversionProgress >= step * 20
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
