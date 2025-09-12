import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, Download, FileText, Image, Mic, User, LogOut, Eye, EyeOff, Loader2 } from 'lucide-react';
import ConversionList from './ConversionList';

const API_BASE = 'http://localhost:8000'; // Adjust this to your API base URL

const ConversionForm = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(!token);
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('convert'); 
  const audioRef = useRef(null);

  // Auth states
  const [authMode, setAuthMode] = useState('login'); 
  const [authData, setAuthData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSummaryType, setSelectedSummaryType] = useState('brief');

  const languages = [ 
      { code : 'en', name: 'English', flag: '🇺🇸' },
      { code : 'fr', name: 'French', flag: '🇫🇷' },
      { code : 'de', name: 'German', flag: '🇩🇪' },
      { code : 'es', name: 'Spanish', flag: '🇪🇸' },
      { code : 'it', name: 'Italian', flag: '🇮🇹' },
      { code : 'nl', name: 'Dutch', flag: '🇳🇱' },
      { code : 'pt', name: 'Portuguese', flag: '🇵🇹' },
      { code : 'pl', name: 'Polish', flag: '🇵🇱' },
      { code : 'tr', name: 'Turkish', flag: '🇹🇷' },
      { code : 'ja', name: 'Japanese', flag: '🇯🇵' },
      { code : 'zh-cn', name: 'Chinese (Simplified)', flag: '🇨🇳' },
      { code : 'bn', name: 'Bengali', flag: '🇧🇩' },
      { code : 'bg', name: 'Bulgarian', flag: '🇧🇬' },
      { code : 'cs', name: 'Czech', flag: '🇨🇿' },
      { code : 'da', name: 'Danish', flag: '🇩🇰' },
      { code : 'et', name: 'Estonian', flag: '🇪🇪' },
      { code : 'ga', name: 'Irish', flag: '🇮🇪' },
      { code : 'el', name: 'Greek', flag: '🇬🇷' },
      { code : 'fi', name: 'Finnish', flag: '🇫🇮' },
      { code : 'hr', name: 'Croatian', flag: '🇭🇷' },
      { code : 'hu', name: 'Hungarian', flag: '🇭🇺' },
      { code : 'lt', name: 'Lithuanian', flag: '🇱🇹' },
      { code : 'lv', name: 'Latvian', flag: '🇱🇻' },
      { code : 'mt', name: 'Maltese', flag: '🇲🇹' },
      { code : 'ro', name: 'Romanian', flag: '🇷🇴' },
      { code : 'sk', name: 'Slovak', flag: '🇸🇰' },
      { code : 'sl', name: 'Slovenian', flag: '🇸🇮' },
      { code : 'sv', name: 'Swedish', flag: '🇸🇪' },
      { code : 'uk', name: 'Ukrainian', flag: '🇺🇦' },
      { code : 'ca', name: 'Catalan', flag: '🇪🇸' },
      { code : 'fa', name: 'Persian (Farsi)', flag: '🇮🇷' },
      { code : 'be', name: 'Belarusian', flag: '🇧🇾' }
  ]; 
  const summaryTypes = [ 
    { value: 'brief', label: 'Brief Summary', description: 'Short and concise overview' }, 
    { value: 'detailed', label: 'Detailed Summary', description: 'Comprehensive analysis' }, 
    { value: 'bullet_points', label: 'Bullet Points', description: 'Key points in list format' } 
  ];
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setShowLogin(false);
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setShowLogin(true);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setShowLogin(true);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    
    try {
      if (authMode === 'register') {
        const registerResponse = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: authData.username,
            email: authData.email,
            password: authData.password,
            full_name: authData.full_name
          })
        });
        
        if (!registerResponse.ok) {
          const error = await registerResponse.json();
          throw new Error(error.detail || 'Registration failed');
        }
      }
      
      const formData = new FormData();
      formData.append('username', authData.username);
      formData.append('password', authData.password);
      
      const loginResponse = await fetch(`${API_BASE}/auth/token`, {
        method: 'POST',
        body: formData
      });
      
      if (loginResponse.ok) {
        const tokenData = await loginResponse.json();
        setToken(tokenData.access_token);
        localStorage.setItem('token', tokenData.access_token);
        setShowLogin(false);
        setAuthData({
          username: '',
          email: '',
          password: '',
          full_name: ''
        });
      } else {
        const error = await loginResponse.json();
        throw new Error(error.detail || 'Login failed');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setShowLogin(true);
    setAudioUrl(null);
    setText('');
    setSummary('');
  };

  const handleFileUpload = async (file, type) => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', selectedLanguage);

    try {
      const endpoint = type === 'pdf' ? '/extract/pdf' : '/extract/image';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setText(data.text);
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to extract text');
      }
    } catch (error) {
      alert('Failed to upload file');
    } finally {
      setUploadLoading(false);
    }
  };

  const convertToAudio = async () => {
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
      const response = await fetch(`${API_BASE}/convert/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
     body: JSON.stringify({
          text: text,
          language: selectedLanguage,
          speed: 1.0,
          format: 'mp3'
        })

      });

      if (response.ok) {
        const data = await response.json();
        const audioResponse = await fetch(`${API_BASE}/convert/${data.id}/stream`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (audioResponse.ok) {
          const audioBlob = await audioResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
        }
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to convert to audio');
      }
    } catch (error) {
      alert('Failed to convert text to audio');
    } finally {
      setLoading(false);
    }
  };

  const convertToSummaryThenAudio = async () => {
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
    const summaryResponse = await fetch(`${API_BASE}/summarize/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        text: text,
        language: selectedLanguage,
        summary_type: selectedSummaryType
      })
    });

    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary_content);

      const audioResponse = await fetch(`${API_BASE}/convert/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: summaryData.summary_content, 
          language: selectedLanguage,
          speed: 1.0,
          format: 'mp3'
        })
      });

      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        const streamResponse = await fetch(`${API_BASE}/convert/${audioData.id}/stream`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (streamResponse.ok) {
          const audioBlob = await streamResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
        }
      }
    } else {
      const error = await summaryResponse.json();
      alert(error.detail || 'Failed to generate summary');
    }
  } catch (error) {
    alert('Failed to process text');
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

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mic className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600">
              {authMode === 'login' ? 'Sign in to convert text to audio' : 'Join us to get started'}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={authData.username}
                onChange={(e) => setAuthData({...authData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your username"
              />
            </div>

            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={authData.email}
                    onChange={(e) => setAuthData({...authData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authData.full_name}
                    onChange={(e) => setAuthData({...authData, full_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition duration-200 font-medium"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : null}
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setAuthData({
                  username: '',
                  email: '',
                  password: '',
                  full_name: ''
                });
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
            >
              {authMode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Text to Audio Converter
              </h1>
            </div>
            {/* <ConversionList /> */}
            <div className="flex items-center space-x-6">
              {user && (
                <div className="flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">{user.full_name || user.username}</span>
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition duration-200"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('convert')}
                className={`flex-1 py-4 px-6 text-center font-medium transition duration-200 ${
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
                className={`flex-1 py-4 px-6 text-center font-medium transition duration-200 ${
                  activeTab === 'summarize'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center">
                  <FileText className="mr-2" size={20} />
                 Text to Summarize
                </div>
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Upload className="mr-3 text-blue-600" size={24} />
                Upload Files
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition duration-200">
                    {uploadLoading ? (
                      <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                    ) : (
                      <>
                        <FileText className="h-8 w-8 text-blue-500 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Upload PDF</span>
                        <span className="text-xs text-gray-500">Click to browse</span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'pdf')}
                    />
                  </label>
                </div>
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-400 transition duration-200">
                    {uploadLoading ? (
                      <Loader2 className="animate-spin h-8 w-8 text-green-500" />
                    ) : (
                      <>
                        <Image className="h-8 w-8 text-green-500 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Upload Image</span>
                        <span className="text-xs text-gray-500">JPG, PNG, WEBP</span>
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
          </div>

          {/* Right Column - Text Processing */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Text Input */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {activeTab === 'convert' ? 'Text to Convert' : 'Text to Summarize'}
                </h2>
                {/* Language & Summary Options */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  {/* Language Selector */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Select Language
    </label>
    <select
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  </div>

  {/* Summary Type Selector (only for summarize tab) */}
  {activeTab === 'summarize' && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Summary Type
      </label>
      <select
        value={selectedSummaryType}
        onChange={(e) => setSelectedSummaryType(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
      >
        {summaryTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label} – {type.description}
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
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200"
                />
              </div>

              {/* Summary Display */}
              {activeTab === 'summarize' && summary && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Generated Summary</h3>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                {activeTab === 'convert' ? (
                  <button
                    onClick={convertToAudio}
                    disabled={loading || !text.trim()}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      <Mic className="mr-2" size={20} />
                    )}
                    Audio
                  </button>
                ) : (
                  <button
                    onClick={convertToSummaryThenAudio}
                    disabled={loading || !text.trim()}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      <FileText className="mr-2" size={20} />
                    )}
                    Summarize
                  </button>
                )}
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <Play className="text-white" size={16} />
                    </div>
                    Audio Player
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <button
                      onClick={togglePlayback}
                      className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-lg"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button
                      onClick={downloadAudio}
                      className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 font-medium"
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
      </main>
    </div>
  );
};

export default ConversionForm;