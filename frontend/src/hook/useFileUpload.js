import { useState, useRef } from 'react';
import { apiService } from '../services/api';

export const useFileUpload = (setText, selectedLanguage = 'en') => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    if (type === 'pdf') setPdfLoading(true);
    if (type === 'image') setImageLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', selectedLanguage);

    try {
      const endpoint = type === 'pdf' ? '/extract/pdf' : '/extract/image';
      const response = await apiService.postFormData(endpoint, formData);
      setText(response.text || '');
    } catch (error) {
      alert(error.message || 'Failed to extract text');
    } finally {
      if (type === 'pdf') {
        setPdfLoading(false);
        pdfInputRef.current.value = '';
      }
      if (type === 'image') {
        setImageLoading(false);
        imageInputRef.current.value = '';
      }
    }
  };

  return {
    pdfLoading,
    imageLoading,
    pdfInputRef,
    imageInputRef,
    handleFileUpload,
  };
};
