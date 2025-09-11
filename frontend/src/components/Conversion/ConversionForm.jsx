import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  extractTextFromPdf, 
  extractTextFromImage, 
  convertTextToAudio, 
  downloadAudio 
} from '../../services/conversionService';
import { 
  FaFileAlt, 
  FaFilePdf, 
  FaImage, 
  FaPlay, 
  FaUpload, 
  FaLanguage,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMagic,
  FaDownload,
  FaPause,
  FaVolumeUp,
  FaStop,
  FaEdit,
  FaEye
} from 'react-icons/fa';
import { useEffect } from 'react';
import { createAuthenticatedAudioSrc } from '../../services/conversionService';
import SummerizeFrom from './SummerizeFrom';
import { languageOptions } from '../../services/config';
import EnhancedConversionForm from './EnhancedConversionForm';


const ConversionForm = () => {
  const [conversionType, setConversionType] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionStep, setConversionStep] = useState('');
  
  // New states for text extraction
  const [extracting, setExtracting] = useState(false);
  const [textExtracted, setTextExtracted] = useState(false);
  const [extractedFrom, setExtractedFrom] = useState(''); // 'pdf' or 'image'
  
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Conversion type configuration
  const conversionTypes = [
    {
      id: 'text',
      label: 'Text to Speech',
      description: 'Convert written text to audio',
      icon: FaFileAlt,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'pdf',
      label: 'PDF to Speech',
      description: 'Extract text from PDF and convert',
      icon: FaFilePdf,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'image',
      label: 'Image to Speech',
      description: 'Extract text from images and convert',
      icon: FaImage,
      color: 'from-green-500 to-emerald-500'
    }
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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      
      // Auto-extract text when file is selected
      await handleTextExtraction(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError('');
      
      // Auto-extract text when file is dropped
      await handleTextExtraction(droppedFile);
    }
  };

  const handleTextExtraction = async (fileToExtract) => {
    if (!fileToExtract) return;

    setExtracting(true);
    setError('');
    
    try {
      let extractedText = '';
      
      if (conversionType === 'pdf') {
        extractedText = await extractTextFromPdf(fileToExtract, language);
        setExtractedFrom('pdf');
      } else if (conversionType === 'image') {
        extractedText = await extractTextFromImage(fileToExtract, language);
        setExtractedFrom('image');
      }
      
      setText(extractedText);
      setTextExtracted(true);
      
    } catch (err) {
      setError(
        err?.response?.data?.detail || 
        err.message || 
        `Failed to extract text from ${conversionType}. Please try again.`
      );
    } finally {
      setExtracting(false);
    }
  };

  const validateForm = () => {
    if (!text.trim()) {
      setError('Please enter some text to convert or upload a file to extract text');
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
      // Simulate progress steps
      const progressSteps = [
        { step: 'Analyzing text...', progress: 25 },
        { step: 'Processing audio synthesis...', progress: 50 },
        { step: 'Generating high-quality audio...', progress: 75 },
        { step: 'Finalizing conversion...', progress: 95 }
      ];

      // Start progress simulation
      let currentStep = 0;
      const progressInterval = setInterval(() => {
        if (currentStep < progressSteps.length) {
          setConversionStep(progressSteps[currentStep].step);
          setConversionProgress(progressSteps[currentStep].progress);
          currentStep++;
        }
      }, 800);

      // Convert text to audio
      const result = await convertTextToAudio(text, language);

      clearInterval(progressInterval);
      setConversionProgress(100);
      setConversionStep('Conversion complete!');

      // Wait a moment before showing results
      setTimeout(() => {
        setAudioData(result);
        setConversionComplete(true);
      }, 500);
      
    } catch (err) {
      setError(
        err?.response?.data?.detail || 
        err.message || 
        'Conversion failed. Please check your input and try again.'
      );
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
    } else {
      console.error('Audio ref is null');
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
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleDownload = () => {
    if (audioData?.id) {
      downloadAudio(audioData.id);
    } else if (audioData?.audioUrl) {
      const link = document.createElement('a');
      link.href = audioData.audioUrl;
      link.download = `converted-audio-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetForm = () => {
    setConversionComplete(false);
    setAudioData(null);
    setText('');
    setFile(null);
    setError('');
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioDuration(0);
    setConversionProgress(0);
    setConversionStep('');
    setTextExtracted(false);
    setExtractedFrom('');
  };

  const handleConversionTypeChange = (newType) => {
    setConversionType(newType);
    // Reset states when changing conversion type
    setFile(null);
    setTextExtracted(false);
    setExtractedFrom('');
    setError('');
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
            <FaMagic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Audio Converter
          </h1>
          <p className="text-gray-600 text-lg">
            Transform your content into high-quality speech with advanced AI
          </p>
        </div>

        {/* Text Extraction Progress Modal */}
        {extracting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <FaSpinner className="w-10 h-10 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Extracting Text</h3>
                  <p className="text-gray-600">Reading content from your {extractedFrom || conversionType}...</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaEye className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-green-800 font-medium">OCR Processing</p>
                      <p className="text-xs text-green-600 mt-1">
                        Using advanced AI to accurately extract text from your {conversionType}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversion Progress Modal */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <FaSpinner className="w-10 h-10 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Converting to Audio</h3>
                  <p className="text-gray-600">Please wait while we generate your audio</p>
                </div>
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
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        conversionProgress >= step * 25
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

        {/* Success/Complete State */}
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
                src={`${'http://localhost:8000'}/convert/${audioData?.id}/download`}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                preload="metadata"
              />

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      {isPlaying ? (
                        <FaPause className="w-6 h-6" />
                      ) : (
                        <FaPlay className="w-6 h-6 ml-1" />
                      )}
                    </button>
                    
                    <button
                      onClick={handleStop}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-all duration-200"
                    >
                      <FaStop className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaVolumeUp className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(audioDuration)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>Download WAV</span>
                  </button>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 border border-gray-300"
                >
                  Convert Another
                </button>
                <button
                  onClick={() => navigate('/conversions')}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View All Conversions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Container */}
        {!conversionComplete && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            
            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              
              {/* Conversion Type Selection */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaPlay className="mr-2 text-blue-500" />
                  Choose Conversion Type
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {conversionTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = conversionType === type.id;
                    
                    return (
                      <div
                        key={type.id}
                        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                        }`}
                        onClick={() => handleConversionTypeChange(type.id)}
                      >
                        <input
                          type="radio"
                          name="conversionType"
                          value={type.id}
                          checked={isSelected}
                          onChange={() => handleConversionTypeChange(type.id)}
                          className="sr-only"
                        />
                        
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="text-gray-800 font-semibold mb-2">{type.label}</h3>
                        <p className="text-gray-600 text-sm">{type.description}</p>
                        
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <FaCheckCircle className="w-5 h-5 text-blue-500" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* File Upload Section (for PDF/Image) */}
              {(conversionType === 'pdf' || conversionType === 'image') && (
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaUpload className="mr-2 text-purple-500" />
                    Upload {conversionType === 'pdf' ? 'PDF' : 'Image'} File
                  </label>
                  
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept={conversionType === 'pdf' ? '.pdf' : 'image/*'}
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {file ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <FaCheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">{file.name}</p>
                          <p className="text-gray-600 text-sm">{getFileSize(file.size)}</p>
                          {textExtracted && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaCheckCircle className="w-3 h-3 mr-1" />
                                Text extracted successfully
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                          <FaUpload className="w-8 h-8 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">
                            Drop your {conversionType} file here or click to browse
                          </p>
                          <p className="text-gray-600 text-sm">
                            {conversionType === 'pdf' ? 'PDF files up to 10MB' : 'PNG, JPG, JPEG up to 5MB'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Input/Display Section */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaEdit className="mr-2 text-green-500" />
                  {textExtracted ? `Text Extracted from ${extractedFrom.toUpperCase()}` : 'Enter Your Text'}
                  {textExtracted && (
                    <span className="ml-2 text-sm font-normal text-gray-600">(You can edit this text)</span>
                  )}
                </label>
                
                {textExtracted && (
                  <div className="mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FaEye className="w-3 h-3 mr-1" />
                      Extracted from {extractedFrom}
                    </span>
                  </div>
                )}
                
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                    placeholder={
                      conversionType === 'text' 
                        ? "Enter the text you want to convert to audio. You can paste articles, documents, or any text content here..."
                        : textExtracted
                          ? "The extracted text appears here. You can edit it before converting to audio."
                          : `Upload a ${conversionType} file to extract text, or type/paste text manually here...`
                    }
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {text.length} characters
                  </div>
                </div>

                {textExtracted && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-green-800 font-medium">Text Successfully Extracted</p>
                        <p className="text-xs text-green-600 mt-1">
                          Review and edit the extracted text above, then click "Convert to Audio" to generate speech.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Language Selection */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaLanguage className="mr-2 text-amber-500" />
                  Select Language
                </label>
                
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.value} value={lang.value} className="bg-white">
                        {lang.flag} {lang.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || extracting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-3 ${
                    loading || extracting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="w-5 h-5 animate-spin" />
                      <span>Converting to Audio...</span>
                    </>
                  ) : extracting ? (
                    <>
                      <FaSpinner className="w-5 h-5 animate-spin" />
                      <span>Extracting Text...</span>
                    </>
                  ) : (
                    <>
                      <FaPlay className="w-5 h-5" />
                      <span>Convert to Audio</span>
                    </>
                  )}
                </button>
              </div>

              {/* Workflow Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-gray-800 font-semibold mb-3 flex items-center">
                  <FaMagic className="mr-2 text-blue-500" />
                  How It Works
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium text-gray-800">Upload or Type</p>
                      <p className="text-gray-600">Upload PDF/image or type text directly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium text-gray-800">Extract & Edit</p>
                      <p className="text-gray-600">Text is extracted and can be edited</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium text-gray-800">Convert & Play</p>
                      <p className="text-gray-600">Generate audio and play/download</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
        
        <div>
          <EnhancedConversionForm />
          <SummerizeFrom/>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by advanced AI • Secure processing • High-quality output</p>
        </div>
      </div>
    </div>
  );
};

export default ConversionForm;