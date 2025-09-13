import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useSummarize = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');  
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSummaryType, setSelectedSummaryType] = useState('brief');
  const [showSummary, setShowSummary] = useState(true);

  // Loading states
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [summarizeProgress, setSummarizeProgress] = useState(0);

  // Simulate summarize progress
  useEffect(() => {
    let interval;
    if (summarizeLoading) {
      interval = setInterval(() => {
        setSummarizeProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);
    } else {
      setSummarizeProgress(0);
    }
    return () => clearInterval(interval);
  }, [summarizeLoading]);

  
  const handleSummarize = async () => {
    if (!text.trim()) return alert('Enter some text');
    setSummarizeLoading(true);

    try {
      const response = await apiService.post('/summarize/summary', {
        text,
        language: selectedLanguage,
        summary_type: selectedSummaryType,
      });
      setSummary(response.summary_content);
      setSummarizeProgress(100);
    } catch (err) {
      alert(err.message || 'Failed to summarize');
    } finally {
      setSummarizeLoading(false);
    }
  };

  return {
    text,
    setText,
    summary,
    selectedLanguage,
    setSelectedLanguage,
    selectedSummaryType,
    setSelectedSummaryType,
    showSummary,
    setShowSummary,
    summarizeLoading,
    summarizeProgress,
    handleSummarize,
  };
};
