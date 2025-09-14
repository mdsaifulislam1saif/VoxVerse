import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useSummarize = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSummaryType, setSelectedSummaryType] = useState('brief');
  const [showSummary, setShowSummary] = useState(true);
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [summarizeProgress, setSummarizeProgress] = useState(0);
  
  // Effect to simulate a progress bar while summarization is in progress
  useEffect(() => {
    let interval;
    if (summarizeLoading) {
      // Increase progress gradually until 90%
      interval = setInterval(() => {
        setSummarizeProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);
    } else {
      // Reset progress when not loading
      setSummarizeProgress(0);
    }
    // Cleanup interval on unmount 
    return () => clearInterval(interval);
  }, [summarizeLoading]);
  // Function to perform text summarization
  const handleSummarize = async () => {
    if (!text.trim()) return alert('Enter some text'); 
    setSummarizeLoading(true); 
    try {
      const response = await apiService.post('/summarize/summary', {
        text,
        language: selectedLanguage,
        summary_type: selectedSummaryType,
      });
      // Update summary state with the result
      setSummary(response.summary_content);
      setSummarizeProgress(100);
    } catch (err) {
      alert(err.message || 'Failed to summarize');
    } finally {
      setSummarizeLoading(false); 
    }
  };
  return {
    text,                    // Input text for summarization
    setText,                 // Function to update input text
    summary,                 // Generated summary
    selectedLanguage,        // Selected language for summarization
    setSelectedLanguage,     // Function to change language
    selectedSummaryType,     // Selected summary type
    setSelectedSummaryType,  // Function to change summary type
    showSummary,             // Boolean to toggle summary display
    setShowSummary,          // Function to toggle summary display
    summarizeLoading,        // Loading state during summarization
    summarizeProgress,       // Progress percentage for UI feedback
    handleSummarize,         // Function to trigger summarization
  };
};
