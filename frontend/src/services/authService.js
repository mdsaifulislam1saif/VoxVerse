import { apiClient } from './api';

export const login = async (credentials) => {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  
  const response = await fetch(`${apiClient.baseURL}/auth/token`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }
  
  return response.json();
};

export const register = (userData) => {
  return apiClient.post('/auth/register', userData);
};

export const getCurrentUser = () => {
  return apiClient.get('/users/me');
};