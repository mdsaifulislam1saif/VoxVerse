import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertTextToAudio, downloadAudio, createAuthenticatedAudioSrc } from '../../services/conversionService';
import { 
  FaFileAlt, 
  FaPlay, 
  FaLanguage,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMagic,
  FaDownload,
  FaPause,
  FaVolumeUp,
  FaStop
} from 'react-icons/fa';
import App from './ConversionForm';

const ConversionFoorm = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversionComplete, setConversionComplete] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionStep, setConversionStep] = useState('');
  
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'de', label: 'German', flag: '🇩🇪' },
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'it', label: 'Italian', flag: '🇮🇹' },
    { value: 'bn', label: 'Bengali', flag: '🇧🇩' }
    // Add other languages if needed
  ];

  useEffect(() => {
    if (audioData?.id && audioRef.current) {
      const loadAudio = async () => {
        try {
          const authenticatedSrc = await createAuthenticatedAudioSrc(audioData.id);
          if (authenticatedSrc && audioRef.current) {
            audioRef.current.src = authenticatedSrc;
          }
        } catch (error) {
          console.error('Failed to load audio:', error);
          setError('Failed to load audio file');
        }
      };
      loadAudio();
    }
  }, [audioData]);

  const validateForm = () => {
    if (!text.trim()) {
      setError('Please enter some text to convert');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    setConversionProgress(0);
    setConversionStep('Preparing conversion...');

    try {
      const progressSteps = [
        { step: 'Processing text...', progress: 30 },
        { step: 'Generating audio...', progress: 70 },
        { step: 'Finalizing conversion...', progress: 95 }
      ];

      let currentStep = 0;
      const progressInterval = setInterval(() => {
        if (currentStep < progressSteps.length) {
          setConversionStep(progressSteps[currentStep].step);
          setConversionProgress(progressSteps[currentStep].progress);
          currentStep++;
        }
      }, 800);

      setConversionStep('Converting text to speech...');
      const result = await convertTextToAudio(text, language);

      clearInterval(progressInterval);
      setConversionProgress(100);
      setConversionStep('Conversion complete!');

      setTimeout(() => {
        setAudioData(result);
        setConversionComplete(true);
      }, 500);
      
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Conversion failed. Please try again.');
      setConversionProgress(0);
      setConversionStep('');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Audio play error:', error);
          setError('Unable to play audio. Please try downloading instead.');
        }
      }
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setAudioDuration(audioRef.current.duration);
  };

  const handleDownload = () => {
    if (audioData?.id) downloadAudio(audioData.id);
  };

  const resetForm = () => {
    setConversionComplete(false);
    setAudioData(null);
    setText('');
    setError('');
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioDuration(0);
    setConversionProgress(0);
    setConversionStep('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
            <FaMagic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Text-to-Speech Converter
          </h1>
          <p className="text-gray-600 text-lg">Transform your text into high-quality speech with AI</p>
        </div>

        {/* Progress Modal */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
              <div className="text-center space-y-6">
                {/* Progress Icon */}
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <FaSpinner className="w-10 h-10 text-white animate-spin" />
                </div>

                {/* Progress Title */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Converting Your Content</h3>
                  <p className="text-gray-600">Please wait while we process your</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${conversionProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{conversionStep}</span>
                    <span className="text-gray-800 font-semibold">{conversionProgress}%</span>
                  </div>
                </div>

                {/* Progress Steps Indicator */}
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        conversionProgress >= step * 20
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {conversionComplete && audioData && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Conversion Complete!</h3>
                  <p className="text-gray-600">Your audio is ready to play and download</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                preload="metadata"
              />

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button onClick={handlePlayPause} className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl">
                      {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6 ml-1" />}
                    </button>
                    <button onClick={handleStop} className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                      <FaStop className="w-4 h-4" />
                    </button>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaVolumeUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatTime(audioRef.current?.currentTime || 0)} / {formatTime(audioDuration)}</span>
                    </div>
                  </div>
                  <button onClick={handleDownload} className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md">
                    <FaDownload className="w-4 h-4" />
                    <span>Download WAV</span>
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all" style={{ width: `${audioProgress}%` }}></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={resetForm} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold border border-gray-300">
                  Convert Another
                </button>
                <button onClick={() => navigate('/conversions')} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg">
                  View All Conversions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        {!conversionComplete && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaFileAlt className="mr-2 text-green-500" />
                  Enter Your Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-40 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter text to convert..."
                  required
                />
                <div className="text-right text-xs text-gray-500">{text.length} characters</div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaLanguage className="mr-2 text-amber-500" />
                  Select Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center space-x-3 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg'
                  }`}
                >
                  {loading ? <><FaSpinner className="w-5 h-5 animate-spin" /><span>Converting...</span></> : <><FaPlay className="w-5 h-5" /><span>Convert to Audio</span></>}
                </button>
              </div>
            </form>
          </div>
        )}
        <App />
      </div>
    </div>
  );
};

export default ConversionFoorm;
