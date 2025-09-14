import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/config';

export const useRegister = () => {
  // State to store all form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  // Criteria: length, lowercase, uppercase, number, special character
  const calculateStrength = (password) => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^a-zA-Z0-9]/.test(password)) s++;
    return s;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the corresponding field in formData
    setFormData((prev) => ({ ...prev, [name]: value }));
    // If password field changes, update password strength
    if (name === 'password') setPasswordStrength(calculateStrength(value));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError('');       // Reset previous errors
    // Check if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Check if password strength is sufficient
    if (passwordStrength < 3) {
      setError('Use at least 8 characters, including uppercase, lowercase, numbers, and symbols.');
      return;
    }
    setLoading(true); // Start loading state
    try {
      const { username, email, password } = formData;
      // Call register function from AuthContext
      const result = await register({ username, email, password });
      if (result.success) {
        navigate(ROUTES.LOGIN);
      } else {
        setError(result.error); 
      }
    } finally {
      setLoading(false); 
    }
  };
  return {
    formData,               // Form input values
    showPassword,           // Boolean to toggle password visibility
    showConfirmPassword,    // Boolean to toggle confirm password visibility
    passwordStrength,       // Password strength score
    error,                  // Error message
    loading,                // Loading state during registration
    handleChange,           // Handler for input changes
    handleSubmit,           // Handler for form submission
    setShowPassword,        // Function to toggle password visibility
    setShowConfirmPassword  // Function to toggle confirm password visibility
  };
};
