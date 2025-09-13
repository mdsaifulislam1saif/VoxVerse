import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Eye, EyeOff, Mic } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import FileUpload from './FileUpload';
import LanguageSelector from './LanguageSelector';
import SummarizeSelector from './SummarizeSelector';
import AudioPlayer from './AudioPlayer';
import { apiService } from '@services/api';

export const SummarizeTab = () => {
  const { token } = useAuth();
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSummaryType, setSelectedSummaryType] = useState('brief');
  const [showSummary, setShowSummary] = useState(true);
  const [conversionProgress, setConversionProgress] = useState(0);
  
  // Optional: simulate progress
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setConversionProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);
    } else {
      setConversionProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Summarize only
  const handleSummarize = async () => {
    if (!text.trim()) return alert('Enter some text');

    setLoading(true);
    try {
      const response = await apiService.post('/summarize/summary', {
        text,
        language: selectedLanguage,
        summary_type: selectedSummaryType,
      });
      setSummary(response.summary_content);
      setAudioUrl(null); // clear previous audio
    } catch (err) {
      alert(err.message || 'Failed to summarize');
    } finally {
      setLoading(false);
    }
  };

  // Convert summary to audio
  const handleConvert = async () => {
    if (!summary.trim()) return alert('Generate summary first');

    setLoading(true);
    try {
      const audioResponse = await apiService.post('/convert/text', {
        text: summary,
        language: selectedLanguage,
        speed: 1.0,
        format: 'mp3',
      });

      const stream = await fetch(`${apiService.baseURL}/convert/${audioResponse.id}/stream`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (stream.ok) {
        const blob = await stream.blob();
        setAudioUrl(URL.createObjectURL(blob));
        setConversionProgress(100);
      }
    } catch (err) {
      alert(err.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* File Upload */}
      <FileUpload setText={setText} selectedLanguage={selectedLanguage} />

      {/* Text & Options */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Text to Summarize</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
          <SummarizeSelector selectedSummaryType={selectedSummaryType} setSelectedSummaryType={setSelectedSummaryType} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          className="w-full h-48 p-4 text-gray-800 border rounded-lg mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Generated Summary */}
        {summary && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold text-gray-800">Generated Summary</h3>
              <button onClick={() => setShowSummary(!showSummary)}>
                {showSummary ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {showSummary && (
              <p className="p-4 bg-green-50 border border-green-200 rounded-lg text-gray-700">
                {summary}
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="mb-6">
          {!summary ? (
            // Show Summarize button if summary not generated
            <button
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <FileText className="mr-2" size={20} />}
              Summarize
            </button>
          ) : (
            // Show Convert button if summary exists
            <button
              onClick={handleConvert}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Mic className="mr-2" size={20} />}
              Convert Summary to Audio
            </button>
          )}
        </div>

        {/* Audio Player */}
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </div>
      {loading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                    <h3 className="text-2xl font-bold text-gray-800">Converting Your Content</h3>
                    <p className="text-gray-600">Please wait while we process your text to audio</p>
      
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${conversionProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-800 font-semibold mt-2">{conversionProgress}%</span>
                  </div>
                </div>
              </div>
           )}
    </div>
  );
};
