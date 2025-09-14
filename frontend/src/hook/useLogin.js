import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  // React Router navigation function to redirect after login
  const navigate = useNavigate();
  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError('');       // Reset previous errors
    setLoading(true);   // Start loading state
    try {
      // Attempt login with provided credentials
      const result = await login({ username, password });
      if (result.success) {
        // If login succeeds, navigate to the converter page
        navigate('/converter');
      } else {
        // If login fails, show the error message
        setError(result.error);
      }
    } catch {
      // Handle unexpected errors
      setError('An unexpected error occurred');
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  return {
    username,         // Username value
    setUsername,      // Function to update username
    password,         // Password value
    setPassword,      // Function to update password
    showPassword,     // Boolean to toggle password visibility
    error,            // Error message to display
    loading,          // Loading state during login
    setShowPassword,  // Function to toggle showPassword
    handleSubmit      // Function to handle form submission
  };
};
