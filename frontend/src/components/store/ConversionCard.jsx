import { Download, Trash2, Calendar, Clock } from 'lucide-react';
import LoadingSpinner from '../progress/LoadingSpinner';

const ConversionCard = ({ conv, deleteLoading, onDelete, onDownload }) => {
  // Format UTC date into human-readable string
  const formatDate = (utcString) => {
    const date = new Date(utcString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* File info and metadata */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* File name */}
          <h3 className="font-semibold text-gray-800 truncate mb-2">
            {conv.file_name || 'Untitled Conversion'}
          </h3>
          {/* Text content snippet (max 50 chars) */}
          {conv.text_content && (
            <p className="text-gray-700 mb-2">
              {conv.text_content.length > 50
                ? `${conv.text_content.substring(0, 50)}...`
                : conv.text_content}
            </p>
          )}
          {/* Creation date */}
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(conv.created_at)}
          </div>
          {/* Audio duration if available */}
          {conv.duration && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {conv.duration}s
            </div>
          )}
        </div>
      </div>
      {/* Optional text preview */}
      {conv.text_preview && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700 line-clamp-3">
            {conv.text_preview.length > 100
              ? `${conv.text_preview.substring(0, 100)}...`
              : conv.text_preview}
          </p>
        </div>
      )}
      {/* Action buttons */}
      <div className="flex justify-between items-center">
        {/* Download button */}
        <button
          onClick={() => onDownload(conv.id, conv.file_name)}
          className="flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </button>
        {/* Delete button */}
        <button
          onClick={() => onDelete(conv.id)}
          disabled={deleteLoading === conv.id} // disable while deleting
          className="flex items-center bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
        >
          {/* Show spinner if deleting */}
          {deleteLoading === conv.id ? (
            <LoadingSpinner size="small" className="mr-1" />
          ) : (
            <Trash2 className="h-4 w-4 mr-1" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
};
export default ConversionCard;
