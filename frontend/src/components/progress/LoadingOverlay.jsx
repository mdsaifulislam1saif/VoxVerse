import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ title, description, progress }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-gray-800 font-semibold mt-2">{progress}%</span>
      </div>
    </div>
  </div>
);

export default LoadingOverlay;
