import { useState } from 'react';
import { uploadAPI } from '../services/api';

export const useFileUpload = (token, selectedLanguage, setText, setShowLogin) => {
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleFileUpload = async (file, type) => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    setUploadLoading(true);
    try {
      let data;
      if (type === 'pdf') {
        data = await uploadAPI.extractFromPDF(file, selectedLanguage, token);
      } else {
        data = await uploadAPI.extractFromImage(file, selectedLanguage, token);
      }
      setText(data.text);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  return {
    uploadLoading,
    handleFileUpload
  };
};