import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// This allows us to access auth state (user, token, login, logout) from any component
const AuthContext = createContext();

// Custom hook to use the AuthContext easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // If token exists, fetch the current user data
  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false); // No token found, loading complete
    }
  }, []);
  // Fetch current logged-in user's data using token
  const fetchCurrentUser = async (authToken = token) => {
    try {
      const userData = await authService.getCurrentUser(authToken);
      setUser(userData); // Save user data in state
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout(); // If token is invalid or request fails, log out
    } finally {
      setLoading(false); // Loading finished
    }
  };
  // Login function
  const login = async (credentials) => {
    try {
      const { user: userData, token: userToken } = await authService.login(credentials);
      setUser(userData);
      setToken(userToken);
      sessionStorage.setItem('token', userToken); // Save token for persistence
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  // Register function
  const register = async (userData) => {
    try {
      await authService.register(userData); // Call API to register
      return await login({ username: userData.username, password: userData.password }); // Log in after registration
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  // Logout function
  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  const value = {
    user,                 // Current user info
    token,                // Auth token
    loading,              // Loading state
    login,                // Login function
    register,             // Register function
    logout,               // Logout function
    isAuthenticated: !!user // Boolean flag for authentication
  };
  return (
    <AuthContext.Provider value={value}>
      {children} {/* Render children components */}
    </AuthContext.Provider>
  );
};
