import { apiService } from './api';

export const authService = {
  async login(credentials) {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const tokenResponse = await fetch(`${apiService.baseURL}/auth/token`, {
      method: 'POST',
      body: formData
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      throw new Error(error.detail || 'Login failed');
    }

    const tokenData = await tokenResponse.json();
    const user = await this.getCurrentUser(tokenData.access_token);

    return {
      user,
      token: tokenData.access_token
    };
  },

  async register(userData) {
    return apiService.post('/auth/register', userData);
  },

  async getCurrentUser(token) {
    return apiService.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};