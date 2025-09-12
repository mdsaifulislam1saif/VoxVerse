import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, RefreshCw, Search } from 'lucide-react';
import * as conversionService from '../services/conversionService';
import LoadingSpinner from '../components/LoadingSpinner';

const Conversions = () => {
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchConversions();
  }, []);

  const fetchConversions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await conversionService.getConversions();
      setConversions(data);
    } catch (error) {
      setError('Failed to load conversions');
      console.error('Error fetching conversions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await conversionService.deleteConversion(id);
      setConversions(prev => prev.filter(conv => conv.id !== id));
    } catch (error) {
      setError('Failed to delete conversion');
      console.error('Error deleting conversion:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id, fileName) => {
    setDownloadingId(id);
    try {
      const audioBlob = await conversionService.downloadAudio(id);
      const url = URL.createObjectURL(audioBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download audio');
      console.error('Error downloading audio:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredConversions = conversions.filter(conv =>
    conv.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.text_content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-BD', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading conversions..." />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversion History</h1>
          <p className="text-gray-600">Manage your text-to-audio conversions</p>
        </div>
        <button
          onClick={fetchConversions}
          className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search conversions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {filteredConversions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No matching conversions' : 'No conversions yet'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search query'
              : 'Start by converting some text to audio'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredConversions.map((conversion) => (
            <div
              key={conversion.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {conversion.file_name || 'Unnamed conversion'}
                </h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {conversion.source_type || 'Text'}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {conversion.language || 'en'}
                  </span>
                </div>
                <time className="text-sm text-gray-500">
                  {formatDate(conversion.created_at)}
                </time>
              </div>

              <div className="mb-4">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-md max-h-24 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {conversion.text_content?.length > 150
                      ? `${conversion.text_content.slice(0, 150)}...`
                      : conversion.text_content || 'No content available'
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(conversion.id, conversion.file_name)}
                  disabled={downloadingId === conversion.id}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {downloadingId === conversion.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Download size={16} className="mr-2" />
                  )}
                  Download
                </button>
                <button
                  onClick={() => handleDelete(conversion.id, conversion.file_name)}
                  disabled={deletingId === conversion.id}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {deletingId === conversion.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-gray-500 text-sm">
        Showing {filteredConversions.length} of {conversions.length} conversions
      </div>
    </div>
  );
};

export default Conversions;