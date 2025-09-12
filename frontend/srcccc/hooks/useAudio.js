import { useState, useRef } from 'react';
import { conversionAPI } from '../services/api';

export const useAudio = (token, selectedLanguage, setShowLogin) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const convertToAudio = async (text) => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    if (!text.trim()) {
      alert('Please enter some text to convert');
      return;
    }

    setLoading(true);
    try {
      const data = await conversionAPI.textToAudio(text, selectedLanguage, token);
      const audioBlob = await conversionAPI.getAudioStream(data.id, token);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'converted_audio.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetAudio = () => {
    setAudioUrl(null);
    setIsPlaying(false);
  };

  return {
    audioUrl,
    isPlaying,
    loading,
    audioRef,
    convertToAudio,
    togglePlayback,
    downloadAudio,
    resetAudio
  };
};