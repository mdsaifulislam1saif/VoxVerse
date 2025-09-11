import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, Image, Type, Download, Loader2, AlertCircle, 
  CheckCircle, Play, Pause, Square, Volume2, Eye, FileAudio,
  Sparkles, MessageSquare, RotateCcw
} from 'lucide-react';

const EnhancedConversionForm = () => {
  // Core states
  const [activeMode, setActiveMode] = useState('direct'); // 'direct' or 'summary'
  const [inputType, setInputType] = useState('text'); // 'text', 'pdf', 'image'
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('en');
  const [summaryType, setSummaryType] = useState('brief');
  
  // Processing states
  const [extracting, setExtracting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Results states
  const [extractedText, setExtractedText] = useState('');
  const [conversionResult, setConversionResult] = useState(null);
  const [summaryResult, setSummaryResult] = useState(null);
  
  // Audio player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Configuration
  const languages = [
    { code: 'en', name: '🇺🇸 English', flag: '🇺🇸' },
    { code: 'es', name: '🇪🇸 Spanish', flag: '🇪🇸' },
    { code: 'fr', name: '🇫🇷 French', flag: '🇫🇷' },
    { code: 'de', name: '🇩🇪 German', flag: '🇩🇪' },
    { code: 'it', name: '🇮🇹 Italian', flag: '🇮🇹' },
    { code: 'pt', name: '🇵🇹 Portuguese', flag: '🇵🇹' },
    { code: 'zh', name: '🇨🇳 Chinese', flag: '🇨🇳' },
    { code: 'ja', name: '🇯🇵 Japanese', flag: '🇯🇵' },
  ];

  const summaryTypes = [
    { value: 'brief', label: 'Brief Summary', description: 'Short and concise overview' },
    { value: 'detailed', label: 'Detailed Summary', description: 'Comprehensive analysis' },
    { value: 'bullet_points', label: 'Bullet Points', description: 'Key points in list format' }
  ];

  // API Base URL - adjust this to your backend URL
  const API_BASE_URL = 'http://localhost:8000'; // Update this to your actual API URL

  // Get auth token (implement based on your auth system)
  const getAuthToken = () => {
    // Replace with your actual auth token retrieval
    return localStorage.getItem('token') || 'your-auth-token';
  };

  // Extract text from PDF/Image files
  const extractTextFromFile = async (file, fileType) => {
    if (!file) return;
    
    setExtracting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);

      const endpoint = fileType === 'pdf' ? 'pdf' : 'image';
      const response = await fetch(`${API_BASE_URL}/convert/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Extract the text content and populate the textarea
      if (result.text_content) {
        setTextContent(result.text_content);
        setExtractedText(result.text_content);
      } else {
        setError('No text content found in the file');
      }

    } catch (err) {
      console.error('Text extraction error:', err);
      setError(`Text extraction failed: ${err.message}`);
    } finally {
      setExtracting(false);
    }
  };

  // File handling with text extraction
  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setError('');
    setTextContent(''); // Clear existing text
    setExtractedText('');
    setConversionResult(null);
    setSummaryResult(null);
    
    // Automatically extract text when file is uploaded
    await extractTextFromFile(selectedFile, inputType);
  };

  // Convert text to audio (direct mode)
  const convertTextToAudio = async (text) => {
    const requestData = {
      text: text,
      language: language
    };
    
    const response = await fetch(`${API_BASE_URL}/convert/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  // Summarize and convert to audio (summary mode)
  const summarizeAndConvertToAudio = async (text) => {
    const requestData = {
      text: text,
      language: language,
      summary_type: summaryType
    };
    
    const response = await fetch(`${API_BASE_URL}/summarize/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  // Process workflow
  const handleProcess = async () => {
    if (!textContent.trim()) {
      setError('Please enter text or upload a file to extract text');
      return;
    }

    setError('');
    setProcessing(true);
    setConversionResult(null);
    setSummaryResult(null);
    setAudioUrl('');

    try {
      let result;
      
      if (activeMode === 'direct') {
        // Direct text to audio conversion
        result = await convertTextToAudio(textContent);
        setConversionResult(result);
        
        // Set audio URL for streaming
        if (result.id) {
          setAudioUrl(`${API_BASE_URL}/convert/${result.id}/stream`);
        }
        
      } else {
        // Summarization then audio conversion
        result = await summarizeAndConvertToAudio(textContent);
        setSummaryResult(result);
        
        // Set audio URL from summarization response
        if (result.audio_url) {
          setAudioUrl(result.audio_url);
        }
      }
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(`Processing failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // Audio controls
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setAudioProgress(0);
    }
  };

  const handleDownload = () => {
    const result = activeMode === 'direct' ? conversionResult : summaryResult;
    if (!result) return;

    let downloadUrl = '';
    if (activeMode === 'direct' && result.id) {
      downloadUrl = `${API_BASE_URL}/convert/${result.id}/download`;
    } else if (activeMode === 'summary' && result.audio_url) {
      downloadUrl = result.audio_url;
    }
    
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `audio-${Date.now()}.${activeMode === 'direct' ? 'wav' : 'mp3'}`;
      if (activeMode === 'direct') {
        // Add auth header for protected downloads
        fetch(downloadUrl, {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        })
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Download failed:', error);
          setError('Download failed. Please try again.');
        });
      } else {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const resetAll = () => {
    setTextContent('');
    setFile(null);
    setExtractedText('');
    setConversionResult(null);
    setSummaryResult(null);
    setError('');
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update audio source when URL changes
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-4">
            AI Document Processor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Extract text from documents, generate AI summaries, and convert to high-quality audio
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Processing Mode</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setActiveMode('direct')}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                activeMode === 'direct'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-4 mx-auto">
                <FileAudio className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Direct to Audio</h3>
              <p className="text-gray-600">Convert your text directly to speech audio</p>
            </button>
            
            <button
              onClick={() => setActiveMode('summary')}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                activeMode === 'summary'
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mb-4 mx-auto">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Summarize + Audio</h3>
              <p className="text-gray-600">Generate AI summary first, then convert to audio</p>
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          
          {/* Input Type Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Input Method</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'text', icon: Type, label: 'Text Input', desc: 'Type or paste text' },
                { id: 'pdf', icon: FileText, label: 'PDF Upload', desc: 'Extract from PDF' },
                { id: 'image', icon: Image, label: 'Image Upload', desc: 'Extract from image' }
              ].map(({ id, icon: Icon, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setInputType(id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    inputType === id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium text-gray-800">{label}</div>
                  <div className="text-xs text-gray-600">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          {inputType !== 'text' && (
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Upload {inputType.toUpperCase()} File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={inputType === 'pdf' ? '.pdf' : 'image/*'}
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {extracting ? (
                    <>
                      <Loader2 className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-spin" />
                      <div className="text-lg font-medium text-blue-600 mb-2">
                        Extracting text from {inputType.toUpperCase()}...
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="text-lg font-medium text-gray-900 mb-2">
                        {file ? file.name : `Click to upload ${inputType.toUpperCase()}`}
                      </div>
                    </>
                  )}
                  <p className="text-sm text-gray-500">
                    {inputType === 'pdf' ? 'PDF files up to 10MB' : 'Images: JPG, PNG, etc.'}
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* Text Content - Always shown */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-medium text-gray-700">
                Text Content {extractedText && '(Extracted from file)'}
              </label>
              {extractedText && (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Text extracted successfully
                </div>
              )}
            </div>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Type or paste your text here, or upload a file to extract text..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
            <div className="text-sm text-gray-500 mt-2">{textContent.length} characters</div>
          </div>

          {/* Configuration */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            {/* Summary Type Selection - only for summary mode */}
            {activeMode === 'summary' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Summary Type</label>
                <select
                  value={summaryType}
                  onChange={(e) => setSummaryType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {summaryTypes.map((type) => (
                    <option key={type.value} value={type.value} title={type.description}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {summaryTypes.find(t => t.value === summaryType)?.description}
                </p>
              </div>
            )}
          </div>

          {/* Process Button */}
          <div className="flex gap-4">
            <button
              onClick={handleProcess}
              disabled={processing || !textContent.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {processing && <Loader2 className="animate-spin" size={20} />}
              {processing ? 'Processing...' :
               activeMode === 'summary' ? 'Generate AI Summary + Audio' : 'Convert to Audio'}
            </button>
            
            <button
              onClick={resetAll}
              className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Summary Results */}
        {summaryResult && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-green-800">AI Summary Generated</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Content Stats</h3>
                <p><strong>Original:</strong> {summaryResult.original_content?.length || textContent.length} characters</p>
                <p><strong>Summary:</strong> {summaryResult.summary_content?.length || 'N/A'} characters</p>
                <p><strong>Type:</strong> {summaryResult.summary_type || summaryType}</p>
                <p><strong>Language:</strong> {summaryResult.language || language}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Processing Info</h3>
                <p><strong>Status:</strong> <span className="text-green-600">Completed</span></p>
                <p><strong>Audio Duration:</strong> {summaryResult.duration ? `${summaryResult.duration}s` : 'N/A'}</p>
                <p><strong>File Size:</strong> {summaryResult.file_size ? `${(summaryResult.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Generated Summary</h3>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {summaryResult.summary_content || 'Summary not available'}
              </div>
            </div>
          </div>
        )}

        {/* Direct Conversion Results */}
        {conversionResult && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-green-800">Audio Generated Successfully</h2>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Conversion Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p><strong>File Name:</strong> {conversionResult.file_name || 'N/A'}</p>
                <p><strong>Language:</strong> {conversionResult.language || language}</p>
                <p><strong>Status:</strong> <span className="text-green-600">{conversionResult.status || 'Completed'}</span></p>
                <p><strong>Created:</strong> {conversionResult.created_at ? new Date(conversionResult.created_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player - shown for both modes */}
        {(conversionResult || summaryResult) && audioUrl && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Volume2 className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-blue-800">Audio Player</h2>
            </div>

            <audio
              ref={audioRef}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                  setAudioProgress(progress || 0);
                }
              }}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setAudioDuration(audioRef.current.duration);
                }
              }}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                console.error('Audio error:', e);
                setError('Failed to load audio file');
              }}
              preload="metadata"
            />

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  
                  <button
                    onClick={handleStop}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Square size={16} />
                  </button>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Volume2 size={16} />
                    <span className="text-sm font-medium">
                      {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(audioDuration)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>AI-powered document processing • Secure & fast • High-quality results</p>
          <p className="mt-1">Make sure your backend API is running at {API_BASE_URL}</p>
        </div>

      </div>
    </div>
  );
};

export default EnhancedConversionForm;