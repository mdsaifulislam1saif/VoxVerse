import { apiService } from './api';

export const authService = {
  async login(credentials) {
    // Create FormData for the login request
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    // Send login request to get access token
    const tokenResponse = await fetch(`${apiService.baseURL}/auth/token`, {
      method: 'POST',
      body: formData
    });
    // Handle login errors
    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      throw new Error(error.detail || 'Login failed');
    }
    // Parse token response
    const tokenData = await tokenResponse.json();
    // Fetch current user info using the access token
    const user = await this.getCurrentUser(tokenData.access_token);
    // Return user data and token
    return {
      user,
      token: tokenData.access_token
    };
  },
  // Register function
  // userData: { username, email, password }
  // Returns API response
  async register(userData) {
    return apiService.post('/auth/register', userData);
  },
  // Get current user info
  // token: access token for authentication
  // Returns user object
  async getCurrentUser(token) {
    return apiService.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
