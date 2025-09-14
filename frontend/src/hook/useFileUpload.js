import { useState, useRef } from 'react';
import { apiService } from '../services/api';

export const useFileUpload = (setText, selectedLanguage = 'en') => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  const handleFileUpload = async (file, type) => {
    if (!file) return; // Exit if no file is provided
    // Set appropriate loading state
    if (type === 'pdf') setPdfLoading(true);
    if (type === 'image') setImageLoading(true);
    // Prepare form data for API request
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', selectedLanguage);
    try {
      // Choose endpoint based on file type
      const endpoint = type === 'pdf' ? '/extract/pdf' : '/extract/image';
      // Send POST request with form data
      const response = await apiService.postFormData(endpoint, formData);
      // Update parent component with extracted text
      setText(response.text || '');
    } catch (error) {
      alert(error.message || 'Failed to extract text');
    } finally {
      if (type === 'pdf') {
        setPdfLoading(false);
        pdfInputRef.current.value = ''; // Reset file input
      }
      if (type === 'image') {
        setImageLoading(false);
        imageInputRef.current.value = ''; // Reset file input
      }
    }
  };
  return {
    pdfLoading,      // Loading state for PDF
    imageLoading,    // Loading state for image
    pdfInputRef,     // Ref for PDF input element
    imageInputRef,   // Ref for image input element
    handleFileUpload,// Function to handle uploads
  };
};
