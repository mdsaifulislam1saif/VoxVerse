import { useState } from 'react';
import { summaryAPI, conversionAPI } from '../services/api';

export const useSummary = (token, selectedLanguage, selectedSummaryType, setShowLogin, setAudioUrl) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const convertToSummaryThenAudio = async (text) => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    if (!text.trim()) {
      alert('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    try {
      const summaryData = await summaryAPI.generateSummary(
        text, 
        selectedLanguage, 
        selectedSummaryType, 
        token
      );
      setSummary(summaryData.summary_content);

      const audioData = await conversionAPI.textToAudio(
        summaryData.summary_content, 
        selectedLanguage, 
        token
      );
      const audioBlob = await conversionAPI.getAudioStream(audioData.id, token);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSummary = () => {
    setSummary('');
  };

  return {
    summary,
    loading,
    convertToSummaryThenAudio,
    resetSummary
  };
};