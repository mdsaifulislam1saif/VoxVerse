import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // Check for localStorage support before using it
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  });
  const [showLogin, setShowLogin] = useState(!token);
  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser(token);
      setUser(userData);
      setShowLogin(false);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    
    try {
      if (authMode === 'register') {
        await authAPI.register({
          username: authData.username,
          email: authData.email,
          password: authData.password,
          full_name: authData.full_name
        });
      }
      
      const tokenData = await authAPI.login(authData.username, authData.password);
      
      setToken(tokenData.access_token);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('token', tokenData.access_token);
      }
      setShowLogin(false);
      setAuthData({
        username: '',
        email: '',
        password: '',
        full_name: ''
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
    setToken(null);
    setUser(null);
    setShowLogin(true);
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setAuthData({
      username: '',
      email: '',
      password: '',
      full_name: ''
    });
  };

  return {
    user,
    token,
    showLogin,
    authMode,
    authData,
    setAuthData,
    showPassword,
    setShowPassword,
    loading,
    handleAuth,
    logout,
    switchAuthMode
  };
};