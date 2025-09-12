import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { FileText, Download, Trash2, RefreshCw, Calendar, Clock } from 'lucide-react';
import { apiService } from '@services/api';
import LoadingSpinner from '@components/common/LoadingSpinner';

const History = () => {
  const { token } = useAuth();
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchConversions();
  }, []);

  const fetchConversions = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/convert');
      setConversions(data);
    } catch (error) {
      console.error('Failed to fetch conversions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversion = async (id) => {
    if (!confirm('Are you sure you want to delete this conversion?')) return;

    setDeleteLoading(id);
    try {
      await apiService.delete(`/convert/${id}`);
      setConversions(prev => prev.filter(conv => conv.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete conversion');
    } finally {
      setDeleteLoading(null);
    }
  };

  const downloadConversion = async (id, fileName) => {
    try {
      const response = await fetch(`${apiService.baseURL}/convert/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) return alert('Failed to download audio');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName || 'audio'}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download audio');
    }
  };

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
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Conversion History</h1>
            </div>
            <button
              onClick={fetchConversions}
              disabled={loading}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            {conversions.length} conversion{conversions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="p-6">
          {conversions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversions yet</h3>
              <p className="text-gray-600 mb-6">Start converting text to audio to see your history here.</p>
              <a
                href="/converter"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <FileText className="h-5 w-5 mr-2" />
                Start Converting
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversions.map((conv) => (
                <div
                  key={conv.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 truncate mb-2">
                        {conv.file_name || 'Untitled Conversion'}
                      </h3>
                     {conv.text_content && (
                        <p className="text-gray-700 mb-2">
                          {conv.text_content.length > 50
                            ? `${conv.text_content.substring(0, 50)}...`
                            : conv.text_content
                          }
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(conv.created_at)}
                      </div>
                      {conv.duration && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {conv.duration}s
                        </div>
                      )}
                      </div>
                   </div>

                  {conv.text_preview && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {conv.text_preview.length > 100
                          ? `${conv.text_preview.substring(0, 100)}...`
                          : conv.text_preview}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => downloadConversion(conv.id, conv.file_name)}
                      className="flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={() => deleteConversion(conv.id)}
                      disabled={deleteLoading === conv.id}
                      className="flex items-center bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                    >
                      {deleteLoading === conv.id ? (
                        <LoadingSpinner size="small" className="mr-1" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
