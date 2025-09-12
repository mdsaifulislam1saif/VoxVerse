import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Image, 
  Play, 
  Pause, 
  Download, 
  Loader2, 
  Volume2,
  User,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';

// API Base URL - adjust this to your backend URL
const API_BASE = 'http://localhost:8000';

// Custom hooks
const useAuth = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token')
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        setAuth({
          isAuthenticated: true,
          user,
          token
        });
      } else {
        localStorage.removeItem('token');
        setAuth({
          isAuthenticated: false,
          user: null,
          token: null
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('token');
      setAuth({
        isAuthenticated: false,
        user: null,
        token: null
      });
    }
  };

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE}/auth/token`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        await fetchUserProfile(data.access_token);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (email, username, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  return { auth, login, register, logout };
};

// Components
const LoginForm = ({ onLogin, onToggle }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await onLogin(formData.username, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onToggle}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterForm = ({ onRegister, onToggle }) => {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const result = await onRegister(formData.email, formData.username, formData.password);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => onToggle(), 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600">Your account has been created. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join us to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onToggle}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const FileUpload = ({ onExtractText, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.pdf')) {
      onExtractText(file, 'pdf');
    } else if (fileName.match(/\.(jpg|jpeg|png|bmp|tiff|webp)$/)) {
      onExtractText(file, 'image');
    } else {
      alert('Please upload a PDF or image file (jpg, jpeg, png, bmp, tiff, webp)');
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${loading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff,.webp"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Drop files here or click to upload
        </h3>
        <p className="text-gray-600 mb-4">
          Support for PDF and image files (JPG, PNG, BMP, TIFF, WebP)
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Processing...' : 'Upload PDF'}
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Image className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Processing...' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TextProcessor = ({ 
  text, 
  onTextChange, 
  onGenerateAudio, 
  onGenerateSummary, 
  loading, 
  summary 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Extracted/Input Text
        </label>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Upload a file above or type/paste your text here..."
          className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
        />
      </div>

      {text.trim() && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onGenerateAudio(text)}
            disabled={loading.audio}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading.audio ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Volume2 className="w-5 h-5 mr-2" />
            )}
            {loading.audio ? 'Generating Audio...' : 'Convert to Audio'}
          </button>

          <button
            onClick={() => onGenerateSummary(text)}
            disabled={loading.summary}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading.summary ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <FileText className="w-5 h-5 mr-2" />
            )}
            {loading.summary ? 'Generating Summary...' : 'Generate Summary'}
          </button>
        </div>
      )}

      {summary && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Generated Summary</h3>
          <p className="text-purple-800 mb-4 whitespace-pre-wrap">{summary}</p>
          <button
            onClick={() => onGenerateAudio(summary)}
            disabled={loading.audio}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading.audio ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Volume2 className="w-4 h-4 mr-2" />
            )}
            {loading.audio ? 'Generating Audio...' : 'Convert Summary to Audio'}
          </button>
        </div>
      )}
    </div>
  );
};

const AudioPlayer = ({ conversion, token }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [conversion]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!conversion) return;
    
    const link = document.createElement('a');
    link.href = `${API_BASE}/conversions/${conversion.id}/download?token=${token}`;
    link.download = `${conversion.file_name}_${conversion.id}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!conversion) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
      <h3 className="font-semibold text-indigo-900 mb-4 flex items-center">
        <Volume2 className="w-5 h-5 mr-2" />
        Audio Generated Successfully
      </h3>
      
      <audio
        ref={audioRef}
        src={`${API_BASE}/conversions/${conversion.id}/stream`}
        className="hidden"
      />

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p><strong>Source:</strong> {conversion.source_type === 'text' ? 'Manual Input' : conversion.file_name}</p>
        <p><strong>Language:</strong> {conversion.language}</p>
        <p><strong>Created:</strong> {new Date(conversion.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

const Header = ({ user, onLogout }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Volume2 className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Text to Speech</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">{user.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { auth, login, register, logout } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [currentConversion, setCurrentConversion] = useState(null);
  const [loading, setLoading] = useState({
    extract: false,
    audio: false,
    summary: false
  });

  const extractText = async (file, type) => {
    setLoading(prev => ({ ...prev, extract: true }));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', 'en');

      const endpoint = type === 'pdf' ? '/extract/pdf' : '/extract/image';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setText(data.text);
        // Clear previous summary and conversion when new text is extracted
        setSummary('');
        setCurrentConversion(null);
      } else {
        const error = await response.json();
        alert(`Failed to extract text: ${error.detail}`);
      }
    } catch (error) {
      alert('Network error while extracting text');
    } finally {
      setLoading(prev => ({ ...prev, extract: false }));
    }
  };

  const generateSummary = async (inputText) => {
    setLoading(prev => ({ ...prev, summary: true }));
    
    try {
      const response = await fetch(`${API_BASE}/summarization/summary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: inputText,
          language: 'en',
          summary_type: 'detailed'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary_content);
      } else {
        const error = await response.json();
        alert(`Failed to generate summary: ${error.detail}`);
      }
    } catch (error) {
      alert('Network error while generating summary');
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const generateAudio = async (inputText) => {
    setLoading(prev => ({ ...prev, audio: true }));
    
    try {
      const response = await fetch(`${API_BASE}/conversions/text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: inputText,
          language: 'en'
        })
      });

      if (response.ok) {
        const conversion = await response.json();
        setCurrentConversion(conversion);
      } else {
        const error = await response.json();
        alert(`Failed to generate audio: ${error.detail}`);
      }
    } catch (error) {
      alert('Network error while generating audio');
    } finally {
      setLoading(prev => ({ ...prev, audio: false }));
    }
  };

  const handleTextChange = (newText) => {
    setText(newText);
    // Clear summary and conversion when text changes
    setSummary('');
    setCurrentConversion(null);
  };

  if (!auth.isAuthenticated) {
    return isLoginMode ? (
      <LoginForm 
        onLogin={login} 
        onToggle={() => setIsLoginMode(false)} 
      />
    ) : (
      <RegisterForm 
        onRegister={register} 
        onToggle={() => setIsLoginMode(true)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={auth.user} onLogout={logout} />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
            <FileUpload 
              onExtractText={extractText} 
              loading={loading.extract} 
            />
          </div>

          {/* Text Processing Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Text Processing</h2>
            <TextProcessor 
              text={text}
              onTextChange={handleTextChange}
              onGenerateAudio={generateAudio}
              onGenerateSummary={generateSummary}
              loading={loading}
              summary={summary}
            />
          </div>

          {/* Audio Player Section */}
          {currentConversion && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Audio Player</h2>
              <AudioPlayer 
                conversion={currentConversion} 
                token={auth.token} 
              />
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">📄 Document Processing</h4>
                <ul className="space-y-1">
                  <li>• Upload PDF or image files</li>
                  <li>• Text will be automatically extracted</li>
                  <li>• Edit extracted text if needed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔊 Audio Generation</h4>
                <ul className="space-y-1">
                  <li>• Convert text directly to audio</li>
                  <li>• Generate summary then convert to audio</li>
                  <li>• Play, pause, and download audio files</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;