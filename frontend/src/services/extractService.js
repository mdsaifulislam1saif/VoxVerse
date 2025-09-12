import { apiClient } from './api';

export const extractFromPDF = (file, language = 'en') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);
  return apiClient.postFormData('/extract/pdf', formData);
};

export const extractFromImage = (file, language = 'en') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);
  return apiClient.postFormData('/extract/image', formData);
};
