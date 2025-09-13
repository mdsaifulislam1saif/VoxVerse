import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const useConversions = () => {
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

  return {
    conversions,
    loading,
    deleteLoading,
    fetchConversions,
    deleteConversion,
    downloadConversion
  };
};
