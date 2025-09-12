import { apiClient } from './api';

export const convertText = (data) => {
  return apiClient.post('/convert/text', data);
};

export const getConversions = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/convert${query ? `?${query}` : ''}`);
};

export const getConversion = (id) => {
  return apiClient.get(`/convert/${id}`);
};

export const downloadAudio = async (id) => {
  const response = await fetch(`${apiClient.baseURL}/convert/${id}/download`, {
    headers: apiClient.getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Download failed');
  }
  
  return response.blob();
};

export const streamAudio = async (id) => {
  const response = await fetch(`${apiClient.baseURL}/convert/${id}/stream`, {
    headers: apiClient.getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Stream failed');
  }
  
  return response.blob();
};

export const deleteConversion = (id) => {
  return apiClient.delete(`/convert/${id}`);
};
