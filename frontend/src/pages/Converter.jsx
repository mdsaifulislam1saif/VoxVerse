import React, { useState, useRef } from 'react';
import { useAuth } from '@context/AuthContext';
import { 
  Upload, Play, Pause, Download, FileText, Image, Mic, 
  Loader2, Eye, EyeOff 
} from 'lucide-react';
import { LANGUAGES, SUMMARY_TYPES } from '@utils/constants';
import { apiService } from '@services/api';

const Converter = () => {
  const { token } = useAuth();
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('convert');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSummaryType, setSelectedSummaryType] = useState('brief');
  const [showSummary, setShowSummary] = useState(true);
  
  const audioRef = useRef(null);

  const handleFileUpload = async (file, type) => {
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', selectedLanguage);

    try {
        const endpoint = type === 'pdf' ? '/extract/pdf' : '/extract/image';
        const response = await apiService.postFormData(endpoint, formData);
        setText(response.text);
    } catch (error) {
        alert(error.message || 'Failed to extract text');
    } finally {
        setUploadLoading(false);
    }
  };


  const convertToAudio = async () => {
    if (!text.trim()) {
      alert('Please enter some text to convert');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.post('/convert/text', {
        text: text,
        language: selectedLanguage,
        speed: 1.0,
        format: 'mp3'
      });

      const audioResponse = await fetch(`${apiService.baseURL}/convert/${response.id}/stream`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (audioResponse.ok) {
        const audioBlob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      }
    } catch (error) {
      alert(error.message || 'Failed to convert to audio');
    } finally {
      setLoading(false);
    }
  };

  const convertToSummaryThenAudio = async () => {
    if (!text.trim()) {
      alert('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    try {
      const summaryResponse = await apiService.post('/summarize/summary', {
        text: text,
        language: selectedLanguage,
        summary_type: selectedSummaryType
      });

      setSummary(summaryResponse.summary_content);

      const audioResponse = await apiService.post('/convert/text', {
        text: summaryResponse.summary_content,
        language: selectedLanguage,
        speed: 1.0,
        format: 'mp3'
      });

      const streamResponse = await fetch(`${apiService.baseURL}/convert/${audioResponse.id}/stream`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (streamResponse.ok) {
        const audioBlob = await streamResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      }
    } catch (error) {
      alert(error.message || 'Failed to process text');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('convert')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'convert'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <Mic className="mr-2" size={20} />
                Text to Audio
              </div>
            </button>
            <button
              onClick={() => setActiveTab('summarize')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'summarize'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <FileText className="mr-2" size={20} />
                Summarize & Audio
              </div>
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File Upload */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Upload className="mr-3 text-blue-600" size={24} />
              Upload Files
            </h2>
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-colors">
                {uploadLoading ? (
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                ) : (
                  <>
                    <FileText className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Upload PDF</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'pdf')}
                />
              </label>
              
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-400 transition-colors">
                {uploadLoading ? (
                  <Loader2 className="animate-spin h-8 w-8 text-green-500" />
                ) : (
                  <>
                    <Image className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Upload Image</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.bmp,.tiff,.webp"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'image')}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Text Processing */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {activeTab === 'convert' ? 'Text to Convert' : 'Text to Summarize'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {activeTab === 'summarize' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary Type</label>
                    <select
                      value={selectedSummaryType}
                      onChange={(e) => setSelectedSummaryType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {SUMMARY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here, or upload a file to extract text automatically..."
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {activeTab === 'summarize' && summary && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Generated Summary</h3>
                  <button
                    onClick={() => setShowSummary(!showSummary)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showSummary ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span className="ml-1">{showSummary ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                {showSummary && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              {activeTab === 'convert' ? (
                <button
                  onClick={convertToAudio}
                  disabled={loading || !text.trim()}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <Mic className="mr-2" size={20} />
                  )}
                  Convert to Audio
                </button>
              ) : (
                <button
                  onClick={convertToSummaryThenAudio}
                  disabled={loading || !text.trim()}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <FileText className="mr-2" size={20} />
                  )}
                  Summarize & Convert
                </button>
              )}
            </div>

            {audioUrl && (
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <Play className="text-white" size={16} />
                  </div>
                  Audio Player
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={togglePlayback}
                    className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg transition-colors"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button
                    onClick={downloadAudio}
                    className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Download className="mr-2" size={16} />
                    Download
                  </button>
                </div>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full"
                  controls
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;