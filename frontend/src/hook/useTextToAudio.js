import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const useTextToAudio = () => {
  const { token } = useAuth();
  const [audioUrl, setAudioUrl] = useState(null);
  const [convertLoading, setconvertLoading] = useState(false);
  const [convertProgress, setconvertProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (convertLoading) {
      interval = setInterval(() => {
        setconvertProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);
    } else {
      setconvertProgress(0);
    }
    return () => clearInterval(interval);
  }, [convertLoading]);

  const convertTextToAudio = async (text, language = 'en') => {
    if (!text.trim()) return alert('Please enter text');

    setconvertLoading(true);
    try {
      const response = await apiService.post('/convert/text', {
        text,
        language,
        speed: 1.0,
        format: 'mp3',
      });

      const audioResponse = await fetch(`${apiService.baseURL}/convert/${response.id}/stream`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (audioResponse.ok) {
        const audioBlob = await audioResponse.blob();
        setAudioUrl(URL.createObjectURL(audioBlob));
        setconvertProgress(100);
      }
    } catch (err) {
      alert(err.message || 'Conversion failed');
    } finally {
      setconvertLoading(false);
    }
  };

  return {
    audioUrl,
    convertLoading,
    convertProgress,
    convertTextToAudio,
  };
};
