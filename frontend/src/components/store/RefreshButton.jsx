import { RefreshCw } from 'lucide-react';

const RefreshButton = ({ onClick, loading }) => (
  <button
    onClick={onClick}          // Trigger provided onClick handler
    disabled={loading}         // Disable button while loading
    className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
  >
    {/* Icon with optional spinning animation when loading */}
    <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
    Refresh
  </button>
);
export default RefreshButton;
