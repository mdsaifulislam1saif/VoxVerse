import { FileText } from 'lucide-react';
import RefreshButton from '../store/RefreshButton';
import ConversionCard from '../store/ConversionCard';
import EmptyState from '../store/EmptyState';
import { useConversions } from '../../hook/useHistory';
import LoadingSpinner from '../progress/LoadingSpinner';

const History = () => {
  const {
    conversions,      // Array of conversion objects
    loading,          // Boolean: true when fetching conversions
    deleteLoading,    // Boolean: true when deleting a conversion
    fetchConversions, // Function to refresh the list
    deleteConversion, // Function to delete a conversion
    downloadConversion // Function to download a conversion
  } = useConversions();
  // Show a loading-spinner while fetching conversions
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Conversion History</h1>
            </div>
            {/* Refresh Button */}
            <RefreshButton onClick={fetchConversions} loading={loading} />
          </div>
          {/* Conversion Count */}
          <p className="text-gray-600 mt-2">
            {conversions.length} conversion{conversions.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {/* Conversions store */}
        <div className="p-6">
          {conversions.length === 0 ? (
            // Show empty state if no conversions exist
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversions.map((conv) => (
                <ConversionCard
                  key={conv.id}
                  conv={conv}
                  deleteLoading={deleteLoading}
                  onDelete={deleteConversion}
                  onDownload={downloadConversion}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default History;
