import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const useConversions = () => {
  // Get authentication token from AuthContext
  const { token } = useAuth();
  // State to store all conversions fetched from the server
  const [conversions, setConversions] = useState([]);
  // State to track whether conversions are being loaded
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  // Fetch conversions on hook mount
  useEffect(() => {
    fetchConversions();
  }, []);
  // Function to fetch all conversions from the API
  const fetchConversions = async () => {
    setLoading(true); // Start loading
    try {
      const data = await apiService.get('/convert'); 
      setConversions(data); // Save fetched conversions
    } catch (error) {
      console.error('Failed to fetch conversions:', error);
    } finally {
      setLoading(false); 
    }
  };
  const deleteConversion = async (id) => {
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this conversion?')) return;
    // Set the conversion currently being deleted
    setDeleteLoading(id); 
    try {
      await apiService.delete(`/convert/${id}`);
      // Remove deleted conversion from state
      setConversions(prev => prev.filter(conv => conv.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete conversion');
    } finally {
      setDeleteLoading(null); // Reset delete loading state
    }
  };
  const downloadConversion = async (id, fileName) => {
    try {
      // Fetch the audio file from API with authorization header
      const response = await fetch(`${apiService.baseURL}/convert/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) return alert('Failed to download audio');
      // Convert response to a blob (binary data)
      const blob = await response.blob();
      const url = URL.createObjectURL(blob); // Create temporary object URL
      // Create a temporary anchor to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName || 'audio'}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke temporary URL to free memory
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download audio');
    }
  };
  return {
    conversions,        // List of conversions
    loading,            // Loading state for fetch
    deleteLoading,      // ID of conversion being deleted
    fetchConversions,   // Function to manually fetch conversions
    deleteConversion,   // Function to delete a conversion
    downloadConversion  // Function to download conversion audio
  };
};
