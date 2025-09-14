import { API_BASE } from "../config/config";

class ApiService {
  constructor() {
    // Base URL for all API requests
    this.baseURL = API_BASE;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`; 
    const headers = { ...options.headers };   
    // If body is not FormData and Content-Type is not set, default to JSON
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    const config = { ...options, headers };
    // Add Authorization header if token exists in sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    try {
      const response = await fetch(url, config); // Make the API call
      // Handle non-OK responses
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }
      // Return true for empty responses (204 No Content)
      if (response.status === 204) {
        return true;
      }
      // Parse JSON responses automatically
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      // For other response types, return the raw response
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error; // Rethrow error for caller to handle
    }
  }
  // Convenience methods for each HTTP verb
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data), // Convert data to JSON
      ...options,
    });
  }
  postFormData(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData, // Send FormData directly without JSON.stringify
      ...options,
    });
  }
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data), // Convert data to JSON
      ...options,
    });
  }
  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}
// Singleton instance for use throughout the app
export const apiService = new ApiService();
