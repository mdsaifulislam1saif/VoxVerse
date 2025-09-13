import React, { useState, useEffect } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { apiService } from '@services/api';
import FileUpload from './FileUpload';
import LanguageSelector from './LanguageSelector';
import AudioPlayer from './AudioPlayer';

export const ConvertTab = () => {
  const { token } = useAuth();
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); 
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

  const convertToAudio = async () => {
    if (!text.trim()) return alert('Please enter text');

    setLoading(true);
    try {
      // Convert text to audio
      const response = await apiService.post('/convert/text', {
        text,
        language: selectedLanguage,
        speed: 1.0,
        format: 'mp3',
      });

      const audioResponse = await fetch(`${apiService.baseURL}/convert/${response.id}/stream`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (audioResponse.ok) {
        const audioBlob = await audioResponse.blob();
        setAudioUrl(URL.createObjectURL(audioBlob));
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

      {/* Text + Convert Section */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Text to Convert</h2>

        {/* Language Selector */}
        <div className="mb-6 w-full md:w-1/2">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-4 text-gray-800 border rounded-lg mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type or paste your text..."
        />

        {/* Convert Button */}
        <button
          onClick={convertToAudio}
          disabled={loading || !text.trim()}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Mic className="mr-2" size={20} />}
          Convert to Audio
        </button>

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

